---
title: Azure VMware Solution data charges
description: Azure VMware Solution data charges description.
ms.topic: include
ms.service: azure-vmware
ms.date: 10/14/2023
author: rvandenbedem
ms.author: rvandenbedem
---

<!-- Used in faq.yml -->

Traffic in the Azure VMware Solution ExpressRoute circuit isn't metered in any way. No billing for any Azure VMware Solution ExpressRoute circuit, or for Global Reach charges between Azure VMware Solution private clouds, or Azure VMware Solution to on-premises, other than standard egress charges for traffic from your ExpressRoute circuit connecting to your on-premises to Azure is charged according to ExpressRoute pricing plans. 

- **Azure VMware Solution to VNet** is through an internal ExpressRoute circuit and is free of cost, regardless of region location (same region or cross-region).

- **Azure VMware Solution to on-premises** is done through VNet or ExpressRoute Global Reach (between the internal ExpressRoute and external ExpressRoute). It's still free aside from the standard egress charges from the ExpressRoute to on-premises network. 

For example:
          
- If we connect a VNet in Azure West Europe to an Azure VMware Solution private cloud in West Europe, then there are no ExpressRoute charges other than the ExpressRoute gateway charges.
          
- If we connect a VNet in Azure North Europe to an Azure VMware Solution private cloud in West Europe, then there are no ExpressRoute charges other than the ExpressRoute gateway charges.
          
- If you connect an Azure VMware Solution private cloud in West Europe to an Azure VMware Solution private cloud in North Europe via Expressroute Global Reach you will NOT incur any ExpressRoute Global Reach data transfer (egress and ingress) charges. Please note that there will be charges when using an ExpressRoute gateway.

:::image type="content" source="../media/data-transfer-charges.png" alt-text="Diagram showing Azure VMware Solution data transfer charges." border="true" lightbox="../media/data-transfer-charges.png":::
