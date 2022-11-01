---
title: Microsoft identity platform consent framework
description: Learn about the consent framework in the Microsoft identity platform and how it applies to multi-tenant applications.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/29/2022
ms.author: ryanwi
ms.reviewer: phsignor, jesakowi
ms.custom: 
---

# Microsoft identity platform consent framework

Multi-tenant applications allow sign-ins by user accounts from Azure AD tenants other than the tenant in which the app was initially registered. The Microsoft identity platform consent framework enables a tenant administrator or user in these other tenants to consent to (or deny) an application's request for permission to access their resources.

For example, perhaps a web application requires read-only access to a user's calendar in Microsoft 365. It's the identity platform's consent framework that enables the prompt asking the user to consent to the app's request for permission to read their calendar. If the user consents, the application is able to call the Microsoft Graph API on their behalf and get their calendar data.

## Consent experience - an example

The following steps show you how the consent experience works for both the application developer and the user.

1. Assume you have a web client application that needs to request specific permissions to access a resource/API. You'll learn how to do this configuration in the next section, but essentially the Azure portal is used to declare permission requests at configuration time. Like other configuration settings, they become part of the application's Azure AD registration:

    :::image type="content" source="./media/consent-framework/permissions.png" alt-text="Permissions to other applications" lightbox="./media/consent-framework/permissions.png":::

1. Consider that your application’s permissions have been updated, the application is running, and a user is about to use it for the first time. First, the application needs to obtain an authorization code from Azure AD’s `/authorize` endpoint. The authorization code can then be used to acquire a new access and refresh token.

1. If the user is not already authenticated, Azure AD's `/authorize` endpoint prompts the user to sign in.

    :::image type="content" source="./media/consent-framework/usersignin.png" alt-text="User or administrator sign in to Azure AD":::

1. After the user has signed in, Azure AD will determine if the user needs to be shown a consent page. This determination is based on whether the user (or their organization’s administrator) has already granted the application consent. If consent has not already been granted, Azure AD prompts the user for consent and displays the required permissions it needs to function. The set of permissions that are displayed in the consent dialog match the ones selected in the **Delegated permissions** in the Azure portal.

    :::image type="content" source="./media/consent-framework/consent.png" alt-text="Shows an example of permissions displayed in the consent dialog":::

1. After the user grants consent, an authorization code is returned to your application, which is redeemed to acquire an access token and refresh token. For more information about this flow, see [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

1. As an administrator, you can also consent to an application's delegated permissions on behalf of all the users in your tenant. Administrative consent prevents the consent dialog from appearing for every user in the tenant, and can be done in the [Azure portal](https://portal.azure.com) by users with the administrator role. To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Azure AD](../roles/permissions-reference.md).

    **To consent to an app's delegated permissions**

   1. Go to the **API permissions** page for your application
   1. Click on the **Grant admin consent** button.

      :::image type="content" source="./media/consent-framework/grant-consent.png" alt-text="Grant permissions for explicit admin consent" lightbox="./media/consent-framework/grant-consent.png":::

   > [!IMPORTANT]
   > Granting explicit consent using the **Grant permissions** button is currently required for single-page applications (SPA) that use MSAL.js. Otherwise, the application fails when the access token is requested.

## Next steps

See [how to convert an app to multi-tenant](howto-convert-app-to-be-multi-tenant.md)
