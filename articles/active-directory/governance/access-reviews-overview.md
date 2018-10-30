---
title: What are Azure AD access reviews? | Microsoft Docs
description: Using Azure Active Directory access reviews, you can control group membership and application access to meet governance, risk management, and compliance initiatives in your organization.
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
ms.date: 10/29/2018
ms.author: rolyon
ms.reviewer: mwahl
---

# What are Azure AD access reviews?

Azure Active Directory (Azure AD) access reviews enable organizations to efficiently manage group memberships, access to enterprise applications, and privileged role assignments. User's access can be reviewed on a regular basis to make sure only the right people have continued access.

With Azure AD, companies are collaborating with partners outside of their organizations, inviting guests to internal groups, connecting to cloud apps that IT doesn't have control over and granting users to use personal devices for work. Productivity has greatly increased but new challenges around access management also arise. As new employees join, how to ensure they have the right access to be productive, or as people move teams or leave the company, how to ensure their old access is removed, especially when it involves guests? Excessive access rights can lead to audit findings and compromise as they indicate a lack of control over access. As a result, IT needs to proactively engage with resource owners to ensure they are regularly reviewing who has access through their resources.

With access reviews, you can quickly set up recurring access reviews of all users, employees, or guests in groups and applications, and users in administrative roles. Assigned reviewers will be notified and approve or deny access with a friendly interface and with the help of smart recommendations.

Here's a video on a quick overview of access reviews.

>[!VIDEO https://www.youtube.com/embed/kDRjQQ22Wkk]

## Today's use cases

You can recertify the role assignment of administrative users who are assigned to Azure AD directory roles such as global administrator, or Azure subscription roles. It's a good idea to check how many users have administrative access and if there are any invited guests or partners that have not been removed. This capability is included in Azure AD Privileged Identity Management (PIM). If you have enabled Office groups in your organization to leverage the power of self service, enabling anyone in the organization to create groups and invite guests into groups. You'll find it's convenient that guests are gaining access to groups easily, but you also want to make sure that there's oversight over this process. Access reviews can be created on Office and security groups and assign the group owners to confirm who should have continued access, and if the guests are still needed. It is useful to set up recurring reviews on groups that involve business critical data or customer information, and if a group is used for a new purpose. Lastly, users assigned to Azure AD connected applications can also be reviewed, and reviewers will receive recommendations based on the users' sign-in information to make an informative decision.

| Access rights of users | Reviewers can be | Review created in | Reviewer experience |
| --- | --- | --- | --- |
| Azure AD directory role | Users themselves</br>Specified reviewers | Azure AD PIM | Azure portal |
| Azure subscription role | Users themselves</br>Specified reviewers | Azure AD PIM | Azure portal |
| Members of security group</br>Members of Office group | Users themselves</br>Specified reviewers</br>Group owners | Azure AD access reviews</br>Azure AD groups | Access panel |
| Assigned to a connected app | Users themselves</br>Specified reviewers | Azure AD access reviews</br>Azure AD enterprise apps (in preview) | Access panel |

## Get started with access reviews

It's one-click to get started with access reviews. Simply click on the onboard button here in the Azure portal, and if you don't currently have an Azure AD Premium 2 or Enterprise Mobility + Security (EMS) E5 license, get a free trial [here](http://aka.ms/emse5trial).

IT admins can create recurring reviews on users assigned to groups, applications and privileged roles with advanced controls such as auto-apply of decisions and notifications. Reviewers can approve users' continued access or deny it so that their access would be removed. It helps to address risks of users having excessive access and provide more visibility about access rights and risks to users in departments beyond IT.

You can learn more about creating and performing access reviews, or watch a short demo here:

>[!VIDEO https://www.youtube.com/embed/6KB3TZ8Wi40]

If you are ready to deploy access reviews in your organization, follow these simple steps in the video to onboard, train your admins and create your first access review!

>[!VIDEO https://www.youtube.com/embed/X1SL2uubx9M]

## Creating reviews via APIs

New Graph APIs are now available for admins - what can be done through the Azure portal to manage access reviews of groups, apps and Azure AD roles can now be done via APIs. Learn more about APIs [here](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/resources/accessreviews_root) and you can read a code sample article [here](https://techcommunity.microsoft.com/t5/Azure-Active-Directory/Example-of-retrieving-Azure-AD-access-reviews-via-Microsoft/m-p/236096).

## Next steps

- [Create an access review for members of a group or access to an application](create-access-review.md)
- [Create an access review of users in an Azure AD administrative role](../privileged-identity-management/pim-how-to-start-security-review.md)
- [Manage employee access with Azure AD access reviews](manage-user-access-with-access-reviews.md)
- [Manage guest access with Azure AD access reviews](manage-guest-access-with-access-reviews.md)
- [Manage programs and controls for Azure AD access reviews](manage-programs-controls.md)
