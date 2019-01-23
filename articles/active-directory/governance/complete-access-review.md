---
title: Complete an access review of members of a group or users' access to an application with Azure AD| Microsoft Docs
description: Learn how to complete an access review for members of a group or users with access to an application in Azure Active Directory. 
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: compliance
ms.date: 05/02/2018
ms.author: rolyon
ms.reviewer: mwahl
---

# Complete an access review of members of a group or users' access to an application in Azure AD

Administrators can use Azure Active Directory (Azure AD) to [create an access review](create-access-review.md) for group members or users assigned to an application. Azure AD automatically sends reviewers an email that prompts them to review access. If a user didn't get an email, you can send them the instructions
in [Review your access](perform-access-review.md). (Note that guests who are assigned as reviewers but have not accepted the invite will not receive an email from access reviews, as they must first accept an invite prior to reviewing.) After the access review period is over or if an administrator stops the access review, follow the steps in this article to see and apply the results.

## View an access review in the Azure portal

1. Go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/), select **Programs**, and select the program that contains the access review control.

2. Select **Manage**, and select the access review control. If there are many controls in the program, you can filter for controls of a specific type and sort by their status. You also can search by the name of the access review control or the display name of the owner who created it. 

## Stop a review that hasn't finished

If the review hasn't reached the scheduled end date, an administrator can select **Stop** to end the review early. After you stop the review, users can no longer be reviewed. You can't restart a review after it's stopped.

## Apply the changes 

After an access review is finished, either because it reached the end date or an administrator stopped it manually, and auto-apply wasn't configured for the review, you can select **Apply** to manually apply the changes. The outcome of the review is implemented by updating the group or application. If a user's access was denied in the review, when an administrator selects this option, Azure AD removes their membership or application assignment. 

After an access review is finished, and auto-apply was configured, then the status of the review will change from Completed through intermediate states and finally will change to state Applied. You should expect to see denied users, if any, being removed from the resource group membership or app assignment in a few minutes.

A configured auto applying review, or selecting **Apply** doesn't have an effect on a group that originates in an on-premises directory or a dynamic group. If you want to change a group that originates on-premises, download the results and apply those changes to the representation of the group in that directory.

## Download the results of the review

To retrieve the results of the review, select **Approvals** and then select **Download**. The resulting CSV file can be viewed in Excel or in other programs that open UTF-8 encoded CSV files.

## Optional: Delete a review
If you're no longer interested in the review, you can delete it. Select **Delete** to remove the review from Azure AD.

> [!IMPORTANT]
> There's no warning before deletion occurs, so be sure that you want to delete the review.
> 
> 

## Next steps

- [Manage user access with Azure AD access reviews](manage-user-access-with-access-reviews.md)
- [Manage guest access with Azure AD access reviews](manage-guest-access-with-access-reviews.md)
- [Manage programs and controls for Azure AD access reviews](manage-programs-controls.md)
- [Create an access review for members of a group or access to an application](create-access-review.md)
- [Create an access review of users in an Azure AD administrative role](../privileged-identity-management/pim-how-to-start-security-review.md)
