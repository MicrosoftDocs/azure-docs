---
title: New App registrations experience in Azure AD B2C
description: An introduction to the new App registration experience in Azure AD B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 05/25/2020
ms.author: mimart
ms.subservice: B2C
---

# The new app registration experience for Azure AD B2C

There are many improvements in the new **[App registrations](https://aka.ms/b2cappregistrations)** experience for Azure AD B2C. If you're more familiar with the legacy **Applications** experience for registering applications for Azure AD B2C, referred to here as the **"old experience"** this guide will get you started using the new experience.

## Overview
Previously, you had to manage your B2C consumer-facing applications separately from the rest of your apps using the old experience. That meant different app creation experiences across different places in Azure.

The new experience shows all B2C app registrations and Azure AD app registrations in one place and provides a consistent way to manage them. Whether you need to manage a customer-facing app or an app that has access Microsoft Graph for DevOps scenerios, you only need to learn one way to do things.

This feature improvement can be reached by navigating to **App registrations** in a B2C tenant. You can do this through the **Azure AD B2C** extension or the **Azure Active Directory** extension in the Azure portal.

The Azure AD B2C App registrations experience is based on the general [App Registration experience](https://developer.microsoft.com/en-us/identity/blogs/new-app-registrations-experience-is-now-generally-available/) for any Azure AD tenant, but is tailored for Azure AD B2C tenants.

## What's not changing?
- Your applications and related configurations can be found as-is in the new experience. You do not need to register the applications again and users of your applications will not need to sign-in again. 

> [!NOTE]
> To view all your previously created applications, navigate to the **App registrations** blade and select the **All applications** tab. This will display apps created in the old experience, the new experience, those created in the Azure AD extension.

## Key changes

-   A **unified app list** shows all your applications that authenticate with Azure AD B2C and Azure AD in one convenient place! In addition, you can take advantage of all the great features already available for Azure AD applications: created on date, status of certificates & secrets, search bar, and so much more.

-   **Combined app registration** allows you to quickly register an app whether it's a customer-facing app or an app to access Microsoft Graph.

-   **Owners** and **Manifest** are now available for apps that authenticate with Azure AD B2C. You can add owners for your registrations and directly edit application properties using the manifest editor.


## New supported account types

In the new experience, you have to select a support account type from the following options:
- Accounts in this organizational directory only.
- Accounts in any organizational directory (Any Azure AD directory – Multitenant).
- Accounts in any organizational directory or any identity provider. For authenticating users with Azure AD B2C.

To understand the different account types, select **Help me choose** in the creation experience. 

In the old experience, apps were always created as customer-facing applications. Those apps have their account type set to the **'Accounts in any organizational directory or any identity provider. For authenticating users with Azure AD B2C.'** option. 

> [!IMPORTANT]
> This option is required to be able to run Azure B2C user flows to authenticate users for this application. [Learn how to register an application for use with user flows.](tutorial-register-applications.md)

Now, you can also use this option  to use Azure AD B2C as a SAML Service Provider. [Learn more.](identity-provider-adfs2016-custom.md)

## Applications for DevOps scenarios
You can use the other account types to create an app to manage your DevOps scenarios like uploading Identity Experience Framework policies or provisioning users. Learn [how register a Microsoft Graph application to manage Azure AD B2C resources](microsoft-graph-get-started.md).

> [!NOTE]
> 

The **Accounts in this organizational directory only** option can also be used for registering the IdentityExperienceFramework and ProxyIdentityExperienceFramework apps for custom policies. [Learn more.](custom-policy-get-started.md)

## App management page

The old experience had a single app management page for apps
with the following sections: Properties, Application secrets, Platforms,
Owners, Microsoft Graph Permissions, Profile, and Advanced Options.

The new experience in the Azure portal presents these features in
separate pages. Here's where you can find the equivalent functionality:

- Properties - Name and Application ID is on the Overview page.
- Application Secrets is on the Certificates & secrets page
- Platforms configuration is on the Authentication page
- Microsoft Graph permissions is on the API permissions page along with other permissions
- Profile is on Branding page
- Advanced option - Live SDK support is on the Authentication page.

## Application secrets/Certificates & secrets

In the new experience, instead of **Keys**, you have the
**Certificates & secrets** blade to manage certificates and secrets. Credentials enable applications to identify themselves to the authentication service when receiving tokens at a web addressable location (using an HTTPS scheme). We recommend using a certificate instead of a client secret for client credential scenarios when authenticating against Azure AD. Please note certificates cannot be used to authenticate against Azure AD B2C.

## Platforms/Authentication: Reply URLs/redirect URIs
In the old experience, an app had Platforms section for Web, native, and
Web API to configure Redirect URLs, Logout URL and Implicit flow.

In the new experience, Reply URLs can be found on an app\'s
Authentication section. In addition, they are referred to as redirect
URIs and the format for redirect URIs has changed. They are required to
be associated with an app type (web or public client - mobile and
desktop). [Learn more](quickstart-configure-app-access-web-apis.md#add-redirect-uris-to-your-application)

Web APIs are configured in Expose an API page.

> [!NOTE]
> Try out the new Authentication settings experience where you can
configure settings for your application based on the platform or device
that you want to target. [Learn more](quickstart-configure-app-access-web-apis.md#configure-platform-settings-for-your-application)

## Microsoft Graph permissions/API permissions

-   When selecting an API in the old experience, you could choose from
    Microsoft Graph APIs only. In the new experience, you can choose
    from many Microsoft APIs including Microsoft Graph, APIs from your
    organization and your APIs, this is presented in three tabs:
    Microsoft APIs, APIs my organization uses, or My APIs. The search
    bar on APIs my organization uses tab searches through service
    principals in the tenant.

    > [!NOTE]
    > You won't see this tab if your application isn't
    associated with a tenant. For more info on how to request
    permissions using the new experience, see [this
    quickstart](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/develop/quickstart-configure-app-access-web-apis.md).

-   The old experience did not have a **Grant permissions** button. In the
    new experience, there's a Grant consent section with a **Grant admin consent** button on an app's API permissions section. Only an       admin can grant consent and this button is enabled for admins only. When an admin selects the **Grant admin consent** button, admin     consent is granted to all the requested permissions.

## Profile
In the old experience, Profile had Logo, Home page URL, Terms of Service
URL and Privacy Statement URL configuration. In the new experience,
these can be found in Branding page.

## Application manifest
In the new experience, Manifest page allows you to edit and update app's
attributes. For more info, see [Application manifest](reference-app-manifest.md).

## New UI
There's new UI for properties that could previously only be set using
the manifest editor or the API, or didn't exist.

-   Implicit grant flow (oauth2AllowImplicitFlow) can be found on the
    Authentication page. Unlike the old experience, you can enable
    access tokens or ID tokens, or both.

-   Scopes defined by this API (oauth2Permissions) and Authorized client
    applications (preAuthorizedApplications) can be configured through
    the Expose an API page. For more info on how to configure an app to
    be a web API and expose permissions/scopes, see [this
    quickstart](quickstart-configure-app-expose-web-apis.md).

-   Publisher domain (which is displayed to users on the [application\'s
    consent
    prompt](application-consent-experience.md))
    can be found on the Branding page. For more info on how to
    configure a publisher domain, see [this
    how-to](howto-configure-publisher-domain.md).

## Limitations

The new experience has the following limitations:

-   The new experience does not yet support App registrations for Azure AD
    B2C tenants.

-   The new experience does not yet support Live SDK apps created with
    personal Microsoft accounts.

-   Changing the value for supported accounts is not supported in the
    UI. You need to use the app manifest unless you\'re switching
    between Azure AD single-tenant and multi-tenant.

   > [!NOTE]
   > If you're a personal Microsoft account user in Azure AD tenant, and the tenant admin has restricted access to Azure portal, you may get an access denied. However, if you come through the shortcut by typing App registrations in the search bar or pinning it, you'll be able to access the new experience.

## Next steps

To get started with the new app registration experience, see [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md).
