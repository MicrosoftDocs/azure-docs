---
title: Work with alerts on your sensor
description: Work with alerts to help you enhance the security and operation of your network.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/30/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Overview

Work with alerts to help you enhance the security and operation of your network. Alerts provide you with information about:

- Deviations from authorized network activity

- Protocol and operational anomalies

- Suspected malware traffic

:::image type="content" source="media/how-to-work-with-alerts-sensor/address-scan-detected-screen.png" alt-text="Detect address scan.":::

Alert management options let users:

- Instruct sensors to learn activity detected as authorized traffic.

- Acknowledge reviewing the alert.

- Instruct sensors to mute events detected with identical assets and comparable traffic.

Additional tools are available that help you enhance and expedite the alert investigation. For example,

  - Add instructional comments for alert reviewers.

  - Create Alert Groups for display at SOC solutions. 

  - Search for specific alerts; review related PCAP files; view the detected devices and other connected devices in the Device Map or send alert details to partner systems.

  - Forward alerts to partner vendors, for example SIEM systems, MSSP systems, and more.

## Alerts and engines

Alerts are triggered when sensor engines detect changes in network traffic and behavior that require your attention. This article describes the kind of alerts each engine triggers.

| Alert type | Description |
|-|-|
| Policy violation alerts | Triggered when the Policy violation engine detects a deviation from traffic previously learned. For example, <br /> - A new device is detected.  <br /> - A new configuration is detected on a device. <br /> - A device not defined as a programming device carries out a programming change. <br /> - A firmware version changed. |
| Protocol violation alerts | Triggered when the Protocol violation engine detects packet structures or field values that don't comply with the protocol specification. | 
| Operational alerts | Triggered when the Operational engine detects network operational incidents or device malfunctioning. For example, a network device was stopped using a Stop PLC command, or an interface on a sensor stopped monitoring traffic. |
| Malware alerts | Triggered when the Malware engine detects malicious network activity. For example, known attacks such as Conficker. |
| Anomaly alerts | Triggered when the Anomaly engine detects a deviation. For example, a device is performing network scanning but is not defined as a scanning device. |

## Alerts and sensor reporting

Activity reflected in alerts may be calculated when generating Data Mining, Risk Assessment, and Attack Vector reports. When you manage these events, the sensor updates the reports accordingly.

For example,

  - Unauthorized connectivity between a device in a defined subnet and devices located outside the subnet (public) will appear in the Data Mining *Internet Activity* report and Risk Assessment *Internet Connections* section. Once authorized (Learned) these devices are calculated when generating these reports.

  - Malware events detected on network devices are reported in Risk Assessment reports. When alerts about malware events are *muted*, devices impacted will not be calculated in the Risk Assessment report.

## Accessing alerts

This article describes how to access and search for alerts in the Alerts window. Alerts are also accessible from the Dashboard. 

**To view alerts triggered for your sensor:**

1. Select **Alerts** from the side-menu. The Alert window displays the alerts detected by your sensor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alerts-screen.png" alt-text="View of the Alerts screen.":::

## Alert window options

Alert messages provide the following actions:

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/acknowledge-an-alert-icon.png" border="false"::: to acknowledge an alert.

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/unacknowledge-an-alert-icon.png" border="false"::: to unacknowledge an alert.

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/pin-an-alert-icon.png" border="false"::: to pin an alert.

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/unpin-an-alert-icon.png" border="false"::: to unpin an alert.

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/acknowledge-all-alerts-icon.png" border="false"::: to acknowledge all alerts

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/learn-and-acknowledge-all-alerts.png" border="false"::: to learn and acknowledge all the alerts

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/export-to-csv.png" border="false"::: to export the alert list to a CSV file and select the export option. Choose Alert Export for the regular export to CSV option or Extended Alert Export for the possibility to add a separate row for each additional info about an alert in the alert export CSV file.

  - Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/export-to-pdf.png" border="false"::: icon to download an alert report as a PDF file.

  - Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/download-pcap.png" border="false"::: icon to download the PCAP file. The file is viewable with Wireshark, the free network protocol analyzer.

  - Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/download-filtered-pcap.png" border="false"::: to download a filtered PCAP file that contains only the alert relevant packets, thereby reducing output file size and allowing a more focused analysis. You can view it using Wireshark.

  - Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/show-alert-in-timeline.png" border="false"::: icon to show the Alert in the Event Timeline.

  - Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/pin-an-alert-icon.png" border="false"::: icon to pin the alert.

  - Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/unpin-an-alert-icon.png" border="false"::: icon to unpin the alert.

  - Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/learn-icon.png" border="false"::: to  approve the traffic (Security Analysts and Administrators only)

  - Select a device to display it in the Device Map.

## See also

[Manage the alert event](how-to-manage-the-alert-event.md)
