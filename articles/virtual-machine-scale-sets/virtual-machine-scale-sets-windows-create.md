---
title: Create an Azure Virtual Machine Scale Set using PowerShell | Microsoft Docs
description: Create an Azure Virtual Machine Scale Set using PowerShell
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 7bb03323-8bcc-4ee4-9a3e-144ca6d644e2
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/21/2017
ms.author: adegeo

---
# Create a Windows virtual machine scale set using Azure PowerShell
These steps follow a fill-in-the-blanks approach for creating an Azure virtual machine scale set. See [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md) to learn more about scale sets.

It should take about 30 minutes to do the steps in this article.

## Step 1: Install Azure PowerShell
See [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

## Step 2: Create resources
Create the resources that are needed for your new scale set.

### Resource group
A virtual machine scale set must be contained in a resource group.

1. Get a list of available locations where you can place resources:
   
        Get-AzureLocation | Sort Name | Select Name
2. Pick a location that works best for you, replace the value of **$locName** with that location name, and then create the variable:
   
        $locName = "location name from the list, such as Central US"
3. Replace the value of **$rgName** with the name that you want to use for the new resource group and then create the variable: 
   
        $rgName = "resource group name"
4. Create the resource group:
   
        New-AzureRmResourceGroup -Name $rgName -Location $locName
   
    You should see something like this example:
   
        ResourceGroupName : myrg1
        Location          : centralus
        ProvisioningState : Succeeded
        Tags              :
        ResourceId        : /subscriptions/########-####-####-####-############/resourceGroups/myrg1

### Virtual network
A virtual network is required for the virtual machines in the scale set.

1. Replace the value of **$subnetName** with the name that you want to use for the subnet in the virtual network and then create the variable: 
   
        $subnetName = "subnet name"
2. Create the subnet configuration:
   
        $subnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
   
    The address prefix may be different in your virtual network.
3. Replace the value of **$netName** with the name that you want to use for the virtual network and then create the variable: 
   
        $netName = "virtual network name"
4. Create the virtual network:
   
        $vnet = New-AzureRmVirtualNetwork -Name $netName -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $subnet

### Configuration of the scale set
You have all the resources that you need for the scale set configuration, so let's create it.  

1. Replace the value of **$ipName** with the name that you want to use for the IP configuration and then create the variable: 
   
        $ipName = "IP configuration name"
2. Create the IP configuration:
   
        $ipConfig = New-AzureRmVmssIpConfig -Name $ipName -LoadBalancerBackendAddressPoolsId $null -SubnetId $vnet.Subnets[0].Id
3. Replace the value of **$vmssConfig** with the name that you want to use for the scale set configuration and then create the variable:   
   
        $vmssConfig = "Scale set configuration name"
4. Create the configuration for the scale set:
   
        $vmss = New-AzureRmVmssConfig -Location $locName -SkuCapacity 3 -SkuName "Standard_A0" -UpgradePolicyMode "manual"
   
    This example shows a scale set being created with three virtual machines. See [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md) for more about the capacity of scale sets. This step also includes setting the size (referred to as SkuName) of the virtual machines in the set. To find a size that meets your needs, look at [Sizes for virtual machines](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
5. Add the network interface configuration to the scale set configuration:
   
        Add-AzureRmVmssNetworkInterfaceConfiguration -VirtualMachineScaleSet $vmss -Name $vmssConfig -Primary $true -IPConfiguration $ipConfig
   
    You should see something like this example:
   
        Sku                   : Microsoft.Azure.Management.Compute.Models.Sku
        UpgradePolicy         : Microsoft.Azure.Management.Compute.Models.UpgradePolicy
        VirtualMachineProfile : Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetVMProfile
        ProvisioningState     :
        OverProvision         :
        Id                    :
        Name                  :
        Type                  :
        Location              : Central US
        Tags                  :

#### Operating system profile
1. Replace the value of **$computerName** with the computer name prefix that you want to use and then create the variable: 
   
        $computerName = "computer name prefix"
2. Replace the value of **$adminName** the name of the administrator account on the virtual machines and then create the variable:
   
        $adminName = "administrator account name"
3. Replace the value of **$adminPassword** with the account password and then create the variable:
   
        $adminPassword = "password for administrator accounts"
4. Create the operating system profile:
   
        Set-AzureRmVmssOsProfile -VirtualMachineScaleSet $vmss -ComputerNamePrefix $computerName -AdminUsername $adminName -AdminPassword $adminPassword

#### Storage profile
1. Replace the value of **$storageProfile** with the name that you want to use for the storage profile and then create the variable:  
   
        $storageProfile = "storage profile name"
2. Create the variables that define the image to use:  
   
        $imagePublisher = "MicrosoftWindowsServer"
        $imageOffer = "WindowsServer"
        $imageSku = "2012-R2-Datacenter"
   
    To find the information about other images to use, look at [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](../virtual-machines/virtual-machines-windows-cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

3. Create the storage profile:
   
        Set-AzureRmVmssStorageProfile -VirtualMachineScaleSet $vmss -ImageReferencePublisher $imagePublisher -ImageReferenceOffer $imageOffer -ImageReferenceSku $imageSku -ImageReferenceVersion "latest" -OsDiskCreateOption "FromImage" -OsDiskCaching "None"  

### Virtual machine scale set
Finally, you can create the scale set.

1. Replace the value of **$vmssName** with the name of the virtual machine scale set and then create the variable:
   
        $vmssName = "scale set name"
2. Create the scale set:
   
        New-AzureRmVmss -ResourceGroupName $rgName -Name $vmssName -VirtualMachineScaleSet $vmss
   
    You should see something like this example that shows a successful deployment:
   
        Sku                   : Microsoft.Azure.Management.Compute.Models.Sku
        UpgradePolicy         : Microsoft.Azure.Management.Compute.Models.UpgradePolicy
        VirtualMachineProfile : Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetVMProfile
        ProvisioningState     : Updating
        OverProvision         :
        Id                    : /subscriptions/########-####-####-####-############/resourceGroups/myrg1/providers/Microso
                                ft.Compute/virtualMachineScaleSets/myvmss1
        Name                  : myvmss1
        Type                  : Microsoft.Compute/virtualMachineScaleSets
        Location              : centralus
        Tags                  :

## Step 3: Explore resources
Use these resources to explore the virtual machine scale set that you created:

* Azure portal - A limited amount of information is available using the portal.
* [Azure Resource Explorer](https://resources.azure.com/) - This tool is the best for exploring the current state of your scale set.
* Azure PowerShell - Use this command to get information:
  
        Get-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"
  
        Or 
  
        Get-AzureRmVmssVM -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"

## Next steps
* Manage the scale set that you just created using the information in [Manage virtual machines in a Virtual Machine Scale Set](virtual-machine-scale-sets-windows-manage.md)
* Consider setting up automatic scaling of your scale set by using information in [Automatic scaling and virtual machine scale sets](virtual-machine-scale-sets-autoscale-overview.md)
* Learn more about vertical scaling by reviewing [Vertical autoscale with Virtual Machine Scale sets](virtual-machine-scale-sets-vertical-scale-reprovision.md)

