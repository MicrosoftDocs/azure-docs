---
title: View analytic information about active tasks in CloudKnox Permissions Management
description: How to view analytic information about active tasks in CloudKnox Permissions Management.
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

# View analytic information about active tasks

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

The **Usage Analytics** dashboard in CloudKnox Permissions Management (CloudKnox) provides details about identities, resources, and tasks that you can use make informed decisions about granting permissions, and reducing risk on unused permissions.

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active resources**: Tracks active resources (used in the last 90 days).
- **Active tasks**: Tracks active tasks (performed in the last 90 days).
- **Access keys**: Tracks the permission usage of access keys for a given user.
- **Serverless functions**: Tracks assigned permissions and usage of the serverless functions.

The **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This article describes how to view usage analytics about active tasks.

## Create a query to view active tasks

When you select **Active tasks**, the **Usage Analytics** dashboard provides a high-level overview of tasks used by various identities. 

- On the main **Usage Analytics** dashboard, select **Active tasks** from the  drop-down list at the top of the screen. 

The dashboard only lists tasks that are active. The following components make up the **Active tasks** dashboard:

- **Authorization system type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
- **Authorization system**: Select from a **List** of accounts and **Folders***.
- **Tasks type**: Select **All** tasks, **High-risk tasks** or, for a list of tasks where users have deleted data, select **Delete tasks**.
- **Search**: Enter criteria to find specific tasks.
- **Apply**: Select to display the criteria you've selected.
- **Reset filter**: Select to discard your changes.


## View the results of your query

The **Active tasks** table displays the results of your query.

- **Task Name**: Provides the name of the task. 
    - To view details about the task, select the down arrow. 

    - A **Normal task** icon displays to the left of the task name if the task is normal (that is, not risky).
    - A **Deleted task** icon displays to the left of the task name if the task involved deleting data. 
    - A **High-risk task** icon displays to the left of the task name if the task is high-risk. 

- **Performed on (resources)**: The number of resources on which the task was used.

- **No. of Times Task is Performed**: Captures the number of times the task has been performed by all users, groups, and so on.

- **Number of Users**: Displays how many users performed tasks. The tasks are organized into the following columns:
    - **With access**: Displays the number of users that have access to the task but haven't accessed it.
    - **Access**: Displays the number of users that have accessed the task.


## Apply filters to your query  

There are many filter options within the **Active tasks** screen, including **Authorization system**, **User**, and **Task**. 
Filters can be applied in one, two, or all three categories depending on the type of information you're looking for. 

### Apply filters by authorization system

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes. 

### Apply filters by authorization system

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**. 
1. From the **Authorization system** dropdown, select accounts from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes. 


### Apply filters by task type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization system** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Task type** dropdown, select the type of user: **All**, **User**, **Role/App/Service a/c**, or **Resource**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes.


## Export the results of your query

- To view a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV**. 

## Next steps

- To view assigned permissions and usage by users, see [View analytic information about users](cloudknox-usage-analytics-users.md).
- To view assigned permissions and usage of the group and the group members, see [View analytic information about groups](cloudknox-usage-analytics-groups.md).
- To view active resources, see [View analytic information about active resources](cloudknox-usage-analytics-active-resources.md).
- To view the permission usage of access keys for a given user, see [View analytic information about access keys](cloudknox-usage-analytics-access-keys.md).
- To view assigned permissions and usage of the serverless functions, see [View analytic information about serverless functions](cloudknox-usage-analytics-serverless-functions.md).