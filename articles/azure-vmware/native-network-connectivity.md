---
title: Connectivity to Azure VNETs
description: Learn about key concepts and use cases connectivity to Azure VNET.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
---

# Connectivity to Azure VNETs

This article discusses how to connect the private cloud to the Azure VNets – Hosted VNet, other VNets in the region, and VNets in other regions. After you deploy Azure VMware Solution on native private clouds, you may need to have network connectivity between the private cloud and other networks you have on Azure Virtual Network (VNet), on-premises, other Azure VMware Solution private clouds, or the internet. You'll learn how to establish connectivity to the Azure VMware Solution hosted (Local) VNet
and other VNets.

## Prerequisites

- Azure VMware Solution on native private cloud deployed successfully within your Azure VNet.
- Multiple VNets to establish connectivity to private cloud Azure VNet.

## Connectivity to AVS Hosted (Local) VNET

Azure VMware Solution on native is directly hosted on Azure Virtual Network (VNET), unlike its predecessor. This means that the connectivity to the local VNET from AVS SDDC is established during deployment, with no additional configuration required. The AVS on native operates similarly to other Azure services from a network connectivity standpoint, so any NSX workload segments created on AVS SDDC will be systematically programmed, as VNET address space, to the VNET domain for routing purposes.

:::image type="content" source="./media/native-connectivity/native-connectivity-private-vnet-pairing.png" alt-text="Diagram of an Azure VMware Solution connection to a private cloud":::

Azure VMware Solution creates the following read-only management subnets within the hosted VNET to host required SDDC components. These Management Subnets are allocated from the management address block specified for SDDC creation. Below are sample subnets derived from an SDDC with a 10.74.64.0/22 address block.

![Sample VNET address space page updated with Azure VMware Solution NSX advertised routes](path/to/image)

## Connectivity to Other VNET(s)

Azure VMware Solution's native connectivity to non-local VNETs follows the same procedure as Azure VNET users use to connect their workloads between VNETs. AVS on native VNET can be connected to other non-local VNETs using Azure VNET peering as described in the following [Azure documentation](/azure/virtual-network/virtual-network-peering-overview).

Both regional VNet peering and global VNet peering are supported for Azure VMware Solution on native VNet connectivity.

 >[!Note]
 > The standard Azure peer VNET peering resync needs to be done to propagate any NSX segment/subnet/route changes on AVS private cloud.

:::image type="content" source="./media/native-connectivity/native-connectivity-private-cloud.png" alt-text="Diagram showing an Azure VMware Solution connection to other VNETs":::
