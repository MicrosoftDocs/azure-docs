---
title: Review recommendations for Access reviews - Azure AD
description: Learn how to review access of group members with review recommendations in Azure Active Directory access reviews.
services: active-directory
author: ajburnle
manager: rkarlin
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 7/18/2022
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
---

# Review recommendations for Access reviews 

Decision makers who review users' access and perform access reviews can use system based recommendations to help them decide whether to continue their access or deny their access to resources. For more information about how to use review recommendations, see [Enable decision helpers](create-access-review.md#next-settings).

## Prerequisites
 
- Azure AD Premium P2
 
For more information, see [License requirements](access-reviews-overview.md#license-requirements).

## Inactive user recommendations
A user is considered 'inactive' if they have not signed into the tenant within the last 30 days. This behavior is adjusted for reviews of application assignments, which checks each user's last activity in the app as opposed to the entire tenant. When inactive user recommendations are enabled for an access review, the last sign-in date for each user will be evaluated once the review starts, and any user that has not signed-in within 30 days will be given a recommended action of Deny. Additionally, when these decision helpers are enabled, reviewers will be able to see the last sign-in date for all users being reviewed. This sign-in date (as well as the resulting recommendation) is determined when the review begins and will not get updated while the review is in-progress.

## Peer outlier recommendations
If review decision helpers are enabled by the creator of the access review, reviewers can receive peer outlier recommendations for reviews of group access reviews.

Peer analysis recommendation detects users with outlier access to a group, based on reporting-structure similarity with other group members. The outlier recommendation relies on a scoring mechanism which is calculated by computing the user’s average distance to the remaining users in the group.

A *peer* in an organization’s chart is defined as two or more users who share similar characteristics in the organization's reporting structure. Users who are very distant from all the other group members based on their organization's chart, are considered a “peer outlier” in a group. 

> [!NOTE]
> Currently, this feature is only available for uses in your directory. Use of the peer outlier recommendations is not supported for guest users.


The following image has an example of an organization's reporting structure in a cosmetics company: 

![Example hierarchial organization chart for a cosmetics company](./media/review-recommendations-group-access-reviews/org-chart-example.png)

Based on the reporting structure in the example image, members outside of a division that is under a group review, would be denied access by the system if the peer outlier recommendation was taken by the reviewer. 

For example, Phil who works within the Personal care division is in a group with Debby, Irwin, and Emily who all work within the Cosmetics division. The group is called *Fresh Skin*. If an Access Review for the group Fresh Skin is performed, based on the reporting structure and distance away from the other group members, Phil would be considered an outlier. The system will create a **Deny** recommendation in the group access review.

## Next Steps
- [Create an access review](create-access-review.md)
- [Review access to groups or applications](perform-access-review.md)

