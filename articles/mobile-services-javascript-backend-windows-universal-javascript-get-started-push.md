<properties pageTitle="Get started with push notification using a JavaScript backend mobile service" description="Learn how to use Azure Mobile Services and Notification Hubs to send push notifications to your universal Windows app." services="mobile-services, notification-hubs" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="javascript" ms.topic="article" ms.date="09/15/2014" ms.author="glenga"/>


# Add push notifications to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-push](../includes/mobile-services-selector-get-started-push.md)]

This topic shows you how to use Azure Mobile Services with a JavaScript backend to send push notifications to a universal Windows app. In this tutorial you enable push notifications using Azure Notification Hubs in a universal Windows app project. When complete, your mobile service will send a push notification from the JavaScript backend to all registered Windows Store and Windows Phone Store apps each time a record is inserted in the TodoList table. The notification hub that you create is free with your mobile service, can be managed independent of the mobile service, and can be used by other applications and services.

>[AZURE.NOTE]This topic shows you how to use the tooling in Visual Studio 2013 with Update 3 to add support for push notifications from Mobile Services to a universal Windows app. The same steps can be used to add push notifications from Mobile Services to a Windows Store or Windows Phone Store 8.1 app. If you cannot upgrade to Visual Studio 2013 Update 3 or you prefer to manually add your mobile service project to a Windows Store app solution, see [this version](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-push) of the topic.

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications](#register)
2. [Update the service to send push notifications](#update-service)
3. [Test push notifications in your app](#test)

To complete this tutorial, you need the following:

* An active [Microsoft Store account](http://go.microsoft.com/fwlink/p/?LinkId=280045).
* [Visual Studio 2013 Express for Windows](http://go.microsoft.com/fwlink/?LinkId=257546) with Update 3, or a later version 

##<a id="register"></a>Register your app for push notifications

[AZURE.INCLUDE [mobile-services-create-new-push-vs2013](../includes/mobile-services-create-new-push-vs2013.md)]

<ol start="6">
<li><p>Browse to the <code>\services\mobileServices\scripts</code> project folder, copy the generated &lt;<em>your_service_name</em>&gt;.push.register.js script file into the shared <code>\js</code> folder, and then delete this file from both of the individual Windows and WindowsPhone app projects.</p></li> 
<li><p>Open this script file in the shared <code>\js</code> project folder, locate the code in the <em>activated</em> event listener that registers the device's channel URL with the notification hub, and delete the <strong>done</strong> promise function.</p>
<p>This tutorial sends notifications when a new item is inserted, not when a custom API is called.</p></li>
<li><p>In the Windows app project, open the default.html file and change the path of the script file reference to the shared <code>\js</code> project folder, so that it looks like the following:</p><pre><code>&lt;script src="/js/your_service_name.push.register.js"&gt;&lt;/script&gt;</code></pre></li>
<li><p>Repeat this step for the WindowsPhone app project.</p>
<p>Now, both projects are using a shared version of the push registration script.</p></li>
</ol>

Now that push notifications are enabled in the app, you must update the mobile service to send push notifications. 

##<a id="update-service"></a>Update the service to send push notifications

The following steps update the insert script registered to the TodoItem table. You can implement similar code in any server script or anywhere else in your backend services. 

[AZURE.INCLUDE [mobile-services-javascript-update-script-notification-hubs](../includes/mobile-services-javascript-update-script-notification-hubs.md)]

##<a id="test"></a> Test push notifications in your app

[AZURE.INCLUDE [mobile-services-javascript-backend-windows-universal-test-push](../includes/mobile-services-javascript-backend-windows-universal-test-push.md)]

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated the basics of enabling Windows Store apps to use Mobile Services and Notification Hubs to send push notifications. Next, consider completing the next tutorial, [Send push notifications to authenticated users], which shows how to use tags to send push notifications from a Mobile Service to only an authenticated user.

Learn more about Mobile Services and Notification Hubs in the following topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using mobile services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with different account types using mobile services.

* [What are Notification Hubs?]
  <br/>Learn more about how Notification Hubs works to deliver notifications to your apps across all major client platforms.

* [Debug Notification Hubs applications](http://go.microsoft.com/fwlink/p/?linkid=386630)
  </br>Get guidance troubleshooting and debugging Notification Hubs solutions. 

* [How to use an HTML/JavaScript client for Azure Mobile Services]
  <br/>Learn more about how to use Mobile Services from HTML and JavaScript apps.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started
[Get started with data]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-universal-javascript-get-started-data
[Get started with authentication]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-universal-javascript-get-started-users

[Send push notifications to authenticated users]: /en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-push-notifications-app-users/

[What are Notification Hubs?]: /en-us/documentation/articles/notification-hubs-overview/

[How to use an HTML/JavaScript client for Azure Mobile Services]: /en-us/documentation/articles/mobile-services-html-how-to-use-client-library
