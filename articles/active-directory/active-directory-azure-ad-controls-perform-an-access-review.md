---
title: Perform an access review with Azure AD Controls | Microsoft Docs
description: How to review access with using Azure AD Controls.
services: active-directory
author: mwahl
manager: femila
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: billmath
---

# Perform an access review with Azure AD Controls

Azure Active Directory simplifies how enterprises manage access to applications and members of groups in Azure AD and other Microsoft Online Services, with a feature called access reviews.  You may have received an email from Microsoft asking you to review access - members of a group, or users with access to an application. 

## Opening an access review

You can see the pending access reviews by clicking on the link in the email.  If you do not have the email, then you can locate the access reviews by performing the following:

1. Sign into the [Azure AD access panel](https://myapps.microsoft.com).
2. Click on the user icon in the upper-right corner of the page, which displays your name and default organization. If there is more than one organization listed, select the organization which has requested an access review.
3. If there is a tile labeled **Access reviews** on the right side of the page, click it. Otherwise, if the tile is not visible, then there are no access reviews to perform for that organization, and no action is needed at this time.

## Filling out an access review

Select an access review from the list, and you'll see the names of users who need to be reviewed.  You may just see one name - your own - if the request was to review your own access.

For each row on the list, you can decide whether to approve or deny the user's access. You can click on the row and choose whether to approve or deny. (If you don't know, you can respond that too.)

The reviewer may require that you supply a justification for approving continued access or group membership.

## Next steps

Please note that user's denied access is not removed immediately, it can be removed when the review completes or an administrator stops the review. So, if you wish to change your answer and approve a previously denied user, or deny a previously approved user,  then click on the row, reset the response and pick a new response.  You can do this until the access review completes.

- [Complete an access review for members of a group or access to an application](active-directory-azure-ad-controls-complete-an-access-review.md)
- [Create an access review for members of a group or access to an application](active-directory-azure-ad-controls-create-an-access-review.md)





