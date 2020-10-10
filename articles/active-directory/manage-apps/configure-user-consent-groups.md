---
title: Configure group owner consent to apps accessing group data using Azure AD
description: Learn manage whether group and team owners can consent to applications that will have access to the group or team's data.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 05/19/2020
ms.author: kenwith
ms.reviewer: arvindh, luleon, phsignor
---

# Configure group owner consent to apps accessing group data

Group and team owners can authorize applications, such as applications published by third-party vendors, to access your organization's data associated with a group. For example, a team owner in Microsoft Teams can allow an app to read all Teams messages in the team, or list the basic profile of a group's members. See [Resource-specific consent in Microsoft Teams](https://docs.microsoft.com/microsoftteams/resource-specific-consent) to learn more.

## Manage group owner consent to apps

You can configure which users are allowed to consent to apps accessing their groups' or teams' data, or you can disable this for all users.

# [Portal](#tab/azure-portal)

Follow these steps to manage group owner consent to apps accessing group data:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator).
2. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.
3. Under **Group owner consent for apps accessing data** select the option you'd like to enable.
4. Select **Save** to save your settings.

In this example, all group owners are allowed to consent to apps accessing their groups' data:

:::image type="content" source="media/configure-user-consent-groups/group-owner-consent.png" alt-text="Group owner consent settings":::

# [PowerShell](#tab/azure-powershell)

You can use the Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true), to enable or disable group owners' ability to consent to applications accessing your organization's data for the groups they own.

1. Make sure you're using the [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true) module. This step is important if you have installed both the [AzureAD](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0&preserve-view=true) module and the [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true) module).

    ```powershell
    Remove-Module AzureAD
    Import-Module AzureADPreview
    ```

1. Connect to Azure AD PowerShell.

   ```powershell
   Connect-AzureAD
   ```

1. Retrieve the current value for the **Consent Policy Settings** directory settings in your tenant. This requires checking if the directory settings for this feature have been created, and if not, using the values from the corresponding directory settings template.

    ```powershell
    $consentSettingsTemplateId = "dffd5d46-495d-40a9-8e21-954ff55e198a" # Consent Policy Settings
    $settings = Get-AzureADDirectorySetting -All $true | Where-Object { $_.TemplateId -eq $consentSettingsTemplateId }

    if (-not $settings) {
        $template = Get-AzureADDirectorySettingTemplate -Id $consentSettingsTemplateId
        $settings = $template.CreateDirectorySetting()
    }

    $enabledValue = $settings.Values | ? { $_.Name -eq "EnableGroupSpecificConsent" }
    $limitedToValue = $settings.Values | ? { $_.Name -eq "ConstrainGroupSpecificConsentToMembersOfGroupId" }
    ```

1. Understand the setting values. There are two settings values that define which users would be able to allow an app to access their group's data:

    | Setting       | Type         | Description  |
    | ------------- | ------------ | ------------ |
    | _EnableGroupSpecificConsent_   | Boolean | Flag indicating if groups owners are allowed to grant group-specific permissions. |
    | _ConstrainGroupSpecificConsentToMembersOfGroupId_ | Guid | If _EnableGroupSpecificConsent_ is set to "True" and this value set to a group's object ID, members of the identified group will be authorized to grant group-specific permissions to the groups they own. |

1. Update settings values for the desired configuration:

    ```powershell
    # Disable group-specific consent entirely
    $enabledValue.Value = "False"
    $limitedToValue.Value = ""
    ```

    ```powershell
    # Enable group-specific consent for all users
    $enabledValue.Value = "True"
    $limitedToValue.Value = ""
    ```

    ```powershell
    # Enable group-specific consent for users in a given group
    $enabledValue.Value = "True"
    $limitedToValue.Value = "{group-object-id}"
    ```

1. Save your settings.

    ```powershell
    if ($settings.Id) {
        # Update an existing directory settings
        Set-AzureADDirectorySetting -Id $settings.Id -DirectorySetting $settings
    } else {
        # Create a new directory settings to override the default setting 
        New-AzureADDirectorySetting -DirectorySetting $settings
    }
    ```

---

## Next steps

To learn more:

* [Configure user consent settings](configure-user-consent.md)
* [Configure the admin consent workflow](configure-admin-consent-workflow.md)
* [Learn how to manage consent to applications and evaluate consent requests](manage-consent-requests.md)
* [Grant tenant-wide admin consent to an application](grant-admin-consent.md)
* [Permissions and consent in the Microsoft identity platform](../develop/active-directory-v2-scopes.md)

To get help or find answers to your questions:
* [Azure AD on StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
