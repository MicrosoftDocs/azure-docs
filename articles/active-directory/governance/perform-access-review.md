---
title: Start an access review of groups or applications in Azure AD Access Reviews | Microsoft Docs
description: Learn how to start an access review of group members or application access in Azure AD Access Reviews.
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
ms.date: 02/10/2019
ms.author: rolyon
ms.reviewer: mwahl
---

# Start an access review of groups or applications in Azure AD Access Reviews

Azure Active Directory (Azure AD) simplifies how enterprises manage access to applications and members of groups in Azure AD and other Microsoft Online Services with a feature called Azure AD Access Reviews. Perhaps you received an email from Microsoft that asks you to review access.

This article describes how to perform an access review for members of a group or users with access to an application.

## Open the access review

The first step to perform an access review is to find and open the access review.

1. Open your email and look for an email from Microsoft that asks you to review access. Here is an example email to review the access for a group.

    ![Review access email](./media/perform-access-review/access-review-email.png)

1. Click the **Start review >** link to open the access review.

If you don't have the email, you can open your access reviews by following these steps.

1. Sign in to the MyApps portal at [https://myapps.microsoft.com](https://myapps.microsoft.com).

    ![MyApps portal](./media/perform-access-review/myapps-access-panel.png)

1. In the upper-right corner of the page, click the user symbol, which displays your name and default organization. If more than one organization is listed, select the organization that requested an access review.

1. On the right side of the page, click the **Access reviews** tile to see a list of the pending access reviews.

    If the tile isn't visible, there are no access reviews to perform for that organization and no action is needed at this time.

    ![Access reviews list](./media/perform-access-review/access-reviews-list.png)

1. Click the **Begin review** link for the access review you want to perform.

## Perform the access review

Once you have opened the access review, you see the names of users who need to be reviewed.

1. Review the list of users to decide whether to approve or deny access.

    If the request is to review your own access, the page will look different. For more information, see [Review your own access](review-your-access.md).

    ![Perform access review](./media/perform-access-review/perform-access-review.png)

    There are two ways that you can approve or deny access:

    - You can approve and deny each request.
    - You can accept the recommendations.

    Accepting the recommendations is the easiest and quickest way.

1. To approve or deny each request, click row to open the window to specify the action to take.

1. Click **Approve** or **Deny**. (If you don't know the user, you can indicate that too.)

    ![Perform access review](./media/perform-access-review/approve-deny.png)

    The reviewer might require that you supply a reason for approving continued access or group membership.

1. Click **Save**.

    If you want to change your answer and approve a previously denied user or deny a previously approved user, select the row and update the response. You can do this step until the access review is finished.

    If a user is denied access, they aren't removed immediately. They are removed when the review is finished or when an administrator stops the review.

1. If instead you want to just accept the recommended approvals and denies, click **Accept recommendations** in the blue bar at the bottom of the page.

    You see a summary of the recommended approvals and denies. The recommendations are based on your sign-in.

    ![Accept recommendations](./media/perform-access-review/accept-recommendations.png)

1. Click **Ok** to accept the recommended approvals and denies.

## Next steps

- [Complete an access review of groups or applications](complete-access-review.md)
