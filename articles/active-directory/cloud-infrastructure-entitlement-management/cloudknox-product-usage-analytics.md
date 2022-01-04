---
title: Microsoft CloudKnox Permissions Management - View details about identities, resources, and tasks
description: How to use Microsoft CloudKnox Permissions Management Usage Analytics to view details about identities, resources, and tasks.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/03/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - View details about identities, resources, and tasks

The Microsoft CloudKnox Permissions Management Usage Analytics tab allows system administrators to collect, analyze, report on, and visualize data about all identity types. CloudKnox Usage Analytics captures user activity details in order for system administrators to make informed decisions about granting privileges, and reducing risk on unused privileges.

## Introduction

The CloudKnox Usage Analytics feature contains details about identities, resources, and tasks that you can use to create a report.

- **Users** - Tracks assigned privileges and usage of various identities.
- **Groups** - Tracks assigned privileges and usage of the group and the group members.
- **Active Resources** - Tracks resources that have been used in the last 90 days.
- **Active Tasks** - Tracks tasks that have been performed in the last 90 days.
- **Access Keys** - Tracks the privilege usage of access keys for a given user.
- **Serverless Functions** - Tracks assigned privileges and usage of the serverless functions.

For common definitions used in the CloudKnox application, see the glossary. 

## How to view usage analytics about users

### How to read the Users dashboard and table

On the **Usage Analytics** tab:

- The **Users** dashboard provides a high level overview of user details. The following components make up the **Users** dashboard:
    - **Users** - This section  displays the total number of users, inactive and active users based on the authorization system selected. For more information, see [How to apply filters for users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).
    - **Tasks** - This section  displays the number of tasks granted to a user, and the total number of unexecuted and executed tasks based on the authorization system selected.  For more information, see  [How to apply filters to users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).
    - **Resources** - This section  displays how many resources have been accessed by users based on the authorization system selected. For more information, see [How to apply filters for users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).
- The **Users** table  displays the privileges assigned,  privileges used, and resources accessed by users
    - **Username** - Provides the name of the user.

         - To view more details about the user, click the username. 

           Users are denoted with an icon for Security Assertion Markup Language (SAML) users, an icon for Enterprise Directory (ED) user, an icon for local users, and an icon for cross-account users (users from another account). AWS roles, AWS EC2 instances, Azure applications, and Google service accounts are shown with their respective icons. 
           For more information, see How to use identity explorer for users. 

    - **Domain/Account** - This column displays a domain name for SAML or ED users and displays an account name for local users, AWS roles, AWS  EC2 instances, Azure applications, and Google service accounts.
    - **Privilege Creep Index** (PCI) - Captures the incurred risk of users with access to high-risk privileges. Information is displayed in the following columns:
        - **Index** - Calculates a risk score for the user based on the high-risk privileges they have access to and if that privilege has been accessed, and the number of resources they can access.
        - **Since** - Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, for example, **! High - 130 days**.

             As a system administrator, you can hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index (PCI). For example, if you hover over **! High - 130 days**, the following message displays:

             **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**.

    - **Tasks** - Displays how many tasks are assigned to a particular user, and is broken into the following columns:
        - **Granted** - Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the AWS role type the user can assume.
        - **Executed** - Displays how many of the tasks the user has executed in the last 90 days.
    - **Resources** - Displays how many resources a particular user can access, and is broken into the following columns:
        - **All** - Captures the number of resources the user can access.
        - **Accessed** - Displays how many of the resources the user has accessed.
    - **User Groups** - Identifies how many groups a user belongs to.
    - **Last Activity On** - Displays the date and time the user last performed any type of task in the authorization system.

        If the user hasn't logged in or hasn't performed tasks in the last 90 days, a dash (**-**) displays.

    - **Tags** - Displays the number of tags applied to a user.

    -  To expand details about the user, click the **Tags** icon. 

       For more information, see How to read the information panel for users. 

### How to apply filters for users

There are many filter options on the **Users** screen, including filters by **Authorization systems**, filters by **User** types and filters by **Task** types. You can apply filters in one, two, or all three categories, depending on what information the system administrator wants. 

- **Filtering by Authorization systems**
    1. To expand the **Authorization systems** menu, click the icon on the left side of the page. Then select all applicable systems. 

         The default filter is the first authorization system in the filter list if filters haven't been used before, or will default to the last filtered selection. 

    2. To automatically select all options for a single authorization system, next to the authorization system name, click **Only**.

    3. To filter the data by the selection, click **Apply**. 

         Both SAML and local users are listed if the selection spans multiple authorization systems. 

    4. To remove all filters, click **X**.

- **Filtering by Users**

    System administrators can filter users details by type of user: AWS role/Azure application/Google service Account, or by resource.

    1. To expand the **Users** menu. click the icon on the left. 
    2. To filter by identity type, select the applicable option(s):
    
        - **All** -  Displays identities of all types
        - **Users** -  Displays all identities of **User** type. The default for the subcategories under this option is **All**. 
            You can select **ED** (users federated from an enterprise directory) or **Local** (users native to authorization system) users. 
           - Under **Type of User**, select **Active** or **Inactive**. 
           **Inactive** users are the users who haven't performed high-risk activity in the last 90 days.
        - **Role/App/Service a/c** - The default for the subcategories under this option is **All**. You can select **Active** or **Inactive**.
             **Role** applies to AWS, Application (**App**) applies to Azure, and **Service account** (a/c) applies to GCP. 

             If you filter by this option, the role, application, or service account name displays under the **Username** column.
        - **Resource** (specific to AWS) -  Displays virtual machines in AWS.
        - **Cross Account** (specific to AWS) -  Displays identities coming from another AWS account.
    3. To display the identities that have a PCI of greater than 0, select the box next to **Risky** at the top of the **Users** filter box. 

         To filter across any category listed in step 1, select **Risky**.

    4. To view only identities included in the account level PCI calculation, select **Incl. In PCI Calculation Only**.
    5. To filter by the selection, click **Apply**. 

         Both Security Assertion Markup Language (SAML) and local users are listed if the selection spans multiple authorization systems. 
   
    6. To remove all filters, click **X**.

- **Filtering by Tasks**

    System administrators can filter user details by the tasks they perform.

    1. To expand the **Tasks** menu, click the icon on the left.
    2. To filter by task, select the applicable option(s):
        - **All** - Filters by all existing tasks a user can perform.
        - **High Risk Tasks** - Filters tasks by high risk, which includes modifying and deleting content.
    3. To filter users who have delete task privileges, select the box next to **Delete** under the **High Risk Tasks**  button.
    4. To filter by the selection, click **Apply**.

         Both SAML and local users will be listed if the selection spans multiple authorization systems. 
    
    5. To remove all filters, click **X**.

### How to read the Information Panel for user information

