---
title: Create an access review of PIM for Groups (preview)
description: Learn how to create an access review of PIM for Groups in Microsoft Entra ID. 
services: active-directory
author: owinfreyATL
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/28/2023
ms.author: owinfrey
ms.reviewer: jgangadhar
ms.collection: M365-identity-device-management
---
 
# Create an access review of PIM for Groups in Microsoft Entra ID (preview)

This article describes how to create one or more access reviews for PIM for Groups, which will include the active members of the group and the eligible members. Reviews can be performed on both active members of the group, who are active at the time the review is created, and the eligible members of the group.

## Prerequisites

- Microsoft Entra ID P2 or Microsoft Entra ID Governance.
- Only Global administrators and Privileged Role administrators can create reviews on PIM for Groups. For more information, see [Use Microsoft Entra groups to manage role assignments](../roles/groups-concept.md).

For more information, see [License requirements](access-reviews-overview.md#license-requirements).

## Create a PIM for Groups access review

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

### Scope

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Access Reviews** > **Review History**.

1. Select **New access review** to create a new access review.

    ![Screenshot that shows the Access reviews pane in Identity Governance.](./media/create-access-review/access-reviews.png)

1. In the **Select what to review** box, select **Teams + Groups**.

    ![Screenshot that shows creating an access review.](./media/create-access-review/select-what-review.png)

1. Select **Teams + Groups** and then select **Select Teams + groups** under **Review Scope**. A list of groups to choose from appears on the right.

     ![Screenshot that shows selecting Teams + Groups.](./media/create-access-review/create-pim-review.png)

> [!NOTE]  
> When a PIM for Groups is selected, the users under review for the group will include all eligible users and active users in that group. 

6. Now you can select a scope for the review. Your options are:
    - **Guest users only**: This option limits the access review to only the Microsoft Entra B2B guest users in your directory.
    - **Everyone**: This option scopes the access review to all user objects associated with the resource.


7. If you're conducting group membership review, you can create access reviews for only the inactive users in the group. In the *Users scope* section, check the box next to **Inactive users (on tenant level)**. If you check the box, the scope of the review focuses on inactive users only, those who haven't signed in either interactively or non-interactively to the tenant. Then, specify **Days inactive**  with many days inactive up to 730 days (two years). Users in the group inactive for the specified number of days are the only users in the review.

> [!NOTE]
> Recently created users are not affected when configuring the inactivity time. The Access Review will check if a user has been created in the time frame configured and disregard users who haven’t existed for at least that amount of time. For example, if you set the inactivity time as 90 days and a guest user was created or invited less than 90 days ago, the guest user will not be in scope of the Access Review. This ensures that a user can sign in at least once before being removed.

8. Select **Next: Reviews**.

After you have reached this step, you may follow the instructions outlined under **Next: Reviews** in the [Create an access review of groups or applications](create-access-review.md#next-reviews) article to complete your access review.

> [!NOTE]
> Review of PIM for Groups will only assign active owner(s) as the reviewers. Eligible owners are not included. At least one fallback reviewer is required for a PIM for Groups review. If there are no active owner(s) when the review begins, the fallback reviewer(s) will be assigned to the review.

## Next steps

- [Create an access review of groups or applications](create-access-review.md)
- [Approve activation requests for PIM for Groups members and owners (preview)](../privileged-identity-management/groups-approval-workflow.md)
