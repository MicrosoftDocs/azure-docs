---
title: Deploy VMs on your Azure Stack Edge device via Azure PowerShell
description: Describes how to create and manage virtual machines on an Azure Stack Edge device by using Azure PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/27/2023
ms.author: alkohli
ms.custom: devx-track-azurepowershell
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device. I want to use APIs so that I can efficiently manage my VMs.
---

# Deploy VMs on your Azure Stack Edge device via Azure PowerShell

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create and manage a virtual machine (VM) on your Azure Stack Edge device by using Azure PowerShell.

## VM deployment workflow

The high-level deployment workflow of the VM deployment is as follows:

1. Connect to the local Azure Resource Manager of your device.
1. Identify the built-in subscription on the device.
1. Bring your VM image.
1. Create a resource group in the built-in subscription. The resource group contains the VM and all the related resources.  
1. Create a local storage account on the device to store the VHD that is used to create a VM image.
1. Upload a Windows/Linux source image into the storage account to create a managed disk.
1. Use the managed disk to create a VM image.
1. Enable compute on a device port to create a virtual switch.
1. This creates a virtual network using the virtual switch attached to the port on which you enabled compute.
1. Create a VM using the previously created VM image, virtual network, and virtual network interface(s) to communicate within the virtual network and assign a public IP address to remotely access the VM. Optionally include data disks to provide more storage for your VM.

## Prerequisites

[!INCLUDE [azure-stack-edge-gateway-deploy-vm-prerequisites](../../includes/azure-stack-edge-gateway-deploy-virtual-machine-prerequisites.md)]


## Query for a built-in subscription on the device

For Azure Resource Manager, only a single fixed subscription that's user-visible is supported. This subscription is unique per device, and the subscription name and subscription ID can't be changed.

The subscription contains all the resources that are required for VM creation. 

> [!IMPORTANT]
> The subscription is created when you enable VMs from the Azure portal, and it lives locally on your device.

The subscription is used to deploy the VMs.

### [Az](#tab/az)

1.  To list the subscription, run the following command:

    ```powershell
    Get-AzSubscription
    ```
    
    Here's some example output:

    ```output
    PS C:\WINDOWS\system32> Get-AzSubscription
    
    Name                          Id                                   TenantId
    ----                          --                                   --------
    Default Provider Subscription ...                                  ...
    
    
    PS C:\WINDOWS\system32>
    ```
        
1. Get a list of the registered resource providers that are running on the device. The list ordinarily includes compute, network, and storage.

    ```powershell
    Get-AzResourceProvider
    ```

    > [!NOTE]
    > The resource providers are pre-registered, and they can't be modified or changed.
    
    Here's some example output:

    ```output
    PS C:\WINDOWS\system32>  Get-AzResourceProvider
        
    ProviderNamespace : Microsoft.AzureBridge
    RegistrationState : Registered
    ResourceTypes     : {locations, operations, locations/ingestionJobs}
    Locations         : {DBELocal}
    
    ProviderNamespace : Microsoft.Compute
    RegistrationState : Registered
    ResourceTypes     : {virtualMachines, virtualMachines/extensions, locations, operations...}
    Locations         : {DBELocal}
    
    ProviderNamespace : Microsoft.Network
    RegistrationState : Registered
    ResourceTypes     : {operations, locations, locations/operations, locations/usages...}
    Locations         : {DBELocal}
    
    ProviderNamespace : Microsoft.Resources
    RegistrationState : Registered
    ResourceTypes     : {tenants, locations, providers, checkresourcename...}
    Locations         : {DBELocal}
    
    ProviderNamespace : Microsoft.Storage
    RegistrationState : Registered
    ResourceTypes     : {storageaccounts, storageAccounts/blobServices, storageAccounts/tableServices,
                        storageAccounts/queueServices...}
    Locations         : {DBELocal}
    
    PS C:\WINDOWS\system32>
    ```

### [AzureRM](#tab/azure-rm)

1.  To list the subscription, run the following command:

    ```powershell
    Get-AzureRmSubscription
    ```
    
    Here's some example output:

    ```output
    PS C:\windows\system32> Get-AzureRmSubscription
    
    Name                 Id                 TenantId          State
    ----                 --                --------           -----
    Default Provider Subscription         ...                 c0257de7-538f-415c-993a-1b87a031879d Enabled
    
    PS C:\windows\system32>
    ```
        
1. Get a list of the registered resource providers that are running on the device. The list ordinarily includes compute, network, and storage.

    ```powershell
    Get-AzureRMResourceProvider
    ```

    > [!NOTE]
    > The resource providers are pre-registered, and they can't be modified or changed.
    
    Here's some example output:

    ```output
    PS C:\Windows\system32> Get-AzureRmResourceProvider
    ProviderNamespace : Microsoft.Compute
    RegistrationState : Registered
    ResourceTypes     : {virtualMachines, virtualMachines/extensions, locations, operations...}
    Locations         : {DBELocal}
    ZoneMappings      :
    
    ProviderNamespace : Microsoft.Network
    RegistrationState : Registered
    ResourceTypes     : {operations, locations, locations/operations, locations/usages...}
    Locations         : {DBELocal}
    ZoneMappings      :
    
    ProviderNamespace : Microsoft.Resources
    RegistrationState : Registered
    ResourceTypes     : {tenants, locations, providers, checkresourcename...}
    Locations         : {DBELocal}
    ZoneMappings      :
    
    ProviderNamespace : Microsoft.Storage
    RegistrationState : Registered
    ResourceTypes     : {storageaccounts, storageAccounts/blobServices, storageAccounts/tableServices,
                        storageAccounts/queueServices...}
    Locations         : {DBELocal}
    ZoneMappings      :
    ```
