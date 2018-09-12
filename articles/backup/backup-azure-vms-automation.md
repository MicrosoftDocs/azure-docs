---
title: Deploy and manage backups for Resource Manager-deployed VMs using PowerShell
description: Use PowerShell to deploy and manage backups in Azure for Resource Manager-deployed VMs
services: backup
author: markgalioto
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 9/10/2018
ms.author: markgal
ms.custom: H1Hack27Feb2017
---
# Use PowerShell to back up and restore virtual machines

This article shows how to use Azure PowerShell cmdlets to back up and recover an Azure virtual machine (VM) from a Recovery Services vault. A Recovery Services vault is an Azure Resource Manager resource used to protect data and assets in Azure Backup and Azure Site Recovery services. 

> [!NOTE]
> Azure has two deployment models for creating and working with resources: [Resource Manager and Classic](../azure-resource-manager/resource-manager-deployment-model.md). This article is for use with VMs created using the Resource Manager model.
>
>

This article walks you through using PowerShell to protect a VM, and restore data from a recovery point.

## Concepts
If you are not familiar with the Azure Backup service, for an overview of the service, see the article, [What is Azure Backup?](backup-introduction-to-azure-backup.md) Before you start, ensure that you cover the prerequisites needed with Azure Backup, and the limitations of the current VM backup solution.

To use PowerShell effectively, it is necessary to understand the hierarchy of objects and from where to start.

![Recovery Services object hierarchy](./media/backup-azure-vms-arm-automation/recovery-services-object-hierarchy.png)

To view the AzureRm.RecoveryServices.Backup PowerShell cmdlet reference, see the [Azure Backup - Recovery Services Cmdlets](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup) in the Azure library.

## Setup and Registration

To begin:

1. [Download the latest version of PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) (the minimum version required is: 1.4.0)

2. Find the Azure Backup PowerShell cmdlets available by typing the following command:
   
    ```powershell
    Get-Command *azurermrecoveryservices*
    ```    
    The aliases and cmdlets for Azure Backup, Azure Site Recovery, and the Recovery Services vault appear. The following image is an example of what you'll see. It is not the complete list of cmdlets.

    ![list of Recovery Services](./media/backup-azure-vms-automation/list-of-recoveryservices-ps.png)

3. Sign in to your Azure account using **Connect-AzureRmAccount**. This cmdlet brings up a web page prompts you for your account credentials:

    * Alternately, you can include your account credentials as a parameter in the **Connect-AzureRmAccount** cmdlet, using the **-Credential** parameter.
    * If you are CSP partner working on behalf of a tenant, specify the customer as a tenant, by using their tenantID or tenant primary domain name. For example: **Connect-AzureRmAccount -Tenant "fabrikam.com"**

4. Associate the subscription you want to use with the account, since an account can have several subscriptions:

    ```powershell
    Select-AzureRmSubscription -SubscriptionName $SubscriptionName
    ```

