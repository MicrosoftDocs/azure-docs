---
title: Microsoft CloudKnox Permissions Management Just Enough Privilege (JEP) Controller
description: How to use the Microsoft CloudKnox Permissions Management Roles/Policies tab to manage permissions.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/07/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management Just Enough Privilege (JEP) Controller

The Just Enough Privilege (JEP) Controller at Microsoft CloudKnox Permissions Management allows system administrators to adjust permissions, allows users to request privileges on-demand (POD), and allows administrators to remediate excessive permissions based on activity data from Usage Analytics. It comprises four tabs: **Roles/Policies**, **Permissions**, **Settings**, and **Requests**.

## How to use the Roles/Policies tab

> [!NOTE]
> Only users with the **Viewer**, **Controller**, or **Administrator** role can view this tab. </p>Only users with the **Controller** and **Administrator** role can make changes on this tab.

1. You can view the following details the table on the **Roles/Policies** tab:
    - **Role/Policy Name** - Displays the name of the role or the AWS policy.

         An exclamation mark (**!**) circled in red means the role or AWS policy has not been used.

    - **Role Type** - Displays the type of role or AWS policy.

2. To view the **Policy Summary**, click the icon next to the AWS policy name.

3. To expand details about the role/AWS policy and view tasks and identities assigned to the role/AWS policy, click **Role**. 

4. To view the **Role Summary**, click the icon next to the username under **Identities Assigned to**.

5. To filter the roles/AWS policies select from the following options:

    - **Authorization System Type** - Select **AWS**, **Azure**, **GCP**, or **VCENTER**.
    - **Authorization System** - Select the appropriate authorization system from the  drop-down list.
    - **Policy Type** or **Role Type** - Select:

         - **System** - A cloud service provider managed role/AWS policy. 
         - **Custom** - A customer managed role/AWS policy. 
         - **CloudKnox only** - A role/AWS policy created by CloudKnox.

    - **Policy Status** or **Role Status** - Select **Assigned** or **Unassigned**.
    - **Policy Usage** - Select **All** or **Unused**.
    - **Policy/Role Name** - Enter the specific policy/role name into the box to search.

### How to create a new policy (AWS Only)

> [!NOTE]
> Only users with the **Controller** or **Administrator** role can perform this action.

1. On the **Roles/Policies** tab, click **Create Policy**.

2. Under **Basic Details**, from the **Authorization System Type**  drop-down list, select **AWS**.

3. Select the appropriate option from the **Authorization System**  drop-down list.

     Each authorization system will  display either **Controller Enabled** or **Controller Disabled**. If the controller is disabled, the system administrator will not be able to directly create a new AWS policy in the authorization system.

4. Enter a name for the policy in the **Policy Name** box.

5. Under **How Would You Like to Create the Policy?**, select the required option:

    - **Activity of User(s)** - Allows you to create a policy based on a user's activity.
    - **Activity of Group(s)** - Allows you to create a policy based on the aggregated activity of all the users belonging to the group(s).
    - **Activity of Resource(s)** - Allows you to create a policy based on the activity of a resource, for example, an EC2 instance.
    - **Activity of Role** - Allows you to create a policy based on the aggregated activity of all the users that assumed the role.
    - **From Existing Policy/Role** - Allows you to create a new policy or role based on an existing policy or role.
    - **New Policy/Role** - Allows you to create a new policy or role starting from scratch.

         If you select **New Policy**, go to step 8.

6. Select the number of days the policy should be created for from the **Tasks Performed in Last** section.

     System administrators can select **90 Days**, **60 Days**, **30 Days**, **7 Days** or **1 Day**.

7. To select the identity to which the policy should apply, click the icon next to the identity name.

     - To move the identity from the **Available Users** tab to the **Selected Users** tab, click the icon. 

     - Scroll to find an identity, or enter the identity name into the **Search** box.

8. Click **Next**.

   By default, the **Selected Tasks** column lists all the tasks performed by the selected identity.

9. To adjust the user's access, click the icon in the **Available Tasks** column and/or the icon in **Selected Tasks** column. 
   <!---Add screenshot.--->

      - To view available options, click the right caret icon next to the service name.

        Only System administrators have the option to add individual tasks within the service to the identity's selected tasks.

10. Under **Resources**, select **All Resources** or **Specific Resources**.

