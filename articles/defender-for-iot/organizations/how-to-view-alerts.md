---
title: View alerts details on the sensor Alerts page - Microsoft Defender for IoT
description: View alerts detected by your Defender for IoT sensor.
ms.date: 06/02/2022
ms.topic: how-to
---

# View alerts on your OT sensor

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. Alerts are triggered when OT or Enterprise IoT network sensors detect changes or suspicious activity in network traffic that need your attention.

This article describes how to view Defender for IoT alerts directly on an OT network sensor. You can also view alerts on the [Azure portal](how-to-manage-cloud-alerts.md) or an [on-premises management console](how-to-work-with-alerts-on-premises-management-console.md).

For more information, see [Microsoft Defender for IoT alerts](alerts.md).

## Prerequisites

Sign into your sensor console as an **Admin**, **Security Analyst**, or **Viewer** user. 

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## View alerts on an OT sensor

1. On your sensor console, select the **Alerts** page.

    By default, the following details are shown in the grid:

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

    1. To view more details, select the <!--add image-->**Edit columns** button.

        In the **Edit Columns** dialog box, select **Add Column** and any of the following extra columns to add: <!--add more details-->


### Filter alerts displayed

<!--validate this. time range?-->
Use the **Search** box, **Grouping**, and **Add filter** options to filter the alerts displayed by specific parameters or help locate a specific alert.

For example, filter alerts by **Category**:

    :::image type="content" source="media/how-to-view-alerts/alerts-filter.png" alt-text="Screenshot of Alert filter options.":::

Grouping 
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

## Next steps

For more information, see:

- [Manage the alert event](how-to-manage-the-alert-event.md)

- [Accelerate alert workflows](how-to-accelerate-alert-incident-response.md)

## Accelerate incident workflows by using alert comments

Work with alert comments to improve communication between individuals and teams while investigating an alert event.

Use alert comments to improve:

- **Workflow steps**: Provide alert mitigation steps.

- **Workflow follow-up**: Notify that steps were taken.

- **Workflow guidance**: Provide recommendations, insights, or warnings about the event.

The list of available options appears in each alert, and users can select one or several messages. 

**To add alert comments:**

1. On the side menu, select **System Settings** > **Network Monitoring**> **Alert Comments**.

3. Enter a description and select **Submit**.


