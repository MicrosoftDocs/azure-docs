
1. In the [Azure portal](https://portal.azure.com/), click **Browse All** > **App Services** > your Mobile App backend. Under **Settings**, click on **App Service Push**, then click your notification hub name.

2. Go to **Windows (WNS)**, enter the **Security key** (client secret) and **Package SID** that you obtained from the Live Services site, then click **Save**.

    ![Set the WNS key in the portal](./media/app-service-mobile-configure-wns/mobile-push-wns-credentials.png)

Your backend is now configured to use WNS to send push notifications.
