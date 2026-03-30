---
title: Create IP Groups in Azure Firewall
description: Create IP Groups to group and manage IP addresses for Azure Firewall rules.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.devlang: azurecli
# Customer intent: "As a network administrator, I want to create and manage IP Groups for Azure Firewall, so that I can efficiently configure and enforce firewall rules based on grouped IP addresses."
---

# Create IP Groups

IP Groups help you group and manage IP addresses for Azure Firewall rules. They can include a single IP address, multiple IP addresses, or one or more IP address ranges.

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

   Enter IP addresses in one of two ways:
   - Manually enter them.
   - Import them from a file.

   To import from a file, select **Import from a file**. You can either drag your file to the box or select **Browse for files**. If necessary, you can review and edit your uploaded IP addresses.

   When you type an IP address, the portal validates it to check for overlapping, duplicates, and formatting problems.

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
