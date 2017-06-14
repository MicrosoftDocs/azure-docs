---
title: Manage guest access with Azure AD Controls | Microsoft Docs
description: Managing guest users as members of a group or assigned to an application with Azure Active Directory access reviews
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

# Manage guest access with Azure AD Controls


With Azure Active Directory, you can easily enable collaboration across organizational boundaries using the [Azure AD B2B feature](active-directory-b2b-what-is-azure-ad-b2b.md). Guest users from other tenants, as well as with social identities such as Microsoft Accounts, can be [invited by administrators](active-directory-b2b-admin-add-users.md) or by [end users](active-directory-b2b-how-it-works.md).

You can also also easily ensure that guest users have appropriate access, by asking the guests themselves, or a decision maker, to participate in an access review and recertify (or "attest") to the guest's access.  The reviewers can give their input on each user's need for continued access, based on suggestions from Azure AD. When an access review completes, you can then make changes and remove access from guests who no longer need it.

> [!NOTE]
> This document focuses on reviewing guest users' access. If you wish to review all users' access, not just guests, please read instead the guide to [managing user access with access reviews](active-directory-azure-ad-controls-manage-user-access-with-access-reviews.md).  And if you wish to review user's membership in administrative roles such as Global Administrator, see [How to start an access review in Azure AD PIM](active-directory-privileged-identity-management-how-to-start-security-review.md). 
>
>

## Prerequisites 

Access reviews are available with the Premium P2 edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).  Each user who interacts with this feature, for creating a review, reviewing access, or applying a review, requires a license.  

If you will be asking the guest users to review their own access, read more on guest user licensing at [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md).

## Creating and performing an access review for guests

First, enable access reviews to appear on reviewer's access panels.  As a global administrator, go to the [Azure AD controls page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/). 

Azure AD enables several scenarios for reviewing guest users.  Select a group in Azure Active Directory that has one or more guests as members, or an application connected to Azure Active Directory that has one or more guest users assigned to it, and decide whether to have each guest review their own access, or one or more users review every guest's access. Each of these scenarios are covered in one of the following sections.

