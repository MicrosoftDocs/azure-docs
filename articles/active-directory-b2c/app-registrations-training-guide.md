---
title: New App registrations experience in Azure AD B2C
description: An introduction to the new App registration experience in Azure AD B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 05/25/2020
ms.author: mimart
ms.subservice: B2C
---

# The new App registrations experience for Azure Active Directory B2C

The new **[App registrations](https://aka.ms/b2cappregistrations)** experience for Azure Active Directory B2C (Azure AD B2C) is now generally available. If you're more familiar with the **Applications** experience for registering applications for Azure AD B2C, referred to here as the "legacy experience," this guide will get you started using the new experience.

## Overview
Previously, you had to manage your Azure AD B2C consumer-facing applications separately from the rest of your apps using the legacy experience. That meant different app creation experiences across different places in Azure.

The new experience shows all Azure AD B2C app registrations and Azure AD app registrations in one place and provides a consistent way to manage them. From creating a customer-facing app to managing an app with Microsoft Graph permissions for resource management, you only need to learn one way to do things.

You can reach the new experience by navigating to **App registrations** in an Azure AD B2C tenant from both the **Azure AD B2C** or the **Azure Active Directory** services in the Azure portal.

The Azure AD B2C App registrations experience is based on the general [App Registration experience](https://developer.microsoft.com/identity/blogs/new-app-registrations-experience-is-now-generally-available/) for any Azure AD tenant, but is tailored for Azure AD B2C tenants.

## What's not changing?
- Your applications and related configurations can be found as-is in the new experience. You do not need to register the applications again and users of your applications will not need to sign-in again. 

> [!NOTE]
> To view all your previously created applications, navigate to the **App registrations** blade and select the **All applications** tab. This will display apps created in the legacy experience, the new experience, and those created in the Azure AD service.

## Key new features

-   A **unified app list** shows all your applications that authenticate with Azure AD B2C and Azure AD in one convenient place. In addition, you can take advantage of features already available for Azure AD applications, including the **Created on** date, **Certificates & secrets** status, search bar, and much more.

-   **Combined app registration** allows you to quickly register an app, whether it's a customer-facing app or an app to access Microsoft Graph.

- The **Endpoints** pane lets you quickly identify the relevant endpoints for your scenario, including OpenID connect configuration, SAML metadata, Microsoft Graph API, and [OAuth 2.0 user flow endpoints](tokens-overview.md#endpoints). 

- **API permissions** and **Expose an API** provide more extensive scope, permission, and consent management. You can now also assign MS Graph and Azure AD Graph permissions to an app.

-   **Owners** and **Manifest** are now available for apps that authenticate with Azure AD B2C. You can add owners for your registrations and directly edit application properties [using the manifest editor](../active-directory/develop/reference-app-manifest.md).


## New supported account types

In the new experience, you select a support account type from the following options:
- Accounts in this organizational directory only.
- Accounts in any organizational directory (Any Azure AD directory – Multitenant).
- Accounts in any organizational directory or any identity provider. For authenticating users with Azure AD B2C.

To understand the different account types, select **Help me choose** in the creation experience. 

In the legacy experience, apps were always created as customer-facing applications. For those apps, the account type is set to **Accounts in any organizational directory or any identity provider. For authenticating users with Azure AD B2C**.
> [!NOTE]
> This option is required to be able to run Azure AD B2C user flows to authenticate users for this application. Learn [how to register an application for use with user flows.](tutorial-register-applications.md)

You can also use this option  to use Azure AD B2C as a SAML service provider. [Learn more](identity-provider-adfs2016-custom.md).

## Applications for DevOps scenarios
You can use the other account types to create an app to manage your DevOps scenarios, like using Microsoft Graph to upload Identity Experience Framework policies or provision users. Learn [how register a Microsoft Graph application to manage Azure AD B2C resources](microsoft-graph-get-started.md).

You might not see all Microsoft Graph permissions, because many of these permissions don't apply to Azure B2C consumer users. [Read more about managing users using Microsoft Graph](manage-user-accounts-graph-api.md).  

## Admin consent and offline_access+openid scopes  
<!-- Azure AD B2C doesn't support user consent. That is, when a user signs into an application, the user doesn't see a screen requesting consent for the application permissions. All permissions have to be granted through admin consent.  -->

The **openid** scope is necessary so that Azure AD B2C can sign users in to an app. The **offline_access** scope is needed to issue refresh tokens for a user. These scopes were previously added and given admin consent by default. Now, you can easily add permissions for these scopes during the creation process by ensuring the **Grant admin consent to openid and offline_access permissions** option is selected. Else, the Microsoft Graph permissions can be added with admin consent in the **API permissions** settings for an existing app.

Learn more about [permissions and consent](../active-directory/develop/v2-permissions-and-consent.md).

## Platforms/Authentication: Reply URLs/redirect URIs
In the legacy experience, the various platform types were managed under **Properties** as reply urls for web apps/APIs and Redirect URI for Native clients. "Native clients" are also known as "Public clients" and include apps for iOS, macOS, Android, and other mobile and desktop application types. 

In the new experience, reply URLs and redirect URIs are both referred to as Redirect URIs and can be found in an app's **Authentication** section. App registrations aren't limited to being either a web app or a native application. You can use the same app registration for all of these platform types by registering the respective redirect URIs. 

Redirect URIs are required to be associated with an app type, either web or Public (mobile and desktop). [Learn more about redirect URIs](../active-directory/develop/quickstart-configure-app-access-web-apis.md#add-redirect-uris-to-your-application)

<!-- Whether an application should be treated as a public client is inferred at run-time from the Redirect URI platform type, if possible. The **Treat application as a public client** setting should be set to **Yes** for flows that might not use a redirect URI, such as ROPC flows. -->

The **iOS/macOS** and **Android** platforms are a type of public client. They provide an easy way to configure iOS/macOS or Android apps with corresponding Redirect URIs for use with MSAL. Learn more about [Application configuration options](../active-directory/develop/msal-client-applications.md).


## Application certificates & secrets

In the new experience, instead of **Keys**, you use the **Certificates & secrets** blade to manage certificates and secrets. Certificates & secrets enable applications to identify themselves to the authentication service when receiving tokens at a web addressable location (using an HTTPS scheme). We recommend using a certificate instead of a client secret for client credential scenarios when authenticating against Azure AD. Certificates can't be used to authenticate against Azure AD B2C.


## Features not applicable in Azure AD B2C tenants
The following Azure AD app registrations capabilities are not applicable to or available in Azure AD B2C tenants:
- **Roles and administrators** - This requires an Azure AD Premium P1 or P2 license that is not currently available for Azure AD B2C.
- **Branding** - UI/UX customization is configured in the **Company branding** experience or as part of a user flow. Learn to [customize the user interface in Azure Active Directory B2C](customize-ui-overview.md).
- **Publisher domain verification** - Your app is registered on *.onmicrosoft.com*, which isn't a verified domain. Additionally, the publisher domain is primarily used for granting user consent, which doesn't apply to Azure AD B2C apps for user authentication. [Learn more about publisher domain](https://docs.microsoft.com/azure/active-directory/develop/howto-configure-publisher-domain).
- **Token configuration** - The token is configured as part of a user flow rather than an app.
- The **Quickstarts** experience is currently not available for Azure AD B2C tenants.
- The **Integration assistant** blade is currently not available for Azure AD B2C tenants.


## Limitations
The new experience has the following limitations:
- At this time, Azure AD B2C doesn't differentiate between being able to issue access or ID tokens for implicit flows; both types of tokens are available for implicit grant flow if the **ID tokens** option is selected in the **Authentication** blade.
<!-- - Azure AD B2C doesn't currently support the single-page application "SPA" app type.  -->
- Changing the value for supported accounts isn't supported in the UI. You'll need to use the app manifest, unless you're switching between Azure AD single-tenant and multi-tenant.

## Next steps

To get started with the new app registration experience:
* Learn [how to register a web application](tutorial-register-applications.md).
* Learn [how to register a web API](add-web-api-application.md).
* Learn [how to register a native client application](add-native-application.md).
* Learn [how register a Microsoft Graph application to manage Azure AD B2C resources](microsoft-graph-get-started.md).
* Learn [how to use Azure AD B2C as a SAML Service Provider.](identity-provider-adfs2016-custom.md)
* Learn about [application types](application-types.md).
