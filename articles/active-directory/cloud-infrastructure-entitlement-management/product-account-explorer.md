---
title: View roles and identities that can access account information from an external account
description: How to view information about identities that can access accounts from an external account in Permissions Management.
services: active-directory
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.topic: how-to
author: jenniferf-skc
ms.date: 06/16/2023
ms.author: jfields
---

# View roles and identities that can access account information from an external account

You can view information about users, groups, and resources that can access account information from an external account in Permissions Management.

## Display information about users, groups, or tasks

1. In Permissions Management, select the **Usage analytics** tab, and then, from the dropdown, select one of the following:

   - **Users**
   - **Group**
   - **Active resources**
   - **Active tasks**
   - **Active resources**
   - **Serverless functions**

1. To choose an account from your authorization system, select the lock icon in the left panel.
1. In the **Authorization systems** pane, select an account, then select **Apply**.
1. To choose a user, role, or group, select the person icon.
1. Select a user or group, then select **Apply**.
1. To choose an account from your authorization system, select it from the Authorization Systems menu.
1. In the user type filter, user, role, or group.
1. In the **Task** filter, select **All** or **High-risk tasks**, then select **Apply**.
1. To delete a task, select **Delete**, then select **Apply**.

## Export information about users, groups, or tasks

To export the data in comma-separated values (CSV) file format, select **Export** from the top-right hand corner of the table.

## View users and roles
1. To view users and roles, select the lock icon, and then select the person icon to open the **Users** pane.
1. To view the **Role summary**, select the "eye" icon to the right of the role name.

   The following details display:
   - **Policies**: A list of all the policies attached to the role.
   - **Trusted entities**: The identities from external accounts that can assume this role.

1. To view all the identities from various accounts that can assume this role, select the down arrow to the left of the role name.
1. To view a graph of all the identities that can access the specified account and through which role(s), select the role name.

   If Permissions Management is monitoring the external account, it lists specific identities from the accounts that can assume this role. Otherwise, it lists the identities declared in the **Trusted entity** section.

   **Connecting roles**: Lists the following roles for each account:
      - *Direct roles* that are trusted by the account role.
      - *Intermediary roles* that aren't directly trusted by the account role but are assumable by identities through role-chaining.

1. To view all the roles from that account that are used to access the specified account, select the down arrow to the left of the account name.
1. To view the trusted identities declared by the role, select the down arrow to the left of the role name.

   The trusted identities for the role are listed only if the account is being monitored by Permissions Management.

1. To view the role definition, select the "eye" icon to the right of the role name.

   When you select the down arrow and expand details, a search box is displayed. Enter your criteria in this box to search for specific roles.

   **Identities with access**: Lists the identities that come from external accounts:
      - To view all the identities from that account can access the specified account, select the down arrow to the left of the account name.
      - To view the **Role summary** for EC2 instances and Lambda functions, select the "eye" icon to the right of the identity name.
      - To view a graph of how the identity can access the specified account and through which role(s), select the identity name.

1. The **Dashboard** tab displays the **Permissions Creep Index (PCI)** and **Identity findings** information about the account.

## Next steps

For more information about the **Permissions Creep Index (PCI)** and SCP information, see [View key statistics and data about your authorization system](ui-dashboard.md).