5. If you are using Azure Backup for the first time, you must use the **[Register-AzureRmResourceProvider](http://docs.microsoft.com/powershell/module/azurerm.resources/register-azurermresourceprovider)** cmdlet to register the Azure Recovery Service provider with your subscription.

    ```powershell
    Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```

6. You can verify that the Providers registered successfully, using the following commands:
    ```powershell
    Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ``` 
    In the command output, the **RegistrationState** should change to **Registered**. If not, just run the **[Register-AzureRmResourceProvider](http://docs.microsoft.com/powershell/module/azurerm.resources/register-azurermresourceprovider)** cmdlet again.

The following tasks can be automated with PowerShell:

* [Create a Recovery Services vault](backup-azure-vms-automation.md#create-a-recovery-services-vault)
* [Back up Azure VMs](backup-azure-vms-automation.md#back-up-azure-vms)
* [Trigger a backup job](backup-azure-vms-automation.md#trigger-a-backup-job)
* [Monitor a backup job](backup-azure-vms-automation.md#monitoring-a-backup-job)
* [Restore an Azure VM](backup-azure-vms-automation.md#restore-an-azure-vm)

## Create a Recovery Services vault

The following steps lead you through creating a Recovery Services vault. A Recovery Services vault is different than a Backup vault.

1. The Recovery Services vault is a Resource Manager resource, so you need to place it within a resource group. You can use an existing resource group, or create a resource group with the **[New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup)** cmdlet. When creating a resource group, specify the name and location for the resource group.  

    ```powershell
    New-AzureRmResourceGroup -Name "test-rg" -Location "West US"
    ```
2. Use the **[New-AzureRmRecoveryServicesVault](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/new-azurermrecoveryservicesvault)** cmdlet to create the Recovery Services vault. Be sure to specify the same location for the vault as was used for the resource group.

    ```powershell
    New-AzureRmRecoveryServicesVault -Name "testvault" -ResourceGroupName "test-rg" -Location "West US"
    ```
3. Specify the type of storage redundancy to use; you can use [Locally Redundant Storage (LRS)](../storage/common/storage-redundancy-lrs.md) or [Geo Redundant Storage (GRS)](../storage/common/storage-redundancy-grs.md). The following example shows the -BackupStorageRedundancy option for testvault is set to GeoRedundant.

    ```powershell
    $vault1 = Get-AzureRmRecoveryServicesVault -Name "testvault"
    Set-AzureRmRecoveryServicesBackupProperties  -Vault $vault1 -BackupStorageRedundancy GeoRedundant
    ```

   > [!TIP]
   > Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it is convenient to store the Backup Recovery Services vault object in a variable.
   >
   >

## View the vaults in a subscription

To view all vaults in the subscription, use **[Get-AzureRmRecoveryServicesVault](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/get-azurermrecoveryservicesvault)**:

```powershell
Get-AzureRmRecoveryServicesVault
```

The output is similar to the following example, notice the associated ResourceGroupName and Location are provided.

```
Name              : Contoso-vault
ID                : /subscriptions/1234
Type              : Microsoft.RecoveryServices/vaults
Location          : WestUS
ResourceGroupName : Contoso-docs-rg
SubscriptionId    : 1234-567f-8910-abc
Properties        : Microsoft.Azure.Commands.RecoveryServices.ARSVaultProperties
```


## Back up Azure VMs

Use a Recovery Services vault to protect your virtual machines. Before you apply the protection, set the vault context (the type of data protected in the vault), and verify the protection policy. The protection policy is the schedule when the backup jobs run, and how long each backup snapshot is retained.

### Set vault context

Before enabling protection on a VM, use **[Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext)** to set the vault context. Once the vault context is set, it applies to all subsequent cmdlets. The following example sets the vault context for the vault, *testvault*.

```powershell
Get-AzureRmRecoveryServicesVault -Name "testvault" | Set-AzureRmRecoveryServicesVaultContext
```

### Create a protection policy

When you create a Recovery Services vault, it comes with default protection and retention policies. The default protection policy triggers a backup job each day at a specified time. The default retention policy retains the daily recovery point for 30 days. You can use the default policy to quickly protect your VM and edit the policy later with different details.

Use **[Get-AzureRmRecoveryServicesBackupProtectionPolicy](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupprotectionpolicy)** to view the protection policies available in the vault. You can use this cmdlet to get a specific policy, or to view the policies associated with a workload type. The following example gets policies for workload type, AzureVM.

```powershell
Get-AzureRmRecoveryServicesBackupProtectionPolicy -WorkloadType "AzureVM"
```

The output is similar to the following example:

```
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
DefaultPolicy        AzureVM            AzureVM              4/14/2016 5:00:00 PM
```

> [!NOTE]
> The timezone of the BackupTime field in PowerShell is UTC. However, when the backup time is shown in the Azure portal, the time is adjusted to your local timezone.
>
>

A backup protection policy is associated with at least one retention policy. Retention policy defines how long a recovery point is kept before it is deleted. Use **[Get-AzureRmRecoveryServicesBackupRetentionPolicyObject](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupretentionpolicyobject)** to view the default retention policy.  Similarly you can use **[Get-AzureRmRecoveryServicesBackupSchedulePolicyObject](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupschedulepolicyobject)** to obtain the default schedule policy. The **[New-AzureRmRecoveryServicesBackupProtectionPolicy](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/new-azurermrecoveryservicesbackupprotectionpolicy)** cmdlet creates a PowerShell object that holds backup policy information. The schedule and retention policy objects are used as inputs to the **[New-AzureRmRecoveryServicesBackupProtectionPolicy](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/new-azurermrecoveryservicesbackupprotectionpolicy)** cmdlet. The following example stores the schedule policy and the retention policy in variables. The example uses those variables to define the parameters when creating a protection policy, *NewPolicy*.

```powershell
$schPol = Get-AzureRmRecoveryServicesBackupSchedulePolicyObject -WorkloadType "AzureVM"
$retPol = Get-AzureRmRecoveryServicesBackupRetentionPolicyObject -WorkloadType "AzureVM"
New-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy" -WorkloadType "AzureVM" -RetentionPolicy $retPol -SchedulePolicy $schPol
```

The output is similar to the following example:

```
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
NewPolicy           AzureVM            AzureVM              4/24/2016 1:30:00 AM
```

### Enable protection

Once you've defined the protection policy, you still must enable the policy for an item. Use **[Enable-AzureRmRecoveryServicesBackupProtection](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/enable-azurermrecoveryservicesbackupprotection)** to enable protection. Enabling protection requires two objects - the item and the policy. Once the policy has been associated with the vault, the backup workflow is triggered at the time defined in the policy schedule.

The following examples enable protection for the item, V2VM, using the policy, NewPolicy. The examples differ based on whether the VM is encrypted, and what type of encryption. 

To enable the protection on **non-encrypted Resource Manager VMs**:

```powershell
$pol = Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
Enable-AzureRmRecoveryServicesBackupProtection -Policy $pol -Name "V2VM" -ResourceGroupName "RGName1"
```

To enable the protection on **encrypted VMs (encrypted using BEK and KEK)**, you must give the Azure Backup service permission to read keys and secrets from the key vault.

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName "KeyVaultName" -ResourceGroupName "RGNameOfKeyVault" -PermissionsToKeys backup,get,list -PermissionsToSecrets get,list -ServicePrincipalName 262044b1-e2ce-469f-a196-69ab7ada62d3
$pol = Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
Enable-AzureRmRecoveryServicesBackupProtection -Policy $pol -Name "V2VM" -ResourceGroupName "RGName1"
```

To enable the protection on **encrypted VMs (encrypted using BEK only)**, you must give the Azure Backup service permission to read secrets from the key vault.

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName "KeyVaultName" -ResourceGroupName "RGNameOfKeyVault" -PermissionsToSecrets backup,get,list -ServicePrincipalName 262044b1-e2ce-469f-a196-69ab7ada62d3
$pol = Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
Enable-AzureRmRecoveryServicesBackupProtection -Policy $pol -Name "V2VM" -ResourceGroupName "RGName1"
```

> [!NOTE]
> If you are using the Azure Government cloud, then use the value ff281ffe-705c-4f53-9f37-a40e6f2c68f3 for the parameter **-ServicePrincipalName** in [Set-AzureRmKeyVaultAccessPolicy](https://docs.microsoft.com/powershell/module/azurerm.keyvault/set-azurermkeyvaultaccesspolicy) cmdlet.
>
>

To enable protection on a classic VM:

```powershell
$pol = Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
Enable-AzureRmRecoveryServicesBackupProtection -Policy $pol -Name "V1VM" -ServiceName "ServiceName1"
```

### Modify a protection policy

To modify the protection policy, use [Set-AzureRmRecoveryServicesBackupProtectionPolicy](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/set-azurermrecoveryservicesbackupprotectionpolicy) to modify the SchedulePolicy or RetentionPolicy objects.

The following example changes the recovery point retention to 365 days.

```powershell
$retPol = Get-AzureRmRecoveryServicesBackupRetentionPolicyObject -WorkloadType "AzureVM"
$retPol.DailySchedule.DurationCountInDays = 365
$pol = Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
Set-AzureRmRecoveryServicesBackupProtectionPolicy -Policy $pol  -RetentionPolicy $RetPol
```

## Trigger a backup

Use **[Backup-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/backup-azurermrecoveryservicesbackupitem)** to trigger a backup job. If it's the initial backup, it is a full backup. Subsequent backups take an incremental copy. Be sure to use **[Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext)** to set the vault context before triggering the backup job. The following example assumes the vault context was already set.

```powershell
$namedContainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType "AzureVM" -Status "Registered" -FriendlyName "V2VM"
$item = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer -WorkloadType "AzureVM"
$job = Backup-AzureRmRecoveryServicesBackupItem -Item $item
```

The output is similar to the following example:

```
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   ----------
V2VM              Backup              InProgress          4/23/2016                  5:00:30 PM                cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
```

> [!NOTE]
> The timezone of the StartTime and EndTime fields in PowerShell is UTC. However, when the time is shown in the Azure portal, the time is adjusted to your local timezone.
>
>

## Monitoring a backup job

You can monitor long-running operations, such as backup jobs, without using the Azure portal. To get the status of an in-progress job, use the **[Get-AzureRmRecoveryservicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupjob)** cmdlet. This cmdlet gets the backup jobs for a specific vault, and that vault is specified in the vault context. The following example gets the status of an in-progress job as an array, and stores the status in the $joblist variable.

```powershell
$joblist = Get-AzureRmRecoveryservicesBackupJob –Status "InProgress"
$joblist[0]
```

The output is similar to the following example:

```
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   ----------
V2VM             Backup               InProgress            4/23/2016                5:00:30 PM                cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
```

Instead of polling these jobs for completion - which is unnecessary additional code - use the **[Wait-AzureRmRecoveryServicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/wait-azurermrecoveryservicesbackupjob)** cmdlet. This cmdlet pauses the execution until either the job completes or the specified timeout value is reached.

```powershell
Wait-AzureRmRecoveryServicesBackupJob -Job $joblist[0] -Timeout 43200
```

## Restore an Azure VM

There is an important difference between the restoring a VM using the Azure portal and restoring a VM using PowerShell. With PowerShell, the restore operation is complete once the disks and configuration information from the recovery point are created. The restore operation doesn't create the virtual machine. To create a virtual machine from disk, see the section, [Create the VM from restored disks](backup-azure-vms-automation.md#create-a-vm-from-restored-disks). If you don't want to restore the entire VM, but want to restore or recover a few files from an Azure VM backup, refer to the [file recovery section](backup-azure-vms-automation.md#restore-files-from-an-azure-vm-backup).

> [!Tip]
> The restore operation does not create the virtual machine.
>
>

The following graphic shows the object hierarchy from the RecoveryServicesVault down to the BackupRecoveryPoint.

![Recovery Services object hierarchy showing BackupContainer](./media/backup-azure-vms-arm-automation/backuprecoverypoint-only.png)

To restore backup data, identify the backed-up item and the recovery point that holds the point-in-time data. Use **[Restore-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/restore-azurermrecoveryservicesbackupitem)** to restore data from the vault to your account.

The basic steps to restore an Azure VM are:

* Select the VM.
* Choose a recovery point.
* Restore the disks.
* Create the VM from stored disks.

### Select the VM

To get the PowerShell object that identifies the right backup item, start from the container in the vault, and work your way down the object hierarchy. To select the container that represents the VM, use the **[Get-AzureRmRecoveryServicesBackupContainer](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupcontainer)** cmdlet and pipe that to the **[Get-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupitem)** cmdlet.

```powershell
$namedContainer = Get-AzureRmRecoveryServicesBackupContainer  -ContainerType "AzureVM" -Status "Registered" -FriendlyName "V2VM"
$backupitem = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer  -WorkloadType "AzureVM"
```

### Choose a recovery point

Use the **[Get-AzureRmRecoveryServicesBackupRecoveryPoint](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackuprecoverypoint)** cmdlet to list all recovery points for the backup item. Then choose the recovery point to restore. If you are unsure which recovery point to use, it is a good practice to choose the most recent RecoveryPointType = AppConsistent point in the list.

In the following script, the variable, **$rp**, is an array of recovery points for the selected backup item, from the past seven days. The array is sorted in reverse order of time with the latest recovery point at index 0. Use standard PowerShell array indexing to pick the recovery point. In the example, $rp[0] selects the latest recovery point.

```powershell
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date
$rp = Get-AzureRmRecoveryServicesBackupRecoveryPoint -Item $backupitem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
$rp[0]
```

The output is similar to the following example:

```
RecoveryPointAdditionalInfo :
SourceVMStorageType         : NormalStorage
Name                        : 15260861925810
ItemName                    : VM;iaasvmcontainer;RGName1;V2VM
RecoveryPointId             : /subscriptions/XX/resourceGroups/ RGName1/providers/Microsoft.RecoveryServices/vaults/testvault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainer;RGName1;V2VM/protectedItems/VM;iaasvmcontainer; RGName1;V2VM/recoveryPoints/15260861925810
RecoveryPointType           : AppConsistent
RecoveryPointTime           : 4/23/2016 5:02:04 PM
WorkloadType                : AzureVM
ContainerName               : IaasVMContainer;iaasvmcontainer; RGName1;V2VM
ContainerType               : AzureVM
BackupManagementType        : AzureVM
```

### Restore the disks

Use the **[Restore-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/restore-azurermrecoveryservicesbackupitem)** cmdlet to restore a backup item's data and configuration to a recovery point. Once you identify a recovery point, use it as the value for the **-RecoveryPoint** parameter. In the above sample, **$rp[0]** was the recovery point to use. In the following sample code, **$rp[0]** is the recovery point to use for restoring the disk.

To restore the disks and configuration information:

```powershell
$restorejob = Restore-AzureRmRecoveryServicesBackupItem -RecoveryPoint $rp[0] -StorageAccountName "DestAccount" -StorageAccountResourceGroupName "DestRG"
$restorejob
```
The output is similar to the following example:

```
WorkloadName     Operation          Status               StartTime                 EndTime            JobID
------------     ---------          ------               ---------                 -------          ----------
V2VM              Restore           InProgress           4/23/2016 5:00:30 PM                        cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
```

Use the **[Wait-AzureRmRecoveryServicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/wait-azurermrecoveryservicesbackupjob)** cmdlet to wait for the Restore job to complete.

```powershell
Wait-AzureRmRecoveryServicesBackupJob -Job $restorejob -Timeout 43200
```

Once the Restore job has completed, use the **[Get-AzureRmRecoveryServicesBackupJobDetails](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupjobdetails)** cmdlet to get the details of the restore operation. The JobDetails property has the information needed to rebuild the VM.

```powershell
$restorejob = Get-AzureRmRecoveryServicesBackupJob -Job $restorejob
$details = Get-AzureRmRecoveryServicesBackupJobDetails -Job $restorejob
```

Once you restore the disks, go to the next section to create the VM.

## Create a VM from restored disks

After you restore the disks, use the following steps to create and configure the virtual machine from disk.

> [!NOTE]
> To create encrypted VMs from restored disks, your Azure role must have permission to perform the action, **Microsoft.KeyVault/vaults/deploy/action**. If your role does not have this permission, create a custom role with this action. For more information, see [Custom Roles in Azure RBAC](../role-based-access-control/custom-roles.md).
>
>

1. Query the restored disk properties for the job details.

   ```powershell
   $properties = $details.properties
   $storageAccountName = $properties["Target Storage Account Name"]
   $containerName = $properties["Config Blob Container Name"]
   $configBlobName = $properties["Config Blob Name"]
   ```

2. Set the Azure storage context and restore the JSON configuration file.

   ```powershell
   Set-AzureRmCurrentStorageAccount -Name $storageaccountname -ResourceGroupName "testvault"
   $destination_path = "C:\vmconfig.json"
   Get-AzureStorageBlobContent -Container $containerName -Blob $configBlobName -Destination $destination_path
   $obj = ((Get-Content -Path $destination_path -Raw -Encoding Unicode)).TrimEnd([char]0x00) | ConvertFrom-Json
   ```

3. Use the JSON configuration file to create the VM configuration.

   ```powershell
   $vm = New-AzureRmVMConfig -VMSize $obj.'properties.hardwareProfile'.vmSize -VMName "testrestore"
   ```

4. Attach the OS disk and data disks. This step provides examples for various managed and encrypted VM configurations. Use the example that suits your VM configuration.

   * **Non-managed and non-encrypted VMs** - Use the following sample for non-managed, non-encrypted VMs.

       ```powershell
       Set-AzureRmVMOSDisk -VM $vm -Name "osdisk" -VhdUri $obj.'properties.StorageProfile'.osDisk.vhd.Uri -CreateOption "Attach"
       $vm.StorageProfile.OsDisk.OsType = $obj.'properties.StorageProfile'.OsDisk.OsType
       foreach($dd in $obj.'properties.StorageProfile'.DataDisks)
       {
        $vm = Add-AzureRmVMDataDisk -VM $vm -Name "datadisk1" -VhdUri $dd.vhd.Uri -DiskSizeInGB 127 -Lun $dd.Lun -CreateOption "Attach"
       }
       ```

   * **Non-managed and encrypted VMs (BEK only)** - For non-managed, encrypted VMs (encrypted using BEK only), you need to restore the secret to the key vault before you can attach disks. For more information, see the article, [Restore an encrypted virtual machine from an Azure Backup recovery point](backup-azure-restore-key-secret.md). The following sample shows how to attach OS and data disks for encrypted VMs. When setting the OS disk, make sure to mention the relevant OS type.

      ```powershell
      $dekUrl = "https://ContosoKeyVault.vault.azure.net:443/secrets/ContosoSecret007/xx000000xx0849999f3xx30000003163"
      $dekUrl = "/subscriptions/abcdedf007-4xyz-1a2b-0000-12a2b345675c/resourceGroups/ContosoRG108/providers/Microsoft.KeyVault/vaults/ContosoKeyVault"
      Set-AzureRmVMOSDisk -VM $vm -Name "osdisk" -VhdUri $obj.'properties.storageProfile'.osDisk.vhd.uri -DiskEncryptionKeyUrl $dekUrl -DiskEncryptionKeyVaultId $keyVaultId -CreateOption "Attach" -Windows/Linux
      $vm.StorageProfile.OsDisk.OsType = $obj.'properties.storageProfile'.osDisk.osType
      foreach($dd in $obj.'properties.storageProfile'.dataDisks)
      {
       $vm = Add-AzureRmVMDataDisk -VM $vm -Name "datadisk1" -VhdUri $dd.vhd.Uri -DiskSizeInGB 127 -Lun $dd.Lun -CreateOption "Attach"
      }
      ```
      Use the following command to manually enable encryption for the data disks.

      ```powershell
      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $RG -VMName $vm -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $dekUrl -DiskEncryptionKeyVaultId $dekUrl -VolumeType Data
      ```

   * **Non-managed and encrypted VMs (BEK and KEK)** - For non-managed, encrypted VMs (encrypted using BEK and KEK), restore the key and secret to the key vault before attaching the disks. For more information, see the article, [Restore an encrypted virtual machine from an Azure Backup recovery point](backup-azure-restore-key-secret.md). The following sample shows how to attach OS and data disks for encrypted VMs.

      ```powershell
      $dekUrl = "https://ContosoKeyVault.vault.azure.net:443/secrets/ContosoSecret007/xx000000xx0849999f3xx30000003163"
      $kekUrl = "https://ContosoKeyVault.vault.azure.net:443/keys/ContosoKey007/x9xxx00000x0000x9b9949999xx0x006"
      $keyVaultId = "/subscriptions/abcdedf007-4xyz-1a2b-0000-12a2b345675c/resourceGroups/ContosoRG108/providers/Microsoft.KeyVault/vaults/ContosoKeyVault"
      Set-AzureRmVMOSDisk -VM $vm -Name "osdisk" -VhdUri $obj.'properties.storageProfile'.osDisk.vhd.uri -DiskEncryptionKeyUrl $dekUrl -DiskEncryptionKeyVaultId $keyVaultId -KeyEncryptionKeyUrl $kekUrl -KeyEncryptionKeyVaultId $keyVaultId -CreateOption "Attach" -Windows
      $vm.StorageProfile.OsDisk.OsType = $obj.'properties.storageProfile'.osDisk.osType
      foreach($dd in $obj.'properties.storageProfile'.dataDisks)
       {
       $vm = Add-AzureRmVMDataDisk -VM $vm -Name "datadisk1" -VhdUri $dd.vhd.Uri -DiskSizeInGB 127 -Lun $dd.Lun -CreateOption "Attach"
       }
      ```

      Use the following command to manually enable encryption for the data disks.

      ```powershell
      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $RG -VMName $vm -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $dekUrl -DiskEncryptionKeyVaultId $dekUrl -KeyEncryptionKeyUrl $kekUrl -KeyEncryptionKeyVaultId $keyVaultId -VolumeType Data
      ```

   * **Managed and non-encrypted VMs** - For managed non-encrypted VMs, you'll need to create managed disks from blob storage, and then attach the disks. For in-depth information, see the article, [Attach a data disk to a Windows VM using PowerShell](../virtual-machines/windows/attach-disk-ps.md). The following sample code shows how to attach the data disks for managed non-encrypted VMs.

      ```powershell
      $storageType = "StandardLRS"
      $osDiskName = $vm.Name + "_osdisk"
      $osVhdUri = $obj.'properties.storageProfile'.osDisk.vhd.uri
      $diskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location "West US" -CreateOption Import -SourceUri $osVhdUri
      $osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk $diskConfig -ResourceGroupName "test"
      Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -CreateOption "Attach" -Windows
      foreach($dd in $obj.'properties.storageProfile'.dataDisks)
       {
       $dataDiskName = $vm.Name + $dd.name ;
       $dataVhdUri = $dd.vhd.uri ;
       $dataDiskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location "West US" -CreateOption Import -SourceUri $dataVhdUri ;
       $dataDisk2 = New-AzureRmDisk -DiskName $dataDiskName -Disk $dataDiskConfig -ResourceGroupName "test" ;
       Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -ManagedDiskId $dataDisk2.Id -Lun $dd.Lun -CreateOption "Attach"
       }
      ```

   * **Managed and encrypted VMs (BEK only)** - For managed encrypted VMs (encrypted using BEK only), you'll need to create managed disks from blob storage, and then attach the disks. For in-depth information, see the article, [Attach a data disk to a Windows VM using PowerShell](../virtual-machines/windows/attach-disk-ps.md). The following sample code shows how to attach the data disks for managed encrypted VMs.

      ```powershell
      $dekUrl = "https://ContosoKeyVault.vault.azure.net:443/secrets/ContosoSecret007/xx000000xx0849999f3xx30000003163"
      $keyVaultId = "/subscriptions/abcdedf007-4xyz-1a2b-0000-12a2b345675c/resourceGroups/ContosoRG108/providers/Microsoft.KeyVault/vaults/ContosoKeyVault"
      $storageType = "StandardLRS"
      $osDiskName = $vm.Name + "_osdisk"
      $osVhdUri = $obj.'properties.storageProfile'.osDisk.vhd.uri
      $diskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location "West US" -CreateOption Import -SourceUri $osVhdUri
      $osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk $diskConfig -ResourceGroupName "test"
      Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -DiskEncryptionKeyUrl $dekUrl -DiskEncryptionKeyVaultId $keyVaultId -CreateOption "Attach" -Windows
      foreach($dd in $obj.'properties.storageProfile'.dataDisks)
       {
       $dataDiskName = $vm.Name + $dd.name ;
       $dataVhdUri = $dd.vhd.uri ;
       $dataDiskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location "West US" -CreateOption Import -SourceUri $dataVhdUri ;
       $dataDisk2 = New-AzureRmDisk -DiskName $dataDiskName -Disk $dataDiskConfig -ResourceGroupName "test" ;
       Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -ManagedDiskId $dataDisk2.Id -Lun $dd.Lun -CreateOption "Attach"
       }
      ```

       Use the following command to manually enable encryption for the data disks.

       ```powershell
       Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $RG -VMName $vm -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $dekUrl -DiskEncryptionKeyVaultId $keyVaultId -VolumeType Data
       ```

   * **Managed and encrypted VMs (BEK and KEK)** - For managed encrypted VMs (encrypted using BEK and KEK), you'll need to create managed disks from blob storage, and then attach the disks. For in-depth information, see the article, [Attach a data disk to a Windows VM using PowerShell](../virtual-machines/windows/attach-disk-ps.md). The following sample code shows how to attach the data disks for managed encrypted VMs.

      ```powershell
      $dekUrl = "https://ContosoKeyVault.vault.azure.net:443/secrets/ContosoSecret007/xx000000xx0849999f3xx30000003163"
      $kekUrl = "https://ContosoKeyVault.vault.azure.net:443/keys/ContosoKey007/x9xxx00000x0000x9b9949999xx0x006"
      $keyVaultId = "/subscriptions/abcdedf007-4xyz-1a2b-0000-12a2b345675c/resourceGroups/ContosoRG108/providers/Microsoft.KeyVault/vaults/ContosoKeyVault"
      $storageType = "StandardLRS"
      $osDiskName = $vm.Name + "_osdisk"
      $osVhdUri = $obj.'properties.storageProfile'.osDisk.vhd.uri
      $diskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location "West US" -CreateOption Import -SourceUri $osVhdUri
      $osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk $diskConfig -ResourceGroupName "test"
      Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -DiskEncryptionKeyUrl $dekUrl -DiskEncryptionKeyVaultId $keyVaultId -KeyEncryptionKeyUrl $kekUrl -KeyEncryptionKeyVaultId $keyVaultId -CreateOption "Attach" -Windows
      foreach($dd in $obj.'properties.storageProfile'.dataDisks)
       {
       $dataDiskName = $vm.Name + $dd.name ;
       $dataVhdUri = $dd.vhd.uri ;
       $dataDiskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location "West US" -CreateOption Import -SourceUri $dataVhdUri ;
       $dataDisk2 = New-AzureRmDisk -DiskName $dataDiskName -Disk $dataDiskConfig -ResourceGroupName "test" ;
       Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -ManagedDiskId $dataDisk2.Id -Lun $dd.Lun -CreateOption "Attach"
       }
      ```

      Use the following command to manually enable encryption for the data disks.

      ```powershell
      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $RG -VMName $vm -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $dekUrl -DiskEncryptionKeyVaultId $dekUrl -KeyEncryptionKeyUrl $kekUrl -KeyEncryptionKeyVaultId $keyVaultId -VolumeType Data
      ```

5. Set the Network settings.

    ```powershell
    $nicName="p1234"
    $pip = New-AzureRmPublicIpAddress -Name $nicName -ResourceGroupName "test" -Location "WestUS" -AllocationMethod Dynamic
    $virtualNetwork = New-AzureRmVirtualNetwork -ResourceGroupName "test" -Location "WestUS" -Name "testvNET" -AddressPrefix 10.0.0.0/16
    $virtualNetwork | Set-AzureRmVirtualNetwork
    $vnet = Get-AzureRmVirtualNetwork -Name "testvNET" -ResourceGroupName "test"
    $subnetindex=0
    $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName "test" -Location "WestUS" -SubnetId $vnet.Subnets[$subnetindex].Id -PublicIpAddressId $pip.Id
    $vm=Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
    ```
6. Create the virtual machine.

    ```powershell  
    New-AzureRmVM -ResourceGroupName "test" -Location "WestUS" -VM $vm
    ```

## Restore files from an Azure VM backup

In addition to restoring disks, you can also restore individual files from an Azure VM backup. The restore files functionality provides access to all files in a recovery point. Manage the files via File Explorer as you would for normal files.

The basic steps to restore a file from an Azure VM backup are:

* Select the VM
* Choose a recovery point
* Mount the disks of recovery point
* Copy the required files
* Unmount the disk


### Select the VM

To get the PowerShell object that identifies the right backup item, start from the container in the vault, and work your way down the object hierarchy. To select the container that represents the VM, use the **[Get-AzureRmRecoveryServicesBackupContainer](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupcontainer)** cmdlet and pipe that to the **[Get-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupitem)** cmdlet.

```powershell
$namedContainer = Get-AzureRmRecoveryServicesBackupContainer  -ContainerType "AzureVM" -Status "Registered" -FriendlyName "V2VM"
$backupitem = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer  -WorkloadType "AzureVM"
```

### Choose a recovery point

Use the **[Get-AzureRmRecoveryServicesBackupRecoveryPoint](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackuprecoverypoint)** cmdlet to list all recovery points for the backup item. Then choose the recovery point to restore. If you are unsure which recovery point to use, it is a good practice to choose the most recent RecoveryPointType = AppConsistent point in the list.

In the following script, the variable, **$rp**, is an array of recovery points for the selected backup item, from the past seven days. The array is sorted in reverse order of time with the latest recovery point at index 0. Use standard PowerShell array indexing to pick the recovery point. In the example, $rp[0] selects the latest recovery point.

```powershell
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date
$rp = Get-AzureRmRecoveryServicesBackupRecoveryPoint -Item $backupitem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
$rp[0]
```

The output is similar to the following example:

```
RecoveryPointAdditionalInfo :
SourceVMStorageType         : NormalStorage
Name                        : 15260861925810
ItemName                    : VM;iaasvmcontainer;RGName1;V2VM
RecoveryPointId             : /subscriptions/XX/resourceGroups/ RGName1/providers/Microsoft.RecoveryServices/vaults/testvault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainer;RGName1;V2VM/protectedItems/VM;iaasvmcontainer; RGName1;V2VM/recoveryPoints/15260861925810
RecoveryPointType           : AppConsistent
RecoveryPointTime           : 4/23/2016 5:02:04 PM
WorkloadType                : AzureVM
ContainerName               : IaasVMContainer;iaasvmcontainer; RGName1;V2VM
ContainerType               : AzureVM
BackupManagementType        : AzureVM
```

### Mount the disks of recovery point

Use the **[Get-AzureRmRecoveryServicesBackupRPMountScript](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackuprpmountscript)** cmdlet to get the script to mount all the disks of the recovery point.

> [!NOTE]
> The disks are mounted as iSCSI attached disks to the machine where the script is run. Mounting occurs immediately, and you don't incur any charges.
>
>

```powershell
Get-AzureRmRecoveryServicesBackupRPMountScript -RecoveryPoint $rp[0]
```

The output is similar to the following example:

```
OsType  Password        Filename
------  --------        --------
Windows e3632984e51f496 V2VM_wus2_8287309959960546283_451516692429_cbd6061f7fc543c489f1974d33659fed07a6e0c2e08740.exe
```

Run the script on the machine where you want to recover the files. To execute the script, you must enter the password provided. After the disks are attached, use Windows File Explorer to browse the new volumes and files. For more information, refer to the Backup article, [Recover files from Azure virtual machine backup](backup-azure-restore-files-from-vm.md).

### Unmount the disks

After the required files are copied, use **[Disable-AzureRmRecoveryServicesBackupRPMountScript](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/disable-azurermrecoveryservicesbackuprpmountscript?view=azurermps-5.0.0)** to unmount the disks. Be sure to unmount the disks so access to the files of the recovery point is removed.

```powershell
Disable-AzureRmRecoveryServicesBackupRPMountScript -RecoveryPoint $rp[0]
```

## Next steps

If you prefer to use PowerShell to engage wi th your Azure resources, see the PowerShell article, [Deploy and Manage Backup for Windows Server](backup-client-automation.md). If you manage DPM backups, see the article, [Deploy and Manage Backup for DPM](backup-dpm-automation.md). Both of these articles have a version for Resource Manager deployments and Classic deployments.  
