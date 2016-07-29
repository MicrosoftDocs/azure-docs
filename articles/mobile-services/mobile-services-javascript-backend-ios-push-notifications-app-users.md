<properties
	pageTitle="Send Push Notifications to Authenticated Users in iOS (JavaScript backend)"
	description="Learn how to send push notifications to specific users"
	services="mobile-services,notification-hubs"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>


<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="krisragh"/>

# Send Push Notifications to Authenticated Users

[AZURE.INCLUDE [mobile-services-selector-push-users](../../includes/mobile-services-selector-push-users.md)]

&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [How to: Send push notifications to an authenticated user using tags](../app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#push-user).

In this topic, you learn how to send push notifications to an authenticated user on iOS. Before starting this tutorial, complete [Get started with authentication] and [Get started with push notifications] first.

In this tutorial, you require users to authenticate first, register with the notification hub for push notifications, and update server scripts to send those notifications to only authenticated users.


##<a name="register"></a>Update Service to Require Authentication to Register

[AZURE.INCLUDE [mobile-services-javascript-backend-push-notifications-app-users](../../includes/mobile-services-javascript-backend-push-notifications-app-users.md)]

Replace the `insert` function with the following code, then click **Save**. This insert script uses the user ID tag to send a push notification to all iOS app registrations from the logged-in user:

```
// Get the ID of the logged-in user.
var userId = user.userId;

function insert(item, user, request) {
    request.execute();
    setTimeout(function() {
        push.apns.send(userId, {
            alert: "Alert: " + item.text,
            payload: {
                "Hey, a new item arrived: '" + item.text + "'"
            }
        });
    }, 2500);
}
```

##<a name="update-app"></a>Update App to Login Before Registration

[AZURE.INCLUDE [mobile-services-ios-push-notifications-app-users-login](../../includes/mobile-services-ios-push-notifications-app-users-login.md)]

##<a name="test"></a>Test App

[AZURE.INCLUDE [mobile-services-ios-push-notifications-app-users-test-app](../../includes/mobile-services-ios-push-notifications-app-users-test-app.md)]



<!-- Anchors. -->
[Updating the service to require authentication for registration]: #register
[Updating the app to log in before registration]: #update-app
[Testing the app]: #test
[Next Steps]:#next-steps


<!-- URLs. -->
[Get started with authentication]: mobile-services-ios-get-started-users.md
[Get started with push notifications]: mobile-services-javascript-backend-ios-get-started-push.md
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-ios-how-to-use-client-library.md
