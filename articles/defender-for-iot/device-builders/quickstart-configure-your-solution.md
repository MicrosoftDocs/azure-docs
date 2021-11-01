---
title: 'Quickstart: Add Azure resources to your IoT solution'
description: In this quickstart, learn how to configure your end-to-end IoT solution using Azure Defender for IoT.
ms.topic: quickstart
ms.date: 09/13/2021
---

# Quickstart: Configure your Azure Defender for IoT solution

This article explains how to configure your IoT security solution using Defender for IoT for the first time.

## Prerequisites

- None

## What is Defender for IoT?

Defender for IoT provides comprehensive end-to-end security for Azure-based IoT solutions.

With Defender for IoT, you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms, and back-end resources in Azure.

Once you enable Defender for IoT on your IoT Hub, Defender for IoT will automatically identify other Azure services, and connect to related services that are affiliated with your IoT solution.

You will also be able to select other Azure resource groups that are part of your IoT solution.

Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, Defender for IoT will use Defender to provide you security recommendations, and alerts for these resources.

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
