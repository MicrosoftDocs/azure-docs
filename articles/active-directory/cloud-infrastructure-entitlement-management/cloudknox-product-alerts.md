---
title: Microsoft CloudKnox Permissions Management - Create and save product alerts
description: How to set up alerts through the Microsoft CloudKnox Permissions Management application.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/22/2022
ms.author: v-ydequadros
---

# Create and save product alerts

You can set up alerts through Microsoft CloudKnox Permissions Management (CloudKnox). CloudKnox will notify you about specific activities being performed or that occur on various authorization systems and associated accounts.

The **Alerts** page provides settings you can use to create and save alerts so you're notified about key data points.

## Access the Alerts page

- Select **Alert**.

## Filter alerts in the Alerts Activity tab

1. To filter alerts, select the appropriate alert name or, from **Alert Name**, select **All**.
2. You can view the following data in the **Alerts** section:

    - **Date** - Allows you to select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**.
    - **Alert** - Lists the alerts triggered by activity within the selected authorization system.
    - **Details** - Lists alert criteria.
    - **# of Alerts** - Displays the number of activities that match the alert criteria.
    - **Task** - Displays how many tasks are specified in the alert trigger criteria match.
    - **Resource** - Displays how many resources are affected by the activity that the alert is tracking.
    - **Identity** - Displays how many identities are affected by the activity that the alert is tracking.
    - **Authorization System** - Lists the name of the account for which the alert is generated.
    - **Date/Time** - Lists the date and time of the alert.
    - **Date/Time (UTC)** - Lists the date and time of the alert in Coordinated Universal Time (UTC).
3. To view the **Details** section, select the ellipses (**...**).

     - The **Details** section displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that match the alert criteria.
4. Select **Resources**, **Tasks**, or **Identities** to view  matches to your criteria.

     - The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
     - The **View Trigger** section displays the current trigger settings and applicable authorization system details.

### Create a new activity trigger  

1. From the **Alerts** section in the **Activity** tab, select **Create Activity Trigger**.
2. In the **Alert Name** box, enter a name for the alert.
3. From the **Authorization System Type** list, select the operator option, **Is**. 

   - Select **Search**, and then select **AWS**, **Azure**, **GCP**, or **VCENTER**.
4. From the **Authorization System** menu, select one or multiple accounts. 

      - To select multiple accounts, select the boxes next to the account from the **List** tab or the **Folder** tab.  
      - To view alert conditions, select **View**.
      - To edit alert conditions, select **Edit**.
5. To add a third criteria box, select an **Authorization System**, and then select an option. 
6. To specify multiple values for an criteria, select **Add**.
7. To add criteria for the alerts, select **Add**.

### View Operator options

The **Operator** menu contains the following options:

