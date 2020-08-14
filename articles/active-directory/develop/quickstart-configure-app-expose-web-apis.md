---
title: "Quickstart: Register and expose a web API | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, your register a web API with the Microsoft identity platform and configure its scopes, exposing it to clients for permissions-based access to the API's resources.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 08/14/2020
ms.author: ryanwi
ms.custom: aaddev, contperfq1
ms.reviewer: aragra, lenalepa, sureshja
# Customer intent: As an application developer, I need learn to how to register my web API with the Microsoft identity platform and expose permissions (scopes) to make the API's resources available to users of my client application.
---

# Quickstart: Configure an application to expose a web API

In this quickstart, you register a web API with the Microsoft identity platform and expose it to client apps by adding an example scope. By registering your web API and and exposing it through scopes, you can provide permissions-based access to its resources to authenticated users or client apps that access your API.

## Prerequisites

* An Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Completion of [Quickstart: Set up a tenant](quickstart-create-new-tenant.md)

## Register the web API

To provide scoped access to the resources in your web API, you first need to register the API with the Microsoft identity platform.

1. Perform the steps in the **Register an application** section of [Quickstart: Register an app with the Microsoft identity platform](quickstart-register-app.md).
1. Skip the **Add a redirect URI** and **Configure platform settings** sections. You don't need to configure a redirect URI for a web API since no user is logged in interactively.
1. Skip the **Add credentials** section for now. Only if your API accesses a downstream API would it need its own credentials, and isn't covered in this quickstart.

With your web API registered, you're ready to add the scopes that your API's code can use to grant granular permission to consumers of your API. You can add a scope by using the [Expose an API](#add-a-scope---ui) UI in the Azure portal, or by editing the [application manifest](#add-a-scope---app-manifest) - instructions for both follow.

## Add a scope

The code in a client application specifies scopes by passing an access token along with its requests to the protected resource, your web API. Your web API then performs the requested operation only if the access token it receives contains the scopes required for the operation. Follow the steps in this section to create an example scope, `Employees.Read.All`.

In this section, you add a scope using by using **Expose an API** in the Azure portal. You can also add a scope by [editing the application manifest](#add-a-scope---app-manifest) directly.

To add a scope by using the **Expose an API** pane in the Azure portal:

1. Select your application in **App registrations** in the Azure portal.
1. Select **Expose an API** > **Add a scope**.
    :::image type="content" source="media/quickstart-configure-app-expose-web-apis/portal-01-expose-api.png" alt-text="An app registration's Expose an API pane in the Azure portal":::

1. You're prompted to set an **Application ID URI** if you haven't yet configured one. The application ID URI acts as the prefix for the scopes you'll reference in your API's code, and it must be globally unique. You can use the default value provided, which is in the form `api://<application-client-id>`, or specify a more readable URI like `https://contoso.com/api`.

1. Next, specify the scope's attributes in the **Add a scope** pane. For this walk-through, you can use the example values or specify your own.

    | Field | Description | Example |
    |-------|-------------|---------|
    | **Scope name** | Enter a meaningful name for your scope. | `Employees.Read.All` |
    | **Who can consent** | Select whether this scope can be consented to by users, or if admin consent is required. Select **Admins only** for higher-privileged permissions. | **Admins and users** |
    | **Admin consent display name** | Enter a meaningful description for your scope that only admins will see. | `Read-only access to Employee records` |
    | **Admin consent description** | Enter a meaningful consent description for your scope that only admins will see. | `Allow the application to have read-only access to all Employee data.` |

    If users can consent to your scope, also add values for the following fields:

    | Field | Description | Example |
    |-------|-------------|---------|
    | **User consent display name** | Enter a meaningful name for your scope, which users will see. | `Read-only access to your Employee records` |
    | **User consent description** | Enter a meaningful description for your scope, which users will see. | `Allow the application to have read-only access to your Employee data.` |

1. Set the **State** to **Enabled**, and then select **Add scope**.

1. (Optional) To suppress prompting for consent by users of your app to the scopes you've defined, you can "pre-authorize" the client application to access your web API. You should pre-authorize *only* those client applications that you trust since your users won't have the opportunity to decline consent.
    1. Under **Authorized client applications**, select **Add a client application**
    1. Enter the **Application (client) ID** of the client application you want to pre-authorize. For example, that of a web application you've previously registered.
    1. Under **Authorized scopes**, select the scopes for which you want to suppress consent prompting, then select **Add application**.

    If you followed this optional step, the client app is now a pre-authorized client app (PCA), and users won't be prompted for consent when signing in to it.

1. To check your work, follow the steps in [Verify the web API is exposed to other applications](#verify-the-web-api-is-exposed-to-other-applications).

## Add a scope - App manifest

The application manifest serves as a mechanism for updating the application entity that defines the attributes of an Azure AD app registration.

:::image type="content" source="media/quickstart-configure-app-expose-web-apis/portal-02-app-manifest.png" alt-text="Screenshot of the app manifest pane showing a portion of its JSON in the Azure portal":::

To add a scope by editing the application manifest:

1. Select your application in **App registrations** in the Azure portal.
1. Under **Manage**, select **Manifest**.

    A web-based manifest editor is displayed allowing you to edit the manifest in the portal. You can optionally **Download** and edit the manifest locally, and then use **Upload** to reapply it to your application.

    The following example JSON snippet exposes a scope named `Employees.Read.All` by adding an element to the `oauth2Permissions` collection.

    Generate the `id` value programmatically or by using a GUID generation tool like [guidgen](https://www.microsoft.com/download/details.aspx?id=55984).

      ```json
      "oauth2Permissions": [
        {
          "adminConsentDescription": "Allow the application to have read-only access to all Employee data.",
          "adminConsentDisplayName": "Read-only access to Employee records",
          "id": "5555-5555-5555-5555-5555",
          "isEnabled": true,
          "type": "User",
          "userConsentDescription": "Allow the application to have read-only access to your Employee data.",
          "userConsentDisplayName": "Read-only access to your Employee records",
          "value": "Employees.Read.All"
        }
      ],
      ```

1. Select **Save**.
1. To check your work, follow the steps in [Verify the web API is exposed to other applications](#verify-the-web-api-is-exposed-to-other-applications).

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

You can expose additional scopes later as necessary. Consider that your web API might expose multiple scopes associated with a variety of operations. Your resource can control access to the web API at runtime by evaluating the scope (`scp`) claim(s) in the received OAuth 2.0 access token.

In your applications, the full scope value is a concatenation of your web API's **Application ID URI** (the resource) and the **scope name**.

For example, if your web API's application ID URI is `https://contoso.com/api` and your scope name is `Employees.Read.All`, the full scope is:

`https://contoso.com/api/Employees.Read.All`

## Next steps

Now that you've exposed your web API by configuring its scopes, configure your client app's registration with permission to access those scopes.

> [!div class="nextstepaction"]
> [Configure an app registration for web API access](quickstart-configure-app-access-web-apis.md)

<!-- REF LINKS -->
[ms-graph-application]: /graph/api/resources/application
