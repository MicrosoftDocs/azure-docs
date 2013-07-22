<properties linkid="" urlDisplayName="Notify Users" pageTitle="Notify Users of your mobile service with Notification Hubs" metaKeywords="" writer="glenga" metaDescription="Follow this tutorial create an app and register to receive notifications from your mobile service bu using Notification Hubs for Windows Store development in C#/VB" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<!--<div chunk="../chunks/article-left-menu-windows-store.md" />-->

# <a name="getting-started"> </a>Notify users with Notification Hubs

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/ITPro/mobile/tutorials/notify-users-mobile-dotnet" title="Mobile Services" class="current">Mobile Services</a>
    <a href="/en-us/develop/mobile/tutorials/notify-users-webapi-dotnet" title="ASP.NET">ASP.NET</a>
<!--|
    <a href="/en-us/develop/mobile/tutorials/notify-users-mobile-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
    <a href="/en-us/develop/mobile/tutorials/notify-users-mobile-ios" title="iOS">iOS</a>
-->
</div> 

This tutorial shows you how to use Windows Azure Notification Hubs to send push notifications to a specific app user on a specific device. A Windows Azure Mobile Services backend is used to authenticate clients and to generate notifications. This tutorial builds on the notification hub that you created in the previous **Get started with Notification Hubs** tutorial. The notification registration code is moved from the client to the backend service. This ensures that registration is only completed after a client has been positively authenticated by the service. It also means that notification hub credentials aren't distributed with the client app. The service also controls the tags requested during registration.

This tutorial walks you through the following basic steps: 

+ [Update your mobile service to register for notifications]
+ [Update the app to log in and request registration]
+ [Update your mobile service to send notifications]

## Prerequisites

Before you start this tutorial, you must first complete the following tutorials:

