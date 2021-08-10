---
title: Switch accounts in Partner Center - Azure Marketplace
description: Learn how switch between accounts in the commercial marketplace program of Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: varsha-sarah
ms.author: vavargh
ms.custom: contperf-fy21q2
ms.date: 09/01/2021
---

# Switch accounts in Partner Center

**Appropriate roles**

- Owner
- Manager

You can be part of more than one account. This article describes how you can see if you are part of multiple accounts and how to switch between them.

## View and switch accounts

#### [Workspaces view](#tab/Workspaces-view)

You can check to see if you are part of multiple accounts by the presence of the *account picker*.

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).

1. On the Home page, in the top-right, select the your account icon as seen highlighted in the following screenshot.

    [ ![Illustrates the account picker in Partner Center.](./media/manage-accounts/account-picker-workspaces.png) ](./media/manage-accounts/account-picker-workspaces.png#lightbox)

If you don't see the *account picker*, you are part of one account only. You can find the details of this account on the **Account settings** > **Organization profile** > **Legal** > **Developer** tab in Partner Center.

You can then select any of account on the list to switch to that account. After you switch, everything in Partner Center appears in the context of that account.

> [!NOTE]
> Partner Center uses [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) for multi-user account access and management. Your organization's Azure AD is automatically associated with your Partner Center account as part of the enrollment process.

In the following example, the signed-in user is part of the four highlighted accounts. The user can switch between them by clicking on an account.

[ ![Screenshot of accounts that can be selected with the account picker.](./media/manage-accounts/account-picker-two-workspaces.png) ](./media/manage-accounts/account-picker-two-workspaces.png#lightbox)

#### [Classic view](#tab/classic-view)

You can check to see if you are part of multiple accounts by the presence of the *account picker* in the left navigation menu, as seen highlighted in the following screenshot.

[ ![Screenshot of the account picker in the left-nav of Partner Center.](./media/manage-accounts/account-picker.png) ](./media/manage-accounts/account-picker.png#lightbox)

If you don't see the *account picker*, you are part of one account only. You can find the details of this account on the **Account settings** > **Organization profile** > **Legal** > **Developer** tab in Partner Center.

When you select this picker, all the accounts that you are a part of appear as a list. You can then select any of them to switch to that account. After you switch, everything in Partner Center appears in the context of that account.

> [!NOTE]
> Partner Center uses [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) for multi-user account access and management. Your organization's Azure AD is automatically associated with your Partner Center account as part of the enrollment process.

In the following example, the signed-in user is part of the three highlighted accounts. The user can switch between them by clicking on an account.

[ ![Screenshot of accounts that can be selected with the account picker.](./media/manage-accounts/account-picker-two.png) ](./media/manage-accounts/account-picker-two.png#lightbox)

---

## Next steps

- [Add and manage users for the commercial marketplace](add-manage-users.md)
