---
title: Azure VMware Solution data charges
description: Azure VMware Solution data charges description.
ms.topic: include
ms.service: azure-vmware
ms.date: 12/20/2023
author: rvandenbedem
ms.author: rvandenbedem
---

<!-- Used in faq.yml -->

Traffic in the Azure VMware Solution ExpressRoute circuit doesn't have metering. No billing for any Azure VMware Solution ExpressRoute circuit, or for Global Reach charges between Azure VMware Solution private clouds. This includes Azure VMware Solution to on-premises, other than standard egress charges for traffic from your Azure ExpressRoute circuit connection to your on-premises site from Azure. Charged according to Azure ExpressRoute pricing plans with the Metered Billing Model. If you are using the Azure ExpressRoute Unlimited Billing Model, you will not pay any egress traffic charges. 

- **Azure VMware Solution to Azure Virtual Network** is through an internal ExpressRoute circuit and is free of cost, regardless of region location (same region or cross-region).

- **Azure VMware Solution to on-premises site** is done through Azure Virtual Network or ExpressRoute Global Reach (between the internal ExpressRoute and external ExpressRoute). It's still free aside from the standard egress charges (Metered Billing Model) from the ExpressRoute to on-premises network. For the Unlimited Billing Model, there are no data charges. 

For example:
          
- If we connect an Azure Virtual Network in Azure West Europe to an Azure VMware Solution private cloud in West Europe, there will be no ExpressRoute charges other than the ExpressRoute gateway charges.
          
- If we connect a Azure Virtual Network in Azure North Europe to an Azure VMware Solution private cloud in West Europe, there will be no ExpressRoute charges other than the ExpressRoute gateway charges.
          
- If you connect an Azure VMware Solution private cloud in West Europe to an Azure VMware Solution private cloud in North Europe via Expressroute Global Reach you will NOT incur any ExpressRoute Global Reach data transfer (egress and ingress) charges. There will be charges when using an ExpressRoute gateway.

:::image type="content" source="../media/data-transfer-charges.png" alt-text="Diagram showing Azure VMware Solution data transfer charges." border="true" lightbox="../media/data-transfer-charges.png":::
