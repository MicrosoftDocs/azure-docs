---
title: What is Azure public MEC?
description: Learn about the benefits of Azure public multi-access edge compute (MEC) and how it works.
author: reemas-new
ms.author: reemas
ms.service: public-multi-access-edge-compute-mec
ms.topic: overview
ms.date: 11/22/2022
ms.custom: template-overview
---

# What is Azure public MEC?

Azure public multi-access edge compute (MEC) sites are small-footprint extensions of Azure. They're placed in or near mobile operators' data centers in metro areas, and are designed to run workloads that require low latency while being attached to the mobile network.  Azure public MEC is offered in partnership with the operators. The placement of the infrastructure offers lower latency for applications that are accessed from mobile devices connected to the 5G mobile network.

Azure public MEC provides secure, reliable, high-bandwidth connectivity between applications that run close to the user while being served by the Microsoft global network. Azure public MEC offers a set of Azure services like Azure Virtual Machines, Azure Load Balancer, and Azure Kubernetes for Edge, with the ability to leverage and connect to other Azure services available in the Azure region.

Some of the industries and use cases where Azure public MEC can provide benefits are:

- Media streaming and content delivery
- Real-time analytics and inferencing via artificial intelligence and machine learning
- Rendering for mixed reality
- Connected automobiles
- Healthcare
- Immersive gaming experiences
- Low latency applications for the retail industry

:::image type="content" source="./media/overview/azure-public-mec-benefits.png" alt-text="Diagram showing the benefits of Azure public MEC.":::

## Benefits of Azure public MEC

Azure public MEC has the following benefits:

- Low latency applications at the 5G network edge:
  
  - Enterprises and developers can run low-latency applications by using the operator’s public 5G network connectivity. This connectivity is architected with a direct, dedicated, and optimized connection to the operator’s mobility core network.

- Access to key Azure services and experiences:
  - Azure-managed toolset: Azure customers can provision and manage their Azure public MEC services and workloads through the Azure portal and other essential Azure tools.
  - Consistent developer experience: Developing and building applications for the public MEC utilizes the same array of features and tools that Azure uses.

- Access to a rich partner ecosystem:
  - ISVs working on optimized and scalable applications for edge computing can use the Azure public MEC solution for building solutions. These solutions offer low latency and leverage the 5G mobility network and connected scenarios.

## Service offerings for Azure public MEC

Azure public MEC enables some key Azure services for customers to deploy. The control plane for these services remains in the region and the data plane is deployed at the edge, resulting in a smaller Azure footprint, fewer dependencies, and the ability to leverage other services deployed at the region.  

The following key services are available in Azure public MEC:

- Azure Virtual Machines (Azure public MEC supports these [SKUs](key-concepts.md#azure-virtual-machines))
- Virtual Machine Scale Sets
- Azure Private Link
- Standard public IP
- Azure Virtual Networks
- Virtual network peering
- Azure Standard Load Balancer
- Azure Kubernetes for Edge
- Azure Bastion (must be deployed in a virtual network in the parent Azure region)
- Azure managed disks (Azure public MEC supports Standard SSD)
- Azure IoT Edge - preview
- Azure Site Recovery (ASR) - preview

The following diagram shows how services are deployed at the Azure public MEC location. With this capability, enterprises and developers can deploy the customer workloads closer to their users.

:::image type="content" source="./media/overview/azure-public-mec-service-deployment.png" alt-text="Diagram showing Azure public MEC service deployment.":::  

## Partnership with operators

Azure public MEC solutions are available in partnership with mobile network operators. The current operator partnerships are as follows:

- AT&T: Atlanta, Dallas, Detroit

## Next steps

To learn about important concepts for Azure public MEC, advance to the following article:

> [!div class="nextstepaction"]
> [Key concepts for Azure public MEC](key-concepts.md)
