---
title: Azure Peering Service (Preview) FAQ
description: Learn about Microsoft Azure Peering Service FAQ
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: ypitsch
---

# Peering Service (Preview) FAQs

This article elucidates on the most frequently asked questions about Peering Service connection.

> [!IMPORTANT]
> "Peering Service” is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Q. Who are the target customers?**  

A. Enterprises who connect to Microsoft Cloud using the internet as transport.  

**Q. Can customers sign up for the Peering Service with multiple providers?** 

A. Yes, customers can sign up for the Peering Service with multiple providers in the same region or different region, but not for the same prefix.

**Q. Can customers select a unique ISP for their sites per geographical region?**  

A. Yes, customers can do so. It is recommended to select the Partner ISP per region that suits their business and operational needs.

**Q. What is Microsoft Edge PoP?**

A. It is a physical location where Microsoft interconnects with other networks. In the Microsoft Edge PoP location, services such as Azure Front Door, and Azure CDN are hosted. Refer to [Azure CDN](https://docs.microsoft.com/azure/cdn/cdn-features) for more information.

## Peering Service - Unique characteristics

**Q. How is Peering Service different from normal Internet access?**

A. Partners who have registered to the Microsoft Peering service have been working with Microsoft to offer optimized latency and reliable connectivity to Microsoft Services.  

**Q. How is Peering Service different from ExpressRoute?**

A. ExpressRoute is a private, dedicated connection from the given one or multiple customer locations. While Peering Service offers optimized Public connectivity and does not support any private connectivity. It also offers optimized connectivity for local internet breakouts.

## Next steps

To learn about Peering Service, see [Peering Service Overview](about.md).

To find a Service Provider, see [Peering Service partners and locations](location-partners.md).

To onboard Peering Service connection, see [Onboard Peering Service model](onboarding-model.md).

To register the Peering Service connection, see [Register Peering Service connection - Azure portal](azure-portal.md).

To measure telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).