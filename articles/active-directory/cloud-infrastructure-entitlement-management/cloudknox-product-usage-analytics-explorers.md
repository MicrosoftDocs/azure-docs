---
title: Microsoft CloudKnox Permissions Management - The Usage Analytics explorers
description: How to use the Usage Analytics explorers in Microsoft CloudKnox Permissions Management.
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

# Microsoft CloudKnox Permissions Management - The Usage Analytics explorers

The CloudKnox **Usage Analytics** feature contains details about identities, resources, and tasks that you can use make informed decisions about granting privileges, and reducing risk on unused privileges.

- **Users**: Tracks assigned privileges and usage of various identities.
- **Groups**: Tracks assigned privileges and usage of the group and the group members.
- **Active Resources**: Tracks resources that have been used in the last 90 days.
- **Active Tasks**: Tracks tasks that have been performed in the last 90 days.
- **Access Keys**: Tracks the privilege usage of access keys for a given user.
- **Serverless Functions**: Tracks assigned privileges and usage of the serverless functions.

The Microsoft CloudKnox Permissions Management **Usage Analytics** dashboard allows system administrators to collect, analyze, report on, and visualize data about all identity types.

This topic describes how to use the Usage Analytics explorers.

## The Usage Analytics explorers

The CloudKnox explorers provide more information about an identity, including entitlements, identity activity, resources the identity has touched, and tasks the identity has performed.

### Access the Usage Analytics explorers

1. To perform a general search and open the explorer, select **Search** at the upper right of the CloudKnox home screen.

2. Enter a user, role, resource, or task name and select the appropriate option.

3. From the **Search**  drop-down list, you can switch from **All** to **Resources**, **Tasks**, **Users**, or **AWS Roles**.

## The User Explorer

1. To access the **User Explorer**, select an authorization system from the left side panel, select **Groups**, and then select **User**. 
2. Under the **Username** column, select the username to expand details within the last 90 days. The default view is the **User Info** tab.
3. The **User Info** tab displays the high risk activities performed in the last 90 days with the following details:
    - **User Info**: This section displays the following details:
        - **User Groups**: Lists any groups the user is in.

        - **Last Login** (AWS/VMWare users only) - Displays the date the user was last active, the Client or browser the user last used, and the user's IP address from which they logged in.
    - **Access Key** (Local AWS users only) - The following information is given about access keys:
        - **Access Key ID**: The ID for the access key.
        - **Last Rotated On**: The date and time since the access key was created.

             If the access key was created more than 90 days ago, it will be noted with an exclamation point (**!**)

        - **Last Used On**: The date the access key was last used.
        - **Last Used Region**:  Displays the region in which the AWS data center is located.
        - **Last Used Service**: The name of the service accessed or action performed by using the access key.
    - **Tags** (Local AWS users only) - A name and value pair that's attached to the identity.
    - **Tasks**:  Displays unused and used tasks for the user. The tasks are grouped by service and can be expanded to view the task, application, or service names.

         A service can display in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**). If hovered over, it displays **None of the tasks in this group have been used in the last 90 days**.

        You can perform the following actions in the **Tasks** section:

        - **Search**: In the **Search** box, system administrators can type a specific task name and find how many of those tasks have been unused or used.
        - **All Tasks**: The Tasks drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.

    - **AWS**
        - **Policies/Roles**:  Displays the policies that apply to a user.
            - **Policy Name**: Displays the name of the policy.

              - To display the full details of the policy, next to the policy name, select **View**.


            - **Source Name**: The name of the source, that is, admin.
            - **Source**: Displays the ways in which an identity acquires access to a policy.
        - **Permission Boundary** (AWS only) - A constraint that an admin can place on a user to restrict certain accesses to policies.

             - To display the full details of the policy, next to the policy name, select **View**.

        - **SCPs** (Service Control Policy) - Service Control Policies constraint the actions that a user can perform. Unlike Permission Boundaries, they apply to the whole account and are applied in a hierarchical manner to further restrict permissions starting with the **Root** source and moving to **Organizational Unit** and **Account**.

             - To display the full details of the policy, next to the policy name, select **View**.

    - **Azure/GCP/VCENTER**

        - **Policies/Roles**:  Displays the roles that apply to a user.
            - **Name**: Displays the name of the role.
            - **Resource**: Displays the name of the resource.
            - **Type**: Displays the type of resource, that is, subscriptions.
            - **Source Name**: The name of the source, that is, admin.
            - **Source Type**: Displays the role that applies to the user, that is source could be **Group**, meaning the user belongs to a group in which the role applies.
