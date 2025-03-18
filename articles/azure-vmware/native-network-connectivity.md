---
title: Connectivity to Azure virtual networks
description: Learn about key concepts and use cases connectivity to Azure virtual networks.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
---

# Connectivity to Azure virtual networks

This article discusses how to connect the private cloud to the Azure VNets – Hosted virtual network, other VNets in the region, and VNets in other regions. After you deploy Azure VMware Solution on native private clouds, you may need to have network connectivity between the private cloud and other networks you have on Azure Virtual Network (virtual network), on-premises, other Azure VMware Solution private clouds, or the internet. You learn how to establish connectivity to the Azure VMware Solution hosted (Local) virtual network
and other VNets.

## Prerequisites

- Azure VMware Solution on native private cloud deployed successfully within your Azure virtual network.
- Multiple VNets to establish connectivity to private cloud Azure virtual network.

## Connectivity to Azure VMware Solution Hosted (Local) virtual network

Azure VMware Solution on native is directly hosted on Azure Virtual Network, unlike its predecessor. This means that the connectivity to the local virtual network from Azure VMware Solution SDDC is established during deployment, with no another configuration required. The Azure VMware Solution on native operates similarly to other Azure services from a network connectivity standpoint. Therefore any NSX workload segments created on Azure VMware Solution SDDC are systematically programmed, as virtual network address space, to the virtual network domain for routing purposes.

:::image type="content" source="./media/native-connectivity/native-connectivity-private-vnet-pairing.png" alt-text="Diagram of an Azure VMware Solution connection to a private cloud":::

Azure VMware Solution creates the following read-only management subnets within the hosted virtual network to host required SDDC components. These Management Subnets are allocated from the management address block specified for SDDC creation. The following  are sample subnets derived from an SDDC with a 10.74.64.0/22 address block.

![Sample virtual network address space page updated with Azure VMware Solution NSX advertised routes](path/to/image)

## Connectivity to other virtual networks

Azure VMware Solution's native connectivity to nonlocal virtual networks follows the same procedure as Azure virtual network users use to connect their workloads between virtual networks. Azure VMware Solution on native virtual network can be connected to other nonlocal virtual networks using Azure virtual network peering as described in the following [Azure documentation](/azure/virtual-network/virtual-network-peering-overview).

Both regional virtual network peering and global virtual network peering are supported for Azure VMware Solution on native virtual network connectivity.

 >[!Note]
 > The standard Azure peer virtual network peering resync needs to be done to propagate any NSX segment/subnet/route changes on Azure VMware Solution private cloud.

:::image type="content" source="./media/native-connectivity/native-connectivity-private-cloud.png" alt-text="Diagram showing an Azure VMware Solution connection to other virtual networks":::
