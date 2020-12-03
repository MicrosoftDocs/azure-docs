---
title: View Alerts
description: View alerts according to various categories, and use search features to help you find alerts of interest.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/02/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# View alerts

This article describes how to view alerts triggered by your sensor and manage them with alert tools.

You can view alerts based on various categories, for example alerts that have been archived or pinned; or search for alerts of interest for example, based on an IP or MAC address.  

Alerts can also be viewed from the sensor Dashboard.

To view alerts:

1. Select **Alerts** from the side-menu. The Alert window displays the alerts detected by your sensor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alerts-screen.png" alt-text="View of the Alerts screen.":::

## View alerts by category

You can view alerts according to various categories from the **Alerts, Main View**, and use search features to help you find alerts of interest. Select the alert required to review details and manage the event.

| Sort by type | Description |
|--|--|
| **Important Alerts** | Alerts sorted by importance. |
| **Pinned Alerts** | Alerts that were pinned by the user for further investigation. Pinned alerts are not archived, and are stored for 14 days in the pinned folder |
| **Recent Alerts** | Alerts sorted by time. |
| **Acknowledged Alerts** | Displays alerts that were acknowledged and unhandled or muted and unmuted. |
| **Archived Alerts** | Alerts that were archived automatically by the system. Accessible by the administrator user only. |

## Search for alerts of interest

The alerts main view provides various search features to help you find alerts of interest.

:::image type="content" source="media/how-to-work-with-alerts-sensor/main-alerts-view.png" alt-text="Alerts learning screenshot.":::

### Text search 

Use the **Free Search** option to search for alerts by text, numbers, or characters.

To search:

  - Type the required text in the **Free Search** field and press Enter on your keyboard.

To clear the search:

  - Delete the text in the **Free Search** field and press Enter on your keyboard.

### Device group or device IP address search

Search for alerts that reference specific IP addresses or *Device Groups*. Device Groups are created in the Device map.

**To use Advanced Filters:**

1. Select **Advanced Filters** from the alerts main view.

2. Choose a device group or an device(s).

3. Select **Confirm**.

4. To clear the search, select **Clear All**.

### Security versus operational alert search

Toggle between viewing operation and security alerts:

  - **Security** alerts represent potential Malware traffic detected, network anomalies, policy, and protocol violations.

  - **Operational** alerts represent network anomalies, policy, and protocol violations.

When none of the options are selected, all the alerts are displayed.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alerts-security.png" alt-text="Security on alerts screen.":::

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

## Next steps

[Manage the alert event](how-to-manage-the-alert-event.md)

[Accelerate Alert workflows](how-to-accelerate-alert-incident-response.md)