11. To open a list of all available resources, select **Specific Resources*. All the resources that the selected identities have accessed are  entered in the **Selected Resources** column by default.

     1. To adjust the identity's access, click the icon in the **Available Resources** column and/or the icon in **Selected Resources** column. 
        <!---Add screenshot.--->

     2. Scroll to find a resource or type in the resource name into the **Search** box.

    3. To add a resource, in the **Enter the resource ARN...**, enter a specific resource  box, and then click the icon.

     4. To expand options, click the icon next to the resource name. 

           Only system administrators have the option to add individual tasks within the resource to the user's selected resources.

12. Click **Next**.

13. In the **Statements** section, all newly created statements that go into the policy display in the column on the left.

14.  To modify the operations (tasks and resources) further, click the the icon next to each statement, if necessary.

     Statements  are generated with "Action" and "Resource" sections, by default, but system administrators can check **Not Action** to generate the **NotAction** section or **Not Resource** to generate the **NotResource** section.

15. Optional: To add a JSON condition, under **Request Conditions**, click the icon next to JSON. Then click **Done**.

16. Under **Effect**, select **Allow** or **Deny**, then click **Next**.

17. In the **JSON** tab on the **Preview** screen, view the **character count** to see if the policy needs to be split.

     If **Controller Enabled** displays under the icon, CloudKnox can automatically create the policy in the authorization system because permissions to do so have been granted. 

     If permissions have not been granted, the **Controller Disabled** is displayed, and the system administrator can create policy and a script by copying and pasting from the **JSON** tab and **Script** tab, or click **Download JSON** and **Download Script**.

     If the character count is in red, the policy is too large and needs to be split into multiple policies.

18. Click **Split**.

     The split policy displays in the **Split Policies** column on the left.
<!---"Splitted" in UI? change to "Split"..--->

19. To edit the policy, click the **Edit** icon.

20. To save your edits, click the **Save** icon.

21. To copy the policy to the clipboard, click the **Copy** icon.

22. Click **Submit**.

     If **Controller Disabled** displays under the icon, the **Submit** button is disabled.

     When you click **Submit**, a number circled in red displays next to the icon at the top right of the page.
     - Click the hourglass to view the **Active** tab, which  displays the policies being created.

       A green check mark with **Success** displays when the policy has been created, and the task moves to the **Completed** tab.

### How to create a new role (Azure/GCP/VCENTER)

> [!NOTE]
> Only users with the **Controller** or **Administrator** role can perform this action.

1. On the **Roles/Policies** tab, click **Create Role**.
2. Under **Basic Details**, select the appropriate option from the **Authorization System Type** drop-down menu.
3. Select the appropriate option from the **Authorization System** drop-down menu.

     Each authorization system displays either **Controller Enabled** or **Controller Disabled**. If the controller is disabled, the system administrator will not be able to directly create a new role in the authorization system.

4. Enter a name for the policy in the **Policy Name** box.
5. Under **How Would You Like to Create the Policy?**, select one of the following options:
    - **Activity of User(s)** - Allows the creation of a policy based on a user's activity.
    - **Activity of Group(s)** - Allows the creation of a policy based on the aggregated activity of all the users belonging to the group(s).
    - **Activity of App(s)** (Azure Only) - Allows the creation of a policy based on the activity of an application.
    - **Activity of Service Account(s)** (GCP Only) - Allows the creation of a policy based on the activity of a service account.
    - **From Existing Role** - Allows the creation a new policy or role based on an existing policy or role
    - **New Role** - Allows the creation a new policy or role starting from scratch.

         If you select **New Role**, skip to step 8.

6. Select the number of days the policy should be created for from the **Tasks Performed in Last** section.

     System administrators can select **90 Days**, **60 Days**, **30 Days**, **7 Days** or **1 Day**.

7. To select the user to whom the policy should apply, click the icon next to the user's name.

     - To move the identity from the **Available Users** tab to the **Selected Users** tab, click the icon. 
     - Scroll to find an identity or type in the identity name into the **Search** box.

8. Click **Next**.
9. By default, all the tasks performed by the selected user(s) are put the **Selected Tasks** column.
10. To adjust the identity's access, click the icon in the **Available Tasks** column and/or the icon in **Selected Tasks** column.

     - To expand options, click the icon next to the service name. 

       Only system administrators have the option to add individual tasks within the service to the identity's selected tasks.

    **For Azure only:** The **Include inherited read-only tasks** option is already checked. If it is unchecked, only the tasks the user has performed or the write tasks the identity has permissions to perform display.

11. Under **Resources**, select **All Resources** or **Specific Resources**.
12. Select **Specific Resources** to open a list of all available resources. All the resources that the selected identities have accessed are by default put in the **Selected Resources** column.

     1. To adjust the user's access, click the icon in the **Available Resources** column and/or the icon in **Selected Resources** column. 
     2. Scroll to find a resource or type in the resource name into the **Search** box.

     3. Enter a specific resource into the **Enter the resource ARN...** box and click icon to add it.

     4. Click the caret icon next to the resource name to expand options. 

         Only system administrators have the option to add individual tasks within the resource to the identity's selected resources.

