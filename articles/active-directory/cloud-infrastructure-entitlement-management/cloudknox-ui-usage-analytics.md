---
title: Microsoft CloudKnox Permissions Management - Usage Analytics dashboard
description: How to use the Microsoft CloudKnox Permissions Management Usage Analytics dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/06/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Usage Analytics dashboard

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard provides an overview of CloudKnox users and how they access their authorization systems and accounts. 

The **Usage Analytics** dashboard provides details about:

- **Users**: Tracks assigned privileges and usage of various identities. For more information, see View usage analytics about users.
    <!---Add link--->
- **Groups**: Tracks assigned privileges and usage of the group and the group members.  For more information, see View usage analytics about groups.
    <!---Add link--->
- **Active Resources**: Tracks resources that have been used in the last 90 days.  For more information, see View usage analytics about active resources.
    <!---Add link--->
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.  For more information, see View usage analytics about active tasks.
    <!---Add link--->
- **Access Keys**: Tracks the privilege usage of access keys for a given user.  For more information, see View usage analytics about access keys.
    <!---Add link--->
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.  For more information, see View usage analytics about serverless functions.
    <!---Add link--->

The **Usage Analytics** dashboard allows system administrators to easily access information they can use to:

- Make informed decisions about granting privileges and reducing risk on unused privileges
- Collect, analyze, create report on, and visualize data about all identity types.

This topic provides an overview of the components of the **Usage Analytics** dashboard.

## The dashboard toolbars

### The top toolbar

The top toolbar provides the following options:

- A drop-down list from which you can select one of the following options: **Users**, **Groups**, **Active Resources**, **Active Tasks**, **Access Keys**, and **Serverless Functions**.
- **Export** - Select this button and then select to export the Usage report in CSV format.

    The following message displays: **We'll email you a link to download the file.** 

    Check your email for the message from the CloudKnox Customer Success Team. This email contains two links:

    - The **User Entitlements And Usage** report.
    <!---Ad Link reports@cloudknox.io---> 

    - The **Reports** dashboard, where you can configure how and when to automatically receive reports.

- **Account** - The name of the account.
- **User** - Select the **X** to the right of the button to display the full list of **Username**, **Domain/Account**, **Privilege Creep Index**, **Tasks**, **Resources**, **User Groups**, and **Last Activity On** date.

### The left toolbar

The left toolbar provides the following options:

- **Authorization systems** (the lock icon) - Displays a list of authorization systems and accounts you can access. Select the systems and accounts you want to view and then select **Apply**.
- **Users** (the people icon) - Displays a list of **User**, **Type of user**, **Role/ App/ Service a/c**, **Resources**, and **Cross Account**  you can access. Select the users whose activity you want to view and then select **Apply**.
- **Tasks** (the clipboard icon) - Displays a list of **Tasks** you can access. Select **All** or **High Risk Tasks**, and then select **Apply**.
    - To delete the selected tasks, select **Delete**, and then select **Apply**.

## The Users results table

When you select **Users** in the top toolbar, the results table displays the following information:
- **Username** - A list of users who access CloudKnox.
- **Domain/Account** - The user's domain/account information.
- **Privilege Creep Index** - The index rating, how frequently and for how many days the user has accessed CloudKnox.
- **Tasks** - How many granted and executed tasks the user has accomplished.
- **Resources** - The resources the user has accessed.
- **User Groups** - How many groups the user belongs to.
- **Last Activity On** date - The last time the user accessed CloudKnox.
- **Tags** - Select the ellipses **(...)** to display the associated tag information.
- The down arrow - Select the down arrow to view details about the associated **Tasks**, sorted by **Unused** and **Used**, **User Groups**, **Roles Available**, and **Policies**.

    Select the up arrow to return to the previous view.


## The Groups results table

When you select **Groups** in the top toolbar, the results table displays the following information.

