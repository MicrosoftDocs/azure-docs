---
title: View analytic information about active resources in CloudKnox Permissions Management
description: How to view usage analytics about active resources in CloudKnox Permissions Management.
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

# View analytic information about active resources

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

This article describes how to view usage analytics about active resources.

## Create a query to view active tasks

- On the main **Usage Analytics** dashboard, select **Active resources** from the  drop-down list at the top of the screen. 

The dashboard only lists tasks that are active. The following components make up the **Active resources** dashboard:

- **Authorization system type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
- **Authorization system**: Select from a **List** of accounts and **Folders**.
- **Tasks type**: Select **All** tasks, **High-risk tasks** or, for a list of tasks where users have deleted data, select **Delete tasks**.
- **Service resource type**: Select the service resource type.
- **Search**: Enter criteria to find specific tasks.
- **Apply**: Select to display the criteria you've selected.
- **Reset filter**: Select to discard your changes.


## View the results of your query

The **Active resources** table displays the results of your query.

- **Resource Name**: Provides the name of the task. 
    - To view details about the task, select the down arrow. 
- **Account**: Provides the name of the account.
- **Resources type**: The type of resources used, for example, **bucket** or **key**.
- **Tasks** Displays the number of **Granted** and **Executed** tasks.
- **Number of users**: The number of users with access and accessed.
- Select the ellipses **(...)** and select **Tags** to add a tag.

## Add a tag to an active resource

1. Select the ellipses **(...)** and select **Tags**.
1. From the **Select a tag** dropdown, select a tag.
1. To create a custom tag select **New custom tag**, add a tag name, and then select **Create**.
1. In the **Value (Optional)** box, enter a value.
1. Select the ellipses **(...)** to select **Advanced save** options, and then select **Save**.
1. To add the tag to the serverless function, select **Add tag**.


## Apply filters to your query  

There are many filter options within the **Active resources** screen, including filters by **Authorization system**, filters by **User** and filters by **Task**. 
Filters can be applied in one, two, or all three categories depending on the type of information you're looking for. 

### Apply filters by authorization system

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes. 


### Apply filters by authorization system type

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**. 
1. From the **Authorization system** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Tasks type** dropdown, select **All** tasks, **High-risk tasks** or, for a list of tasks where users have deleted data, select **Delete tasks**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes. 

### Apply filters by task type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization system** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Task type**, select the type of user: **All**, **User**, **Role/App/Service a/c**, or **Resource**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes.


### Apply filters by service resource type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization system** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Service Resource type**, select the type of service resource.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes.

## Export the results of your query

- To view a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV**. 


## Next steps

- To track active tasks, see [View usage analytics about active tasks](cloudknox-usage-analytics-active-tasks.md).
- To track assigned permissions and usage of users, see [View usage analytics about users](cloudknox-usage-analytics-users.md).
- To track assigned permissions and usage of the group and the group members, see [View usage analytics about groups](cloudknox-usage-analytics-groups.md).
- To track the permission usage of access keys for a given user, see [View usage analytics about access keys](cloudknox-usage-analytics-access-keys.md).
- To track assigned permissions and usage of the serverless functions, see [View usage analytics about serverless functions](cloudknox-usage-analytics-serverless-functions.md).