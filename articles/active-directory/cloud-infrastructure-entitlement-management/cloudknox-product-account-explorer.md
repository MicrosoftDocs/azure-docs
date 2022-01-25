---
title: The Microsoft CloudKnox Permissions Management - View roles and identities that can access account information from external accounts
description: How to view information about identities that can access accounts from an external account in the Account explorer in Microsoft CloudKnox Permissions Management.
services: active-directory
manager: karenh444
ms.service: active-directory
ms.topic: how-to
author: Yvonne-deQ
ms.date: 01/25/2022
ms.author: v-ydequadros
---

# View roles and identities that can access account information from external accounts

You can use the **Account explorer** in Microsoft CloudKnox Permissions Management (CloudKnox) to view information about roles and identities that can access account information from an external accounts. This includes users, roles, EC2 instances and Lambda functions.

## View information about identities that can access accounts

1. To access the **Account explorer**:
    1. Select the **Usage analytics** tab, and then, from the dropdown, select one of the following:

        - **Users**
        - **Group**
        - **Active resources**
        - **Active tasks**
        - **Active resources**
        - **Serverless functions**

    2. To choose an account from your authorization system, select the lock icon in the left panel.

    3. In the **Authorization systems** pane, select an account, then select **Apply**. 

2. The **Cross account - Users** page displays the identities you can use to access the specified account. 

    **Roles that provide access** lists the roles that provide access to other accounts through the Trusted Entities policy statement.

    > [!NOTE]
    > The **Account explorer** displays identities that are not part of the specified AWS account but that also have permission to access the account through various roles.

     - To export the data in comma-separated values (CSV) file format, select **Export**.
     - To view other accounts in the **Account explorer**, select the **Authorization system** drop-down and select one of the available accounts.

3. To view the **Role summary**, select the "eye" icon to the right of the role name. 

    The following details display:

     - **Policies** - A list of all the policies attached to the role.
     - **Trusted entities** - The identities from external accounts that can assume this role.

4. To view all the identities from various accounts that can assume this role, select the caret icon to the left of the role name.

5. To view a graph of all the identities that can access the specified account and through which role(s), select the role name. 

     If CloudKnox is monitoring the external account, it lists specific identities from the accounts that can assume this role. Otherwise, it lists the identities declared in the **Trusted entity** section.

     - **Connecting roles** - Lists the following roles for each account:

         - *Direct roles* that are trusted by the account role.
         - *Intermediary roles* that are not directly trusted by the account role but are assumable by identities through role-chaining.

6. To view all the roles from that account that are used to access the specified account, select the caret icon to the left of the account name.

7. To view the trusted identities declared by the role, select the caret icon to the left of the role name. 

     The trusted identities for the role are listed only if the account is being monitored by CloudKnox.

8. To view the role definition, select the "eye" icon to the right of the role name. 

     When you select the caret icon and expand details, a search box is displayed. Enter your criteria in this box to search for specific roles.

     - **Identities with access** - Lists the identities that come from external accounts:

        - To view all the identities from that account can access the specified account, select the caret icon to the left of the account name.
        - To view the **Role summary** for EC2 instances and Lambda Functions, select the "eye" icon to the right of the identity name. 
        -  To view a graph of how the identity can access the specified account and through which role(s), select the identity name.

9. The **Info** tab displays the **Privilege creep index** and **Service control policy (SCP)** information about the account. 

     For more information about the **Privilege creep index** and SCP information, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).

<!---## Next steps--->


