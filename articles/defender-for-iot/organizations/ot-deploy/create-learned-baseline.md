---
title: Create a learned baseline of OT traffic - Microsoft Defender for IoT
description: Learn about how to create a baseline of learned traffic on your OT sensor.
ms.date: 01/22/2023
ms.topic: install-set-up-deploy
---

# Create a learned baseline of OT alerts

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to create a baseline of learned traffic on your OT sensor.

:::image type="content" source="../media/deployment-paths/progress-fine-tuning-ot-monitoring.png" alt-text="Diagram of a progress bar with Fine-tune OT monitoring highlighted." border="false" lightbox="../media/deployment-paths/progress-fine-tuning-ot-monitoring.png":::

## Overview of the multi stage monitoring process

An OT network sensor starts monitoring your network automatically after it's connected to the network and you've [signed in](activate-deploy-sensor.md#sign-in-to-the-sensor-console-and-change-the-default-password). Network devices start appearing in your device inventory, and [alerts](../alerts.md) are triggered for any security or operational incidents that occur in your network.

Defender for IoT employs a three stage monitoring process that learns your network's normal traffic behavior. These three stages ensure accurate detection while reducing unnecessary alerts, are:

1. Learning mode
1. Dynamic mode
1. Operational mode

### Learning mode

Initially, the sensor runs in *learning* mode to monitor all of your network traffic and build a baseline of all normal traffic patterns. This baseline includes all of the devices and protocols in your network, and the regular file transfers that occur between devices. This process normally takes between 2 and 6 weeks, depending on your network size and complexity. Additionally, any devices discovered later enter learning mode for 7 days in order to establish their network traffic baseline.

In learning mode the malware, anomoly, operational and protocol violation alerts will appear in the alerts inventory, but policy violation alerts aren't created.

### Dynamic mode

After the learning period is completed, all of your devices are identified and the level of alerts matches the size of the network, you manually change the sensor to dynamic mode. Dynamic mode continues to monitor your network, verifying and refining the baseline. The sensor now monitors each alert category and scenario individually and when the sensor identifies that an individual alert baseline is accurate it dynamically changes it to operational mode. Alternatively, the sensor might dynamically extend the learning mode for a specific alert or scenario if it detects significant changes in traffic.

At this stage policy violation alerts are gradually introduced and start to appear in the alert inventory.

### Operational mode

Once the sensor identifies that the baseline is stable and complete it automatically transitions into operational mode, monitoring all of the network traffic and triggering all alert types.

### Summary of the monitoring stages

| Mode | Purpose | Trigger alerts | User actions needed |
| --- | --- | --- | --- |
| **Learning** | Builds a baseline of normal network traffic | Malware alerts, anomaly alerts, operational alerts, protocol violation alerts | Turn off manually after 2–6 weeks or when baseline reflects accurate network activity |
| **Dynamic** | Refines the baseline while gradually introducing policy violations alerts to ensure accuracy and reduce alert noise | Policy Violation alerts are introduced | Optional: Adjust settings for specific scenarios (e.g., during POCs) |
| **Operational** | Monitors all network traffic with a stable baseline, triggering all alerts to reflect deviations or suspicious activity | All types of alerts | None. Automatically transitions when baseline stabilizes |

<!-- Amit is the following tip accurate as well? I think not. there isnt triage in learning mode? -->
> [!TIP]
> Use your time in learning mode to triage your alerts and *Learn* those that you want to mark as authorized, expected activity. Learned traffic doesn't generate new alerts the next time the same traffic is detected.
>
> After learning mode is turned off, any activity that differs from your baseline data will trigger an alert.

For more information, see [Microsoft Defender for IoT alerts](../alerts.md).

[Turn off learning mode manually before then](../how-to-manage-individual-sensors.md#turn-off-learning-mode-manually) if you feel that the current alerts accurately reflect your network activity.

## Prerequisites

You can perform the procedures in this article from the Azure portal, an OT sensor, or an on-premises management console.

Before you start, make sure that you have:

- An OT sensor [installed](install-software-ot-sensor.md), [configured, and activated](activate-deploy-sensor.md), with alerts being triggered by detected traffic.

- Access to your OT sensor as **Security Analyst** or **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md).

## Triage alerts

Triage alerts towards the end of your deployment to create an initial baseline for your network activity.

1. Sign into your OT sensor and select the **Alerts** page.

1. Use sorting and grouping options to view your most critical alerts first. Review each alert to update statuses and learn alerts for OT authorized traffic.

For more information, see [View and manage alerts on your OT sensor](../how-to-view-alerts.md).

## Next steps

> [!div class="step-by-step"]
> [« Verify and update your detected device inventory](update-device-inventory.md)

After learning mode is turned off, you've moved from *learning* mode to *operation* mode. Continue with any of the following:

- [Visualize Microsoft Defender for IoT data with Azure Monitor workbooks](../workbooks.md)
- [View and manage alerts from the Azure portal](../how-to-manage-cloud-alerts.md)
- [Manage your device inventory from the Azure portal](../how-to-manage-device-inventory-for-organizations.md)

Integrate Defender for IoT data with Microsoft Sentinel to unify your SOC team's security monitoring. For more information, see:

- [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](../iot-solution.md)
- [Tutorial: Investigate and detect threats for IoT devices](../iot-advanced-threat-monitoring.md)
