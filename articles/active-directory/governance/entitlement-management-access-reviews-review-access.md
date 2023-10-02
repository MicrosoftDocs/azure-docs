---
title: Review access of an access package in entitlement management
description: Learn how to complete an access review of entitlement management access packages in access reviews.
services: active-directory
documentationCenter: ''
author: owinfreyATL
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/28/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want to review the active assignments of my users to ensure everyone has the appropriate access.

---
# Review access of an access package in entitlement management

Entitlement management simplifies how enterprises manage access to groups, applications, and SharePoint sites. This article describes how to perform access reviews for other users that are assigned to an access package as a designated reviewer.

## Prerequisites

To review users' active access package assignments, the creator of a review must satisfy these prerequisites:
- Microsoft Entra ID P2 or Microsoft Entra ID Governance
- Global administrator or Identity Governance administrator

For more information, see [License requirements](entitlement-management-overview.md#license-requirements).

>[!NOTE]
>The reviewer can be anyone the creator of a review selects (group owner, manager of user, the user themselves, or any selected user or group).


## Open the access review

Use the following steps to find and open the access review:

1. You may receive an email from Microsoft that asks you to review access. Locate the email to open the access review. Here's an example email to review access:
    
    ![Access review reviewer email](./media/entitlement-management-access-reviews-review-access/review-access-reviewer-email.png)

1. Select the **Review user access** link to open the access review. 

1. If you don’t have the email, you can find your pending access reviews by navigating directly to https://myaccess.microsoft.com.  (For US Government, use `https://myaccess.microsoft.us` instead.)

1. Select **Access reviews** on the left navigation bar to see a list of pending access reviews assigned to you.
    
    ![Select access reviews on My Access](./media/entitlement-management-access-reviews-review-access/review-access-myaccess-select-access-review.png)

1. Select the review that you’d like to begin.
    
    ![Select the access review](./media/entitlement-management-access-reviews-review-access/review-access-select-access-review.png)

## Perform the access review

Once you open the access review, you'll see the names of users for which you need to review. There are two ways that you can approve or deny access:
- You can manually approve or deny access for one or more users
- You can accept the system recommendations

### Manually approve or deny access for one or more users
1. Review the list of users and determine which users need to continue to have access.

    ![List of users to review](./media/entitlement-management-access-reviews-review-access/review-access-list-of-users.png)

1. To approve or deny access, select the radio button to the left of the user’s name.

1. Select **Approve** or **Deny** in the bar above the user names.

    ![Select the user](./media/entitlement-management-access-reviews-review-access/review-access-select-users.png)

1. If you aren't sure, you can select the **Don’t know** button.

    If you make this selection, the user maintains access, and this selection goes in the audit logs. The log shows any other reviewers that you still completed the review.

1. You may be required to provide a reason for your decision. Type in a reason and select **Submit**.

    ![Approve or deny access](./media/entitlement-management-access-reviews-review-access/review-access-decision-approve.png)

1. You can change your decision at any time before the end of the review. To do so, select the user from the list and change the decision. For example, you can approve access for a user you previously denied.

If there are multiple reviewers, the last submitted response is recorded. Consider an example where an administrator designates two reviewers – Alice and Bob. Alice opens the review first and approves access. Before the review ends, Bob opens the review and denies access. In this case, the last deny access decision gets recorded.

>[!NOTE]
>If a user is denied access in the review, they aren't removed from the access package immediately. The user will be removed from the access package once the review results are applied after the review is closed. The review will close automatically at the end of the review duration or earlier if an administrator manually stops the review. 

### Approve or deny access using the system-generated recommendations

To review access for multiple users more quickly, you can use the system-generated recommendations, accepting the recommendations with a single select. The recommendations are generated based on the user's sign-in activity.

1. In the bar at the top of the page, select **Accept recommendations**.
    
    ![Select Accept recommendations](./media/entitlement-management-access-reviews-review-access/review-access-use-recommendations.png)
    
    You see a summary of the recommended actions.

1. Select **Submit** to accept the recommendations.

## Next steps

- [Self-review of access packages](entitlement-management-access-reviews-self-review.md)
