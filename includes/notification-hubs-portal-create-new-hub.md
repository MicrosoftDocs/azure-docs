---
 title: include file
 description: include file
 services: notification-hubs
 author: sethmanheim
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 09/07/2021
 ms.author: sethm
 ms.custom: include file
---

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** on the left menu, and then select **Notification Hubs** in the **Mobile** section. Select the star icon next to the service name to add the service to the **FAVORITES** section on the left menu. After you add **Notification Hubs** to **FAVORITES**, select it on the left menu.

      ![Azure portal - select Notification Hubs](./media/notification-hubs-portal-create-new-hub/all-services-select-notification-hubs.png)

1. On the **Notification Hubs** page, select **Create** on the toolbar.

      ![Notification Hubs - Add toolbar button](./media/notification-hubs-portal-create-new-hub/create-toolbar-button.png)

1. In the **Basics** tab on the **Notification Hub** page, do the following steps:

    1. In **Subscription**, select the name of the Azure subscription you want to use, and then select an existing resource group, or create a new one.  

    1. Enter a unique name for the new namespace in **Namespace Details**. 
    
    1. A namespace contains one or more notification hubs, so type a name for the hub in **Notification Hub Details**. Or, select an existing namespace from the drop-down.

    1. Select a value from the **Location** drop-down list box. This value specifies the location in which you want to create the hub.

    1. Select **Create**.

        ![Azure portal - set notification hub properties](./media/notification-hubs-portal-create-new-hub/notification-hubs-azure-portal-settings.png)

1. Select **Notifications** (the bell icon), and then select **Go to resource**. You can also refresh the list on the **Notification Hubs** page and select your hub.

      ![Azure portal - go to resource](./media/notification-hubs-portal-create-new-hub/go-to-notification-hub.png)

1. Select **Access Policies** from the list. Note that the two connection strings are available to you. You'll need them later to handle push notifications.

      >[!IMPORTANT]
      >Do *not* use the **DefaultFullSharedAccessSignature** policy in your application. This is meant to be used in your back end only.
      >

      ![Azure portal - notification hub connection strings](./media/notification-hubs-portal-create-new-hub/notification-hubs-connection-strings-portal.png)
