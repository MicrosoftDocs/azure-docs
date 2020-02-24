---
title: New Azure portal app registration training guide
description: Introduces the new Azure portal App registration experience
services: active-directory
author: archieag
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 10/25/2019
ms.author: aragra
ms.reviewer: lenalepa, keyam
ms.custom: aaddev
---

# New Azure portal app registration training guide

You can find many improvements in the new [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience in the Azure portal. If you're familiar with the App registrations (legacy) experience in the Azure portal, use this training guide to get started using the new experience.

In Azure Active Directory, the new application registration experience described here is generally available (GA). In Azure Active Directory B2C (Azure AD B2C), this experience is in preview.

## Key changes

- App registrations aren't limited to being either a *web app/API* or a *native* app. You can use the same app registration for all of these apps by registering the respective redirect URIs.

- The legacy experience supported apps that sign in by using organizational (Azure AD) accounts only. Apps were registered as single-tenant. Apps supported only organizational accounts from the directory that the app was registered in. Apps could be modified to be multi-tenant and support all organizational accounts. The new experience allows you to register apps that can support both those options as well as a third option: all organizational accounts as well as personal Microsoft accounts.

- The legacy experience was only available when signed into the Azure portal using an organizational account. With the new experience, you can use personal Microsoft accounts that aren't associated with a directory.

## List of applications

The new app list shows applications that were registered through the legacy app registrations experience in the Azure portal. These apps sign in by using Azure AD accounts. The new app list also shows apps registered though the Application Registration Portal. These apps sign in by using Azure AD and personal Microsoft accounts.

>[!NOTE]
>The Application Registration Portal has been deprecated.

The new app list doesn't have an **Application type** column because a single app registration can be several types. The list has two additional columns: **Created on** and **Certificates & secrets**. **Certificates & secrets** shows the status of credentials that have been registered on the app. Statuses include **Current**, **Expiring soon**, and **Expired**.

## New app registration

In the legacy experience, to register an app you were required to provide: **Name**, **Application type**, and **Sign-on URL/Redirect URI**. The apps that were created were Azure AD only single-tenant applications. They only supported organizational accounts from the directory the app was registered in.

In the new experience, you must provide a **Name** for the app and choose the **Supported account types**. You can optionally provide a **Redirect URI**. If you provide a redirect URI, you'll need to specify whether it's web/public (mobile and desktop). For more information, see [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md). For Azure AD B2C, see [Register an application in Azure Active Directory B2C](../../active-directory-b2c/tutorial-register-applications.md).

## Differences between the Application Registration Portal and App registrations page

### The legacy Properties page

The legacy experience had a **Properties** page. **Properties** had the following fields:

- **Name**
- **Object ID**
- **Application ID**
- **App ID URI**
- **Logo**
- **Home page URL**
- **Logout URL**
- **Terms of service URL**
- **Privacy statement URL**
- **Application type**
- **Multi-tenant**

The new experience doesn't have that page. Here's where you can find the equivalent functionality:

- **Name**, **Logo**, **Home page URL**, **Terms of service URL**, and **Privacy statement URL** are now on the app's **Branding** page.
- **Object ID** and **Application (client) ID** are on the **Overview** page.
- The functionality controlled by the **Multi-tenant** toggle in the legacy experience has been replaced by **Supported account types** on the **Authentication** page. For more information, see [Quickstart: Modify the accounts supported by an application](quickstart-modify-supported-accounts.md).
- **Logout URL** is now on the **Authentication** page.
- **Application type** is no longer a valid field. Instead, redirect URIs, which you can find on the **Authentication** page, determine which app types are supported.
- **App ID URI** is now called **Application ID URI** and you can find it on **Expose an API**. In the legacy experience, this property was autoregistered using the following format: `https://{tenantdomain}/{appID}`, for example, `https://microsoft.onmicrosoft.com/492439af-3282-44c3-b297-45463339544b`. In the new experience, it's autogenerated as `api://{appID}`, but it needs to be explicitly saved. In Azure AD B2C tenants, the `https://{tenantdomain}/{appID}` format is still used.

### Reply URLs/redirect URls

In the legacy experience, an app had a **Reply URLs** page. In the new experience, reply URLs can be found on an app's **Authentication** page. They're now referred to as **Redirect URIs**.

The format for redirect URIs has changed. They're required to be associated with an app type, either web or public. For security reasons, wildcards and `http://` schemes aren't supported, except for *http://localhost*.

### Keys/Certificates & secrets

In the legacy experience, an app had **Keys** page. In the new experience, it has been renamed to **Certificates & secrets**.

**Public keys** are now referred to as **Certificates**. **Passwords** are now referred to as **Client secrets**.

### Required permissions/API permissions

In the legacy experience, an app had a **Required permissions** page. In the new experience, it has been renamed to **API permissions**.

When you selected an API in the legacy experience, you could choose from a small list of Microsoft APIs. You could also search through service principals in the tenant. In the new experience, you can choose from multiple tabs: **Microsoft APIs**, **APIs my organization uses**, or **My APIs**. The search bar on **APIs my organization** uses tab searches through service principals in the tenant.

> [!NOTE]
> You won't see this tab if your application isn't associated with a tenant. For more information on how to request permissions, see [Quickstart: Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md).

The legacy experience had a **Grant permissions** button at the top of the **Requested permissions** page. In the new experience, the **Grant consent** page has a **Grant admin consent** button on an app's **API permissions** section. There are also some differences in the ways the buttons function.

In the legacy experience, the logic varied depending on the signed in user and the permissions being requested. The logic was:

- If only user consent-able permissions were being requested and the signed in user wasn't an admin, the user could grant user consent for the requested permissions.
- If at least one permission that requires admin consent was requested and the signed in user wasn't an admin, the user got an error when attempting to grant consent.
- If the signed in user was an admin, admin consent was granted for all the requested permissions.

In the new experience, only an admin can grant consent. When an admin selects **Grant admin consent**, admin consent is granted to all the requested permissions.

## Deleting an app registration

In the legacy experience, you could delete only single-tenant apps. The delete button was disabled for multi-tenant apps. In the new experience, you can delete apps in any state, but you must confirm the action. For more information, see [Quickstart: Remove an application registered with the Microsoft identity platform](quickstart-remove-app.md).

## Application manifest

The legacy and new experiences use different versions for the format of the JSON in the manifest editor. For more information, see [Azure Active Directory app manifest](reference-app-manifest.md).

## New UI

The new experience adds UI controls for the following properties:

- The **Authentication** page has **Implicit grant flow** (`oauth2AllowImplicitFlow`). Unlike in the legacy experience, you can enable **Access tokens** or **ID tokens**, or both.
- The **Expose an API** page contains **Scopes defined by this API** (`oauth2Permissions`) and **Authorized client applications** (`preAuthorizedApplications`). For more information on how to configure an app to be a web API and expose permissions/scopes, see [Quickstart: Configure an application to expose web APIs](quickstart-configure-app-expose-web-apis.md).
- The **Branding** page contains the **Publisher domain**. The publisher domain is displayed to users on the [application's consent prompt](application-consent-experience.md). For more information, see [How to: Configure an application's publisher domain](howto-configure-publisher-domain.md).

## Limitations

The new experience has the following limitations:

- The format of client secrets (app passwords) is different than that of the legacy experience and may break CLI.
- Changing the value for supported accounts is not supported in the UI. You need to use the app manifest unless you're switching between Azure AD single-tenant and multi-tenant.
