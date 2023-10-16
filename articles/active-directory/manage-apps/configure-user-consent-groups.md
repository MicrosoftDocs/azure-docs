---
title: Configure group owner consent to apps accessing group data
description: Manage group and team owners consent to applications that should be granted access to the group or team's data.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 08/25/2023
ms.author: jomondi
ms.reviewer: phsignor, yuhko, ergreenl
ms.custom: contperf-fy21q2, enterprise-apps
zone_pivot_groups: enterprise-apps-minus-former-powershell

#customer intent: As an admin, I want to configure group owner consent to apps accessing group data using Microsoft Entra ID
---

# Configure group and team owner consent to applications

In this article, you'll learn how to configure the way group and team owners consent to applications and how to disable all future group and team owners' consent operations to applications.

Group and team owners can authorize applications, such as applications published by third-party vendors, to access your organization's data associated with a group. For example, a team owner in Microsoft Teams can allow an app to read all Teams messages in the team, or list the basic profile of a group's members. See [Resource-specific consent in Microsoft Teams](/microsoftteams/resource-specific-consent) to learn more.

Group owner consent can be managed in two separate ways: through Microsoft Entra admin center and creation of app consent policies. In the Microsoft Entra admin center, you can enable all groups owner, enable selected group owner, or disable group owners' ability to give consent to applications. On the other hand, app consent policies enable you to specify which app consent policy governs the group owner consent for applications. You then have the flexibility to assign either a Microsoft built-in policy or create your own custom policy to effectively manage the consent process for group owners.

Before creating the app consent policy to manage your group owner consent, you need to disable the group owner consent setting through the Microsoft Entra admin center. Disabling this setting allows for group owner consent subject to app consent policies. You can learn how to disable the group owner consent setting in various ways in this article. Learn more about [managing group owner consent by app consent policies](manage-group-owner-consent-policies.md) tailored to your needs. 

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Prerequisites

To configure group and team owner consent, you need:

- A user account. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Global Administrator role.

## Manage group owner consent to apps by directory settings

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You can configure which users are allowed to consent to apps accessing their groups' or teams' data, or you can disable the setting for all users.

:::zone pivot="portal"

To configure group and team owner consent settings through the Microsoft Entra admin center:

Follow these steps to manage group owner consent to apps accessing group data:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.
3. Under **Group owner consent for apps accessing data** select the option you'd like to enable.
4. Select **Save** to save your settings.

In this example, all group owners are allowed to consent to apps accessing their groups' data:

:::image type="content" source="media/configure-user-consent-groups/group-owner-consent.png" alt-text="Group owner consent settings":::
:::zone-end

:::zone pivot="ms-powershell"

You can use the [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started?view=graph-powershell-1.0&preserve-view=true) module to enable or disable group owners' ability to consent to applications accessing your organization's data for the groups they own. The cmdlets in this section are part of the [Microsoft.Graph.Identity.SignIns](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.SignIns) module.

### Connect to Microsoft Graph PowerShell

