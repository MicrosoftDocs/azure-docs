---
title: The Microsoft CloudKnox Permissions Management Account Explorer
description: How to use the Microsoft CloudKnox Permissions Management Account Explorer to view identities.
services: active-directory
manager: karenh444
ms.service: active-directory
ms.topic: overview
author: Yvonne-deQ
ms.date: 12/03/2021
ms.author: v-ydequadros
---

# The Microsoft CloudKnox Permissions Management Account Explorer

The CloudKnox Permissions Management's **Account Explorer** displays a list of the identities that can access the selected account from an external account. This includes users, roles, EC2 instances and Lambda Functions.

## How to use the Account Explorer

1. To access the **Account Explorer**:
    1. Click the **Usage Analytics** tab, and then click the **Users** dropdown.

    2. To choose an authorization system, click the lock icon in the left panel.

    3. Select an Amazon Web Services (AWS) account. 

        For more information, see [How to apply filters to users](https://www.notion.so/cloudknox/Usage-Analytics-2147da11c8ff47e1bb7989b4005c4105#3c4562396db24421a9670e40e1dda6eb).

2. The **Cross Account - Users** page displays the identities you can use to access the specified account. 

    **Roles that Provide Access** lists the roles that provide access to other accounts through the Trusted Entities policy statement.

    > [!NOTE]
    > The **Account Explorer** displays identities that are not part of the specified AWS account but that also have permission to access the account through various roles.

     - To export the data in comma-separated values (CSV) file format, click **Export**.
     - To view other accounts in the **Account Explorer**, click the **Authorization system** drop-down and select one of the available accounts.

3. To view the **Role Summary**, click the "eye" icon to the right of the role name. 

    The following details display:

     - **Policies** - A list of all the policies attached to the role.
     - **Trusted Entities** - The identities from external accounts that can assume this role.

4. To view all the identities from various accounts that can assume this role, click the caret icon to the left of the role name.

5. To view a graph of all the identities that can access the specified account and through which role(s), click the role name . 

     If CloudKnox is monitoring the external account, it lists specific identities from the accounts that can assume this role. Otherwise, it lists the identities declared in the **Trusted Entity** section.

     - **Connecting Roles** - Lists the following roles for each account:

         - *Direct roles* that are trusted by the account role.
         - *Intermediary roles* that are not directly trusted by the account role but are assumable by identities through [role-chaining](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html).

6. To view all the roles from that account that are used to access the specified account, click the caret icon to the left of the account name.

7. To view the trusted identities declared by the role, click the caret icon to the left of the role name. 

     The trusted identities for the role are listed only if the account is being monitored by CloudKnox.

8. To view the role definition, click the "eye" icon to the right of the role name. 

     When you click the caret icon and expand details, a search box is displayed. Enter your criteria in this box to search for specific roles.

     - **Identities with Access** - Lists the identities that come from external accounts:

        - To view all the identities from that account can access the specified account, click the caret icon to the left of the account name.
        - To view the **Role Summary** for EC2 instances and Lambda Functions, click the "eye" icon to the right of the identity name. 
        -  To view a graph of how the identity can access the specified account and through which role(s), click the identity name.

9. The **Info** tab displays the **Privilege Creep Index** and **Service Control Policy (SCP)** information about the account. 

     For more information about the **Privilege Creep Index** and SCP information, see [Dashboard](https://docs.aws.amazon.com/IAM/latest/UserGuide/product-dashboard.html).

## Next steps

[Sentry installation - AWS](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203.html)

[CloudKnox FortSentry registration](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/CloudKnox%20FortSentry%20Registration%20f9f85592b2cf48aca0c0effd604a0827.html)
