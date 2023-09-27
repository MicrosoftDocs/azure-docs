---
title: Use a chaos experiment template to induce an outage on an Azure Active Directory instance
description: Use the Azure portal to create an experiment from the AAD outage experiment template.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 09/27/2023
ms.custom: template-how-to, ignite-fall-2021
---

# Use a chaos experiment template to induce an outage on an Azure Active Directory instance

You can use a chaos experiment to verify that your application is resilience to failures by causing those failures in a controlled environment. In this article, you induce an outage on an Azure Active Directory resource using a pre-populated experiment template and Azure Chaos Studio Preview.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- A network security group.

## Enable Chaos Studio on your network security group

Azure Chaos Studio Preview can't inject faults against a resource until that resource is added to Chaos Studio. To add a resource to Chaos Studio, create a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. Network security groups have only one target type (service-direct) and one capability (set rules). Other resources might have up to two target types. One target type is for service-direct faults. Another target type is for agent-based faults. Other resources might have many other capabilities.

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **Chaos Studio** in the search bar.
1. Select **Targets** and find your virtual machine scale set resource.
1. Select the network security group resource and select **Enable targets** > **Enable service-direct targets**.
