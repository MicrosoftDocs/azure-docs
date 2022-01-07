---
title: Microsoft CloudKnox Permissions Management - View usage analytics about groups
description: How to use Microsoft CloudKnox Permissions Management Usage Analytics to view usage analytics about groups.
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

# Microsoft CloudKnox Permissions Management - View usage analytics about groups

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how to view usage analytics about groups.

## View information on the Groups dashboard

The **Groups** dashboard provides a high level overview of group details.

- On the **Usage Analytics** page, select **Groups** from the  drop-down list across the top of the screen. The following components make up the **Groups** dashboard:

    - **Groups** - This section  displays the total number of groups, inactive, and active groups based on the authorization system selected. For more information, see Apply filters for groups.
        <!---Add link.--->
    - **Tasks** - This section  displays the number of tasks granted to groups, and the total number of unexecuted and executed tasks based on the authorization system selected. For more information, see Apply filters for groups.
        <!---Add link.--->
    - **Resources** - This section displays how many resources have been accessed by groups based on the authorization system selected. For more information, see Apply filters for active resources.
        <!---Add link.--->


The **Groups** table  displays the privileges assigned,  privileges used, and resources accessed by users.

- **Group Name**: Provides the name of the group.

     External directory groups are denoted with an icon for SAML groups, an icon for ED groups, and an icon for local users.


- **Domain/Account**: This column displays a domain name for SAML or Enterprise Directory (ED) groups and displays an account name for local groups.
- **Privilege Creep Index**: Captures the incurred risk of groups with access to high-risk privileges and is displayed in the following columns:
    - **Index**: Calculates a risk score for the group based on the high-risk privileges they have access to and if that privilege has been accessed.
    - **Since**: Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, that is **! High - 130 days**.

         You can hover over the information in this column for more information on how long the user has had a high, medium, or low privilege creep index.

         For example, hovering over **! High - 130 days** displays **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**. 

- **Users**: Displays the number of users that belong to the group.
- **Tasks**: Displays how many tasks are assigned to a particular group. It is organized into the following columns:
    - **Granted**: Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the AWS role type the user can assume.
    - **Executed**: Displays how many of the granted tasks the member's of the group have executed.
- **Resources**: Displays how many resources a particular group can access. It is organized into the following columns:
    - **All**: Captures the number of resources the group has access to.
    - **Accessed**: Displays how many of the resources the group has accessed.
- **Tags**: Displays the number of tags applied to a group.

## Apply filters for groups

There are many filter options within the **Groups** screen, including filters by **Authorization System** and **Task**. Filters can be applied in both categories depending on what information the system administrator is looking for.  

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu, and select all applicable systems, select the **Lock** icon on the left side of the page. 

        The default filter is the first authorization system in the filter list, if filters haven't been used before. If you have used a filter before, the last filtered selection displays.

       -  To automatically select all options for a single authorization system, next to the authorization system name, select **Only**.
    2. To filter by the selection, select **Apply**.

         Both SAML and local users will be listed if the selection spans multiple authorization systems.
    3. To remove all filters, select **X**.

- **Filtering by Tasks**

    System administrators can filter group details by tasks performed.

    1. To filter by task, select the applicable option:
        - **All**: Filters by all existing tasks a user can perform.
        - **High Risk Tasks**: Filters tasks by high risk, which includes modifying and deleting content.

    2. To filter groups that have delete task privileges, under the **High Risk Tasks**, select **Delete**. 

    3. To filter by the selection, select **Apply**. 

         Both SAML and local groups will be listed if the selection spans multiple authorization systems and accounts. The top of the screen will display the authorization system that is being viewed (for example, **Azure - Azure PIM**), or if multiple authorization systems were selected, **Multiple Authorization Systems** will display. 
 
    4. To remove all filters, select **X**.


## View information about groups on the Information Pane

1. To view more information about the group after you have applied the filters and selected the authorization system, select the icon at the end of the row.

     **Tasks** (all authorization systems) displays unused and used tasks for each group. Tasks are grouped by service and can be expanded to view the task, application, or service names.

     A service can  display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**) and if hovered over displays **None of the tasks in this group have been used in the last 90 days**.

     A task can move from **Used** to **Unused** if that task hasn't been accessed for more than 90 days.


2. You can perform the following actions in the **Tasks** section.

    - **Search**: Enter a specific task name and find how many of those tasks have been unused or used.
        - **All Tasks**: Use the **Tasks** drop-down to filter data by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

    - **Users** (all authorization systems): Displays aa list of users who belong to the group and how many tasks each user has executed.
    - **Roles Available** (AWS only): Lists all the roles the user can assume within the group, including **Type**, **Name**, and **Domain**.

## View or add a tag to a group

- You can tag all groups displayed in the **Group** page.
    1. Click the ellipses in the far right column and select **Tags** to apply a tag to a user or view tags applied to the user.
    
       Alternately, select the number in the **Tags** column view and apply tags.
    2. On the **Tags** window, the **Identity Name** will  display the current group the tag is being created for and the **Type** will  display **Group** since usage analytics are being viewed at the group level. 

        > [!NOTE]
        >  The **Authorization Type**, **Tag**, **Value (Optional),** and **Authorization Systems** boxes are pre-loaded with information if a tag is already applied to the current group. </p>These details cannot be edited, but the system administrator can select **Delete** to delete the current tag(s).

    3. Click **Add Tag**.
    4. Select the **Authorization System Type**.

         If the current group is only part of one authorization system, the **Authorization System Type**  drop-down list won't have multiple options.

    5. Click in the **Tag** box.

         A  drop-down list of existing tags appears. Select a tag from the current options.

         To create a new tag, enter a new tag name and then select **Create**.

    6. Input a value in the **Value (Optional)** box, such as the date and time the tag is being created.
    7. Click in the **Authorization Systems** box. 

         If the current group is only part of one authorization system, this box will be pre-populated. 

         If they're part of multiple authorization systems, the system administrator can select the appropriate authorization system the tag is being created for.

    8. To save the tag, select **Save**.
    9. To close the **Tag** window, select the **X**.

### Apply predefined tags

You can apply the following set of predefined tags in CloudKnox:

- **ck_attest**: This tag is used to confirm an identity. When selected, the value is automatically filled in with the date and time the tag is applied, and the name of the user who applied the tag.
- **ck_exclude_from_reports**: Any identity with this tag is excluded from reports.
- **ck_primary_owner**: This tag is used for service accounts to indicate the primary owner of the service account.
- **ck_secondary_owner**: This tag is used for service accounts to indicate the secondary owner of the service account.


<!---## Next steps--->