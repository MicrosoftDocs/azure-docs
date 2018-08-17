---
 title: include file
 description: include file
 services: notification-hubs
 author: spelluru
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 03/28/2018
 ms.author: spelluru
 ms.custom: include file
---

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** > **Mobile** > **Notification Hub**.
   
      ![Azure portal - create a notification hub](./media/notification-hubs-portal-create-new-hub/notification-hubs-azure-portal-create.png)
      
1. In the **Notification Hub** box, type a unique name. Select your **Region**, **Subscription**, and **Resource Group** (if you have one already). 
   
      If you don't already have a service bus namespace, you can use the default name, which is created based on the hub name (if the namespace name is available).
    
      If you already have a service bus namespace that you want to create the hub in, follow these steps

    a. In the **Namespace** area, select the **Select Existing** link. 
   
    b. Select **Create**.
   
      ![Azure portal - set notification hub properties](./media/notification-hubs-portal-create-new-hub/notification-hubs-azure-portal-settings.png)

1. Select **Notifications** (Bell icon), and select **Go to resource**. 

      ![Azure portal - notifications -> Go to resource](./media/notification-hubs-portal-create-new-hub/notification-go-to-resource.png)    
1. Select **Access Policies** from the list. Note the two connection strings that are available to you. You need them to handle push notifications later.

      >[!IMPORTANT]
      >Do **NOT** use the DefaultFullSharedAccessSignature in your application. This is meant to be used in your back-end only.
      >
   
      ![Azure portal - notification hub connection strings](./media/notification-hubs-portal-create-new-hub/notification-hubs-connection-strings-portal.png)