- To view more information about a user, click the icon at the end of the row, and then click **Domain/Account** to expand the user's details. 

  - **Tasks** -  Displays unused and used tasks for the individual user, application, or service account. The tasks are grouped by service and can be expanded to view the individual tasks under each service. Task names are specific to the authorization system.

     - You can display a service in both the **Unused** and **Used** columns, depending on when it was accessed. 

        If none of the tasks have been used in a service, there will be an exclamation mark (**!**). If you hover on the list, the following message displays: 

        **None of the tasks in this group have been used in the last 90 days**. 

     - A task can move from **Used** to **Unused** if it hasn't been accessed for more than 90 days. 

    You can do the following actions in the **Tasks** section:

      - **Search** - In the **Search** box, type a specific task name and find how many of those tasks have been unused or used.
      - **All Tasks** - Use the **Tasks** drop-down list to filter by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

          A **High-Risk task** can cause data leakage, service disruption, or service degradation. 

          A **Delete Task** is considered a high-risk task that allows a user to permanently delete a resource.

  - When you select **User** from the **Users** filter section, the following side panels display:

      - **User Groups** (Local Users Only) (All Authorization Systems) -  Displays the specific groups the user belongs to, if applicable.
      - **Roles Available** (AWS Only) - Lists all the roles the user can assume within the authorization system, including **Type**, **Name**, and **Domain**.
        1. In the **Name** column, click **View json.** 

             **Result:** The **Role Summary** screen opens and lists the **Role Name** and **Role Type** at the top.

             The **Policies** tab will be selected by default.

        2. Under **Policies**, a list will display showing all the policies directly attached to a user.  

            - To expand and read the details of the policy, click the icon.
        3. The purpose of the SCP section is to provide permission boundaries on each policy. Under **SCP** (Service Control Policy), three columns are displayed called **Policy Name**, **Source Name**, and **Source**. 

            -  To expand and read the details of the policy, click the icon in the **Policy Name** column.

        4. To view details on who can assume the role being viewed, click the **Trusted Entities** tab.
        
             - **Roles Accessed** (SAML Users Only) (AWS Only) - Lists all the roles the user has assumed within the authorization system, including **Type**, **Name**, and **Domain**.
             - **Roles** (Azure) - Lists all the roles the user can assume within the authorization system, including **Name**, **Resource**, **Type**, and **Status**.
             - **Roles** (GCP) - Lists all the roles the user can assume within the authorization system, including **Source**, **Resource**, and **Current Role**.

  - When you select **Role/App/ Service a/c** from the **Users** filter section, the following side panels display: 

       **Role** is specific to AWS, **Application (App)** is specific to Azure, and **Service Account (a/c)** is specific to GCP.

    - **Role (AWS Only)**
        - **Identities with access** -  Displays which identities can assume this specific role, including **Type**, **Name**, and **Domain** information.
        - **Identities accessed** (AWS Only) -  Displays how many identities have assumed the role, including **Type**, **Name**, and **Domain** information.

             > [!IMPORTANT]
             >  If the role no longer allows the identity to assume it, that identity will still appear in the **Identities accessed** section if the user accessed the identity in the past 90 days prior to the identity being removed. </p>The identity will no longer display in the **Identities accessed** section once the 90 day period has passed.

    - **Application (Azure Only)**
        - **Secrets** - Applications can authenticate using secrets. The **Secrets** panel displays the following options:
            - **Key Id** - The ID number for the secret key.
            - **Start Date** - The day the key was generated.
            - **Expires** - The day the key expires.
        - **Application Usage** - The usage pattern for the application over the last 90 days.
        - **Roles** - Lists all the roles that are assigned to a user.The following fields provide more information about the role:

            - **Name** - Name of the role.
            - **Resource** - The scope where the role is assigned.
            - **Type** - Displays the type of resource.
            - **Status** - The user or role's current state can fall into the one of the following options:
                - **Permanent** - The role has been granted to the user directly or through a group.
                - **Eligible** - The user is eligible to use a role that is available in Microsoft PIM.
                - **Active** - The user is using a role that is available in Microsoft PIM.
                - **Expired** - The Microsoft PIM role is no longer available for the user.

    - **Service Account (GCP Only)**
        - **Service Account Usage -**  Displays the usage pattern for the service account over the last 90 days
        - **Roles -** Lists all the roles that are assigned to a user. The following fields display more information about the role:
            - **Source** - The scope where the role is assigned.
            - **Resource** - The type of source.
            - **Current Role** - The name of the role.

  - **Side panels displayed when 'Resource' is selected from the Users filter section:**

     > [!NOTE]
     > **Resource** is an AWS-specific feature.

     - **Roles Available** - Lists all the roles the user can assume within the authorization system, including **Type**, **Name**, and **Domain**.

### How to view or add a tag to an identity

- All identities displayed in the **Users** page can be tagged.
    1. To apply a tag to a user or view tags applied to the user, click the icon from the far right column and click **Tags**. 

       Alternately, click the number in the **Tags** column view and the click **Add Tag**.
    1. On the **Tags** window, the **Identity Name**  displays the current user the tag is being created for and the **Type**  displays **User** since usage analytics are being viewed at the user level. 
    
       The **Authorization Type**, **Tag**, **Value (Optional),** and **Authorization Systems** boxes are pre-loaded with information if a tag is already applied to the current user. These details cannot be edited, but the system administrator can click **Delete** to delete the current tag(s).
    1. Click **Add Tag**. 
    1. Select the **Authorization System Type**. 

          If the current user is only part of one authorization system, the **Authorization System Type**  drop-down list won't have multiple options.
    1. Click in the **Tag** box. 

          A  drop-down list of existing tags appears. Select from the current options or can type in a brand new tag and then click **Create**. 
    1. Input a value in the **Value (Optional)** box, such as the date and time the tag is being created.
    1. Click in the **Authorization Systems** box. 
    
          If the current user is only part of one authorization system,  this box will be pre-populated. If they are part of multiple authorization systems, the system administrator can select the appropriate authorization system the tag being created.
    1. To save the tag, click **Save**.
    1. To close the **Tag** window, click the **X**.

### Using predefined tags

CloudKnox has the following set of predefined tags that can be applied:

- **ck_attest** - This tag is used to attest an identity, and when selected, the value is automatically filled in with the date and time the tag was applied, and the user who applied the tag.
- **ck_exclude_from_pci** - Any identity with this tag is excluded from the account level PCI score.
- **ck_exclude_from_reports** - Any identity with this tag is excluded from reports.
- **ck_primary_owner** - This tag is used for service accounts to indicate the primary owner of the service account.
- **ck_secondary_owner** - This tag is used for service accounts to indicate the secondary owner of the service account.

## How to view usage analytics about groups

### How to read the Groups dashboard

The **Groups** dashboard provides a high level overview of group details.

1. On the **Usage Analytics** page, select **Groups** from the  drop-down list across the top of the screen. The following components make up the **Groups** dashboard:

- **Groups** - This section  displays the total number of groups, inactive, and active groups based on the authorization system selected. For more information, see [How to apply filters for groups](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-groups).
- **Tasks** - This section  displays the number of tasks granted to groups, and the total number of unexecuted and executed tasks based on the authorization system selected. For more information, see [How to apply filters to users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).
- **Resources** - This section  displays how many resources have been accessed by groups based on the authorization system selected. For more information, see [How to apply filters for groups](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-groups).

