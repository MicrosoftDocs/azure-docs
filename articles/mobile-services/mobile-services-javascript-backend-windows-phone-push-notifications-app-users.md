<properties 
	pageTitle="Send push notifications to authenticated Windows Phone Silverlight app users | Azure Mobile Services" 
	description="Learn how to send push notifications from Azure Mobile Services to specific users of your Windows Phone Silverlight app." 
	services="mobile-services,notification-hubs" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="07/22/2015" 
	ms.author="glenga"/>

# Send push notifications to authenticated users

[AZURE.INCLUDE [mobile-services-selector-push-users](../../includes/mobile-services-selector-push-users.md)]

##Overview

This topic shows you how to send push notifications to an authenticate user on any registered device. Unlike the previous [Add push notifications to your app] tutorial, this tutorial changes your mobile service to require that a user be authenticated before the client can register with the notification hub for push notifications. Registration is also modified to add a tag based on the assigned user ID. Finally, the server script is updated to send the notification only to the authenticated user instead of to all registrations.
 
>[AZURE.NOTE]This tutorial supports Windows Phone 8.0 and Windows Phone 8.1 Silverlight apps. For Windows Phone 8.1 Store apps, see the [Windows Store version of this topic](mobile-services-javascript-backend-windows-store-dotnet-push-notifications-app-users.md).

##Prerequisites 

Before you start this tutorial, you must have already completed these Mobile Services tutorials:

+ [Add authentication to your app]<br/>Adds a login requirement to the TodoList sample app.

+ [Add push notifications to your app]<br/>Configures the TodoList sample app for push notifications by using Notification Hubs. 

After you have completed both tutorials, you can prevent unauthenticated users from registering for push notifications from your mobile service.

##<a name="register"></a>Update the service to require authentication to register

[AZURE.INCLUDE [mobile-services-javascript-backend-push-notifications-app-users](../../includes/mobile-services-javascript-backend-push-notifications-app-users.md)] 

&nbsp;&nbsp;5. Replace the insert function with the following code, then click **Save**:

    function insert(item, user, request) {
	// Define a payload for the Windows Phone toast notification.
	var payload = '<?xml version="1.0" encoding="utf-8"?>' +
		'<wp:Notification xmlns:wp="WPNotification"><wp:Toast>' +
		'<wp:Text1>New Item</wp:Text1><wp:Text2>' + item.text + 
		'</wp:Text2></wp:Toast></wp:Notification>';

	// Get the ID of the logged-in user.
	var userId = user.userId;		

	request.execute({
		success: function() {
			// If the insert succeeds, send a notification.
			push.mpns.send(userId, payload, 'toast', 22, {
				success: function(pushResponse) {
					console.log("Sent push:", pushResponse);
					request.respond();
					},              
					error: function (pushResponse) {
						console.log("Error Sending push:", pushResponse);
						request.respond(500, { error: pushResponse });
						}
					});
				}
			});      
	}

&nbsp;&nbsp;This insert script uses the user ID tag to send a push notification (with the text of the inserted item) to all Windows Phone (MPNS) app registrations created by the logged-in user.

##<a name="update-app"></a>Update the app to log in before registration

[AZURE.INCLUDE [mobile-services-windows-phone-push-notifications-app-users](../../includes/mobile-services-windows-phone-push-notifications-app-users.md)] 


##<a name="test"></a>Test the app

[AZURE.INCLUDE [mobile-services-windows-test-push-users](../../includes/mobile-services-windows-test-push-users.md)] 

<!-- Anchors. -->
[Updating the service to require authentication for registration]: #register
[Updating the app to log in before registration]: #update-app
[Testing the app]: #test
[Next Steps]:#next-steps


<!-- URLs. -->
[Add authentication to your app]: mobile-services-windows-phone-get-started-users.md
[Add push notifications to your app]: mobile-services-javascript-backend-windows-phone-get-started-push.md
[Azure Management Portal]: https://manage.windowsazure.com/

 