4. To view which roles a user can assume with the following details, select the **Access Info (AWS Only)** tab. This option applies to AWS users only.

    - To view which roles are available to the user, select **Roles Available**.
    - To view which roles the user has assumed, select **Roles Accessed**.
    - To search for a role available to the user or that the user has accessed, select **Search**.

5. To view the activity performed by the user with the following details, select the **Activity** tab:
    - **High Risk Activity**: Displays the high risk activities performed in the last 90 days.
        - **Username** – Displays the name of the user who performed the task.
        - **Resource Name** – Displays the name of the resource in which the task was executed.
        - **Resource Type** – Displays the type of resource being touched, for example, AWS.
        - **Start Date** – Displays when the task was executed.
        - **IP Address** – Displays the IP address of the user, if applicable.

6. To view all login activity performed by the user with the following details, select the **Login Details** tab:
    - **Date Occurred On**: The date on which the user logged in.
    - **IP Address**: The IP address from which the user logged in.
    - **Access Agent**: The browser or browser agent from which the user accessed their account.
    - **Status**: Displays if the login was successful or unsuccessful.
    - **Authorization System**: The authorization system from which the user performed the activity.

     In the  drop-down list next to **Login**, the default view is **Activity – Tasks**. 

    - Select the  drop-down list to select from the following options:
        - **Graph View - Login**: Displays a graph view of how many times the user logged in, how many different clients were used, and how many different IP addresses were used.
        - **Table View - IP Addresses**
            - **IP Address**: Displays the IP address.
            - **No. of Times Logged In**: Displays how many times the user logged in under the specific IP address.
        - **Table View - Access Agents**

            - **Access Agent**: Displays the name of the access agent.
            - **No. of Times Logged In**: Displays how many times the user logged in to the access agent.
7. To view the resources the user has accessed with the following details, select the **Resources** tab:
    - **Resource Name** – Displays the name of the resource affected by the task.
    - **Resource Type** – Displays the type of resource being touched, for example, iam:role.
    - **No. of Times Accessed** – Displays how many times the resource was accessed.
    - **All Tasks** – Displays the number of tasks available to the user total.
    - **High Risk Tasks** – Displays the number of high risk tasks the user has access to total.

     The right side of the screen lists the names of the tasks and high risk tasks used on the specific resource listed.

    The default view in the  drop-down list next to **Resources** is **Accessed – Table**. 

    - Select the  drop-down list to select from the following options:
        - **Graph View**
            - Displays a graph view of how many resources have access, and how many resources were accessed in the last 90 days.

8. To view the tasks the user has executed with the following details, select the **Tasks** tab:

    - **Task Name** – Displays the name of the task.
    - **Last Executed On** – Displays the date the task was last executed by the user.
    - **No. of Resources used** – Displays the number of resources that were affected when this task was executed.
    - **No. of Resources with Access** – Displays the number of resources on which you can do this task.

     The right side of the screen lists the names of the resources that were accessed  on the specific task listed.

     The default view in the  drop-down list next to **Tasks** is **Tasks – Table**. Select the  drop-down list to change the view.

    - Select the  drop-down list to select from the following options:
        - **Graph View**
            - Displays a graph view of how many tasks have been granted, how many tasks have been executed, how many tasks are scheduled, and how many tasks are alarm tasks.
        - **Table View - Scheduled Tasks**
            -  Displays a detailed view of tasks that have been scheduled.
        - **Table View - Alarms**
            -  Displays a detailed view of tasks that are considered alarm tasks.

