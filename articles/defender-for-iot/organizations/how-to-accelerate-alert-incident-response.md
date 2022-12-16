---
title: Accelerate alert workflows
description: Improve alert and incident workflows.
ms.date: 03/10/2022
ms.topic: how-to
---


# Accelerate alert workflows

This article describes how to accelerate alert workflows using alert comments, alert groups, and custom alert rules for standard protocols and proprietary protocols in Microsoft Defender for IoT. These tools help you

- Analyze and manage the large volume of alert events detected in your network.

- Pinpoint and handle specific network activity.

## Accelerate incident workflows by using alert comments

Work with alert comments to improve communication between individuals and teams while investigating an alert event.

Use alert comments to improve:

- **Workflow steps**: Provide alert mitigation steps.

- **Workflow follow-up**: Notify that steps were taken.

- **Workflow guidance**: Provide recommendations, insights, or warnings about the event.

The list of available options appears in each alert, and users can select one or several messages. 

**To add alert comments:**

1. On the side menu, select **System Settings** > **Network Monitoring**> **Alert Comments**.

3. Enter a description and select **Submit**.


## Accelerate incident workflows by using alert groups

Alert groups let SOC teams view and filter alerts in their SIEM solutions and then manage these alerts based on enterprise security policies and business priorities. For example, alerts about new detections are organized in a discovery group. This group includes alerts that deal with detecting new devices, new VLANs, new user accounts, new MAC addresses, and more.

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

These fields should be configured in the partner solution to display the alert group name. If there's no alert associated with an alert group, the field in the partner solution will display **NA**.

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

Add custom alert rules to pinpoint specific activity needed for your organization. The rules can refer, among others, to particular protocols, source or destination addresses, or a combination of parameters.
For example, for an environment running MODBUS, you can define a rule to detect any written commands to a memory register on a specific IP address and ethernet destination. Another example would be setting an alert about any access to a particular IP address.

Specify in the custom alert rule what action Defender for IT should take when the alert is triggered. For example, the action can be allowing users to access PCAP files from the alert, assigning alert severity, or generating an event that shows in the event timeline. Alert messages show that the alert was generated from a custom alert rule.

**To create a custom alert rule**:

1. On the sensor console, select **Custom alert rules** > **+ Create rule**.

1. In the **Create custom alert rule** pane that shows on the right, define the following fields:

    |Name  |Description  |
    |---------|---------|
    |**Alert name**     | Enter a meaningful name for the alert.        |
    |**Alert protocol**     | Select the protocol you want to detect. <br> In specific cases, select one of the following protocols: <br> <br> - For a database data or structure manipulation event, select **TNS** or **TDS**. <br> - For a file event, select **HTTP**, **DELTAV**, **SMB**, or **FTP**, depending on the file type. <br> - For a package download event, select **HTTP**. <br> - For an open ports (dropped) event, select **TCP** or **UDP**, depending on the port type. <br> <br> To create rules that track specific changes in one of your OT protocols, such as S7 or CIP, use any parameters found on that protocol, such as `tag` or `sub-function`.        |
    |**Message**     | Define a message to display when the alert is triggered. Alert messages support alphanumeric characters and any traffic variables detected. <br> <br> For example, you might want to include the detected source and destination addresses. Use curly brackets (**{}**) to add variables to the alert message.        |
    |**Direction**     | Enter a source and/or destination IP address where you want to detect traffic.        |
    |**Conditions**     | Define one or more conditions that must be met to trigger the alert. Select the **+** sign to create a condition set with multiple conditions that use the **AND** operator. If you select a MAC address or IP address as a variable, you must convert the value from a dotted-decimal address to decimal format. <br><br> Note that the **+** sign is enabled only after selecting an **Alert protocol** from above. <br> You must add at least one condition in order to create a custom alert rule.        |
    |**Detected**     | Define a date and/or time range for the traffic you want to detect. You can customize the days and time range to fit with maintenance hours or set working hours.      |
    |**Action**     | Define an action you want Defender for IoT to take automatically when the alert is triggered.        |

     For example:
     
     :::image type="content" source="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png" alt-text="Screenshot of the Create custom alert rule pane for creating custom alert rules." lightbox="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png":::

1. Select **Save** when you're done to save the rule.

### Edit a custom alert rule

To edit a custom alert rule, select the rule and then select the options (**...**) menu > **Edit**. Modify the alert rule as needed and save your changes.

Edits made to custom alert rules, such as changing a severity level or protocol, are tracked in the **Event timeline** page on the sensor console. For more information, see [Track sensor activity](how-to-track-sensor-activity.md).

### Disable, enable, or delete custom alert rules

Disable custom alert rules to prevent them from running without deleting them altogether.

In the **Custom alert rules** page, select one or more rules, and then select **Enable**, **Disable**, or **Delete** in the toolbar as needed.

## Next steps

For more information, see [Manage the alert event](how-to-manage-the-alert-event.md).
