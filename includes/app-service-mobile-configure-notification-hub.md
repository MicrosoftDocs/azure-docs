App Service Mobile Apps uses [Notification Hubs] to send pushes, so you will be configuring a notification hub for your mobile app.

1. In the [Azure Portal], go to **Browse** > **App Services**, then click your app backend. Under **Settings**, click **App Service Push**.
2. Click **Configure** to configure a notification hub. You can either create a hub or connect to an existing one.
   
    ![](./media/app-service-mobile-create-notification-hub/configure-hub-flow.png)

Now you have connected a notification hub to your Mobile App backend. Later you will configure this notification hub to connect to a platform notification system (PNS) to push to devices.

[Azure Portal]: https://portal.azure.com/
[Notification Hubs]: https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-push-notification-overview/