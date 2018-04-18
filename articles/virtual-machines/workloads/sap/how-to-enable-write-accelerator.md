---
title: Azure Write Accelerator for SAP deployments | Microsoft Docs
description: Operations guide for SAP HANA systems that are deployed on Azure virtual machines.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/13/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# Azure Write Accelerator for SAP deployments
Azure Write Accelerator is a functionality that is getting rolled out for M-Series VMs exclusively. The Azure Write Accelerator is not available with any other VM-Series in Azure, except the M-Series. As the name states, the purpose of the functionality is to improve I/O latency of writes against the Azure Premium Storage. 

>[!NOTE]
> At this point, the Azure Write Accelerator is in public preview and requires white-listing of your Azure subscription ID

The Azure Write Accelerator functionality is available for M-Series deployment as public preview in:

- West US2
- Western Europe
- Southeast Asia

## Planning for using Azure Write Accelerator
Azure Write Accelerator should be used for the volumes, which contain the transaction log or redo logs of a DBMS. It is not recommended to use Azure Write Accelerator for the data volumes of a DBMS. Reason to this restriction is that Azure Write Accelerator requires the Azure Premium Storage VHDs to be mounted without the additional read caching that is available for Premium Storage. Larger advantages with this type of caching can be observed with traditional databases. Since Write Accelerator is only affecting the write activities and does not speed up reads, the supported design for SAP is to use Write Accelerator against the transaction log or redo log drives of SAP supported databases. 

Azure Write Accelerator only works in conjunction with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). Hence, you need to plan accordingly. 

>[!NOTE]
> As the functionality of Azure Write Accelerator is still in public preview, no production scenario deployments are supported on the functionality yet.

There are limits of Azure Premium Storage VHDs per VM that can be supported by Azure Write Accelerator. The current limits are:

- 16 VHDs for an M128xx VM
- 8 VHDs for an M64xx VM

> [!IMPORTANT]
> If you want to enable or disable Azure Write Accelerator for an existing volume that is built out of multiple Azure Premium Storage disks and striped using Windows disk or volume managers, Windows Storage Spaces, Windows Scale-out file server (SOFS), Linux LVM or MDADM, all disks building the volume must be enabled or disabled for Write Accelerator in separate steps. **Before enabling or disabling Write Accelerator in such a configuration, shut down the Azure VM**. 


> [!IMPORTANT]
> To enable Azure Write Accelerator to an existing Azure disk that is NOT part of a volume build out of multiple disks with Windows disk or volume managers, Windows Storage Spaces, Windows Scale-out file server (SOFS), Linux LVM, or MDADM, the workload accessing the Azure disk needs to be shut down. Database applications using the Azure disk MUST be shut down.

> [!IMPORTANT]
> Enabling Write Accelerator for Azure operating system disk of the VM will reboot the VM. 

Enabling Azure Write Accelerator for operating disks should not be necessary for SAP related VM configurations

### Restrictions when using Azure Write Accelerator
When using Azure Write Accelerator for an Azure disk/VHD, these restrictions apply:

- The Premium disk caching needs to be set to 'None'. All other caching modes are not supported.
- Snapshot on the Write Accelerator enabled disk is not supported yet. This restriction blocks Azure Backup Service ability to perform an application consistent snapshot of all disks of the virtual machine.


## Enabling Write Accelerator on a specific disk
The next few sections will describe how Azure Write Accelerator can be enabled on Azure Premium Storage VHDs.

At this point in time, enabling Write Accelerator through Azure Rest API and Power Shell are the only methods. Other methods up to support in Azure portal will follow in the course of the next few weeks.

### Prerequisites
The following prerequisites apply to the usage of Azure Write Accelerator at this point in time:

