---
title: Tutorial - Add authentication to a web app on Azure App Service | Azure
description: In this tutorial, you learn how to enable authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
services: active-directory, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 02/25/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, enable authentication and authorization for a web app running on Azure App Service.
---

# Tutorial: Add authentication to your web app running on Azure App Service

Learn how to enable authentication for your web app running on Azure App Service and limit access to users in your organization.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization by using Azure Active Directory (Azure AD) as the identity provider.

## Automatic authentication provided by App Service

App Service provides built-in authentication and authorization support, so you can sign in users with no code in your web app. Using the optional App Service authentication/authorization module simplifies authentication and authorization for your app. When you are ready for custom authentication and authorization, you build on this architecture.

App service authentication provides:

* Easily turn on and configure through the Azure portal and app settings. 
* No SDKs, specific languages, or changes to application code are required.​ 
* Several identity providers are supported:
    * Azure AD
    * Microsoft Account
    * Facebook
    * Google
    * Twitter

When the authentication/authorization module is enabled, every incoming HTTP request passes through it before being handled by your app code.​​ To learn more, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).

## Connect to backend services as user or app

User authentication can begin with authenticating the user to your app service as described in the previous section. 

:::image type="content" source="./media/scenario-secure-app-authentication-app-service/web-app-sign-in.svg" alt-text="Diagram that shows user sign-in." border="false":::

Once the app service has the authenticated identity, you as the system architect, chooses if your system needs to: 
* Connect to backend services as the app:
    * Use [managed identity](./tutorial-connect-overview.md). If managed identity isn't available, then use Key Vault. 
    * The user identity doesn't need to flow further. Any additional security to reach backend services is handled with the app service's identity. 
* Connect to backend services as the user:
    * A database example is a SQL database which imposes its own security for that identity on tables
    * A storage example is Blob Storage which imposes its own security for that identity on containers and blobs
    * A user needs access to Microsoft Graph for email access.

## 1. Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## 2. Create and publish a web app on App Service

For this tutorial, you need a web app deployed to App Service. You can use an existing web app, or you can follow one of the quickstarts to create and publish a new web app to App Service:

    * [ASP.NET Core](quickstart-dotnetcore.md)
    * [Node.js](quickstart-nodejs.md) 
    * [Python](quickstart-python.md)
    * [Java](quickstart-java.md)

Whether you use an existing web app or create a new one, take note of the following: 
* **Web app name**.
* **Resource group** that the web app is deployed to. 

You need these names throughout this tutorial. 

## 3. Configure authentication and authorization

Now that you have a web app running on App Service, enable authentication and authorization. You use Azure AD as the identity provider. For more information, see [Configure Azure AD authentication for your App Service application](configure-authentication-provider-aad.md).

1. In the [Azure portal](https://portal.azure.com) menu, select **Resource groups**, or search for and select **Resource groups** from any page.

1. In **Resource groups**, find and select your resource group. In **Overview**, select your app's management page.

    :::image type="content" alt-text="Screenshot that shows selecting your app's management page." source="./media/scenario-secure-app-authentication-app-service/select-app-service.png":::
    
1. On your app's left menu, select **Authentication**, and then click **Add identity provider**.

1. In the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to sign in Microsoft and Azure AD identities.

1. For **App registration** > **App registration type**, select **Create new app registration**.

1. For **App registration** > **Supported account types**, select **Current tenant-single tenant**.

1. In the **App Service authentication settings** section, leave **Authentication** set to **Require authentication** and **Unauthenticated requests** set to **HTTP 302 Found redirect: recommended for websites**.

1. At the bottom of the **Add an identity provider** page, click **Add** to enable authentication for your web app.

    :::image type="content" alt-text="Screenshot that shows configuring authentication." source="./media/scenario-secure-app-authentication-app-service/configure-authentication.png":::
    
    You now have an app that's secured by the App Service authentication and authorization.

    > [!NOTE]
    > To allow accounts from other tenants, change the 'Issuer URL' to 'https://login.microsoftonline.com/common/v2.0' by editing your 'Identity Provider' from the 'Authentication' blade.
    >

## 4. Verify limited access to the web app

When you enabled the App Service authentication/authorization module in the previous section, an app registration was created in your Azure AD tenant. The app registration has the same display name as your web app. 

1. To check the settings, select **Azure Active Directory** from the portal menu, and select **App registrations**. 
1. Select the app registration that was created. 
1. In the overview, verify that **Supported account types** is set to **My organization only**.

    :::image type="content" alt-text="Screenshot that shows verifying access." source="./media/scenario-secure-app-authentication-app-service/verify-access.png":::
    
1. To verify that access to your app is limited to users in your organization, start a browser in incognito or private mode and go to `https://<app-name>.azurewebsites.net`. 
1. You should be directed to a secured sign-in page, verifying that unauthenticated users aren't allowed access to the site. 
1. Sign in as a user in your organization to gain access to the site. 
    You can also start up a new browser and try to sign in by using a personal account to verify that users outside the organization don't have access.

## 5. Clean up resources

[!INCLUDE [clean up resources](./includes/scenario-secure-app-clean-up-resources.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization.

> [!div class="nextstepaction"]
> [App service accesses storage](scenario-secure-app-access-storage.md)
