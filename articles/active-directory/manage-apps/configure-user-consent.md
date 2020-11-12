---
title: Configure how end-users consent to applications using Azure AD
description: Learn how to manage how and when users can consent to applications that will have access to your organization's data.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 06/01/2020
ms.author: kenwith
ms.reviewer: arvindh, luleon, phsignor
ms.custom: contperfq2
---

# Configure how end-users consent to applications

You can integrate your applications with the Microsoft identity platform to allow users to sign in with their work or school account and access your organization's data to deliver rich data-driven experiences.

Before an application can access your organization's data, a user must grant the application permissions to do so. Different permissions allow different levels of access. By default, all users are allowed to consent to applications for permissions that don't require administrator consent. For example, by default, a user can consent to allow an app to access their mailbox but can't consent to allow an app unfettered access to read and write to all files in your organization.

By allowing users to grant apps access to data, users can easily acquire useful applications and be productive. However, in some situations this configuration can represent a risk if it's not monitored and controlled carefully.

> [!IMPORTANT]
> To reduce the risk of malicious applications attempting to trick users into granting them access to your organization's data, we recommend that you allow user consent only for applications that have been published by a [verified publisher](../develop/publisher-verification-overview.md).

## User consent settings

App consent policies describe conditions which must be met before an app can be consented to. These policies may include conditions on the app requesting access, as well as the permissions the app is requesting.

By choosing which app consent policies apply for all users, you can set limits on when end-users are allowed to grant consent to apps, and when they will be required to request administrator review and approval:

* **Disable user consent** - Users cannot grant permissions to applications. Users can continue to sign in to apps they had previously consented to or which are consented to by administrators on their behalf, but they will not be allowed to consent to new permissions or to new apps on their own. Only users who have been granted a directory role that includes the permission to grant consent will be able to consent to new apps.

* **Users can consent to apps from verified publishers or your organization, but only for permissions you select** - All users can only consent to apps that were published by a [verified publisher](../develop/publisher-verification-overview.md) and apps that are registered in your tenant. Users can only consent to the permissions you have classified as "low impact". You must [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.

* **Users can consent to all apps** - This option allows all users to consent to any permission which doesn't require admin consent, for any application.

* **Custom app consent policy** - For even more options over the conditions governing when user consent, you can [create custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy), and configure those to apply for user consent.

# [Portal](#tab/azure-portal)

To configure user consent settings through the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator--company-administrator).
1. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.
1. Under **User consent for applications**, select which consent setting you'd like to configure for all users.
1. Select **Save** to save your settings.

:::image type="content" source="media/configure-user-consent/setting-for-all-users.png" alt-text="User consent settings":::

# [PowerShell](#tab/azure-powershell)

You can use the latest Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview&preserve-view=true), to choose which app consent policy governs user consent for applications.

#### Disable user consent

To disable user consent, set the consent policies which govern user consent to be empty:

  ```powershell
  Set-AzureADMSAuthorizationPolicy `
     -Id "authorizationPolicy" `
     -PermissionGrantPolicyIdsAssignedToDefaultUserRole @()
  ```

#### Allow user consent subject to an app consent policy

To allow user consent, choose which app consent policy should govern users' authorization to grant consent to apps:

  ```powershell
  Set-AzureADMSAuthorizationPolicy `
     -Id "authorizationPolicy" `
     -PermissionGrantPolicyIdsAssignedToDefaultUserRole @("managePermissionGrantsForSelf.{consent-policy-id}")
  ```

Replace `{consent-policy-id}` with the ID of the policy you'd like to apply. You can choose a [custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy) you have created, or you can choose from the following built-in policies:

| ID | Description |
|:---|:------------|
| microsoft-user-default-low | **Allow user consent for apps from verified publishers, for selected permissions**<br /> Allow limited user consent only for apps from verified publishers and apps registered in your tenant, and only for permissions that you classify as "Low impact". (Don't forget to [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.) |
| microsoft-user-default-legacy | **Allow user consent for apps**<br /> This option allows all users to consent to any permission which doesn't require admin consent, for any application |
  
For example, to enable user consent subject to the built-in policy `microsoft-user-default-low`:

```powershell
Set-AzureADMSAuthorizationPolicy `
   -Id "authorizationPolicy" `
   -PermissionGrantPolicyIdsAssignedToDefaultUserRole @("managePermissionGrantsForSelf.microsoft-user-default-low")
```

---

> [!TIP]
> [Enable the admin consent workflow](configure-admin-consent-workflow.md) to allow users to request an administrator's review and approval of an application that the user is not allowed to consent to—for example, when user consent has been disabled or when an application is requesting permissions that the user is not allowed to grant.

## Risk-based step-up consent

Risk-based step-up consent helps reduce user exposure to malicious apps that make [illicit consent requests](https://docs.microsoft.com/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants). If Microsoft detects a risky end-user consent request, the request will require a "step-up" to admin consent instead. This capability is enabled by default, but it will only result in a behavior change when end-user consent is enabled.

When a risky consent request is detected, the consent prompt will display a message indicating that admin approval is needed. If the [admin consent request workflow](configure-admin-consent-workflow.md) is enabled, the user can send the request to an admin for further review directly from the consent prompt. If it's not enabled, the following message will be displayed:

* **AADSTS90094:** &lt;clientAppDisplayName&gt; needs permission to access resources in your organization that only an admin can grant. Please ask an admin to grant permission to this app before you can use it.

In this case, an audit event will also be logged with a Category of "ApplicationManagement", Activity Type of "Consent to application",  and Status Reason of "Risky application detected".

> [!IMPORTANT]
> Admins should [evaluate all consent requests](manage-consent-requests.md#evaluating-a-request-for-tenant-wide-admin-consent) carefully before approving a request, especially when Microsoft has detected risk.

### Disable or re-enable risk-based step-up consent using PowerShell

You can use the Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true), to disable the step-up to admin consent required in cases where Microsoft detects risk or to re-enable it if it was previously disabled.

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

    $riskBasedConsentEnabledValue = $settings.Values | ? { $_.Name -eq "BlockUserConsentForRiskyApps" }
    ```

1. Understand the settings value:

    | Setting       | Type         | Description  |
    | ------------- | ------------ | ------------ |
    | _BlockUserConsentForRiskyApps_   | Boolean |  Flag indicating if user consent will be blocked when a risky request is detected. |

1. Update settings value for the desired configuration:

    ```powershell
    # Disable risk-based step-up consent entirely
    $riskBasedConsentEnabledValue.Value = "False"
    ```

    ```powershell
    # Re-enable risk-based step-up consent, if disabled previously
    $riskBasedConsentEnabledValue.Value = "True"
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

## Next steps

To learn more:

* [Configure user consent settings](configure-user-consent.md)
* [Manage app consent policies](manage-app-consent-policies.md)
* [Configure the admin consent workflow](configure-admin-consent-workflow.md)
* [Learn how to manage consent to applications and evaluate consent requests](manage-consent-requests.md)
* [Grant tenant-wide admin consent to an application](grant-admin-consent.md)
* [Permissions and consent in the Microsoft identity platform](../develop/active-directory-v2-scopes.md)

To get help or find answers to your questions:
* [Azure AD on StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
