<properties
	pageTitle="Call Custom API from iOS Azure Mobile Services Client"
	description="Learn how to define a custom API and then call it from an iOS app that uses Azure Mobile Services."
	services="mobile-services"
	documentationCenter="ios"
	authors="krisragh"
	writer="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="02/26/2015"
	ms.author="krisragh"/>


# Call Custom API from Azure Mobile Services Client

[AZURE.INCLUDE [mobile-services-selector-call-custom-api](../includes/mobile-services-selector-call-custom-api.md)]

This topic shows you how to call a custom API from an iOS app. A custom API lets you define custom endpoints with server functionality, but it does not map to a database insert, update, delete, or read operation. By using a custom API, you have more control over messaging, including HTTP headers and body format.

The custom API in this topic lets you the `completed` flag to `true` for all the todo items in the table. Without this API, individual requests are needed to update the flag for each item, one at a time.

This tutorial uses the app from the [Mobile Services Quick Start], so you must complete [Mobile Services Quick Start] first.

## <a name="define-custom-api"></a>Define Custom API

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-custom-api](../includes/mobile-services-dotnet-backend-create-custom-api.md)]

[AZURE.INCLUDE [mobile-services-ios-call-custom-api](../includes/mobile-services-ios-call-custom-api.md)]

## Next steps

* [Mobile Services server script reference]
  <br/>Learn more about creating custom APIs.

* [Store server scripts in source control]
  <br/> Learn how to use the source control feature to more easily and securely develop and publish custom API script code.

<!-- Anchors. -->
[Define the custom API]: #define-custom-api
[Update the app to call the custom API]: #update-app
[Test the app]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started/
[Mobile Services Quick Start]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push/
[Store server scripts in source control]: /en-us/documentation/articles/mobile-services-store-scripts-source-control