---
   
## Create a resource group

Start by creating a new Azure resource group and use this as a logical container for all the VM related resources, such as storage account, disk, network interface, and managed disk.

> [!IMPORTANT]
> All the resources are created in the same location as that of the device, and the location is set to **DBELocal**.

### [Az](#tab/az)

1. Set some parameters.

    ```powershell
    $ResourceGroupName = "<Resource group name>" 
    ```
1. Create a resource group for the resources that you create for the VM.
   
    ```powershell
    New-AzResourceGroup -Name $ResourceGroupName -Location DBELocal
    ```

    Here's some example output:
    
    ```output
    PS C:\WINDOWS\system32> New-AzResourceGroup -Name myaseazrg -Location DBELocal
    
    ResourceGroupName : myaseazrg
    Location          : dbelocal
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/.../resourceGroups/myaseazrg
    
    PS C:\WINDOWS\system32>
    ```

### [AzureRM](#tab/azure-rm)

```powershell
New-AzureRmResourceGroup -Name <Resource group name> -Location DBELocal
```

Here's some example output:

```output
New-AzureRmResourceGroup -Name rg191113014333 -Location DBELocal 
Successfully created Resource Group:rg191113014333
```
---

## Create a local storage account

[!INCLUDE [azure-stack-edge-gpu-create-storage-account](../../includes/azure-stack-edge-gpu-create-storage-account.md)]

[!INCLUDE [Get access keys](../../includes/azure-stack-edge-gpu-get-access-keys-for-local-storage-account.md)]

## Add the blob URI to the host file

You already added the blob URI in the hosts file for the client that you're using to connect to Azure Blob Storage in **Modify host file for endpoint name resolution** of [Connecting to Azure Resource Manager on your Azure Stack Edge device](./azure-stack-edge-gpu-connect-resource-manager.md#step-5-modify-host-file-for-endpoint-name-resolution). This entry was used to add the blob URI:

`<Device IP address>` `<storage name>.blob.<appliance name>.<dnsdomain>`

## Install certificates

If you're using HTTPS, you need to install the appropriate certificates on your device. Here, you install the blob endpoint certificate. For more information, see [Use certificates with your Azure Stack Edge Pro with GPU device](azure-stack-edge-gpu-manage-certificates.md).

## Upload a VHD

Copy any disk images to be used into page blobs in the local storage account that you created earlier. You can use a tool such as [AzCopy](../storage/common/storage-use-azcopy-v10.md) to upload the virtual hard disk (VHD) to the storage account. 


### [Az](#tab/az)

Use the following commands with AzCopy 10:  

1. Set some parameters including the appropriate version of APIs for AzCopy. In this example, AzCopy 10 was used.

    ```powershell
    $Env:AZCOPY_DEFAULT_SERVICE_API_VERSION="2019-07-07"    
    $ContainerName = <Container name>
    $ResourceGroupName = <Resource group name>
    $StorageAccountName = <Storage account name>
    $VHDPath = "Full VHD Path"
    $VHDFile = <VHD file name>
    ```
1. Copy the VHD from the source (in this case, local system) to the storage account that you created on your device in the earlier step.

    ```powershell
    $StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value
    $blobendpoint = (Get-AzEnvironment -Name Environment Name).StorageEndpointSuffix
    $StorageAccountContext = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey -Endpoint $blobendpoint
    <Create the container if it does not exist>
    $containerName = "con1"
    $container = New-AzStorageContainer -Name $containerName -Context $StorageAccountContext -Permission Container
    $StorageAccountSAS = New-AzStorageAccountSASToken -Service Blob -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly
    $endPoint = (Get-AzStorageAccount -name $StorageAccountName -ResourceGroupName $ResourceGroupName).PrimaryEndpoints.Blob
    <Path to azcopy.exe> cp "$VHDPath\$VHDFile" "$endPoint$ContainerName$StorageAccountSAS"    
    ```

    Here's an example output: 
    
    ```output
    PS C:\windows\system32> $ContainerName = "testcontainer1"
    PS C:\windows\system32> $ResourceGroupName = "myaseazrg"
    PS C:\windows\system32> $StorageAccountName = "myaseazsa"
    PS C:\windows\system32> $VHDPath = "C:\Users\alkohli\Downloads\Ubuntu1604"           
    PS C:\windows\system32> $VHDFile = "ubuntu13.vhd"
    
    PS C:\windows\system32> $StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value
    PS C:\windows\system32> $endPoint = (Get-AzStorageAccount -name $StorageAccountName -ResourceGroupName $ResourceGroupName).PrimaryEndpoints.Blob
    PS C:\windows\system32> $StorageAccountContext = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey -Endpoint $endpoint
    PS C:\windows\system32> $StorageAccountSAS = New-AzStorageAccountSASToken -Service Blob -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly

    PS C:\windows\system32> C:\azcopy\azcopy_windows_amd64_10.10.0\azcopy.exe cp "$VHDPath\$VHDFile" "$endPoint$ContainerName$StorageAccountSAS"
    INFO: Scanning...
    INFO: Any empty folders will not be processed, because source and/or destination doesn't have full folder support
    
    Job 72a5e3dd-9210-3e43-6691-6bebd4875760 has started
    Log file is located at: C:\Users\alkohli\.azcopy\72a5e3dd-9210-3e43-6691-6bebd4875760.log
    
    INFO: azcopy.exe: A newer version 10.11.0 is available to download
    ```

