---
title: "Quickstart: Configure your solution"
description: In this quickstart, learn how to configure your end-to-end IoT solution using Azure Security Center for IoT.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: ae2207e8-ac5b-4793-8efc-0517f4661222
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/08/2019
ms.author: mlottner
---

# Quickstart: Configure your IoT solution

This article provides an explanation of how to perform initial configuration of your IoT security solution using Azure Security Center for IoT.

## Azure Security Center for IoT

Azure Security Center for IoT provides comprehensive end-to-end security for Azure-based IoT solutions.

With Azure Security Center for IoT, you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms and back-end resources in Azure.

Once enabled on your IoT Hub, Azure Security Center for IoT automatically identifies other Azure services, also connected to your IoT Hub and related to your IoT solution.

In addition to automatic relationship detection, you can also pick and choose which other Azure resource groups to tag as part of your IoT solution.

Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, Azure Security Center for IoT leverages Azure Security Center to provide you security recommendations and alerts for these resources.

## Add Azure resources to your IoT solution

To add new resource to your IoT solution, do the following:

1. Open your **IoT Hub** in Azure portal.
1. Select and open **Resources** from under **Security** in the left menu.
1. Select **Edit** and choose the resources groups that belong to your IoT solution.
1. Click **Add**.

Congratulations! You've added a new resource group to your IoT solution.

Azure Security Center for IoT now monitors you're newly added resource groups, and surfaces relevant security recommendations and alerts as part of your IoT solution.

## Next steps

Advance to the next article to learn how to create security modules...

> [!div class="nextstepaction"]
> [Create security modules](quickstart-create-security-twin.md)
