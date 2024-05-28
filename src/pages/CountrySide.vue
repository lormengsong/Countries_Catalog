<template>
  <div>
    <div class="containers">
      <h1 style="text-align: center" class="mt-5">
        Countries Catalog Implementation
      </h1>
      <div class="loading" v-if="loading">
        <v-progress-circular indeterminate color="#de5d0a"></v-progress-circular>
      </div>
      <div v-else>
        <div class="d-flex justify-end">
          <div style="width: 20%; margin-bottom: 20px">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="filteredCountries"
          hide-default-footer
          :page.sync="page"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
          class="elevation-1"
        >
          <template v-slot:[`item.flag`]="{ item }">
            <img :src="item.flag" alt="Flag" style="width: 50px" />
          </template>
          <template v-slot:[`item.name`]="{ item }" >
            <span @click="showCountryDetails(item)" style="cursor: pointer;">
              {{ item.name }}
            </span>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </div>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ selectedCountry?.name }}</span>
          </v-card-title>
          <v-card-text>
            <div v-if="selectedCountry">
              <p><strong>Native Name:</strong> {{ selectedCountry.nativeName }}</p>
              <p><strong>Alternative Spellings:</strong> {{ selectedCountry.altSpellings.join(', ') }}</p>
              <p><strong>2 character Country Code:</strong> {{ selectedCountry.cca2 }}</p>
              <p><strong>3 character Country Code:</strong> {{ selectedCountry.cca3 }}</p>
              <p><strong>Country Calling Codes:</strong> {{ selectedCountry.idd }}</p>
              <img :src="selectedCountry.flag" alt="Flag" style="width: 100px" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      headers: [
        { text: "No", value: "No", sortable: false },
        { text: "Flag", value: "flag", sortable: false },
        { text: "Country Name", value: "name" },
        { text: "2 character Country Code", value: "cca2", sortable: false },
        { text: "3 character Country Code", value: "cca3", sortable: false },
        { text: "Native Country Name", value: "nativeName", sortable: false },
        { text: "Alternative Country Name", value: "altSpellings", sortable: false },
        { text: "Country Calling Codes", value: "idd", sortable: false },
      ],
      countries: [],
      loading: true,
      search: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 25,
      dialog: false,
      selectedCountry: null,
    };
  },
  computed: {
    filteredCountries() {
      return this.countries.filter((country) => {
        const searchLower = this.search.toLowerCase();
        return (
          country.name.toLowerCase().includes(searchLower) ||
          country.altSpellings.some(spell => spell.toLowerCase().includes(searchLower)) ||
          country.nativeName?.toLowerCase().includes(searchLower) ||
          country.cca3.toLowerCase().includes(searchLower)
        );
      });
    },
  },
  methods: {
    async getData() {
      const url = `${process.env.VUE_APP_API_URL}/all`;
      this.loading = true;
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          this.countries = response.data.map((country, index) => ({
            No: index + 1,
            flag: country.flags.png,
            name: country.name.official,
            cca2: country.cca2,
            cca3: country.cca3,
            nativeName: country.name.nativeName ? Object.values(country.name.nativeName)[0].common : "",
            altSpellings: country.altSpellings,
            idd: country.idd.root,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        this.loading = false;
      }
    },
    showCountryDetails(country) {
      this.selectedCountry = country;
      this.dialog = true;
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
.containers {
  width: 80%;
  margin: 0px auto;
}
.loading {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
