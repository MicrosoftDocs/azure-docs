---
title: Configure your Azure Security Center for IoT solution Preview| Microsoft Docs
description: Learn how to configure your end-to-end IoT solution using Azure Security Center for IoT.
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
ms.date: 03/26/2019
ms.author: mlottner

---
# Quickstart: Configure your IoT solution

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to perform initial configuration of your IoT security solution using ASC for IoT. 

## Azure Security Center (ASC) for IoT

ASC for IoT provides comprehensive end-to-end security for Azure-based IoT solutions.

With ASC for IoT, you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms and backend resources in Azure.

Once enabled on your IoT Hub, ASC for IoT automatically identifies other Azure services, also connected to your IoT hub and related to your IoT solution.

In addition to automatic relationship detection, you can also pick and choose which other Azure resources to tag as part of your IoT solution.
Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, ASC for IoT leverages Azure Security Center to provide you security recommendations and alerts for these resources.

## Add Azure resources to your IoT solution

To add new resource to your IoT solution, do the following: 

1. Open your **IoT Hub** in Azure portal. 
2. Select and open **Resources** under **Security** from the left menu. 
3. Select **Add resources**.
4. Choose resources which belong to your IoT solution.
5. Click **Add**. 

Congratulations! You've added a new resource to your IoT solution.

ASC for IoT now monitors you're newly added resources, and surfaces relevant security recommendations and alerts as part of your IoT solution.

## Next steps

Advance to the next article to learn how to create security modules...

> [!div class="nextstepaction"]
> [Create security modules](quickstart-create-security-twin.md)