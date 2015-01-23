<properties pageTitle="Get started with push notifications (legacy push) | Mobile Dev Center" description="Learn how to use Azure Mobile Services to send push notifications to your Windows Phone app (legacy push)." services="mobile-services, notification-hubs" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-phone" ms.devlang="dotnet" ms.topic="article" ms.date="09/25/2014" ms.author="glenga"/>


# Get started with push notifications in Mobile Services (legacy push)

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-push" title="Windows Store C#" >Windows Store C#</a>
    <a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a>
    <a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-push" title="Windows Phone" class="current">Windows Phone</a>
    <a href="/en-us/documentation/articles/mobile-services-ios-get-started-push" title="iOS">iOS</a>
    <a href="/en-us/documentation/articles/mobile-services-android-get-started-push" title="Android">Android</a>
<!--    <a href="/en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started-push" title="Xamarin.iOS">Xamarin.iOS</a>
    <a href="/en-us/documentation/articles/partner-xamarin-mobile-services-android-get-started-push" title="Xamarin.Android">Xamarin.Android</a>    -->
	<a href="/en-us/documentation/articles/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push" title="Appcelerator">Appcelerator</a>
</div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push/" title=".NET backend">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-push/"  title="JavaScript backend" class="current">JavaScript backend</a>
</div>

This topic shows you how to use Azure Mobile Services to send push notifications to a Windows Phone 8 app. 
In this tutorial you add push notifications using the Microsoft Push Notification Service (MPNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

>[AZURE.NOTE]This topic supports <em>existing</em> mobile services that have <em>not yet been upgraded</em> to use Notification Hubs integration. When you create a <em>new</em> mobile service, this integrated functionality is automatically enabled. For new mobile services, see [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push/).
>
>Mobile Services integrates with Azure Notification Hubs to support additional push notification functionality, such as templates, multiple platforms, and improved scale. <em>You should upgrade your existing mobile services to use Notification Hubs when possible</em>. Once you have upgraded, see this version of [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push/).

This tutorial walks you through these basic steps to enable push notifications:

1. [Create the Registrations table]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial requires [Visual Studio 2012 Express for Windows Phone], or a later version.

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

   >[AZURE.NOTE]When you send more than 500 messages per user each day, you must instead use Notification Hubs. For more information, see <a href="/en-us/manage/services/notification-hubs/getting-started-windows-dotnet/">Get started with Notification Hubs</a>.

## <a name="create-table"></a>Create a new table

[WACOM.INCLUDE [mobile-services-create-new-push-table](../includes/mobile-services-create-new-push-table.md)]

<h2><a name="add-push"></a>Add push notifications to your app</h2>
		
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

		private async void AcquirePushChannel()
        {
            CurrentChannel = HttpNotificationChannel.Find("MyPushChannel");

            if (CurrentChannel == null)
            {
                CurrentChannel = new HttpNotificationChannel("MyPushChannel");
                CurrentChannel.Open();
                CurrentChannel.BindToShellTile();
            }
                  
	       IMobileServiceTable<Registrations> registrationsTable = App.MobileService.GetTable<Registrations>();
	       var registration = new Registrations { Handle = CurrentChannel.ChannelUri.AbsoluteUri };
	       await registrationsTable.InsertAsync(registration);
        }

   	This code acquires and stores a channel for a push notification subscription and binds it to the app's default tile.

	> [AZURE.NOTE] In this this tutorial, the mobile service sends a flip Tile notification to the device. When you send a toast notification, you must instead call the **BindToShellToast** method on the channel. To support both toast and tile notifications, call both **BindToShellTile** and **BindToShellToast**.
    
4. At the top of the **Application_Launching** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

        AcquirePushChannel();

   	This guarantees that the **CurrentChannel** property is initialized each time the application is launched.


5.	In the Solution Explorer, expand **Properties**, open the WMAppManifest.xml file, click the **Capabilities** tab and make sure that the **ID___CAP___PUSH_NOTIFICATION** capability is checked.

   	![][1]

   	This makes sure that your app can receive push notifications.

<h2><a name="update-scripts"></a>Update the registered insert scripts in the Management Portal</h2>

[WACOM.INCLUDE [mobile-services-update-registrations-script](../includes/mobile-services-update-registrations-script.md)]

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
                    	    push.mpns.sendFlipTile(registration.handle, {
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

<h2><a name="test"></a>Test push notifications in your app</h2>

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

This tutorial demonstrates the basic push notification functionality provided by Mobile Services. If your app requires more advanced functionalities, such as sending cross-platform notifications, subscription-based routing, or very large volumes, consider using Azure Notification Hubs with your mobile service. For more information, see one of the following Notification Hubs topics:

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
[1]: ./media/mobile-services-windows-phone-get-started-push/mobile-app-enable-push-wp8.png
[2]: ./media/mobile-services-windows-phone-get-started-push/mobile-quickstart-push1-wp8.png
[3]: ./media/mobile-services-windows-phone-get-started-push/mobile-quickstart-push2-wp8.png
[4]: ./media/mobile-services-windows-phone-get-started-push/mobile-quickstart-push3-wp8.png
[5]: ./media/mobile-services-windows-phone-get-started-push/mobile-quickstart-push4-wp8.png
[10]: ./media/mobile-services-windows-phone-get-started-push/mobile-insert-script-push2.png



<!-- URLs. -->
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=268375
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-wp8
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-wp8
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-wp8
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-wp8
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-wp8
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-wp8

[Azure Management Portal]: https://manage.windowsazure.com/
[mpns object]: http://go.microsoft.com/fwlink/p/?LinkId=271130
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library/
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/get-started-notification-hubs-wp8/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-wp8/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
