---
title: Microsoft CloudKnox Permissions Management - Create or approve a request for privileges with the privilege on demand (POD) work flow in the Just Enough Permissions (JEP) Controller
description: How to create or approve a request for privileges with the privilege on demand (POD) work flow in the Just Enough Permissions (JEP) Controller.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/28/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Create or approve a request for privileges with the privilege on demand (POD) work flow in the Just Enough Permissions (JEP) Controller

This topic describes how you can create or approve a request for privileges with the privilege on demand (POD) work flow in the Just Enough Permissions (JEP) Controller.

The POD has two workflows:
- **New Request** – Used by a user to create a request for privileges for a specified duration.
- **Approver** – Used by an approver to review and approve or reject a user’s request for privileges.

> [!NOTE]
> You must have access to the JEP Controller to perform these tasks. If you don’t have Controller access, contact your system administrator.

## Create a new request for privileges using the POD workflow

1. Select the **JEP Controller** tab.
2. Select the **My Requests** tab.

    The **My Requests** tab displays the following options:
    - **Pending Requests**: A list of requests you’ve made but haven't yet been reviewed.
    - **Approved Requests**: A list of requests that have been reviewed and approved by the approver. These requests have either already been activated or are in the process of being activated.
    - **Processed Requests**: A summary of the requests you’ve created that have been approved (**Done**), **Rejected**, and requests that have been **Canceled**.
3. Select **New Request** to open the wizard.
4. From the **Select an Auth System Type** drop-down list, select the authorization system type you want to access.
5. From the **Select an Auth System** drop-down list, select the authorization system you want to access.
6. From the **User** drop-down list, select the user on whose behalf you’re requesting access.
7. If the user you select is a Security Assertions Markup Language (SAML) user, and since a SAML user accesses the system through assumption of a role, in **Role**, select the user’s role.
8. If the user you select is a local user, to select the policies you want:
    1. Select **Request Policies**.
    2. In **Available Policies**, select the tasks you want.
    3. To select a specific policy, select the plus sign, and then select the policy you want.

    The tasks you’ve selected appear in the **Selected Policies** box.
9. If the user you select is a local user, to select the tasks you want:
    1. Select **Request Tasks**.
    2. In **Available Tasks**, select the tasks you want.
    3. To select a specific task, select the plus sign, and then select the task you want.

    The tasks you’ve selected appear in the **Selected Tasks** box.
10. If the user already has policies, they're displayed in **Existing Policies**.
11. Select **Next**.

    The **Scope** page appears.
12. In **Select Scope**, select:
    - **All Resources**
    - **Specific Resources**, and then select the resources you want.
    - **No Resources**
13. In **Request Conditions**:
    1. Select **JSON** to add a JSON block of code.
    2. Select **Done** to accept the code you’ve entered, or **Clear** to delete what you’ve entered and start again.
14. In **Effect**, select **Allow** or **Deny.**
15. Select **Next**.

    The **Confirmation** page appears.
16. In **Request Summary**, enter a summary for your request.
17. Optional: In **Note**, enter a note for the approver.
18. In **Schedule**, select when (how quickly) you want your request to be processed:
    - **ASAP**
    - **Once** 
        1. In **Create Schedule**, select the **Frequency**, **Date**, **Time** and **For** the required duration. 
        2. Select **Schedule**.
    - **Daily**
    - **Weekly**
    - **Monthly**
19. Select **Submit**.

    The following message appears: **Your request has been successfully submitted.**

    The request you submitted is now listed in **Pending Requests**.

## Approve a new request for privileges using the POD workflow

> [!NOTE]
> You must have **Controller** access to the JEP Controller to perform these tasks. If you don’t have Controller access, contact your system administrator.

1. Select the **JEP Controller** tab.
2. Select the **Requests** tab.

    The **Requests** tab displays the following options:
    - **Pending Requests**: A list of requests that haven't yet been reviewed.
    - **Approved Requests**: A list of requests that have been reviewed and approved. These requests have either already been activated or are in the process of being activated.
    - **Processed Requests**: A summary of requests that have been approved (**Done**) or **Rejected**, and requests that have been **Canceled**.
3. In the **Request Summary** list, select the ellipses **(…)** menu on the right of a request.
4. From the menu list, select:
    **Details** - to view the details of the request.
    **Approve**
    **Reject**

    In **Request Details**, review the details of the request, and then select **Approve** or **Reject**.
5. In **Approve Request**, add a note to the requestor (optional), and then select **Confirm.**

    The request you approved is now listed in **Approved Requests**.


<!---## Next steps--->
