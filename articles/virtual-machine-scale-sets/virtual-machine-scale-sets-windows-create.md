<properties
	pageTitle="Create a Virtual Machine Scale Set | Microsoft Azure"
	description="Create a Virtual Machine Scale Set using Powershell"
	services="virtual-machine-scale-sets"
    documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machine-scale-sets"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/22/2016"
	ms.author="davidmu"/>

# Create a Windows Virtual Machine Scale Set using Azure PowerShell

These steps follow a fill-in-the-blanks approach for creating an Azure virtual machine scale set. Throughout the article are variables that need values provided by you. Replace everything within the quotes with values that make sense for your subscription and application.

## Step 1: Install Azure PowerShell

[AZURE.INCLUDE [powershell-preview](../../includes/powershell-preview-inline-include.md)]

## Step 2: Set your subscription

1. Start a PowerShell prompt.

2. Login to your account:

        Login-AzureRmAccount

3. Get your subscription:

        Get-AzureSubscription | Sort SubscriptionName | Select SubscriptionName

4. Set the subscription that you want to use as current:

        $subscr = "subscription name"
        Select-AzureSubscription -SubscriptionName $subscr –Current


## Step 2: Create resources

Create the resources that are needed for your new virtual machine scale set.

### Resource group

A virtual machine scale set must be contained in a resource group.

1.  Run this command to get a list of available locations and the services that are supported:

        Get-AzureLocation | Sort Name | Select Name, AvailableServices

    You should see something like this

        Name                AvailableServices
        ----                -----------------
        Australia East      {Compute, Storage, PersistentVMRole, HighMemory}
        Australia Southeast {Compute, Storage, PersistentVMRole, HighMemory}
        Brazil South        {Compute, Storage, PersistentVMRole, HighMemory}
        Central India       {Compute, Storage, PersistentVMRole, HighMemory}
        Central US          {Compute, Storage, PersistentVMRole, HighMemory}
        East Asia           {Compute, Storage, PersistentVMRole, HighMemory}
        East US             {Compute, Storage, PersistentVMRole, HighMemory}
        East US 2           {Compute, Storage, PersistentVMRole, HighMemory}
        Japan East          {Compute, Storage, PersistentVMRole, HighMemory}
        Japan West          {Compute, Storage, PersistentVMRole, HighMemory}
        North Central US    {Compute, Storage, PersistentVMRole, HighMemory}
        North Europe        {Compute, Storage, PersistentVMRole, HighMemory}
        South Central US    {Compute, Storage, PersistentVMRole, HighMemory}
        South India         {Compute, Storage, PersistentVMRole, HighMemory}
        Southeast Asia      {Compute, Storage, PersistentVMRole, HighMemory}
        West Europe         {Compute, Storage, PersistentVMRole, HighMemory}
        West India          {Compute, Storage, PersistentVMRole, HighMemory}
        West US             {Compute, Storage, PersistentVMRole, HighMemory}

    Pick a location that works best for you and then replace the text in quotes with that location name:

        $locName = "location name from the list, such as Central US"

4. Replace the text in quotes with the name that you want to use for the new resource group and then create it in the location that you previously set:

        $rgName = "resource group name"
        New-AzureRmResourceGroup -Name $rgName -Location $locName

    You should see something like this:

        ResourceGroupName : myrg1
        Location          : centralus
        ProvisioningState : Succeeded
        Tags              :
        ResourceId        : /subscriptions/########-####-####-####-############/resourceGroups/myrg1

### Storage account

Virtual machines created in a scale set require a storage account to store the associated disks.

1. Replace the text in quotes with the name that you want to use for the storage account and then test whether it is unique:

        $saName = "storage account name"
        Test-AzureName -Storage $saName

    If the answer is **False**, your proposed name is unique.

