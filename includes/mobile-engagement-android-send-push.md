
####Update manifest file to enable notifications

1. Copy the in-app messaging resources below into your Manifest.xml between the `<application>` and `</application>` tags.

		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementTextAnnouncementActivity" android:theme="@android:style/Theme.Light">
  			<intent-filter>
    			<action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
    			<category android:name="android.intent.category.DEFAULT" />
    			<data android:mimeType="text/plain" />
  			</intent-filter>
		</activity>
		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity" android:theme="@android:style/Theme.Light">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
				<category android:name="android.intent.category.DEFAULT" />
				<data android:mimeType="text/html" />
			</intent-filter>
		</activity>
		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementPollActivity" android:theme="@android:style/Theme.Light">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.POLL"/>
				<category android:name="android.intent.category.DEFAULT" />
			</intent-filter>
		</activity>
		<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementLoadingActivity" android:theme="@android:style/Theme.Dialog">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.LOADING"/>
				<category android:name="android.intent.category.DEFAULT"/>
			</intent-filter>
		</activity>
		<receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver" android:exported="false">
			<intent-filter>
				<action android:name="android.intent.action.BOOT_COMPLETED"/>
				<action android:name="com.microsoft.azure.engagement.intent.action.AGENT_CREATED"/>
				<action android:name="com.microsoft.azure.engagement.intent.action.MESSAGE"/>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.ACTION_NOTIFICATION"/>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.EXIT_NOTIFICATION"/>
				<action android:name="com.microsoft.azure.engagement.reach.intent.action.DOWNLOAD_TIMEOUT"/>
			</intent-filter>
		</receiver>
		<receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachDownloadReceiver">
			<intent-filter>
				<action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
			</intent-filter>
		</receiver>

###Specify an icon for notifications

Paste the following XML snippet in your Manifest.xml between the `<application>` and `</application>` tags.

		<meta-data android:name="engagement:reach:notification:icon" android:value="engagement_close"/>

This defines the icon that is displayed both in system and in-app notifications. It is optional for in-app notifications however mandatory for system notifications. Android will rejects system notifications with invalid icons.

Make sure you are using an icon that exists in one of the **drawable** folders (like ``engagement_close.png``). **mipmap** folder isn't supported.

>[AZURE.NOTE] You should not use the **launcher** icon. It has a different resolution and is usually in the mipmap folders, which we don't support.

