---
title: Create a role/policy in the Remediation dashboard
description: How to create a role/policy in the Remediation dashboard.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/16/2023
ms.author: jfields
---

# Create a role/policy in the Remediation dashboard

This article describes how you can use the **Remediation** dashboard in Microsoft Entra Permissions Management to create roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems.

> [!NOTE]
> To view the **Remediation** tab, you must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don't have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other cloud providers call *policy*. Permissions Management automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Create a policy for AWS

> [!NOTE]
> For information on AWS service quotas, and to request an AWS service quota increase, visit [the AWS documentation](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html). 

1. On the Microsoft Entra home page, select the **Remediation** tab, and then select the **Role/Policies** tab.
1. Use the dropdown lists to select the **Authorization System Type** and **Authorization System**.
1. Select **Create Policy**.
1. On the **Details** page, the **Authorization System Type** and **Authorization System** are pre-populated from your previous settings.
    - To change the settings, make a selection from the dropdown.
1. Under **How Would You Like To Create The Policy**, select the required option:

    - **Activity of User(s)**: Allows you to create a policy based on user activity.
    - **Activity of Group(s)**: Allows you to create a policy based on the aggregated activity of all the users belonging to the group(s).
    - **Activity of Resource(s)**: Allows you to create a policy based on the activity of a resource, for example, an EC2 instance.
    - **Activity of Role**: Allows you to create a policy based on the aggregated activity of all the users that assumed the role.
    - **Activity of Tag(s)**: Allows you to create a policy based on the aggregated activity of all the tags.
    - **Activity of Lambda Function**: Allows you to create a new policy based on the Lambda function.
    - **From Existing Policy**: Allows you to create a new policy based on an existing policy.
    - **New Policy**: Allows you to create a new policy from scratch.
1. In **Tasks performed in last**, select the duration: **90 days**, **60 days**, **30 days**, **7 days**, or **1 day**.
1. Depending on your preference, select or deselect **Include Access Advisor data.**
1. In **Settings**, from the **Available** column, select the plus sign **(+)** to move the identity into the **Selected** column, and then select **Next**.

1. On the **Tasks** page, from the **Available** column, select the plus sign **(+)** to move the task into the **Selected** column.
    - To add a whole category, select a category.
    - To add individual items from a category, select the down arrow on the left of the category name, and then select individual items.
1. In **Resources**, select **All Resources** or **Specific Resources**.

    If you select **Specific Resources**, a list of available resources appears. Find the resources you want to add, and then select **Add**.
1. In **Request Conditions**, select **JSON** .
1. In **Effect**, select **Allow** or **Deny**, and then select **Next**.
1. In **Policy name:**, enter a name for your policy.
1. To add another statement to your policy, select **Add Statement**, and then, from the list of **Statements**, select a statement.
1. Review your **Task**, **Resources**, **Request Conditions**, and **Effect** settings, and then select **Next**.


1. On the **Preview** page, review the script to confirm it's what you want.
1. If your controller isn't enabled, select **Download JSON** or **Download Script** to download the code and run it yourself.

    If your controller is enabled, skip this step.
1. Select **Split Policy**, and then select **Submit**.

    A message confirms that your policy has been submitted for creation

1. The [**Permissions Management Tasks**](ui-tasks.md) pane appears on the right.
    - The **Active** tab displays a list of the policies Permissions Management is currently processing.
    - The **Completed** tab displays a list of the policies Permissions Management has completed.
1. Refresh the **Role/Policies** tab to see the policy you created.



## Create a role for Azure

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Role/Policies** tab.
1. Use the dropdown lists to select the **Authorization System Type** and **Authorization System**.
1. Select **Create Role**.
1. On the **Details** page, the **Authorization System Type** and **Authorization System** are pre-populated from your previous settings.
    - To change the settings, select the box and make a selection from the dropdown.
1. Under **How Would You Like To Create The Role?**, select the required option:

    - **Activity of User(s)**: Allows you to create a role based on user activity.
    - **Activity of Group(s)**: Allows you to create a role based on the aggregated activity of all the users belonging to the group(s).
    - **Activity of App(s)**: Allows you to create a role based on the aggregated activity of all apps.
    - **From Existing Role**: Allows you to create a new role based on an existing role.
    - **New Role**: Allows you to create a new role from scratch.

