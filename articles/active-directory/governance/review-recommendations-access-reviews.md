---
title: Review recommendations for Access reviews - Azure AD
description: Learn how to review access of group members with review recommendations in Azure Active Directory access reviews.
services: active-directory
author: amsliu
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 8/5/2022
ms.author: amsliu
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

## Next Steps
- [Create an access review](create-access-review.md)
- [Review access to groups or applications](perform-access-review.md)

