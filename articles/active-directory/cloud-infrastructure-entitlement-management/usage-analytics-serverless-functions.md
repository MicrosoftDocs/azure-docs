---
title: View analytic information about serverless functions in Permissions Management
description: How to view analytic information about serverless functions in Permissions Management.
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

# View analytic information about serverless functions

The **Analytics** dashboard in Permissions Management collects detailed information, analyzes, reports on, and visualizes data about all identity types. System administrators can use the information to make informed decisions about granting permissions and reducing risk on unused permissions for:

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active Resources**: Tracks active resources (used in the last 90 days).
- **Active Tasks**: Tracks active tasks (performed in the last 90 days).
- **Access Keys**: Tracks the permission usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned permissions and usage of the serverless functions.

This article describes how to view usage analytics about serverless functions.

## Create a query to view serverless functions

When you select **Serverless Functions**, the **Analytics** dashboard provides a high-level overview of tasks used by various identities.

1. On the main **Analytics** dashboard, select **Serverless Functions** from the  dropdown list at the top of the screen.

    The following components make up the **Serverless Functions** dashboard:

    - **Authorization System Type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
    - **Authorization System**: Select from a **List** of accounts and **Folders**.
    - **Search**: Enter criteria to find specific tasks.
1. Select **Apply** to display the criteria you've selected.

    Select **Reset Filter** to discard your changes.


## View the results of your query

The **Serverless Functions** table displays the results of your query.

- **Function Name**: Provides the name of the serverless function.
    - To view details about a serverless function, select the down arrow to the left of the function name.
- A **Function Type** icon displays to the left of the function name to describe the type of serverless function, for example **Lambda function**.
- The **Permission Creep Index (PCI)**: Provides the following information:
    - **Index**: A numeric value assigned to the PCI.
    - **Since**: How many days the PCI value has been at the displayed level.
- **Tasks**: Displays the number of **Granted** and **Executed** tasks.
- **Resources**: The number of resources used.
- **Last Activity On**: The date the function was last accessed.
- Select the ellipses **(...)**, and then select **Tags** to add a tag.

## Add a tag to a serverless function

1. Select the ellipses **(...)** and select **Tags**.
1. From the **Select a Tag** dropdown, select a tag.
1. To create a custom tag select **New Custom Tag**, add a tag name, and then select **Create**.
1. In the **Value (Optional)** box, enter a value.
1. Select the ellipses **(...)** to select **Advanced Save** options, and then select **Save**.
1. To add the tag to the serverless function, select **Add Tag**.

## View detailed information about a serverless function

1. Select the down arrow to the left of the function name to display the following:

    - A list of **Tasks** organized by **Used** and **Unused**.
    - **Versions**, if a version is available.

1. Select the arrow to the left of the task name to view details about the task.
1. Select **Information** (**i**) to view when the task was last used.
1. From the **Tasks** dropdown, select **All Tasks**, **High Risk Tasks**, and **Delete Tasks**.


## Apply filters to your query

You can filter the **Serverless Functions** results by **Authorization System Type** and **Authorization System**.

### Apply filters by authorization system type

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by authorization system

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select accounts from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.



## Next steps

- To view active resources, see [View analytic information about active resources](usage-analytics-active-resources.md).
- To view the permission usage of access keys for a given user, see [View analytic information about access keys](usage-analytics-access-keys.md).
