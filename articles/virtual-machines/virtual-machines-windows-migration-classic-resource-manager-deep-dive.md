---
title: Technical deep dive on platform-supported migration from classic to Azure Resource Manager | Microsoft Docs
description: This article does a technical deep dive on platform-supported migration of resources from classic to Azure Resource Manager
services: virtual-machines-windows
documentationcenter: ''
author: singhkays
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 1ee40d32-a5e8-42a2-97d0-3232fd3cbb98
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: kasing

---
# Technical deep dive on platform-supported migration from classic to Azure Resource Manager
Let's take a deep-dive on migrating from the Azure classic deployment model to the Azure Resource Manager deployment model. We look at resources at a resource and feature level to help you understand how the Azure platform migrates resources between the two deployment models. For more information, please read the service announcement article: [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-migration-classic-resource-manager-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

[!INCLUDE [virtual-machines-common-migration-deep-dive](../../includes/virtual-machines-common-classic-resource-manager-migration-deep-dive.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)]

## Next steps
Now that you understand the migration of classic IaaS resources to Resource Manager, you can start migrating resources.

* [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-ps-migration-classic-resource-manager.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-linux-cli-migration-classic-resource-manager.md)
* [Overview of platform-supported migration of IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-migration-classic-resource-manager-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Clone a classic virtual machine to Azure Resource Manager by using community PowerShell scripts](virtual-machines-windows-migration-scripts.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Review most common migration errors](virtual-machines-windows-migration-classic-resource-manager-errors.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