- **Is**/**Is Not** - Select in the value field to view a list of all available usernames. You can either select or enter the required username.
- **Contains**/**Not Contains** - Enter any text that the query parameter should or shouldn't contain, for example *CloudKnox*.
- **In**/**Not In** - Select in the value field to view list of all available values. Select the required multiple values.

###  Add alerts for an access key ID

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Access Key ID**.
3. Select **Operator**, and then select the required option.
4. To add criteria in this section, select the plus (**+**) sign. 

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria you select can be **Contains** with free `AKIAIFXNDW2Z2MPEH5OQ`. 
5. To add a row of criteria, select the plus (**+**) sign, and, select **Or**. Then select **Not**, **Contains**, and enter `AKIAVP2T3XG7JUZRM7WU`. 
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for an identity tag key (AWS only)

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Identity**, and then select **Tag Key**.
3. Select **Operator**, and then select the required option.
4. To add criteria in this section, select the plus (**+**) sign. 

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** and type in, or select from the dropdown options, **Test**.
5. Select the plus (**+**) sign, select **Or** with **Is**, and then enter, for example, *CloudKnox*.
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for an identity tag key value (AWS only)

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Identity** **Tag Key Value**.
3. Select **Operator**, and then select the required option.
4. To add criteria in this section, select the plus (**+**) sign.  

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** and type in, or select from the dropdown options, **Test**. 
5. Select the plus (**+**) sign, select **Or** with **Is**, and then enter, for example, *CloudKnox*.
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a resource name

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Resource Name**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign. 

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with resource name **Test**. 

5. Select the plus (**+**) sign, select **Or** with **Contains**, and then enter, for example, *CloudKnox*.
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a resource tag key

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Resource Tag Key**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign. 

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** and type in, or select from the dropdown options, **Test**. 
5. Select the plus (**+**) sign, select **Or** with **Is**, and then enter, for example, *CloudKnox*.
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a resource tag key value

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Resource** **Tag Key Value**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign.  

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** and type in, or select from the dropdown options, **Test**. 
5. Select the plus (**+**) sign, select **Or** with **Is**, and then enter, for example, *CloudKnox*.
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a resource type

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Resource Type**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign. 

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with resource type **s3::bucket**. 

5. Select the plus (**+**) sign, select **Or** with **Is**, and then from the dropdown options, select **ec2::instance**. 
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a role name (AWS only)

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Role Name**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign.  

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Contains** with free text **Test**. 
5. Select the plus (**+**) sign, select **Or** with **Contains**, and then enter **CloudKnox**. 
    To remove a row of criteria, select the minus (**-**) sign.
6. Select **Save**.

### Add alerts for a role session name (AWS only)

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Role Session Name**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign.  

 You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Contains** with free text **Test**. 
5. Select the plus (**+**) sign, select **Or** with **Contains**, and then enter **CloudKnox**. 
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a task name

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Task Name**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign.  

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with task name **s3:CreateBucket**. 
5. Select the plus (**+**) sign, select **Or** with **Is**, and then enter `ec2:TerminateInstance`. 
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### Add alerts for a username

1. In the **Create Alert Trigger** section, select **Add**.
2. Select **Username**.
3. Select **Operator**, and then select the required option.
4. To add criteria within this section, select the plus (**+**) sign.  

   You can change the operation between **And**/**Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with username **Test**. 
5. Select the plus (**+**) sign, select **Or** with **Contains**, and then enter **CloudKnox**. 
6. To remove a row of criteria, select the minus (**-**) sign.
7. Select **Save**.

### View the Triggers table in the Alert Triggers tab

1. On the **Activity** tab in **Alert Triggers**, you can view the following data:

    - **Alerts** - Displays the name of the alert trigger.
    - **# of Users Subscribed** - Displays how many users are subscribed to a specific alert trigger. 

    You can select the number in this column to view which users are subscribed to the alert trigger.

    - **Created By** - Displays the email address of the user who created the alert trigger.
    - **Modified By** - Displays the email address of the user who last modified the alert trigger.
    - **Last Updated** - Displays the date and time the alert trigger was last updated.
    - **Subscription** - Displays either **On** or **Off**.

         - If the column displays **Off**, the current user isn't subscribed to that alert. Switch the toggle to **On** to subscribe to the alert.
         - The person who creates an alert trigger is automatically subscribed to the alert, and will receive emails about the alert.
2. Under the **Status** section, select **Activated & Deactivated** to filter only by **Activated** or only by **Deactivated**. 

    Check the appropriate option and select **Apply** to filter.
3. To make changes to the query, select the ellipses (**...**), and then select from the following options:
    - **Edit** - Allows you to make changes to the alert and returns the user to the **Create Alert Trigger** screen. 
      <!---For more information, see Create a new alert.--->
       > [!NOTE]
         > Only the user who created the alert can perform the following actions: edit the trigger screen, rename an alert, deactivate an alert, and delete an alert. Changes made by other users aren't saved.

    - **View -** View  details of the alert trigger.
    - **Duplicate** - Creates a duplicate of the alert called "**Copy of XXX**".
    - **Rename** - Enter the new name of the query, and then select **Save.**
    - **Deactivate** - The alert will still be listed, but will no longer send emails to subscribed users.
    - **Delete** - Delete the alert.

## View rule-based anomalies in the Rule-Based Anomaly tab

