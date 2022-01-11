---
title: Microsoft CloudKnox Permissions Management - View usage analytics about serverless functions (AWS only)
description: How to view Microsoft CloudKnox Permissions Management usage analytics about serverless functions (AWS only).
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

# Microsoft CloudKnox Permissions Management - View usage analytics about serverless functions (AWS only)

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how to view usage analytics about serverless functions (AWS only).

## View information on the Serverless Functions dashboard

The **Serverless Functions**, or lambda table, provides a high level overview of serverless function details. On the main **Usage Analytics** page, select **Serverless Functions** from the  drop-down list across the top of the screen. **

To activate the **Access Keys** option, select **AWS** from the filter options drop-down list. The following components make up the **Serverless Functions** table:


- **Function Name**: Displays the name of the function.
- **Domain/Account**: Displays the authorization system that contains lambda.
- **Privilege Creep Index**: Captures the incurred risk of lambda function with access to high-risk privileges. This information is organized into the following columns:
    - **Index**: Calculates a risk score for the lambda function based on the high-risk privileges they have access to and if that privilege has been accessed.
    - **Since**: Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, that is **! High - 130 days**.

        You can hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index.

        For example, hovering over **! High - 130 days** will display **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**.

- **Tasks**: Displays how many tasks are assigned to a particular lambda function. This information is organized into the following columns:
    - **Granted**: Captures the sum of the unique tasks assigned to all versions of the lambda function through the execution roles, meaning a function can have two roles with seven tasks each. If both roles have a delete task, the delete task will only be counted once.
    - **Executed**: Displays how many of the granted tasks the lambda function has executed through any version of the function.
- **Resources**: Displays how many resources a particular lambda function can access. The information is organized into the following columns:
    - **All**: Captures the number of resources the lambda function has access to.
    - **Accessed**: Displays how many of the resources the lambda function has accessed through any version of the function.
- **Last Activity On**: Displays the date and time the lambda function last performed any type of task in the authorization system. 
  
  If the lambda function hasn't yet been active or hasn't been active for more than 90 days, a dash (**-**) displays.

## Apply filters to serverless functions

The only filter option in the **Serverless Functions** screen is **Authorization System.** The only authorization system available is AWS, but it can be narrowed down by console. 

1. To expand the **Authorization systems** menu, select the **Lock** icon on the left side of the page. Then select all applicable consoles. 
2. To filter by the selection, select **Apply**. 

    The top of the screen displays a list of filters that were applied.
3. To remove all filters, select **X**.


## Use predefined tags

You can apply the following set of predefined tags:

- **ck_attest**: This tag is used to confirm an identity. When selected, the value is automatically filled in with the date and time the tag was applied, and the user who applied the tag.
- **ck_exclude_from_pci**: Any identity with this tag is excluded from the account level PCI score.
- **ck_exclude_from_reports**: Any identity with this tag is excluded from reports.
- **ck_primary_owner**: Used for service accounts to indicate the primary owner of the service account.
- **ck_secondary_owner**: Used for service accounts to indicate the secondary owner of the service account

## View information about serverless functions on the Information pane 


- Set your filters and select your Authorization System. Then select the icon at the end of the row to view more information about the serverless function.

- **Tasks**:  Displays unused and used tasks for each lambda function. The tasks are grouped by service and can be expanded to view the task, application, or service names.

     A service can display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**). If you hover over it, it displays **None of the tasks in this group have been used in the last 90 days**.

    You can perform the following actions in the **Tasks** section:

    - **Search**: In the **Search** box, enter a specific task name and find how many of those tasks have been unused or used.
    - **All Tasks**: The Tasks drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

    **Version**: The right side of the panel displays serverless function **Version** (several versions can be listed, but the latest are listed first), **Execution Role** (the role assigned to the serverless function), and **Alias**.

## View information about roles/policies

1. In the **Execution Role** column, select **View json.**

     The **Role Summary** screen opens and lists the **Role Name** and **Role Type**. The **Policies** tab is selected by default.

2. Under **Policies**, a list will display showing all the policies directly attached to the serverless function. 

     To expand and read the details of the policy, select the icon.

3. Under **SCP** (Service Control Policy), three columns are displayed: **Policy Name**, **Source Name**, and **Source**. 

     The purpose of the SCP section is to provide permission boundaries on each policy. 

     To expand and read the details of the policy, select the icon in the **Policy Name** column.

4. To view details on who can assume the role being viewed, select the **Trusted Entities** tab.




<!---## Next steps--->

<!---Add link: To track assigned privileges and usage of various identities, see [View usage analytics about users](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-users.html).--->
<!---Add link. To track assigned privileges and usage of the group and the group members, see [View usage analytics about groups](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-groups.html).--->
<!---Add link. To track resources that have been used in the last 90 days, see [View usage analytics about active resources](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-active-resources.html).--->
<!---Add link. To track tasks that have been performed in the last 90 days, see [View usage analytics about active tasks](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-active-tasks.html).--->
<!---Add link. To track the privilege usage of access keys for a given user, see [View usage analytics about access keys](https://azure/active-directory/cloud-infrastructure-entitlement-management/cloudknox-usage-analytics-access-keys.html).--->
