<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-card-subtitle>Start Motor: <ion-button color="success" v-on:click="presentAlertConfirmMotorStart">Start</ion-button></ion-card-subtitle>
    <ion-card-subtitle>Stop Motor: <ion-button color="danger" v-on:click="presentAlertConfirmMotorStop">Stop</ion-button></ion-card-subtitle>
    <br/>
    <ion-card-subtitle>Mode: <ion-button v-on:click="setAutoMode">Auto</ion-button><ion-button v-on:click="setManualMode">Manual</ion-button></ion-card-subtitle>
    <br/>
    <ion-card-subtitle><ion-button color="warning" v-on:click="setFaultReset">Fault Reset</ion-button></ion-card-subtitle>
    <br/>
    <ion-card-subtitle v-if="selectedItem.device_feed.holding_registers.length > 1">Manual Speed (Set Hz): {{selectedItem.device_feed.holding_registers[6].value}} <span v-if="selectedItem.device_feed.holding_registers[6].value != 'Not Available'">{{selectedItem.device_feed.holding_registers[6].unit}}</span></ion-card-subtitle>
    <ion-card-subtitle>Motor Speed (Actual Hz): 
        <ion-card-subtitle v-if="selectedItem.device_feed.holding_registers.length > 1">Current Motor Speed: {{selectedItem.device_feed.holding_registers[0].value}} <span v-if="selectedItem.device_feed.holding_registers[0].value != 'Not Available'">{{selectedItem.device_feed.holding_registers[0].unit}}</span></ion-card-subtitle>
        <ion-input type="number" v-model.number="motorSpeed" min="0" max="60" ></ion-input>
        <ion-button v-on:click="setMotorSpeed">Set Motor Speed</ion-button>
    </ion-card-subtitle>
    <br/>
    <ion-card-subtitle>Target Setpoint: 
          <ion-card-subtitle v-if="selectedItem.device_feed.holding_registers.length > 1">Current Target: {{selectedItem.device_feed.holding_registers[8].value}} <span v-if="selectedItem.device_feed.holding_registers[8].value != 'Not Available'">{{selectedItem.device_feed.holding_registers[8].unit}}</span></ion-card-subtitle>
          <ion-input type="number" v-model.number="targetSetpoint" min="0"></ion-input>
          <ion-button v-on:click="setTargetSetpoint">Set Target Setpoint</ion-button>
    </ion-card-subtitle>
    <br/>
    <ion-card-subtitle>High Pressure Limit: 
          <ion-card-subtitle v-if="selectedItem.device_feed.holding_registers.length > 1">Current High Limit: {{selectedItem.device_feed.holding_registers[9].value}} <span v-if="selectedItem.device_feed.holding_registers[9].value != 'Not Available'">{{selectedItem.device_feed.holding_registers[9].unit}}</span></ion-card-subtitle>
          <ion-input type="number" v-model.number="highPressureLimit" min="0"></ion-input>
          <ion-button v-on:click="setHighPressureLimit">Set High Pressure Limit</ion-button>
    </ion-card-subtitle>
    <br/>
    <ion-card-subtitle>High Pressure Shutdown: 
          <ion-card-subtitle v-if="selectedItem.device_feed.holding_registers.length > 1">Current High Shutdown: {{selectedItem.device_feed.holding_registers[7].value}} <span v-if="selectedItem.device_feed.holding_registers[7].value != 'Not Available'">{{selectedItem.device_feed.holding_registers[7].unit}}</span></ion-card-subtitle>
          <ion-input type="number" v-model.number="highPressureShutdown" min="0"></ion-input>
          <ion-button v-on:click="setHighPressureShutdown">Set High Pressure Shutdown</ion-button>
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
      motorSpeed: 0,
      targetSetpoint: 0,
      highPressureLimit: 0,
      highPressureShutdown: 0
    }
  },
  methods: {
    async presentAlertConfirmMotorStart() {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Confirmation',
          message: 'Are you sure you want to<strong> START the Motor?</strong>',
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
                this.startMotor()
                // console.log('Confirm Okay')
              },
            },
          ],
        });
      return alert.present();
    },
    async presentAlertConfirmMotorStop() {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Confirmation',
          message: 'Are you sure you want to<strong> STOP the Motor?</strong>',
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
                this.stopMotor()
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
    startMotor: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "motor_start":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Motor start command issued")
                this.openToast("Motor start command issued")
        })
    },
    stopMotor: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "motor_stop":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Motor stop command issued")
                this.openToast("Motor stop command issued")
        })
    },
    setAutoMode: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "auto_mode":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Motor auto mode command issued")
                this.openToast("Motor auto mode command issued")
        })
    },
    setManualMode: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "manual_mode":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Motor manual mode command issued")
                this.openToast("Motor manual mode command issued")
        })
    },
    setFaultReset: function() {
        const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "fault_reset":true};
        const headers = this.getApiHeaders()
        axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
        .then(
            response => {
                console.log("Motor fault reset command issued")
                this.openToast("Motor fault reset command issued")
        })
    },
    setMotorSpeed: function() {
        if(this.motorSpeed >= 0 && this.motorSpeed <= 60)
        {
          // console.log(this.motorSpeed)
          // console.log(setSpeedVal)
            const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "motor_speed":this.motorSpeed};
            const headers = this.getApiHeaders()
            axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
            .then(
                response => {
                    console.log("Motor speed set command issued at: " + this.motorSpeed + " Hz")
                    this.openToast("Motor speed set command issued at: " + this.motorSpeed + " Hz")
            })
        } else{
          this.openToast("Error: Motor speed should should be set between 0 and 60 Hz")
        }
      
    },
    setTargetSetpoint: function() {
        if(this.targetSetpoint >= 0)
        {
          // console.log(this.motorSpeed)
          // console.log(setSpeedVal)
            const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "target_setpoint":this.targetSetpoint};
            const headers = this.getApiHeaders()
            axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
            .then(
                response => {
                    console.log("Target Setpoint set command issued at: " + this.targetSetpoint + " PSI")
                    this.openToast("Target Setpoint set command issued at: " + this.targetSetpoint + " PSI")
            })
        } else{
          this.openToast("Error: Cannot set Target Setpoint. Invalid setter.")
        }
      
    },
    setHighPressureLimit: function() {
        if(this.highPressureLimit >= 0)
        {
          // console.log(this.motorSpeed)
          // console.log(setSpeedVal)
            const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "high_pressure_limit":this.highPressureLimit};
            const headers = this.getApiHeaders()
            axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
            .then(
                response => {
                    console.log("High Pressure Limit set command issued at: " + this.highPressureLimit + " Hz")
                    this.openToast("High Pressure Limit set command issued at: " + this.highPressureLimit + " Hz")
            })
        } else{
          this.openToast("Error: Cannot set High Pressure Limit. Invalid setter.")
        }
      
    },
    setHighPressureShutdown: function() {
        if(this.highPressureShutdown >= 0)
        {
          // console.log(this.motorSpeed)
          // console.log(setSpeedVal)
            const requestParams = {"device_name": this.selectedItem.device_alias, "client_name": this.userDetails.company, "high_pressure_shutdown":this.highPressureShutdown};
            const headers = this.getApiHeaders()
            axios.post(this.sentinels7FeedApiUrl, requestParams,{ headers })
            .then(
                response => {
                    console.log("High Pressure Shutdown set command issued at: " + this.highPressureShutdown + " PSI")
                    this.openToast("High Pressure Shutdown set command issued at: " + this.highPressureShutdown + " PSI")
            })
        } else{
          this.openToast("Error: Cannot set High Pressure Shutdown. Invalid setter.")
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