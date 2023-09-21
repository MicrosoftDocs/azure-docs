---
title: View existing roles/policies and requests for permission in the Remediation dashboard in Permissions Management
description: How to view existing roles/policies and requests for permission in the Remediation dashboard in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 09/15/2023
ms.author: jfields
---

# View roles/policies and requests for permission in the Remediation dashboard

The **Remediation** dashboard in Permissions Management provides an overview of roles/policies, permissions, a list of existing requests for permissions, and requests for permissions you have made.

This article provides an overview of the components of the **Remediation** dashboard.

> [!NOTE]
> To view the **Remediation** dashboard, you must have **Viewer**, **Controller**, or **Approver** permissions. To make changes on this dashboard, you must have **Controller** or **Approver** permissions. If you don't have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other cloud providers call *policy*. Permissions Management automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Display the Remediation dashboard

1. On the Permissions Management home page, select the **Remediation** tab.

    The **Remediation** dashboard includes six subtabs:

    - **Roles/Policies**: Use this subtab to perform Create Read Update Delete (CRUD) operations on roles/policies.
    - **Permissions**: Use this subtab to perform Read Update Delete (RUD) on granted permissions.
    - **Role/Policy Template**: Use this subtab to create a template for roles/policies template.
    - **Requests**: Use this subtab to view approved, pending, and processed Permission on Demand (POD) requests.
    - **My Requests**: Use this tab to manage lifecycle of the POD request either created by you or needs your approval.
    - **Settings**: Use this subtab to select **Request Role/Policy Filters**, **Request Settings**, and **Auto-Approve** settings.

1. Use the dropdown to select the **Authorization System Type** and **Authorization System**, and then select **Apply**.

## View and create roles/policies

The **Role/Policies** subtab provides the following settings that you can use to view and create a role/policy.

- **Authorization System Type**: Displays a dropdown with authorization system types you can access, Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).
- **Authorization System**: Displays a list of authorization systems accounts you can access.
- **Policy Type**: A dropdown with available role/policy types. You can select **All**, **Custom**, **System**, or **Permissions Management Only**.
- **Policy Status**: A dropdown with available role/policy statuses. You can select **All**, **Assigned**, or **Unassigned**.
- **Policy Usage**: A dropdown with **All** or **Unused** roles/policies.
- **Apply**: Select this option to save the changes you've made.
- **Reset Filter**: Select this option to discard the changes you've made.

The **Policy list** displays a list of existing roles/policies and the following information about each role/policy.

- **Policy Name**: The name of the roles/policies available to you.
- **Policy Type**: **Custom**, **System**, or **Permissions Management Only**
- **Actions**
    - Select **Clone** to create a duplicate copy of the role/policy.
    - Select **Modify** to change the existing role/policy.
    - Select **Delete** to delete the role/policy.

Other options available to you:
- **Search**: Select this option to search for a specific role/policy.
- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file.

    When the file is successfully exported, a message appears: **Exported Successfully.**

    - Check your email for a message from the Permissions Management Customer Success Team. This email contains a link to:
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.
- **Create Role/Policy**: Select this option to create a new role/policy. For more information, see [Create a role/policy](how-to-create-role-policy.md).


## Add filters to permissions

The **Permissions** subtab provides the following settings that you can use to add filters to your permissions.

- **Authorization System Type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
- **Authorization System**: Displays a list of authorization systems accounts you can access.
- **Search For**: A dropdown from which you can select **Group**, **User**, or **Role**.
- **User Status**: A dropdown from which you can select **Any**, **Active**, or **Inactive**.
- **Privilege Creep Index** (PCI): A dropdown from which you can select a PCI rating of **Any**, **High**, **Medium**, or **Low**.
- **Task Usage**: A dropdown from which you can select **Any**, **Granted**, **Used**, or **Unused**.
- **Enter a Username**: A dropdown from which you can select a username.
- **Enter a Group Name**: A dropdown from which you can select a group name.
- **Apply**: Select this option to save the changes you've made and run the filter.
- **Reset Filter**: Select this option to discard the changes you've made.
- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file.

    When the file is successfully exported, a message appears: **Exported Successfully.**

    - Check your email for a message from the Permissions Management Customer Success Team. This email contains a link to:
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.


## Create templates for roles/policies

