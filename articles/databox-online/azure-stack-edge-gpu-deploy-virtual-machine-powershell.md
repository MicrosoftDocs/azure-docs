---
title: Deploy VMs on your Azure Stack Edge device via Azure PowerShell
description: Describes how to create and manage virtual machines on an Azure Stack Edge device by using Azure PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/09/2021
ms.author: alkohli
ms.custom: devx-track-azurepowershell
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device. I want to use APIs so that I can efficiently manage my VMs.
---

# Deploy VMs on your Azure Stack Edge device via Azure PowerShell

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create and manage a virtual machine (VM) on your Azure Stack Edge device by using Azure PowerShell. The information applies to Azure Stack Edge Pro with GPU (graphical processing unit), Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices.

## VM deployment workflow

The deployment workflow is displayed in the following diagram:

![Diagram of the VM deployment workflow.](media/azure-stack-edge-gpu-deploy-virtual-machine-powershell/vm-workflow-r.svg)

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
    Default Provider Subscription d64617ad-6266-4b19-45af-81112d213322 c0257de7-53...
    
    
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
    Default Provider Subscription A4257FDE-B946-4E01-ADE7-674760B8D1A3 c0257de7-538f-415c-993a-1b87a031879d Enabled
    
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

```powershell
New-AzResourceGroup -Name <Resource group name> -Location DBELocal
```

Here's some example output:

```output
PS C:\WINDOWS\system32> New-AzResourceGroup -Name myaseazrg -Location DBELocal

ResourceGroupName : myaseazrg
Location          : dbelocal
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/d64617ad-6266-4b19-45af-81112d213322/resourceGroups/myaseazrg

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

## Create a storage account

Create a new storage account by using the resource group that you created in the preceding step. This is a local storage account that you use to upload the virtual disk image for the VM.

### [Az](#tab/az)

```powershell
New-AzStorageAccount -Name <Storage account name> -ResourceGroupName <Resource group name> -Location DBELocal -SkuName Standard_LRS
```

> [!NOTE]
> By using Azure Resource Manager, you can create only local storage accounts, such as locally redundant storage (standard or premium). To create tiered storage accounts, see [Tutorial: Transfer data via storage accounts with Azure Stack Edge Pro with GPU](./azure-stack-edge-gpu-deploy-add-storage-accounts.md).

Here's some example output:

```output
PS C:\WINDOWS\system32> New-AzStorageAccount -Name myaseazsa -ResourceGroupName myaseazrg -Location DBELocal -SkuName Standard_LRS

StorageAccountName ResourceGroupName PrimaryLocation SkuName      Kind    AccessTier CreationTime
------------------ ----------------- --------------- -------      ----    ---------- ------------
myaseazsa          myaseazrg         DBELocal        Standard_LRS Storage            6/10/2021 11:45...

PS C:\WINDOWS\system32>
```

To get the storage account key, run the `Get-AzStorageAccountKey` command. Here's some example output:

```output
PS C:\WINDOWS\system32> Get-AzStorageAccountKey

cmdlet Get-AzStorageAccountKey at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ResourceGroupName: myaseazrg
Name: myaseazsa

KeyName Value                                                                                    Permis
                                                                                                  sions
------- -----                                                                                    ------
key1    gv3OF57tuPDyzBNc1M7fhil2UAiiwnhTT6zgiwE3TlF/CD217Cvw2YCPcrKF47joNKRvzp44leUe5HtVkGx8RQ==   Full
key2    kmEynIs3xnpmSxWbU41h5a7DZD7v4gGV3yXa2NbPbmhrPt10+QmE5PkOxxypeSqbqzd9si+ArNvbsqIRuLH2Lw==   Full

PS C:\WINDOWS\system32>
```

### [AzureRM](#tab/azure-rm)

```powershell
New-AzureRmStorageAccount -Name <Storage account name> -ResourceGroupName <Resource group name> -Location DBELocal -SkuName Standard_LRS
```

> [!NOTE]
> By using Azure Resource Manager, you can create only local storage accounts, such as locally redundant storage (standard or premium). To create tiered storage accounts, see [Tutorial: Transfer data via storage accounts with Azure Stack Edge Pro with GPU](./azure-stack-edge-gpu-deploy-add-storage-accounts.md).

Here's some example output:

```output
New-AzureRmStorageAccount -Name sa191113014333  -ResourceGroupName rg191113014333 -SkuName Standard_LRS -Location DBELocal