The **Groups** table  displays the privileges assigned,  privileges used, and resources accessed by users.

- **Group Name** - Provides the name of the group.

     External directory groups are denoted with an icon for SAML groups, an icon for ED groups, and an icon for local users.

- **Domain/Account** - This column displays a domain name for SAML or Enterprise Directory (ED) groups and displays an account name for local groups.
- **Privilege Creep Index** - Captures the incurred risk of groups with access to high-risk privileges and is displayed in the following columns:
    - **Index** - Calculates a risk score for the group based on the high-risk privileges they have access to and if that privilege has been accessed.
    - **Since** - Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, that is **! High - 130 days**.

         You can hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index.

         For example, hovering over **! High - 130 days** displays **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**. 

- **Users** - Displays the number of users that belong to the group.
- **Tasks** - Displays how many tasks are assigned to a particular group, and is broken into the following columns:
    - **Granted** - Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the AWS role type the user can assume.
    - **Executed** - Displays how many of the granted tasks the member's of the group have executed.
- **Resources** - Displays how many resources a particular group can access, and is broken into the following columns:
    - **All** - Captures the number of resources the group has access to.
    - **Accessed** - Displays how many of the resources the group has accessed.
- **Tags** - Displays the number of tags applied to a group.

### How to apply filters for groups

There are many filter options within the **Groups** screen, including filters by **Authorization System** and **Task**. Filters can be applied in both categories depending on what information the system administrator is looking for.  

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu, and select all applicable systems, click the **Lock** icon on the left side of the page. 

        The default filter will be the first authorization system in the filter list if filters haven't been used before, or will default to the last filtered selection.

       -  To automatically select all options for a single authorization system, next to the authorization system name, click **Only**.
    2. To filter by the selection, click **Apply**.

         Both SAML and local users will be listed if the selection spans multiple authorization systems.
    3. To remove all filters, click **X**.

- **Filtering by Tasks**

    System administrators can filter group details by tasks performed.

    1. To filter by task, select the applicable option:
        - **All** - Filters by all existing tasks a user can perform.
        - **High Risk Tasks** - Filters tasks by high risk, which includes modifying and deleting content.

    2. To filter groups that have delete task privileges, under the **High Risk Tasks**, select **Delete**. 

    3. To filter by the selection, click **Apply**. 

         Both SAML and local groups will be listed if the selection spans multiple authorization systems and accounts. The top of the screen will display the authorization system that is being viewed (for example, **Azure - Azure PIM**), or if multiple authorization systems were selected, **Multiple Authorization Systems** will display. 
 
    4. To remove all filters, click **X**.

### How to read the Information Panel for groups

1. To view more information about the group after you have applied the filters and selected the authorization system, click the icon at the end of the row.

    - **Tasks** (All Authorization Systems) -  Displays unused and used tasks for each group. The tasks are grouped by service and can be expanded to view the task, application, or service names.

         A service can  display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**) and if hovered over displays **None of the tasks in this group have been used in the last 90 days**.

         A task can move from **Used** to **Unused** if that task hasn't been accessed for more than 90 days.

2. You can perform the following actions in the **Tasks** section:

    - **Search** - In the **Search** box, enter a specific task name and find how many of those tasks have been unused or used.
        - **All Tasks** - Use the **Tasks** drop-down to filter data by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

    - **Users** (All authorization systems) -  Displays the individual users that belong to the group and how many tasks that user has executed.
    - **Roles Available** (AWS Only) - Lists all the roles the user can assume within the group, including **Type**, **Name**, and **Domain**.

## How to view or add a tag to a group

- You can tag all groups displayed in the **Group** page.
    1. Click the ellipses in the far right column and click **Tags** to apply a tag to a user or view tags applied to the user.
    
       Alternately, click the number in the **Tags** column view and apply tags.
    2. On the **Tags** window, the **Identity Name** will  display the current group the tag is being created for and the **Type** will  display **Group** since usage analytics are being viewed at the group level. 

        > [!NOTE]
        >  The **Authorization Type**, **Tag**, **Value (Optional),** and **Authorization Systems** boxes are pre-loaded with information if a tag is already applied to the current group. </p>These details cannot be edited, but the system administrator can click **Delete** to delete the current tag(s).

    3. Click **Add Tag**.
    4. Select the **Authorization System Type**.

         If the current group is only part of one authorization system, the **Authorization System Type**  drop-down list won't have multiple options.

    5. Click in the **Tag** box.

         A  drop-down list of existing tags appears. Select a tag from the current options.

         To create a new tag, enter a new tag name and then click **Create**.

    6. Input a value in the **Value (Optional)** box, such as the date and time the tag is being created.
    7. Click in the **Authorization Systems** box. 

         If the current group is only part of one authorization system, this box will be pre-populated. 

         If they are part of multiple authorization systems, the system administrator can select the appropriate authorization system the tag is being created for.

    8. To save the tag, click **Save**.
    9. To close the **Tag** window, click the **X**.

### Using Predefined Tags

You can apply the following set of predefined tags in CloudKnox:

- **ck_attest** - This tag is used to attest an identity. When selected, the value is automatically filled in with the date and time the tag was applied, and the user who applied the tag.
- **ck_exclude_from_reports** - Any identity with this tag is excluded from reports.
- **ck_primary_owner** - This tag is used for service accounts to indicate the primary owner of the service account.
- **ck_secondary_owner** - This tag is used for service accounts to indicate the secondary owner of the service account.

## How to view usage analytics about active resources

### How to read the Active Resources dashboard

The **Active Resources** dashboard provides a high level overview of resource details. On the main Usage Analytics page, select **Active Resources** from the  drop-down list across the top of the screen. The following components make up the **Active Resources** dashboard:

- **Users** - This section  displays the total number of users, inactive and active users based on the authorization system selected. 
     For more information, see [How to apply filters for users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).
- **Tasks** - This section  displays the number of tasks granted to a user, and the total number of unexecuted and executed tasks based on the authorization system selected. 
     For more information, see [How to apply filters to users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).
- **Resources** - This section  displays how many resources have been accessed by users based on the authorization system selected. 
     For more information, see [How to apply filters for users](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-users).

    The **Active Resources** table for each resource  displays the following information about its tasks, activity, and user privileges.

- **Resource Name** - Provides the name of the resource.

     - To view more details about the resource, click the resource name. For more information, see How to use identity explorer for Active Resources.

       Hovering over the resource name displays the resource ID. Two resources may potentially have the same name, but different IDs.

- **Account** - Displays the account name the resource belongs to.
- **Resource Type** - Displays the type of resource, that is, Key (encryption key) or bucket (storage).
- **No. of Times Users Accessed** - Provides the number of times a user has accessed a particular resource.
- **Tasks** - Displays how many tasks are assigned to a particular user, and is broken into the following columns:
    - **Granted** - Captures the number of tasks that have been granted to the user directly, granted to the user if part of a group, or granted based on the role type the user can assume.
    - **Executed** - Displays how many of the granted tasks the user has executed.
