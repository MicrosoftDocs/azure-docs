---
title: 'Add scale units for host scaling: PowerShell'
titleSuffix: Azure Bastion
description: Learn how to add more instances (scale units) to Azure Bastion using PowerShell
services: bastion
author: cherylmc
ms.service: bastion
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/17/2023
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to configure host scaling using Azure PowerShell.
---

# Configure host scaling using Azure PowerShell

This article helps you add more scale units (instances) to Azure Bastion to accommodate additional concurrent client connections. The steps in this article use PowerShell. For more information about host scaling, see [Configuration settings](configuration-settings.md#instance). You can also configure host scaling using the [Azure portal](configure-host-scaling.md).

## Configuration steps

1. Get the target Bastion resource. Use the following example, modifying the values as needed.

   ```azurepowershell-interactive
   $bastion = Get-AzBastion -Name bastion -ResourceGroupName bastion-rg
   ```

1. Set the target scale unit, also known as "instance count". In the following example, we set the scale units to 5.

   ```azurepowershell-interactive
   $bastion.ScaleUnit = 5
   Set-AzBastion -InputObject $bastion
   ```

1. Confirm "Y" to overwrite the resource. After the resource is overwritten, the specified value is shown in the output for "Scale Units".

   >[!NOTE]
   > Any changes to the host scale units will disrupt active bastion connections.
   >

## Next steps

For more information about configuration settings, see [Azure Bastion configuration settings](configuration-settings.md).
