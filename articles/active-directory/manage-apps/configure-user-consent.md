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
ms.date: 05/19/2020
ms.author: kenwith
ms.reviewer: arvindh, luleon, phsignor
---

# Configure how end-users consent to applications

You can integrate your applications with the Microsoft identity platform to allow users to sign in with their work or school account and access your organization's data to deliver rich data-driven experiences.

Before an application can access your organization's data, a user must grant the application permissions to do so. Different permissions allow different levels of access. By default, all users are allowed to consent to applications for permissions that don't require administrator consent. For example, by default, a user can consent to allow an app to access their mailbox but can't consent to allow an app unfettered access to read and write to all files in your organization.

By allowing users to grant apps access to data, users can easily acquire useful applications and be productive. However, in some situations this configuration can represent a risk if it's not monitored and controlled carefully.

## User consent settings

To control what cases users can consent to applications, choose the consent policy that will apply to all users. Here are the three consent policy options:

* **Disable user consent** - Users cannot grant permissions to applications. Users can continue to sign in to apps they had previously consented to or which are consented to by administrators on their behalf, but they will not be allowed to consent to new permissions or to new apps on their own. Only users who have been granted a directory role that includes the permission to grant consent will be able to consent to new permissions or new apps.

* **Users can consent to apps from verified publishers, but only for permissions you select (preview)** - All users can only consent to apps that were published by a [verified publisher](../develop/publisher-verification-overview.md) and apps that are registered in your tenant. Users can only consent to the permissions you have classified as "Low impact".

  Make sure to [classify permissions](#configure-permission-classifications-preview) to select which permissions users are allowed to consent to.

* **Users can consent to all apps** - This option allows all users to consent to any permission, which doesn't require admin consent, for any application. 

   To reduce the risk of malicious applications attempting to trick users into granting them access to your organization's data, we recommend that you allow user consent only for applications that have been published by a [verified publisher](../develop/publisher-verification-overview.md).

### Configure user consent settings from the Azure portal

To configure user consent settings through the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator).
1. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.
1. Under **User consent for applications**, select which consent setting you'd like to configure for all users.
1. Select **Save** to save your settings.

:::image type="content" source="media/configure-user-consent/setting-for-all-users.png" alt-text="User consent settings":::

> [!TIP]
> Consider [enabling the admin consent workflow](configure-admin-consent-workflow.md) to allow users to request an administrator's review and approval of an application that the user is not allowed to consent to--for example, when user consent has been disabled or when an application is requesting permissions that the user is not allowed to grant.

### Configure user consent settings using PowerShell

You can use the latest Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0-preview), to choose which consent policy governs user consent for applications.

* **Disable user consent** - To disable user consent, set the consent policies which govern user consent to be empty:

  ```powershell
  Set-AzureADMSAuthorizationPolicy `
     -Id "authorizationPolicy" `
     -PermissionGrantPolicyIdsAssignedToDefaultUserRole @()
  ```

* **Allow user consent for apps from verified publishers, for selected permissions (preview)** - To allow limited user consent only for apps from verified publishers and apps registered in your tenant, and only for permissions that you classify as "Low impact", configure the built-in consent policy named `microsoft-user-default-low`:

  ```powershell
  Set-AzureADMSAuthorizationPolicy `
     -Id "authorizationPolicy" `
     -PermissionGrantPolicyIdsAssignedToDefaultUserRole @("microsoft-user-default-low")
  ```

   Don't forget to [classify permissions](#configure-permission-classifications-preview) to select which permissions users are allowed to consent to.

* **Allow user consent for all apps** - To allow user consent for all apps:

  ```powershell
  Set-AzureADMSAuthorizationPolicy `
     -Id "authorizationPolicy" `
     -PermissionGrantPolicyIdsAssignedToDefaultUserRole @("microsoft-user-default-legacy")
  ```

   This option allows all users to consent to any permission that doesn't require admin consent, for any application. We recommend that you allow user consent only for apps from verified publishers.

## Configure permission classifications (preview)

Permission classifications allow you to identify the impact that different permissions have according to your organization's policies and risk evaluations. For example, you can use permission classifications in consent policies to identify the set of permissions that users are allowed to consent to.

> [!NOTE]
> Currently, only the "Low impact" permission classification is supported. Only delegated permissions that don't require admin consent can be classified as "Low impact".

### Classify permissions using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator).
1. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **Permission classifications**.
1. Choose **Add permissions** to classify another permission as "Low impact". 
1. Select the API and then select the delegated permission(s).

