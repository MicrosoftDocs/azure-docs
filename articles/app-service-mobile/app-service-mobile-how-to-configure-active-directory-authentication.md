<properties 
	pageTitle="How to configure Azure Active Directory authentication for your App Services application" 
	description="Learn how to configure Azure Active Directory authentication for your App Services application." 
	authors="mattchenderson" 
	services="app-service\mobile" 
	documentationCenter="" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="07/27/2015" 
	ms.author="mahender"/>

# How to configure your application to use Azure Active Directory login

[AZURE.INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]
&nbsp;

[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to configure Azure App Services to use Azure Active Directory as an authentication provider. 

## <a name="register"> </a>Register your application with Azure Active Directory

1. Log on to the [Preview Azure Management Portal], and navigate to your Mobile App.

2. Under **Settings**, click **User authentication**, and then click **Azure Active Directory**. Copy the **App URL** and the **Reply URL** listed there. You will use these later. Make sure that the **App URL** and **Reply URL** are using the HTTPS scheme.

    ![][1]

3. Sign in to the [Azure Management Portal] and navigate to **Active Directory**.

    ![][2] 

4. Select your directory, and then select the **Applications** tab at the top. Click **ADD** at the bottom to create a new app registration. 

5. Click **Add an application my organization is developing**.

6. In the Add Application Wizard, enter a **Name** for your application and click the  **Web Application And/Or Web API** type. Then click to continue.

7. In the **SIGN-ON URL** box, paste the App ID you copied from the Active Directory identity provider settings of your Mobile App. Enter that same resource identifier in the **App ID URI** box. Then click to continue.

8. Once the application has been added, click the **Configure** tab. Edit the **Reply URL** under **Single Sign-on** to be the Mobile App Reply URL you copied earlier. It should be the Mobile App gateway appended with _/signin-aad_. For example, `https://contosogateway.azurewebsites.net/signin-aad`. Make sure that you are using the HTTPS scheme.

    ![][3]

9. Click **Save**. Then copy the **Client ID** for the app.

## <a name="secrets"> </a>Add Azure Active Directory information to your Mobile App

1. Return to the preview management portal and the **Azure Active Directory** settings blade for your Mobile App. Paste in the **Client ID** setting for the Azure Active Directory identity provider.
  
2. In the **Allowed Tenants** list, you need to add the domain of the directory in which you registered the application (e.g. contoso.onmicrosoft.com). You can find your default domain name by clicking the **Domains** tab on your Azure Active Directory tenant. Add your domain name to the **Allowed Tenants** list then click **Save**.  

You are now ready to use Azure Active Directory for authentication in your app. 

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

Authenticate users of your Mobile App with Azure Active Directory single sign-on: [iOS][ios-adal]

<!-- Images. -->

[1]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/mobile-app-aad-settings.png
[2]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-navigate-aad.png
[3]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-app-configure.png

<!-- URLs. -->

[Preview Azure Management Portal]: https://portal.azure.com/
[Azure Management Portal]: https://manage.windowsazure.com/
[ios-adal]: ../app-service-mobile-xamarin-ios-aad-sso.md