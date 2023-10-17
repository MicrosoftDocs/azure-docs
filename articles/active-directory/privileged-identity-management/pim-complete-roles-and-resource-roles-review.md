---
title: Complete an access review of Azure resource and Microsoft Entra roles in PIM
description: Learn how to complete an access review of Azure resource and Microsoft Entra roles Privileged Identity Management.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Complete an access review of Azure resource and Microsoft Entra roles in PIM

Privileged role administrators can review privileged access once an [access review has been started](./pim-create-roles-and-resource-roles-review.md). Privileged Identity Management (PIM) in Microsoft Entra ID will automatically send an email that prompts users to review their access. If a user doesn't receive an email, you can send them the instructions for [how to perform an access review](./pim-perform-roles-and-resource-roles-review.md).

Once the review has been created, follow the steps in this article to complete the review and see the results.

## Complete access reviews

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a user that is assigned to one of the prerequisite role(s).

1. Browse to **Identity governance** > **Privileged Identity Management**. 

1. For **Microsoft Entra roles**, select **Microsoft Entra roles**. For **Azure resources**, select **Azure resources**

1. Select the access review that you want to manage. Below is a sample screenshot of the **Access Reviews** overview for both **Azure resources** and **Microsoft Entra roles**.

    :::image type="content" source="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-azure-ad-roles-home-list.png" alt-text="Access reviews list showing role, owner, start date, end date, and status screenshot." lightbox="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-azure-ad-roles-home-list.png":::

On the detail page, the following options are available for managing the review of **Azure resources** and **Microsoft Entra roles**:

![Options for managing a review in Azure resources - Stop, Reset, Apply, Delete screenshot.](media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-menu.png)

### Stop an access review

All access reviews have an end date, but you can use the **Stop** button to finish it early. The **Stop** button is only selectable when the review instance is active. You can't restart a review after it's been stopped.

### Reset an access review

When the review instance is active and at least one decision has been made by reviewers, you can reset the access review by selecting the **Reset** button to remove all decisions that were made on it. After you've reset an access review, all users are marked as not reviewed again.

### Apply an access review

After an access review is completed, either because you've reached the end date or stopped it manually, the **Apply** button removes denied users' access to the role. If a user's access was denied during the review, this is the step that removes their role assignment. If the **Auto apply** setting is configured on review creation, this button will always be disabled because the review will be applied automatically instead of manually.

### Delete an access review

If you aren't interested in the review any further, delete it. To remove the access review from the Privileged Identity Management service, select the **Delete** button.

> [!IMPORTANT]
> You will not be required to confirm this destructive change, so verify that you want to delete that review.

## Results

On the **Results** page, you may view and download a list of your review results.

:::image type="content" source="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-azure-ad-results.png" alt-text="Results page listing users, outcome, reason, reviewed by, applied by, and apply result for Microsoft Entra roles screenshot." lightbox="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-azure-ad-results.png":::

> [!Note]
> **Microsoft Entra roles** have a concept of role-assignable groups, where a group can be assigned to the role. When this happens, the group will show up in the review instead of expanding the members of the group, and a reviewer will either approve or deny the entire group.

:::image type="content" source="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-azure-resource-results.png" alt-text="Results page listing users, outcome, reason, reviewed by, applied by, and apply result for Azure resource roles screenshot." lightbox="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-azure-resource-results.png":::

> [!Note]
>If a group is assigned to **Azure resource roles**, the reviewer of the Azure resource role will see the expanded list of the users in a nested group. Should a reviewer deny a member of a nested group, that deny result will not be applied successfully because the user will not be removed from the nested group.

## Reviewers

On the **Reviewers** page, you may view and add reviewers to your existing access review. You may also remind reviewers to complete their reviews here.

> [!Note]
> If the reviewer type selected is user or group, you can add more users or groups as the primary reviewers at any point. You can also remove primary reviewers at any point. If the reviewer type is manager, you can add users or groups as the fallback reviewers to complete reviews on users who do not have managers. Fallback reviewers cannot be removed.

:::image type="content" source="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-azure-resource-reviewers.png" alt-text="Reviewers page listing name and user principal name for Azure resource roles screenshot." lightbox="media/pim-complete-azure-ad-roles-and-resource-roles-review/rbac-access-review-azure-resource-reviewers.png":::

## Next steps

- [Create an access review of Azure resource and Microsoft Entra roles in PIM](./pim-create-roles-and-resource-roles-review.md)
- [Perform an access review of Azure resource and Microsoft Entra roles in PIM](./pim-perform-roles-and-resource-roles-review.md)
