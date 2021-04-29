---
title: Work with the sensor console dashboard
description: The dashboard allows you to quickly view the security status of your network. It provides a high-level overview of threats to your whole system on a timeline along with information about related devices.
ms.date: 11/03/2020
ms.topic: article
---

# The dashboard

The dashboard allows you to quickly view the security status of your network. It provides a high-level overview of threats to your whole system on a timeline along with information about related devices, including:

- Alerts at different severity levels:

- Critical

- Major

- Minor

- Warnings

- The two indicators in the center of the page show the Packets per Second (PPS), and Unacknowledged Alerts (UA). **PPS** is the number of packets acknowledged by the system per second. **UA** is the number of alerts that have not been acknowledged yet.

- List of unacknowledged alerts with their description.

- Timeline with the alert description.

:::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/dashboard-alert-screen-v2.png" alt-text="Dashboard":::

## Viewing the latest alerts

The Unacknowledged Alerts (UA) gauge in the center of the page indicates the number of such alerts. To view a list of alerts, select **More Alerts** at the bottom of the dashboard page or select **Alerts** on the side menu.

:::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/unhandled-alerts-list.png" alt-text="Unacknowledged Alerts":::

## Status boxes

Each status box is described in this section.

| Status Box and Gauges | Description |
| -------------- | -------------- |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/critical-alert-status-box-v2.png" alt-text="Critical Alerts"::: | **Critical Alerts** - the box at the top middle of the page indicates the number of critical alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                              |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/major-alert-status-box-v2.png" alt-text="Major Alerts"::: | **Major Alerts** - the box at the top right of the page indicates the number of major alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                                     |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/minor-alert-status-box-v2.png" alt-text="Minor Alerts"::: | **Minor Alerts** - the box at the bottom left of the page indicates the number of minor alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                                   |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/warnings-alert-status-box-v2.png" alt-text="Warning Alerts"::: | **Warning Alerts** - the box at the bottom middle of the page indicates the number of warning alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                             |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/all-alert-status-box-v2.png" alt-text="All Alerts"::: | **All Alerts** - the box at the bottom right of the page indicates the total number of critical, major, minor, and warning alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any. |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/packets-per-second-gauge-v2.png" alt-text="Packets Per Second"::: | **Packets Per Second (PPS)** - the PPS metric is an indicator of the performance of the network. |
| :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/unacknowledged-events-gauge-v2.png" alt-text="Unacknowledged Events (UA)"::: | **Unacknowledged Events** - this metric indicates the number of unacknowledged events.

## Using the timeline

The alerts are displayed along a vertical timeline that includes date and time information.

The Timeline graphically displays:

- Critical Alerts

- Major Alerts

- Minor Alerts

- Warning Alerts

:::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/timeline-of-events.png" alt-text="Timeline graph":::

## Viewing alerts

Select the down arrow **V** at the bottom of an alert box to display the alert entry and devices information.

:::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/extended-alert-screen.png" alt-text="Alert entry and devices information":::

- Select the device to display the physical mode map. The subjected devices are highlighted.

- Click anywhere in the alert box to display additional details regarding the alert. A popup will display similar to the one below

- Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/excel-icon.png" alt-text="Excel"::: to export a CSV file about the alert.

- Administrators and Security Analysts Only — Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/approve-all-icon.png" alt-text="Acknowledge all"::: to **Acknowledge All** associated alerts.

- Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/pdf-icon.png" alt-text="PDF":::to download an alert report as a PDF file.

- Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/pin-icon.png" alt-text="Pin":::to pin or unpin the alert. Selecting to pin will add it to the **Pinned Alerts** window on the **Alerts** screen.

- Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/download-icon.png" alt-text="Download"::: to investigate the alert by downloading the related PCAP file containing a network protocol analysis.

- Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/cloud-download-icon.png" alt-text="Cloud"::: to download a related filtered PCAP file that contains only the alert-relevant packets, thereby reducing output file size and allowing a more focused analysis. You can view it using [Wireshark](https://www.wireshark.org/).

- Select :::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/navigate-icon.png" alt-text="Navigation"::: to navigate to the event timeline at the time of the requested alert. This allows you to assess other events that may be happening around the specific alert.

- Administrators and Security Analysts only - change the status of the alert from unacknowledged to acknowledged. Select Learn to approve detected activity.

:::image type="content" source="media/how-to-work with-the-sensor-console-dashboard/unauthorized-internet-connectivity-detection-v3.png" alt-text="Unauthorized Internet connectivity detected":::

## See also

[Work with alerts on your sensor](how-to-work-with-alerts-on-your-sensor.md)
