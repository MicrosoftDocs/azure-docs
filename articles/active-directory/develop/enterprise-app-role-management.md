---
title: Configure the role claim
description: Learn how to configure the role claim issued in the SAML token for enterprise applications in Azure Active Directory.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.topic: how-to
ms.date: 06/09/2023
ms.author: davidmu
ms.reviewer: jeedes
---

# Configure the role claim

You can customize the role claim in the access token that is received after an application is authorized. Use this feature if your application expects custom roles in the token. You can create as many roles as you need.

## Prerequisites

- An Azure AD subscription with a configured tenant. For more information, see [Quickstart: Set up a tenant](quickstart-create-new-tenant.md).
- An enterprise application that has been added to the tenant. For more information, see [Quickstart: Add an enterprise application](../manage-apps/add-application-portal.md).
- Single sign-on (SSO) configured for the application. For more information, see [Enable single sign-on for an enterprise application](../manage-apps/add-application-portal-setup-sso.md).
- A user account that is assigned to the role. For more information, see [Quickstart: Create and assign a user account](../manage-apps/add-application-portal-assign-users.md).

> [!NOTE]
> This article explains how to create, update, or delete application roles on the service principal using APIs. To use the new user interface for App Roles, see [Add app roles to your application and receive them in the token](howto-add-app-roles-in-azure-ad-apps.md).

## Locate the enterprise application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Use the following steps to locate the enterprise application:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left pane, select **Azure Active Directory**.
1. Select **Enterprise applications**, and then select **All applications**.
1. Enter the name of the existing application in the search box, and then select the application from the search results.
1. After the application is selected, copy the object ID from the overview pane.

    :::image type="content" source="media/enterprise-app-role-management/record-objectid.png" alt-text="Screenshot that shows how to locate and record the object identifier for the application.":::

## Add roles

Use the Microsoft Graph Explorer to add roles to an enterprise application.

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) in another window and sign in using the administrator credentials for your tenant.

    > [!NOTE]
    > The Cloud App Administrator and App Administrator role won't work in this scenario. The Global Admin permissions are needed for directory read and write.

1. Select **modify permissions**, select **Consent** for the `Application.ReadWrite.All` and the `Directory.ReadWrite.All` permissions in the list.
1. Replace `<objectID>` in the following request with the object ID that was previously recorded and then run the query:

    `https://graph.microsoft.com/v1.0/servicePrincipals/<objectID>`

1. An enterprise application is also referred to as a service principal. Record the **appRoles** property from the service principal object that was returned. The following example shows the typical appRoles property:

    ```json
    {
      "appRoles": [
        {
          "allowedMemberTypes": [
            "User"
          ],
          "description": "msiam_access",
          "displayName": "msiam_access",
          "id": "ef7437e6-4f94-4a0a-a110-a439eb2aa8f7",
          "isEnabled": true,
          "origin": "Application",
          "value": null
        }
      ]
    }
    ```

1. In Graph Explorer, change the method from **GET** to **PATCH**.
1. Copy the appRoles property that was previously recorded into the **Request body** pane of Graph Explorer, add the new role definition, and then select **Run Query** to execute the patch operation. A success message confirms the creation of the role. The following example shows the addition of an *Admin* role:

    ```json
    {
      "appRoles": [
        {
          "allowedMemberTypes": [
            "User"
          ],
          "description": "msiam_access",
          "displayName": "msiam_access",
          "id": "ef7437e6-4f94-4a0a-a110-a439eb2aa8f7",
          "isEnabled": true,
          "origin": "Application",
          "value": null
        },
        {
          "allowedMemberTypes": [
            "User"
          ],
          "description": "Administrators Only",
          "displayName": "Admin",
          "id": "4f8f8640-f081-492d-97a0-caf24e9bc134",
          "isEnabled": true,
          "origin": "ServicePrincipal",
          "value": "Administrator"
        }
      ]
    }
    ```

    You can only add new roles after msiam_access for the patch operation. Also, you can add as many roles as your organization needs. The value of these roles is sent as the claim value in the SAML response. To generate the GUID values for the ID of new roles use the web tools, such as the [Online GUID / UUID Generator](https://www.guidgenerator.com/). The appRoles property should represent what was in the request body of the query.

## Edit attributes

Update the attributes to define the role claim that is included in the token.

1. Locate the application in the Azure portal, and then select **Single sign-on** in the left menu.
1. In the **Attributes & Claims** section, select **Edit**.
1. Select **Add new claim**.
1. In the **Name** box, type the attribute name. This example uses **Role Name** as the claim name.
1. Leave the **Namespace** box blank.
1. From the **Source attribute** list, select **user.assignedroles**.
1. Select **Save**. The new **Role Name** attribute should now appear in the **Attributes & Claims** section. The claim should now be included in the access token when signing into the application.

    :::image type="content" source="media/enterprise-app-role-management/attributes-summary.png" alt-text="Screenshot that shows a display of the list of attributes and claims defined for the application.":::

## Assign roles

After the service principal is patched with more roles, you can assign users to the respective roles.

1. In the Azure portal, locate the application to which the role was added.
1. Select **Users and groups** in the left menu and then select the user that you want to assign the new role.
1. Select **Edit assignment** at the top of the pane to change the role.
1. Select **None Selected**, select the role from the list, and then select **Select**.
1. Select **Assign** to assign the role to the user.

    :::image type="content" source="media/enterprise-app-role-management/assign-role.png" alt-text="Screenshot that shows how to assign a role to a user of an application.":::

## Update roles

To update an existing role, perform the following steps:

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Sign in to the Graph Explorer site by using the global admin or coadmin credentials for your tenant.
1. Using the object ID for the application from the overview pane, replace `<objectID>` in the following request with it and then run the query:

    `https://graph.microsoft.com/v1.0/servicePrincipals/<objectID>`

1. Record the **appRoles** property from the service principal object that was returned.
1. In Graph Explorer, change the method from **GET** to **PATCH**.
1. Copy the appRoles property that was previously recorded into the **Request body** pane of Graph Explorer, add update the role definition, and then select **Run Query** to execute the patch operation.

## Delete roles

To delete an existing role, perform the following steps:

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Sign in to the Graph Explorer site by using the global admin or coadmin credentials for your tenant.
1. Using the object ID for the application from the overview pane in the Azure portal, replace `<objectID>` in the following request with it and then run the query:

    `https://graph.microsoft.com/v1.0/servicePrincipals/<objectID>`

1. Record the **appRoles** property from the service principal object that was returned.
1. In Graph Explorer, change the method from **GET** to **PATCH**.
1. Copy the appRoles property that was previously recorded into the **Request body** pane of Graph Explorer, set the **IsEnabled** value to **false** for the role that you want to delete, and then select **Run Query** to execute the patch operation. A role must be disabled before it can be deleted.
1. After the role is disabled, delete that role block from the **appRoles** section. Keep the method as **PATCH**, and select **Run Query** again.

## Next steps

- For information about customizing claims, see [Customize claims issued in the SAML token for enterprise applications](saml-claims-customization.md).
