---
title: "Quickstart: Configure an app to expose a web API | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you learn how to configure an application to expose a new permission/scope and role to make the application available to client applications.
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
ms.reviewer: aragra, lenalepa, sureshja
#Customer intent: As an application developer, I need to know how to configure my application to expose new permissions (or scopes) and roles, to make my application available to client applications.
---

# Quickstart: Configure an application to expose a web API

You can develop a web API and make it available to client applications by exposing [permissions/scopes](developer-glossary.md#scopes) and [roles](developer-glossary.md#roles). A correctly configured web API is made available just like the other Microsoft web APIs, including the Graph API and the Office 365 APIs.

In this quickstart, you learn how to configure an application to expose a new scope to make it available to client applications.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Completion of [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md).

## Sign in to the Azure portal and select the app

Before you can configure the app, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service and then select **App registrations**.
1. Find and select the application you want to configure. Once you've selected the app, you'll see the application's **Overview** or main registration page.
1. Choose which method you want to use, UI or application manifest, to expose a new scope:
    * [Expose a new scope through the UI](#expose-a-new-scope-through-the-ui)
    * [Expose a new scope or role through the application manifest](#expose-a-new-scope-or-role-through-the-application-manifest)

## Expose a new scope through the UI

[![Shows how to expose an API using the UI](./media/quickstart-update-azure-ad-app-preview/expose-api-through-ui-expanded.png)](./media/quickstart-update-azure-ad-app-preview/expose-api-through-ui-expanded.png#lightbox)

To expose a new scope through the UI:

1. From the app's **Overview** page, select the **Expose an API** section.

1. Select **Add a scope**.

1. If you have not set an **Application ID URI**, you will see a prompt to enter one. Enter your application ID URI or use the one provided and then select **Save and continue**.

1. When the **Add a scope** page appears, enter your scope's information:

    | Field | Description |
    |-------|-------------|
    | **Scope name** | Enter a meaningful name for your scope.<br><br>For example, `Employees.Read.All`. |
    | **Who can consent** | Select whether this scope can be consented to by users, or if admin consent is required. Select **Admins only** for higher-privileged permissions. |
    | **Admin consent display name** | Enter a meaningful description for your scope, which admins will see.<br><br>For example, `Read-only access to Employee records` |
    | **Admin consent description** | Enter a meaningful description for your scope, which admins will see.<br><br>For example, `Allow the application to have read-only access to all Employee data.` |

    If users can consent to your scope, also add values for the following fields:

    | Field | Description |
    |-------|-------------|
    | **User consent display name** | Enter a meaningful name for your scope, which users will see.<br><br>For example, `Read-only access to your Employee records` |
    | **User consent description** | Enter a meaningful description for your scope, which users will see.<br><br>For example, `Allow the application to have read-only access to your Employee data.` |

1. Set the **State** and select **Add scope** when you're done.

1. (Optional) To suppress prompting for consent by users of your app to the scopes you've defined, you can "pre-authorize" the client application to access your web API. You should pre-authorize *only* those client applications that you trust since your users won't have the opportunity to decline consent.
    1. Under **Authorized client applications**, select **Add a client application**
    1. Enter the **Application (client) ID** of the client application you want to pre-authorize. For example, that of a web application you've previously registered.
    1. Under **Authorized scopes**, select the scopes for which you want to suppress consent prompting, then select **Add application**.

    The client app is now a pre-authorized client app (PCA), and users won't be prompted for consent when signing in to it.

1. Follow the steps to [verify that the web API is exposed to other applications](#verify-the-web-api-is-exposed-to-other-applications).

## Expose a new scope or role through the application manifest

The application manifest serves as a mechanism for updating the application entity that defines the attributes of an Azure AD app registration.

[![Expose a new scope using the oauth2Permissions collection in the manifest](./media/quickstart-update-azure-ad-app-preview/expose-new-scope-through-app-manifest-expanded.png)](./media/quickstart-update-azure-ad-app-preview/expose-new-scope-through-app-manifest-expanded.png#lightbox)

To expose a new scope by editing the the application manifest:

1. From the app's **Overview** page, select the **Manifest** section. A web-based manifest editor opens, allowing you to **Edit** the manifest within the portal. Optionally, you can select **Download** and edit the manifest locally, and then use **Upload** to reapply it to your application.

    The following example shows how to expose a new scope called `Employees.Read.All` in the resource/API by adding the following JSON element to the `oauth2Permissions` collection.

    Generate the `id` value programmatically or by using a GUID generation tool like [guidgen](https://www.microsoft.com/download/details.aspx?id=55984).

      ```json
      {
        "adminConsentDescription": "Allow the application to have read-only access to all Employee data.",
        "adminConsentDisplayName": "Read-only access to Employee records",
        "id": "2b351394-d7a7-4a84-841e-08a6a17e4cb8",
        "isEnabled": true,
        "type": "User",
        "userConsentDescription": "Allow the application to have read-only access to your Employee data.",
        "userConsentDisplayName": "Read-only access to your Employee records",
        "value": "Employees.Read.All"
      }
      ```

1. When finished, click **Save**. Now your web API is configured for use by other applications in your directory.
1. Follow the steps to [verify that the web API is exposed to other applications](#verify-the-web-api-is-exposed-to-other-applications).

For more information on the application entity and its schema, see Microsoft Graph's [Application][ms-graph-application] resource type reference documentation.

For more information about the application manifest, including its schema reference, see [Understanding the Azure AD app manifest](reference-app-manifest.md).

## Verify the web API is exposed to other applications

1. Return to your Azure AD tenant, select **App registrations**, and then find and select the client application you want to configure.
1. Repeat the steps outlined in [Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md).
1. When you get to the step to [select an API](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis), select your resource (the web API app registration).
    * If you created the web API app registration by using the Azure portal, your API resource is listed in the **My APIs** tab.
    * If you allowed Visual Studio to create your web API app registration during project creation, your API resource is listed in the **APIs my organization uses** tab.

Once you've selected the web API resource, you should see the new scope available for client permission requests.

## Using the exposed scopes

Once a client is appropriately configured with permissions to access your web API, it can be issued an OAuth 2.0 access token by Azure AD. When the client calls the web API, it presents the access token that has the scope (`scp`) claim set to the permissions requested in its application registration.

You can expose additional scopes later as necessary. Consider that your web API might expose multiple scopes associated with a variety of different functions. Your resource can control access to the web API at runtime by evaluating the scope (`scp`) claim(s) in the received OAuth 2.0 access token.

In your applications, the full scope value is a concatenation of your web API's **Application ID URI** (the resource) and the **scope name**.

For example, if your web API's application ID URI is `https://contoso.com/api` and your scope name is `Employees.Read.All`, the full scope is:

`https://contoso.com/api/Employees.Read.All`

## Next steps

Now that you've exposed your web API by configuring its scopes, configure your client app's registration with permission to access those scopes.

> [!div class="nextstepaction"]
> [Configure an app registration for web API access](quickstart-configure-app-access-web-apis.md)

<!-- REF LINKS -->
[ms-graph-application]: /graph/api/resources/application
