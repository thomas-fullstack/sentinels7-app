<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{deviceName}}</ion-card-title>
      <ion-card-subtitle>Device Details</ion-card-subtitle>
    </ion-card-header>
    <div v-if="refreshInProgress" class="loader-container">
      <ion-spinner name="circles"/>
    </div>
    <ion-card-content v-else>
      <div style="margin-top: 10px">
        <div v-for="data in feed" :key="data.alias.replaceAll(' ','_')">
          <div class="c-details">
            <div>
              {{data.alias}}
            </div>
            <div v-if="!Array.isArray(data.unit) || !data.unit.length">
              {{data.value}} {{data.unit}}
            </div>
            <div v-else>
              <div v-if="data.type==='bool'">
                <span :style="{color:parseInt(data.value)===0?'red':'green'}"><b>{{data.unit[data.value]}}</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>
<style>
.c-details{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 2px;
}
.loader-container{
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
</style>
<script>
import {defineComponent} from "vue";
import axios from "axios";
import {IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonSpinner } from '@ionic/vue';

export  default defineComponent({
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner
  },
  data(){
    return {
      deviceName:"",
      deviceFeedUrl:"",
      feed:[],
      refreshInProgress:false,
      userDetails: {}
    }
  },
  mounted() {
    if (
        window.location.href.includes("dev.") ||
        window.location.href.includes("localhost")
    ) {
      this.deviceFeedUrl = 'https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/external'
    }

    if (localStorage.getItem("user")) {
      this.userDetails = JSON.parse(localStorage.getItem("user"));
    }

    this.getDeviceData();
  },
  methods:{
    async getDeviceData(){
      this.refreshInProgress = true;
      try{
        const headers = this.getApiHeaders();
        // eslint-disable-next-line
        const requestParams = { client_name: this.userDetails.company };

        const result = await axios.post(this.deviceFeedUrl, requestParams, { headers });
        if(result.status === 200){
          const data = result.data.device_feed.holding_registers;
          this.deviceName = result.data.category_name;
          this.feed = data.sort((a,b)=>a.order - b.order);
        }

      }catch (e) {
        console.error(e);
      }finally {
        this.refreshInProgress = false;
      }
    },
    getApiHeaders: function () {
      const authToken = "Bearer " + this.userDetails.idToken;
      const headers = {
        "content-type": "application/json",
        Authorization: authToken,
      };
      return headers;
    },
  }
})
</script>