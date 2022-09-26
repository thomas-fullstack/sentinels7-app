<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row color="primary">
          <ion-col size-md="6" size-lg="5" size-xs="12">
            <ion-card>
              <ion-item>
                <h3>Generate Device CSV Report</h3>
              </ion-item>
              <ion-item>
                <ion-label>Select Device</ion-label>
                <ion-item>
                <ion-select :interface-options="customAlertOptions" v-model="selectedDevice" @ionChange="selectedDeviceChanged($event)" :value="selectedDevice" placeholder="Select One"  >
                  <ion-select-option  v-for="(item, index) in devicesList" v-bind:key="index" :value="item.alias">{{item.alias}}</ion-select-option>
                </ion-select>
                </ion-item>
              </ion-item>
              <ion-item>
                <ion-label>Start Date</ion-label>
                <ion-datetime
                  v-model="startDate"
                  v-bind:value="startDate"
                  name="date"
                  v-on:ionInput="startDate = $event.target.value"
                  required
                  placeholder="Select Date"
                ></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label>Start Time</ion-label>
                <ion-datetime
                  display-format="h:mm A"
                  picker-format="h:mm A"
                  v-model="startDate"
                  v-bind:value="startDate"
                  v-on:ionInput="startDate = $event.target.value"
                  required
                ></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label>End Date</ion-label>
                <ion-datetime
                  v-model="endDate"
                  v-bind:value="endDate"
                  name="date"
                  v-on:ionInput="endDate = $event.target.value"
                  required
                  placeholder="Select Date"
                ></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label>End Time</ion-label>
                <ion-datetime
                  display-format="h:mm A"
                  picker-format="h:mm A"
                  v-model="endDate"
                  v-bind:value="endDate"
                  v-on:ionInput="endDate = $event.target.value"
                  required
                ></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-card-subtitle
                  >Generate Report:
                  <ion-button color="success" v-on:click="generateReport"
                    >Download CSV</ion-button
                  ></ion-card-subtitle
                >
              </ion-item>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonCol,
  IonRow,
  IonGrid,
  IonPage,
  IonContent,
  IonCard,
  IonItem,
  IonButton,
  IonDatetime,
  IonLabel,
  IonCardSubtitle,
  IonSelect,
  IonSelectOption
} from "@ionic/vue";
import moment from "moment";
import axios from "axios";

export default defineComponent({
  components: {
    IonCol,
    IonRow,
    IonGrid,
    IonPage,
    IonContent,
    IonCard,
    IonItem,
    IonButton,
    IonDatetime,
    IonLabel,
    IonCardSubtitle,
    IonSelect,
    IonSelectOption
  },
  setup() {
    const customAlertOptions = {
      header: 'Switch between your devices: ',
      translucent: true
    };
    return { customAlertOptions };
  },
  data() {
    return {
      startDate: moment().subtract(1, "days").format(),
      endDate: moment().format(),
      sentinels7FeedApiUrl: '',
      sentinels7ReportingApiUrl: "",
      userDetails: {},
      devicesList: null,
      selectedDevice: null
    };
  },
  mounted() {
    // If url contains dev or localhost point API calls to dev
    if (
      window.location.href.includes("dev.") ||
      window.location.href.includes("localhost")
    ) {
      this.sentinels7FeedApiUrl = 'https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/feed'
      this.sentinels7ReportingApiUrl =
        "https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/reports";
    } else {
      this.sentinels7FeedApiUrl = 'https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/feed'
      // Point API calls to prod
      this.sentinels7ReportingApiUrl =
        "https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/reports";
    }

    if (localStorage.getItem('user')) {
      this.userDetails = JSON.parse(localStorage.getItem('user'));
    }

    this.getDevicesList()
  },
  methods: {
    getApiHeaders: function() {
      const authToken = 'Bearer ' + this.userDetails.idToken
      const headers = { 
              "content-type": "application/json",
              "Authorization": authToken
      };
      return headers
    },
  selectedDeviceChanged(ev){
      console.log('Device changed', ev);
      // console.log(ev.target.value)
      this.selectedDevice = ev.target.value
    },
    getDevicesList: function() {
        console.log("Called getDevicesList")
        const requestParams = {"client_id": this.userDetails.company};
        const headers = this.getApiHeaders()





        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
              if(response.data.length > 0)
              {
                this.devicesList = response.data
                this.selectedDevice = this.devicesList[0].alias
                console.log(this.devicesList)
              }

            }).catch(error => {
                console.log(error)
                if(error)
                {
                  this.$router.push({ path: '/login' })
                  setTimeout(function() {
                    location.reload()
                  }, 200);
                }
            });
    },
    generateReport: function () {
      console.log(this.startDate);
      console.log(this.endDate);
      console.log(this.selectedDevice)
      console.log(this.userDetails.company)

      const startDateMoment = moment(this.startDate);
      const endDateMoment = moment(this.endDate);
      const startDateMomentUtc = startDateMoment.utc();
      const endDateMomentUtc = endDateMoment.utc();
      console.log(startDateMomentUtc.format(), endDateMomentUtc.format());

      const requestParams = {
        "client_id": this.userDetails.company,
        "device_alias": this.selectedDevice,
        "from_date_time_utc_iso_str": startDateMomentUtc.format(),
        "to_date_time_utc_iso_str": endDateMomentUtc.format()
      };
      const headers = this.getApiHeaders();
      axios
        .post(this.sentinels7ReportingApiUrl, requestParams, { headers })
        .then((response) => {
          if (response && response.data && response.data.body) {
            console.log(response.data.body)
            const anchor = document.createElement('a');
            anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data.body);
            anchor.target = '_blank';
            anchor.download = 'device_report.csv';
            anchor.click();
          }
        })
        .catch((error) => {
          console.log(error);
          // if (error) {
          //   this.$router.push({ path: "/login" });
          //   setTimeout(function () {
          //     location.reload();
          //   }, 200);
          // }
        });
    },
  },
});
</script>

<style scoped>
</style>