---
title: Microsoft CloudKnox Permissions Management - View usage analytics about active tasks
description: How to use Microsoft CloudKnox Permissions Management Usage Analytics to view usage analytics about active tasks.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/10/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - View usage analytics about active tasks

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how to view usage analytics about active tasks.

## Dashboard view

The **Active Tasks** dashboard provides a high-level overview of privileges used by various identities. 

- On the main **Usage Analytics** page, select **Active Tasks** from the  drop-down list across the top of the screen. 

The dashboard only lists tasks that have been used in the last 90 days. The following components make up the **Active Tasks** dashboard:

- **Users**: This section  displays the total number of users, inactive and active users based on the authorization system selected. For more information, see Apply filters for active users.
    <!---Add link.--->
- **Tasks**: This section  displays the number of tasks granted to a user, and the total number of unexecuted and executed tasks based on the authorization system selected. For more information, see Apply filters for active tasks.
    <!---Add link.--->
- **Resources**: This section  displays how many resources have been accessed by users based on the authorization system selected. For more information, see Apply filters for active resources.
    <!---Add link.(--->

## Table view

The following components make up the **Active Tasks** table:


- **Task Name**: Provides the name of the task. 
    - To view more details about the task, select the task name. For more information, see Use the Identity Explorer to view for Active Tasks.
    <!---Add link.--->
    - A **Deleted** icon next to the task name means the task is a delete task. 
    - A **High risk task** icon next to the task name means the task is high-risk. 
    - A **Task** icon next to the task name means the task is a normal task.


- **No. of Times Task is Performed**: Captures the number of times the task has been performed by all users, groups, and so on.
- **Performed On (Resources)**: The number of resources on which the task was used. For more information, see View usage analytics about active resources.
    <!---Add link.--->
- **Number of Users**: Displays how many tasks are assigned to a user. The tasks are organized into the following columns:
    - **Unexecuted**: Captures the number of users that have access to the task but haven't accessed it.
    - **Executed**: Displays how many of the granted tasks the user has accessed.

## Apply filters for active tasks

There are many filter options within the **Active Tasks** screen, including filters by **Authorization System**, filters by **User** and filters by **Task**. Filters can be applied in one, two, or all three categories depending on what information the system administrator is looking for. 

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu, select the **Lock** icon on the left  of the page, and then select all applicable systems. 

         The default filter is the first authorization system in the filter list if filters haven't been used before. If you have used a filter before, the system defaults to the last filtered selection you used.

       - To automatically select all options for a single authorization system, next to the authorization system name, select **Only**. 

    2. To filter by the selection, select **Apply**. 

- **Filtering by Users**

    You can filter user details by type of user, user role or service used, or by resource.

    1. To filter by user, select the applicable option:

        - **All**: Filters by all existing users regardless of role or services used.
        - **User**: Filters by users only, excluding transient users.
        - **Transient**: Filters by transient users only.

    2. To filter by the selection, select **Apply**. 
    
- **Filtering by Tasks**

    System administrators can filter task details by tasks performed.

    1. Select the applicable radio button option to filter by task:

        - **All**: Filters by all existing tasks a user can perform.
        - **High Risk Tasks**: Filters tasks by high risk, which includes modifying and deleting content.
    2. To filter users who have delete task privileges, under **High Risk Tasks**, select **Delete**. 

    3. To filter by the selection, select **Apply**. 

## View information about active tasks in the Information pane


- Set the filters and select your Authorization System. Then select the icon at the end of the row to view more information about the active task.

- **Users with Privileges**:  Displays the total number of users who have access to the task, broken into the following categories:
     - **Unexecuted**: The names of users who have access to the task but haven't used the task.
     - **Executed by Current Users**: The names of users who have used the task.
     - **Executed by Transient Users**: The names of the users who can no longer be found in the authorization system, but had performed a task in the last 90 days.
- **Resources**: A list of the resources affected by the tasks performed by the users listed in **Users with Privileges**, **Domain**, **Type**, and **Name**.



<!---## Next steps--->

<!---Add link: To track assigned privileges and usage of various identities, see [View usage analytics about users](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-users.html).--->
<!---Add link. To track assigned privileges and usage of the group and the group members, see [View usage analytics about groups](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-groups.html).--->
<!---Add link. To track resources that have been used in the last 90 days, see [View usage analytics about active resources](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-active-resources.html).--->
<!---Add link. To track the privilege usage of access keys for a given user, see [View usage analytics about access keys](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-access-keys.html).--->
<!---Add link. To track assigned privileges and usage of the serverless functions, see [View usage analytics about serverless functions](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-serverless-functions.html).--->