+ **Get started with Notification Hubs** ([Windows Store C#][Get started Windows Store]/[iOS][Get started iOS]/[Android][Get started Android]). 

+ **Get started with authentication in Mobile Services** ([Windows Store C#][Get started auth Windows Store]/[iOS][Get started auth iOS]/[Android][Get started auth Android])

This tutorial builds upon the app and notification hub that you created in **Get started with Notification Hubs**. It also leverages the authenticated mobile service that you configured in **Get started with authentication in Mobile Services**. 

<a name="register-notification"></a><h2><span class="short-header">Register for notifications</span>Update your mobile service to register for notifications</h2>

Because notification registration must only be completed after a client has been positively authenticated by the service, the registration is performed a custom API defined in the mobile service. This custom API is called by an authenticated client to request notification registration. In this section, you will update the authenticated mobile service that you defined when you completed the **Get started with authentication in Mobile Services** tutorial. 

1. Log into the [Windows Azure Management Portal][Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **API** tab, and then click **Create a custom API**.

   ![][1]

   This displays the **Create a new custom API** dialog.

3. Type <em>register_notifications</em> in **API name**, select **Only Authenticated Users** for **POST Permissions**, then click the check button.

   ![][2]

  This creates the new API that requires users to be authenticated before calling by using the HTTP POST method. We don't need to set the other HTTP methods because we won't implement them.

4. Click the new **register_notifications** entry in the API table.

	![][3]

5. Click the **Script** tab and replace the existing code with the following:

		exports.post = function(request, response) {
		    var azure = require('azure');
		    var hub = azure.createNotificationHubService('<NOTIFICATION_HUB_NAME>', 
				'<LISTEN_SAS_CONNECTION_STRING>');
		
		    // Get the device ID and clien platform from the query parameters.
		    var deviceId = request.query.deviceid;
		    var platform = request.query.platform;
		    var userId = request.user.userId;
		
		    if (platform === 'win8') {
		        hub.wns.createNativeRegistration(deviceId, {
		            uid: userId
		        }, function(error, response) {
		            console.log(response);
		            console.error(error);
		        });        
		    } else if (platform === 'ios') {
		        hub.apns.notificationHubService(deviceId, request.user.userId, function(error) {
		            console.error(error);
		        });
		    } else {
		        response.send(500, 'unknown client');
		    }
		};

6. Update the script to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<LISTEN_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

	<div class="dev-callout"><b>Note</b>
		<p>Make sure to use the <strong>DefaultListenSharedAccessSignature</strong> for <em><code>&lt;LISTEN_SAS_CONNECTION_STRING&gt;</code></em>. This claim only allows your custom API method to access single registrations.</p>
	</div>

<a name="update-app"></a><h2><span class="short-header">Update the app</span>Update the app to log in and request registration</h2>

Next, you need to update the TodoList app to request registration for notification by calling the new custom API.

1. Follow the steps in one of the following versions of **Register the current user for push notifications by using a mobile service**, depending on your client platform:

	+ [Windows Store C# version][Client topic Windows Store C# version]
	+ [iOS version][Client topic iOS version]

2. Run the updated app and verify that the registration ID assigned to the notification is displayed.

<a name="send-notifications"></a><h2><span class="short-header">Send notifications</span>Update your mobile service to send notifications</h2>

The final step is to add code that sends notifications in the mobile service. This notification code is added to the server script registered to the insert handler of the **TodoItem** table.

1. Back in the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][4]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][5]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
		    var azure = require('azure');
		    var hub = azure.createNotificationHubService('<NOTIFICATION_HUB_NAME>', 
		    '<FULL_SAS_CONNECTION_STRING>');
		    request.execute({
		        success: function() {
		            // Write to the response and then send the notification in the background
		            request.respond();
		            
		            // Call the templated method to cover both WNS and APNS?
		            hub.wns.sendToastText04(item.channel, {
		                text1: item.text
		            }, {
		                success: function(pushResponse) {
		                    console.log("Sent push:", pushResponse);
		                }
		            });
		        }
		    });
		}

4. Update the script to replace _`<NOTIFICATION_HUB_NAME>`_ and _`<FULL_SAS_CONNECTION_STRING>`_ with values for your notification hub, then click **Save**.

   This registers a new insert script, which uses Notification Hubs to send a push notification (the inserted text) to the channel provided in the insert request.

	<div class="dev-callout"><b>Note</b>
		<p>Make sure to use the <strong>DefaultFullSharedAccessSignature</strong> for <em><code>&lt;FULL_SAS_CONNECTION_STRING&gt;</code></em>. This claim allows your insert script full access, including the ability to send notifications to registered clients.</p>
	</div>

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

Now that the notifications are configured, it's time to test the app by inserting data to generate a notification.

**_Note that these client steps are slightly different for Win8 vs iOS, so I left them generic_**

1. Run the app. 

	A registration notification is again displayed on start-up.

2. Enter text as before and add the new item.

	Note that after the insert completes, the app receives a push notification from Notification Hubs.



## <a name="next-steps"> </a>Next Steps
Now that you have completed this tutorial...

<!-- Anchors. -->
[Update your mobile service to register for notifications]: #register-notification
[Update the app to log in and request registration]: #update-app
[Update your mobile service to send notifications]: #send-notifications

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-create.png
[2]: ../Media/mobile-custom-api-create2.png
[3]: ../Media/mobile-custom-api-select.png
[4]: ../Media/mobile-portal-data-tables.png
[5]: ../Media/mobile-insert-script-push2.png

<!-- URLs. -->
[Get started Windows Store]: ./getting-started-windowsdotnet.md
[Get started iOS]: ./getting-started-ios.md
[Get started Android]: ./getting-started-android.md
[Get started auth Windows Store]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Get started auth iOS]: /en-us/develop/mobile/tutorials/get-started-with-users-ios/
[Get started auth Android]: /en-us/develop/mobile/tutorials/get-started-with-users-android/
[Client topic Windows Store C# version]: ./howto-register-user-with-mobile-service-windowsdotnet.md 
[Client topic iOS version]: ./howto-register-user-with-mobile-service-ios.md 
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
