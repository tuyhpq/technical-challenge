<template>
  <div class="container py-5">
    <section class="text-center">
      <h2 class="p-3 mb-3 bg-secondary text-white">COVID-19 CORONAVIRUS PANDEMIC</h2>
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
      <h2 class="p-3 mb-3 bg-secondary text-white">DAILY NEW CASES &amp; CLOSED CASES</h2>
      <Spinner :isLoading="totalReportRangeLoading" />
      <canvas ref="reportChart" v-show="!totalReportRangeLoading"></canvas>
    </section>
    <section class="text-left mt-5">
      <h2 class="p-3 mb-3 bg-secondary text-white">REPORTED CASES AND DEATHS BY COUNTRY</h2>
      <form class="row g-3" @submit.prevent="search">
        <div class="col-12">
          <label for="keywords" class="form-label">Keywords:</label>
          <input type="text" class="form-control" v-model="formSearch.keywords">
        </div>
        <div class="col-md-6">
          <label class="form-label d-block">Select a region:</label>
          <Spinner :isLoading="regionListLoading" />
          <select class="form-select" v-model="formSearch.region" v-show="!regionListLoading" @change="loadProvinceList">
            <option :value="null">All</option>
            <option v-for="region in regionList" :key="region.value" :value="region">{{ region.name }}</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label d-block">Select a province:</label>
          <Spinner :isLoading="regionListLoading || provinceListLoading" />
          <select class="form-select" v-model="formSearch.province" v-show="!regionListLoading && !provinceListLoading">
            <option :value="null">All</option>
            <option v-for="province in provinceList" :key="province.value" :value="province">{{ `[${province.name}] ${province.value}` }}</option>
          </select>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">Search</button>
        </div>
      </form>
      <div class="table-responsive mt-3">
        <table class="table table-nowrap">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Country</th>
              <th scope="col">Total Cases</th>
              <th scope="col">New Cases</th>
              <th scope="col">Total Deaths</th>
              <th scope="col">New Deaths</th>
              <th scope="col">Total Recovered</th>
              <th scope="col">New Recovered</th>
              <th scope="col">Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="formSearchResultLoading">
              <td colspan="9" class="p-2">
                <Spinner :isLoading="formSearchResultLoading" />
              </td>
            </tr>
            <tr v-if="!formSearchResultLoading && formSearchResult.length === 0">
              <td colspan="9" class="p-2">
                Please select the options and press the Search button to search.
              </td>
            </tr>
            <tr v-for="(report, index) in formSearchResult" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ report.country }}</td>
              <td>{{ report.totalCases }}</td>
              <td>{{ report.newCases }}</td>
              <td>{{ report.totalDeaths }}</td>
              <td>{{ report.newDeaths }}</td>
              <td>{{ report.totalRecovered }}</td>
              <td>{{ report.newRecovered }}</td>
              <td>{{ report.lastUpdate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spinner from "@/components/Spinner.vue";
import { ReportService } from "@/services/ReportService";
import { RegionService } from "@/services/RegionService";
import { ProvinceService } from "@/services/ProvinceService";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import Chart from "chart.js/auto";

// APIs only support until 2021-12-11
const currentDate = new Date(2021, 11, 11);

// Default reports is list of last 7 days
const reportRange = [6, 5, 4, 3, 2, 1, 0];

interface SelectOption {
  name: string;
  value: string;
}

export default defineComponent({
  components: {
    Spinner,
  },
  data(): {
    totalReport: {
      cases: number;
      deaths: number;
      recovered: number;
      lastUpdate: string;
    };
    totalReportLoading: boolean;
    totalReportRangeLoading: boolean;

    regionList: SelectOption[];
    regionListLoading: boolean;
    provinceList: SelectOption[];
    provinceListLoading: boolean;

    formSearch: {
      keywords: string;
      region: SelectOption | null;
      province: SelectOption | null;
    };
    formSearchResult: {
      country: string;
      totalCases: string;
      newCases: string;
      totalDeaths: string;
      newDeaths: string;
      totalRecovered: string;
      newRecovered: string;
      lastUpdate: string;
    }[];
    formSearchResultLoading: boolean;
  } {
    return {
      totalReport: {
        cases: 0,
        deaths: 0,
        recovered: 0,
        lastUpdate: "",
      },
      totalReportLoading: false,
      totalReportRangeLoading: false,

      regionList: [],
      regionListLoading: false,
      provinceList: [],
      provinceListLoading: false,

      formSearch: {
        keywords: "",
        region: null,
        province: null,
      },
      formSearchResult: [],
      formSearchResultLoading: false,
    };
  },
  created() {
    this.initTotalReport();
    this.initRegionList();
  },
  mounted() {
    this.initTotalReportRange();
  },
  methods: {
    async initTotalReport() {
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
    async initTotalReportRange() {
      this.totalReportRangeLoading = true;
      const result = await ReportService.getTotalReportRange(
        reportRange.map(
          (i) =>
            new Date(new Date(currentDate).setDate(currentDate.getDate() - i))
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
                    type: "line",
                    label: "Daily New Cases",
                    data: result.map((report) => report.confirmedDiff),
                    fill: false,
                    borderColor: "rgb(54, 162, 235)",
                  },
                  {
                    type: "bar",
                    label: "Daily Closed Cases",
                    data: result.map((report) => report.activeDiff),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
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
    async initRegionList() {
      this.regionListLoading = true;
      const result = await RegionService.getAll();
      this.regionListLoading = false;

      pipe(
        result,
        fold(
          (error) => alert(error.message),
          (result) => {
            this.regionList = result;
          }
        )
      );
    },
    async loadProvinceList() {
      if (this.formSearch.region) {
        this.provinceListLoading = true;
        const result = await ProvinceService.getByISO(
          this.formSearch.region.value
        );
        this.provinceListLoading = false;

        pipe(
          result,
          fold(
            (error) => alert(error.message),
            (result) => {
              this.provinceList = result;
              this.formSearch.province = null;
            }
          )
        );
      } else {
        this.provinceList = [];
        this.formSearch.province = null;
      }
    },
    async search() {
      this.formSearchResultLoading = true;
      this.formSearchResult = [];
      const result = await ReportService.getReports({
        query: this.formSearch.keywords,
        iso: this.formSearch.region?.value,
        regionProvince: this.formSearch.province?.value,
      });
      this.formSearchResultLoading = false;

      pipe(
        result,
        fold(
          (error) => alert(error.message),
          (result) => {
            this.formSearchResult = result.records
              .map((record) => ({
                country: `[${record.region.name}] ${record.region.province}`,
                totalCases: record.confirmed.toString(),
                newCases: record.confirmedDiff.toString(),
                totalDeaths: record.deaths.toString(),
                newDeaths: record.deathsDiff.toString(),
                totalRecovered: record.active.toString(),
                newRecovered: record.activeDiff.toString(),
                lastUpdate: record.lastUpdate.toString(),
              }))
              .slice(0, 20);
          }
        )
      );
    },
    withCommas(input: number | string) {
      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
});
</script>
