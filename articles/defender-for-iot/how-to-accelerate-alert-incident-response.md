---
title: Accelerate alert workflows
description: Improve alert and incident workflows.
ms.date: 12/02/2020
ms.topic: how-to
---


# Accelerate alert workflows

This article describes how to accelerate alert workflows by using alert comments, alert groups, and custom alert rules in Azure Defender for IoT.  These tools help you:

- Analyze and manage the large volume of alert events detected in your network.

- Pinpoint and handle specific network activity.

## Accelerate incident workflows by using alert comments

Work with alert comments to improve communication between individuals and teams during the investigation of an alert event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/suspicion-of malicious-activity-screen.png" alt-text="Screenshot that shows malicious activity.":::

Use alert comments to improve:

- **Workflow steps**: Provide alert mitigation steps.

- **Workflow follow-up**: Notify that steps were taken.

- **Workflow guidance**: Provide recommendations, insights, or warnings about the event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alert-comment-screen.png" alt-text="Screenshot that shows alert comments.":::

The list of available options appears in each alert. Users can select one or several messages.

To add alert comments:

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Alert Comments**.

3. In the **Add comments** box, enter the comment text. Use up to 50 characters. Commas are not permissible.

4. Select **Add**.

## Accelerate incident workflows by using alert groups

Alert groups let SOC teams view and filter alerts in their SIEM solutions and then manage these alerts based on enterprise security policies and business priorities. For example, alerts about new detections are organized in a discovery group. This group includes alerts that deal with the detection of new devices, new VLANs, new user accounts, new MAC addresses, and more.

Alert groups are applied when you create forwarding rules for the following partner solutions:

  - Syslog servers

  - QRadar

  - ArcSight

:::image type="content" source="media/how-to-work-with-alerts-sensor/create-forwarding-rule.png" alt-text="Screenshot of creating a forwarding rule.":::

The relevant alert group appears in partner output solutions. 

### Requirements

The alert group will appear in supported partner solutions with the following prefixes:

- **cat** for QRadar, ArcSight, Syslog CEF, Syslog LEEF

- **Alert Group** for Syslog text messages

- **alert_group** for Syslog objects

These fields should be configured in the partner solution to display the alert group name. If there is no alert associated with an alert group, the field in the partner solution will display **NA**.

### Default alert groups

The following alert groups are automatically defined:
| Alert type | Reason for alert  | Location of alert |
|--|--|--|
| Abnormal communication behavior | Custom alerts | Remote access |
| Abnormal HTTP communication behavior | Discovery | Restart and stop commands |
| Authentication | Firmware change | Scan |
| Unauthorized communication behavior | Illegal commands | Sensor traffic |
| Bandwidth anomalies | Internet access | Suspicion of malware |
| Buffer overflow | Operation failures | Suspicion of malicious activity |
| Command failures | Operational issues |  |
| Configuration changes | Programming |  |

Alert groups are predefined. For details about alerts associated with alert groups, and about creating custom alert groups, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).

## Customize alert rules

Use custom alert rules to more specifically pinpoint activity of interest to you. 

You can add custom alert rules based on:

- A category, for example a protocol, port or file.
- Source and destination addresses
- A condition based on the category chosen, for example  a function associated with a protocol, a file name, port or transport number.
- A condition based on date and time reference, for example if a detection was made on a specific day or a certain part of the day.

If the sensor detects the activity described in the rule, the alert is sent.
 information that individual sensors detect. For example, define a rule that instructs a sensor to trigger an alert based on a source IP, destination IP, or command (within a protocol). When the sensor detects the traffic defined in the rule, an alert or event is generated.

You can also use alert rule actions to instruct Defender for IoT to:

- Allow users to access PCAP file from the alert.
- Assign an alert severity.
- Generate an event rather than alert. The detected information will appear in the event timeline.

:::image type="content" source="media/how-to-work-with-alerts-sensor/user-defined-rule.png" alt-text="Screenshot that shows a user-defined rule.":::

The alert message indicates that a user-defined rule triggered the alert.

:::image type="content" source="media/how-to-work-with-alerts-sensor/customized-alerts-screen.png" alt-text="Screenshot that shows customized alerts.":::

To create a custom alert rule:

1. Select **Custom Alerts** from the side menu of a sensor.
1. Select the plus sign (**+**) to create a rule.
1. Define a rule name.
1. Select a category or protocol from the **Categories** pane.
1. Define a specific source and destination IP or MAC address, or choose any address.
1. Define one or several rule conditions. Two categories of conditions can be created:
    - Conditions based on unique values associated with the category selected. Select Add and define the values.
    - Conditions based on the when the activity was detected. In the Detections section, select a time period and day in which the detection must occur in order to send the alert. You can choose to send the alert if the activity is detected anytime, during or after working hours. Use the Define working hours option to instruct Defender for IoT working hours for your organization.
1. Define  rule actions: 
    - Indicate if the rule triggers an **Alarm** or **Event**.
    - Assign a severity level to the alert.
    - Indicate if the alert will include a PCAP file.
1. Select **Save**.

The rule is added to the **Customized Alerts Rules** list, where you can review basic rule parameters, the last time the rule was triggered, and more. You can also enable and disable the rule from the list.

:::image type="content" source="media/how-to-work-with-alerts-sensor/customized-alerts-screen.png" alt-text="Screenshot of a user-added customized rule.":::

### See also

[View information provided in alerts](how-to-view-information-provided-in-alerts.md)

[Manage the alert event](how-to-manage-the-alert-event.md)
