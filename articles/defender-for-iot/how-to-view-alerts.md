---
title: View alerts
description: View alerts according to various categories, and uses search features to help you find alerts of interest.
ms.date: 12/02/2020
ms.topic: how-to
---

# View alerts

This article describes how to view alerts triggered by your sensor and manage them with alert tools.

You can view alerts based on various categories, such as alerts that have been archived or pinned. You also can search for alerts of interest, such as alerts based on an IP or MAC address.  

You can also view alerts from the sensor dashboard.

To view alerts:

- Select **Alerts** from the side menu. The Alerts window displays the alerts that your sensor has detected.

  :::image type="content" source="media/how-to-work-with-alerts-sensor/alerts-screen.png" alt-text="View of the Alerts screen.":::

## View alerts by category

You can view alerts according to various categories from the **Alerts** main view. Select an alert to review details and manage the event.

| Sort by type | Description |
|--|--|
| **Important Alerts** | Alerts sorted by importance. |
| **Pinned Alerts** | Alerts that the user pinned for further investigation. Pinned alerts are not archived and are stored for 14 days in the pinned folder. |
| **Recent Alerts** | Alerts sorted by time. |
| **Acknowledged Alerts** | Alerts that were acknowledged and unhandled, or that were muted and unmuted. |
| **Archived Alerts** | Alerts that the system archived automatically. Only the administrator user can access them. |

## Search for alerts of interest

The Alerts main view provides various search features to help you find alerts of interest.

:::image type="content" source="media/how-to-work-with-alerts-sensor/main-alerts-view.png" alt-text="Alerts learning screenshot.":::

### Text search

Use the Free Search option to search for alerts by text, numbers, or characters.

To search:

- Type the required text in the Free Search field and press Enter on your keyboard.

To clear the search:

- Delete the text in the Free Search field and press Enter on your keyboard.

### Device group or device IP address search

Search for alerts that reference specific IP addresses or device groups. Device groups are created in the device map.

To use advanced filters:

1. Select **Advanced Filters** from the **Alerts** main view.

2. Choose a device group or a device.

3. Select **Confirm**.

4. To clear the search, select **Clear All**.

### Security versus operational alert search

Switch between viewing operational and security alerts:

- **Security** alerts represent potential malware traffic, network anomalies, policy violations, and protocol violations.

- **Operational** alerts represent network anomalies, policy violations, and protocol violations.

When none of the options are selected, all the alerts are displayed.

:::image type="content" source="media/how-to-work-with-alerts-sensor/alerts-security.png" alt-text="Security on the alerts screen.":::

## Alert page options

Alert messages provide the following actions:

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/acknowledge-an-alert-icon.png" border="false"::: to acknowledge an alert.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/unacknowledge-an-alert-icon.png" border="false"::: to unacknowledge an alert.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/pin-an-alert-icon.png" border="false"::: to pin an alert.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/unpin-an-alert-icon.png" border="false"::: to unpin an alert.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/acknowledge-all-alerts-icon.png" border="false"::: to acknowledge all alerts.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/learn-and-acknowledge-all-alerts.png" border="false"::: to learn and acknowledge all alerts.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/export-to-csv.png" border="false"::: to export alert information to a .csv file. Use the **Extended Alert Export** option to export alert information in separate rows for each alert that covers multiple devices.

## Alert pop-up window options

- Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/export-to-pdf.png" border="false"::: icon to download an alert report as a PDF file.

- Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/download-pcap.png" border="false"::: icon to download the PCAP file. The file is viewable with Wireshark, the free network protocol analyzer.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/download-filtered-pcap.png" border="false"::: to download a filtered PCAP file that contains only the relevant alert packets, thereby reducing output file size and allowing a more focused analysis. You can view the file by using Wireshark.

- Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/show-alert-in-timeline.png" border="false"::: icon to show the alert in the event timeline.

- Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/pin-an-alert-icon.png" border="false"::: icon to pin the alert.

- Select the :::image type="icon" source="media/how-to-work-with-alerts-sensor/unpin-an-alert-icon.png" border="false"::: icon to unpin the alert.

- Select :::image type="icon" source="media/how-to-work-with-alerts-sensor/learn-icon.png" border="false"::: to approve the traffic (security analysts and administrators only).

- Select a device to display it in the device map.

## Next steps

[Manage the alert event](how-to-manage-the-alert-event.md)

[Accelerate alert workflows](how-to-accelerate-alert-incident-response.md)
