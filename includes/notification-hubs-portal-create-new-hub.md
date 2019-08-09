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

1. Select **All services** on the left menu, and then select **Notification Hubs** in the **Mobile** section. Select the star icon next to the service name to add the service to the **FAVORITES** section on the left menu. After you add **Notification Hubs** to **FAVORITES**, select it on the left menu.

      ![Azure portal - select Notification Hubs](./media/notification-hubs-portal-create-new-hub/all-services-select-notification-hubs.png)

1. On the **Notification Hubs** page, select **Add** on the toolbar.

      ![Notification Hubs - Add toolbar button](./media/notification-hubs-portal-create-new-hub/add-toolbar-button.png)

1. On the **Notification Hub** page, do the following steps:

    1. Enter a name in **Notification Hub**.  

    1. Enter a name in **Create a new namespace**. A namespace contains one or more hubs.

    1. Select a value from the **Location** drop-down list box. This value specifies the location in which you want to create the hub.

    1. Select an existing resource group in **Resource Group**, or create a name for a new resource group.

    1. Select **Create**.

        ![Azure portal - set notification hub properties](./media/notification-hubs-portal-create-new-hub/notification-hubs-azure-portal-settings.png)

1. Select **Notifications** (the bell icon), and then select **Go to resource**. You can also refresh the list on the **Notification Hubs** page and select your hub.

      ![Azure portal - notifications -> Go to resource](./media/notification-hubs-portal-create-new-hub/go-to-notification-hub.png)

1. Select **Access Policies** from the list. Note that the two connection strings are available to you. You'll need them later to handle push notifications.

      >[!IMPORTANT]
      >Do *not* use the **DefaultFullSharedAccessSignature** policy in your application. This is meant to be used in your back end only.
      >

      ![Azure portal - notification hub connection strings](./media/notification-hubs-portal-create-new-hub/notification-hubs-connection-strings-portal.png)
