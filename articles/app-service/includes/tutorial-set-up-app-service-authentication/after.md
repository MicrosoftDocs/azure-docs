---
title: Tutorial - Add authentication to a web app on Azure App Service | Azure
description: In this tutorial, you learn how to enable authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
services: active-directory, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: include
ms.workload: identity
ms.date: 02/25/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, enable authentication and authorization for a web app running on Azure App Service.
ms.subservice: web-apps
---

## 1. Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## 2. Create and publish a web app on App Service

For this tutorial, you need a web app deployed to App Service. You can use an existing web app, or you can follow one of the quickstarts to create and publish a new web app to App Service:

* [ASP.NET Core](../../quickstart-dotnetcore.md)
* [Node.js](../../quickstart-nodejs.md) 
* [Python](../../quickstart-python.md)
* [Java](../../quickstart-java.md)

Whether you use an existing web app or create a new one, take note of the following: 

* **Web app name**.
* **Resource group** that the web app is deployed to. 

You need these names throughout this tutorial. 

## 3. Configure authentication and authorization

Now that you have a web app running on App Service, enable authentication and authorization. You use Azure AD as the identity provider. For more information, see [Configure Azure AD authentication for your App Service application](../../configure-authentication-provider-aad.md).

1. In the [Azure portal](https://portal.azure.com) menu, select **Resource groups**, or search for and select **Resource groups** from any page.

1. In **Resource groups**, find and select your resource group. In **Overview**, select your app's management page.

    :::image type="content" alt-text="Screenshot that shows selecting your app's management page." source="../../media/scenario-secure-app-authentication-app-service/select-app-service.png":::
    
1. On your app's left menu, select **Authentication**, and then click **Add identity provider**.

1. In the **Add an identity provider** page, for example select **Microsoft** as the **Identity provider** to sign in Microsoft and Azure AD identities.

1. Select a **Tenant type**, for example **Workforce** for work and school accounts or Microsoft accounts.

1. For **App registration** > **App registration type**, select **Create new app registration** to create a new app registration in Azure AD.

1. Add a **Name** for the app registration, a public facing display name.

1. For **App registration** > **Supported account types**, select **Current tenant-single tenant** so only users in your organization can sign in to the web app.

1. In the **App Service authentication settings** section, leave **Authentication** set to **Require authentication** and **Unauthenticated requests** set to **HTTP 302 Found redirect: recommended for websites**.

1. At the bottom of the **Add an identity provider** page, click **Add** to enable authentication for your web app.

    :::image type="content" alt-text="Screenshot that shows configuring authentication." source="../../media/scenario-secure-app-authentication-app-service/configure-authentication.png":::
    
    You now have an app that's secured by the App Service authentication and authorization.

    > [!NOTE]
    > To allow accounts from other tenants, change the 'Issuer URL' to 'https://login.microsoftonline.com/common/v2.0' by editing your 'Identity Provider' from the 'Authentication' blade.
    >

## 4. Verify limited access to the web app

When you enabled the App Service authentication/authorization module in the previous section, an app registration was created in your Azure AD tenant. The app registration has the same display name as your web app. 

1. To check the settings, go to the [Microsoft Entra admin center](https://entra.microsoft.com) and select **Applications** and then **App registrations** from the menu. 
1. Select the app registration that was created. 
1. In the overview, verify that **Supported account types** is set to **My organization only**.
    
1. To verify that access to your app is limited to users in your organization, got to your web app **Overview** and select the **Default domain** link.  Or, start a browser in incognito or private mode and go to `https://<app-name>.azurewebsites.net`.

    :::image type="content" alt-text="Screenshot that shows verifying access." source="../../media/scenario-secure-app-authentication-app-service/verify-access.png":::

1. You should be directed to a secured sign-in page, verifying that unauthenticated users aren't allowed access to the site.
1. Sign in as a user in your organization to gain access to the site.
    You can also start up a new browser and try to sign in by using a personal account to verify that users outside the organization don't have access.

## 5. Clean up resources

[!INCLUDE [clean up resources](../scenario-secure-app-clean-up-resources.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization.
