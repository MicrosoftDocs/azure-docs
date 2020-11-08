---
title: Work with the sensor console dashboard
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/03/2020
ms.topic: article
ms.service: azure
---

# The dashboard

The dashboard allows you to quickly view the security status of your network. It provides a high-level overview of threats to your whole system on a timeline along with information about related devices, including:

- Alerts at different severity levels:

- Critical

- Major

- Minor

- Warnings

- The two gauges in the center of the page indicate the Packets per Second (PPS), and Unacknowledged Alerts (UA). **PPS** is the number of packets acknowledged by the system per second. **UA** is the number of alerts that have not been acknowledged yet.

- List of unacknowledged alerts with their description.

- Timeline with the alert description.

:::image type="content" source="media/dashboard-alert-screen.png" alt-text="Dashboard":::

## Viewing the latest alerts

The Unacknowledged Alerts (UA) gauge in the center of the page indicates the number of such alerts. To view a list of alerts, select **More Alerts** at the bottom of the dashboard page or select **Alerts** on the side menu.

:::image type="content" source="media/unhandled-alerts-list.png" alt-text="Unacknowledged Alerts":::

## Status boxes

Each status box is described in this section.

| Status Box and Gauges | Description |
| -------------- | -------------- |
| :::image type="content" source="media/critical-alert-status-box.png" alt-text="Critical Alerts"::: | **Critical Alerts** - the box at the top middle of the page indicates the number of critical alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                              |
| :::image type="content" source="media/major-alert-status-box.png" alt-text="Major Alerts"::: | **Major Alerts** - the box at the top right of the page indicates the number of major alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                                     |
| :::image type="content" source="media/minor-alert-status-box.png" alt-text="Minor Alerts"::: | **Minor Alerts** - the box at the bottom left of the page indicates the number of minor alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                                   |
| :::image type="content" source="media/warnings-alert-status-box.png" alt-text="Warning Alerts"::: | **Warning Alerts** - the box at the bottom middle of the page indicates the number of warning alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any.                             |
| :::image type="content" source="media/all-alert-status-box.png" alt-text="All Alerts"::: | **All Alerts** - the box at the bottom right of the page indicates the total number of critical, major, minor, and warning alerts. Select this box to display descriptions of the alerts on the timeline and on the list under the gauges, if any. |
| :::image type="content" source="media/packets-per-second-guage.png" alt-text="Packets Per Second"::: | **Packets Per Second (PPS)** - the PPS metric is an indicator of the performance of the network. |
| :::image type="content" source="media/unacknowledged-events-guage.png" alt-text="Unacknowledged Events (UA)"::: | **Unacknowledged Events** - this metric indicates the number of unacknowledged events.

## Using the timeline

The alerts are displayed along a vertical timeline that includes date and time information.

The Timeline graphically displays:

- Critical Alerts

- Major Alerts

- Minor Alerts

- Warning Alerts

:::image type="content" source="media/timeline-of-events.png" alt-text="Timeline graph":::

## Viewing alerts

Select the down arrow **V** at the bottom of an alert box to display the alert entry and devices information.

:::image type="content" source="media/extended-alert-screen.png" alt-text="Alert entry and devices information":::

- Select the device or **Show Devices** to display the physical mode map. The subjected devices are highlighted.

- Select :::image type="content" source="media/excel-icon.png" alt-text="Excel"::: to export a CSV file about the alert.

- **Administrators and Security Analysts Only** — If desired, select :::image type="content" source="media/approve-all-icon.png" alt-text="Acknowledge all"::: to **Acknowledge All** associated alerts.

- Select the alert entry to view the type and the description of the alert:

- Select :::image type="content" source="media/pdf-icon.png" alt-text="PDF":::to download an alert report as a PDF file.

- Select :::image type="content" source="media/pin-icon.png" alt-text="Pin":::to pin or unpin the alert.

- Select :::image type="content" source="media/download-icon.png" alt-text="Download"::: to investigate the alert by downloading the PCAP file containing a network protocol analysis.

- Select :::image type="content" source="media/cloud-download-icon.png" alt-text="Cloud"::: to download a filtered PCAP file that contains only the alert-relevant packets, thereby reducing output file size and allowing a more focused analysis. You can view it using [Wireshark](https://www.wireshark.org/).

- Select :::image type="content" source="media/navigate-icon.png" alt-text="Navigation"::: to navigate to the event timeline at the time of the requested alert.

- **Administrators and Security Analysts only** - change the state of the alert from unacknowledged to acknowledged by selecting :::image type="content" source="media/acknowledge-icon.png" alt-text="Acknowledge"::: and learn the alert by selecting :::image type="content" source="media/learn-icon.png" alt-text="Learn":::.

:::image type="content" source="media/unauthorized-internet-connectivity-detection.png" alt-text="Unauthorized Internet connectivity detected":::