- **No. of Users** - Displays how many users can access the resource, and is broken into the following columns:
    - **Access with** - Captures the number of users that have access to the resource.
    - **Accessed** - Displays how many users have accessed the resource.

## How to apply filters for active resources

There are many filter options within the **Active Resources** screen, including filters by **Authorization System**, filters by **Tasks** and filters by **Resource Type**. You can apply filters in one, two, or all three categories; depending on the type of information you want. 

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu, on the left of the page, click the **Lock** icon. Then select all applicable systems. 

         The default filter is the first authorization system in the filter list if you haven't used filters before, or default to the last filtered selection. 

        - To automatically select all options for a single authorization system, next to the authorization system name, click **Only**.

    2. To filter by the selection, click **Apply**. 

    3. To remove all filters, click **X**.

- **Filtering by Tasks**

    You can filter user details by the tasks they perform.

    1. Select the applicable option to filter by task:
        - **All** - Filters by all existing tasks a user can perform.
        - **High Risk Tasks** - Filters tasks by high risk, which includes modifying and deleting content.
    2. To filter users who have delete task privileges, under **High Risk Tasks**, select **Delete**.
    3. To filter by the selection, click **Apply**. 

- **Filtering by Resource Type**

     AWS is currently the only **Resource Type** available. 

    1. In the **Search** box, click **Resource Type** and **Service**. Then select the appropriate boxes under the **Resource Type** column.
    1. When a resource is selected, a symbol appears next to the icon. 

        To expand the menu, click the down caret icon.
    1. Additional options under **Access Type** and **Encryptions Settings** appear:
        - **Access Type** - Select **All**, **Public**, **Private**, **Restricted**, or **Other Accounts**.

             To view information about each option, hover over the information **(i)** icon.

        - **Encryption Settings** - Select **All**, **Not Encrypted**, **SSE-S3**, or **KMS**.

             There may be more resource types depending on the type of resource. For example, if you select **s3 bucket**, more **Access Type** options appear:  **All**, **Public**, **Private**, **Restricted**, and **Other Accounts**.

    4. Click **Apply**.

### Using predefined tags

You can apply the following predefined tags in CloudKnox:

- **ck_attest:**  Use this tag to attest the group. When this tag is selected, the value is automatically filled in with the date and time of when the tag was applied and the user who applied the tag
- **ck_exclude_from_reports:** Any group with this tag is excluded from the reports

### How to read Information Panel for active resources

1. Set the filters and select your Authorization System. Then click the icon at the end of the row to view more information about the active resource.

- The **Tasks** - **Used** section  displays tasks that were performed on the resource.

     The **Unused** section  displays that tasks weren't performed on the resource. The tasks are grouped by service and can be expanded to view the task, application, or service names.

     You can move an action from **Used** to **Unused** if you haven't accessed that action for over 90 days.

    You can perform the following actions in the **Tasks** section:

    - **Search** - Enter a specific action name to find if this action has been used or not.
    - **All Tasks** - Use the **Tasks** drop-down to filter by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.
- **Users with Access** - Displays the names of users that have access to the resource, and is sorted into the following columns:
    - **Not Accessed** - Displays the users who have access to the resource but haven't yet performed an action on the resource.
    - **Accessed by Current Users** - Displays the users who have performed actions on the resource in the last 90 days.
- **Accessed by Transient Users** - An identity that performed an operation on the resource but the identity no longer exists. This identity could have been given temporary access and is most commonly seen with virtual machines.

### How to view usage analytics about active tasks

#### Dashboard view

The **Active Tasks** dashboard provides a high level overview of privileges used by various identities. 

- On the main Usage Analytics page, select **Active Tasks** from the  drop-down list across the top of the screen. 

The dashboard only lists tasks that have been used in the last 90 days. The following components make up the **Active Tasks** dashboard:

