---
 title: include file
 description: include file
 services: notification-hubs
 author: jwargo
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 01/17/2019
 ms.author: jowargo
 ms.custom: include file
---

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** on the left menu, and select **Notification Hubs** in the **Mobile** section. Select star (`*`) next to the service name to add it to the **FAVORITES** section on the left menu. After **Notification Hubs** is added to **FAVORITES**, select it on the left menu. 

      ![Azure portal - select Notification Hubs](./media/notification-hubs-portal-create-new-hub/all-services-select-notification-hubs.png)
3. On the **Notification Hubs** page, select **Add** on the toolbar. 

      ![Notification Hubs - Add toolbar button](./media/notification-hubs-portal-create-new-hub/add-toolbar-button.png)
4. On the **Notification Hub** page, do the following steps: 
    1. Specify a **name** for the notification **hub**.  
    2. Specify a **name** for the **namespace**. A namespace contains one or more hubs. 
    3. Select a **location** in which you want to create the notification hub. 
    4. Select an existing resource group or enter a name for the new **resource group**.
    5. Select **Create**. 

        ![Azure portal - set notification hub properties](./media/notification-hubs-portal-create-new-hub/notification-hubs-azure-portal-settings.png)
4. Select **Notifications** (Bell icon), and select **Go to resource**. You can also refresh the list in the **Notification Hubs** page, and select your notification hub. 

      ![Azure portal - notifications -> Go to resource](./media/notification-hubs-portal-create-new-hub/go-to-notification-hub.png)
5. Select **Access Policies** from the list. Note the two connection strings that are available to you. You need them to handle push notifications later.

      >[!IMPORTANT]
      >Do **NOT** use the DefaultFullSharedAccessSignature in your application. This is meant to be used in your back-end only.
      >

      ![Azure portal - notification hub connection strings](./media/notification-hubs-portal-create-new-hub/notification-hubs-connection-strings-portal.png)
