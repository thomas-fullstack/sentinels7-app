<template>
<ion-page>
<ion-content >
  <ion-grid>
  <ion-row>
    <ion-col size-sm>
      <div id="map-container">
        <div id="map" ></div>
      </div>
      <span><ion-button size="small" v-on:click="switchBasemap('streets')" shape="round">Streets</ion-button> <ion-button size="small" v-on:click="switchBasemap('aerials')" shape="round">Aerials</ion-button></span>
    </ion-col>
    <ion-col size="auto" size-sm>
      <ion-card>
        <ion-row>
          <ion-col size="auto">
            <ion-card-title>Company: {{userDetails.company}} <ion-spinner v-if="refreshInProgress" name="circles"></ion-spinner></ion-card-title>
          </ion-col>
        </ion-row>
      </ion-card>
      <div v-for="(item) in latestDevicesFeed" v-bind:key="item.device_id">
        <ion-card>
          <ion-row>
            <ion-col size="auto">
              <ion-card-subtitle>Device Name: <b>{{item.device_alias}}</b></ion-card-subtitle>
              <div v-if="item.device_feed && item.device_feed.holding_registers">
                <ion-card-subtitle>Last Published At: <b>{{item.device_feed.publishedAt}}</b></ion-card-subtitle>
                <div v-for="(item) in item.device_feed.holding_registers" v-bind:key="item.alias">

                      <ion-card-subtitle float-right v-if="item.alias === 'Key Position'">
                       <span v-if="item.value === 'Key in Auto'">{{item.alias}}: <b class="color-text-green">{{item.value}}</b>  <ion-badge class="color-full-green">O</ion-badge></span>
                       <span v-else-if="item.value === 'Not Available'">{{item.alias}}: <b class="color-text-black">{{item.value}}</b>  <ion-badge class="color-full-black">O</ion-badge></span>
                       <span v-else>{{item.alias}}: <b class="color-text-red">{{item.value}}</b>  <ion-badge class="color-full-red">O</ion-badge></span>
                      </ion-card-subtitle>

                      <ion-card-subtitle float-right v-else-if="item.alias === 'Amber Warning Lamp'">
                       <span v-if="item.value === 'On, Solid' || item.value === 'On, Flashing'">{{item.alias}}: <b class="color-text-amber">{{item.value}}</b>  <ion-badge class="color-full-amber">O</ion-badge></span>
                       <span v-else>{{item.alias}}: <b class="color-text-black">{{item.value}}</b>  <ion-badge class="color-full-black">O</ion-badge></span>
                      </ion-card-subtitle>

                      <ion-card-subtitle float-right v-else-if="item.alias === 'Red Stop Lamp'">
                       <span v-if="item.value === 'On, Solid' || item.value === 'On, Flashing'">{{item.alias}}: <b class="color-text-red">{{item.value}}</b>  <ion-badge class="color-full-red">O</ion-badge></span>
                       <span v-else>{{item.alias}}: <b class="color-text-black">{{item.value}}</b>  <ion-badge class="color-full-black">O</ion-badge></span>
                      </ion-card-subtitle>

                      <ion-card-subtitle v-else float-right >{{item.alias}}: <b>{{item.value}}</b> <span v-if="item.value != 'Not Available'">{{item.unit}}</span> </ion-card-subtitle>

                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-card>
      </div>
    </ion-col>
  </ion-row>
</ion-grid>
</ion-content>
</ion-page>
</template>

<script>
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonSpinner, IonBadge} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios';
import moment from 'moment';
import mapboxgl from 'mapbox-gl';

