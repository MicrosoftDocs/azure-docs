---
title: Deploy VMs on your Azure Stack Edge device via Azure PowerShell
description: Describes how to create and manage virtual machines (VMs) on a Azure Stack Edge device using Azure PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 12/04/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge device using APIs so that I can efficiently manage my VMs.
---

# Deploy VMs on your Azure Stack Edge device via Azure PowerShell

You can create and manage virtual machines (VMs) on an Azure Stack Edge device using APIs. These APIs are standard Azure Resource Manager APIs called using the local Azure Stack Edge endpoint. The Azure Resource Manager APIs provide a consistent management layer that in this case enables you to create, update, and delete VMs in a local subscription that exists on the device. You can connect to the Azure Resource Manager running on Azure Stack Edge via Azure PowerShell cmdlets.

This tutorial describes how to create and manage a VM on your Azure Stack Edge device using Azure PowerShell.

## VM deployment workflow



## Prerequisites

Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed steps, go to [Connect to your Azure Stack Edge device via Azure Resource Manager](azure-stack-edge-r-series-connect-resource-manager.md).

Complete all the steps described in the procedure. Ensure that the following steps can be performed on your client that is accessing the device: 

1. Verify that Azure Resource Manager communication is working. Type:     

    ```powershell
    Add-AzureRmEnvironment -Name <Environment Name> -ARMEndpoint "https://management.<appliance name>.<DNSDomain>:30005/
    ```

2. Call local device APIs to authenticate. Type: 

    `login-AzureRMAccount -EnvironmentName <Environment Name>`

    Provide the username - EdgeARMuser and the password to connect via Azure Resource Manager. 

After the prerequisites are completely configured, proceed to deploy the VMs.


## Query for built in subscription on the device

For Azure Resource Manager, only a single user-visible fixed subscription is supported. This subscription is unique per device and this subscription name or subscription ID cannot be changed.

This subscription contains all the resources that are created required for VM creation. This subscription is not connected or related to your Azure subscription and lives locally on your device.

This subscription will be used to deploy the VMs.

1.  To list this subscription, type:

    ```powershell
    Get-AzureRmSubscription
    ```
    
    A sample output is shown below.

    ```powershell
    PS C:\windows\system32> Get-AzureRmSubscription
    
    Name                 Id                 TenantId          State
    ----                 --                --------           -----
    Default Provider Subscription A4257FDE-B946-4E01-ADE7-674760B8D1A3 c0257de7-538f-415c-993a-1b87a031879d Enabled
    
    PS C:\windows\system32>
    ```
        
3.  Get the list of the registered resource providers running on the device. This list typically includes Compute, Network, and Storage.

    ```powershell
    Get-AzureRMResourceProvider
    ```

    > [!NOTE]
    > The resource providers are pre-registered and cannot be modified or changed.
    
    A sample output is shown below:

    ```powershell
    Get-AzureRmResourceProvider
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
    
## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which the Azure resources such as storage account, disk, managed disk are deployed and managed.

> [!IMPORTANT]
> All the resources are created in the same location as that of the device and the location is set to DBELocal.

```powershell
New-AzureRmResourceGroup -Name <Resource group name> -Location DBELocal
```

A sample output is shown below.

```powershell
New-AzureRmResourceGroup -Name rg191113014333 -Location DBELocal 
Successfully created Resource Group:rg191113014333
```

## Create a storage account

Create a new storage account using the resource group created in the previous step. This is a local storage account that will be used to upload the virtual disk image for the VM.

```powershell
New-AzureRmStorageAccount -Name <Storage account name> -ResourceGroupName <Resource group name> -Location DBELocal -SkuName Standard_LRS
```

> [!NOTE]
> Only local storage accounts such as Locally redundant storage (Standard\_LRS or Premium\_LRS) are supported.

A sample output is shown below.

```powershell
New-AzureRmStorageAccount -Name sa191113014333  -ResourceGroupName rg191113014333 -SkuName Standard_LRS -Location DBELocal

ResourceGroupName      : rg191113014333
StorageAccountName     : sa191113014333
Id                     : /subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg191113014333/providers/Mi
                         crosoft.Storage/storageaccounts/sa191113014333
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

