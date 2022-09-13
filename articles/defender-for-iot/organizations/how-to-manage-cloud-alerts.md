---
title: View and manage alerts in Microsoft Defender for IoT on the Azure portal
description: View and manage alerts detected by cloud-connected network sensors in Microsoft Defender for IoT on the Azure portal.
ms.date: 06/30/2022
ms.topic: how-to
---

# View and manage alerts from the Azure portal

> [!IMPORTANT]
> The **Alerts** page is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes how to manage your alerts from Microsoft Defender for IoT on the Azure portal.

If you're integrating with Microsoft Sentinel, the alert details and entity information are also sent to Microsoft Sentinel, where you can also view them from the **Alerts** page.

## About alerts

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

## View alerts

This section describes how to view alert details in the Azure portal.

**To view Defender for IoT alerts on the Azure portal**:

Go to **Defender for IoT** > **Alerts (Preview)**.

The following alert details are displayed by default in the grid:

| Column | Description
|--|--|
| **Severity**|  A predefined alert severity assigned by the sensor. Update the sensor severity as needed. For more information, see [Manage alert status and severity(#manage-alert-status-and-severity).
| **Name** |  The alert title. |
| **Site** |  The site associated with the sensor that detected the alert, as listed on the **Sites and sensors** page. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).|
| **Engine** | The sensor  engine that detected the Operational Technology (OT) traffic. For more information, see [Detection engines](how-to-control-what-traffic-is-monitored.md#detection-engines). For device builders, the term *micro-agent* is displayed instead. |
| **Last detection** | The last time the alert was detected. <br>- If an alert's status is **New**, and the same traffic is seen again, the **Last detection** time is updated for the same alert. <br>- If the alert's status is **Closed** and traffic is seen again, the **Last detection** time is *not* updated, and a new alert is triggered.|
| **Status** | The alert status: *New*, *Active*, *Closed* |
| **Source device** | The IP address, MAC, or device name. |
| **Tactics** | The MITRE ATT&CK stage. |

**To view additional information:**

1. Select **Edit columns** from the Alerts page.
1. In the Edit Columns dialog box, select **Add Column** and choose an item to add. The following items are available:

    | Column | Description
    |--|--|
    | **Source device address** |The IP address of the source device. |
    | **Destination device address** | The IP address of the destination device. |
    | **Destination device** | The IP address, MAC, or destination device name.|
    | **First detection** | Defines the first time the alert was detected in the network. |
    | **ID** |The unique alert ID.|
    | **Last activity** | Defines the last time the alert was changed, including manual updates for severity or status, or automated changes for device updates or device/alert de-duplication |
    | **Protocol** | The protocol detected in the network traffic for this alert.|
    | **Sensor** |  The sensor that detected the alert.|
    | **Zone** | The zone assigned to the sensor that detected the alert.|
    | **Category**| The category associated with the alert, such as *operational issues*,*custom alerts*, or *illegal commands*. |
    | **Type**| The  internal name of the alert. |

### Filter alerts displayed

Use the **Search** box, **Time range**, and **Add filter** options to filter the alerts displayed by specific parameters or help locate a specific alert.

For example, filter alerts by **Category**:

:::image type="content" source="media/how-to-view-manage-cloud-alerts/category-filter.png" alt-text="Screenshot of the Category filter option in Alerts page in the Azure portal.":::

Supported categories include:

:::row:::
   :::column span="":::
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
   :::column-end:::
   :::column span="":::
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
   :::column-end:::
:::row-end:::

### Group alerts displayed

Use the **Group by** menu at the top right to collapse the grid into subsections according to specific parameters.

For example, while the total number of alerts appears above the grid, you may want more specific information about alert count breakdown, such as the number of alerts with a specific severity, protocol, or site.

Supported grouping options include *Severity*, *Name*, *Site*, and *Engine*.

## View alert details

Select an alert in the grid to display more details in the pane on the right, including the alert description, traffic source and destination, and more.

:::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-detected.png" alt-text="Screenshot of an alert selected from Alerts page in the Azure portal." lightbox="media/how-to-view-manage-cloud-alerts/alert-detected.png":::

Select **View full details** to learn more, or **Take action** to jump directly to the suggested remediation steps.

:::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-full-details.png" alt-text="Screenshot of a selected alert with full details." lightbox="media/how-to-view-manage-cloud-alerts/alert-full-details.png":::

## Remediate alerts

On each alert details page, the **Take Action** tab lists recommended remediation steps for the alert, designed specifically to help SOC teams understand OT issues and resolutions.

:::image type="content" source="media/how-to-view-manage-cloud-alerts/take-action-cloud-alert.png" alt-text="Screenshot of a remediation action for a sample alert in the Azure portal." lightbox="media/how-to-view-manage-cloud-alerts/take-action-cloud-alert.png":::

## Manage alert status and severity

**Prerequisite**: Subscription access as a **Security admin**, **Contributor**, or **Owner** user

You can update alert status or severity for a single alert or for a group of alerts.

*Learn* an alert to indicate to Defender for IoT that the detected network traffic is authorized. Learned alerts won't be triggered again the next time the same traffic is detected on your network. For more information, see [Learn and unlearn alert traffic](how-to-manage-the-alert-event.md#learn-and-unlearn-alert-traffic).

- **To manage a single alert**:

    1. Select an alert in the grid.
    1. Either on the details pane on the right, or in an alert details page itself, select the new status and/or severity.

- **To manage multiple alerts in bulk**:

    1. Select the alerts in the grid that you want to modify.
    1. Use the :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/status-icon.png" border="false"::: **Change status** and/or :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/severity-icon.png" border="false"::: **Change severity** options in the toolbar to update the status and/or the severity for all the selected alerts.

- **To learn one or more alerts**, do one of the following:

    - Select one or more alerts in the grid and then select :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/learn-icon.png" border="false"::: **Learn** in the toolbar.
    - On an alert details page, in the **Take Action** tab, select **Learn**.


    - Select one or more alerts in the grid and then select :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/learn-icon.png" border="false"::: **Learn** in the toolbar.
    - On an alert details page, in the **Take Action** tab, select **Learn**.

### Managing alerts in a hybrid deployment

Users working in hybrid deployments may be managing alerts in Defender for IoT on the Azure portal, the sensor, and an on-premises management console.

Alert management across all interfaces functions as follows:

- **Alert statuses are fully synchronized** between the Azure portal and the sensor. This means that when you set an alert status to **Closed** on either the Azure portal or the sensor, the alert status is updated in the other location as well.

    Setting an alert status to **Closed** or **Muted** on a sensor updates the alert status to **Closed** on the Azure portal. Alert statuses are also synchronized between the sensor and the on-premises management console to keep all management sources updated with the correct alert statuses.

    [Learning](#manage-alert-status-and-severity) an alert in Azure also updates the alert in the sensor console.

- **Alert Exclusion rules**: If you're working with an on-premises management console, you may have defined alert *Exclusion rules* to determine the rules detected by relevant sensors.

    Alerts excluded because they meet criteria for a specific exclusion rule are not displayed on the sensor, or in the Azure portal. For more information, see [Create alert exclusion rules](how-to-work-with-alerts-on-premises-management-console.md#create-alert-exclusion-rules).

## Access alert PCAP data (Public preview)

**Prerequisite**: Subscription access as a **Security admin**, **Contributor**, or **Owner** user

To access raw traffic files for your alert, known as packet capture files or PCAP files, select **Download PCAP** in the top-left corner of your alert details page.

For example:

:::image type="content" source="media/release-notes/pcap-request.png" alt-text="Screenshot of the Download PCAP button." lightbox="media/release-notes/pcap-request.png":::

The portal requests the file from the sensor that detected the alert and downloads it to your Azure storage.

Downloading the PCAP file can take several minutes, depending on the quality of your sensor connectivity.

> [!TIP]
> Accessing PCAP files directly from the Azure portal supports SOC or OT security engineers who want to investigate alerts from Defender for IoT or Microsoft Sentinel, without having to access each sensor separately. For more information, see [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md).
>

## Next steps

For more information, see [Gain insight into global, regional, and local threats](how-to-gain-insight-into-global-regional-and-local-threats.md#gain-insight-into-global-regional-and-local-threats).
