---
title: Start an access review with Azure AD Access Reviews | Microsoft Docs
description: Learn how to start an access review by using Azure Active Directory Access Reviews.
services: active-directory
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: compliance
ms.date: 02/09/2019
ms.author: rolyon
ms.reviewer: mwahl
---

# Start an access review with Azure AD Access Reviews

Azure Active Directory (Azure AD) simplifies how enterprises manage access to applications and members of groups in Azure AD and other Microsoft Online Services with a feature called access reviews. Perhaps you received an email from Microsoft that asks you to review access for members of a group or users with access to an application.

This article describes how to perform an access review.

## Open the access review

The first step to perform an access review is to find and open the access review.

1. Open your email and look for an email from Microsoft that asks you to review access. Here is an example email to review the access for a group.

    ![Review access email](./media/perform-access-review/access-review-email.png)

1. Click the **Start review >** link to open the access review.

If you don't have the email, you can open your access reviews by following these steps.

1. Sign in to the [Azure AD access panel](https://myapps.microsoft.com).

    ![Azure AD access panel](./media/perform-access-review/myapps-access-panel.png)

1. In the upper-right corner of the page, click the user symbol, which displays your name and default organization. If more than one organization is listed, select the organization that requested an access review.

1. On the right side of the page, click the **Access reviews** tile to see a list of the pending access reviews.

    If the tile isn't visible, there are no access reviews to perform for that organization and no action is needed at this time.

    ![Access reviews list](./media/perform-access-review/access-reviews-list.png)

1. Click the **Begin review** link for the access review you want to perform.

## Perform the access review

Once you have opened the access review, you see the names of users who need to be reviewed.

1. Review the list of users to decide whether to approve or deny access.

    If the request was to review your own access, see [Review your own access](review-your-access.md).

    ![Perform access review](./media/perform-access-review/perform-access-review.png)

1. Click row to open the window to specify the action to take.

1. Click **Approve** or **Deny**. (If you don't know the user, you can indicate that too.)

    ![Perform access review](./media/perform-access-review/approve-deny.png)

    The reviewer might require that you supply a reason for approving continued access or group membership.

1. Click **Save**.

    If you want to change your answer and approve a previously denied user or deny a previously approved user, select the row and update the response. You can do this step until the access review is finished.

    If a user is denied access, they aren't removed immediately. They are removed when the review is finished or when an administrator stops the review.

## Next steps

- [Complete an access review of members of a group or users' access to an application in Azure AD](complete-access-review.md)
