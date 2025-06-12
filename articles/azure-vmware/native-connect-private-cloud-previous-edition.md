---
title: Connect Azure VMware Solution Generation 2 private clouds to Azure VMware Solution Generation 1 private clouds
description: Learn about connecting Azure VMware Solution Generation 2 private clouds to Azure VMware Solution Generation 1 private clouds.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/21/2025
ms.author: jacobjaygbay
#customer intent: As a cloud administrator, I want to connect Azure VMware Solution Generation 2 private clouds to Azure VMware Solution Generation 1 private clouds so that I can enable seamless communication between private clouds.
---

# Connect Azure VMware Solution Generation 2 private clouds to Azure VMware Solution Generation 1 private clouds

In this article, you learn how to connect Azure VMware Solution Generation 2 (Gen 2) private clouds to Azure VMware Solution Gen 1 private clouds. After you deploy an Azure VMware Solution Gen 2 private cloud, you may need to have network connectivity between the private cloud and other networks you have in an Azure Virtual Network, on-premises, other Azure VMware Solution private clouds, or the internet.  

This article discusses how the Azure VMware Solution Gen 2 private cloud gets connectivity to Azure VMware Solution Gen 1 private cloud. 

## Prerequisite

Have Azure VMware Solution Gen 2 private cloud and Gen 1 private cloud deployed successfully.

## Connect Generation 2 private clouds to Generation 1 private clouds

A Gen 2 private cloud can be connected to a Gen 1 private cloud using a standard ExpressRoute connection, similar to how Gen 1 private clouds connect to a Virtual Network.

For more information about how to connect Virtual Networks using ExtressRoute, see [Azure VMware Solution's previous edition ExpressRoute connectivity to ExpressRoute Gateway](/azure/azure-vmware/deploy-azure-vmware-solution?tabs=azure-portal#connect-to-azure-virtual-network-with-expressroute).

### The steps are as follows:
1. Both types of Azure VMware Solution private clouds deployed; Gen 2 and Gen 1.
2. On Gen 1, request an ExpressRoute authorization key, and copy the authorization key and ExpressRoute ID.
3. Ensure an ExpressRoute gateway is present or create one on the Azure Virtual Network or peered Virtual Network where Azure VMware Solution Gen 2 is deployed.
4. Add a connection to the ExpressRoute gateway using the ER authorization key and ExpressRoute ID from the previous step.

:::image type="content" source="./media/native-connectivity/native-connect-express-route-previous-edition.png" alt-text="Diagram showing an Azure VMware Solution Gen 2 connection to Gen 1 private cloud." lightbox="media/native-connectivity/native-connect-express-route-previous-edition.png":::

## Related topics
- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)
- [Connect to on-premises environment](native-connect-on-premises.md)
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)
