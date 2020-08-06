---
title: Azure AD roles security wizard in PIM - Azure Active Directory | Microsoft Docs
description: Describes the security wizard that you can use to convert permanent privileged Azure AD role assignments to eligible using Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 04/21/2020
ms.author: curtand
ms.custom: pim ; H1Hack27Feb2017
ms.collection: M365-identity-device-management
---

# Azure AD roles security wizard in Privileged Identity Management

If you're the first person to use Privileged Identity Management (PIM) in your Azure Active Directory (Azure AD)organization, you are presented with a wizard to get started. The wizard helps you understand the security risks of privileged identities and how to use Privileged Identity Management to reduce those risks. You don't need to make any changes to existing role assignments in the wizard, if you prefer to do it later.

> [!Important]
> The security wizard is temporarily unavailable. Thank you for your patience.

## Wizard overview

Before your organization starts using Privileged Identity Management, all role assignments are permanent: the users are always in these roles even if they do not presently need their privileges. The first step of the wizard shows you a list of high-privileged roles and how many users are currently in those roles. You can drill in to a particular role to learn more about users if one or more of them are unfamiliar.

The second step of the wizard gives you an opportunity to change administrator's role assignments.  

> [!WARNING]
> It is important that you have at least one Global administrator, and more than one Privileged role administrator with a work or school account (not a Microsoft account). If there is only one Privileged role administrator, the organization can't manage Privileged Identity Management if that account is deleted.
> Also, keep role assignments permanent if a user has a Microsoft account (in other words, an account they use to sign in to Microsoft services like Skype and Outlook.com). If you plan to require multi-factor authentication for activation for that role, that user will be locked out.

## Run the wizard

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure AD roles** and then select **Wizard**.

    ![Azure AD roles - Wizard page showing the 3 steps to run the wizard](./media/pim-security-wizard/wizard-start.png)

1. Select **1 Discover privileged roles**.

1. Review the list of privileged roles to see which users are permanent or eligible.

    ![Discover privileged roles - Role pane showing permanent and eligible members](./media/pim-security-wizard/discover-privileged-roles-users.png)

1. Select **Next** to select the users or groups you want to make eligible.

    ![Convert members to eligible page with options to select members you want to make eligible for roles](./media/pim-security-wizard/convert-members-eligible.png)

1. Once you have selected the users or groups, select **Next**.

    ![Review changes page showing members with permanent role assignments that will be converted](./media/pim-security-wizard/review-changes.png)

1. Select **OK** to convert the permanent assignments to eligible.

    When the conversion completes, you'll see a notification.

    ![Notification showing the status of a conversion](./media/pim-security-wizard/notification-completion.png)

If you need to convert other privileged role assignments to eligible, you can run the wizard again. If you want to use the Privileged Identity Management interface instead of the wizard, see [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md).

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Grant access to other administrators to manage Privileged Identity Management](pim-how-to-give-access-to-pim.md)
