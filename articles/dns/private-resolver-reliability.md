---
title: Resiliency in Azure DNS Private Resolver #Required; Must be "Resiliency in *your official service name*"
description: Find out about reliability in Azure DNS Private Resolver #Required; 
author: greg-lindsay #Required; your GitHub user alias, with correct capitalization.
ms.author: greglin #Required; Microsoft alias of author; optional team alias.
ms.custom: subject-reliability
ms.service: dns
ms.topic: conceptual
ms.date: 09/26/2022 #Required; mm/dd/yyyy format.
---

As a customer, I want to understand reliability support for [Azure DNS Private Resolver] so that I can respond to and/or avoid failures in order to minimize downtime and data loss.

# What is reliability in Azure DNS Private Resolver?

This article describes reliability support in Azure DNS Private Resolver, and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

[Introduction]

Azure DNS Private Resolver enables you to query Azure DNS private zones from an on-premises environment, and vice versa, without deploying VM based DNS servers. You no longer need to provision IaaS based solutions on your virtual networks to resolve names registered on Azure private DNS zones. You can configure conditional forwarding of domains back to on-premises, multicloud and public DNS servers. 

Azure DNS Private Resolver supports availability zones without any additional configuration!

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).


## Availability zone support

Azure DNS Private Resolver supports Availability Zones without any additional configuration required. When the service is provisioned, it is deployed across the different Availability Zones and will provide zonal resilliency out of the box.

### Prerequisites

The regions listed in this location include availability zone support and you will not need to take any additional action apart from provisioning the service.
https://learn.microsoft.com/en-us/azure/availability-zones/az-region#azure-regions-with-availability-zones

There are no increased SLAs for [Azure DNS Private Resolver]. For more information on the [Azure DNS Private Resolver] SLAs, see [https://azure.microsoft.com/en-us/support/legal/sla/dns/v1_1/].

For detailed steps on how to provision the service please refer to the following location [https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-get-started-portal].

#### Create a resource with availability zone enabled
For Azure DNS Private Resolver, you do not need to do any additional steps. Just create the resource in the region with AZ support and it will be available across all AZ's
https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-get-started-portal

### Fault tolerance

- During a zone-wide outage, no action is required during zone recovery, Offering will self-heal and re-balance itself to take advantage of the healthy zone automatically. 
- The service is provisioned across all the AZ's.

## Disaster recovery: cross-region failover
For cross-region failover in Azure DNS Private Resolver please refer to the following article:
https://learn.microsoft.com/en-us/azure/dns/tutorial-dns-private-resolver-failover

### Cross-region disaster recovery in multi-region geography

In the event of a regional outage we recommend using the same pattern as the failover described above.

When there is a regional failure, if following the pattern described here[https://learn.microsoft.com/en-us/azure/dns/tutorial-dns-private-resolver-failover], it will enable you to keep resolving names on the other active regions and also increase the resiliency of your workloads. 

All instances of Azure DNS Private Resolver run as Active-Active within the same region.

The service health is onboarded to Azure Resource Health [https://learn.microsoft.com/en-us/azure/service-health/resource-health-overview] so you will be able to check for health notifications when you subscribe to them [https://learn.microsoft.com/en-us/azure/service-health/alerts-activity-log-service-notifications-portal].

The SLA is Azure DNS Private Resolver is available here: [https://azure.microsoft.com/en-us/support/legal/sla/dns/v1_1/].

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)