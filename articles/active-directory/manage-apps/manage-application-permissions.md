---
title: Manage user and admin permissions - Azure Active Directory | Microsoft Docs
description: Learn how to review and manage permissions for the application on Azure AD. For example, revoke all permissions granted to an application.
services: active-directory
author: msmimart
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 7/10/2020
ms.author: mimart
ms.reviewer: luleonpla

ms.collection: M365-identity-device-management
---
# Take action on overprivileged or suspicious applications in Azure Active Directory

Learn how to review and manage application permissions. This article provides different actions you can take to secure your application according to the scenario. These actions apply to all applications that were added to your Azure Active Directory (Azure AD) tenant via user or admin consent.

For more information on consenting to applications, see [Azure Active Directory consent framework](../develop/consent-framework.md).

## Prerequisites

To do the following actions, you must sign in as a global administrator, an application administrator, or a cloud application administrator.

To restrict access to applications, you need to require user assignment and then assign users or groups to the application.  For more information, see [Methods for assigning users and groups](./assign-user-or-group-access-portal.md).

You can access the Azure AD portal to get contextual PowerShell scripts to perform the actions.
 
1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Select **Azure Active Directory** > **Enterprise applications**.
3. Select the application that you want to restrict access to.
4. Select **Permissions**. In the command bar, select **Review permissions**.

![Screenshot of the review permissions window.](./media/manage-application-permissions/review-permissions.png)


## Control access to an application

We recommend that you restrict access to the application by turning on the **User assignment** setting.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Select **Azure Active Directory** > **Enterprise applications**.
3. Select the application that you want to restrict access to.
4. Select **Properties**, and then set **User requirement required** to **Yes**.
5. Select **User and Groups**, and then remove the unwanted users who are assigned to the application.
6. Assign users or groups to the application.

Optionally, you can remove all users who are assigned to the application by using PowerShell.

## Revoke all permissions for an application

Using the PowerShell script revokes all permissions granted to this application.

> [!NOTE]
> Revoking the current granted permission won't stop users from re-consenting to the application. If you want to block users from consenting, read [Configure how users consent to applications](configure-user-consent.md).

Optionally, you can disable the application to keep users from accessing the app and to keep the application from accessing your data.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Select **Azure Active Directory** > **Enterprise applications**.
3. Select the application that you want to restrict access to.
4. Select **Properties**, and then set **Enabled for users to sign-in?** to **No**.

## Investigate a suspicious application

We recommend that you restrict access to the application by turning on the **User assignment** setting. Then review the permissions that users and admins have granted to the application.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
3. Select **Azure Active Directory** > **Enterprise applications**.
5. Select the application that you want to restrict access to.
6. Select **Properties**, and then set **User requirement required** to **Yes**.
7. Select **Permissions**, and review the admin and user consented permissions.

Optionally, by using PowerShell, you can:

- Remove all assigned users to stop them from signing in to the application.
- Invalidate refresh tokens for users who have access to the application.
- Revoke all permissions for the application.

Or you can disable the application to block users' access and stop the application's access to your data.


## Disable a malicious application 

We recommend that you disable the application to block users' access and to keep the application from accessing your data. If you delete the application instead, then users can re-consent to the application and grant access to your data.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Select **Azure Active Directory** > **Enterprise applications**.
3. Select the application that you want to restrict access to.
4. Select **Properties**, and then copy the object ID.

### PowerShell commands


Retrieve the service principal object ID.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Select **Azure Active Directory** > **Enterprise applications**.
3. Select the application that you want to restrict access to.
4. Select **Properties**, and then copy the object ID.

```powershell
$sp = Get-AzureADServicePrincipal -Filter "displayName eq '$app_name'"
$sp.ObjectId
```
Remove all users who are assigned to the application.
 ```powershell
Connect-AzureAD

# Get Service Principal using objectId
$sp = Get-AzureADServicePrincipal -ObjectId "<ServicePrincipal objectID>"

# Get Azure AD App role assignments using objectId of the Service Principal
$assignments = Get-AzureADServiceAppRoleAssignment -ObjectId $sp.ObjectId -All $true

# Remove all users and groups assigned to the application
$assignments | ForEach-Object {
    if ($_.PrincipalType -eq "User") {
        Remove-AzureADUserAppRoleAssignment -ObjectId $_.PrincipalId -AppRoleAssignmentId $_.ObjectId
    } elseif ($_.PrincipalType -eq "Group") {
        Remove-AzureADGroupAppRoleAssignment -ObjectId $_.PrincipalId -AppRoleAssignmentId $_.ObjectId
    }
}
 ```

Revoke permissions granted to the application.

```powershell
Connect-AzureAD

# Get Service Principal using objectId
$sp = Get-AzureADServicePrincipal -ObjectId "<ServicePrincipal objectID>"

# Get all delegated permissions for the service principal
$spOAuth2PermissionsGrants = Get-AzureADOAuth2PermissionGrant -All $true| Where-Object { $_.clientId -eq $sp.ObjectId }

# Remove all delegated permissions
$spOAuth2PermissionsGrants | ForEach-Object {
    Remove-AzureADOAuth2PermissionGrant -ObjectId $_.ObjectId
}

# Get all application permissions for the service principal
$spApplicationPermissions = Get-AzureADServiceAppRoleAssignedTo -ObjectId $sp.ObjectId -All $true | Where-Object { $_.PrincipalType -eq "ServicePrincipal" }

# Remove all delegated permissions
$spApplicationPermissions | ForEach-Object {
    Remove-AzureADServiceAppRoleAssignment -ObjectId $_.PrincipalId -AppRoleAssignmentId $_.objectId
}
```
Invalidate the refresh tokens.
```powershell
Connect-AzureAD

# Get Service Principal using objectId
$sp = Get-AzureADServicePrincipal -ObjectId "<ServicePrincipal objectID>"

# Get Azure AD App role assignments using objectID of the Service Principal
$assignments = Get-AzureADServiceAppRoleAssignment -ObjectId $sp.ObjectId -All $true | Where-Object {$_.PrincipalType -eq "User"}

# Revoke refresh token for all users assigned to the application
$assignments | ForEach-Object {
    Revoke-AzureADUserAllRefreshToken -ObjectId $_.PrincipalId
}
```
## Next steps
- [Manage consent to applications and evaluate consent request](manage-consent-requests.md)
- [Configure user consent](configure-user-consent.md)
- [Configure admin consent workflow](configure-admin-consent-workflow.md)
