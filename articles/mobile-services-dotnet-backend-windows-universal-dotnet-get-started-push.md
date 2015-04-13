<properties 
	pageTitle="Get started with push notification using a .NET backend mobile service" 
	description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your universal Windows app." 
	services="mobile-services,notification-hubs" 
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
	ms.date="04/09/2015" 
	ms.author="glenga"/>

# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push](../includes/mobile-services-selector-get-started-push.md)]
#Overview
This topic shows you how to use Azure Mobile Services with a .NET backend to send push notifications to a universal Windows app. In this tutorial you enable push notifications using Azure Notification Hubs in a universal Windows app project. When complete, your mobile service will send a push notification from the .NET backend to all registered Windows Store and Windows Phone Store apps each time a record is inserted in the TodoList table. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio Professional 2013 with Update 3 to add support for push notifications from Mobile Services to a universal Windows app. The same steps can be used to add push notifications from Mobile Services to a Windows Store or Windows Phone Store 8.1 app. To add push notifications to a Windows Phone 8 or Windows Phone Silverlight 8.1 app, see this version of [Get started with push notifications in Mobile Services](mobile-services-dotnet-backend-windows-phone-get-started-push.md).

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications](#register)
2. [Update the service to send push notifications](#update-service)
3. [Enable push notifications for local testing](#local-testing)
4. [Test push notifications in your app](#test)

To complete this tutorial, you need the following:

* An active [Microsoft Store account](http://go.microsoft.com/fwlink/p/?LinkId=280045).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=391934" target="_blank">Visual Studio Community 2013</a>. 

##<a id="register"></a>Register your app for push notifications

[AZURE.INCLUDE [mobile-services-create-new-push-vs2013](../includes/mobile-services-create-new-push-vs2013.md)]

<ol start="6">
<li><p>Browse to the <code>\Services\MobileServices\your_service_name</code> project folder, open the generated push.register.cs code file, and inspect the <strong>UploadChannel</strong> method that registers the device's channel URL with the notification hub.</p></li> 
<li><p>Open the shared App.xaml.cs code file and notice that a call to the new <strong>UploadChannel</strong> method was added in the <strong>OnLaunched</strong> event handler.</p> <p>This makes sure that registration of the device is attempted whenever the app is launched.</p></li>
<li><p>Repeat the previous steps to add push notifications to the Windows Phone Store app project, then in the shared App.xaml.cs file, remove the extra call to <strong>UploadChannel</strong> and the remaining <code>#if...#endif</code> conditional wrapper.</p> <p>Both projects can now share a single call to <strong>UploadChannel</strong>.</p>
</li>
</ol>

> [AZURE.NOTE] You can also simplify the generated code by unifying the <code>#if...#endif</code> wrapped [MobileServiceClient](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx) definitions into a single unwrapped definition used by both versions of the app.

Now that push notifications are enabled in the app, you must update the mobile service to send push notifications. 

##<a id="update-service"></a>Update the service to send push notifications

The following steps update the existing TodoItemController class to send a push notification to all registered devices when a new item is inserted. You can implement similar code in any custom [ApiController](https://msdn.microsoft.com/library/system.web.http.apicontroller.aspx), [TableController](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.tables.tablecontroller.aspx), or anywhere else in your backend services. 

[AZURE.INCLUDE [mobile-services-dotnet-backend-update-server-push](../includes/mobile-services-dotnet-backend-update-server-push.md)]

##<a id="local-testing"></a> Enable push notifications for local testing

[AZURE.INCLUDE [mobile-services-dotnet-backend-configure-local-push-vs2013](../includes/mobile-services-dotnet-backend-configure-local-push-vs2013.md)]

The remaining steps in this section are optional. They allow you to test your app against your mobile service running on a local computer. If you plan to test push notifications using the mobile service running in Azure, you can just skip to the last section. This is because the Add Push Notification wizard already configured your app to connect to your service running in Azure. 

>[AZURE.NOTE]Never use a production mobile service for testing and development work. Always publish your mobile service project to a separate staging service for testing.

<ol start="5">
<li><p>Open the shared App.xaml.cs project file and locate any the lines of code that create a new instance of the <a href="http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx">MobileServiceClient</a> class to access the mobile service running in Azure.</p></li>
<li><p>Comment-out this code and add code that creates a new <a href="http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx">MobileServiceClient</a> of the same name but using the URL of the local host in the constructor, similar to the following:</p>
<pre><code>// This MobileServiceClient has been configured to communicate with your local
// test project for debugging purposes.
public static MobileServiceClient todolistClient = new MobileServiceClient(
	"http://localhost:4584"
);
</code></pre><p>Using this <a href="http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx">MobileServiceClient</a>, the app will connect to the local service instead of the version hosted in Azure. When you want to switch back and run app against the mobile service hosted in Azure, change back to the original <a href="http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.aspx">MobileServiceClient</a> definitions.</p></li>
</ol>

##<a id="test"></a> Test push notifications in your app

[AZURE.INCLUDE [mobile-services-dotnet-backend-windows-universal-test-push](../includes/mobile-services-dotnet-backend-windows-universal-test-push.md)]

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling a Windows Store app to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing the next tutorial, [Send push notifications to authenticated users], which shows how to use tags to send push notifications from a Mobile Service to only an authenticated user.

Learn more about Mobile Services and Notification Hubs in the following topics:

* [Add Mobile Services to an existing app][Get started with data]
  <br/>Learn more about storing and querying data using mobile services.

* [Add authentication to your app][Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [Debug Notification Hubs applications](http://go.microsoft.com/fwlink/p/?linkid=386630)
  </br>Get guidance troubleshooting and debugging Notification Hubs solutions. 

* [How to use a .NET client for Azure Mobile Services]
  <br/>Learn more about how to use Mobile Services from C# Windows apps.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Get started with data]: mobile-services-dotnet-backend-windows-universal-dotnet-get-started-data.md
[Get started with authentication]: mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users.md

[Send push notifications to authenticated users]: mobile-services-dotnet-backend-windows-store-dotnet-push-notifications-app-users.md

[What are Notification Hubs?]: notification-hubs-overview.md

[How to use a .NET client for Azure Mobile Services]: mobile-services-windows-dotnet-how-to-use-client-library.md