Connect to Microsoft Graph PowerShell and sign in as a [global administrator](../roles/permissions-reference.md#global-administrator). For reading the current user consent settings, use `Policy.Read.All` permission. For reading and changing the user consent settings, use `Policy.ReadWrite.Authorization` permission.

change the profile to beta by using the `Select-MgProfile` command
```powershell
Select-MgProfile -Name "beta"
```
Use the least-privilege permission
```powershell
Connect-MgGraph -Scopes "Policy.ReadWrite.Authorization"

# If you need to create a new setting based on the templates, please use this permission
Connect-MgGraph -Scopes "Directory.ReadWrite.All"
```

### Retrieve the current setting through directory settings

Retrieve the current value for the **Consent Policy Settings** directory settings in your tenant. This requires checking if the directory settings for this feature have been created, and if not, using the values from the corresponding directory settings template.

```powershell
$consentSettingsTemplateId = "dffd5d46-495d-40a9-8e21-954ff55e198a" # Consent Policy Settings
$settings = Get-MgDirectorySetting | ?{ $_.TemplateId -eq $consentSettingsTemplateId }

if (-not $settings) {
    $template = Get-MgDirectorySettingTemplate -DirectorySettingTemplateId $consentSettingsTemplateId
    $body = @{
                "templateId" = $template.Id
                "values" = @(
                    @{
                        "name" = "EnableGroupSpecificConsent"
                        "value" = $true
                    },
                    @{
                        "name" = "BlockUserConsentForRiskyApps"
                        "value" = $true
                    },
                    @{
                        "name" = "EnableAdminConsentRequests"
                        "value" = $true
                    },
                    @{
                        "name" = "ConstrainGroupSpecificConsentToMembersOfGroupId"
                        "value" = ""
                    }
                )
    }
    $settings = New-MgDirectorySetting -BodyParameter $body
}

$enabledValue = $settings.Values | ? { $_.Name -eq "EnableGroupSpecificConsent" }
$limitedToValue = $settings.Values | ? { $_.Name -eq "ConstrainGroupSpecificConsentToMembersOfGroupId" }
```
    
### Understand the setting values

There are two settings values that define which users would be able to allow an app to access their group's data:

| Setting       | Type         | Description  |
| ------------- | ------------ | ------------ |
| _EnableGroupSpecificConsent_   | Boolean | Flag indicating if groups owners are allowed to grant group-specific permissions. |
| _ConstrainGroupSpecificConsentToMembersOfGroupId_ | Guid | If _EnableGroupSpecificConsent_ is set to "True" and this value set to a group's object ID, members of the identified group will be authorized to grant group-specific permissions to the groups they own. |

### Update settings values for the desired configuration

```powershell
# Disable group-specific consent entirely
$enabledValue.Value = "false"
$limitedToValue.Value = ""
```

```powershell
# Enable group-specific consent for all users
$enabledValue.Value = "true"
$limitedToValue.Value = ""
```

```powershell
# Enable group-specific consent for users in a given group
$enabledValue.Value = "true"
$limitedToValue.Value = "{group-object-id}"
```

### Save your settings

```powershell
# Update an existing directory settings
Update-MgDirectorySetting -DirectorySettingId $settings.Id -Values $settings.Values
```

:::zone-end

:::zone pivot="ms-graph"

To manage group and team owner consent settings through directory setting using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer):

