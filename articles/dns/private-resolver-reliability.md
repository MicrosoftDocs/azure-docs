---
title: Resiliency in Azure DNS Private Resolver #Required; Must be "Resiliency in *your official service name*"
description: Find out about reliability in Azure DNS Private Resolver #Required; 
author: greg-lindsay #Required; your GitHub user alias, with correct capitalization.
ms.author: greglin #Required; Microsoft alias of author; optional team alias.
ms.custom: subject-reliability
ms.service: dns
ms.topic: conceptual
ms.date: 09/27/2022 #Required; mm/dd/yyyy format.
#Customer intent: As a customer, I want to understand reliability support for Azure DNS Private Resolver. I need to avoid failures and respond to them so that I can minimize down time and data loss.
---

# Resiliency in Azure DNS Private Resolver

This article describes reliability support in Azure DNS Private Resolver, and covers both regional resiliency with [availability zones](#availability-zones) and cross-region resiliency with disaster recovery. 

> [!NOTE]
> Azure DNS Private Resolver supports availability zones without any further configuration! When the service is provisioned, it's deployed across the different availability zones, and will provide zone resiliency out of the box.

For a comprehensive overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Azure DNS Private Resolver

[Azure DNS Private Resolver](dns-private-resolver-overview.md) enables you to query Azure DNS private zones from an on-premises environment, and vice versa, without deploying VM based DNS servers. You no longer need to provision IaaS based solutions on your virtual networks to resolve names registered on Azure private DNS zones. You can configure conditional forwarding of domains back to on-premises, multicloud, and public DNS servers. 

## Availability zones

For more information about availability zones, see [Regions and availability zones](../availability-zones/az-overview.md).

### Prerequisites

For a list of regions that support availability zones, see [Azure regions with availability zones](../availability-zones/az-region.md#azure-regions-with-availability-zones). If your Azure DNS Private Resolver is located in one of the regions listed, you don't need to take any other action beyond provisioning the service.

#### Enabling availability zones with private resolver

To enable AZ support for Azure DNS Private Resolver, you do not need to take further steps beyond provisioning the service. Just create the private resolver in the region with AZ support, and it will be available across all AZs.

For detailed steps on how to provision the service, see [Create an Azure private DNS Resolver using the Azure portal](dns-private-resolver-get-started-portal.md).

### Fault tolerance

During a zone-wide outage, no action is required during zone recovery. The service will self-heal and rebalance to take advantage of the healthy zone automatically. The service is provisioned across all the AZs. 

## Disaster recovery and cross-region failover

For cross-region failover in Azure DNS Private Resolver, see [Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md).

In the event of a regional outage, use the same design as that described in [Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md). When you configure this failover design, you can keep resolving names using the other active regions, and also increase the resiliency of your workloads. 

All instances of Azure DNS Private Resolver run as Active-Active within the same region.

The service health is onboarded to [Azure Resource Health](../service-health/resource-health-overview.md), so you'll be able to check for health notifications when you subscribe to them. For more information, see [Create activity log alerts on service notifications using the Azure portal](../service-health/alerts-activity-log-service-notifications-portal.md).

Also see the [SLA for Azure DNS](https://azure.microsoft.com/support/legal/sla/dns/v1_1/).

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](../availability-zones/overview.md)