9. To view all the policies the user has access to across all accounts with the following details, select the **All Permissions** tab:

    - **AWS**
        - **Account**: Displays the name of the account.
        - **Policy Name**: Displays the name of the policy.

            - To display the full details of the policy, next to the policy name,select **View**.

        - **Source Name**: The name of the source, for example, *admin*.
        - **Source**: Displays the type of policy that applies to the user, for example, the source could be **Group**, meaning the user belongs to a group to which the policy applies.

    - **Azure/GCP/VCENTER**
        - **Subscription** (Azure only) - Displays the name of the authorization system account.
        - **Project** (GCP only) - Displays the name of the project.
        - **Account** (VCENTER only) - Displays the name of the account.
        - **Name**: Displays the name of the subscription.
        - **Resource**: Displays the name of the resource.
        - **Type**: Displays the type of subscription applied to the identity.
        - **Source Name**: Displays the name of the source.
        - **Source Type**: Displays the type of source applied to the identity.

## The Role Explorer (Available in AWS Only)

1. To access the **Role Explorer**, choose an authorization system. 
2. Select **Groups**, and then select **Role / App / Service a/c**. 
3. To expand details within the last 90 days, under the **Username** column, select the username. The default view is the **Role Info** tab.
4. The **Role Info** tab displays the following details:
    - **Tasks**:  Displays unused and used tasks for the individual user, application, or service account. The tasks are grouped by service and can be expanded to view the task, application, or service names.

         A service can appear in both the **Unused** and **Used** columns, depending on when it was accessed. If none of the tasks have been used in a service, there will be an exclamation point (**!**) and if you hover over it, it displays **None of the tasks in this group have been used in the last 90 days**.

        You can do the following actions in the **Tasks** section:

        - **Search**: In the **Search** box, system administrators can type a specific task name and find how many of those tasks have been unused or used.
        - **All**: The **Tasks** drop-down can be filtered by **All Tasks**, **High-Risk Tasks**, or **Delete Tasks**.
    - **Policies**:  Displays the policies attached to the role.
    - **Permission Boundary**: This is a restriction that an admin can place on a role to restrict certain accesses to policies.


         - To display the full details of the policy, select **View** next to the policy name.

    - **SCPs** (Service Control Policy) - Service Control Policies constrains the actions that a role can perform. Unlike Permission Boundaries, they apply to the whole account and are applied in a hierarchical manner to further restrict permissions starting with the **Root** source and moving to **Organizational Unit** and **Account**,
        - **Policy Name**: Displays the name of the policy,

             - To display the full details of the policy, select **View** next to the policy name.

        - **Source Name**: The name of the source, for example, admin.
        - **Source**: Displays the ways in which an identity acquires access to a policy.
    - **Trusted Entities**:  Displays trusted entities attached to the role.

5. To view which roles a user can assume with the following details, select the **Access Info** tab:

    - **Roles Available**: Lists all the roles available to the user to assume.
    - **Roles Accessed**: Lists the roles the user has assumed.
    - To search for a specific role the user has available or has accessed, select **Search**.

6. To view the activity performed by the role with the following details, select the **Activity** tab:

    - **High Risk Activity**: Displays the high risk activities performed in the last 90 days.
        - **Role** – Displays the name of the role who performed the task.
        - **Resource Name** – Displays the name of the resource on which the task was executed on.
        - **Resource Type** – Displays the type of resource being touched, for example, iam:policy.
        - **Start Date** – Displays when the task was executed.
        - **IP Address** – Displays the IP address of the user, if applicable.

7. To view the resources the role has accessed with the following details, select the **Resource** tab:
    - **Resource Name** – Displays the name of the resource affected by the task performed by the role.
    - **Resource Type** – Displays the type of resource being touched, for example, iam:policy.
    - **No. of Times Accessed** – Displays how many times the resource was accessed.
    - **All Tasks** – Displays the number of tasks available to the role total.
    - **High Risk Tasks** – Displays the number of high risk tasks the role has access to total.

      -  To view the names of the tasks and high risk tasks used on the specific resource listed, select the icon to expand details.

8. To view the tasks the role has executed with the following details, select the **Tasks** tab:

    - **Task Name** – Displays the name of the task.

       - To expand details on the task and view resources associated with the task, select the icon. 
       - To expand details about the resource, select the icon next to **Resources**.

    - **Last Executed On** – Displays the date the task was last executed by the user.
    - **No. of Resources used** – Displays the number of resources that were affected when this task was executed.
    - **No. of Resources with Access** – Displays the number of resources with access to the task.


