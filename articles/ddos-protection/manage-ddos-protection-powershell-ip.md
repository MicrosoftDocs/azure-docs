---
title: 'Quickstart: Create and configure Azure DDoS IP Protection Preview - PowerShell'
description: Learn how to create Azure DDoS IP Protection Preview using PowerShell
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: quickstart 
ms.date: 04/04/2023
ms.workload: infrastructure-services
ms.custom: template-quickstart, ignite-2022, devx-track-azurepowershell
---

# QuickStart: Create and configure Azure DDoS IP Protection using Azure PowerShell

Get started with Azure DDoS IP Protection by using Azure PowerShell.
In this QuickStart, you'll enable DDoS IP protection and link it to a public IP address utilizing PowerShell.

:::image type="content" source="./media/manage-ddos-ip-protection-portal/ddos-ip-protection-diagram.png" alt-text="Diagram of DDoS IP Protection protecting the Public IP address.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell 
- If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 9.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Enable DDoS IP Protection for a public IP address

You can enable DDoS IP Protection when creating a public IP address. In this example, we'll name our public IP address _myStandardPublicIP_:

```azurepowershell-interactive
#Creates the resource group
New-AzResourceGroup -Name MyResourceGroup -Location eastus

#Creates the IP address and enables DDoS IP Protection
New-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup -Sku Standard -Location "East US" -AllocationMethod Static -DdosProtectionMode Enabled   
```
> [!NOTE]
> DDoS IP Protection is enabled only on Public IP Standard SKU.

### Enable DDoS IP Protection for an existing public IP address

You can associate an existing public IP address:

```azurepowershell-interactive
#Gets the public IP address
$publicIp = Get-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup 

#Enables DDoS IP Protection for the public IP address
$publicIp.DdosSettings.ProtectionMode = 'Enabled'

#Updates public IP address
Set-AzPublicIpAddress -PublicIpAddress $publicIp
```


## Validate and test

Check the details of your public IP address and verify that DDoS IP Protection is enabled.

```azurepowershell-interactive
#Gets the public IP address
$publicIp = Get-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup 

#Checks the status of the public IP address
$protectionMode = $publicIp.DdosSettings.ProtectionMode

#Returns the status of the pubic IP address
$protectionMode

```
## Disable DDoS IP Protection for an existing public IP address

```azurepowershell-interactive
$publicIp = Get-AzPublicIpAddress -Name myStandardPublicIP -ResourceGroupName MyResourceGroup 

$publicIp.DdosSettings.ProtectionMode = 'Disabled'

Set-AzPublicIpAddress -PublicIpAddress $publicIp 
```
> [!NOTE]
> When changing DDoS IP protection from **Enabled** to **Disabled**, telemetry for the public IP resource will no longer be active.

## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also delete the DDoS protection plan and all its related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```
## Next steps

In this quickstart, you created:
* A resource group 
* A public IP address

You enabled DDoS IP Protection using Azure PowerShell. 
To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