2. Replace the text in quotes with the type of the storage account and then create the account with the name and location you previously set. Possible values are: Standard_LRS, Standard_GRS, Standard_RAGRS, or Premium_LRS:

        $saType = "storage account type"
        New-AzureRmStorageAccount -Name $saName -ResourceGroupName $rgName –Type $saType -Location $locName

    You should see something like this:

        ResourceGroupName   : myrg1
        StorageAccountName  : myst1
        Id                  : /subscriptions/########-####-####-####-############/resourceGroups/myrg1/providers/Microsoft
	                    	.Storage/storageAccounts/myst1
        Location            : centralus
        AccountType         : StandardLRS
        CreationTime        : 3/15/2016 4:51:52 PM
        CustomDomain        :
        LastGeoFailoverTime :
        PrimaryEndpoints    : Microsoft.Azure.Management.Storage.Models.Endpoints
        PrimaryLocation     : centralus
        ProvisioningState   : Succeeded
        SecondaryEndpoints  :
        SecondaryLocation   :
        StatusOfPrimary     : Available
        StatusOfSecondary   :
        Tags                : {}
        Context             : Microsoft.WindowsAzure.Commands.Common.Storage.AzureStorageContext

### Virtual network

A virtual network is required for the virtual machines in the scale set.

1. Replace the text in quotes with the name that you want to use for the subnet in the virtual network and then create the configuration:

        $subName = "subnet name"
        $subnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subName -AddressPrefix 10.0.0.0/24

2. Replace the text in quotes with the name that you want to use for the virtual network and then create it using the information and resources that you previously defined:

        $netName="virtual network name"
        $vnet=New-AzureRmVirtualNetwork -Name $netName -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $subnet


### Public IP address

Before a network interface can be created, you need to create a public IP address.

1. Replace the text in the quotes with the domain name label that you want to use with your public IP address and then test whether the name is unique. The label can contain only letters, numbers, and hyphens, and last character must be a letter or number:

        $domName = "domain name label"
        Test-AzureRmDnsAvailability -DomainQualifiedName $domName -Location $locName

    If the answer is **False**, your proposed name is unique.

2. Replace the text in the quotes with the name that you want to use for the public IP address and then create it:

        $pipName = "public ip address name"
        $pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic -DomainNameLabel $domName

### Network interface

Now that you have the public IP address, you can create the network interface.

1. Replace the text in the quotes with the name that you want to use for the network interface and then create it using the resources that you previously created:

        $nicName = "network interface name"
        $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id


### Create the virtual machine scale set

You have all the resources that you need, now it's time to create the scale set.  

1. Replace the text in quotes with the name that you want to use for the IP configuration and then create it:

        $ipName = "IP configuration name"
        $ipConfig = New-AzureRmVmssIpConfig -Name $ipName -LoadBalancerBackendAddressPoolsId $null -SubnetId $vnet.Subnets[0].Id

2. Replace the text in quotes with the name that you want to use for the scale set configuration and then create it. This step includes setting the size (referred to as SkuName) of the virtual machines in the set. Look at [Sizes for virtual machines](..\virtual-machines\virtual-machines-windows-sizes.md) to find a size that meets your needs. For this example, it is recommended to use Standard_A0.:

        $vmssName = "Scale set configuration name"
        $vmss = New-AzureRmVmssConfig -Location $locName -SkuCapacity 3 -SkuName "Standard_A0"
        Add-AzureRmVmssNetworkInterfaceConfiguration -VirtualMachineScaleSet $vmss -Name $vmssName -Primary $true -IPConfiguration $ipConfig

    You should see something like this:

        Sku                   : {
                                  "name": "Standard_A0",
                                  "tier": null,
                                  "capacity": 3
        						}
        UpgradePolicy         : {
                                  "mode": "automatic"
                                }
        VirtualMachineProfile : {
                                  "osProfile": null,
                                  "storageProfile": null,
                                  "networkProfile": {
                                    "networkInterfaceConfigurations": [
                                      {
                                        "name": "myniccfg1",
                                        "properties.primary": true,
                                        "properties.ipConfigurations": [
                                          {
                                            "name": "myipconfig1",
                                            "properties.subnet": {
                                              "id": "/subscriptions/########-####-####-####-############/resourceGroups/myrg1/providers/Microsoft.Network/virtualNetworks/myvn1/subnets/mysn1"
                                            },
                                            "properties.loadBalancerBackendAddressPools": [],
                                            "properties.loadBalancerInboundNatPools": [],
                                            "id": null
                                          }
                                        ],
                                        "id": null
                                      }
                                    ]
                                  },
                                  "extensionProfile": {
                                    "extensions": null
                                  }
                                }
        ProvisioningState     :
        Id                    :
        Name                  :
        Type                  :
        Location              : Central US
        Tags.Count            : 0
        Tags                  :