ResourceGroupName      : rg191113014333
StorageAccountName     : sa191113014333
Id                     : /subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg191113014333/providers/Microsoft.Storage/storageaccounts/sa191113014333
Location               : DBELocal
Sku                    : Microsoft.Azure.Management.Storage.Models.Sku
Kind                   : Storage
Encryption             : Microsoft.Azure.Management.Storage.Models.Encryption
AccessTier             :
CreationTime           : 11/13/2019 9:43:49 PM
CustomDomain           :
Identity               :
LastGeoFailoverTime    :
PrimaryEndpoints       : Microsoft.Azure.Management.Storage.Models.Endpoints
PrimaryLocation        : DBELocal
ProvisioningState      : Succeeded
SecondaryEndpoints     :
SecondaryLocation      :
StatusOfPrimary        : Available
StatusOfSecondary      :
Tags                   :
EnableHttpsTrafficOnly : False
NetworkRuleSet         :
Context                : Microsoft.WindowsAzure.Commands.Common.Storage.LazyAzureStorageContext
ExtendedProperties     : {}
```

To get the storage account key, run the `Get-AzureRmStorageAccountKey` command. Here's some example output:

```output
PS C:\windows\system32> Get-AzureRmStorageAccountKey

cmdlet Get-AzureRmStorageAccountKey at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ResourceGroupName: my-resource-ase
Name:myasestoracct

KeyName Value
------- -----
key1 /IjVJN+sSf7FMKiiPLlDm8mc9P4wtcmhhbnCa7...
key2 gd34TcaDzDgsY9JtDNMUgLDOItUU0Qur3CBo6Q...
```
---

## Add the blob URI to the host file

You already added the blob URI in the hosts file for the client that you're using to connect to Azure Blob Storage in **Modify host file for endpoint name resolution** of [Connecting to Azure Resource Manager on your Azure Stack Edge device](./azure-stack-edge-gpu-connect-resource-manager.md#step-5-modify-host-file-for-endpoint-name-resolution). This entry was used to add the blob URI:

`<Device IP address>` `<storage name>.blob.<appliance name>.<dnsdomain>`

## Install certificates

If you're using HTTPS, you need to install the appropriate certificates on your device. Here, you install the blob endpoint certificate. For more information, see [Use certificates with your Azure Stack Edge Pro with GPU device](azure-stack-edge-gpu-manage-certificates.md).

## Upload a VHD

Copy any disk images to be used into page blobs in the local storage account that you created earlier. You can use a tool such as [AzCopy](../storage/common/storage-use-azcopy-v10.md) to upload the virtual hard disk (VHD) to the storage account. 

<!--Before you use AzCopy, make sure that the [AzCopy is configured correctly](#configure-azcopy) for use with the blob storage REST API version that you're using with your Azure Stack Edge Pro device.

```powershell
AzCopy /Source:<sourceDirectoryForVHD> /Dest:<blobContainerUri> /DestKey:<storageAccountKey> /Y /S /V /NC:32  /BlobType:page /destType:blob 
```

> [!NOTE]
> Set `BlobType` to `page` for creating a managed disk out of VHD. Set `BlobType` to `block` when you're writing to tiered storage accounts by using AzCopy.

You can download the disk images from Azure Marketplace. For more information, see [Get the virtual disk image from Azure Marketplace](azure-stack-edge-j-series-create-virtual-machine-image.md).

Here's some example output that uses AzCopy 7.3. For more information about this command, see [Upload VHD file to storage account by using AzCopy](../devtest-labs/devtest-lab-upload-vhd-using-azcopy.md).


```powershell
AzCopy /Source:\\hcsfs\scratch\vm_vhds\linux\ /Dest:http://sa191113014333.blob.dbe-1dcmhq2.microsoftdatabox.com/vmimages /DestKey:gJKoyX2Amg0Zytd1ogA1kQ2xqudMHn7ljcDtkJRHwMZbMK== /Y /S /V /NC:32 /BlobType:page /destType:blob /z:2e7d7d27-c983-410c-b4aa-b0aa668af0c6
```-->

### [Az](#tab/az)

Use the following commands with AzCopy 10:  

```powershell
$StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName <ResourceGroupName> -Name <StorageAccountName>)[0].Value

$endPoint = (Get-AzStorageAccount -name <StorageAccountName> -ResourceGroupName <ResourceGroupName>).PrimaryEndpoints.Blob

$StorageAccountContext = New-AzStorageContext -StorageAccountName <StorageAccountName> -StorageAccountKey $StorageAccountKey -Endpoint $endpoint

$StorageAccountSAS = New-AzStorageAccountSASToken -Service Blob,File,Queue,Table -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly

