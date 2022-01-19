---
title: Manage groups for the commercial marketplace - Azure Marketplace
description: Learn how to manage groups in the commercial marketplace program in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: varsha-sarah
ms.author: vavargh
ms.custom: contperf-fy21q2
ms.date: 04/07/2021
---

# Manage groups for the commercial marketplace

Groups allow you to control multiple user roles and permissions all together.

## Add an existing group

To add a group that already exists in your organization's work account (Azure AD tenant) to your Partner Center account:

1. From the **Users** page (under **Account settings**), select **Add groups**.
1. Select one or more groups from the list that appears. You can use the search box to search for specific groups. If you select more than one group to add to your Partner Center account, you must assign them the same role or set of custom permissions. To add multiple groups with different roles/permissions, repeat these steps for each role or set of custom permissions.
1. When you are finished choosing groups, select **Add selected**.
1. In the **Roles** section, specify the role(s) or customized permissions for the selected group(s). All members of the group will be able to access your Partner Center account with the permissions you apply to the group, regardless of the roles and permissions associated with their individual account.
1. Select **Save**.

When you add an existing group, every user who is a member of that group will be able to access your Partner Center account, with the permissions associated with the group's assigned role.

## Add a new group

To add a brand-new group to your Partner Center account:

1. From the **Users** page (under **Account settings**), select **Add groups**.
1. On the next page, select **New group**.
1. Enter the display name for the new group.
1. Specify the role(s) or customized permissions for the group. All members of the group will be able to access your Partner Center account with the permissions you apply here, regardless of the roles/permissions associated with their individual account.
1. Select user(s) for the new group from the list that appears. You can use the search box to search for specific users.
1. When you are finished selecting users, select **Add selected** to add them to the new group.
1. Select **Save**.

This new group will be created in your organization's work account (Azure AD tenant) as well, not just in your Partner Center account.

## Remove a group

To remove a group from your work account (Azure AD tenant):
1. Go to **Users** (under **Account settings**).
1. Select the group that you would like to remove using the checkbox in the far right column.
1. Choose **Remove** from the available actions. A pop-up window will appear for you to confirm that you want to remove the selected group(s).
