---
title: Microsoft CloudKnox Permissions Management - Review data and create a role/policy in the Role/Policy tab in the Just Enough Permissions (JEP) Controller 
description: How to review data and create a role/policy in the Role/Policy tab in the Just Enough Permissions (JEP) Controller.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/27/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Review data and create a role/policy in the Role/Policy tab in the Just Enough Permissions (JEP) Controller

This topic describes how you can use the Role/Policy tab in the Just Enough Permissions (JEP) Controller to:
- Review and interpret role/policy data.
- Create a role/policy in the  JEP Controller.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. </p>- The user interface automatically makes this change when you select the authorization system type on the **Roles/Policies** tab in the **JEP Controller** tab. </p>- In the user documentation, we use *role/policy* to refer to both.

> [!NOTE]
> You must have **Controller** access to the JEP Controller to perform these tasks. If you don’t have Controller access, contact your system administrator.

## Review and interpret data on the Role/Policy tab

1. Select the **JEP Controller** tab.
2. Select the **Role/Policies** tab.

    A list of **Role Name** and **Role Types** appears.
3. A Search bar displays at the top of the list. You can use this bar to search for: 
    - **Authorization System Type**
    - **Authorization System**
    - **Policy Name**
    - **Policy Type**
4. To search for a policy, in **Policy Name**, enter a policy name, or select a name from the drop-down list.

    CloudKnox displays a list of policies that match your criteria.
5. To filter policies by **Policy Type**, select the type of policy you want from the drop-down list.

    CloudKnox displays a list of policy types that match your criteria.
6. Select a role/policy to review data.

## Create a role/policy

1. Select the **JEP Controller** tab.
2. Select the **Role/Policies** tab.
3. Use the drop-down lists to select the **Authorization System Type** and **Authorization System**.
4. Select **Create Role/Policy**.

    The **Create role/Policy** wizard opens.
5. The **Authorization System Type** and **Authorization System** are pre-populated from your selections in Step 3.
6. In the **Role/Policy Name** box, enter a role/policy name.
7. Select which activity you want to create the role/policy:
    - **Activity of User(s)**
    - **Activity of Group(s)**
    - **Activity of Resource(s)**
    - **Activity of Role/Policy**
    - **From Existing Role/Policy**
    - **New Policy**

    To create a role/policy based on user activity, select **Activity of User(s)**.
8. In **Tasks performed in the last**, select the duration: **90 days**, **60 days**, **30 days**, **7 days**, or **1 day**.
9. In **Select Users**, select the **Users** and **User Type** you want.
10. Select **Next**.

    CloudKnox displays a **Statement** of **Available Tasks** and **Selected Tasks**.  
11. To create a more generalized role/policy, select tasks from the **Available Tasks** list.
    - To add a category of tasks, select a category.
    - To add individual tasks from a category, select the plus sign next to the category name, and then select individual tasks.

    The tasks you select appear the **Selected Tasks** list.
12. To add an additional statement to your role/policy, select **Add a statement**, and then add a category of tasks or individual tasks as described in Step 11.
13. In **Resources**, select **All Resources**, **Specific Resources**, or **No Resources**.

    If you select **Specific Resources**, a list of available resources appears.
14. In **Request Conditions**, select **JSON** or **Script**.
15. In **Effect**, select **Allow** or **Deny**.
16. Select **Next**.
17. Review the code to confirm it's what you want.
18. If your controller is not enabled, select **Download JSON** or **Download Script** to download the code and run it yourself.

    If your controller is enabled, skip this step.
19. Select **Submit**.
20. The **CloudKnox Tasks** pane appears on the right.

    The **Active** tab displays a list of the roles/policies CloudKnox is currently processing.

    The **Completed** tab displays a list of the roles/policies CloudKnox has completed.
21. Select the **Role/Policies** tab. In a few minutes, you’ll see the role/policy you created.



<!---## Next steps--->
