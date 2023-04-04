---
title: Configure permission classifications
description: Learn how to manage delegated permission classifications.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 3/28/2023
ms.author: jomondi
ms.reviewer: arvindh, luleon, phsignor, jawoods
ms.custom: contperf-fy21q2
zone_pivot_groups: enterprise-apps-all

#customer intent: As an admin, I want configure permission classifications for applications in Azure AD
---

# Configure permission classifications

In this article, you learn how to configure permissions classifications in Azure Active Directory (Azure AD). Permission classifications allow you to identify the impact that different permissions have according to your organization's policies and risk evaluations. For example, you can use permission classifications in consent policies to identify the set of permissions that users are allowed to consent to.

Currently, only the "Low impact" permission classification is supported. Only delegated permissions that don't require admin consent can be classified as "Low impact".

The minimum permissions needed to do basic sign-in are `openid`, `profile`, `email`, and `offline_access`, which are all delegated permissions on the Microsoft Graph. With these permissions an app can read details of the signed-in user's profile, and can maintain this access even when the user is no longer using the app.

## Prerequisites

To configure permission classifications, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: A global administrator, or owner of the service principal.

## Manage permission classifications

:::zone pivot="portal"

Follow these steps to classify permissions using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator), [Application Administrator](../roles/permissions-reference.md#application-administrator), or [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator)
1. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **Permission classifications**.
1. Choose **Add permissions** to classify another permission as "Low impact".
1. Select the API and then select the delegated permission(s).

In this example, we've classified the minimum set of permission required for single sign-on:

:::image type="content" source="media/configure-permission-classifications/permission-classifications.png" alt-text="Permission classifications":::


:::zone-end

:::zone pivot="aad-powershell"

You can use the latest [Azure AD PowerShell](/powershell/module/azuread/?preserve-view=true&view=azureadps-2.0), to classify permissions. Permission classifications are configured on the **ServicePrincipal** object of the API that publishes the permissions.

Run the following command to connect to Azure AD PowerShell. To consent to the required scopes, sign in with one of the roles listed in the prerequisite section of this article.

```powershell
Connect-AzureAD -Scopes
```

### List the current permission classifications

1. Retrieve the **ServicePrincipal** object for the API. Here we retrieve the ServicePrincipal object for the Microsoft Graph API:

   ```powershell
   $api = Get-AzureADServicePrincipal `
       -Filter "servicePrincipalNames/any(n:n eq 'https://graph.microsoft.com')"
   ```

1. Read the delegated permission classifications for the API:

   ```powershell
   Get-AzureADMSServicePrincipalDelegatedPermissionClassification `
       -ServicePrincipalId $api.ObjectId | Format-Table Id, PermissionName, Classification
   ```

### Classify a permission as "Low impact"

1. Retrieve the **ServicePrincipal** object for the API. Here we retrieve the ServicePrincipal object for the Microsoft Graph API:

   ```powershell
   $api = Get-AzureADServicePrincipal `
       -Filter "servicePrincipalNames/any(n:n eq 'https://graph.microsoft.com')"
   ```

1. Find the delegated permission you would like to classify:

   ```powershell
   $delegatedPermission = $api.OAuth2Permissions | Where-Object { $_.Value -eq "User.ReadBasic.All" }
   ```

1. Set the permission classification using the permission name and ID:

   ```powershell
   Add-AzureADMSServicePrincipalDelegatedPermissionClassification `
      -ServicePrincipalId $api.ObjectId `
      -PermissionId $delegatedPermission.Id `
      -PermissionName $delegatedPermission.Value `
      -Classification "low"
   ```

### Remove a delegated permission classification

1. Retrieve the **ServicePrincipal** object for the API. Here we retrieve the ServicePrincipal object for the Microsoft Graph API:

   ```powershell
   $api = Get-AzureADServicePrincipal `
       -Filter "servicePrincipalNames/any(n:n eq 'https://graph.microsoft.com')"
   ```

1. Find the delegated permission classification you wish to remove:

   ```powershell
   $classifications = Get-AzureADMSServicePrincipalDelegatedPermissionClassification `
       -ServicePrincipalId $api.ObjectId
   $classificationToRemove = $classifications | Where-Object {$_.PermissionName -eq "User.ReadBasic.All"}
   ```

1. Delete the permission classification:

   ```powershell
   Remove-AzureADMSServicePrincipalDelegatedPermissionClassification `
       -ServicePrincipalId $api.ObjectId `
       -Id $classificationToRemove.Id
   ```
:::zone-end

:::zone pivot="ms-powershell"

You can use [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started?preserve-view=true&view=graph-powershell-1.0), to classify permissions. Permission classifications are configured on the **ServicePrincipal** object of the API that publishes the permissions.

Run the following command to connect to Microsoft Graph PowerShell. To consent to the required scopes, sign in with one of the roles listed in the prerequisite section of this article.

```powershell
Connect-MgGraph -Scopes "Policy.ReadWrite.PermissionGrant".
```

### List current permission classifications for an API

1. Retrieve the servicePrincipal object for the API:

   ```powershell
   $api = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" 
   ```

1. Read the delegated permission classifications for the API:

   ```powershell
   Get-MgServicePrincipalDelegatedPermissionClassification -ServicePrincipalId $api.Id 
   ```

### Classify a permission as "Low impact" 

1. Retrieve the servicePrincipal object for the API:

   ```powershell
   $api = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" 
   ```

1. Find the delegated permission you would like to classify:

   ```powershell
   $delegatedPermission = $api.Oauth2PermissionScopes | Where-Object {$_.Value -eq "openid"} 
   ```

1. Set the permission classification:

   ```powershell
   $params = @{ 

   PermissionId = $delegatedPermission.Id 

   PermissionName = $delegatedPermission.Value 

   Classification = "Low" 

   } 

   New-MgServicePrincipalDelegatedPermissionClassification -ServicePrincipalId $api.Id -BodyParameter $params 
   ```

### Remove a delegated permission classification 

1. Retrieve the servicePrincipal object for the API:

   ```powershell
   $api = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" 
   ```

1. Find the delegated permission classification you wish to remove:

   ```powershell
   $classifications= Get-MgServicePrincipalDelegatedPermissionClassification -ServicePrincipalId $api.Id 

   $classificationToRemove = $classifications | Where-Object {$_.PermissionName -eq "openid"}
   ```

1. Delete the permission classification:

```powershell
Remove-MgServicePrincipalDelegatedPermissionClassification -DelegatedPermissionClassificationId $classificationToRemove.Id   -ServicePrincipalId $api.id 
``` 
:::zone-end

:::zone pivot="ms-graph"

To configure permissions classifications for an enterprise application, sign in to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) with one of the roles listed in the prerequisite section.

You need to consent to the `Policy.ReadWrite.PermissionGrant` permission.

Run the following queries on Microsoft Graph explorer to add a delegated permissions classification for an application.

1. List current permission classifications for an API.

   ```http
   GET https://graph.microsoft.com/v1.0/servicePrincipals(appId='00000003-0000-0000-c000-000000000000')/delegatedPermissionClassifications
   ```

1. Add a delegated permission classification for an API. In the following example, we classify the permission as "low impact".

   ```http
   POST https://graph.microsoft.com/v1.0/servicePrincipals(appId='00000003-0000-0000-c000-000000000000')/delegatedPermissionClassifications
   Content-type: application/json

   {
      "permissionId": "b4e74841-8e56-480b-be8b-910348b18b4c",
      "classification": "low"
   }
   ```

Run the following query on Microsoft Graph explorer to remove a delegated permissions classification for an API.

```http
DELETE https://graph.microsoft.com/v1.0/servicePrincipals(appId='00000003-0000-0000-c000-000000000000')/delegatedPermissionClassifications/QUjntFaOC0i-i5EDSLGLTAE
```

:::zone-end


## Next steps

- [Manage app consent policies](manage-app-consent-policies.md)
- [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md)