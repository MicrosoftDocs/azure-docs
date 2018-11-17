---
title: Start an access review for Azure AD directory roles in PIM | Microsoft Docs
description: Learn how to start an access review for Azure AD directory roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: pim
ms.date: 06/21/2018
ms.author: rolyon
ms.custom: pim
---
# Start an access review for Azure AD directory roles in PIM
Role assignments become "stale" when users have privileged access that they don't need anymore. In order to reduce the risk associated with these stale role assignments, privileged role administrators or global administrators should regularly create access reviews to ask admins to review the roles that users have been given. This document covers the steps for starting an access review in Azure AD Privileged Identity Management (PIM).

## Start an access review
> [!NOTE]
> If you haven't added the PIM application to your dashboard in the Azure portal, see the steps in  [Getting Started with Azure Privileged Identity Management](pim-getting-started.md)
> 
> 

From the PIM application main page, there are three ways to start an access review:

* **Access reviews** > **Add**
* **Roles** > **Review** button
* Select the specific role to be reviewed from the roles list > **Review** button

When you click on the **Review** button, the **Start an access review** blade appears. On this blade, you're going to configure the review with a name and time limit, choose a role to review, and decide who will perform the review.

![Start an access review - screenshot](./media/pim-how-to-start-security-review/PIM_start_review.png)

### Configure the review
To create an access review, you need to name it and set a start and end date.

![Configure review - screenshot](./media/pim-how-to-start-security-review/PIM_review_configure.png)

Make the length of the review long enough for users to complete it. If you finish before the end date, you can always stop the review early.

### Choose a role to review
Each review focuses on only one role. Unless you started the access review from a specific role blade, you'll need to choose a role now.

1. Navigate to **Review role membership**
   
    ![Review role membership - screenshot](./media/pim-how-to-start-security-review/PIM_review_role.png)
2. Choose one role from the list.

### Decide who will perform the review
There are three options for performing a review. You can assign the review to someone else to complete, you can do it yourself, or you can have each user review their own access.

1. Navigate to **Select reviewers**
   
    ![Select reviewers - screenshot](./media/pim-how-to-start-security-review/PIM_review_reviewers.png)
2. Choose one of the options:
   
   * **Select reviewer**: Use this option when you don't know who needs access. With this option, you can assign the review to a resource owner or group manager to complete.
   * **Me**: Useful if you want to preview how access reviews work, or you want to review on behalf of people who can't.
   * **Members review themselves**: Use this option to have the users review their own role assignments.

### Start the review
Finally, you have the option to require that users provide a reason if they approve their access. Add a description of the review if you like, and select **Start**.

Make sure you let your users know that there's an access review waiting for them, and show them [How to perform an access review](pim-how-to-perform-security-review.md).

## Manage the access review
You can track the progress as the reviewers complete their reviews in the Azure AD PIM dashboard, in the access reviews section. No access rights will be changed in the directory until [the review completes](pim-how-to-complete-review.md).

Until the review period is over, you can remind users to complete their review, or stop the review early from the access reviews section.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

- [Complete an access review for Azure AD directory roles in PIM](pim-how-to-complete-review.md)
- [Perform an access review of my Azure AD directory roles in PIM](pim-how-to-perform-security-review.md)
- [Start an access review for Azure resource roles in PIM](pim-resource-roles-start-access-review.md)
