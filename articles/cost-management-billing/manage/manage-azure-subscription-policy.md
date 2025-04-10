---
title: Manage Azure subscription policies
description: Learn how to manage Azure subscription policies to control the movement of Azure subscriptions from and into directories.
author: PreetiOne
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/22/2025
ms.reviewer: presharm
ms.author: presharm
---

# Manage Azure subscription policies

This article helps you to configure Azure subscription policies to control the movement of Azure subscriptions from and into directories. The default behavior of these two policies is set to **Allow Everyone**. Note that the setting of **Allow Everyone** allows all authorized users, including authorized guest users on a subscription to be able to transfer them. It does not mean all users of a directory.    

## Prerequisites

- Only directory [global administrators](../../active-directory/roles/permissions-reference.md#global-administrator) can edit subscription policies. Before editing subscription policies, the global administrator must [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md). Then they can edit subscription policies.
- All other users can only read the current policy setting.
- Subscriptions transferred into or out of a directory must remain associated with a Billing Tenant to ensure billing occurs correctly. 

## Available subscription policy settings

Use the following policy settings to control the movement of Azure subscriptions from and into directories.

### Subscriptions leaving a Microsoft Entra ID directory

The policy allows or stops users from moving subscriptions out of the current directory. [Subscription owners](../../role-based-access-control/built-in-roles.md#owner) can [change the directory of an Azure subscription](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) or use transfer features available on the Azure portal and APIs to another directory where they're a member. Global administrators can allow or disallow directory users from changing the directory or transfer of subscriptions.
- Set this policy to **Permit no one** if you do not want subscriptions to be transferred out of your directory. This policy applies to all authorized subscriptions users including authorized guest users of your directory. 
- Set this policy to **Allow Everyone** if you want all authorized users including authorized guest users to be able to transfer subscriptions out of your directory.   

### Subscriptions entering a Microsoft Entra ID directory

The policy allows or stops users from other directories, who have access in the current directory, to move subscriptions into the current directory. [Subscription owners](../../role-based-access-control/built-in-roles.md#owner) can [change the directory of an Azure subscription](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) or transfer them to another directory where they're a member. Global administrators can allow or disallow directory users from transferring these subscriptions.
- Set this policy to **Permit no one** if you do not want subscriptions to be transferred into your directory. This policy applies to all authorized users, including authorized guest users of your directory. 
- Set this policy to **Allow Everyone** if you want all authorized users, including authorized guest users in your directory to be able to transfer subscriptions into your directory.   

### Exempted Users

For governance reasons, global administrators can block all subscription directory moves - in to or out of the current directory. However they might want to allow specific users to do both operations. For both situations, they can configure a list of exempted users that allows these users to bypass all the policy settings that apply to everyone else.

#### Important note 
Authorized users (including guest users) in your directory can create Azure subscriptions in another directory where they have billing permissions and then transfer those subscriptions into your Entra ID directory.  If you don't want to allow this, you should set one or both of the following policies: 
- Subscriptions leaving Entra ID directory should be set to **Permit no one**.
- Subscriptions entering Entra ID directory should be set to **Permit no one**.  

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

