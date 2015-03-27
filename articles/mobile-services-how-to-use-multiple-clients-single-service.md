<properties 
	pageTitle="How to use multiple clients with a single mobile service backend | Azure Mobile" 
	description="Learn how to use a single mobile service back-end from multiple client apps that target different mobile platforms, including Windows Store and Windows Phone." 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor="mollybos"/>
<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/25/2015" 
	ms.author="glenga"/>

# Supporting multiple device platforms from a single mobile service
 
One of the major benefits of using Azure Mobile Services in your mobile app development is the ability to use a single backend service that supports your app on multiple client platforms. Mobile Services provides native client libraries for all major device platforms, which makes it easier to develop apps using a single backend service and by using cross-platform developer tools. This topic discusses considerations for getting your app running on multiple client platforms while using a single mobile service backend. For more general information about Mobile Services, see the [Mobile Services developer center](/documentation/services/mobile-services/).

##<a id="push"></a>Cross-platform push notifications

Mobile Services uses Azure Notification Hubs for sending push notifications to your client apps on all major device platforms. Notification Hubs provide a consistent and unified infrastructure for creating and managing device registrations and for sending cross-platform push notifications. Notification Hubs supports sending push notifications by using the following platform-specific notification services:

+ Apple Push Notification Service (APNS) for iOS apps
+ Google Cloud Messaging (GCM) service for Android apps
+ Windows Notification Service (WNS) for Windows Store, Windows Phone 8.1 Store, and universal Windows apps 
+ Microsoft Push Notification Service (MPNS) for Windows Phone Silverlight apps

>[AZURE.NOTE]Notification Hubs does not currently support using WNS to send push notifications to Windows Phone Silverlight 8.1 apps. You must use MPNS to send notifications to Silverlight and Windows Phone 8.0 and 7.0 apps.

For more information, see [Azure Notification Hubs].

Client registrations are created by using the register function in the platform-specific Mobile Services client library or by using the Mobile Services REST APIs. Notification Hubs supports two kinds of device registrations:

+ **Native registration**<br/>Native registrations are tailored to the platform-specific push notification service. When sending notifications to devices registered using native registrations, you must call platform-specific APIs in your mobile service. To send a notification to devices on multiple platforms requires multiple platform-specific calls.   
  
+ **Template registration**<br/>Notification Hubs also supports platform-specific template registrations. By using template registrations, you can use a single API call to send a notification to your app running on any registered platform. For more information, see [Send cross-platform notifications to users].

>[AZURE.NOTE]An error occurs when trying to send a message to a native device platform for which no device registrations exists. This error does not occur when sending template notifications.

Tables in the following sections link to the client-specific tutorials that show you how to implement push notifications from both .NET and JavaScript backend mobile services.  

###.NET backend

In a .NET backend mobile service, you send notifications by calling the [SendAsync] method on the [PushClient](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.notifications.pushclient.aspx) object obtained from the [ApiServices.Push](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.apiservices.push.aspx) property. The push notification sent (native or template) depends on the specific [IPushMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.notifications.ipushmessage.aspx)-derived object that is passed to the [SendAsync] method, as shown in the following table: 

|Platform |[APNS](mobile-services-dotnet-backend-ios-get-started-push.md)|[GCM](mobile-services-dotnet-backend-android-get-started-push.md) |[WNS](mobile-services-dotnet-backend-windows-store-dotnet-get-started-push.md) |[MPNS](mobile-services-dotnet-backend-windows-phone-get-started-push.md)|
|-----|-----|----|----|-----|
|Native|[ApplePushMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.applepushmessage.aspx)   |[GooglePushMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.googlepushmessage.aspx)     |[WindowsPushMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.windowspushmessage.aspx) | [MpnsPushMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.mpnspushmessage.aspx) |

The following code sends a push notification from a .NET backend service to all iOS and Windows Store device registrations: 

	// Define a push notification for APNS.
	ApplePushMessage apnsMessage = new ApplePushMessage(item.Text, TimeSpan.FromHours(1));    

	// Define a push notification for WNS.
	WindowsPushMessage wnsMessage = new WindowsPushMessage();
    wnsMessage.XmlPayload = @"<?xml version=""1.0"" encoding=""utf-8""?>" +
                         @"<toast><visual><binding template=""ToastText01"">" +
                         @"<text id=""1"">" + item.Text + @"</text>" +
                         @"</binding></visual></toast>";
    
	// Send push notifications to all registered iOS and Windows Store devices. 
    await Services.Push.SendAsync(apnsMessage);
	await Services.Push.SendAsync(wnsMessage);

