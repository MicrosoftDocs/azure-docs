---
title: Azure VMware Solution in a Virtual Network (Public preview) 
description: Learn about Azure VMware Solution in a Virtual Network.
ms.topic: overview
ms.service: azure-vmware
ms.date: 3/28/2025
ms.custom: engagement-fy25
ms.author: jacobjaygbay
# customer intent: As a cloud administrator, I want to learn about Azure VMware Solution in a Virtual Network so that I can understand the benefits and features of this offering.
---

# Azure VMware Solution in a virtual network (Public Preview)

Azure VMware Solution in an Azure Virtual Network combines the first-party Azure VMware Solution with Azure hardware and operations to improve the customer experience, quality, and security. This offering provides updated architecture that uses Azure Native physical network and hardware infrastructure. This allows customers to get the best of both worlds. Customers get to use their existing VMware expertise, while using the benefits of the entire Azure cloud to more effectively and efficiently manage their workloads. This initial launch of this offering utilizes the existing AV64 SKU.

:::image type="content" source="./media/native-connectivity/azure-virtual-network-connectivity.png" alt-text="Diagram showing an Azure VMware Solution virtual network connectivity."::: 

## Differences

The following table summarizes the differences between the Azure VMware Solution and the Azure VMware Solution in an Azure Virtual Network offering:

| Feature               | Azure VMware Solution                          | Azure VMware Solution in an Azure Virtual Network |
|-----------------------|-----------------------------------------------|--------------------------------------------------|
| Supported SKU type    | - AV36, AV36P, AV52, AV48                     | - AV64                                           |
|                       | - AV64 (with minimum of 3 AV36, AV36P, AV52, or AV48) |                                                  |
| Network Attach Model  | ExpressRoute                                  | Virtual Network                                  |

## Benefits

With the Azure VMware Solution in a Virtual Network offering, you get the following benefits:

### Simplified deployment and cost efficiency

You can now deploy Azure VMware Solution private clouds with the AV64 SKU directly, eliminating the need for a minimum of 3-host AV36, AV36P, or AV52 cluster. This means lower upfront costs and a faster time-to-value for customers looking to scale efficiently.

### Seamless Azure integration

Azure VMware Solution private clouds are now deployed inside an Azure Virtual Network by default, providing instant connectivity to other Azure services. This enables you to apply the full capabilities of Azure and modernize their applications while keeping your VMware expertise. No extra networking setup needed-Azure Virtual Network peering works out of the box.

### Enhanced security and compliance

Your Azure VMware Solution private cloud still runs on dedicated, isolated hardware, which means you get the continued benefits of privacy of a private cloud while staying within Azure. Customers can apply Azure-native security tools, like Network Security Groups (NSGs), to simplify security management.

### More features and capabilities unlocked

- Ability to select Private DNS resolution for your private cloud, enabling you to communicate across Azure and on-premises environments without being exposed to the internal.
- Ability to select which availability zone to deploy your private cloud in to minimize latency to on-premises environments.

## Supported SKU type

This offering is supported on the following SKU type:
- AV64

## Regional availability

Azure VMware Solution in an Azure virtual network offering is available in the following regions.

| Region | Status |
|--------|--------|
| East US | Public Preview |
| UK South | Public Preview |
| Japan East | Public Preview |
| Switzerland North | Public Preview |

