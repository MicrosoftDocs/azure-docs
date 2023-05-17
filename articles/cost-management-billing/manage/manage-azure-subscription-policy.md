---
title: Manage Azure subscription policies
description: Learn how to manage Azure subscription policies to control the movement of Azure subscriptions from and into directories.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 12/06/2022
ms.reviewer: sgautam
ms.author: banders
---

# Manage Azure subscription policies

This article helps you configure Azure subscription policies for subscription operations to control the movement of Azure subscriptions from and into directories.

## Prerequisites

- Only directory [global administrators](../../active-directory/roles/permissions-reference.md#global-administrator) can edit subscription policies. Before editing subscription policies, the global administrator must [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md). Then they can edit subscription policies.
- All other users can only read the current policy setting.

## Available subscription policy settings

Use the following policy settings to control the movement of Azure subscriptions from and into directories.

### Subscriptions leaving AAD directory

The policy allows or stops users from moving subscriptions out of the current directory. [Subscription owners](../../role-based-access-control/built-in-roles.md#owner) can [change the directory of an Azure subscription](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) to another one where they're a member. It poses governance challenges, so global administrators can allow or disallow directory users from changing the directory.

### Subscriptions entering AAD directory

The policy allows or stops users from other directories, who have access in the current directory, to move subscriptions into the current directory. [Subscription owners](../../role-based-access-control/built-in-roles.md#owner) can [change the directory of an Azure subscription](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) to another one where they're a member. It poses governance challenges, so global administrators can allow or disallow directory users from changing the directory.

### Exempted Users

For governance reasons, global administrators can block all subscription directory moves - in to or out of the current directory. However they might want to allow specific users to do either operations. For either situation, they can configure a list of exempted users that allows the users to bypass the policy setting that applies to everyone else.

## Setting subscription policy

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to **Subscriptions**. **Manage Policies** is shown on the command bar.  
    :::image type="content" source="./media/manage-azure-subscription-policy/subscription-blade-manage-policies.png" alt-text="Screenshot showing Manage Polices in Subscriptions." lightbox="./media/manage-azure-subscription-policy/subscription-blade-manage-policies.png" :::
1. Select **Manage Policies** to view details about the current subscription policies set for the directory. A global administrator with [elevated permissions](../../role-based-access-control/elevate-access-global-admin.md) can make edits to the settings including adding or removing exempted users.  
    :::image type="content" source="./media/manage-azure-subscription-policy/subscription-blade-policies.png" alt-text="Screenshot showing specific policy settings and exempted users." lightbox="./media/manage-azure-subscription-policy/subscription-blade-policies.png" :::
1. Select **Save changes** at the bottom to save changes. The changes are effective immediately.

## Read subscription policy

Non-global administrators can still navigate to the subscription policy area to view the directory's policy settings. They can't make any edits. They can't see the list of exempted users for privacy reasons. They can view their global administrators to submit requests for policy changes, as long as the directory settings allow them to.

:::image type="content" source="./media/manage-azure-subscription-policy/subscription-blade-policies-reader.png" alt-text="Screenshot showing the Manage policies in Subscriptions as a reader." lightbox="./media/manage-azure-subscription-policy/subscription-blade-policies-reader.png" :::

## Next steps

- Read the [Cost Management + Billing documentation](../index.yml)
