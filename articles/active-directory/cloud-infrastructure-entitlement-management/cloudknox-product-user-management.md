---
title: Microsoft CloudKnox Permissions Management User Management
description: How to use Microsoft CloudKnox Permissions Management User Management to define and manage users, roles, and access levels.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/09/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management User Management

In Microsoft CloudKnox Permissions Management, User Management is a key component of the product's interface. This allows system administrators to define and manage users, roles, and their access levels in the system. 

## The User Management dashboard

The CloudKnox User Management dashboard provides a high-level overview of registered and invited users, permissions allowed for each user within a given system, and recent user activity. It provides the functionality to invite or delete a user, edit, view and customize permissions settings.

The CloudKnox User Management system encompasses the following components.

- **CloudKnox Administrator** - The person(s) who is designated to manage the CloudKnox application.
- **Users** - The consumers who interact with the CloudKnox application through their organization. The CloudKnox administrator must assign appropriate permissions to the users to allow them to use CloudKnox.
- **Permissions** - A delegation of authority given to users by a CloudKnox administrator system so they may perform specific actions within the application or system.
- **Roles** - A grouping of privileges that a CloudKnox administrator can assign to one or more users or groups who perform the same or similar functions. CloudKnox supports the following roles:
- **Viewer**: Allows view access only, excluding privileges on-demand (POD).

    > [!NOTE]
    > POD allows the organization to grant users elevated rights in individual applications while still maintaining least privileges

- **Controller** - Allows create, update, and delete capabilities across various functions, including users, permissions, roles, sentry, authorization systems, etc., excluding POD.
- **Approver** - Provides the ability to approve JEP POD for various authorization systems.
- **Requestor** - Provides the ability to request permissions for various authorization systems.
- **Groups** - A group of users who interact with the CloudKnox application through their organization. The organization must create the groups.
- **Authorization Systems** - The system that specifies access privileges to resources by users or groups, including Amazon Web Services (AWS) Accounts, Google Cloud Platform (GCP) Projects, Microsoft Azure Subscriptions, and vCenter Deployments.

## How to manage users for customers without SAML integration

The CloudKnox user invitation process is as follows if the customer has not enabled Security Assertion Markup Language (SAML) integration with CloudKnox application.

### How to invite a user to CloudKnox

Inviting a user to CloudKnox adds the user to the system and allows system administrators to assign permissions to those users. Follow the steps below to invite a user to CloudKnox.

1. To invite a user to CloudKnox, click the down caret icon next to the **User** icon on the right of the screen, and then select **User Management**.
2. From the **Users** tab, click **Invite User**.
3. From the **Set User Permission** window, in the **User** text box, enter the user's email address.
4. Under **Permission**, select the applicable option. 

    - **Admin for All Authorization System Types** - **View**, **Control**, and **Approve** permissions for all Authorization System Types.

        1. Click **Next**.
        2. Select **Requestor for User** for each authorization system, if applicable.  

           Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**. If the user does not exist in the authorization system, the option to select **Requestor for User** is unavailable (grayed out).
        3. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

             For example, a user may have various roles in different authorization systems, so they can click the **Add** icon and the **Users** icon to request access for all their accounts. 
             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.
    
    - **Admin for Selected Authorization System Types** - **View**, **Control**, and **Approve** permissions for selected Authorization System Types.
    
        1. Select **Viewer**, **Controller**, and/or **Approver** for the appropriate authorization system(s).  
        2. Click **Next**.
        3. Select **Requestor for User** for each authorization system, if applicable.    
      
             Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**. If the user does not exist in the authorization system, the option to select **Requestor for User** is grayed out.
        4. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.   

             For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts.
             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.
    
    - **Custom** - **View**, **Control**, and **Approve** permissions for specific accounts in **Auth System Types**.
    
        1. Click **Next**.    

            The default view displays the **List** section.
        2. Check the appropriate boxes for **Viewer**, **Controller**, and/or **Approver**.     You have the option to select the top check box, **All (Current and Future)**, which automatically selects all the checkboxes in the column for access to all authorization system types.  
        3. Click **Next**.
        4. Check **Requestor for User** for each authorization system, if applicable.    

            You must have an account with a valid email address in the authorization system to be able to select **Requestor for User**. If the user does not exist in the authorization system, the option to select **Requestor for User** is grayed out.
        5. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

             For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts. 
             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.

5. Click **Save**. 

    The following message displays in green at the top of the screen: **New User Has Been Invited Successfully**.

### How to use the Invited tab

1. To view the invited user, click the **Invited** tab. The system administrator can view the following details: 

    - **Email Address** - Displays the email address of the invited user.
    - **Permissions** - Displays each service account and whether or not the user has permissions as a **Viewer**, **Controller**, **Approver**, and/or **Requestor**.
    - **Invited By** - Displays the email address of the person who sent the invitation.
    - **Sent** - Displays the date the invitation was sent to the user.
