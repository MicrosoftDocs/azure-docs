---
title: View analytic information about active tasks in Permissions Management
description: How to view analytic information about active tasks in Permissions Management.
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

# View analytic information about active tasks

The **Analytics** dashboard in Permissions Management collects detailed information, analyzes, reports on, and visualizes data about all identity types. System administrators can use the information to make informed decisions about granting permissions and reducing risk on unused permissions for:

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active Resources**: Tracks active resources (used in the last 90 days).
- **Active Tasks**: Tracks active tasks (performed in the last 90 days).
- **Access Keys**: Tracks the permission usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned permissions and usage of the serverless functions.

This article describes how to view usage analytics about active tasks.

## Create a query to view active tasks

When you select **Active Tasks**, the **Analytics** dashboard provides a high-level overview of tasks used by various identities.

1. On the main **Analytics** dashboard, select **Active Tasks** from the  drop-down list at the top of the screen.

    The dashboard only lists tasks that are active. The following components make up the **Active Tasks** dashboard:

    - **Authorization System Type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
    - **Authorization System**: Select from a **List** of accounts and **Folders**.
      > [!NOTE]
      > Folders can be used to organize and group together your list of accounts, or subscriptions. To create a folder, go to **Settings (gear icon) > Folders > Create Folder**.
    - **Tasks Type**: Select **All** tasks, **High Risk tasks** or, for a list of tasks where users have deleted data, select **Delete Tasks**.
    - **Search**: Enter criteria to find specific tasks. 

1. Select **Apply** to display the criteria you've selected.

    Select **Reset Filter** to discard your changes.


## View the results of your query

The **Active Tasks** table displays the results of your query.

- **Task Name**: Provides the name of the task.
    - To view details about the task, select the down arrow next to the task in the table.

        - An icon (![Image of task icon](media/usage-analytics-active-tasks/normal-task.png)) displays to the left of the task name if the task is a **Normal Task** (that is, not risky).
        - A highlighted icon (![Image of highlighted task icon](media/usage-analytics-active-tasks/high-risk-deleted-task.png)) displays to the left of the task name if the task involved deleting data &mdash; a **High-Delete Task** &mdash; or if the task is a **High-Risk Task**.

- **Performed on (resources)**: The number of resources on which the task was used.

- **Number of Users**: Displays how many users performed tasks. The tasks are organized into the following columns:
    - **With Access**: Displays the number of users that have access to the task but haven't accessed it.
    - **Accessed**: Displays the number of users that have accessed the task.


## Apply filters to your query

There are many filter options within the **Active Tasks** screen, including **Authorization System**, **User**, and **Task**.
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


### Apply filters by task type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Task Type** dropdown, select the type of tasks: **All**, **High Risk Tasks**, or **Delete Tasks**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


## Export the results of your query

- To view a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV**.

## Next steps

- To view active resources, see [View analytic information about active resources](usage-analytics-active-resources.md).
- To view the permission usage of access keys for a given user, see [View analytic information about access keys](usage-analytics-access-keys.md).
