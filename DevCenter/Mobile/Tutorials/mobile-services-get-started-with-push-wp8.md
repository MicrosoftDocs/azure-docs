<properties linkid="mobile-get-started-with-push-dotnet" writer="glenga" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with push notifications for Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Push Notifications, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>




# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone" class="current">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android" title="Xamarin.Android">Xamarin.Android</a>
</div>

This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Windows Phone 8 app. 
In this tutorial you add push notifications using the Microsoft Push Notification Service (MPNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

This tutorial walks you through these basic steps to enable push notifications:

1. [Create the Registrations table]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial requires [Visual Studio 2012 Express for Windows Phone], or a later version.

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

   <div class="dev-callout"><b>Note</b>
   <p>When you send more than 500 messages per user each day, you must instead use Notification Hubs. For more information, see <a href="/en-us/manage/services/notification-hubs/getting-started-windows-dotnet/">Get started with Notification Hubs</a>.</p>
   </div>

## <a name="create-table"></a>Create a new table

<div chunk="../chunks/mobile-services-create-new-push-table.md" />

<h2><a name="add-push"></a><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>
		
1. In Visual Studio, open the project file MainPage.xaml.cs and add the following code that creates a new **Registrations** class:

	    public class Registrations
	    {
	        public string Id { get; set; }
	
	        [JsonProperty(PropertyName = "handle")]
	        public string Handle { get; set; }
	    }
	
	The Handle property is used to store the channel URI.

2. Open the file App.xaml.cs and add the following using statement:

        using Microsoft.Phone.Notification;

3. Add the following to App.xaml.cs:
	
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
                  
	       IMobileServiceTable<Registrations> registrationsTable = App.MobileService.GetTable<Registrations>();
	       var registration = new Registrations { Handle = CurrentChannel.Uri };
	       await registrationsTable.InsertAsync(registration);
        }

   This code acquires and stores a channel for a push notification subscription and binds it to the app's default tile.

	<div class="dev-callout"><b>Note</b>
		<p>In this this tutorial, the mobile service sends a flip Tile notification to the device. When you send a toast notification, you must instead call the <strong>BindToShellToast</strong> method on the channel. To support both toast and tile notifications, call both <strong>BindToShellTile</strong> and  <strong>BindToShellToast</strong> </p>
	</div>
    
4. At the top of the **Application_Launching** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

        AcquirePushChannel();

   This guarantees that the **CurrentChannel** property is initialized each time the application is launched.


5.	In the Solution Explorer, expand **Properties**, open the WMAppManifest.xml file, click the **Capabilities** tab and make sure that the **ID___CAP___PUSH_NOTIFICATION** capability is checked.

   ![][1]

   This makes sure that your app can receive push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert scripts in the Management Portal</h2>

<div chunk="../chunks/mobile-services-update-registrations-script.md" />

4. Click **TodoItem**, click **Script** and select **Insert**. 

   ![][10]

3. Replace the insert function with the following code, and then click **Save**:

	    function insert(item, user, request) {
    	    request.execute({
        	    success: function() {
            	    request.respond();
            	    sendNotifications();
        	    }
    	    });

	        function sendNotifications() {
        	    var registrationsTable = tables.getTable('Registrations');
        	    registrationsTable.read({
            	    success: function(registrations) {
                	    registrations.forEach(function(registration) {
                    	    push.mpns.sendFlipTile(registration.uri, {
                        	    title: item.text
                    	    }, {
                        	    success: function(pushResponse) {
                            	    console.log("Sent push:", pushResponse);
                        	    }
                    	    });
                	    });
            	    }
        	    });
    	    }
	    }

    This insert script sends a push notification (with the text of the inserted item) to all channels stored in the **Registrations** table.

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

This tutorial demonstrates the basic push notification functionality provided by Mobile Services. If your app requires more advanced functionalities, such as sending cross-platform notifications, subscription-based routing, or very large volumes, consider using Windows Azure Notification Hubs with your mobile service. For more information, see one of the following Notification Hubs topics:

+ [Get started with Notification Hubs]
  <br/>Learn how to leverage Notification Hubs in your Windows Store app.

+ [What are Notification Hubs?]
	<br/>Learn how to create and push notifications to users on multiple platforms.

+ [Send notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

<!--+ [Send notifications to users]
	<br/>Learn how to send push notifications from a Mobile Service to specific users on any device.

+ [Send cross-platform notifications to users]
	<br/>Learn how to use templates to send push notifications from a Mobile Service, without having to craft platform-specific payloads in your back-end.
-->

Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [Mobile Services .NET How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with .NET. 

<!-- Anchors. -->
[Create the Registrations table]: #create-table
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
[10]: ../Media/mobile-insert-script-push2.png
[11]: ../Media/mobile-portal-data-tables-registrations.png
[12]: ../Media/mobile-insert-script-registrations.png

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
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library/
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-wp8/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-wp8/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