<AzCopy exe path> cp "Full VHD path" "<BlobEndPoint>/<ContainerName><StorageAccountSAS>"
```

Here's some example output: 

```output
$ContainerName = <ContainerName>
$ResourceGroupName = <ResourceGroupName>
$StorageAccountName = <StorageAccountName>
$VHDPath = "Full VHD Path"
$VHDFile = <VHDFileName>

$StorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value

$endPoint = (Get-AzStorageAccount -name $StorageAccountName -resourcegroupname $ResourceGroupName).PrimaryEndpoints.Blob

$StorageAccountContext = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey -Endpoint $endPoint

$StorageAccountSAS = New-AzStorageAccountSASToken -Service Blob,File,Queue,Table -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly

C:\AzCopy.exe  cp "$VHDPath\$VHDFile" "$endPoint$ContainerName$StorageAccountSAS"
```

### [AzureRM](#tab/azure-rm)

Use the following commands with AzCopy 10:  

```powershell
$StorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName <ResourceGroupName> -Name <StorageAccountName>)[0].Value

$endPoint = (Get-AzureRmStorageAccount -name <StorageAccountName> -ResourceGroupName <ResourceGroupName>).PrimaryEndpoints.Blob

$StorageAccountContext = New-AzureStorageContext -StorageAccountName <StorageAccountName> -StorageAccountKey <StorageAccountKey> -Endpoint <Endpoint>

$StorageAccountSAS = New-AzureStorageAccountSASToken -Service Blob,File,Queue,Table -ResourceType Container,Service,Object -Permission "acdlrw" -Context <StorageAccountContext> -Protocol HttpsOnly

<AzCopy exe path> cp "Full VHD path" "<BlobEndPoint>/<ContainerName><StorageAccountSAS>"
```

Here's some example output: 

```output
$ContainerName = <ContainerName>
$ResourceGroupName = <ResourceGroupName>
$StorageAccountName = <StorageAccountName>
$VHDPath = "Full VHD Path"
$VHDFile = <VHDFileName>

$StorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value

$endPoint = (Get-AzureRmStorageAccount -name $StorageAccountName -resourcegroupname $ResourceGroupName).PrimaryEndpoints.Blob

$StorageAccountContext = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey -Endpoint $endPoint

$StorageAccountSAS = New-AzureStorageAccountSASToken -Service Blob,File,Queue,Table -ResourceType Container,Service,Object -Permission "acdlrw" -Context $StorageAccountContext -Protocol HttpsOnly

C:\AzCopy.exe  cp "$VHDPath\$VHDFile" "$endPoint$ContainerName$StorageAccountSAS"
```
---

## Create a managed disk from the VHD

You will now create a managed disk from the uploaded VHD.

### [Az](#tab/az)

```powershell
$StorageAccountId = (Get-AzStorageAccount -ResourceGroupName <Resource Group Name> -Name <StorageAccountName>).Id

$DiskConfig = New-AzDiskConfig -Location DBELocal -CreateOption Import -SourceUri "Source URL for your VHD"
```
Here's some example output: 

```output
$StorageAccountId = (Get-AzStorageAccount -ResourceGroupName rg191113014333 -Name sa191113014333).Id

$DiskConfig = New-AzDiskConfig -Location DBELocal -CreateOption Import –SourceUri http://sa191113014333.blob.dbe-1dcmhq2.microsoftdatabox.com/vmimages/ubuntu13.vhd
```
 

```powershell
New-AzDisk -ResourceGroupName <Resource group name> -DiskName <Disk name> -Disk $DiskConfig
```

Here's some example output. For more information about this cmdlet, see [New-AzDisk](/powershell/module/az.compute/new-azdisk?view=azps-5.9.0?&preserve-view=true).

```output
Tags                         : New-AzDisk -ResourceGroupName rg191113014333 -DiskName ld191113014333 -Disk $DiskConfig
ResourceGroupName            : rg191113014333
ManagedBy                    :
Sku                          : Microsoft.Azure.Management.Compute.Models.DiskSku
Zones                        :
TimeCreated                  : 5/13/2021 12:11:05 PM
OsType                       :
HyperVGeneration             :
CreationData                 : Microsoft.Azure.Management.Compute.Models.CreationData
DiskSizeGB                   : 30
DiskSizeBytes                : 32212254720
UniqueId                     : 1d458981-2e96-4f2e-b70a-3ec22dd58387
EncryptionSettingsCollection :
ProvisioningState            : Succeeded
DiskIOPSReadWrite            : 500
DiskMBpsReadWrite            : 60
DiskState                    : Unattached
Encryption                   : Microsoft.Azure.Management.Compute.Models.Encryption
Id                           : /subscriptions/b172b183-b144-478c-8c72-5d35a296eaae/resourceGroups/rg191113014333/providers/Microsoft.Compute/disks/ld191113014333
Name                         : ld191113014333
Type                         : Microsoft.Compute/disks
Location                     : DBELocal
Tags                         : {}
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
Id                 : /subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg191113014333/providers/Micros
                     oft.Compute/disks/ld191113014333
