---
title: How to use the CloudKnox Account Explorer
description: How to use Account Explorer to view all the identities.
services: active-directory
manager: karenh444
ms.service: active-directory
ms.topic: overview
author: Yvonne-deQ
ms.date: 12/01/2021
ms.author: v-ydequadros
---

# The CloudKnox Account Explorer

The **Account Explorer** displays all the identities - users, roles, EC2 instances and Lambda Functions - that can access the selected account from an external account.

## How to use the Account Explorer

1. To access the **Account Explorer**:
    1. Click the **Usage Analytics** tab, and then click the **Users** dropdown.

    2. Click the lock icon to choose an authorization system from the left-hand side panel.

    3. Select an Amazon Web Services (AWS) account. <br>
        For more information, see [How to apply filters to users](https://www.notion.so/cloudknox/Usage-Analytics-2147da11c8ff47e1bb7989b4005c4105#3c4562396db24421a9670e40e1dda6eb).

2. The **Cross Account - Users** page displays the identities you can use to access the specified account. **Roles that Provide Access** lists the roles that provide access to other accounts through the Trusted Entities policy statement.

    > [!NOTE]
    > The **Account Explorer** displays identities that are not part of the specified AWS account but that also have permission to access the account through various roles.

     - To export the data in comma-separated values (CSV) file format, click **Export**.
     - To view other accounts in the **Account Explorer**, click the **Authorization system** drop-down and select one of the available accounts.

3. Click the "eye" icon to the right of the role name to view the **Role Summary**. This displays the following details:

     - **Policies** - A list of all the policies attached to the role.
     - **Trusted Entities** - The identities from external accounts that can assume this role.

4. Click the caret icon to the left of the role name to view all the identities from various accounts that can assume this role.

5. Click the role name to view a graph of all the identities that can access the specified account and through which role(s). <br>
     If CloudKnox is monitoring the external account, it lists specific identities from the accounts that can assume this role. Otherwise, it lists the identities declared in the **Trusted Entity** section.

     - **Connecting Roles** - Lists the following roles for each account:

         - *Direct roles* that are trusted by the account role.
         - *Intermediary roles* that are not directly trusted by the account role but are assumable by identities through [role-chaining](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html).

6. Click the caret icon to the left of the account name to view all the roles from that account that are used to access the specified account.

7. Click the caret icon to the left of the role name to view the trusted identities declared by the role. <br>
     The trusted identities for the role are listed only if the account is being monitored by CloudKnox.

8. Click the "eye" icon to the right of the role name to view the role definition. <br>
     When you click the caret icon and expand details, a search box is displayed. Enter your criteria in this box to search for specific roles.

     - **Identities with Access** - Lists the identities that come from external accounts:

        - Click the caret icon to the left of the account name to view all the identities from that account can access the specified account.
        - For EC2 instances and Lambda Functions, click the "eye" icon to the right of the identity name to view the **Role Summary**, which displays the details described above.
        - Click the identity name to view a graph of how the identity can access the specified account and through which role(s).

9. The **Info** tab displays the **Privilege Creep Index** and Service Control Policy (SCP) information about the account. <br>
     For more information about the **Privilege Creep Index** and SCP information, see [Dashboard](https://docs.aws.amazon.com/IAM/latest/UserGuide/prod-dashboard.html).