1. In **Tasks performed in last**, select the duration: **90 days**, **60 days**, **30 days**, **7 days**, or **1 day**.
1. Depending on your preference:
    - Select or deselect **Ignore Non-Microsoft Read Actions**.
    - Select or deselect **Include Read-Only Tasks**.
1. In **Settings**, from the **Available** column, select the plus sign **(+)** to move the identity into the **Selected** column, and then select **Next**.

1. On the **Tasks** page, in **Role name:**, enter a name for your role.
1. From the **Available** column, select the plus sign **(+)** to move the task into the **Selected** column.
    - To add a whole category, select a category.
    - To add individual items from a category, select the down arrow on the left of the category name, and then select individual items.
1. Select **Next**.

1. On the **Preview** page, review:
    - The list of selected **Actions** and **Not Actions**.
    - The **JSON** or **Script** to confirm it's what you want.
1. If your controller isn't enabled, select **Download JSON** or **Download Script** to download the code and run it yourself.

    If your controller is enabled, skip this step.

1. Select **Submit**.

    A message confirms that your role has been submitted for creation

1. The [**Permissions Management Tasks**](ui-tasks.md) pane appears on the right.
    - The **Active** tab displays a list of the policies Permissions Management is currently processing.
    - The **Completed** tab displays a list of the policies Permissions Management has completed.
1. Refresh the **Role/Policies** tab to see the role you created.

## Create a role for GCP

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Role/Policies** tab.
1. Use the dropdown lists to select the **Authorization System Type** and **Authorization System**.
1. Select **Create Role**.
1. On the **Details** page, the **Authorization System Type** and **Authorization System** are pre-populated from your previous settings.
    - To change the settings, select the box and make a selection from the dropdown.
1. Under **How Would You Like To Create The Role?**, select the required option:

    - **Activity of User(s)**: Allows you to create a role based on user activity.
    - **Activity of Group(s)**: Allows you to create a role based on the aggregated activity of all the users belonging to the group(s).
    - **Activity of Service Account(s)**: Allows you to create a role based on the aggregated activity of all service accounts.
    - **From Existing Role**: Allows you to create a new role based on an existing role.
     - **New Role**: Allows you to create a new role from scratch.

1. In **Tasks performed in last**, select the duration: **90 days**, **60 days**, **30 days**, **7 days**, or **1 day**.
1. If you selected **Activity Of Service Account(s)** in the previous step, select or deselect **Collect activity across all GCP Authorization Systems.**
1. From the **Available** column, select the plus sign **(+)** to move the identity into the **Selected** column, and then select **Next**.


1. On the **Tasks** page, in **Role name:**, enter a name for your role.
1. From the **Available** column, select the plus sign **(+)** to move the task into the **Selected** column.
    - To add a whole category, select a category.
    - To add individual items from a category, select the down arrow on the left of the category name, and then select individual items.
1. Select **Next**.

1. On the **Preview** page, review:
    - The list of selected **Actions**.
    - The **YAML** or **Script** to confirm it's what you want.
1. If your controller isn't enabled, select **Download YAML** or **Download Script** to download the code and run it yourself.
1. Select **Submit**.
    A message confirms that your role has been submitted for creation

1. The [**Permissions Management Tasks**](ui-tasks.md) pane appears on the right.

    - The **Active** tab displays a list of the policies Permissions Management is currently processing.
    - The **Completed** tab displays a list of the policies Permissions Management has completed.
1. Refresh the **Role/Policies** tab to see the role you created.


## Next steps

- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
- For information on how to modify a role/policy, see [Modify a role/policy](how-to-modify-role-policy.md).
- For information on how to clone a role/policy, see [Clone a role/policy](how-to-clone-role-policy.md).
- For information on how to delete a role/policy, see [Delete a role/policy](how-to-delete-role-policy.md).
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md).
- For information on how to attach and detach permissions for AWS identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).
- For information on how to revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities, see [Revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities](how-to-revoke-task-readonly-status.md)
- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](how-to-create-approve-privilege-request.md).
