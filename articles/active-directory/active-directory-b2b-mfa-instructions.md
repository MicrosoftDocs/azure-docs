---
title: Conditional access for Azure Active Directory B2B collaboration users | Microsoft Docs
description: Azure Active Directory B2B collaboration supports multi-factor authentication (MFA) for selective access to your corporate applications
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
ms.date: 04/11/2017
ms.author: sasubram

---

# Conditional access for B2B collaboration users

## Multi-factor authentication for B2B users
With Azure AD B2B collaboration, organizations uniquely have the ability to enforce multi-factor authentication policies for B2B users. These policies can be enforced at the tenant level, app level, or individual user level, the same way that these policies can be enabled for full-time employees and members of the organization. MFA policies are enforced at the resource organization.

This means:
1. Admin or information worker in Company A invites user from company B to an application Foo in Company A.
2. Application *Foo* in company A is configured to require MFA on access.
3. When user from company B attempts to access app Foo from company A tenant, they will be asked to complete an MFA challenge as required by company A's MFA policy.
4. User can set up their MFA with company A, choose their MFA option
5. This will work for any identity (Azure AD or MSA for example if users in Company B authenticate using social ID)
6. Company A will need to have adequate premium Azure AD SKUs which support MFA. The user from Company B will consume this license from Company A.

In summary, the inviting tenancy is *always* responsible for MFA of B2B collaboration users from the partner organization, not the partner organization itself (even if it has MFA capabilities).

### Setting up MFA for B2B collaboration users
To discover how easy it is to set up MFA for B2B collaboration users, see how in the following video:

>[!VIDEO https://channel9.msdn.com/Blogs/Azure/b2b-conditional-access-setup/Player]

### B2B users MFA experience for offer redemption
Check out the animation below to see the redemption experience, as shown in the following video:

>[!VIDEO https://channel9.msdn.com/Blogs/Azure/MFA-redemption/Player]

### MFA reset for B2B collaboration users
Currently, the admin can require B2B collaboration users to proof up again only by using the following PowerShell cmdlets. Therefore, the following PowerShell cmdlets should be used if you want to reset a B2B collaboration user's proof up method.

1. Connect to Azure AD

  ```
  $cred = Get-Credential
  Connect-MsolService -Credential $cred
  ```
2. Get all users with proof up methods

  ```
  Get-MsolUser | where { $_.StrongAuthenticationMethods} | select UserPrincipalName, @{n="Methods";e={($_.StrongAuthenticationMethods).MethodType}}
  ```
  Here is an example:

  ```
  PS C:\Users\tjwasserGet-MsolUser | where { $_.StrongAuthenticationMethods} | select UserPrincipalName, @{n="Methods";e={($_.StrongAuthenticationMethods).MethodType}}
  ```

3. Reset the MFA method for a specific user. You can then use that UserPrincipalName to run the reset command to require the B2B collaboration user to set proof-up methods again. Example:

  ```
  Reset-MsolStrongAuthenticationMethodByUpn -UserPrincipalName gsamoogle_gmail.com#EXT#@ WoodGroveAzureAD.onmicrosoft.com
  ```

### Why do we perform MFA at the resource tenancy?

In the current release, MFA is always in the resource tenancy. The reason for this is predictability.

For example, let’s say a Contoso user (Sally) is invited to Fabrikam and Fabrikam has enabled MFA for B2B users.

Now, if Contoso has MFA policy enabled for App1 but not App2 – then if we look at the on the Contoso MFA claim in the token to determine
whether Sally should MFA in Fabrikam or not, the following issue could happen:

* Day 1: Sally has MFA-ed in Contoso because she is accessing App1, then she won’t see the MFA prompt in Fabrikam.

* Day 2: Sally has accessed App 2 in Contoso, so now when she accesses Fabrikam, she will have to register for MFA in Fabrikam.

This can be quite confusing for Sally and likely will lead to drop in sign-in completions.

Moreover, even if Contoso has MFA capability, it is not always the case the Fabrikam would trust the Contoso MFA policy.

Finally, resource tenant MFA also works for MSAs and social IDs and for partner orgs that do not have an MFA set up.

Therefore, the recommendation for MFA for B2B users is to always require resource MFA. This could lead to double MFA in some cases, but whenever accessing resource tenancy, the end-users experience is predictable: Sally must register for MFA with the resource tenancy.

### Device, location and risk-based conditional access for B2B users

When the Contoso org enables device based conditional access policies for their corporate data, access is prevented from unmanaged devices (that is, devices that are not managed by the Contoso organization and not compliant with the Contoso device policies).

If the B2B user’s device is not managed by Contoso, this means that access of B2B users from the partner organizations will be blocked in whatever context these policies are enforced.

It is a high bar to expect users from another organization to have their device managed by the inviting org. Therefore, in future updates, we will be enabling Contoso to trust specific partner’s device compliance status. This would allow Contoso to enforce policies where a user from Fabrikam can access Contoso resources if they are using a Fabrikam managed device as well.

In the meantime, Contoso can create exclusion lists containing specific partner users from the device-based conditional access policy.

#### Location-based conditional access for B2B

Location based conditional access policies can be enforced for B2B users if the inviting organization (for example, Contoso) is able to create a trusted network perimeter (that is, an IP address range) that defines their partner organizations (for example, Fabrikam).

#### Risk-based conditional access for B2B

Currently, sign-in risk based policies cannot be applied for B2B users, because the risk evaluation is performed at the B2B user’s home organization (in other words, the B2B user’s identity tenancy).

For future updates, we are considering federating the risk score from partners (with the partner’s consent) so that Contoso can protect their externally shared apps and data not just from risks that they know about, but risks that they have no way of knowing about, because they might be occurring elsewhere.

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
