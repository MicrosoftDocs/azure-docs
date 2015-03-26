<properties
	pageTitle="How to call a custom API from an iOS client"
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
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="03/03/2015"
	ms.author="krisragh"/>


# How to call a custom API from an iOS client (.NET backend)

[AZURE.INCLUDE [mobile-services-selector-call-custom-api](../includes/mobile-services-selector-call-custom-api.md)]

This topic shows you how to call a custom API from an iOS app. A custom API lets you define custom endpoints with server functionality, but it does not map to a database insert, update, delete, or read operation. By using a custom API, you have more control over messaging, including HTTP headers and body format.

## <a name="define-custom-api"></a>Define Custom API

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-custom-api](../includes/mobile-services-dotnet-backend-create-custom-api.md)]

[AZURE.INCLUDE [mobile-services-ios-call-custom-api](../includes/mobile-services-ios-call-custom-api.md)]

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
[Get started with Mobile Services]: mobile-services-dotnet-backend-ios-get-started.md
[Mobile Services Quick Start]: mobile-services-dotnet-backend-ios-get-started.md
[Get started with data]: mobile-services-dotnet-backend-ios-get-started-data.md
[Get started with authentication]: mobile-services-dotnet-backend-ios-get-started-users.md
[Get started with push notifications]: mobile-services-dotnet-backend-ios-get-started-push.md
[Store server scripts in source control]: mobile-services-store-scripts-source-control.md