- **Users** - This section  displays the total number of users, inactive and active users based on the authorization system selected. For more information, see [How to apply filters for active tasks](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-active-tasks).
- **Tasks** - This section  displays the number of tasks granted to a user, and the total number of unexecuted and executed tasks based on the authorization system selected. For more information, see [How to apply filters for active tasks](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-active-tasks).
- **Resources** - This section  displays how many resources have been accessed by users based on the authorization system selected. For more information, see [How to apply filters for active tasks](cloudknox-product-usage-analytics.md#how-to-apply-filters-for-active-tasks).

### Table view

The following components make up the **Active Tasks** table:

- **Task Name** - Provides the name of the task. 
    - To view more details about the task, click the task name. For more information, see How to use identity explorer for Active Tasks. 

        -  A **Deleted** icon next to the task name means the task is a delete task. 

        - A **High risk task** icon next to the task name means the task is high-risk. 
        - A **Task** icon next to the task name means the task is a normal task.

- **No. of Times Task is Performed** - Captures the number of times the task has been performed by all users, groups, etc.
- **Performed On (Resources)** - The number of resources the task was used on. For more information, see [How to view usage analytics about active resources](cloudknox-product-usage-analytics.md#how-to-view-usage-analytics-about-active-resources).
- **Number of Users** - Displays how many tasks are assigned to a particular user, and is broken into the following columns:
    - **Unexecuted** - Captures the number of users that have access to the task but haven't accessed it.
    - **Executed** - Displays how many of the granted tasks the user has accessed.

### How to apply filters for active tasks

There are many filter options within the **Active Tasks** screen, including filters by **Authorization System**, filters by **User** and filters by **Task**. Filters can be applied in one, two, or all three categories depending on what information the system administrator is looking for. 

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu, click the **Lock** icon on the left  of the page, and then select all applicable systems. 

         The default filter is the first authorization system in the filter list if filters haven't been used before, or the system defaults to the last filtered selection.

       - To automatically select all options for a single authorization system, next to the authorization system name, click **Only**. 

    2. To filter by the selection, click **Apply**. 

- **Filtering by Users**

    You can filter user details by type of user, user role or service used, or by resource.

    1. To filter by user, select the applicable option:
        - **All** - Filters by all existing users regardless of role or services used.
        - **User** - Filters by users only, excluding transient users.
        - **Transient** - Filters by transient users only.
    2. To filter by the selection, click **Apply**. 
    
- **Filtering by Tasks**

    System administrators can filter task details by tasks performed.

    1. Select the applicable radio button option to filter by task:
        - **All** - Filters by all existing tasks a user can perform.
        - **High Risk Tasks** - Filters tasks by high risk, which includes modifying and deleting content.
    2. To filter users who have delete task privileges, under **High Risk Tasks**. click **Delete**. 
    3. To filter by the selection, click **Apply**. 

### How to read the Information Panel for active tasks

- Set the filters and select your Authorization System. Then click the icon at the end of the row to view more information about the active task.

- **Users with Privileges** -  Displays the total number of users who have access to the task, broken into the following categories:
     - **Unexecuted** - The names of users who have access to the task but haven't used the task.
     - **Executed by Current Users** - The names of users who have used the task.
     - **Executed by Transient Users** - The names of the users who can no longer be found in the authorization system, but had performed a task in the last 90 days.
- **Resources** - A list of the resources affected by the tasks performed by the users listed in **Users with Privileges**, **Domain**, **Type**, and **Name**.

## How to view usage analytics about access keys (AWS, Azure, GCP)

### How to read the Access Keys dashboard

The **Access Keys** table provides a high level overview of access key details. On the main Usage Analytics page, select **Access Keys** from the  drop-down list across the top of the screen. 

- To activate the **Access Keys** option from the  drop-down list, select **AWS** from the filter options.

The following components make up the **Access Keys** table:

- **Access Key ID** - Displays the ID number for the access key.
- **Owner** - Displays the name of the owner for a particular access key.
- **Account** - Displays the account name that the owner and access key reside in.
- **Privilege Creep Index** - Captures the incurred risk of owners with access to high-risk privileges and is broken into the following columns:
    - **Index** - Calculates a risk score for the owner of the access key based on the high-risk privileges they have access to and if that privilege has been accessed.
    - **Since** - Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, that is **! High - 130 days**.

         Hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index. 

         For example, hover over **! High - 130 days** to display **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**.

- **Tasks** - Displays how many tasks are assigned to a particular user. Tasks are sorted into the following columns:
    - **Granted** - Captures the number of tasks that have been granted to the owner directly, to the user if part of a group, or based on the AWS role type the user can assume.
    - **Executed** - Displays how many of the granted tasks the owner has executed.
- **Resources** - Displays how many resources a particular owner can access, and is sorted into the following columns:
    - **All** - Captures the number of resources the owner has access to.
    - **Accessed** - Displays how many of the resources the owner has accessed.
- **Access Key Age** -  Displays how many days have passed since the access key was created.

     We recommended that access keys be recycled or renewed every 90 days. If the access key is older than 90 days, the system flags the key in this column with an exclamation point (**!**). Hover over this point to display **Created more than 90 days ago**.

- **Last Used** - Displays the time since the access key was last used.

     If the access key is older than 90 days, the system flags the key in this column with an exclamation point (**!**). Hover over this point to display **Last used more than 90 days ago**.

### How to apply filters for access keys

There are many filter options within the **Access Keys** screen, including filters by **Authorization System**, **Access Keys**, and **Task**. Filters can be applied in one, two, or all three categories depending on what information the system administrator is looking for. 

- **Filtering by Authorization Systems**
    1. To expand the **Authorization systems** menu and select all applicable systems, click the **Lock** icon. 

        > [!NOTE]
        > This feature only applies to AWS. It can be narrowed down by the authorization system.

    2. To filter by the selection, click **Apply**. 

- **Filtering by Access Keys**

    System administrators can filter access key details by **Key Status**, **Key Activity Status**, and **Key Age**.

    1. Select the applicable radio button option to filter by user:
        - **Key Status** - Choose **All**, **Active**, or **Inactive**.
        - **Key Activity Status** - Choose **All**, **Used <90 days**, **Used <90 - 365 days**, **Used >365 days**, or **Not Used**.
        - **Key Age** - Choose  **All**, **<90 days**, **90 - 180 days**, or **>180 days**
    2. To filter by the selection, click **Apply**. 

         The top of the screen displays which filters were applied.
    3. To  remove all filters, click **X**.

- **Filtering by Tasks**

    System administrators can filter user details by tasks performed.

    1. To filter by task, select the applicable option:
        - **All** - Filters by all existing tasks a user can perform.
        - **High Risk Tasks** - Filters tasks by high risk, which includes modifying and deleting content.
    2. To filter users who have delete task privileges, under **High Risk Tasks**. click **Delete**. 
    3. To filter by the selection, click **Apply**. 

### How to read Information Panel for access keys

Once filters are set and Authorization System is selected, click the icon at the end of the row to view more information about the access key.

- **Tasks** -  Displays unused and used tasks for each access key. The tasks are grouped by service and can be expanded to view the task, application, or service names.

    A service can  display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**) and if hovered over displays **None of the tasks in this group have been used in the last 90 days**. 

    A task can move from **Used** to **Unused** if that task hasn't been touched for more than 90 days.

    You can do the following actions in the **Tasks** section:

    - **Search** - In the **Search** box, system administrators can type a specific task name and find how many of those tasks have been unused or used.
    - **All Tasks** - The Tasks drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.
- **Access Key Info** - Lists **Last Used Service**, **Last Used Region**, **Created On**, and a graph of **Access Key Usage (Over 3 Months in PDT)** which details what times and days in which the access key was used.

## How to view usage analytics about serverless functions (AWS Only)

### How to read the Serverless Functions dashboard

The **Serverless Functions**, or lambda table, provides a high level overview of serverless function details. On the main Usage Analytics page, select **Serverless Functions** from the  drop-down list across the top of the screen. **

To activate the **Access Keys** option, select **AWS** from the filter options drop-down list. The following components make up the **Serverless Functions** table:

- **Function Name** - Displays the name of the function.
- **Domain/Account** - Displays the authorization system that lambda resides in
- **Privilege Creep Index** - Captures the incurred risk of lambda function with access to high-risk privileges and is broken into the following columns:
    - **Index** - Calculates a risk score for the lambda function based on the high-risk privileges they have access to and if that privilege has been accessed.
    - **Since** - Indicates if the user's PCI is high, medium, or low based on the past 30 days. A user with a high PCI exceeding 30 days is denoted with an exclamation point (**!**), and provides the number of days the user has been marked at a high level, that is **! High - 130 days**.

        You can hover over the information in this column for specific details on how long the user has had a high, medium, or low privilege creep index.

        For example, hovering over **! High - 130 days** will display **The User's privilege creep index has been High since 14 February 2020, 1:37 PM in the authorization system**.

- **Tasks** - Displays how many tasks are assigned to a particular lambda function, and is broken into the following columns:
    - **Granted** - Captures the sum of the unique tasks that have been granted to all versions of the lambda function through the execution roles, meaning a function can have two roles with seven tasks each. If both roles have a delete task, the delete task will only be counted once.
    - **Executed** - Displays how many of the granted tasks the lambda function has executed through any version of the function.
- **Resources** - Displays how many resources a particular lambda function can access, and is broken into the following columns:
    - **All** - Captures the number of resources the lambda function has access to.
    - **Accessed** - Displays how many of the resources the lambda function has accessed through any version of the function.
- **Last Activity On** - Displays the date and time the lambda function last performed any type of task in the authorization system. 
  
  If the lambda function hasn't yet been active or hasn't been active for more than 90 days, a dash (**-**) displays.

### How to apply filters to serverless functions

The only filter option in the **Serverless Functions** screen is **Authorization System.** The only authorization system available is AWS, but it can be narrowed down by console. 

1. To expand the **Authorization systems** menu, click the **Lock** icon on the left side of the page. Then select all applicable consoles. 
2. To filter by the selection, click **Apply**. 

    The top of the screen displays a list of filters that were applied.
3. To remove all filters, click **X**.


### Using predefined tags

You can apply the following set of predefined tags:

- **ck_attest** - This tag is used to attest an identity. When selected, the value is automatically filled in with the date and time the tag was applied, and the user who applied the tag.
- **ck_exclude_from_pci** - Any identity with this tag is excluded from the account level PCI score.
- **ck_exclude_from_reports** - Any identity with this tag is excluded from reports.
- **ck_primary_owner** - Used for service accounts to indicate the primary owner of the service account.
- **ck_secondary_owner** - Used for service accounts to indicate the secondary owner of the service account

### How to read the Information Panel for serverless functions

- Set your filters and select your Authorization System. Then click the icon at the end of the row to view more information about the serverless function.

- **Tasks** -  Displays unused and used tasks for each lambda function. The tasks are grouped by service and can be expanded to view the task, application, or service names.

     A service can display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**). If you hover over it, it displays **None of the tasks in this group have been used in the last 90 days**.

    You can perform the following actions in the **Tasks** section:

    - **Search** - In the **Search** box, enter a specific task name and find how many of those tasks have been unused or used.
    - **All Tasks** - The Tasks drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

    **Version** - The right side of the panel displays serverless function **Version** (several versions can be listed, but the latest are listed first), **Execution Role** (the role assigned to the serverless function), and **Alias**.

