---
title: Configure the role claim for enterprise applications
description: Learn how to configure the role claim issued in the SAML token for enterprise applications in Azure Active Directory.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.topic: how-to
ms.date: 02/10/2023
ms.author: davidmu
ms.reviewer: jeedes
---

# Configure the role claim issued in the SAML token

In Azure Active Directory (Azure AD), you can customize the role claim in the response token that is received after an application is authorized. Use this feature if your application expects custom roles in the SAML response returned by Azure AD. You can create as many roles as you need.

## Prerequisites

- An Azure AD subscription with directory setup.
- A subscription that has single sign-on (SSO) enabled. You must configure SSO with your application.

> [!NOTE]
> This article explains how to create, update, or delete application roles on the service principal using APIs in Azure AD. To use the new user interface for App Roles, see [Add app roles to your application and receive them in the token](./howto-add-app-roles-in-azure-ad-apps.md).

## Locate or add an enterprise application

To complete the steps in this section, you can either use an existing enterprise application, or you can add a new one. If you have an existing application added to your tenant, use the following section to locate it.

### (Optional) Locate an existing application

1. In the [Azure portal](https://portal.azure.com/), in the left pane, select **Azure Active Directory**.
1. Select **Enterprise applications**, and then select **All applications**.
1. Enter the name of the existing application in the seach box.
1. Select the application from the list of applications that were found.
1. After the application is selected, copy the object ID from the overview pane.

    :::image type="content" source="media/active-directory-enterprise-app-role-management/tutorial_app_properties.png" alt-text="Copy the object identifier for the application.":::

If you want to add a new enterprise application, use the following section to create it.

### (Optional) Add the application

1. In the [Azure portal](https://portal.azure.com/), in the left pane, select **Azure Active Directory**.
1. Select **Enterprise applications**, and then select **All applications**.
1. To add a new application, select **New application** on the top of the pane.
1. In the search box, type the name of the enterprise application that you want to add, and then select it from the list of applications that were found.
1. Enter a display name for the instance of the application, and then select **Create** to add it to the tenant.
1. After the application is added, copy the object ID from the overview page.

## Add roles

Use the Microsoft Graph Explorer to add roles to an enterprise application.

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) in another window and sign in using the global admin or co-admin credentials for your tenant.

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
        },
        {
          "allowedMemberTypes": [
            "User"
          ],
          "description": "User",
          "displayName": "User",
          "id": "e18f0405-fdec-4ae8-a8a0-d8edb98b061f",
          "isEnabled": true,
          "origin": "Application",
          "value": null
        }
      ]
    }
    ```

1. In Graph Explorer, change the method from **GET** to **PATCH**.
1. Copy the appRoles property that was previously recorded into the **Request body** pane of Graph Explorer, add the new role definition, and then select **Run Query** to execute the patch operation. A success message confirms the creation of the role. The following example shows the addition of an *Administrators Only* role:

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
          "description": "User",
          "displayName": "User",
          "id": "e18f0405-fdec-4ae8-a8a0-d8edb98b061f",
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

    You can only add new roles after msiam_access for the patch operation. Also, you can add as many roles as your organization needs. Azure AD sends the value of these roles as the claim value in the SAML response. To generate the GUID values for the ID of new roles use the web tools, auch as the [Online GUID / UUID Generator](https://www.guidgenerator.com/). The appRoles property should now represent what was in the request body of the query.

## Assign roles

After the service principal is patched with more roles, you can assign users to the respective roles.

1. In the Azure portal, locate the application to which the role was added.
1. Select **Users and groups** in the left menu and then select the user that you want to assign the new role.
1. Select **Edit assignment** at the top of the pane to change the role.
1. Select **None Selected**, select the role from the list, and then select **Select**.
1. Select **Assign** to assign the role to the user.

    :::image type="content" source="media/active-directory-enterprise-app-role-management/assign-role.png" alt-text="Assign a role to a user of an application.":::

## Set up single sign-on, attributes, and claims

### Set up single sign-on

If you haven't already done so, configure single sign-on for the application before the role claim can be added.

1. In the **Manage** section of the left menu, select **Single sign-on**.
1. In the **Basic SAML Configuration** section, select **Edit**.
1. Enter the appropriate values for **Identifier (Entity ID)**, **Reply URL (Assertion Consumer Service URL)**, and **Sign on URL**. In most cases, a configuration guide can be accessed that provides guidance for setting these values.

### Edit attributes

Update the attributes to define the role claim.

1. In the **Attributes & Claims** section, select **Edit**.
1. Select **Add new claim**.
1. In the **Name** box, type the attribute name. This example uses **Role Name** as the claim name.
1. Leave the **Namespace** box blank.
1. From the **Source attribute** list, select **user.assignedroles**.
1. Select **Save**. The new **Role Name** attribute should now appear in the **Attributes & Claims** section and the claim will now be present in the response token when signing into the application.

    :::image type="content" source="media/active-directory-enterprise-app-role-management/attributes-summary.png" alt-text="A display of the list of attributes and claims defined for the application.":::

## Update an existing role

To update an existing role, perform the following steps:

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Sign in to the Graph Explorer site by using the global admin or coadmin credentials for your tenant.
1. Using the object ID for the application from the overview pane, replace `<objectID>` in the following request with it and then run the query:

    `https://graph.microsoft.com/v1.0/servicePrincipals/<objectID>`

1. Record the **appRoles** property from the service principal object that was returned.
1. In Graph Explorer, change the method from **GET** to **PATCH**.
1. Copy the appRoles property that was previously recorded into the **Request body** pane of Graph Explorer, add update the role definition, and then select **Run Query** to execute the patch operation.

## Delete an existing role

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

- For information about customizing claims, see [Customize claims issued in the SAML token for enterprise applications](active-directory-saml-claims-customization.md).