export default defineComponent({
  components: { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonSpinner, IonBadge},
  setup() {
    return { };
  },
  data() {
    return {
      mapObj: null,
      mapboxAccessToken: 'pk.eyJ1Ijoic2Fua3M4NyIsImEiOiJjandzaXd6aGQwNGRkNGJxandoeW8wMHBvIn0.SUM7QRlgn8Vr5nmvOowDVQ',
      sentinels7FeedApiUrl: "https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/feed",
      refreshInProgress: false,
      latestDevicesFeed: null,
      userDetails: {},
      mapboxLocationMarkers: [],
    };
  },
  methods: {
    switchBasemap: function(basemapType){
      if(basemapType === 'streets'){
        this.mapObj.setStyle('mapbox://styles/mapbox/streets-v11')
      } else {
        this.mapObj.setStyle('mapbox://styles/mapbox/satellite-streets-v11')
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
    getApiHeaders: function() {
      const authToken = 'Bearer ' + this.userDetails.idToken
      const headers = { 
              "content-type": "application/json",
              "Authorization": authToken
      };
      return headers
    },
    getCompanyDevicesFeed: function() {
        this.refreshInProgress = true
        // console.log("Called getCompanyDevicesFeed")
        const requestParams = {"client_name": this.userDetails.company};
        // console.log(requestParams)
        const headers = this.getApiHeaders()
        const mapObj = this.mapObj
        const mapboxLocationMarkers = this.mapboxLocationMarkers
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                const bounds = new mapboxgl.LngLatBounds();
                if(this.mapboxLocationMarkers && this.mapboxLocationMarkers.length > 0) {
                  this.mapboxLocationMarkers.forEach(function(marker) {
                    marker.remove();
                  })
                }
                this.latestDevicesFeed = response.data
                // console.log(this.latestDevicesFeed)
                const deviceFeedItemsToKeep = ['Key Position', 'Inlet Pressure', 'Flow Rate', 'Engine Speed', 'Outlet Pressure 1', 'Battery Voltage', 'Engine Coolant Temp', 'Engine Oil Pressure', 'Fuel Level', 'Amber Warning Lamp', 'Red Stop Lamp']
                // .holding_registers
                this.latestDevicesFeed.forEach(function(item) {
                  if(item.device_feed){
                    const momentPublished = moment(item.device_feed.published_at)
                    item.device_feed.publishedAt = momentPublished.format('MM-DD-YYYY [at] hh:mm:ss A') + " (" + momentPublished.fromNow() + ")";
                  if(item.device_feed.holding_registers) {
                    const deviceFeedItemsFiltered = []
                    let lat = null
                    let lng = null
                    // Green by default
                    let markerColor = "#02b40b"
                    item.device_feed.holding_registers.forEach(function(deviceFeedItem) {
                      // console.log(deviceFeedItems)
                      if(deviceFeedItemsToKeep.includes(deviceFeedItem.alias)){
                        deviceFeedItemsFiltered.push(deviceFeedItem)
                      }
                      if(deviceFeedItem.alias === 'GPS Latitude'){
                        lat = deviceFeedItem.value
                      }
                      if(deviceFeedItem.alias === 'GPS Longitude'){
                        lng = deviceFeedItem.value
                      }
                      let redStopLampOn = false
                      let amberWarningLampOn = false
                      if(deviceFeedItem.alias === 'Red Stop Lamp'){
                        if(deviceFeedItem.value === 'On, Solid' || deviceFeedItem.value === 'On, Flashing')
                        {
                          redStopLampOn = true
                        }
                      }
                      if(deviceFeedItem.alias === 'Amber Warning Lamp'){
                        if(deviceFeedItem.value === 'On, Solid' || deviceFeedItem.value === 'On, Flashing')
                        {
                          amberWarningLampOn = true
                        }
                      }
                      if(redStopLampOn && amberWarningLampOn){
                        markerColor = "#b40219"
                      } else if(amberWarningLampOn)
                      {
                        markerColor = "#ffbf00"
                      } else if(redStopLampOn){
                        markerColor = "#b40219"
                      }

                      
                    })

                    const popupText = '<b>' + item.device_alias + '</b>'
                    + '<br/> <a href="https://www.google.com/maps?saddr=My+Location&daddr='+ lat +',' + lng + '" target="_blank">Get Driving Directions</a>'
                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    popupText
                    );

                    // console.log("Filtered Items")
                    // console.log(deviceFeedItemsFiltered)
                    // Add new marker
                    const mapboxLocationMarker = new mapboxgl.Marker({ 
                      // "color": "#b40219" 
                      "color": markerColor
                      })
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(mapObj);
                    bounds.extend([lng, lat])
                    mapboxLocationMarkers.push(mapboxLocationMarker)
                    // this.setGoogleDrivingDirectionsLink(lng, lat)
                    item.device_feed['holding_registers'] = deviceFeedItemsFiltered
                  }
                }
                })
                mapObj.fitBounds(bounds, {padding: 100});
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
    }
  },
  mounted() {
    if (localStorage.getItem('user')) {
      this.userDetails = JSON.parse(localStorage.getItem('user'));
    }

    this.initMap()

    this.getCompanyDevicesFeed()
      this.timer = setInterval(() => {
        this.getCompanyDevicesFeed()
    }, 30000)
  }
});
</script>

<style scoped>
#map {
    height: 100%;
    width: 100%;
}

#map-container {
    height: 550px;
    width: auto;
}

.spinner-blank-placeholder{
  width: 34px;
  height: 34px;
}

.color-full-red{
  background-color: red;
  color: red;
}
.color-background-red{
  background-color: red;
}
.color-text-red{
  color: red;
}

.color-full-green{
  background-color: green;
  color: green;
}
.color-background-green{
  background-color: green;
}
.color-text-green{
  color: green;
}

.color-full-amber{
  background-color: orange;
  color: orange;
}
.color-background-amber{
  background-color: orange;
}
.color-text-amber{
  color: orange;
}

.color-full-black{
  background-color: black;
  color: black;
}
.color-background-black{
  background-color: black;
}
.color-text-black{
  color: black;
}
ion-badge {
  width:12px;
  height:12px;
}
ion-spinner{
  top:5px;
  width: 18px;
  height:18px;
}
</style>