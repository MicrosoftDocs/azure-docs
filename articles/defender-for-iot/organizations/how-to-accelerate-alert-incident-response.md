---
title: Accelerate alert workflows
description: Improve alert and incident workflows.
ms.date: 11/09/2021
ms.topic: how-to
---


# Accelerate alert workflows

This article describes how to accelerate alert workflows by using alert comments, alert groups, and custom alert rules for standard protocols and proprietary protocols in Microsoft Defender for IoT.  These tools help you:

- Analyze and manage the large volume of alert events detected in your network.

- Pinpoint and handle specific network activity.

## Accelerate incident workflows by using alert comments

Work with alert comments to improve communication between individuals and teams during the investigation of an alert event.

Use alert comments to improve:

- **Workflow steps**: Provide alert mitigation steps.

- **Workflow follow-up**: Notify that steps were taken.

- **Workflow guidance**: Provide recommendations, insights, or warnings about the event.

The list of available options appears in each alert. Users can select one or several messages.

**To add alert comments:**

1. On the side menu, select **System Settings** > **Network Monitoring**> **Alert Comments**.

3. Enter a description and select **Submit**.


## Accelerate incident workflows by using alert groups

Alert groups let SOC teams view and filter alerts in their SIEM solutions and then manage these alerts based on enterprise security policies and business priorities. For example, alerts about new detections are organized in a discovery group. This group includes alerts that deal with the detection of new devices, new VLANs, new user accounts, new MAC addresses, and more.

Alert groups are applied when you create forwarding rules for the following partner solutions:

  - Syslog servers

  - QRadar

  - ArcSight


The relevant alert group appears in partner output solutions. 

### Requirements

The alert group will appear in supported partner solutions with the following prefixes:

- **cat** for QRadar, ArcSight, Syslog CEF, Syslog LEEF

- **Alert Group** for Syslog text messages

- **alert_group** for Syslog objects

These fields should be configured in the partner solution to display the alert group name. If there is no alert associated with an alert group, the field in the partner solution will display **NA**.

### Default alert groups

The following alert groups are automatically defined:

- Abnormal communication behavior
- Custom alerts
- Remote access
- Abnormal HTTP communication behavior
- Discovery
- Restart and stop commands
- Authentication
- Firmware change
- Scan
- Unauthorized communication behavior
- Illegal commands
- Sensor traffic
- Bandwidth anomalies
- Internet access
- Suspicion of malware
- Buffer overflow 
- Operation failures
- Suspicion of malicious activity
- Command failures
- Operational issues
- Configuration changes
- Programming

Alert groups are predefined. For details about alerts associated with alert groups, and about creating custom alert groups, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).

## Customize alert rules

Use custom alert rules to more specifically pinpoint activity of interest to you.
You can add custom alert rules based on:

- A category, for example a standard protocol, or port or file.

- Traffic detections based proprietary protocols developed in a Horizon plugin. (Horizon Open Development Environment ODE).

- Source and destination addresses

- A combination of protocol fields from all protocol layers. For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and ethernet destination, or an alert when any access is performed to a specific IP address.

If the sensor detects the activity described in the rule, the alert is sent.  

You can also use alert rule actions to instruct Defender for IoT to:

- Allow users to access PCAP file from the alert.
- Assign an alert severity.
- Generate an event rather than alert. The detected information will appear in the event timeline.


The alert message indicates that a user-defined rule triggered the alert.


### Create custom alerts

**To create a custom alert rule:**

1. Select **Custom Alerts** from the side menu of a sensor.
  
1. Select **Create rule** (**+**). 

    :::image type="content" source="media/how-to-work-with-alerts-sensor/custom-alerts-rules.png" alt-text="Create custom alert rules":::

1. Define an alert name.
1. Select protocol to detect.
1. Define a message to display. Alert messages can contain alphanumeric characters you enter, as well as traffic variables detected. For example, include the detected source and destination addresses in the alert messages. Use { } to add variables to the message
1. Select the engine that should detect the activity.
1. **Select the source and destination devices that pairs for which activity should be detected.** 

#### Create rule conditions

Define one or several rule conditions. Two categories of conditions can be created:

**Condition based on unique values**

Create conditions based on unique values associated with the category selected. Rule conditions can comprise one or several sets of fields, operators, and values. Create condition sets, by using AND.

**To create a rule condition:**

1. Select a **Variable**. Variables represent fields configured in the plugin.

7. Select an **Operator**:

    - (==) Equal to 
    
    - (!=) Not equal to 
    
    - (>) Greater than
    
    
    - In Range
    
    - Not in Range
    - Same as (field X same as field Y)
     
    - (>=) Greater than or equal to
    - (<) Less than 
    
    - (<=) Less than or equal to

8. Enter a **Value** as a number. If the variable you selected is a MAC address or IP address, the value must be converted from a dotted-decimal address to decimal format. Use an IP address conversion tool, for example <https://www.ipaddressguide.com/ip>.

    :::image type="content" source="media/how-to-work-with-alerts-sensor/custom-rule-conditions.png" alt-text="Custom rule condition":::

9. Select  plus (**+**) to create a condition set.

When the rule condition or condition set is met, the alert is sent. You will be notified if the condition logic is not valid.

**Condition Based when activity took place**

Create conditions based on when the activity was detected. In the Detected section, select a time period and day in which the detection must occur in order to send the alert. You can choose to send the alert if the activity is detected:
- any time throughout the day 
- during working hours
- after working hours
- a specific time

Use the Define working hours option to instruct Defender for IoT working hours for your organization.

#### Define rule actions

The following actions can be defined for the rule:

- Indicate if the rule triggers an **Alarm** or **Event**.
- Assign a severity level to the alert (Critical, Major, Minor, Warning).
- Indicate if the alert will include a PCAP file.

The rule is added to the **Customized Alerts Rules** page.

:::image type="content" source="media/how-to-work-with-alerts-sensor/custom-alerts-page.png" alt-text="Custom alerts main page" lightbox="media/how-to-work-with-alerts-sensor/custom-alerts-page.png":::

### Managing customer alert rules

Manage the rules you create from the Custom alert rules page, for example:


- Review the last time the rule was triggered, the number of times the alert was triggered for the rule in the last week, or the last time the rule was modified.
- Enable or disable rules.
- Delete rules.

Select the checkbox next to multiple rules to perform a bulk enable/disable or delete. 

### Tracking changes to custom alert rules

Changes made to custom alert rules are tracked in the event timeline. For example if a user changes a severity level, the protocol detected or any other rule parameter.

**To view changes to the alert rule:**

1. Navigate to the Event timeline page.


### See also

[Manage the alert event](how-to-manage-the-alert-event.md)
