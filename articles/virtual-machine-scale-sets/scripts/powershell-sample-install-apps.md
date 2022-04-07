---
title: Azure PowerShell Samples - Install apps
description: This script creates a virtual machine scale set running Windows Server 2016 and uses the Custom Script Extension to install a basic web application.
author: mimckitt
ms.author: mimckitt
ms.topic: sample
ms.service: virtual-machine-scale-sets
ms.date: 06/25/2020
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurepowershell

---

# Install applications into a virtual machine scale set with PowerShell
This script creates a virtual machine scale set running Windows Server 2016 and uses the Custom Script Extension to install a basic web application. After running the script, you can access the web app through a web browser.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Sample script

```powershell
# Provide your own secure password for use with the VM instances
$cred = Get-Credential

# Create a virtual machine scale set and supporting resources
# A resource group, virtual network, load balancer, and NAT rules are automatically
# created if they do not already exist
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -Location "EastUS" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic" `
  -Credential $cred

# Create a configuration object to store the Custom Script Extension definition
$customConfig = @{
"fileUris" = (,"https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/automate-iis.ps1");
"commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File automate-iis.ps1"
}

# Get information about the scale set
$vmss = Get-AzVmss `
          -ResourceGroupName "myResourceGroup" `
          -VMScaleSetName "myScaleSet"

# Add the Custom Script Extension to install IIS and configure basic website
$vmss = Add-AzVmssExtension `
  -VirtualMachineScaleSet $vmss `
  -Name "customScript" `
  -Publisher "Microsoft.Compute" `
  -Type "CustomScriptExtension" `
  -TypeHandlerVersion 1.10 `
  -Setting $customConfig

# Update the scale set and apply the Custom Script Extension to the VM instances
Update-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmss

# Get the public IP address of your load balancer. To see your scale set in action, open this address in a web browser
Get-AzPublicIpAddress -ResourceGroupName "myResourceGroup" | Select IpAddress
```


## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation
This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzVmss](/powershell/module/az.compute/new-azvmss) | Creates the virtual machine scale set and all supporting resources, including virtual network, load balancer, and NAT rules. |
| [Get-AzVmss](/powershell/module/az.compute/get-azvmss) | Gets information on a virtual machine scale set. |
| [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) | Adds a VM extension for Custom Script to install a basic web application. |
| [Update-AzVmss](/powershell/module/az.compute/update-azvmss) | Updates the virtual machine scale set model to apply the VM extension. |
| [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) | Gets information on the public IP address assigned used by the load balancer. |
|  [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps
For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).
