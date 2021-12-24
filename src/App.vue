<template>
  <IonApp>
    <ion-header>
      <ion-buttons start >
        <ion-menu-button v-if="currentRouteName != '/login'"></ion-menu-button>
        <img class="sentinels7-logo" src="./assets/img/icon.png" alt="your image">
        <ion-toolbar>
            <ion-title v-if="!isSiteDev">SentinelS7 </ion-title>
            <ion-title class="ionbuttonsdev" color="red" v-else>SentinelS7 Development Site</ion-title>
            
        </ion-toolbar>
      </ion-buttons>
      
          
    </ion-header>
    <IonSplitPane content-id="main-content">
      <ion-menu v-if="currentRouteName != '/login'" content-id="main-content" type="overlay">
        
        <ion-content>
          <ion-list id="sentinels7-list">
            <ion-note>{{currentUserEmail}}</ion-note>
  
            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i;clickedMenuItem(p)" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
  
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </IonSplitPane>
  </IonApp>
</template>

<script lang="ts">
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonNote, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { archiveOutline, archiveSharp, bookmarkOutline, bookmarkSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, albumsSharp, albumsOutline, bookOutline, bookSharp, mapSharp, mapOutline,logOutOutline, logOut } from 'ionicons/icons';
import { authService } from './services/AuthService';

export default defineComponent({
  name: 'App',
  components: {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonApp, 
    IonContent, 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonMenu, 
    IonMenuButton,
    IonMenuToggle, 
    IonNote, 
    IonRouterOutlet, 
    IonSplitPane,
  },
  setup() {
    const selectedIndex = ref(0);
    const appPages = [
      {
        title: 'Overview',
        url: '/overview',
        iosIcon: mapOutline,
        mdIcon: mapSharp
      },
      {
        title: 'Logout',
        url: '/logout',
        iosIcon: logOutOutline,
        mdIcon: logOut
      }
    ];
    
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      selectedIndex.value = appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    
    const route = useRoute();
    
    return { 
      selectedIndex,
      appPages, 
      archiveOutline, 
      archiveSharp, 
      bookmarkOutline, 
      bookmarkSharp, 
      heartOutline, 
      heartSharp, 
      mailOutline, 
      mailSharp, 
      paperPlaneOutline, 
      paperPlaneSharp, 
      trashOutline, 
      trashSharp, 
      warningOutline, 
      warningSharp,
      isSelected: (url: string) => url === route.path ? 'selected' : ''
    }
  },
  computed: {
    currentRouteName() {
        return this.$route.path;
    }
  },
  methods: {
    clickedMenuItem(item: any) {
    console.log(item)
    if(item.title === 'Logout')
    {
      // remove user from local storage to log user out
      authService.logout()
      this.$router.push({ path: '/login' })
      location.reload()
    } else{
      setTimeout(function() {
                    location.reload()
                  }, 200);
    }
    }
  },
  mounted() {
    if (localStorage.getItem('user')) {
      this.userDetails = JSON.parse(localStorage.getItem('user'));
      this.currentUserEmail = JSON.parse(localStorage.getItem('user')).email;
      this.currentUserIsAdmin = this.userDetails.userAppConfig.find((x: any) => x.key === 'user_is_admin').value
      if(this.currentUserIsAdmin && this.currentUserIsAdmin === 'true'){
      this.appPages = [
      {
        title: 'Overview',
        url: '/overview',
        iosIcon: mapOutline,
        mdIcon: mapSharp
      },
      {
        title: 'Admin Devices',
        url: '/admindevices',
        iosIcon: albumsOutline,
        mdIcon: albumsSharp
      },
      {
        title: 'Reports',
        url: '/reports',
        iosIcon: bookOutline,
        mdIcon: bookSharp
      },
      {
        title: 'Logout',
        url: '/logout',
        iosIcon: logOutOutline,
        mdIcon: logOut
      }
    ];
      }
    }

    // If url contains dev or localhost point API calls to dev
    if(window.location.href.includes('dev.') || window.location.href.includes('localhost')){
      this.isSiteDev = true
    } else { 
      this.isSiteDev = false
    }
  },
  data() {
    return {
      currentUserEmail: null,
      userDetails: null,
      currentUserIsAdmin: null,
      isSiteDev: false
    };
  }
});
</script>

<style scoped>
ion-menu {
  width:200px;
}
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}

ion-split-pane{
  top:50px;
}

ion-buttons{
 background: rgb(52, 52, 60);
}

.ionbuttonsdev{
  color: red;
  font-weight: bold;
}

ion-menu-button{
  background: rgb(52, 52, 60);
  color: whitesmoke;
}
.sentinels7-logo{
  width:50px;
  height:50px;
}
ion-title{
  color:whitesmoke
}
</style>