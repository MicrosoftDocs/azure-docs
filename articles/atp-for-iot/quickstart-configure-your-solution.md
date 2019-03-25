---
title: Configure your IoT solution Preview| Microsoft Docs
description: Learn how to configure your end-to-end IoT solution using ATP for IoT.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: ae2207e8-ac5b-4793-8efc-0517f4661222
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/05/2019
ms.author: mlottner

---
# Quickstart: Configure your IoT solution

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to perform initial configuration of your IoT security solution using ATP for IoT. 

## ATP for IoT

ATP for IoT provides comprehensive end-to-end security for Azure-based IoT solutions.

With ATP for IoT. you can monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms and backend resources in Azure.

Once onboarded to your IoT Hub, ATP for IoT automatically identifies other Azure services, also connected to your IoT hub and related to your IoT solution.

In addition to automatic relationship detection, you can also pick and choose which other Azure resources to tag as part of your IoT solution.
Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, ATP for IoT leverages Azure Security Center to provide you security recommendations and alerts for these resources.

## Add Azure resources to your IoT solution

To add new resource to your IoT solution, do the following: 

1. Open your **IoT Hub** in Azure portal. 
2. Select and open **Resources** under **Security** from the left menu. 
3. Select **Add resources**.
4. Choose resources which belong to your IoT solution.
4. Click **Add**. 

Congratulations! You've added a new resource to your IoT solution.
ATP for IoT will now monitor you'r newly added resources, and surface relevant security recommendations and alerts as part of your IoT solution.

## Next steps

1. [Create security modules](quickstart-create-security-twin.md).
1. Configure [custom alerts](quickstart-create-custom-alerts.md).
1. Deploy a security agent for [Windows](quickstart-windows-cs-installation.md) or [Linux](quickstart-linux-cs-installation.md), or [Send security messages using the SDK](tutorial-send-security-messages.md) directly.


## See Also
- [ATP for IoT overview](overview.md)
- [Service prerequisites](service-prerequisites.md)
- [Getting started](quickstart-getting-started.md)
- [Understanding security alerts](concept-security-alerts.md)