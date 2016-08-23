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
	ms.date="06/07/2016"
	ms.author="davidmu"/>

# Create a Windows VM using Resource Manager and PowerShell

This article shows you how to quickly create an Azure Virtual Machine running Windows Server and the resources it needs using [Resource Manager](../resource-group-overview.md) and PowerShell. 

All of the steps in this article are required to create a virtual machine and it should take about 30 minutes to do the steps.

## Step 1: Install Azure PowerShell

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about how to install the latest version of Azure PowerShell, select the subscription that you want to use, and sign in to your Azure account.
        
## Step 2: Create a resource group

First, you create a resource group.

1. Get a list of available locations where resources can be created.

	    Get-AzureRmLocation | sort Location | Select Location
        
    You should see something like this:
    
        Location
        --------
        australiaeast
        australiasoutheast
        brazilsouth
        canadacentral
        canadaeast
        centralindia
        centralus
        eastasia
        eastus
        eastus2
        japaneast
        japanwest
        northcentralus
        northeurope
        southcentralus
        southeastasia
        southindia
        westeurope
        westindia
        westus

2. Replace the value of **$locName** with a location from the list. Create the variable.

        $locName = "centralus"
        
3. Replace the value of **$rgName** with a name for the new resource group. Create the variable and the resource group.

        $rgName = "mygroup1"
        New-AzureRmResourceGroup -Name $rgName -Location $locName
    
## Step 3: Create a storage account

A [storage account](../storage/storage-introduction.md) is needed to store the virtual hard disk that is used by the virtual machine that you create.

1. Replace the value of **$stName** with a name for the storage account. Test the name for uniqueness.

        $stName = "mystorage1"
        Get-AzureRmStorageAccountNameAvailability $stName

    If this command returns **True**, your proposed name is unique within Azure. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
    
2. Now, run the command to create the storage account.
    
        $storageAcc = New-AzureRmStorageAccount -ResourceGroupName $rgName -Name $stName -SkuName "Standard_LRS" -Kind "Storage" -Location $locName
        
## Step 4: Create a virtual network

All virtual machines are part of a [virtual network](../virtual-network/virtual-networks-overview.md).

1. Replace the value of **$subnetName** with a name for the subnet. Create the variable and the subnet.
    	
        $subnetName = "mysubnet1"
        $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
        
2. Replace the value of **$vnetName** with a name for the virtual network. Create the variable and the virtual network with the subnet.

        $vnetName = "myvnet1"
        $vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
        
    You should use values that make sense for your application and environment.
        
## Step 5: Create a public IP address and network interface

To enable communication with the virtual machine in the virtual network, you need a [public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Replace the value of **$ipName** with a name for the public IP address. Create the variable and the public IP address.

        $ipName = "myIPaddress1"
        $pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
        
2. Replace the value of **$nicName** with a name for the network interface. Create the variable and the network interface.

        $nicName = "mynic1"
        $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
        
## Step 6: Create a virtual machine

Now that you have all the pieces in place, it's time to create the virtual machine.

1. Run the command to set the administrator account name and password for the virtual machine.

        $cred = Get-Credential -Message "Type the name and password of the local administrator account."
        
    The password must be at 12-123 characters long and have at least one lower case character, one upper case character, one number, and one special character. 
        
2. Replace the value of **$vmName** with a name for the virtual machine. Create the variable and the virtual machine configuration.

        $vmName = "myvm1"
        $vm = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A1"
        
    See [Sizes for virtual machines in Azure](virtual-machines-windows-sizes.md) for a list of available sizes for a virtual machine.
    
3. Replace the value of **$compName** with a computer name for the virtual machine. Create the variable and add the operating system information to the configuration.

        $compName = "myvm1"
        $vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName $compName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
        
4. Define the image to use to provision the virtual machine. 

        $vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
        
    See [Navigate and select Windows virtual machine images in Azure with PowerShell or the CLI](virtual-machines-windows-cli-ps-findimage.md) for more information about selecting images to use.
        
5. Add the network interface that you created to the configuration.

        $vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
        
6. Replace the value of **$blobPath** with a path and filename in storage that the virtual hard disk will use. The virtual hard disk file is usually stored in a container, for example **vhds/WindowsVMosDisk.vhd**. Create the variables.

        $blobPath = "vhds/WindowsVMosDisk.vhd"
        $osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + $blobPath
        
7. Replace The value of **$diskName** with a name for the operating system disk. Create the variable and add the disk information to the configuration.

        $diskName = "windowsvmosdisk"
        $vm = Set-AzureRmVMOSDisk -VM $vm -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage
        
8. Finally, create the virtual machine.

        New-AzureRmVM -ResourceGroupName $rgName -Location $locName -VM $vm

    You should see the resource group and all its resources in the Azure portal and a success status in the PowerShell window:

        RequestId  IsSuccessStatusCode  StatusCode  ReasonPhrase
        ---------  -------------------  ----------  ------------
                                  True          OK  OK
                                  
## Next Steps

- If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)
- Learn how to manage the virtual machine that you just created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
- Take advantage of using a template to create a virtual machine by using the information in [Create a Windows virtual machine with a Resource Manager template](virtual-machines-windows-ps-template.md)
