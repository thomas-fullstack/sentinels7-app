<template>
<ion-page>
<ion-content >
  <ion-segment @ionChange="segmentChanged($event)" v-model="activeSegment">
    <ion-segment-button value="deviceinfo">
      <ion-label>Device Info</ion-label>
    </ion-segment-button>
    <ion-segment-button value="enginedata">
      <ion-label>Engine Data</ion-label>
    </ion-segment-button>
    <ion-segment-button value="enginecontrol">
      <ion-label>Engine Control</ion-label>
    </ion-segment-button>
  </ion-segment>
  <ion-card v-show="activeSegment == 'deviceinfo'">
    <ion-card-content>
      <ion-card-title>{{userDetails.company}} - Select Device</ion-card-title>
      <ion-item>
      <ion-select :interface-options="customAlertOptions" v-model="selectedDevice" @ionChange="selectedDeviceChanged($event)" :value="selectedDevice" placeholder="Select One"  >
        <ion-select-option  v-for="(item, index) in devicesList" v-bind:key="index" :value="item.alias">{{item.alias}}</ion-select-option>
      </ion-select>
      </ion-item>
    </ion-card-content>
  </ion-card>
  <ion-card v-show="activeSegment == 'deviceinfo'">
    <ion-card-content>
      <div>
        <ion-row>
          <ion-col size="auto">
            <ion-card-subtitle v-if="refreshInProgress">Checking for new data <ion-spinner name="circles"></ion-spinner></ion-card-subtitle>
            <div class="spinner-blank-placeholder" v-else> </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="auto">
            <ion-card-subtitle>Device Name: <b>{{selectedDevice}}</b></ion-card-subtitle>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="auto">
            <ion-card-subtitle>Device Data Last Published At: <b>{{publishedAt}}</b></ion-card-subtitle>
          </ion-col>
        </ion-row>
      </div>
      <div v-for="(item) in deviceData" v-bind:key="item.alias">
          <ion-row>
            <ion-col size="auto">
              <ion-card-subtitle float-right v-if="item.alias">{{item.alias}}: <b>{{item.value}}</b> <span v-if="item.value != 'Not Available'">{{item.unit}}</span> </ion-card-subtitle>
            </ion-col>
            <ion-col size="4">
              <ion-progress-bar v-if="item.progressBarVal" color="success" :value="item.progressBarVal"></ion-progress-bar>
            </ion-col>
          </ion-row>
      </div>
      <div>
        <ion-row>
          <ion-col size="auto">
            <ion-card-subtitle>Last Known Location: </ion-card-subtitle>
          </ion-col>
        </ion-row>
      </div>
      <div id="map-container">
        <div id="map" ></div>
      </div>
      
      <span><ion-button size="small" v-on:click="switchBasemap('streets')" shape="round">Streets</ion-button> <ion-button size="small" v-on:click="switchBasemap('aerials')" shape="round">Aerials</ion-button></span>
      <br/>
      <a v-if="googleDrivingDirectionsLink" :href=googleDrivingDirectionsLink target="_blank">Get Driving Directions</a> 
       <br/>
      <span v-if="lastKnownLocationString" > <span ><b>{{lastKnownLocationString}}</b></span> <ion-button class="copy-to-clipboard-button" size="small" v-on:click="copyToClipboard()" shape="round">Copy to clipboard</ion-button></span>
    </ion-card-content>
  </ion-card>
  <ion-card v-show="activeSegment == 'enginedata'">

    <ion-card-content>
      <ion-card-title>Engine Data</ion-card-title>
      
      <div v-if="engineData.length < 1 || deviceData[2].value == 'Not Available'">Not Available</div>
      <div v-if="engineData.length > 0 && deviceData[2].value == 'Available'">
        <div v-for="(item) in engineData" v-bind:key="item.alias">
          <ion-row>
            <ion-col size="auto">
              <ion-card-subtitle float-right v-if="item.alias">{{item.alias}}: <b>{{item.value}}</b> <span v-if="item.value != 'Not Available'">{{item.unit}}</span> </ion-card-subtitle>
            </ion-col>
            <ion-col size="4">
              <ion-progress-bar v-if="item.progressBarVal" color="success" :value="item.progressBarVal"></ion-progress-bar>
            </ion-col>
          </ion-row>
        </div>
      </div>
      <!-- Test -->
      <!-- <ion-card-subtitle>Battery Voltage: <b>{{batteryvoltage}}</b> <span v-if="batteryvoltage != 'Not Available'">Volts</span></ion-card-subtitle>
      <ion-card-subtitle>Engine Speed: <b>{{engineSpeed}}</b> <span v-if="engineSpeed != 'Not Available'">RPM</span></ion-card-subtitle>
      <ion-card-subtitle>Coolant Temperature: <b>{{coolantTemperature}}</b> <span v-if="coolantTemperature != 'Not Available'">&deg;F</span></ion-card-subtitle>
      <ion-card-subtitle>Oil Pressure: <b>{{oilPressure}}</b> <span v-if="oilPressure != 'Not Available'">&deg;PSI</span></ion-card-subtitle>
      <ion-card-subtitle>PI Processor Temperature: <b>{{procTemp}}</b> <span v-if="procTemp != 'Not Available'">&deg;F</span></ion-card-subtitle> -->
    </ion-card-content>
  </ion-card>
  <ion-card v-show="activeSegment == 'enginecontrol'">
    <ion-card-content>
      <ion-card-title>Engine Control</ion-card-title>
      <ion-card-subtitle>Start Engine: <ion-button color="success" v-on:click="presentAlertConfirmEngineStart">Start</ion-button></ion-card-subtitle>
      <ion-card-subtitle>Stop Engine: <ion-button color="danger" v-on:click="presentAlertConfirmEngineStop">Stop</ion-button></ion-card-subtitle>
      <br/>
      <ion-card-subtitle>Engine Speed (in RPM): 
          <ion-card-subtitle v-if="engineData.length > 1">Current Engine Speed: {{engineData[2].value}} <span v-if="engineData[2].value != 'Not Available'">{{engineData[2].unit}}</span></ion-card-subtitle>
          <ion-range v-model="engineSpeed" v-on:ionChange="setEngineSpeed($event.target.value)" pin="true" min="800" max="2000" step="20" snaps="true" debounce="500" color="secondary">
                <ion-label slot="start">800</ion-label>
                <ion-label slot="end">2000</ion-label>
          </ion-range>
      </ion-card-subtitle>
    </ion-card-content>
  </ion-card>
