---

title: Azure Active Directory B2B collaboration invitation redemption | Microsoft Docs
description: Describes the Azure AD B2B collaboration invitation redemption experience for end users, including the agreement to privacy terms.

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: article
ms.date: 05/11/2018

ms.author: twooley
author: twooley
manager: mtillman
ms.reviewer: sasubram

---

# Azure Active Directory B2B collaboration invitation redemption

To collaborate with users from partner organizations through Azure Active Directory (Azure AD) B2B collaboration, you can invite guest users to access shared apps. After a guest user is added to the directory through the user interface, or the user is invited through PowerShell, guest users must go through a first-time consent process where they agree to [privacy terms](#privacy-policy-agreement). This process happens in either of the following ways:

- The guest inviter sends out a direct link to a shared app. The invitee clicks the link to sign in, accepts the privacy terms, and seamlessly accesses the shared resource. (The guest user still receives an invitation email with a redemption URL, but other than some special cases, it's no longer required to use the invitation email.)  
- The guest user receives an invitation email and clicks the redemption URL. As part of first-time sign-in, they're prompted to accept the privacy terms.

## Redemption through a direct link

A guest inviter can invite a guest user by sending out a direct link to a shared app. For the guest user, the redemption experience is as easy as signing in to the app that was shared with them. They can click a link to the app, review and accept the privacy terms, and then seamlessly access the app. In most cases, guest users no longer need to click a redemption URL in an invitation email.
 
There are a few exceptions where even if a direct link is sent, a user must click the redemption URL in the invitation email. This is true in the following cases:

- The user doesn’t have an Azure AD account or a Microsoft account (MSA). In this case, the user must create an MSA before they click the link, or they can use the redemption URL in the invitation email. The redemption process automatically prompts the user to create an MSA.
- Sometimes the invited user object may not have an email address because of a conflict with a contact object (for example, an Outlook contact object). In this case, the user must click the redemption URL in the invitation email.
- The user may sign in with an alias of the email address that was invited. (An alias is an additional email address associated with an email account.) In this case, the user must click the redemption URL in the invitation email.

## Redemption through the invitation email

Users can also redeem an invitation with the invitation email. They receive this email even if they were sent a direct link to a shared app. An invited user can click the redemption URL in the email, and then review and accept the privacy terms. The process is described in more detail here:

1.	After being invited, the invitee receives an invitation through email that's sent from **Microsoft Invitations**.
2.	The invitee selects **Get Started** in the email.
3.	If the invitee doesn't have an Azure AD account or an MSA, they're prompted to create an MSA.
4.	The invitee is redirected to the **Review permissions** screen, where they can review the inviting organization's privacy statement and accept the terms.

## Privacy policy agreement

After any guest user signs in to access resources in a partner organization for the first time, they see a **Review permissions** screen. Here, they can review the inviting organization's privacy statement. A user must accept the use of their information in accordance to the inviting organization's privacy policies to continue.

![Screenshot showing user settings in Access Panel](media/active-directory-b2b-redemption-experience/ConsentScreen.png) 

For information about how you as a tenant administrator can link to your organization's privacy statement, see [How-to: Add your organization's privacy info in Azure Active Directory](https://aka.ms/adprivacystatement).

## Next steps

- [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- [Add Azure Active Directory B2B collaboration users in the Azure portal](active-directory-b2b-admin-add-users.md)
- [How do information workers add B2B collaboration users to Azure Active Directory?](active-directory-b2b-iw-add-users.md)
- [Leave an organization as a guest user](active-directory-b2b-leave-the-organization.md)