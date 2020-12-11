---
title: Tutorial - Add authentication to a web app on Azure App Service | Azure
description: In this tutorial, you learn how to enable authentication and authorization for a web app running on Azure App Service. Limit access to the web app to users in your organization​.
services: active-directory, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 11/09/2020
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, enable authentication and authorization for a web app running on Azure App Service.
---

# Tutorial: Add authentication to your web app running on Azure App Service

Learn how to enable authentication for your web app running on Azure App Service and limit access to users in your organization.

:::image type="content" source="./media/scenario-secure-app-authentication-app-service/web-app-sign-in.svg" alt-text="Diagram that shows user sign-in." border="false":::

App Service provides built-in authentication and authorization support, so you can sign in users and access data by writing minimal or no code in your web app. Using the App Service authentication/authorization module isn't required, but helps simplify authentication and authorization for your app. This article shows how to secure your web app with the App Service authentication/authorization module by using Azure Active Directory (Azure AD) as the identity provider.

The authentication/authorization module is enabled and configured through the Azure portal and app settings. No SDKs, specific languages, or changes to application code are required.​ A variety of identity providers are supported, which includes Azure AD, Microsoft Account, Facebook, Google, and Twitter​​. When the authentication/authorization module is enabled, every incoming HTTP request passes through it before being handled by app code.​​ To learn more, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create and publish a web app on App Service

For this tutorial, you need a web app deployed to App Service. You can use an existing web app, or you can follow the [ASP.NET Core quickstart](quickstart-dotnetcore.md) to create and publish a new web app to App Service.

Whether you use an existing web app or create a new one, take note of the web app name and the name of the resource group that the web app is deployed to. You need these names throughout this tutorial. Throughout this tutorial, example names in procedures and screenshots contain *SecureWebApp*.

## Configure authentication and authorization

You now have a web app running on App Service. Next, you enable authentication and authorization for the web app. You use Azure AD as the identity provider. For more information, see [Configure Azure AD authentication for your App Service application](configure-authentication-provider-aad.md).

In the [Azure portal](https://portal.azure.com) menu, select **Resource groups**, or search for and select **Resource groups** from any page.

In **Resource groups**, find and select your resource group. In **Overview**, select your app's management page.

:::image type="content" alt-text="Screenshot that shows selecting your app's management page." source="./media/scenario-secure-app-authentication-app-service/select-app-service.png":::

On your app's left menu, select **Authentication / Authorization**, and then enable App Service Authentication by selecting **On**.

In **Action to take when request is not authenticated**, select **Log in with Azure Active Directory**.

Under **Authentication Providers**, select **Azure Active Directory**. Select **Express**, and then accept the default settings to create a new Active Directory app. Select **OK**.

:::image type="content" alt-text="Screenshot that shows Express authentication." source="./media/scenario-secure-app-authentication-app-service/configure-authentication.png":::

On the **Authentication / Authorization** page, select **Save**.

When you see the notification with the message `Successfully saved the Auth Settings for <app-name> App`, refresh the portal page.

You now have an app that's secured by the App Service authentication and authorization.

## Verify limited access to the web app

When you enabled the App Service authentication/authorization module, an app registration was created in your Azure AD tenant. The app registration has the same display name as your web app. To check the settings, select **Azure Active Directory** from the portal menu, and select **App registrations**. Select the app registration that was created. In the overview, verify that **Supported account types** is set to **My organization only**.

:::image type="content" alt-text="Screenshot that shows verifying access." source="./media/scenario-secure-app-authentication-app-service/verify-access.png":::

To verify that access to your app is limited to users in your organization, start a browser in incognito or private mode and go to `https://<app-name>.azurewebsites.net`. You should be directed to a secured sign-in page, verifying that unauthenticated users aren't allowed access to the site. Sign in as a user in your organization to gain access to the site. You can also start up a new browser and try to sign in by using a personal account to verify that users outside the organization don't have access.

## Clean up resources

If you're finished with this tutorial and no longer need the web app or associated resources, [clean up the resources you created](scenario-secure-app-clean-up-resources.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Configure authentication for the web app.
> * Limit access to the web app to users in your organization.

> [!div class="nextstepaction"]
> [App service accesses storage](scenario-secure-app-access-storage.md)