### How to view Role/Policy details

1. In the **Execution Role** column, click **View json.**

     The **Role Summary** screen opens and lists the **Role Name** and **Role Type**. The **Policies** tab is selected by default.

2. Under **Policies**, a list will display showing all the policies directly attached to the serverless function. 

     To expand and read the details of the policy, click the icon.

3. Under **SCP** (Service Control Policy), three columns are displayed: **Policy Name**, **Source Name**, and **Source**. 

     The purpose of the SCP section is to provide permission boundaries on each policy. 

     To expand and read the details of the policy, click the icon in the **Policy Name** column.

4. To view details on who can assume the role being viewed, click the **Trusted Entities** tab.

## How to use the CloudKnox explorers

The CloudKnox explorers provide more information about an identity, including entitlements, identity activity, resources the identity has touched, and tasks the identity has performed.

### How to search and access the CloudKnox explorers

1. To perform a general search and open the explorer, click **Search** at the upper right of the CloudKnox home screen.

2. Enter a user, role, resource, or task name and select the appropriate option.

3. From the **Search**  drop-down list, you can switch from **All** to **Resources**, **Tasks**, **Users**, or **AWS Roles**.

### How to use the User Explorer

1. To access the **User Explorer**, select an authorization system from the left side panel, select **Groups**, and then select **User**. 
For more information, see How to apply filters to users. 

2. Under the **Username** column, click the username to expand details within the last 90 days. The default view is the **User Info** tab.
3. The **User Info** tab displays the high risk activities performed in the last 90 days with the following details:
    - **User Info** - This section displays the following details:
        - **User Groups** - Lists any groups the user is in.
        - **Last Login** (AWS/VMWare users only) - Displays the date the user was last active, the Client or browser the user last used, and the user's IP address from which they logged in.
    - **Access Key** (Local AWS users only) - The following information is given about access keys:
        - **Access Key ID** - The ID for the access key.
        - **Last Rotated On** - The date and time since the access key was created.

             If the access key was created more than 90 days ago, it will be noted with an exclamation point (**!**)

        - **Last Used On** - The date the access key was last used.
        - **Last Used Region** -  Displays the region in which the AWS data center is located.
        - **Last Used Service** - The name of the service accessed or action performed by using the access key.
    - **Tags** (Local AWS users only) - A name and value pair that's attached to the identity.
    - **Tasks** -  Displays unused and used tasks for the user. The tasks are grouped by service and can be expanded to view the task, application, or service names.

         A service can display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**). If hovered over, it displays **None of the tasks in this group have been used in the last 90 days**.

        You can perform the following actions in the **Tasks** section:

        - **Search** - In the **Search** box, system administrators can type a specific task name and find how many of those tasks have been unused or used.
        - **All Tasks** - The Tasks drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

    - **AWS**
        - **Policies/Roles** -  Displays the policies that apply to a user.
            - **Policy Name** - Displays the name of the policy.

              - To display the full details of the policy, next to the policy name, click **View**.

            - **Source Name** - The name of the source, that is, admin.
            - **Source** - Displays the ways in which an identity acquires access to a policy.
        - **Permission Boundary** (AWS only) - A constraint that an admin can place on a user to restrict certain accesses to policies.

             - To display the full details of the policy, next to the policy name, click **View**.

        - **SCPs** (Service Control Policy) - Service Control Policies constraint the actions that a user can perform. Unlike Permission Boundaries, they apply to the whole account and are applied in a hierarchical manner to further restrict permissions starting with the **Root** source and moving to **Organizational Unit** and **Account**.

             - To display the full details of the policy, next to the policy name, click **View**.

    - **Azure/GCP/VCENTER**
        - **Policies/Roles** -  Displays the roles that apply to a user.
            - **Name** - Displays the name of the role.
            - **Resource** - Displays the name of the resource.
            - **Type** - Displays the type of resource, that is, subscriptions.
            - **Source Name** - The name of the source, that is, admin.
            - **Source Type** - Displays the role that applies to the user, that is source could be **Group**, meaning the user belongs to a group in which the role applies.
4. To view which roles a user can assume with the following details, click the **Access Info (AWS Only)** tab. This applies to AWS users only.

    - **Roles Available** - Lists all the roles available to the user to assume.
    - **Roles Accessed** - Lists the roles the user has assumed.

      - To search for a specific role available to the user or the user has accessed, click **Search**.

5. To view the activity performed by the user with the following details, click the **Activity** tab:
    - **High Risk Activity** - Displays the high risk activities performed in the last 90 days.
        - **Username** – Displays the name of the user who performed the task.
        - **Resource Name** – Displays the name of the resource in which the task was executed.
        - **Resource Type** – Displays the type of resource being touched, for example, AWS.
        - **Start Date** – Displays when the task was executed.
        - **IP Address** – Displays the IP address of the user, if applicable.

6. To view all login activity performed by the user with the following details, click the **Login Details** tab:
    - **Date Occurred On** - The date on which the user logged in.
    - **IP Address** - The IP address from which the user logged in.
    - **Access Agent** - The browser or browser agent from which the user accessed their account.
    - **Status** - Whether the login was successful or not.
    - **Authorization System** - The authorization system from which the user performed the activity.

     In the  drop-down list next to **Login**, the default view is **Activity – Tasks**. 

    - Select the  drop-down list to select from the following options:
        - **Graph View - Login** - Displays a graph view of how many times the user logged in, how many different clients were used, and how many different IP addresses were used.
        - **Table View - IP Addresses**
            - **IP Address** - Displays the IP address.
            - **No. of Times Logged In** - Displays how many times the user logged in under the specific IP address.
        - **Table View - Access Agents**
            - **Access Agent** - Displays the name of the access agent.
            - **No. of Times Logged In** - Displays how many times the user logged in to the access agent.