You need to sign in as a [global administrator](../roles/permissions-reference.md#global-administrator). For reading the current user consent settings, consent to `Policy.Read.All` permission. For reading and changing the user consent settings, consent to `Policy.ReadWrite.Authorization` permission.

### Retrieve the current setting through directory settings

Retrieve the current value for the **Consent Policy Settings** from directory settings in your tenant. This requires checking if the directory settings for this feature have been created, and if not, using the second Microsoft Graph call to create the corresponding directory settings.
```http
GET https://graph.microsoft.com/beta/settings
```
Response

``` http
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#settings",
    "value": [
        {
            "id": "{ directorySettingId }",
            "displayName": "Consent Policy Settings",
            "templateId": "dffd5d46-495d-40a9-8e21-954ff55e198a",
            "values": [
            {
                    "name": "EnableGroupSpecificConsent",
                    "value": "true"
                },
                {
                    "name": "BlockUserConsentForRiskyApps",
                    "value": "true"
                },
                {
                    "name": "EnableAdminConsentRequests",
                    "value": "true"
                },
                {
                    "name": "ConstrainGroupSpecificConsentToMembersOfGroupId",
                    "value": ""
                }
            ]
        }
    ]
}
```


create the corresponding directory settings if the `value` is empty (see below as an example).
```http
GET https://graph.microsoft.com/beta/settings

{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#settings",
    "value": []
}
```


```http
POST https://graph.microsoft.com/beta/settings
{
    "templateId": "dffd5d46-495d-40a9-8e21-954ff55e198a",
    "values": [
        {
            "name": "EnableGroupSpecificConsent",
            "value": "true"
        },
        {
            "name": "BlockUserConsentForRiskyApps",
            "value": "true"
        },
        {
            "name": "EnableAdminConsentRequests",
            "value": "true"
        },
        {
            "name": "ConstrainGroupSpecificConsentToMembersOfGroupId",
            "value": ""
        }
    ]
}
```
### Understand the setting values

There are two settings values that define which users would be able to allow an app to access their group's data:

| Setting       | Type         | Description  |
| ------------- | ------------ | ------------ |
| _EnableGroupSpecificConsent_   | Boolean | Flag indicating if groups owners are allowed to grant group-specific permissions. |
| _ConstrainGroupSpecificConsentToMembersOfGroupId_ | Guid | If _EnableGroupSpecificConsent_ is set to "True" and this value set to a group's object ID, members of the identified group will be authorized to grant group-specific permissions to the groups they own. |

### Update settings values for the desired configuration

Replace `{directorySettingId}` with the actual ID in the `value` collection when retrieving the current setting

Disable group-specific consent entirely
```http
PATCH https://graph.microsoft.com/beta/settings/{directorySettingId}
{
    "values": [
        {
            "name": "EnableGroupSpecificConsent",
            "value": "false"
        },
        {
            "name": "BlockUserConsentForRiskyApps",
            "value": "true"
        },
        {
            "name": "EnableAdminConsentRequests",
            "value": "true"
        },
        {
            "name": "ConstrainGroupSpecificConsentToMembersOfGroupId",
            "value": ""
        }
    ]
}
```

Enable group-specific consent for all users
```http
PATCH https://graph.microsoft.com/beta/settings/{directorySettingId}
{
    "values": [
        {
            "name": "EnableGroupSpecificConsent",
            "value": "true"
        },
        {
            "name": "BlockUserConsentForRiskyApps",
            "value": "true"
        },
        {
            "name": "EnableAdminConsentRequests",
            "value": "true"
        },
        {
            "name": "ConstrainGroupSpecificConsentToMembersOfGroupId",
            "value": ""
        }
    ]
}
```
Enable group-specific consent for users in a given group
```http
PATCH https://graph.microsoft.com/beta/settings/{directorySettingId}
{
    "values": [
        {
            "name": "EnableGroupSpecificConsent",
            "value": "true"
        },
        {
            "name": "BlockUserConsentForRiskyApps",
            "value": "true"
        },
        {
            "name": "EnableAdminConsentRequests",
            "value": "true"
        },
        {
            "name": "ConstrainGroupSpecificConsentToMembersOfGroupId",
            "value": "{group-object-id}"
        }
    ]
}
```
:::zone-end

> [!NOTE]
> **User can consent to apps accessing company data on their behalf** setting, when turned off, doesn't disable the **Users can consent to apps accessing company data for groups they own** option.

## Manage group owner consent to apps by app consent policy

You can configure which users are allowed to consent to apps accessing their groups' or teams' data through app consent policies. To allow group owner consent subject to app consent policies, the group owner consent setting must be disabled. Once disabled, your current policy is read from app consent policies.

:::zone pivot="ms-powershell"

To choose which app consent policy governs user consent for applications, you can use the [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started?view=graph-powershell-1.0&preserve-view=true) module. The cmdlets used here are included in the [Microsoft.Graph.Identity.SignIns](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.SignIns) module.

### Connect to Microsoft Graph PowerShell

Connect to Microsoft Graph PowerShell using the least-privilege permission needed. For reading the current user consent settings, use *Policy.Read.All*. For reading and changing the user consent settings, use *Policy.ReadWrite.Authorization*.

```powershell
# change the profile to beta by using the `Select-MgProfile` command
Select-MgProfile -Name "beta"
```
```powershell
Connect-MgGraph -Scopes "Policy.ReadWrite.Authorization"
```

### Disable group owner consent to use app consent policies

1. Check if the `ManagePermissionGrantPoliciesForOwnedResource` is scoped in `group`

    1. Retrieve the current value for the group owner consent setting 
    ```powershell
      Get-MgPolicyAuthorizationPolicy | select -ExpandProperty DefaultUserRolePermissions | ft PermissionGrantPoliciesAssigned
    ```
    If `ManagePermissionGrantPoliciesForOwnedResource` is returned in `PermissionGrantPoliciesAssigned`, your group owner consent setting **might** have been governed by the app consent policy.

    1. Check if the policy is scoped to `group` 
    ```powershell
        Get-MgPolicyPermissionGrantPolicy -PermissionGrantPolicyId {"microsoft-all-application-permissions-for-group"} | ft AdditionalProperties
    ```
    If `resourceScopeType` == `group`, your group owner consent setting **has been** governed by the app consent policy.

1. To disable group owner consent to utilize app consent policies, ensure that the consent policies (`PermissionGrantPoliciesAssigned`) include the current `ManagePermissionGrantsForSelf.*` policy and other current `ManagePermissionGrantsForOwnedResource.*` policies if any that aren't applicable to groups while updating the collection. This way, you can maintain your current configuration for user consent settings and other resource consent settings.

```powershell
# only exclude policies that are scoped in group
$body = @{
    "permissionGrantPolicyIdsAssignedToDefaultUserRole" = @(
        "managePermissionGrantsForSelf.{current-policy-for-user-consent}",
        "managePermissionGrantsForOwnedResource.{other-policies-that-are-not-applicable-to-groups}" 
    )
}
Update-MgPolicyAuthorizationPolicy -AuthorizationPolicyId authorizationPolicy -BodyParameter $body

```

### Assign an app consent policy to group owners 

To allow group owner consent subject to an app consent policy, choose which app consent policy should govern group owners' authorization to grant consent to apps. Ensure that the consent policies (`PermissionGrantPoliciesAssigned`) include the current `ManagePermissionGrantsForSelf.*` policy and other `ManagePermissionGrantsForOwnedResource.*` policies if any while updating the collection. This way, you can maintain your current configuration for user consent settings and other resource consent settings.

```powershell
$body = @{
    "permissionGrantPolicyIdsAssignedToDefaultUserRole" = @(
        "managePermissionGrantsForSelf.{current-policy-for-user-consent}",
        "managePermissionGrantsForOwnedResource.{other-policies-that-are-not-applicable-to-groups}",
        "managePermissionGrantsForOwnedResource.{app-consent-policy-id-for-group}" #new app consent policy for groups
    )
}
Update-MgPolicyAuthorizationPolicy -AuthorizationPolicyId authorizationPolicy -BodyParameter $body
```

Replace `{app-consent-policy-id-for-group}` with the ID of the policy you want to apply. You can choose a [custom app consent policy](manage-group-owner-consent-policies.md#create-a-custom-group-owner-consent-policy) that you've created, or you can choose from the following built-in policies:

| ID | Description |
|:---|:------------|
| microsoft-pre-approval-apps-for-group | **Allow group owner consent to pre-approved apps only**<br/> Allow group owners consent only for apps preapproved by admins for the groups they own.  |
| microsoft-all-application-permissions-for-group | **Allow group owner consent to apps**<br/> This option allows all group owners to consent to any permission that doesn't require admin consent, for any application, for the groups they own. It includes apps that have been preapproved by permission grant preapproval policy for group resource-specific-consent.  |

For example, to enable group owner consent subject to the built-in policy `microsoft-all-application-permissions-for-group`, run the following commands:

```powershell
$body = @{
    "permissionGrantPolicyIdsAssignedToDefaultUserRole" = @(
        "managePermissionGrantsForSelf.{current-policy-for-user-consent}",
        "managePermissionGrantsForOwnedResource.{all-policies-that-are-not-applicable-to-groups}",
        "managePermissionGrantsForOwnedResource.{microsoft-all-application-permissions-for-group}" # policy that is be scoped to group
    )
}
Update-MgPolicyAuthorizationPolicy -AuthorizationPolicyId authorizationPolicy -BodyParameter $body
```

:::zone-end

:::zone pivot="ms-graph"

Use the [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to choose which group owner consent policy governs user consent group owners' ability to consent to applications accessing your organization's data for the groups they own.

### Disable group owner consent to use app consent policies

1. Check if the `ManagePermissionGrantPoliciesForOwnedResource` is scoped in `group`

    1. Retrieve the current value for the group owner consent setting 
    ```http
    GET https://graph.microsoft.com/v1.0/policies/authorizationPolicy
    ```
    If `ManagePermissionGrantsForOwnedResource` is returned in `permissionGrantPolicyIdsAssignedToDefaultUserRole`, your group owner consent setting might have been governed by the app consent policy.

    2.Check if the policy is scoped to `group` 
    ```http
    GET https://graph.microsoft.com/beta/policies/permissionGrantPolicies/{microsoft-all-application-permissions-for-group}
    ```
    If `resourceScopeType` == `group`, your group owner consent setting has been governed by the app consent policy.

2. To disable group owner consent to utilize app consent policies, ensure that the consent policies (`PermissionGrantPoliciesAssigned`) include the current `ManagePermissionGrantsForSelf.*` policy and other current `ManagePermissionGrantsForOwnedResource.*` policies if any that aren't applicable to groups. This way, you can maintain your current configuration for user consent settings and other resource consent settings.
   ```http
   PATCH https://graph.microsoft.com/beta/policies/authorizationPolicy
   {
       "defaultUserRolePermissions": {
           "permissionGrantPoliciesAssigned": [
               "managePermissionGrantsForSelf.{current-policy-for-user-consent}",
               "managePermissionGrantsForOwnedResource.{other-policies-that-are-not-applicable-to-groups}"
            ]
        }
    }
   ```

### Assign an app consent policy to group owners 

To allow group owner consent subject to an app consent policy, choose which app consent policy should govern group owners' authorization to grant consent to apps. Ensure that the consent policies (`PermissionGrantPoliciesAssigned`) include the current `ManagePermissionGrantsForSelf.*` policy and other current `ManagePermissionGrantsForOwnedResource.*` policies if any while updating the collection. This way, you can maintain your current configuration for user consent settings and other resource consent settings.

```http
PATCH https://graph.microsoft.com/v1.0/policies/authorizationPolicy

{
    "defaultUserRolePermissions": {
        "managePermissionGrantsForSelf.{current-policy-for-user-consent}",
        "managePermissionGrantsForOwnedResource.{other-policies-that-are-not-applicable-to-groups}",
        "managePermissionGrantsForOwnedResource.{app-consent-policy-id-for-group}"
   }
}
```

Replace `{app-consent-policy-id-for-group}` with the ID of the policy you want to apply for groups. You can choose a [custom app consent policy for groups](manage-group-owner-consent-policies.md) that you've created, or you can choose from the following built-in policies:

| ID | Description |
|:---|:------------|
| microsoft-pre-approval-apps-for-group | **Allow group owner consent to pre-approved apps only**<br/> Allow group owners consent only for apps preapproved by admins for the groups they own.  |
| microsoft-all-application-permissions-for-group | **Allow group owner consent to apps**<br/> This option allows all group owners to consent to any permission that doesn't require admin consent, for any application, for the groups they own. It includes apps that have been preapproved by permission grant preapproval policy for group resource-specific-consent.  |

For example, to enable group owner consent subject to the built-in policy `microsoft-pre-approval-apps-for-group`, use the following PATCH command:

```http
PATCH https://graph.microsoft.com/v1.0/policies/authorizationPolicy

{
    "defaultUserRolePermissions": {
        "permissionGrantPoliciesAssigned": [
            "managePermissionGrantsForSelf.{current-policy-for-user-consent}",
            "managePermissionGrantsForOwnedResource.{other-policies-that-are-not-applicable-to-groups}",
            "managePermissionGrantsForOwnedResource.microsoft-pre-approval-apps-for-group"
        ]
    }
}
```
:::zone-end

## Next steps

- [Manage group owner consent policies](manage-group-owner-consent-policies.md)

To get help or find answers to your questions:

- [Microsoft Entra ID on Microsoft Q&A](/answers/topics/azure-active-directory.html)
