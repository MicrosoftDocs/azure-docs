
1. In the [Azure Portal]( https://azure.portal.com/), click **Browse** > **App Services**, then click your Mobile App backend > **All settings**, then under **Mobile** click **Push**.

2. In Push notification services, click **Windows (WNS)**, enter the **Security key** (client secret) and **Package SID** that you obtained from the Live Services site, then click **Save**.

    ![Set the GCM API key in the portal](./media/app-service-mobile-configure-wns/mobile-push-wns-credentials.png)

Your Mobile App backend is now configured to use WNS to send push notifications to your Windows app using its notification hub.
