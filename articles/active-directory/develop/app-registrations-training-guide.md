---
title: App registrations in the Azure portal training guide - Azure
description: Build embedded and browser-less authentication flows using the device code grant.
services: active-directory
documentationcenter: ''
author: archieag
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: aragra
ms.reviewer: lenalepa, keyam
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Training guide: App registrations in the Azure portal  

You can find numerous improvements in the new [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience in the Azure portal. If you're more familiar with the legacy experience, use this training guide to get you started using the new experience.

## Key changes

- App registrations aren't limited to being either a **web app/API** or a **native** app. You can use the same app registration for all of these by registering the respective redirect URIs.
- The legacy experience supported apps that sign in organizational (Azure AD) accounts only. Apps were registered as single-tenant (supporting only organizational accounts from the directory the app was registered in) and could be modified to be multi-tenant (supporting all organizational accounts). The new experience allows you to register apps that can support both those options as well as a third option: all organizational accounts as well as personal Microsoft accounts.
- The legacy experience was only available when signed into the Azure portal using an organizational account. With the new experience, you can use personal Microsoft accounts that are not associated with a directory.

## List of applications

- The new app list shows applications that were registered through the legacy app registrations experience in the Azure portal (apps that sign in Azure AD accounts) as well as apps registered though the [Application Registration Portal](https://apps.dev.microsoft.com/) (apps that sign in Azure AD and personal Microsoft accounts).
- The new app list doesn't have an **Application type** column (since a single app registration can be several types) and has two additional columns: a **Created on** column and a **Certificates & secrets** column that shows the status (current, expiring soon, or expired) of credentials that have been registered on the app.

## New app registration

In the legacy experience, to register an app you were required to provide: **Name**, **Application type**, and **Sign-on URL/Redirect URI**. The apps that were created were Azure AD only single-tenant applications meaning that they only supported organizational accounts from the directory the app was registered in.

In the new experience, you must provide a **Name** for the app and choose the **Supported account types**. You can optionally provide a **redirect URI**. If you provide a redirect URI, you'll need to specify if it's web/public (mobile and desktop). For more info on how to register an app using the new app registrations experience, see [this quickstart](quickstart-register-app.md).

## The legacy Properties page

The legacy experience had a **Properties** page that the new experience doesn't have. The **Properties** blade had the following fields: **Name**, **Object ID**, **Application ID**, **App ID URI**, **Logo**, **Home page URL**, **Logout URL**, **Terms of service URL**, **Privacy statement URL**, **Application type**, and **Multi-tenant.**

Here's where you can find the equivalent functionality in the new experience:

- **Name**, **Logo**, **Home page URL**, **Terms of service URL**, and **Privacy statement URL** is now on the app's **Branding** page.
- **Object ID** and **Application (client) ID** is on the **Overview** page.
- The functionality controlled by the **Multi-tenant** toggle in the legacy experience has been replaced by **Supported account types** on the **Authentication** page. For more information about how multi-tenant maps to the supported account type options, see [this quickstart](quickstart-modify-supported-accounts.md).
- **Logout URL** is now on the **Authentication** page.
- **Application type** is no longer a valid field. Instead, redirect URIs (which you can find on the **Authentication** page) determine which app types are supported.
- **App ID URI** is now called **Application ID URI** and you can find this on the **Expose an API** blade. In the legacy experience, this property was auto-registered using the following format: `https://{tenantdomain}/{appID}` (for example, `https://microsoft.onmicrosoft.com/aeb4be67-a634-4f20-9a46-e0d4d4f1f96d`). In the new format, it's auto-generated as `api://{appID}`, but it needs to be explicitly saved.

## Reply URLs/redirect URls

In the legacy experience, an app had a **Reply URLs** page. In the new experience, Reply URLs can be found on an app's **Authentication** section. In addition, they are referred to as **Redirect URIs**. In addition, The format for redirect URIs has changed. They are required to be associated with an app type (web or public). In addition, for security reasons, wildcards and http:// schemes are not supported (with the exception of http://localhost).

## Keys/Certificates & secrets

In the legacy experience, an app had **Keys** page. In the new experience, it has been renamed to **Certificates & secrets**. In addition, **Public keys** are referred to as **Certificates** and **Passwords** are referred to as **Client secrets**.

## Required permissions/API permissions

- In the legacy experience, an app had a **Required permissions** page. In the new experience, it has been renamed to **API permissions**.
- When selecting an API in the legacy experience, you could choose from a small list of Microsoft APIs or search through service principals in the tenant. In the new experience, you can choose from multiple tabs: **Microsoft APIs**, **APIs my organization uses**, or **My APIs**. The search bar on **APIs my organization** uses tab searches through service principals in the tenant. 

   > [!NOTE]
   > You won't see this tab if your application isn't associated with a tenant. For more info on how to request permissions using the new experience, see [this quickstart](quickstart-configure-app-access-web-apis.md).

- The legacy experience had a **Grant permissions** button at the top of the **Requested permissions** page. In the new experience, there's a **Grant consent** section with a **Grant admin consent** button on an app's **API permissions** section. In addition, there are some differences in the ways the buttons function:
   - In the legacy experience, the logic varied depending on the signed in user and the permissions being requested. The logic was:
      - If only user consent-able permissions were being requested and the signed in user was not an admin, the user was able to grant user consent for the requested permissions.
      - If at least one permission that requires admin consent was being requested and the signed in user was not an admin, the user got an error when attempting to grant consent.
      - If the signed in user was an admin, admin consent was granted for all the requested permissions.
   - In the new experience, only an admin can grant consent. When an admin selects the **Grant admin consent** button, admin consent is granted to all the requested permissions.

## Deleting an app registration

In the legacy experience, an app had to be single-tenant to be deleted. The delete button was disabled for multi-tenant apps. In the new experience, apps can be deleted in any state, but you must confirm the action. For more information about deleting app registrations, see [this quickstart](quickstart-remove-app.md).

## Application manifest

The legacy and new experiences use different versions for the format of the JSON in the manifest editor. For more info, see [Application manifest](reference-app-manifest.md).

## New UI

There's new UI for properties that could previously only be set using the manifest editor or the API, or didn't exist.

- **Implicit grant flow** (oauth2AllowImplicitFlow) can be found on the **Authentication** page. Unlike in the legacy experience, you can enable **access tokens** or **id tokens**, or both.
- **Scopes defined by this API** (oauth2Permissions) and **Authorized client applications** (preAuthorizedApplications) can be configured through the **Expose an API** page. For more info on how to configure an app to be a web API and expose permissions/scopes, see [this quickstart](quickstart-configure-app-expose-web-apis.md).
- **Publisher domain** (which is displayed to users on the [application's consent prompt](application-consent-experience.md)) can be found on the **Branding blade** page. For more info on how to configure a publisher domain, see [this how-to](howto-configure-publisher-domain.md).

## Limitations

The new experience has the following limitations:

- The new experience is currently not available in Azure AD B2C tenants.
- The format of client secrets (app passwords) is different than that of the legacy experience and breaks CLI.
- Changing the value for supported accounts is not supported in the UI. You need to use the app manifest unless you're switching between Azure AD single-tenant and multi-tenant.