For real apps, you can use an icon that is suitable for notifications per [Android design guidelines](http://developer.android.com/design/patterns/notifications.html).

>[AZURE.TIP] To be sure to use correct icon resolutions, you can look at [these examples](https://www.google.com/design/icons).
Scroll down to the **Notification** section, click an icon, and then click `PNGS` to download the icon drawable set. You can see what drawable folders with which resolution to use for each version of the icon.

##Create a Google Cloud Messaging project with API key

>[AZURE.NOTE] To complete this procedure, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.

1. Navigate to the [Google Cloud Console](https://console.developers.google.com/project) and sign-in with your Google account credentials, and then click **Create Project**.

   	![](./media/mobile-engagement-enable-google-cloud-messaging/new-project.png)   

   	![](./media/mobile-engagement-enable-google-cloud-messaging/new-project-2.png)   

2. Enter a project name, accept the terms of service, and click **Create**. If requested, carry out the SMS Verification, and click **Create** again.

3. Make a note of the project number in the **Projects** section. You will need it later in the tutorial to populate in the Android Manifest file. 

   	![](./media/mobile-engagement-enable-google-cloud-messaging/project-number.png)   

4. In the left column, expand **APIs & auth**, click **APIs** then scroll down and click **Cloud Messaging for Android**. Then on the next page click **Enable API** and accept the terms of service. 

	![](./media/mobile-engagement-enable-google-cloud-messaging/enable-GCM.png)

	![](./media/mobile-engagement-enable-google-cloud-messaging/enable-gcm-2.png)

5. Click **Credentials**, and then click **Add Credential**->**API Key** 

   	![](./media/mobile-engagement-enable-google-cloud-messaging/create-server-key.png)

6. In **Create a new key**, click **Server key**. In the next window click **Create**.

   	![](./media/mobile-engagement-enable-google-cloud-messaging/create-server-key5.png)


   	![](./media/mobile-engagement-enable-google-cloud-messaging/create-server-key6.png) 

7. Make a note of the **API KEY** value. You will use this API key value later to configure in the "Native Push" section.

###Enable your app to receive GCM push notifications

1. Paste the following into your Manifest.xml between the `<application>` and `</application>` tags after replacing the `project number` obtained from your Google Play console. The \n is intentional so make sure that you end the project number with it.

		<meta-data android:name="engagement:gcm:sender" android:value="************\n" />

2. Paste the code below into your Manifest.xml between the `<application>` and `</application>` tags. Replace the package name <Your package name>.

		<receiver android:name="com.microsoft.azure.engagement.gcm.EngagementGCMEnabler"
		android:exported="false">
			<intent-filter>
				<action android:name="com.microsoft.azure.engagement.intent.action.APPID_GOT" />
			</intent-filter>
		</receiver>

		<receiver android:name="com.microsoft.azure.engagement.gcm.EngagementGCMReceiver" android:permission="com.google.android.c2dm.permission.SEND">
			<intent-filter>
				<action android:name="com.google.android.c2dm.intent.REGISTRATION" />
				<action android:name="com.google.android.c2dm.intent.RECEIVE" />
				<category android:name="<Your package name>" />
			</intent-filter>
		</receiver>

3. Add the last set of permissions that are highlighted before the `<application>` tag. Replace `<Your package name>` by the actual package name of your application.

		<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
		<uses-permission android:name="<Your package name>.permission.C2D_MESSAGE" />
		<permission android:name="<Your package name>.permission.C2D_MESSAGE" android:protectionLevel="signature" />

###Grant Mobile Engagement access to your GCM API Key

To allow Mobile Engagement to send push notifications on your behalf, you need to grant it access to your API Key. This is done by configuring and entering your key into the Mobile Engagement portal.

1. Navigate to your Mobile Engagement portal

	From your Azure Classic Portal, ensure you're in the app we're using for this project, and then click the **Engage** button at the bottom:

	![][1]

2. Then click the **Settings** -> **Native Push** section to enter your GCM Key:

	![][2]

3. Click the **Edit** icon in front of **API Key** in the **GCM Settings** section as shown below:

	![][3]

4. In the pop-up, paste the GCM Server Key you obtained before and then click **Ok**.

	![][4]

##<a id="send"></a>Send a notification to your app

We will now create a simple push notification campaign that sends a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.

2. Click **New announcement** to create your push notification campaign.

	![][5]

3. Set up the first field of your campaign through the following steps:

	![][6]

	a. Name your campaign.

	b. Select the **Delivery type** as *System notification -> Simple*: This is the simple Android push notification type that features a title and a small line of text.

	c. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is started or not.

	d. In the notification text type the **Title** which will be in bold in the push.

	e. Then type your **Message**

4. Scroll down, and in the **Content** section, select **Notification only**.

	![][7]

5. You're done setting the most basic campaign possible. Now scroll down again and click the **Create** button to save your campaign.

6. Last step: click **Activate** to activate your campaign to send push notifications.

	![][8]

<!-- Images. -->
[1]: ./media/mobile-engagement-android-send-push/engage-button.png
[2]: ./media/mobile-engagement-android-send-push/engagement-portal.png
[3]: ./media/mobile-engagement-android-send-push/native-push-settings.png
[4]: ./media/mobile-engagement-android-send-push/api-key.png
[5]: ./media/mobile-engagement-android-send-push/new-announcement.png
[6]: ./media/mobile-engagement-android-send-push/campaign-first-params.png
[7]: ./media/mobile-engagement-android-send-push/campaign-content.png
[8]: ./media/mobile-engagement-android-send-push/campaign-activate.png