To get the storage account key, run the `Get-AzureRmStorageAccountKey` command. A sample output of this command is shown here.

```powershell
PS C:\Users\Administrator> Get-AzureRmStorageAccountKey

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

## Add blob URI to hosts file

You already added the blob URI in hosts file for the client that you are using to connect to Blob storage in the section [Modify host file for endpoint name resolution](#step-5-modify-host-file-for-endpoint-name-resolution-client-or-dns-server). This was the entry for the blob URI:

\<Azure consistent network services VIP \> \<storage name\>.blob.\<appliance name\>.\<dnsdomain\>

The highlighted value corresponds to the blob service endpoint string.

## Install certificates

If you are using *https*, then you need to install appropriate certificates on your device. In this case, install the blob endpoint certificate. For more information, see [Create and install certificates](#_Step_2:_Create_1).

## Upload a VHD

Copy any disk images to be used into page blobs in the local storage account that you created in the earlier steps. You can use a tool such as Az copy to upload the VHD to the storage account that you created in earlier steps.

```powershell
AzCopy /Source:<sourceDirectoryForVHD> /Dest:<blobContainerUri> /DestKey:<storageAccountKey> /Y /S /V /NC:32  /BlobType:page /destType:blob 
```

You can download the disk images from the marketplace. For detailed steps, go to [Get the virtual disk image from Azure marketplace](azure-stack-edge-r-series-placeholder.md).

A sample output is shown below. For more information on this command, go to [Upload VHD file to storage account using AzCopy](https://docs.microsoft.com/azure/lab-services/devtest-lab-upload-vhd-using-azcopy).

```powershell
AzCopy /Source:\\hcsfs\scratch\vm_vhds\linux /Dest: http://sa191113014333.blob.dbe-1dcmhq2.microsoftdatabox.com/vmimages /DestKey:gJKoyX2Amg0Zytd1ogA1kQ2xqudMHn7ljcDtkJRHwMZbMK== /Y /S /V /NC:32 /BlobType:page /destType:blob /z:2e7d7d27-c983-410c-b4aa-b0aa668af0c6
```

## Create managed disks from the VHD

Create a managed disk from the uploaded VHD.

```powershell
$DiskConfig = New-AzureRmDiskConfig -Location DBELocal -CreateOption Import -SourceUri "Source URL for your VHD" 

$DiskConfig = New-AzureRmDiskConfig -Location DBELocal -CreateOption Import –SourceUri http://sa191113014333.blob.dbe-1dcmhq2.microsoftdatabox.com/vmimages/ubuntu13.vhd 

New-AzureRMDisk -ResourceGroupName <Resource group name> -DiskName <Disk name> -Disk $DiskConfig
```

A sample output is shown below. For more information on this cmdlet, go to [New-AzureRmDisk](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermdisk?view=azurermps-6.13.0).

```powershell
Tags               :
New-AzureRmDisk -ResourceGroupName rg191113014333 -DiskName ld191113014333 -Disk $DiskConfig

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

## Create a VM image from the image managed disk

Use the following command to create a VM image from the managed disk. Replace the values within \< \> with the names you choose.

```powershell
$imageConfig = New-AzureRmImageConfig -Location DBELocal
$ManagedDiskId = (Get-AzureRmDisk -Name $diskname -ResourceGroupName $rgname).Id
Set-AzureRmImageOsDisk -Image $imageConfig -OsType '<OS type>' -OsState 'Generalized' -DiskSizeGB $disksize -ManagedDiskId $ManagedDiskId 

For OS Type=Linux, for example:
Set-AzureRmImageOsDisk -Image $imageConfig -OsType 'Linux' -OsState 'Generalized' -DiskSizeGB $disksize -ManagedDiskId $ManagedDiskId
New-AzureRmImage -Image $imageConfig -ImageName <image name>  -ResourceGroupName <rg name>
```

A sample output is shown below. For more information on this cmdlet, go to [New-AzureRmImage](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermimage?view=azurermps-6.13.0).

