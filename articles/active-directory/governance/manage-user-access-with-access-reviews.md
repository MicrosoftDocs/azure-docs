---
title: Manage user access with access reviews
description: Learn how to manage users' access as membership of a group or assignment to an application with Microsoft Entra access reviews
services: active-directory
documentationcenter: ''
author: owinfreyATL
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 06/28/2023
ms.author: owinfrey
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
---

# Manage user access with Microsoft Entra access reviews

With Microsoft Entra, you can easily ensure that users have appropriate access. You can ask the users themselves or a decision maker to participate in an access review and recertify (or attest) to users' access. The reviewers can give their input on each user's need for continued access based on suggestions from Microsoft Entra. When an access review is finished, you can then make changes and remove access from users who no longer need it.

> [!NOTE]
> If you want to review only guest users' access and not review all types of users' access, see [Manage guest user access with access reviews](manage-guest-access-with-access-reviews.md). If you want to review users' membership in administrative roles such as global administrator, see [Start an access review in Microsoft Entra Privileged Identity Management](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md).

## Prerequisites

- Microsoft Entra ID P2 or Microsoft Entra ID Governance

For more information, see [License requirements](access-reviews-overview.md#license-requirements).

If you're reviewing access to an application, then before creating the review, see the article on how to [prepare for an access review of users' access to an application](access-reviews-application-preparation.md) to ensure the application is integrated with Microsoft Entra ID.

## Create and perform an access review

You can have one or more users as reviewers in an access review.  

1. Select a group in Microsoft Entra ID that has one or more members. Or select an application connected to Microsoft Entra ID that has one or more users assigned to it. 

2. Decide whether to have each user review their own access or to have one or more users review everyone's access.

3. In one of the following roles: a global administrator, user administrator, or (Preview) an owner of a Microsoft 365 group or Microsoft Entra security group to be reviewed, go to the [Identity Governance page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/).

4. Create the access review. For more information, see [Create an access review of groups or applications](create-access-review.md).

5. When the access review starts, ask the reviewers to give input. By default, they each receive an email from Microsoft Entra ID with a link to the access panel, where they [review access to groups or applications](perform-access-review.md).

6. If the reviewers haven't given input, you can ask Microsoft Entra ID to send them a reminder. By default, Microsoft Entra ID automatically sends a reminder halfway to the end date to reviewers who haven't yet responded.

7. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review of groups or applications](complete-access-review.md).


## Next steps

[Create an access review of groups or applications](create-access-review.md)
