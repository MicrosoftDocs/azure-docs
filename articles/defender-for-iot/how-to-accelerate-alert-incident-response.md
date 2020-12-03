---
title: Accelerate alert workflows
description: Improve alert and incident workflows
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/02/2020
ms.service: azure
ms.topic: how-to
---


# Accelerate Alert workflows

This article describes how to accelerate alert workflows using Defender for IoT alert comments,  alert groups, and custom alert rules.  These tools help you:

- Analyze and manage the large volume of alert events detected in your network

- Pinpoint and handle specific network activity

## Accelerate incident workflow with alert comments

Work with alert comments to improve communication between individuals and teams during the investigation of an alert event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/suspicion-of malicious-activity-screen.png" alt-text="Malicious activity":::

Use alert commenting to improve:

- **Workflow steps**: Provide guidelines regarding alert mitigation steps.

- **Workflow follow-up**: Notify that steps were taken.

- **Workflow guidance**: Provide recommendations, insights, or warnings about the event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alert-comment-screen.png" alt-text="Alert comments":::

The list of available options appears in each alert. Users can select one or several messages.

To add alert comments:

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Alert Comments**.

3. In the **Add comments** box, type the comment text. Use up to 50 characters; commas are not permissible.

4. Select **Add**.

## Accelerate incident workflow with alert grouping

Alert groups let SOC teams view and filter alerts in their SIEM solutions and manage them based on enterprise security policies and business priorities. For example, alerts regarding new detections are organized in a discovery group. This group includes alerts that deal with new devices detected, new VLANs detected, new user accounts, new MAC addresses detected and more.

Alert grouping is applied when Forwarding Rules are created for the following partner solutions:

  - SYSLOG servers

  - QRadar

  - ArcSight

:::image type="content" source="media/how-to-work-with-alerts-sensor/create-forwarding-rule.png" alt-text="Create forwarding rule":::

The relevant alert group appears in partner output solutions. 

**Requirements**

The alert group will be shown in supported partner solutions with the following prefixes:

  - **cat** for QRadar, ArcSight, Syslog CEF, Syslog LEEF

  - **Alert Group** for Syslog text messages

  - **alert_group** for Syslog Object

These fields should be configured in the partner solution to display the alert group name. If there is no alert associated with an alert group, the field in the partner solution will display **NA**.

**Default alert groups**

The following alert groups are automatically defined:
|  |  |  |
|--|--|--|
| Abnormal communication behavior | Custom alerts | Remote access |
| Abnormal HTTP communication behavior | Discovery | Restart and stop commands |
| Authentication | Firmware change | Scan |
| Unauthorized communication behavior | Illegal commands | Sensor traffic |
| Bandwidth anomalies | Internet access | Suspicion of malware |
| Buffer overflow | Operation failures | Suspicion of malicious activity |
| Command Failures | Operational issues |  |
| Configuration changes | Programming |  |

Alert groups are pre-defined. Contact [support.microsoft.com](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099) for details about alerts associated with alert groups, and about creating custom alert groups.

## Customize alert rules

You can add custom alert rules based on information detected by individual sensors. For example, define a rule that instructs a sensor to trigger an alert based on a source IP address, destination IP address, command (within a protocol). When the sensor detects the traffic defined in the rule, an alert or event is generated.

The alert message indicates that a user-defined rule triggered the alert.

:::image type="content" source="media/how-to-work-with-alerts-sensor/customized-alerts-screen.png" alt-text="Customized alerts screenshot":::

To create a custom alert rule:

1. Select Custom Alerts from the Side menu of a sensor.
2. Select the + sign to create a rule.

 :::image type="content" source="media/how-to-work-with-alerts-sensor/user-defined-rule.png" alt-text="A user-defined rule.":::

3. Define a rule name.
4. Select a category or protocol from the categories pane.
5. Define a specific source and destination IP address, MAC address, or choose any address.
6. Add a condition. A list of conditions and their properties is unique for each category. You can select more than one condition for each alert.
7. Indicate if the rule triggers an alarm or event.
8. Assign a severity level to the alert.
9. Indicate if the alert will include a PCAP file.
10. Select **Save.**

The rule is added to the Customized Alerts rules list, where you can review basic rule parameters, the last time the rule was triggered, and more. You can also enable and disable the rule from the list.

:::image type="content" source="media/how-to-work-with-alerts-sensor/customized-alerts-screen.png" alt-text="User added customized rule screenshot.":::

### See also

[View information provided in alerts](how-to-view-information-provided-in-alerts.md)

[Manage the alert event](how-to-manage-the-alert-event.md)