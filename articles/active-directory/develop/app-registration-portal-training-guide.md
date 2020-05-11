---
title: New Azure portal app registration experience
titleSuffix: Microsoft identity platform
description: An introduction to the new App registration experience in the Azure portal
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 11/8/2019
ms.author: marsma
ms.reviewer: lenalepa, alamaral
ms.custom: aaddev
---

# The new Azure portal app registration experience

There are many improvements in the new [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience in the Azure portal. If you're more familiar with the Application registration portal (apps.dev.microsoft.com) for registering or managing applications, referred to here as the "old experience," this guide will get you started using the new experience.

## What's not changing?

- Your applications and related configurations can be found as-is in the new experience. You do not need to register the applications again and users of your applications will not need to sign-in again.

    > [!NOTE]
    > You must sign-in with the account you used to register applications to find them in the Azure portal. We recommend you
    check the signed in user in the Azure portal matches the user that
    was signed into the Application registration portal by comparing the
    email address from your profile.
    >
    > In some cases, especially when you sign in using personal Microsoft
    accounts(e.g. Outlook, Live, Xbox, etc.) with an Azure AD email address, we found out that when you
    go to the Azure portal from the old experience, it signs you into a
    different account with the same email in your Azure AD tenant. If
    you still believe your applications are missing, sign out and sign
    in with the right account.

- Live SDK apps created using personal Microsoft accounts are not yet supported in the Azure portal and will continue to remain in the old experience in near future.

## Key changes

-   In the old experience, apps were by default registered as *converged*
    apps - apps that support all organizational accounts (multitenant) as well as
    personal Microsoft accounts. This could not be modified through the
    old experience, making it difficult to create apps that supported
    only organizational accounts (either multitenant or single tenant).
    The new experience allows you to register apps supporting all those
    options. [Learn more about app
    types](active-directory-v2-registration-portal.md).

-   In the new experience, if your personal Microsoft account is also in
    an Azure AD tenant, you will see three tabs--all applications in
    the tenant, owned applications in the tenant as well as applications
    from your personal account. So, if you believe that apps registered
    with your personal Microsoft account are missing, check the
    **Applications from your personal account** tab.

-   In the new experience, you can easily switch between tenants by
    navigating to your profile and choosing switch directory.

## List of applications

-   The new app list shows applications that were registered through the
    legacy app registrations experience in the Azure portal (apps that
    sign in Azure AD accounts only) as well as apps registered though the
    [Application registration portal](https://apps.dev.microsoft.com/)
    (apps that sign in both Azure AD and personal Microsoft accounts).

-   The new app list has two additional columns: **Created on** column and
    **Certificates & secrets** column that shows the status (current,
    expiring soon, or expired) of credentials that have been registered
    on the app.

## New app registration

In the old experience, to register an app you were only
required to provide a Name. The apps that were created were registered
as *converged* apps - apps supporting all organizational directories (multitenant)
as well as personal Microsoft accounts.  This could not be modified through the old experience, making it difficult to create apps that supported only organizational accounts (either single- or multi-tenant). [Learn more about supported account types](v2-supported-account-types.md)

In the new experience, you must provide a Name for the app and choose
the Supported account types. You can optionally provide a redirect URI.
If you provide a redirect URI, you'll need to specify if it's
web/public (native/mobile and desktop). For more info on how to register
an app using the new app registrations experience, see [this
quickstart](quickstart-register-app.md).

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

In the new experience, **Application secrets** have been renamed to
**Certificates & secrets**. In addition, **Public keys** are referred to as
**Certificates** and **Passwords** are referred to as **Client secrets**. We
chose to not bring this functionality along in the new experience for
security reasons, hence, you can no longer generate a new key pair.

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
