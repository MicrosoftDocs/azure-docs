---
title: Add a resource group to your IoT solution
description: In this quickstart, learn how to configure your end-to-end IoT solution using Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 01/13/2022
ms.custom: mode-other
---

# Tutorial: Add a resource group to your IoT solution

This article explains how to add a resource group to your Microsoft Defender for IoT solution. To learn more about resource groups, see [Manage Azure resource groups by using the Azure portal](../../azure-resource-manager/management/manage-resource-groups-portal.md).

With Defender for IoT, you can monitor your entire IoT solution in one dashboard. From that dashboard, you can surface all of your IoT devices, IoT platforms, and back-end resources in Azure.

Once enabled, Defender for IoT will automatically identify other Azure services, and connect to related services that are affiliated with your IoT solution.

You can select other Azure resource groups that are part of your IoT solution. Your selections allow you to add entire subscriptions, resource groups, or single resources.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Add a resource group to your IoT solution

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [IoT hub](../../iot-hub/iot-hub-create-through-portal.md).

- You must have [enabled Microsoft Defender for IoT on your Azure IoT Hub](quickstart-onboard-iot-hub.md).

## Add Azure resources to your IoT solution

**To add new resource to your IoT solution**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for, and select **IoT Hub**.

1. Navigate to **Defender for IoT** > **Settings** > **Monitored Resources**.

1. Select **Edit**, and select the monitored resources that belong to your IoT solution.

1. In the Solution Management window, select your subscription from the drop-down menu.

1. Select all applicable resource groups from the drop-down menu.

1. Select **Apply**.

A new resource group will now be added to your IoT solution.

Defender for IoT will now monitor your newly added resource groups, and surface relevant security recommendations and alerts as part of your IoT solution.

## Next steps

Advance to the next article to learn how to create Defender-IoT-micro-agent.

> [!div class="nextstepaction"]
> [Create a Defender for IoT micro agent module twin](tutorial-create-micro-agent-module-twin.md)