* [Asking guests to review their own membership in a group](#asking-guests-to-review-their-own-membership-in-a-group)
* [Asking sponsors to review guest's membership in a group](#asking-sponsors-to-review-guests-membership-in-a-group)
* [Asking guests to review their own access to an application](#asking-guests-to-review-their-own-access-to-an-application)
* [Asking sponsors to review guests access to an application](#asking-sponsors-to-review-guests-access-to-an-application) 
* [Asking guests to review their need for access in general](#asking-guests-to-review-their-need-for-access-in-general)


### Asking guests to review their own membership in a group

Access reviews can be used to ensure users who have been invited and added to a group continue to need access.  An easy way is to ask the guests themselves to review their own membership in that group.

1. Start an access review for the group, selecting the review to include guest user members only, and that members review themselves. Read more at [how to create an access review](active-directory-azure-ad-controls-create-an-access-review.md).
2. Ask each guest to review their own membership.  By default, each guest that has accepted an invite will receive an email from Azure AD with a link to the access review in your organization's access panel.  Azure AD has instructions for guests on [how to review their access](active-directory-azure-ad-controls-perform-an-access-review.md).
3. Once the reviewers have given input, stop the access review and apply the changes. Read more at [how to complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md). 
4. In addition to users who denied their own need for continued access, you may wish to also remove users who did not respond, as that the non-responding users are potentially not longer receiving email.
5. If the group is not being used for access management, and not just as a distribution list, you may wish to also remove users who were not selected to participate in the review as they had not accepted their invite, especially if those guests had not been recently invited.  This may indicate that the invited user's email address was a typo.  However, if a group is being used as a distribution list, then some guest users may not have been selected to participate as they are contact objects.

### Asking sponsors to review guest's membership in a group

You can ask a sponsor, such as the owners of a group, to review guest's need for continued membership in a group.

1. Start an access review for the group, selecting the review to include guest user members only, and specifying one or more reviewers. Read more at [how to create an access review](active-directory-azure-ad-controls-create-an-access-review.md).
2. Ask the reviewers to give input. By default, they will each receive an email from Azure AD with a link to the access panel, where they will [perform their access review](active-directory-azure-ad-controls-perform-an-access-review.md).
3. Once the reviewers have given input, stop the access review and apply the changes. Read more at [how to complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md).

### Asking guests to review their own access to an application

Access reviews can be used to ensure users who have been invited for a particular application continue to need access.  An easy way is to ask the guests themselves to review their own need for access.

1. Start an access review for the application, selecting the review to include guests only, and that users review their own access. Read more at
 [how to create an access review](active-directory-azure-ad-controls-create-an-access-review.md).
2. Ask each guest to review their own access to the application.  By default, each guest that has accepted an invite will receive an email from Azure AD with a link to the access review in your organization's access panel.  Azure AD has instructions for guests on [how to review their access](active-directory-azure-ad-controls-perform-an-access-review.md).
3. Once the reviewers have given input, stop the access review and apply the changes. Read more at [how to complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md).
4. In addition to users who denied their own need for continued access, you may wish to also remove the guest users who did not respond, as the non-responding users are potentially no longer receiving email.  You may also wish to remove the guest users who were not selected to participate, especially if the guest had not been recently invited, as those users had not accepted their invite and so would not have access to the application. 

### Asking sponsors to review guest's access to an application


You can ask a sponsor, such as the owners of an application, to review guest's need for continued access to the application.

1. Start an access review for the application, selecting the review to include guests only, and specifying one or more users as reviewers. Read more at [how to create an access review](active-directory-azure-ad-controls-create-an-access-review.md).
2. Ask the reviewers to give input. By default, they will each receive an email from Azure AD with a link to the access panel, where they will [perform their access review](active-directory-azure-ad-controls-perform-an-access-review.md).
3. Once the reviewers have given input, stop the access review and apply the changes. Read more at [how to complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md).

### Asking guests to review their need for access, in general

In some organizations, guests may not be aware of their group.

> [!NOTE]
> Earlier versions of the Azure portal did not permit administrative access to users with UserType of Guest, and in some cases, an administrator in your directory may have changed a guest's UserType value to Member, using PowerShell.  If this has previously occurred in your directory, the query mentioned above may not include all guest users which have historically had administrative access rights, so you will need to either change that guest's UserType, or manually include them in the group membership.

1. Create a group in Azure AD with the guests as members, if a suitable group does not already exist.  For example, you may wish to create a group with a manually maintained membership of guests.  Or, you may wish to create a dynamic group with a name such as "Guests of Contoso" for users in the Contoso tenant that have UserType attribute value of Guest.
2. Start an access review for that group, selecting the reviewers to be the members themselves. Read more at [how to create an access review](active-directory-azure-ad-controls-create-an-access-review.md).
3. Ask each guest to review their own membership.  By default, each guest that has accepted an invite will receive an email from Azure AD with a link to the access review in your organization's access panel.  Azure AD has instructions for guests on [how to review their access](active-directory-azure-ad-controls-perform-an-access-review.md).
4. Once the reviewers have given input, stop the access review. Read more at [how to complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md).
5. Remove the guest access for guests who were denied, did not complete the review, or had not previously accepted their invite.   If some of the guests are contacts who were selected to participate in the review as they had not previously accepted an invite, then you may wish to disable their account from sign on, using the Azure portal or PowerShell.  If the guest no longer needs access and is not a contact, then their user object can be removed from your directory, using the Azure portal or PowerShell.

## Next steps

- [Perform an access review](active-directory-azure-ad-controls-perform-an-access-review.md)
- [Complete an access review of members of a group or access to an application](active-directory-azure-ad-controls-complete-an-access-review.md)
- [Create an access review for members of a group or access to an application](active-directory-azure-ad-controls-create-an-access-review.md)







