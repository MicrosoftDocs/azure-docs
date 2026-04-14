---
title: Configure host scaling
titleSuffix: Azure Bastion
description: Learn how to add more instances (scale units) to Azure Bastion.
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 03/13/2026
ms.author: cherylmc
# Customer intent: As a network administrator, I want to configure scale units and understand what the impact it will be on my cloud environment.

---

# Configure host scaling for Azure Bastion

This article helps you configure host scaling for your Azure Bastion deployment. Host scaling lets you adjust the number of instances (scale units) to support more concurrent client connections.

> [!IMPORTANT]
> Host scaling requires the Standard SKU tier or higher. Any changes to scale units disrupt active Bastion connections. Plan changes during maintenance windows.

## Considerations

Each instance can support 20 concurrent RDP connections and 40 concurrent SSH connections for medium workloads (see [Azure subscription limits and quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) for more information). The number of connections per instance depends on what actions you're taking when connected to the client VM. For example, if you're transferring large files or streaming media, data-intensive tasks reduce the number of concurrent connections your instance can handle. When concurrent sessions exceed the instance limit, you need to add another scale unit to handle additional connections.

Instances are created in the AzureBastionSubnet. To allow for host scaling, the AzureBastionSubnet should be /26 or larger. Using a smaller subnet limits the number of instances you can create. For more information about the AzureBastionSubnet, see the [Azure Bastion subnet](configuration-settings.md#subnet) section.

> [!IMPORTANT]
> Host scaling requires the Standard SKU tier or higher. Any changes to scale units will disrupt active Bastion connections.

## Configuration steps

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Bastion host.
1. On the **Configuration** page, for **SKU**, verify the SKU is **Standard** or higher. If the SKU is Basic, select a higher SKU.
1. Adjust the **Instance count**. Each instance is a scale unit.
1. Select **Apply** to apply changes.

# [PowerShell](#tab/powershell)

1. Get the target Bastion resource. Use the following example, modifying the values as needed.

   ```azurepowershell-interactive
   $bastion = Get-AzBastion -Name bastion -ResourceGroupName bastion-rg
   ```

1. Set the target scale unit, also known as "instance count". In the following example, the scale units are set to 5.

   ```azurepowershell-interactive
   $bastion.ScaleUnit = 5
   Set-AzBastion -InputObject $bastion
   ```

1. Confirm **Y** to overwrite the resource. After the resource is overwritten, the specified value is shown in the output for **Scale Units**.

---

## Next steps

* Learn about the [available configuration settings for Azure Bastion](configuration-settings.md).
