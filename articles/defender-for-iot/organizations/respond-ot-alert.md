---
title: Respond to an alert in the Azure portal - Microsoft Defender for IoT
description: Learn about how to fully respond to OT network alerts in Microsoft Defender for IoT.
ms.date: 11/27/2022
ms.topic: how-to
---

# Investigate an OT network alert in Defender for IoT

This article describes the end-to-end process for investigating and responding to an OT network alert in Microsoft Defender for IoT.

You might be a security operations center (SOC) engineer using Microsoft Sentinel, who's seen a new incident in your Microsoft Sentinel workspace. Continue your investigation in Defender for IoT for further details about related devices and recommended remediation steps.

Alternately, you might be an OT engineer watching for operational alerts directly in Defender for IoT. Operational alerts might not be malicious but can indicate operational activity that can aid in security investigations.

## Prerequisites

Before you start, make sure that you have:

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- An [OT network sensor](onboard-sensors.md) onboarded to Defender for IoT.

- If you're starting in Microsoft Sentinel, make sure that you've completed the following tutorials, and have Defender for IoT data streaming into Microsoft Sentinel:

    - [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md)
    - [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)

## Start your investigation in Defender for IoT

If you're an OT engineer who's starting from Defender for IoT, you might be watching a specific sensor or all sensors in your network.

**To locate priority alerts in Defender for IoT**:

1. In Defender for IoT in the Azure portal, go to the **Alerts** page.

1. Sort the grid by the **Last detection** column to find the latest alerts in your network. Use other filters, such as **Sensor** or **Severity** to find the alert you want to investigate.

1. Select your alert in the grid, and then select **View more details** in the alert details pane on the right.

    The alert details page opens for the selected alert, with the Defender for IoT context in the breadcrumbs. For example:

    :::image type="content" source="media/respond-ot-alert/alert-details-context.png" alt-text="Screenshot of the alert details page with Defender for IoT in the breadcrumbs.":::


## Investigate alert details on the Azure portal

Look for the following details on the alert details page to aid your investigation:

- **Source and destination device details**. These devices are also listed as Microsoft Sentinel *entities*, with their own entity pages. For more information, see <xref>.

- **MITRE ATT&CK** tactics and techniques. In addition to descriptions of the tactics and techniques, select the links to the MITRE ATT&CK site to learn more about each one.

- **Download PCAP**. At the top of the page, select **Download PCAP** to download the raw traffic files for the selected alert. For more information, see [Access alert PCAP data (Public preview)](how-to-manage-cloud-alerts.md#access-alert-pcap-data-public-preview).

Find the alert on the **Alerts** page in Defender for IoT to view additional alert details, such as **site**, **zone**, or **category**.

## Investigate alert details on the sensor

Continue your investigation on the sensor that generated the alert. Find the sensor on the alert details page, and sign in to the sensor console.

On the sensor's alert page, find and select the alert you're investigating, and then select **View more details** to open the sensor's alert details page.

<!--need to find an alert that i can use for screenshots from sentinel, d4iot and a sensor console-->

On the sensor's alert details page:

- Select the **Map view** tab to view the alert inside the sensor's device map. For more information, see [Investigate sensor detections in the Device map](how-to-work-with-the-sensor-device-map.md). <!--does this work? it doesn't look like much-->

- Select the **Event timeline** tab to view the alert's full event timeline, including other related activity also detected by the sensor. For more information, see [Track sensor activity](how-to-track-sensor-activity.md). <!--lets give the users more here- we don't have enough on the event timeline-->

- Select **Export PDF** to download a PDF summary of the alert details. <!--there isn't much included here. worth including?-->

## Investigate related alerts

On the Defender for IoT **Device inventory** page, find the source and destination devices, and select **View full details** to view the device details page for each device.

In the device details page, select the **Alerts** tab to view other alerts that were triggered on these devices, and whose details might aid your investigation.

## Take remediation action


Select the **Vulnerabilities** tab to view current vulnerabilities on the selected device. You may be able to take simple actions to mitigate these vulnerabilities, or at least prepare to respond.

Recommendations - take action

## Manage your alert status

## Triage alerts regularly

## Next steps
