---
title: Respond to an alert in the Azure portal - Microsoft Defender for IoT
description: Learn about how to fully respond to OT network alerts in Microsoft Defender for IoT.
ms.date: 11/27/2022
ms.topic: how-to
---

# Investigate and respond to an OT network alert

This article describes how to investigate and respond to an OT network alert in Microsoft Defender for IoT.

You might be a security operations center (SOC) engineer using Microsoft Sentinel, who's seen a new incident in your Microsoft Sentinel workspace and is continuing in Defender for IoT for further details about related devices and recommended remediation steps.

Alternately, you might be an OT engineer watching for operational alerts directly in Defender for IoT. Operational alerts might not be malicious but can indicate operational activity that can aid in security investigations.

## Prerequisites

Before you start, make sure that you have:

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- An [OT network sensor](onboard-sensors.md) onboarded to Defender for IoT.

- To investigate an alert from a Microsoft Sentinel incident, make sure that you've completed the following tutorials:

    - [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md)
    - [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)

- An alert details page open, either from the Defender for IoT **Alerts** page, a Defender for IoT [device details page](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory), or Microsoft Sentinel.

## Investigate an alert from the Azure portal

On an alert details page in the Azure portal, start by changing the alert status to **Active**, indicating that it's currently under investigation.

For example:

:::image type="content" source="media/respond-ot-alert/change-alert-status.png" alt-text="Screenshot of changing an alert status on the Azure portal.":::

Then, check the alert details page for the following details to aid in your investigation:

- **Source and destination device details**. Source and destination devices are listed in **Alert details** tab, and also in the **Entities** area below, as Microsoft Sentinel *entities*, with their own [entity pages](iot-advanced-threat-monitoring.md#investigate-further-with-iot-device-entities). In the **Entities** area, you'll use the links in the **Name** column to open the relevant device details pages for [further investigation](#investigate-related-alerts-on-the-azure-portal).

- **Site and zone**. These values help you understand the geographic and network location of the alert and if there are areas of the network that are now more vulnerable to attack. <!--need new screenshot showing these details-->

- **MITRE ATT&CK** tactics and techniques. Scroll down in the left pane to view all MITRE ATT&CK details. In addition to descriptions of the tactics and techniques, select the links to the MITRE ATT&CK site to learn more about each one.

- **Download PCAP**. At the top of the page, select **Download PCAP** to download the raw traffic files for the selected alert. For more information, see [Access alert PCAP data (Public preview)](how-to-manage-cloud-alerts.md#access-alert-pcap-data-public-preview).

## Investigate related alerts on the Azure portal

Other alerts triggered by the same source or destination device might have details that help you investigate the current alert.

For example, if you're investigating an alert that indicates a device is attempting to connect to a malicious IP address, you might want to investigate other alerts that indicate the same device is attempting to connect to other malicious IP addresses.

**To find related alerts in Defender for IoT**:

1. On an alert details page, use the device links in the **Entities** area > **Name** column to open the related device details pages, for both a source and destination device.

1. On the device details page, select the **Alerts** tab to view all alerts for that device.

    For example:

    :::image type="content" source="media/iot-solution/device-details-alerts.png" alt-text="Screenshot of the Alerts tab on a device details page.":::

## Investigate alert details on the sensor

Continue your investigation on the OT network sensor that generated the alert. Find the sensor name on the alert details page, and sign in to that sensor's console.

On the sensor's **Alerts** page, find and select the alert you're investigating, and then select **View more details** to open the sensor's alert details page.

:::image type="content" source="media/iot-solution/alert-on-sensor.png" alt-text="Screenshot of the alert on the sensor console.":::

On the sensor's alert details page:

- Select the **Map view** tab to view the alert inside the sensor's device map. For more information, see [Investigate sensor detections in the Device map](how-to-work-with-the-sensor-device-map.md). <!--does this work? it doesn't look like much-->

- Select the **Event timeline** tab to view the alert's full event timeline, including other related activity also detected by the sensor. For more information, see [Track sensor activity](how-to-track-sensor-activity.md). <!--lets give the users more here- we don't have enough on the event timeline-->

- Select **Export PDF** to download a PDF summary of the alert details. <!--there isn't much included here. worth including?-->

## Take remediation action

<!--ask meir where the best place to do this in?-->
The timing for when you take remediation actions may depend on the severity of the alert. For example, for high severity alerts, you might want to take action even before investigating, such as if you need to immediately quarantine an area of your network.

For lower severity alerts, or for operational alerts, you might want to investigate before taking action.

**To remediate an alert**, use the following Defender for IoT resources:

- **On the alert details page**, select the **Take action** tab to view details about recommended steps to mitigate the risk.

- **On the device details page** for both the [source and destination devices](#investigate-an-alert-from-the-azure-portal):

    - Select the **Vulnerabilities** tab and check for detected vulnerabilities on each device.

    - Select the **Recommendations** tab and check for current security recommendations for each device.

Defender for IoT vulnerability data and security recommendations can provide simple actions you can take to mitigate the risks, such as updating firmware or applying a patch. Other actions may take more planning.

When you've finished with mitigation activities and are ready to close the alert, make sure to update the alert status to **Closed**. Alert statuses are synchronized across your sensor, Defender for IoT, and Microsoft Sentinel. Closing an alert in Defender for IoT does *not* automatically close any related incident in Microsoft Sentinel.

## Triage alerts regularly

Triage alerts on a regular basis to prevent alert fatigue in your network and ensure that you're able to see and handle important alerts in a timely manner.

**To triage alerts**:

1. In Defender for IoT in the Azure portal, go to the **Alerts** page.

1. Sort the grid by the **Last detection** column to find the latest alerts in your network. Use other filters, such as **Sensor** or **Severity** to find specific alerts.

1. Check the alert details and investigate as needed before you take any alert action.

1. When you're ready, take action on an alert details page for a specific alert, or on the **Alerts** page for bulk actions. 

    For example, update alert status or severity, or *learn* an alert to authorize the detected traffic. *Learned* alerts are not triggered again if the same exact traffic is detected again.

## Next steps
