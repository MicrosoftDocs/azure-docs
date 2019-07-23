---
title: Review access for yourself to groups or applications in access reviews - Azure Active Directory | Microsoft Docs
description: Learn how to review your own access to groups or applications in Azure Active Directory access reviews.
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

# Review access for yourself to groups or applications in Azure AD access reviews

Azure Active Directory (Azure AD) simplifies how enterprises manage access to groups or applications in Azure AD and other Microsoft Online Services with a feature called Azure AD access reviews.

This article describes how to review your own access to a group or an application.

## Prerequisites

- Azure AD Premium P2

For more information, see [Which users must have licenses?](access-reviews-overview.md#which-users-must-have-licenses).

## Open the access review

The first step to perform an access review is to find and open the access review.

1. Look for an email from Microsoft that asks you to review access. Here is an example email to review your access to a group.

    ![Example email from Microsoft to review your access to a group](./media/review-your-access/access-review-email.png)

1. Click the **Review access** link to open the access review.

If you don't have the email, you can find your pending access reviews by following these steps.

1. Sign in to the MyApps portal at [https://myapps.microsoft.com](https://myapps.microsoft.com).

    ![MyApps portal listing apps you have permissions to](./media/review-your-access/myapps-access-panel.png)

1. In the upper-right corner of the page, click the user symbol, which displays your name and default organization. If more than one organization is listed, select the organization that requested an access review.

1. On the right side of the page, click the **Access reviews** tile to see a list of the pending access reviews.

    If the tile isn't visible, there are no access reviews to perform for that organization and no action is needed at this time.

    ![Pending access reviews list for your apps and groups](./media/review-your-access/access-reviews-list.png)

1. Click the **Begin review** link for the access review you want to perform.

## Perform the access review

Once you have opened the access review, you can see your access.

1. Review your access and decide whether you still need access.

    If the request is to review access for others, the page will look different. For more information, see [Review access to groups or applications](perform-access-review.md).

    ![Open access review asking whether you still need access to a group](./media/review-your-access/perform-access-review.png)

1. Click **Yes** to keep your access or click **No** to remove your access.

1. If you click **Yes**, you might need to specify a justification in the **Reason** box.

    ![Completed access review asking whether you still need access to a group](./media/review-your-access/perform-access-review-submit.png)

1. Click **Submit**.

    Your selection is submitted and you returned to the MyApps portal.

    If you want to change your response, re-open the access reviews page and update your response. You can change your response at any time until the access review has ended.

    > [!NOTE]
    > If you indicated that you no longer need access, you aren't removed immediately. You are removed when the review has ended or when an administrator stops the review.

## Next steps

- [Complete an access review of groups or applications](complete-access-review.md)
