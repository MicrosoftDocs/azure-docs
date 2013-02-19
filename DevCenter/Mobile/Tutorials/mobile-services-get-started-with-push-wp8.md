<properties linkid="mobile-get-started-with-push-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with push notifications for Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Push Notifications, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div chunk="../chunks/article-left-menu-wp8.md" />

# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone 8" class="current">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android">Android</a>
</div>

This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Windows Phone 8 app. 
In this tutorial you add push notifications using the Microsoft Push Notification Service (MPNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

This tutorial walks you through these basic steps to enable push notifications:

1. [Add push notifications to the app]
2. [Update scripts to send push notifications]
3. [Insert data to receive notifications]

This tutorial requires the following:

+ [Visual Studio 2012 Express for Windows Phone], or a later version.
+ [Mobile Services SDK]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 


   <div class="dev-callout"><b>Note</b>
   <p>When you send less than 500 messages per user each day, you do not need to register or authenticate your mobile service app with MPNS. </p>
   </div>

<h2><a name="add-push"></a><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. Open the file App.xaml.cs and add the following using statement:

        using Microsoft.Phone.Notification;

2. Add the following to App.xaml.cs:
	
        public static HttpNotificationChannel CurrentChannel { get; private set; }

        private void AcquirePushChannel()
        {
            CurrentChannel = HttpNotificationChannel.Find("MyPushChannel");

            if (CurrentChannel == null)
            {
                CurrentChannel = new HttpNotificationChannel("MyPushChannel");
                CurrentChannel.Open();
                CurrentChannel.BindToShellTile();
            }
        }

   This code acquires and stores a channel for a push notification subscription and binds it to the app's default tile.

	<div class="dev-callout"><b>Note</b>
		<p>In this this tutorial, the mobile service sends a flip Tile notification to the device. When you send a toast notification, you must instead call the <strong>BindToShellToast</strong> method on the channel. To support both toast and tile notifications, call both <strong>BindToShellTile</strong> and  <strong>BindToShellToast</strong> </p>
	</div>
    
3. At the top of the **Application_Launching** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

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
            var todoItem = new TodoItem { Text = TodoInput.Text, 
                Channel = App.CurrentChannel.ChannelUri.ToString() };
            InsertTodoItem(todoItem);
        }

   This sets the client's current channel value on the item before it is sent to the mobile service.

6.	In the Solution Explorer, expand **Properties**, open the WMAppManifest.xml file, click the **Capabilities** tab and make sure that the **ID___CAP___PUSH_NOTIFICATION** capability is checked.

   ![][1]

   This makes sure that your app can receive push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][11]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][12]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
            request.execute({
                success: function () {
                    // Write to the response and then send the notification in the background
                    request.respond();
                    push.mpns.sendFlipTile(item.channel, {
                        title: item.text
                    }, {
                        success: function (pushResponse) {
                            console.log("Sent push:", pushResponse);
                        }
                    });
                }
            });
        }

   This registers a new insert script, which uses the [mpns object] to send a push notification (the inserted text) to the channel provided in the insert request.

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. In Visual Studio, select **Deploy Solution** on the **Build**  menu.

2. In the emulator, swipe to the left to reveal the list of installed apps and find the new **TodoList** app.

3. Tap and hold on the app icon, and then select **pin to start** from the context menu.

  ![][2]

  This pins a tile named **TodoList** to the start menu.

4. Tap the tile named **TodoList** to launch the app. 

  ![][3]

5. In the app, enter the text "hello push" in the textbox, and then click **Save**.

   ![][4]

  This sends an insert request to the mobile service to store the added item.

6. Press the **Start** button to return to the start menu. 

  ![][5]

  Notice that the application received the push notification and that the title of the tile is now **hello push**.

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The channel used by MPNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Channel table in which to store channel URIs and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Register your app for push notifications and configure Mobile Services]: #register
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../Media/mobile-app-enable-push-wp8.png
[2]: ../Media/mobile-quickstart-push1-wp8.png
[3]: ../Media/mobile-quickstart-push2-wp8.png
[4]: ../Media/mobile-quickstart-push3-wp8.png
[5]: ../Media/mobile-quickstart-push4-wp8.png
[11]: ../Media/mobile-portal-data-tables.png
[12]: ../Media/mobile-insert-script-push2.png

<!-- URLs. -->
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=268375
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-wp8.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-wp8.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-wp8.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-wp8.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-wp8.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-wp8.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[mpns object]: http://go.microsoft.com/fwlink/p/?LinkId=271130