Use the **Role/Policy Template** subtab to create a template for roles/policies.

1. Select:
    - **Authorization System Type**: Displays a dropdown with authorization system types you can access, WS, Azure, and GCP.
    - **Create Template**: Select this option to create a template.

1. In the **Details** page, make the required selections:
    - **Authorization System Type**: Select the authorization system types you want, **AWS**, **Azure**, or **GCP**.
    - **Template Name**: Enter a name for your template, and then select **Next**.

1. In the **Statements** page,  complete the **Tasks**, **Resources**, **Request Conditions** and **Effect** sections. Then select **Save** to save your role/policy template.

Other options available to you:
- **Search**: Select this option to search for a specific role/policy.
- **Reload**: Select this option to refresh the displayed list of roles/policies.

## View requests for permission

Use the **Requests** tab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made.

- Select:
    - **Authorization System Type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
    - **Authorization System**: Displays a list of authorization systems accounts you can access.

Other options available to you:

- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Search**: Select this option to search for a specific role/policy.
- **Columns**: Select one or more of the following to view more information about the request:
    - **Submitted By**
    - **On Behalf Of**
    - **Authorization System**
    - **Tasks/Scope/Policies**
    - **Request Date**
    - **Schedule**
    - **Submitted**
    - **Reset to Default**: Select this option to discard your settings.

### View pending requests

The **Pending** table displays the following information:

- **Summary**: A summary of the request.
- **Submitted By**: The name of the user who submitted the request.
- **On Behalf Of**: The name of the user on whose behalf the request was made.
- **Authorization System**: The authorization system the user selected.
- **Task/Scope/Policies**: The type of task/scope/policy selected.
-  **Request Date**: The date when the request was made.
- **Submitted**: The period since the request was made.
- The ellipses **(...)** menu - Select the ellipses, and then select **Details**, **Approve**, or **Reject**.
- Select an option:
    - **Reload**: Select this option to refresh the displayed list of roles/policies.
    - **Search**: Select this option to search for a specific role/policy.
    - **Columns**: From the dropdown, select the columns you want to display.

**To return to the previous view:**

- Select the up arrow.

### View approved requests

The **Approved** table displays information about the requests that have been approved.

### View processed requests

The **Processed** table displays information about the requests that have been processed.

## View requests for permission for your approval

Use the **My Requests** subtab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made and you must approve or reject.

- Select:
    - **Authorization System Type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
    - **Authorization System**: Displays a list of authorization systems accounts you can access.

Other options available to you:

- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Search**: Select this option to search for a specific role/policy.
- **Columns**: Select one or more of the following to view more information about the request:
    - **On Behalf Of**
    - **Authorization System**
    - **Tasks/Scope/Policies**
    - **Request Date**
    - **Schedule**
    - **Reset to Default**: Select this option to discard your settings.
- **New Request**: Select this option to create a new request for permissions. For more information, see Create a request for permissions.

### View pending requests

The **Pending** table displays the following information:

- **Summary**: A summary of the request.
- **Submitted By**: The name of the user who submitted the request.
- **On Behalf Of**: The name of the user on whose behalf the request was made.
- **Authorization System**: The authorization system the user selected.
- **Task/Scope/Policies**: The type of task/scope/policy selected.
-  **Request Date**: The date when the request was made.
- **Submitted**: The period since the request was made.
- The ellipses **(...)** menu - Select the ellipses, and then select **Details**, **Approve**, or **Reject**.
- Select an option:
    - **Reload**: Select this option to refresh the displayed list of roles/policies.
    - **Search**: Select this option to search for a specific role/policy.
    - **Columns**: From the dropdown, select the columns you want to display.


### View approved requests

The **Approved** table displays information about the requests that have been approved.

### View processed requests

The **Processed** table displays information about the requests that have been processed.

## Make setting selections for requests and auto-approval

The **Settings** subtab provides the following settings that you can use to make setting selections to **Request Role/Policy Filters**, **Request Settings**, and **Auto-Approve** requests.

- **Authorization System Type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
- **Authorization System**: Displays a list of authorization systems accounts you can access.
- **Reload**: Select this option to refresh the displayed list of role/policy filters.
- **Create Filter**: Select this option to create a new filter.

## Next steps

- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](how-to-create-approve-privilege-request.md).