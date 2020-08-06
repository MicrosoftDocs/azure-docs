---
title: Azure AD roles Discover and Insights in PIM - Azure Active Directory | Microsoft Docs
description: Use Discovery and insights (formerly the Security Wizard) to removes or convert permanent privileged Azure AD role assignments to eligible with Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 08/06/2020
ms.author: curtand
ms.custom: pim ; H1Hack27Feb2017
ms.collection: M365-identity-device-management
---

# Discovery and Insights (preview) for Azure AD roles in Privileged Identity Management

If you're starting out with Privileged Identity Management (PIM) in your Azure Active Directory (Azure AD) organization, you can use **Discovery and insights (preview)** to get started. This feature helps you understand the security risks of privileged identities and how to use Privileged Identity Management to reduce those risks. You don't even need to make any changes to existing role assignments in Discovery and Insights (preview), if you prefer to do it later.

## Discovery and insights (preview)

Before your organization starts using Privileged Identity Management, all role assignments are permanent. Users are always in in their assigned roles even when they don't need their privileges. Discovery and insights (preview) shows you a list of privileged roles and how many users are currently in those roles. You can list out assignments for a role to learn more about the assigned users if one or more of them are unfamiliar.

> [!WARNING]
> It is important that you have at least one Global administrator, and more than one Privileged Role Administrator with a work or school account (not a Microsoft account). If there were only one Privileged Role Administrator, the organization couldn't manage Privileged Identity Management if that account were deleted.
> Also, keep role assignments permanent if a user has a Microsoft account (in other words, an account they use to sign in to Microsoft services like Skype, or Outlook.com). If you require multi-factor authentication to be activated in such a role, the user will be locked out because those users aren't authenticated by Azure AD.

## Open Discovery and insights (preview)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure AD roles** and then select **Discovery and insights (Preview)**. Opening the page begins the discovery process to find relevant role assignments.

    ![Azure AD roles - Discovery and insights page showing the 3 options](./media/pim-security-wizard/new-preview-link.png)

1. Select **Reduce global administrators**.

    ![Reduce global administrators - Role pane showing all members](./media/pim-security-wizard/new-preview-page.png)

1. Review the list of Global Administrator role assignments.

    ![Reduce global administrators - Role pane showing all members](./media/pim-security-wizard/new-global-administrator-list.png)

1. Select **Next** to select the users or groups you want to make eligible, and then select **Make eligible** or **Remove assignment**.

    ![Convert members to eligible page with options to select members you want to make eligible for roles](./media/pim-security-wizard/new-global-administrator-buttons.png)

1. You can also require all global administrators to review their own access.

    ![Global administrators page showing access reviews section](./media/pim-security-wizard/new-global-administrator-access-review.png)

1. After you select any of these changes, you'll see an Azure notification.

1. You can then select **Eliminate standing access** or **Review service principals** to perform similar operations on other highly privileged roles and service principal role assignments. For service principal role assignments, you can remove role assignments only.

    ![Additional Insights options to eliminate standing access and review service principals ](./media/pim-security-wizard/new-preview-page-service-principals.png)

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Grant access to other administrators to manage Privileged Identity Management](pim-how-to-give-access-to-pim.md)
