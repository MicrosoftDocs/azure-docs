---
title: Security wizard in PIM - Azure | Microsoft Docs
description: Describes the security wizard that appears the first time you use Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: pim
ms.date: 02/27/2017
ms.author: rolyon
ms.custom: pim ; H1Hack27Feb2017
---
# Security wizard in PIM
If you're the first person to run Azure Privileged Identity Management (PIM) for your organization, you will be presented with a wizard. The wizard helps you understand the security risks of privileged identities and how to use PIM to reduce those risks. You don't need to make any changes to existing role assignments in the wizard, if you prefer to do it later.

## What to expect
Before your organization starts using PIM, all role assignments are permanent: the users are always in these roles even if they do not presently need their privileges.  The first step of the wizard shows you a list of high-privileged roles and how many users are currently in those roles. You can drill in to a particular role to learn more about users if one or more of them are unfamiliar.

The second step of the wizard gives you an opportunity to change administrator's role assignments.  

> [!WARNING]
> It is important that you have at least one global administrator, and more than one privileged role administrator with an organizational account (not a Microsoft account). If there is only one privileged role administrator, the organization will not be able to manage PIM if that account is deleted.
> Also, keep role assignments permanent if a user has a Microsoft account (An account they use to sign in to Microsoft services like Skype and Outlook.com). If you plan to require MFA for activation for that role, that user will be locked out.
> 
> 

After you have made changes, the wizard will no longer show up. The next time you or another privileged role administrator use PIM, you will see the PIM dashboard.  

* If you would like to add or remove users from roles or change assignments from permanent to eligible, read more at [how to add or remove a user's role](pim-how-to-add-role-to-user.md).
* If you would like to give more users access to manage PIM, read more at [how to give access to manage in PIM](pim-how-to-give-access-to-pim.md).

## Next steps

- [Start using PIM](pim-getting-started.md)
- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)
- [Grant access to other administrators to manage PIM](pim-how-to-give-access-to-pim.md)
