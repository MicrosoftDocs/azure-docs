---
title: View information about roles/ policies in the Remediation dashboard in CloudKnox Permissions Management
description: How to view and filter information about roles/ policies in the Remediation dashboard in CloudKnox Permissions Management.
services: active-directory
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2022
ms.author: kenwith
---

# View information about roles/ policies in the Remediation dashboard

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

The **Remediation** dashboard in CloudKnox Permissions Management (CloudKnox) enables system administrators to view, adjust, and remediate excessive permissions based on a user's activity data. You can use the **Roles/Policies** subtab in the dashboard to view information about roles and policies in the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems. 

> [!NOTE]
> To view the **Remediation dashboard** tab, you must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don’t have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.


## View information about roles/policies

1. On the CloudKnox home page, select the **Remediation** tab, and then select the **Role/Policies** subtab.

    The **Role/Policies list** displays a list of existing roles/policies and the following information about each role/policy
        - **Role/Policy Name**: The name of the roles/policies available to you.
        - **Role/Policy Type**: **Custom**, **System**, or **CloudKnox Only**
        - **Actions**: The type of action you can perform on the role/policy, **Clone**, **Modify**, or **Delete**


1. To display details about the role/policy and view its assigned tasks and identities, select the arrow to the left of the role/policy name. 

    The **Tasks** list appears, displaying:
    - A list of **Tasks**.
    - **For AWS:** 
        - The **Users**, **Groups**, and **Roles** the task is **Directly Assigned To**.
        - The **Group Members** and **Role Identities** the task is **Indirectly Accessible By**. 

    - **For Azure:** 
        - The **Users**, **Groups**, **Enterprise Applications** and **Managed Identities** the task is **Directly Assigned To**.
        - The **Group Members** the task is **Indirectly Accessible By**.

    - **For GCP:** 
        - The **Users**, **Groups**, and **Service Accounts** the task is **Directly Assigned To**.
        - The **Group Members** the task is **Indirectly Accessible By**.

1. To close the role/policy details, select the arrow to the left of the role/policy name.

## Export information about roles/policies

- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file. 

    When the file is successfully exported, a message appears: **Exported Successfully.**

    - Check your email for a message from the CloudKnox Customer Success Team. This email contains a link to: 
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.




## Filter information about roles/policies

1. On the CloudKnox home page, select the **Remediation** dashboard, and then select the **Role/Policies** tab.
1. To filter the roles/policies, select from the following options:

    - **Authorization System Type**: Select **AWS**, **Azure**, or **GCP**.
    - **Authorization System**: Select the accounts you want.
    - **Role/Policy Type**: Select from the following options:

         - **All**: All managed roles/policies.
         - **Custom**: A customer-managed role/policy. 
         - **System**: A cloud service provider-managed role/policy. 
         - **CloudKnox Only**: A role/policy created by CloudKnox.

    - **Role/Policy Status**: Select **All**, **Assigned**, or **Unassigned**.
    - **Role/Policy Usage**: Select **All** or **Unused**.
1. Select **Apply**.

    To discard your changes, select **Reset Filter**.


## Next steps

- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](cloudknox-ui-remediation.md).
- For information on how to create a role/policy, see [Create a role/policy](cloudknox-howto-create-role-policy.md).
- For information on how to clone a role/policy, see [Clone a role/policy](cloudknox-howto-clone-role-policy.md).
- For information on how to delete a role/policy, see [Delete a role/policy](cloudknox-howto-delete-role-policy.md).
- For information on how to modify a role/policy, see Modify a role/policy](cloudknox-howto-modify-role-policy.md).
- For information on how to attach and detach permissions AWS identities, see [Attach and detach policies for AWS identities](cloudknox-howto-attach-detach-permissions.md).
- For information on how to revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities, see [Revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities](cloudknox-howto-revoke-task-readonly-status.md)
- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](cloudknox-howto-create-approve-privilege-request.md).
- For information on how to view information about roles/policies, see [View information about roles/policies](cloudknox-howto-view-role-policy.md)
