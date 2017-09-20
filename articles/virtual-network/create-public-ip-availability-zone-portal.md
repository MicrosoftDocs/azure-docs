---
title: Create a zoned Public IP address with the Azure Portal | Microsoft Docs
description: Create a public IP address in an availability zone with the Azure Portal.
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
ms.date: 09/17/2017
ms.author: jdial
ms.custom: 
---

# Create a public IP address in an availability zone with The Azure portal

You can deploy a public IP address in an Azure availability zone (preview). An availability zone is a physically separate zone in an Azure region. You learn how to:

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
	|Name|The name must be unique within the resource group you select.|
	|Resource group|Click Create new, and enter myResourceGroup|
	|Location|West Europe|
	|Availability zone|2|

    ![Create zonal public IP address](./media/create-public-ip-availability-zone-portal/public-ip-address.png) 

## Next steps

- Learn more about [availability zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- Learn more about [public IP addresses](virtual-network-public-ip-address.md?toc=%2fazure%2fvirtual-network%2ftoc.json) 