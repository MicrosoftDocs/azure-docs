---
title: Configure how users consent to applications
description: Learn how to manage how and when users can consent to applications that will have access to your organization's data.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 04/19/2023
ms.author: jomondi
ms.reviewer: phsignor, yuhko
ms.custom: contperf-fy21q2, contperf-fy22q2, enterprise-apps
zone_pivot_groups: enterprise-apps-minus-former-powershell


#customer intent: As an admin, I want to configure how end-users consent to applications.
---

# Configure how users consent to applications

In this article, you'll learn how to configure the way users consent to applications and how to disable all future user consent operations to applications.

Before an application can access your organization's data, a user must grant the application permissions to do so. Different permissions allow different levels of access. By default, all users are allowed to consent to applications for permissions that don't require administrator consent. For example, by default, a user can consent to allow an app to access their mailbox but can't consent to allow an app unfettered access to read and write to all files in your organization.

To reduce the risk of malicious applications attempting to trick users into granting them access to your organization's data, we recommend that you allow user consent only for applications that have been published by a [verified publisher](../develop/publisher-verification-overview.md).

## Prerequisites

To configure user consent, you need:

- A user account. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Global Administrator role.

## Configure user consent settings

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

:::zone pivot="portal"

To configure user consent settings through the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).

1. Select **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent settings**.

1. Under **User consent for applications**, select which consent setting you want to configure for all users.

1. Select **Save** to save your settings.

:::image type="content" source="media/configure-user-consent/setting-for-all-users.png" alt-text="Screenshot of the 'User consent settings' pane.":::

:::zone-end

:::zone pivot="ms-powershell"

To choose which app consent policy governs user consent for applications, you can use the [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started?view=graph-powershell-1.0&preserve-view=true) module. The cmdlets used here are included in the [Microsoft.Graph.Identity.SignIns](https://www.powershellgallery.com/packages/Microsoft.Graph.Identity.SignIns) module.

### Connect to Microsoft Graph PowerShell

Connect to Microsoft Graph PowerShell using the least-privilege permission needed. For reading the current user consent settings, use *Policy.Read.All*. For reading and changing the user consent settings, use *Policy.ReadWrite.Authorization*.

```powershell
Connect-MgGraph -Scopes "Policy.ReadWrite.Authorization"
```

### Disable user consent

To disable user consent, set the consent policies that govern user consent to empty:

```powershell
Update-MgPolicyAuthorizationPolicy -DefaultUserRolePermissions @{
    "PermissionGrantPoliciesAssigned" = @() }
```

### Allow user consent subject to an app consent policy

To allow user consent, choose which app consent policy should govern users' authorization to grant consent to apps:

```powershell
Update-MgPolicyAuthorizationPolicy -DefaultUserRolePermissions @{
    "PermissionGrantPoliciesAssigned" = @("managePermissionGrantsForSelf.{consent-policy-id}") }
```

Replace `{consent-policy-id}` with the ID of the policy you want to apply. You can choose a [custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy) that you've created, or you can choose from the following built-in policies:

| ID | Description |
|:---|:------------|
| microsoft-user-default-low | **Allow user consent for apps from verified publishers, for selected permissions**<br/> Allow limited user consent only for apps from verified publishers and apps that are registered in your tenant, and only for permissions that you classify as *low impact*. (Remember to [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.) |
| microsoft-user-default-legacy | **Allow user consent for apps**<br /> This option allows all users to consent to any permission that doesn't require admin consent, for any application |

For example, to enable user consent subject to the built-in policy `microsoft-user-default-low`, run the following commands:

```powershell
Update-MgPolicyAuthorizationPolicy -DefaultUserRolePermissions @{
    "PermissionGrantPoliciesAssigned" = @("managePermissionGrantsForSelf.microsoft-user-default-low") }
```

:::zone-end

:::zone pivot="ms-graph"

Use the [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to choose which app consent policy governs user consent for applications.

To disable user consent, set the consent policies that govern user consent to empty:

```http
PATCH https://graph.microsoft.com/v1.0/policies/authorizationPolicy
{
   "defaultUserRolePermissions": {
      "permissionGrantPoliciesAssigned": []
   }
}
```

### Allow user consent subject to an app consent policy

To allow user consent, choose which app consent policy should govern users' authorization to grant consent to apps:

```http
PATCH https://graph.microsoft.com/v1.0/policies/authorizationPolicy

{
   "defaultUserRolePermissions": {
      "permissionGrantPoliciesAssigned": ["ManagePermissionGrantsForSelf.microsoft-user-default-legacy"]
   }
}
```

Replace `{consent-policy-id}` with the ID of the policy you want to apply. You can choose a [custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy) that you've created, or you can choose from the following built-in policies:

| ID | Description |
|:---|:------------|
| microsoft-user-default-low | **Allow user consent for apps from verified publishers, for selected permissions**<br/> Allow limited user consent only for apps from verified publishers and apps that are registered in your tenant, and only for permissions that you classify as *low impact*. (Remember to [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.) |
| microsoft-user-default-legacy | **Allow user consent for apps**<br/> This option allows all users to consent to any permission that doesn't require admin consent, for any application |

For example, to enable user consent subject to the built-in policy `microsoft-user-default-low`, use the following PATCH command:

```http
PATCH https://graph.microsoft.com/v1.0/policies/authorizationPolicy

{
    "defaultUserRolePermissions": {
        "permissionGrantPoliciesAssigned": [
            "managePermissionGrantsForSelf.microsoft-user-default-low"
        ]
    }
}
```

:::zone-end

> [!TIP]
> To allow users to request an administrator's review and approval of an application that the user isn't allowed to consent to, [enable the admin consent workflow](configure-admin-consent-workflow.md). For example, you might do this when user consent has been disabled or when an application is requesting permissions that the user isn't allowed to grant.
## Next steps

- [Manage app consent policies](manage-app-consent-policies.md)
- [Configure the admin consent workflow](configure-admin-consent-workflow.md)
