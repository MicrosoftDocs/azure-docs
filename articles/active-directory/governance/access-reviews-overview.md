---
title: What are Azure AD Access Reviews? | Microsoft Docs
description: Using Azure Active Directory Access Reviews, you can control group membership and application access to meet governance, risk management, and compliance initiatives in your organization.
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
ms.date: 11/01/2018
ms.author: rolyon
ms.reviewer: mwahl
---

# What are Azure AD Access Reviews?

Azure Active Directory (Azure AD) Access Reviews enable organizations to efficiently manage group memberships, access to enterprise applications, and privileged role assignments. User's access can be reviewed on a regular basis to make sure only the right people have continued access.

Here's a video that provides a quick overview of Access Reviews:

>[!VIDEO https://www.youtube.com/embed/kDRjQQ22Wkk]

## Why are Access Reviews important?

With Azure AD, companies collaborate with partners outside of their organizations, invite guests to internal groups, connect to cloud apps that IT doesn't have control over, and grant users to use personal devices for work. Productivity has increased significantly, but new challenges around access management also arise.

- As new employees join, how do you ensure they have the right access to be productive?
- As people move teams or leave the company, how do you ensure their old access is removed, especially when it involves guests?
- Excessive access rights can lead to audit findings and compromises as they indicate a lack of control over access.
- You have to proactively engage with resource owners to ensure they are regularly reviewing who has access to their resources.

## What can I do with Access Reviews?

- **Set up recurring reviews**: You can set up recurring Access Reviews of all users, employees, or guests in groups and applications, and users in administrative roles. Assigned reviewers will be notified and approve or deny access with a friendly interface and with the help of smart recommendations.
- **Recertify administrative users**: You can recertify the role assignment of administrative users who are assigned to Azure AD directory roles such as Global Administrator or Azure resource roles. It's a good idea to check how many users have administrative access and if there are any invited guests or partners that have not been removed. This capability is included in Azure AD Privileged Identity Management (PIM).
- **Review access to groups**: If you have enabled Office groups in your organization to leverage the power of self-service, anyone in the organization can create groups and invite guests into groups. It's convenient that guests can easily gain access to groups, but you also want to make sure that there's oversight over this process. Access Reviews can be created on Office and security groups and assign the group owners to confirm who should have continued access, and if the guests are still needed. It is useful to set up recurring reviews on groups that involve business critical data or customer information, and if a group is used for a new purpose.
- **Review users assigned to applications**: Users assigned to Azure AD-connected applications can also be reviewed, and reviewers will receive recommendations based on the users' sign-in information to make an informative decision.

## Where do you create reviews?

Depending on what you want to review, you will create your access review in Azure AD Privileged Identity Management (PIM), Azure AD Access Reviews, or Azure AD enterprise apps (in preview).

| Access rights of users | Reviewers can be | Review created in | Reviewer experience |
| --- | --- | --- | --- |
| Azure AD directory role | Users themselves</br>Specified reviewers | Azure AD PIM | Azure portal |
| Azure resource role | Users themselves</br>Specified reviewers | Azure AD PIM | Azure portal |
| Security group members</br>Office group members | Users themselves</br>Specified reviewers</br>Group owners | Azure AD Access Reviews</br>Azure AD groups | Access panel |
| Assigned to a connected app | Users themselves</br>Specified reviewers | Azure AD Access Reviews</br>Azure AD enterprise apps (in preview) | Access panel |

## Prerequisites

To use Access Reviews, you must have one of the following licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5 license

For more information, see [How to: Sign up for Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) or [Enterprise Mobility + Security E5 Trial](http://aka.ms/emse5trial).

## Get started with Access Reviews

To learn more about creating and performing Access Reviews, watch this short demo:

>[!VIDEO https://www.youtube.com/embed/6KB3TZ8Wi40]

If you are ready to deploy Access Reviews in your organization, follow these steps in the video to onboard, train your administrators, and create your first access review!

>[!VIDEO https://www.youtube.com/embed/X1SL2uubx9M]

## Onboard to  Access Reviews

To onboard to Access Reviews, follow these steps.

1. As a Global Administrator or User Account Administrator, sign in to the [Azure portal](https://portal.azure.com) where you want to use Access Reviews.

1. Click **All services** and find the Access Reviews service.

    ![All services - Access Reviews](./media/access-reviews-overview/all-services-access-reviews.png)

1. Click **Access Reviews**.

    ![Access Reviews onboard](./media/access-reviews-overview/onboard-button.png)

1. In the navigation list, click **Onboard** to open the **Onboard access reviews** page.

    ![Onboard Access Reviews](./media/access-reviews-overview/onboard-access-reviews.png)

1. Click **Create** to start using Access Reviews in the current directory. The next time you start Access Reviews, the options will be enabled.

    ![Access Reviews enabled](./media/access-reviews-overview/access-reviews-enabled.png)

## Create reviews via APIs

Microsoft Graph APIs are available for administrators. What you do to manage Access Reviews of groups, apps, and Azure AD roles in the Azure portal can also be done via APIs. For more information, see the [Azure AD Access Reviews API reference](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/resources/accessreviews_root). For a code sample, see [Example of retrieving Azure AD Access Reviews via Microsoft Graph](https://techcommunity.microsoft.com/t5/Azure-Active-Directory/Example-of-retrieving-Azure-AD-access-reviews-via-Microsoft/m-p/236096).

## Next steps

- [Create an access review for members of a group or access to an application](create-access-review.md)
- [Create an access review of users in an Azure AD administrative role](../privileged-identity-management/pim-how-to-start-security-review.md)
- [What is Azure AD Privileged Identity Management?](../privileged-identity-management/pim-configure.md)
