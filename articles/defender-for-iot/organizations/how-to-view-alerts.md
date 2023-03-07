---
title: View alerts details on the sensor Alerts page - Microsoft Defender for IoT
description: View alerts detected by your Defender for IoT sensor.
ms.date: 06/02/2022
ms.topic: how-to
---

# View alerts on your sensor

Alerts are triggered when sensor engines detect changes or suspicious activity in network traffic that need your attention.

This article describes how to view alerts triggered by your Microsoft Defender for IoT OT network sensors.

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

## View alerts and alert details

This section describes how to view and filter alerts details on your sensor.

**To view alerts in the sensor:**

- Select **Alerts** from the side menu. The  page displays the alerts detected by your sensor.

    :::image type="content" source="media/how-to-view-alerts/view-alerts-main-page.png" alt-text="Screenshot of the sensor Alerts page." lightbox="media/how-to-view-alerts/view-alerts-main-page.png":::

The following information is available from the Alerts page:

| Name | Description |
|--|--|
| **Severity** | The alert severity: Critical, Major, Minor, Warning|
| **Name** | The alert title |
| **Engine** | The Defender for IoT detection engine that detected the activity and triggered the alert. If the event was detected by the Device Builder platform, the value will be Micro-agent.  |
| **Last detection** | The last time the alert activity was detected.   |
| **Status** | Indicates if the alert is new or closed. | 
| **Source Device** | The source device IP address | 
| **Destination Device** | The destination device IP address | 
| **ID** | The alert ID. | 

**To hide or display information:**

1. Select **Edit Columns** from the Alerts page.
1. Add and remove columns as required from the Edit columns dialog box.

**How long are alerts saved?**

- New alerts are automatically closed if no identical traffic detected 14 days after  initial detection. After 90 days of being closed, the alert is removed from the sensor console.  

- If identical traffic is detected after the initial 14 days, the 14-day count for network traffic is reset.

 Changing the status of an alert to *Learn*, *Mute* or *Close* does not impact how long  the alert is displayed in the sensor console.

### Filter the view

Use filter, grouping and text search tools to view alerts of interest to you. 

**To filter by category:**

1. Select **Add filter**.
1. Define a filter and select **Apply**.

    :::image type="content" source="media/how-to-view-alerts/alerts-filter.png" alt-text="Screenshot of Alert filter options.":::

**About the Groups type**

The **Groups** option refers to the Device groups you created in the Device map and inventory.

:::image type="content" source="media/how-to-view-alerts/alert-map-groups.png" alt-text="Screenshot of the Groups filter option.":::

:::image type="content" source="media/how-to-view-alerts/view-alerts-map-groups.png" alt-text="Screenshot of the Groups filter reflected in the Device map.":::

**To view alerts based on a pre-defined category:**

1. Select **Group by** from the Alerts page and choose a category. The page displays the alerts according to the category selected.

## View alert descriptions and details

View more information about the alert, such as the alert description, details about protocols, traffic and entities associated with the alert, alert remediation steps, and more.  

**To view details:**

1. Select an alert.
1. The details pane opens with the alert description, source/destination information and other details.

1. To view more details and review remediation steps,  select **View full details**. The Alert Details pane provides more information about the traffic and devices. Comments may also have been added by your administrator.  

## Gain contextual insight

Gain contextual insight about alert activity by:

- Viewing source and destination devices in map view with other connected devices. Select **Map View** to see the map.

    :::image type="content" source="media/how-to-view-alerts/view-alerts-map.png" alt-text="Screenshot of a map view of the source and detected devices from an alert." lightbox="media/how-to-view-alerts/view-alerts-map.png" :::
 
- Viewing an Event timeline with recent activity of the device. Select **Event Timeline** and use the filter options to customize the information displayed. 
 
    :::image type="content" source="media/how-to-view-alerts/alert-event-timeline.png" alt-text="Screenshot of an alert timeline for the selected alert from the Alerts page." lightbox="media/how-to-view-alerts/alert-event-timeline.png" :::

### Remediate the alert incident

Defender for IoT provides remediation steps you can carry out for the alert. This may include remediating a device or network process that caused Defender for IoT to trigger the alert.
Remediation steps will help SOC teams better understand OT issues and resolutions. Review this information before managing the alert event or taking action on the device or the network.

**To view alert remediation steps:**

1. Select an alert from the Alerts page.
1. In the side pane, select **Take action.**

    :::image type="content" source="media/how-to-view-alerts/alert-remediation-rename.png" alt-text="Screenshot of the alert's Take action section.":::

Your administrator may have added guidance to help you complete the remediation or alert handling. If created comments will appear in the Alert Details section.

:::image type="content" source="media/how-to-view-alerts/alert-comments.png" alt-text="Screenshot of alert comments added to the alert details section of the Alert dialog box.":::

After taking remediation steps, you may want to change the alert status to close the alert.


## Create alert reports

You can generate the following alert reports:

- Export information on one, all or selected alerts to a CSV file
- Export PDF reports

**To export to CSV file:**

1. Select one or several alerts from the Alerts page. To create a csv file for all alert to a csv, don't select anything.
1. Select **Export to CSV**.

**To export a PDF:**

1. Select one or several alerts from the Alerts page.
1. Select **Export to PDF**.

### Download PCAP files

Download a full or filtered PCAP file for a specific alert directly from the sensor. PCAP files provide more detailed information about the network traffic that occurred at the time of the alert event.

**To download a PCAP file:**

1. Select an alert
1. Select **View full details**.
1. Select **Download Full PCAP** or **Download Filtered PCAP**.


## View alerts in the Defender for IoT portal

If your deployment was set up to work with cloud-connected sensors, Alert detections shown on your sensors will also be seen in the Defender for IoT Alerts page, on the Azure portal. 

Viewing alerts in the portal provides significant advantages. For example, it lets you:

- Display an aggregated  view of alert activity in all enterprise sensors
- Understand related MITRE ATT&CK techniques, tactics and stages
- View alerts based on the site
- Change the severity of an alert

    :::image type="content" source="media/how-to-view-alerts/alert-cloud-mitre.png" alt-text="Screenshot of a sample alert shown in the Azure portal.":::

### Manage alert events

You can manage an alert incident by:

- Changing the status of an alert.

- Instructing sensors to learn, close, or mute activity detected.

- Create alert groups for display at SOC solutions.

- Forward alerts to partner vendors: SIEM systems, MSSP systems, and more.

## Next steps

For more information, see:

- [Manage the alert event](how-to-manage-the-alert-event.md)

- [Accelerate alert workflows](how-to-accelerate-alert-incident-response.md)