2. To make changes to the following, click the ellipses **(...)** in the far right column:

    - **View Permissions** - Displays a list of the accounts for which the user has permissions.
    - **Edit Permissions** - System administrators can edit which permissions a user has.
    - **Delete User** - System administrators can delete a user.
    - **Reinvite** - System administrators can reinvite a user if the user did not receive the email invitation.

    When a user registers with CloudKnox, their name moves from the **Invited** tab to the **Registered** tab.

### How to use the Registered tab

1. The **Registered** tab provides a high-level overview of user details to system administrators:
    - The **Name/Email Address** column lists the name and email address of the user.
    - The **Permissions** column lists each authorization system, and each type of permission.    

      If a user has all permissions for all authorization systems,  **Admin for All Authorization Types** displays across all columns.    

      If a user has only some permissions, numbers display in each column they have permissions for. For example, if the number "3" is listed in the **Viewer** column, the user has viewer permission for three accounts within that authorization system.
    - The **Joined On** column displays when the user registered for CloudKnox.
    - The **Recent Activity** column displays when a user last performed an activity.
    - **Search** allows a system administrator to search for a user by name and all users who match the criteria are displayed.
    - The **Filters** option allows a system administrator to filter by specific details. When the filter option is clicked, the **Authorization System** box displays. 

2. To display all authorization system accounts, click **All**. Then select the appropriate boxes for the accounts that need to be viewed.
3. To make changes to the following, click the ellipses **(...)** in the far right column:
    - **View Permissions** - This displays the accounts for which the user has permissions.
    - **Edit Permissions** - System administrators can edit which permissions a user has.
    - **Delete User** - System administrators can delete user.

## How to manage users for customers with SAML integration

The CloudKnox user invitation process is as follows if the customer has enabled Security Assertion Markup Language (SAML) integration with CloudKnox application.

### How to create a permission in CloudKnox

Creating a permission directly in CloudKnox allows system administrators to assign permissions to specific users. The following steps help you to create a permission.

- On the right side of the screen, click the down caret icon next to **User** and then select **User Management**.

- For **Users**:
    1. To create permissions for a specific user, click the **Users** tab, and then click **Permission.**
    2. From the **Set User Permission** window, enter the user's email address in the **User** text box.
    3. Under **Permission**, select the applicable button. Then expand menu to view instructions for each option. 
        - **Admin for All Authorization System Types** - **View**, **Control**, and **Approve** permissions for all Authorization System Types.
            1. Click **Next**.
            2. Check **Requestor for User** for each authorization system, if applicable.    

               Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**.    

               If the user does not exist in the authorization system, the option to select **Requestor for User** is unavailable (grayed out).

            3. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

                For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts.    

             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.

        - **Admin for Selected Authorization System Types** - **View**, **Control**, and **Approve** permissions for selected Authorization System Types.
            1. Check **Viewer**, **Controller**, and/or **Approver** for the appropriate authorization system(s).  
            2. Click **Next**.
            3. Check **Requestor for User** for each authorization system, if applicable.     

               Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**.   

               If the user does not exist in the authorization system, the option to select **Requestor for User** is grayed out.

            4. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

                 For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts. 
             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.
        - **Custom** - **View**, **Control**, and **Approve** permissions for specific accounts in **Auth System Types**.

            1. Click **Next**.     

               The default view displays the **List** tab, which displays individual authorization systems. 
                 - To view groups of authorization systems organized into folder, click the **Folder** tab.
            2. Check the appropriate boxes for **Viewer**, **Controller**, and/or **Approver**.    

               Users have the option to select the top check box, **All (Current and Future)**, which automatically selects all the checkboxes in the column for access to all authorization system types.
            3. Click **Next**.
            4. Check **Requestor for User** for each authorization system, if applicable.   

               Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**.              
               If the user does not exist in the authorization system, the option to select **Requestor for User** is grayed out.
            5. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

                For example, a user can have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts. 

             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.

    4. Click **Save**. 
     
       The following message displays in green at the top of the screen:
 **New User Has Been Created Successfully**.  
    5. The new user receives an email invitation to log in to CloudKnox.

### How to use the Pending tab

1. To view the created permission, click the **Pending** tab. The system administrator can view the following details:
    - **Email Address** - Displays the email address of the invited user.
    - **Permissions** - Displays each service account and whether or not the user has permissions as a **Viewer**, **Controller**, **Approver**, and/or **Requestor**.
     - **Invited By** - Displays the email address of the person who sent the invitation.
    - **Sent** - Displays the date the invitation was sent to the user.
2. To make changes to the following, click the ellipses **(...)** in the far right column.
    - **View Permissions** - Displays the user's permissions.
    - **Edit Permissions** - System administrators can edit a user's permissions.
    - **Delete** - System administrators can delete a permission
    - **Reinvite** - System administrator can reinvite the permission if the user did not receive the email invite

       When a user registers with CloudKnox, they move from the **Pending** tab to the **Registered** tab.

