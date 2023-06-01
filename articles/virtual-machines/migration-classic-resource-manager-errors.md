---
title: Common errors during Classic to Azure Resource Manager migration 
description: This article catalogs the most common errors and mitigations during the migration of IaaS resources from Azure Service Management to Azure Resource Manager.
author: tanmaygore
manager: vashan
ms.service: virtual-machines
ms.subservice: classic-to-arm-migration
ms.workload: infrastructure-services
ms.topic: troubleshooting
ms.date: 03/08/2023
ms.author: tagore 
ms.custom: compute-evergreen, devx-track-arm-template
---

# Errors that commonly occur during Classic to Azure Resource Manager migration

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

> [!IMPORTANT]
> Today, about 90% of IaaS VMs are using [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/). As of February 28, 2020, classic VMs have been deprecated and will be fully retired on September 1, 2023. [Learn more]( https://aka.ms/classicvmretirement) about this deprecation and [how it affects you](classic-vm-deprecation.md#how-does-this-affect-me).

This article catalogs the most common errors and mitigations during the migration of IaaS resources from Azure classic deployment model to the Azure Resource Manager stack.


## List of errors

| Error string | Mitigation |
| --- | --- |
| Internal server error |In some cases, this is a transient error that goes away with a retry. If it continues to persist, [contact Azure support](../azure-portal/supportability/how-to-create-azure-support-request.md) as it needs investigation of platform logs. <br><br> **NOTE:** Once the incident is tracked by the support team, don't attempt any self-mitigation as this might have unintended consequences on your environment. |
| Migration isn't supported for Deployment {deployment-name}  in HostedService {hosted-service-name} because it's a PaaS deployment (Web/Worker). |This happens when a deployment contains a web/worker role. Since migration is only supported for Virtual Machines, remove the web/worker role from the deployment and try migration again. |
| Template {template-name} deployment failed. CorrelationId={guid} |In the backend of migration service, we use Azure Resource Manager templates to create resources in the Azure Resource Manager stack. Since templates are idempotent, usually you can safely retry the migration operation to get past this error. If this error continues to persist, [contact Azure support](../azure-portal/supportability/how-to-create-azure-support-request.md) and give them the CorrelationId. <br><br> **NOTE:** Once the incident is tracked by the support team, don't attempt any self-mitigation as this might have unintended consequences on your environment. |
| The virtual network {virtual-network-name} doesn't exist. |This can happen if you created the Virtual Network in the new Azure portal. The actual Virtual Network name follows the pattern "Group * \<VNET name>" |
| VM {vm-name} in HostedService {hosted-service-name} contains Extension {extension-name} which isn't supported in Azure Resource Manager. It's recommended to uninstall it from the VM before continuing with migration. |XML extensions such as BGInfo 1.\* aren't supported in Azure Resource Manager. Therefore, these extensions can't be migrated. If these extensions are left installed on the virtual machine, they're automatically uninstalled before completing the migration. |
| VM {vm-name} in HostedService {hosted-service-name} contains Extension VMSnapshot/VMSnapshotLinux, which is currently not supported for Migration. Uninstall it from the VM and add it back using Azure Resource Manager after the Migration is Complete |This is the scenario where the virtual machine is configured for Azure Backup. Since this is currently an unsupported scenario, follow the workaround at https://aka.ms/vmbackupmigration |
| VM {vm-name} in HostedService {hosted-service-name} contains Extension {extension-name} whose Status isn't being reported from the VM. Hence, this VM can't be migrated. Ensure that the Extension status is being reported or uninstall the extension from the VM and retry migration. <br><br> VM {vm-name} in HostedService {hosted-service-name} contains Extension {extension-name} reporting Handler Status: {handler-status}. Hence, the VM can't be migrated. Ensure that the Extension handler status being reported is {handler-status} or uninstall it from the VM and retry migration. <br><br> VM Agent for VM {vm-name} in HostedService {hosted-service-name} is reporting the overall agent status as Not Ready. Hence, the VM may not be migrated, if it has a migratable extension. Ensure that the VM Agent is reporting overall agent status as Ready. Refer to https://aka.ms/classiciaasmigrationfaqs. |Azure guest agent & VM Extensions need outbound internet access to the VM storage account to populate their status. Common causes of status failure include <li> a Network Security Group that blocks outbound access to the internet <li> If the VNET has on premises DNS servers and DNS connectivity is lost <br><br> If you continue to see an unsupported status, you can uninstall the extensions to skip this check and move forward with migration. |
| Migration isn't supported for Deployment {deployment-name} in HostedService {hosted-service-name} because it has multiple Availabilities Sets. |Currently, only hosted services that have 1 or less Availability sets can be migrated. To work around this problem, move the additional availability sets, and Virtual machines in those availability sets, to a different hosted service. |
| Migration isn't supported for Deployment {deployment-name} in HostedService {hosted-service-name because it has VMs that are not part of the Availability Set even though the HostedService contains one. |The workaround for this scenario is to either move all the virtual machines into a single Availability set or remove all Virtual machines from the Availability set in the hosted service. |
| Storage account/HostedService/Virtual Network {virtual-network-name} is in the process of being migrated and hence cannot be changed |This error happens when the "Prepare" migration operation has been completed on the resource and an operation that would make a change to the resource is triggered. Because of the lock on the management plane after "Prepare" operation, any changes to the resource are blocked. To unlock the management plane, you can run the "Commit" migration operation to complete migration or the "Abort" migration operation to roll back the "Prepare" operation. |
| Migration isn't allowed for HostedService {hosted-service-name} because it has VM {vm-name} in State: RoleStateUnknown. Migration is allowed only when the VM is in one of the following states - Running, Stopped, Stopped Deallocated. |The VM might be undergoing through a state transition, which usually happens when during an update operation on the HostedService such as a reboot, extension installation etc. It is recommended for the update operation to complete on the HostedService before trying migration. |
| Deployment {deployment-name} in HostedService {hosted-service-name} contains a VM {vm-name} with Data Disk {data-disk-name} whose physical blob size {size-of-the-vhd-blob-backing-the-data-disk} bytes doesn't match the VM Data Disk logical size {size-of-the-data-disk-specified-in-the-vm-api} bytes. Migration will proceed without specifying a size for the data disk for the Azure Resource Manager VM. | This error happens if you've resized the VHD blob without updating the size in the VM API model. Detailed mitigation steps are outlined [below](#vm-with-data-disk-whose-physical-blob-size-bytes-does-not-match-the-vm-data-disk-logical-size-bytes).|
| A storage exception occurred while validating data disk {data disk name} with media link {data disk Uri} for VM {VM name} in Cloud Service {Cloud Service name}. Ensure that the VHD media link is accessible for this virtual machine | This error can happen if the disks of the VM have been deleted or are not accessible anymore. Make sure the disks for the VM exist.|
| VM {vm-name} in HostedService {cloud-service-name} contains Disk with MediaLink {vhd-uri} which has blob name {vhd-blob-name}  that isn't supported in Azure Resource Manager. | This error occurs when the name of the blob has a "/" in it which isn't supported in Compute Resource Provider currently. |
| Migration isn't allowed for Deployment {deployment-name} in HostedService {cloud-service-name} as it isn't in the regional scope. Refer to https:\//aka.ms/regionalscope for moving this deployment to regional scope. | In 2014, Azure announced that networking resources will move from a cluster level scope to regional scope. See [https://aka.ms/regionalscope](https://aka.ms/regionalscope) for more details. This error happens when the deployment being migrated has not had an update operation, which automatically moves it to a regional scope. The best work-around is to either add an endpoint to a VM, or a data disk to the VM, and then retry migration. <br> See [How to set up endpoints on a classic virtual machine in Azure](/previous-versions/azure/virtual-machines/windows/classic/setup-endpoints#create-an-endpoint) or [Attach a data disk to a virtual machine created with the classic deployment model](./linux/attach-disk-portal.md)|
| Migration isn't supported for Virtual Network {vnet-name} because it has non-gateway PaaS deployments. | This error occurs when you have non-gateway PaaS deployments such as Application Gateway or API Management services that are connected to the Virtual Network.|
| Management operations on VM are disallowed because migration is in progress| This error occurs because the VM is in Prepare state and therefore locked for any update/delete operation. Call Abort using PS/CLI on the VM to roll back the migration and unlock the VM for update/delete operations. Calling commit will also unlock the VM but will commit the migration to ARM.| 


## Detailed mitigations

### VM with Data Disk whose physical blob size bytes does not match the VM Data Disk logical size bytes.

This happens when the Data disk logical size can get out of sync with the actual VHD blob size. This can be easily verified using the following commands:

#### Verifying the issue

```powershell
# Store the VM details in the VM object
$vm = Get-AzureVM -ServiceName $servicename -Name $vmname

# Display the data disk properties
# NOTE the data disk LogicalDiskSizeInGB below which is 11GB. Also note the MediaLink Uri of the VHD blob as we'll use this in the next step
$vm.VM.DataVirtualHardDisks


HostCaching         : None
DiskLabel           : 
DiskName            : coreosvm-coreosvm-0-201611230636240687
Lun                 : 0
LogicalDiskSizeInGB : 11
MediaLink           : https://contosostorage.blob.core.windows.net/vhds/coreosvm-dd1.vhd
SourceMediaLink     : 
IOType              : Standard
ExtensionData       : 

# Now get the properties of the blob backing the data disk above
# NOTE the size of the blob is about 15 GB which is different from LogicalDiskSizeInGB above
$blob = Get-AzStorageblob -Blob "coreosvm-dd1.vhd" -Container vhds 

$blob

ICloudBlob        : Microsoft.WindowsAzure.Storage.Blob.CloudPageBlob
BlobType          : PageBlob
Length            : 16106127872
ContentType       : application/octet-stream
LastModified      : 11/23/2016 7:16:22 AM +00:00
SnapshotTime      : 
ContinuationToken : 
Context           : Microsoft.WindowsAzure.Commands.Common.Storage.AzureStorageContext
Name              : coreosvm-dd1.vhd
```

#### Mitigating the issue

```powershell
# Convert the blob size in bytes to GB into a variable which we'll use later
$newSize = [int]($blob.Length / 1GB)

# See the calculated size in GB
$newSize

15

# Store the disk name of the data disk as we'll use this to identify the disk to be updated
$diskName = $vm.VM.DataVirtualHardDisks[0].DiskName

# Identify the LUN of the data disk to remove
$lunToRemove = $vm.VM.DataVirtualHardDisks[0].Lun

# Now remove the data disk from the VM so that the disk isn't leased by the VM and it's size can be updated
Remove-AzureDataDisk -LUN $lunToRemove -VM $vm | Update-AzureVm -Name $vmname -ServiceName $servicename

OperationDescription OperationId                          OperationStatus
-------------------- -----------                          ---------------
Update-AzureVM       213xx1-b44b-1v6n-23gg-591f2a13cd16   Succeeded  

# Verify we have the right disk that's going to be updated
Get-AzureDisk -DiskName $diskName

AffinityGroup        : 
AttachedTo           : 
IsCorrupted          : False
Label                : 
Location             : East US
DiskSizeInGB         : 11
MediaLink            : https://contosostorage.blob.core.windows.net/vhds/coreosvm-dd1.vhd
DiskName             : coreosvm-coreosvm-0-201611230636240687
SourceImageName      : 
OS                   : 
IOType               : Standard
OperationDescription : Get-AzureDisk
OperationId          : 0c56a2b7-a325-123b-7043-74c27d5a61fd
OperationStatus      : Succeeded

# Now update the disk to the new size
Update-AzureDisk -DiskName $diskName -ResizedSizeInGB $newSize -Label $diskName

OperationDescription OperationId                          OperationStatus
-------------------- -----------                          ---------------
Update-AzureDisk     cv134b65-1b6n-8908-abuo-ce9e395ac3e7 Succeeded 

# Now verify that the "DiskSizeInGB" property of the disk matches the size of the blob 
Get-AzureDisk -DiskName $diskName


AffinityGroup        : 
AttachedTo           : 
IsCorrupted          : False
Label                : coreosvm-coreosvm-0-201611230636240687
Location             : East US
DiskSizeInGB         : 15
MediaLink            : https://contosostorage.blob.core.windows.net/vhds/coreosvm-dd1.vhd
DiskName             : coreosvm-coreosvm-0-201611230636240687
SourceImageName      : 
OS                   : 
IOType               : Standard
OperationDescription : Get-AzureDisk
OperationId          : 1v53bde5-cv56-5621-9078-16b9c8a0bad2
OperationStatus      : Succeeded

# Now we'll add the disk back to the VM as a data disk. First we need to get an updated VM object
$vm = Get-AzureVM -ServiceName $servicename -Name $vmname

Add-AzureDataDisk -Import -DiskName $diskName -LUN 0 -VM $vm -HostCaching ReadWrite | Update-AzureVm -Name $vmname -ServiceName $servicename

OperationDescription OperationId                          OperationStatus
-------------------- -----------                          ---------------
Update-AzureVM       b0ad3d4c-4v68-45vb-xxc1-134fd010d0f8 Succeeded      
```

### Moving a VM to a different subscription after completing migration

After you complete the migration process, you may want to move the VM to another subscription. However, if you have a secret/certificate on the VM that references a Key Vault resource, the move is currently not supported. The below instructions will allow you to work around the issue. 

#### PowerShell

```powershell
$vm = Get-AzVM -ResourceGroupName "MyRG" -Name "MyVM"
Remove-AzVMSecret -VM $vm
Update-AzVM -ResourceGroupName "MyRG" -VM $vm
```

#### Azure CLI

```azurecli
az vm update -g "myrg" -n "myvm" --set osProfile.Secrets=[]
```


## Next steps

* [Overview of platform-supported migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-overview.md)
* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](migration-classic-resource-manager-deep-dive.md)
* [Planning for migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-plan.md)
* [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-ps.md)
* [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-cli.md)
* [Community tools for assisting with migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-community-tools.md)
* [Review the most frequently asked questions about migrating IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-faq.yml)