In this example, we've classified the minimum set of permission required for single sign-on:

:::image type="content" source="media/configure-user-consent/permission-classifications.png" alt-text="Permission classifications":::

> [!TIP]
> For the Microsoft Graph API, the minimum permissions needed to do basic single sign on are `openid`, `profile`, `User.Read` and `offline_access`. With these permissions an app can read the profile details of the signed-in user and can maintain this access even when the user is no longer using the app.

### Classify permissions using PowerShell

You can use the latest Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview), to classify permissions. Permission classifications are configured on the **ServicePrincipal** object of the API that publishes the permissions.

#### To read the current permission classifications for an API:

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

#### To classify a permission as "Low impact":

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

#### To remove a delegated permission classification:

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

## Configure group owner consent to apps accessing group data

Group owners can authorize applications, such as applications published by third-party vendors, to access your organization's data associated with a group. For example, a team owner in Microsoft Teams can allow an app to read all Teams messages in the team, or list the basic profile of a group's members.

You can configure which users are allowed to consent to apps accessing their groups' data, or you can disable this feature.

### Configure group owner consent using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator).
2. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.
3. Under **Group owner consent for apps accessing data** select the option you'd like to enable.
4. Select **Save** to save your settings.

In this example, all group owners are allowed to consent to apps accessing their groups' data:

:::image type="content" source="media/configure-user-consent/group-owner-consent.png" alt-text="Group owner consent settings":::

### Configure group owner consent using PowerShell

You can use the Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview), to enable or disable group owners' ability to consent to applications accessing your organization's data for the groups they own.

1. Make sure you're using the [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview) module. This step is important if you have installed both the [AzureAD](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0) module and the [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview) module).

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

## Configure risk-based step-up consent

Risk-based step-up consent helps reduce user exposure to malicious apps that make [illicit consent requests](https://docs.microsoft.com/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants). If Microsoft detects a risky end-user consent request, the request will require a "step-up" to admin consent instead. This capability is enabled by default, but it will only result in a behavior change when end-user consent is enabled.

When a risky consent request is detected, the consent prompt will display a message indicating that admin approval is needed. If the [admin consent request workflow](configure-admin-consent-workflow.md) is enabled, the user can send the request to an admin for further review directly from the consent prompt. If it's not enabled, the following message will be displayed:

* **AADSTS90094:** &lt;clientAppDisplayName&gt; needs permission to access resources in your organization that only an admin can grant. Please ask an admin to grant permission to this app before you can use it.

In this case, an audit event will also be logged with a Category of "ApplicationManagement", Activity Type of "Consent to application",  and Status Reason of "Risky application detected".

> [!IMPORTANT]
> Admins should [evaluate all consent requests](manage-consent-requests.md#evaluating-a-request-for-tenant-wide-admin-consent) carefully before approving a request, especially when Microsoft has detected risk.

### Disable or re-enable risk-based step-up consent using PowerShell

You can use the Azure AD PowerShell Preview module, [AzureADPreview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview), to disable the step-up to admin consent required in cases where Microsoft detects risk or to re-enable it if it was previously disabled.

You can do this using the same steps as shown above for [configuring group owner consent using PowerShell](#configure-group-owner-consent-using-powershell), but substituting a different settings value. There are three differences in steps: 

1. Understand the setting values for risk based step-up consent:

    | Setting       | Type         | Description  |
    | ------------- | ------------ | ------------ |
    | _BlockUserConsentForRiskyApps_   | Boolean |  Flag indicating if user consent will be blocked when a risky request is detected. |

1. Substitute the following value in step 3:

    ```powershell
    $riskBasedConsentEnabledValue = $settings.Values | ? { $_.Name -eq "BlockUserConsentForRiskyApps" }
    ```
    
1. Substitute one of the following in step 5:

    ```powershell
    # Disable risk-based step-up consent entirely
    $riskBasedConsentEnabledValue.Value = "False"
    ```

    ```powershell
    # Re-enable risk-based step-up consent, if disabled previously
    $riskBasedConsentEnabledValue.Value = "True"
    ```

## Next steps

To learn more:

* [Configure the admin consent workflow](configure-admin-consent-workflow.md)
* [Learn how to manage consent to applications and evaluate consent requests](manage-consent-requests.md)
* [Grant tenant-wide admin consent to an application](grant-admin-consent.md)
* [Permissions and consent in the Microsoft identity platform](../develop/active-directory-v2-scopes.md)

To get help or find answers to your questions:
* [Azure AD on StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
