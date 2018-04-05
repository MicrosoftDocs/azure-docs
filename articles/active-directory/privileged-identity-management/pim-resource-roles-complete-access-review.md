---
title:  Privileged Identity Management for Azure Resources - Complete access review for Azure Resources| Microsoft Docs
description: Describes how to complete an access review for Azure Resources.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---

# Privileged Identity Management - Resource role - Finish access review
Privileged role administrators can review privileged access once a [security review has been started](pim-resource-roles-start-access-review.md). Privileged Identity Management (PIM) for Azure Resources will automatically send an email prompting users to review their access. If a user did not get an email, you can send them the instructions in [how to perform a security review](pim-resource-roles-perform-access-review.md).

After the security review period is over, or all the users have finished their self-review, follow the steps in this article to manage the review and see the results.

## Manage security reviews
1. Go to the [Azure portal](https://portal.azure.com/) and select the **Azure resources** application on your dashboard.
2. Select your resource.
3. Select the **Access reviews** section of the dashboard.
![](media/azure-pim-resource-rbac/rbac-access-review-home-list.png)
4. Select the access review that you want to manage.

On the access review's detail blade there are a number of options for managing that review.
![](media/azure-pim-resource-rbac/rbac-access-review-menu.png)

### Stop
All access reviews have an end date, but you can use the **Stop** button to finish it early. If any users haven't been reviewed by this time, they won't be able to after you stop the review. You cannot restart a review after it's been stopped.

### Reset
You can reset an access review to remove all decisions made on it. Once you've reset an access review, all users are marked as unreviewed again. 

### Apply
After an access review is completed, either because you reached the end date or stopped it manually, the **Apply** button implements the outcome of the review. If a user's access was denied in the review, this is the step that will remove their role assignment.  

### Delete
If you are not interested in the review any further, delete it. The **Delete** button removes the review from the PIM application.

## Results
View and download a list of your review results on the Results tab.
![](media/azure-pim-resource-rbac/rbac-access-review-results.png)

## Reviewers
View and add reviewers to your existing access review. Remind reviewers to complete their reviews.
![](media/azure-pim-resource-rbac/rbac-access-review-reviewers.png)



