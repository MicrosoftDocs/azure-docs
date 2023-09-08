---
title: Restrict Azure AD app to a set of users
description: Learn how to restrict access to your apps registered in Azure AD to a selected set of users.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 03/28/2023
ms.author: cwerner
ms.reviewer: jmprieur, kkrishna
ms.custom: aaddev, engagement-fy23

#Customer intent: As a tenant administrator, I want to restrict an application that I have registered in Azuren-e AD to a select set of users available in my Azure AD tenant
---

# Restrict your Azure AD app to a set of users in an Azure AD tenant

Applications registered in an Azure Active Directory (Azure AD) tenant are, by default, available to all users of the tenant who authenticate successfully.

Similarly, in a [multi-tenant](howto-convert-app-to-be-multi-tenant.md) application, all users in the Azure AD tenant where the application is provisioned can access the application once they successfully authenticate in their respective tenant.

Tenant administrators and developers often have requirements where an application must be restricted to a certain set of users or apps (services). There are two ways to restrict an application to a certain set of users, apps or security groups:

- Developers can use popular authorization patterns like [Azure role-based access control (Azure RBAC)](howto-implement-rbac-for-apps.md).
- Tenant administrators and developers can use built-in feature of Azure AD.

## Supported app configurations

The option to restrict an app to a specific set of users, apps or security groups in a tenant works with the following types of applications:

- Applications configured for federated single sign-on with SAML-based authentication.
- Application proxy applications that use Azure AD preauthentication.
- Applications built directly on the Azure AD application platform that use OAuth 2.0/OpenID Connect authentication after a user or admin has consented to that application.

## Update the app to require user assignment

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To update an application to require user assignment, you must be owner of the application under Enterprise apps, or be assigned one of **Global administrator**, **Application administrator**, or **Cloud application administrator** directory roles.

1. Sign in to the [Azure portal](https://portal.azure.com)
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch the tenant in which you want to register an application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **Enterprise Applications** then select **All applications**.
1. Select the application you want to configure to require assignment. Use the filters at the top of the window to search for a specific application.
1. On the application's **Overview** page, under **Manage**, select **Properties**.
1. Locate the setting **Assignment required?** and set it to **Yes**. When this option is set to **Yes**, users and services attempting to access the application or services must first be assigned for this application, or they won't be able to sign-in or obtain an access token.
1. Select **Save** on the top bar.

When an application requires assignment, user consent for that application isn't allowed. This is true even if users consent for that app would have otherwise been allowed. Be sure to [grant tenant-wide admin consent](../manage-apps/grant-admin-consent.md) to apps that require assignment.

## Assign the app to users and groups to restrict access

Once you've configured your app to enable user assignment, you can go ahead and assign the app to users and groups.

1. Under **Manage**, select the **Users and groups** then select **Add user/group**.
1. Select the **Users** selector.

   A list of users and security groups are shown along with a textbox to search and locate a certain user or group. This screen allows you to select multiple users and groups in one go.

1. Once you're done selecting the users and groups, select **Select**.
1. (Optional) If you have defined app roles in your application, you can use the **Select role** option to assign the app role to the selected users and groups.
1. Select **Assign** to complete the assignments of the app to the users and groups.
1. Confirm that the users and groups you added are showing up in the updated **Users and groups** list.

## Restrict access to an app (resource) by assigning other services (client apps)

Follow the steps in this section to secure app-to-app authentication access for your tenant.

1. Navigate to Service Principal sign-in logs in your tenant to find services authenticating to access resources in your tenant.
1. Check using app ID if a Service Principal exists for both resource and client apps in your tenant that you wish to manage access.
      ```powershell
      Get-MgServicePrincipal `
      -Filter "AppId eq '$appId'"
      ```
1. Create a Service Principal using app ID, if it doesn't exist:
      ```powershell
      New-MgServicePrincipal `
      -AppId $appId
      ```
1. Explicitly assign client apps to resource apps (this functionality is available only in API and not in the Azure AD Portal):
      ```powershell
      $clientAppId = “[guid]”
                     $clientId = (Get-MgServicePrincipal -Filter "AppId eq '$clientAppId'").Id
      New-MgServicePrincipalAppRoleAssignment `
      -ServicePrincipalId $clientId `
      -PrincipalId $clientId `
      -ResourceId (Get-MgServicePrincipal -Filter "AppId eq '$appId'").Id `
      -AppRoleId "00000000-0000-0000-0000-000000000000"
      ```
1. Require assignment for the resource application to restrict access only to the explicitly assigned users or services.
      ```powershell
      Update-MgServicePrincipal -ServicePrincipalId (Get-MgServicePrincipal -Filter "AppId eq '$appId'").Id -AppRoleAssignmentRequired:$true
      ```
   > [!NOTE]
   > If you don't want tokens to be issued for an application or if you want to block an application from being accessed by users or services in your tenant, create a service principal for the application and [disable user sign-in](../manage-apps/disable-user-sign-in-portal.md) for it.

## More information

For more information about roles and security groups, see:

- [How to: Add app roles in your application](./howto-add-app-roles-in-azure-ad-apps.md)
- [Using Security Groups and Application Roles in your apps (Video)](https://www.youtube.com/watch?v=LRoc-na27l0)
- [Azure Active Directory app manifest](./reference-app-manifest.md)
