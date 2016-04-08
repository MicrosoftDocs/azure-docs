<properties
	pageTitle="Create an Azure VM using PowerShell | Microsoft Azure"
	description="Use Azure PowerShell and Azure Resource Manager to easily create a new VM running Windows Server."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="04/07/2016"
	ms.author="davidmu"/>

# Create a Windows VM using Resource Manager and PowerShell

This article shows you how to quickly create an Azure Virtual Machine running Windows Server and its associated resources using Resource Manager and PowerShell.

It should take about 30 minutes to do the steps in this article.

## Step 1: Install Azure PowerShell, select your subscription, and sign in to your account

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about how to install the latest version of Azure PowerShell, select the subscription that you want to use, and sign in to your Azure account.
        
## Step 2: Create a resource group

All resources must be deployed in a resource group. See [Azure Resource Manager overview](../resource-group-overview.md) for more information.

1. You need to know where you want to locate a resource group before you can create it. Run this command to get a list of locations.

	    Get-AzureLocation | sort Name | Select Name

2. Replace everything in quotes with the location that you want to use from the list that was returned, for example **Central US**, and then run this command to create the variable to use in later commands.

        $locName = "location name"
        
3. Replace everything within the quotes with the name of the new resource group, and then run these commands.

        $rgName = "resource group name"
        New-AzureRmResourceGroup -Name $rgName -Location $locName
    
## Step 3: Create a storage account

A storage account is needed to store the virtual hard disk that is associated with the virtual machine that you create.

1. Replace everything within the quotes (lowercase letters and numbers only) with the name that you want to use for the storage account, and then run these command to test for the uniqueness.

        $stName = "storage account name"
        Test-AzureName -Storage $stName

    If this command returns **False**, your proposed name is unique.
    
2. Run this command to create the storage account.
    
        $storageAcc = New-AzureRmStorageAccount -ResourceGroupName $rgName -Name $stName -Type "Standard_LRS" -Location $locName
        
## Step 4: Create a virtual network

All virtual machines must be associated with a virtual network.

1. Replace everything in quotes with the name of the subnet, and then run this command to create it.
    	
        $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name "subnet name" -AddressPrefix 10.0.0.0/24
        
2. Replace everything in quotes with the name that you want to use for the virtual network, and then run this command to create it with the subnet configuration that you just created.

        $vnet = New-AzureRmVirtualNetwork -Name "virtual network name" -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
        
## Step 5: Create a public IP address and network interface

To enable communication with the virtual machine in the virtual network, you need a public IP address and a network interface.

1. Replace everything in quotes with the name that you want to use for the public IP address, and then run this command to create it.

        $pip = New-AzureRmPublicIpAddress -Name "public IP address name" -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
        
2. Replace everything in quotes with the name that you want to use for the network interface, and then run this command to create it.

        $nic = New-AzureRmNetworkInterface -Name "network interface name" -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
        
## Create a virtual machine

Now that you have all the pieces in place, it's time to create the virtual machine.

1. Run this command to set the administrator account name and password for the virtual machine.

        $cred = Get-Credential -Message "Type the name and password of the local administrator account."
        
2. Replace everything in quotes for VMName with the name that you want to use for the virtual machine, and then run this command to define the configuration. See [Sizes for virtual machines in Azure](virtual-machines-windows-sizes.md) for a list of available sizes for a virtual machine.

        $vm = New-AzureRmVMConfig -VMName "virtual machine name" -VMSize "Standard_A1"
        
3. Replace everything in quotes with the computer name that you want to use for the virtual machine, and then run this command to define the operating system to use.

        $vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName "computer name" -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
        
4. Run this command to define the image to use to provision the virtual machine. See [Navigate and select Windows virtual machine images in Azure with PowerShell or the CLI](virtual-machines-windows-cli-ps-findimage.md) for more information about selecting images to use.

        $vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
        
5. Run this command to add the network interface that you created to the virtual machine configuration.

        $vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
        
6. Replace everything in quotes with the path and filename in storage where the virtual hard disk that is associated with the virtual machine should be located, for example, "vhds/WindowsVMosDisk.vhd", and then run this command.

        $osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + "vhd path and file name"
        
7. Replace everything in quotes with the name that you want to use for the operating system disk, and then run this command to specify how the disk is created.

        $vm = Set-AzureRmVMOSDisk -VM $vm -Name "windowsvmosdisk" -VhdUri $osDiskUri -CreateOption fromImage
        
8. Run this command to create the virtual machine.

        New-AzureRmVM -ResourceGroupName $rgName -Location $locName -VM $vm

    You should see the resource group and all of its resources in the portal and something similar to this in the PowerShell window:

        RequestId  IsSuccessStatusCode  StatusCode  ReasonPhrase
        ---------  -------------------  ----------  ------------
                                  True          OK  OK
                                  
## Next Steps

1. If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)

2. Learn how to manage the virtual machine that you just created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).

3. Take advandate of using a template to create a virtual machine by using the information in [Create a Windows virtual machine with a Resource Manager template](virtual-machines-windows-ps-template.md)