## The Resource Explorer

1. To access the **Resource Explorer**, select **Active Resources** from the  drop-down list, then select an authorization system. **Resource**. 
2. To expand details within the last 90 days, under the **Resource Name** column, select the resource. 

3. The default view is the **Access Graph** tab. It displays the following details:
    - **Identities** – Displays the name of the identity that has access to the resource.
    - **Policies/Roles** – Displays the name of the policy  or the role that gave the identity access to the resource.

         - To view the full details of the policy or role, select **View**.

    - **Sources** (AWS Only) – Displays the ways in which an identity acquires access to a policy. The three ways in which the policy is accessed is defined below:
        - **Direct** –  Displays that a policy was directly attached to a particular identity.
           - To view the full details of the policy or role, select **View**.
        - **Roles** –  Displays that the user acquired access through a role that the identity can assume.
        - **Group** –  Displays that the identity is part of a group to which the policy is attached.
    - **Scope** (Azure/GCP/VCENTER) - Displays the name of the project with access to the resource.

        Each column in the **Access Graph** view has a **Search** bar and a **Filter** button with various options available from the  drop-down list.

        For each column listed in the **Access Graph** tab, more details can be viewed by selecting the name in the **Name** column. This view  displays a detailed diagram on how the user acquired access to the resource.

4. (AWS only) To view tags assigned to the resource, select the **Info** tab.
5. To display all high risk resources used within the last 90 days with the following details, select the **Activity** tab:
    - **Username** – Displays the name of the user who accessed the resource.
    - **Resource Name** – Displays the name of the resource in which the task was executed on.
    - **Resource Type** – Displays the type of resource being touched, for example, AWS.
    - **Start Date** – Displays when the task was executed.
    - **IP Address** – Displays the IP address of the user, if applicable.

6. To display details about the users, including the following details, select the **Users** tab:
    - **Username** – Displays the name of the user who accessed the resource.
    - **No.** **of Times Executed** – Displays how many times the user accessed the resource.
    - **No.** **of Resources Executed** – Displays how many resources were affected by the task.
    - **Last Executed On** – Displays the last date in which the user accessed the resource.

    - To change the view, select the  drop-down list next to **Users**. The default is view is **Tasks  – Table**.

    - To select from the following options, select the  drop-down list:
    
        - **Graph View**: Displays a graph view of how many users have access to the resource, how many resources haven't been accessed, and how many have been accessed.

7. (Azure/GCP/VCENTER only) To display details about tasks, including the following details, select the **Tasks** tab:

    - **Task Name**: Displays the name of the task
    - **No. of Times Executed**: Displays how many times the task was executed
    - **No. of Users**: Displays the number of users with access to the task.
    - **Last Executed On**: Displays the last date in which the task was accessed.

    - To change the view, select the drop-down list next to **Users**. The default is view is **Tasks  – Table**.
    -  To select from the following options, select the  drop-down list:
        - **Graph View**
            - Displays a graph view of how many tasks have been executed and how many tasks are scheduled
        - **Table View - Scheduled Tasks**
            -  Displays a detailed view of tasks that have been scheduled


8. (AWS only) To display security details about the resources, including the following details, select the **Security Info** tab:

     The **Security Info** tab is specific to bucket resources. The resource type can be found at the top of the screen, for example, **Resource Type: s3 bucket**.

    - **Block Public Access** –  Displays the block public access settings for a specified bucket.
    - **Access Control List** – Lists all identities that can access to the bucket.
    - **Bucket Policy** – Displays which users can access the bucket via a policy.

9. To view a different authorization system account, select the drop-down from the right side of the screen.
10. To export the results in comma-separated values (CSV) file format, select **Export**.

## The Task Explorer

1. To access the **Task Explorer**, select **Active Tasks** from the  drop-down list, and select an authorization system. 
    - To expand details within the last 90 days, in the **Task Name** column, select the task. 
