<properties linkid="mobile-get-started-with-push-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with push notifications for Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Push Notifications, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14799" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet/" title=".NET client version" class="current">C# and XAML</a>
  <a href="/en-us/develop/mobile/tutorials/get-started-with-push-js/" title="JavaScript client version">JavaScript and HTML</a>
  <span>Tutorial</span>
</div>

# Get started with push notifications in Mobile Services

This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Windows Store app. 
In this tutorial you add push notifications using the Windows Push Notification service (WNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

   <div class="dev-callout"><b>Note</b>
   <p>This tutorial demonstrates a simplified way of sending push notifications by attaching a push notification channel to the inserted record. Be sure to follow along with the next tutorial to get a better idea of how to incorporate push notifications into your real-world apps.</p>
   </div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications and configure Mobile Services]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial requires the following:

+ Microsoft Visual Studio 2012 Express for Windows 8 RC, or a later version

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

<a name="register"></a><h2><span class="short-header">Register your app</span>Register your app for the Windows Store</h2>

To be able to send push notifications to Windows Store apps from Mobile Services, you must submit your app to the Windows Store. You must then configure your mobile service to integrate with WNS.

1. If you have not already registered your app, navigate to the [Submit an app page] at the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

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

<a name="add-push"></a><h2><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. Open the file default.js and insert the following code fragment into the app.OnActivated method overload, just after the args.setPromise method:

        // Get the channel for the application.
        var channel;
        var channelOperation = Windows.Networking.PushNotifications
            .PushNotificationChannelManager
            .createPushNotificationChannelForApplicationAsync()
            .then(function (newChannel) {
                channel = newChannel;
            });

   This code acquires and stores a push notification channel each time the application is launched.
		
5. Replace the **click** event listener definition for **buttonSave** with the following code:
        
	        buttonSave.addEventListener("click", function () {
	            insertTodoItem({
	                text: textInput.value,
	                complete: false,
	                channel: channel.uri
	            });
	        });

   This sets the client's current channel value on the item before it is sent to the mobile service.

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'channel' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

6. (Optional) If you are not using the Management Portal-generated quickstart project, open the Package.appxmanifest file and make sure that in the **Application UI** tab, **Toast capable** is set to **Yes**.

   ![][15]

   This makes sure that your app can raise toast notifications. These notifications are already enabled in the downloaded quickstart project.

<a name="update-scripts"></a><h2><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

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

   This registers a new insert script, which sends a push notification (the inserted text) to the channel provided in the insert request.

<a name="test"></a><h2><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. In Visual Studio, press the F5 key to run the app.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   ![][13]

   Note that after the insert completes, the app receives a push notification from WNS.

   ![][14]

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The channel used by WNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Channel table in which to store channel URIs and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Register your app for push notifications and configure Mobile Services]: #register
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-submit-win8-app.png
[1]: ../Media/mobile-services-win8-app-name.png
[2]: ../Media/mobile-services-store-association.png
[3]: ../Media/mobile-services-select-app-name.png
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
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ./mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet.md
[Push notifications to app users]: ./mobile-services-push-notifications-to-app-users-dotnet.md
[Authorize users with scripts]: ./mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: ./mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
