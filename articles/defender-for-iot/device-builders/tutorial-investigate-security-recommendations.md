---
title: Investigate security recommendations
description: Learn how to investigate security recommendations with the Defender for IoT.
ms.topic: tutorial
ms.date: 01/12/2022
---

# Tutorial: Investigate security recommendations

This tutorial will help you learn how to explore the information available in each IoT security recommendation, and explain how to use the details of each recommendation and related devices, to reduce risks.

Timely analysis and mitigation of recommendations by Defender for IoT is the best way to improve security posture and reduce attack surface across your IoT solution.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Investigate new recommendations
> - Investigate security recommendation details
> - Investigate recommendations in a Log Analytics workspace

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

## Investigate recommendations

The IoT Hub recommendations list displays all of the aggregated security recommendations for your IoT Hub.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Recommendations**.

1. Select a recommendation from the list to open the recommendation's details.

## Investigate security recommendation details

Open each aggregated recommendation to display the detailed recommendation description, remediation steps, and device ID for each device that triggered a recommendation. It also displays recommendation severity and direct-investigation access using Log Analytics.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Recommendations**.

1. Review the recommendation **description**, **severity**, **device details** of all devices that issued this recommendation in the aggregation period.

1. After reviewing recommendation specifics, use the **manual remediation step** instructions to help remediate and resolve the issue that caused the recommendation.

    :::image type="content" source="media/quickstart/remediate-security-recommendations-inline.png" alt-text="Remediate security recommendations with Defender for IoT" lightbox="media/quickstart/remediate-security-recommendations-expanded.png":::

1. Explore the recommendation details for a specific device by selecting the desired device in the drill-down page.

    :::image type="content" source="media/quickstart/explore-security-recommendation-detail-inline.png" alt-text="Investigate specific security recommendations for a device with Defender for IoT" lightbox="media/quickstart/explore-security-recommendation-detail-expanded.png":::

## Investigate recommendations in a Log Analytics workspace

**To access your recommendations in a Log Analytics workspace**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Recommendations**.

1. Select a recommendation from the list.

1. Select **Investigate recommendations in Log Analytics workspace**.

    :::image type="content" source="media/how-to-configure-agent-based-solution/recommendation-alert.png" alt-text="Screenshot showing how to view a recommendation in the log analytics workspace.":::

For more information on querying data from Log Analytics, see [Get started with log queries in Azure Monitor](../../azure-monitor/logs/get-started-queries.md).

## Clean up resources

There are no resources to clean up.

## Next steps

> [!div class="nextstepaction"]
> [Investigate security alerts](tutorial-investigate-security-alerts.md)
