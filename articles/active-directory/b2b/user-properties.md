---
title: Properties of an Azure Active Directory B2B collaboration user | Microsoft Docs
description: Azure Active Directory B2B collaboration user properties are configurable

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: conceptual
ms.date: 05/25/2017

ms.author: mimart
author: msmimart
manager: mtillman
ms.reviewer: sasubram

---

# Properties of an Azure Active Directory B2B collaboration user

An Azure Active Directory (Azure AD) business-to-business (B2B) collaboration user is a user with UserType = Guest. This guest user typically is from a partner organization and has limited privileges in the inviting directory, by default.

Depending on the inviting organization's needs, an Azure AD B2B collaboration user can be in one of the following account states:

- State 1: Homed in an external instance of Azure AD and represented as a guest user in the inviting organization. In this case, the B2B user signs in by using an Azure AD account that belongs to the invited tenant. If the partner organization doesn't use Azure AD, the guest user in Azure AD is still created. The requirements are that they redeem their invitation and Azure AD verifies their email address. This arrangement is also called a just-in-time (JIT) tenancy or a "viral" tenancy.

- State 2: Homed in a Microsoft account and represented as a guest user in the host organization. In this case, the guest user signs in with a Microsoft account. The invited user's social identity (google.com or similar), which is not a Microsoft account, is created as a Microsoft account during offer redemption.

- State 3: Homed in the host organization's on-premises Active Directory and synced with the host organization's Azure AD. During this release, you must use PowerShell to manually change the UserType of such users in the cloud.

- State 4: Homed in host organization's Azure AD with UserType = Guest and credentials that the host organization manages.

  ![Displaying the inviter's initials](media/user-properties/redemption-diagram.png)


Now, let's see what an Azure AD B2B collaboration user in State 1 looks like in Azure AD.

### Before invitation redemption

![Before offer redemption](media/user-properties/before-redemption.png)

### After invitation redemption

![After offer redemption](media/user-properties/after-redemption.png)

## Key properties of the Azure AD B2B collaboration user
### UserType
This property indicates the relationship of the user to the host tenancy. This property can have two values:
- Member: This value indicates an employee of the host organization and a user in the organization's payroll. For example, this user expects to have access to internal-only sites. This user would not be considered an external collaborator.

- Guest: This value indicates a user who isn't considered internal to the company, such as an external collaborator, partner, customer, or similar user. Such a user wouldn't be expected to receive a CEO's internal memo, or receive company benefits, for example.

  > [!NOTE]
  > The UserType has no relation to how the user signs in, the directory role of the user, and so on. This property simply indicates the user's relationship to the host organization and allows the organization to enforce policies that depend on this property.

### Source
This property indicates how the user signs in.

- Invited User: This user has been invited but has not yet redeemed an invitation.

- External Active Directory: This user is homed in an external organization and authenticates by using an Azure AD account that belongs to the other organization. This type of sign-in corresponds to State 1.

- Microsoft account: This user is homed in a Microsoft account and authenticates by using a Microsoft account. This type of sign-in corresponds to State 2.

- Windows Server Active Directory: This user is signed in from on-premises Active Directory that belongs to this organization. This type of sign-in corresponds to State 3.

- Azure Active Directory: This user authenticates by using an Azure AD account that belongs to this organization. This type of sign-in corresponds to State 4.
  > [!NOTE]
  > Source and UserType are independent properties. A value of Source does not imply a particular value for UserType.

## Can Azure AD B2B users be added as members instead of guests?
Typically, an Azure AD B2B user and guest user are synonymous. Therefore, an Azure AD B2B collaboration user is added as a user with UserType = Guest by default. However, in some cases, the partner organization is a member of a larger organization to which the host organization also belongs. If so, the host organization might want to treat users in the partner organization as members instead of guests. Use the Azure AD B2B Invitation Manager APIs to add or invite a user from the partner organization to the host organization as a member.

## Filter for guest users in the directory

![Filter guest users](media/user-properties/filter-guest-users.png)

## Convert UserType
Currently, it is possible for users to convert UserType from Member to Guest and vice-versa by using PowerShell. However, the UserType property is supposed to represent the user's relationship to the organization. Therefore, the value of this property should change only if the relationship of the user to the organization changes. If the relationship of the user changes, should issues, like whether the user principal name (UPN) should change, be addressed? Should the user continue to have access to the same resources? Should a mailbox be assigned? Therefore, we do not recommend changing the UserType by using PowerShell as an atomic activity. In addition, in case this property becomes immutable by using PowerShell, we do not recommend taking a dependency on this value.

## Remove guest user limitations
There may be cases where you want to give your guest users higher privileges. You can add a guest user to any role and even remove the default guest user restrictions in the directory to give a user the same privileges as members.

It is possible to turn off the default guest user limitations so that a guest user in the company directory is given the same permissions as a member user.

![Remove guest user limitations](media/user-properties/remove-guest-limitations.png)

## Can I make guest users visible in the Exchange Global Address List?
Yes. By default, guest objects are not visible in your organization's global address list, but you can use Azure Active Directory PowerShell to make them visible. For details, see **Can I make guest objects visible in the global address list?** in [Guest access in Office 365 Groups](https://support.office.com/article/guest-access-in-office-365-groups-bfc7a840-868f-4fd6-a390-f347bf51aff6#PickTab=FAQ). 

## Next steps

* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [B2B collaboration user tokens](user-token.md)
* [B2B collaboration user claims mapping](claims-mapping.md)
