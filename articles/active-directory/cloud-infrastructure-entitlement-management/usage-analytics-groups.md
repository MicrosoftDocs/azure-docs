---
title: View analytic information about groups in Permissions Management
description: How to view analytic information about groups in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: jfields
---

# View analytic information about groups

The **Analytics** dashboard in Permissions Management collects detailed information, analyzes, reports on, and visualizes data about all identity types. System administrators can use the information to make informed decisions about granting permissions and reducing risk on unused permissions for:

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active Resources**: Tracks active resources (used in the last 90 days).
- **Active Tasks**: Tracks active tasks (performed in the last 90 days).
- **Access Keys**: Tracks the permission usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned permissions and usage of the serverless functions.

This article describes how to view usage analytics about groups.

## Create a query to view groups

When you select **Groups**, the **Usage Analytics** dashboard provides a high-level overview of groups.

1. On the main **Analytics** dashboard, select **Groups** from the  drop-down list at the top of the screen.

    The following components make up the **Groups** dashboard:

    - **Authorization System Type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
    - **Authorization System**: Select from a **List** of accounts and **Folders**.
    - **Group Type**: Select **All**, **ED** (enterprise directory), or **Local**.
    - **Group Activity Status**: Select **All**, **Active**, or **Inactive**.
    - **Tasks Type**: Select **All**, **High Risk Tasks**, or **Delete Tasks**
    - **Search**: Enter group name to find specific group.
1. To display the criteria you've selected, select **Apply**.
    - **Reset Filter**: Select to discard your changes.


## View the results of your query

The **Groups** table displays the results of your query:

- **Group Name**: Provides the name of the group.
    - To view details about the group, select the down arrow.
- A **Group Type** icon displays to the left of the group name to describe the type of group (**ED** (enterprise directory) or **Local**).
- The **Domain/Account** name.
- The **Permission Creep Index (PCI)**: Provides the following information:
    - **Index**: A numeric value assigned to the PCI.
    - **Since**: How many days the PCI value has been at the displayed level.
- **Tasks**: Displays the number of **Granted** and **Executed** tasks.
- **Resources**: The number of resources used.
- **Users**: The number of users who accessed the group.
- Select the ellipses **(...)** and select **Tags** to add a tag.

## Add a tag to a group

1. Select the ellipses **(...)** and select **Tags**.
1. From the **Select a Tag** dropdown, select a tag.
1. To create a custom tag select **New Custom Tag**, add a tag name, and then select **Create**.
1. In the **Value (Optional)** box, enter a value.
1. Select the ellipses **(...)** to select **Advanced Save** options, and then select **Save**.
1. To add the tag to the serverless function, select **Add Tag**.

## View detailed information about a group

1. Select the down arrow to the left of the **Group Name**.

    The list of **Tasks** organized by **Unused** and **Used** displays.

1. Select the arrow to the left of the group name to view details about the task.
1. Select **Information** (**i**) to view when the task was last used.
1. From the **Tasks** dropdown, select **All Tasks**, **High Risk Tasks**, and **Delete Tasks**.
1. The pane on the right displays a list of **Users**, **Policies** for **AWS** and **Roles** for **GCP or AZURE**, and **Tags**.

## Apply filters to your query

There are many filter options within the **Groups** screen, including filters by **Authorization System Type**, **Authorization System**, **Group Type**, **Group Activity Status**, and **Tasks Type**.
Filters can be applied in one, two, or all three categories depending on the type of information you're looking for.

### Apply filters by authorization system type

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by authorization system

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select accounts from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by group type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Group Type** dropdown, select the type of user: **All**, **ED** (enterprise directory), or **Local**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by group activity status

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Group Activity Status** dropdown, select the type of user: **All**, **Active**, or **Inactive**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by tasks type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Tasks Type** dropdown, select the type of user: **All**, **High Risk Tasks**, or **Delete Tasks**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


## Export the results of your query

- To view a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV**.
- To view a list of members of the groups in your query, select **Export**, and then select  **Memberships**.



## Next steps

- To view active tasks, see [View analytic information about active tasks](usage-analytics-active-tasks.md).
- To view assigned permissions and usage by users, see [View analytic information about users](usage-analytics-users.md).
- To view active resources, see [View analytic information about active resources](usage-analytics-active-resources.md).
