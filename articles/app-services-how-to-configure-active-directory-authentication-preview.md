<properties 
	pageTitle="How to configure Azure Active Directory authentication for your App Services application" 
	description="Learn how to configure Azure Active Directory authentication for your App Services application." 
	authors="mattchenderson,wesmc7777" 
	services="app-services" 
	documentationCenter="" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="mahender"/>

# How to configure your application to use Azure Active Directory login

This topic shows you how to register your apps to be able to use Azure Active Directory as an authentication provider for Azure App Services. 

1. Log on to the [New Azure Management Portal], and navigate to your App Services gateway.

2. Click the **User authentication** part and select **Azure Active Directory**. Copy the **APP URL**.

    ![][1]

3. Sign in to the [Current Azure Management Portal] and navigate to **Active Directory**.

    ![][2] 

5. Select your directory, and then select the **Applications** tab at the top. Click **ADD** at the bottom to create a new app registration. 

6. Click **Add an application my organization is developing**.

7. In the Add Application Wizard, enter a **Name** for your application and click the  **Web Application And/Or Web API** type. Then click to continue.

8. In the **SIGN-ON URL** box, paste the App ID you copied from the Active Directory identity provider settings of your gateway. Enter the same unique resource identifier in the **App ID URI** box. Then click to continue.

9. Once the application has been added, click the **Configure** tab. Edit the **Reply URL** under **Single Sign-on** to be the URL of your gateway appended with the path, _/signin-aad_. For example,  `https://contoso.azurewebsites.net/signin-aad`.

    ![][3]

10. Then copy the **Client ID** for the app.

11. Return to the new management portal and the **User Authentication** blade for your gateway. Paste in the **Client ID** setting for the Azure Active directory identity provider.
  
12. In the **Allowed Tenants** list, you need to add the domain of the directory in which you registered the application (e.g. contoso.onmicrosoft.com). You can find your default domain name by clicking the **Domains** tab on your Azure Active Directory tenant. Add your domain name to the **Allowed Tenants** list then click **Save**.  

You are now ready to use an Azure Active Directory for authentication in your app. 

## <a name="related-content"> </a>Related Content
Add Authentication to your Mobile App: [Xamarin.iOS](xamarin)

Authenticate your app with Azure Active Directory Single Sign-On: [Xamarin.iOS](xamarin-adal)

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/app-services-how-to-configure-active-directory-authentication/app-services-aad-settings.png
[2]: ./media/app-services-how-to-configure-active-directory-authentication/app-services-navigate-aad.png
[3]: ./media/app-services-how-to-configure-active-directory-authentication/app-services-aad-app-configure.png

<!-- URLs. -->
[New Azure Management Portal]: https://portal.azure.com/
[Current Azure Management Portal]: https://manage.windowsazure.com/
[xamarin]: /en-us/documentation/articles/app-services-mobile-app-dotnet-backend-xamarin-ios-get-started-users-preview/
[xamarin-adal]: /en-us/documentation/articles/app-services-mobile-app-dotnet-backend-windows-store-dotnet-aad-sso/