- Your subscription ID that was used to deploy VM and storage for the VM needs to be white-listed. Contact your Microsoft CSA, GBB, or Account Manager to get your subscription ID white-listed. 
- The disks you want to apply Azure Write Accelerator against need to be [Azure managed disks](https://azure.microsoft.com/services/managed-disks/).

### Enabling through Power Shell
The Azure Power Shell module from version 5.5.0 include the changes to the relevant cmdlets to enable or disable Azure Write Accelerator for specific Azure Premium Storage disks.
In order to enable or deploy disks supported by Write Accelerator, the following Power Shell commands got changed, and extended to accept a parameter for Write Accelerator.

A new switch parameter, "WriteAccelerator" got added to the following cmdlets: 

- Set-AzureRmVMOsDisk
- Add-AzureRmVMDataDisk
- Set-AzureRmVMDataDisk
- Add-AzureRmVmssDataDisk

Not giving the parameter sets the property to false and will deploy disks that have no support by Azure Write Accelerator.

A new switch parameter, "OsDiskWriteAccelerator" was added to the following cmdlets: 

- Set-AzureRmVmssStorageProfile

Not giving the sets the property to false and will deliver disks that do not leverage Azure Write Accelerator.

A new optional Boolean (non-nullable) parameter, "OsDiskWriteAccelerator" got added to the following cmdlets: 

- Update-AzureRmVM
- Update-AzureRmVmss

Specify either $true or $false to control support of Azure Write Accelerator with the disks.

Examples of commands could look like:

```

New-AzureRmVMConfig | Set-AzureRmVMOsDisk | Add-AzureRmVMDataDisk -Name "datadisk1" | Add-AzureRmVMDataDisk -Name "logdisk1" -WriteAccelerator | New-AzureRmVM

Get-AzureRmVM | Update-AzureRmVM -OsDiskWriteAccelerator $true

New-AzureRmVmssConfig | Set-AzureRmVmssStorageProfile -OsDiskWriteAccelerator | Add-AzureRmVmssDataDisk -Name "datadisk1" -WriteAccelerator:$false | Add-AzureRmVmssDataDisk -Name "logdisk1" -WriteAccelerator | New-AzureRmVmss

Get-AzureRmVmss | Update-AzureRmVmss -OsDiskWriteAccelerator:$false 

```

Two main scenarios can be scripted as shown in the following sections.

#### Adding  new disk supported by Azure Write Accelerator
You can use this script to add a new disk to your VM. The disk created with this script is going to use Azure Write Accelerator.

```

# Specify your VM Name
$vmName="mysapVM"
#Specify your Resource Group
$rgName = "mysap"
#data disk name
$datadiskname = "log001"
#LUN Id
$lunid=8
#size
$size=1023
#Pulls the VM info for later
$vm=Get-AzurermVM -ResourceGroupName $rgname -Name $vmname
#add a new VM data disk
Add-AzureRmVMDataDisk -CreateOption empty -DiskSizeInGB $size -Name $vmname-$datadiskname -VM $vm -Caching None -WriteAccelerator:$true -lun $lunid
#Updates the VM with the disk config - does not require a reboot
Update-AzureRmVM -ResourceGroupName $rgname -VM $vm

```
You need to adapt the names of VM, disk, resource group, size of the disk and LunID of the disk for your specific deployment.


#### Enabling Azure Write Accelerator on an existing Azure disk
If you need to enable Write Accelerator on an existing disk, you can use this script to perform the task:

```

#Specify your VM Name
$vmName="mysapVM"
#Specify your Resource Group
$rgName = "mysap"
#data disk name
$datadiskname = "testsap-log001" 
#new Write Accelerator status ($true for enabled, $false for disabled) 
$newstatus = $true
#Pulls the VM info for later
$vm=Get-AzurermVM -ResourceGroupName $rgname -Name $vmname
#add a new VM data disk
Set-AzureRmVMDataDisk -VM $vm -Name $datadiskname -Caching None -WriteAccelerator:$newstatus
#Updates the VM with the disk config - does not require a reboot
Update-AzureRmVM -ResourceGroupName $rgname -VM $vm

```

You need to adapt the names of VM, disk, and resource group. The script above adds Write Accelerator to an existing disk is the value for $newstatus is set to '$true'. Using the value '$false' will disable Write Accelerator on a given disk.

> [!Note]
> Executing the script above will detach the disk specified, enable Write Accelerator against the disk, and then attach the disk again




### Enabling through Rest APIs
In order to deploy through Azure Rest API, you need to install the Azure armclient

#### Install armclient

To run armclient, you need to install it through Chocolatey. You can install it through cmd.exe or powershell. Use elevated rights for these commands (“Run as Administrator”).

Using cmd.exe run the following command:

```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

Using Power Shell you have to use:

```
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

Now you can install the armclient with the command below in cmd.exe or Power Shell

```
choco install armclient
```

#### Getting your current VM configuration
In order to change the attributes of your disk configuration, you first need to get the current configuration in a JSON file. You can get the current configuration by executing the following command:

```
armclient GET /subscriptions/<<subscription-ID<</resourceGroups/<<ResourceGroup>>/providers/Microsoft.Compute/virtualMachines/<<virtualmachinename>>?api-version=2017-12-01 > <<filename.json>>
```
Replace the terms within '<<   >>' with your data, including the file name the JSON file should have.

The output could look like:

```
{
  "properties": {
    "vmId": "2444c93e-f8bb-4a20-af2d-1658d9dbbbcb",
    "hardwareProfile": {
      "vmSize": "Standard_M64s"
    },
    "storageProfile": {
      "imageReference": {
        "publisher": "SUSE",
        "offer": "SLES-SAP",
        "sku": "12-SP3",
        "version": "latest"
      },
      "osDisk": {
        "osType": "Linux",
        "name": "mylittlesap_OsDisk_1_754a1b8bb390468e9b4c429b81cc5f5a",
        "createOption": "FromImage",
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Premium_LRS",
          "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/mylittlesap_OsDisk_1_754a1b8bb390468e9b4c429b81cc5f5a"
        },
        "diskSizeGB": 30
      },
      "dataDisks": [
        {
          "lun": 0,
          "name": "data1",
          "createOption": "Attach",
          "caching": "None",
          "managedDisk": {
            "storageAccountType": "Premium_LRS",
            "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/data1"
          },
          "diskSizeGB": 1023
        },
        {
          "lun": 1,
          "name": "log1",
          "createOption": "Attach",
          "caching": "None",
          "managedDisk": {
            "storageAccountType": "Premium_LRS",
            "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/data2"
          },
          "diskSizeGB": 1023
        }
      ]
    },
    "osProfile": {
      "computerName": "mylittlesapVM",
      "adminUsername": "pl",
      "linuxConfiguration": {
        "disablePasswordAuthentication": false
      },
      "secrets": []
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Network/networkInterfaces/mylittlesap518"
        }
      ]
    },
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "enabled": true,
        "storageUri": "https://mylittlesapdiag895.blob.core.windows.net/"
      }
    },
    "provisioningState": "Succeeded"
  },
  "type": "Microsoft.Compute/virtualMachines",
  "location": "westeurope",
  "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/virtualMachines/mylittlesapVM",
  "name": "mylittlesapVM"

```

Next step is to update the JSON file and to enable Write Accelerator on the disk called 'log1'. this can be done by adding this attribute into the JSON file after the cache entry of the disk. 

```
        {
          "lun": 1,
          "name": "log1",
          "createOption": "Attach",
          "caching": "None",
		  **"writeAcceleratorEnabled": true,**
          "managedDisk": {
            "storageAccountType": "Premium_LRS",
            "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/data2"
          },
          "diskSizeGB": 1023
        }
```

Then update the existing deployment with this command:

```
armclient PUT /subscriptions/<<subscription-ID<</resourceGroups/<<ResourceGroup>>/providers/Microsoft.Compute/virtualMachines/<<virtualmachinename>>?api-version=2017-12-01 @<<filename.json>>

```

The output should look like the one below. You can see that there is Write Accelerator enabled for one disk.

```
{
  "properties": {
    "vmId": "2444c93e-f8bb-4a20-af2d-1658d9dbbbcb",
    "hardwareProfile": {
      "vmSize": "Standard_M64s"
    },
    "storageProfile": {
      "imageReference": {
        "publisher": "SUSE",
        "offer": "SLES-SAP",
        "sku": "12-SP3",
        "version": "latest"
      },
      "osDisk": {
        "osType": "Linux",
        "name": "mylittlesap_OsDisk_1_754a1b8bb390468e9b4c429b81cc5f5a",
        "createOption": "FromImage",
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Premium_LRS",
          "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/mylittlesap_OsDisk_1_754a1b8bb390468e9b4c429b81cc5f5a"
        },
        "diskSizeGB": 30
      },
      "dataDisks": [
        {
          "lun": 0,
          "name": "data1",
          "createOption": "Attach",
          "caching": "None",
          "managedDisk": {
            "storageAccountType": "Premium_LRS",
            "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/data1"
          },
          "diskSizeGB": 1023
        },
        {
          "lun": 1,
          "name": "log1",
          "createOption": "Attach",
          "caching": "None",
          **"writeAcceleratorEnabled": true,**
          "managedDisk": {
            "storageAccountType": "Premium_LRS",
            "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/disks/data2"
          },
          "diskSizeGB": 1023
        }
      ]
    },
    "osProfile": {
      "computerName": "mylittlesapVM",
      "adminUsername": "pl",
      "linuxConfiguration": {
        "disablePasswordAuthentication": false
      },
      "secrets": []
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Network/networkInterfaces/mylittlesap518"
        }
      ]
    },
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "enabled": true,
        "storageUri": "https://mylittlesapdiag895.blob.core.windows.net/"
      }
    },
    "provisioningState": "Succeeded"
  },
  "type": "Microsoft.Compute/virtualMachines",
  "location": "westeurope",
  "id": "/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/mylittlesap/providers/Microsoft.Compute/virtualMachines/mylittlesapVM",
  "name": "mylittlesapVM"

```

From the point of the change on, the drive should be supported by Write Accelerator.

 