The Mobile Apps feature of Azure App Service uses [Azure Notification Hubs] to send pushes, so you will be configuring a notification hub for your mobile app.

1. In the [Azure portal], go to **App Services**, and then click your app back end. Under **Settings**, click **Push**.
2. Click **Connect** to add a notification hub resource to the app. You can either create a hub or connect to an existing one.

    ![](./media/app-service-mobile-create-notification-hub/configure-hub-flow.png)

Now you have connected a notification hub to your Mobile Apps back-end project. Later you will configure this notification hub to connect to a platform notification system (PNS) to push to devices.

[Azure portal]: https://portal.azure.com/
[Azure Notification Hubs]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-push-notification-overview/
