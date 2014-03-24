<properties linkid="develop-mobile-tutorials-get-started-with-push-xamarin-android" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" description="Learn how to use push notifications in Xamarin.Android apps with Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" title="Get started with push notifications in Mobile Services" documentationCenter="Mobile" authors="" />
# Get started with push notifications in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android" title="Xamarin.Android" class="current">Xamarin.Android</a></div>

This topic shows you how to use Azure Mobile Services to send push notifications to a Xamarin.Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) service to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications]
2. [Configure Mobile Services]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial requires the following:

+ An active Google account

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, and then click **Create project...**.

	![][1]   

	> [WACOM.NOTE]
	> When you already have an existing project, you are directed to the **Dashboard** page after login. To create a new project from the Dashboard, expand **API Project<**, click **Create...** under **Other projects**, then enter a project name and click **Create project**.

2. Click the Overview button in the left column, and make a note of the Project Number in the Dashboard section. 

	Later in the tutorial you set this value as the **PROJECT_ID** variable in the client.

3. On the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> page, click **Services**, then click the toogle to turn on **Google Cloud Messaging for Android** and accept the terms of service. 

4. Click **API Access**, and then click **Create new Server key...** 

	![][2]

5. In **Configure Server Key for API Project**, click **Create**.

	![][3]

6. Make a note of the **API key** value.

	![][4] 

Next, you will use this API key value to enable Mobile Services to authenticate with GCM and send push notifications on behalf of you app.

<a name="configure"></a><h2><span class="short-header">Configure the service</span>Configure Mobile Services to send push requests</h2>

1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your app.

	![][18]

2. Click the **Push** tab, enter the **API Key** value obtained from GCM in the previous procedure, and then click **Save**.

	![][19]

	You mobile service is now configured to work with GCM to send push notifications.

<a name="add-push"></a><h2><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. First we will want to add **PushSharp** as a reference in our project. To do this we must compile the latest version of PushSharp and add the compiled DLL as a reference to our Xamarin.Android project.

