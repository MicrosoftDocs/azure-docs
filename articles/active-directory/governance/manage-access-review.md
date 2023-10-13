---
title: Manage access with access reviews
description: Learn how to manage user and guest access as membership of a group or assignment to an application with Microsoft Entra access reviews
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
 
# Manage user and guest user access with access reviews
 
With access reviews, you can easily ensure that users or guests have appropriate access. You can ask the users themselves or a decision maker to participate in an access review and recertify (or attest) to users' access. The reviewers can give their input on each user's need for continued access based on suggestions from Microsoft Entra ID. When an access review is finished, you can then make changes and remove access from users who no longer need it.
 
> [!NOTE]
> This article discusses conducting access reviews for users and applications. To see information on conducting an access review for multiple resources in access packages see here [Review access of an access package in Microsoft Entra entitlement management](entitlement-management-access-reviews-review-access.md). If you want to review user or service principal access to Microsoft Entra ID or Azure resource roles, see [Start an access review in Microsoft Entra Privileged Identity Management](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md).
 
## Prerequisites
 
- Microsoft Entra ID P2 or Microsoft Entra ID Governance
 
For more information, see [License requirements](access-reviews-overview.md#license-requirements).
 
## Create and perform an access review for users
First, you must be assigned one of the following roles:
- Global administrator
- User administrator
- Identity Governance Administrator 
- Privileged Role Administrator (for reviews of role-assignable groups only)
- (Preview) Microsoft 365 or Microsoft Entra Security Group owner of the group to be reviewed 

Then, go to the [Identity Governance page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/) to ensure that access reviews is ready for your organization.

You can have one or more users as reviewers in an access review.  
 
1. Select a group in Microsoft Entra ID that has one or more members. Or select an application connected to Microsoft Entra ID that has one or more users assigned to it. 
 
2. Decide whether to have each user review their own access or to have one or more users review everyone's access.
 
3. In one of the roles listed above, go to the [Identity Governance page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/).
 
4. Create the access review. For more information, see [Create an access review of groups or applications](create-access-review.md).
 
5. When the access review starts, ask the reviewers to give input. By default, they each receive an email from Microsoft Entra ID with a link to the access panel, where they [review access to groups or applications](self-access-review.md).
 
6. If the reviewers haven't given input, you can ask Microsoft Entra ID to send them a reminder. By default, Microsoft Entra ID automatically sends a reminder halfway to the end date to all reviewers.
 
7. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review of groups or applications](complete-access-review.md).
 
<a name='manage-guest-access-with-azure-ad-access-reviews'></a>

## Manage guest access with Microsoft Entra access reviews
 
With Microsoft Entra ID, you can easily enable collaboration across organizational boundaries by using the [Microsoft Entra B2B feature](../external-identities/what-is-b2b.md). Guest users from other tenants can be [invited by administrators](../external-identities/add-users-administrator.md) or by [other users](../external-identities/what-is-b2b.md). This capability also applies to social identities such as Microsoft accounts.
 
 
 
## Create and perform an access review for guests
 
The same roles required to create an access review for users are also required to create an access review for guests. For more information, see [Create and perform an access review for users](manage-access-review.md#create-and-perform-an-access-review-for-users).

Microsoft Entra ID enables several scenarios for reviewing guest users.
 
You can review either:
 
 - A group in Microsoft Entra ID that has one or more guests as members.
 - An application connected to Microsoft Entra ID that has one or more guest users assigned to it. 
 
When reviewing guest user access to Microsoft 365 groups, you can either create a review for each group individually, or turn on automatic, recurring access reviews of guest users across all Microsoft 365 groups. The following video provides more information on recurring access reviews of guest users: 
 
> [!VIDEO https://www.youtube.com/embed/3D2_YW2DwQ8]
 
You can then decide whether to ask each guest to review their own access or to ask one or more users to review every guest's access.
 
 These scenarios are covered in the following sections.
 
### Ask guests to review their own membership in a group
 
You can use access reviews to ensure that users who were invited and added to a group continue to need access. You can easily ask guests to review their own membership in that group.
 
1. To create an access review for the group, select the review to include guest user members only and that members review themselves. For more information, see [Create an access review of groups or applications](create-access-review.md).
 
2. Ask each guest to review their own membership. By default, each guest who accepted an invitation receives an email from Microsoft Entra ID with a link to the access review. Microsoft Entra ID has instructions for guests on how to [review access to groups or applications](self-access-review.md).
 
3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review of groups or applications](complete-access-review.md).
 
4.  In addition to those users who denied their own need for continued access, you can also remove users who didn't respond.
 
5. If the group isn't used for access management, you also can remove users who weren't selected to participate in the review because they didn't accept their invitation. Not accepting might indicate that the invited user's email address had a typo. If a group is used as a distribution list, perhaps some guest users weren't selected to participate because they're contact objects.
 
### Ask a sponsor to review a guest's membership in a group
 
You can ask a sponsor, such as the owner of a group, to review a guest's need for continued membership in a group.
 
1. To create an access review for the group, select the review to include guest user members only. Then specify one or more reviewers. For more information, see [Create an access review of groups or applications](create-access-review.md).
 
2. Ask the reviewers to give input. By default, they each receive an email from Microsoft Entra ID with a link to the access panel, where they [review access to groups or applications](self-access-review.md).
 
3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review of groups or applications](complete-access-review.md).

