---
title: Microsoft CloudKnox Permissions Management - View usage analytics about users
description: How to use Microsoft CloudKnox Permissions Management Usage Analytics to view usage analytics about users.
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

# Microsoft CloudKnox Permissions Management - View usage analytics about users

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how to view usage analytics about users

## View data on the Users tab and table

On the **Usage Analytics** dashboard:

- The **Users** tab provides a high-level overview of user details. The following components make up the **Users** tab:
    - **Users**: This section  displays the total number of users, inactive and active users based on the authorization system selected. For more information, see [View usage analytics about users](cloudknox-product-usage-analytics.md#view-usage-analytics-about-users).
    - **Tasks**: This section  displays the number of tasks granted to a user, and the total number of unexecuted and executed tasks based on the authorization system selected.  For more information, see [Use the Task Explorer](cloudknox-product-usage-analytics.md#use-the-task-explorer).
    - **Resources**: This section  displays how many resources have been accessed by users based on the authorization system selected. For more information, see [Use the Resource Explorer](cloudknox-product-usage-analytics.md#use-the-resource-explorer).
- The **Users** table  displays the privileges assigned,  privileges used, and resources accessed by users
    - **Username**: Provides the name of the user.

         - To view more details about the user, select the username. 

           Users are denoted with an icon for Security Assertion Markup Language (SAML) users, an icon for Enterprise Directory (ED) user, an icon for local users, and an icon for cross-account users (users from another account). AWS roles, AWS EC2 instances, Azure applications, and Google service accounts are shown with their respective icons. 
           For more information, see [View usage analytics about users](cloudknox-product-usage-analytics.md#view-usage-analytics-about-users)

         - To view more information about the user, select the username. 

           Users are denoted with an icon for Security Assertion Markup Language (SAML) users, an icon for Enterprise Directory (ED) user, an icon for local users, and an icon for cross-account users (users from another account). AWS roles, AWS EC2 instances, Azure applications, and Google service accounts are shown with their respective icons. 
           For more information, see [View usage analytics about users](cloudknox-product-usage-analytics.md#view-usage-analytics-about-users).

    - **Domain/Account**: This column displays a domain name for SAML or ED users and displays an account name for local users, AWS roles, AWS  EC2 instances, Azure applications, and Google service accounts.
    - **Privilege Creep Index** (PCI): Captures the incurred risk of users with access to high-risk privileges. Information is displayed in the following columns:
        - **Index**: Calculates a risk score for the user based on the high-risk privileges they have access to and if that privilege has been accessed, and the number of resources they can access.
        - **Since**: Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, for example, **! High - 130 days**.

             As a system administrator, you can hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index (PCI). For example, if you hover over **! High - 130 days**, the following message displays:

             **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**.

    - **Tasks**: Displays how many tasks are assigned to a particular user, and is broken into the following columns:
        - **Granted**: Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the AWS role type the user can assume.
        - **Executed**: Displays how many of the tasks the user has executed in the last 90 days.
    - **Resources**: Displays how many resources a particular user can access, and is broken into the following columns:
        - **All**: Captures the number of resources the user can access.
        - **Accessed**: Displays how many of the resources the user has accessed.
    - **User Groups**: Identifies how many groups a user belongs to.
    - **Last Activity On**: Displays the date and time the user last performed any type of task in the authorization system.

        If the user hasn't logged in or hasn't performed tasks in the last 90 days, a dash (**-**) displays.

    - **Tags** : Displays the number of tags applied to a user.

    -  To expand details about the user, select the **Tags** icon. 

       For more information, see [Use the User Explorer](cloudknox-product-usage-analytics.md#use-the-user-explorer). 

## Apply filters for users

There are many filter options on the **Users** screen, including filters by **Authorization systems**, filters by **User** types and filters by **Task** types. You can apply filters in one, two, or all three categories, depending on what information the system administrator wants. 

- **Filtering by Authorization systems**
    1. To expand the **Authorization systems** menu, select the icon on the left side of the page. Then select all applicable systems. 

         The default filter is the first authorization system in the filter list if filters haven't been used before, or will default to the last filtered selection. 

    2. To automatically select all options for a single authorization system, next to the authorization system name, select **Only**.

    3. To filter the data by the selection, select **Apply**. 

         Both SAML and local users are listed if the selection spans multiple authorization systems. 

    4. To remove all filters, select **X**.

- **Filtering by Users**

    System administrators can filter users details by type of user: AWS role/Azure application/Google service Account, or by resource.


    1. To expand the **Users** menu, select the icon on the left. 

    2. To filter by identity type, select the applicable option(s):
    
        - **All**:  Displays identities of all types
        - **Users**:  Displays all identities of **User** type. The default for the subcategories under this option is **All**. 
            You can select **ED** (users federated from an enterprise directory) or **Local** (users native to authorization system) users. 
           - Under **Type of User**, select **Active** or **Inactive**. 
           **Inactive** users are the users who haven't performed high-risk activity in the last 90 days.
        - **Role/App/Service a/c**: The default for the subcategories under this option is **All**. You can select **Active** or **Inactive**.
             **Role** applies to AWS, Application (**App**) applies to Azure, and **Service account** (a/c) applies to GCP. 

             If you filter by this option, the role, application, or service account name displays under the **Username** column.
        - **Resource** (specific to AWS) -  Displays virtual machines in AWS.
        - **Cross Account** (specific to AWS) -  Displays identities coming from another AWS account.
    3. To display the identities that have a PCI of greater than 0, select the box next to **Risky** at the top of the **Users** filter box. 

         To filter across any category listed in step 1, select **Risky**.

    4. To view only identities included in the account level PCI calculation, select **Incl. In PCI Calculation Only**.
    5. To filter by the selection, select **Apply**. 

         Both Security Assertion Markup Language (SAML) and local users are listed if the selection spans multiple authorization systems. 
   
    6. To remove all filters, select **X**.

- **Filtering by Tasks**

    System administrators can filter user details by the tasks they perform.

    1. To expand the **Tasks** menu, select the icon on the left.
    2. To filter by task, select the applicable option(s):
        - **All**: Filters by all existing tasks a user can perform.
        - **High Risk Tasks**: Filters tasks by high risk, which includes modifying and deleting content.
    3. To filter users who have delete task privileges, select the box next to **Delete** under the **High Risk Tasks**  button.
    4. To filter by the selection, select **Apply**.

         Both SAML and local users will be listed if the selection spans multiple authorization systems. 
    
    5. To remove all filters, select **X**.

## View user information on the Information pane

- To view more information about a user, select the icon at the end of the row, and then select **Domain/Account** to expand the user's details. 

  - **Tasks**:  Displays unused and used tasks for the individual user, application, or service account. The tasks are grouped by service and can be expanded to view the individual tasks under each service. Task names are specific to the authorization system.

     - You can display a service in both the **Unused** and **Used** columns, depending on when it was accessed. 

        If none of the tasks have been used in a service, there will be an exclamation mark (**!**). If you hover on the list, the following message displays: 

        **None of the tasks in this group have been used in the last 90 days**. 

     - A task can move from **Used** to **Unused** if it hasn't been accessed for more than 90 days. 

    You can do the following actions in the **Tasks** section:

      - **Search**: In the **Search** box, type a specific task name and find how many of those tasks have been unused or used.
      - **All Tasks**: Use the **Tasks** drop-down list to filter by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

          A **High-Risk task** can cause data leakage, service disruption, or service degradation. 

          A **Delete Task** is considered a high-risk task that allows a user to permanently delete a resource.

  - When you select **User** from the **Users** filter section, the following side panels display:

      - **User Groups** (Local Users Only) (All Authorization Systems) -  Displays the specific groups the user belongs to, if applicable.

      - **Roles Available** (AWS Only) - Lists all the roles the user can assume within the authorization system, including **Type**, **Name**, and **Domain**.

        1. In the **Name** column, select **View json.** 

             **Result:** The **Role Summary** screen opens and lists the **Role Name** and **Role Type** at the top.

             The **Policies** tab will be selected by default.

        2. Under **Policies**, a list will display showing all the policies directly attached to a user.  

            - To expand and read the details of the policy, select the icon.

        3. The purpose of the SCP section is to provide permission boundaries on each policy. Under **SCP** (Service Control Policy), three columns are displayed called **Policy Name**, **Source Name**, and **Source**. 

            -  To expand and read the details of the policy, select the icon in the **Policy Name** column.

        4. To view details on who can assume the role being viewed, select the **Trusted Entities** tab.
        
             - **Roles Accessed** (SAML Users Only) (AWS Only) - Lists all the roles the user has assumed within the authorization system, including **Type**, **Name**, and **Domain**.
             - **Roles** (Azure) - Lists all the roles the user can assume within the authorization system, including **Name**, **Resource**, **Type**, and **Status**.
             - **Roles** (GCP) - Lists all the roles the user can assume within the authorization system, including **Source**, **Resource**, and **Current Role**.

  - When you select **Role/App/ Service a/c** from the **Users** filter section, the following side panels display: 

       **Role** is specific to AWS, **Application (App)** is specific to Azure, and **Service Account (a/c)** is specific to GCP.

    - **Role (AWS Only)**
        - **Identities with access**:  Displays which identities can assume this specific role, including **Type**, **Name**, and **Domain** information.
        - **Identities accessed** (AWS Only) -  Displays how many identities have assumed the role, including **Type**, **Name**, and **Domain** information.

             > [!IMPORTANT]
             >  If the role no longer allows the identity to assume it, that identity will still appear in the **Identities accessed** section if the user accessed the identity in the past 90 days prior to the identity being removed. </p>The identity will no longer display in the **Identities accessed** section once the 90 day period has passed.

    - **Application (Azure Only)**
        - **Secrets**: Applications can authenticate using secrets. The **Secrets** panel displays the following options:
            - **Key Id**: The ID number for the secret key.
            - **Start Date**: The day the key was generated.
            - **Expires**: The day the key expires.
        - **Application Usage**: The usage pattern for the application over the last 90 days.
        - **Roles**: Lists all the roles that are assigned to a user.The following fields provide more information about the role:

            - **Name**: Name of the role.
            - **Resource**: The scope where the role is assigned.
            - **Type**: Displays the type of resource.
            - **Status**: The user or role's current state can fall into the one of the following options:
                - **Permanent**: The role has been granted to the user directly or through a group.
                - **Eligible**: The user is eligible to use a role that is available in Microsoft PIM.
                - **Active**: The user is using a role that is available in Microsoft PIM.
                - **Expired**: The Microsoft PIM role is no longer available for the user.

    - **Service Account (GCP Only)**
        - **Service Account Usage -**  Displays the usage pattern for the service account over the last 90 days
        - **Roles -** Lists all the roles that are assigned to a user. The following fields display more information about the role:
            - **Source**: The scope where the role is assigned.
            - **Resource**: The type of source.
            - **Current Role**: The name of the role.

  - **Side panels displayed when 'Resource' is selected from the Users filter section:**

     > [!NOTE]
     > **Resource** is an AWS-specific feature.

     - **Roles Available**: Lists all the roles the user can assume within the authorization system, including **Type**, **Name**, and **Domain**.

## View or add a tag to an identity

- All identities displayed in the **Users** page can be tagged.
    1. To apply a tag to a user or view tags applied to the user, select the icon from the far right column and select **Tags**. 

       Alternately, select the number in the **Tags** column view and the select **Add Tag**.
    1. On the **Tags** window, the **Identity Name**  displays the current user the tag is being created for and the **Type**  displays **User** since usage analytics are being viewed at the user level. 
    
       The **Authorization Type**, **Tag**, **Value (Optional),** and **Authorization Systems** boxes are pre-loaded with information if a tag is already applied to the current user. These details cannot be edited, but the system administrator can select **Delete** to delete the current tag(s).
    1. Click **Add Tag**. 
    1. Select the **Authorization System Type**. 

          If the current user is only part of one authorization system, the **Authorization System Type**  drop-down list won't have multiple options.
    1. Click in the **Tag** box. 

          A  drop-down list of existing tags appears. Select from the current options or can type in a brand new tag and then select **Create**. 
    1. Input a value in the **Value (Optional)** box, such as the date and time the tag is being created.
    1. Click in the **Authorization Systems** box. 
    
          If the current user is only part of one authorization system,  this box will be pre-populated. If they are part of multiple authorization systems, the system administrator can select the appropriate authorization system the tag being created.
    1. To save the tag, select **Save**.
    1. To close the **Tag** window, select the **X**.

### Use predefined tags

CloudKnox has the following set of predefined tags that can be applied:

- **ck_attest**: This tag is used to attest an identity, and when selected, the value is automatically filled in with the date and time the tag was applied, and the user who applied the tag.
- **ck_exclude_from_pci**: Any identity with this tag is excluded from the account level PCI score.
- **ck_exclude_from_reports**: Any identity with this tag is excluded from reports.
- **ck_primary_owner**: This tag is used for service accounts to indicate the primary owner of the service account.
- **ck_secondary_owner**: This tag is used for service accounts to indicate the secondary owner of the service account.



<!---## Next steps--->