---
title: Create a Virtual Machine Scale Sets for Windows in Azure | Microsoft Docs
description: Create and deploy a highly available application on Windows VMs using a virtual machine scale set
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: ''

ms.assetid: ''
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: article
ms.date: 04/21/2017
ms.author: iainfou
---

# Create a Virtual Machine Scale Set and deploy a highly available app on Windows
In this tutorial, you learn how virtual machine scale sets in Azure allow you to quickly scale the number of virtual machines (VMs) running your app. A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. You can scale the number of VMs in the scale set manually, or define rules to autoscale based on CPU usage, memory demand, or network traffic. To see a virtual machine scale set in action, you build a basic IIS website that runs across multiple Windows VMs.

The steps in this tutorial can be completed using the latest [Azure PowerShell](/powershell/azureps-cmdlets-docs/) module.


## Scale Set overview
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. Scale sets use the same components as you learned about in the previous tutorial to [Create highly available VMs](tutorial-availability-sets.md). VMs in a scale set are created in an availability set and distributed across logic fault and update domains.

VMs are created as needed in a scale set. You define autoscale rules to control how and when VMs are added or removed from the scale set. These rules can trigger based on metrics such as CPU load, memory usage, or network traffic.

Scale sets support up to 1,000 VMs when you use an Azure platform image. For production workloads, you may wish to [Create a custom VM image](tutorial-custom-images.md). You can create up to 100 VMs in a scale set when using a custom image.


## Create an app to scale
For production use, you may wish to [Create a custom VM image](tutorial-custom-images.md) that includes your application installed and configured. For this tutorial, lets customize a platform image to quickly see a scale set in action.

In a previous tutorial, you learned [How to customize a Windows virtual machine](tutorial-automate-vm-deployment.md) with the Custom Script Extension. 


## Create a scale set
Before you can create a scale set, create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resource group named `myResourceGroupAutomate` in the `westus` location:

```powershell
New-AzureRmResourceGroup -ResourceGroupName myResourceGroupScaleSet -Location westus
```

