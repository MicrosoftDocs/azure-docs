---
title: Accelerate alert incident response
description: Work with alert comments to improve communication between individuals and teams during the investigation of an alert event.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/01/2020
ms.service: azure
ms.topic: how-to
---


# Accelerate Incident workflows

This article describes how to accelerate alert workflows using Defender for IoT *alert comments* and *alert groups*. These tools help you analyze and manage the large volume of alert events detected in your network.

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
