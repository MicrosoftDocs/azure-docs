---
title: Configure an application to expose web APIs - Microsoft identity platform
description: Learn how to configure an application to expose a new permission/scope and role to make the application available to client applications.
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
#Customer intent: As an application developer, I need to know how to configure my application to expose new permissions (or scopes) and roles, to make my application available to client applications.
ms.collection: M365-identity-device-management
---

# Quickstart: Configure an application to expose web APIs

You can develop a web API and make it available to client applications by exposing [permissions/scopes](developer-glossary.md#scopes) and [roles](developer-glossary.md#roles). A correctly configured web API is made available just like the other Microsoft web APIs, including the Graph API and the Office 365 APIs.

In this quickstart, you'll learn how to configure an application to expose a new scope to make it available to client applications.

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

1. Follow the steps to [verify that the web API is exposed to other applications](#verify-the-web-api-is-exposed-to-other-applications).

## Expose a new scope or role through the application manifest

[![Expose a new scope using the oauth2Permissions collection in the manifest](./media/quickstart-update-azure-ad-app-preview/expose-new-scope-through-app-manifest-expanded.png)](./media/quickstart-update-azure-ad-app-preview/expose-new-scope-through-app-manifest-expanded.png#lightbox)

To expose a new scope through the application manifest:

1. From the app's **Overview** page, select the **Manifest** section. A web-based manifest editor opens, allowing you to **Edit** the manifest within the portal. Optionally, you can select **Download** and edit the manifest locally, and then use **Upload** to reapply it to your application.
    
    The following example shows how to expose a new scope called `Employees.Read.All` in the resource/API by adding the following JSON element to the `oauth2Permissions` collection.

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

   > [!NOTE]
   > The `id` value must be generated programmatically or by using a GUID generation tool such as [guidgen](https://msdn.microsoft.com/library/ms241442%28v=vs.80%29.aspx). The `id` represents a unique identifier for the scope as exposed by the web API. Once a client is appropriately configured with permissions to access your web API, it is issued an OAuth 2.0 access token by Azure AD. When the client calls the web API, it presents the access token that has the scope (scp) claim set to the permissions requested in its application registration.
   >
   > You can expose additional scopes later as necessary. Consider that your web API might expose multiple scopes associated with a variety of different functions. Your resource can control access to the web API at runtime by evaluating the scope (`scp`) claim(s) in the received OAuth 2.0 access token.

1. When finished, click **Save**. Now your web API is configured for use by other applications in your directory.
1. Follow the steps to [verify that the web API is exposed to other applications](#verify-the-web-api-is-exposed-to-other-applications).

## Verify the web API is exposed to other applications

1. Go back to your Azure AD tenant, select **App registrations**, find and select the client application you want to configure.
1. Repeat the steps outlined in Configure a client application to access web APIs.
1. When you get to the **Select an API** step, select your resource. You should see the new scope, available for client permission requests.

## More on the application manifest

The application manifest serves as a mechanism for updating the application entity, which defines all attributes of an Azure AD application's identity configuration. For more information on the Application entity and its schema, see the [Graph API Application entity documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity). The article contains complete reference information on the Application entity members used to specify permissions for your API, including:  

* The appRoles member, which is a collection of [AppRole](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#approle-type) entities, used to define [application permissions](developer-glossary.md#permissions) for a web API.
* The oauth2Permissions member, which is a collection of [OAuth2Permission](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permission-type) entities, used to define [delegated permissions](developer-glossary.md#permissions) for a web API.

For more information on application manifest concepts in general, see [Understanding the Azure Active Directory application manifest](reference-app-manifest.md).

## Next steps

Learn about these other related app management quickstarts for apps:

* [Register an application with the Microsoft identity platform](quickstart-register-app.md)
* [Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md)
* [Modify the accounts supported by an application](quickstart-modify-supported-accounts.md)
* [Remove an application registered with the Microsoft identity platform](quickstart-remove-app.md)

To learn more about the two Azure AD objects that represent a registered application and the relationship between them, see [Application objects and service principal objects](app-objects-and-service-principals.md).

To learn more about the branding guidelines you should use when developing applications with Azure Active Directory, see [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md).
