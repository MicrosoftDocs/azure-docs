---
title: Review access of an access package in Azure AD entitlement management
description: Learn how to complete an access review of entitlement management access packages in Azure Active Directory access reviews (Preview).
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 11/01/2019
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want to review the active assignments of my users to ensure everyone has the appropriate access.

---
# Review access of an access package in Azure AD entitlement management

Azure AD entitlement management simplifies how enterprises manage access to groups, applications, and SharePoint sites. This article describes how to perform access reviews for other users that are assigned to an access package as a designated reviewer.

## Prerequisites

To review users' active access package assignments, you must meet the prerequisites to do an access review:
- Azure AD Premium P2
- Global administrator
- Designated User administrator, Catalog owner, or Access package manager

For more information, see [License requirements](entitlement-management-overview.md#license-requirements).


## Open the access review

Use the following steps to find and open the access review:

1. You may receive an email from Microsoft that asks you to review access. Locate the email to open the access review. Here is an example email to review access:
    
    ![Access review reviewer email](./media/entitlement-management-access-reviews-review-access/review-access-reviewer-email.png)

1. Click the **Review user access** link to open the access review. 

1. If you don’t have the email, you can find your pending access reviews by navigating directly to https://myaccess.microsoft.com.  (For US Government, use `https://myaccess.microsoft.us` instead.)

1. Click **Access reviews** on the left navigation bar to see a list of pending access reviews assigned to you.
    
    ![Select access reviews on My Access](./media/entitlement-management-access-reviews-review-access/review-access-myaccess-select-access-review.png)

1. Click the review that you’d like to begin.
    
    ![Select the access review](./media/entitlement-management-access-reviews-review-access/review-access-select-access-review.png)

## Perform the access review

Once you open the access review, you will see the names of users for which you need to review. There are two ways that you can approve or deny access:
- You can manually approve or deny access for one or more users
- You can accept the system recommendations

### Manually approve or deny access for one or more users
1. Review the list of users and determine which users need to continue to have access.

    ![List of users to review](./media/entitlement-management-access-reviews-review-access/review-access-list-of-users.png)

1. To approve or deny access, select the radio button to the left of the user’s name.

1. Select **Approve** or **Deny** in the bar above the user names.

    ![Select the user](./media/entitlement-management-access-reviews-review-access/review-access-select-users.png)

1. If you aren't sure, you can click the **Don’t know** button.

    If you make this selection, the user maintains access, and this selection goes in the audit logs. The log shows any other reviewers that you still completed the review.

1. You may be required to provide a reason for your decision. Type in a reason and click **Submit**.

    ![Approve or deny access](./media/entitlement-management-access-reviews-review-access/review-access-decision-approve.png)

1. You can change your decision at any time before the end of the review. To do so, select the user from the list and change the decision. For example, you can approve access for a user you previously denied.

If there are multiple reviewers, the last submitted response is recorded. Consider an example where an administrator designates two reviewers – Alice and Bob. Alice opens the review first and approves access. Before the review ends, Bob opens the review and denies access. In this case, the last deny access decision gets recorded.

>[!NOTE]
>If a user is denied access, they aren't removed from the access package immediately. The user will be removed from the access package when the review ends, or an administrator ends the review.

### Approve or deny access using the system-generated recommendations

To review access for multiple users more quickly, you can use the system-generated recommendations, accepting the recommendations with a single click. The recommendations are generated based on the user's sign-in activity.

1.	In the bar at the top of the page, click **Accept recommendations**.
    
    ![Select Accept recommendations](./media/entitlement-management-access-reviews-review-access/review-access-use-recommendations.png)
    
    You'll see a summary of the recommended actions.

1.	Click **Submit** to accept the recommendations.

## Next steps

- [Self-review of access packages](entitlement-management-access-reviews-self-review.md)