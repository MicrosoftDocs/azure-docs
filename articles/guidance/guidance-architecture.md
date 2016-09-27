
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
   ms.date="06/29/2016"
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
- [Running VMs for an N-tier architecture](guidance-compute-3-tier-vm.md)
- [Adding reliability to an N-tier architecture (Windows)](guidance-compute-n-tier-vm.md)
- [Adding reliability to an N-tier architecture (Linux)](guidance-compute-n-tier-vm-linux.md)
- [Running VMs in multiple regions for high availability (Windows)](guidance-compute-multiple-datacenters.md)
- [Running VMs in multiple regions for high availability (Linux)](guidance-compute-multiple-datacenters-linux.md)

## Connecting your on-premises network to Azure

This series starts by demonstrating the ways to connect your existing network to Azure. Then it expands to cover requirements for availability and security.

- [Implementing a hybrid network architecture with Azure and on-premises VPN](guidance-hybrid-network-vpn.md)
- [Implementing a hybrid network architecture with Azure ExpressRoute](guidance-hybrid-network-expressroute.md)
- [Implementing a highly available hybrid network architecture](guidance-hybrid-network-expressroute-vpn-failover.md)
- [Implementing a DMZ between Azure and your on-premises datacenter](guidance-iaas-ra-secure-vnet-hybrid.md)
- [Implementing a DMZ between Azure and the Internet](guidance-iaas-ra-secure-vnet-dmz.md)

## Architecting scalable web application using Azure PaaS

This series covers recommendations for constructing scalable and highly available web apps. 

- [Basic web application](guidance-web-apps-basic.md)
- [Improving scalability in a web application](guidance-web-apps-scalability.md)
- [Web application with high availability](guidance-web-apps-multi-region.md)