Name               : ld191113014333
Type               : Microsoft.Compute/disks
Location           : DBELocal
Tags               : {}
```
---

## Create a VM image from the image managed disk

You'll now create a VM image from the managed disk.

### [Az](#tab/az)

Run the following command. Replace *\<Disk name>*, *\<OS type>*, and *\<Disk size>* with real values.

```powershell
$imageConfig = New-AzImageConfig -Location DBELocal
$ManagedDiskId = (Get-AzDisk -Name <Disk name> -ResourceGroupName <Resource group name>).Id
Set-AzImageOsDisk -Image $imageConfig -OsType '<OS type>' -OsState 'Generalized' -DiskSizeGB <Disk size> -ManagedDiskId $ManagedDiskId 
New-AzImage -Image $imageConfig -ImageName <Image name>  -ResourceGroupName <Resource group name>
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
Id                   : /subscriptions/b172b183-b144-478c-8c72-5d35a296eaae/resourceGroups/RG191113014333/providers/Microsoft.Compute/images/ig191113014333
Name                 : ig191113014333
Type                 : Microsoft.Compute/images
Location             : dbelocal
Tags                 : {}
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
Id                   : /subscriptions/b172b183-b144-478c-8c72-5d35a296eaae/resourceGroups/RG191113014333/providers/Microsoft.Compute/images/ig191113014333
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
> - When you create the virtual network interface card, you can use only the static allocation method. The user needs to provide a private IP address.

### Query the automatically created virtual network

When you enable compute from the local UI of your device, a virtual network called `ASEVNET` is created automatically, under the `ASERG` resource group. 

Use the following command to query the existing virtual network:

### [Az](#tab/az)

```powershell
$aRmVN = Get-AzVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG 
```

### [AzureRM](#tab/azure-rm)

```powershell
$aRmVN = Get-AzureRMVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG 
```
---
<!--```powershell
$subNetId=New-AzureRmVirtualNetworkSubnetConfig -Name <Subnet name> -AddressPrefix <Address Prefix>
$aRmVN = New-AzureRmVirtualNetwork -ResourceGroupName <Resource group name> -Name <Vnet name> -Location DBELocal -AddressPrefix <Address prefix> -Subnet $subNetId
```-->

### Create a virtual network interface card

You'll create a virtual network interface card by using the virtual network subnet ID.

### [Az](#tab/az)

```powershell
$ipConfig = New-AzNetworkInterfaceIpConfig -Name <IP config Name> -SubnetId $aRmVN.Subnets[0].Id -PrivateIpAddress <Private IP>
$Nic = New-AzNetworkInterface -Name <Nic name> -ResourceGroupName <Resource group name> -Location DBELocal -IpConfiguration $ipConfig
```

Here's some example output:

