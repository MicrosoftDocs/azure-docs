---
title: Configure rules and manage alerts
description: Describes how to configure rules and manage alerts in FarmBeats
author: RiyazPishori
ms.topic: article
ms.date: 11/04/2019
ms.author: riyazp
---

# Configure rules and manage alerts

Azure FarmBeats allows you to create rules based on the business logic, in addition to the sensor data that flows from the sensors and devices deployed in your farm. The rules trigger alerts in the system whenever sensor values cross a threshold value. By viewing and analyzing the alerts created after the threshold values, you can quickly act on any issues and get required solutions.

## Create rule

1. On the home page, go to **Rules**.
2. Select **New Rule**. The New Rule window displays.

    ![Screenshot that highlights the New Rule button and the New Rule section.](./media/configure-rules-and-alerts-in-azure-farmbeats/new-rule-1.png)

3. Enter the **Rule Name** and **Rule Description** and then select a farm from the **Select Farm** drop-down menu.
4. Type your farm name to select the farm and **Conditions** section appears on the same window.  

    ![Screenshot that highlights the Conditions section.](./media/configure-rules-and-alerts-in-azure-farmbeats/new-rule-condition-1.png)

5. In **Conditions**, enter the values for **Measure**, **Operator** and **Value**.
6. Type the measure name in the **Measure** drop-down menu.
7. Select **+Add Condition** to add more conditions to the rule.
8. Select the **Severity level**.
9. In **Action**, switch on the **Email enabled** toggle button to enable email alerts.

    ![Screenshot that shows the Email enabled option.](./media/configure-rules-and-alerts-in-azure-farmbeats/new-rule-email-1.png)

10. Enter the **Email addresses** to which you want to send the email alert, along with the **Email Subject** and **Additional Notes**.  
11. In the **Rule Status**, switch on the **Enabled** toggle button to enable or disable the rule.
    You can view the number of devices that will be affected by the rule.
12. Select **Apply** to create the rule.

## View rule

The **Farm** page displays the list of available rules. Select a **Rule Name**. A window displays the following details that are applicable for the selected rule:
 - Rule name
 - Link to the farm to which the rule is associated
 - Created date
 - Last updated date
 - Severity level
 - Rule status
 - List of conditions  
 - Number of devices affected by the rule

    ![Screenshot that shows the Rule Details screen.](./media/configure-rules-and-alerts-in-azure-farmbeats/view-rule-1.png)

## Edit rule

To edit a rule, follow these steps:

1. On the home page, select **Rules** from the left navigation menu.
   The rules window displays.
2. Select the rule for which you want to edit.

    ![Screenshot that shows the selected rule.](./media/configure-rules-and-alerts-in-azure-farmbeats/edit-rule-action-bar-1.png)

3. Select **Edit** from the action bar, the **Edit Rule** window displays.

    ![Screenshot that shows the Edit Rule screen.](./media/configure-rules-and-alerts-in-azure-farmbeats/edit-rule-one-1.png)

4. Change the **Rule Name**, and **Rule Description** and then select a farm from the **Select Farm** drop-down menu.
5. Type your farm name to select the farm and **Conditions** appears in the same window.  
6. In **Conditions**, edit **Measure**, **Operator** and **Value**.
7. Type the measure name in the **Measure** drop-down menu.
8. Select **+Add Condition** to add/edit conditions to the rules.

    ![Screenshot that highlights the Add Condition button.](./media/configure-rules-and-alerts-in-azure-farmbeats/edit-rule-two-1.png)

9.  Select the **Severity Level**.  
10. In **Action**, switch on the **Email enabled** toggle button to enable email alerts.
11. Edit the **Email addresses** that you want to send the email alert, along with the **Email Subject** and **Additional Notes**.  
12. In the **Rule Status**, switch on the **Enabled** toggle button to enable or disable the rule.
You can view the number of devices that will be affected by this rule.
13. Select **Apply** to edit the rule.

## Change rule status

To change the status of a rule, follow these steps:

1. On the home page, select **Rules** from the left navigation menu. The rules window displays.
2. Select the rule for which you want to change the status.

    ![Screenshot that shows the Change Status button.](./media/configure-rules-and-alerts-in-azure-farmbeats/change-status-rule-action-bar-1.png)

3. Select **Change Status** from the action bar. The **Change Status** window displays.

    ![Screenshot that shows the Change Status screen.](./media/configure-rules-and-alerts-in-azure-farmbeats/rule-change-status-1.png)

3. Change the rule status using the **Change Status** toggle button.
   You can view the number of devices that will be affected by the Rule.
4. Select **Apply** to change the rule status.

## Delete rule

To delete a rule, follow these steps:

1. On the home page, select **Rules** from the left navigation menu. The rules window displays.
2. Select the rule for which you want to delete.

    ![Screenshot that highlights the Delete button.](./media/configure-rules-and-alerts-in-azure-farmbeats/delete-rule-action-bar-1.png)

3. Select **Delete** from the action bar.

    ![Project Farm Beats](./media/configure-rules-and-alerts-in-azure-farmbeats/delete-rule-1.png)

4. The **Delete Rule** dialog box displays. Select **Delete**.