7. To view the resources the user has accessed with the following details, click the **Resources** tab:
    - **Resource Name** – Displays the name of the resource affected by the task.
    - **Resource Type** – Displays the type of resource being touched, for example, iam:role.
    - **No. of Times Accessed** – Displays how many times the resource was accessed.
    - **All Tasks** – Displays the number of tasks available to the user total.
    - **High Risk Tasks** – Displays the number of high risk tasks the user has access to total.

     The right side of the screen lists the names of the tasks and high risk tasks used on the specific resource listed.

    The default view in the  drop-down list next to **Resources** is **Accessed – Table**. 

    - Select the  drop-down list to select from the following options:
        - **Graph View**
            - Displays a graph view of how many resources have access, and how many resources were accessed in the last 90 days.

8. To view the tasks the user has executed with the following details, click the **Tasks** tab:
    - **Task Name** – Displays the name of the task.
    - **Last Executed On** – Displays the date the task was last executed by the user.
    - **No. of Resources used** – Displays the number of resources that were affected when this task was executed.
    - **No. of Resources with Access** – Displays the number of resources on which you can do this task.

     The right side of the screen lists the names of the resources that were accessed  on the specific task listed.

     The default view in the  drop-down list next to **Tasks** is **Tasks – Table**. Select the  drop-down list to change the view.

    - Select the  drop-down list to select from the following options:
        - **Graph View**
            - Displays a graph view of how many tasks have been granted, how many tasks have been executed, how many tasks are scheduled, and how many tasks are alarm tasks.
        - **Table View - Scheduled Tasks**
            -  Displays a detailed view of tasks that have been scheduled.
        - **Table View - Alarms**
            -  Displays a detailed view of tasks that are considered alarm tasks.

9. To view all the policies the user has access to across all accounts with the following details, click the **All Permissions** tab:

    - **AWS**
        - **Account** - Displays the name of the account.
        - **Policy Name** - Displays the name of the policy.

            - To display the full details of the policy, next to the policy name,click **View**.
        - **Source Name** - The name of the source, for example, *admin*.
        - **Source** - Displays the type of policy that applies to the user, for example, the source could be **Group**, meaning the user belongs to a group to which the policy applies.
    - **Azure/GCP/VCENTER**
        - **Subscription** (Azure only) - Displays the name of the authorization system account.
        - **Project** (GCP only) - Displays the name of the project.
        - **Account** (VCENTER only) - Displays the name of the account.
        - **Name** - Displays the name of the subscription.
        - **Resource** - Displays the name of the resource.
        - **Type** - Displays the type of subscription applied to the identity.
        - **Source Name** - Displays the name of the source.
        - **Source Type** - Displays the type of source applied to the identity.

### How to use the Role Explorer (AWS Only)

1. To access the **Role Explorer**, choose an authorization system. 

2. Select **Groups**, and then select **Role / App / Service a/c**. For more information, see How to apply filters to users. 

3. To expand details within the last 90 days, under the **Username** column, click the username. The default view is the **Role Info** tab.
     
4. The **Role Info** tab displays the following details:
    - **Tasks** -  Displays unused and used tasks for the individual user, application, or service account. The tasks are grouped by service and can be expanded to view the task, application, or service names.

         A service can appear in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**) and if you hover over it, it displays **None of the tasks in this group have been used in the last 90 days**.

        You can do the following actions in the **Tasks** section:

        - **Search** - In the **Search** box, system administrators can type a specific task name and find how many of those tasks have been unused or used.
        - **All** - The **Tasks** drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.
    - **Policies** -  Displays the policies attached to the role.
    - **Permission Boundary** - This is a constraint that an admin can place on a role to restrict certain accesses to policies.

         - To display the full details of the policy, click **View** next to the policy name.

    - **SCPs** (Service Control Policy) - Service Control Policies constrains the actions that a role can perform. Unlike Permission Boundaries, they apply to the whole account and are applied in a hierarchical manner to further restrict permissions starting with the **Root** source and moving to **Organizational Unit** and **Account**,
        - **Policy Name** - Displays the name of the policy,

             - To display the full details of the policy, click **View** next to the policy name.

        - **Source Name** - The name of the source, for example, admin.
        - **Source** - Displays the ways in which an identity acquires access to a policy.
    - **Trusted Entities** -  Displays trusted entities attached to the role.

5. To view which roles a user can assume with the following details, click the **Access Info** tab:
    - **Roles Available** - Lists all the roles available to the user to assume.
    - **Roles Accessed** - Lists the roles the user has assumed.

      - To search for a specific role the user has available or has accessed, click **Search**.

6. To view the activity performed by the role with the following details, click the **Activity** tab:
    - **High Risk Activity** - Displays the high risk activities performed in the last 90 days.
        - **Role** – Displays the name of the role who performed the task.
        - **Resource Name** – Displays the name of the resource on which the task was executed on.
        - **Resource Type** – Displays the type of resource being touched, for example, iam:policy.
        - **Start Date** – Displays when the task was executed.
        - **IP Address** – Displays the IP address of the user, if applicable.

7. To view the resources the role has accessed with the following details, click the **Resource** tab:
    - **Resource Name** – Displays the name of the resource affected by the task performed by the role.
    - **Resource Type** – Displays the type of resource being touched, for example, iam:policy.
    - **No. of Times Accessed** – Displays how many times the resource was accessed.
    - **All Tasks** – Displays the number of tasks available to the role total.
    - **High Risk Tasks** – Displays the number of high risk tasks the role has access to total.

      -  To view the names of the tasks and high risk tasks used on the specific resource listed, click the icon to expand details.

8. To view the tasks the role has executed with the following details, click the **Tasks** tab:
    - **Task Name** – Displays the name of the task.
       - To expand details on the task and view resources associated with the task, click the icon. 
        - To expand details about the resource, click the icon next to **Resources**.

    - **Last Executed On** – Displays the date the task was last executed by the user.
    - **No. of Resources used** – Displays the number of resources that were affected when this task was executed.
    - **No. of Resources with Access** – Displays the number of resources with access to the task.

### How to use the Resource Explorer

1. To access the **Resource Explorer**, select **Active Resources** from the  drop-down list, then select an authorization system. **Resource**. For more information, see How to apply filters to users. 

2. To expand details within the last 90 days, under the **Resource Name** column, click the resource. 

3. The default view is the **Access Graph** tab. It displays the following details:
    - **Identities** – Displays the name of the identity that has access to the resource.
    - **Policies/Roles** – Displays the name of the policy  or the role that gave the identity access to the resource.

         - To view the full details of the policy or role, click **View**.

    - **Sources** (AWS Only) – Displays the ways in which an identity acquires access to a policy. The three ways in which the policy is accessed is defined below:
        - **Direct** –  Displays that a policy was directly attached to a particular identity.
           - To view the full details of the policy or role, click **View**.
        - **Roles** –  Displays that the user acquired access through a role that the identity can assume.

        - **Group** –  Displays that the identity is part of a group to which the policy is attached.
    - **Scope** (Azure/GCP/VCENTER) - Displays the name of the project with access to the resource.

        Each column in the **Access Graph** view has a **Search** bar and a **Filter** button with various options available from the  drop-down list.

         For each column listed in the **Access Graph** tab, more details can be viewed by clicking the name in the **Name** column. This view  displays a detailed diagram on how the user acquired access to the resource.

