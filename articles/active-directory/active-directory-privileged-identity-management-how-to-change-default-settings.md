<properties
   pageTitle="How to manage role activation settings | Microsoft Azure"
   description="Learn how to change the default settings for privileged identities with the Azure Active Directory Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/30/2016"
   ms.author="kgremban"/>

# How to manage role activation settings in Azure AD Privileged Identity Management

A privileged role administrator can customize Azure AD Privileged Identity Management (PIM) in their organization, including changing the experience for a user who is activating an eligible role assignment.

## Manage the role activation settings

1. Go to the [Azure portal](https://portal.azure.com) and select the **Azure AD Privileged Identity Management** app from the dashboard.
2. Select the role you want to manage from the roles table.
3. Click **Settings**.

On the settings page for each role, there are a number of settings you can configure. These settings only affect users who are eligible admins, not permanent admins.

**Activations**: The time, in hours, that a role stays active before it expires. This can be between 1 and 72 hours.

**Notifications**: You can choose whether or not the system sends emails to admins confirming that they have activated a role. This can be useful for detecting unauthorized or illegitimate activations.

**Incident/Request Ticket**: You can choose whether or not to require eligible admins to include a ticket number when they activate their role. This can be useful when you perform role access audits.

**Multi-Factor Authentication**: You can choose whether or not to require users to verify their identity with MFA before they can activate their roles. They only have to verify this once per session, not every time they activate a role. There are two tips to keep in mind when you enable MFA:

- Users who have Microsoft accounts for their email addresses (typically @outlook.com, but not always) cannot register for Azure MFA. If you want to assign roles to users with Microsoft accounts, you should either make them permanent admins or disable MFA for that role.

- You cannot disable MFA for highly privileged roles for Azure AD and Office365. This is a safety feature because these roles should be carefully protected:  

    - Global administrator
    - Privileged role administrator   
    - User account administrator  
    - Directory writer  
    - Partner tier1 support  
    - Partner tier2 support  
    - Billing administrator  
    - Security administrator  
    - Exchange administrator  
    - Mailbox administrator  
    - Skype for Business administrator  
    - SharePoint administrator  
    - Compliance administrator  

For more information about using MFA with PIM see [How to Require MFA](active-directory-privileged-identity-management-how-to-require-mfa.md).

<!--PLACEHOLDER: Need an explanation of what the temporary Global Administrator setting is for.-->

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
