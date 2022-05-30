<template src="./OverviewPartial.html">

</template>
<script>
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonSpinner,
  IonBadge,
  alertController,
  modalController,
} from "@ionic/vue";
import EngineControlModal from "./EngineControlModal.vue";
import VfdControlModal from "./VfdControlModal.vue";
import { defineComponent } from "vue";
import axios from "axios";
import moment from "moment";
import mapboxgl from "mapbox-gl";
import {
  VueCollapsiblePanelGroup,
  VueCollapsiblePanel,
} from '@dafcoe/vue-collapsible-panel'
import '../assets/collapsible-panel.css';

export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonSpinner,
    IonBadge,
    VueCollapsiblePanelGroup,
    VueCollapsiblePanel,
  },
  setup() {
    return {};
  },
  data() {
    return {
      mapObj: null,
      mapboxAccessToken:
        "pk.eyJ1Ijoic2Fua3M4NyIsImEiOiJjandzaXd6aGQwNGRkNGJxandoeW8wMHBvIn0.SUM7QRlgn8Vr5nmvOowDVQ",
      sentinels7FeedApiUrl: "",
      refreshInProgress: false,
      latestDevicesCx7500Feed: null,
      latestDevicesVfdX600Feed: null,
      userDetails: {},
      mapboxLocationMarkers: [],
    };
  },
  methods: {
    switchBasemap: function (basemapType) {
      if (basemapType === "streets") {
        this.mapObj.setStyle("mapbox://styles/mapbox/streets-v11");
      } else {
        this.mapObj.setStyle("mapbox://styles/mapbox/satellite-streets-v11");
      }
    },
    initMap: function () {
      mapboxgl.accessToken = this.mapboxAccessToken;

      this.mapObj = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-streets-v11",
        center: [-88.4402269, 48.0427248],
        zoom: 1,
      });
      // Add zoom and rotation controls to the map.
      this.mapObj.addControl(new mapboxgl.NavigationControl());

      this.timer = setInterval(() => {
        this.mapObj.resize();
      }, 1500);
    },
    getApiHeaders: function () {
      const authToken = "Bearer " + this.userDetails.idToken;
      const headers = {
        "content-type": "application/json",
        Authorization: authToken,
      };
      return headers;
    },
    groupBy: function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    getCompanyDevicesFeed: function () {
      this.refreshInProgress = true;
      // console.log("Called getCompanyDevicesFeed")
      // eslint-disable-next-line
      const requestParams = { client_name: this.userDetails.company };
      // console.log(requestParams)
      const headers = this.getApiHeaders();
      const mapObj = this.mapObj;
      const mapboxLocationMarkers = this.mapboxLocationMarkers;
      axios
        .post(this.sentinels7FeedApiUrl, requestParams, { headers })
        .then((response) => {
          const bounds = new mapboxgl.LngLatBounds();
          if (
            this.mapboxLocationMarkers &&
            this.mapboxLocationMarkers.length > 0
          ) {
            this.mapboxLocationMarkers.forEach(function (marker) {
              marker.remove();
            });
          }
          const sortedCx7500Data = response.data.cx_7500.data.sort(
                  (a, b) => a.device_order - b.device_order
                );
          // eslint-disable-next-line
          this.latestDevicesCx7500Feed = this.groupBy(sortedCx7500Data, 'category_name') 

          const sortedVfdX600 = response.data.vfd_x_600.data.sort(
                  (a, b) => a.device_order - b.device_order
                );
          // eslint-disable-next-line
          this.latestDevicesVfdX600Feed = this.groupBy(sortedVfdX600, 'category_name') 
          // console.log(this.latestDevicesCx7500Feed)
          const deviceCx7500FeedItemsToKeep =
            response.data.cx_7500.overview_fields;
          const deviceVfdX600FeedItemsToKeep =
            response.data.vfd_x_600.overview_fields;
          
          for (const latestDevicesCx7500FeedItem in this.latestDevicesCx7500Feed) {
          // .holding_registers
          this.latestDevicesCx7500Feed[latestDevicesCx7500FeedItem].forEach(function (item) {
            if (item.device_feed) {
              const momentPublished = moment(item.device_feed.published_at);
              item.device_feed.publishedAt =
                momentPublished.format("MM-DD-YYYY [at] hh:mm:ss A") +
                " (" +
                momentPublished.fromNow() +
                ")";
              if (item.device_feed.holding_registers) {
                const deviceFeedItemsFiltered = [];
                let lat = null;
                let lng = null;
                // Green by default
                let markerColor = "#02b40b";
                item.device_feed.holding_registers.sort(
                  (a, b) => a.order - b.order
                );
                item.device_feed.holding_registers.forEach(function (
                  deviceFeedItem
                ) {
                  // console.log(deviceFeedItems)
                  if (
                    deviceCx7500FeedItemsToKeep.includes(deviceFeedItem.alias)
                  ) {
                    deviceFeedItemsFiltered.push(deviceFeedItem);
                  }
                  if (deviceFeedItem.alias === "GPS Latitude") {
                    lat = deviceFeedItem.value;
                  }
                  if (deviceFeedItem.alias === "GPS Longitude") {
                    lng = deviceFeedItem.value;
                  }
                  let redStopLampOn = false;
                  let amberWarningLampOn = false;
                  if (deviceFeedItem.alias === "Red Stop Lamp") {
                    if (
                      deviceFeedItem.value === "On, Solid" ||
                      deviceFeedItem.value === "On, Flashing"
                    ) {
                      redStopLampOn = true;
                    }
                  }
                  if (deviceFeedItem.alias === "Amber Warning Lamp") {
                    if (
                      deviceFeedItem.value === "On, Solid" ||
                      deviceFeedItem.value === "On, Flashing"
                    ) {
                      amberWarningLampOn = true;
                    }
                  }
                  if (redStopLampOn && amberWarningLampOn) {
                    markerColor = "#b40219";
                  } else if (amberWarningLampOn) {
                    markerColor = "#ffbf00";
                  } else if (redStopLampOn) {
                    markerColor = "#b40219";
                  }
                });

                const popupText =
                  "<b>" +
                  item.device_alias +
                  "</b>" +
                  '<br/> <a href="https://www.google.com/maps?saddr=My+Location&daddr=' +
                  lat +
                  "," +
                  lng +
                  '" target="_blank">Get Driving Directions</a>';
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                  popupText
                );

                if (lat && !isNaN(lat) && lng && !isNaN(lng)) {
                  // console.log("Filtered Items")
                  // console.log(deviceFeedItemsFiltered)
                  // Add new marker
                  const mapboxLocationMarker = new mapboxgl.Marker({
                    // "color": "#b40219"
                    color: markerColor,
                  })
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(mapObj);
                  bounds.extend([lng, lat]);
                  mapboxLocationMarkers.push(mapboxLocationMarker);
                  // this.setGoogleDrivingDirectionsLink(lng, lat)
                }

                item.device_feed["holding_registers"] = deviceFeedItemsFiltered;
              }
            }
          });
          }
          // console.log(this.latestDevicesCx7500Feed)

          for (const latestDevicesVfdX600FeedItem in this.latestDevicesVfdX600Feed) {
          this.latestDevicesVfdX600Feed[latestDevicesVfdX600FeedItem].forEach(function (item) {
            if (item.device_feed) {
              const momentPublished = moment(item.device_feed.published_at);
              item.device_feed.publishedAt =
                momentPublished.format("MM-DD-YYYY [at] hh:mm:ss A") +
                " (" +
                momentPublished.fromNow() +
                ")";
              if (item.device_feed.holding_registers) {
                const deviceFeedItemsFiltered = [];
                let lat = null;
                let lng = null;
                // Green by default
                let markerColor = "#02b40b";
                item.device_feed.holding_registers.sort(
                  (a, b) => a.order - b.order
                );
                item.device_feed.holding_registers.forEach(function (
                  deviceFeedItem
                ) {
                  // console.log(deviceFeedItems)
                  if (
                    deviceVfdX600FeedItemsToKeep.includes(deviceFeedItem.alias)
                  ) {
                    deviceFeedItemsFiltered.push(deviceFeedItem);
                  }
                  if (deviceFeedItem.alias === "GPS Latitude") {
                    lat = deviceFeedItem.value;
                  }
                  if (deviceFeedItem.alias === "GPS Longitude") {
                    lng = deviceFeedItem.value;
                  }
                  let redStopLampOn = false;
                  let amberWarningLampOn = false;
                  if (deviceFeedItem.alias === "Red Stop Lamp") {
                    if (
                      deviceFeedItem.value === "On, Solid" ||
                      deviceFeedItem.value === "On, Flashing"
                    ) {
                      redStopLampOn = true;
                    }
                  }
                  if (deviceFeedItem.alias === "Amber Warning Lamp") {
                    if (
                      deviceFeedItem.value === "On, Solid" ||
                      deviceFeedItem.value === "On, Flashing"
                    ) {
                      amberWarningLampOn = true;
                    }
                  }
                  if (redStopLampOn && amberWarningLampOn) {
                    markerColor = "#b40219";
                  } else if (amberWarningLampOn) {
                    markerColor = "#ffbf00";
                  } else if (redStopLampOn) {
                    markerColor = "#b40219";
                  }
                });

                const popupText =
                  "<b>" +
                  item.device_alias +
                  "</b>" +
                  '<br/> <a href="https://www.google.com/maps?saddr=My+Location&daddr=' +
                  lat +
                  "," +
                  lng +
                  '" target="_blank">Get Driving Directions</a>';
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                  popupText
                );

                if (lat && !isNaN(lat) && lng && !isNaN(lng)) {
                  // console.log("Filtered Items")
                  // console.log(deviceFeedItemsFiltered)
                  // Add new marker
                  const mapboxLocationMarker = new mapboxgl.Marker({
                    // "color": "#b40219"
                    color: markerColor,
                  })
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(mapObj);
                  bounds.extend([lng, lat]);
                  mapboxLocationMarkers.push(mapboxLocationMarker);
                  // this.setGoogleDrivingDirectionsLink(lng, lat)
                }

                item.device_feed["holding_registers"] = deviceFeedItemsFiltered;
              }
            }
          });
          }

          // console.log(this.latestDevicesVfdX600Feed)

          if (!bounds.isEmpty()) {
            mapObj.fitBounds(bounds, { padding: 100 });
          }
          this.refreshInProgress = false;
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            // this.$router.push({ path: "/login" });
            // setTimeout(function () {
            //   location.reload();
            // }, 200);
          }
        });
    },
    async openEngineControlModal(item) {
      const modal = await modalController.create({
        component: EngineControlModal,
        cssClass: "my-custom-class",
        componentProps: {
          title: "Control",
          userDetails: this.userDetails,
          selectedItem: item,
          sentinels7FeedApiUrl: this.sentinels7FeedApiUrl,
        },
      });
      return modal.present();
    },
    async openVfdControlModal(item) {
      const modal = await modalController.create({
        component: VfdControlModal,
        cssClass: "my-custom-class",
        componentProps: {
          title: "Control",
          userDetails: this.userDetails,
          selectedItem: item,
          sentinels7FeedApiUrl: this.sentinels7FeedApiUrl,
        },
      });
      return modal.present();
    },
  },
  mounted() {
    // If url contains dev or localhost point API calls to dev
    if (
      window.location.href.includes("dev.") ||
      window.location.href.includes("localhost")
    ) {
      this.sentinels7FeedApiUrl =
        "https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/feed";
    } else {
      // Point API calls to prod
      this.sentinels7FeedApiUrl =
        "https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/feed";
    }

    if (localStorage.getItem("user")) {
      this.userDetails = JSON.parse(localStorage.getItem("user"));
    }

    this.initMap();

    this.getCompanyDevicesFeed();
    this.timer = setInterval(() => {
      this.getCompanyDevicesFeed();
    }, 30000);
  },
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

.spinner-blank-placeholder {
  width: 34px;
  height: 34px;
}

.color-full-red {
  background-color: red;
  color: red;
}
.color-background-red {
  background-color: red;
}
.color-text-red {
  color: red;
}

.color-full-green {
  background-color: green;
  color: green;
}
.color-background-green {
  background-color: green;
}
.color-text-green {
  color: green;
}

.color-full-amber {
  background-color: orange;
  color: orange;
}
.color-background-amber {
  background-color: orange;
}
.color-text-amber {
  color: orange;
}

.color-full-black {
  background-color: black;
  color: black;
}
.color-background-black {
  background-color: black;
}
.color-text-black {
  color: black;
}
ion-badge {
  width: 12px;
  height: 12px;
}
ion-spinner {
  top: 5px;
  width: 18px;
  height: 18px;
}
</style>