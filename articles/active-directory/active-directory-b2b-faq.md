---
title: Azure Active Directory B2B collaboration FAQs | Microsoft Docs
description: Get answers to frequently asked questions about Azure Active Directory B2B collaboration.
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
ms.date: 05/23/2017
ms.author: sasubram

---

# Azure Active Directory B2B collaboration FAQs

These frequently asked questions (FAQs) about Azure Active Directory (Azure AD) business-to-business (B2B) collaboration are periodically updated to include new topics.

### Is Azure AD B2B collaboration available in the Azure classic portal?
No. Azure AD B2B collaboration features are available only in the [Azure portal](https://portal.azure.com) and in the [Access Panel](https://myapps.microsoft.com/). 

### Can we customize our sign-in page so it is more intuitive for our B2B collaboration guest users?
Absolutely! See our [blog post about this feature](https://blogs.technet.microsoft.com/enterprisemobility/2017/04/07/improving-the-branding-logic-of-azure-ad-login-pages/). For more information about how to customize your organization's sign-in page, see [Add company branding to sign in and Access Panel pages](active-directory-add-company-branding.md).

### Can B2B collaboration users access SharePoint Online and OneDrive?
Yes. However, the ability to search for existing guest users in SharePoint Online by using the people picker is **Off** by default. To turn on the option to search for existing guest users, set **ShowPeoplePickerSuggestionsForGuestUsers** to **On**. You can turn this setting on either at the tenant level or at the site collection level. You can change this setting by using the Set-SPOTenant and Set-SPOSite cmdlets. With these cmdlets, members can search all existing guest users in the directory. Changes in the tenant scope do not affect SharePoint Online sites that have already been provisioned.

### Is the CSV upload feature still supported?
Yes. For more information about using the .csv file upload feature, see [this PowerShell sample](active-directory-b2b-code-samples.md).

### How can I customize my invitation emails?
You can customize almost everything about the inviter process by using the [B2B invitation APIs](active-directory-b2b-api.md).

### Can an invited external user leave the organization after being invited?
The inviting organization administrator can delete a B2B collaboration guest user from their directory, but the guest user cannot leave the inviting organization directory by themselves. 

### Can guest users reset their multi-factor authentication method?
Yes. Guest users can reset their multi-factor authentication method the same way that regular users do.

### Which organization is responsible for multi-factor authentication licenses?
The inviting organization performs multi-factor authentication. The inviting organization must make sure that the organization has enough licenses for their B2B users who are using multi-factor authentication.

### What if a partner organization already has multi-factor authentication set up? Can we trust their multi-factor authentication, and not use our own multi-factor authentication?
This feature is planned for a future release, so that then you can select specific partners to exclude from your (the inviting organization's) multi-factor authentication.

### How can I use delayed invitations?
An organization might want to add B2B collaboration users, provision them to applications as needed, and then send invitations. You can use the B2B collaboration invitation API to customize the onboarding workflow.

### Can I make a guest user a limited administrator?
Absolutely. For more information, see [Adding guest users to a role](active-directory-users-assign-role-azure-portal.md).

### Does Azure AD B2B collaboration allow B2B users to access the Azure portal?
Unless a user is assigned the role of limited administrator or global administrator, B2B collaboration users won't require access to the Azure portal. However, B2B collaboration users who are assigned the role of limited administrator or global administrator can access the portal. Also, if a guest user who is not assigned one of these admin roles accesses the portal, the user might be able to access certain parts of the experience. The guest user role has some permissions in the directory.

### Can I block access to the Azure portal for guest users?
Yes! When you configure this policy, be careful to avoid accidentally blocking access to members and admins.
To block a guest user's access to the [Azure portal](https://portal.azure.com), use a conditional access policy in the Windows Azure classic deployment model API:
1. Modify the **All Users** group so that it contains only members.
  ![modify the group screenshot](media/active-directory-b2b-faq/modify-all-users-group.png)
2. Create a dynamic group that contains guest users.
  ![create group screenshot](media/active-directory-b2b-faq/group-with-guest-users.png)
3. Set up a conditional access policy to block guest users from accessing the portal, as shown in the following video:
  
  > [!VIDEO https://channel9.msdn.com/Blogs/Azure/b2b-block-guest-user/Player] 

### Does Azure AD B2B collaboration support multi-factor authentication and consumer email accounts?
Yes. Multi-factor authentication and consumer email accounts are both supported for Azure AD B2B collaboration.

### Do you plan to support password reset for Azure AD B2B collaboration users?
Yes. Here are the important details for self-service password reset (SSPR) for a B2B user who is invited from a partner organization:
 
* SSPR occurs only in the identity tenant of the B2B user.
* If the identity tenant is a Microsoft account, the Microsoft account SSPR mechanism is used.
* If the identity tenant is a just-in-time (JIT) or "viral" tenant, a password reset email is sent.
* For other tenants, the standard SSPR process is followed for B2B users. Like member SSPR for B2B users, in the context of the resource, tenancy is blocked. 

### Is password reset available for guest users in a just-in-time (JIT) or "viral" tenant who accepted invitations with a work or school email address, but who didn't have a pre-existing Azure AD account?
Yes. A password reset mail can be sent that allows a user to reset their password in the JIT tenancy.

### Does Microsoft Dynamics CRM provide online support for Azure AD B2B collaboration?
Currently, Microsoft Dynamics CRM does not provide online support for Azure AD B2B collaboration. However, we plan to support this in the future.

### What is the lifetime of an initial password for a newly created B2B collaboration user?
Azure AD has a fixed set of character, password strength, and account lockout requirements that apply equally to all Azure AD cloud user accounts. Cloud user accounts are accounts that are not federated with another identity provider, such as 
* Microsoft account
* Facebook
* Active Directory Federation Services
* Another cloud tenant (for B2B collaboration)

For federated accounts, password policy depends on the policy that is applied in the on-premises tenancy and the user's Microsoft account settings.

### An organization might want to have different experiences in their applications for tenant users and guest users. Is there standard guidance for this? Is the presence of the identity provider claim the correct model to use?
 A guest user can use any identity provider to authenticate. For more information, see [Properties of a B2B collaboration user](active-directory-b2b-user-properties.md). Use the **UserType** property to determine user experience. The **UserType** claim is not currently included in the token. Applications should use the Graph API to query the directory for the user, and to get the UserType.

### Where can I find a B2B collaboration community to share solutions and to submit ideas?
We're constantly listening to your feedback, to improve B2B collaboration. We invite you to share your user scenarios, best practices, and what you like about Azure AD B2B collaboration. Join the discussion in the [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-B2B/bd-p/AzureAD_B2b).
 
We also invite you to submit your ideas and vote for future features at [B2B Collaboration Ideas](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-B2B-Ideas/idb-p/AzureAD_B2B_Ideas).

### Can we send an invitation that is automatically redeemed, so that the user is just “ready to go”? Or does the user always have to click through to the redemption URL?
Invitations that are sent by a user in the inviting organization who is also a member of the partner organization do not require redemption by the B2B user.

We recommend that you invite one user from the partner organization to join the inviting organization. [Add this user to the guest inviter role in the resource organization](active-directory-b2b-add-guest-to-role.md). This user can invite other users in the partner organization by using the sign-in UI, PowerShell scripts, or APIs. Then, B2B collaboration users from that organization aren't required to redeem their invitations.

### How does B2B collaboration work when the invited partner is using federation to add their own on-premises authentication?
If the partner has an Azure AD tenant that is federated to the on-premises authentication infrastructure, on-premises single sign-on (SSO) is automatically achieved. If the partner doesn't have an Azure AD tenant, an Azure AD account is created for new users. 

### I thought Azure AD B2B didn't accept gmail.com and outlook.com email addresses, and that B2C was used for those kinds of accounts?
We are removing the differences between B2B and business-to-company (B2C) collaboration in terms of which identities are supported. The identity used is not a good reason to choose between using B2B or using B2C. For information about choosing your collaboration option, see [Compare B2B collaboration and B2C in Azure Active Directory](active-directory-b2b-compare-b2c.md).

### What applications and services support Azure B2B guest users?
All Azure AD-integrated applications support Azure B2B guest users. 

### Can we force multi-factor authentication for B2B guest users if our partners don't have multi-factor authentication?
Yes. For more information, see [Conditional access for B2B collaboration users](active-directory-b2b-mfa-instructions.md).

### In SharePoint, you can define an "allow" or "deny" list for external users. Can we do this in Azure?
Yes. Azure AD B2B collaboration supports allow lists and deny lists. 

### What licenses do we need to use Azure AD B2B?
For information about what licenses your organization needs to use Azure AD B2B, see [Azure Active Directory B2B collaboration licensing guidance](active-directory-b2b-licensing.md).

### Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure AD admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure AD B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure AD B2B collaboration API and customization](active-directory-b2b-api.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Add B2B collaboration users without an invitation](active-directory-b2b-add-user-without-invite.md)
* [Article index for application management in Azure AD](active-directory-apps-index.md)