```output
PS C:\Windows\system32> $subNetId=New-AzVirtualNetworkSubnetConfig -Name my-ase-subnet -AddressPrefix "5.5.0.0/16"

PS C:\Windows\system32> $aRmVN = New-AzVirtualNetwork -ResourceGroupName Resource-my-ase -Name my-ase-virtualnetwork -Location DBELocal -AddressPrefix "5.5.0.0/16" -Subnet $subNetId
WARNING: The output object type of this cmdlet will be modified in a future release.

PS C:\Windows\system32> $ipConfig = New-AzNetworkInterfaceIpConfig -Name my-ase-ip -SubnetId $aRmVN.Subnets[0].Id

PS C:\Windows\system32> $Nic = New-AzNetworkInterface -Name my-ase-nic -ResourceGroupName RG191113014333 -Location DBELocal -IpConfiguration $ipConfig
PS C:\Windows\system32> $Nic
 
Name                        : my-ase-nic
ResourceGroupName           : RG191113014333
Location                    : dbelocal
Id                          : /subscriptions/b172b183-b144-478c-8c72-5d35a296eaae/resourceGroups/RG191113014333/providers/Microsoft.Network/networkInterfaces/my-ase-nic
Etag                        : W/"89898ab3-3e01-4da4-90f1-a848dcca1b2a"
ResourceGuid                : 01cf6f8c-42cc-47ce-b058-22f06cbf17d2
ProvisioningState           : Succeeded
Tags                        :
VirtualMachine              : null
IpConfigurations            : [
                                {
                                  "Name": "my-ase-ip",
                                  "Etag": "W/\"89898ab3-3e01-4da4-90f1-a848dcca1b2a\"",
                                  "Id": "/subscriptions/b172b183-b144-478c-8c72-5d35a296eaae/resourceGroups/RG191113014333/providers/Microsoft.Network/networkInterfaces/my-ase-nic/ipConfigurations/my-ase-ip",
                                  "PrivateIpAddress": "5.5.77.122",
                                  "PrivateIpAllocationMethod": "Dynamic",
                                  "Subnet": {
                                    "Delegations": [],
                                    "Id": "/subscriptions/b172b183-b144-478c-8c72-5d35a296eaae/resourceGroups/ASERG/providers/Microsoft.Network/virtualNetworks/ASEVNET/subnets/ASEVNETsubNet",
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
                                "InternalDomainNameSuffix": "jpt5by3zc0serk1yzkfm1r5dgb.a--x.internal.cloudapp.net"
                              }
EnableIPForwarding          : False
EnableAcceleratedNetworking : False
NetworkSecurityGroup        : null
Primary                     :
MacAddress                  : 001DD84C06C1
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
Id                          : /subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg200108020444/providers/Microsoft.Network/networ
                              kInterfaces/nic200108020444
Etag                        : W/"f9d1759d-4d49-42fa-8826-e218e0b1d355"
ResourceGuid                : 3851ae62-c13e-4416-9386-e21d9a2fef0f
ProvisioningState           : Succeeded
Tags                        :
VirtualMachine              : {
                                "Id": "/subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg200108020444/providers/Microsoft.Compu
                              te/virtualMachines/VM200108020444"
                              }
IpConfigurations            : [
                                {
                                  "Name": "ip200108020444",
                                  "Etag": "W/\"f9d1759d-4d49-42fa-8826-e218e0b1d355\"",
                                  "Id": "/subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg200108020444/providers/Microsoft.Net
                              work/networkInterfaces/nic200108020444/ipConfigurations/ip200108020444",
                                  "PrivateIpAddress": "5.5.166.65",
                                  "PrivateIpAllocationMethod": "Static",
                                  "Subnet": {
                                    "Id": "/subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/DbeSystemRG/providers/Microsoft.Netw
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

```powershell
$pass = ConvertTo-SecureString "<Password>" -AsPlainText -Force;
$cred = New-Object System.Management.Automation.PSCredential("<Enter username>", $pass)
```

After you've created and powered up the VM, you'll use the following username and password to sign in to it.

```powershell
$VirtualMachine =  New-AzVMConfig -VMName <VM name> -VMSize "Standard_D1_v2"
 
$VirtualMachine =  Set-AzVMOperatingSystem -VM $VirtualMachine -<OS type> -ComputerName <Your computer Name> -Credential $cred
 
$VirtualMachine =  Set-AzVMOSDisk -VM $VirtualMachine -Name <OS Disk Name> -Caching "ReadWrite" -CreateOption "FromImage" -Linux -StorageAccountType Standard_LRS
 
$nicID = ( Get-AzNetworkInterface -Name <nic name> -ResourceGroupName <Resource Group Name>).Id
 
$VirtualMachine =  Add-AzVMNetworkInterface -VM $VirtualMachine -Id $nicID
 
$image = ( Get-AzImage -ResourceGroupName <Resource Group Name> -ImageName $ImageName).Id
 
$VirtualMachine =  Set-AzVMSourceImage -VM $VirtualMachine -Id $image
 
New-AzVM -ResourceGroupName <Resource Group Name> -Location DBELocal -VM $VirtualMachine -Verbose
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
$publicIp = Get-AzPublicIpAddress -Name <Public IP> -ResourceGroupName <Resource group name>
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
For more information about this cmdlet, see [Start-AzVM](/powershell/module/az.compute/start-azvm?view=azps-5.9.0&preserve-view=true).

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

For more information about this cmdlet, see [Stop-AzVM cmdlet](/powershell/module/az.compute/stop-azvm?view=azps-5.9.0&preserve-view=true).

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
For more information about this cmdlet, see [Remove-AzVm cmdlet](/powershell/module/az.compute/remove-azvm?view=azps-5.9.0&preserve-view=true).

### [AzureRM](#tab/azure-rm)

```powershell
Remove-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>
```
For more information about this cmdlet, see [Remove-AzureRmVm cmdlet](/powershell/module/azurerm.compute/remove-azurermvm?view=azurermps-6.13.0&preserve-view=true).

---

## Next steps

[Azure Resource Manager cmdlets](/powershell/module/azurerm.resources/?view=azurermps-6.13.0&preserve-view=true)
