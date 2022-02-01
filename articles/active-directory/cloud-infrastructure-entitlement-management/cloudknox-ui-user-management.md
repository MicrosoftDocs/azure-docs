---
title: Manage users with the User management dashboard in Microsoft CloudKnox Permissions Management
description: How to manage users in the User management dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/01/2022
ms.author: v-ydequadros
---

# Manage users with the User management dashboard

This topic describes how to use the Microsoft CloudKnox Permissions Management (CloudKnox) **User Management** dashboard to view user management information.

**To display the User Management dashboard**:

- In the upper right of the CloudKnox dashboard, select **User** (your initials) in the upper right of the screen, and then select **User Management.**

    The **User Management** dashboard has two tabs:

    - **Registered** - Displays **User** information for registered users.
    - **Invited** - Displays **User** information for users who have been invited but aren't registered.

## The Registered tab
 
The **Registered** tab displays the following information for registered users:

- **User Name** and **Email Address** - The registered user's name and email address.
- **Permissions** - The **Authorization systems** and the type of permissions granted to the user: **Viewer**, **Controller**, **Approver**, and **Requestor**. 

    Registered users can also have **All** three permissions.
- **Joined On** - The date the user registered on the system.
- **Recent Activity** - The date the user last used their permissions to access the system.
- The ellipses **(...)** (**View Permissions**) menu - Select the ellipses to open the **View User Permission** box.
    - To view details about the user's permissions, select one of the following options:
        - **Admin for all Authorization System Types** provides **View**, **Control**, and **Approve** permissions for all Authorization System types.
        - **Admin for selected Authorization System Types** provides **View**, **Control**, and **Approve** permissions for selected Authorization System types.
        - **Custom** provides **View**, **Control**, and **Approve** permissions for the authorization system types you select.

    <!---Add link- For more information about user permissions, see Grant permissions to a user.--->

You can also select the following options:

- **Reload** - Select this option to refresh the information displayed in the **User** table.
- **Search** - Enter a name or email address to search for a specific user.
- **Filters** - Select the authorization systems and accounts you want to view. 

## The Invited tab
 
The **Invited** tab displays the following information for users who have been invited but aren't registered yet:

- **User Email Address** - Displays the registered user's name and email address.
- **Permissions** - The **Authorization systems** and the type of permissions the user has been granted: **Viewer**, **Controller**, **Approver**, and **Requestor**. 

    Invited users can also have **All** three permissions.
- **Invited By** - The email address of the user who invited the new user.
- **Joined On** - The date the user registered on the system.
- **Recent Activity** - The date the new user was invited.
- The ellipses **(...)** (**View Permissions**) menu - Select the ellipses to open the **View User Permission** box.
    - The user's permissions details requested are:
        - **Admin for all Authorization System Types** provides **View**, **Control**, and **Approve** permissions for all Authorization System types.
        - **Admin for selected Authorization System Types** provides **View**, **Control**, and **Approve** permissions for selected Authorization System types.
        - **Custom** provides **View**, **Control**, and **Approve** permissions for the authorization system types you select.

    <!---Add link- For more information about user permissions, see Grant permissions to a user.--->
You can also select the following options:

- **Reload** - Select this option to refresh the information displayed in the **User** table.
- **Search** - Enter a name or email address to search for a specific user.
- **Filters** - Select the authorization systems and accounts you want to display. 


<!---## Next steps--->

<!---For information about how to create group-based permissions, see [Create group-based permissions](cloudknox-howto-create-group-based-permissions.html).--->
<!---For information about how to request privileges on-demand (POD), adjust permissions, and remediate excessive permissions, see [Manage permissions with the JEP Controller](cloudknox-product-jep-controller.html).--->
<!---For information about how to create group-based permissions, see [Attach and detach permissions in the JEP Controller](cloudknox-howto-attach-detach-permissions.html).--->
<!---For information about how to create and view the Permissions Analytics report, see [The Permissions Analytics report](cloudknox-product-permissions-analytics-reports).--->
<!---For information about how to view user management information, see [The User Management dashboard](cloudknox-ui-user-management.html).--->
