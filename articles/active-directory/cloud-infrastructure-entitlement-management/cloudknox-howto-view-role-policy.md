---
title: View information about roles/policies in the JEP Controller in Microsoft CloudKnox Permissions Management
description: How to view and filter information about roles/policies in the JEP Controller in Microsoft CloudKnox Permissions Management.
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

# View information about roles/policies in the JEP Controller

The **Roles/Policies** in the Just Enough Permissions (JEP) Controller in Microsoft CloudKnox Permissions Management (CloudKnox) enables system administrators to view, adjust, and remediate excessive permissions based on a user's activity data. You can use the JEP Controller to view information about roles and policies in the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems. 

> [!NOTE]
> To view the **JEP Controller** tab, your role must be **Viewer**, **Controller**, or **Administrator**. To make changes on this tab, you must be a **Controller** or **Administrator**. If you don’t have access, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.


## View information about roles/policies

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.

    The **Roles/Policy list** appears, displaying: 

    - **Role/Policy name**: The name of the role/policy. If the role/policy is not currently being used, a red **i** icon displays to the right of the name.
    - **Policy type**: The type of role/policy, **Custom**, **System**, or **CloudKnox only**.
    - **Actions**: The type of action you can perform on the role/policy, **Clone**, **Modify**, or **Delete**

1. To view the **Policy summary**, hover over a role/policy name, and then select the **View** (the eye icon) that appears next to the role/policy name.
 
    The **Policy summary** displays the **Policy name**, the **Policy type**, and the script.
    - To copy the script, select **Copy**.

1. To expand details about the role/policy and view its assigned tasks and identities, select the arrow to the left of the role/policy name. 

    The **Tasks** list appears, displaying:
    - A list of **Tasks**.
    - The **Users**, **Groups** and **Roles** the task is **Directly assigned to**.
    - The **Group members** and **Role identities** the task is **Indirectly assessible by**.

1. To close the role/policy details, select the arrow to the left of the role/policy name.

## Filter information about roles/policies

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.
1. To filter the roles/policies, select from the following options:

    - **Authorization system type**: Select **AWS**, **Azure**, or **GCP**.
    - **Authorization system**: Select the accounts you want.
    - **Role/Policy pype**: Select from the following options:

         - **All** - All managed roles/policies.
         - **Custom** - A customer managed role/policy. 
         - **System**: A cloud service provider managed role/policy. 
         - **CloudKnox only** - A role/policy created by CloudKnox.

    - **Role/Policy status**: Select **All**, **Assigned**, or **Unassigned**.
    - **Role/Policy usage** - Select **All** or **Unused**.
1. Select **Apply**.

    To discard your changes, select **Reset filter**.

## Next steps

- For information on how to create roles/policies, see [Create a role/policy in the JEP Controller](cloudknox-howto-create-role-policy.md).
- For information on how to clone roles/policies, see [Clone a role/policy in the JEP Controller](cloudknox-howto-clone-role-policy.md).
- For information on how to modify roles/policies, see [Modify a role/policy in the JEP Controller](cloudknox-howto-modify-role-policy.md).
- For information on how to delete roles/policies, see [Delete a role/policy in the JEP Controller](cloudknox-howto-delete-role-policy.md).