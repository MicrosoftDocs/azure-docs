---

title: Invitation redemption in B2B collaboration - Azure Active Directory | Microsoft Docs
description: Describes the Azure AD B2B collaboration invitation redemption experience for end users, including the agreement to privacy terms.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 06/12/2019

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisol

ms.collection: M365-identity-device-management
---

# Azure Active Directory B2B collaboration invitation redemption

This article describes the ways guest users can access your resources and the consent process they'll encounter. If you send an invitation email to the guest, the invitation includes a link the guest can redeem to get access your app or portal. The invitation email is just one of the ways guests can get access to your resources. As an alternative, you can add guests to your directory and give them a direct link to the portal or app you want to share. Regardless of the method they use, guests are guided through a first-time consent process. This process ensures that your guests agree to privacy terms and accept any [terms of use](https://docs.microsoft.com/azure/active-directory/governance/active-directory-tou) you've set up.

When you add a guest user to your directory, the guest user account has a consent status (viewable in PowerShell) that’s initially set to **PendingAcceptance**. This setting remains until the guest accepts your invitation and agrees to your privacy policy and terms of use. After that, the consent status changes to **Accepted**, and the consent pages are no longer presented to the guest.

## Redemption through the invitation email

When you add a guest user to your directory by [using the Azure portal](https://docs.microsoft.com/azure/active-directory/b2b/b2b-quickstart-add-guest-users-portal), an invitation email is sent to the guest in the process. You can also choose to send invitation emails when you’re [using PowerShell](https://docs.microsoft.com/azure/active-directory/b2b/b2b-quickstart-invite-powershell) to add guest users to your directory. Here’s a description of the guest’s experience when they redeem the link in the email.

1. The guest receives an [invitation email](https://docs.microsoft.com/azure/active-directory/b2b/invitation-email-elements) that's sent from **Microsoft Invitations**.
2. The guest selects **Get Started** in the email.
3. If the guest doesn't have an Azure AD account, a Microsoft Account (MSA), or an email account in a federated organization, they're prompted to create an MSA (unless the [one-time passcode](https://docs.microsoft.com/azure/active-directory/b2b/one-time-passcode) feature is enabled, which doesn’t require an MSA).
4. The guest is guided through the [consent experience](#consent-experience-for-the-guest) described below.

## Redemption through a direct link

As an alternative to the invitation email, you can give a guest a direct link to your app or portal. You first need to add the guest user to your directory via the [Azure portal](https://docs.microsoft.com/azure/active-directory/b2b/b2b-quickstart-add-guest-users-portal) or [PowerShell](https://docs.microsoft.com/azure/active-directory/b2b/b2b-quickstart-invite-powershell). Then you can use any of the [customizable ways to deploy applications to users](https://docs.microsoft.com/azure/active-directory/manage-apps/end-user-experiences), including direct sign-on links. When a guest uses a direct link instead of the invitation email, they’ll still be guided through the first-time consent experience.

> [!IMPORTANT]
> The direct link must be tenant-specific. In other words, it must include a tenant ID or verified domain so the guest can be authenticated in your tenant, where the shared app is located. A common URL like https://myapps.microsoft.com won’t work for a guest because it will redirect to their home tenant for authentication. Here are some examples of direct links with tenant context:
 > - Apps access panel: https://myapps.microsoft.com/?tenantid=&lt;tenant id&gt; 
 > - Apps access panel for a verified domain: https://myapps.microsoft.com/&lt;verified domain&gt;
 > - Azure portal: https://portal.azure.com/&lt;tenant id&gt;
 > - Individual app: see how to use a [direct sign-on link](../manage-apps/end-user-experiences.md#direct-sign-on-links)

There are some cases where the invitation email is recommended over a direct link. If these special cases are important to your organization, we recommend that you invite users by using methods that still send the invitation email:
 - The user doesn’t have an Azure AD account, an MSA, or an email account in a federated organization. Unless you're using the one-time passcode feature, the guest needs to redeem the invitation email to be guided through the steps for creating an MSA.
 - Sometimes the invited user object may not have an email address because of a conflict with a contact object (for example, an Outlook contact object). In this case, the user must click the redemption URL in the invitation email.
 - The user may sign in with an alias of the email address that was invited. (An alias is an additional email address associated with an email account.) In this case, the user must click the redemption URL in the invitation email.

## Consent experience for the guest

When a guest signs in to access resources in a partner organization for the first time, they're guided through the following pages. 

1. The guest reviews the **Review permissions** page describing the inviting organization's privacy statement. A user must **Accept** the use of their information in accordance to the inviting organization's privacy policies to continue.

   ![Screenshot showing the Review permissions page](media/redemption-experience/review-permissions.png) 

   > [!NOTE]
   > For information about how you as a tenant administrator can link to your organization's privacy statement, see [How-to: Add your organization's privacy info in Azure Active Directory](https://aka.ms/adprivacystatement).

2. If terms of use are configured, the guest opens and reviews the terms of use, and then selects **Accept**. 

   ![Screenshot showing new terms of use](media/redemption-experience/terms-of-use-accept.png) 

   > [!NOTE]
   > You can configure see [terms of use](../governance/active-directory-tou.md) in **Manage** > **Organizational relationships** > **Terms of use**.

3. Unless otherwise specified, the guest is redirected to the Apps access panel, which lists the applications the guest can access.

   ![Screenshot showing the Apps access panel](media/redemption-experience/myapps.png) 

In your directory, the guest's **Invitation accepted** value changes to **Yes**. If an MSA was created, the guest’s **Source** shows **Microsoft Account**. For more information about guest user account properties, see [Properties of an Azure AD B2B collaboration user](user-properties.md). 

## Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [Add Azure Active Directory B2B collaboration users in the Azure portal](add-users-administrator.md)
- [How do information workers add B2B collaboration users to Azure Active Directory?](add-users-information-worker.md)
- [Add Azure Active Directory B2B collaboration users by using PowerShell](customize-invitation-api.md#powershell)
- [Leave an organization as a guest user](leave-the-organization.md)
