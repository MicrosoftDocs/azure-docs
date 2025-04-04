---
title: Connect multiple Azure VMware Solutions in an Azure Virtual Network
description: Learn about connecting multiple Azure VMware Solutions in an Azure Virtual Network.
ms.topic: how-to
ms.service: azure-vmware
author: jjaygbay1
ms.author: jacobjaygbay
ms.date: 3/14/2025
ms.custom: engagement-fy25
#customer intent: As a cloud administrator, I want to connect multiple Azure VMware Solutions so that I can enable seamless communication between private clouds.
---

# Connect multiple Azure VMware Solutions in an Azure Virtual Network

In this article, you learn how to connect a private cloud deployed in a Virtual Network to other private clouds. It provides instructions on connecting to multiple Azure VMware Solution private clouds deployed in a Virtual Network.

## Prerequisite

Have multiple Azure VMware Solution on native private cloud deployed successfully.

## Connect multiple Azure VMware Solutions

Private clouds deployed in different Azure Virtual Networks can be connected using Virtual Network peering. The Virtual Network peering provides the best possible throughput and latency between Azure VMware Solution private clouds in the same region. For more information about how to do Azure Virtual Network peering, see [Create, change, or delete a Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview).

Depending on the location of the private cloud, you may require local Virtual Network peering or a global Virtual Network peering.

:::image type="content" source="./media/native-connectivity/native-connect-multiple-solutions-onpremise.png" alt-text="Diagram of an Azure VMware Solution connection to on-premise environment":::