4. (AWS only) To view tags assigned to the resource, click the **Info** tab.
5. To display all high risk resources used within the last 90 days with the following details, click the **Activity** tab:
    - **Username** – Displays the name of the user who accessed the resource.
    - **Resource Name** – Displays the name of the resource in which the task was executed on.
    - **Resource Type** – Displays the type of resource being touched, for example, AWS.
    - **Start Date** – Displays when the task was executed.
    - **IP Address** – Displays the IP address of the user, if applicable.

6. To display details about the users, including the following details, click the **Users** tab:
    - **Username** – Displays the name of the user who accessed the resource.
    - **No.** **of Times Executed** – Displays how many times the user accessed the resource.
    - **No.** **of Resources Executed** – Displays how many resources were affected by the task.
    - **Last Executed On** – Displays the last date in which the user accessed the resource.

      - To change the view, select the  drop-down list next to **Users**. The default is view is **Tasks  – Table**.

    - To select from the following options, select the  drop-down list:
        - **Graph View** - Displays a graph view of how many users have access to the resource, how many resources haven't been accessed, and how many have been accessed.

7. (Azure/GCP/VCENTER only) To display details about tasks, including the following details, click the **Tasks** tab:
    - **Task Name** - Displays the name of the task
    - **No. of Times Executed** - Displays how many times the task was executed
    - **No. of Users** - Displays the number of users with access to the task.
    - **Last Executed On** - Displays the last date in which the task was accessed.

      - To change the view, click the drop-down list next to **Users**. The default is view is **Tasks  – Table**.

    -  To select from the following options, click the  drop-down list:
        - **Graph View**
            - Displays a graph view of how many tasks have been executed and how many tasks are scheduled
        - **Table View - Scheduled Tasks**
            -  Displays a detailed view of tasks that have been scheduled

8. (AWS only) To display security details about the resources, including the following details, click the **Security Info** tab:

     The **Security Info** tab is specific to bucket resources. The resource type can be found at the top of the screen, for example, **Resource Type: s3 bucket**.

    - **Block Public Access** –  Displays the block public access settings for a specified bucket.
    - **Access Control List** – Lists all identities that can access to the bucket.
    - **Bucket Policy** – Displays which users can access the bucket via a policy.

9. To view a different authorization system account, click the drop-down from the right side of the screen.
10. To export the results in comma-separated values (CSV) file format, click **Export**.

### How to use the Task Explorer

1. To access the **Task Explorer**, select **Active Tasks** from the  drop-down list, and select an authorization system. For more information, see How to apply filters to users.

    - To expand details within the last 90 days, in the **Task Name** column, click the task. 
2. The default view is the **Activity** tab.The **Activity** tab displays the high risk activities performed in the last 90 days with the following details:
    - **Username** – Displays the name of the user who performed the task.
    - **Resource Name** – Displays the name of the resource in which the task was executed.
    - **Resource Type** – Displays the type of resource being touched, for example, iam:policy.
    - **Start Date** – Displays when the task was executed.
    - **IP Address** – Displays the IP address of the user, if applicable.
3. To display details about the users, including the following details, click the **Users** tab:
    - **Username** – Displays the name of the user who performed the task.
    - **No.** **of Times Executed** – Displays how many times the user executed the task.
    - **No.** **of Resources Accessed** – Displays how many resources were acted upon by the task.
    - **Last Executed On** – Displays the last date in which the user executed the task.

      - In the  drop-down list next to **Users**, the default view is **Tasks – Table**.  
      - To see a graphical view of the number of times a user executed a task, select **Executed – Graph**.
4. To display details about the resources, including the following details, click the **Resources** tab:
    - **Resource Name** – Displays the name of the resource affected by the task.
    - **Resource Type** – Displays the type of resource being touched, for example, **AWS**.
    - **No. of Times Accessed** – Displays how many times the resource was accessed.
    - **No**. **of Users** – Displays the number of users that performed the task.
    - **Last Executed On** – Displays the last date on which the user executed the task.
5. On the down menu next to **Resources**, the default view is **Tasks – Table**. To see a graph view of how many resources have been accessed, select **Accessed – Graph** .
6. To change to another authorization system account, click the drop-down on the right side of the screen.

### How to use the Account Explorer

The **Account Explorer** displays all the identities - users, roles, EC2 instances, and Lambda Functions - that can access the selected account from an external account.

1. To access the **Account Explorer**:
    - To choose an authorization system from the left-side panel, click the **Lock** icon. Select an AWS account. For more information, see How to apply filters to users. 
      - Under the **Domain/Account** column, click the domain or account name to access **Account Explorer**. The default view is the **Cross Account** **Users** tab.
       - Or, click the **Data Collectors** icon on the top menu. Choose the **Authorization Systems** tab and click the **Name** of any AWS accounts.
2. The **Cross Account** **Users** tab displays which identities can access the specified account, with the following details:

     The **Account Explorer** displays identities that aren't part of the  specified AWS account, but have permission to access the account through various roles.

      - To export the data in comma-separated values (CSV) file format, click the **Export** button.

      - To view **Account Explorer** for other accounts, click the authorization system drop-down on the right side and choose one of the available accounts.

    - **Roles that Provide Access** - Lists the roles that provide access to other accounts through the Trusted Entities policy statement.
      - To view the**Role Summary** which provides the following details, to the right of the role name, click **View**:
            - **Policies** - Lists all the policies attached to the role.
            - **Trusted Entities** - Displays the identities from external accounts that can assume this role.
        -  To view all the identities from various accounts that can assume this role, click the icon to the left of the role name.
        - To view the role definition, to the right of the role name, click **View**.
        - To view a diagram of all the identities that can access the specified account and through which role(s), click on the role name.

         If CloudKnox is monitoring the external account, specific identities from that account that can assume this role will be listed. Otherwise, the identities declared in the **Trusted Entity** section will be listed.

    - **Connecting Roles** tab lists per account the following roles:
        - Direct roles that are trusted by the account role.
        - Intermediary roles that aren't directly trusted by the account role but are assumable by identities through role-chaining.
        - To view all the roles from that account that are used to access the specified account, click the icon to the left of the account name.
            - To view the trusted identities declared by the role, click the icon to the left of the role name.

                The trusted identities for the role will be listed only if the account is being monitored by CloudKnox.

            - To view the role definition, to the right of the role name, click **View**.

                 When the icon is clicked to expand details, a search bar is available. You can use it to search for specific roles.

    - **Identities with Access** - Lists the identities that come from external accounts.
        - To view all the identities from that account can access the specified account, click the icon to the left of the account name.
        - For EC2 instances and Lambda Functions, to view **Role Summary**, which displays the details noted above, click **View** to the right of the identity name.
        - To view a diagram of the ways in which the identity is able to access the specified account and through which role(s), click the identity name.

<!---## Next steps--->