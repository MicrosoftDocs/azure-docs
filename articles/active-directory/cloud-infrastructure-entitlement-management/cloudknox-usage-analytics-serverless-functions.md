---
title: View analytic information about serverless functions in CloudKnox Permissions Management
description: How to view analytic information about serverless functions in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/15/2022
ms.author: v-ydequadros
---

# View analytic information about serverless functions

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

The **Analytics** dashboard in CloudKnox Permissions Management (CloudKnox) collects detailed information, analyzes, reports on, and visualizes data about all identity types. System administrators can use the information to make informed decisions about granting permissions and reducing risk on unused permissions for: 

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active resources**: Tracks active resources (used in the last 90 days).
- **Active tasks**: Tracks active tasks (performed in the last 90 days).
- **Access keys**: Tracks the permission usage of access keys for a given user.
- **Serverless functions**: Tracks assigned permissions and usage of the serverless functions.

This article describes how to view usage analytics about serverless functions.

## Create a query to view serverless functions

When you select **Serverless functions**, the **Analytics** dashboard provides a high-level overview of tasks used by various identities. 

1. On the main **Analytics** dashboard, select **Serverless functions** from the  dropdown list at the top of the screen. 

    The following components make up the **Serverless functions** dashboard:

    - **Authorization system type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
    - **Authorization system**: Select from a **List** of accounts and **Folders**.
    - **Search**: Enter criteria to find specific tasks.
1. Select **Apply** to display the criteria you've selected.

    Select **Reset filter** to discard your changes.


## View the results of your query

The **Serverless functions** table displays the results of your query.

- **Function name**: Provides the name of the serverless function. 
    - To view details about a serverless function, select the down arrow to the left of the function name. 
- A **Function type** icon displays to the left of the function name to describe the type of serverless function, for example **Lambda function**.
- The **Permission creep index (PCI)**: Provides the following information:
    - **Index**: A numeric value assigned to the PCI.
    - **Since**: How many days the PCI value has been at the displayed level.
- **Tasks**: Displays the number of **Granted** and **Executed** tasks.
- **Resources**: The number of resources used.
- **Last activity on**: The date the function was last accessed.
- Select the ellipses **(...)**, and then select **Tags** to add a tag.

## Add a tag to a serverless function

1. Select the ellipses **(...)** and select **Tags**.
1. From the **Select a tag** dropdown, select a tag.
1. To create a custom tag select **New custom tag**, add a tag name, and then select **Create**.
1. In the **Value (Optional)** box, enter a value.
1. Select the ellipses **(...)** to select **Advanced save** options, and then select **Save**.
1. To add the tag to the serverless function, select **Add tag**.

## View detailed information about a serverless function

1. Select the down arrow to the left of the function name to display the following:

    - A list of **Tasks** organized by **Used** and **Unused**.
    - **Versions**, if a version is available.

1. Select the arrow to the left of the task name to view details about the task.
1. Select **Information** (**i**) to view when the task was last used.
1. From the **Tasks** dropdown, select **All tasks**, **High-risk tasks**, and **Delete tasks**.


## Apply filters to your query  

You can filter the **Serverless functions** results by **Authorization system type** and **Authorization system**.  

### Apply filters by authorization system type

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes. 


### Apply filters by authorization system

1. From the **Authorization system type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**. 
1. From the **Authorization system** dropdown, select accounts from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes. 



## Next steps

- To view active tasks, see [View usage analytics about active tasks](cloudknox-usage-analytics-active-tasks.md).
- To view assigned permissions and usage by users, see [View analytic information about users](cloudknox-usage-analytics-users.md).
- To view assigned permissions and usage of the group and the group members, see [View analytic information about groups](cloudknox-usage-analytics-groups.md).
- To view active resources, see [View analytic information about active resources](cloudknox-usage-analytics-active-resources.md).
- To view the permission usage of access keys for a given user, see [View analytic information about access keys](cloudknox-usage-analytics-access-keys.md).
