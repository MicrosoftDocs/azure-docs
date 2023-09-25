---
title: Tutorial - Add authentication to a web app on Azure App Service
description: In this tutorial, you learn how to enable authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
services: active-directory, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 04/25/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, enable authentication and authorization for a web app running on Azure App Service.
ms.subservice: web-apps
---

# Tutorial: Add authentication to your web app running on Azure App Service

Learn how to enable authentication for your web app running on Azure App Service and limit access to users in your organization.

:::image type="content" source="./media/multi-service-web-app-authentication-app-service/web-app-sign-in.svg" alt-text="Diagram that shows user sign-in." border="false":::

App Service provides built-in authentication and authorization support, so you can sign in users and access data by writing minimal or no code in your web app. Using the App Service authentication/authorization module isn't required, but helps simplify authentication and authorization for your app. This article shows how to secure your web app with the App Service authentication/authorization module by using Microsoft Entra ID as the identity provider.

The authentication/authorization module is enabled and configured through the Azure portal and app settings. No SDKs, specific languages, or changes to application code are required.​ A variety of identity providers are supported, which includes Microsoft Entra ID, Microsoft Account, Facebook, Google, and Twitter​​. When the authentication/authorization module is enabled, every incoming HTTP request passes through it before being handled by app code.​​ To learn more, see [Authentication and authorization in Azure App Service](../../app-service/overview-authentication-authorization.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create and publish a web app on App Service

For this tutorial, you need a web app deployed to App Service. You can use an existing web app, or you can follow one of the [ASP.NET Core](../../app-service/quickstart-dotnetcore.md), [Node.js](../../app-service/quickstart-nodejs.md), [Python](../../app-service/quickstart-python.md), or [Java](../../app-service/quickstart-java.md) quickstarts to create and publish a new web app to App Service.

Whether you use an existing web app or create a new one, take note of the following:

- web app name 
- name of the resource group that the web app is deployed to

You need these names throughout this tutorial.

## Configure authentication and authorization

You now have a web app running on App Service. Next, you enable authentication and authorization for the web app. You use Microsoft Entra ID as the identity provider. For more information, see [Configure Microsoft Entra authentication for your App Service application](../../app-service/configure-authentication-provider-aad.md).

In the [Azure portal](https://portal.azure.com) menu, select **Resource groups**, or search for and select **Resource groups** from any page.

In **Resource groups**, find and select your resource group. In **Overview**, select your app's management page.

:::image type="content" alt-text="Screenshot that shows selecting your app's management page." source="./media/multi-service-web-app-authentication-app-service/select-app-service.png":::

On your app's left menu, select **Authentication**, and then click **Add identity provider**.

In the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to sign in Microsoft and Microsoft Entra identities.

For **App registration** > **App registration type**, select **Create new app registration**.

For **App registration** > **Supported account types**, select **Current tenant-single tenant**.

In the **App Service authentication settings** section, leave **Authentication** set to **Require authentication** and **Unauthenticated requests** set to **HTTP 302 Found redirect: recommended for websites**.

At the bottom of the **Add an identity provider** page, click **Add** to enable authentication for your web app.

:::image type="content" alt-text="Screenshot that shows configuring authentication." source="./media/multi-service-web-app-authentication-app-service/configure-authentication.png":::

You now have an app that's secured by the App Service authentication and authorization.

> [!NOTE]
> To allow accounts from other tenants, change the 'Issuer URL' to 'https://login.microsoftonline.com/common/v2.0' by editing your 'Identity Provider' from the 'Authentication' blade.
>

## Verify limited access to the web app

When you enabled the App Service authentication/authorization module, an app registration was created in your Microsoft Entra tenant. The app registration has the same display name as your web app. To check the settings, sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../roles/permissions-reference.md#application-developer) and browse to **Identity** > **Applications** > **App registrations**. Select the app registration that was created. In the overview, verify that **Supported account types** is set to **My organization only**.

:::image type="content" alt-text="Screenshot that shows verifying access." source="./media/multi-service-web-app-authentication-app-service/verify-access.png":::

To verify that access to your app is limited to users in your organization, start a browser in incognito or private mode and go to `https://<app-name>.azurewebsites.net`. You should be directed to a secured sign-in page, verifying that unauthenticated users aren't allowed access to the site. Sign in as a user in your organization to gain access to the site. You can also start up a new browser and try to sign in by using a personal account to verify that users outside the organization don't have access.

## Clean up resources

If you're finished with this tutorial and no longer need the web app or associated resources, [clean up the resources you created](multi-service-web-app-clean-up-resources.md).

## Next steps

> [!div class="nextstepaction"]
> [App service accesses storage](multi-service-web-app-access-storage.md)
