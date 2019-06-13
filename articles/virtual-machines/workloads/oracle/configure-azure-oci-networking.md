---
title: Set up connectivity between Azure and Oracle Cloud Infrastructure | Microsoft Docs
description: Connect Azure ExpressRoute with Oracle Cloud Infrastructure (OCI) FastConnect to enable cross-cloud Oracle application solutions
documentationcenter: virtual-machines
author: romitgirdhar
manager: jeconnoc
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/13/2019
ms.author: rogirdh
---

# Set up a direct interconnection between Azure and Oracle Cloud Infrastructure  

To create an [integrated multi-cloud experience](oracle-oci-overview.md) (preview), Microsoft and Oracle offer direct interconnection between Azure and Oracle Cloud Infrastructure (OCI) through [ExpressRoute](../../../expressroute/expressroute-introduction.md) and [FastConnect](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/fastconnectoverview.htm). Through the ExpressRoute and FastConnect interconnection, customers can experience low latency, high throughput, private direct connectivity between the two clouds.

> [!IMPORTANT]
> The connection between Microsoft Azure and OCI has been optimized for low latency. To enable low latency connectivity between Azure and OCI, the flag for `express_route_gateway_bypass` must be set to `true`. This feature is currently in preview. The Azure subscription must be whitelisted for this feature before being able to set up the low latency connectivity.

The following image shows a high-level overview of the interconnection:

![](media/configure-azure-oci-networking/azure-oci-connect.png)

## Prerequisites

* To establish connectivity between Azure and OCI, you must have an active Azure subscription and an active OCI tenancy.

* Connectivity is only possible where an Azure ExpressRoute peering location is in proximity to or in the same peering location as the OCI FastConnect. See [preview limitations](oracle-oci-overview.md#preview-limitations).

* Your Azure subscription must be whitelisted for the Express Route Gateway Bypass feature. Contact your Microsoft representative to enable this feature on your subscription.

* Your OCI tenancy must be whitelisted for this preview capability. Contact your Oracle representative for more details.

## Configure direct connectivity between ExpressRoute and FastConnect

1. Create a standard ExpressRoute circuit on your Azure subscription under a resource group. 
    * While creating the ExpressRoute, choose **Oracle** as the service provider. To create an ExpressRoute circuit, see the [step-by-step guide](../../../expressroute/expressroute-howto-circuit-portal-resource-manager.md).
    * An Azure ExpressRoute circuit provides granular bandwidth options, whereas FastConnect supports 1, 2, 5, or 10 Gbps. Therefore, it is recommended to choose one of these matching bandwidth options under ExpressRoute.
    * Note down your ExpressRoute Service key. You need to provide the key while configuring your FastConnect circuit.
1. Carve out two private IP address spaces of /30 each that do not overlap with your Azure virtual network or OCI virtual cloud network  IP address space. We refer to the first IP address space as the *primary* address space and the second IP address space as the *secondary* address space. Note down the addresses, which you need when configuring your FastConnect circuit.
1. Create a Dynamic Routing Gateway (DRG). You need this when creating your FastConnect circuit. For more information, see the [Dynamic Routing Gateway](https://docs.cloud.oracle.com/iaas/Content/Network/Tasks/managingDRGs.htm) documentation.
1. Create a FastConnect circuit under your Oracle tenant. For more information, see the [Oracle documentation](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/azure.htm).
  
    * Under FastConnect configuration, select **Microsoft Azure: ExpressRoute** as the provider.
    * Select the Dynamic Routing Gateway that you provisioned in the previous step.
    * Select the bandwidth to be provisioned. For optimal performance, the bandwidth must match the bandwidth selected when creating the ExpressRoute circuit.
    * In **Provider Service Key**, paste the ExpressRoute service key.
    * Use the first /30 private IP address space carved out in a previous step for the **Primary BGP IP Address** and the second /30 private IP address space for the **Secondary BGP IP** Address.
        * Assign the first useable address of the two ranges for the Oracle BGP IP Address (Primary and Secondary) and the second address to the customer BGP IP Address (from a FastConnect perspective). The first useable IP address is the second IP address in the /30 address space (the first IP address is reserved by Microsoft).
    * Click `Create`.
1. Complete linking the FastConnect to the virtual cloud network under your Oracle tenant via Dynamic Routing Gateway, using Route Table.
1. Configure private peering under your ExpressRoute circuit. You need the two /30 IP address spaces configured while setting up the FastConnect circuit. To configure peering, see the [step-by-step guide](../../../expressroute/expressroute-howto-routing-portal-resource-manager.md).
    * The primary /30 IP address space should be entered in the **Primary subnet**.
    * The secondary /30 IP address space should be entered in the **Secondary subnet**.
    * Set a valid **VLAN ID** to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID. For both primary and secondary links you must use the same VLAN ID.
1. Complete connecting the private peering to the virtual gateway of your VNet, following the [step-by-step guide](../../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md).

Once you have completed the network configuration, you can verify the validity of your configuration by checking the ARP table and Route table under the ExpressRoute private peering blade in the Azure portal.

## Automation

Microsoft has created Terraform scripts to enable automated deployment of the network interconnect. The Terraform scripts need to authenticate with Azure before execution, because they require adequate permissions on the Azure subscription. Authentication can be performed using an [Azure Active Directory service principal](../../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) or using the Azure CLI. For more information, see the [Terraform documentation](https://www.terraform.io/docs/providers/azurerm/auth/azure_cli.html).

The Terraform scripts and related documentation to deploy the inter-connect can be found in this [GitHub repository](https://aka.ms/azureociinterconnecttf).

## Monitoring

Installing agents on both the clouds, you can leverage Azure [Network Performance Monitor (NPM)](../../../expressroute/how-to-npm.md) to monitor the performance of the end-to-end network. NPM helps you to readily identify network issue, and help eliminating them.

## Next steps

* For more information about the cross-cloud connection between OCI and Azure, see the [Oracle documentation](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/azure.htm).
* Use [Terraform scripts](https://aka.ms/azureociinterconnecttf) to deploy infrastructure for targeted Oracle applications over Azure, and configure the network interconnect. 