Rule-based anomalies identify recent activity that is determined to be unusual based on explicit rules defined in the activity trigger. The goal of rule-based anomaly is high precision detection.

1. You can view the following data in the **Alerts** section:

      - **Alert Name** - Lists the name of the alert.
         To view the specific identity, resource, and task names that occurred during the alert collection period, select the **Alert Name**.
      - **Anomaly Alert Rule** - Displays the name of the rule select when creating the alert.
        <!---For more information, see Create a new anomaly trigger.--->
      - **# of Occurrences** - How many times the alert trigger has occurred.
      - **Task** - How many tasks are affected by the alert.
      - **Resources** - How many resources are affected by the alert.
      - **Identity** - How many identities are affected by the alert.
      - **Authorization System** - Displays which authorization systems the alert applies to
      - **Date/Time** - Lists the date and time of the alert.
      - **Date/Time (UTC)** - Lists the date and time of the alert in Coordinated Universal Time (UTC).
      - **View Trigger** - Displays the current trigger settings and applicable authorization system details
      - **Activity** section - Displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
2. To filter alerts, select the appropriate alert name or choose **All** from the **Alert Name** dropdown menu.  

    From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and select **Apply**.
3. To view details that match the alert criteria, select the ellipses (**...**). For example, **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities**.

### Create a new anomaly trigger

1. From the **Alerts** section of the **Rule-Based Anomaly** tab, select the **Create Anomaly Trigger** button.
2. In the **Alert Name** box, enter a name for the alert.
3. Select the **Authorization System**.
4. Select one of the following conditions:
      - **Any Resource Accessed for the First Time** - The identity accesses a resource for the first time during the specified time interval
      - **Identity Performs a Particular Task for the First Time** - The identity does a specific task for the first time during the specified time interval 
      - **Inactive Identity Becomes Active** - An identity that hasn't been active for 90 days becomes active and does any task in the selected time interval
5. Select **Next**.
6. On the **Authorization Systems** tab, select the available authorization systems display and the appropriate systems, or, to select all systems, select **All**. 

      - The **Status** column displays if the authorization system is online or offline. The **Controller** column displays if the controller is enabled or disabled.
      - This screen defaults to **List** view, but you can change it to **Folder** view. You can select the applicable folder instead of individually by system. 
7. On the **Configuration** tab, to update the **Time Interval**, select the menu and select **90 Days**, **60 Days**, or **30 Days**.
8. Select **Save**.

### View the Triggers table in the Rule-Based Anomaly Alert Triggers tab

1. You can view the following data in the **Alert Triggers** tab:

      - **Alert** - Displays the name of the alert.
      - **Anomaly Alert Rule** - Displays the name of the selected rule when creating the alert.

         <!---For more information, see Create a new anomaly trigger.--->
      - **# of Users Subscribed** - Displays the number of users subscribed to the alert.
      - **Created By** - Displays the email address of the user who created the alert.
      - **Last Modified By** - Displays the email address of the user who last modified the alert.
      - **Last Modified On** - Displays the date and time the trigger was last modified.
      - **Subscription** - Switches between **On** and **Off**.
      - **View Trigger** - Displays the current trigger settings and applicable authorization system details.
2. To view the following details, select the ellipses (**...**):

      - **Details** - Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria. 
          - To view the specific matches, select **Resources**, **Tasks**, or **Identities**.
      -  **Activity** section - Displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.

3. To filter by **Activated** or **Deactivated**, in the **Status** section, select **Activated & Deactivated**.
4. Select the appropriate option, and then select **Apply** to filter the data.

## Detect identities behavior outliers in the Statistical Anomaly tab

Statistical anomalies detect outliers in an identities behavior, and recent activity is determined to be unusual based on models defined in an activity trigger. The goal of this anomaly trigger is a high recall rate.

