---
title: Configure how end-users consent to applications using Azure AD
description: Learn how to manage how and when users can consent to applications that will have access to your organization's data.
services: active-directory
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 10/22/2018
ms.author: mimart
ms.reviewer: arvindh
ms.collection: M365-identity-device-management
---

# Configure how end-users consent to applications

Applications can integrate with the Microsoft Identity platform to allow users to sign in using their work or school account in Azure Active Directory (Azure AD), and to access your organization's data to deliver rich data-driven experiences. Different permissions allow the application different level of access to your users' and your organization's data.

By default, users can consent to applications accessing your organization's data, although only for some permissions. For example, by default a user can consent to allow an app to access their own mailbox or the Teams conversations for a team the user owns, but cannot consent to allow an app unattended access to read and write to all SharePoint sites in your organization. While allowing users to consent by themselves does allow users to easily acquire useful applications that integrate with Microsoft 365, Azure and other services, it can represent a risk if not used and monitored carefully.

Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. If user consent is disabled, previous consent grants will still be honored but all future consent operations must be performed by an administrator. Tenant-wide admin consent can be requested by users through an integrated [admin consent request workflow](configure-admin-consent-workflow.md) or through your own support processes. See [Five steps to securing your identity infrastructure](../../security/fundamentals/steps-secure-identity.md) for more details.

## Configure user consent to applications
### Disable or enable user consent from the Azure portal

You can use the Azure portal to disable or enable users' ability to consent to applications accessing your organization's data:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator).
2. Select **Azure Active Directory**, then **Enterprise applications**, then **User settings**.
3. Enable or disable user consent with the control labeled **Users can consent to apps accessing company data on their behalf**.
4. (Optional) Configure [admin consent request workflow](configure-admin-consent-workflow.md) to ensure users who aren't allowed to consent to an app can request approval.

> [!TIP]
> To allow users to request an administrator's review of an application that the user is not allowed to consent to (for example, because user consent has been disabled, or because the application is requesting permissions that the user is not allowed to grant), consider [configuring the admin consent workflow](configure-admin-consent-workflow.md).

### Disable or enable user consent using PowerShell

