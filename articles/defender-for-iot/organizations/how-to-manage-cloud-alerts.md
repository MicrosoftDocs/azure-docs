---
title: View and manage alerts in the Defender for IoT portal on Azure
description: View and manage alerts detected by cloud-connected network sensors in the Defender for IoT portal on Azure. 
ms.date: 02/02/2022
ms.topic: how-to
---

# View and manage alerts on the Defender for IoT portal (Preview)

This article describes Defender for IoT alert capabilities for alerts displayed on the Defender for IoT portal on Azure.

## About alerts

Defender for IoT alerts lets you enhance the security and operation of your network by giving you real-time information about:

- Deviations from authorized network activity and device configurations
- Protocol and operational anomalies
- Suspected malware traffic

:::image type="content" source="media/how-to-view-manage-cloud-alerts/main-alert-page.png" alt-text="Screenshot of the Alerts page in the Azure portal." lightbox="media/how-to-view-manage-cloud-alerts/main-alert-page.png":::

Alerts triggered by Defender for IoT are displayed on the Alerts page in the Azure portal. Use the Alerts page to:

- Learn when an alert was detected.
- Investigate the alert by reviewing an extensive range of alert information. This may include,  source and destination details, PCAP information, vendor, firmware and OS details, and MITRE ATT&CK information.
- Manage the alert by taking remediation steps on the device or network process, or changing the device status or severity.
- Integrate alert details with other Microsoft services. For example, with Microsoft Sentinel playbooks and workbooks. See [About the Defender for IoT and Microsoft Sentinel Integration](concept-sentinel-integration.md).

### How is the Alerts page populated?

The Alerts page is populated by with alert information detected by sensors that are set up for cloud-connection to the Defender for IoT portal on Azure.

Alert details triggered by these sensors and aggregated in the Alerts page:

- Provides comprehensive insight into threats, anomalies, deviations and misconfigurations across your entire network.

- Helps SOC teams better understand how sensors are handling activity across the network.

## Alert types and messages

You can view alert messages you may receive. Reviewing alert types and messages ahead of time will help you plan remediation and integration with playbooks.

