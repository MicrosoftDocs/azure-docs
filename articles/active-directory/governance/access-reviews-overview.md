---
title: What are access reviews? - Microsoft Entra
description: Using access reviews, you can control group membership and application access to meet governance, risk management, and compliance initiatives in your organization.
services: active-directory
documentationcenter: ''
author: owinfreyATL
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: overview
ms.subservice: compliance
ms.date: 06/28/2023
ms.author: owinfrey
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
ms.custom: contperf-fy21q1
---

# What are access reviews?

Access reviews in Microsoft Entra ID, part of Microsoft Entra, enable organizations to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed regularly to make sure only the right people have continued access.

Here's a video that provides a quick overview of access reviews:

>[!VIDEO https://www.youtube.com/embed/kDRjQQ22Wkk]

## Why are access reviews important?

Microsoft Entra ID enables you to collaborate with users from inside your organization and with external users. Users can join groups, invite guests, connect to cloud apps, and work remotely from their work or personal devices. The convenience of using self-service has led to a need for better access management capabilities.

- As new employees join, how do you ensure they have the access they need to be productive?
- As people move teams or leave the company, how do you make sure that their old access is removed?
- Excessive access rights can lead to compromises.
- Excessive access right may also lead audit findings as they indicate a lack of control over access.
- You have to proactively engage with resource owners to ensure they regularly review who has access to their resources.

## When should you use access reviews?

- **Too many users in privileged roles:** It's a good idea to check how many users have administrative access, how many of them are Global Administrators, and if there are any invited guests or partners that haven't been removed after being assigned to do an administrative task. You can recertify the role assignment users in [Microsoft Entra roles](../privileged-identity-management/pim-perform-roles-and-resource-roles-review.md?toc=/azure/active-directory/governance/toc.json) such as Global Administrators, or [Azure resources roles](../privileged-identity-management/pim-perform-roles-and-resource-roles-review.md?toc=/azure/active-directory/governance/toc.json) such as User Access Administrator in the [Microsoft Entra Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) experience.
- **When automation is not possible:** You can create rules for dynamic membership on security groups or Microsoft 365 Groups, but what if the HR data isn't in Microsoft Entra ID or if users still need access after leaving the group to train their replacement? You can then create a review on that group to ensure those who still need access should have continued access.
- **When a group is used for a new purpose:** If you have a group that is going to be synced to Microsoft Entra ID, or if you plan to enable the application Salesforce for everyone in the Sales team group, it would be useful to ask the group owner to review the group membership prior to the group being used in a different risk content.
- **Business critical data access:** for certain resources, such as [business critical applications](identity-governance-applications-prepare.md), it might be required as part of compliance processes to ask people to regularly reconfirm and give a justification on why they need continued access.
- **To maintain a policy's exception list:** In an ideal world, all users would follow the access policies to secure access to your organization's resources. However, sometimes there are business cases that require you to make exceptions. As the IT admin, you can manage this task, avoid oversight of policy exceptions, and provide auditors with proof that these exceptions are reviewed regularly.
- **Ask group owners to confirm they still need guests in their groups:** Employee access might be automated with some on premises Identity and Access Management (IAM), but not invited guests. If a group gives guests access to business sensitive content, then it's the group owner's responsibility to confirm the guests still have a legitimate business need for access.
- **Have reviews recur periodically:** You can set up recurring access reviews of users at set frequencies such as weekly, monthly, quarterly or annually, and the reviewers are notified at the start of each review. Reviewers can approve or deny access with a friendly interface and with the help of smart recommendations.

>[!NOTE]
>If you are ready to try Access reviews take a look at [Create an access review of groups or applications](create-access-review.md)

## Where do you create reviews?

Depending on what you want to review, you'll either create your access review in access reviews, Microsoft Entra enterprise apps (in preview), PIM, or entitlement management.

| Access rights of users | Reviewers can be | Review created in | Reviewer experience |
| --- | --- | --- | --- |
| Security group members</br>Office group members | Specified reviewers</br>Group owners</br>Self-review | access reviews</br>Microsoft Entra groups | Access panel |
| Assigned to a connected app | Specified reviewers</br>Self-review | access reviews</br>Microsoft Entra enterprise apps (in preview) | Access panel |
| Microsoft Entra role | Specified reviewers</br>Self-review | [PIM](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md?toc=/azure/active-directory/governance/toc.json) | Microsoft Entra Admin Center |
| Azure resource role | Specified reviewers</br>Self-review | [PIM](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md?toc=/azure/active-directory/governance/toc.json) | Microsoft Entra Admin Center |
| Access package assignments | Specified reviewers</br>Group members</br>Self-review | entitlement management | Access panel |

## License requirements

[!INCLUDE [active-directory-p2-governance-license.md](../../../includes/active-directory-p2-governance-license.md)]

>[!NOTE]
>Creating a review on inactive users and with [user-to-group affiliation](review-recommendations-access-reviews.md#user-to-group-affiliation) recommendations requires a Microsoft Entra ID Governance license.

## Next steps

- [Prepare for an access review of users' access to an application](access-reviews-application-preparation.md)
- [Create an access review of groups or applications](create-access-review.md)
- [Create an access review of users in a Microsoft Entra administrative role](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md?toc=/azure/active-directory/governance/toc.json)
- [Review access to groups or applications](perform-access-review.md)
- [Complete an access review of groups or applications](complete-access-review.md)