### [AzureRM](#tab/azure-rm)

Use the following commands with AzCopy 10:  

```powershell
$StorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value
$blobendpoint = (Get-AzureRmEnvironment -Name <environment name>).StorageEndpointSuffix
$StorageAccountContext = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey -Endpoint $blobendpoint
<Create the container if it does not exist>
$containerName = "con1" 
$container = New-AzureStorageContainer -Name $containerName -Context $StorageAccountContext -Permission Container
$StorageAccountSAS = New-AzureStorageAccountSASToken -Service Blob -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly
$endPoint = (Get-AzureRmStorageAccount -name $StorageAccountName -ResourceGroupName $ResourceGroupName).PrimaryEndpoints.Blob
<Path to azcopy.exe> cp "$VHDPath\$VHDFile" "$endPoint$ContainerName$StorageAccountSAS"
```

Here's some example output: 

```output
$ContainerName = <Container name>
$ResourceGroupName = <Resource group name>
$StorageAccountName = <Storage account name>
$VHDPath = "Full VHD path"
$VHDFile = <VHD file name>

$StorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value

$endPoint = (Get-AzureRmStorageAccount -name $StorageAccountName -resourcegroupname $ResourceGroupName).PrimaryEndpoints.Blob

$StorageAccountContext = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey -Endpoint $endPoint

$StorageAccountSAS = New-AzureStorageAccountSASToken -Service Blob,File,Queue,Table -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly

C:\AzCopy.exe  cp "$VHDPath\$VHDFile" "$endPoint$ContainerName$StorageAccountSAS"
```
---

## Create a managed disk from the VHD

You'll now create a managed disk from the uploaded VHD.

### [Az](#tab/az)

1. Set some parameters.

    ```powershell
    $DiskName = "<Managed disk name>"
    $HyperVGeneration = "<Generation of the image: V1 or V2>"
    ```

1. Create a managed disk from uploaded VHD. To get the source URL for your VHD, go to the container in the storage account that contains the VHD in Storage Explorer. Select the VHD, and right-click and then select **Properties**. In the **Blob properties** dialog, select the **URI**. 

    ```powershell
    $StorageAccountId = (Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName).Id    
    $DiskConfig = New-AzDiskConfig -Location DBELocal -HyperVGeneration $HyperVGeneration -StorageAccountId $StorageAccountId -CreateOption Import -SourceUri "Source URL for your VHD"
    New-AzDisk -ResourceGroupName $ResourceGroupName -DiskName $DiskName -Disk $DiskConfig
    ```
    Here's an example output:.
    
    ```output
    PS C:\WINDOWS\system32> $DiskName = "myazmd"
    PS C:\WINDOWS\system32  $HyperVGeneration = "V1"
    PS C:\WINDOWS\system32> $StorageAccountId = (Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName).Id
    PS C:\WINDOWS\system32> $DiskConfig = New-AzDiskConfig -Location DBELocal -HyperVGeneration $HyperVGeneration -StorageAccountId $StorageAccountId -CreateOption Import -SourceUri "https://myaseazsa.blob.myasegpu.wdshcsso.com/testcontainer1/ubuntu13.vhd"
    PS C:\WINDOWS\system32> New-AzDisk -ResourceGroupName $ResourceGroupName -DiskName $DiskName -Disk $DiskConfig
    
    ResourceGroupName            : myaseazrg
    ManagedBy                    :
    Sku                          : Microsoft.Azure.Management.Compute.Models.DiskSku
    Zones                        :
    TimeCreated                  : 6/24/2021 12:19:56 PM
    OsType                       :
    HyperVGeneration             : V1
    CreationData                 : Microsoft.Azure.Management.Compute.Models.CreationDat
                                   a
    DiskSizeGB                   : 30
    DiskSizeBytes                : 32212254720
    UniqueId                     : 53743801-cbf2-4d2f-acb4-971d037a9395
    EncryptionSettingsCollection :
    ProvisioningState            : Succeeded
    DiskIOPSReadWrite            : 500
    DiskMBpsReadWrite            : 60
    DiskState                    : Unattached
    Encryption                   : Microsoft.Azure.Management.Compute.Models.Encryption
    Id                           : /subscriptions/.../r
                                   esourceGroups/myaseazrg/providers/Microsoft.Compute/d
                                   isks/myazmd
    Name                         : myazmd
    Type                         : Microsoft.Compute/disks
    Location                     : DBELocal
    Tags                         : {}
    
    PS C:\WINDOWS\system32>
    ```
 

### [AzureRM](#tab/azure-rm)

```powershell
$DiskConfig = New-AzureRmDiskConfig -Location DBELocal -CreateOption Import -SourceUri "Source URL for your VHD"
```
Here's some example output: 

```output
$DiskConfig = New-AzureRmDiskConfig -Location DBELocal -CreateOption Import –SourceUri http://sa191113014333.blob.dbe-1dcmhq2.microsoftdatabox.com/vmimages/ubuntu13.vhd
```
 

```powershell
New-AzureRMDisk -ResourceGroupName <Resource group name> -DiskName <Disk name> -Disk $DiskConfig
```

Here's some example output. For more information about this cmdlet, see [New-AzureRmDisk](/powershell/module/azurerm.compute/new-azurermdisk?view=azurermps-6.13.0&preserve-view=true).

