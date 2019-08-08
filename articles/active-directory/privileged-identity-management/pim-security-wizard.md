---
title: Azure AD roles security wizard in PIM - Azure Active Directory | Microsoft Docs
description: Describes the security wizard that you can use to convert permanent privileged Azure AD role assignments to eligible using Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 04/09/2019
ms.author: rolyon
ms.custom: pim ; H1Hack27Feb2017
ms.collection: M365-identity-device-management
---

# Azure AD roles security wizard in PIM

If you're the first person to run Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for your organization, you will be presented with a wizard. The wizard helps you understand the security risks of privileged identities and how to use PIM to reduce those risks. You don't need to make any changes to existing role assignments in the wizard, if you prefer to do it later.

## Wizard overview

Before your organization starts using PIM, all role assignments are permanent: the users are always in these roles even if they do not presently need their privileges. The first step of the wizard shows you a list of high-privileged roles and how many users are currently in those roles. You can drill in to a particular role to learn more about users if one or more of them are unfamiliar.

The second step of the wizard gives you an opportunity to change administrator's role assignments.  

> [!WARNING]
> It is important that you have at least one Global Administrator, and more than one Privileged Role Administrator with an organizational account (not a Microsoft account). If there is only one Privileged Role Administrator, the organization will not be able to manage PIM if that account is deleted.
> Also, keep role assignments permanent if a user has a Microsoft account (An account they use to sign in to Microsoft services like Skype and Outlook.com). If you plan to require MFA for activation for that role, that user will be locked out.

## Run the wizard

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure AD roles** and then click **Wizard**.

    ![Azure AD roles - Wizard page showing the 3 steps to run the wizard](./media/pim-security-wizard/wizard-start.png)

1. Click **1 Discover privileged roles**.

1. Review the list of privileged roles to see which users are permanent or eligible.

    ![Discover privileged roles - Role pane showing permanent and eligible members](./media/pim-security-wizard/discover-privileged-roles-users.png)

1. Click **Next** to select the members you want to make eligible.

    ![Convert members to eligible page with options to select members you want to make eligible for roles](./media/pim-security-wizard/convert-members-eligible.png)

1. Once you have selected the members, click **Next**.

    ![Review changes page showing members with permanent role assignments that will be converted](./media/pim-security-wizard/review-changes.png)

1. Click **OK** to convert the permanent assignments to eligible.

    When the conversion completes, you'll see a notification.

    ![Notification showing the status of a conversion](./media/pim-security-wizard/notification-completion.png)

If you need to convert other privileged role assignments to eligible, you can run the wizard again. If you want to use the PIM interface instead of the wizard, see [Assign Azure AD roles in PIM](pim-how-to-add-role-to-user.md).

## Next steps

- [Assign Azure AD roles in PIM](pim-how-to-add-role-to-user.md)
- [Grant access to other administrators to manage PIM](pim-how-to-give-access-to-pim.md)
