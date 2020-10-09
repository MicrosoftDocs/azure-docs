---
title: "Quickstart: Configure your solution"
description: In this quickstart, learn how to configure your end-to-end IoT solution using Azure Defender for IoT.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2020
ms.author: mlottner
---

# Quickstart: Configure your Azure Defender for IoT solution

This article provides an explanation of how to perform initial configuration of your IoT security solution using Defender for IoT.

## What is Defender for IoT?

Defender for IoT provides comprehensive end-to-end security for Azure-based IoT solutions.

With Defender for IoT, you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms and back-end resources in Azure.

Once enabled on your IoT Hub, Defender for IoT automatically identifies other Azure services, also connected to your IoT Hub and related to your IoT solution.

In addition to automatic relationship detection, you can also pick and choose which other Azure resource groups to tag as part of your IoT solution.

Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, Defender for IoT leverages Defender to provide you security recommendations and alerts for these resources.

## Add Azure resources to your IoT solution

To add new resource to your IoT solution, do the following:

1. Open your **IoT Hub** in Azure portal.
1. Select and open **Settings** from the **Security** section in the left menu, and then select **Monitored Resources**.
1. Select **Edit** and select the monitored resources that belong to your IoT solution.
1. Click **Add**.

Congratulations! You've added a new resource group to your IoT solution.

Defender for IoT now monitors you're newly added resource groups, and surfaces relevant security recommendations and alerts as part of your IoT solution.

## Next steps

Advance to the next article to learn how to create security modules...

> [!div class="nextstepaction"]
> [Create security modules](quickstart-create-security-twin.md)
