---
title: Manage groups for the commercial marketplace - Azure Marketplace
description: Learn how to manage groups in the commercial marketplace program in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: sharath-satish-msft
ms.author: shsatish
ms.custom: contperf-fy21q2
ms.date: 01/20/2022
---

# Manage groups for the commercial marketplace

Groups allow you to control multiple user roles and permissions all together.

## Add an existing group

To add a group that already exists in your organization's work account (Azure AD tenant) to your Partner Center account:

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Groups** tab, select **+ Create user group**.
1. Select one or more groups from the list that appears and then select **Next**.
    > [!NOTE]
    > You can use the search box to search for specific groups. If you select more than one group to add to your Partner Center account, you must assign them the same role or set of custom permissions. To add multiple groups with different roles/permissions, repeat these steps for each role or set of custom permissions.
1. In the panel that appears, select the roles you want and then select **Add**.  All members of the group will be able to access your Partner Center account with the permissions you apply to the group, regardless of the roles and permissions associated with their individual account.

When you add an existing group, every user who is a member of that group will be able to access your Partner Center account, with the permissions associated with the group's assigned role.

## Add a new group

To add a brand-new group to your Partner Center account:

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Groups** tab, select **+ Create user group**.
1. Under **Create group**, select **Skip**.
1. Enter the display name for the new group and then select **Next**.
1. Select user(s) for the new group from the list that appears and then select **Next**. You can use the search box to search for specific users.
1. Select the role(s) or customized permissions for the group and then select **Add**c. All members of the group will be able to access your Partner Center account with the permissions you apply here, regardless of the roles/permissions associated with their individual account.

This new group will be created in your organization's work account (Azure AD tenant) as well, not just in your Partner Center account.

## Remove a group

To remove a group from your work account (Azure AD tenant):
1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. In the left-menu, select **User management**.
1. On the **Groups** tab, select the group that you want to remove, select **Delete**.
1. In the dialog box that appears, select **Ok** to confirm that you want to remove the selected group.
