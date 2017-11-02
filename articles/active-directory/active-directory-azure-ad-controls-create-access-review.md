---
title: Create an access review for members of a group or users with access to an application with Azure AD| Microsoft Docs
description: Learn how to create an access review for members of a group or users with access to an application. 
services: active-directory
author: markwahl-msft
manager: femila
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/19/2017
ms.author: billmath
---

# Create an access review of group members or application access with Azure AD

Access assignments become "stale" when users have access they don't need any more. To reduce the risk associated with stale access assignments, administrators can use Azure Active Directory (Azure AD) to create an access review for group members or users assigned to an application. For more information on these scenarios, see 
[Manage user access](active-directory-azure-ad-controls-manage-user-access-with-access-reviews.md) and [Manage guest access](active-directory-azure-ad-controls-manage-guest-access-with-access-reviews.md). 

## Create an access review

1. As a global administrator, go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/), and select **Programs**.

2. Select the program that holds the access review control you want to create. **Default Program** is always present, or you can create a different program. For example, you can choose to have one program for each compliance initiative or business goal.

3. Within the program, select **Controls**, and then select **Add** to add a control.

4. Name each access review. Optionally, give each review a description. The name is shown to the reviewers.

5. Set the start and end dates. By default, an access review starts the same day it's created, and it ends in one month. You can change the start and end dates to have an access review start in the future and last however many days you want.

6. Access reviews can be for the members of a group or for users who were assigned to an application. You can further scope the access review to review only the guest users who are members (or assigned to the app), rather than reviewing all the users who are members or who have access to the application.

7. Select either one or more people to review all the users in scope. Or you can select to have the members review their own access. If the resource is a group, you can ask the group owners to review. You also can require that the reviewers supply a reason when they approve access.

8. Finally, select **Start**.


## Manage the access review

By default, Azure AD sends an email to reviewers shortly after the review starts. If you choose not to have Azure AD send the email, be sure to inform the reviewers that an access review is waiting for them to complete. You can show them the instructions for how to [review access](active-directory-azure-ad-controls-perform-access-review.md). If your review is for guests to review their own access, show them the instructions for how to [review your own access](active-directory-azure-ad-controls-perform-access-review.md).

If some of the reviewers are guests, guests are notified via email only if they've already accepted their invitation.


You can track the progress as the reviewers complete their reviews in the Azure AD dashboard in the **Access Reviews** section. No access rights are changed in the directory until [the review is completed](active-directory-azure-ad-controls-complete-access-review.md).

## Next steps

When an access review has started, Azure AD automatically sends reviewers an email that prompts them to review access. If a user didn't get an email, you can send them the instructions
for how to [review access](active-directory-azure-ad-controls-perform-access-review.md). 

After the access review period is over or the administrator stops the access review, follow the steps in [Complete an access review](active-directory-azure-ad-controls-complete-access-review.md) to see and apply the results.


