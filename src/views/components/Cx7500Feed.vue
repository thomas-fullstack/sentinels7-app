<template>

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
                                <ion-badge class="color-full-green">O</ion-badge
                                ></span
                              >
                    <span v-else-if="item.value === 'Not Available'">{{ item.alias }}:
                                <b class="color-text-black">{{ item.value }}</b>
                                <ion-badge class="color-full-black"
                                >O</ion-badge
                                ></span
                    >
                    <span v-else-if="item.value === 'Key in Manual'">{{ item.alias }}:
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
                    v-if="canControl"
                    @click="$emit('openControlModal',item)"
                    size="small"
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

</template>

<script>
import {
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardSubtitle,
  IonBadge,
} from "@ionic/vue";
export default {
  emits: ["openControlModal"],

  components: {
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardSubtitle,
    IonBadge,
  },
  name: "Cx7500Feed",
  props:['latestDevicesCx7500Feed','canControl']
}
</script>

<style scoped>

.collapsiblecx7500:after {
  content: "\2796"; /* Unicode character for "minus" sign (-) */
  font-size: 13px;
  color: white;
  float: right;
  margin-left: 5px;
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

/* Style the collapsible content. Note: hidden by default */
.contentcx7500 {
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #f1f1f1;
  max-height: 500px;
}

.activecx7500:after {
  content: "\02795"; /* Unicode character for "plus" sign (+) */
}
</style>