```output
Tags               : New-AzureRmDisk -ResourceGroupName rg191113014333 -DiskName ld191113014333 -Disk $DiskConfig

ResourceGroupName  : rg191113014333
ManagedBy          :
Sku                : Microsoft.Azure.Management.Compute.Models.DiskSku
Zones              :
TimeCreated        : 11/13/2019 1:49:07 PM
OsType             :
CreationData       : Microsoft.Azure.Management.Compute.Models.CreationData
DiskSizeGB         : 30
EncryptionSettings :
ProvisioningState  : Succeeded
Id                 : /subscriptions/.../resourceGroups/rg191113014333/providers/Micros
                     oft.Compute/disks/ld191113014333
Name               : ld191113014333
Type               : Microsoft.Compute/disks
Location           : DBELocal
Tags               : {}
```
---

## Create a VM image from the managed disk

You'll now create a VM image from the managed disk.

### [Az](#tab/az)

1. Set some parameters.

    ```powershell
    $DiskSize = "<Size greater than or equal to size of source managed disk>"
    $OsType = "<linux or windows>" 
    $ImageName = "<Image name>"
    ```
1. Create a VM image. The supported OS types are Linux and Windows.

    ```powershell
    $imageConfig = New-AzImageConfig -Location DBELocal -HyperVGeneration $hyperVGeneration 
    $ManagedDiskId = (Get-AzDisk -Name $DiskName -ResourceGroupName $ResourceGroupName).Id
    Set-AzImageOsDisk -Image $imageConfig -OsType $OsType -OsState 'Generalized' -DiskSizeGB $DiskSize -ManagedDiskId $ManagedDiskId 
    New-AzImage -Image $imageConfig -ImageName $ImageName -ResourceGroupName $ResourceGroupName  
    ```  
    Here's an example output. 

    ```output
    PS C:\WINDOWS\system32> $OsType = "linux"
    PS C:\WINDOWS\system32> $ImageName = "myaseazlinuxvmimage"
    PS C:\WINDOWS\system32> $DiskSize = 35
    PS C:\WINDOWS\system32> $imageConfig = New-AzImageConfig -Location DBELocal
    PS C:\WINDOWS\system32> $ManagedDiskId = (Get-AzDisk -Name $DiskName -ResourceGroupName $ResourceGroupName).Id
    PS C:\WINDOWS\system32> Set-AzImageOsDisk -Image $imageConfig -OsType $OsType -OsState 'Generalized' -DiskSizeGB $DiskSize -ManagedDiskId $ManagedDiskId
    
    ResourceGroupName    :
    SourceVirtualMachine :
    StorageProfile       : Microsoft.Azure.Management.Compute.Models.ImageStorageProfile
    ProvisioningState    :
    HyperVGeneration     : V1
    Id                   :
    Name                 :
    Type                 :
    Location             : DBELocal
    Tags                 :
    
    PS C:\WINDOWS\system32> New-AzImage -Image $imageConfig -ImageName $ImageName -ResourceGroupName $ResourceGroupName
    
    ResourceGroupName    : myaseazrg
    SourceVirtualMachine :
    StorageProfile       : Microsoft.Azure.Management.Compute.Models.ImageStorageProfile
    ProvisioningState    : Succeeded
    HyperVGeneration     : V1
    Id                   : /subscriptions/.../resourceG
                           roups/myaseazrg/providers/Microsoft.Compute/images/myaseazlin
                           uxvmimage
    Name                 : myaseazlinuxvmimage
    Type                 : Microsoft.Compute/images
    Location             : dbelocal
    Tags                 : {}
    
    PS C:\WINDOWS\system32> 
    ```

### [AzureRM](#tab/azure-rm)

Run the following command. Replace *\<Disk name>*, *\<OS type>*, and *\<Disk size>* with real values.

```powershell
$imageConfig = New-AzureRmImageConfig -Location DBELocal
$ManagedDiskId = (Get-AzureRmDisk -Name <Disk name> -ResourceGroupName <Resource group name>).Id
Set-AzureRmImageOsDisk -Image $imageConfig -OsType '<OS type>' -OsState 'Generalized' -DiskSizeGB <Disk size> -ManagedDiskId $ManagedDiskId 
New-AzureRmImage -Image $imageConfig -ImageName <Image name>  -ResourceGroupName <Resource group name>
```

The supported OS types are Linux and Windows.

Here's some example output. For more information about this cmdlet, see [New-AzureRmImage](/powershell/module/azurerm.compute/new-azurermimage?view=azurermps-6.13.0&preserve-view=true).

```output
PS C:\Windows\system32> New-AzImage -Image $imageConfig -ImageName ig191113014333    -ResourceGroupName RG191113014333
ResourceGroupName    : RG191113014333
SourceVirtualMachine :
StorageProfile       : Microsoft.Azure.Management.Compute.Models.ImageStorageProfile
ProvisioningState    : Succeeded
HyperVGeneration     : V1
Id                   : /subscriptions/.../resourceGroups/RG191113014333/providers/Microsoft.Compute/images/ig191113014333
Name                 : ig191113014333
Type                 : Microsoft.Compute/images
Location             : dbelocal
Tags                 : {}
```
---

## Create your VM with previously created resources

Before you create and deploy the VM, you must create one virtual network and associate a virtual network interface with it.

