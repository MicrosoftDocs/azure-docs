---
title: Manage Azure subscription policies
description: Learn how to manage Azure subscription policies to control the movement of Azure subscriptions from and into directories.
author: CLodwigDocs
ms.author: clodwig
ms.reviewer: mijeffer
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 04/15/2026
ms.custom:
- sfi-image-nochange
- sfi-ga-nochange
service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# Manage Azure subscription policies

This article helps you to configure Azure subscription policies to control the movement of Azure subscriptions from and into directories. The default behavior of these two policies is set to **Allow no users (recommended)** to help protect tenants from unauthorized subscription transfers. Global administrators can change these settings to **Allow all users** if needed. Note that the setting of **Allow all users** allows all authorized users, including authorized guest users on a subscription, to be able to transfer them. It does not mean all users in a directory.

> [!IMPORTANT]
> To improve tenant security, on May 1st, 2026, Microsoft updated the default behavior for subscription transfer policies. Subscriptions can no longer be transferred in to or out of your directory unless a global administrator explicitly allows it.
>
> If your organization previously set an explicit policy, that choice continues to be respected — no action is needed.
>
> If your organization never configured these policies and your workflows rely on users being able to move subscriptions in or out of your tenant, **those workflows will break as a result of this change**. To restore the previous behavior, a global administrator can update either policy to **Allow all users**.

## Prerequisites

- Only directory [global administrators](../../active-directory/roles/permissions-reference.md#global-administrator) with direct role assignment can edit subscription policies. Before editing subscription policies, the global administrator must [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md). Then they can edit subscription policies.
- All other users can only read the current policy setting.
- Subscriptions transferred into or out of a directory must remain associated with a Billing Tenant to ensure billing occurs correctly. 

## Available subscription policy settings

Use the following policy settings to control the movement of Azure subscriptions from and into directories.

### Subscriptions leaving a Microsoft Entra ID directory

The policy allows or stops users from moving subscriptions out of the current directory. Subscription owners can transfer subscriptions to another directory where they're a member, using either the Azure portal or APIs. Global administrators use this setting to allow or block these transfers for all directory users. This policy applies to all authorized users, including authorized guest users in your directory.
- **Allow no users (recommended)** — Blocks all subscription transfers out of your directory. This is the default.
- **Allow all users** — Permits authorized users to transfer subscriptions out of your directory.

### Subscriptions entering a Microsoft Entra ID directory

This policy controls whether users from other directories can move subscriptions into your directory. Subscription owners who are members of your directory can transfer subscriptions in using the Azure portal or APIs. Global administrators use this setting to allow or block these transfers. This policy applies to all authorized users, including authorized guest users in your directory.
- **Allow no users (recommended)** — Blocks all subscription transfers into your directory. This is the default.
- **Allow all users** — Permits authorized users to transfer subscriptions into your directory.

### Exempted Users

For governance reasons, global administrators can block all subscription directory moves - in to or out of the current directory. However they might want to allow specific users to do both operations. For both situations, they can configure a list of exempted users that allows these users to bypass all the policy settings that apply to everyone else.

#### Important note 
Authorized users (including guest users) in your directory can create Azure subscriptions in another directory where they have billing permissions and then transfer those subscriptions into your Entra ID directory. The default policy settings (**Allow no users**) help protect against this scenario. If your organization has changed either policy to **Allow all users**, be aware of this risk and consider reverting to the recommended default:
- Subscriptions leaving Entra ID directory should be set to **Allow no users (recommended)**.
- Subscriptions entering Entra ID directory should be set to **Allow no users (recommended)**.

## Setting subscription policy

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to **Subscriptions**. **Manage Policies** is shown on the command bar.
 :::image type="content" source="media/manage-azure-subscription-policy/subscription-blade-manage-policies.png" alt-text="Screenshot of the Azure Subscriptions blade with the Manage Policies button highlighted." lightbox="media/manage-azure-subscription-policy/subscription-blade-manage-policies.png":::

1. Select **Manage Policies** to view details about the current subscription policies set for the directory. A global administrator with [elevated permissions](../../role-based-access-control/elevate-access-global-admin.md) can make edits to the settings including adding or removing exempted users.  
:::image type="content" source="media/manage-azure-subscription-policy/2026-04-15-14-52-13.png" alt-text="Screenshot of the Manage Policies pane showing subscription policy details." lightbox="media/manage-azure-subscription-policy/2026-04-15-14-52-13.png":::

1. Select **Save changes** at the bottom to save changes. The changes are effective immediately.

## Read subscription policy

Non-global administrators can still navigate to the subscription policy area to view the directory's policy settings. They can't make any edits. They can't see the list of exempted users for privacy reasons. They can view their global administrators to submit requests for policy changes, as long as the directory settings allow them to.

<!-- TODO: Replace screenshot — new UX reader view with updated policy labels -->
## Next steps

- Read the [Cost Management + Billing documentation](../index.yml)
