---
title: Create an access review for members of a group or users with access to an application with Azure AD Controls| Microsoft Docs
description: Learn how to create an access review for members of a group or users with access to an application. 
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

# Create an access review with Azure AD Controls

Access assignments become "stale" when users have access they don't need any more.  In order to reduce the risk associated with state access assignments, administrators can ask for a review of group members or users assigned to an application by creating an access review. The guides to 
[managing user access](active-directory-azure-ad-controls-manage-user-access-with-access-reviews.md) and [managing guest access](active-directory-azure-ad-controls-manage-guest-access-with-access-reviews.md) provide more information on these scenarios.  

## How to create an access review


1. As a global administrator, go to the [Azure AD controls page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/) and change to the **Programs** tab.
2. Click on the program which will hold the access review control you wish to create.  There is one program, "Default Program", always present, or you may create a different program.  For example, you may choose to have one program for each compliance initiative or business goal.
3. Within the program, click on Controls, and then click the **Add** button to add a control.
4. Each access review needs to have a name, and may optionally also have a description.  The name is shown to the reviewers.  
5. By default, an access review starts the same day it is created, and is scheduled to end in one month.  You can change the start and end dates to have an access review start in the future and last however many days you wish.
6. Access reviews can be of the members of a group, or users who have been assigned to an application.  You can further scope the access review to only review the guest users who are members (or assigned to the app), rather than reviewing all the users.
7. You can select either one or more people to review all the users in scope, or you can select to have the members review their own access.  You can also require that they supply a reason when approving access.
8. Finally, click **Start**.


## Managing the access review

By default, Azure AD sends an email to the reviewers when the review starts.  If you choose not to have Azure AD send the email, be sure to let  the reviewers know that there's an access review waiting for them to complete.  You can show them the instructions for [how to review access](active-directory-azure-ad-controls-perform-an-access-review.md), or if your review is for guests to review their own access, the instructions for [how to review your own access](active-directory-azure-ad-controls-perform-an-access-review.md).




You can track the progress as the reviewers complete their reviews in the Azure AD  dashboard, in the access reviews section. No access rights will be changed in the directory until [the review completes](active-directory-azure-ad-controls-complete-an-access-review.md).

## Next steps

When an access review has started, Azure AD will automatically send the reviewers an email prompting them to review access. If a user did not get an email, you can send them the instructions
in [Perfrom an access review](active-directory-azure-ad-controls-perform-an-access-review.md).  

After the access review period is over, or the administrator has stopped the access review, follow the steps in [completing an access review](active-directory-azure-ad-controls-complete-an-access-review.md) to see and apply the results.


