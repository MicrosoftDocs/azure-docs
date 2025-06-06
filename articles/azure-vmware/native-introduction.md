---
title: Introduction to Azure VMware Solution Generation 2 Private Clouds (preview) 
description: Learn about Azure VMware Solution Gen 2 private clouds.
ms.topic: overview
ms.service: azure-vmware
ms.date: 4/22/2025
ms.custom:
  - engagement-fy25
  - build-2025
ms.author: jacobjaygbay
# customer intent: As a cloud administrator, I want to learn about Azure VMware Solution Gen 2 private clouds so that I can understand the features and benefits of this offering.
---

# Introduction to Azure VMware Solution Generation 2 Private Clouds (preview) 

Azure VMware Solution Generation 2 (Gen 2) private clouds can now be deployed inside an Azure Virtual Network, conforming Azure VMware Solution to Azure networking standards. This architecture simplifies networking architecture, enhances data transfer speeds, reduces latency for workloads, and improves performance when accessing other Azure services. Users can now deploy Azure VMware Solution private clouds with the AV64 SKU directly, eliminating the need for a minimum of 3-host AV36, AV36P, AV48, or AV52 seed cluster. A minimum 3-host AV64 cluster is still required. The same Azure VMware Solution limits apply as described in [Scale clusters in a Private Cloud](tutorial-scale-private-cloud.md).

:::image type="content" source="./media/native-connectivity/azure-virtual-network-connectivity.png" alt-text="Diagram showing an Azure VMware Solution Gen 2 Virtual Network connectivity." lightbox="media/native-connectivity/azure-virtual-network-connectivity.png"::: 

## Differences

The following table summarizes the differences between Gen 1 and Gen 2 private clouds:

| Feature               | Azure VMware Solution Gen 1 private clouds    | Azure VMware Solution Gen 2 private clouds       |
|-----------------------|-----------------------------------------------|--------------------------------------------------|
| Supported SKU type    | <ul><li>AV36, AV36P, AV52, AV48</li><li>AV64 (with seed cluster of at least three AV36, AV36P, AV48, or AV52 nodes)</li></ul>| <ul><li>Minimum 3-host AV64 cluster</li></ul>|
| Network Attach Model  | <ul><li>ExpressRoute</li></ul>                | <ul><li>Virtual Network</li></ul>                |

## Benefits
With the Azure VMware Solution Gen 2 private clouds offering, you get the following benefits: 

### Simplified deployment and cost efficiency 
- You can deploy Azure VMware Solution Gen 2 private clouds with the AV64 SKU directly, eliminating the need for a minimum of 3-host AV36, AV36P, AV48, or AV52 seed cluster. A minimum 3-host AV64 cluster is still required. 

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

Azure VMware Solution Gen 2 private clouds are available in the following regions for Preview.

| Region | Status |
|--------|--------|
| East US | Preview |
| Switzerland North | Preview |

## Next steps

- Get started with configuring your Azure VMware Solution service principal as a prerequisite. To learn how, see the [Enabling Azure VMware Solution service principal](native-first-party-principle-security.md) quickstart.
  
- Follow a tutorial for [Creating an Azure VMware Gen 2 private cloud](native-create-azure-vmware-virtual-network-private-cloud.md)

- Learn more about [Azure VMware Solution Gen 2 private cloud design considerations](native-network-design-consideration.md)
