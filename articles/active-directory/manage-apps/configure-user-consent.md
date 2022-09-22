---
title: Configure how users consent to applications
description: Learn how to manage how and when users can consent to applications that will have access to your organization's data.
services: active-directory
author: yuhko-msft
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 08/10/2022
ms.author: yuhko
ms.reviewer: phsignor
ms.custom: contperf-fy21q2, contperf-fy22q2

#customer intent: As an admin, I want to configure how end-users consent to applications.
---

# Configure how users consent to applications

In this article, you'll learn how to configure the way users consent to applications and how to disable all future user consent operations to applications.

Before an application can access your organization's data, a user must grant the application permissions to do so. Different permissions allow different levels of access. By default, all users are allowed to consent to applications for permissions that don't require administrator consent. For example, by default, a user can consent to allow an app to access their mailbox but can't consent to allow an app unfettered access to read and write to all files in your organization.

To reduce the risk of malicious applications attempting to trick users into granting them access to your organization's data, we recommend that you allow user consent only for applications that have been published by a [verified publisher](../develop/publisher-verification-overview.md).

## Prerequisites

To configure user consent, you need:

- A user account. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Global Administrator or Privileged Administrator role.

# [The Azure portal](#tab/azure-portal)

## Configure user consent settings

To configure user consent settings through the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).

1. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.

1. Under **User consent for applications**, select which consent setting you want to configure for all users.

1. Select **Save** to save your settings.

:::image type="content" source="media/configure-user-consent/setting-for-all-users.png" alt-text="Screenshot of the 'User consent settings' pane.":::

# [PowerShell](#tab/azure-powershell)

To choose which app consent policy governs user consent for applications, you can use the latest [Azure AD PowerShell](/powershell/module/azuread/?view=azureadps-2.0&preserve-view=true) module.

> [!NOTE]
> The instructions below use the generally available Azure AD PowerShell module ([AzureAD](https://www.powershellgallery.com/packages/AzureAD)). The parameter names are different in the preview version of this module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)). If you have both modules installed, ensure you're using the cmdlet from the correct module by first running:
> 
> ```powershell
> Remove-Module AzureADPreview -ErrorAction SilentlyContinue
> Import-Module AzureAD
> ```

#### Disable user consent

To disable user consent, set the consent policies that govern user consent to empty:

```powershell
Set-AzureADMSAuthorizationPolicy -DefaultUserRolePermissions @{
    "PermissionGrantPoliciesAssigned" = @() }
```

#### Allow user consent subject to an app consent policy

To allow user consent, choose which app consent policy should govern users' authorization to grant consent to apps:

```powershell
Set-AzureADMSAuthorizationPolicy -DefaultUserRolePermissions @{
    "PermissionGrantPoliciesAssigned" = @("managePermissionGrantsForSelf.{consent-policy-id}") }
```

Replace `{consent-policy-id}` with the ID of the policy you want to apply. You can choose a [custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy) that you've created, or you can choose from the following built-in policies:

| ID | Description |
|:---|:------------|
| microsoft-user-default-low | **Allow user consent for apps from verified publishers, for selected permissions**<br/> Allow limited user consent only for apps from verified publishers and apps that are registered in your tenant, and only for permissions that you classify as *low impact*. (Remember to [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.) |
| microsoft-user-default-legacy | **Allow user consent for apps**<br /> This option allows all users to consent to any permission that doesn't require admin consent, for any application |

For example, to enable user consent subject to the built-in policy `microsoft-user-default-low`, run the following commands:

```powershell
Set-AzureADMSAuthorizationPolicy -DefaultUserRolePermissions @{
    "PermissionGrantPoliciesAssigned" = @("managePermissionGrantsForSelf.microsoft-user-default-low") }
```

---

> [!TIP]
> To allow users to request an administrator's review and approval of an application that the user isn't allowed to consent to, [enable the admin consent workflow](configure-admin-consent-workflow.md). For example, you might do this when user consent has been disabled or when an application is requesting permissions that the user isn't allowed to grant.

## Next steps

- [Manage app consent policies](manage-app-consent-policies.md)
- [Configure the admin consent workflow](configure-admin-consent-workflow.md)
