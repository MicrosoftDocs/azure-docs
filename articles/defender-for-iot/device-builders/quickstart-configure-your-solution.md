---
title: Add Azure resources to your IoT solution
description: In this quickstart, learn how to configure your end-to-end IoT solution using Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 01/05/2022
ms.custom: mode-other
---

# Tutorial: Add Azure resources to your IoT solution

This article explains how to Add Azure resources to your Microsoft Defender for IoT solution.

With Defender for IoT, you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms, and back-end resources in Azure.

Once you enable Defender for IoT on your IoT Hub, Defender for IoT will automatically identify other Azure services, and connect to related services that are affiliated with your IoT solution.

You will also be able to select other Azure resource groups that are part of your IoT solution. Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, Defender for IoT will use Defender for Cloud to provide you security recommendations, and alerts for these resources.

In this tutorial you will learn how to:

> [!div class="checklist"]
> -

## Prerequisites

- Before you can follow the steps in this tutorial you must [Enable Microsoft Defender for IoT on Azure IoT Hub](quickstart-onboard-iot-hub.md).

## Add Azure resources to your IoT solution

**To add new resource to your IoT solution**:

1. In the Azure portal, search for, and select **IoT Hub** .

1. Under the Security section, select **Settings** > **Monitored Resources**.

1. Select **Edit**, and select the monitored resources that belong to your IoT solution.

1. Select **Add**.

A new resource group will now be added to your IoT solution.

Defender for IoT will now monitor you're newly added resource groups, and surfaces relevant security recommendations, and alerts as part of your IoT solution.

## Next steps

Advance to the next article to learn how to create Defender-IoT-micro-agents...

> [!div class="nextstepaction"]
> [Create Defender-IoT-micro-agents](quickstart-create-security-twin.md)
