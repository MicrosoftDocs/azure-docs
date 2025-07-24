---
title: Connect multiple Azure VMware Solution Generation 2 private clouds
description: Learn about connecting multiple Azure VMware Solution Generation 2 private clouds.
ms.topic: how-to
ms.service: azure-vmware
author: jjaygbay1
ms.author: jacobjaygbay
ms.date: 4/21/2025
ms.custom: engagement-fy25
#customer intent: As a cloud administrator, I want to connect multiple Azure VMware Solution Generation 2 Private Clouds so that I can enable seamless communication between private clouds.
# Customer intent: As a cloud administrator, I want to connect multiple Azure VMware Solution Generation 2 private clouds using Virtual Network peering, so that I can ensure efficient communication and optimize performance across my cloud infrastructure.
---

# Connect multiple Azure VMware Solution Generation 2 private clouds

In this article, you learn how to connect an Azure VMware Solution Generation 2 (Gen 2) private cloud to other Gen 2 private clouds.

## Prerequisite

Have multiple Azure VMware Solution Gen 2 private clouds deployed successfully.

## Use Virtual Network peering to connect multiple private clouds

You can connect private clouds deployed in different Azure Virtual Networks using virtual network peering. The virtual network peering provides the best possible throughput and latency between Azure VMware Solution private clouds in the same region. For more information about how to do Azure Virtual Network peering, see [Create, change, or delete a Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview).

Depending on the location of the private cloud, you may require local Virtual Network peering or a global Virtual Network peering.

:::image type="content" source="./media/native-connectivity/native-connect-multiple-solutions-on-premises.png" alt-text="Diagram of multiple Azure VMware Solution Gen 2 private clouds connected together." lightbox="media/native-connectivity/native-connect-multiple-solutions-on-premises.png":::

## Related topics 
- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)
- [Connect to on-premises environment](native-connect-on-premises.md)
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)
- [Connect Gen 2 and Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)
