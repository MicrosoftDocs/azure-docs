---
title: Azure Active Directory B2B collaboration FAQ | Microsoft Docs
description: Frequently-asked questions about Azure Active Directory B2B collaboration
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
ms.date: 04/13/2017
ms.author: sasubram

---

# Azure Active Directory B2B collaboration frequently-asked questions (FAQ)

Frequently-asked questions is periodically updated to reflect any new interests.

### Is this functionality available in the Azure classic portal?
The new capabilities in Azure AD B2B collaboration are available only through [the Azure portal](https://portal.azure.com) and the new Access Panel. 

### Is it possible to customize our sign-in page so it’s more intuitive for your B2B collaboration guest users?
Absolutely! There's a [blog post explaining the feature](https://blogs.technet.microsoft.com/enterprisemobility/2017/04/07/improving-the-branding-logic-of-azure-ad-login-pages/), and it's documented in [Add company branding to sign-in and Access Panel pages](active-directory-add-company-branding.md).

### Can B2B collaboration users access SharePoint Online and OneDrive?
Yes. However, the ability to search for existing guest users in the SharePoint Online people picker is OFF by default to match legacy behavior. You can enable this using the setting 'ShowPeoplePickerSuggestionsForGuestUsers' at the tenant and site collection level. This can be set using the Set-SPOTenant and Set-SPOSite cmdlets, which allow members to search all existing guest users in the directory. Changes in the tenant scope do not affect already provisioned SharePoint Online sites.

### Is the CSV upload mechanism still supported?
Yes. Refer to the [PowerShell sample](active-directory-b2b-code-samples.md) we have included.

### How can I customize my invitation emails?
You can customize almost anything about the inviter process using the [B2B invitation APIs](active-directory-b2b-api.md).

### Can the invited external user leave the organization to which he was invited?
This is currently not available.

### Now that multi-factor authentication (MFA) is available for guest users, can they also reset their MFA method?
Yes, the same way that regular users can.

### Which organization is responsible for MFA licenses?
The inviting organization is the organization that steps in and performs MFA. Thus, the inviting organization is responsible to make sure they have enough licenses for their B2B users who are performing MFA.

### What if my partner org already has MFA set up? Can we trust their MFA and not use our MFA?
We will be supporting this in future releases. When that is released, you will be able to select specific partners to exclude from the your (inviting organization's) MFA.

### How can I achieve delayed invitations?
Some organizations want to add B2B collaboration users, provision them to applications that require provisioning, and then send the invitations out. If that is you, you can use the B2B collaboration invitation API to customize the onboarding workflow.

### Can I make my guest users limited admins?
Absolutely. If this is what your organization needs, find out how in [Adding guest users to a role](active-directory-users-assign-role-azure-portal.md).

### Does Azure AD B2B collaboration support permitting B2B users to access the Azure portal?
B2B collaboration users should not need to access the Azure portal unless they are assigned a limited administrator or global administrator role. In this case, they can access the portal. If a guest user who is not in these roles accesses the portal, then he/she may be able to access certain parts of the experience because the Guest user role has certain permissions in the directory as described in previous sections.

### Can I block access to the Azure portal for guest users?
Yes! But be careful as you configure this policy to avoid accidentally blocking access to members and admins.
You can block access to the [Azure portal](https://portal.azure.com) by guest users through conditional access policy on Windows Azure Service Management API through the following three steps.
1. Modify the **All Users** group to only contain Members
  ![modify the group screenshot](media/active-directory-b2b-faq/modify-all-users-group.png)
2. Create a dynamic group that contains Guest users
  ![create group screenshot](media/active-directory-b2b-faq/group-with-guest-users.png)
3. Set up a conditional access policy to block guest users from accessing the portal, as shown in the following video.
  
  >[!VIDEO https://channel9.msdn.com/Blogs/Azure/b2b-block-guest-user/Player] 

### What is the timeline by which Azure AD B2B collaboration will start support for MFA and consumer email accounts?
Both MFA and consumer email accounts are supported now.

### Is there a plan to support password reset for Azure AD B2B collaboration users?
Yes. Here are the details about self-service password reset (SSPR)for a B2B user that is invited to a resource tenancy from their identity tenancy:
 
* SSPR will happen only in the identity tenancy of the B2B user
* If the identity tenancy is a Microsoft account – uses the Microsoft account SSPR mechanism
* If the identity tenancy is a just-in-time/viral tenancy, a password reset email will be sent
* For others, the standard SSPR process will be followed for B2B users, similar to members SSPR for B2B users in the context of the resource tenancy will be blocked.

### Is it also enabled for users in a viral tenant?
Not currently.

### Does Microsoft CRM provide online support to Azure AD B2B collaboration?
Work to support this is in progress.

### What is the lifetime of an initial password for a newly created B2B collaboration user?
Azure AD has a fixed set of character, password strength, and account lockout requirements that apply equally to all Azure AD cloud user accounts. Cloud user accounts are the accounts that are not federated with another identity provider such as Microsoft Account, Facebook, ADFS, or even another cloud tenant (in the case of B2B collaboration). For federated accounts, the password policy depends on the policy in the on-premises tenancy and the user's Microsoft account settings.

### Applications want to differentiate their experience between a tenant user and a guest user. Is there standard guidance for this? Is the presence of the identity provider claim the right model for this?
 
A guest user can use any identity provider to authenticate as we discuss in [Properties of a B2B collaboration user](active-directory-b2b-user-properties.md). Hence, the UserType is the right property to determine this. The UserType claim is not currently included in the token. Applications should use Graph API to query the directory for the user and getting their UserType.

### Where can find a B2B collaboration community to share solutions and submit ideas?

We're constantly listening to your feedback on ways to improve B2B collaboration. We invite you join the discussion, share your user scenarios, best practices, and what you like about Azure AD B2B collaboration at the [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-B2B/bd-p/AzureAD_B2b)
 
We also invite you to submit your ideas and vote for future features at the [B2B Collaboration Ideas](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-B2B-Ideas/idb-p/AzureAD_B2B_Ideas) site.

### Is there a way to invite the user such that the invitation is automatically redeemed, and the user is just “ready to go”, or will the user always have to click through to the redemption URL?
Invitations sent by a user in the inviting organization who is also a member in the invited organization (the organization of the B2B user) do not require redemption by the B2B user.

We recommend that you achieve this is by inviting one user from the invited organization into the inviting organization. [Add this user to the Guest inviter role in the resource organization](active-directory-b2b-add-guest-to-role.md). This user can invite other users in the invited organization through sign-in UI, PowerShell scripts, or APIs without requiring the B2B user from that organization to redeem their invitation.

### How does B2B collaboration work when the invited partner is using federation to add their own on-premises authentication?
If the partner has an Azure AD tenant that is federated to the on-premises authentication infrastructure, then on-premises single sign-on (SSO) is automatically achieved. If the partner has no Azure AD tenant, an Azure AD account is created for the user coming in. 

### I didn't think Azure AD B2B would accept gmail.com and outlook.com email addresses. B2C was what you used for those.
We are removing the differences between B2B and B2C regarding which identities are supported. The identity used is not a good pivot to decide between using B2B or B2C. Please refer to this article to help you decide which to use: [Compare B2B collaboration and B2C in Azure Active Directory](active-directory-b2b-compare-b2c.md).

### What applications and services support Azure B2B guest users?
All Azure AD-integrated applications. 

### Is it possible to force MFA for B2B guest users if partners have no MFA enabled?
Yes. Details in [Conditional access for B2B collaboration users](active-directory-b2b-mfa-instructions.md).

### Within SharePoint you can define an "allow" or "deny" list for external users. Any plans to extend this to Azure or across all of Office 365?
Yes. Azure AD B2B collaboration supports allowlist/denylist feature. 

### What licenses are needed for Azure AD B2B?
Please refer to [Azure Active Directory B2B collaboration licensing guidance](active-directory-b2b-licensing.md).

### Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration API and customization](active-directory-b2b-api.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Add B2B collaboration users without an invitation](active-directory-b2b-add-user-without-invite.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
