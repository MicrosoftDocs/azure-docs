---
title: Introduction to Azure VMware Solution Generation 2 Private Clouds (Public preview) 
description: Learn about Azure VMware Solution Gen 2 private clouds.
ms.topic: overview
ms.service: azure-vmware
ms.date: 3/28/2025
ms.custom: engagement-fy25
ms.author: jacobjaygbay
# customer intent: As a cloud administrator, I want to learn about Azure VMware Solution Gen 2 private clouds so that I can understand the features and benefits of this offering.
---

# Introduction to Azure VMware Solution Generation 2 Private Clouds (Public preview) 

Azure VMware Solution Generation (Gen) 2 private clouds can now be deployed inside an Azure Virtual Network, conforming Azure VMware Solution to Azure networking standards. This architecture simplifies networking architecture, enhances data transfer speeds, reduces latency for workloads, and improves performance when accessing other Azure services. Users can now deploy Azure VMware Solution private clouds with the AV64 SKU directly, eliminating the need for a minimum of 3-host AV36, AV36P, or AV52 cluster. The same Azure VMware Solution limits apply as described in [Scale clusters in a Private Cloud](tutorial-scale-private-cloud.md).

:::image type="content" source="./media/native-connectivity/azure-virtual-network-connectivity.png" alt-text="Diagram showing an Azure VMware Solution Virtual Network connectivity." lightbox="media/native-connectivity/azure-virtual-network-connectivity.png"::: 

## Differences

The following table summarizes the differences between Gen 1 and Gen 2 private clouds:

| Feature               | Azure VMware Solution Gen 1 private clouds    | Azure VMware Solution Gen 2 private clouds |
|-----------------------|-----------------------------------------------|--------------------------------------------------|
| Supported SKU type    | - AV36, AV36P, AV52, AV48                     | - AV64                                           |
|                       | - AV64 (with minimum of 3 AV36, AV36P, AV52, or AV48) |                                                  |
| Network Attach Model  | ExpressRoute                                  | Virtual Network                                  |

## Benefits
With the Azure VMware Solution Gen 2 private clouds offering, you get the following benefits: 

### Simplified deployment and cost efficiency 
- You can deploy Azure VMware Solution Gen 2 private clouds with the AV64 SKU directly, eliminating the need for a minimum of 3-host AV36, AV36P, or AV52 cluster. 

### Seamless Azure integration 
- Azure VMware Solution Gen 2 private clouds are now deployed inside an Azure Virtual Network by default, providing instant connectivity to other Azure services.
- No extra networking setup needed and Azure Virtual Network peering works out of the box. 

### Enhanced security and compliance 
- Your Azure VMware Solution private cloud still runs on dedicated, isolated hardware, which means you get the continued benefits of a private cloud while staying within Azure. 
- You can apply Azure-centric security tools, like Network Security Groups (NSGs), to simplify security management. 

### Other features and capabilities unlocked 
- Ability to select Private DNS resolution for your private cloud, enabling businesses to communicate across Azure and on-premises environments without being exposed to the internal.  
- Ability to select which availability zone to deploy your private cloud in to minimize latency to on-premises environments. 

## Supported SKU type

Gen 2 private clouds are supported on the following SKU type:
- AV64

## Regional availability

Azure VMware Solution Gen 2 private clouds are available in the following regions for Public Preview.

| Region | Status |
|--------|--------|
| East US | Public Preview |
| UK South | Public Preview |
| Japan East | Public Preview |
| Switzerland North | Public Preview |

## Next steps

- Get started with configuring your Azure VMware Solution service principal as a prerequisite. To learn how, see the [Enabling Azure VMware Solution service principal](native-first-party-principle-security.md) quickstart.
  
- Follow a tutorial for [Creating an Azure VMware Private Cloud in an Azure Virtual Network](native-create-azure-vmware-virtual-network-private-cloud.md)

- Learn more about [Azure VMware Solution in an Azure Virtual Network design considerations](native-network-design-consideration.md)
