---
title: Define and manage users, roles, and access levels in Microsoft Permissions Management
description: How to define and manage users, roles, and access levels in the Permissions Management User management dashboard.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/19/2023
ms.author: jfields
---

# Define and manage users, roles, and access levels

In Permissions Management, a key component of the interface is the User management dashboard. This topic describes how system administrators can define and manage users, their roles, and their access levels in the system.

## The User management dashboard

The Permissions Management User management dashboard provides a high-level overview of:

- Registered and invited users.
- Permissions allowed for each user within a given system.
- Recent user activity.

It also provides the functionality to invite or delete a user, edit, view, and customize permissions settings.


## Manage users for customers without SAML integration

Follow this process to invite users if the customer hasn't enabled SAML integration with the Permissions Management application.

### Invite a user to Permissions Management

Inviting a user to Permissions Management adds the user to the system and allows system administrators to assign permissions to those users. Follow the steps to invite a user to Permissions Management.

1. To invite a user to Permissions Management, select the down caret icon next to the **User** icon on the right of the screen, and then select **User Management**.
2. From the **Users** tab, select **Invite User**.
3. From the **Set User Permission** window, in the **User** text box, enter the user's email address.
4. Under **Permission**, select the applicable option.

    - **Admin for All Authorization System Types**: **View**, **Control**, and **Approve** permissions for all Authorization System Types.

        1. Select **Next**.
        2. Select **Requestor for User** for each authorization system, if applicable.

           A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.
        3. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

             For example, a user may have various roles in different authorization systems, so they can select the **Add** icon and the **Users** icon to request access for all their accounts.
        4. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

    - **Admin for Selected Authorization System Types**: **View**, **Control**, and **Approve** permissions for selected Authorization System Types.

        1. Select **Viewer**, **Controller**, or **Approver** for the appropriate authorization system(s).
        2. Select **Next**.
        3. Select **Requestor for User** for each authorization system, if applicable.

             A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.
        4. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

             For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.
        5. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

    - **Custom**: **View**, **Control**, and **Approve** permissions for specific accounts in **Auth System Types**.

        1. Select **Next**.

            The default view displays the **List** section.
        2. Select the appropriate boxes for **Viewer**, **Controller**, or **Approver**.

             For access to all authorization system types, select **All (Current and Future)**.
        1. Select **Next**.
        1. Select **Requestor for User** for each authorization system, if applicable.

            A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.
        5. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

             For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.
        6. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

5. Select **Save**.

    The following message displays in green at the top of the screen: **New User Has Been Invited Successfully**.



## Manage users for customers with SAML integration

Follow this process to invite users if the customer has enabled SAML integration with the Permissions Management application.

### Create a permission in Permissions Management

Creating a permission directly in Permissions Management allows system administrators to assign permissions to specific users. The following steps help you to create a permission.

- On the right side of the screen, select the down caret icon next to **User**, and then select **User management**.

- For **Users**:
    1. To create permissions for a specific user, select the **Users** tab, and then select **Permission.**
    2. From the **Set User Permission** window, enter the user's email address in the **User** text box.
    3. Under **Permission**, select the applicable button. Then expand menu to view instructions for each option.
        - **Admin for All Authorization System Types**: **View**, **Control**, and **Approve** permissions for all Authorization System Types.
            1. Select **Next**.
            2. Check **Requestor for User** for each authorization system, if applicable.

                  A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.

            3. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

                 For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.

            4. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

        - **Admin for Selected Authorization System Types**: **View**, **Control**, and **Approve** permissions for selected Authorization System Types.
            1. Check **Viewer**, **Controller**, or **Approver** for the appropriate authorization system(s).
            2. Select **Next**.
            3. Check **Requestor for User** for each authorization system, if applicable.

               A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.

            4. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

                 For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.
            5. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.
        - **Custom**: **View**, **Control**, and **Approve** permissions for specific accounts in **Auth System Types**.

            1. Select **Next**.

               The default view displays the **List** tab, which displays individual authorization systems.
                 - To view groups of authorization systems organized into folder, select the **Folder** tab.
            2. Check the appropriate boxes for **Viewer**, **Controller**, or **Approver**.

                 For access to all authorization system types, select **All (Current and Future)**.
            3. Select **Next**.
            4. Check **Requestor for User** for each authorization system, if applicable.

               A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.
            5. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

                For example, a user can have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.

            6. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

    4. Select **Save**.

       The following message displays in green at the top of the screen:
 **New User Has Been Created Successfully**.
    5. The new user receives an email invitation to log in to Permissions Management.

### The Pending tab

1. To view the created permission, select the **Pending** tab. The system administrator can view the following details:
    - **Email Address**: Displays the email address of the invited user.
    - **Permissions**: Displays each service account and if the user has permissions as a **Viewer**, **Controller**, **Approver**, or **Requestor**.
     - **Invited By**: Displays the email address of the person who sent the invitation.
    - **Sent**: Displays the date the invitation was sent to the user.
