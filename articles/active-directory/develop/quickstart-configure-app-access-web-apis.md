---
title: Configure an application to access web APIs - Microsoft identity platform
description: Learn how to configure an application registered with the Microsoft identity platform to include redirect URI(s), credentials, or permissions to access web APIs.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/08/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: aragra, lenalepa, sureshja
#Customer intent: As an application developer, I need to know how to configure my application to add redirect URI(s), credentials, or permissions so I can access web APIs.
ms.collection: M365-identity-device-management
---

# Quickstart: Configure a client application to access web APIs

For a web/confidential client application to be able to participate in an authorization grant flow that requires authentication (and obtain an access token), it must establish secure credentials. The default authentication method supported by the Azure portal is client ID + secret key.

Additionally, before a client can access a web API exposed by a resource application (such as Microsoft Graph API), the consent framework ensures the client obtains the permission grant required based on the permissions requested. By default, all applications can choose permissions from the Microsoft Graph API. The [Graph API “Sign-in and read user profile” permission](https://developer.microsoft.com/graph/docs/concepts/permissions_reference#user-permissions) is selected by default. You can select from [two types of permissions](developer-glossary.md#permissions) for each desired web API:

* **Application permissions** - Your client application needs to access the web API directly as itself (no user context). This type of permission requires administrator consent and is also not available for public (desktop and mobile) client applications.
* **Delegated permissions** - Your client application needs to access the web API as the signed-in user, but with access limited by the selected permission. This type of permission can be granted by a user unless the permission requires administrator consent.

  > [!NOTE]
  > Adding a delegated permission to an application does not automatically grant consent to the users within the tenant. Users must still manually consent for the added delegated permissions at runtime, unless the administrator grants consent on behalf of all users.

In this quickstart, we'll show you how to configure your app to:

* [Add redirect URIs to your application](#add-redirect-uris-to-your-application)
* [Add credentials to your web application](#add-credentials-to-your-web-application)
* [Add permissions to access web APIs](#add-permissions-to-access-web-apis)

## Prerequisites

To get started, make sure you complete these prerequisites:

* Learn about the supported [permissions and consent](v2-permissions-and-consent.md), which is important to understand when building applications that need to be used by other users or applications.
* Have a tenant that has applications registered to it.
  * If you don't have apps registered, [learn how to register applications with the Microsoft identity platform](quickstart-register-app.md).

## Sign in to the Azure portal and select the app

Before you can configure the app, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service and then select **App registrations**.
1. Find and select the application you want to configure. Once you've selected the app, you'll see the application's **Overview** or main registration page.
1. Follow the steps to configure your application to access web APIs: 
    * [Add redirect URIs to your application](#add-redirect-uris-to-your-application)
    * [Add credentials to your web application](#add-credentials-to-your-web-application)
    * [Add permissions to access web APIs](#add-permissions-to-access-web-apis)

## Add redirect URI(s) to your application

[![Add custom redirect URIs for web and public client apps](./media/quickstart-update-azure-ad-app-preview/authentication-redirect-uris-expanded.png)](./media/quickstart-update-azure-ad-app-preview/authentication-redirect-uris-expanded.png#lightbox)

To add a redirect URI to your application:

1. From the app's **Overview** page, select the **Authentication** section.

1. To add a custom redirect URI for web and public client applications, follow these steps:

   1. Locate the **Redirect URI** section.
   1. Select the type of application you're building, **Web** or **Public client (mobile & desktop)**.
   1. Enter the Redirect URI for your application.
      * For web applications, provide the base URL of your application. For example, `http://localhost:31544` might be the URL for a web application running on your local machine. Users would use this URL to sign into a web client application.
      * For public applications, provide the URI used by Azure AD to return token responses. Enter a value specific to your application, for example https://MyFirstApp.

1. To choose from suggested Redirect URIs for public clients (mobile, desktop), follow these steps:

    1. Locate the Suggested **Redirect URIs for public clients (mobile, desktop)** section.
    1. Select the appropriate Redirect URI(s) for your application using the checkboxes.

## Add credentials to your web application

[![Add certificates and client secrets](./media/quickstart-update-azure-ad-app-preview/credentials-certificates-secrets-expanded.png)](./media/quickstart-update-azure-ad-app-preview/credentials-certificates-secrets-expanded.png#lightbox)

To add a credential to your web application:

1. From the app's **Overview** page, select the **Certificates & secrets** section.

1. To add a certificate, follow these steps:

    1. Select **Upload certificate**.
    1. Select the file you'd like to upload. It must be one of the following file types: .cer, .pem, .crt.
    1. Select **Add**.

1. To add a client secret, follow these steps:

    1. Select **New client secret**.
    1. Add a description for your client secret.
    1. Select a duration.
    1. Select **Add**.

> [!NOTE]
> After you save the configuration changes, the right-most column will contain the client secret value. **Be sure to copy the value** for use in your client application code as it's not accessible once you leave this page.

## Add permissions to access web APIs

[![Shows the screen where you can add API permissions](./media/quickstart-update-azure-ad-app-preview/api-permissions-expanded.png)](./media/quickstart-update-azure-ad-app-preview/api-permissions-expanded.png#lightbox)

To add permission(s) to access resource APIs from your client:

1. From the app's **Overview** page, select **API permissions**.
1. Select the **Add a permission** button.
1. By default, the view allows you to select from **Microsoft APIs**. Select the section of APIs that you're interested in:
    * **Microsoft APIs** - Lets you select permissions for Microsoft APIs such as Microsoft Graph.
    * **APIs my organization uses** - Lets you select permissions for APIs that have been exposed by your organization, or APIs that your organization has integrated with.
    * **My APIs** - Lets you select permissions for APIs that you have exposed.
1. Once you've selected the APIs, you'll see the **Request API Permissions** page. If the API exposes both delegated and application permissions, select which type of permission your application needs.
1. When finished, select **Add permissions**. You will return to the **API permissions** page, where the permissions have been saved and added to the table.

## Next steps

Learn about these other related app management quickstarts for apps:

* [Register an application with the Microsoft identity platform](quickstart-register-app.md)
* [Configure an application to expose web APIs](quickstart-configure-app-expose-web-apis.md)
* [Modify the accounts supported by an application](quickstart-modify-supported-accounts.md)
* [Remove an application registered with the Microsoft identity platform](quickstart-remove-app.md)

To learn more about the two Azure AD objects that represent a registered application and the relationship between them, see [Application objects and service principal objects](app-objects-and-service-principals.md).

To learn more about the branding guidelines you should use when developing applications with Azure Active Directory, see [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md).
