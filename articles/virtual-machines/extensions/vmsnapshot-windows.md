---
title: VM Snapshot Windows extension for Azure Backup 
description: Take application consistent backup of the virtual machine from Azure Backup using VM snapshot extension
services: backup, virtual-machines
documentationcenter: ''
author: trinadhkotturu
manager: gwallace
ms.service: virtual-machines
ms.subservice: extensions
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.collection: windows
ms.topic: article
ms.date: 03/09/2023
ms.author: trinadhk
---
# VM Snapshot Windows extension for Azure Backup

Azure Backup provides support for backing up workloads from on-premises to cloud and backing up cloud resources to Recovery Services vault. Azure Backup uses VM snapshot extension to take an application consistent backup of the Azure virtual machine without the need to shutdown the VM. VM Snapshot extension is published and supported by Microsoft as part of Azure Backup service. Azure Backup will install the extension as part of first scheduled backup triggered post enabling backup. This document details the supported platforms, configurations, and deployment options for the VM Snapshot extension.

The VMSnapshot extension appears in the Azure portal only for non-managed VMs.

## Prerequisites

### Operating system
For a list of supported operating systems, refer to [Operating Systems supported by Azure Backup](../../backup/backup-azure-arm-vms-prepare.md#before-you-start)

## Extension schema

The following JSON shows the schema for the VM snapshot extension. The extension requires the task ID - this identifies the backup job which triggered snapshot on the VM, status blob uri - where status of the snapshot operation is written, scheduled start time of the snapshot, logs blob uri - where logs corresponding to snapshot task are written, objstr- representation of VM disks and meta data.  Because these settings should be treated as sensitive data, it should be stored in a protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine. Note that these settings are recommended to be passed from Azure Backup service only as part of Backup job.

```json
{
  "type": "extensions",
  "name": "VMSnapshot",
  "location":"<myLocation>",
  "properties": {
    "publisher": "Microsoft.Azure.RecoveryServices",
    "type": "VMSnapshot",
    "typeHandlerVersion": "1.9",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "locale":"<location>",
      "taskId":"<taskId used by Azure Backup service to communicate with extension>",
      "commandToExecute": "snapshot",
      "commandStartTimeUTCTicks": "<scheduled start time of the snapshot task>",
      "vmType": "microsoft.compute/virtualmachines"
    },
    "protectedSettings": {
      "objectStr": "<blob SAS uri representation of VM sent by Azure Backup service to extension>",
      "logsBlobUri": "<blob uri where logs of command execution by extension are written to>",
      "statusBlobUri": "<blob uri where status of the command executed by extension is written>"
    }
  }
}
```

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2015-06-15 | date |
| taskId | e07354cf-041e-4370-929f-25a319ce8933_1 | string |
| commandStartTimeUTCTicks | 6.36458E+17 | string |
| locale | en-us | string |
| objectStr | Encoding of sas uri array- "blobSASUri": ["https:\/\/sopattna5365.blob.core.windows.net\/vhds\/vmwin1404ltsc201652903941.vhd?sv=2014-02-14&sr=b&sig=TywkROXL1zvhXcLujtCut8g3jTpgbE6JpSWRLZxAdtA%3D&st=2017-11-09T14%3A23%3A28Z&se=2017-11-09T17%3A38%3A28Z&sp=rw", "https:\/\/sopattna8461.blob.core.windows.net\/vhds\/vmwin1404ltsc-20160629-122418.vhd?sv=2014-02-14&sr=b&sig=5S0A6YDWvVwqPAkzWXVy%2BS%2FqMwzFMbamT5upwx05v8Q%3D&st=2017-11-09T14%3A23%3A28Z&se=2017-11-09T17%3A38%3A28Z&sp=rw", "https:\/\/sopattna8461.blob.core.windows.net\/bootdiagnostics-vmwintu1-deb58392-ed5e-48be-9228-ff681b0cd3ee\/vmubuntu1404ltsc-20160629-122541.vhd?sv=2014-02-14&sr=b&sig=X0Me2djByksBBMVXMGIUrcycvhQSfjYvqKLeRA7nBD4%3D&st=2017-11-09T14%3A23%3A28Z&se=2017-11-09T17%3A38%3A28Z&sp=rw", "https:\/\/sopattna5365.blob.core.windows.net\/vhds\/vmwin1404ltsc-20160701-163922.vhd?sv=2014-02-14&sr=b&sig=oXvtK2IXCNqWv7fpjc7TAzFDpc1GoXtT7r%2BC%2BNIAork%3D&st=2017-11-09T14%3A23%3A28Z&se=2017-11-09T17%3A38%3A28Z&sp=rw", "https:\/\/sopattna5365.blob.core.windows.net\/vhds\/vmwin1404ltsc-20170705-124311.vhd?sv=2014-02-14&sr=b&sig=ZUM9d28Mvvm%2FfrhJ71TFZh0Ni90m38bBs3zMl%2FQ9rs0%3D&st=2017-11-09T14%3A23%3A28Z&se=2017-11-09T17%3A38%3A28Z&sp=rw"] | string |
| logsBlobUri | https://seapod01coord1exsapk732.blob.core.windows.net/bcdrextensionlogs-d45d8a1c-281e-4bc8-9d30-3b25176f68ea/sopattna-vmubuntu1404ltsc.v2.Logs.txt?sv=2014-02-14&sr=b&sig=DbwYhwfeAC5YJzISgxoKk%2FEWQq2AO1vS1E0rDW%2FlsBw%3D&st=2017-11-09T14%3A33%3A29Z&se=2017-11-09T17%3A38%3A29Z&sp=rw | string |
| statusBlobUri | https://seapod01coord1exsapk732.blob.core.windows.net/bcdrextensionlogs-d45d8a1c-281e-4bc8-9d30-3b25176f68ea/sopattna-vmubuntu1404ltsc.v2.Status.txt?sv=2014-02-14&sr=b&sig=96RZBpTKCjmV7QFeXm5IduB%2FILktwGbLwbWg6Ih96Ao%3D&st=2017-11-09T14%3A33%3A29Z&se=2017-11-09T17%3A38%3A29Z&sp=rw | string |



## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. However, the recommended way of adding a VM snapshot extension to a virtual machine is by enabling backup on the virtual machine. This can be achieved through a Resource Manager template.  A sample Resource Manager template that enables backup on a virtual machine can be found on the [Azure Quick Start Gallery](https://azure.microsoft.com/resources/templates/recovery-services-backup-vms/).


## Azure CLI deployment

The Azure CLI can be used to enable backup on a virtual machine. Post enable backup, first scheduled backup job will install the Vm snapshot extension on the VM.

```azurecli
az backup protection enable-for-vm \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --vm myVM \
    --policy-name DefaultPolicy
```

## Azure PowerShell deployment

Azure PowerShell can be used to enable backup on a virtual machine. Once the backup is configured, first scheduled backup job will install the Vm snapshot extension on the VM.

```azurepowershell
$targetVault = Get-AzRecoveryServicesVault -ResourceGroupName "myResourceGroup" -Name "myRecoveryServicesVault"
$pol = Get-AzRecoveryServicesBackupProtectionPolicy Name DefaultPolicy -VaultId $targetVault.ID
Enable-AzRecoveryServicesBackupProtection -Policy $pol -Name "myVM" -ResourceGroupName "myVMResourceGroup" -VaultId $targetVault.ID
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```
C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot
```

### Error codes and their meanings

Troubleshooting information can be found on the [Azure VM backup troubleshooting guide](../../backup/backup-azure-vms-troubleshoot.md).

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
