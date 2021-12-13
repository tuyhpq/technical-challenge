<template>
  <div class="container py-5">
    <section class="text-center">
      <h2 class="p-3 mb-2 bg-secondary text-white">COVID-19 CORONAVIRUS PANDEMIC</h2>
      <Spinner :isLoading="totalReportLoading">
        <p class="text-secondary">Last updated: {{ totalReport.lastUpdate }}</p>
      </Spinner>
      <h2 class="mt-5">Coronavirus Cases:</h2>
      <Spinner :isLoading="totalReportLoading">
        <p class="h3 text-secondary">{{ withCommas(totalReport.cases) }}</p>
      </Spinner>
      <h2 class="mt-5">Deaths:</h2>
      <Spinner :isLoading="totalReportLoading">
        <p class="h3 fw-bold">{{ withCommas(totalReport.deaths) }}</p>
      </Spinner>
      <h2 class="mt-5">Recovered:</h2>
      <Spinner :isLoading="totalReportLoading">
        <p class="h3 text-success">{{ withCommas(totalReport.recovered) }}</p>
      </Spinner>
    </section>
    <section class="text-center mt-5">
      <h2 class="p-3 mb-2 bg-secondary text-white">DAILY NEW CASES &amp; CLOSED CASES</h2>
      <Spinner :isLoading="totalReportRangeLoading" />
      <canvas ref="reportChart" v-show="!totalReportRangeLoading"></canvas>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spinner from "@/components/Spinner.vue";
import { ReportService } from "@/services/ReportService";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import Chart from "chart.js/auto";

// APIs only support until 2021-12-11
const currentDate = new Date(2021, 11, 11);

// Default reports is list of last 7 days
const reportRange = [0, 1, 2, 3, 4, 5, 6];

export default defineComponent({
  components: {
    Spinner,
  },
  data() {
    return {
      totalReport: {
        cases: 0,
        deaths: 0,
        recovered: 0,
        lastUpdate: "",
      },
      totalReportLoading: false,
      totalReportRangeLoading: false,
    };
  },
  async created() {
    this.totalReportLoading = true;
    const result = await ReportService.getTotalReport();
    this.totalReportLoading = false;

    pipe(
      result,
      fold(
        (error) => alert(error.message),
        (result) => {
          this.totalReport.cases = result.confirmed;
          this.totalReport.deaths = result.deaths;
          this.totalReport.recovered = result.active;
          this.totalReport.lastUpdate = result.lastUpdate;
        }
      )
    );
  },
  async mounted() {
    this.totalReportRangeLoading = true;
    const result = await ReportService.getTotalReportRange(
      reportRange.map(
        (i) =>
          new Date(new Date(currentDate).setMonth(currentDate.getMonth() - i))
      )
    );
    this.totalReportRangeLoading = false;

    pipe(
      result,
      fold(
        (error) => alert(error.message),
        (result) => {
          new Chart(this.$refs["reportChart"] as HTMLCanvasElement, {
            type: "scatter",
            data: {
              labels: result.map((report) => report.date),
              datasets: [
                {
                  type: "bar",
                  label: "Daily Closed Cases",
                  data: result.map((report) => report.activeDiff),
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                },
                {
                  type: "line",
                  label: "Daily New Cases",
                  data: result.map((report) => report.confirmedDiff),
                  fill: false,
                  borderColor: "rgb(54, 162, 235)",
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      )
    );
  },
  methods: {
    withCommas(input: number | string) {
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
});
</script>