> [!IMPORTANT]
> The following rules apply:
> - You can create only one virtual network, even across resource groups. The virtual network must have exactly the same address space as the logical network.
> - The virtual network can have only one subnet. The subnet must have exactly the same address space as the virtual network.
> - When you create the virtual network interface card, you can use only the static allocation method. The user needs to provide a private IP address.<!--Confirm w/ Neeraj given we can have both static and DHCP-->

### Query the automatically created virtual network

When you enable compute from the local UI of your device, a virtual network called `ASEVNET` is created automatically, under the `ASERG` resource group. 

### [Az](#tab/az)

Use the following command to query the existing virtual network:

```powershell
$ArmVn = Get-AzVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG 
```

### [AzureRM](#tab/azure-rm)

Use the following command to query the existing virtual network:

```powershell
$aRmVN = Get-AzureRMVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG 
```
---

### Create a virtual network interface card

You create a virtual network interface card by using the virtual network subnet ID.

### [Az](#tab/az)

1. Set some parameters.

    ```powershell
    $IpConfigName = "<IP config name>"
    $NicName = "<Network interface name>"
    ```

1. Create a virtual network interface.

    ```powershell
    $ipConfig = New-AzNetworkInterfaceIpConfig -Name $IpConfigName -SubnetId $aRmVN.Subnets[0].Id 
    $Nic = New-AzNetworkInterface -Name $NicName -ResourceGroupName $ResourceGroupName -Location DBELocal -IpConfiguration $IpConfig    
    ```

    By default, an IP is dynamically assigned to your network interface from the network enabled for compute. Use the `-PrivateIpAddress parameter` if you're allocating a static IP to your network interface.         

    Here's an example output:
    
    ```output
    PS C:\WINDOWS\system32> $IpConfigName = "myazipconfig1"
    PS C:\WINDOWS\system32> $NicName = "myaznic1"
    PS C:\WINDOWS\system32> $ipConfig = New-AzNetworkInterfaceIpConfig -Name $IpConfigName -SubnetId $aRmVN.Subnets[0].Id 
    PS C:\WINDOWS\system32> $ipConfig = New-AzNetworkInterfaceIpConfig -Name $IpConfigName -SubnetId $aRmVN.Subnets[0].Id
    PS C:\WINDOWS\system32> $Nic = New-AzNetworkInterface -Name $NicName -ResourceGroupName $ResourceGroupName -Location DBELocal -IpConfiguration $IpConfig
    PS C:\WINDOWS\system32> $Nic
        
    Name                        : myaznic1
    ResourceGroupName           : myaseazrg
    Location                    : dbelocal
    Id                          : /subscriptions/.../re
                                  sourceGroups/myaseazrg/providers/Microsoft.Network/net
                                  workInterfaces/myaznic1
    Etag                        : W/"0b20057b-2102-4f34-958b-656327c0fb1d"
    ResourceGuid                : e7d4131f-6f01-4492-9d4c-a8ff1af7244f
    ProvisioningState           : Succeeded
    Tags                        :
    VirtualMachine              : null
    IpConfigurations            : [
                                    {
                                      "Name": "myazipconfig1",
                                      "Etag":
                                  "W/\"0b20057b-2102-4f34-958b-656327c0fb1d\"",
                                      "Id": "/subscriptions/.../resourceGroups/myaseazrg/providers/Microsoft.
                                  Network/networkInterfaces/myaznic1/ipConfigurations/my
                                  azipconfig1",
                                      "PrivateIpAddress": "10.126.76.60",
                                      "PrivateIpAllocationMethod": "Dynamic",
                                      "Subnet": {
                                        "Delegations": [],
                                        "Id": "/subscriptions/.../resourceGroups/ASERG/providers/Microsoft.Ne
                                  twork/virtualNetworks/ASEVNET/subnets/ASEVNETsubNet",
                                        "ServiceAssociationLinks": []
                                      },
                                      "ProvisioningState": "Succeeded",
                                      "PrivateIpAddressVersion": "IPv4",
                                      "LoadBalancerBackendAddressPools": [],
                                      "LoadBalancerInboundNatRules": [],
                                      "Primary": true,
                                      "ApplicationGatewayBackendAddressPools": [],
                                      "ApplicationSecurityGroups": []
                                    }
                                  ]
    DnsSettings                 : {
                                    "DnsServers": [],
                                    "AppliedDnsServers": [],
                                    "InternalDomainNameSuffix": "auwlfcx0dhxurjgisct43fc
                                  ywb.a--x.internal.cloudapp.net"
                                  }
    EnableIPForwarding          : False
    EnableAcceleratedNetworking : False
    NetworkSecurityGroup        : null
    Primary                     :
    MacAddress                  : 001DD84A58D1
           
    PS C:\WINDOWS\system32>
    ```

Optionally, while you're creating a virtual network interface card for a VM, you can pass the public IP. In this instance, the public IP returns the private IP. 

```powershell
New-AzPublicIPAddress -Name <Public IP> -ResourceGroupName <ResourceGroupName> -AllocationMethod Static -Location DBELocal
$publicIP = (Get-AzPublicIPAddress -Name <Public IP> -ResourceGroupName <Resource group name>).Id
$ipConfig = New-AzNetworkInterfaceIpConfig -Name <ConfigName> -PublicIpAddressId $publicIP -SubnetId $subNetId
```

### [AzureRM](#tab/azure-rm)

```powershell
$ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name <IP config Name> -SubnetId $aRmVN.Subnets[0].Id -PrivateIpAddress <Private IP>
$Nic = New-AzureRmNetworkInterface -Name <Nic name> -ResourceGroupName <Resource group name> -Location DBELocal -IpConfiguration $ipConfig
```

