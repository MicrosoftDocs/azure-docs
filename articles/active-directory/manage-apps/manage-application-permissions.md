---
title: Review permissions granted to applications
description: Learn how to review and manage permissions for an application in Azure Active Directory.
services: active-directory
author: Jackson-Woods
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 10/23/2021
ms.author: jawoods
ms.reviewer: phsignor
zone_pivot_groups: enterprise-apps-minus-graph
ms.collection: M365-identity-device-management

#customer intent: As an admin, I want to review permissions granted to applications so that I can restrict suspicious or over privileged applications.

---

# Review permissions granted to applications

In this article, you'll learn how to review permissions granted to applications in your Azure Active Directory (Azure AD) tenant. You may need to review permissions when you've detected a malicious application or the application has been granted more permissions than is necessary.

The steps in this article apply to all applications that were added to your Azure Active Directory (Azure AD) tenant via user or admin consent. For more information on consenting to applications, see [Azure Active Directory consent framework](../develop/consent-framework.md).

## Prerequisites

To review permissions granted to applications, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator.
- A Service principal owner who isn't an administrator is able to invalidate refresh tokens.

## Review application permissions

:::zone pivot="portal"

You can access the Azure AD portal to get contextual PowerShell scripts to perform the actions.

To review application permissions:

1. Sign in to the [Azure portal](https://portal.azure.com) using one of the roles listed in the prerequisites section.
1. Select **Azure Active Directory**, and then select **Enterprise applications**.
1. Select the application that you want to restrict access to.
1. Select **Permissions**. In the command bar, select **Review permissions**.
![Screenshot of the review permissions window.](./media/manage-application-permissions/review-permissions.png)
1. Give a reason for why you want to review permissions for the application by selecting any of the options listed after the question, **Why do you want to review permissions for this application?**

Each option generates PowerShell scripts that enable you to control user access to the application and to review permissions granted to the application. For information about how to control user access to an application, see [How to remove a user's access to an application](methods-for-removing-user-access.md)

:::zone-end

:::zone pivot="aad-powershell"

Using the following Azure AD PowerShell script revokes all permissions granted to an application.

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

## Invalidate the refresh tokens

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
:::zone-end
:::zone pivot="ms-powershell"

Using the following Microsoft Graph PowerShell script revokes all permissions granted to an application.

```powershell
Connect-MgGraph

# Get Service Principal using objectId
$sp = Get-MgServicePrincipal -ServicePrincipalID "$ServicePrincipalID"

Example: Get-MgServicePrincipal -ServicePrincipalId '22c1770d-30df-49e7-a763-f39d2ef9b369'

# Get all application permissions for the service principal
$spOAuth2PermissionsGrants= Get-MgOauth2PermissionGrant -All| Where-Object { $_.clientId -eq $sp.Id }

# Remove all delegated permissions
$spOauth2PermissionsGrants |ForEach-Object {
  Remove-MgOauth2PermissionGrant -OAuth2PermissionGrantId $_.Id
  }
``` 

## Invalidate the refresh tokens

```powershell
Connect-MgGraph

# Get Service Principal using objectId
$sp = Get-MgServicePrincipal -ServicePrincipalID "$ServicePrincipalID"

Example: Get-MgServicePrincipal -ServicePrincipalId '22c1770d-30df-49e7-a763-f39d2ef9b369'

# Get Azure AD App role assignments using objectID of the Service Principal
$spApplicationPermissions = Get-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalID $sp.Id -All | Where-Object { $_.PrincipalType -eq "ServicePrincipal" }
  
# Revoke refresh token for all users assigned to the application
  $spApplicationPermissions | ForEach-Object {
  Remove-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $_.PrincipalId -AppRoleAssignmentId $_.Id
  }
```

:::zone-end

> [!NOTE]
> Revoking the current granted permission won't stop users from re-consenting to the application. If you want to block users from consenting, read [Configure how users consent to applications](configure-user-consent.md).

## Next steps

- [Configure admin consent workflow](configure-admin-consent-workflow.md)
