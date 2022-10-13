<template>
<singleCategory v-for="(devices,categoryName) in devicesCategory" :key="categoryName"
:category-name="categoryName" :devices="devices"
/>
</template>
<script>
import {defineComponent} from "vue";
import axios from "axios";
import singleCategory from "@/views/components/singleCategory";
export  default defineComponent({
components:{singleCategory},
  data(){
    return {
      active:true,

      deviceFeedUrl:"",
      devicesCategory:[],
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
    groupBy: function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    checkDeviceHasPermission(deviceId){
      const config =this.userDetails.userAppConfig;
      const filterUserDevices = config.filter(item=>item.key==='filter_user_devices')[0]

      const permittedDevices = filterUserDevices.value.split(',').map(item=>parseInt(item,10))
      return permittedDevices.includes(deviceId);
 
    },
    async getDeviceData(){
      this.refreshInProgress = true;
      try{
        const headers = this.getApiHeaders();
        // eslint-disable-next-line
        const requestParams = { client_name: this.userDetails.company };

        const result = await axios.post(this.deviceFeedUrl, requestParams, { headers });
        if(result.status === 200){
          if(result.data.includes('errorMessage')){
            this.openToast(result.data.errorMessage)

            return ;
          }
          const sortedDevices = result.data.sort(
              (a, b) => a.device_order - b.device_order
          );

          //get permitted device
          const permitted = sortedDevices.filter(item=>this.checkDeviceHasPermission(item.device_id))
          this.devicesCategory = this.groupBy(permitted,'category_name');
        }

      }catch (e) {
        //console.error(e);
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