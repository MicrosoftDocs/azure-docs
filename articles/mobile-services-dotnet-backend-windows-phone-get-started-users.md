<properties pageTitle="Get started with authentication (Windows Phone) | Mobile Dev Center" description="Learn how to use Mobile Services to authenticate users of your Windows Phone app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft." services="mobile-services" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-phone" ms.devlang="dotnet" ms.topic="article" ms.date="09/23/2014" ms.author="glenga"/>

# Add authentication to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-users](../includes/mobile-services-selector-get-started-users.md)]

This topic shows you how to authenticate users in Azure Mobile Services from your Windows Phone app. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.

>[AZURE.NOTE] This topic supports only Windows Phone 8.0 and Windows Phone 8.1 Silverlight apps. If you have a Windows Phone Store 8.1 or universal Windows app, please instead follow the [universal Windows app version of this topic](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users/).

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]
4. [Store authentication tokens on the client]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 


##<a name="register"></a> Register your app for authentication and configure Mobile Services

[AZURE.INCLUDE [mobile-services-register-authentication](../includes/mobile-services-register-authentication.md)] 

[AZURE.INCLUDE [mobile-services-dotnet-backend-aad-server-extension](../includes/mobile-services-dotnet-backend-aad-server-extension.md)] 

## <a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [mobile-services-restrict-permissions-dotnet-backend](../includes/mobile-services-restrict-permissions-dotnet-backend.md)] 

<ol start="6">
<li>In Visual Studio, open your client app project and ensure that in App.xaml.cs, the instance of **MobileServiceClient** is configured to use the cloud URL to the mobile service.</li> 
<li><p>Press the F5 key to run this quickstart-based app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.</p>
   
   	<p>This happens because the app attempts to access Mobile Services as an unauthenticated user, but the <em>TodoItem</em> table now requires authentication.</p></li>
</ol>

Next, you will update the app to authenticate users before requesting resources from the mobile service.

##<a name="add-authentication"></a>Add authentication to the app

[AZURE.INCLUDE [mobile-services-windows-phone-authenticate-app](../includes/mobile-services-windows-phone-authenticate-app.md)]

##<a name="tokens"></a>Store the authorization tokens on the client

[AZURE.INCLUDE [mobile-services-windows-phone-authenticate-app-with-token](../includes/mobile-services-windows-phone-authenticate-app-with-token.md)] 

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Service-side authorization of Mobile Services users][Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. Learn more about how to use Mobile Services with .NET in [Mobile Services .NET How-to Conceptual Reference]

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Store authentication tokens on the client]: #tokens
[Next Steps]: #next-steps


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Single sign-on for Windows Phone apps by using Live Connect]: /en-us/documentation/articles/mobile-services-windows-phone-single-sign-on
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push/
[Authorize users with scripts]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-authorize-users-in-scripts
[JavaScript and HTML]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-users/

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
[Register your Windows Store app package for Microsoft authentication]: /en-us/documentation/articles/mobile-services-how-to-register-store-app-package-microsoft-authentication
