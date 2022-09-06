<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>new device</ion-card-title>
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

export  default defineComponent({
  data(){
    return {
      deviceFeedUrl:"",
      feed:[],
      refreshInProgress:false
    }
  },
  mounted() {
    if (
        window.location.href.includes("dev.") ||
        window.location.href.includes("localhost")
    ) {
      this.deviceFeedUrl = "http://127.0.0.1:3000/data"
    }
    this.getDeviceData();
  },
  methods:{
    async getDeviceData(){
      this.refreshInProgress = true;
      try{
        const {status, data} =await axios.get(this.deviceFeedUrl);
        if(status===200){
          this.feed = data.sort((a,b)=>a.order - b.order);
        }
      }catch (e) {
        console.error(e);
      }finally {
        this.refreshInProgress = false;
      }
    }
  }
})
</script>