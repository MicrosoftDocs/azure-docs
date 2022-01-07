---
title: Microsoft CloudKnox Permissions Management - View usage analytics about access keys (AWS, Azure, GCP)
description: How to view  usage analytics about access keys (AWS, Azure, GCP) in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/06/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - View usage analytics about access keys (AWS, Azure, GCP)

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how How to view  usage analytics about access keys for AWS, Azure, and GCP in Microsoft CloudKnox Permissions Management. 

## View information on the Access Keys dashboard

The **Access Keys** table provides a high level overview of access key details. On the main **Usage Analytics** page, select **Access Keys** from the  drop-down list across the top of the screen. 

- To activate the **Access Keys** option from the  drop-down list, select **AWS** from the filter options.

The following components make up the **Access Keys** table:

- **Access Key ID**: Displays the ID number for the access key.
- **Owner**: Displays the name of the owner for a particular access key.
- **Account**: Displays the account name that the owner and access key reside in.
- **Privilege Creep Index**: Captures the incurred risk of owners with access to high-risk privileges and is broken into the following columns:
    - **Index**: Calculates a risk score for the owner of the access key based on the high-risk privileges they have access to and if that privilege has been accessed.
    - **Since**: Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, that is **! High - 130 days**.

         Hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index. 

         For example, hover over **! High - 130 days** to display **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**.

- **Tasks**: Displays how many tasks are assigned to a particular user. Tasks are sorted into the following columns:
    - **Granted**: Captures the number of tasks that have been granted to the owner directly, to the user if part of a group, or based on the AWS role type the user can assume.
    - **Executed**: Displays how many of the granted tasks the owner has executed.
- **Resources**: Displays how many resources a particular owner can access, and is sorted into the following columns:
    - **All**: Captures the number of resources the owner has access to.
    - **Accessed**: Displays how many of the resources the owner has accessed.
- **Access Key Age**:  Displays how many days have passed since the access key was created.

     We recommended that access keys be recycled or renewed every 90 days. If the access key is older than 90 days, the system flags the key in this column with an exclamation point (**!**). Hover over this point to display **Created more than 90 days ago**.

- **Last Used**: Displays the time since the access key was last used.

     If the access key is older than 90 days, the system flags the key in this column with an exclamation point (**!**). Hover over this point to display **Last used more than 90 days ago**.

## Apply filters for access keys

There are many filter options within the **Access Keys** screen, including filters by **Authorization System**, **Access Keys**, and **Task**. Filters can be applied in one, two, or all three categories depending on what information the system administrator is looking for. 

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu and select all applicable systems, select the **Lock** icon. 

        > [!NOTE]
        > This feature only applies to AWS. It can be narrowed down by the authorization system.

    2. To filter by the selection, select **Apply**. 

- **Filtering by Access Keys**

    System administrators can filter access key details by **Key Status**, **Key Activity Status**, and **Key Age**.

    1. Select the applicable radio button option to filter by user:

        - **Key Status**: Choose **All**, **Active**, or **Inactive**.
        - **Key Activity Status**: Choose **All**, **Used <90 days**, **Used <90 - 365 days**, **Used >365 days**, or **Not Used**.
        - **Key Age**: Choose  **All**, **<90 days**, **90 - 180 days**, or **>180 days**

    2. To filter by the selection, select **Apply**. 

         The top of the screen displays which filters were applied.
    3. To  remove all filters, select **X**.

- **Filtering by Tasks**

    System administrators can filter user details by tasks performed.

    1. To filter by task, select the applicable option:

        - **All**: Filters by all existing tasks a user can perform.
        - **High Risk Tasks**: Filters tasks by high risk, which includes modifying and deleting content.
    2. To filter users who have delete task privileges, under **High Risk Tasks**, select **Delete**. 

    3. To filter by the selection, select **Apply**. 

## View information about access keys on the Information Pane

When the filters are set and the authorization system is selected, select the icon at the end of the row to view more information about the access key.

- **Tasks**:  Displays unused and used tasks for each access key. The tasks are grouped by service and can be expanded to view the task, application, or service names.

    A service can  display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**) and if hovered over displays **None of the tasks in this group have been used in the last 90 days**. 

    A task can move from **Used** to **Unused** if that task hasn't been touched for more than 90 days.

    You can do the following actions in the **Tasks** section:

    - **Search**: In the **Search** box, system administrators can type a specific task name and find how many of those tasks have been unused or used.
    - **All Tasks**: The Tasks drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.
- **Access Key Info**: Lists **Last Used Service**, **Last Used Region**, **Created On**, and a graph of **Access Key Usage (Over 3 Months in PDT)** which details what times and days in which the access key was used.



<!---## Next steps--->