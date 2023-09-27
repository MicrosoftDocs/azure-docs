---
title: Configure risk-based step-up consent
description: Learn how to disable and enable risk-based step-up consent to reduce user exposure to malicious apps that make illicit consent requests.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 11/17/2021
ms.author: jomondi
ms.reviewer: phsignor
ms.custom: contperf-fy21q2, enterprise-apps, has-azure-ad-ps-ref
#customer intent: As an admin, I want to configure risk-based step-up consent.
---
# Configure risk-based step-up consent using PowerShell

In this article, you'll learn how to configure risk-based step-up consent in Microsoft Entra ID. Risk-based step-up consent helps reduce user exposure to malicious apps that make [illicit consent requests](/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants). 

For example, consent requests for newly registered multi-tenant apps that are not [publisher verified](../develop/publisher-verification-overview.md) and require non-basic permissions are considered risky. If a risky user consent request is detected, the request requires a "step-up" to admin consent instead. This step-up capability is enabled by default, but it results in a behavior change only when user consent is enabled.

When a risky consent request is detected, the consent prompt displays a message that indicates that admin approval is needed. If the [admin consent request workflow](configure-admin-consent-workflow.md) is enabled, the user can send the request to an admin for further review directly from the consent prompt. If the admin consent request workflow isn't enabled, the following message is displayed:

> **AADSTS90094**: \<clientAppDisplayName> needs permission to access resources in your organization that only an admin can grant. Request an admin to grant permission to this app before you can use it.

In this case, an audit event is also logged with a category of "ApplicationManagement," an activity type of "Consent to application,"  and a status reason of "Risky application detected."

## Prerequisites

To configure risk-based step-up consent, you need:

- A user account. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Global Administrator role or a Privileged Administrator role.

## Disable or re-enable risk-based step-up consent

You can use the Azure AD PowerShell Preview module, [AzureADPreview](/powershell/module/azuread/?preserve-view=true&view=azureadps-2.0-preview), to disable the step-up to admin consent that's required in cases where a risk is detected, or to enable it if it was previously disabled.

> [!IMPORTANT]
> Make sure you're using the AzureADPreview module. This is important if you've installed both the [`AzureAD`](/powershell/module/azuread/?preserve-view=true&view=azureadps-2.0) module and the `AzureADPreview` module.
1. Run the following commands:

    ```powershell
    Remove-Module AzureAD
    Import-Module AzureADPreview
    ```

1. Connect to Azure AD PowerShell:

   ```powershell
   Connect-AzureAD
   ```

1. Retrieve the current value for the **Consent Policy Settings** directory settings in your tenant. Doing so requires checking to see whether the directory settings for this feature have been created. If they haven't been created, use the values from the corresponding directory settings template.

    ```powershell
    $consentSettingsTemplateId = "dffd5d46-495d-40a9-8e21-954ff55e198a" # Consent Policy Settings
    $settings = Get-AzureADDirectorySetting -All $true | Where-Object { $_.TemplateId -eq $consentSettingsTemplateId }
    if (-not $settings) {
        $template = Get-AzureADDirectorySettingTemplate -Id $consentSettingsTemplateId
        $settings = $template.CreateDirectorySetting()
    }
    $riskBasedConsentEnabledValue = $settings.Values | ? { $_.Name -eq "BlockUserConsentForRiskyApps" }
    ```

1. Understand the settings value:

    | Setting       | Type         | Description  |
    | ------------- | ------------ | ------------ |
    | _BlockUserConsentForRiskyApps_   | Boolean |  A flag indicating whether user consent will be blocked when a risky request is detected. |

1. Update the settings value for the desired configuration:

    ```powershell
    # Disable risk-based step-up consent entirely
    $riskBasedConsentEnabledValue.Value = "False"
    ```

    ```powershell
    # Re-enable risk-based step-up consent, if disabled previously
    $riskBasedConsentEnabledValue.Value = "True"
    ```

1. Save your settings:

    ```powershell
    if ($settings.Id) {
        # Update an existing directory settings
        Set-AzureADDirectorySetting -Id $settings.Id -DirectorySetting $settings
    } else {
        # Create a new directory settings to override the default setting 
        New-AzureADDirectorySetting -DirectorySetting $settings
    }
    ```

## Next steps

- [Manage app consent policies](manage-app-consent-policies.md)
- [Configure the admin consent workflow](configure-admin-consent-workflow.md)