1. You can view the following data in the **Alerts** section:

      - **Alert Name** - Lists the name of the alert 
      - **Anomaly Alert Rule** - Displays the name of the rule select when creating the alert. 

           <!---For more information, see Create a new anomaly trigger.--->
      - **# of Occurrences** - Displays how many times the alert trigger has occurred.
      - **Task** - Displays how many tasks are affected by the alert.
      - **Resources** - Displays how many resources are affected by the alert.
      - **Identity** - Displays how many identities are affected by the alert.
      - **Authorization System** - Displays which authorization systems the alert applies to.
      - **Date/Time** - Lists the date and time of the alert.
      - **Date/Time (UTC)** - Lists the date and time of the alert in Coordinated Universal Time (UTC).
      -  **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
      - **View Trigger** - Displays the current trigger settings and applicable authorization system details
2. To filter the alerts, select the appropriate alert name or choose **All** from the **Alert Name** dropdown menu. 
3. From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and select **Apply**.
4. To view the following details, select the ellipses (**...**):

      - **Details** - Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
5. To view the specific matches, select **Resources**, **Tasks**, or **Identities**.
6. To view the name, ID, role, domain, authorization system, statistical condition, anomaly date, and observance period, select the **Alert Name**. 
7. To expand the top information found with a graph of when the anomaly occurred, select **Details**.

### Create a new statistical anomaly trigger

1. From the **Alerts** section of the **Statistical Anomaly** tab, select **Create Statistical Anomaly Trigger**.
2. Enter a name for the alert in the **Alert Name** box.
3. Select the **Authorization System**.
4. Select from one of the following conditions:

      - **Identity Performed High Number of Tasks** - The identity performs at a higher volume than usual. The typical performance is 25 tasks per day and they're now performing 100 tasks per day.
      - **Identity Performed Low Number of Tasks** - The identity performs lower than their daily average. The typical performance is 100 tasks per day and they're now performing 25 tasks per day.
      - **Identity Performed Tasks with Multiple Unusual Patterns** - The identity does many unusual tasks and at different times. This means that identities can execute actions outside their normally logged hours or performance hours, and at a higher than usual volume of tasks than normal.
      - **Identity Performed Tasks with Unusual Results** - The identity performing an action gets a different result than usual, such as most tasks end in a successful result and are now ending in a failed result or vice versa.
      - **Identity Performed Tasks with Unusual Timing** - The identity does tasks outside of their normal logged in time or performance hours determined by the UTC actions hours grouped as follows:
           - 12AM-4AM UTC
           - 4AM-8AM UTC
           - 8AM-12PM UTC
           - 12PM-4PM UTC
           - 4PM-8PM UTC
           - 8PM-12AM UTC
      - **Identity Performed Tasks with Unusual Types** - The identity does unusual types of tasks from their normal tasking, for example, read, write, or delete tasks they wouldn't ordinarily perform.
5. Select **Next**.
6. On the **Authorization Systems** tab, the available authorization systems displays. 

   - Select the appropriate systems, or, to select all systems, select **All**. 

     The **Status** column displays if the authorization system is online or offline. 

     The **Controller** column displays if the controller is enabled or disabled.

   The screen defaults to the **List** view but you can switch to **Folder** view using the menu, and then select the applicable folder instead of individually by system. 
7. On the **Configuration** tab, you can update the **Time Interval** by selecting **90 Days**, **60 Days**, or **30 Days** from the menu list.
8. Select **Save**.

### View the Triggers table in the Statistical Anomaly Alert Triggers tab

1. You can view the following data on the **Alert Triggers** tab:

      - **Alert** - Displays the name of the alert.
      - **Anomaly Alert Rule** - Displays the name of the rule select when creating the alert. 

          <!---For more information, see Create a new anomaly trigger.--->
      - **# of Users Subscribed** - Displays the number of users subscribed to the alert.
      - **Created By** - Displays the email address of the user who created the alert.
      - **Last Modified By** - Displays the email address of the user who last modified the alert.
      - **Last Modified On** - Displays the date and time the trigger was last modified.
      - **Subscription** - Toggle the button to **On** or **Off**.
2. Under the **Status** section, select **Activated & Deactivated** to filter by **Activated** or **Deactivated**.  Then select the appropriate option and select **Apply** to filter.
3. To view the following details, select the ellipses (**...**):

      - **Details** - Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
      - To view the specific matches, select **Resources**, **Tasks**, or **Identities**.
      - The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
      - **View Trigger** - Displays the current trigger settings and applicable authorization system details.

