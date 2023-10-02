---
title: View analytic information about access keys in Permissions Management
description: How to view  analytic information about access keys in Permissions Management.
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

# View analytic information about access keys

The **Analytics** dashboard in Permissions Management provides details about identities, resources, and tasks that you can use make informed decisions about granting permissions, and reducing risk on unused permissions.

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active Resources**: Tracks active resources (used in the last 90 days).
- **Active Tasks**: Tracks active tasks (performed in the last 90 days).
- **Access Keys**: Tracks the permission usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned permissions and usage of the serverless functions.

> [!NOTE] 
> Currently, Microsoft Azure and Google Cloud Platform (GCP) do not provide significant information about access keys to return access keys data. Access Keys analytics are currently only available for Amazon Web Services (AWS) accounts. 

This article describes how to view usage analytics about access keys.

## Create a query to view access keys

When you select **Access keys**, the **Analytics** dashboard provides a high-level overview of tasks used by various identities.

1. On the main **Analytics** dashboard, select **Access Keys** from the  drop-down list at the top of the screen.

    The following components make up the **Access Keys** dashboard:

    - **Authorization System Type**: Select **AWS**.
    - **Authorization System**: Select from a **List** of accounts and **Folders**.
    - **Key Status**: Select **All**, **Active**, or **Inactive**.
    - **Key Activity State**: Select **All**, how long the access key has been used, or **Not Used**.
    - **Key Age**: Select **All** or how long ago the access key was created.
    - **Task Type**: Select **All** tasks, **High Risk Tasks** or, for a list of tasks where users have deleted data, select **Delete Tasks**.
    - **Search**: Enter criteria to find specific tasks.
1. Select **Apply** to display the criteria you've selected.

    Select **Reset Filter** to discard your changes.


## View the results of your query

The **Access Keys** table displays the results of your query.

- **Access Key ID**: Provides the ID for the access key.
    - To view details about the access keys, select the down arrow to the left of the ID.
- The **Owner** name.
- The **Account** number.
- The **Permission Creep Index (PCI)**: Provides the following information:
    - **Index**: A numeric value assigned to the PCI.
    - **Since**: How many days the PCI value has been at the displayed level.
- **Tasks** Displays the number of **Granted** and **Executed** tasks.
- **Resources**: The number of resources used.
- **Access Key Age**: How old the access key is, in days.
- **Last Used**: How long ago the access key was last accessed.

## Apply filters to your query

There are many filter options within the **Active Tasks** screen, including filters by **Authorization System**, filters by **User** and filters by **Task**.
Filters can be applied in one, two, or all three categories depending on the type of information you're looking for.

### Apply filters by authorization system type

1. From the **Authorization System Type** dropdown, select **AWS**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by authorization system

1. From the **Authorization System Type** dropdown, select **AWS**.
1. From the **Authorization System** dropdown, select accounts from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by key status

1. From the **Authorization System Type** dropdown, select **AWS**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Key Status** dropdown, select the type of key: **All**, **Active**, or **Inactive**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by key activity status

1. From the **Authorization System Type** dropdown, select **AWS**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Key Activity State** dropdown, select **All**, the duration for how long the access key has been used, or **Not Used**.

1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by key age

1. From the **Authorization System Type** dropdown, select **AWS**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Key Age** dropdown, select  **All** or how long ago the access key was created.

1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by task type

1. From the **Authorization System Type** dropdown, select **AWS**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Task Type** dropdown, select  **All** tasks, **High Risk Tasks** or, for a list of tasks where users have deleted data, select **Delete tasks**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


## Export the results of your query

- To view a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV** or **CSV (Detailed)**.

## Next steps

- To view active tasks, see [View usage analytics about active tasks](usage-analytics-active-tasks.md).
- To view active resources, see [View usage analytics about active resources](usage-analytics-active-resources.md).
