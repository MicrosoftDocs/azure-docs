---
title: Manage user access with Azure AD access reviews| Microsoft Docs
description: Learn how to manage users' access as membership of a group or assignment to an application with Azure Active Directory access reviews
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

# Manage user access with Azure AD access reviews

With Azure Active Directory (Azure AD), you can easily ensure that users have appropriate access. You can ask the users themselves or a decision maker to participate in an access review and recertify (or attest) to users' access. The reviewers can give their input on each user's need for continued access based on suggestions from Azure AD. When an access review is finished, you can then make changes and remove access from users who no longer need it.

> [!NOTE]
> If you want to review only guest users' access and not review all types of users' access, see [Manage guest user access with access reviews](manage-guest-access-with-access-reviews.md). If you want to review users' membership in administrative roles such as global administrator, see [Start an access review in Azure AD Privileged Identity Management](../privileged-identity-management/pim-how-to-start-security-review.md). 
>
>

## Prerequisites 


Access reviews are available with the Premium P2 edition of Azure AD, which is included in Microsoft Enterprise Mobility + Security, E5. For more information, see [Azure Active Directory editions](../fundamentals/active-directory-whatis.md). Each user who interacts with this feature, including to create a review, fill out a review or confirm their access, requires a license. 

## Create and perform an access review

You can have one or more users as reviewers in an access review.  

1. Select a group in Azure AD that has one or more members. Or select an application connected to Azure AD that has one or more users assigned to it. 

2. Decide whether to have each user review their own access or to have one or more users review everyone's access.

3. Enable access reviews to appear on the reviewers' access panels. As a global administrator or user account administrator, go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/).

4. Start the access review. For more information, see [Create an access review](create-access-review.md).

5. Ask the reviewers to give input. By default, they each receive an email from Azure AD with a link to the access panel, where they [perform their access review](perform-access-review.md).

6. If the reviewers haven't given input, you can ask Azure AD to send them a reminder. By default, Azure AD automatically sends a reminder halfway to the end date to reviewers who haven't yet responded.

7. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review](complete-access-review.md).


## Next steps

[Create an access review for members of a group or access to an application](create-access-review.md)




