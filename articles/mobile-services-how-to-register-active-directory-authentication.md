<properties linkid="develop-mobile-how-to-guides-register-for-active-directory-authentication" urlDisplayName="Register for Azure Active Directory Authentication" pageTitle="Register for Azure Active Directory authentication - Mobile Services" metaKeywords="Azure registering application, Azure Active Directory authentication, application authenticate, authenticate mobile services" description="Learn how to register for Azure Active Directory authentication in your Mobile Services application." title="Register your account to use an Azure Active Directory account login" authors="wesmc" services="mobile-services" documentationCenter="Mobile" />

# Register your apps to use an Azure Active Directory Account login

This topic shows you how to register your apps to be able to use Azure Active Directory as an authentication provider for Azure Mobile Services. 

> [WACOM.NOTE] If you want to provide client-driven authentication for single sign-on (SSO) with Azure Active Directory, see the <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-adal-sso-authentication/">Authenticate your app with Active Directory Authentication Library Single Sign-On</a> tutorial. 

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

8. In the **SIGN-ON URL** box, paste the App ID you copied from the Active Directory identity provider settings of your mobile service. Also enter a unique resource identifier in the **App ID URI** box. Then click to continue.

	>[WACOM.NOTE]For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-aad_ your mobile service as a .NET service, such as <code>https://todolist.azure-mobile.net/signin-aad</code>.  

    ![][6]


9. Once the application has been added, click the **Configure** tab. Then click to copy the **Client ID** for the app.

    ![][8]


10. Return to your mobile service's **Identity** tab. At the bottom, paste in the **Client ID** setting for the azure active directory identity provider. 

    > [WACOM.NOTE] If you are configuring an app with a .Net Backend Mobile Service that uses the <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-adal-sso-authentication/">Active Directory Authentication Library (ADAL) for single sign-on authentication</a>, you will see an **Allowed Tenants** list on the identity tab. In this step, you must add all tenant domains (e.g. contoso.onmicrosoft.com) that will be allowed to access the mobile service to this **Allowed Tenants** list. This setting is not relevant to JavaScript backend mobile services. 


 
    Then click **Save**.

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

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/

