---
title: Microsoft Defender for IoT alerts
description: Learn about the resources for managing Microsoft Defender for IoT alerts across the Azure portal, OT network sensors, and on-premises management consoles.
ms.date: 03/10/2022
ms.topic: how-to
---

# Microsoft Defender for IoT alerts


### From the portal page

Defender for IoT alerts enhance your network security and operations with real-time details about events logged, such as:

- Deviations from authorized network activity and device configurations
- Protocol and operational anomalies
- Suspected malware traffic

:::image type="content" source="media/how-to-view-manage-cloud-alerts/main-alert-page.png" alt-text="Screenshot of the Alerts page in the Azure portal." lightbox="media/how-to-view-manage-cloud-alerts/main-alert-page.png":::

Use the **Alerts** page on the Azure portal to take any of the following actions:

- **Understand when an alert was detected**.

- **Investigate the alert** by reviewing alert details, such as the traffic's source and destination, vendor, related firmware and operating system, and related MITRE ATT&CK tactics.

- **Manage the alert** by taking remediation steps on the device or network process, or changing the device status or severity.

- **Integrate alert details with other Microsoft services**, such as Microsoft Sentinel playbooks and workbooks. For more information, see [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md).

The alerts displayed on the Azure portal are alerts that have been detected by cloud-connected, Defender for IoT sensors. For more information, see [Alert types and descriptions](alert-engine-messages.md).

> [!TIP]
> We recommend that you review alert types and messages to help you understand and plan remediation actions and playbook integrations.



### From the sensor page

Once an alert is selected, you can view comprehensive details about the alert activity, for example,

- Detected protocols
- Source and destination IP and MAC addresses
- Vendor information
- Device type information

You can also gain contextual information about the alert by viewing the source and destination in the Device map and viewing related events in the Event timeline.

To help you quickly pinpoint information of interest, you can view alerts:

- Based on various categories, such as alert severity, name or status
- By using filters
- By using free text search to find alert information of interest to you.  

After you review the information in an alert, you can carry out various forensic steps to guide you in managing the alert event. For example:

- Analyze recent device activity (data-mining report).

- Analyze other events that occurred at the same time (event timeline).

- Analyze comprehensive event traffic (PCAP file).


### Manage alert events

You can manage an alert incident by:

- Changing the status of an alert.

- Instructing sensors to learn, close, or mute activity detected.

- Create alert groups for display at SOC solutions.

- Forward alerts to partner vendors: SIEM systems, MSSP systems, and more.


## About managing alerts

The following options are available for managing alerts:

 | Action | Description |
 |--|--|
| **Remediate** |Remediate a device or network process that caused Defender for IoT to trigger the alert. For more information, see [View remediation steps](#view-remediation-steps).|
| **Learn** | Authorize the detected traffic. For more information, see [Learn and unlearn alert traffic](#learn-and-unlearn-alert-traffic). |
| **Mute** | Continuously ignore activity with identical devices and comparable traffic. For more information, see [Mute and unmute alerts](#mute-and-unmute-alerts).
| **Change status** |  Change the alert status to Closed or New. For more information, see [Close the alert](#close-the-alert). |
| **Forward to partner solutions** | Create Forwarding rules that send alert details to integrated solutions, for example to Microsoft Sentinel, Splunk or Service Now. For more information, see [Forward alert information](how-to-forward-alert-information-to-partners.md#forward-alert-information)  |


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