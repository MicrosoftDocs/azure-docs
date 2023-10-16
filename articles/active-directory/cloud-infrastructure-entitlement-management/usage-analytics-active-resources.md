---
title: View analytic information about active resources in Permissions Management
description: How to view usage analytics about active resources in Permissions Management.
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

# View analytic information about active resources

The **Analytics** dashboard in Permissions Management collects detailed information, analyzes, reports on, and visualizes data about all identity types. System administrators can use the information to make informed decisions about granting permissions and reducing risk on unused permissions for:

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active Resources**: Tracks resources that identities have performed actions on (in the last 90 days).
- **Active Tasks**: Tracks active tasks (performed in the last 90 days).
- **Access Keys**: Tracks the permission usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned permissions and usage of the serverless functions.

This article describes how to view usage analytics about active resources.

## Create a query to view active resources

1. On the main **Analytics** dashboard, select **Active Resources** from the  drop-down list at the top of the screen.

    The dashboard only lists tasks that are active. The following components make up the **Active Resources** dashboard:
1. From the dropdowns, select:
    - **Authorization System Type**: The authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
    - **Authorization System**: The **List** of accounts and **Folders** you want to include.
    - **Tasks Type**: Select **All** tasks, **High Risk Tasks** or, for a list of tasks where users have deleted data, select **Delete Tasks**.
    - **Service Resource Type**: The service resource type.
    - **Search**: Enter criteria to find specific tasks.

1. Select **Apply** to display the criteria you've selected.

    Select **Reset Filter** to discard your changes.


## View the results of your query

The **Active Resources** table displays the results of your query:

- **Resource Name**: Provides the name of the task.
    - To view details about the task, select the down arrow.
- **Account**: The name of the account.
- **Resources Type**: The type of resources used, for example, **bucket** or **key**.
- **Tasks**: Displays the number of **Granted** and **Executed** tasks.
- **Number of Users**: The number of users with access and accessed.
- Select the ellipses **(...)** and select **Tags** to add a tag.

## Add a tag to an active resource

1. Select the ellipses **(...)** and select **Tags**.
1. From the **Select a Tag** dropdown, select a tag.
1. To create a custom tag select **New Custom Tag**, add a tag name, and then select **Create**.
1. In the **Value (Optional)** box, enter a value.
1. Select the ellipses **(...)** to select **Advanced Save** options, and then select **Save**.
1. To add the tag to the serverless function, select **Add Tag**.


## Apply filters to your query

There are many filter options within the **Active Resources** screen, including filters by **Authorization System**, filters by **User** and filters by **Task**.
Filters can be applied in one, two, or all three categories depending on the type of information you're looking for.

### Apply filters by authorization system

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by authorization system type

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by task type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Task Type**, select the type of user: **All**, **User**, **Role/App/Service a/c**, or **Resource**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by service resource type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Service Resource Type**, select the type of service resource.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

## Export the results of your query

- To view a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV**.


## Next steps

- To track the permission usage of access keys for a given user, see [View usage analytics about access keys](usage-analytics-access-keys.md).
- To track assigned permissions and usage of the serverless functions, see [View usage analytics about serverless functions](usage-analytics-serverless-functions.md).
