---
title: Create a role/policy in the JEP Controller in Microsoft CloudKnox Permissions Management 
description: How to create a role/policy in the Just Enough Permissions (JEP) Controller.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/01/2022
ms.author: v-ydequadros
---

# Create a role/policy in the JEP Controller

This article describes how you can use the JEP Controller in Microsoft CloudKnox Permissions Management to create roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems. 

> [!NOTE]
> To view the **JEP Controller** tab, your must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don’t have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Create a role/policy

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.

1. Use the drop-down lists to select the **Authorization System Type** and **Authorization System**.
1. Select **Create Role/Policy**.

    The **Create role/Policy** wizard opens.
1. The **Authorization System Type** and **Authorization System** are pre-populated from your previous settings.
    - To change the settings, select the box and make a selection from the dropdown. 

1. Under **How Would You Like to Create the Policy?**, select the required option::

    - **Activity of user(s)**: Allows you to create a role/policy based on a user's activity.
    - **Activity of group(s)**: Allows you to create a role/policy based on the aggregated activity of all the users belonging to the group(s).
    - **Activity of resource(s)**: Allows you to create a role/policy based on the activity of a resource, for example, an EC2 instance.
    - **Activity of role/policy**: Allows you to create a role/policy based on the aggregated activity of all the users that assumed the role.
    - **Activity of Lambda function**: Allows you to create a new polrole/policy based on the Lambda function.
    - **From existing role/policy**: Allows you to create a new role/policy based on an existing role/policy.
    - **New role/policy**: Allows you to create a new role/policy from scratch.

1. In **Tasks performed in the last**, select the duration: **90 days**, **60 days**, **30 days**, **7 days**, or **1 day**.
1. Depending on your preference, select or deselect **Include Access Advisor data.**
1. Complete the required data depending on the type of policy you want to create, and then select **Next**.

    CloudKnox displays a **Statement** of **Available tasks** and **Selected tasks**.  
1. To create a more generalized role/policy, select tasks from the **Available tasks** list.
    - To add a category of tasks, select a category.
    - To add individual tasks from a category, select the plus sign next to the category name, and then select individual tasks.

    The tasks you select appear the **Selected tasks** list.
1. To add another statement to your role/policy, select **Add a statement**, and then add a category of tasks or individual tasks as described in Step 11.
1. In **Resources**, select **All Resources**, **Specific Resources**, or **No Resources**.

    If you select **Specific Resources**, a list of available resources appears.
1. In **Request Conditions**, select **JSON** or **Script**.
1. In **Effect**, select **Allow** or **Deny**, and then select **Next**.
1. Review the script to confirm it's what you want.
1. If your controller isn't enabled, select **Download JSON** or **Download Script** to download the code and run it yourself.

    If your controller is enabled, skip this step.
1. Select **Submit**.
1. The **CloudKnox tasks** pane appears on the right.

    The **Active** tab displays a list of the roles/policies CloudKnox is currently processing.

    The **Completed** tab displays a list of the roles/policies CloudKnox has completed.
1. Refresh the **Role/Policies** tab to see the role/policy you created.



## Next steps

- For information on how to view roles/policies, see [View information about roles/policies in the JEP Controller](cloudknox-howto-view-role-policy.md).
- For information on how to clone roles/policies, see [Clone a role/policy in the JEP Controller](cloudknox-howto-clone-role-policy.md).
- For information on how to modify roles/policies, see [Modify a role/policy in the JEP Controller](cloudknox-howto-modify-role-policy.md).
- For information on how to delete roles/policies, see [Delete a role/policy in the JEP Controller](cloudknox-howto-delete-role-policy.md).
