
1. In the [Azure portal](https://portal.azure.com/), click **Browse All** > **App Services**, and click your Mobile Apps back end. Under **Settings**, click **App Service Push**, and then click your notification hub name.
2. Go to **Windows (WNS)**, enter the **Security key** (client secret) and **Package SID** that you obtained from the Live Services site, and then click **Save**.

    ![Set the WNS key in the portal](./media/app-service-mobile-configure-wns/mobile-push-wns-credentials.png)

Your back end is now configured to use WNS to send push notifications.