13. Click **Next**.

14. In the **Statements** section, all newly created statements that go into the policy display in the column on the left.

15. To modify the operations (tasks and resources) further, click each statement, and then click the icon.

16. Optional: To add a JSON condition, under **Request Conditions**, click ![icon](images/icons/Add circle fill.svg) next to JSON. Then click **Done**.

17. Under **Effect**, select **Allow** or **Deny**, and then click **Next**.

18. To see if the policy should be split, in the **JSON** tab on the **Preview** screen, view the **character count**.

     - Character count is specific to **AWS only**.
     - **GCP Only:** The **Preview** screen displays **YAML** instead of JSON.
     - If **Controller Enabled** displays under the authorization system icon, CloudKnox creates the policy in the authorization system because permissions to do so have been granted. 
     - If permissions have not been granted, the **Controller Disabled** is displayed, and the system administrator can create policy and a script by copying and pasting from the **JSON** tab and **Script** tab, or click **Download JSON** and **Download Script**.
     - If the character count is in red, the policy is too large and should be split into multiple policies.

19. Click **Split**.

     The split policy displays in the **Split Policies** column on the left.

<!---"Splitted" in UI? change to "Split"..--->

20. To edit the policy, click the icon.

21. When you have finished making your edits, click **Save**.

22. To copy the policy to the clipboard, click the icon. Then click **Submit**.

     If **Controller Disabled** displays under the authorization system icon, the **Submit** button is disabled.

     When you click **Submit**, a number is circled in red next to the icon at the top right of the page. 
     -  To view the **Active** tab which  displays the policies being created, click the hourglass. 

       A green check mark with **Success** displays when the policy has been created, and the task moves to the **Completed** tab.

### How to clone a role/AWS policy

> [!NOTE]
> Only users with the Controller or Administrator role can perform this action.

1. To make a copy of the policy, click **Clone**.

2. On the **Clone** screen, select the appropriate authorization systems. To select all the authorization systems, select **Authorization System**.

3. Click **Next**.

4. **(AWS Only)**  The **Clone Resources** and **Clone Conditions** checkboxes are automatically selected. Uncheck the boxes if the resources and conditions are different from what is displayed.

5. Enter a name for each authorization system that was selected in the **Policy Name** boxes.

6. Click **Next**.

7. For selected authorization systems, if the data collector has not been given controller privileges, the following message displays: 

   > [!NOTE]
   > Only Online/Controller Enabled authorization systems can be submitted for cloning.

   To clone this role manually, the system administrator can download the script and JSON file. 

8. Click **Submit**.

### How to modify a role/AWS policy

> [!NOTE]
> Only users with the **Controller** or **Administrator** role can perform this action.

1. Click **Modify** next to the applicable role/AWS policy.

     You can't modify **System** policies and roles.