For examples of how to send push notifications to the other native client platforms, click the platform links in the header of the above table. 

When you use template client registrations rather than native client registrations, you can send the same notification with only a single call to [SendAsync], supplying a [TemplatePushMessage] object, as follows: 

	// Create a new template message and add the 'message' parameter.    
	var templatePayload = new TemplatePushMessage();
    templatePayload.Add("message", item.Text);

	// Send a push notification to all template registrations.
    await Services.Push.SendAsync(templatePayload); 
 
###JavaScript backend

In a JavaScript backend mobile service, you send notifications by calling the **send** method on the platform-specific object obtained from the global [push object], as shown in the following table: 

|Platform |[APNS](mobile-services-javascript-backend-ios-get-started-push.md)|[GCM](mobile-services-javascript-backend-android-get-started-push.md) |[WNS](mobile-services-javascript-backend-windows-store-dotnet-get-started-push.md) |[MPNS](mobile-services-javascript-backend-windows-phone-get-started-push.md)|
|-----|-----|----|----|-----|
|Native|[apns object](http://msdn.microsoft.com/library/azure/jj839711.aspx)   |[gcm object](http://msdn.microsoft.com/library/azure/dn126137.aspx)     |[wns object](http://msdn.microsoft.com/library/azure/jj860484.aspx) | [mpns object](http://msdn.microsoft.com/library/azure/jj871025.aspx) |

The following code sends push notification to all Android and Windows Phone registrations: 

	// Define a push notification for GCM.
	var gcmPayload = 
    '{"data":{"message" : item.text }}';

	// Define the payload for a Windows Phone toast notification.
	var mpnsPayload = '<?xml version="1.0" encoding="utf-8"?>' +
    '<wp:Notification xmlns:wp="WPNotification"><wp:Toast>' +
    '<wp:Text1>New Item</wp:Text1><wp:Text2>' + item.text + 
    '</wp:Text2></wp:Toast></wp:Notification>';

	// Send push notifications to all registered Android and Windows Phone 8.0 devices. 
	push.mpns.send(null, mpnsPayload, 'toast', 22, {
            success: function(pushResponse) {
                // Push succeeds.
                },              
                error: function (pushResponse) {
                    // Push fails.
                    }
                });
    push.gcm.send(null, gcmPayload, {
            success: function(pushResponse) {
                // Push succeeds.
                },              
                error: function (pushResponse) {
                    // Push fails.
                    }
                });

For examples of how to send push notifications to the other native client platforms, click the platform links in the header of the above table.

When you use template client registrations rather than native client registrations, you can send the same notification with only a single call the **send** function on the global [push object], supplying a template message payload, as follows: 

	// Create a new template message with the 'message' parameter.    
	var templatePayload = { "message": item.text };

	// Send a push notification to all template registrations.
    push.send(null, templatePayload, {
            success: function(pushResponse) {
                // Push succeeds.
                },              
                error: function (pushResponse) {
                    // Push fails.
                    }
                }); 

##<a id="xplat-app-dev"></a>Cross-platform app development
Developing native mobile device apps for all of the major mobile device platforms requires you (or your organization) to have expertise in at least Objective-C, Java, and C# or JavaScript programming languages. Because of the expense of developing across these disparate platforms, some developers choose a fully web browser-based experience for their apps. However, such web-based experiences cannot access most of the native resources that provide the rich experience that users have come to expect on their mobile devices.  

Cross-platform tools are available that provide a richer native experience on a mobile device, while still sharing a single code base, usually JavaScript. Mobile Services makes it easy to create and manage a backend service for cross-platform app development platforms by providing quickstart tutorials for the following development platforms: 

+ [**Appcelerator**](http://go.microsoft.com/fwlink/p/?LinkId=509987)<br/>Appcelerator lets you use JavaScript to develop a single app that is compiled to run  as native on all mobile device platforms. This provides a rich user experience in UI, access to all native device resources, and native app performance. For more information, see the [Appcelerator tutorial][Appcelerator].
 
+ [**PhoneGap**](https://go.microsoft.com/fwLink/p/?LinkID=390707)**/**[**Cordova**](http://cordova.apache.org/)<br/>PhoneGap (a distribution of the Apache Cordova project) is a free and open source framework that lets you use standardized web APIs, HTML and JavaScript to develop a single app that runs on Android, iOS and Windows devices. PhoneGap provides a web view based UI, but with a user experience enhanced by accessing native resources on the device, such as such as push notifications, the accelerometer, camera, storage, geolocation, and the in-app browser. For more information, see the [PhoneGap quickstart tutorial][PhoneGap]. 
	
	Visual Studio now also enables you to build cross-platform Cordova apps by using the Multi-Device Hybrid Apps extension for Visual Studio, which is pre-release software. For more information, see [Getting Started with Multi-Device Hybrid Apps Using HTML and JavaScript](http://msdn.microsoft.com/library/dn771545.aspx). 

+ [**Sencha Touch**](http://go.microsoft.com/fwlink/p/?LinkId=509988)<br/>Sencha Touch provides a set of controls, optimized for touch screens, that provide a like-native experience on a wide variety of mobile devices from a single HTML and JavaScript code base. Sencha Touch can be used along with PhoneGap or Cordova libraries to provide users access to native device resources. For more information, see the [Sencha Touch quickstart tutorial][Sencha].

+ [**Xamarin**](https://go.microsoft.com/fwLink/p/?LinkID=330242)<br/>Xamarin lets you create fully native apps for both iOS and Android devices, with fully native UI and access to all device resources. Xamarin apps are coded in C# instead of Objective-C and Java. This enables .NET developers to publish apps to iOS and Android and share code from Windows projects. Xamarin provides a fully native user experience on both iOS and Android devices from C# code. This enables you to reuse some of your Mobile Services code from Windows apps on iOS and Android devices. For more information, see [Xamarin development](#xamarin) below. 

	You can build Xamarin apps using either Xamarin Studio or Visual Studio 2013. For more information, see [Cross-Platform Development in Visual Studio](http://msdn.microsoft.com/library/dn771552.aspx).


##<a id="shared-vs"></a>Sharing and reusing code in Visual Studio projects

Mobile Services includes a .NET client library, which is a .NET Framework Portable Class Library (PCL) that supports development on all Windows platforms. For more information, see [How to use a .NET client with Mobile Services]. This makes it easy to reuse the same Mobile Services code, such as for data access or authentication, in multiple C# projects.

One general approach for sharing and reusing your C# code between projects is to implement the Model-View-ViewModel (MVVM) pattern and share assemblies across multiple platforms. You can implement the model and view model classes in a Portable Class Library project in Visual Studio, and then create views that are customized for different platforms. The model code, common across platforms, may (as an example) retrieve the data from a source such as your mobile service in a platform-agnostic manner. The MSDN Library provides an <a href="http://msdn.microsoft.com/library/gg597391(v=vs.110)">overview and example</a>, discussion of <a href="http://msdn.microsoft.com/library/gg597392(v=vs.110)">API differences</a>, an example of <a href="http://msdn.microsoft.com/library/hh563947(v=vs.110)">using portable class libraries to implement the MVVM pattern</a>, additional <a href="http://msdn.microsoft.com/library/windowsphone/develop/jj714086(v=vs.105).aspx">prescriptive guidance</a>, and information about <a href="http://msdn.microsoft.com/library/hh871422(v=vs.110)">managing resources</a> in portable class library projects.

In addition to this general guidance, Visual Studio also provides specific facilities for reusing your mobile services code across multiple client app projects, which are discussed in the following sections. For more general information about using Visual Studio 2013 to build cross-platform apps, see [Cross-Platform Development in Visual Studio](http://msdn.microsoft.com/library/dn771552.aspx).  

### Universal Windows apps

Visual Studio 2013 Update 2 adds support for universal Windows app projects. Universal apps are solutions that include both Windows Store 8.1 and Windows Phone Store 8.1 app projects along with a shared code project. In this kind of project, shared code is treated as if it is part of both the Windows Store and Windows Phone projects. For more information, see [Building universal Windows apps for all Windows devices]. Universal Windows apps can be written in both C#/XAML and JavaScript/HTML. 

By default, the Mobile Service quickstart tab in the [Azure Management portal] generates a universal Windows app version of the TodoList sample app to get you started. You can choose to download either a C#/XAML or a JavaScript/HTML version of the project. For more information, see [Get started with Mobile Services](mobile-services-windows-store-get-started.md). 

>[AZURE.NOTE]The C# version of the quickstart app project from the portal shares the MainPage.xaml.cs code-behind page but doesn't use a view model. For an example of the TodoList app as a universal Windows app project in C# that uses MVVM, see [Universal Windows app project for Azure Mobile Services using MVVM]. 

###<a id="xamarin"></a>Xamarin development

You can leverage your Visual Studio and C# development experience, by using Xamarin and either Visual Studio or Xamarin Studio to develop apps for iOS and Android. Xamarin uses a cross-platform implementation of the .NET Framework that lets you use C# code to develop iOS and Android apps. By using Xamarin, you can leverage existing code from your Windows projects that uses the Mobile Services .NET client library to access your mobile service.  For more information, see [Cross-Platform Development in Visual Studio](http://msdn.microsoft.com/library/dn771552.aspx).

To get started building Xamarin apps that use Mobile Services, see the Xamarin quickstart tutorials ([iOS](partner-xamarin-mobile-services-ios-get-started.md) / [Android](partner-xamarin-mobile-services-android-get-started.md)).


### Windows Store and Windows Phone Silverlight apps

In Windows Phone 8.1, you can choose to use the previous Silverlight-based XAML for developing apps or use the Windows Runtime-based XAML, which enables the development of universal Windows apps. For more information about Windows Phone 8.1 Silverlight apps and Windows Phone Store 8.1 apps, see [What's next for Windows Phone 8 developers]. 

The Mobile Services .NET client library supports both Windows Phone Store 8.1 and Windows Phone Silverlight 8.1 apps. Since both Windows Runtime and Windows Phone Silverlight apps cannot be built from the same project, you should consider a code reuse strategy such as PCL and MVVM described above.

>[AZURE.NOTE]In order to use single sign-on client authentication using Microsoft Account in both Windows Runtime and Windows Phone Silverlight apps, you must register the Windows Runtime app on the Windows Store dashboard first. This is because once you create a Live Connect registration for Windows Phone, you cannot create one for Windows Store. For more information about how to do this, please read the topic **Authenticate your Windows Store app with Live Connect single sign-on** ([Windows Store][SSO Windows Store]/[Windows Phone][SSO Windows Phone]).


<!-- URLs -->
[Azure Management portal]: https://manage.windowsazure.com
[Azure Notification Hubs]: /develop/net/how-to-guides/service-bus-notification-hubs/
[SSO Windows Store]: /develop/mobile/tutorials/single-sign-on-windows-8-dotnet/
[SSO Windows Phone]: /develop/mobile/tutorials/single-sign-on-wp8/
[Tutorials and resources]: /develop/mobile/resources/
[Get started with Notification Hubs]: /manage/services/notification-hubs/getting-started-windows-dotnet/
[Send cross-platform notifications to users]: /manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Get started with push Windows dotnet]: /develop/mobile/tutorials/get-started-with-push-dotnet-vs2012/
[Get started with push Windows js]: /develop/mobile/tutorials/get-started-with-push-js-vs2012/
[Get started with push Windows Phone]: /develop/mobile/tutorials/get-started-with-push-wp8/
[Get started with push iOS]: /develop/mobile/tutorials/get-started-with-push-ios/
[Get started with push Android]: /develop/mobile/tutorials/get-started-with-push-android/
[Dynamic schema]: http://msdn.microsoft.com/library/windowsazure/jj193175.aspx
[How to use a .NET client with Mobile Services]: documentation/articles/mobile-services-windows-dotnet-how-to-use-client-library/
[push object]: http://msdn.microsoft.com/library/windowsazure/jj554217.aspx
[TemplatePushMessage]:http://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.templatepushmessage.aspx
[PhoneGap]: mobile-services-javascript-backend-phonegap-get-started.md
[Sencha]: partner-sencha-mobile-services-get-started.md
[Appcelerator]: partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started.md
[SendAsync]: http://msdn.microsoft.com/library/microsoft.windowsazure.mobile.service.notifications.pushclient.sendasync.aspx
[What's next for Windows Phone 8 developers]: http://msdn.microsoft.com/library/windows/apps/dn655121(v=vs.105).aspx
[Building universal Windows apps for all Windows devices]: http://go.microsoft.com/fwlink/p/?LinkId=509905
[Universal Windows app project for Azure Mobile Services using MVVM]: http://code.msdn.microsoft.com/Universal-Windows-app-for-db3564de
