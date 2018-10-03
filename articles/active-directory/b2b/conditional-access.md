---
title: Conditional access for Azure Active Directory B2B collaboration users | Microsoft Docs
description: Azure Active Directory B2B collaboration supports multi-factor authentication (MFA) for selective access to your corporate applications

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: conceptual
ms.date: 09/11/2017

ms.author: mimart
author: msmimart
manager: mtillman
ms.reviewer: sasubram

---

# Conditional access for B2B collaboration users

## Multi-factor authentication for B2B users
With Azure AD B2B collaboration, organizations can enforce multi-factor authentication (MFA) policies for B2B users. These policies can be enforced at the tenant, app, or individual user level, the same way that they are enabled for full-time employees and members of the organization. MFA policies are enforced at the resource organization.

Example:
1. Admin or information worker in Company A invites user from company B to an application *Foo* in company A.
2. Application *Foo* in company A is configured to require MFA on access.
3. When the user from company B attempts to access app *Foo* in the company A tenant, they are asked to complete an MFA challenge.
4. The user can set up their MFA with company A, and chooses their MFA option.
5. This scenario works for any identity (Azure AD or MSA, for example, if users in Company B authenticate using social ID)
6. Company A must have sufficient Premium Azure AD licenses that support MFA. The user from company B consumes this license from company A.

The inviting tenancy is always responsible for MFA for users from the partner organization, even if the partner organization has MFA capabilities.

### Setting up MFA for B2B collaboration users
To discover how easy it is to set up MFA for B2B collaboration users, see how in the following video:

>[!VIDEO https://channel9.msdn.com/Blogs/Azure/b2b-conditional-access-setup/Player]

### B2B users MFA experience for offer redemption
Check out the following animation to see the redemption experience:

>[!VIDEO https://channel9.msdn.com/Blogs/Azure/MFA-redemption/Player]

### MFA reset for B2B collaboration users
Currently, the admin can require B2B collaboration users to proof up again only by using the following PowerShell cmdlets:

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
  Get-MsolUser | where { $_.StrongAuthenticationMethods} | select UserPrincipalName, @{n="Methods";e={($_.StrongAuthenticationMethods).MethodType}}
  ```

3. Reset the MFA method for a specific user to require the B2B collaboration user to set proof-up methods again. Example:

  ```
  Reset-MsolStrongAuthenticationMethodByUpn -UserPrincipalName gsamoogle_gmail.com#EXT#@ WoodGroveAzureAD.onmicrosoft.com
  ```

### Why do we perform MFA at the resource tenancy?

In the current release, MFA is always in the resource tenancy, for reasons of predictability. For example, let’s say a Contoso user (Sally) is invited to Fabrikam and Fabrikam has enabled MFA for B2B users.

If Contoso has MFA policy enabled for App1 but not App2, then if we look at the Contoso MFA claim in the token, we might see the following issue:

* Day 1: A user has MFA in Contoso and is accessing App1, then no additional MFA prompt is shown in Fabrikam.

* Day 2: The user has accessed App 2 in Contoso, so now when accessing Fabrikam, they must register for MFA there.

This process can be confusing and could lead to drop in sign-in completions.

Moreover, even if Contoso has MFA capability, it is not always the case the Fabrikam would trust the Contoso MFA policy.

Finally, resource tenant MFA also works for MSAs and social IDs and for partner orgs that do not have MFA set up.

Therefore, the recommendation for MFA for B2B users is to always require MFA in the inviting tenant. This requirement could lead to double MFA in some cases, but whenever accessing the inviting tenant, the end-users experience is predictable: Sally must register for MFA with the inviting tenant.

### Device-based, location-based, and risk-based conditional access for B2B users

When Contoso enables device-based conditional access policies for their corporate data, access is prevented from devices that are not managed by Contoso and not compliant with the Contoso device policies.

If the B2B user’s device isn't managed by Contoso, access of B2B users from the partner organizations is blocked in whatever context these policies are enforced. However, Contoso can create exclusion lists containing specific partner users to exclude them from the device-based conditional access policy.

#### Location-based conditional access for B2B

Location-based conditional access policies can be enforced for B2B users if the inviting organization is able to create a trusted IP address range that defines their partner organizations.

#### Risk-based conditional access for B2B

Currently, risk-based sign-in policies cannot be applied to B2B users because the risk evaluation is performed at the B2B user’s home organization.

## Next steps

See the following articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [Azure AD B2B collaboration licensing](licensing-guidance.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](faq.md)
