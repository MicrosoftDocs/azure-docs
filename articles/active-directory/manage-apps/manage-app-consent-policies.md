---
title: Manage app consent policies
description: Learn how to manage built-in and custom app consent policies to control when consent can be granted.
services: active-directory
author: yuhko-msft
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/02/2021
ms.author: yuhko
ms.reviewer: phsignor
ms.custom: contperf-fy21q2

#customer intent: As an admin, I want to manage app consent policies for enterprise applications in Azure AD
---

# Manage app consent policies

With [Microsoft Graph](/graph/overview) and [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started?view=graph-powershell-1.0&preserve-view=true), you can view and manage app consent policies.

An app consent policy consists of one or more "include" condition sets and zero or more "exclude" condition sets. For an event to be considered in an app consent policy, it must match *at least* one "include" condition set, and must not match *any* "exclude" condition set.

Each condition set consists of several conditions. For an event to match a condition set, *all* conditions in the condition set must be met.

App consent policies where the ID begins with "microsoft-" are built-in policies. Some of these built-in policies are used in existing built-in directory roles. For example, the `microsoft-application-admin` app consent policy describes the conditions under which the Application Administrator and Cloud Application Administrator roles are allowed to grant tenant-wide admin consent. Built-in policies can be used in custom directory roles and to configure user consent settings, but cannot be edited or deleted.

## Pre-requisites

1. A user or service with one of the following:
   - Global Administrator directory role
   - Privileged Role Administrator directory role
   - A custom directory role with the necessary [permissions to manage app consent policies](../roles/custom-consent-permissions.md#managing-app-consent-policies)
   - The Microsoft Graph app role (application permission) Policy.ReadWrite.PermissionGrant (when connecting as an app or a service)
   
1. Connect to [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started?view=graph-powershell-1.0&preserve-view=true).

   ```powershell
   Connect-MgGraph -Scopes "Policy.ReadWrite.PermissionGrant"
   ```

## List existing app consent policies

It's a good idea to start by getting familiar with the existing app consent policies in your organization:

1. List all app consent policies:

   ```powershell
   Get-MgPolicyPermissionGrantPolicy | ft Id, DisplayName, Description
   ```

1. View the "include" condition sets of a policy:

    ```powershell
    Get-MgPolicyPermissionGrantPolicyInclude -PermissionGrantPolicyId "microsoft-application-admin" | fl
    ```

1. View the "exclude" condition sets:

    ```powershell
    Get-MgPolicyPermissionGrantPolicyExclude -PermissionGrantPolicyId "microsoft-application-admin" | fl
    ```

## Create a custom app consent policy

Follow these steps to create a custom app consent policy:

1. Create a new empty app consent policy.

   ```powershell
   New-MgPolicyPermissionGrantPolicy `
       -Id "my-custom-policy" `
       -DisplayName "My first custom consent policy" `
       -Description "This is a sample custom app consent policy."
   ```

1. Add "include" condition sets.

   ```powershell
   # Include delegated permissions classified "low", for apps from verified publishers
   New-MgPolicyPermissionGrantPolicyInclude `
       -PermissionGrantPolicyId "my-custom-policy" `
       -PermissionType "delegated" `
       -PermissionClassification "low" `
       -ClientApplicationsFromVerifiedPublisherOnly
   ```

   Repeat this step to add additional "include" condition sets.

1. Optionally, add "exclude" condition sets.

   ```powershell
   # Retrieve the service principal for the Azure Management API
   $azureApi = Get-MgServicePrincipal -Filter "servicePrincipalNames/any(n:n eq 'https://management.azure.com/')"

   # Exclude delegated permissions for the Azure Management API
   New-MgPolicyPermissionGrantPolicyExclude `
       -PermissionGrantPolicyId "my-custom-policy" `
       -PermissionType "delegated" `
       -ResourceApplication $azureApi.AppId
   ```

   Repeat this step to add additional "exclude" condition sets.

Once the app consent policy has been created, you can [allow user consent](configure-user-consent.md?tabs=azure-powershell#allow-user-consent-subject-to-an-app-consent-policy) subject to this policy.

## Delete a custom app consent policy

1. The following shows how you can delete a custom app consent policy. **This action cannot be undone.**

   ```powershell
   Remove-MgPolicyPermissionGrantPolicy -PermissionGrantPolicyId "my-custom-policy"
   ```

> [!WARNING]
> Deleted app consent policies cannot be restored. If you accidentally delete a custom app consent policy, you will need to re-create the policy.

---

### Supported conditions

The following table provides the list of supported conditions for app consent policies.

| Condition | Description|
|:---------------|:----------|
| PermissionClassification | The [permission classification](configure-permission-classifications.md) for the permission being granted, or "all" to match with any permission classification (including permissions which are not classified). Default is "all". |
| PermissionType | The permission type of the permission being granted. Use "application" for application permissions (e.g. app roles) or "delegated" for delegated permissions. <br><br>**Note**: The value "delegatedUserConsentable" indicates delegated permissions which have not been configured by the API publisher to require admin consent—this value may be used in built-in permission grant policies, but cannot be used in custom permission grant policies. Required. |
| ResourceApplication | The **AppId** of the resource application (e.g. the API) for which a permission is being granted, or "any" to match with any resource application or API. Default is "any". |
| Permissions | The list of permission IDs for the specific permissions to match with, or a list with the single value "all" to match with any permission. Default is the single value "all". <ul><li>Delegated permission IDs can be found in the **OAuth2Permissions** property of the API's ServicePrincipal object.</li><li>Application permission IDs can be found in the **AppRoles** property of the API's ServicePrincipal object.</li></ol> |
| ClientApplicationIds | A list of **AppId** values for the client applications to match with, or a list with the single value "all" to match any client application. Default is the single value "all". |
| ClientApplicationTenantIds | A list of Azure Active Directory tenant IDs in which the client application is registered, or a list with the single value "all" to match with client apps registered in any tenant. Default is the single value "all". |
| ClientApplicationPublisherIds | A list of Microsoft Partner Network (MPN) IDs for [verified publishers](../develop/publisher-verification-overview.md) of the client application, or a list with the single value "all" to match with client apps from any publisher. Default is the single value "all". |
| ClientApplicationsFromVerifiedPublisherOnly | Set this switch to only match on client applications with a [verified publishers](../develop/publisher-verification-overview.md). Disable this switch (`-ClientApplicationsFromVerifiedPublisherOnly:$false`) to match on any client app, even if it does not have a verified publisher. Default is `$false`. |

## Next steps

To learn more:

* [Manage app consent policies using Microsoft Graph](/graph/api/resources/permissiongrantpolicy)
* [Configure user consent settings](configure-user-consent.md)
* [Configure the admin consent workflow](configure-admin-consent-workflow.md)
* [Learn how to manage consent to applications and evaluate consent requests](manage-consent-requests.md)
* [Grant tenant-wide admin consent to an application](grant-admin-consent.md)
* [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md)

To get help or find answers to your questions:

* [Azure AD on Microsoft Q&A](/answers/products/)