Set an administrator username and password for the VMs with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Now create a virtual machine scale set with [New-AzureRmVmss](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a scale set named `myScaleSet` and uses the Custom Script Extension to install IIS on the VM:

```powershell
# Create a config object
$vmssConfig = New-AzureRmVmssConfig -Location WestUS -SkuCapacity 2 -SkuName Standard_DS2 -UpgradePolicyMode Automatic

# Use Custom Script Extension to install IIS and configure basic website
$publicSettings = '{"fileUris":["https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate-iis.ps1"]}'
$protectedSettings = '{"commandToExecute":"powershell -ExecutionPolicy Unrestricted -File automate-iis.ps1"}'
Add-AzureRmVmssExtension -VirtualMachineScaleSet $vmssConfig `
    -Name "customScript" `
    -Publisher "Microsoft.Compute" `
    -Type "CustomScriptExtension" `
    -TypeHandlerVersion "1.8" `
    -Setting $publicSettings `
    -ProtectedSetting $protectedSettings

# Reference a virtual machine image from the gallery
Set-AzureRmVmssStorageProfile $vmssConfig -ImageReferencePublisher MicrosoftWindowsServer -ImageReferenceOffer WindowsServer -ImageReferenceSku 2016-Datacenter -ImageReferenceVersion latest

# Set up information for authenticating with the virtual machine
Set-AzureRmVmssOsProfile $vmssConfig -AdminUsername azureuser -AdminPassword P@ssword! -ComputerNamePrefix myScaleSetVM

# Create the virtual network resources
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name "mySubnet" -AddressPrefix 10.0.0.0/24
$vnet = New-AzureRmVirtualNetwork -Name "myVnet" -ResourceGroupName "myResourceGroupScaleSet" -Location "westus" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
$ipConfig = New-AzureRmVmssIpConfig -Name "myPublicIP" -LoadBalancerBackendAddressPoolsId $null -SubnetId $vnet.Subnets[0].Id

# Attach the virtual network to the config object
Add-AzureRmVmssNetworkInterfaceConfiguration -VirtualMachineScaleSet $vmssConfig -Name "network-config" -Primary $true -IPConfiguration $ipConfig

# Create the scale set with the config object (this step might take a few minutes)
New-AzureRmVmss -ResourceGroupName myResourceGroupScaleSet -Name myScaleSet -VirtualMachineScaleSet $vmssConfig     
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Allow web traffic
A load balancer was created automatically as part of the virtual machine scale set. The load balancer distributes traffic across a set of defined VMs using load balancer rules. You can learn more about load balancer concepts and configuration in the next tutorial, [How to load balance virtual machines in Azure](tutorial-load-balancer.md).

To allow traffic to reach the web app, create a rule with [New-AzureRmLoadBalancerRuleConfig](/powershell/module/azurerm.network/new-azurermloadbalancerruleconfig). The following example creates a rule named `myLoadBalancerRuleWeb`:

```powershell
$lbrule = New-AzureRmLoadBalancerRuleConfig -Name myLoadBalancerRuleWeb `
    -FrontendIpConfiguration loadBalancerFrontEnd `
    -BackendAddressPool myScaleSetLBBEPool `
    -Protocol Tcp `
    -FrontendPort 80 `
    -BackendPort 80
```


## Test your app
To see your IIS website in action, obtain the public IP address of your load balancer with [Get-AzureRmPublicIPAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress). The following example obtains the IP address for `myPublicIP` created as part of the scale set:

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myResourceGroupAutomate -Name myPublicIP | select IpAddress
```

Enter the public IP address in to a web browser. The app is displayed, including the hostname of the VM that the load balancer distributed traffic to:

![Running Node.js app](./media/tutorial-create-vmss/running-nodejs-app.png)

To see the scale set in action, you can force-refresh your web browser to see the load balancer distribute traffic across all the VMs running your app.


## Management tasks
Throughout the lifecycle of the scale set, you may need to run one or more management tasks. Additionally, you may want to create scripts that automate various lifecycle-tasks. The Azure CLI 2.0 provides a quick way to do those tasks. Here are a few common tasks.

### View VMs in a scale set
To view a list of VMs running in your scale set, use [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm) as follows:

```powershell
$scaleset = Get-AzureRmVmss -ResourceGroupName myResourceGroupScaleSet -VMScaleSetName myScaleSet
for ($i=0; $i -le ($set.Sku.Capacity - 1); $i++) {
    Get-AzureRmVmssVM -ResourceGroupName myResourceGroupScaleSet `
      -VMScaleSetName myScaleSet `
      -InstanceId $i
}
```


### Increase or decrease VM instances
To see the number of instances you currently have in a scale set, use [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss) and query on `sku.capacity`:

```powershell
Get-AzureRmVmss -ResourceGroupName myResourceGroupScaleSet `
    -VMScaleSetName myScaleSet | `
    Select -ExpandProperty Sku
```

You can then manually increase or decrease the number of virtual machines in the scale set with [Update-AzureRmVmss](/powershell/module/azurerm.compute/update-azurermvmss). The following example sets the number of VMs in your scale set to `5`:

```powershell
$scaleset = Get-AzureRmVmss -ResourceGroupName myResourceGroupScaleSet -VMScaleSetName myScaleSet
$scaleset.sku.capacity = 5
Update-AzureRmVmss -ResourceGroupName myResourceGroupScaleSet `
    -Name myScaleSet `
    -VirtualMachineScaleSet $scaleset
```


### Configure autoscale rules
Rather than manually scaling the number of instances in your scale set, you define autoscale rules. These rules monitor the instances in your scale set and respond accordingly based on metrics and thresholds you define. The following example scales out the number of instances by one when the average CPU load is greater than 60% over a 5 minute period. If the average CPU load then drops below 30% over a 5 minute period, the instances are scaled in by one instance:

```powershell
$mySubscriptionId = "yoursubscriptionid"
$myResourceGroup = "myResourceGroupScaleSet"
$myScaleSet = "myScaleSet"
$myLocation = "West US"

$myRuleScaleUp = New-AzureRmAutoscaleRule -MetricName "Percentage CPU" `
  -MetricResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -Operator GreaterThan `
  -MetricStatistic Average `
  -Threshold 60 `
  -TimeGrain 00:01:00 `
  -TimeWindow 00:05:00 `
  -ScaleActionCooldown 00:05:00 `
  -ScaleActionDirection Increase `
  -ScaleActionValue 1
$myRuleScaleDown = New-AzureRmAutoscaleRule -MetricName "Percentage CPU" `
  -MetricResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -Operator LessThan `
  -MetricStatistic Average `
  -Threshold 30 `
  -TimeGrain 00:01:00 `
  -TimeWindow 00:05:00 `
  -ScaleActionCooldown 00:05:00 `
  -ScaleActionDirection Decrease `
  -ScaleActionValue 1
$myScaleProfile = New-AzureRmAutoscaleProfile -DefaultCapacity 2  `
  -MaximumCapacity 10 `
  -MinimumCapacity 2 `
  -Rules $myRuleScaleUp,$myRuleScaleDown `
  -Name "autoprofile"
Add-AzureRmAutoscaleSetting -Location $location `
  -Name "autosetting" `
  -ResourceGroup $myResourceGroup `
  -TargetResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -AutoscaleProfiles $myScaleProfile
```



## Next steps
In this tutorial, you learned how to create a virtual machine scale set. Advance to the next tutorial to learn more about load balancing concepts for virtual machines.

[Load balance virtual machines](tutorial-load-balancer.md)