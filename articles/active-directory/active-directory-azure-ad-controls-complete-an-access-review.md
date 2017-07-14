---
title: Complete an access review of members of a group or users access to an application with Azure AD Controls| Microsoft Docs
description: Learn how to complete an access review for members of a group or users with access to an application in Azure Active Directory using Azure AD Controls. 
services: active-directory
documentationcenter: ''
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

# Complete an access review of members of a group or users access to an application in Azure AD

Administrators can ask for a review of group members or users assigned to an application by [creating an access review](active-directory-azure-ad-controls-create-an-access-review.md). Azure AD will automatically send the reviewers an email prompting them to review  access. If a user did not get an email, you can send them the instructions
in [how to review access](active-directory-azure-ad-controls-perform-an-access-review.md).  After the access review period is over, or the administrator has stopped the access review, follow the steps in this article to see and apply the results.

## Viewing an access review in the Azure Portal

1. Go to the [Azure AD controls page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/), change to the **Programs** tab and select the program which will contains the access review control.
2. Click on manage and select the access review control.  If there are many controls in the program, you can filter to just controls of a specific type, sort by their status, or search by the name of the access review control or the display name of the owner who created it. 

## Stopping a review that has not yet completed

If the review has not yet reached the scheduled end date, then an administrator can stop the review by clicking the **Stop** button to finish it early.  If any users haven't been reviewed by this time, they won't be able to after you stop the review. You cannot restart a review after it's been stopped.

## Applying the changes 

After an access review is completed, either because it reached the end date or an administrator stopped it manually, the **Apply** button implements the outcome of the review, by updating the group or application. If a user's access was denied in the review, then when an administrator clicks this button, Azure AD will remove their membership or application assignment. 

Note that clicking the Apply button will not have an effect for a group which originates in an on-premises directory, or a dynamic group.  If you wish to change a group that originates on-premises, then download the results and apply those changes to the representation of the group in that directory.

## Downloading the results of the review

To retrieve the results of the review, change to the Approvals tab and click the **Download** button.  The resulting CSV file can be viewed in Excel or in other programs that open CSV files.

## Optional: deleting a review
If you are not interested in the review any further, delete it. The **Delete** button removes the review from Azure AD.

> [!IMPORTANT]
> You will not get a warning before deletion occurs, so be sure that you want to delete that review.
> 
> 



## Next steps
- [Perform an access review](active-directory-azure-ad-controls-perform-an-access-review.md)
- [Create an access review for members of a group or access to an application](active-directory-azure-ad-controls-create-an-access-review.md)


