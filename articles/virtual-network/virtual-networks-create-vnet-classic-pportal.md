---
title: Create a virtual network (classic) using the Azure portal | Microsoft Docs
description: Learn how to create a virtual network (classic) using the Azure portal.
services: virtual-network
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: c8e298a1-f6d9-4bec-b6cd-3c6ff2271dcd
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2016
ms.author: genli

---
# Create a virtual network (classic) by using the Azure portal
[!INCLUDE [virtual-networks-create-vnet-selectors-classic-include](../../includes/virtual-networks-create-vnet-selectors-classic-include.md)]

[!INCLUDE [virtual-networks-create-vnet-intro](../../includes/virtual-networks-create-vnet-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]

This document covers creating a VNet by using the classic deployment model. You can also [create a virtual network in the Resource Manager deployment model by using the Azure portal](quick-create-portal.md).

[!INCLUDE [virtual-networks-create-vnet-scenario-include](../../includes/virtual-networks-create-vnet-scenario-include.md)]

[!INCLUDE [virtual-networks-create-vnet-classic-pportal-include](../../includes/virtual-networks-create-vnet-classic-pportal-include.md)]

> [!NOTE] 
> In the previous classic setup, you could create subnet names with a space included. That was due to the absence of validation. We now have validation checks in place. And if you have existing space(s) in the subnet name(s), you might not be able to create a new gateway.
> To add a new virtual machine or gateway and remove the space from the subnet name, you will need to delete the virtual machine from the subnet, keeping the disk to recreate. And then, you can create the subnet without a space.
