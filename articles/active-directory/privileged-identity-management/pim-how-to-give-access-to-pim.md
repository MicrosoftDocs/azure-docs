---
title: Grant access to other administrators to manage PIM - Azure Active Directory | Microsoft Docs
description: Learn how to grant access to other administrations to manage Azure AD Privileged Identity Management (PIM).
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
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Grant access to other administrators to manage PIM

The Global Administrator who enables Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for an organization automatically get role assignments and access to PIM. No one else gets write access by default, though, including other Global Administrators. Other Global Administrators, Security Administrators, and Security Readers have read-only access to PIM. To grant access to PIM, the first user can assign others to the **Privileged Role Administrator** role.

> [!NOTE]
> Managing PIM requires Azure MFA. Since Microsoft accounts cannot register for Azure MFA, a user who signs in with a Microsoft account cannot access PIM.

Make sure there are always at least two users in a Privileged Role Administrator role, in case one user is locked out or their account is deleted.

## Grant access to manage PIM

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure AD roles**.

1. Click **Roles**.

    ![PIM Azure AD roles - Roles](./media/pim-how-to-give-access-to-pim/pim-directory-roles-roles.png)

1. Click the **Privileged Role Administrator** role to open the members page.

    ![Privileged Role Administrator - Members](./media/pim-how-to-give-access-to-pim/pim-pra-members.png)

1. Click **Add member**  to open the Add managed members pane.

1. Click **Select members** to open the Select members pane.

    ![Privileged Role Administrator - Select members](./media/pim-how-to-give-access-to-pim/pim-pra-select-members.png)

1. Select a member and then click **Select**.

1. Click **OK** to make the member eligible for the **Privileged Role Administrator** role.

    When you assign a new role to someone in PIM, they are automatically configured as **Eligible** to activate the role.

1. To make the member permanent, click the user in the Privileged Role Administrator member list.

1. Click **More** and then **Make permanent** to make the assignment permanent.

    ![Privileged Role Administrator - Make permanent](./media/pim-how-to-give-access-to-pim/pim-pra-make-permanent.png)

1. Send the user a link to [Start using PIM](pim-getting-started.md).

## Remove access to manage PIM

Before you remove someone from the Privileged Role Administrator role, always make sure there will still be at least two users assigned to it.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**.

1. Click **Azure AD roles**.

1. Click **Roles**.

1. Click the **Privileged Role Administrator** role to open the members page.

1. Add a checkmark next to the user you want to remove and then click **Remove member**.

    ![Privileged Role Administrator - Remove member](./media/pim-how-to-give-access-to-pim/pim-pra-remove-member.png)

1. In the message that appears asking if you want to remove the member from the role, click **Yes**.

## Next steps

- [Start using PIM](pim-getting-started.md)
