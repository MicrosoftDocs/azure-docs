---
title: Email notifications in Azure AD PIM | Microsoft Docs
description: Describes email notifications in Azure AD Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: protection
ms.date: 07/24/2018
ms.author: rolyon
ms.reviewer: hanki
ms.custom: pim
---

# Email notifications in Azure AD PIM

When key events occur in Azure AD Privileged Identity Management (PIM), email notifications are sent to the relevant administrator or user. For example, PIM sends emails for the following events:

- When a privileged role activation is pending approval
- When a privileged role activation request is approved
- When a privileged role is activated
- When a privileged role is assigned
- When Azure AD PIM is enabled

Starting at the end of July 2018, email notifications sent through PIM will have a new sender email address and a new visual design. This update will impact both PIM for Azure AD and PIM for Azure resources. All events that previously triggered an email notification will continue to send out an email. Some emails will have updated content providing more targeted information.

## Sender email address

Starting at the end of July 2018, email notifications have the following address:

- Email address:  **azure-noreply@microsoft.com**
- Display name: Microsoft Azure

Previously, email notifications had the following address:

- Email address:  **azureadnotifications@microsoft.com**
- Display name: Microsoft Azure AD Notification Service

## Email subject line

Starting at the end of July 2018, email notifications for both Azure AD and Azure resource roles will have a **PIM** prefix in the subject line. Here's an example:

- PIM: Alain Charon was permanently assigned the Backup Reader role.

## PIM emails for Azure AD roles

Starting at the end of July 2018, the PIM email notifications for Azure AD roles have an updated design. The following shows an example email that is sent when a user activates a privileged role for the fictional Contoso organization.

![New PIM email for Azure AD roles](./media/pim-email-notifications/email-directory-new.png)

Previously, when a user activated a privileged role, the email looked like the following.

![Old PIM email for Azure AD roles](./media/pim-email-notifications/email-directory-old.png)

## PIM emails for Azure resource roles

Starting at the end of July 2018, the PIM email notifications for Azure resource roles have an updated design. The following shows an example email that is sent when a user is assigned a privileged role for the fictional Contoso organization.

![New PIM email for Azure resource roles](./media/pim-email-notifications/email-resources-new.png)

Previously, when a user was assigned a privileged role, the email looked like the following.

![Old PIM email for Azure resource roles](./media/pim-email-notifications/email-resources-old.png)

## Next steps

- [How to manage role activation settings in Azure AD PIM](pim-how-to-change-default-settings.md)
- [Approvals in Azure AD PIM](azure-ad-pim-approval-workflow.md)
