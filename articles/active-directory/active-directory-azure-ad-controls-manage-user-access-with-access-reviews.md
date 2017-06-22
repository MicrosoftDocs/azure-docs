
---
title: Manage user access with Azure AD Controls | Microsoft Docs
description: Learn how to manage users access as membership of a group or assignment to an application with Azure Active Directory access reviews
services: active-directory
documentationcenter: ''
author: mwahl
manager: femila
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/14/2017
ms.author: billmath
---

# Manage user access with Azure AD Controls

With Azure Active Directory, you can easily ensure that users have appropriate access, by asking the users themselves, or a decision maker, to participate in an access review and recertify (or "attest") to user's access.  The reviewers can give their input on each user's need for continued access, based on suggestions from Azure AD. When an access review completes, you can then make changes and remove access from users who no longer need it.

> [!NOTE]
> If you wish to review only guest users' access, and not review all types of users' access, see [managing guest user access with access reviews](active-directory-azure-ad-controls-manage-guest-access-with-access-reviews.md).  And if you wish to review user's membership in administrative roles such as Global Administrator, see [How to start an access review in Azure AD PIM](active-directory-privileged-identity-management-how-to-start-security-review.md). 
>
>

## Prerequisites 

Access reviews are available with the Premium P2 edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).  Each user who interacts with this feature, for creating a review, reviewing access, or applying a review, requires a license.


## Creating and performing an access review

You can have one or more users as participate in an access review.  Follow the steps below to complete this.

1. Select a group in Azure Active Directory that has one or more members, or an application connected to Azure Active Directory that has one or more users assigned to it. 
2. Decide whether to have each user review their own access, or one or more users review everyone's access.
3. Enable access reviews to appear on reviewer's access panels.  As a global administrator, go to the [Azure AD controls page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/). 
4. Start the access review. Read more at [how to create an access review](active-directory-azure-ad-controls-create-an-access-review.md).
5. Ask the reviewers to give input. By default, they will each receive an email from Azure AD with a link to the access panel, where they will [perform their access review](active-directory-azure-ad-controls-perform-an-access-review.md).
6. Once the reviewers have given input, stop the access review and apply the changes. Read more at [how to complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md).


## Next steps

- [Perform an access review](active-directory-azure-ad-controls-perform-an-access-review.md)
- [Complete an access review of members of a group or access to an application](active-directory-azure-ad-controls-complete-an-access-review.md)
- [Create an access review for members of a group or access to an application](active-directory-azure-ad-controls-create-an-access-review.md)