</ion-content>
</ion-page>
</template>

<script>
import { IonPage, loadingController, IonSpinner, IonSelect, IonSelectOption, IonItem, IonRow, IonCol, IonProgressBar , IonSegment, IonSegmentButton, IonCard, IonButton, IonRange, IonContent, IonLabel, IonCardContent, IonCardSubtitle, IonCardTitle, alertController, toastController} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios';
import moment from 'moment';
import mapboxgl from 'mapbox-gl';
import { Plugins } from '@capacitor/core';

export default defineComponent({
  components: { IonPage, IonSpinner, IonSelect,IonSelectOption,IonItem, IonRow, IonCol, IonProgressBar, IonSegment, IonSegmentButton , IonCard, IonButton, IonRange, IonContent, IonLabel, IonCardContent, IonCardSubtitle, IonCardTitle},
  setup() {
    const customAlertOptions = {
      header: 'Switch between your devices: ',
      translucent: true
    };
    return { customAlertOptions };
  },
  data() {
    return {
      engineData: [],
      deviceData: [],
      deviceId: "Not Available",
      publishedAt: "Not Available",
      engineSpeed: "Not Available",
      batteryvoltage: "Not Available",
      coolantTemperature: "Not Available",
      procTemp: "Not Available",
      oilPressure: "Not Available",
      sentinels7FeedApiUrl: '',
      mapboxLocationMarker: null,
      previousLocation: null,
      mapObj: null,
      activeSegment: 'deviceinfo',
      googleDrivingDirectionsLink: null,
      mapboxAccessToken: 'pk.eyJ1Ijoic2Fua3M4NyIsImEiOiJjandzaXd6aGQwNGRkNGJxandoeW8wMHBvIn0.SUM7QRlgn8Vr5nmvOowDVQ',
      devicesList: null,
      selectedDevice: null,
      selectedDeviceId: null,
      lastKnownLocationString: null,
      refreshInProgress: false,
      userDetails: {}
    };
  },
  methods: {
    async presentAlertConfirmEngineStart() {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Confirmation',
          message: 'Are you sure you want to<strong> START the Engine?</strong>',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: cancel => {
                console.log('Confirm Cancel:', cancel)
              },
            },
            {
              text: 'Yes',
              handler: () => {
                this.startEngine()
                // console.log('Confirm Okay')
              },
            },
          ],
        });
      return alert.present();
    },
    async presentAlertConfirmEngineStop() {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Confirmation',
          message: 'Are you sure you want to<strong> STOP the Engine?</strong>',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: cancel => {
                console.log('Confirm Cancel:', cancel)
              },
            },
            {
              text: 'Yes',
              handler: () => {
                this.stopEngine()
                // console.log('Confirm Okay')
              },
            },
          ],
        });
      return alert.present();
    },
    async openToast(msg) {
      const toast = await toastController
        .create({
          message: msg,
          duration: 2000,
          position: 'top',
          color: 'success'
        })
      return toast.present();
    },
    async presentLoading() {
      const loading = await loadingController
        .create({
          spinner: 'circles',
          cssClass: 'loading-message',
          message: 'Loading app. Please wait...',
          duration: 30000
        });

      await loading.present();

      setTimeout(function() {
        loading.dismiss()
      }, 30000);
    },
    segmentChanged(ev) {
      console.log('Segment changed', ev);
      this.activeSegment = ev.detail.value
    },selectedDeviceChanged(ev){
      console.log('Device changed', ev);
      // console.log(ev.target.value)
      this.selectedDevice = ev.target.value
      this.selectedDeviceId = this.devicesList.find(x => x.alias === this.selectedDevice).id;
      this.updateDefaultDeviceIdinAppConfig(this.selectedDeviceId)
      this.momentPublished = null
      this.publishedAt = "Not Available"
      this.engineData = []
      this.deviceData = []
      if(this.mapboxLocationMarker) {
        this.mapboxLocationMarker.remove();
      }
      this.mapObj.flyTo({
        zoom: 1,
        center: [-88.4402269, 48.0427248]
      });
      // clearInterval(this.timer)
      // this.timer = setInterval(() => {
      //   this.getLatestData()
      //   }, 10000)
    },
    getValue: function (val) {
        // const messageObject = JSON.parse(message)
        // console.log(messageObject)
        if(val) {
            return val
        } else {
            return "Not Available"
        }
    },
    initMap: function() {
      mapboxgl.accessToken = this.mapboxAccessToken;

      this.mapObj = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-streets-v11",
        center: [-88.4402269, 48.0427248],
        zoom: 1,
      })
      // Add zoom and rotation controls to the map.
      this.mapObj.addControl(new mapboxgl.NavigationControl());

      this.timer = setInterval(() => {
                this.mapObj.resize()
        }, 1500)
      
    },
    switchBasemap: function(basemapType){
      if(basemapType === 'streets'){
        this.mapObj.setStyle('mapbox://styles/mapbox/streets-v11')
      } else {
        this.mapObj.setStyle('mapbox://styles/mapbox/satellite-streets-v11')
      }
      
    },
    copyToClipboard: function(){
      const { Clipboard } = Plugins;
      
      Clipboard.write({
        string: this.lastKnownLocationString
      });

      const result = Clipboard.read();
      console.log(result);
    },
    setGoogleDrivingDirectionsLink: function(lng,lat){
      this.googleDrivingDirectionsLink = 'https://www.google.com/maps?saddr=My+Location&daddr='+ lat +',' + lng
      // console.log(this.googleDrivingDirectionsLink)
    },
    setMapLocation: function(lng, lat) {
      // Remove Any Previous Markers
      if(lng !== 'Not Available' && lat !== 'Not Available')
      {
        if(this.mapboxLocationMarker) {
          this.mapboxLocationMarker.remove();
        }
        this.lastKnownLocationString = lat  + ',' +  lng
        // Add new marker
        this.mapboxLocationMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.mapObj);
        this.setGoogleDrivingDirectionsLink(lng, lat)
        if(this.previousLocation && (this.previousLocation[0] !== lng || this.previousLocation[1] !== lat))
        {
          console.log("Lat Lon Changed")
          this.mapObj.flyTo({
          zoom: 13,
          center: [lng, lat]
          });
        } else if(!this.previousLocation){
          this.mapObj.flyTo({
          zoom: 13,
          center: [lng, lat]
          });
        }
        this.previousLocation = [lng, lat]
      }
    },
    getApiHeaders: function() {
      const authToken = 'Bearer ' + this.userDetails.idToken
      const headers = { 
              "content-type": "application/json",
              "Authorization": authToken
      };
      return headers
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
                // console.log(this.selectedDevice)
              }
              
              this.getLatestData()
              this.timer = setInterval(() => {
                this.getLatestData()
              }, 5000)

            }).catch(error => {
                console.log(error)
                if(error && error.response && error.response.status)
                {
                  this.$router.push({ path: '/login' })
                  setTimeout(function() {
                    location.reload()
                  }, 200);
                }
            });
    },
    getLatestData: function() {
        this.refreshInProgress = true
        console.log("Called getLatestData")
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company};
        console.log(requestParams)
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                this.latestFeed = response.data
                // console.log(this.latestFeed)
                if(this.latestFeed && this.latestFeed.holding_registers.length > 0)
                {
                    // console.log(this.deviceId)
                    this.momentPublished = moment(this.latestFeed.published_at)
                    this.publishedAt = this.momentPublished.format('MM-DD-YYYY [at] hh:mm:ss A') + " (" + this.momentPublished.fromNow() + ")";
                    this.deviceData = this.latestFeed.holding_registers.slice(0, 8)
                    this.engineData = this.latestFeed.holding_registers.slice(8, this.latestFeed.holding_registers.length)
                    console.log(this.deviceData)
                    console.log(this.engineData)

                    this.setMapLocation(this.deviceData[4].value, this.deviceData[3].value)
                    // this.setMapLocation(-98.0335974,30.3080553)
                    
                    
                    this.engineData.forEach(function(item) {
                        if(item.unit === '%'){
                          item.progressBarVal = parseFloat((item.value / 100).toFixed(2))
                          // console.log(item)
                        }
                    })
                    this.deviceData.forEach(function(item) {
                        if(item.unit === '%'){
                          item.progressBarVal = parseFloat((item.value / 100).toFixed(2))
                          // console.log(item)
                        }
                    })
                    // this.engineSpeed = this.getValue(this.latestFeed[0].engine_speed)
                    // this.batteryvoltage = this.getValue(this.latestFeed[0].battery_potential_voltage)
                    // this.coolantTemperature = this.getValue(this.latestFeed[0].engine_coolant_temperature)
                    // this.procTemp = this.getValue(this.latestFeed[0].proc_temp_deg_c)
                    // this.oilPressure = this.getValue(this.latestFeed[0].engine_oil_pressure)
                }
                this.refreshInProgress = false
            }).catch(error => {
                console.log(error)
                if(error && error.response && error.response.status)
                {
                  this.$router.push({ path: '/login' })
                  setTimeout(function() {
                    location.reload()
                  }, 200);
                }
            });
    },
    startFeed: function() {
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "feed_start":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine Data Refresh Started")
                this.openToast("Engine Data Refresh Started")
        })
    },
    stopFeed: function() {
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "feed_stop":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine Data Refresh Stopped")
                this.openToast("Engine Data Refresh Stopped")
        })
    },
    setFrequency: function(frequencyType) {
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "feed_frequency":frequencyType};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine Data Refresh Frequency set to " + frequencyType)
                this.openToast("Engine Data Refresh Frequency set to " + frequencyType)
        })
    },
    updateDefaultDeviceIdinAppConfig: function(id) {
        const currentUserEmail = this.userDetails.email;
        const requestParams = {
                    "email": currentUserEmail,
                    "key": "default_device_id",
                    "value": id.toString()
                  };
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Set Device to Default")
                // this.openToast("Set Device to Default")
        })
    },
    setPartialPublish: function(isPartialPublish) {
        let isPartialOrFullPublish = "full_publish"
        if(isPartialPublish === 'true')
        {
          isPartialOrFullPublish = "partial_publish"
        }
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "partial_or_full_publish":isPartialOrFullPublish};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
              if(isPartialPublish === 'true'){
                console.log("Partial Engine Data Publish is Enabled")
                this.openToast("Partial Engine Data Publish is Enabled")
              } else {
                console.log("Full Engine Data Publish is Enabled")
                this.openToast("Full Engine Data Publish is Enabled")
              }

        })
    },
    startEngine: function() {
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "engine_start":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine start command issued")
                this.openToast("Engine start command issued")
        })
    },
    stopEngine: function() {
        const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "engine_stop":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine stop command issued")
                this.openToast("Engine stop command issued")
        })
    },
    setEngineSpeed: function(setSpeedVal) {
      this.engineSpeed = setSpeedVal
      if(this.engineSpeed === parseInt(this.engineSpeed, 10)) {
        // console.log(this.engineSpeed)
        // console.log(setSpeedVal)
          const requestParams = {"device_name": this.selectedDevice, "client_name": this.userDetails.company, "engine_speed":setSpeedVal};
          const headers = this.getApiHeaders()
          axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
          .then(
              response => {
                  console.log("Engine speed set command issued at: " + setSpeedVal + " RPM")
                  this.openToast("Engine speed set command issued at: " + setSpeedVal + " RPM")
          })
      }
    }
  },
  mounted() {
    // If url contains dev or localhost point API calls to dev
    if(window.location.href.includes('dev') || window.location.href.includes('localhost')){
      this.sentinels7FeedApiUrl = 'https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/feed'
    } else { // Point API calls to prod
      this.sentinels7FeedApiUrl = 'https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/feed'
    }

    if (localStorage.getItem('user')) {
      this.userDetails = JSON.parse(localStorage.getItem('user'));
    }
    // this.presentLoading()
    this.getDevicesList()
    this.initMap()
    // This needs to be written better where we parse config item by type
    // let default_device_id = this.userDetails.userAppConfig[0].value
    // let devices_data_partial_publish = this.userDetails.userAppConfig[2].value

    const vm = this // eslint-disable-line
    setTimeout(function() {
      const devicesDataRefreshFrequency = vm.userDetails.userAppConfig.find(x => x.key === 'devices_data_refresh_frequency').value;
      const defaultDeviceId = parseInt(vm.userDetails.userAppConfig.find(x => x.key === 'default_device_id').value);
      const selectedDevice = vm.devicesList.find(x => x.id === defaultDeviceId).alias;
      vm.selectedDevice = selectedDevice
      console.log("Default Device Id:" + defaultDeviceId)
      vm.setFrequency(devicesDataRefreshFrequency)
      
    }, 5000);
    setTimeout(function() {
      const devicesDataPartialPublish = vm.userDetails.userAppConfig.find(x => x.key === 'devices_data_partial_publish').value;
      vm.setPartialPublish(devicesDataPartialPublish)
    }, 7000);

  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
});
</script>

<style scoped>

ion-toggle{
  top: 13px;
}

#map {
    height: 100%;
    width: 100%;
}

#map-container {
    height: 400px;
    width: auto;
}

ion-progress-bar{
  height:15px;
}
.copy-to-clipboard-button{
  margin-bottom:15px;
}

ion-spinner{
  top:10px;
}

.spinner-blank-placeholder{
  width: 34px;
  height: 34px;
}

.loading-message {
  --background: #222;
  --spinner-color: #fff;

  color: #fff;
}

</style>