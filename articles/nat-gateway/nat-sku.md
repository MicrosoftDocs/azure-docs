---
title: Azure NAT Gateway SKUs
description: Overview of available NAT Gateway SKUs and their differences.
ms.date: 11/04/2025
ms.topic: article
ms.service: azure-nat-gateway
author: alittleton
ms.author: alittleton
ms.customs: references_regions
---

# Azure NAT Gateway SKUs
Azure Network Address Translation (NAT) Gateway has two stock-keeping units (SKUs). This article provides an overview of these different SKUs and their differences.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## SKU comparison
Azure Network Address Translation (NAT) Gateway has two stock-keeping units (SKUs) - Standard and StandardV2. To compare and understand the differences between Standard and StandardV2 SKU, see the following table.

| Category | Feature | StandardV2 | Standard |
|----------|---------|------------|----------|
| Reliability | Availability Zones | Supported | Not Supported |
| Functionality | Source Network Address Translation (SNAT) | Supported | Supported |
| | Dynamic port allocation | Supported | Supported |
| | Idle timeout timer | Supported | Supported |
| | Port reuse timer | Supported | Supported |
| | Protocols | TCP, UDP | TCP, UDP |
| | Public IP version| IPv4, IPv6 | IPv4 |
| | Attach point | Subnet | Subnet |
| Scalability | Public IP Addresses | 16 IPv4 addresses, 16 IPv6 addresses | 16 IPv4 addresses |
| | Public IP Prefixes | /28 IPv4 Prefix, /124 IPv6 Prefix | /28 IPv4 Prefix |
| | Virtual networks | 1 | 1 |
| | Subnets | 800 - attached at subnet level, 3,000 attached at virtual network level | 800 |
| Monitoring | Metrics | Supported | Supported |
| Limits | Bandwidth | 100 Gbps per NAT Gateway, 1 Gbps per connection | 50 Gbps per NAT Gateway |
| | Packets per second | 10 million packets per second, 100,000 packets per second per connection | 5 million packets per second |
| | Connections per IP per destination | 50,000 | 50,000 |
| | Total connections | 2 million | 2 million | 

## Pricing and Service Level Agreement (SLA)
Standard and StandardV2 NAT Gateway are the same price. For Azure NAT Gateway pricing, see [NAT Gateway pricing](https://azure.microsoft.com/pricing/details/azure-nat-gateway/).

For information on the Service Level Agreement (SLA), see [SLA for Azure NAT Gateway](https://azure.microsoft.com/support/legal/sla/virtual-network-nat/v1_0/).

## StandardV2 NAT Gateway features

### Zone-redundant 

StandardV2 SKU NAT Gateway is **zone-redundant** by default. It automatically spans across multiple availability zones in a region, ensuring continued outbound connectivity even if one zone becomes unavailable. 

For more information, see [Reliability in Azure NAT Gateway](/azure/reliability/reliability-nat-gateway).

### Performance 

StandardV2 NAT Gateway supports up to 100 Gbps of bandwidth and can process up to 10 million packets per second. On a per connection basis, StandardV2 NAT Gateway supports 1 Gbps per connection and 100,000 packets per second (PPS) per connection.  

### IPv6 support

StandardV2 NAT Gateway can be attached to 16 IPv6 public IPs and 16 IPv4 public IPs simultaneously in order to provide highly scalable dual-stack outbound connectivity to the internet.  

### Flow logs 

StandardV2 NAT Gateway supports flow logs through Azure Monitor. Flow logs provide visibility into the traffic flowing through the NAT Gateway. For more information, see [Analyze NAT Gateway traffic with flow logs](./nat-gateway-flow-logs.md). 

## Known limitations 

* Requires StandardV2 SKU Public IP addresses and prefixes. Standard SKU public IPs aren’t supported. 

* Standard SKU NAT Gateway can’t be upgraded to StandardV2 SKU NAT Gateway. You must deploy StandardV2 SKU NAT Gateway and replace Standard SKU NAT Gateway. 

* Custom IP prefixes (BYOIP public IPs) aren't supported with StandardV2 NAT Gateway. Only StandardV2 SKU Azure public IPs are supported. 

* The following regions don't support StandardV2 NAT Gateway:  
    * Canada East  

    * Central India  

    * Chile Central  

    * Indonesia Central  

    * Israel Northwest  

    * Malaysia West  

    * Qatar Central   

    * UAE Central

* StandardV2 NAT Gateway can’t be deployed as a managed NAT Gateway for Azure Kubernetes Service (AKS) workloads. It's only supported when configured as a user-assigned NAT Gateway. For more information, see [Create NAT Gateway for your AKS cluster](/azure/aks/nat-gateway).

* Terraform doesn't yet support StandardV2 NAT Gateway and StandardV2 Public IP deployments.

* StandardV2 NAT Gateway doesn't support and can't be attached to delegated subnets for the following services: 
    * Azure SQL Managed Instance 
    * Azure Container Instances 
    * Azure Database for PostgreSQL - Flexible Server 
    * Azure Database for MySQL - Flexible Server 
    * Azure Database for MySQL  
    * Azure Data Factory - Data Movement 
    * Microsoft Power Platform services 
    * Azure Stream Analytics
    * Azure Container Apps
    * Azure Web Apps 
    * Azure DNS Private Resolver 

## Known issues 
* StandardV2 NAT Gateway disrupts outbound connections made with Load balancer outbound rules for IPv6 traffic only. Standard SKU NAT gateway can be used to provide outbound for IPv4 traffic while Load balancer outbound rules is used for IPv6 outbound traffic. If you see disruption to outbound connectivity for IPv6 outbound traffic with Load balancer outbound rules, remove the StandardV2 NAT Gateway from the subnet or virtual network. Use Load balancer outbound rules to provide outbound connectivity for both IPv4 and IPv6 traffic. Or use Standard SKU NAT Gateway to provide outbound connectivity for IPv4 traffic and Load balancer outbound rules for IPv6 traffic.

* Attaching a StandardV2 NAT Gateway to an empty subnet created before April 2025 without any virtual machines may cause the virtual network to go into a failed state. To return the virtual network to a successful state, remove StandardV2 NAT Gateway, create and add a virtual machine to the subnet and then reattach the StandardV2 NAT Gateway. 

## Standard NAT Gateway features

Standard SKU is a zonal resource. It's deployed into a specific availability zone and is resilient within that zone. 

Standard NAT Gateway can be attached to individual subnets within the same virtual network in order to provide scalable outbound connectivity to the internet. 

## Next steps 

* [Deploy StandardV2 NAT Gateway](./quickstart-create-nat-gateway-v2.md) to provide a zone-resilient network architecture. 

* [Deploy Standard NAT Gateway](./quickstart-create-nat-gateway.md) for single zone deployments. 
