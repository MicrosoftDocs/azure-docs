---
title: Create a learned baseline of OT traffic - Microsoft Defender for IoT
description: Learn about how to create a baseline of learned traffic on your OT sensor.
ms.date: 01/22/2023
ms.topic: install-set-up-deploy
---

# Create a learned baseline of OT alerts

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to create a baseline of learned traffic on your OT sensor.

:::image type="content" source="../media/deployment-paths/progress-fine-tuning-ot-monitoring.png" alt-text="Diagram of a progress bar with Fine-tune OT monitoring highlighted." border="false" lightbox="../media/deployment-paths/progress-fine-tuning-ot-monitoring.png":::

## Understand learning mode

An OT network sensor starts monitoring your network automatically after it's connected to the network and you've [signed in](activate-deploy-sensor.md#sign-in-to-the-sensor-console-and-change-the-default-password). Network devices start appearing in your device inventory, and [alerts](../alerts.md) are triggered for any security or operational incidents that occur in your network.

Initially, this activity happens in *learning* mode, which instructs your OT sensor to learn your network's usual activity, including the devices and protocols in your network, and the regular file transfers that occur between specific devices. Any regularly detected activity becomes your network's baseline traffic.


> [!TIP]
> Use your time in learning mode to triage your alerts and *Learn* those that you want to mark as authorized, expected activity. Learned traffic doesn't generate new alerts the next time the same traffic is detected.
>
> After learning mode is turned off, any activity that differs from your baseline data will trigger an alert.

For more information, see [Microsoft Defender for IoT alerts](../alerts.md).

### Learn mode timeline

Creating your baseline of OT alerts can take anywhere from a few days to several weeks, depending on your network size and complexity. Learning mode automatically turns off when the sensor detects a decrease in newly detected traffic, which is typically between 2-6 weeks after deployment.

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
