---
title: Work with alerts sensor
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Overview

Work with alerts to help you enhance the security and operation of your network. Alerts provide you with information about:

  - Deviations from authorized network activity

  - Protocol and operational anomalies

  - Suspected malware traffic

:::image type="content" source="media/how-to-work-with-alerts-sensor/image159.png" alt-text="Detect address scan":::

Alert management options let users:

  - Instruct sensors to learn activity detected as authorized traffic.

  - Acknowledge reviewing the alert.

  - Instruct sensors to mute events detected with identical assets and comparable traffic.

Additional tools are available that help you enhance and expedite the alert investigation. For example:

  - Add instructional comments for alert reviewers. See [Accelerate Incident Workflow with Alert Comments](./accelerate-incident-workflow-with-alert-comments.md).

  - Create Alert Groups for display at SOC solutions. See [Accelerate Incident Workflow with Alert Grouping](./accelerate-incident-workflow-with-alert-grouping.md).

  - Search for specific alerts; review related PCAP files; view the detected assets and other connected assets in the Asset Map or send alert details to 3rd party systems.

  - Forward alerts to 3<sup>rd</sup> party vendors, for example SIEM systems, MSSP systems, and more.

## Alerts and engines

Alerts are triggered when sensor engines detect changes in network traffic and behavior that require your attention. This section describes the kind of alerts each engine triggers.

See [Engines](./engines.md) for more information about the engines.

| Alert type | Description |
|-|-|
| Policy violation alerts | Triggered when the Policy Violation engine detects a deviation from traffic previously learned. For example: <br /> A new asset is detected.  <br /> A new configuration is detected on an asset. <br /> An asset not defined as a programming device carries out a programming change. <br /> A firmware version changed. |
| Protocol violation alerts | Triggered when the Protocol Violation engine detects packet structures or field values that don't comply with the protocol specification. |  |
| Operational alerts | Triggered when the Operational engine detects network operational incidents or asset malfunctioning. For example, a network asset was stopped using a Stop PLC command | or an interface on a sensor stopped monitoring traffic. |
| Malware alerts | Triggered when the Malware engine detects malicious network activity. For example, known attacks such as Conficker. |
| Anomaly alerts | Triggered when the Anomaly engine detects a deviation. For example an asset is performing network scanning but is not defined as a scanning asset. |

See [Customized Alert Rules](./customized-alert-rules.md) and [Trigger Horizon Custom Alerts](./trigger-horizon-custom-alerts.md) for information about alternative methods for triggering alerts.

## Alerts and sensor reporting

Events reflected in alerts may be calculated when generating Data Mining, Risk Assessment and Attack Vector reports. When you manage these events, the sensor updates the reports accordingly.

For example,

  - Unauthorized connectivity between and asset in a defined subnet and devices located outside the subnet (public) will appear in the Data Mining *Internet Activity* report and Risk Assessment *Internet Connections* section. Once authorized (Learned) these assets will not be calculated when generating these reports.

  - Malware events are reported in Risk Assessment reports. When alerts about these events are muted these assets will not be calculated when generating these reports.
## Accessing alerts

This section describes how to access and search for alerts in the Alerts window. Alerts are also accessible from the Dashboard. See [The Dashboard](./the-dashboard.md) for details about accessing alerts from this location.

**To view alerts triggered for your sensor:**

1. Select **Alerts** from the side-menu. The Alert window displays the alerts detected by your sensor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image160.png" alt-text="View of alerts":::

## Alert window options

Alert messages provide the following actions:

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image179.png" alt-text="tick":::to acknowledge an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image180.png" alt-text="Tick":::to unacknowledge an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image181.png" alt-text="pin"::: to pin an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image182.png" alt-text="unpin":::to unpin an alert

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image183.png" alt-text="acknowledge"::: to acknowledge all alerts

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image184.png" alt-text="learn"::: to learn and acknowledge all the alerts

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image185.png" alt-text="CSV"::: to export the alert list to a CSV file and select the export option. Choose Alert Export for the regular export to CSV option or Extended Alert Export for the possibility to add a separate row for each additional info about an alert in the alert export CSV file.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image36.png" alt-text="PDF"::: icon to download an alert report as a PDF file.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image38.png" alt-text="download"::: icon to download the PCAP file, viewable with Wireshark, the free network protocol analyzer.

  - Select :::image type="content" source="media/how-to-work-with-alerts-sensor/image39.png" alt-text="packets"::: to download a filtered PCAP file that contains only the alert-relevant packets, thereby reducing output file size and allowing a more focused analysis. You can view it using Wireshark.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image186.png" alt-text="Event"::: icon to show the Alert in the Event Timeline.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image181.png" alt-text="Pin"::: icon to pin the alert.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image182.png" alt-text="Unpin":::icon to unpin the alert.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image42.png) icon to approve the traffic (Security Analysts and Administrators only" alt-text="Learn":::.

  - Select the :::image type="content" source="media/how-to-work-with-alerts-sensor/image187.png" alt-text="Close":::icon to close the alert details window.

  - Select an asset to display it in the Asset Map.
