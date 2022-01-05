---
title: Microsoft CloudKnox Permissions Management - User Management dashboard
description: View user management information in the User Management dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/04/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - User Management dashboard

This topic describes how use the **User Management** dashboard to view user management information in Microsoft CloudKnox Permissions Management.

- To display the **User Management** dashboard, select **User** (your initials) in the upper right of the screen, and then select **User Management.**

    The **User Management** dashboard has two tabs:

    - **Registered** - Displays **User** information for registered users.
    - **Invited** - Displays **User** information.

## The Registered tab
 
The **Registered** subtab displays the following information for registered users:

- **User Name** and **Email Address** - Displays the registered user's name and email address.
- **Permissions** - The **Authorization systems** and the type of permissions the user has: **Viewer**, **Controller**, **Approver** and **Requestor**. 
    Registered users can also have **All** three permissions.
- **Joined On** - The date the user was granted permissions to the system.
- **Recent Activity** - The date when the user last used their permissions to access the system.
- The ellipses **(...)** (**View Permissions**) menu - Select the ellipses to open the **View User Permission** box.
    - To view details about the user's permissions, select one of the following options:
        - **Admin for all Authorization System Types** provides **View**, **Control**, and **Approve** permissions for all Authorization System types.
        - **Admin for selected Authorization System Types** provides **View**, **Control**, and **Approve** permissions for for selected Authorization System types.
        - **Custom** provides **View**, **Control**, and **Approve** permissions for specific Authorization System types you select.

    For more information about user permissions, see Grant permissions to a user.
    <!---Add link--->
You can also select the following options:

- **Reload** - Select this option to refresh the information displayed in the **User** table.
- **Search** - Enter a name or email address to search for a specific user.
- **Filters** - Select the authorization systems and accounts you want to display. 

## The Invited tab
 
The **Invited** tab displays the following information for users who have been invited but yet registered:

- **User Email Address** - Displays the registered user's name and email address.
- **Permissions** - The **Authorization systems** and the type of permissions the user has: **Viewer**, **Controller**, **Approver** and **Requestor**. 
    Registered users can also have **All** three permissions.
- **Invited By** - The email address of the user was invited the new user.
- **Joined On** - The date the user was granted permissions to the system.
- **Recent Activity** - The date when the new user was invited.
- The ellipses **(...)** (**View Permissions**) menu - Select the ellipses to open the **View User Permission** box.
    - The user's permissions details requested are:
        - **Admin for all Authorization System Types** provides **View**, **Control**, and **Approve** permissions for all Authorization System types.
        - **Admin for selected Authorization System Types** provides **View**, **Control**, and **Approve** permissions for for selected Authorization System types.
        - **Custom** provides **View**, **Control**, and **Approve** permissions for specific Authorization System types you select.

    For more information about user permissions, see Grant permissions to a user.
    <!---Add link--->
You can also select the following options:

- **Reload** - Select this option to refresh the information displayed in the **User** table.
- **Search** - Enter a name or email address to search for a specific user.
- **Filters** - Select the authorization systems and accounts you want to display. 


<!---## Next steps--->