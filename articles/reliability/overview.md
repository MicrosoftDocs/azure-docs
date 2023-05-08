---
title: Azure reliability documentation
description: Azure reliability documentation for availability zones, cross-regional disaster recovery, availability of services for sovereign clouds, regions, and category.
author: anaharris-ms
ms.topic: overview
ms.date: 07/20/2022
ms.author: anaharris
ms.service: reliability
ms.subservice: availability-zones
ms.custom: subject-reliability
---

# Azure reliability documentation

Reliability consists of two principles: resiliency and availability. The goal of resiliency is to return your application to a fully functioning state after a failure occurs. The goal of availability is to provide consistent access to your application or workload be users as they need to.

Azure includes built-in reliability services that you can use and manage based on your business needs. Whether it’s a single hardware node failure, a rack level failure, a datacenter outage, or a large-scale regional outage, Azure provides solutions that improve reliability. For example, availability sets ensure that the virtual machines deployed on Azure are distributed across multiple isolated hardware nodes in a cluster. Availability zones protect customers’ applications and data from datacenter failures across multiple physical locations within a region. **Regions** and **availability zones** are central to your application design and resiliency strategy and are discussed in greater detail later in this article.

The Azure reliability documentation offers reliability guidance for Azure services. This guidance includes information on availability zone support, disaster recovery guidance, and availability of services.

For more detailed information on reliability and reliability principles in Microsoft Azure services, see [Microsoft Azure Well-Architected Framework: Reliability](/azure/architecture/framework/#reliability).


## Reliability requirements

The required level of reliability for any Azure solution depends on several considerations. Availability and latency SLA and other business requirements drive the architectural choices and resiliency level and should be considered first. Availability requirements range from how much downtime is acceptable – and how much it costs your business – to the amount of money and time that you can realistically invest in making an application highly available.  

Building reliability systems on Azure is a **shared responsibility**. Microsoft is responsible for the reliability of the cloud platform, including its global network and data centers. Azure customers and partners are responsible for the resilience of their cloud applications, using architectural best practices based on the requirements of each workload. While Azure continually strives for highest possible resiliency in SLA for the cloud platform, you must define your own target SLAs for each workload in your solution. An SLA makes it possible to evaluate whether the architecture meets the business requirements. As you strive for higher percentages of SLA guaranteed uptime, the cost and complexity to achieve that level of availability grows. An uptime of 99.99 percent translates to about five minutes of total downtime per month. Is it worth the more complexity and cost to reach that percentage? The answer depends on the individual business requirements. While deciding final SLA commitments, understand Microsoft’s supported SLAs. Each Azure service has its own SLA. 

## Building reliability

You should define your application’s reliability requirements at the beginning of planning. If you know which applications don't need 100% high availability during certain periods of time, you can optimize costs during those non-critical periods. Identify the type of failures an application can experience, and the potential effect of each failure. A recovery plan should cover all critical services by finalizing recovery strategy at the individual component and the overall application level. Design your recovery strategy to protect against zonal, regional, and application-level failure. And perform testing of the end-to-end application environment to measure application reliability and recovery against unexpected failure.  

The following checklist covers the scope of reliability planning. 

| **Reliability planning** |
| --- | 
| **Define** availability and recovery targets to meet business requirements. | 
| **Design** the reliability features of your applications based on the availability requirements. |
| **Align** applications and data platforms to meet your reliability requirements. | 
| **Configure** connection paths to promote availability. | 
| **Use** availability zones and disaster recovery planning where applicable to improve reliability and optimize costs. |
| **Ensure** your application architecture is resilient to failures. | 
| **Know** what happens if SLA requirements are not met. |
| **Identify** possible failure points in the system; application design should tolerate dependency failures by deploying circuit breaking. | 
| **Build** applications that operate in the absence of their dependencies. | 

## Regions and availability zones

Regions and Availability Zones are a big part of the reliability equation. Regions feature multiple, physically separate availability zones. These availability zones are connected by a high-performance network featuring less than 2ms latency between physical zones. Low latency helps your data stay synchronized and accessible when things go wrong. You can use this infrastructure strategically as you architect applications and data infrastructure that automatically replicate and deliver uninterrupted services between zones and across regions. Choose the best region for your needs based on technical and regulatory considerations—service capabilities, data residency, compliance requirements, latency—and begin advancing your reliability strategy.

Microsoft Azure services support availability zones and are enabled to drive your cloud operations at optimum high availability while supporting your disaster recovery and business continuity strategy needs. Choose the best region for your needs based on technical and regulatory considerations—service capabilities, data residency, compliance requirements, latency—and begin advancing your reliability strategy. For more information, see [Azure regions and availability zones](availability-zones-overview.md).

## Shared responsibility

Building reliabile systems on Azure is a shared responsibility. Microsoft is responsible for the reliability of the cloud platform, which includes its global network and datacenters. Azure customers and partners are responsible for the reliability of their cloud applications, using architectural best practices based on the requirements of each workload. For more information, see [Business continuity management program in Azure](business-continuity-management-program.md).

## Azure service dependencies

Microsoft Azure services are available globally to drive your cloud operations at an optimal level. You can choose the best region for your needs based on technical and regulatory considerations: service capabilities, data residency, compliance requirements, and latency.

Azure services deployed to Azure regions are listed on the [Azure global infrastructure products](https://azure.microsoft.com/global-infrastructure/services/?products=all) page. To better understand regions and Availability Zones in Azure, see [Regions and Availability Zones in Azure](availability-zones-overview.md).

Azure services are built for reliability including high availability and disaster recovery. There are no services that are dependent on a single logical data center (to avoid single points of failure). Non-regional services listed on [Azure global infrastructure products](https://azure.microsoft.com/global-infrastructure/services/?products=all) are services for which there is no dependency on a specific Azure region. Non-regional services are deployed to two or more regions and if there is a regional failure, the instance of the service in another region continues servicing customers. Certain non-regional services enable customers to specify the region where the underlying virtual machine (VM) on which service runs will be deployed. For example, [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/) enables customers to specify the region location where the VM resides. All Azure services that store customer data allow the customer to specify the specific regions in which their data will be stored. The exception is [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/), which has geo placement (such as Europe or North America). For more information about data storage residency, see the [Data residency map](https://azure.microsoft.com/global-infrastructure/data-residency/).

If you need to understand dependencies between Azure services to help better architect your applications and services, you can request the **Azure service dependency documentation** by contacting your Microsoft sales or customer representative. This document lists the dependencies for Azure services, including dependencies on any common major internal services such as control plane services. To obtain this documentation, you must be a Microsoft customer and have the appropriate non-disclosure agreement (NDA) with Microsoft.



## Next steps

> [!div class="nextstepaction"]
> [Business continuity management in Azure](business-continuity-management-program.md)

> [!div class="nextstepaction"]
> [Availability zone migration guidance](availability-zones-migration-overview.md)

> [!div class="nextstepaction"]
> [Availability of service by category](availability-service-by-category.md)

> [!div class="nextstepaction"]
> [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

> [!div class="nextstepaction"]
> [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)