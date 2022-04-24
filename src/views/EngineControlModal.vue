<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-card-subtitle>Start Engine: <ion-button color="success" v-on:click="presentAlertConfirmEngineStart">Start</ion-button></ion-card-subtitle>
      <ion-card-subtitle>Stop Engine: <ion-button color="danger" v-on:click="presentAlertConfirmEngineStop">Stop</ion-button></ion-card-subtitle>
      <br/>
      <ion-card-subtitle>Engine Speed (in RPM): 
          <ion-card-subtitle v-if="selectedItem.device_feed.holding_registers.length > 1">Current Engine Speed: {{selectedItem.device_feed.holding_registers[3].value}} <span v-if="selectedItem.device_feed.holding_registers[3].value != 'Not Available'">{{selectedItem.device_feed.holding_registers[3].unit}}</span></ion-card-subtitle>
          <ion-input type="number" v-model="engineSpeed" min="800" max="2000" ></ion-input>
          <ion-button v-on:click="setEngineSpeed">Set RPM</ion-button>
      </ion-card-subtitle>
    <ion-button v-on:click="closeModal">Close</ion-button>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCardSubtitle, alertController, modalController, toastController, IonInput } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Modal',
  props: {
    title: { type: String, default: 'Super Modal' },
    userDetails: {},
    selectedItem: {},
    sentinels7FeedApiUrl: null
  },
  data() {
    return {
      content: 'Content',
      engineSpeed: 800
    }
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
    closeModal() {
        modalController.dismiss()
    },
    getApiHeaders: function() {
      const authToken = 'Bearer ' + this.userDetails.idToken
      const headers = { 
              "content-type": "application/json",
              "Authorization": authToken
      };
      return headers
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
    startEngine: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "engine_start":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine start command issued")
                this.openToast("Engine start command issued")
        })
    },
    stopEngine: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "engine_stop":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Engine stop command issued")
                this.openToast("Engine stop command issued")
        })
    },
    setEngineSpeed: function() {
        if(this.engineSpeed >= 800 && this.engineSpeed <= 2000)
        {
          // console.log(this.engineSpeed)
          // console.log(setSpeedVal)
            const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "engine_speed":this.engineSpeed};
            const headers = this.getApiHeaders()
            axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
            .then(
                response => {
                    console.log("Engine speed set command issued at: " + this.engineSpeed + " RPM")
                    this.openToast("Engine speed set command issued at: " + this.engineSpeed + " RPM")
            })
        } else{
          this.openToast("Error: Engine speed should should be set between 800 and 2000 RPM")
        }
      
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCardSubtitle, IonInput }
});
</script>
<style scoped>
ion-title{
    color: white;
}
ion-input{
  border: solid 1px black;
  max-width: 200px;
}
</style>