```powershell
New-AzureRmImage -Image Microsoft.Azure.Commands.Compute.Automation.Models.PSImage -ImageName ig191113014333  -ResourceGroupName rg191113014333
ResourceGroupName    : rg191113014333
SourceVirtualMachine :
StorageProfile       : Microsoft.Azure.Management.Compute.Models.ImageStorageProfile
ProvisioningState    : Succeeded
Id                   : /subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/rg191113014333/providers/Micr
                       osoft.Compute/images/ig191113014333
Name                 : ig191113014333
Type                 : Microsoft.Compute/images
Location             : dbelocal
Tags                 : {}
```

## Create VM with previously created resources

A virtual network and a virtual network interface must be created so that the VM can be created and deployed in this network.

**Create a Vnet**

```powershell
$subNetId=New-AzureRmVirtualNetworkSubnetConfig -Name <Subnet name> -AddressPrefix <Address Prefix>
$aRmVN = New-AzureRmVirtualNetwork -ResourceGroupName <Resource group name> -Name <Vnet name> -Location DBELocal -AddressPrefix <Your address prefix> -Subnet $subNetId

$ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name <IP config Name> -SubnetId $aRmVN.Subnets[0].Id
```

While creating a NIC for a VM pass the public IP as below so we can access VM IP on the client machine: 

```powershell
$publicIP = "pip" + $timeStamp     New-AzureRmPublicIPAddress -Name <Public IP> -ResourceGroupName <ResourceGroupName> -AllocationMethod Static -Location DBELocal
$PIP1 = (Get-AzureRmPublicIPAddress -Name $publicIP -ResourceGroupName <ResourceGroupName>).Id
$ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name <ConfigName> -PublicIpAddressId $PIP1 -SubnetId $subNetId
$nic = New-AzureRmNetworkInterface -Name <Nic> -ResourceGroupName <ResourceGroupName> -Location DBELocal -IpConfiguration $ipConfig
```

To get the IP: 

```powershell
$publicIp = Get-AzureRmPublicIpAddress -Name$publicIpName -ResourceGroupName$rgName
```

**Create a Vnic using the Vnet subnet ID**

```powershell
$Nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgname -Location DBELocal -IpConfiguration $ipConfig
```

The sample output of these commands is shown below:

```powershell
PS C:\Users\Administrator> $subNetId=New-AzureRmVirtualNetworkSubnetConfig -Name my-ase-subnet -AddressPrefix "5.5.0.0/16"

PS C:\Users\Administrator> $aRmVN = New-AzureRmVirtualNetwork -ResourceGroupName Resource-my-ase -Name my-ase-virtualnetwork -Location DBELocal -AddressPrefix "5.5.0.0/16" -Subnet $subNetId
WARNING: The output object type of this cmdlet will be modified in a future release.
PS C:\Users\Administrator> $ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name my-ase-ip -SubnetId $aRmVN.Subnets[0].Id
PS C:\Users\Administrator> $Nic = New-AzureRmNetworkInterface -Name my-ase-nic -ResourceGroupName Resource-my-ase -Location DBELocal -IpConfiguration $ipConfig
WARNING: The output object type of this cmdlet will be modified in a future release.

PS C:\Users\Administrator> $Nic

Name                        : my-ase-nic
ResourceGroupName           : Resource-my-ase
Location                    : dbelocal
Id                          : /subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/Resource-my-ase/providers/
                              Microsoft.Network/networkInterfaces/my-ase-nic
Etag                        : W/"c02eeb78-958a-4dc7-87ad-caaf43950a29"
ResourceGuid                : 7f7a5b1e-1cc6-4d73-8a31-f91b7fd34b5e
ProvisioningState           : Succeeded
Tags                        :
VirtualMachine              : null
IpConfigurations            : [
                                {
                                  "Name": "my-ase-ip",
                                  "Etag": "W/\"c02eeb78-958a-4dc7-87ad-caaf43950a29\"",
                                  "Id": "/subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/Resource-my-ase
                              /providers/Microsoft.Network/networkInterfaces/my-ase-nic/ipConfigurations/my-ase-ip",
                                  "PrivateIpAddress": "5.5.0.4",
                                  "PrivateIpAllocationMethod": "Dynamic",
                                  "Subnet": {
                                    "Id": "/subscriptions/a4257fde-b946-4e01-ade7-674760b8d1a3/resourceGroups/Resource-my-ase/providers/Microsoft.Network/virtualNetworks/my-ase-virtualnetwork/subnets/ my-ase-subnet 
                              ",
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
                                "AppliedDnsServers": [],
                                "InternalDomainNameSuffix": "05xjineaffkutdhg4qfu2q4pmg.a--x.internal.cloudapp.net"
                              }
EnableIPForwarding          : False
EnableAcceleratedNetworking : False
NetworkSecurityGroup        : null
Primary                     :
MacAddress                  :
```