2. The default view is the **Activity** tab.The **Activity** tab displays the high risk activities performed in the last 90 days with the following details:
    - **Username** – Displays the name of the user who performed the task.
    - **Resource Name** – Displays the name of the resource in which the task was executed.
    - **Resource Type** – Displays the type of resource being touched, for example, iam:policy.
    - **Start Date** – Displays when the task was executed.
    - **IP Address** – Displays the IP address of the user, if applicable.
3. To display details about the users, including the following details, select the **Users** tab:
    - **Username** – Displays the name of the user who performed the task.
    - **No.** **of Times Executed** – Displays how many times the user executed the task.
    - **No.** **of Resources Accessed** – Displays how many resources were acted upon by the task.
    - **Last Executed On** – Displays the last date in which the user executed the task.

     - In the  drop-down list next to **Users**, the default view is **Tasks – Table**.  
     - To see a graphical view of the number of times a user executed a task, select **Executed – Graph**.
4. To display details about the resources, including the following details, select the **Resources** tab:
    - **Resource Name** – Displays the name of the resource affected by the task.
    - **Resource Type** – Displays the type of resource being touched, for example, **AWS**.
    - **No. of Times Accessed** – Displays how many times the resource was accessed.
    - **No**. **of Users** – Displays the number of users that performed the task.
    - **Last Executed On** – Displays the last date on which the user executed the task.
5. On the down menu next to **Resources**, the default view is **Tasks – Table**. To see a graph view of how many resources have been accessed, select **Accessed – Graph** .
6. To change to another authorization system account, select the drop-down on the right side of the screen.

## The Account Explorer

The **Account Explorer** displays all the identities - users, roles, EC2 instances, and Lambda Functions - that can access the selected account from an external account.

1. To access the **Account Explorer**:

    - To choose an authorization system from the left-side panel, select the **Lock** icon. Then select an AWS account. 
      - Under the **Domain/Account** column, select the domain or account name to access **Account Explorer**. The default view is the **Cross Account** **Users** tab.
       - Or, select the **Data Collectors** icon on the top menu. Choose the **Authorization Systems** tab and select the **Name** of any AWS accounts.
2. The **Cross Account** **Users** tab displays which identities can access the specified account, with the following details:
 
      The **Account Explorer** displays identities that aren't part of the  specified AWS account, but have permission to access the account through various roles.

      - To export the data in comma-separated values (CSV) file format, select the **Export** button.

      - To view **Account Explorer** for other accounts, select the authorization system drop-down on the right side and choose one of the available accounts.

    - **Roles that Provide Access**: Lists the roles that provide access to other accounts through the Trusted Entities policy statement.
      - To view the**Role Summary** which provides the following details, to the right of the role name, select **View**:
            - **Policies**: Lists all the policies attached to the role.
            - **Trusted Entities**: Displays the identities from external accounts that can assume this role.

        -  To view all the identities from various accounts that can assume this role, select the icon to the left of the role name.
        - To view the role definition, to the right of the role name, select **View**.
        - To view a diagram of all the identities that can access the specified account and through which role(s), select on the role name.

         If CloudKnox is monitoring the external account, specific identities from that account that can assume this role will be listed. Otherwise, the identities declared in the **Trusted Entity** section will be listed.

    - **Connecting Roles** tab lists per account the following roles:
        - Direct roles that are trusted by the account role.
        - Intermediary roles that aren't directly trusted by the account role but are assumable by identities through role-chaining.

        - To view all the roles from that account that are used to access the specified account, select the icon to the left of the account name.
        - To view the trusted identities declared by the role, select the icon to the left of the role name.

            The trusted identities for the role will be listed only if the account is being monitored by CloudKnox.

            - To view the role definition, to the right of the role name, select **View**.

                 When the icon is selected to expand details, a search bar is available. You can use it to search for specific roles.


    - **Identities with Access**: Lists the identities that come from external accounts.

        - To view all the identities from that account can access the specified account, select the icon to the left of the account name.
        - For EC2 instances and Lambda Functions, to view **Role Summary**, which displays the details noted above, select **View** to the right of the identity name.
        - To view a diagram of the ways in which the identity can access the specified account and through which role(s), select the identity name.

<!---## Next steps--->