For more information, see [Alert types and descriptions](alert-engine-messages.md#alert-types-and-descriptions).

## View alerts

This section describes the information available in the Alerts table.

**To view default alert information:**

1. Navigate to the Defender for IoT portal on Azure.

1. Select **Alerts (Preview)**. The following alert information is available by default.

   | Parameter | Description
    |--|--|
    | **Severity**|  A predefined alert severity assigned by the sensor. The severity can be updated. See [Manage alert status and severity](#manage-alert-status-and-severity) for details.
    | **Name** |  The alert title.
    | **Site** |  The site associated  with the sensor. This site name is defined when you register a sensor with Microsoft  Defender for IoT on the Azure portal. The name can be viewed in the Sites and Sensors page on the portal. See [View onboarded sensors](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors) for information on registered sensors. 
    | **Engine** | The sensor  engine that detected the Operational Technology (OT) traffic. To learn more about engines, see [Detection engines](how-to-control-what-traffic-is-monitored.md#detection-engines). For device builders, the term micro-agent will be displayed.
    | **Detection time** | The first time the alert was detected. The alert traffic may occur several times after the first detection. If the alert Status is **New**, the detection time won't change. If the alert is Closed and the traffic is seen again, a new detection time will be displayed.
    | **Status** | The alert status: New, Active, Closed
    | **Source device** | The IP address, MAC, or device name.
     | **Tactics** | The MITRE ATT&CK stage.

**To view additional information:**

1. Select **Edit columns** from the Alerts page.
1. In the Edit Columns dialog box, select **Add Column** and choose an item to add. The following items are available:


    | Parameter | Description
    |--|--|
    | **Source device address** |The IP address of the source device. |    
    | **Destination device address** | The IP address of the destination device. |
    | **Destination device** | The IP address, MAC, or destination device name.
    | **ID** |The unique alert ID.
    | **Protocol** | The protocol detected in the network traffic for this alert.
    | **Sensor** |  The sensor that detected the alert. 
    | **Zone** | The zone assigned to the sensor that detected the alert.  
    | **Category**| The category associated with the alert, for example scans, operational issues, custom alerts, illegal commands. Filtering the Alerts page by category helps you quickly find information important to you. For a list of categories available, see [Customize the view by category](#customize-the-view-by-category).
    | **Type**| The  internal name of the alert.

### Customize the view

Various Alerts page options help you easily find and view alerts and alert information important to you.

**To filter the view:**

1. Use the **Search**, **Time Range**, and **Filter** options at the top of the Alerts page.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/filters-on-alerts-page.png" alt-text="Screenshot of the filters bar on the Alerts page in the Azure portal.":::

**To group alerts:**

1. Select **Group by** at the top right of the Alerts page.
1. Group the view by the:
   - alert severity
   - alert name
   - site associated with alert 
   - engine associated with the alert

### Customize the view by category

Use the category filter to quickly find information important to you. Using category filters also gives you information regarding the number of alerts for each category. For example, 50 operational alerts, 13 firmware changes or 23 command failures.

:::image type="content" source="media/how-to-view-manage-cloud-alerts/category-filter.png" alt-text="Screenshot of the Category filter option in Alerts page in the Azure portal.":::

The following categories are available:
- Abnormal Communication Behavior
- Abnormal HTTP Communication Behavior
- Authentication
- Backup
- Bandwidth Anomalies
- Buffer overflow
- Command Failures
- Configuration changes
- Custom Alerts
- Discovery
- Firmware change
- Illegal commands 
- Internet Access
- Operation Failures 
- Operational issues
- Programming
- Remote access
- Restart/Stop Commands
- Scan
- Sensor traffic
- Suspicion of malicious activity
- Suspicion of Malware
- Unauthorized Communication Behavior
- Unresponsive

### Understand the alert count breakdown

The number of alerts currently detected appears on the top-left section of the Alerts page. You may want more specific information about the alert count breakdown, for example the number of alerts associated with a certain alert severity, protocol or site.

**To view an alert count breakdown:**

1. Select **Group by** and select a group. The number of alerts is displayed for each group.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/group-by-severity.png" alt-text="Screenshot of the Alerts page, filtered by severity.":::

1. Alternatively use the **Add filter** option to choose a subject of interest and select **Column.** The column dropdown shows the number alerts associated with the column name.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-count-breakdown.png" alt-text="Screenshot of Alert filters showing protocols with count for each protocol.":::

## View alert descriptions and other details

View more information about the alert, such as:
- the alert description
- links to related MITRE ATT&CK information
- details about protocols
- traffic and entities associated with the alert
- alert remediation steps  

**To view details:**

1. Select an alert.
1. The details pane opens with the alert description, source, and destination information and other details.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-detected.png" alt-text="Screenshot of an alert selected from Alerts page in the Azure portal.":::

1. To view more details and review remediation steps,  select **View full details**. The Alert Details pane provides more information about source device and related entities. Related links in the MITRE Partnership website are also available.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-full-details.png" alt-text="Screenshot of a selected alert with full details.":::
  
If you're integrating with Microsoft Sentinel, the Alert details and entity information are sent to Microsoft Sentinel.  

### Alert remediation steps

Defender for IoT provides remediation steps you can carry out for the alert. Remediation steps are designed to help SOC teams better understand OT issues and resolutions.

**To view the alert remediation:**

1. Select an alert from the Alerts page.
1. Select **Take action** in the dialog box that opens.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/take-action-cloud-alert.png" alt-text="Screenshot of a remediation action for a sample alert in the Azure portal.":::

## Manage alert status and severity

You can change the alert status and severity for a single alert or for a group of alerts.

**To change the alert status:**

1. Select an alert or group of alerts.
1. Select **Change status** and select a status (New, Active, Closed).

Changes to status aren't reflected in the on-premises management console or sensor.

**To change the alert severity:**

1. Select an alert or group of alerts.
1. Select **Change severity** and select a severity.

Changes to severity aren't reflected in the on-premises management console or sensor.

## On-premises alert management

Users working in hybrid deployments may be managing alerts on both the Microsoft Defender for IoT portal, Alerts page, and on on-premises sensors and the management console.

Users working with alerts in Azure and on-premises should understand how alert management between the portal and the on-premises components operates.

 Parameter | Description
|--|--|
| **Alert Exclusion rules**|  Alert *Exclusion rules* defined in the on-premises management console affect the rules detected by managed sensors. As a result, the alerts excluded be these rules won't be displayed in the Alerts page. See [Create alert exclusion rules](how-to-work-with-alerts-on-premises-management-console.md#create-alert-exclusion-rules) for more information.
| **Managing alerts on-premises**  |  Alerts  **Learned**,  **Acknowledged**, or **Muted** in the on-premises management console or in sensors aren't simultaneously updated in Alerts page on the Defender for IoT Cloud Alerts page. This means that this alert will stay open on the Cloud. However another alert  won't be triggered from the on-premises components for this activity.
| **Managing alert in the portal Alerts page** | Changing the status of an alert to **New**, **Active**, or **Closed** on the Alerts page or changing the alert severity on the Alerts page doesn't affect the alert status or severity  in the on-premises management console or sensors.

## Next steps

For more information, see [Gain insight into global, regional, and local threats](how-to-gain-insight-into-global-regional-and-local-threats.md#gain-insight-into-global-regional-and-local-threats).