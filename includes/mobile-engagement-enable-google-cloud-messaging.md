
###Create a Google Cloud Messaging project with API key

>[AZURE.NOTE] To complete this procedure, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.

1. Navigate to the [Google Cloud Console](https://console.developers.google.com/project) and sign-in with your Google account credentials.

2. Click **Go to project**, and then click **Create Project**.
<!--
   	![](./media/mobile-engagement-enable-google-cloud-messaging/new-project.png)

   	![](./media/mobile-engagement-enable-google-cloud-messaging/new-project-2.png)   
-->
3. Enter a project name.

4. Make a note of the project number which appears under the **Project name** text box. You will need it later in the tutorial to populate in the Android Manifest file.
   	![](./media/mobile-engagement-enable-google-cloud-messaging/project-number.png)   
5. Click **Create**.

6. In the left column, make sure **Overview** is selected, and under Mobile APIs click **Google Cloud Messaging**. Then on the next page click **Enable**.

	![](./media/mobile-engagement-enable-google-cloud-messaging/enable-GCM.png)
<!--
	![](./media/mobile-engagement-enable-google-cloud-messaging/enable-gcm-2.png)
-->
7. On the next page, click **Go to Credentials**, and on the following page, select **Google Cloud Messaging** from the first dropdown box and **Web server** from the second one, and then click **What credentials do I need?**

   	![](./media/mobile-engagement-enable-google-cloud-messaging/create-server-key.png)

8. In **Add credentials to your project** page, click **Create API key**.
<!--
   	![](./media/mobile-engagement-enable-google-cloud-messaging/create-server-key5.png)

   	![](./media/mobile-engagement-enable-google-cloud-messaging/create-server-key6.png)
-->
9. Make a note of the **API KEY** value. You will use this API key value later to configure in the "Native Push" section. Now click **Done**.
