

The new Twitter v1.1 APIs requires your app to authenticate before accessing resources. First, you need to get the credentials needed to request access by using OAuth 2.0. Then, you will store them securely in the app settings for your mobile service.

1. If you haven't already done so, complete the steps in the topic <a href="/en-us/documentation/articles/mobile-services-how-to-register-twitter-authentication/" target="_blank">Register your apps for Twitter login with Mobile Services</a>. 
  
  	Twitter generates the credentials needed to enable you to access Twitter v1.1 APIs. You can get these credentials from the Twitter Developers web site. 

2. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268300" target="_blank">Twitter Developers</a> web site, sign-in with your Twitter account credentials, navigate to **My Applications**, and select your Twitter app.

    ![](./media/mobile-services-register-twitter-access/mobile-twitter-my-apps.png)

3. In the **Details** tab for the app, make a note of the following values:

	+ **Consumer key**
	+ **Consumer secret**
	+ **Access token**
	+ **Access token secret**

	![](./media/mobile-services-register-twitter-access/mobile-twitter-app-secrets.png)

4. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

5. Click the **Identity** tab, enter the **Consumer key** and **Consumer secret** values obtained from Twitter, and click **Save**. 

	![](./media/mobile-services-register-twitter-access/mobile-identity-tab-twitter-only.png)

2. Click the **Configure** tab, scroll down to **App settings** and enter a **Name** and **Value** pair for each of the following that you obtained from the Twitter site, then click **Save**.

	+ `TWITTER_ACCESS_TOKEN`
	+ `TWITTER_ACCESS_TOKEN_SECRET`

	![](./media/mobile-services-register-twitter-access/mobile-schedule-job-app-settings.png)

	This stores the Twitter access token in app settings. Like the consumer credentials on the **Identity** tab, the access credentials are also stored encrypted in app settings, and you can access them in your server scripts without hard-coding them in the script file. For more information, see [App settings].

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Register your apps for Twitter login with Mobile Services]: /en-us/documentation/articles/mobile-services-how-to-register-twitter-authentication
[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[App settings]: http://msdn.microsoft.com/en-us/library/windowsazure/b6bb7d2d-35ae-47eb-a03f-6ee393e170f7