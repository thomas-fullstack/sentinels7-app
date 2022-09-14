<template>
  <div>
    <button @click="toggleCollapse" type="button" class="collapsible" >
      {{categoryName}}
    </button>
    <div v-if="active" class="content">
      <ion-card v-for="device in devices" :key="device.device_alias">
        <ion-card-header>
          <ion-card-subtitle>Device Name: {{device.device_alias}}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div style="margin-top: 10px">
            <div v-for="data in device.device_feed.holding_registers" :key="data.alias.replaceAll(' ','_')">
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
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonSpinner } from '@ionic/vue';

export  default defineComponent({
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent
  },
  name: "singleCategory",
  props:['categoryName','devices'],
  data(){
    return {
      active:false,
      deviceName:"",
    }},
  methods:{
    toggleCollapse(e){
      this.active =!this.active;
      e.target.classList.toggle("active")
    },
  }
})

</script>

<style>

.active:after {
  content: "\2796"; /* Unicode character for "minus" sign (-) */

}
.collapsible:hover {
  background-color: #ccc;
}
.collapsible:after {
  content: "\02795"; /* Unicode character for "plus" sign (+) */
  font-size: 13px;
  color: white;
  float: right;
  margin-left: 5px;
}

.collapsible {
  margin-top: 10px;
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
.content {
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #f1f1f1;
  max-height: 500px;
}
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