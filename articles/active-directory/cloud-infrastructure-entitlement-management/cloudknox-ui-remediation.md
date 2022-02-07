---
title: View existing roles/policies and requests for permission in the Remediation dashboard in CloudKnox Permissions Management
description: How to view existing roles/policies and requests for permission in the Remediation dashboard in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/07/2022
ms.author: v-ydequadros
---

# View roles/policies and requests for permission in the Remediation dashboard

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

The **Remediation** dashboard in CloudKnox Permissions Management (CloudKnox) provides an overview of roles/policies, permissions, a list of existing requests for permissions, and requests for permissions you have made.

This article provides an overview of the components of the **Remediation** dashboard.

> [!NOTE]
> To view the **Remediation** dashboard, your must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this dashboard, you must have **Controller** or **Administrator** permissions. If you don’t have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Display the Remediation dashboard

1. On the CloudKnox home page, select the **Remediation** tab.

    The **Remediation** dashboard includes six subtabs: 

    - **Roles/Policies**: Use this subtab to add filters to your role/policy.
    - **Permissions**: Use this subtab to add filters to your permissions.
    - **Role/Policy template**: Use this subtab to create a template for roles/policies.
    - **Requests**: Use this subtab to 
    - **My requests**: Use this subtab to 
    - **Settings**: Use this subtab to select **Request role/policy filters**, **Request settings**, and **Auto-approve** settings.

1. Use the dropdown to select the **Authorization System Type** and **Authorization System**, and then select **Apply**..

## View and create roles/policies 

The **Role/Policies** subtab provides the following settings that you can use to view and create a role/policy.

- **Authorization system type**: Displays a dropdown with authorization system types you can access, Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).
- **Authorization system**: Displays a list of authorization systems accounts you can access.
- **Role/Policy type**: A dropdown with available role/policy types. You can select **All**, **Custom**, **System**, or **CloudKnox only**.
- **Role/Policy status**: A dropdown with available role/policy statuses. You can select **All**, **Assigned**, or **Unassigned**.
- **Role/Policy usage**: A dropdown with **All** or **Unused** roles/policies.
- **Apply**: Select this option to save the changes you've made.
- **Reset Filter**: Select this option to discard the changes you've made.

The **Role/Policies list** displays a list of existing roles/policies and the following information about each role/policy
    - **Role/Policy name**: The name of the roles/policies available to you.
    - **Role/Policy type**: **Custom**, **System**, or **CloudKnox only**
    - **Actions** 
        - Select **Clone** to create a duplicate copy of the role/policy.
        - Select **Modify** to change the existing role/policy.
        - Select **Delete** to delete the role/policy.  

Other options available to you:
- **Search**: Select this option to search for a specific role/policy.
- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file. 

    When the file is successfully exported, a message appears: **Exported successfully.**

    - Check your email for a message from the CloudKnox Customer Success Team. This email contains a link to: 
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.
- **Create Role/Policy**: Select this option to create a new role/policy. For more information, see [Create a role/policy](cloudknox-howto-create-role-policy.md).


## Add filters to permissions

The **Permissions** subtab provides the following settings that you can use to add filters to your permissions.

- **Authorization system type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
- **Authorization system**: Displays a list of authorization systems accounts you can access.
- **Search for**: A dropdown from which you can select **Group**, **User**, or **Role**.
- **User status**: A dropdown from which you can select **Any**, **Active**, or **Inactive**.
- **Privilege creep index** (PCI): A dropdown from which you can select a PCI rating of **Any**, **High**, **Medium**, or **Low**.
- **Task Usage**: A dropdown from which you can select **Any**, **Granted**, **Used**, or **Unused**.
- **Enter a username**: A dropdown from which you can select a username.
- **Enter a Group Name**: A dropdown from which you can select a group name.
- **Apply**: Select this option to save the changes you've made and run the filter.
- **Reset Filter**: Select this option to discard the changes you've made.
- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file. 

    When the file is successfully exported, a message appears: **Exported successfully.**

    - Check your email for a message from the CloudKnox Customer Success Team. This email contains a link to: 
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.


