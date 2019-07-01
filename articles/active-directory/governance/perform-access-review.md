---
title: Review access to groups or applications in access reviews - Azure Active Directory | Microsoft Docs
description: Learn how to review access of group members or application access in Azure Active Directory access reviews.
services: active-directory
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 05/21/2019
ms.author: rolyon
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
---

# Review access to groups or applications in Azure AD access reviews

Azure Active Directory (Azure AD) simplifies how enterprises manage access to groups and applications in Azure AD and other Microsoft Online Services with a feature called Azure AD access reviews.

This article describes how a designated reviewer performs an access review for members of a group or users with access to an application.

## Prerequisites

- Azure AD Premium P2

For more information, see [Which users must have licenses?](access-reviews-overview.md#which-users-must-have-licenses).

## Open the access review

The first step to perform an access review is to find and open the access review.

1. Look for an email from Microsoft that asks you to review access. Here is an example email to review the access for a group.

    ![Example email from Microsoft to review access to a group](./media/perform-access-review/access-review-email.png)

1. Click the **Start review** link to open the access review.

If you don't have the email, you can find your pending access reviews by following these steps.

1. Sign in to the MyApps portal at [https://myapps.microsoft.com](https://myapps.microsoft.com).

    ![MyApps portal listing apps you have permissions to](./media/perform-access-review/myapps-access-panel.png)

1. In the upper-right corner of the page, click the user symbol, which displays your name and default organization. If more than one organization is listed, select the organization that requested an access review.

1. Click the **Access reviews** tile to see a list of the pending access reviews.

    If the tile isn't visible, there are no access reviews to perform for that organization and no action is needed at this time.

    ![Pending access reviews list for apps and groups](./media/perform-access-review/access-reviews-list.png)

1. Click the **Begin review** link for the access review you want to perform.

## Perform the access review

Once you have opened the access review, you see the names of users who need to be reviewed.

If the request is to review your own access, the page will look different. For more information, see [Review access for yourself to groups or applications](review-your-access.md).

![Open access review listing the users who need to be reviewed](./media/perform-access-review/perform-access-review.png)

There are two ways that you can approve or deny access:

- You can approve or deny access for one or more users, or
- You can accept the system recommendations, which is the easiest and quickest way.

### Approve or deny access for one or more users

1. Review the list of users to decide whether to approve or deny their continued access.

1. To approve or deny access for a single user, click the row to open a window to specify the action to take. To approve or deny access for multiple users, add check marks next to the users and then click the **Review X user(s)** button to open a window to specify the action to take.

1. Click **Approve** or **Deny**. If you are unsure, you can click **Don't know**. Doing so will result in the user maintaining their access, but the selection will be reflected in the audit logs.

    ![Action window that includes Approve, Deny, and Don't know options](./media/perform-access-review/approve-deny.png)

1. If necessary, enter a reason in the **Reason** box.

    The administrator of the access review might require that you supply a reason for approving continued access or group membership.

1. Once you have specified the action to take, click **Save**.

    If you want to change your response, select the row and update the response. For example, you can approve a previously denied user or deny a previously approved user. You can change your response at any time until the access review has ended.

    If there are multiple reviewers, the last submitted response is recorded. Consider an example where an administrator designates two reviewers – Alice and Bob. Alice opens the access review first and approves access. Before the review ends, Bob opens the access review and denies access. The last deny response is what is recorded.

    > [!NOTE]
    > If a user is denied access, they aren't removed immediately. They are removed when the review has ended or when an administrator stops the review.

### Approve or deny access based on recommendations

To make access reviews easier and faster for you, we also provide recommendations that you can accept with a single click. The recommendations are generated based on the user's sign-in activity.

1. In the blue bar at the bottom of the page, click **Accept recommendations**.

    ![Open access review listing showing the Accept recommendations button](./media/perform-access-review/accept-recommendations.png)

    You see a summary of the recommended actions.

    ![Window that displays a summary of the recommended actions](./media/perform-access-review/accept-recommendations-summary.png)

1. Click **Ok** to accept the recommendations.

## Next steps

- [Complete an access review of groups or applications](complete-access-review.md)