By default, an IP is dynamically assigned to your network interface from the network enabled for compute. Use the `-PrivateIpAddress parameter` if you're allocating a static IP to your network interface. 

Here's some example output:

```output
PS C:\windows\system32> $subNetId=New-AzureRmVirtualNetworkSubnetConfig -Name my-ase-subnet -AddressPrefix "5.5.0.0/16"

PS C:\windows\system32> $aRmVN = New-AzureRmVirtualNetwork -ResourceGroupName Resource-my-ase -Name my-ase-virtualnetwork -Location DBELocal -AddressPrefix "5.5.0.0/16" -Subnet $subNetId
WARNING: The output object type of this cmdlet will be modified in a future release.
PS C:\windows\system32> $ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name my-ase-ip -SubnetId $aRmVN.Subnets[0].Id
PS C:\windows\system32> $Nic = New-AzureRmNetworkInterface -Name my-ase-nic -ResourceGroupName Resource-my-ase -Location DBELocal -IpConfiguration $ipConfig
WARNING: The output object type of this cmdlet will be modified in a future release.

PS C:\windows\system32> $Nic

PS C:\windows\system32> (Get-AzureRmNetworkInterface)[0]

Name                        : nic200108020444
ResourceGroupName           : rg200108020444
Location                    : dbelocal
Id                          : /subscriptions/.../resourceGroups/rg200108020444/providers/Microsoft.Network/networ
                              kInterfaces/nic200108020444
Etag                        : W/"f9d1759d-4d49-42fa-8826-e218e0b1d355"
ResourceGuid                : 3851ae62-c13e-4416-9386-e21d9a2fef0f
ProvisioningState           : Succeeded
Tags                        :
VirtualMachine              : {
                                "Id": "/subscriptions/.../resourceGroups/rg200108020444/providers/Microsoft.Compu
                              te/virtualMachines/VM200108020444"
                              }
IpConfigurations            : [
                                {
                                  "Name": "ip200108020444",
                                  "Etag": "W/\"f9d1759d-4d49-42fa-8826-e218e0b1d355\"",
                                  "Id": "/subscriptions/.../resourceGroups/rg200108020444/providers/Microsoft.Net
                              work/networkInterfaces/nic200108020444/ipConfigurations/ip200108020444",
                                  "PrivateIpAddress": "5.5.166.65",
                                  "PrivateIpAllocationMethod": "Static",
                                  "Subnet": {
                                    "Id": "/subscriptions/.../resourceGroups/DbeSystemRG/providers/Microsoft.Netw
                              ork/virtualNetworks/vSwitch1/subnets/subnet123",
                                    "ResourceNavigationLinks": [],
                                    "ServiceEndpoints": []
                                  },
                                  "ProvisioningState": "Succeeded",
                                  "PrivateIpAddressVersion": "IPv4",
                                  "LoadBalancerBackendAddressPools": [],
                                  "LoadBalancerInboundNatRules": [],
                                  "Primary": true,
                                  "ApplicationGatewayBackendAddressPools": [],
                                  "ApplicationSecurityGroups": []
                                }
                              ]
DnsSettings                 : {
                                "DnsServers": [],
                                "AppliedDnsServers": []
                              }
EnableIPForwarding          : False
EnableAcceleratedNetworking : False
NetworkSecurityGroup        : null
Primary                     : True
MacAddress                  : 00155D18E432                :
```

Optionally, while you're creating a virtual network interface card for a VM, you can pass the public IP. In this instance, the public IP returns the private IP. 

```powershell
New-AzureRmPublicIPAddress -Name <Public IP> -ResourceGroupName <ResourceGroupName> -AllocationMethod Static -Location DBELocal
$publicIP = (Get-AzureRmPublicIPAddress -Name <Public IP> -ResourceGroupName <Resource group name>).Id
$ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name <ConfigName> -PublicIpAddressId $publicIP -SubnetId $subNetId
```
---

### Create a VM

You can now use the VM image to create a VM and attach it to the virtual network that you created earlier.

### [Az](#tab/az)

1. Set the username and password to sign in to the VM that you want to create.

    ```powershell
    $pass = ConvertTo-SecureString "<Password>" -AsPlainText -Force;
    $cred = New-Object System.Management.Automation.PSCredential("<Enter username>", $pass)
    ```
    After you've created and powered up the VM, you'll use the preceding username and password to sign in to it.

1. Set the parameters.

    ```powershell
    $VmName = "<VM name>"
    $ComputerName = "<VM display name>"
    $OsDiskName = "<OS disk name>"
    ```
