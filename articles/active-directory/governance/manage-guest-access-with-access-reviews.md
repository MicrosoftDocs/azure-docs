---
title: Manage guest access with Azure AD access reviews | Microsoft Docs
description: Manage guest users as members of a group or assigned to an application with Azure Active Directory access reviews
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

# Manage guest access with Azure AD access reviews


With Azure Active Directory (Azure AD), you can easily enable collaboration across organizational boundaries by using the [Azure AD B2B feature](../b2b/what-is-b2b.md). Guest users from other tenants can be [invited by administrators](../b2b/add-users-administrator.md) or by [other users](../b2b/what-is-b2b.md). This capability also applies to social identities such as Microsoft accounts.

You also can easily ensure that guest users have appropriate access. You can ask the guests themselves or a decision maker to participate in an access review and recertify (or attest) to the guests' access. The reviewers can give their input on each user's need for continued access, based on suggestions from Azure AD. When an access review is finished, you can then make changes and remove access for guests who no longer need it.

> [!NOTE]
> This document focuses on reviewing guest users' access. If you want to review all users' access, not just guests, see [Manage user access with access reviews](manage-user-access-with-access-reviews.md). If you want to review users' membership in administrative roles, such as global administrator, see [Start an access review in Azure AD Privileged Identity Management](../privileged-identity-management/pim-how-to-start-security-review.md). 
>
>

## Prerequisites 


Access reviews are available with the Premium P2 edition of Azure AD, which is included in Microsoft Enterprise Mobility + Security, E5. For more information, see [Azure Active Directory editions](../fundamentals/active-directory-whatis.md). Each user who interacts with this feature, including to create a review, fill out a review or confirm their access, requires a license. 

If you plan to ask guest users to review their own access, read about guest user licensing. For more information, see [Azure AD B2B collaboration licensing](../b2b/licensing-guidance.md).

## Create and perform an access review for guests

First, enable access reviews to appear on a reviewer's access panels. As a global administrator or user account administrator, go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/). 

Azure AD enables several scenarios for reviewing guest users.

Select one of the following:

 - A group in Azure AD that has one or more guests as members.
 - An application connected to Azure AD that has one or more guest users assigned to it. 

You can then decide whether to ask each guest to review their own access or to ask one or more users to review every guest's access.

 These scenarios are covered in the following sections.

### Ask guests to review their own membership in a group

You can use access reviews to ensure that users who were invited and added to a group continue to need access. You can easily ask guests to review their own membership in that group.

1. To start an access review for the group, select the review to include guest user members only and that members review themselves. For more information, see [Create an access review](create-access-review.md).

2. Ask each guest to review their own membership. By default, each guest who accepted an invitation receives an email from Azure AD with a link to the access review. Azure AD has instructions for guests on how to [review their access](perform-access-review.md).

3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review](complete-access-review.md).

4. In addition to users who denied their own need for continued access, you can also remove users who didn't respond. Non-responding users potentially no longer receive email.

5. If the group isn't used for access management, you also can remove users who weren't selected to participate in the review because they didn't accept their invitation. Not accepting might indicate that the invited user's email address had a typo. If a group is used as a distribution list, perhaps some guest users weren't selected to participate because they're contact objects.

### Ask a sponsor to review a guest's membership in a group

You can ask a sponsor, such as the owner of a group, to review a guest's need for continued membership in a group.

1. To start an access review for the group, select the review to include guest user members only. Then specify one or more reviewers. For more information, see [Create an access review](create-access-review.md).

2. Ask the reviewers to give input. By default, they each receive an email from Azure AD with a link to the access panel, where they [perform their access review](perform-access-review.md).

3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review](complete-access-review.md).

### Ask guests to review their own access to an application

You can use access reviews to ensure that users who were invited for a particular application continue to need access. You can easily ask the guests themselves to review their own need for access.

1. To start an access review for the application, select the review to include guests only and that users review their own access. For more information, see
 [Create an access review](create-access-review.md).

2. Ask each guest to review their own access to the application. By default, each guest who accepted an invitation receives an email from Azure AD with a link to the access review in your organization's access panel. Azure AD has instructions for guests on how to [review their access](perform-access-review.md).

3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review](complete-access-review.md).

4. In addition to users who denied their own need for continued access, you also can remove guest users who didn't respond. Non-responding users potentially no longer receive email. You also can remove guest users who weren't selected to participate, especially if they weren't recently invited. Those users didn't accept their invitation and so didn't have access to the application. 

### Ask a sponsor to review a guest's access to an application

You can ask a sponsor, such as the owner of an application, to review guest's need for continued access to the application.

1. To start an access review for the application, select the review to include guests only. Then specify one or more users as reviewers. For more information, see [Create an access review](create-access-review.md).

2. Ask the reviewers to give input. By default, they each receive an email from Azure AD with a link to the access panel, where they [perform their access review](perform-access-review.md).

3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review](complete-access-review.md).

### Ask guests to review their need for access, in general

In some organizations, guests might not be aware of their group memberships.

> [!NOTE]
> Earlier versions of the Azure portal didn't permit administrative access by users with the UserType of Guest. In some cases, an administrator in your directory might have changed a guest's UserType value to Member by using PowerShell. If this change previously occurred in your directory, the previous query might not include all guest users who historically had administrative access rights. In this case, you need to either change the guest's UserType or manually include the guest in the group membership.

1. Create a security group in Azure AD with the guests as members, if a suitable group doesn't already exist. For example, you can create a group with a manually maintained membership of guests. Or, you can create a dynamic group with a name such as "Guests of Contoso" for users in the Contoso tenant who have the UserType attribute value of Guest.  For efficiency, ensure the group is predominately guests - don't select a group that has users who don't need to be reviewed.

2. To start an access review for that group, select the reviewers to be the members themselves. For more information, see [Create an access review](create-access-review.md).

3. Ask each guest to review their own membership. By default, each guest who accepted an invitation receives an email from Azure AD with a link to the access review in your organization's access panel. Azure AD has instructions for guests on how to [review their access](perform-access-review.md).  Those guests who didn't accept their invite will appear in the review results as "Not Notified".

4. After the reviewers give input, stop the access review. For more information, see [Complete an access review](complete-access-review.md).

5. Remove guest access for guests who were denied, didn't complete the review, or didn't previously accept their invitation. If some of the guests are contacts who were selected to participate in the review or they didn't previously accept an invitation, you can disable their accounts by using the Azure portal or PowerShell. If the guest no longer needs access and isn't a contact, you can remove their user object from your directory by using the Azure portal or PowerShell to delete the guest user object.

## Next steps

[Create an access review for members of a group or access to an application](create-access-review.md)







