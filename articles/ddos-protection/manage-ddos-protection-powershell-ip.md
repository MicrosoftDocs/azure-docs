---
title: 'Quickstart: Create and configure Azure DDoS IP Protection using PowerShell'
description: Learn how to create Azure DDoS IP Protection using PowerShell
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: quickstart 
ms.date: 09/23/2022
ms.workload: infrastructure-services
ms.custom: template-quickstart 
# Customer intent As an IT admin, I want to learn how to enable DDoS IP Protection on my public IP address using PowerShell.
---

# Quickstart: Create and configure Azure DDoS IP Protection using Azure PowerShell

Get started with Azure DDoS IP Protection by using Azure PowerShell.
In this quickstart, you'll enable DDoS IP protection and link it to a public IP address utilizing PowerShell.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Enable DDoS IP Protection for a public IP address

You can enable DDoS IP Protection when creating a public IP address. In this example, we'll name our public IP address _myStandardPublicIP_:

```azurepowershell-interactive
#Creates the resource group
New-AzResourceGroup -Name MyResourceGroup -Location eastus

#Creates the IP address and enables DDoS IP Protection
New-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup -Location "East US" -DdosProtectionMode Enabled   
```

### Enable DDoS IP Protection for an existing public IP address

You can associate an existing public IP address:

```azurepowershell-interactive
$pip = Get-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup 

$pip.DdosSettings.ProtectionMode = Enabled

Set-AzPublicIpAddress -PublicIpAddress $pip 
```


## Validate and test

Check the details of your public IP address and verify that DDoS IP Protection is enabled.

```azurepowershell-interactive
$pip = Get-AzPublicIpAddress  -Name <String>  -ResourceGroupName <String>  
```

## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also delete the DDoS protection plan and all its related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

### Disable DDoS IP Protection for an existing public IP address

```azurepowershell-interactive
$pip = Get-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup 

$pip.DdosSettings.ProtectionMode = Disable

Set-AzPublicIpAddress -PublicIpAddress $pip 
```

## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
