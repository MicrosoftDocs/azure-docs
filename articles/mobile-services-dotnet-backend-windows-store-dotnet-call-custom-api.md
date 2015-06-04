<properties 
	pageTitle="Call a custom API from a Windows Store client - Mobile Services" 
	description="Learn how to define a custom API and then call it from a Windows Store app that use Azure Mobile Services." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/04/2015" 
	ms.author="glenga"/>

# Call a custom API from the client

[AZURE.INCLUDE [mobile-services-selector-call-custom-api](../includes/mobile-services-selector-call-custom-api.md)]

This topic shows you how to call a custom API from a Windows Store app. A custom API enables you to define custom endpoints that expose server functionality that does not map to an insert, update, delete, or read operation. By using a custom API, you can have more control over messaging, including reading and setting HTTP message headers and defining a message body format other than JSON.

The custom API created in this topic gives you the ability to send a single POST request that sets the completed flag to `true` for all the todo items in the table. Without this custom API, the client would have to send individual requests to update the flag for each todo item in the table.

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or [Add Mobile Services to an existing app]. 

[AZURE.INCLUDE [mobile-services-dotnet-backend-create-custom-api](../includes/mobile-services-dotnet-backend-create-custom-api.md)]

## <a name="update-app"></a>Update the app to call the custom API

[AZURE.INCLUDE [mobile-services-windows-store-dotnet-call-custom-api](../includes/mobile-services-windows-store-dotnet-call-custom-api.md)]


## Next steps

This topic showed how to use the **InvokeApiAsync** method to call a fairly simple custom API from your Windows Store app. To learn more about using the **InvokeApiAsync** method, see the post [Custom API in Azure Mobile Services](http://blogs.msdn.com/b/carlosfigueira/archive/2013/06/19/custom-api-in-azure-mobile-services-client-sdks.aspx).  

Also, consider finding out more about the following Mobile Services topics:

* [Define a custom API that supports periodic notifications]
	<br/>Learn how to use a custom API to support periodic notifications in a Windows Store app. With period notifications enabled, Windows will periodically access your custom API endpoint and use the returned XML, in a tile-specific format, to update the app tile on start menu.

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
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Add Mobile Services to an existing app]: mobile-services-dotnet-backend-windows-universal-dotnet-get-started-data.md

[Define a custom API that supports periodic notifications]: mobile-services-windows-store-dotnet-create-pull-notifications.md
[Store server scripts in source control]: mobile-services-store-scripts-source-control.md
