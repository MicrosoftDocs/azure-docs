---
title: Microsoft CloudKnox Permissions Management Just Enough Permissions (JEP) Controller dashboard
description: How to use the Microsoft CloudKnox Permissions Management Just Enough Permissions (JEP) Controller dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/04/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management Just Enough Permissions (JEP) Controller dashboard

The Microsoft CloudKnox Permissions Management **JEP Controller** dashboard provides an overview of roles/policies, permissions, a list of existing requests for permissions, and requests for permissions you have made.

This topic provides an overview of the components of the **JEP Controller** dashboard.

> [!NOTE]
> Only users with the **Viewer**, **Controller**, or **Administrator** role can view this tab. </p>Only users with the **Controller** and **Administrator** role can make changes on this tab.

> [!NOTE]
> A role/policy is an object associated with an identity or resource that defines their permissions. </p>The Amazon Web Services (AWS) authorization system uses the term *policy*. The Microsoft Azure and Google Cloud Platform (GCP) authorization systems both use the term *role*. </p>In the CloudKnox documentation, we use *role/policy* to refer to both terms.

## The Roles/Policies tab 

Use the **Role/Policies** tab to add filters to your role/policy.

- **Authorization System Type** - Displays a drop-down list of authorization system types you can access. May include Amazon Web Services (AWS), Microsoft Azure (Azure), Google Cloud Platform (GCP), and so on.
- **Authorization System** - Displays a list of authorization systems accounts you can access.
- **Role/Policy Type** - A drop-down list of available role/policy types. You can select **All**, **Custom**, **System**, or **CloudKnox only**.
- **Role/Policy Status** - A drop-down list of available role/policy statuses. You can select **All**, **Assigned**, or **Unassigned**.
- **Role/Policy Usage** - A drop-down list of **All** or **Unused** roles/policies.
- **Apply** - Select to save the changes you've made.
- **Reset Filter** - Select to discard the changes you've made.

- **Role/Policy list** - A list of existing roles/policies that displays the following:
    - **Role/Policy Name** 
    - **Role/Policy Name**
    - **Actions** 
        - Select **Clone** to create a duplicate copy of the role/policy.
        - Select **Modify** to change the existing role/policy.
        - Select **Delete** to delete the role/policy.  

- **Search** - Select to search for a specific role/policy.
- **Reload** - Select to refresh the displayed list of roles/policies.
- **Create Role/Policy** - Select to create a new role/policy. For more information, see Create a new role/policy.
<!---Add link--->

- **Export CSV** - Select to export the displayed list of roles/policies as a CSV file. 

    When the file is successfully exported, a message appears: **Exported successfully.**

    - Check your email for the message from the CloudKnox Customer Success Team. This email contains a link to the **Role Policy Details** report in CSV format.
        <!---Ad Link reports@cloudknox.io---> 
    - The email includes a link to the **Reports** dashboard where you can configure how and when you can automatically receive reports.


## The Permissions tab

Use the **Permissions** tab to add filters to your permissions.

- **Authorization System Type** - Displays a drop-down list of authorization system types you can access. May include AWS, Azure, GCP, and so on.
- **Authorization System** - Displays a list of authorization systems accounts you can access.
- **Search For** - From the drop-down list, select **Group**, **User**, or **Role**.
- **User Status** - From the drop-down list, select **Any**, **Active**, or **Inactive**.
- **Privilege Creep Index** - From the drop-down list, select **Any**, **High**, **Medium**, or **Low**.
- **Task Usage** - From the drop-down list, select **Any**, **Granted**, **Used**, or **Unused**.
- **Enter a username** - From the drop-down list, select  a username.
- **Enter a Group Name** - From the drop-down list, select  a group name.
- **Apply** - Select to save the changes you've made.
- **Reset Filter** - Select to discard the changes you've made.

- **Export CSV** - Select to export the displayed list of roles/policies as a CSV file. 

    When the file is successfully exported, a message appears: **Exported successfully.**

     - Check your email for the message from the CloudKnox Customer Success Team. This email contains a link to the **Role Policy Details** report in CSV format.
        <!---Ad Link reports@cloudknox.io---> 
## The Requests tab 

Use the **Requests** tab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions your team members have made.

### The Pending Requests tab

The **Pending Requests** table displays the following information:

- **Summary** - Displays a summary of the request.
- **Submitted By** - Displays the name of the user who submitted the request.
- **On Behalf Of** - Displays the name of the user on whose behalf the request was made.
- **Authorization System** - Displays the authorization system the user selected.
- **Task/Scope/Policies** - Displays the type of task/scope/policy selected.
-  **Request Date** - Displays the date when the request was made.
- **Submitted** - Displays the period since the request was made.
- The ellipses **(...)** menu - Select the ellipses, and then select **Details**, **Approve**, or **Reject**.
- Select an option:
    - **Reload** - Select to refresh the displayed list of roles/policies.
    - **Search** - Select to search for a specific role/policy.
    - **||| Columns** - From the drop-down list, select the columns you want to display.
        - Select **Reset to default** to return to the system defaults. 

### The Approved Requests tab

The **Approved Requests** table displays information about the requests that have been approved.

### The Processed Requests tab

The **Processed Requests** table displays information about the requests that have been processed.

## The My Requests tab 

Use the **My Requests** tab to view a list of **Pending**, **Approved**, and **Processed** requests for permissions you've made.

### The Pending Requests tab

The **Pending Requests** table displays the following information:

- **Summary** - Displays a summary of the request.
- **Submitted By** - Displays the name of the user who submitted the request.
- **On Behalf Of** - Displays the name of the user on whose behalf the request was made.
- **Authorization System** - Displays the authorization system the user selected.
- **Task/Scope/Policies** - Displays the type of task/scope/policy selected.
-  **Request Date** - Displays the date when the request was made.
- **Submitted** - Displays the period since the request was made.
- The ellipses **(...)** menu - Select the ellipses, and then select **Details**, **Approve**, or **Reject**.
- Other available actions:
    - **Reload** - Select to refresh the displayed list of roles/policies.
    - **Search** - Select to search for a specific role/policy.
    - **||| Columns** - From the drop-down list, select the columns you want to display.
        - Select **Reset to default** to return to the system defaults. 

### The Approved Requests tab

The **Approved Requests** table displays information about the requests that have been approved.

### The Processed Requests tab

The **Processed Requests** table displays information about the requests that have been processed.

- **New Request** - Select to create a new permissions request. For more information, see Create a new permissions request.
<!---Add link--->

<!---## Next steps--->