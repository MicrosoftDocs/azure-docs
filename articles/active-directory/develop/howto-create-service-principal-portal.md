---
title: Create identity for Azure app in portal | Microsoft Docs
description: Describes how to create a new Azure Active Directory application and service principal that can be used with the role-based access control in Azure Resource Manager to manage access to resources.
services: active-directory
documentationcenter: na
author: CelesteDG
manager: mtillman

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/08/2019
ms.author: celested
ms.reviewer: tomfitz
ms.custom: seoapril2019
ms.collection: M365-identity-device-management
---

# How to: Use the portal to create an Azure AD application and service principal that can access resources

This article shows you how to create a new Azure Active Directory (Azure AD) application and service principal that can be used with the role-based access control. When you have code that needs to access or modify resources, you can create an identity for the app. This identity is known as a service principal. You can then assign the required permissions to the service principal. This article shows you how to use the portal to create the service principal. It focuses on a single-tenant application where the application is intended to run within only one organization. You typically use single-tenant applications for line-of-business applications that run within your organization.

> [!IMPORTANT]
> Instead of creating a service principal, consider using managed identities for Azure resources for your application identity. If your code runs on a service that supports managed identities and accesses resources that support Azure AD authentication, managed identities are a better option for you. To learn more about managed identities for Azure resources, including which services currently support it, see [What is managed identities for Azure resources?](../managed-identities-azure-resources/overview.md).

## Create an Azure Active Directory application

Let's jump straight into creating the identity. If you run into a problem, check the [required permissions](#required-permissions) to make sure your account can create the identity.

1. Sign in to your Azure Account through the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory**.
1. Select **App registrations**.

   ![Select app registrations](./media/howto-create-service-principal-portal/select-app-registrations.png)

1. Select **New application registration**.

   ![Add app](./media/howto-create-service-principal-portal/select-add-app.png)

1. Provide a name and URL for the application. Select **Web app / API** for the type of application you want to create. You can't create credentials for a [Native application](../manage-apps/application-proxy-configure-native-client-application.md). You can't use that type for an automated application. After setting the values, select **Create**.

   ![Name application](./media/howto-create-service-principal-portal/create-app.png)

You've created your Azure AD application and service principal.

## Assign the application to a role

To access resources in your subscription, you must assign the application to a role. Decide which role offers the right permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](../../role-based-access-control/built-in-roles.md).

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group means it can read the resource group and any resources it contains.

1. Navigate to the level of scope you wish to assign the application to. For example, to assign a role at the subscription scope, select **All services** and **Subscriptions**.

   ![Select subscription](./media/howto-create-service-principal-portal/select-subscription.png)

1. Select the particular subscription to assign the application to.

   ![Select subscription for assignment](./media/howto-create-service-principal-portal/select-one-subscription.png)

   If you don't see the subscription you're looking for, select **global subscriptions filter**. Make sure the subscription you want is selected for the portal. 

1. Select **Access control (IAM)**.
1. Select **Add role assignment**.

   ![Select add role assignment](./media/howto-create-service-principal-portal/select-add.png)

1. Select the role you wish to assign to the application. To allow the application to execute actions like **reboot**, **start** and **stop** instances, select the **Contributor** role. By default, Azure AD applications aren't displayed in the available options. To find your application, search for the name and select it.

   ![Select role](./media/howto-create-service-principal-portal/select-role.png)

1. Select **Save** to finish assigning the role. You see your application in the list of users assigned to a role for that scope.

Your service principal is set up. You can start using it to run your scripts or apps. The next section shows how to get values that are needed when signing in programmatically.

## Get values for signing in

### Get tenant ID

When programmatically signing in, you need to pass the tenant ID with your authentication request.

1. Select **Azure Active Directory**.
1. Select **Properties**.

   ![Select Azure AD properties](./media/howto-create-service-principal-portal/select-ad-properties.png)

1. Copy the **Directory ID** to get your tenant ID.

   ![Tenant ID](./media/howto-create-service-principal-portal/copy-directory-id.png)

### Get application ID and authentication key

You also need the ID for your application and an authentication key. To get those values, use the following steps:

1. From **App registrations** in Azure AD, select your application.

   ![Select application](./media/howto-create-service-principal-portal/select-app.png)

1. Copy the **Application ID** and store it in your application code.

   ![Client ID](./media/howto-create-service-principal-portal/copy-app-id.png)

1. Select **Settings**.

   ![Select settings](./media/howto-create-service-principal-portal/select-settings.png)

1. Select **Keys**.
1. Provide a description of the key, and a duration for the key. When done, select **Save**.

   ![Save key](./media/howto-create-service-principal-portal/save-key.png)

   After saving the key, the value of the key is displayed. Copy this value because you aren't able to retrieve the key later. You provide the key value with the application ID to sign in as the application. Store the key value where your application can retrieve it.

   ![Saved key](./media/howto-create-service-principal-portal/copy-key.png)

## Required permissions

You must have sufficient permissions to register an application with your Azure AD tenant, and assign the application to a role in your Azure subscription.

### Check Azure AD permissions

1. Select **Azure Active Directory**.
1. Note your role. If you have the **User** role, you must make sure that non-administrators can register applications.

   ![Find user](./media/howto-create-service-principal-portal/view-user-info.png)

1. Select **User settings**.

   ![Select user settings](./media/howto-create-service-principal-portal/select-user-settings.png)

1. Check the **App registrations** setting. This value can only be set by an administrator. If set to **Yes**, any user in the Azure AD tenant can register an app.

   ![View app registrations](./media/howto-create-service-principal-portal/view-app-registrations.png)

If the app registrations setting is set to **No**, only users with an administrator role may register these types of applications. See [available roles](../users-groups-roles/directory-assign-admin-roles.md#available-roles) and [role permissions](../users-groups-roles/directory-assign-admin-roles.md#role-permissions) to learn about available administrator roles and the specific permissions in Azure AD that are given to each role. If your account is assigned to the User role, but the app registration setting is limited to admin users, ask your administrator to either assign you to one of the administrator roles that can create and manage all aspects of app registrations, or to enable users to register apps.

### Check Azure subscription permissions

In your Azure subscription, your account must have `Microsoft.Authorization/*/Write` access to assign an AD app to a role. This action is granted through the [Owner](../../role-based-access-control/built-in-roles.md#owner) role or [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) role. If your account is assigned to the **Contributor** role, you don't have adequate permission. You receive an error when attempting to assign the service principal to a role.

To check your subscription permissions:

1. Select your account in the upper right corner, and select **My permissions**.

   ![Select user permissions](./media/howto-create-service-principal-portal/select-my-permissions.png)

1. From the drop-down list, select the subscription you want to create the service principal in. Then, select **Click here to view complete access details for this subscription**.

   ![Find user](./media/howto-create-service-principal-portal/view-details.png)

1. View your assigned roles, and determine if you have adequate permissions to assign an AD app to a role. If not, ask your subscription administrator to add you to User Access Administrator role. In the following image, the user is assigned to the Owner role, which means that user has adequate permissions.

   ![Show permissions](./media/howto-create-service-principal-portal/view-user-role.png)

## Next steps

* To set up a multi-tenant application, see [Developer's guide to authorization with the Azure Resource Manager API](../../azure-resource-manager/resource-manager-api-authentication.md).
* To learn about specifying security policies, see [Azure Role-based Access Control](../../role-based-access-control/role-assignments-portal.md).  
* For a list of available actions that can be granted or denied to users, see [Azure Resource Manager Resource Provider operations](../../role-based-access-control/resource-provider-operations.md).