When you select **Users** in the top toolbar, the results table displays the following information:
- **Group Name** - A list of groups who access CloudKnox.
- **Domain/Account** - The user's domain/account information.
- **Privilege Creep Index** - The index rating, how frequently and for how many days the user has accessed CloudKnox.
- **Users** - How many users have access.
- **Tasks** - How many granted and executed tasks the user has accomplished.
- **Resources** - The resources the user has accessed.
- **Tags** - Select the ellipses **(...)** to display the associated tag information.
- The down arrow - Select the down arrow to view details about the associated **Tasks**, sorted by **Unused** and **Used**, **User**, and **Policies**.

    Select the up arrow to return to the previous view.

## The Active Resources results table

When you select **Active Resources** in the top toolbar, the results table displays the following information.

- **Resource Name** - A list of available resources.
- **Account** - The account name.
- **Resource Type** - The type of resource: **key**, **bucket**, **instance**, and **policy**.
- **No. Of Times Users Accessed** - The number of times users have accessed the resource.
- **Tasks** - How many granted and used tasks the user has accomplished.
- **No. Of Times Users** - The number of users who have access to the resource and who have accessed the resource.
- **Tags** - Select the ellipses **(...)** to display the associated tag information.
- The down arrow - Select the down arrow to view details about the associated **Tasks**, sorted by **Unused** and **Used**, **User Groups**, **Roles Available**, and **Policies**.

    Select the up arrow to return to the previous view.

## The Active Tasks results table

When you select **Active Tasks** in the top toolbar, the results table displays the following information.

- **Task Name** - A list of available tasks.
- **No. Of Times Task Is Performed** - The number of times the task was done.
- **Performed On (Resources)** - How many resources were accessed.
- **No. Of Users** - The number of users who have unexecuted and executed access.
- The down arrow - Select the down arrow to view details about the associated **Tasks**, sorted by **Unused** and **Used**, **User Groups**, **Roles Available**, and **Policies**.

    Select the up arrow to return to the previous view.

## The Access Keys results table

When you select **Access Keys** in the top toolbar, the results table displays the following information.

- **Authorization System Type** - The selected authorization system (AWS, Azure, GCP, and so on).
- **Authorization System** - Information about the lists and folders in the authorization system and its accounts.
- **Key Status** - Select **All**, **Active**, or **Inactive**.
- **Key Activity Status** - Select number of days used: **All**, **Used <90**, **Used <91-365**, **Used >365**, or **Unused**.
- **Key Age** - Select the age of the key in days: **All**, **<90**, **90-365**, **>180**, or **Unused**.
- **Tasks Type** - Select **All**, **High Risk Tasks**, or **Delete Tasks**.
- **Apply** - Select to apply your settings.
- **Reset Filter** - Select to discard your settings.

- Information about the **Access Keys** -
    - **Access Key ID** - Displays the Access Key ID.
    - **Owner** - Displays the owner's name.
    - **Account** - Displays the account name.
    - **Privilege Creep Index** - The index rating, how frequently and for how many days the user has accessed CloudKnox.
    - **Tasks** - Displays the **Granted** and **Executed** tasks.
    - **Resources** - Displays the **All** and **Accessed** resources.
    - **Access Key Age** - Displays the age of the access key in days.
    - **Last Used** - Displays when the access key was last used.

## The Serverless Functions results table

When you select **Serverless Functions** in the top toolbar, the results table displays the following information.

- **Authorization System Type** - The selected authorization system (AWS, Azure, GCP, and so on).
- **Authorization System** - Information about the lists and folders in the authorization system and its accounts.
- **Apply** - Select to apply your settings.
- **Reset Filter** - Select to discard your settings.

- Information about the **Serverless Functions** -
    - **Serverless Functions** - Displays the **Function Name**.
    - **Authorization System** - Displays the account name.
    - **Privilege Creep Index** - The index rating, how frequently and for how many days the user has accessed CloudKnox.
    - **Tasks** - Displays the **Granted** and **Executed** tasks.
    - **Resources** - Displays the **All** and **Accessed** resources.
    - **Last Activity On** - Displays when the activity was last used.
    - **Tags** - Select the ellipses **(...)** to display the associated tag information.



<!---## Next steps--->