**Create a VM**

You can now use the managed disk to create a VM and attach it to the virtual network that you created earlier.

```powershell
$pass = ConvertTo-SecureString "<Password>" -AsPlainText -Force;
$cred = New-Object System.Management.Automation.PSCredential("<Enter username>", $pass)
You will use this username, password to login to the VM, once created and powered up.

$VirtualMachine = New-AzureRmVMConfig -VMName <VM name> -VMSize "Standard_D1_v2"

$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -<OS type> -ComputerName <Your computer Name> -Credential $cred

$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name <OS Disk Name> -Caching "ReadWrite" -CreateOption "FromImage" -Linux -StorageAccountType StandardLRS

$nicID = (Get-AzureRmNetworkInterface -Name <nic name> -ResourceGroupName <Resource Group Name>).Id

$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $nicID

$image = (Get-AzureRmImage -ResourceGroupName <Resource Group Name> -ImageName $ImageName).Id

$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -Id $image

New-AzureRmVM -ResourceGroupName <Resource Group Name> -Location DBELocal -VM $VirtualMachine -Verbose
```

## Connect to a VM

## Manage VM

The following section describes some of the common operations around the VM that you will create on your Azure Stack Edge device.

### Turn on the VM

Run the following cmdlet to turn on a virtual machine running on your device:

```powershell
Start-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>
```

For more information on this cmdlet, go to [Start-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/start-azurermvm?view=azurermps-6.13.0).

### Suspend or shut down the VM

Run the following cmdlet to stop or shut down a virtual machine running on your device:

```powershell
Stop-AzureRmVM [-Name] <String> [-StayProvisioned] [-ResourceGroupName] <String>
```

For more information on this cmdlet, go to [Stop-AzureRmVM cmdlet](https://docs.microsoft.com/powershell/module/azurerm.compute/stop-azurermvm?view=azurermps-6.13.0).

### Add a data disk

If the workload requirements on your VM increase, then you may need to add a data disk.

```powershell
Add-AzureRmVMDataDisk -VM $VirtualMachine -Name "disk1" -VhdUri "https://contoso.blob.core.windows.net/vhds/diskstandard03.vhd" -LUN 0 -Caching ReadOnly -DiskSizeinGB 1 -CreateOption Empty 
 
Update-AzureRmVM -ResourceGroupName "<Resource Group Name string>" -VM $VirtualMachine
```

### Delete the VM

Run the following cmdlet to remove a virtual machine from your device:

```powershell
Remove-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>
```

For more information on this cmdlet, go to [Remove-AzureRmVm cmdlet](https://docs.microsoft.com/powershell/module/azurerm.compute/remove-azurermvm?view=azurermps-6.13.0).

### Unsupported VM operations/cmdlets

Extension, scale sets, availability sets, snapshots are not supported.

### List VMs running on the device

To return a list of all the VMs running on your Azure Stack Edge device, run the following command.

```powershell
Get-AzureRmVM -ResourceGroupName <String> -Name <String>  
```

## Supported VM sizes

The VM size determines the amount of compute resources like CPU, GPU, and memory that are made available to the VM. Virtual machines should be created using a VM size appropriate for the workload. If a workload increases, an existing virtual machine can also be resized.

The following Standard Dv2 series VMs are supported for creation on Azure Stack Edge device.

| VM name | VM local disk size |
| --- | --- |
| Standard_D1_v2 | 50 Gib |
| Standard_D2_v2 | 100 Gib |
| Standard_D3_v2 | 200 Gib |
| Standard_D4_v2 | 400 Gib |
| Standard_D5_v2 | 800 Gib |
| Standard_D11_v2 | 100 Gib |
| Standard_D12_v2 | 200 Gib |
| Standard_D13_v2 | 400 Gib |

For more information, go to [Dv2 series on General Purpose VM sizes](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-general#dv2-series).

## Next steps