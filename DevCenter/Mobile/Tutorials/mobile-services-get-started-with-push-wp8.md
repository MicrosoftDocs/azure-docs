<properties linkid="mobile-get-started-with-push-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with push notifications for Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Push Notifications, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14799" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<!--<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet/" title=".NET client version" class="current">C# and XAML</a>
  <a href="/en-us/develop/mobile/tutorials/get-started-with-push-js/" title="JavaScript client version">JavaScript and HTML</a>
  <span>Tutorial</span>
</div>-->

# Get started with push notifications in Mobile Services for Windows Store
<h3><strong>Windows Store C#</strong> / <a href="/en-us/develop/mobile/tutorials/get-started-with-push-js">Windows Store JavaScript</a></h3>

This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Windows Store app. 
In this tutorial you add push notifications using the Windows Push Notification service (WNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

This tutorial walks you through these basic steps to enable push notifications:

1. [Add push notifications to the app]
2. [Update scripts to send push notifications]
3. [Insert data to receive notifications]

This tutorial requires the following:

+ [Visual Studio 2012 Express for Windows Phone], or a later version.
+ [Mobile Services SDK]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 


   <div class="dev-callout"><b>Note</b>
   <p>When you send less than 500 messages per user each day, you do not need to register or authenticate your app with Mobile Service Windows Phone Notification Service </p>
   </div>

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

   This registers a new insert script, which sends a push notification (the inserted text) to the channel provided in the insert request.

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

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
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=268375
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
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
