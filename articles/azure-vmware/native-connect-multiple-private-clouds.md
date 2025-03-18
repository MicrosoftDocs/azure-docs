---
title: Connect multiple Azure VMware Solution on native private clouds
description: Learn about connecting multiple Azure VMware Solution on native private clouds.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
---
# Connect multiple Azure VMware Solution on native private clouds

After you deploy Azure VMware Solution on native private clouds, you may need to have network connectivity between the private cloud and other networks you have on Azure Virtual Network (VNet), on-premises, other Azure VMware Solution private clouds, or the internet.

This article focuses on how the private cloud gets connectivity to the other Azure VMware Solution on native private clouds.In this article, you will learn to connect to multiple Azure VMware Solution on native private clouds.

## Prerequisite

- Have multiple Azure VMware Solution on native private cloud deployed successfully

## Connect multiple Azure VMware Solution on native private clouds

Azure VMware Solution on native private cloud in different VNets can be interconnected using VNet peering, just like how standard VNet interconnect is done. The VNet peering would provide the best possible throughput and latency between Azure VMware Solution private clouds in the same region. How to do Azure VNet peering is described in the following [Azure documentation](/azure/virtual-network/virtual-network-peering-overview).

Depending on the location of the private cloud locations, you would be having local VNet peering or global VNet peering.

:::image type="content" source="./media/native-connectivity/native-connect-multiple-solutions-onpremise.png" alt-text="Diagram of an Azure VMware Solution connection to on-premise environment":::