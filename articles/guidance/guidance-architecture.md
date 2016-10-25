
<properties
   pageTitle="Azure Guidance | patterns & practices | Microsoft Azure"
   description="Azure Reference Architectures"
   services=""
   documentationCenter="na"
   authors="bennage"
   manager="marksou"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/24/2016"
   ms.author="christb"/>

# Azure Reference Architectures

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

_This content is in active development. It is useful today, so we are making it available for preview. We value your feedback._

Our reference architectures are arranged by scenario, with multiple related architectures grouped together.
Each individual architecture offers recommended practices and prescriptive steps, as well as an executable component that embodies the recommendations.
Many of the architectures are progressive; building on top of preceding architectures that have fewer requirements.

## Designing your infrastructure for resiliency

This series begins with recommended practices for optimal VM configuration and culminates in a multi-region deployment with failover.

- [Running a Windows VM on Azure](guidance-compute-single-vm.md)
- [Running a Linux VM on Azure](guidance-compute-single-vm-linux.md)
- [Running multiple VMs for scalability and availability](guidance-compute-multi-vm.md)
- [Running Windows VMs for an N-tier architecture](guidance-compute-n-tier-vm.md)
- [Running Linux VMs for an N-tier architecture](guidance-compute-n-tier-vm-linux.md)
- [Running Windows VMs in multiple regions for high availability](guidance-compute-multiple-datacenters.md)
- [Running Linux VMs in multiple regions for high availability](guidance-compute-multiple-datacenters-linux.md)

## Connecting your on-premises network to Azure

This series starts by demonstrating the ways to connect your existing network to Azure. Then it expands to cover requirements for availability and security.

- [Implementing a hybrid network architecture with Azure and on-premises VPN](guidance-hybrid-network-vpn.md)
- [Implementing a hybrid network architecture with Azure ExpressRoute](guidance-hybrid-network-expressroute.md)
- [Implementing a highly available hybrid network architecture](guidance-hybrid-network-expressroute-vpn-failover.md)

## Securing your hybrid network

This series covers proven practices on creating DMZ in Azure to secure connections coming from your on-premises datacenter, and the Internet.

- [Implementing a DMZ between Azure and your on-premises datacenter](guidance-iaas-ra-secure-vnet-hybrid.md)
- [Implementing a DMZ between Azure and the Internet](guidance-iaas-ra-secure-vnet-dmz.md)

## Providing Identity services

This series starts by demonstrating how to use Azure Active Directory to provide user authentication in Azure. Then it expands to cover complex scenarios extending your ADDS infrastructure to Azure, and using ADFS for delegation.

- [Implementing Azure Active Directory](./guidance-identity-aad.md)
- [Extending Active Directory Directory Services (ADDS) to Azure](./guidance-adds-extend-domain.md)
- [Creating a Active Directory Directory Services (ADDS) resource forest in Azure](./guidance-identity-adds-resource-forest.md)
- [Implementing Active Directory Federation Services (ADFS) in Azure](./guidance-identity-adfs.md)

## Architecting scalable web application using Azure PaaS

This series covers recommendations for constructing scalable and highly available web apps. 

- [Basic web application](guidance-web-apps-basic.md)
- [Improving scalability in a web application](guidance-web-apps-scalability.md)
- [Web application with high availability](guidance-web-apps-multi-region.md)
