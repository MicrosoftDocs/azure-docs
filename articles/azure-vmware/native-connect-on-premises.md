---
title: Connect to on-premises environment
description: Learn how to connect your on-premises environment to Azure VMware Solution Gen 2 using ExpressRoute or Site-to-Site VPN for seamless integration.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/21/2025
ms.custom: engagement-fy25
#customer intent: As an IT administrator, I want to connect my on-premises environment to my Azure VMware Solution Generation 2 private cloud so that I can extend my infrastructure seamlessly.
# Customer intent: "As an IT administrator, I want to establish a connection from my on-premises environment to my Azure VMware Solution Gen 2 private cloud using ExpressRoute or Site-to-Site VPN, so that I can ensure seamless integration and enhance the overall infrastructure connectivity."
---

# Connect to an on-premises environment

You require network connectivity between the your Azure VMware Solution Generation 2 (Gen 2) private cloud and other networks you deployed in an Azure Virtual Network, on-premises, other Azure VMware Solution private clouds, or on the Internet. In this article, you learn how your Gen 2 private cloud gets connectivity to your on-premises environments.

## Prerequisites

- Ensure you have an Azure VMware Solution Gen 2 private cloud deployed successfully within your Azure Virtual Network.
- Ensure that you have a Virtual Network and a Virtual Network gateway created and fully provisioned. Follow the instructions to create a Virtual Network gateway for ExpressRoute. A Virtual Network gateway for ExpressRoute uses the GatewayType ExpressRoute, not VPN.
- Ensure you have an active ExpressRoute circuit provisioned.

## Connect to an on-premises environment

Connectivity to on-premises is performed using a standard ExpressRoute connection or Site-to-Site VPN. This is similar to the way customers establish connectivity between Azure Virtual Network and on-premises connectivity as described in the Azure Virtual Network documentation.

> [!NOTE]
> You can connect through VPN, but that information is out of scope for this article.

:::image type="content" source="./media/native-connectivity/native-connect-on-premises.png" alt-text="Diagram of an Azure VMware Solution connection to on-premises environment." lightbox="media/native-connectivity/native-connect-on-premises.png":::

## Related topics

- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)
(native-internet-connectivity-design-considerations.md)
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)
- [Connect Gen 2 private clouds and Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)
