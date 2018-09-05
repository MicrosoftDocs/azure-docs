---
title: Create an access review for members of a group or users with access to an application with Azure AD| Microsoft Docs
description: Learn how to create an access review for members of a group or users with access to an application. 
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
ms.date: 06/21/2018
ms.author: rolyon
ms.reviewer: mwahl
---

# Create an access review of group members or application access with Azure AD

Access assignments become "stale" when users have access they don't need any more. To reduce the risk associated with stale access assignments, administrators can use Azure Active Directory (Azure AD) to create an access review for group members or users assigned to an application. Creating recurring access reviews can be time-saving. If you need to routinely review users who have access to an application or are members of a group, you can define the frequency of those reviews. For more information on these scenarios, see 
[Manage user access](manage-user-access-with-access-reviews.md) and [Manage guest access](manage-guest-access-with-access-reviews.md). 

## Create an access review

1. As a global administrator or user account administrator, go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/), and select **Programs**.

2. Select the program that holds the access review control you want to create. **Default Program** is always present, or you can create a different program. For example, you can choose to have one program for each compliance initiative or business goal.

3. Within the program, select **Controls**, and then select **Add** to add a control.

4. Name the access review. Optionally, give the review a description. The name and description are shown to the reviewers.

5. Set the start date. By default, an access review occurs once, starts the same time it's created, and it ends in one month. You can change the start and end dates to have an access review start in the future and last however many days you want.

6. To make the access review recurring, change the frequency from One time to Weekly, Monthly, Quarterly or Annually, and use the slider or text box to define how many days each review of the recurring series will be open for input from reviewers. For example, the maximum duration for you can set for a monthly review is 27 days, to avoid overlapping reviews. 

7.	The recurring access review series can end in 3 ways: it runs continuously to start reviews indefinitely, until a specific date, or after a defined number of occurrences has been completed. You, another user account administrator, or another global administrator can stop the series after creation by changing the date in Settings, so that it ends on that date.

8. Access reviews can be for the members of a group or for users who were assigned to an application. You can further scope the access review to review only the guest users who are members (or assigned to the app), rather than reviewing all the users who are members or who have access to the application.

9. Select either one or more people to review all the users in scope. Or you can select to have the members review their own access. If the resource is a group, you can ask the group owners to review. You also can require that the reviewers supply a reason when they approve access.

10.	If you wish to manually apply the results when the review completes, click **Start**.  Otherwise, the next section explains how to configure the review to auto apply.

### Configuring an access review with auto-apply

1.	Expand the menu for Upon completion settings and enable Auto apply results to resource. 

2.	In cases where users were not reviewed by the reviewer within the review period, you can have the access review either take the system's recommendation (if enabled) on denying/approving the user's continued access, leave their access unchanged, or remove their access. This will not impact users who have been reviewed by the reviewers manually –if the final reviewer’s decision is Deny, then the user’s access will be removed.

3.	To enable the option to take recommendations should reviewers not respond, expand Advanced settings and enable Show recommendations.
 
4.	Finally, click **Start**.

Based on your selections in Upon completion settings, auto-apply will be executed after the review's end date or when you manually stop the review. The status of the review will change from Completed through intermediate states such as Applying and finally to state Applied. You should expect to see denied users, if any, being removed from the group membership or app assignment in a few minutes.


## Manage the access review

By default, Azure AD sends an email to reviewers shortly after the review starts. If you choose not to have Azure AD send the email, be sure to inform the reviewers that an access review is waiting for them to complete. You can show them the instructions for how to [review access](perform-access-review.md). If your review is for guests to review their own access, show them the instructions for how to [review your own access](perform-access-review.md).

If some of the reviewers are guests, guests are notified via email only if they've already accepted their invitation.

To manage a series of access reviews, navigate to the access review from **Controls**, and you will find upcoming occurrences in Scheduled reviews, and edit the end date or add/remove reviewers accordingly. 

You can track the progress as the reviewers complete their reviews in the Azure AD dashboard in the **Access Reviews** section. No access rights are changed in the directory until [the review is completed](complete-access-review.md).

## Next steps

When an access review has started, Azure AD automatically sends reviewers an email that prompts them to review access. If a user didn't get an email, you can send them the instructions for how to [review access](perform-access-review.md). 

If this is a one-time review, then after the access review period is over or the administrator stops the access review, follow the steps in [Complete an access review](complete-access-review.md) to see and apply the results.  

If this is a review series, then navigate to **Review history** on the access review series page, to select a completed access review.  Upcoming reviews will be listed under **Scheduled review**, where you can edit the duration, and add or remove reviewers for individual reviews.
