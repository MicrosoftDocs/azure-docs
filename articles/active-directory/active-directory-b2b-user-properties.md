---
title: Properties of an Azure Active Directory B2B collaboration user | Microsoft Docs
description: Azure Active Directory B2B collaboration user properties are configurable
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 02/03/2017
ms.author: sasubram

---

# Properties of an Azure Active Directory B2B collaboration user

## Defining a B2B collaboration user
A B2B collaboration user is a user with UserType = Guest, or a guest user. This user typically represents a user from a partner organization and has limited privileges in the inviting directory by default. Depending on the inviting organization's needs, a B2B collaboration user can be in one of the following account states:
1. Homed in an external instance of Azure Active Directory (Azure AD), represented as a guest user in the host organization. In this case, the B2B user signs in with an Azure AD account belonging to his home tenancy. If the external organization that the user belongs to doesn't use Azure AD at the time of invitation, the guest user in Azure AD  is created "just in time" when the user redeems his invitation, after verifying his email address. This is also called a just in time (JIT) tenancy, or sometimes as a viral tenancy.
2. Homed in Microsoft Account, represented as a guest user in the host organization. In this case, the guest user signs in with a Microsoft account. In the Azure AD Public Preview Refresh of B2B collaboration, the invited user's non-MSA social identity (google.com or similar) is created as a Microsoft account just in time during offer redemption.
3. Homed in the host organization's on-premises Active Directory, synced with the host organization's Azure AD. During this release, the UserType of such users in the cloud must be manually changed to guest using PowerShell. We will support this being done automatically as part of Azure AD Connect in future releases.
4. Homed in host organization's AzureAD with UserType = Guest, with credentials managed by the host organization.

  ![displaying the inviter's initials](media/active-directory-b2b-user-properties/redemption-diagram.png)


Now, let's see what a B2B collaboration user in State 1 looks like in Azure AD.

### Before invitation redemption

![before offer redemption](media/active-directory-b2b-user-properties/before-redemption.png)

### After invitation redemption

![after offer redemption](media/active-directory-b2b-user-properties/after-redemption.png)

## Key properties of the B2B collaboration user.

### UserType
This attribute indicates the relationship of the user with the host tenancy. This can have two values:
- Member: An employee of the host organization, a user in the organization's payroll. For example, this is a user who is expected to be able to access internal-only sites. This user would not be considered an external collaborator.
- Guest: This indicates a user that isn't considered internal to the company. They could be an external collaborator, partner, customer, or similar user who isn't expected to get a CEO's internal memo, for example, or get company benefits.

  > ![NOTE]
  > The UserType has no relation with how the user signs in, or which directory role the user belongs to, and so on. This attribute simply indicates the user's relationship with the host organization and allows the organization to enforce any policies that depend on this attribute.

### Source
How the user signs in.

- Invited User: This user has been invited but has not yet redeemed their invitation.

- External Active Directory: This user is homed in an external organization and authenticates with an Azure AD account belonging to the other organization. This corresponds to State 1 above.

- Microsoft Account": This user is homed in MSA and authenticates with a Microsoft Account. This corresponds to State 2 above.

- Windows Server AD:  This user is synced in from on-premises Active Directory belonging to this organization. This corresponds to State 3 above.

- Azure Active Directory: This user authenticates with an Azure AD account belonging to this organization. This corresponds to State 4 above.

  > ![NOTE]
  > Source and UserType are independent attributes. A value of source does not imply a particular UserType.

## Can B2B Users be added as Members instead of Guests?
Typically, a B2B user and Guest user are synonymous. Therefore, B2B collaboration user is added as a user with UserType = Guest by default. However, in some cases, the partner organization is actually more a member of a larger umbrella organization to which the host organization also belongs. If so, the host organization may want to treat users in the partner organization as Members and not Guests. In this case, use the B2B Invitation Manager APIs to add or invite a user from the partner organization to the host organization as a member.

## Filtering for Guest users in the directory

![filter guest users](media/active-directory-b2b-user-properties/filter-guest-users.png)

## Converting UserType
Currently, in PowerShell, it is possible for users to convert UserType from Member to Guest and vice-versa. However, the UserType property is supposed to represent the user's relationship with the organization. Therefore, this property should only change this if the user relationship with the organization has changed. If the user relationship changes, other questions should be answered like, should the UPN change? Should the user continue to have access to the resources they had access to? Should a mailbox be assigned? Therefore, we do not recommend changing the UserType in PowerShell as an atomic activity. In addition, we will be making this property immutable through PowerShell in future releases, so we do not recommend taking a dependency on this value.

## Removing guest user limitations
There may be cases where you want to give your guest users higher privileges. For this, you can add a guest user to any role and even remove the default guest user restrictions in the directory to give them the same privileges as members. Read on to learn more.

It is possible to turn off the default guest user limitations so that guest users in the company directory are given the same directory permissions that a regular user (member) has.

![remove guest user limitations](media/active-directory-b2b-user-properties/remove-guest-limitations.png)

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [Adding a B2B collaboration user to a role](active-directory-b2b-add-guest-to-role.md)
* [Delegate B2bB collaboration invitations](active-directory-b2b-delegate-invitations.md)
* [Dynamic groups and B2B collaboration](active-directory-b2b-dynamic-groups.md)
* [B2B collaboration code and PowerShell samples](active-directory-b2b-code-samples.md)
* [Configure SaaS apps for B2B collaboration](active-directory-b2b-configure-saas-apps.md)
* [B2B collaboration user tokens](active-directory-b2b-user-token.md)
* [B2B collaboration user claims mapping](active-directory-b2b-claims-mapping.md)
* [Office 365 external sharing](active-directory-b2b-o365-external-user.md)
* [B2B collaboration current limitations](active-directory-b2b-current-limitations.md)
