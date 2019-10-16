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

A. Peering Service is a networking service that aims at improving customer connectivity to Microsoft  Cloud services such as Office 365, Dynamics 365, SaaS services, Azure or any Microsoft services accessible via public internet. Microsoft has partnered with Internet Service Providers [ISP], Internet Exchange Providers [IXP] and, Software Defined Cloud Interconnect (SDCI) providers worldwide to provide highly reliable and performant public connectivity with the optimal routing to/from for its customers.

By selecting “Peering Service”, an end user is selecting a partner Service Provider [SP] in a given region, which is well connected to Microsoft through highly reliable interconnections. These connections are optimized for high reliability and minimal¬ latency from  cloud services to the end user location.  

**Q. What Peering Service isn’t about?** 

A. Peering Service is not a private connectivity product like ExpressRoute or a VPN product.

- It’s an IP service that uses the public internet.  

- It’s a collaboration platform with SPs and a value-added service that is intended to offer optimal and reliable routing to customer via partner service provider to Microsoft cloud over the public network.

**Q. Why Peering Service?**

A. Enterprises looking for “Internet first” access to the cloud or considering SD SD-WAN architecture or with high usage of Microsoft SaaS services need robust and performant internet connectivity. Peering Service enables the customers to make that transition happen. Microsoft and Service Providers have partnered to deliver reliable and performance-centric public connectivity to the Microsoft cloud.  

**Q. What are the key characteristics of Peering Service?** 

- Robust, Reliable Peering 

  - Local Redundancy 

  - Geo Redundancy, Optimized network path

- Optimal Routing 

  - Cold-potato (Active when telemetry is enabled)

- Monitoring platform 

  - Latency Reporting

  - Prefix monitoring offering security and high reliability 
 
**Q. Who are the target customers?**  

A. Enterprises who connect to Microsoft Cloud using the internet as transport.  

**Q. How can customers enable Peering Service?**

A. | **Step** | **Action**| **What you get**| **Costs**|
|-----------|---------|---------|---------|
|1|Customer to provision the connectivity from a certified partner (no interaction with Microsoft) ​ |An Internet provider who is well connected to Microsoft and meets the technical requirements for performant and reliable connectivity to Microsoft. ​ |Connectivity costs from the Service Provider offering​. No additional data transfer costs from Microsoft​ |
|2 (Optional)|Customer registers locations into the Azure portal​ A location is defined by: ISP/IXP Name​, Physical location of the customer site (state level), IP Prefix given to the location by the Service Provider or the enterprise​  ​|Telemetry​: Internet Routes monitoring​, traffic prioritization from Microsoft to the user’s closest edge location​. |15 per /24 prefix per month​ ​ |

**Q. Can customers sign up for the Peering Service with multiple providers?** 

A. Yes, customers can sign up for the Peering Service with multiple providers in the same region or different region, but not for the same prefix.

**Q. What is Peering Service telemetry?**

A. In addition to Peering Service enabled service, customers can opt for internet telemetry such as end user latency measures to Microsoft network, BGP route monitoring, and alerts against route anomaly events such as hijacks/leaks by registering their prefixes (routes) in the Azure portal.

**Q. How is Peering Service different from normal Internet access?**

A. In a normal Internet access environment, there is no:

- NO assurance that the SP is well connected/or directly connected at all to Microsoft in the required region.  This can result in the incoming and outgoing traffic for Microsoft network being served over a long/suboptimal path with multiple networks involved. The reliability of such a setup with multiple providers is generally low. 

- Insights into performance or route protection  

With Peering Service, Microsoft is delivering optimized network performance with security and telemetry. 

**Q. Who are the Peering Service partners?**

| BBIX |New Zealand  |
| CCL |New Zealand  |
| DE-CIX|New Zealand  |
| Intercloud|France, UK  |
| KDDI |Japan  |
| Kordia |New Zealand  |
| Liquid Telecom | Africa  |
| NTT | Japan |
| PCCW |HK   |
| TATA | India  |

**Q. What is the billing model?**

A. Billing model is comprised of the following:  

• Partner ISP – Partners charge customers for their product and service.   

• Microsoft - Microsoft charge customers for their products and service   

There is no  additional/special networking data transfer bill for using Peering Services. Default billing rates are applicable as per service using data transfer. 

**Q. How are customers charged for registering the Peering Service?** 

A. Customers are charged by their respective Service Providers to enable the service. However, to procure Peering Service telemetry (as well as optimal traffic routing), customers are charged as per the number of prefixes that are registered. The bill rate is $15/prefix.  Your standard rate for data transfer (without Peering Service) will continue to apply for any data transfer.  

**Q. Can a customer select a unique ISP for their sites per geographical region?**  

 Yes, customer can do so. Customers are recommended to select the Partner ISP per region that suits their business and operational needs.

## Next steps

Learn about [Peering Service connection](peering-service-faq.md).

To find a service provider. See [Peering Service partners and locations](peering-service-location-partners.md).

To onboard the Peering Service connection, see [Peering Service connection](peering-service-onboarding-model.md).

To register the connection, see [Peering Service connection](peering-service-azure-portal.md).

To measure the telemetry, see [Measure connection telemetry](peering-service-measure-connection-telemetry.md).