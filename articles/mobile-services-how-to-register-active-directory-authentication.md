<properties 
	pageTitle="Register for Azure Active Directory authentication - Mobile Services" 
	description="Learn how to register for Azure Active Directory authentication in your Mobile Services application." 
	authors="wesmc7777" 
	services="mobile-services" 
	documentationCenter="" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="wesmc"/>

# Register your apps to use an Azure Active Directory Account login
##Overview


This topic shows you how to register your apps to be able to use Azure Active Directory as an authentication provider for Azure Mobile Services. 

##Registering your app

>[AZURE.NOTE] The steps outlined in this topic are intended to be used with [Add Authentication to your Mobile Services app](mobile-services-dotnet-backend-windows-store-dotnet-get-started-users.md) tutorial when you want to use [Service-directed login operations](http://msdn.microsoft.com/library/azure/dn283952.aspx) with your app. Alternatively, if your app has a requirement for [client-directed login operations](http://msdn.microsoft.com/library/azure/jj710106.aspx) for Azure Active Directory and a .NET backend mobile service you should start with the [Authenticate your app with Active Directory Authentication Library Single Sign-On](mobile-services-windows-store-dotnet-adal-sso-authentication.md) tutorial.


1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your mobile service.

    ![][1]

2. Click the **Identity** tab for your mobile service. 

    ![][2]

3. Scroll down to the **Azure active directory** identity provider section and copy the **APP URL** listed there.

    ![][3]

4. Navigate to **Active Directory** in the management portal, then click your directory.

    ![][4] 

5. Click the **Applications** tab at the top, then click to **ADD** an app. 

    ![][10]

6. Click **Add an application my organization is developing**.

7. In the Add Application Wizard, enter a **Name** for your application and click the  **Web Application And/Or Web API** type. Then click to continue.

    ![][5]

8. In the **SIGN-ON URL** box, paste the App ID you copied from the Active Directory identity provider settings of your mobile service. Enter the same unique resource identifier in the **App ID URI** box. Then click to continue.
 
    ![][6]


9. Once the application has been added, click the **Configure** tab. Then click to copy the **Client ID** for the app.

    If you created the mobile service to use the .Net backend for your mobile service, additionally edit the **Reply URL** under **Single Sign-on** to be the URL of your mobile service appended with the path, _signin-aad_. For example,  `https://todolist.azure-mobile.net/signin-aad`

    ![][8]


10. Return to your mobile service's **Identity** tab. At the bottom, paste in the **Client ID** setting for the azure active directory identity provider.

  
11. In the **Allowed Tenants** list, you need to add the domain of the directory in which you registered the application (e.g. contoso.onmicrosoft.com). You can find your default domain name by clicking the **Domains** tab on your Active Directory.

    ![][11]
 
    Add your domain name to the **Allowed Tenants** list then click **Save**.    


    ![][9]



You are now ready to use an Azure Active Directory for authentication in your app. 



<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-selection.png
[2]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-identity-tab.png
[3]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-copy-app-url-waad-auth.png
[4]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-select-ad-waad-auth.png
[5]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-add-app-wizard-1-waad-auth.png
[6]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-add-app-wizard-2-waad-auth.png
[7]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-add-app-wizard-3-waad-auth.png
[8]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-clientid-waad-auth.png
[9]: ./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-clientid-pasted-waad-auth.png
[10]:./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-waad-idenity-tab-selection.png
[11]:./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-default-domain.png

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/

