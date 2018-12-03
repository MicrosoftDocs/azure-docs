---
title: Retrieve Azure AD access review results| Microsoft Docs
description: How to retrieve the results of Azure Active Directory access reviews.
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
ms.date: 06/21/2018
ms.author: rolyon
ms.reviewer: mwahl
---

# Retrieve access review results

Administrators can use Azure Active Directory (Azure AD) to [create an access review](create-access-review.md) for group members or users assigned to an application.  A user who is in the **Global Administrator**, **User Account Administrator**, **Security Administrator** or **Security Reader** role can also read the results of an access review.  To assign users to one of these roles, a Privileged Role Administrator can use Azure AD PIM to make a user eligible to activate the role, or a Global Administrator can permanently [assign a user to the role](../fundamentals/active-directory-users-assign-role-azure-portal.md).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

## Locating an access review

If you know which program contains the access review, go to the access reviews page, select **Programs**, and select the program that contains the access review control.  Then select **Controls**, and select the access review control. If there are many controls in the program, you can filter for controls of a specific type and sort by their status. You also can search by the name of the access review control or the display name of the owner who created it. 

If you do not know which program contains the access review, go to the access reviews page, and select **Controls**.  You can filter for controls of a specific type and sort by their status, and you also can search by the name of the access review control or the display name of the owner who created it. 

## Retrieving the results for a one-time access review

If the review recurrence type is one time, then the progress of an active access review and the results of a completed access review can be obtained from the **Results** section.  You can type the display name or user principal name of a user whose access is being reviewed to view just that user’s access.  To retrieve all the results of a completed access review, click the **Download** button.

## Retrieving the results for multiple instances of a recurring access review

To view the progress of an active access review that is recurring, click on the **Results** section.  You can type the display name or user principal name of a user whose access is being reviewed.

To view the results of a completed instance of an access review that is recurring, select **Review history**, then select the specific instance from the list of completed access review instances, based on the instance’s start and end date.   The results of this instance can be obtained from the **Results** section.  You can type the display name or user principal name of a user whose access is being reviewed to view just that user’s access.  To retrieve all the results of a completed instance of a recurring access review, click the **Download** button.


## Removing users from an access review

By default, a deleted user will remain deleted in Azure AD for 30 days, during which time they can be restored by an administrator if necessary.  After 30 days, that user is permanently deleted.  In addition, using the Azure Active Directory portal, a Global Administrator can explicitly [permanently delete a recently deleted user](../fundamentals/active-directory-users-restore.md) before that time period is reached.  One a user has been permanently deleted, subsequently data about that user will be removed from active access reviews.  Audit information about deleted users remains in the audit log.

## Next steps

- [Manage user access with Azure AD access reviews](manage-user-access-with-access-reviews.md)
- [Manage guest access with Azure AD access reviews](manage-guest-access-with-access-reviews.md)
- [Manage programs and controls for Azure AD access reviews](manage-programs-controls.md)
- [Create an access review for members of a group or access to an application](create-access-review.md)
- [Create an access review of users in an Azure AD administrative role](../privileged-identity-management/pim-how-to-start-security-review.md)


