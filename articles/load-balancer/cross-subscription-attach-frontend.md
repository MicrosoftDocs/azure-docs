---
title: 
titleSuffix: Azure Load Balancer
description: 
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: 
ms.date: 05/24/2024
ms.author: mbender
ms.custom: 
---

# Global Load Balancer

## Prerequisites

# [Azure PowerShell](#tab/azurepowershell)

- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-powershell.md).
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-powershell.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.
  
# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- Access to the Azure portal.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- Existing [Virtual Machines](../virtual-machines/windows/quick-create-cli.md).
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-cli.md) in the same subscription and virtual network as the virtual machine.
  - The load balancer should have a backend pool with health probes and load balancing rules attached.

---