<template>
  <div class="container py-5">
    <section class="text-center">
      <h2 class="p-3 mb-2 bg-secondary text-white">COVID-19 CORONAVIRUS PANDEMIC</h2>
      <p class="text-secondary">Last updated: {{ totalReport.lastUpdate }}</p>
      <h2 class="mt-5">Coronavirus Cases:</h2>
      <p class="h3 text-secondary">{{ withCommas(totalReport.cases) }}</p>
      <h2 class="mt-5">Deaths:</h2>
      <p class="h3 fw-bold">{{ withCommas(totalReport.deaths) }}</p>
      <h2 class="mt-5">Recovered:</h2>
      <p class="h3 text-success">{{ withCommas(totalReport.recovered) }}</p>
    </section>
    <section>

    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ReportService } from "@/services/ReportService";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

export default defineComponent({
  data() {
    return {
      totalReport: {
        cases: 0,
        deaths: 0,
        recovered: 0,
        lastUpdate: "",
      },
      totalReportLoading: false,
    };
  },
  async created() {
    const result = await ReportService.getTotalReport();
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
  methods: {
    withCommas(input: number | string) {
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
});
</script>
