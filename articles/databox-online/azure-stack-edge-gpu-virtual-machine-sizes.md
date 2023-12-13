---
title: Supported virtual machine sizes on Azure Stack Edge 
description: Describes the supported sizes for virtual machines (VMs) on an Azure Stack Edge Pro device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/02/2023
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device by using APIs, so that I can efficiently manage my VMs. 
---

# VM sizes and types for Azure Stack Edge Pro 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the supported sizes for the virtual machines running on your Azure Stack Edge Pro devices. Use this article before you deploy virtual machines on your Azure Stack Edge Pro devices.

## Supported VM sizes

[!INCLUDE [azure-stack-edge-gateway-supported-vm-sizes](../../includes/azure-stack-edge-gateway-supported-vm-sizes.md)]


## Unsupported VM operations and cmdlets

Scale sets, availability sets, and snapshots aren't supported.

## Next steps

[Deploy VMs on your Azure Stack Edge Pro GPU device via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)
