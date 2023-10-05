---
title: View analytic information about users in Permissions Management
description: How to view analytic information about users in Permissions Management.
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

# View analytic information about users

The **Analytics** dashboard in Permissions Management collects detailed information, analyzes, reports on, and visualizes data about all identity types. System administrators can use the information to make informed decisions about granting permissions and reducing risk on unused permissions for:

- **Users**: Tracks assigned permissions and usage of various identities.
- **Groups**: Tracks assigned permissions and usage of the group and the group members.
- **Active Resources**: Tracks active resources (used in the last 90 days).
- **Active Tasks**: Tracks active tasks (performed in the last 90 days).
- **Access Keys**: Tracks the permission usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned permissions and usage of the serverless functions.

This article describes how to view usage analytics about users.

## Create a query to view users

When you select **Users**, the **Analytics** dashboard provides a high-level overview of tasks used by various identities.

1. On the main **Analytics** dashboard, select **Users** from the  drop-down list at the top of the screen.

    The following components make up the **Users** dashboard:

    - **Authorization System Type**: Select the authorization you want to use: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
    - **Authorization System**: Select from a **List** of accounts and **Folders***.
    - **Identity Type**: Select **All** identity types, **User**, **Role/App/Service a/c** or **Resource**.
    - **Search**: Enter criteria to find specific tasks.
1. Select **Apply** to display the criteria you've selected.

    Select **Reset filter** to discard your changes.


## View the results of your query

The **Identities** table displays the results of your query.

- **Name**: Provides the name of the group.
    - To view details about the group, select the down arrow.
- The **Domain/Account** name.
- The **Permission Creep Index (PCI)**: Provides the following information:
    - **Index**: A numeric value assigned to the PCI.
    - **Since**: How many days the PCI value has been at the displayed level.
- **Tasks**: Displays the number of **Granted** and **Executed** tasks.
- **Resources**: The number of resources used.
- **User Groups**: The number of users who accessed the group.
- **Last Activity On**: The date the function was last accessed.
-  The ellipses **(...)**: Select **Tags** to add a tag.

    If you're using AWS, another selection is available from the ellipses menu: **Auto Remediate**. You can use this option to remediate your results automatically.

## Add a tag to a user

1. Select the ellipses **(...)** and select **Tags**.
1. From the **Select a Tag** dropdown, select a tag.
1. To create a custom tag select **New Custom Tag**, add a tag name, and then select **Create**.
1. In the **Value (Optional)** box, enter a value.
1. Select the ellipses **(...)** to select **Advanced Save** options, and then select **Save**.
1. To add the tag to the serverless function, select **Add Tag**.

## Set the auto-remediate option (AWS only)

- Select the ellipses **(...)** and select **Auto Remediate**.

    A message displays to confirm that your remediation settings are automatically updated.

## Apply filters to your query

There are many filter options within the **Users** screen, including filters by **Authorization System**, **Identity Type**, and **Identity State**.
Filters can be applied in one, two, or all three categories depending on the type of information you're looking for.

### Apply filters by authorization system type

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by authorization system

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select accounts from a **List** of accounts and **Folders**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes.

### Apply filters by identity type

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Identity Type**, select the type of user: **All**, **User**, **Role/App/Service a/c**, or **Resource**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.

### Apply filters by identity subtype

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Identity Subtype**, select the type of user: **All**, **ED** (Enterprise Directory), **Local**, or **Cross Account**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset filter** to discard your changes.

### Apply filters by identity state

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Identity State**, select the type of user: **All**, **Active**, or **Inactive**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by identity filters

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Identity Type**, select: **Risky** or **Incl. in PCI Calculation Only**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


### Apply filters by task type

You can filter user details by type of user, user role, app, or service used, or by resource.

1. From the **Authorization System Type** dropdown, select the authorization system you want to use: **AWS**, **Azure**, or **GCP**.
1. From the **Authorization System** dropdown, select from a **List** of accounts and **Folders**.
1. From the **Task Type**, select the type of user: **All** or **High Risk Tasks**.
1. Select **Apply** to run your query and display the information you selected.

    Select **Reset Filter** to discard your changes.


## Export the results of your query

- To export a report of the results of your query as a comma-separated values (CSV) file, select **Export**, and then select **CSV**.
- To export the data in a detailed comma-separated values (CSV) file format, select **Export** and then select **CSV (Detailed)**.
- To export a report of user permissions, select **Export** and then select **Permissions**.


## Next steps

- To view the permission usage of access keys for a given user, see [View analytic information about access keys](usage-analytics-access-keys.md).
- To view assigned permissions and usage of the serverless functions, see [View analytic information about serverless functions](usage-analytics-serverless-functions.md).