## View alerts in the Permission Analytics tab

1. You can view the following data in the **Alerts** section:

      - **Alert Name** - Lists the name of the alert.
           - To view the name, ID, role, domain, authorization system, statistical condition, anomaly date, and observance period, select the **Alert Name**.  
           - To expand the top information found with a graph of when the anomaly occurred, select **Details**. 
      - **Anomaly Alert Rule** - Displays the name of the rule select when creating the alert.

         <!---For more information, see Create a new anomaly trigger.--->
      - **# of Occurrences** - Displays how many times the alert trigger has occurred.
      - **Task** - Displays how many tasks are affected by the alert
      - **Resources** - Displays how many resources are affected by the alert
      - **Identity** - Displays how many identities are affected by the alert
      - **Authorization System** - Displays which authorization systems the alert applies to
      - **Date/Time** - Displays the date and time of the alert.
      - **Date/Time (UTC)** - Lists the date and time of the alert in Coordinated Universal Time (UTC).
2. To filter the alerts, select the appropriate alert name or, from the **Alert Name** menu,select **All**. 

      - From the **Date** dropdown menu, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**, and then select **Apply**.
      - **View Trigger** - Displays the current trigger settings and applicable authorization system details.
3. To view the following details, select the ellipses (**...**):

      - **Details** - Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
4. To view specific matches, select **Resources**, **Tasks**, or **Identities**. 

   The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.

### Create a new permission analytics trigger

1. From the **Alerts** section of the **Statistical Anomaly** tab, select **Create Permission Analytics Trigger**.
2. In the **Alert Name** box,  enter a name for the alert.
3. Select the **Authorization System**.
4. Select **Identity Performed High Number of Tasks**.
5. Select **Next**.
6. On the **Authorization Systems** tab, the available authorization systems display. Select the appropriate systems, or choose **All** to select all systems.  

      The **Status** column displays if the authorization system is online or offline, and the **Controller** column displays if the controller is enabled or disabled. 

      This screen defaults to the **List** view but can also be changed to the **Folder** view, and the applicable folder can be selected instead of individually by system.
7. On the **Configuration** tab, you can update the **Time Interval** using the list to select  **90 Days**, **60 Days**, or **30 Days**.
8. Select **Save**.

### View the Triggers table in the Permission Analytics Alert Triggers tab

1. You can view the following data in the **Alert Triggers** tab:

      - **Alert** - Lists the name of the alert.
      - **Anomaly Alert Rule** - Displays the name of the rule select when creating the alert.

          <!---For more information, see Create a new anomaly trigger.--->
      - **# of Users Subscribed** - Displays the number of users subscribed to the alert.
      - **Created By** - Displays the email address of the user who created the alert.
      - **Last Modified By** - Displays the email address of the user who last modified the alert.
      - **Last Modified On** - Displays the date and time the trigger was last modified.
      - **Subscription** - Toggle the button to **On** or **Off**.
      - **View Trigger** - Displays the current trigger settings and applicable authorization system details.
2. To view the following details, select the ellipses (**...**):

      - **Details** - Displays **Authorization System Type**, **Authorization Systems**, **Resources**, **Tasks**, and **Identities** that matched the alert criteria.
3. To view specific matches, select **Resources**, **Tasks**, or **Identities**.

      - The **Activity** section displays details about the **Identity Name**, **Resource Name**, **Task Name**, **Date**, and **IP Address**.
4. To filter the results by **Activated** or  **Deactivated** status:
    1. Under the **Status** section, select the **Activated & Deactivated** dropdown menu.
    2. Select the appropriate option, and then select **Apply** to filter the results.

## Next steps

- For an overview on activity alerts and triggers, see [View information about activity alerts and triggers](cloudknox-ui-triggers.md).
- For information on how to create alerts and triggers, see [Create an alert trigger](cloudknox-howto-create-alert-trigger.md).
