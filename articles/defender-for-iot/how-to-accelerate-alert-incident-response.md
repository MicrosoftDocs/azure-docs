---
title: Accelerate alert incident response
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

#

## Accelerate incident workflow with alert comments

Work with alert comments to improve communication between individuals and teams during the investigation of an alert event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image167.png" alt-text="Malicious Activity":::

Use alert commenting to improve:

  - **Workflow Steps**: Provide guidelines regarding alert mitigation steps.

  - **Workflow follow-up**: Notify that steps were taken.

  - **Workflow guidance**: Provide recommendations, insights or warnings about the event.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image188.png" alt-text="Alert Comments":::

The list of available options appears in each Alert. Users can select one or several messages.

**To add alert comments:**

1. On the side menu, select **System Settings**.

2. In the **System Setting** window, select **Alert Comments**.

3. In the **Add comments** box, type the comment text. Use up to 50 characters; do not use commas.

4. Select **Add**.

## Accelerate incident workflow with alert grouping

*Alert Groups* let SOC teams view and filter alerts in their SIEM solutions and manage them based on enterprise security policies and business priorities. For example, alerts regarding new detections are organized in a **Discovery** group. This group includes alerts that deal with new assets detected, new VLANs detected, new user accounts, new MAC addresses detected and more.

Alert grouping is applied when Forwarding Rules are created for the following 3rd party solutions:

  - SYSLOG servers

  - QRadar

  - ArcSight

:::image type="content" source="media/how-to-work-with-alerts-sensor/image189.png" alt-text="Create Forwarding Rule":::

The relevant Alert Group appears in 3rd party output solutions. In the example below, the *Discovery* Alert Group is displayed.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image190.png" alt-text="TimeGenerated UTC":::

**Requirements**

The Alert Group will be shown in supported 3rd party solutions with the following prefixes:

  - **cat** for QRadar, ArcSight, Syslog CEF, Syslog LEEF

  - **Alert Group** for Syslog Text Messages

  - **alert_group** for Syslog Object

These fields should be configured in the 3rd party solution to display the Alert Group name. If there is no alert associated with an Alert Group, the field in the 3rd party solution will display **NA**.

**Default Alert Groups**

The following Alert Groups are automatically defined:
|  |  |  |
|--|--|--|
| Abnormal Communication Behavior | Custom Alerts | Remote access |
| Abnormal HTTP Communication Behavior | Discovery | Restart/ Stop Commands |
| Authentication | Firmware change | Scan |
| Unauthorized Communication Behavior | Illegal commands | Sensor traffic |
| Bandwidth Anomalies | Internet Access | Suspicion of Malware |
| Buffer overflow | Operation Failures | Suspicion of malicious activity |
| Command Failures | Operational issues |  |
| Configuration changes | Programming |  |

Alert Groups are pre-defined. Contact [support.microsoft.com](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099) for details about alerts associated with Alert Groups, and about creating custom Alert Groups.
