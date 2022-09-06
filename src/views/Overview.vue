<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size-sm>
            <div id="map-container">
              <div id="map"></div>
            </div>
            <span
              ><ion-button
                size="small"
                v-on:click="switchBasemap('streets')"
                shape="round"
                >Streets</ion-button
              >
              <ion-button
                size="small"
                v-on:click="switchBasemap('aerials')"
                shape="round"
                >Aerials</ion-button
              ></span
            >
          </ion-col>
          <ion-col size="auto" size-sm>
            <ion-card>
              <ion-row>
                <ion-col size="auto">
                  <ion-card-title
                    >Company: {{ userDetails.company }}
                    <ion-spinner
                      v-if="refreshInProgress"
                      name="circles"
                    ></ion-spinner
                  ></ion-card-title>
                </ion-col>
              </ion-row>
            </ion-card>

            <div
              v-for="(feedItemValue, feedItemKey) in latestDevicesCx7500Feed"
              :key="feedItemKey"
            >
              <button type="button" class="collapsiblecx7500">
                {{ feedItemKey }}
              </button>
              <div class="contentcx7500">
                <div v-for="item in feedItemValue" v-bind:key="item.device_id">
                  <ion-card>
                    <ion-row>
                      <ion-col size="auto">
                        <ion-card-subtitle
                          >Device Name:
                          <b>{{ item.device_alias }}</b></ion-card-subtitle
                        >
                        <div
                          v-if="
                            item.device_feed &&
                            item.device_feed.holding_registers
                          "
                        >
                          <ion-card-subtitle
                            >Last Published At:
                            <b>{{
                              item.device_feed.publishedAt
                            }}</b></ion-card-subtitle
                          >
                          <div
                            v-for="item in item.device_feed.holding_registers"
                            v-bind:key="item.alias"
                          >
                            <ion-card-subtitle
                              float-right
                              v-if="item.alias === 'Key Position'"
                            >
                              <span v-if="item.value === 'Key in Auto'"
                                >{{ item.alias }}:
                                <b class="color-text-green">{{ item.value }}</b>
                                <ion-badge class="color-full-green"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else-if="item.value === 'Not Available'"
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-red">{{ item.value }}</b>
                                <ion-badge class="color-full-red"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>

                            <ion-card-subtitle
                              float-right
                              v-else-if="item.alias === 'Amber Warning Lamp'"
                            >
                              <span
                                v-if="
                                  item.value === 'On, Solid' ||
                                  item.value === 'On, Flashing'
                                "
                                >{{ item.alias }}:
                                <b class="color-text-amber">{{ item.value }}</b>
                                <ion-badge class="color-full-amber"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>

                            <ion-card-subtitle
                              float-right
                              v-else-if="item.alias === 'Red Stop Lamp'"
                            >
                              <span
                                v-if="
                                  item.value === 'On, Solid' ||
                                  item.value === 'On, Flashing'
                                "
                                >{{ item.alias }}:
                                <b class="color-text-red">{{ item.value }}</b>
                                <ion-badge class="color-full-red"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>

                            <ion-card-subtitle v-else float-right
                              >{{ item.alias }}: <b>{{ item.value }}</b>
                              <span v-if="item.value != 'Not Available'">{{
                                item.unit
                              }}</span>
                            </ion-card-subtitle>
                          </div>
                          <ion-button
                            size="small"
                            v-on:click="openEngineControlModal(item)"
                            shape="round"
                            >Control</ion-button
                          >
                        </div>
                        <div v-else>Device Status: Offline</div>
                      </ion-col>
                    </ion-row>
                  </ion-card>
                </div>
              </div>
            </div>

            <div
              v-for="(feedItemValue, feedItemKey) in latestDevicesVfdX600Feed"
              :key="feedItemKey"
            >
              <button type="button" class="collapsiblevfdx600">
                {{ feedItemKey }}
              </button>
              <div class="contentvfdx600">
                <div v-for="item in feedItemValue" v-bind:key="item.device_id">
                  <ion-card>
                    <ion-row>
                      <ion-col size="auto">
                        <ion-card-subtitle
                          >Device Name:
                          <b>{{ item.device_alias }}</b></ion-card-subtitle
                        >
                        <div
                          v-if="
                            item.device_feed &&
                            item.device_feed.holding_registers
                          "
                        >
                          <ion-card-subtitle
                            >Last Published At:
                            <b>{{
                              item.device_feed.publishedAt
                            }}</b></ion-card-subtitle
                          >
                          <div
                            v-for="item in item.device_feed.coils"
                            v-bind:key="item.alias"
                            style="padding: 10px"
                          >
                            <ion-card-subtitle
                              float-right
                              v-if="
                                item.alias === 'Auto Mode' ||
                                item.alias === 'Start/Stop Mode'
                              "
                            >
                              <span v-if="item.value === 'On'"
                                >{{ item.alias }}:
                                <b class="color-text-green">{{ item.value }}</b>
                                <ion-badge class="color-full-green"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>
                          </div>

                          <div
                            v-for="item in item.device_feed.discrete_inputs"
                            v-bind:key="item.alias"
                          >
                            <ion-card-subtitle
                              float-right
                              v-if="item.alias === 'Red Stop Lamp'"
                            >
                              <span v-if="item.value === 'On'"
                                >{{ item.alias }}:
                                <b class="color-text-red">{{ item.value }}</b>
                                <ion-badge class="color-full-red"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>
                            <ion-card-subtitle
                              float-right
                              v-else-if="
                                item.alias === 'VFD Run Status Verification'
                              "
                            >
                              <span v-if="item.value === 'On'"
                                >{{ item.alias }}:
                                <b class="color-text-green">{{ item.value }}</b>
                                <ion-badge class="color-full-green"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>
                            <ion-card-subtitle
                              float-right
                              v-else-if="item.alias === 'Backup Power'"
                            >
                              <span v-if="item.value === 'On'"
                                >{{ item.alias }}:
                                <b class="color-text-red">{{ item.value }}</b>
                                <ion-badge class="color-full-red"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-green">{{ item.value }}</b>
                                <ion-badge class="color-full-green"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>
                          </div>

                          <div
                            v-for="item in item.device_feed.coils"
                            v-bind:key="item.alias"
                          >
                            <ion-card-subtitle
                              float-right
                              v-if="item.alias === 'Amber Warning Lamp'"
                            >
                              <span v-if="item.value === 'On'"
                                >{{ item.alias }}:
                                <b class="color-text-amber">{{ item.value }}</b>
                                <ion-badge class="color-full-amber"
                                  >O</ion-badge
                                ></span
                              >
                              <span v-else
                                >{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                  >O</ion-badge
                                ></span
                              >
                            </ion-card-subtitle>
                          </div>

                          <div
                            v-for="item in item.device_feed.holding_registers"
                            v-bind:key="item.alias"
                          >
                            <ion-card-subtitle float-right
                              >{{ item.alias }}: <b>{{ item.value }}</b>
                              <span v-if="item.value != 'Not Available'">{{
                                item.unit
                              }}</span>
                            </ion-card-subtitle>
                          </div>

                          <ion-button
                            size="small"
                            v-on:click="openVfdControlModal(item)"
                            shape="round"
                            >Control</ion-button
                          >
                        </div>
                        <div v-else>Device Status: Offline</div>
                      </ion-col>
                    </ion-row>
                  </ion-card>
                </div>
              </div>
            </div>

            <deviceData ref="new_device"/>

          </ion-col>



        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
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
  //alertController,
  modalController,
} from "@ionic/vue";
import EngineControlModal from "./EngineControlModal.vue";
import VfdControlModal from "./VfdControlModal.vue";
import { defineComponent } from "vue";
import axios from "axios";
import moment from "moment";
import mapboxgl from "mapbox-gl";
import deviceData from  "./components/device_data.vue"
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
    deviceData
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
    groupBy: function (xs, key) {
      return xs.reduce(function (rv, x) {
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
          this.latestDevicesCx7500Feed = this.groupBy(
            sortedCx7500Data,
            "category_name"
          );

          const sortedVfdX600 = response.data.vfd_x_600.data.sort(
            (a, b) => a.device_order - b.device_order
          );
          // eslint-disable-next-line
          this.latestDevicesVfdX600Feed = this.groupBy(
            sortedVfdX600,
            "category_name"
          );
          // console.log(this.latestDevicesCx7500Feed)
          const deviceCx7500FeedItemsToKeep =
            response.data.cx_7500.overview_fields;
          const deviceVfdX600FeedItemsToKeep =
            response.data.vfd_x_600.overview_fields;

          for (const latestDevicesCx7500FeedItem in this
            .latestDevicesCx7500Feed) {
            // .holding_registers
            this.latestDevicesCx7500Feed[latestDevicesCx7500FeedItem].forEach(
              function (item) {
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
                        deviceCx7500FeedItemsToKeep.includes(
                          deviceFeedItem.alias
                        )
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

                    item.device_feed["holding_registers"] =
                      deviceFeedItemsFiltered;
                  }
                }
              }
            );
          }
          // console.log(this.latestDevicesCx7500Feed)

          for (const latestDevicesVfdX600FeedItem in this
            .latestDevicesVfdX600Feed) {
            this.latestDevicesVfdX600Feed[latestDevicesVfdX600FeedItem].forEach(
              function (item) {
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
                        deviceVfdX600FeedItemsToKeep.includes(
                          deviceFeedItem.alias
                        )
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

                    item.device_feed["holding_registers"] =
                      deviceFeedItemsFiltered;
                  }
                }
              }
            );
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
    initPanels: function () {
      const coll = document.getElementsByClassName("collapsiblecx7500");
      let i;

      for (i = 0; i < coll.length; i++) {
        if (i === 0) {
          coll[i].nextElementSibling.style.display = "block";
        } else {
          coll[i].nextElementSibling.style.display = "none";
          coll[i].classList.toggle("activecx7500");
        }

        coll[i].addEventListener("click", function () {
          this.classList.toggle("activecx7500");
          const content = this.nextElementSibling;
          if (content.style.display === "block") {
            content.style.display = "none";
          } else {
            content.style.display = "block";
          }
        });
      }

      const coll2 = document.getElementsByClassName("collapsiblevfdx600");
      let j;

      for (j = 0; j < coll2.length; j++) {
        if (j === 0) {
          coll2[j].nextElementSibling.style.display = "block";
        } else {
          coll2[j].nextElementSibling.style.display = "none";
          coll2[j].classList.toggle("activevfdx600");
        }

        coll2[j].addEventListener("click", function () {
          this.classList.toggle("activevfdx600");
          const content2 = this.nextElementSibling;
          if (content2.style.display === "block") {
            content2.style.display = "none";
          } else {
            content2.style.display = "block";
          }
        });
      }
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
      this.$refs.new_device.getDeviceData();
    }, 30000);

    setTimeout(() => {
      this.initPanels();
    }, 5000);
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

/* Style the button that is used to open and close the collapsible content */
.collapsiblecx7500 {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

/* Style the button that is used to open and close the collapsible content */
.collapsiblevfdx600 {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.activecx7500,
.collapsiblecx7500:hover {
  background-color: #ccc;
}

.activevfdx600,
.collapsiblevfdx600:hover {
  background-color: #ccc;
}

/* Style the collapsible content. Note: hidden by default */
.contentcx7500 {
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #f1f1f1;
  max-height: 500px;
}

.contentvfdx600 {
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #f1f1f1;
  max-height: 500px;
}

.collapsiblecx7500:after {
  content: "\2796"; /* Unicode character for "minus" sign (-) */
  font-size: 13px;
  color: white;
  float: right;
  margin-left: 5px;
}

.collapsiblevfdx600:after {
  content: "\2796"; /* Unicode character for "minus" sign (-) */
  font-size: 13px;
  color: white;
  float: right;
  margin-left: 5px;
}

.activecx7500:after {
  content: "\02795"; /* Unicode character for "plus" sign (+) */
}
.activevfdx600:after {
  content: "\02795"; /* Unicode character for "plus" sign (+) */
}
</style>