2. To make changes to the following, select the ellipses **(...)** in the far right column.
    - **View Permissions**: Displays a list of accounts for which the user has permissions.
    - **Edit Permissions**: System administrators can edit a user's permissions.
    - **Delete**: System administrators can delete a permission
    - **Reinvite**: System administrator can reinvite the permission if the user didn't receive the email invite

       When a user registers with Permissions Management, they move from the **Pending** tab to the **Registered** tab.

### The Registered tab

- For **Users**:

    1. The **Registered** tab provides a high-level overview of user details to system administrators:
        - The **Name/Email Address** column lists the name and email address of the user.
        - The **Permissions** column lists each authorization system, and each type of permission.

          If a user has all permissions for all authorization systems,  **Admin for All Authorization Types** display across all columns. If a user only has some permissions, numbers display in each column they have permissions for. For example, if the number "3" is listed in the **Viewer** column, the user has viewer permission for three accounts within that authorization system.
             - The **Joined On** column records when the user registered for Permissions Management.
             - The **Recent Activity** column displays the date when a user last performed an activity.
             - The **Search** button allows a system administrator to search for a user by name and all users who match the criteria displays.
             - The **Filters** option allows a system administrator to filter by specific details. When the filter option is selected, the **Authorization System** box displays.

          To display all authorization system accounts,Select **All**. Then select the appropriate boxes for the accounts that need to be viewed.
    2. To make the changes to the following changes, select the ellipses **(...)** in the far right column:
        - **View Permissions**: Displays a list of accounts for which the user has permissions.
        - **Edit Permissions**: System administrators can edit the accounts for which a user has permissions.
        - **Remove Permissions**: System administrators can remove permissions from a user.

- For **Groups**:
    1. To create permissions for a specific user, select the **Groups** tab, and then select **Permission**.
    2. From the **Set Group Permission** window, enter the name of the group in the **Group Name** box.

         The identity provider creates groups.

         Some users may be part of multiple groups. In this case, the user's overall permissions is a union of the permissions assigned the various groups the user is a member of.
    3. Under **Permission**, select the applicable button and expand the menu to view instructions for each option.

        - **Admin for All Authorization System Types**: **View**, **Control**, and **Approve** permissions for all Authorization System Types.
            1. Select **Next**.
            2. Check **Requestor for User** for each authorization system, if applicable.

                A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.
            3. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

               For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.

            4. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

        - **Admin for Selected Authorization System Types**: **View**, **Control**, and **Approve** permissions for selected Authorization System Types.
            1. Check **Viewer**, **Controller**, or **Approver** for the appropriate authorization system(s).
            2. Select **Next**.
            3. Check **Requestor for User** for each authorization system, if applicable.

                 A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.
            4. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

               For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.

            5. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

        - **Custom**: **View**, **Control**, and **Approve** permissions for specific accounts in Auth System Types.
            1. Select **Next**.

               The default view displays the **List** section.

            2. Check the appropriate boxes for **Viewer**, **Controller**, or **Approver.

                 For access to all authorization system types, select **All (Current and Future)**.

            3. Select **Next**.

            4. Check **Requestor for User** for each authorization system, if applicable.

                 A user must have an account with a valid email address in the authorization system to select **Requestor for User**. If a user doesn't exist in the authorization system, **Requestor for User** is grayed out.

            5. Optional: To request access for multiple other identities, under **Requestor for Other Users**, select **Add**, and then select **Users**.

               For example, a user may have various roles in different authorization systems, so they can select **Add**, and then select **Users** to request access for all their accounts.

            6. On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then select **Add**.

    4. Select **Save**.

       The following message displays in green at the top of the screen: **New Group Has Been Created Successfully**.

### The Groups tab

1. The **Groups** tab provides a high-level overview of user details to system administrators:

    - The **Name** column lists the name of the group.
    - The **Permissions** column lists each authorization system, and each type of permission.

       If a group has all permissions for all authorization systems, **Admin for All Authorization Types** displays across all columns.

       If a group only has some permissions, the corresponding columns display numbers for the groups.

        For example, if the number "3" is listed in the **Viewer** column, then the group has viewer permission for three accounts within that authorization system.
    - The **Modified By** column records the email address of the person who created the group.
    - The **Modified On** column records the date the group was last modified on.
    - The **Search** button allows a system administrator to search for a group by name and all groups who match the criteria displays.
    - The **Filters** option allows a system administrator to filter by specific details. When the filter option is selected, the **Authorization System** box displays.

        To display all authorization system accounts, select **All**. Then select the appropriate boxes for the accounts that need to be viewed.

2. To make changes to the following, select the ellipses **(...)** in the far right column:
    - **View Permissions**: Displays a list of the accounts for which the group has permissions.
    - **Edit Permissions**: System administrators can edit a group's permissions.
    - **Duplicate**: System administrators can duplicate permissions from one group to another.
    - **Delete**: System administrators can delete permissions from a group.


## Next steps

- To view user management information, see [Manage users with the User management dashboard](ui-user-management.md).
- To create group-based permissions, see [Create group-based permissions](how-to-create-group-based-permissions.md).
