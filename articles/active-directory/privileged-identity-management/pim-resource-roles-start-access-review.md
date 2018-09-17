---
title: Start an access review for Azure resource roles in PIM | Microsoft Docs
description: Learn how to start an access review for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: pim
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---


# Start an access review for Azure resource roles in PIM
Role assignments become "stale" when users have privileged access that they don't need anymore. To reduce the risk that's associated with these stale role assignments, privileged role administrators should regularly review roles. This document covers the steps for starting an access review in Privileged Identity Management (PIM) for Azure resources.

From the PIM application main page, go to:

* **Access reviews** > **Add**

![Add access reviews](media/azure-pim-resource-rbac/rbac-access-review-home.png)

When you select the **Add** button, the **Create an access review** blade appears. On this blade, configure the review with a name and time limit, choose a role to review, and then decide who does the review.

![Create an access review](media/azure-pim-resource-rbac/rbac-create-access-review.png)

### Configure the review
To create an access review, first name it, and then set a start and end date.

![Configure review - screenshot](media/azure-pim-resource-rbac/rbac-access-review-setting-1.png)

Make the length of the review long enough for users to complete it. If they finish before the end date, they can always stop the review early.

### Choose a role to review
Each review focuses on only one role. Unless you started the access review from a specific role blade, you need to choose a role now.

1. Go to **Review role membership**
   
    ![Review role membership - screenshot](media/azure-pim-resource-rbac/rbac-access-review-setting-2.png)
2. Choose one role from the list.

### Decide who will perform the review
There are three options for performing a review. You can assign the review to someone else to complete, you can do it yourself, or each user can review their own access.

1. Choose one of the options:
   
   * **Selected users**: Use this option when you don't know who needs access. With this option, you can assign the review to a resource owner or group manager to complete.
   * **Assigned (self)**: Use this option to have the users review their own role assignments.
   
2. Go to **Select reviewers**.
   
    ![Select reviewers - screenshot](media/azure-pim-resource-rbac/rbac-access-review-setting-3.png)

### Start the review
Finally, you can require that users provide a reason for approving access. Add a description of the review if you like. Then select **Start**.

Make sure you let your users know that there's an access review waiting for them, and show them [how to perform an access review](pim-resource-roles-perform-access-review.md).

## Manage the access review
In the PIM Azure resources dashboard, you can track the progress as the reviewers complete their reviews. No access rights are changed in the directory until [the review has been completed](pim-resource-roles-complete-access-review.md).

Until the review period is over, you can remind users to complete their review, or stop the review early from the access reviews section.

## Next steps

- [Complete an access review for Azure resource roles in PIM](pim-resource-roles-complete-access-review.md)
- [Perform an access review of my Azure resource roles in PIM](pim-resource-roles-perform-access-review.md)
- [Start an access review for Azure AD directory roles in PIM](pim-how-to-start-security-review.md)