2. Visit the [PushSharp Github page], and download the latest release. Once you've extracted the collection of files, navigate to the following sample project folder:

	**/Client.Samples/PushSharp.ClientSample.MonoForAndroid/PushSharp.ClientSample.MonoForAndroid.Gcm/**

	.. and open the project file:
	
	**  PushSharp.ClientSample.MonoForAndroid.Gcm.csproj **

3. Build the MonoForAndroid PushSharp client sample in **Release** mode.

4. Create an **_external** folder in your Xamarin.Android project folder

5. Copy the following file from the MonoForAndroid PushSharp client sample to the newly created **_external** folder in your Xamarin.Android project folder:

	 **\bin\Release\PushSharp.Client.MonoForAndroid.dll**

6. Open your Xamarin.Android project in Xamarin Studio (or Visual Studio). 

7. Right click the project **References** folder, and choose **Edit References...**

8. Go to the **.Net Assembly** tab, browse to your project's **_external** folder, select the **PushSharp.Client.MonoForAndroid.dll** we built earlier and click **Add**. Click OK to close the dialog. 

9. Open **Constants.cs** and add the following line, replacing **PROJECT\_ID** with the Google Project_ID you noted earlier:

		public const string SenderID = "PROJECT_ID"; // Google API Project Number

10. Copy the file **PushService.cs** from the MonoForAndroid PushSharp client sample to your Xamarin.Android project folder and add it to your project.

11. Change the namespace used in **PushService.cs** to match your project's namespace (ex: XamarinTodoQuickStart).

12. Change the **SENDER_IDS** array in **PushService.cs** to reference the **SenderID** Constant we created above:

		public static string[] SENDER_IDS = new string[] { Constants.SenderID };
		
13. Add a new static property to the **PushHandlerService** in **PushService.cs** to keep track of our device registration ID:

		public static string RegistrationID { get; private set; }
		
14. Update the **OnRegistered** method in **PushService.cs** to store the received registration id to our local static variable:

		protected override void OnRegistered(Context context, string registrationId)
		{
			Log.Verbose(PushHandlerBroadcastReceiver.TAG, "GCM Registered: " + registrationId);
            RegistrationID = registrationId;
		}

15. Update the **OnMessage** method in **PushService.cs** to display the push message received as part of the notification (replace the existing **createNotification** call):

        string message = intent.Extras.GetString("message");
        createNotification("New todo item!", "Todo item: " + message);
       
16. Take note that the **OnMessage** method has the following code by default to store off the last push message received:

        //Store the message
        var prefs = GetSharedPreferences(context.PackageName, FileCreationMode.Private);
        var edit = prefs.Edit();
        edit.PutString("last_msg", msg.ToString());
        edit.Commit();

17. Update the **createNotification** method in **PushService.cs** to reference **TodoActivity** instead of **DefaultActivity**.

18. Open **TodoActivity.cs** and add the following using statement:

        using PushSharp.Client;

19. In **TodoActivity.cs** insert the following lines just above where the **MobileServiceClient** is created:
	
        // Check to ensure everything's setup right
        PushClient.CheckDevice(this);
        PushClient.CheckManifest(this);

        // Register for push notifications
        System.Diagnostics.Debug.WriteLine("Registering...");
        PushClient.Register(this, PushHandlerBroadcastReceiver.SENDER_IDS);

20. Open **TodoItem.cs** and add a new field to keep track of the registered device id for the person who added the TodoItem:

        [DataMember(Name = "channel")]
        public string RegistrationId { get; set; }

21. In **TodoActivity.cs** update the **AddItem** method to set the **RegistrationID** of the newly added **TodoItem** to the device's registration ID receieved during registration:

		// Create a new item
		var item = new TodoItem() {
			Text = textNewTodo.Text,
			Complete = false,
            RegistrationId = PushHandlerService.RegistrationID
		};

Your app is now updated to support push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

	![][21]

2. In **TodoItem**, click the **Script** tab and select **Insert**.
   
  	![][22]

	This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
			request.execute({
				success: function() {
					// Write to the response and then send the notification in the background
					request.respond();
					push.gcm.send(item.channel, item.text, {
						success: function(response) {
							console.log('Push notification sent: ', response);
						}, error: function(error) {
							console.log('Error sending push notification: ', error);
						}
					});
				}
			});
		}

   This registers a new insert script, which uses the [gcm object] to send a push notification (the inserted text) to the device provided in the insert request. 

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. Run the app and add a new Todo item. Ensure that you receive a push notification about the new Todo item being added.

2. Review the **Logs** tab of your mobile app in the Azure management portal to see the logging messages we added to the **Insert** method on the **TodoItem** table above.

3. Look at the **TodoItem** table in the Azure management portal to see the new **channel** column that was added and contains unique device registration identifiers.

You have successfully completed this tutorial.

## Get completed example
Download the [completed example project]. Be sure to update the **ApplicationURL**, **ApplicationKey**, and **SenderID** variables with your own Azure settings. 

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Register your app for push notifications]: #register
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-services-google-developers.png
[2]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-services-google-create-server.png
[3]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-services-google-create-server2.png
[4]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-services-google-create-server3.png
[18]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-services-selection.png
[19]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-push-tab-android.png
[21]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-portal-data-tables.png
[22]: ./media/partner-xamarin-mobile-services-android-get-started-push/mobile-insert-script-push2.png







<!-- URLs. TODO:: update 'Download the Android app project' download link, 'GitHub', completed project, etc. -->
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Android Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-xamarin-android
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-xamarin-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-xamarin-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-android
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-xamarin-android

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services Xamarin conceptual]: /en-us/develop/mobile/how-to-guides/work-with-xamarin-client-library
[gcm object]: http://go.microsoft.com/fwlink/p/?LinkId=282645
[completed example project]: http://go.microsoft.com/fwlink/p/?LinkId=331303
[PushSharp Github page]: https://github.com/Redth/PushSharp

