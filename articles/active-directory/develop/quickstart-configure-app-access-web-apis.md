---
title: "Quickstart: Configure an app to access a web API | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you configure an app registration representing a web API in the Microsoft identity platform to enable scoped resource access (permissions) to client applications.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 08/05/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: lenalepa, aragra, sureshja
# Customer intent: As an application developer, I want to know how to configure my web API's app registration with permissions client applications can use to obtain scoped access to the API.
---

# Quickstart: Configure a client application to access a web API

In this quickstart, you create scopes, or permissions, in a web API's app registration in the Microsoft identity platform to provide scoped resource access to client applications.

Before a client can access a web API exposed by a resource application, such as Microsoft Graph API, the consent framework ensures the client obtains the permission grant required for the permissions requested. By default, all applications can request permissions from the Microsoft Graph API.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Completion of [Quickstart: Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md).

## Sign in to the Azure portal and select the app

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the upper right corner. Set your portal session to the Azure AD tenant that you want.
1. Search for and select **Azure Active Directory**. Under **Manage**, select **App registrations**.
1. Find and select the application you want to configure. After you select the app, you see the application's **Overview** or main registration page.

In the following section, you configure your application to enable access to the web API whose scopes you exposed as part of the prerequisites.

## Add permissions to access web APIs

The [Graph API sign-in and read user profile permission](https://developer.microsoft.com/graph/docs/concepts/permissions_reference#user-permissions) is selected by default. You can select from [two types of permissions](developer-glossary.md#permissions) for each web API:

* **Application permissions**. Your client application needs to access the web API directly as itself, without user context. This type of permission requires administrator consent. This permission isn't available for desktop and mobile client applications.
* **Delegated permissions**. Your client application needs to access the web API as the signed-in user, but with access restricted to the selected permissions. This type of permission can be consented to (granted) by a user unless the permission requires administrator consent. Adding a delegated permission to an application does *not* automatically grant consent for the users in a tenant. Users must still manually consent to the delegated permission at runtime unless an administrator grants consent on behalf of all users.

To add permissions to access resource APIs from your client:

1. From the app **Overview** page, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. By default, the view allows you to select from **Microsoft APIs**. Select the section of APIs that you're interested in:

    * **Microsoft APIs**. Lets you select permissions for Microsoft APIs such as Microsoft Graph.
    * **APIs my organization uses**. Lets you select permissions for APIs that your organization exposes, or APIs that your organization has integrated with.
    * **My APIs**. Lets you select permissions for APIs that you expose.

1. Once you've selected the APIs, you'll see the **Request API Permissions** page. If the API exposes both delegated and application permissions, select which type of permission your application needs.
1. When finished, select **Add permissions**.

You return to the **API permissions** page. The permissions have been saved and added to the table.

## Understanding API permissions and admin consent UI

### Configured permissions

This section shows the permissions that have been explicitly configured on the application object. These permissions are part of the app's required resource access list. You may add or remove permissions from this table. As an admin, you can also grant or revoke admin consent for a set of an API's permissions or individual permissions.

### Other permissions granted

If your application is registered in a tenant, you may see an additional section titled **Other permissions granted for Tenant**. This section shows permissions granted for the tenant that haven't been explicitly configured on the application object. These permissions were dynamically requested and consented. This section only appears if there is at least one permission that applies.

You may add a set of an API's permissions or individual permissions that appear in this section to the **Configured permissions** section. As an admin, you can also revoke admin consent for individual APIs or permissions in this section.

### Admin consent button

The **Grant admin consent for {your tenant}** button allows an admin to grant admin consent to the permissions configured for the application. Clicking the admin consent button launches a new window with a consent prompt showing all the configured permissions. Theres a delay between permissions being configured for the application and appearing on the consent prompt. If at first you don't see all the configured permissions in the consent prompt, close the prompt and select the button again to re-initiate consent.

The consent prompt provides options to **Accept** or **Cancel**. Select **Accept** to grant admin consent. If you select **Cancel**, admin consent isn't granted and an error message states that consent has been declined. There's a delay between granting admin consent by selecting **Accept** the status of admin consent being reflected in the portal.

The **Grant admin consent** button is *disabled* if you aren't an admin or if no permissions have been configured for the application. If you have permissions that have been granted but not configured, the admin consent button prompts you to handle these permissions. You may add them to configured permissions or you may remove them.

## Next steps

Advance to the next quickstart in the series to learn how to configure which account types can access your application. For example, you might want to limit access only to those users in your organization (single-tenant) or allow users in other Azure AD tenants (multi-tenant) and those with personal Microsoft accounts (MSA).

> [!div class="nextstepaction"]
> [Modify the accounts supported by an application](quickstart-modify-supported-accounts.md)
