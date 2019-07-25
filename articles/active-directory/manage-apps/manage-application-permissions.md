---
title: Managing user and admin permissions - Azure Active Directory | Microsoft Docs
description: Learn how to review and manage permissions for the application on Azure AD. For example, if you want to revoke all permissions granted to an application.
services: active-directory
author: mimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 05/15/2019
ms.author: mimart
ms.reviewer: luleonpla

ms.collection: M365-identity-device-management
---
# Manage application permission in Azure Active Directory

Learn how to review and manage application permissions. Based on the scenario, this article will provide different actions you can perform to secure your application. This apply to all applications that were added to your Azure Active Directory (Azure AD) tenant via user or admin consent.

For more information on consenting to applications, see [Azure Active Directory consent framework](../develop/consent-framework.md).

## Prerequisites

Being able to perform the actions below requires you to sign in as global administrator, an application administrator, or a cloud application administrator.

To restrict access to applications, you need to require user assignment and then assign users or groups to the application.  For more information, see [Methods for assigning users and groups](methods-for-assigning-users-and-groups.md).

You can access the Azure AD portal to get contextual PowerShell scripts to perform the actions.
 
1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Select the application you want to restrict access.
6. Select **Permissions**. In the command bar, select **Review permissions**.

![Review permissions](./media/manage-application-permissions/review-permissions.png)

## I want to control access to an application

We recommend that you restrict access to this application by turning User assignment settign on.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Select the application you want to restrict access.
6. Select **Properties** and then set User requirement required setting to Yes.
7. Select **User and Groups** and then remove unwanted users assigned to the application.
8. Assign user(s) or group(s) to the application.

Optional, you can remove all users assigned to the application using PowerShell.

## I want to revoke all permissions for an application

Using the PowerShell revoke all permissions granted to this application.

Optional, you can disable the application to block users from accessing the app and the application from accessing your data.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Select the application you want to restrict access.
6. Select **Properties** and then set Enabled for users to sign-in? to No.

## Application is suspicious and I want to investigate before allowing users to consent

We recommend that you restrict access to this application by turning User assignment settign on and review the permissions that user and admins have granted to the application.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Select the application you want to restrict access.
6. Select **Properties** and then set User requirement required setting to Yes.
7. Select **Permissions** and review the Admin and User consented permissions.

Optional, you can:

- Using PowerShell, remove all users assigned to stop them from signing into the application.
- Using PowerShell, invalidate refresh tokens for users who have access to the application.
- Using PowerShell, revoke all permissions for this application
- Disable the application to block users access and stop this applications access to your data.


## Application is malicious and I'm compromised

We recommend that you disable the application to block users from accessing the app and the application from accessing your data.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Select the application you want to restrict access.
6. Select **Properties** and then set Enabled for users to sign-in? to No.

Optional you can:

- From Properties, require user assignment to access the application.
- Using PowerShell, remove all users assigned to stop access to the application.
- Using PowerShell, revoke all permissions for this application.
- Using PowerShell, invalidate refresh tokens for users who have access to the application.

### PowerShell commands

Remove all users assigned to the application.
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

Revoke permissions granted to the application

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
Invalidate refresh tokens
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