## Create templates for roles/policies

Use the **Role/Policy template** subtab to create a template for roles/policies.

1. Select:
    - **Authorization system type**: Displays a dropdown with authorization system types you can access, WS, Azure, and GCP.
    - **Create template**: Select this option to create a template.

1. In the **Details** page, make the required selections:
    - **Authorization system type**: Select the authorization system types you want, **AWS**, **Azure**, or **GCP**.
    - **Template name**: Enter a name for your template, and then select **Next**.

1. In the **Statements** page,  complete the **Tasks**, **Resources**, **Request conditions** and **Effect** sections. Then select **Save** to save your role/policy template.

Other options available to you:
- **Search**: Select this option to search for a specific role/policy.
- **Reload**: Select this option to refresh the displayed list of roles/policies.
- 
## View requests for permission 

Use the **Requests** tab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made.

- Select:
    - **Authorization system type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
    - **Authorization system**: Displays a list of authorization systems accounts you can access.

Other options available to you:

- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Search**: Select this option to search for a specific role/policy.
- **||| Columns**: Select one or more of the following to view more information about the request:
    - **Submitted by**
    - **On behalf of**
    - **Authorization system**
    - **Tasks/scope/policies**
    - **Request date**
    - **Schedule**
    - **Submitted**
    - **Reset to default**: Select this option to discard your settings.

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
    - **||| Columns**: From the dropdown, select the columns you want to display.

**To return to the previous view:**

- Select the up arrow.  

### View approved requests

The **Approved** table displays information about the requests that have been approved.

### View processed requests

The **Processed** table displays information about the requests that have been processed.

## View requests for permission for your approval 

Use the **My Requests** subtab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made and you must approve or reject.

- Select:
    - **Authorization system type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
    - **Authorization system**: Displays a list of authorization systems accounts you can access.

Other options available to you:

- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Search**: Select this option to search for a specific role/policy.
- **||| Columns**: Select one or more of the following to view more information about the request:
    - **On behalf of**
    - **Authorization system**
    - **Tasks/scope/policies**
    - **Request date**
    - **Schedule**
    - **Reset to default**: Select this option to discard your settings.
- **New request**: Select this option to create a new request for permissions. For more information, see Create a request for permissions.

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
    - **||| Columns**: From the dropdown, select the columns you want to display.


### View approved requests

The **Approved** table displays information about the requests that have been approved.

### View processed requests

The **Processed** table displays information about the requests that have been processed.

## Make setting selections for requests and auto-approval

The **Settings** subtab provides the following settings that you can use to make setting selections to **Request role/policy filters**, **Request settings**, and **Auto-approve** requests.

- **Authorization system type**: Displays a dropdown with authorization system types you can access, AWS, Azure, and GCP.
- **Authorization system**: Displays a list of authorization systems accounts you can access.
- **Reload**: Select this option to refresh the displayed list of role/policy filters.
- **Create filter**: Select this option to create a new filter.

## Next steps


- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](cloudknox-ui-remediation.md).
- For information on how to create a role/policy, see [Create a role/policy](cloudknox-howto-create-role-policy.md).
- For information on how to clone a role/policy, see [Clone a role/policy](cloudknox-howto-clone-role-policy.md).
- For information on how to delete a role/policy, see [Delete a role/policy](cloudknox-howto-delete-role-policy.md).
- For information on how to modify a role/policy, see Modify a role/policy](cloudknox-howto-modify-role-policy.md).
- To view information about roles/policies, see [View information about roles/policies](cloudknox-howto-view-role-policy.md).
- For information on how to attach and detach permissions for AWS identities, see [Attach and detach policies for AWS identities](cloudknox-howto-attach-detach-permissions.md).
- For information on how to revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities, see [Revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities](cloudknox-howto-revoke-task-readonly-status.md)
- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](cloudknox-howto-create-approve-privilege-request.md).
- For information on how to view information about roles/policies, see [View information about roles/policies](loudknox-howto-view-role-policy.md)