3. Replace the text in quotes for the computer name prefix that you want to use, for the name of the administrator account on the virtual machines, for the account password, and then create the operating system profile:

        $computerName = "computer name prefix"
        $adminName = "administrator account name"
        $adminPassword = "password for administrator accounts"
        Set-AzureRmVmssOsProfile -VirtualMachineScaleSet $vmss -ComputerNamePrefix $computerName -AdminUsername $adminName -AdminPassword $adminPassword

    You should see like this in the osProfile section:

        "osProfile": {
          "computerNamePrefix": "myvmss1",
          "adminUsername": "########",
          "adminPassword": "########",
          "customData": null,
          "windowsConfiguration": null,
          "linuxConfiguration": null,
          "secrets": null
        },

4. Replace the text in quotes with the name that you want to use for the storage profile, the image information, and the storage path for where the disks for the virtual machines are stored, and then create the profile. Look at [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](..\virtual-machines\virtual-machines-windows-cli-ps-findimage.md) to find the information that you need:

        $storeProfile = "storage profile name"
        $imagePublisher = "image publisher name, such as MicrosoftWindowsServer"
        $imageOffer = "offer from publisher, such as WindowsServer"
        $imageSku = "sku of image, such as 2012-R2-Datacenter"
        $vhdContainer = "URI of storage container"
        Set-AzureRmVmssStorageProfile -VirtualMachineScaleSet $vmss -ImageReferencePublisher $imagePublisher -ImageReferenceOffer $imageOffer -ImageReferenceSku $imageSku -ImageReferenceVersion "latest" -Name $storeProfile -VhdContainer $vhdContainer -OsDiskCreateOption "FromImage" -OsDiskCaching "None"

    You should see something like this in the storageProfile section:

        "storageProfile": {
          "imageReference": {
            "publisher": "MicrosoftWindowsServer",
            "offer": "WindowsServer",
            "sku": "2012-R2-Datacenter",
            "version": "latest"
          },
          "osDisk": {
            "name": "mystore1",
            "caching": "None",
            "createOption": "FromImage",
            "osType": null,
            "image": null,
            "vhdContainers": {
              "http://myst1.blob.core.windows.net/vhds"
            }
          }
        },

5. Replace the text in quotes with the name of the virtual machine scale set and then create it:

        $vmssName = "scale set name"
        New-AzureRmVmss -ResourceGroupName $rgName -Name $vmssName -VirtualMachineScaleSet $vmss

    You should see something like this that shows you the deployment succeeded:

        ProvisioningState     : Succeeded
        Id                    : /subscriptions/########-####-####-####-############/resourceGroups/myrg1/providers/Microsoft.Compute/virtualMachineScaleSets/myvmss1
        Name                  : myvmss1
        Type                  : Microsoft.Compute/virtualMachineScaleSets
        Location              : centralus
        Tags.Count            : 0
        Tags                  :

## Step 3: Explore resources

Use these resources to explore the virtual machine scale set that you just created:

- Azure portal - A limited amount of information is available using the portal.
- [Azure Resource Explorer](https://resources.azure.com/) - This is the best tool for exploring the current state of your scale set.
- Azure Powershell - Use this command to get information:

        Get-AzureRmVmss -ResourceGroupName "resource group name" -VMScaleSetName "scale set name"

## Next steps

1. Take a look at the [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md) to learn more.

2. Consider setting up automatic scaling of your scale set by using information in [Automatic scaling and virtual machine scale sets](virtual-machine-scale-sets-autoscale-overview.md)
