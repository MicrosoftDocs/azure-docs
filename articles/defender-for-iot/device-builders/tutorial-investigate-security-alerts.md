---
title: Investigate security alerts
description: Learn how to investigate Defender for IoT security alerts on your IoT devices.
ms.topic: tutorial
ms.date: 01/13/2022
---

# Tutorial: Investigate security alerts

This tutorial will help you learn how to investigate, and remediate the alerts issued by Defender for IoT. Remediating alerts is the best way to ensure compliance, and protection across your IoT solution.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Investigate security alerts
> - Investigate security alert details
> - Investigate alerts in Log Analytics workspace

> [!NOTE]
> The Microsoft Defender for IoT legacy experience under IoT Hub has been replaced by our new Defender for IoT standalone experience, in the Defender for IoT area of the Azure portal. The legacy experience under IoT Hub will not be supported after **March 31, 2023**.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [IoT hub](../../iot-hub/iot-hub-create-through-portal.md).

- You must have [enabled Microsoft Defender for IoT on your Azure IoT Hub](quickstart-onboard-iot-hub.md).

- You must have [added a resource group to your IoT solution](quickstart-configure-your-solution.md).

- You must have [created a Defender for IoT micro agent module twin](quickstart-create-micro-agent-module-twin.md).

- You must have [installed the Defender for IoT micro agent](quickstart-standalone-agent-binary-installation.md).

- You must have [configured the Microsoft Defender for IoT agent-based solution](how-to-configure-agent-based-solution.md).

- Learned how to [investigate security recommendations](quickstart-investigate-security-recommendations.md).

## Investigate security alerts

The Defender for IoT security alert list displays all of the aggregated security alerts for your IoT Hub.

**To investigate security alerts**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Security Alerts**.

1. Select an alert from the list to open the alert's details.

## Investigate security alert details

Opening each aggregated alert displays the detailed alert description, remediation steps, and device ID for each device that triggered an alert. The alert severity and direct investigation is accessible using Log Analytics.

**To investigate security alert details**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Security Alerts**.

1. Select any security alert from the list to open it.

1. Review the alert **description**, **severity**, **source of the detection**, and **device details** of all devices that issued this alert in the aggregation period.

    :::image type="content" source="media/quickstart/drill-down-iot-alert-details.png" alt-text="Investigate and review the details of each device in an aggregated alert." lightbox="media/quickstart/drill-down-iot-alert-details-expanded.png":::

1. After reviewing the alert specifics, use the **manual remediation step** instructions to help remediate and resolve the issue that caused the alert.

    :::image type="content" source="media/quickstart/iot-alert-manual-remediation-steps.png" alt-text="Follow the manual remediation steps to help resolve or remediate your device security alerts":::

## Investigate alerts in your Log Analytics workspace

You can access your alerts and investigate them with the Log Analytics workspace.

**To access your alerts in your Log Analytics workspace after configuration**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Security Alerts**.

1. Select an alert.

1. Select **Investigate alerts in Log Analytics workspace**.

    :::image type="content" source="media/how-to-configure-agent-based-solution/log-analytic.png" alt-text="Screenshot that shows where to select to investigate in the log analytics workspace.":::

## Next steps

> [!div class="nextstepaction"]
> Learn how to [integrate Microsoft Sentinel and Microsoft Defender for IoT](../../sentinel/iot-solution.md?bc=%2fazure%2fdefender-for-iot%2fbreadcrumb%2ftoc.json&tabs=use-out-of-the-box-analytics-rules-recommended&toc=%2fazure%2fdefender-for-iot%2forganizations%2ftoc.json)
