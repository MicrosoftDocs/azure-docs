---
title: View existing roles/policies and requests for permission in the JEP Controller in Microsoft CloudKnox Permissions Management
description: How to view existing roles/policies and requests for permission in the JEP Controller in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/01/2022
ms.author: v-ydequadros
---

# View existing roles/policies and requests for permission

The Just Enough Permissions (JEP) Controller dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) provides an overview of roles/policies, permissions, a list of existing requests for permissions, and requests for permissions you have made.

This article provides an overview of the components of the **JEP Controller** dashboard.

> [!NOTE]
> To view the **JEP Controller** tab, your role must be **Viewer**, **Controller**, or **Administrator**. To make changes on this tab, you must be a **Controller** or **Administrator**. If you don’t have access, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Display the JEP Controller

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.
1. Use the drop-down lists to select the **Authorization System Type** and **Authorization System**.

    The JEP Controller dashboard includes six tabs: 

    - **Roles/Policies**: Use this tab to add filters to your role/policy.
    - **Permissions**: Use this tab to add filters to your permissions.
    - **Role/Policy template**: Use this tab to create a template for roles/policies.
    - **Requests**: Use this tab to 
    - **My requests**: Use this tab to 
    - **Settings**: Use this tab to select **Request role/policy filters**, **Request settings**, and **Auto-approve** settings.

    This article provides an overview of each tab.

## View and create roles/policies 

The **Role/Policies** tab provides the following settings that you can use to view and create a role/policy.

- **Authorization system type**: Displays a drop-down list of authorization system types you can access, Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).
- **Authorization system**: Displays a list of authorization systems accounts you can access.
- **Role/Policy type**: A drop-down list of available role/policy types. You can select **All**, **Custom**, **System**, or **CloudKnox only**.
- **Role/Policy status**: A drop-down list of available role/policy statuses. You can select **All**, **Assigned**, or **Unassigned**.
- **Role/Policy usage**: A drop-down list of **All** or **Unused** roles/policies.
- **Apply**: Select this option to save the changes you've made.
- **Reset Filter**: Select this option to discard the changes you've made.

The **Role/Policies list** displays a list of existing roles/policies and the following information:
    - **Role/Policy name** 
    - **Role/Policy type**: **Custom**, **System**, or **CloudKnox only**
    - **Actions** 
        - Select **Clone** to create a duplicate copy of the role/policy.
        - Select **Modify** to change the existing role/policy.
        - Select **Delete** to delete the role/policy.  

- **Search**: Select this option to search for a specific role/policy.
- **Reload**: Select this option to refresh the displayed list of roles/policies.
- **Create Role/Policy**: Select this option to create a new role/policy. For more information, see [Create a role/policy](howto-create-role-policy.md).


- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file. 

    When the file is successfully exported, a message appears: **Exported successfully.**

    - Check your email for the message from the CloudKnox Customer Success Team. This email contains a link to: 
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.


## Add filters to permissions

The **Permissions** tab provides the following settings that you can use to add filters to your permissions.

- **Authorization system type**: Displays a drop-down list of authorization system types you can access, AWS, Azure, and GCP.
- **Authorization system**: Displays a list of authorization systems accounts you can access.
- **Search for**: A drop-down list from which you can select **Group**, **User**, or **Role**.
- **User status**: A drop-down list from which you can select **Any**, **Active**, or **Inactive**.
- **Privilege creep index** (PCI): A drop-down list from which you can select a PCI rating of **Any**, **High**, **Medium**, or **Low**.
- **Task Usage**: A drop-down list from which you can select **Any**, **Granted**, **Used**, or **Unused**.
- **Enter a username**: A drop-down list from which you can select a username.
- **Enter a Group Name**: A drop-down list from which you can select a group name.
- **Apply**: Select this option to save the changes you've made and run the filter.
- **Reset Filter**: Select this option to discard the changes you've made.
- **Export CSV**: Select this option to export the displayed list of roles/policies as a comma-separated values (CSV) file. 

    When the file is successfully exported, a message appears: **Exported successfully.**

    - Check your email for the message from the CloudKnox Customer Success Team. This email contains a link to: 
        - The **Role Policy Details** report in CSV format.
        - The **Reports** dashboard where you can configure how and when you can automatically receive reports.


## Create templates for roles/policies

Use the Role/Policy template tab to create a template for roles/policies.

- **Authorization system type**: Displays a drop-down list of authorization system types you can access, WS, Azure, and GCP.
- **Create template**: Select this option to create a template.

    - In the **Details** page, make the required selections:
        - **Authorization system type**: Select the authorization system types you want, **AWS**, **Azure**, or **GCP**.
        - **Template name**: Enter a name for your template, and then select **Next**.
    - In the **Statements** page,  complete the **Tasks**, **Resources**, **Request conditions** and **Effect** sections. Then select **Save** to save your role/policy template.


## View requests for permission 

Use the **Requests** tab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made.

Optional selections:

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
    - **||| Columns**: From the drop-down list, select the columns you want to display.

**To return to the previous view:**

- Select the up arrow.  

### View approved requests

The **Approved** table displays information about the requests that have been approved.

### View processed requests

The **Processed** table displays information about the requests that have been processed.

## View requests for permission for your approval 

Use the **My Requests** tab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made and you must approve or reject.

Optional selections:

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
    - **||| Columns**: From the drop-down list, select the columns you want to display.


### View approved requests

The **Approved** table displays information about the requests that have been approved.

### View processed requests

The **Processed** table displays information about the requests that have been processed.

## Make setting selections for requests and auto-approval

The **Settings** tab provides the following settings that you can use to make setting selections to **Request role/policy filters**, **Request settings**, and **Auto-approve** requests.

- **Authorization system type**: Displays a drop-down list of authorization system types you can access, Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).
- **Authorization system**: Displays a list of authorization systems accounts you can access.
- **Reload**: Select this option to refresh the displayed list of role/policy filters.
- **Create filter**: Select this option to create a new filter. For more information, see Create a filter.


## Next steps

- For information on how to view roles/policies, see [View information about roles/policies in the JEP Controller](howto-view-role-policy.md).