> [!NOTE]
>  You can block external identities from signing-in to your tenant and delete the external identities from your tenant after 30 days. During this period, settings, results, reviewers or Audit logs under the current review won't be viewable or configurable. For more information, see  [Disable and delete external identities with Microsoft Entra access reviews
](access-reviews-external-users.md#disable-and-delete-external-identities-with-azure-ad-access-reviews).

 
### Ask guests to review their own access to an application
 
You can use access reviews to ensure that users who were invited for a particular application continue to need access. You can easily ask the guests themselves to review their own need for access.
 
1. To create an access review for the application, select the review to include guests only and that users review their own access. For more information, see
 [Create an access review of groups or applications](create-access-review.md).
 
2. Ask each guest to review their own access to the application. By default, each guest who accepted an invitation receives an email from Microsoft Entra ID. That email has a link to the access review in your organization's access panel. Microsoft Entra ID has instructions for guests on how to [review access to groups or applications](self-access-review.md).
 
3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review of groups or applications](complete-access-review.md).
 
4. In addition to users who denied their own need for continued access, you also can remove guest users who didn't respond. You also can remove guest users who weren't selected to participate, especially if they weren't recently invited. Those users didn't accept their invitation and so didn't have access to the application. 
 
### Ask a sponsor to review a guest's access to an application
 
You can ask a sponsor, such as the owner of an application, to review guest's need for continued access to the application.
 
1. To create an access review for the application, select the review to include guests only. Then specify one or more users as reviewers. For more information, see [Create an access review of groups or applications](create-access-review.md).
 
2. Ask the reviewers to give input. By default, they each receive an email from Microsoft Entra ID with a link to the access panel, where they [review access to groups or applications](self-access-review.md).
 
3. After the reviewers give input, stop the access review and apply the changes. For more information, see [Complete an access review of groups or applications](complete-access-review.md).
 
### Ask guests to review their need for access, in general
 
In some organizations, guests might not be aware of their group memberships.
 
 
1. Create a security group in Microsoft Entra ID with the guests as members, if a suitable group doesn't already exist. For example, you can create a group with a manually maintained membership of guests. Or, you can create a dynamic group with a name such as "Guests of Contoso" for users in the Contoso tenant who have the UserType attribute value of Guest. Keep in mind that a guest user who is a member of the group can see the other members of the group.
 
2. To create an access review for that group, select the reviewers to be the members themselves. For more information, see [Create an access review of groups or applications](create-access-review.md).
 
3. Ask each guest to review their own membership. By default, each guest who accepted an invitation receives an email from Microsoft Entra ID with a link to the access review in your organization's access panel. Microsoft Entra ID has instructions for guests on how to [review access to groups or applications](perform-access-review.md). 
 
4. After the reviewers give input, stop the access review. For more information, see [Complete an access review of groups or applications](complete-access-review.md).
 
5. Remove guest access for guests who were denied, didn't complete the review, or didn't previously accept their invitation. If some of the guests are contacts who were selected to participate in the review or they didn't previously accept an invitation, you can disable their accounts by using the Microsoft Entra admin center or PowerShell. If the guest no longer needs access and isn't a contact, you can remove their user object from your directory by using the Microsoft Entra admin center or PowerShell to delete the guest user object.

 
## Next steps
 
[Create an access review of groups or applications](create-access-review.md)