1. Create the VM.

    ```powershell
    $VirtualMachine =  New-AzVMConfig -VmName $VmName -VMSize "Standard_D1_v2"
 
    $VirtualMachine =  Set-AzVMOperatingSystem -VM $VirtualMachine -Linux -ComputerName $ComputerName -Credential $cred
     
    $VirtualMachine =  Set-AzVmOsDisk -VM $VirtualMachine -Name $OsDiskName -Caching "ReadWrite" -CreateOption "FromImage" -Linux -StorageAccountType Standard_LRS
     
    $nicID = (Get-AzNetworkInterface -Name $NicName -ResourceGroupName $ResourceGroupName).Id
     
    $VirtualMachine =  Add-AzVMNetworkInterface -Vm $VirtualMachine -Id $nicID
     
    $image = ( Get-AzImage -ResourceGroupName $ResourceGroupName -ImageName $ImageName).Id
     
    $VirtualMachine =  Set-AzVMSourceImage -VM $VirtualMachine -Id $image
     
    New-AzVM -ResourceGroupName $ResourceGroupName -Location DBELocal -VM $VirtualMachine -Verbose
    ```

    Here's an example output.
    
    ```powershell
    PS C:\WINDOWS\system32> $pass = ConvertTo-SecureString "Password1" -AsPlainText -Force;
    PS C:\WINDOWS\system32> $cred = New-Object System.Management.Automation.PSCredential("myazuser", $pass)
    PS C:\WINDOWS\system32> $VmName = "myazvm"
    >> $ComputerName = "myazvmfriendlyname"
    >> $OsDiskName = "myazosdisk1"
    PS C:\WINDOWS\system32> $VirtualMachine =  New-AzVMConfig -VmName $VmName -VMSize "Standard_D1_v2"
    PS C:\WINDOWS\system32> $VirtualMachine =  Set-AzVMOperatingSystem -VM $VirtualMachine -Linux -ComputerName $ComputerName -Credential $cred
    PS C:\WINDOWS\system32> $VirtualMachine =  Set-AzVmOsDisk -VM $VirtualMachine -Name $OsDiskName -Caching "ReadWrite" -CreateOption "FromImage" -Linux -StorageAccountType Standard_LRS
    PS C:\WINDOWS\system32> $nicID = (Get-AzNetworkInterface -Name $NicName -ResourceGroupName $ResourceGroupName).Id
    PS C:\WINDOWS\system32> $nicID/subscriptions/.../resourceGroups/myaseazrg/providers/Microsoft.Network/networkInterfaces/myaznic1
    PS C:\WINDOWS\system32> $VirtualMachine =  Add-AzVMNetworkInterface -VM $VirtualMachine -Id $nicID
    PS C:\WINDOWS\system32> $image = ( Get-AzImage -ResourceGroupName $ResourceGroupName -ImageName $ImageName).Id
    PS C:\WINDOWS\system32> $VirtualMachine =  Set-AzVMSourceImage -VM $VirtualMachine -Id $image
    PS C:\WINDOWS\system32> New-AzVM -ResourceGroupName $ResourceGroupName -Location DBELocal -VM $VirtualMachine -Verbose
    WARNING: Since the VM is created using premium storage or managed disk, existing
    standard storage account, myaseazsa, is used for boot diagnostics.
    VERBOSE: Performing the operation "New" on target "myazvm".
    
    RequestId IsSuccessStatusCode StatusCode ReasonPhrase
    --------- ------------------- ---------- ------------
                             True         OK OK
    ```
1. To figure out the IP assigned to the VM that you created, query the virtual network interface that you created. Locate the `PrivateIPAddress` and copy the IP for your VM. Here's an example output.

    ```powershell
    PS C:\WINDOWS\system32> $Nic

    Name                        : myaznic1
    ResourceGroupName           : myaseazrg
    Location                    : dbelocal
    Id                          : /subscriptions/.../re
                                  sourceGroups/myaseazrg/providers/Microsoft.Network/net
                                  workInterfaces/myaznic1
    Etag                        : W/"0b20057b-2102-4f34-958b-656327c0fb1d"
    ResourceGuid                : e7d4131f-6f01-4492-9d4c-a8ff1af7244f
    ProvisioningState           : Succeeded
    Tags                        :
    VirtualMachine              : null
    IpConfigurations            : [
                                    {
                                      "Name": "myazipconfig1",
                                      "Etag":
                                  "W/\"0b20057b-2102-4f34-958b-656327c0fb1d\"",
                                      "Id": "/subscriptions/.../resourceGroups/myaseazrg/providers/Microsoft.
                                  Network/networkInterfaces/myaznic1/ipConfigurations/my
                                  azipconfig1",
                                      "PrivateIpAddress": "10.126.76.60",
                                      "PrivateIpAllocationMethod": "Dynamic",
                                      "Subnet": {
                                        "Delegations": [],
                                        "Id": "/subscriptions/.../resourceGroups/ASERG/providers/Microsoft.Ne
                                  twork/virtualNetworks/ASEVNET/subnets/ASEVNETsubNet",
                                        "ServiceAssociationLinks": []
                                      },
                                      "ProvisioningState": "Succeeded",
                                      "PrivateIpAddressVersion": "IPv4",
                                      "LoadBalancerBackendAddressPools": [],
                                      "LoadBalancerInboundNatRules": [],
                                      "Primary": true,
                                      "ApplicationGatewayBackendAddressPools": [],
                                      "ApplicationSecurityGroups": []
                                    }
                                  ]
    DnsSettings                 : {
                                    "DnsServers": [],
                                    "AppliedDnsServers": [],
                                    "InternalDomainNameSuffix": "auwlfcx0dhxurjgisct43fc
                                  ywb.a--x.internal.cloudapp.net"
                                  }
    EnableIPForwarding          : False
    EnableAcceleratedNetworking : False
    NetworkSecurityGroup        : null
    Primary                     :
    MacAddress                  : 001DD84A58D1
      
    PS C:\WINDOWS\system32>
    ```


### [AzureRM](#tab/azure-rm)

```powershell
$pass = ConvertTo-SecureString "<Password>" -AsPlainText -Force;
$cred = New-Object System.Management.Automation.PSCredential("<Enter username>", $pass)
```

After you've created and powered up the VM, you'll use the following username and password to sign in to it.

