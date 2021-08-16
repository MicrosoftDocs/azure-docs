---
 title: include file
 description: include file
 services: notification-hubs
 author: spelluru
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 04/06/2018
 ms.author: spelluru
 ms.custom: include file
---

1. Navigate to the [Google Cloud Console](https://console.developers.google.com/cloud-resource-manager), sign in with your Google account credentials. 
2. Select **Create Project** on the toolbar. 
   
    ![Create new project](./media/mobile-services-enable-google-cloud-messaging/mobile-services-google-new-project.png)   
3. For **Project name**, enter a name for your project, and click **Create**.
4. Select the **alerts** button on the toolbar, and select your project in the list. You see the dashboard for your project. You can also navigate directly to the dashboard by using the URL: `https://console.developers.google.com/home/dashboard?project=<YOUR PROJECT NAME>`

    ![Select your project in alerts](./media/mobile-services-enable-google-cloud-messaging/alert-new-project.png)
5. Note down the **Project number** in the **Project info** tile of the dashboard. 

    ![Project ID](./media/mobile-services-enable-google-cloud-messaging/project-number.png)
6. In the dashboard, on the **APIs** tile, select **Got to APIs overview**. 

    ![API overview link](./media/mobile-services-enable-google-cloud-messaging/go-to-api-overview.png)
7. On the **API** page, select **ENABLE APIS AND SERVICES**. 

    ![Enable APIs and Services button](./media/mobile-services-enable-google-cloud-messaging/enable-api-services-button.png)
8. Search for and select **Google Cloud Messaging**. 

    ![Search for and select Google Cloud Messaging](./media/mobile-services-enable-google-cloud-messaging/search-select-gcm.png)
9. To enable Google Cloud Messaging for the project, select **ENABLE**.

    ![Enable Google Cloud Messaging](./media/mobile-services-enable-google-cloud-messaging/enable-gcm-button.png)
10. Select **Create credentials** on the toolbar. 

    ![Create credentials button](./media/mobile-services-enable-google-cloud-messaging/create-credentials-button.png)
11. On the **Add credentials to your project** page, select **API key** link. 

    ![Add credentials](./media/mobile-services-enable-google-cloud-messaging/api-key-button.png)    
12. On **API key** page, select **Create/Save**. In the following example, the **IP addresses** option is selected, and **0.0.0.0/0** is entered for allowed IP addresses. You should restrict your API key appropriately. 

    ![API Key - Create button](./media/mobile-services-enable-google-cloud-messaging/api-key-create-button.png)
13. Copy the **API key** to the clipboard, and save it somewhere. 

    ![Copy API key](./media/mobile-services-enable-google-cloud-messaging/copy-api-key.png)
   
    You will use this API key value to enable Azure to authenticate with GCM and send push notifications on behalf of your app. To navigate back to the project dashboard, use the URL: `https://console.developers.google.com/home/dashboard?project=<YOUR PROJECT NAME>`

