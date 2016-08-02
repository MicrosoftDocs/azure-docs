

1. Log in to the [Firebase console](https://firebase.google.com/console/). Create a new Firebase project if you don't already have one.
2. After your project is created click **Add Firebase to your Android app** and follow the instructions provided.

	![](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-add-firebase-to-android-app.png)

3. In the Firebase Console, click the cog for your project and then click **Project Settings**.

	![](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-firebase-console-project-settings.png)

4. Click the **Cloud Messaging** tab in your project settings and copy the value of the **Server key** and **Sender ID**.  These values will be used later to configure the notification hub Access Policy and your notification handler in the app.
  