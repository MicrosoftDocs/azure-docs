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
ms.date: 02/16/2017
ms.author: sasubram

---

# Azure Active Directory B2B collaboration frequently-asked questions (FAQ)

Frequently-asked questions is periodically updated to reflect any new interests.

### Is this functionality available in the Azure classic portal?
The new capabilities in this Azure AD B2B collaboration public preview refresh are available only through [the Azure portal](https://portal.azure.com) and the new Access Panel. Try it!

### Can B2B collaboration users access SharePoint Online and OneDrive?
Your B2B collaboration guest users are in the directory. You can add them to groups to which you can permission SharePoint Online and OneDrive sites, or even directly pick them from the SharePoint Online people picker. Because these are guest users, the SharePoint Online sites must have external sharing enabled.

### Is the CSV upload mechanism still supported?
Yes. Refer to the PowerShell sample we have included.

### How can I customize my invitation emails?
You can customize almost anything about the inviter process using the B2B invitation APIs.

### Can the invited external user leave the organization to which he was invited?
This is currently not available in this public preview refresh.

### Can I use my Microsoft account (John@contosomicrosoftacct.com) to sign in to resources?
It is not possible during this public preview refresh to use your Microsoft account. If you have a non-standard Microsoft account suffix (possibly for corporate mail such as @contoso.com), an Azure Active Directory tenant will be created for your use.

### Now that multi-factor authentication (MFA) is available for guest users, can they also reset their MFA method?
Yes, the same way that regular users can.

### Which organization is responsible for MFA licenses?
The inviting organization is the organization that steps in and performs MFA. Thus, the inviting organization is responsible to make sure they have enough licenses for their B2B users who are performing MFA.

### What if my partner org already has MFA set up? Can we trust their MFA and not use our MFA?
Not in this public preview refresh, but we will be supporting this in future releases. When that is released, you will be able to select specific partners to exclude from the your (inviting organization's) MFA.

### How can I achieve delayed invitations?
Some organizations want to add B2B collaboration users, provision them to applications that require provisioning, and then send the invitations out. If that is you, you can use the B2B collaboration invitation API to customize the onboarding workflow.

### Can guest users and contacts co-exist?
Your organization might have added contacts representing external collaborators so that they show up in the Global Address List and as email address suggestions during email composition. You might be wondering what happens when you now add these same collaborators as B2B collaboration users in the directory, right? In a future release, B2B collaboration users and your contact objects will be able to co-exist in your company directory. Stay tuned for our announcements!

### Can I make my guest users limited admins?
Absolutely. If this is what your organization needs, find out how in [Adding guest users to a role](active-directory-users-assign-role-azure-portal.md).

### Does Azure AD B2B collaboration support permitting B2B users to access the Azure portal?
B2B collaboration users should not need to access the Azure portal unless they are assigned a limited administrator or global administrator role. In this case, they can access the portal. If a guest user who is not in these roles accesses the portal, then he/she may be able to access certain parts of the experience because the Guest user role has certain permissions in the directory as described in previous sections.

### Can I block access to the Azure portal for guest users?
Yes! But be careful as you configure this policy to avoid accidentally blocking access to members and admins.
You can block access to the [Azure portal](https://portal.azure.com) by guest users through conditional access policy on Windows Azure Service Management API through the following three steps.
1. Modify the **All Users** group to only contain Members
  ![](media/active-directory-b2b-faq/modify-all-users-group.png)
2. Create a dynamic group that contains Guest users
  ![](media/active-directory-b2b-faq/group-with-guest-users.png)
3. Set up a conditional access policy to block guest users from accessing the portal, as shown in the following video.

  >[!VIDEO https://channel9.msdn.com/Blogs/Azure/b2b-block-guest-user/Player]

  If this video does not appear embedded, you can reach it [here](https://channel9.msdn.com/Blogs/Azure/b2b-block-guest-user).

### What is the timeline by which Azure AD B2B collaboration will start support for MFA and consumer email accounts?
Both MFA and consumer email accounts are supported now in this public preview refresh.

### What is the GA timeline for Azure AD B2B?
When we do this depends on the feedback that the current feature set receives from customers.

### Is there a plan to support password reset for Azure AD B2B collaboration users?
Yes, both of these are supported for B2B collaboration (guest) users.

### Is it also enabled for users in a viral tenant?
Not currently.

### Does Microsoft CRM provide online support to Azure AD B2B collaboration?
CRM will provide support to Azure AD B2B collaboration after it is generally available.

### What is the lifetime of an initial password for a newly created B2B collaboration user?
Azure AD has a fixed set of character, password strength, and account lockout requirements that apply equally to all Azure AD cloud user accounts. Cloud user accounts are the accounts that are not federated with another identity provider such as Microsoft Account, Facebook, ADFS, or even another cloud tenant (in the case of B2B collaboration). For federated accounts, the password policy depends on the policy in the on-premises tenancy and the user's Microsoft account settings.

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
