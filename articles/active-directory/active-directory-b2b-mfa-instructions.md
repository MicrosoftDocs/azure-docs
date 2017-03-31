---
title: Multi-factor authentication for Azure Active Directory B2B collaboration users | Microsoft Docs
description: Azure Active Directory B2B collaboration supports multi-factor authentication (MF) for selective access to your corporate applications
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
ms.date: 02/16/2017
ms.author: sasubram

---

# Multi-factor authentication for Azure Active Directory B2B collaboration users

With this Azure AD B2B collaboration public preview refresh, we are introducing the capability for organizations to enforce multi-factor authentication (MFA) policies for B2B collaboration users also. In this refresh, MFA is always enforced at the resource tenancy.

This means:
1. Admin or Information worker in Company A invites user from company B to an application Foo in Company A.
2. Application *Foo* in company A is configured to require MFA on access.
3. When user from company B attempts to access app Foo from company A tenant, they will be asked to complete an MFA challenge as required by company A's MFA policy.
4. User can set up their MFA with company A, choose their MFA option
5. This will work for any identity (Azure AD or MSA for example if users in Company B authenticate using social ID)
6. Company A will need to have adequate premium Azure AD SKUs which support MFA. The user from Company B will consume this license from Company A.
7. In summary, the inviting tenancy is *always* responsible for MFA of B2B collaboration users from the partner organization, not the partner organization itself (even if it has MFA capabilities). In future releases, we will be enabling the inviting organization to trust specific partner organizations' MFA instead of using the inviting organization's MFA.

## Setting up MFA for B2B collaboration users
To discover how easy it is to set up MFA for B2B collaboration users, see how in the following video:

>[!VIDEO https://channel9.msdn.com/Blogs/Azure/b2b-conditional-access-setup/Player]

## B2B users MFA experience for offer redemption
Check out the animation below to see the redemption experience, as shown in the following video:

>[!VIDEO https://channel9.msdn.com/Blogs/Azure/MFA-redemption/Player]

## MFA reset for B2B collaboration users
Currently, the admin can require B2B collaboration users to proof up again only by using the following PowerShell cmdlets. Therefore, the following PowerShell cmdlets should be used if you want to reset a B2B collaboration user's proof up method.

> [!NOTE]
> To use the new cmdlet, you need to install the Azure AD PowerShell V2 module, which you can get from here: https://www.powershellgallery.com/packages/AzureADPreview

1. Connect to Azure AD

  ```
  Connect-MsolService and login
  ```
2. Get all users with proof up methods

  ```
  Get-MsolUser | where { $_.StrongAuthenticationMethods} | select UserPrincipalName, @{n="Methods";e={($_.StrongAuthenticationMethods).MethodType}}
  ```
  Here is an example:

  ```
  PS C:\Users\tjwasser> Get-MsolUser | where { $_.StrongAuthenticationMethods} | select UserPrincipalName,
  @{n="Methods";e={($_.StrongAuthenticationMethods).MethodType}}
  ```

3. Reset the MFA method for a specific user. You can then use that UserPrincipalName to run the reset command to require the B2B collaboration user to set proof-up methods again. Example:

  ```
  Reset-MsolStrongAuthenticationMethodByUpn -UserPrincipalName gsamoogle_gmail.com#EXT#@ WoodGroveAzureAD.onmicrosoft.com
  ```

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration frequently-asked questions (FAQ)](active-directory-b2b-faq.md)
* [Azure Active Directory B2B collaboration API and customization](active-directory-b2b-api.md)
* [Add B2B collaboration users without an invitation](active-directory-b2b-add-user-without-invite.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
