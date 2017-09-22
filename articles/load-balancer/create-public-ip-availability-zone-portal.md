---
title: Create a zoned public IP address with the Azure Portal | Microsoft Docs
description: Create a public IP address in an availability zone with the Azure portal.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/21/2017
ms.author: jdial
ms.custom: 
---

# Create a public IP address in an availability zone with the Azure portal

You can deploy a public IP address in an Azure availability zone (preview). An availability zone is a physically separate zone in an Azure region. Learn how to:

> * Create a public IP address in an availability zone
> * Identify related resources created in the availability zone

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> Availability zones are in preview and are ready for your development and test scenarios. Support is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Log in to Azure

Log in to the Azure portal at https://portal.azure.com. 

## Create a zonal public IP address

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Select **Networking**, and then select **Public IP address**.
3. Enter or select values for the following settings, select your subscription, accept the defaults for the remaining settings, then click **Create**:

	|Setting|Value|
	|---|---|
	|SKU| **Basic**: Assigned with the static or dynamic allocation method. Can be assigned to any Azure resource that can be assigned a public IP address, such as network interfaces, VPN Gateways, Application Gateways, and Internet-facing load balancers. You can assign the public IP address to a specific zone in the **Availability zone** setting. Are not zone-redundant. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). **Standard**: Assigned with the static allocation method only. Can be assigned to network interfaces or standard Internet-facing load balancers. If you assign the public IP address to a standard Internet-facing load balancer, you must select Standard. For more information about Azure load balancer SKUs, see [Azure load balancer standard SKU](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Are zone-redundant, by default. Can be created zonal and guaranteed in a specific availability zone. The standard SKU is in preview release. Before creating a Standard SKU public IP address, you must first register for the preview. To register for the preview, see [register for the standard SKU preview](virtual-network-public-ip-address.md#register-for-the-standard-sku-preview). The Standard SKU can only be created in a supported location.  For a list of supported locations (regions), see [Region availability](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#region-availability) and monitor the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page for additional region support.|   
	|Name|The name must be unique within the resource group you select.|
	|Resource group|Click Create new, and enter myResourceGroup|
	|Location|West Europe|
	|Availability zone|If you selected the **Standard** SKU, you can select *Zone redundant* if you want the IP address to be resilient across zones. If you select the **Basic** SKU, the IP address is not resilient across zones. Regardless of the SKU you choose, you can assign the address to a specific zone, if you choose. |

    The settings appear in the portal, as shown in the following picture:

    ![Create zonal public IP address](./media/create-public-ip-availability-zone-portal/public-ip-address.png) 

## Next steps

- Learn more about [availability zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- Learn more about [public IP addresses](virtual-network-public-ip-address.md?toc=%2fazure%2fvirtual-network%2ftoc.json)