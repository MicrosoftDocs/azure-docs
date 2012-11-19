<properties linkid="develop-mobile-tutorials-get-started-with-push-ios" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications in iOS apps with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14799" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone 8">Windows Phone 8</a> <a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS" class="current">iOS</a>
</div>	

This topic shows you how to use Windows Azure Mobile Services to send push notifications to an iOS app. 
In this tutorial you add push notifications using the Apple Push Notification service (APNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

   <div class="dev-callout"><b>Note</b>
   <p>This tutorial demonstrates a simplified way of sending push notifications by attaching a push notification device token to the inserted record. Be sure to follow along with the next tutorial to get a better idea of how to incorporate push notifications into your real-world apps.</p>
   </div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Generate client certificates] 
2. [Register your app for push notifications]
3. [Configure Mobile Services]
4. [Add push notifications to the app]
5. [Update scripts to send push notifications]
6. [Insert data to receive notifications]

This tutorial requires the following:

+ [Mobile Services iOS SDK]
+ [XCode 4.5][Install Xcode] 
+ iOS 5.0 or later versions
+ iOS Developer Program membership

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

<h2><a name="certificates"></a><span class="short-header">Generate certificates</span>Generate client certificates</h2>

Push notifications uses certificates to XXXXX. You can generate certificates in Xcode and upload them to APNS.

1. In Xcode, open the project and determine the bundle identifier. RALPH HOW DO WE DO THIS????

2. From the Applications\Utilities folder, run the Keychain Access tool.

3. Click **Keychain Access**, expand **Certificate Assistant**, then click **Request a Certificate from a Certificate Authority...**.

   ![][1]

4. Type your information in the **User Email Address** and **Common Name** fields, make sure that **Saved to disk** is selected, and then click **Continue**.

  ![][2]

5. Type a name for the Certificate Signing Request (CSR) file in **Save As**, select the location in **Where**, then click **Save**.

  ![][3]
  
  This saves the CSR file is the selected location; the default location is in the Desktop. Remember the location chosen for this file.

5.  

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

To be able to send push notifications to an iOS app from Mobile Services, you must register your app with Apple and provision your app with . 

1. If you have not already registered your app, navigate to the [iOS Provisioning Portal] at the Apple Developer Center, log on with your Apple ID, and then click **App ID**.

   ![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

   ![][1]

   This creates a new Windows Store registration for your app.

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services].

4. In solution explorer, right-click the project, click **Store**, and then click **Associate App with the Store...**. 

  ![][2]

   This displays the **Associate Your App with the Windows Store** Wizard.

5. In the wizard, click **Sign in** and then login with your Microsoft account.

6. Select the app that you registered in step 2, click **Next**, and then click **Associate**.

   ![][3]

   This adds the required Windows Store registration information to the application manifest.    

7. Navigate to the [My Applications] page in the Live Connect Developer Center and click on your app in the **My applications** list.

   ![][4] 

8. Under **API Settings**, make a note of the values of **Client secret** and **Package security identifier (SID)**. 

   ![][5]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret and package SID are important security credentials. Do not share these secrets with anyone or distribute them with your app.</p>
    </div> 

9. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][9]

10. Click the **Push** tab, enter the **Client secret** and **Package SID** values obtained from WNS in Step 4, and then click **Save**.

   ![][10]

Both your mobile service and your app are now configured to work with WNS.

<h2><a name="configure"></a><span class="short-header">Configure the service</span>Congfigure Mobile Services</h2>
After you have registered your app with APNS and configured your project, you must then configure your mobile service to integrate with APNS.

1. 

<h2><a name="add-push"></a><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. Open the file App.xaml.cs and add the following using statement:

        using Windows.Networking.PushNotifications;

2. Add the following to App.xaml.cs:
	
        public static PushNotificationChannel CurrentChannel { get; private set; }

	    private async void AcquirePushChannel()
	    {
	            CurrentChannel =  
	                await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
        }

   This code acquires and stores a push notification channel.
    
3. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

        AcquirePushChannel();

   This guarantees that the **CurrentChannel** property is initialized each time the application is launched.
		
4. Open the project file MainPage.xaml.cs and add the following new attributed property to the **TodoItem** class:

         [DataMember(Name = "channel")]
         public string Channel { get; set; }

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'channel' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

5. Replace the **ButtonSave_Click** event handler method with the following code:

	        private void ButtonSave_Click(object sender, RoutedEventArgs e)
	        {
	            var todoItem = new TodoItem { Text = TextInput.Text, Channel = App.CurrentChannel.Uri };
	            InsertTodoItem(todoItem);
            }

   This sets the client's current channel value on the item before it is sent to the mobile service.

6. (Optional) If you are not using the Management Portal-generated quickstart project, open the Package.appxmanifest file and make sure that in the **Application UI** tab, **Toast capable** is set to **Yes**.

   ![][15]

   This makes sure that your app can raise toast notifications. These notifications are already enabled in the downloaded quickstart project.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][11]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][12]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
            request.execute({
                success: function() {
                    // Write to the response and then send the notification in the background
                    request.respond();
                    push.wns.sendToastText04(item.channel, {
                        text1: item.text
                    }, {
                        success: function(pushResponse) {
                            console.log("Sent push:", pushResponse);
                        }
                    });
                }
            });
        }

   This registers a new insert script, which uses the [wns object] to send a push notification (the inserted text) to the channel provided in the insert request.

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. In Visual Studio, press the F5 key to run the app.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   ![][13]

   Note that after the insert completes, the app receives a push notification from WNS.

   ![][14]

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The channel used by WNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Channel table in which to store channel URIs and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Generate client certificates]: #certificates
[Register your app for push notifications]: #register
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-ios-push-step2.png
[2]: ../Media/mobile-services-ios-push-step3.png
[3]: ../Media/mobile-services-ios-push-step4.png
[4]: ../Media/mobile-live-connect-apps-list.png
[5]: ../Media/mobile-live-connect-app-details.png
[6]: ../Media/mobile-services-win8-app-advanced.png
[7]: ../Media/mobile-services-win8-app-push-connect.png
[8]: ../Media/mobile-services-win8-app-push-auth.png
[9]: ../Media/mobile-services-selection.png
[10]: ../Media/mobile-push-tab.png
[11]: ../Media/mobile-portal-data-tables.png
[12]: ../Media/mobile-insert-script-push2.png
[13]: ../Media/mobile-quickstart-push1.png
[14]: ../Media/mobile-quickstart-push2.png
[15]: ../Media/mobile-app-enable-toast-win8.png

<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/?LinkId=272456
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-ios.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-ios.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-ios.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-ios.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-ios.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
