---
title: Create or approve a request for permissions in the JEP Controller in CloudKnox Permissions Management
description: How to create or approve a request for permissions in the JEP Controller.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Create or approve a request for permissions

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to create or approve a request for permissions in the Just Enough Permissions (JEP) Controller in CloudKnox Permissions Management (CloudKnox). You can create and approve requests for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems.

The JEP Controller has two privilege on demand (POD) workflows you can use:
- **New Request** – The workflow used by a user to create a request for permissions for a specified duration.
- **Approver** – The workflow used by an approver to review and approve or reject a user’s request for permissions.


> [!NOTE]
> To view the **JEP Controller** tab, you must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don’t have these permissions, contact your system administrator.

## Create a request for permissions using the POD workflow

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **My requests** subtab.

    The **My requests** subtab displays the following options:
    - **Pending**: A list of requests you’ve made but haven't yet been reviewed.
    - **Approved**: A list of requests that have been reviewed and approved by the approver. These requests have either already been activated or are in the process of being activated.
    - **Processed**: A summary of the requests you’ve created that have been approved (**Done**), **Rejected**, and requests that have been **Canceled**.

1. Select **New Request** to open the wizard.
1. From the **Select an authorization system type** dropdown, select the authorization system type you want to access: **AWS**, **Azure** or **GCP**.
1. From the **Select an authorization system** dropdown, select the accounts you want to access.
1. From the **Identity** dropdown , select the identity on whose behalf you’re requesting access.

    - If the identity you select is a Security Assertions Markup Language (SAML) user, and since a SAML user accesses the system through assumption of a role, in **Role**, select the user’s role.

    - If the identity you select is a local user, to select the policies you want:
        1. Select **Request policies**.
        1. In **Available policies**, select the policies you want.
        1. To select a specific policy, select the plus sign, and then find and select the policy you want.

        The policies you’ve selected appear in the **Selected policies** box.

    - If the identity you select is a local user, to select the tasks you want:
        1. Select **Request Tasks**.
        1. In **Available Tasks**, select the tasks you want.
        1. To select a specific task, select the plus sign, and then select the task you want.

        The tasks you’ve selected appear in the **Selected Tasks** box.

1. If the user already has existing policies, they're displayed in **Existing Policies**.
1. Select **Next**.

    The **Scope** page appears.

1. In **Select scope**, select:
    - **All Resources**
    - **Specific Resources**, and then select the resources you want.
    - **No Resources**
1. In **Request Conditions**:
    1. Select **JSON** to add a JSON block of code.
    1. Select **Done** to accept the code you’ve entered, or **Clear** to delete what you’ve entered and start again.
1. In **Effect**, select **Allow** or **Deny.**
1. Select **Next**.

    The **Confirmation** page appears.

1. In **Request Summary**, enter a summary for your request.
1. Optional: In **Note**, enter a note for the approver.
1. In **Schedule**, select when (how quickly) you want your request to be processed:
    - **ASAP**
    - **Once** 
        1. In **Create Schedule**, select the **Frequency**, **Date**, **Time** and **For** the required duration. 
        1. Select **Schedule**.
    - **Daily**
    - **Weekly**
    - **Monthly**
1. Select **Submit**.

    The following message appears: **Your request has been successfully submitted.**

    The request you submitted is now listed in **Pending Requests**.

## Approve a request for permissions using the POD workflow

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **My requests** subtab.

    The **My requests** subtab displays the following options:
    - **Pending Requests**: A list of requests that haven't yet been reviewed.
    - **Approved Requests**: A list of requests that have been reviewed and approved. These requests have either already been activated or are in the process of being activated.
    - **Processed Requests**: A summary of requests that have been approved (**Done**) or **Rejected**, and requests that have been **Canceled**.
1. In the **Request Summary** list, select the ellipses **(…)** menu on the right of a request, and then select:
    - **Details** to view the details of the request.
    - **Approve** to approve the request.
    - **Reject** to reject the request.

1. In **Approve Request**, add a note to the requestor (optional), and then select **Confirm.**

    The request you approved is now listed in the **Approved** subtab.


## Next steps

- For information on how to attach and detach permissions for users, roles, and resources manually or or using the JEP Controller, see [Attach and detach permissions for identities](cloudknox-howto-attach-detach-permissions.md).