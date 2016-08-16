<properties
   pageTitle="The Azure AD Privileged Identity Management security wizard"
   description="The first time you use the Azure Active Directory Privileged Identity Management extension, you will be presented with a security wizard. This article describes the steps for using the wizard."
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
   ms.date="07/01/2016"
   ms.author="kgremban"/>

# The Azure AD Privileged Identity Management security wizard

If you're the first person to run Azure Privileged Identity Management (PIM) for your organization, you will be presented with a wizard. The wizard helps you understand the security risks of privileged identities and how to use PIM to reduce those risks. You don't need to make any changes to existing role assignments in the wizard, if you prefer to do it later.

## What to expect

Before your organization starts using PIM, all role assignments are permanent: the users are always in these roles even if they do not presently need their privileges.  The first step of the wizard shows you a list of high-privileged roles and how many users are currently in those roles. You can drill in to a particular role to learn more about users if one or more of them are unfamiliar.

The second step of the wizard gives you an opportunity to change administrator's role assignments.  

> [AZURE.WARNING] It is important that you have at least one global administrator, and more than one privileged role administrator with an organizational account (not a Microsoft account). If there is only one privileged role administrator, the organization will not be able to manage PIM if that account is deleted.
> Also, keep role assignments permanent if a user has a Microsoft account (An account they use to sign in to Microsoft services like Skype and Outlook.com). If you plan to require MFA for activation for that role, that user will be locked out.


After you have made changes, the wizard will no longer show up. The next time you or another privileged role administrator use PIM, you will see the PIM dashboard.  

- If you would like to add or remove users from roles or change assignments from permanent to eligible, read more at [how to add or remove a user's role](active-directory-privileged-identity-management-how-to-add-role-to-user.md).
- If you would like to give more users access to manage PIM, read more at [how to give access to manage in PIM](active-directory-privileged-identity-management-how-to-give-access-to-pim.md).



## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
