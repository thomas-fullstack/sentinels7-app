<template>
<ion-page>
<ion-content>
  <ion-grid>
      <ion-row color="primary" class="ion-align-items-center ion-justify-content-center">
        <ion-col size-md="6" size-lg="5" size-xs="12">
  <form @submit.prevent="login" v-on:keyup.enter="login">
      <ion-card>
        <ion-item>
          <h3>Please Sign In!</h3>
        </ion-item>
        <ion-item >
          <div :class="{ error: v$.email.$errors.length }">
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" id="email" required></ion-input>
            <div class="input-errors"  v-bind:key="index" v-for="(error, index) of v$.email.$errors">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
        </ion-item>

        <ion-item >
          <div :class="{ error: v$.password.$errors.length }">
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" v-model="password" id="password" required></ion-input>
            <div class="input-errors"  v-bind:key="index" v-for="(error, index) of v$.password.$errors">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
        </ion-item>

        <ion-item>
          <ion-button size="medium" :disabled="v$.email.$errors.length > 0 || v$.password.$errors.length > 0" color="success" type="submit" >
            Sign In
          </ion-button>
        </ion-item>
      </ion-card>
    </form>
     </ion-col>
      </ion-row>
    </ion-grid>
</ion-content>
</ion-page>
</template>

<script>
import { IonCol, IonRow, IonGrid, IonPage, IonContent, IonCard, IonItem, IonLabel, IonButton, IonInput, toastController } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios';
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default defineComponent({
  components: { IonCol, IonRow, IonGrid, IonPage, IonContent, IonCard, IonItem, IonLabel, IonButton, IonInput },
  setup() {
    return { v$: useVuelidate() };
  },
  validations () {
    return {
    email: { required, email, $autoDirty: true },
    password: { required, $autoDirty: true }
    };
  },
  data() {
    return {
      email: null,
      password: null,
      sentinels7ServerApiLoginUrl: '',
      sentinels7FeedApiUrl: ''
    };
  },
  methods: {
    async openToast(msg, color) {
      const toast = await toastController
        .create({
          message: msg,
          duration: 2000,
          position: 'top',
          color: color
        })
      return toast.present();
    },
    login: function () {
        if(this.email && this.password) {
          const requestParams = {
            "username": this.email,
            "password": this.password
          }
          let headers = { 
                  "content-type": "application/json"
          };
          axios.post(this.sentinels7ServerApiLoginUrl, requestParams,{ headers })
          .then(
              response => {
                if(response && response.data && response.data.status === 'success')
                {
                  const requestParamsCompany = {
                    "email": this.email
                  }
                  
                  headers = { 
                          "content-type": "application/json",
                          "Authorization": response.data.id_token
                  };
                  axios.post(this.sentinels7FeedApiUrl, requestParamsCompany,{ headers })
                  .then(
                    response2 => {
                      console.log(response2)
                      if(response2 && response2.data && response2.data.company_name)
                        {
                            this.openToast("Sign In Successful!", "success")
                            const user = {
                              email: this.email,
                              company: response2.data.company_name,
                              userAppConfig: response2.data.user_app_config,
                              idToken: response.data.id_token,
                              refreshToken: response.data.refresh_token
                            }
                            localStorage.setItem('user', JSON.stringify(user));
                            this.$router.push({ path: '/overview' })
                            setTimeout(function() {
                              location.reload()
                            }, 200);
                            
                        }
                      else {
                        console.log("Not Working")
                      }
                    }
                  )

                } else {
                  console.log(response)
                  this.openToast("Sign In Failed: " + response.data.msg , "danger")
                }
              }
          )
          // this.$store.dispatch('login', { email, password }).then(() => this.$router.push('/'))

        }
      }
  },
  mounted() {
    // If url contains dev or localhost point API calls to dev
    if(window.location.href.includes('dev.') || window.location.href.includes('localhost')){
      this.sentinels7ServerApiLoginUrl = 'https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/oauth/token'
      this.sentinels7FeedApiUrl = 'https://ch0ufg0209.execute-api.us-east-1.amazonaws.com/dev-sentinels7/feed'
    } else { // Point API calls to prod
      this.sentinels7ServerApiLoginUrl = 'https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/oauth/token'
      this.sentinels7FeedApiUrl = 'https://zj9ih8yjcj.execute-api.us-east-1.amazonaws.com/sentinels7/feed'
    }
  }
});
</script>

<style scoped>
.error-msg{
  color: red
}

</style>