You can use the Azure AD PowerShell v1 module ([MSOnline](https://docs.microsoft.com/powershell/module/msonline/?view=azureadps-1.0)), to enable or disable users' ability to consent to applications accessing your organization's data.

1. Sign in to your organization by running this cmdlet:

    ```powershell
    Connect-MsolService
    ```

2. Check if user consent is enabled by running this cmdlet:

    ```powershell
    Get-MsolCompanyInformation | Format-List UsersPermissionToUserConsentToAppEnabled
    ```

3. Enable or disable user consent. For example, to disable user consent, run this cmdlet:

    ```powershell
    Set-MsolCompanySettings -UsersPermissionToUserConsentToAppEnabled $false
    ```

## Configure group owner consent to apps accessing group data

> [!IMPORTANT]
> The following information is for an upcoming feature which will allow group owners to grant applications access to their groups' data. When this capability is released, it will be enabled by default. Although this feature is not yet released widely, you can use these instructions to disable the capability in advance of its release.

Group owners can authorize applications (for example, applications published by third-party vendors) to access your organization's data associated with a group. For example, a team owner (who is the owner of the Office 365 Group for the team) can allow an app to read all Teams messages in the team, or list the basic profile of a group's members.

> [!NOTE]
> Independent of this setting, a group owner is always allowed to add other users or apps directly as a group owners.

### Configure group owner consent using PowerShell

You can use the Azure AD PowerShell Preview module ([AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview)), to enable or disable group owners' ability to consent to applications accessing your organization's data for the groups they own.

1. Ensure you are using the [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview) module (this step is important if you have installed both the [AzureAD](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0) module and the [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview) module).

    ```powershell
    Remove-Module AzureAD
    Import-Module AzureADPreview
    ```

2. Connect to Azure AD PowerShell.

   ```powershell
   Connect-AzureAD
   ```

3. Retrieve the current value for the *Consent Policy Settings* directory settings in your tenant. This requires checking if the directory settings for this feature have been created, and if not, using the values from the corresponding directory settings template.

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

4. Understand the setting values. There are two settings values that define which users would be able to allow an app to access their group's data:

    | Setting       | Type         | Description  |
    | ------------- | ------------ | ------------ |
    | _EnableGroupSpecificConsent_   | Boolean |  Flag indicating if groups owners are allowed to grant group-specific permissions. |
    | _ConstrainGroupSpecificConsentToMembersOfGroupId_ | Guid | If _EnableGroupSpecificConsent_ is set to "True" and this value set to a group's object ID, members of the group identified will be authorized to grant group-specific permissions to the groups they own. |

5. Update settings values for the desired configuration:

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

6. Save settings.

    ```powershell
    if ($settings.Id) {
        # Update an existing directory settings
        Set-AzureADDirectorySetting -Id $settings.Id -DirectorySetting $settings
    } else {
        # Create a new directory settings to override the default setting 
        New-AzureADDirectorySetting -DirectorySetting $settings
    }
    ```

## Configure risk-based step-up consent

Risk-based step-up consent helps reduce user exposure to malicious apps making [illicit consent requests](https://docs.microsoft.com/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants). If Microsoft detects a risky end-user consent request, the request will require a "step-up" to admin consent instead. This capability is enabled by default, but it will only result in a behavior change when end-user consent is enabled.

When a risky consent request is detected, the consent prompt will display a message indicating that admin approval is needed. If the [admin consent request workflow](configure-admin-consent-workflow.md) is enabled, the user can send the request to an admin for further review directly from the consent prompt. If it is not enabled, the following message will be displayed:

* **AADSTS90094:** &lt;clientAppDisplayName&gt; needs permission to access resources in your organization that only an admin can grant. Please ask an admin to grant permission to this app before you can use it.

In this case, an audit event will also be logged with a Category of "ApplicationManagement", Activity Type of "Consent to application" and Status Reason of "Risky application detected".

> [!IMPORTANT]
> Admins should [evaluate all consent requests](manage-consent-requests.md#evaluating-a-request-for-tenant-wide-admin-consent) carefully before approving, especially when Microsoft has detected risk.

### Disable or re-enable risk-based step-up consent using PowerShell

You can use the Azure AD PowerShell Preview module ([AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview)), to disable the step-up to admin consent required in cases where Microsoft detects risk or to re-enable it if it was previously disabled.

This can be done using the same steps as shown above for [configuring group owner consent using PowerShell](#configure-group-owner-consent-using-powershell), but substituting a different settings value. There are three differences in steps: 

1. Understand the setting values for risk based step-up consent:

    | Setting       | Type         | Description  |
    | ------------- | ------------ | ------------ |
    | _BlockUserConsentForRiskyApps_   | Boolean |  Flag indicating if user consent will be blocked when a risky request is detected. |

2. Substitute the following value in step 3:

    ```powershell
    $riskBasedConsentEnabledValue = $settings.Values | ? { $_.Name -eq "BlockUserConsentForRiskyApps" }
    ```
3. Substitute one of the following in step 5:

    ```powershell
    # Disable risk-based step-up consent entirely
    $riskBasedConsentEnabledValue.Value = "False"
    ```

    ```powershell
    # Re-enable risk-based step-up consent, if disabled previously
    $riskBasedConsentEnabledValue.Value = "True"
    ```

## Next steps

[Configure the admin consent workflow](configure-admin-consent-workflow.md)

[Learn how to manage consent to applications and evaluate consent requests](manage-consent-requests.md)

[Grant tenant-wide admin consent to an application](grant-admin-consent.md)

[Permissions and consent in the Microsoft identity platform](../develop/active-directory-v2-scopes.md)

[Azure AD on StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
