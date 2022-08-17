---
title: Resolve Azure and on-premises domains
description: Configure Azure and on-premises DNS to resolve private DNS zones and on-premises domains
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 08/17/2022
ms.author: greglin
# Customer intent: As an administrator, I want to resolve on-premises domains in Azure and resolve Azure private zones on-premises.
---

# Resolve Azure and on-premises domains

Learn how to configure hybrid DNS by using forwarding rulesets and Azure DNS Private Resolvers. This article provides guidance on how to:

- Set up an Azure DNS Private Resolver
- Configure a forwarding ruleset in Azure
- Configure on-premises DNS conditional forwarders
- Enable Azure resources to resolve on-premises domains
- Resolve Azure private DNS zones with your on-premises DNS

The [Azure DNS Private Resolver](dns-private-resolver-overview.md) is a service that can resolve on-premises DNS queries for Azure DNS private zones. Previously, it was necessary to [deploy a VM based custom DNS resolver](/azure/hdinsight/connect-on-premises-network), or use non-Microsoft DNS, DHCP, and IPAM solutions to perform this function.

## Benefits of Azure DNS Private Resolver

Benefits of the Azure DNS Private Resolver service include:
- Zero maintenance: Unlike VM or hardware based solutions, the private resolver does not require software updates, vulnerability scans, or security patching. The private resolver service is fully managed.
- Cost reduction: Azure DNS Private Resolver is a multi-tenant service and can cost a fraction of the expense required to use and license multiple VM based DNS resolvers.
- High availability: The Azure DNS Private Resolver service has built-in high availability features. Ensuring high availability and redundancy of your DNS solution can be accomplished much less effort. For more information on how to configure DNS failover using the private resolver service, see [Tutorial: Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md).
- DevOps friendly: Traditional DNS solutions are hard to integrate with DevOps workflows as these often require manual configuration for every DNS change. Azure DNS private resolver provides a fully functional ARM interface which can be easily integrated with DevOps workflows.

## Hybrid DNS resolution

In the current context, Hybrid DNS resolution is defined as being able to: 1) resolve Azure DNS private zones from on-premises and 2) resolve on-premises domains using Azure resources.

## Next steps
To learn more about private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md).

Learn how to [create a private DNS zone](./private-dns-getstarted-powershell.md) in Azure DNS.

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
