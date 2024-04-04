---
title: Respond to an alert in the Azure portal - Microsoft Defender for IoT
description: Learn about how to fully respond to OT network alerts in Microsoft Defender for IoT.
ms.date: 12/05/2022
ms.topic: how-to
---

# Investigate and respond to an OT network alert

This article describes how to investigate and respond to an OT network alert in Microsoft Defender for IoT.

You might be a security operations center (SOC) engineer using Microsoft Sentinel, who's seen a new incident in your Microsoft Sentinel workspace and is continuing in Defender for IoT for further details about related devices and recommended remediation steps.

Alternately, you might be an OT engineer watching for operational alerts directly in Defender for IoT. Operational alerts might not be malicious but can indicate operational activity that can aid in security investigations.

## Prerequisites

Before you start, make sure that you have:

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- A cloud-connected [OT network sensor](onboard-sensors.md) onboarded to Defender for IoT, with alerts streaming into the Azure portal.

- To investigate an alert from a Microsoft Sentinel incident, make sure that you've completed the following tutorials:

    - [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md)
    - [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)

- An alert details page open, accessed either from the Defender for IoT **Alerts** page in the [Azure portal](how-to-manage-cloud-alerts.md), a Defender for IoT [device details page](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory), or a Microsoft Sentinel [incident](../../sentinel/investigate-incidents.md).

## Investigate an alert from the Azure portal

On an alert details page in the Azure portal, start by changing the alert status to **Active**, indicating that it's currently under investigation.

For example:

:::image type="content" source="media/respond-ot-alert/change-alert-status.png" alt-text="Screenshot of changing an alert status on the Azure portal.":::

> [!IMPORTANT]
> If you're integrating with Microsoft Sentinel, make sure to manage your alert status only from the [incident](../../sentinel/investigate-incidents.md) in Microsoft Sentinel. Alerts statuses are not synchronized from Defender for IoT to Microsoft Sentinel.


After updating the status, check the alert details page for the following details to aid in your investigation:

- **Source and destination device details**. Source and destination devices are listed in **Alert details** tab, and also in the **Entities** area below, as Microsoft Sentinel *entities*, with their own [entity pages](iot-advanced-threat-monitoring.md#investigate-further-with-iot-device-entities). In the **Entities** area, you'll use the links in the **Name** column to open the relevant device details pages for [further investigation](#investigate-related-alerts-on-the-azure-portal).

- **Site and/or zone**. These values help you understand the geographic and network location of the alert and if there are areas of the network that are now more vulnerable to attack.

- **MITRE ATT&CK** tactics and techniques. Scroll down in the left pane to view all MITRE ATT&CK details. In addition to descriptions of the tactics and techniques, select the links to the MITRE ATT&CK site to learn more about each one.

- **Download PCAP**. At the top of the page, select **Download PCAP** to [download the raw traffic files](how-to-manage-cloud-alerts.md#access-alert-pcap-data) for the selected alert.

## Investigate related alerts on the Azure portal

Look for other alerts triggered by the same source or destination device. Correlations between multiple alerts may indicate that the device is at risk and can be exploited.

For example, a device that attempted to connect to a malicious IP, together with another alert about unauthorized PLC programming changes on the device, might indicate that an attacker has already gained control of the device.

**To find related alerts in Defender for IoT**:

1. On the **Alerts** page, select an alert to view details on the right.

1. Locate the device links in the **Entities** area, either in the details pane on the right or in the alert details page. Select an entity link to open the related device details page, for both a source and destination device.

1. On the device details page, select the **Alerts** tab to view all alerts for that device. For example:

    :::image type="content" source="media/iot-solution/device-details-alerts.png" alt-text="Screenshot of the Alerts tab on a device details page.":::

## Investigate alert details on the OT sensor

The OT sensor that triggered the alert will have more details to help your investigation.

**To continue your investigation on the OT sensor**:

1. Sign into your OT sensor as a **Viewer** or **Security Analyst** user.

1. Select the **Alerts** page and find then alert you're investigating. Select **View more details to open the OT sensor's alert details page. For example:

    :::image type="content" source="media/iot-solution/alert-on-sensor.png" alt-text="Screenshot of the alert on the sensor console.":::

On the sensor's alert details page:

- Select the **Map view** tab to view the alert inside the OT sensor's [device map](how-to-work-with-the-sensor-device-map.md), including any connected devices.

- Select the **Event timeline** tab to view the alert's [full event timeline](how-to-track-sensor-activity.md), including other related activity also detected by the OT sensor.

- Select **Export PDF** to download a PDF summary of the alert details.

## Take remediation action

The timing for when you take remediation actions may depend on the severity of the alert. For example, for high severity alerts, you might want to take action even before investigating, such as if you need to immediately quarantine an area of your network.

For lower severity alerts, or for operational alerts, you might want to fully investigate before taking action.

**To remediate an alert**, use the following Defender for IoT resources:

- **On an alert details page** on either the Azure portal or the OT sensor, select the **Take action** tab to view details about recommended steps to mitigate the risk.

- **On a device details page** in the Azure portal, for both the [source and destination devices](#investigate-an-alert-from-the-azure-portal):

    - Select the **Vulnerabilities** tab and check for detected vulnerabilities on each device.

    - Select the **Recommendations** tab and check for current security [recommendations](recommendations.md) for each device.

Defender for IoT vulnerability data and security recommendations can provide simple actions you can take to mitigate the risks, such as updating firmware or applying a patch. Other actions may take more planning.

When you've finished with mitigation activities and are ready to close the alert, make sure to update the alert status to **Closed** or notify your SOC team for further incident management.

> [!NOTE]
> If you integrate Defender for IoT with Microsoft Sentinel, alert status changes you make in Defender for IoT are *not* updated in Microsoft Sentinel. Make sure to manage your alerts in Microsoft Sentinel together with the related incident.

## Triage alerts regularly

Triage alerts on a regular basis to prevent alert fatigue in your network and ensure that you're able to see and handle important alerts in a timely manner.

**To triage alerts**:

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, go to the **Alerts** page. By default, alerts are sorted by the **Last detection** column, from most recent to oldest alert, so that you can first see the latest alerts in your network.

1. Use other filters, such as **Sensor** or **Severity** to find specific alerts.

1. Check the alert details and investigate as needed before you take any alert action. When you're ready, take action on an alert details page for a specific alert, or on the **Alerts** page for bulk actions. 

    For example, update alert status or severity, or [learn](how-to-manage-the-alert-event.md#learn-and-unlearn-alert-traffic) an alert to authorize the detected traffic. *Learned* alerts are not triggered again if the same exact traffic is detected again.

    :::image type="content" source="media/iot-solution/learn-alert.png" alt-text="Screenshot of a Learn button on the alert details page.":::

For high severity alerts, you may want to take action immediately.

## Next steps

> [!div class="nextstepaction"]
> [Enhance security posture with security recommendations](recommendations.md)
