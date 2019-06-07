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

1. Select **All services** on the left menu, and then select **Notification Hubs** in the **Mobile** section. Select **\*** next to the service name to add it to the **FAVORITES** section on the left menu. After **Notification Hubs** is added to **FAVORITES**, select it on the left menu. 

      ![Azure portal - select Notification Hubs](./media/notification-hubs-portal-create-new-hub/all-services-select-notification-hubs.png)

1. On the **Notification Hubs** window, select **Add** on the toolbar.

      ![Notification Hubs - Add toolbar button](./media/notification-hubs-portal-create-new-hub/add-toolbar-button.png)

1. On the **Notification Hub** window, do the following steps:

    1. Enter a name in **Notification Hub**.  

    1. Enter a name in **Create a new namespace**. A namespace contains one or more hubs.

    1. Select a value from the **Location** drop-down list box. This value specifies the location in which you want to create the notification hub.

    1. Select an existing resource group in **Resource Group**, or create a name for a new resource group.

    1. Select **Create**.

        ![Azure portal - set notification hub properties](./media/notification-hubs-portal-create-new-hub/notification-hubs-azure-portal-settings.png)

1. Select **Notifications** (the bell-shaped icon), and then select **Go to resource**. You can also refresh the list in the **Notification Hubs** page, and then select your notification hub.

      ![Azure portal - notifications -> Go to resource](./media/notification-hubs-portal-create-new-hub/go-to-notification-hub.png)

1. Select **Access Policies** from the list. Note the two connection strings that are available to you. You will later need them to handle push notifications.

      >[!IMPORTANT]
      >Do *not* use the **DefaultFullSharedAccessSignature** policy in your application. This is meant to be used in your backend only.
      >

      ![Azure portal - notification hub connection strings](./media/notification-hubs-portal-create-new-hub/notification-hubs-connection-strings-portal.png)
