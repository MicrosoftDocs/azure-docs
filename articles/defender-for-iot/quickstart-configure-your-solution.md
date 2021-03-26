---
title: "Quickstart: Add Azure resources to your IoT solution"
description: In this quickstart, learn how to configure your end-to-end IoT solution using Azure Defender for IoT.
ms.topic: quickstart
ms.date: 01/25/2021
---

# Quickstart: Configure your Azure Defender for IoT solution

This article provides an explanation of how to perform initial configuration of your IoT security solution using Defender for IoT.

## Prerequisites

None

## What is Defender for IoT?

Defender for IoT provides comprehensive end-to-end security for Azure-based IoT solutions.

With Defender for IoT, you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms, and back-end resources in Azure.

Once enabled on your IoT Hub, Defender for IoT automatically identifies other Azure services, also connected to your IoT Hub and related to your IoT solution.

In addition to automatic relationship detection, you can also pick and choose which other Azure resource groups to tag as part of your IoT solution.

Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, Defender for IoT uses Defender to provide you security recommendations and alerts for these resources.

## Add Azure resources to your IoT solution

To add new resource to your IoT solution:

1. Open your **IoT Hub** in Azure portal.

1. Under **Security** select **Overview** followed by **Settings**, and then select **Monitored Resources**.

1. Select **Edit** and select the monitored resources that belong to your IoT solution.

1. Select **Add**.

Congratulations! You've added a new resource group to your IoT solution.

Defender for IoT now monitors you're newly added resource groups, and surfaces relevant security recommendations and alerts as part of your IoT solution.

## Next steps

Advance to the next article to learn how to create Defender-IoT-micro-agents...

> [!div class="nextstepaction"]
> [Create Defender-IoT-micro-agents](quickstart-create-security-twin.md)
