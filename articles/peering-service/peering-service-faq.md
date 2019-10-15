---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: ypitsch
---

# Peering Service FAQ

**Q. What is Peering Service?**

A. Peering Service is a networking service that aims at improving customer’s internet access to Microsoft Public services such as Office 365, Dynamics 365, SaaS services running on Azure, or any Microsoft services accessible via public IP Azure. Microsoft has partnered with Internet Service Providers [ISP] and Internet Exchange Providers [IXP] to provide reliable and performant internet connectivity by meeting the technical requirements in terms of resiliency, geo redundancy, and optimal routing (shortest paths and no intermediates in the routing path). 

**Q. What Peering Service isn’t about?** 

A. Peering Service is not a private connectivity product like ExpressRoute or a VPN product.

- It’s an IP service that uses the public internet.  

- It’s a collaboration platform with SPs and a value-added service that is intended to offer optimal and reliable routing to public SPs or SaaS traffic such as Office 365, Dynamics 365 or any SaaS traffic running on Azure.  

**Q. Why Peering Service?**

A. Enterprises looking for Internet first access to the cloud or considering SD-WAN architecture or with high usage of Microsoft SaaS services need robust and performant internet connectivity. Peering Service helps customers to make that transition happen. 

**Q. What are the key characteristics of Peering Service?** 

- Robust, Reliable Peering 

  - Local Redundancy 

  - Geo Redundancy, shortest routing path selection 

- Optimal Routing 

  - Cold- potato 

- Monitoring platform 

  - Latency Reporting 

**Q. Who are the target customers?**  

A. Enterprises who connect to Microsoft Cloud using an internet as transport.  

**Q. How can customers enable Peering Service?**

A. Customer can perform pre-sales research and enable the service from the service provider. Following that, customer notifies Microsoft and sign up for MAPS. Customers can select a globally preferred ISP. Whenever that ISP is qualified as a MAPS partner for a given geographical region, Microsoft and ISP will automatically turn on MAPS service for the customer sites in that region.  

Additionally, customers can overwrite and optimize Peering Service ISP per geographical region. MAPS can be signed up using two or more ISPs in any geographical region. In such a case, customer will buy internet service from these ISPs.  

**Q. What is Peering Service telemetry?**

A. In addition to Peering Service enabled service, customers can opt for internet telemetry such as route analytics to monitor networking latency and performance in accessing Microsoft network. This capability can be achieved by registering peering service in Azure portal. 

**Q. From customer perspective, what is the benefit of buying Microsoft Peering Service from ISP?** 

A. Customers are assured that they are accessing Microsoft using a carrier with well-established connectivity with Microsoft and that the carrier is following Microsoft connectivity guidelines. By choosing a  partner, they are guaranteed to choose market leaders in their region.  

**Q. Who are Peering Service partners?**

- Kordia 
- NTT 
- TATA 
- CCL 
- KDDI 
- PCCW 
- Intercloud 
- Liquid Telecom 

**Q. What is the billing model?**

A. Billing model is comprised of the following:  

• Partner ISP – Partners charge customers for their product and service.   

• Microsoft - Microsoft charge customers for their products and service   

Note - There is no networking data transfer bill for Microsoft SaaS (for instance,O365). 

**Q. How are customers charged for registering the Peering Service?** 

A. Customers are charged from their respective Service Providers to enable the service. Microsoft do not charge anything. However, to procure Peering Service telemetry, customers are charged as per the number of prefixes that are registered. The bill rate is $15/prefix. 

**Q. Can a customer select a unique ISP for their sites per geographical region?**  

Yes, customer can do so. They can select the ISP per region that suits their business and operational needs.  

**Q. Can a customer have more than one ISP as part of Peering Service connectivity for a site?**  

Yes, they can.

## Next steps

Learn about [Peering Service connection](peering-service-faq.md).

To find a service provider. See [Peering Service partners and locations](peering-service-location-partners.md).

To onboard the Peering Service connection, see [Peering Service connection](peering-service-onboarding-connection.md).

To onboard the Peering Service connection telemetry, see [Peering Service connection telemetry](peering-service-onboarding-connection-telemetry.md).

To register the connection, see [Peering Service connection](peering-service-azure-portal).

To measure the telemetry, see [Measure connection telemetry](peering-service-measure-connection-telemetry.md).