<properties
	pageTitle="Register for Azure Active Directory authentication | Microsoft Azure"
	description="Learn how to register for Azure Active Directory authentication in your Mobile Services application."
	authors="wesmc7777"
	services="mobile-services"
	documentationCenter=""
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="multiple"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="ricksal"/>

# Register your apps to use an Azure Active Directory Account login

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


[AZURE.INCLUDE [mobile-services-selector-register-identity-provider](../../includes/mobile-services-selector-register-identity-provider.md)]

##Overview

This topic shows you how to register your apps to be able to use Azure Active Directory as an authentication provider for your mobile service.

##Registering your app

>[AZURE.NOTE] The steps outlined in this topic are intended to be used with [Add Authentication to your Mobile Services app](mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users.md) tutorial when you want to use [Service-directed login operations](http://msdn.microsoft.com/library/azure/dn283952.aspx) with your app. Alternatively, if your app has a requirement for [client-directed login operations](http://msdn.microsoft.com/library/azure/jj710106.aspx) for Azure Active Directory and a .NET backend mobile service you should start with the [Authenticate your app with Active Directory Authentication Library Single Sign-On](mobile-services-windows-store-dotnet-adal-sso-authentication.md) tutorial.

1. Log on to the [Azure classic portal], navigate to your mobile service, click the **Identity** tab, then scroll down to the **Azure active directory** identity provider section and copy the **App URL** shown there.

    ![Mobile service app URL for AAD](./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-copy-app-url-waad-auth.png)

2. Navigate to **Active Directory** in the [classic portal], click your directory then **Domains** and make a note of your directory's default domain.

3. Click **Applications** > **Add** > **Add an application my organization is developing**.

4. In the Add Application Wizard, enter a **Name** for your application and click the  **Web application and/or Web API** type.

    ![Name your AAD app](./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-add-app-wizard-1-waad-auth.png)

5. In the **Sign-on URL** box, paste the app URL value you copied from your mobile service. Enter the same unique value in the **App ID URI** box, then click to continue.

    ![Set the AAD app properties](./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-add-app-wizard-2-waad-auth.png)

6. After the application has been added, click the **Configure** tab and copy the **Client ID** for the app.

    >[AZURE.NOTE]For a .NET backend mobile service, you must also edit the **Reply URL** value under **Single Sign-on** to be the URL of your mobile service appended with the path, _signin-aad_. For example,  `https://todolist.azure-mobile.net/signin-aad`

7. Return to your mobile service's **Identity** tab and paste the copied **Client ID** value for the azure active directory identity provider.

    ![](./media/mobile-services-how-to-register-active-directory-authentication/mobile-services-clientid-pasted-waad-auth.png)

8.  In the **Allowed Tenants** list, type the domain of the directory in which you registered the application (such as `contoso.onmicrosoft.com`), then click **Save**.

You are now ready to use an Azure Active Directory for authentication in your app.

<!-- Anchors. -->

<!-- Images. -->


<!-- URLs. -->
[Azure classic portal]: https://manage.windowsazure.com/
[classic portal]: https://manage.windowsazure.com/


