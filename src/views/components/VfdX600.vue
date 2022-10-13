<template>
  <div
      v-for="(feedItemValue, feedItemKey) in DevicesVfdX600Feed"
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
                    <span v-else>
                      {{ item.alias }}:
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
                    v-if="canControl"
                    @click="$emit('openVfdControlModal',item)"
                    size="small"
                    shape="round"
                >Control</ion-button>
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
  emits: ["openVfdControlModal"],
  components: {
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardSubtitle,
    IonBadge,
  },
  name: "VfdX600",
  props:['DevicesVfdX600Feed','canControl']
}
</script>

<style scoped>

</style>