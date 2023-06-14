---
title: Create IP Groups in Azure Firewall 
description: IP Groups allow you to group and manage IP addresses for Azure Firewall rules.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 10/31/2022
ms.author: victorh 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Create IP Groups

IP Groups allow you to group and manage IP addresses for Azure Firewall rules. They can have a single IP address, multiple IP addresses, or one or more IP address ranges.

## Create an IP Group - Azure portal

To create an IP Group by using the Azure portal:

1. On the Azure portal home page, select **Create a resource**.
1. In the search box, enter **IP Groups**, and then select **IP Groups**.
1. Select **Create**.
1. Select your subscription.
1. Select a resource group or create a new one.
1. Enter a unique name for your IP Group, and then select a region.
1. Select **Next: IP addresses**.
1. Type an IP address, multiple IP addresses, or IP address ranges.

   There are two ways to enter IP addresses:
   - You can manually enter them
   - You can import them from a file

   To import from a file, select **Import from a file**. You may either drag your file to the box or select **Browse for files**. If necessary, you can review and edit your uploaded IP addresses.

   When you type an IP address, the portal validates it to check for overlapping, duplicates, and formatting issues.

1. When finished, select **Review + Create**.
1. Select **Create**.

## Create an IP Group - Azure PowerShell

This example creates an IP Group with an address prefix and an IP address by using Azure PowerShell:

```azurepowershell
$ipGroup = @{
    Name              = 'ipGroup'
    ResourceGroupName = 'Test-FW-RG'
    Location          = 'East US'
    IpAddress         = @('10.0.0.0/24', '192.168.1.10') 
}

New-AzIpGroup @ipGroup
```

## Create an IP Group - Azure CLI

This example creates an IP Group with an address prefix and an IP address by using the Azure CLI:

```azurecli-interactive
az network ip-group create \
    --name ipGroup \
    --resource-group Test-FW-RG \
    --location eastus \
    --ip-addresses '10.0.0.0/24' '192.168.1.10'
```

## Next steps

- [Learn more about IP Groups](ip-groups.md)
