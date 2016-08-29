###Grant Mobile Engagement access to your GCM API Key

To allow Mobile Engagement to send push notifications on your behalf, you need to grant it access to your API Key. This is done by configuring and entering your key into the Mobile Engagement portal.

1. From your Azure Classic Portal, ensure you're in the app we're using for this project, and then click the **Engage** button at the bottom:

	![](./media/mobile-engagement-android-send-push/engage-button.png)

2. Then click the **Settings** -> **Native Push** section to enter your GCM Key:

	![](./media/mobile-engagement-android-send-push/engagement-portal.png)

3. Click the **Edit** icon in front of **API Key** in the **GCM Settings** section as shown below:

	![](./media/mobile-engagement-android-send-push/native-push-settings.png)

4. In the pop-up, paste the GCM Server Key you obtained before and then click **Ok**.

	![](./media/mobile-engagement-android-send-push/api-key.png)

##<a id="send"></a>Send a notification to your app

We will now create a simple push notification campaign that sends a push notification to our app.

1. Navigate to the **REACH** tab in your Mobile Engagement portal.

2. Click **New announcement** to create your push notification campaign.

	![](./media/mobile-engagement-android-send-push/new-announcement.png)

3. Set up the first field of your campaign through the following steps:

	![](./media/mobile-engagement-android-send-push/campaign-first-params.png)

	a. Name your campaign.

	b. Select the **Delivery type** as *System notification -> Simple*: This is the simple Android push notification type that features a title and a small line of text.

	c. Select **Delivery time** as *Any time* to allow the app to receive a notification whether the app is started or not.

	d. In the notification text type the **Title** which will be in bold in the push.

	e. Then type your **Message**

4. Scroll down, and in the **Content** section, select **Notification only**.

	![](./media/mobile-engagement-android-send-push/campaign-content.png)

5. You're done setting the most basic campaign possible. Now scroll down again and click the **Create** button to save your campaign.

6. Last step: click **Activate** to activate your campaign to send push notifications.

	![](./media/mobile-engagement-android-send-push/campaign-activate.png)