```powershell
$VirtualMachine = New-AzureRmVMConfig -VMName <VM name> -VMSize "Standard_D1_v2"

$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -<OS type> -ComputerName <Your computer Name> -Credential $cred

$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name <OS Disk Name> -Caching "ReadWrite" -CreateOption "FromImage" -Linux -StorageAccountType StandardLRS

$nicID = (Get-AzureRmNetworkInterface -Name <nic name> -ResourceGroupName <Resource Group Name>).Id

$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nicID

$image = (Get-AzureRmImage -ResourceGroupName <Resource Group Name> -ImageName $ImageName).Id

$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -Id $image

New-AzureRmVM -ResourceGroupName <Resource Group Name> -Location DBELocal -VM $VirtualMachine -Verbose
```
---

## Connect to the VM

Depending on whether you created a Windows VM or a Linux VM, the connection instructions can be different.

## Connect to a Linux VM

To connect to a Linux VM, do the following:

[!INCLUDE [azure-stack-edge-gateway-connect-vm](../../includes/azure-stack-edge-gateway-connect-virtual-machine-linux.md)]

If you used a public IP address during the VM creation, you can use that IP to connect to the VM. To get the public IP, run the following command: 

### [Az](#tab/az)

```powershell
$publicIp = Get-AzPublicIpAddress -Name $PublicIp -ResourceGroupName $ResourceGroupName
```
In this instance, the public IP is the same as the private IP that you passed during the creation of the virtual network interface.
  
### [AzureRM](#tab/azure-rm)

```powershell
$publicIp = Get-AzureRmPublicIpAddress -Name <Public IP> -ResourceGroupName <Resource group name>
```
In this instance, the public IP is the same as the private IP that you passed during the creation of the virtual network interface.

---

## Connect to a Windows VM

To connect to a Windows VM, do the following:

[!INCLUDE [azure-stack-edge-gateway-connect-vm](../../includes/azure-stack-edge-gateway-connect-virtual-machine-windows.md)]


## Manage the VM

The following sections describe some of the common operations that you can create on your Azure Stack Edge Pro device.

### List VMs that are running on the device

To return a list of all the VMs that are running on your Azure Stack Edge device, run this command:

### [Az](#tab/az)

```powershell
Get-AzVM -ResourceGroupName <String> -Name <String>
```

For more information about this cmdlet, see [Get-AzVM](/powershell/module/az.compute/get-azvm).

### [AzureRM](#tab/azure-rm)

```powershell
Get-AzureRmVM -ResourceGroupName <String> -Name <String>
```

---


### Turn on the VM

To turn on a virtual machine that's running on your device, run the following cmdlet:

### [Az](#tab/az)

```powershell
Start-AzVM [-Name] <String> [-ResourceGroupName] <String>
```
For more information about this cmdlet, see [Start-AzVM](/powershell/module/az.compute/start-azvm).

### [AzureRM](#tab/azure-rm)

```powershell
Start-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>
```

For more information about this cmdlet, see [Start-AzureRmVM](/powershell/module/azurerm.compute/start-azurermvm?view=azurermps-6.13.0&preserve-view=true).

---

### Suspend or shut down the VM

To stop or shut down a virtual machine that's running on your device, run the following cmdlet:

### [Az](#tab/az)

```powershell
Stop-AzVM [-Name] <String> [-StayProvisioned] [-ResourceGroupName] <String>
```

For more information about this cmdlet, see [Stop-AzVM cmdlet](/powershell/module/az.compute/stop-azvm).

### [AzureRM](#tab/azure-rm)

```powershell
Stop-AzureRmVM [-Name] <String> [-StayProvisioned] [-ResourceGroupName] <String>
```

For more information about this cmdlet, see [Stop-AzureRmVM cmdlet](/powershell/module/azurerm.compute/stop-azurermvm?view=azurermps-6.13.0&preserve-view=true).

---

### Add a data disk

If the workload requirements on your VM increase, you might need to add a data disk. To do so, run the following command:

### [Az](#tab/az)

```powershell
Add-AzRmVMDataDisk -VM $VirtualMachine -Name "disk1" -VhdUri "https://contoso.blob.core.windows.net/vhds/diskstandard03.vhd" -LUN 0 -Caching ReadOnly -DiskSizeinGB 1 -CreateOption Empty 
 
Update-AzVM -ResourceGroupName "<Resource Group Name string>" -VM $VirtualMachine
```

### [AzureRM](#tab/azure-rm)

```powershell
Add-AzureRmVMDataDisk -VM $VirtualMachine -Name "disk1" -VhdUri "https://contoso.blob.core.windows.net/vhds/diskstandard03.vhd" -LUN 0 -Caching ReadOnly -DiskSizeinGB 1 -CreateOption Empty 
 
Update-AzureRmVM -ResourceGroupName "<Resource Group Name string>" -VM $VirtualMachine
```
---



### Delete the VM

To remove a virtual machine from your device, run the following cmdlet:

### [Az](#tab/az)

```powershell
Remove-AzVM [-Name] <String> [-ResourceGroupName] <String>
```
For more information about this cmdlet, see [Remove-AzVm cmdlet](/powershell/module/az.compute/remove-azvm).

### [AzureRM](#tab/azure-rm)

```powershell
Remove-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>
```
For more information about this cmdlet, see [Remove-AzureRmVm cmdlet](/powershell/module/azurerm.compute/remove-azurermvm?view=azurermps-6.13.0&preserve-view=true).

---

## Next steps

[Azure Resource Manager cmdlets](/powershell/module/azurerm.resources/?view=azurermps-6.13.0&preserve-view=true)
