---
title: Azure NAT Gateway SKUs
description: Overview of available Azure NAT Gateway SKUs and their differences.
ms.date: 05/15/2026
ms.topic: overview
ms.service: azure-nat-gateway
author: alittleton
ms.author: alittleton
ms.customs: references_regions
---

# Azure NAT Gateway SKUs

Azure NAT Gateway has two stock-keeping units (SKUs): Standard and StandardV2. This article provides an overview of these SKUs and their differences.

## SKU comparison

| Category | Feature | Standard | StandardV2 |
| -------- | ------- | ---------- | -------- |
| Reliability | Availability zones | Not supported | Supported |
| Functionality | Source network address translation (SNAT) | Supported | Supported |
| | Dynamic port allocation | Supported | Supported |
| | Idle timeout timer | Supported | Supported |
| | Port reuse timer | Supported | Supported |
| | Protocols | TCP, UDP | TCP, UDP |
| | Public IP version | IPv4 | IPv4, IPv6 |
| | Attach point | Subnet | Subnet |
| Scalability | Public IP addresses | 16 IPv4 addresses | 16 IPv4 addresses, 16 IPv6 addresses |
| | Public IP prefixes | /28 IPv4 prefix | /28 IPv4 prefix, /124 IPv6 prefix |
| | Virtual networks | 1 | 1 |
| | Subnets | 800 | 800 |
| Monitoring | Metrics | Supported | Supported |
| Limits | Bandwidth | 50 Gbps per NAT gateway | 100 Gbps per NAT gateway, 1 Gbps per connection |
| | Packets per second | 5 million packets per second | 10 million packets per second, 100,000 packets per second per connection |
| | Connections per IP per destination | 50,000 | 50,000 |
| | Total connections | 2 million | 2 million |

## Pricing and SLA

Standard and StandardV2 NAT gateways are the same price. For more information, see [Azure NAT Gateway pricing](https://azure.microsoft.com/pricing/details/azure-nat-gateway/).

For information on the service-level agreement (SLA), see the [Microsoft SLAs for online services](https://azure.microsoft.com/support/legal/sla/virtual-network-nat/v1_0/).

## Standard SKU features

The Standard SKU is a zonal resource. It's deployed into a specific availability zone and is resilient within that zone.

You can attach a Standard NAT gateway to individual subnets within the same virtual network in order to provide scalable outbound connectivity to the internet.

## StandardV2 SKU features

### Zone redundancy

A StandardV2 NAT gateway is *zone redundant* by default. It automatically spans multiple availability zones in a region to provide continued outbound connectivity even if one zone becomes unavailable.

For more information, see [Reliability in Azure NAT Gateway](/azure/reliability/reliability-nat-gateway).

### Performance

A StandardV2 NAT gateway supports up to 100 Gbps of bandwidth and can process up to 10 million packets per second. On a per-connection basis, a StandardV2 NAT gateway supports 1 Gbps per connection and 100,000 packets per second.  

### IPv6 support

You can attach a StandardV2 NAT gateway to 16 IPv6 public IPs and 16 IPv4 public IPs simultaneously in order to provide highly scalable dual-stack outbound connectivity to the internet.  

### Flow logs

A StandardV2 NAT gateway supports flow logs through Azure Monitor. Flow logs provide visibility into the traffic that flows through the NAT gateway. For more information, see [Manage StandardV2 NAT gateway flow logs](./nat-gateway-flow-logs.md).

### Known limitations

* The StandardV2 SKU requires StandardV2 public IP addresses and prefixes. Standard public IPs aren't supported.

* You can't upgrade the Standard SKU to the StandardV2 SKU. You must deploy a StandardV2 NAT gateway to replace the Standard NAT gateway.

* Custom IP prefixes (bring-your-own-IP public IPs) aren't supported with the StandardV2 SKU. Only StandardV2 Azure public IPs are supported.

* The following regions don't support StandardV2 NAT gateways:

  * Canada East  
  * Chile Central  
  * Indonesia Central  
  * Israel Northwest  
  * Malaysia West  
  * Qatar Central
  * Sweden South
  * West India

* Deployment of a StandardV2 NAT gateway as a managed NAT gateway for Azure Kubernetes Service (AKS) is now in preview. A StandardV2 NAT gateway can also be configured as a user-assigned NAT gateway for AKS workloads. For more information, see [Create a NAT gateway for your AKS cluster](/azure/aks/nat-gateway).

### Known issues

* A StandardV2 NAT gateway disrupts outbound connections made with load balancer outbound rules for IPv6 traffic only. If you see disruption to outbound connectivity for IPv6 outbound traffic with load balancer outbound rules, remove the StandardV2 NAT gateway from the subnet or virtual network. Then use either:
  
  * Load balancer outbound rules to provide outbound connectivity for both IPv4 and IPv6 traffic
  * A Standard NAT gateway to provide outbound connectivity for IPv4 traffic and load balancer outbound rules for IPv6 traffic

* Outbound connections that use a load balancer, Azure Firewall, or VM instance-level public IPs might be interrupted when you add a StandardV2 NAT gateway to a subnet. All net new outbound connections use the StandardV2 NAT gateway.

## Related content

* [Deploy a Standard NAT gateway](./quickstart-create-nat-gateway.md) for single-zone deployments.
* [Deploy a StandardV2 NAT gateway](./quickstart-create-nat-gateway-v2.md) to provide a zone-resilient network architecture.
