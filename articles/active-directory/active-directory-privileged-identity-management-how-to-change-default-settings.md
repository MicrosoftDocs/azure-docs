<properties
   pageTitle="How to manage role activation settings | Microsoft Azure"
   description="Learn how to change the default settings for privileged identities with the Azure Active Directory Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="04/15/2016"
   ms.author="kgremban"/>

# How to manage role activation settings in Azure AD Privileged Identity Management

A security administrator can customize Azure AD Privileged Identity Management (PIM) in their organization, including changing the experience for a user who is activating a temporary role assignment.

## Manage the role activation settings

1. Go to the [Azure portal](https://portal.azure.com) and select the **Azure AD Privileged Identity Management** app from the dashboard.
2. Select the role you want to manage from the roles table.
3. Click **Settings**.
4. Set the default activation duration in hours by adjusting the slider or entering the number of hours in the text field. The maximum is 72 hours.
5. Click **Enable** or **Disable** to send notifications about the activation to administrators, or not. (Enabling notifications may help detect unauthorized administrator activity.)
6. Click **Enable** to allow administrators to enter ticketing information into their activation request. (This information can be helpful when auditing role access later.)
7. Click **Enable** or **Disable** to require multi-factor authentication for an activation request, or not.
8. Click **Save**.

You cannot disable MFA for highly privileged roles for Azure AD and Office365, including:  
- Global administrator  
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
