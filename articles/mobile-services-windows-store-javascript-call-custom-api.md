<properties 
	pageTitle="Call a custom API from a Windows Store JS client - Mobile Services" 
	description="Learn how to define a custom API and then call it from a Windows Store app that use Azure Mobile Services." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="javascript" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="glenga"/>

# Call a custom API from the client

[AZURE.INCLUDE [mobile-services-selector-call-custom-api](../includes/mobile-services-selector-call-custom-api.md)]

This topic shows you how to call a custom API from a Windows Store app. A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

The custom API created in this topic gives you the ability to send a single POST request that sets the completed flag to `true` for all the todo items in the table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. To do this, you will complete the following steps:

1. [Define the custom API]
2. [Update the app to call the custom API]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Get started with data]. This tutorial uses Visual Studio 2012 Express for Windows 8, or a later version.

## <a name="define-custom-api"></a>Define the custom API

[AZURE.INCLUDE [mobile-services-create-custom-api](../includes/mobile-services-create-custom-api.md)]


[AZURE.INCLUDE [mobile-services-windows-store-javascript-call-custom-api](../includes/mobile-services-windows-store-javascript-call-custom-api.md)]

## Next steps

Now that you have created a custom API and called it from your Windows Store app, consider finding out more about the following Mobile Services topics:

* [Mobile Services server script reference]
  <br/>Learn more about creating custom APIs.

* [Store server scripts in source control]
  <br/> Learn how to use the source control feature to more easily and securely develop and publish custom API script code.

<!-- Anchors. -->
[Define the custom API]: #define-custom-api
[Update the app to call the custom API]: #update-app
[Test the app]: #test-app
[Next Steps]: #next-steps

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: mobile-services-windows-store-get-started.md
[Get started with data]: mobile-services-windows-store-javascript-get-started-data.md
[Get started with authentication]: mobile-services-windows-store-javascript-get-started-users.md
[Get started with push notifications]: mobile-services-javascript-backend-windows-store-javascript-get-started-push.md

[Define a custom API that supports periodic notifications]: mobile-services-windows-store-javascript-create-pull-notifications.md
[Store server scripts in source control]: mobile-services-store-scripts-source-control.md