### How to use the Registered tab

- For **Users**:

    1. The **Registered** tab provides a high-level overview of user details to system administrators: 
        - The **Name/Email Address** column lists the name and email address of the user.
        - The **Permissions** column lists each authorization system, and each type of permission.    

          If a user has all permissions for all authorization systems,  **Admin for All Authorization Types** display across all columns. If a user only has some permissions, numbers display in each column they have permissions for. For example, if the number "3" is listed in the **Viewer** column, the user has viewer permission for three accounts within that authorization system.
         - The **Joined On** column records when the user registered for CloudKnox.
         - The **Recent Activity** column displays when a user last performed an activity.
         - The **Search** button allows a system administrator to search for a user by name and all users who match the criteria displays.
         - The **Filters** option allows a system administrator to filter by specific details. When the filter option is clicked, the **Authorization System** box displays.    

          To display all authorization system accounts,Click **All**. Then select the appropriate boxes for the accounts that need to be viewed.
    2. To make the changes to the following changes, click the ellipses **(...)** in the far right column:
        - **View Permissions** - Displays which accounts the user has permissions for
        - **Edit Permissions** - System administrators can edit which permissions a user has
        - **Remove Permissions** - System administrators can remove permissions from a user
        
- For **Groups**:
    1. To create permissions for a specific user, click the **Groups** tab, and then click **Permission**.
    2. From the **Set Group Permission** window, enter the name of the group in the **Group Name** box.    

         Groups are created by the identity provider.    

         Some users may be part of multiple groups. In this case, the user's overall permissions is a union of the permissions assigned the various groups the user is a member of.
    3. Under **Permission**, select the applicable button and expand the menu to view instructions for each option. 

        - **Admin for All Authorization System Types** - **View**, **Control**, and **Approve** permissions for all Authorization System Types.
            1. Click **Next**.
            2. Check **Requestor for User** for each authorization system, if applicable.    

               Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**. If the user does not exist in the authorization system, the option to select **Requestor for User** is be grayed out.
            3. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

               For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts. 

             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.

        - **Admin for Selected Authorization System Types** - **View**, **Control**, and **Approve** permissions for selected Authorization System Types.
            1. Check **Viewer**, **Controller**, and/or **Approver** for the appropriate authorization system(s).  
            2. Click **Next**.
            3. Check **Requestor for User** for each authorization system, if applicable.      

                  Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**. If the user does not exist in the authorization system, the option to select **Requestor for User** is grayed out.
            4. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

               For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts. 

             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.
       
        - **Custom** - **View**, **Control**, and **Approve** permissions for specific accounts in Auth System Types.
            1. Click **Next**.   

               The default view displays the **List** section.

            2. Check the appropriate boxes for **Viewer**, **Controller**, and/or **Approver.    

                 You have the option to select the top check box, **All (Current and Future)**, which automatically selects all the checkboxes in the column for access to all authorization system types.

            3. Click **Next**.

            4. Check **Requestor for User** for each authorization system, if applicable.    

                 Users must have an account with a valid email address in the authorization system to be able to select **Requestor for User**. If the user does not exist in the authorization system, the option to select **Requestor for User** is grayed out.

            5. Optional: To request access for multiple other identities, under **Requestor for Other Users**, click **Add** and then click **Users**.    

               For example, a user may have various roles in different authorization systems, so they can click **Add** and then click **Users** to request access for all their accounts. 

             - On the **Add Users** screen, enter the user's name or ID in the **User Search** box and select all applicable users. Then click **Add**.

    4. Click **Save**. 
    
       The following message displays in green at the top of the screen: **New Group Has Been Created Successfully**. 

### How to use the Groups tab

1. The **Groups** tab provides a high-level overview of user details to system administrators:
    
    - The **Name** column lists the name of the group.
    - The **Permissions** column lists each authorization system, and each type of permission.    

       If a group has all permissions for all authorization systems, **Admin for All Authorization Types** displays across all columns.    

       If a group only has some permissions, numbers display in each column they have permissions for.    

        For example, if the number "3" is listed in the **Viewer** column, then the group has viewer permission for three accounts within that authorization system.
    - The **Modified By** column records the email address of the person who created the group.
    - The **Modified On** column records the date the group was last modified on.
     - The **Search** button allows a system administrator to search for a group by name and all groups who match the criteria displays.
    - The **Filters** option allows a system administrator to filter by specific details. When the filter option is clicked, the **Authorization System** box displays.    

        To display all authorization system accounts, click **All**. Then select the appropriate boxes for the accounts that need to be viewed.
        
    2. To make changes to the following, click the ellipses **(...)** in the far right column:
        - **View Permissions** - This displays the accounts for which the group has permissions.
        - **Edit Permissions** - System administrators can edit a group's permissions.
        - **Duplicate** - System administrators can duplicate permissions from one group to another.
        - **Delete** - System administrators can delete permissions from a group.

<!---## Next steps--->