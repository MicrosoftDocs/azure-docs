---
title: Microsoft CloudKnox Permissions Management - View usage analytics about active resources
description: How to use Microsoft CloudKnox Permissions Management Usage Analytics to view details about identities, resources, and tasks.
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

# Microsoft CloudKnox Permissions Management - View usage analytics about active resources

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how to view usage analytics about active resources.

## View information on the Active Resources dashboard

The **Active Resources** dashboard provides a high level overview of resource details. On the main **Usage Analytics** page, select **Active Resources** from the  drop-down list across the top of the screen. The following components make up the **Active Resources** dashboard:

- **Users**: This section  displays the total number of users, inactive and active users based on the authorization system selected. 
     For more information, see [Apply filters for users](cloudknox-product-usage-analytics.md#apply-filters-for-users).
- **Tasks**: This section  displays the number of tasks granted to a user, and the total number of unexecuted and executed tasks based on the authorization system selected. 
     For more information, see [Apply filters to users](cloudknox-product-usage-analytics.md#apply-filters-for-users).
- **Resources**: This section  displays how many resources have been accessed by users based on the authorization system selected. 
     For more information, see [Apply filters for users](cloudknox-product-usage-analytics.md#apply-filters-for-users).

    The **Active Resources** table for each resource  displays the following information about its tasks, activity, and user privileges.

- **Resource Name**: Provides the name of the resource.

     - To view more details about the resource, select the resource name. For more information, see [Use the Resource Explorer](cloudknox-product-usage-analytics.md#use-the-resource-explorer).

       Hovering over the resource name displays the resource ID. Two resources may potentially have the same name, but different IDs.

- **Account**: Displays the account name the resource belongs to.
- **Resource Type**: Displays the type of resource, that is, Key (encryption key) or bucket (storage).
- **No. of Times Users Accessed**: Provides the number of times a user has accessed a particular resource.
- **Tasks**: Displays how many tasks are assigned to a particular user, and is broken into the following columns:
    - **Granted**: Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the role type the user can assume.
    - **Executed**: Displays how many of the granted tasks the user has executed.
- **No. of Users**: Displays how many users can access the resource, and is broken into the following columns:
    - **Access with**: Captures the number of users that have access to the resource.
    - **Accessed**: Displays how many users have accessed the resource.

     - To view additional details about the resource, select the resource name. For more information, see [Use the Resource Explorer](cloudknox-product-usage-analytics.md#use-the-resource-explorer)

    Hovering over the resource name displays the resource ID. Two resources may potentially have the same name, but different IDs.

- **Account** - Displays the account name the resource belongs to.
- **Resource Type** - Displays the type of resource. For example, Key (encryption key) or bucket (storage).
- **No. of Times Users Accessed** - Provides the number of times a user has accessed a particular resource.
- **Tasks** - Displays how many tasks are assigned to a particular user, and is broken into the following columns:
    - **Granted** - Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the role type the user can assume.
    - **Executed** - Displays how many of the granted tasks the user has executed.
- **No. of Users** - Displays how many users can access the resource, and is broken into the following columns:
    - **Access with** - Captures the number of users that have access to the resource.
    - **Accessed** - Displays how many users have accessed the resource.

## Apply filters for active resources

There are many filter options within the **Active Resources** screen, including filters by **Authorization System**, filters by **Tasks** and filters by **Resource Type**. You can apply filters in one, two, or all three categories; depending on the type of information you want. 

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu, on the left of the page, select the **Lock** icon. Then select all applicable systems. 

         The default filter is the first authorization system in the filter list if you haven't used filters before, or default to the last filtered selection. 

        - To automatically select all options for a single authorization system, next to the authorization system name, select **Only**.

    2. To filter by the selection, select **Apply**. 

    3. To remove all filters, select **X**.

- **Filtering by Tasks**

    You can filter user details by the tasks they perform.

    1. Select the applicable option to filter by task:
        - **All**: Filters by all existing tasks a user can perform.
        - **High Risk Tasks**: Filters tasks by high risk, which includes modifying and deleting content.
    2. To filter users who have delete task privileges, under **High Risk Tasks**, select **Delete**.
    3. To filter by the selection, select **Apply**. 

- **Filtering by Resource Type**

     AWS is currently the only **Resource Type** available. 

    1. In the **Search** box, select **Resource Type** and **Service**. Then select the appropriate boxes under the **Resource Type** column.
    1. When a resource is selected, a symbol appears next to the icon. 

        To expand the menu, select the down caret icon.
       
    1. More options under **Access Type** and **Encryptions Settings** appear:
        - **Access Type** - Select **All**, **Public**, **Private**, **Restricted**, or **Other Accounts**.

             To view information about each option, hover over the information **(i)** icon.

        - **Encryption Settings**: Select **All**, **Not Encrypted**, **SSE-S3**, or **KMS**.

             There may be more resource types depending on the type of resource. For example, if you select **s3 bucket**, more **Access Type** options appear:  **All**, **Public**, **Private**, **Restricted**, and **Other Accounts**.

    4. Click **Apply**.

## Use predefined tags

You can apply the following predefined tags in CloudKnox:

- **ck_attest:**  Use this tag to attest the group. When this tag is selected, the value is automatically filled in with the date and time of when the tag was applied and the user who applied the tag
- **ck_exclude_from_reports:** Any group with this tag is excluded from the reports

## View information on active resources in the Information pane

1. Set the filters and select your Authorization System. Then select the icon at the end of the row to view additional information about the active resource.


    - The **Tasks**: **Used** section  displays tasks that were performed on the resource.

         The **Unused** section  displays that tasks weren't performed on the resource. The tasks are grouped by service and can be expanded to view the task, application, or service names.

         You can move an action from **Used** to **Unused** if you haven't accessed that action for over 90 days.

    You can perform the following actions in the **Tasks** section:

    - **Search**: Enter a specific action name to find if this action has been used or not.
    - **All Tasks**: Use the **Tasks** drop-down to filter by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.
- **Users with Access**: Displays the names of users that have access to the resource, and is sorted into the following columns:
    - **Not Accessed**: Displays the users who have access to the resource but haven't yet performed an action on the resource.
    - **Accessed by Current Users**: Displays the users who have performed actions on the resource in the last 90 days.
- **Accessed by Transient Users**: An identity that performed an operation on the resource but the identity no longer exists. This identity could have been given temporary access and is most commonly seen with virtual machines.



<!---## Next steps--->