2. On the **Statements** screen, make edits to the **Tasks**, **Resources**, **Request Conditions**, and **Effect** as required. 

    For more information on how to make edits to the **Statements** screen, see [How to Create a New Policy (AWS Only)](cloudknox-product-jep-controller.md#how-to-create-a-new-policy-aws-only) or [How to Create a New Role (Azure/GCP/VCENTER)](cloudknox-product-jep-controller.md#how-to-create-a-new-role-azuregcpvcenter)).

3. Click **Next**.

4. Review the edits on the **Preview** screen, and then click **Modify**.

### How to delete a role/AWS policy

> [!NOTE]
> Only users with the **Controller** or **Administrator** role can perform this action.

1. Next to the applicable role/AWS policy, click **Delete**.

     The system administrator can only delete role/AWS policy if that role/policy is not assigned to an identity. System roles or policies cannot be deleted.

2. On the **Preview** screen, review the role/AWS policy about to be deleted.

     If the controller is disabled, click **Download Script**.

3. To remove the role/AWS policy, click **Delete**.

## How to use the Permissions tab

> [!NOTE]
> Only users with the **Controller** or **Administrator** role can perform these actions.

1. Filter from the following options on the screen:
    - **Authorization System Type** - Select  **AWS**, **Azure**, **GCP**, and **VCENTER**.
    - **Authorization System** - Select the appropriate authorization system from the  drop-down list.
    - **Search For** - Select **User**, **Group**, **Role** (AWS Only), **App** (Azure Only), or **Service Account** (GCP Only).
    - **User/Group/Role/App/Service Status** - Select  **Any**, **Active**, or **Inactive**.
    - **Privilege Creep Index** - Select **Any**, **High**, **Medium**, or **Low**.
    - **User Name** - Type in a specific username.
    - **Group Name** - Type in a specific group name.
    - **Task Usage** - Select **Any**, **Granted**, **Used**, or **Unused**.

         If you select **Granted**, **Used** or **Unused**, the follow two options become available:

        - **Task Type** - Select **Any**, **High Risk**, or **Delete**.
        - **Tasks** - To view a list of **Available Tasks** and add new tasks, click in this field, and then click the **Add** icon.

2. When the filters are set appropriately, a list of all identities that match the search criteria are displayed in the **Users/Group/Role/App/Service** column on the left side of the screen.

   Check the specific users that need their permissions changed.

**AWS**
    
1. When selected, the **Policies** block populates to  display which policies are associated with the user(s)/group(s)/roles(s).

     When a user, group, or role is selected, the **Policies** section populates with the policies associated with that identity. 
     - In the **Attach/Detach Policies** tab, administrators can remove a policy from from multiple identities.

     If you select *AdministrativeAccess* from the list to remove from all identities selected, you can add a policy from multiple identities. For example, you can select *AWSReadOnly* from the list to add to all identities selected.

2. To select the policies you want to give the user, from the **Attachable** column, click the icon. The policy moves into the **Selected to Attach** block.
    
3. To move the policy into the **Selected to Detach** block, from the **Detachable** column, select appropriate policies that should be removed from the user and click the icon.

    - If any policy is added to the **Selected to Attach** or **Selected to Detach** blocks in error, click the icon to remove the policy from the block.
    - Use **Search** to locate a specific policy or type of policy.

4. Click **Submit**.
    
5. When the pop-up message appears asking **Are You Sure You Want to Perform the Quick Action?** click one of the following options:

    - **Generate Script** - Allows a copy and paste function if the system administrator does not have direct access to execute the action.
    - **Confirm** - Performs the actions directly if permissions have been granted by the authorization system.
    - **Cancel** - Cancels the action.

**Azure/GCP/VCENTER**

1. When you click to open **Modify Permissions**, it populates to  display which permissions are associated with the user(s).
    
2. To select the user and modify permissions, click next to the username.

      To select all users, or select users individually, click next to **Username**.

     If a role was granted through a group, the permission cannot be edited without modifying the group itself.

3. Click one of the following tabs to continue:
        
    - **Quick Actions**
        - From the **Quick Actions** tab, system administrators have the option to select from the following actions:

            - **Revoke Unused Tasks**
            - **Revoke High-Risk Tasks**
            - **Assign Read-Only Status**
            - **Revoke Delete Tasks**

    - **Roles**
        1. To change users' role assignment, click the **Roles** tab.
        2. To select the roles you want to assign to the user, from the **Add Role** column, click the icon. 
     
           The role moves into the **Selected to Add** block.
        3. To move the role into the **Selected to Remove** block, from the **Remove Role** column, select the roles you want to remove and click the icon.

             When an identity is selected from **Modify Permissions**, the **Remove Role** section under the **Roles** tab is automatically populated with the roles the identity currently has assigned, allowing system administrators to easily view and remove roles from the identity.

             If any role is added to the **Selected to Add** or **Selected to Remove** blocks by mistake, click the icon to remove the role from the block.

             To search for a specific role or type of role, use **Search**.

    - **Tasks**
        1. Click the **Tasks** tab.
        2. To move the tasks into the **Selected to Grant** block, from the **Available** column, select appropriate tasks that should be given to the user, and click the icon.
        3. To move the task into the **Selected to Revoke** block, from the **Revocable** column, select appropriate tasks that should be removed from the user, click the icon.

             When an identity is selected from **Modify Permissions**, the **Revocable** section under the **Tasks** tab is automatically populated with the tasks the identity currently has assigned, allowing system administrators to easily view and remove tasks from the identity.

             If any role is added to the **Selected to Grant** or **Selected to Revoke** blocks by mistake, click the icon to remove the task from the block.

              To search for a specific task or type of task, use **Search**.

        4. Click **Submit**.
        5. When the pop-up message appears asking **Are You Sure You Want to Perform the Quick Action?** click one of the following options:
            - **Generate Script** - Allows a copy and paste function if the system administrator does not have direct access to execute the action.
            - **Execute** - Performs the actions directly if permissions have been granted by the authorization system.
            - **Cancel** - Cancel performing the action.


### How to use the Role/Policy Template tab

> [!NOTE]
> Only users with the Controller or Administrator role can view this tab and perform actions.

1. Click the **Role/Policy Template** tab from the top of the screen, and view the following table of information: 

     The table view can be filtered by AWS, Azure, GCP, or vCenter by using the **Authorization System Type**  drop-down list.

     - **Template Name** - Displays the name of the template.

     - **Created By** - Displays the email address of the user who created the template.

     - **Last Modified By** - Displays the email address of the user who modified the template.

     - **Last Modified On** - Displays the date and time the template was last modified on.

     - To view or edit the template, click the **View/Edit** icon.
     - To delete a template, click the **Delete** icon.

         When you choose **Delete**, the **Delete Alert** appears to ask you to confirm that you want to delete the template. Click **Yes** or **No**.

         The **View/Edit** option displays the **Create** screen so you can make updates. When you save the template, the following message displays in green across the top of the screen: **Role/Policy template has been successfully updated**.

2. From the upper right corner, click **Create Template**.

3. On the **Details** page, from the **Authorization System Type**  drop-down list, select **AWS**, **Azure**, **GCP**, or **vCenter**.

4. In the **Template Name** box, enter a name for the template.

5. Click **Next**.

6. On the **Statements** page, the **Statement ID** box is displayed. 

     You can edit the pre-filled information if you want.

7. Under **Tasks**, select tasks from the **Available Tasks** list, or use **Search** to find a specific task. 

8. To select the applicable task name, click the icon.

     The task moves from the **Available Tasks** column to the **Selected Tasks** column.

9. From the **Resources** section, select between **All Resources**, **Specific Resources**, or **Resource Template**.

     To view helpful tool tips, hover over each option.

     The **Resource Template** displays an example of the information you must include. Replace the ARN, Service, Region, Account ID and Resource ID with the correct information.

10. Under **Request Conditions**, click the **JSON +** button, if applicable, to open the **Add JSON** screen.

11. Under **Effect**, select either **Allow** or **Deny**.

12. Click **Next**.

     When the changes are completed, the following message displays in green at the top of the screen: **Role/Policy template has been successfully Saved**.

### How to use the My Requests tab for templates

> [!NOTE]
> Only users with the Administrator role can view this tab and perform actions.

1. In the **Identity** field, select the username of the user for whom the permission is being requested.

2. From the **Role**  drop-down list, select the appropriate role for the user.

3. Select **Request using a Template**.

4. Select the appropriate template from the **Template Name** column.

     You can only select one template name. 

5. Click **Next**. 

    The information displayed under **Tasks** is pre-populated and cannot be changed. 

6. Under **Resources**, update the information appropriately.

     The **Statements** screen is not displayed for every template. 
     If **All Resources** was selected when setting up the template, the **Statements** screen will not display when requesting the template. 

     For **Specific Resources**, search by **Resource Name** or **Resource Type**.

     Click the icon under **Available Resources** to add to the **Selected Resources** column. Alternatively, you can enter the ARN and click **Add**. 

     For **Resource Template**, users will update the **region**, **account-id**, and **resource-id** boxes.

7. Under **Effect**, click **Allow** or **Deny**.

8. On the **Confirmation** page, click **Next** and then confirm that the details are correct.

9. In the **Request Summary** box, fill in details of the request.

10. Click **Submit**.

11. The **Validate OTP to Create JEP Request** box appears. Enter the OTP from your email and click **Verify**.

     This step will not happen if the One Time Passcode (OTP) validation is disabled by the administrator. 
     For more information, see [Request Settings tab](cloudknox-product-jep-controller.md#request-settings-tab)

12. **Your request has been successfully submitted** displays highlighted in green across the top of the screen once completed.

## How to use the Settings tab

> [!NOTE]
> Only users with the Administrator role can view this tab and perform actions. 

1. Click the **Settings** tab from the top of the screen, and view the following table of information:

     The two actions from the settings page are the **Request Role/Policy Filters** and **Request Duration**. The **Settings** tab defaults to the **Request Role/Policy Filters** view.

     The table view can be filtered using the  drop-down lists from the top of the page. The **Authorization System Type** can be changed from **AWS**, **Azure**, **GCP**, and **vCenter**. The **Authorization Systems** can be specified and specific **Folders** can be chosen using the **Authorization System** drop-down. 
     Click **Apply** once you've made your selections.

    - **Role/Policy Filters** - Displays the name of the role/policy filters that have been created.

    - **Authorization Systems** - Displays which authorization systems the filter applies to.

    - **Folders** - Displays the names of the folders the filters appear in.

    - **Created By** - Displays the email address of the user who created the filter.

    - **Modified By** - Displays the email address of the user who modified the filter.

    - **Last Modified On** - Displays the date and time the filter was last modified on.

    - To view or edit the filter, open the menu and click the **View/Edit** icon.
    - To delete the filter, open the menu and click the **Delete** icon.

         The **Delete Alert** box  appears to confirm you want to delete the filter. Click **Yes** or **No**.

### Request Role/Policy Filters tab

1. On the **Request Role/Policy Filters** tab, click **Create Filter** from the top right corner. 

     The **Edit Policy** window opens.

2. In the **Filter Name** box, enter a name for the filter.

3. In the **Authorization System Type** box, click the icon to view or edit the details.

     This box defaults to the **Authorization System Type** selected from the **Request Role/Policy Filters** main page.

4. In the **Authorization System Is** box, click the icon to view the details 

    Or, to edit which **Authorization Systems** you want to include, click the icon.

5. To view the details or to edit the role names, in the **Role Name Contains** box, click the icon.

6. Click **Save**.

### Request Settings tab

1. Click the **Request Settings** tab.

2. Under **Request Duration** the **Request Duration Limit** section is listed in **Hours** and you can request the duration of up to 4 hours, but not greater than 4 hours. 

     Hover over the information icon to the right of the hours drop-down to view information of when the settings will be applied.

3. Click **Save**.

4. Under **Request OTP Settings**, you can reset the OTP requirement to **On** or **Off** for both **Requests** and **My Requests**.

### Privilege on Demand (POD)

CloudKnox provides a workflow, know as *Privilege on demand (POD)*, for users to ask for additional permissions for a short duration.  CloudKnox provisions the requested permissions for the user when the request approved and automatically deprovisions the permission when the requested duration is exceeded.

The workflow is as follows:

**A user with requestor privilege**

1. Creates the request.
2. Fills out the needed tasks and resources.
3. Fills out the reason for requesting the permission.
4. Fills out the duration for which the permission is needed for.
5. Submits the request.

When the user submits the request, an email is sent to the approver. The request appears in the approver's **Requests** tab.

**A user with approver privilege**

1. Views the request.
2. Approves (or rejects) the request.

When the request is approved, CloudKnox provisions the permission for the requestor in the respective account. After the duration of the request has expired, CloudKnox automatically removes the permission for the requestor.

## How to use the Requests tab

> [!NOTE]
> Only users with the Administrator and Approver role can view this tab, and perform actions.

The **Requests** tab  displays details about submitted requests, including **Pending Requests**, **Approved Requests**, and **Processed Requests**.

The **Requests** tab is only visible to users if they have the *Approver* role assigned to them. 

1. View the **Pending Requests** section for the following details:
    - **Summary** - Displays the user's description of the request.
    - **Submitted By** - Lists the name of the CloudKnox user making the request.
    - **On Behalf Of** - Lists the name of the CloudKnox user the request is being made for, if not the current user or requestor.
    - **Authorization System** - Lists the name of the authorization system.
    - **Tasks/Scope/Policies** - Summarizes the tasks and policies selected.

     To view detailed information about the selected tasks/role/policy, hover over the number listed.

    - **Request Date** - Lists the date the request was made.
    - **Schedule** - Displays the schedule that was selected by the user.

    - To perform the following actions, from the right side of the screen:
        - **Details** - To view the details of the request, click **Details**.

            The request can be approved or rejected from the detail view.

        - **Approve** - To approve the request, click **Approve**.

            Enter a reason of approval in **Approve Request** box, if necessary, and click **Confirm**.

        - **Reject** - To reject the request, click **Reject**.

            Enter a reason of rejection in **Reject Request** box (required), and click **Confirm**.

2. View the **Approved Requests** section for the following details:
    - **Summary** - Displays the user's description of the request.
    - **Submitted By** - Lists the name of the CloudKnox User making the request.
    - **On Behalf Of** - Lists the name of the CloudKnox User the request is being made for, if not the current user.
    - **Authorization System** - Lists the name of the Authorization System.
    - **Tasks/Scope/Policies** - Summarizes the tasks and policies selected.

         The tooltip  displays more detailed information of the selected tasks/role/policy

    - **Approval Date** - Lists the date the request was approved.
    - **Schedule** - Displays the schedule that was selected by the user.
    - **Next On** - Displays the next time the request will process.
    - **Status** - Displays the status of the request.

         The status first displays **Inactive** until the time in the **Next On** column is reached. The request will then change to **Activating**, at that time, or if the **Next On** selected was **ASAP**, then the status will update immediately to **Active**. If the request is recurring, it will stay in the **Approved Requests** section, but if it is a one time request, the request will move to **Processed Requests** once done.

    - To perform the following actions, click the icon from the right side of the screen:
        - **Details** - To view the details of the approval, click **Details**.
        - **Cancel** - To cancel the approval, click **Cancel**.

3. View the **Processed Requests** section for the following details:
    - **Summary** - Displays the user's description of the request.
    - **Submitted By** - Lists the name of the CloudKnox User making the request.
    - **On Behalf Of** - Lists the name of the CloudKnox User the request is being made for, if not the current user.
    - **Authorization System** - Lists the name of the Authorization System.
    - **Tasks/Scope/Policies** - Summarizes the tasks and policies selected.

         The tooltip  displays more detailed information of the selected tasks/role/policy.

    - **Request Date** - Lists the date the request was made.
    - **Processed Date** - Lists the date the request was processed.
    - **Schedule** - Displays the schedule that was selected by the user.
    - **Status** - Displays the status of the request.

   - To perform the following actions, click the icon from the right side of the screen:

     - **Details** - To view the details of the approval, click **Details**.
     - **Delete** - To delete the approval, click **Delete**.

4. Click the **Filters** button in any of the sections, and then select the appropriate option from the **Authorization System**  drop-down list.

5. To  display or hide columns, click **Columns**, and then click the icon next to the column name.

### How to use the My Requests tab

> [!NOTE]
> Only users with the Viewer, Controller, Administrator, Approver, and Requestor role can view this tab. </p> Only Viewers, Controllers, Administrators, and Requestors can perform actions.

The **My Requests** tab  displays details about requests submitted by the current user, including **Pending Requests**, **Approved Requests**, and **Processed Requests**.

1. View the **Pending Requests** section for the following details:
    - **Request Summary** - Displays the user's description of the request.
    - **Requested By** - Lists the name of the CloudKnox User making the request.
    - **Username** - Lists the Authorization System user of the person making the request.
    - **Authorization System** - Lists the name of the Authorization System.
    - **Tasks + Scope/Policies** - Summarizes the tasks and policies selected.

         The tooltip  displays more detailed information of the selected tasks/role/policy

    - **Request Date** - Lists the date the request was made.
    - **Schedule** - Displays the schedule that was selected by the user.
    - To perform the following actions, click the icon from the right side of the screen:
        - **Details** - To view the details of the approval, click **Details**.
        - **Cancel** - To cancel the approval, click **Cancel**.

2. View the **Approved Requests** section for the following details:
    - **Request Summary** - Displays the user's description of the request.
    - **Requested By** - Lists the name of the CloudKnox User making the request.
    - **Username** - Lists the Authorization System user of the person making the request.
    - **Authorization System** - Lists the name of the Authorization System.
    - **Tasks/Scope/Policies** - Summarizes the tasks and policies selected.

         The tooltip  displays more detailed information of the selected tasks/role/policy

    - **Approval Date** - Lists the date the request was approved.
    - **Schedule** - Displays the schedule that was selected by the user.
    - **Next On** - Displays the next time the request will process.
    - **Status** - Displays the status of the request.
   - To perform the following actions, click the icon from the right side of the screen:

     - **Details** - To view the details of the approval, click **Details**.
     - **Delete** - To delete the approval, click **Delete**.


3. View the **Processed Requests** section for the following details:
    - **Request Summary** - Displays the user's description of the request.
    - **Requested By** - Lists the name of the CloudKnox User making the request.
    - **Username** - Lists the Authorization System user of the person making the request.
    - **Authorization System** - Lists the name of the Authorization System.
    - **Tasks/Scope/Policies** - Summarizes the tasks and policies selected.

         The tool tip  displays more detailed information of the selected tasks/role/policy.

    - **Request Date** - Lists the date the request was made.
    - **Processed Date** - Lists the date the request was processed.
    - **Schedule** - Displays the schedule that was selected by the user.
    - **Status** - Displays the status of the request.
   - To perform the following actions, click the icon from the right side of the screen:

     - **Details** - To view the details of the approval, click **Details**.
     - **Delete** - To delete the approval, click **Delete**.


4. Click the **Filters** button in any of the sections, and then select the appropriate option from the **Authorization System**  drop-down list.

5. To display or hide columns, click **Columns**, and then click the icon next to the column name.

### How to create a new request

> [!NOTE]
> Only users with the Viewer, Controller, Administrator, Approver, and Requestor role can view this section. </p> Only Viewers, Controllers, Administrators, and Requestors can perform actions.

1. Click **New Request**.

2. Select the appropriate option from the **Auth System Type** drop-down.

3. Select the appropriate option from the **Auth System** drop-down.

    - **AWS**
        1. In the **Identity** field, select the username of the user for whom the permission is being requested.

             If a SAML user is selected, the **Role** field will open. Select the appropriate role from the  drop-down list.

        2. Select the appropriate role for the user from the **Role**  drop-down list.

        3. Select either **Request Policy(s)** or **Request Task(s)**.

             See **How to use My Requests tab for Templates** for instructions on how to request a template.

        4. Select the appropriate policies, tasks, or templates from the **Available Policies** or **Available Tasks** column. To add them to the **Selected Policies** or **Selected Tasks** column, click the icon.

             You can search for a specific policy, task, or template using **Search**, and then filter by clicking the **All**  drop-down list and selecting **All**, **System**, **Custom**, or **CloudKnox Only**.

             To view details about the policy or task, click the icon next to the policy or task name.

        5.  To see a list of roles that are attached to the select user, view the **Existing Policies** section.
        6. Click **Next**.

             If you select **Request Task(s)**, the next section is be **Scope**. Complete the following steps:

            - In the **Resource** section, select **All Resources**, **Specific Resources**, or **Not Resource**.

                 To move the selection for **Specific Resources** to the **Selected Resources** column, click the icon from the **Available Resources** column. You can also use **Search** to find a specific resource.

            - From **Request Conditions**, click the icon next to **JSON**, and then enter details in the **Add JSON** box. Click **Done**.
            - From the **Effect** section, click **Allow** or **Deny**.
            - Click **Next**.
        7. Enter details in the **Request Summary** field.
        8. Add notes, if needed, to the **Notes (Optional)** field.
        9. Click in the **Schedule** section to set schedule details:
            - From the **Frequency**  drop-down list, select **ASAP**, **Once**, **Daily**, **Weekly**, or **Monthly**.

                 If you select **ASAP**, the requestor has to wait for the approver to approve the request since the request is not approved immediately.

                 If you select **Once**, **Daily**, **Weekly**, or **Monthly**, enter the **Date** and **Time** details

            - Enter a number in the **For** field, and from the  drop-down list select between **Hours**, **Days**, **Weeks**, or **Months**.

                 The **For** field indicates the duration for which the permission will be given to the user.

            - Click **Schedule**.
        10. View the details summary, including **User**, **User Type**, **Authorization System Type**, and **Authorization System**.
        11. Click the **Selected Policies/Tasks** and **Selected Scope** tabs to view a summary of the selections made.
    
    - **Azure/GCP/VCENTER**
        1. In the **User** field, select the username of the user for whom the permission is being requested.
        2. In the **Scope** field, select or enter the appropriate resource. By default, the **Scope** is set to the root folder of the authorization system.
        3. Select either **Request Roles(s)** or **Request Task(s)**.

             For information on how to request a template, see **How to use My Requests tab for Templates**.

        4. Select the appropriate policies or tasks from the **Select Roles** or **Available Tasks** column and then click the icon to add it to the **Selected Roles** or **Selected Tasks** column.

             You can search for a specific role or task using **Search**. To filter your results, click the **All**  drop-down list and then select **All**, **System**, **Custom**, or **CloudKnox Only**.

        5. To display a list of roles attached to the select user, click **Existing Roles**.
        6. Click **Next**.
        7. Enter details in the **Request Summary** field.
        8. Add notes, if needed, to the **Notes (Optional)** field.
        9. To set schedule details, click in the **Schedule** section:
            - From the **Frequency**  drop-down list, select **ASAP**, **Once**, **Daily**, **Weekly**, or **Monthly**.

                 If **ASAP** is selected, the requestor must wait for the approver to approve the request; the request is not accepted immediately.

                 If you select **Once**, **Daily**, **Weekly**, or **Monthly**, enter **Date** and **Time** details.

            - Enter a number in the **For** field, and from the  drop-down list select between **Hours**, **Days**, **Weeks**, or **Months**.

                The **For** field indicates duration for which the permission will be give to the user.

            - Click **Schedule**.
        10. View the details summary, including **User**, **User Type**, **Authorization System Type**, and **Authorization System**.
        11. To view a summary of the selections made, click the **Selected Roles/Tasks** and **Selected Scope** tabs.

4. Click **Submit.**

5. View the **Pending Requests** tab for the new request.

6. To view the request details, click **Details**, or click **Cancel** if the request is no longer required.

<!---## Next steps--->
