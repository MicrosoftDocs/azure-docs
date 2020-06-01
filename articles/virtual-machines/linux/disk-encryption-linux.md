---
title: Azure Disk Encryption scenarios on Linux VMs
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Linux VMs for various scenarios
author: msmbaldwin
ms.service: virtual-machines-linux
ms.subservice: security
ms.topic: article
ms.author: mbaldwin
ms.date: 08/06/2019
ms.custom: seodec18

---

# Azure Disk Encryption scenarios on Linux VMs


Azure Disk Encryption for Linux virtual machines (VMs) uses the DM-Crypt feature of Linux to provide full disk encryption of the OS disk and data disks. Additionally, it provides encryption of the temporary disk when using the EncryptFormatAll feature.

Azure Disk Encryption is [integrated with Azure Key Vault](disk-encryption-key-vault.md) to help you control and manage the disk encryption keys and secrets. For an overview of the service, see [Azure Disk Encryption for Linux VMs](disk-encryption-overview.md).

You can only apply disk encryption to virtual machines of [supported VM sizes and operating systems](disk-encryption-overview.md#supported-vms-and-operating-systems). You must also meet the following prerequisites:

- [Additional requirements for VMs](disk-encryption-overview.md#supported-vms-and-operating-systems)
- [Networking requirements](disk-encryption-overview.md#networking-requirements)
- [Encryption key storage requirements](disk-encryption-overview.md#encryption-key-storage-requirements)

In all cases, you should [take a snapshot](snapshot-copy-managed-disk.md) and/or create a backup before disks are encrypted. Backups ensure that a recovery option is possible if an unexpected failure occurs during encryption. VMs with managed disks require a backup before encryption occurs. Once a backup is made, you can use the [Set-AzVMDiskEncryptionExtension cmdlet](/powershell/module/az.compute/set-azvmdiskencryptionextension) to encrypt managed disks by specifying the -skipVmBackup parameter. For more information about how to back up and restore encrypted VMs, see the [Azure Backup](../../backup/backup-azure-vms-encryption.md) article. 

>[!WARNING]
> - If you have previously used Azure Disk Encryption with Azure AD to encrypt a VM, you must continue use this option to encrypt your VM. See [Azure Disk Encryption with Azure AD (previous release)](disk-encryption-overview-aad.md) for details. 
>
> - When encrypting Linux OS volumes, the VM should be considered unavailable. We strongly recommend to avoid SSH logins while the encryption is in progress to avoid issues blocking any open files that will need to be accessed during the encryption process. To check progress, use the the [Get-AzVMDiskEncryptionStatus](/powershell/module/az.compute/get-azvmdiskencryptionstatus) PowerShell cmdlet or the [vm encryption show](/cli/azure/vm/encryption#az-vm-encryption-show) CLI command. This process can be expected to take a few hours for a 30GB OS volume, plus additional time for encrypting data volumes. Data volume encryption time will be proportional to the size and quantity of the data volumes unless the encrypt format all option is used. 
> - Disabling encryption on Linux VMs is only supported for data volumes. It is not supported on data or OS volumes if the OS volume has been encrypted.  

## Install tools and connect to Azure

Azure Disk Encryption can be enabled and managed through the [Azure CLI](/cli/azure) and [Azure PowerShell](/powershell/azure/new-azureps-module-az). To do so you must install the tools locally and connect to your Azure subscription.

### Azure CLI

The [Azure CLI 2.0](/cli/azure) is a command-line tool for managing Azure resources. The CLI is designed to flexibly query data, support long-running operations as non-blocking processes, and make scripting easy. You can install it locally by following the steps in [Install the Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).

 

To [Sign in to your Azure account with the Azure CLI](/cli/azure/authenticate-azure-cli), use the [az login](/cli/azure/reference-index?view=azure-cli-latest#az-login) command.

```azurecli
az login
```

If you would like to select a tenant to sign in under, use:
    
```azurecli
az login --tenant <tenant>
```

If you have multiple subscriptions and want to specify a specific one, get your subscription list with [az account list](/cli/azure/account#az-account-list) and specify with [az account set](/cli/azure/account#az-account-set).
     
```azurecli
az account list
az account set --subscription "<subscription name or ID>"
```

For more information, see [Get started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli). 

### Azure PowerShell
The [Azure PowerShell az module](/powershell/azure/new-azureps-module-az) provides a set of cmdlets that uses the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) model for managing your Azure resources. You can use it in your browser with [Azure Cloud Shell](../../cloud-shell/overview.md), or you can install it on your local machine using the instructions in [Install the Azure PowerShell module](/powershell/azure/install-az-ps). 

If you already have it installed locally, make sure you use the latest version of Azure PowerShell SDK version to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell release](https://github.com/Azure/azure-powershell/releases).

To [Sign in to your Azure account with Azure PowerShell](/powershell/azure/authenticate-azureps?view=azps-2.5.0), use the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) cmdlet.

```powershell
Connect-AzAccount
```

If you have multiple subscriptions and want to specify one, use the [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription) cmdlet to list them, followed by the [Set-AzContext](/powershell/module/az.accounts/set-azcontext?view=azps-2.5.0) cmdlet:

```powershell
Set-AzContext -Subscription -Subscription <SubscriptionId>
```

Running the [Get-AzContext](/powershell/module/Az.Accounts/Get-AzContext) cmdlet will verify that the correct subscription has been selected.

To confirm the Azure Disk Encryption cmdlets are installed, use the [Get-command](/powershell/module/microsoft.powershell.core/get-command?view=powershell-6) cmdlet:
     
```powershell
Get-command *diskencryption*
```
For more information, see [Getting started with Azure PowerShell](/powershell/azure/get-started-azureps). 

## Enable encryption on an existing or running Linux VM
In this scenario, you can enable encryption by using the Resource Manager template, PowerShell cmdlets, or CLI commands. If you need schema information for the virtual machine extension, see the [Azure Disk Encryption for Linux extension](../extensions/azure-disk-enc-linux.md) article.

>[!IMPORTANT]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or through [Azure Backup](../../backup/backup-azure-vms-encryption.md). Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. The Set-AzVMDiskEncryptionExtension command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
>Encrypting or disabling encryption may cause the VM to reboot. 
>

### Enable encryption on an existing or running Linux VM using Azure CLI 

You can enable disk encryption on your encrypted VHD by installing and using the [Azure CLI](/cli/azure/?view=azure-cli-latest) command-line tool. You can use it in your browser with [Azure Cloud Shell](../../cloud-shell/overview.md), or you can install it on your local machine and use it in any PowerShell session. To enable encryption on existing or running Linux VMs in Azure, use the following CLI commands:

Use the [az vm encryption enable](/cli/azure/vm/encryption?view=azure-cli-latest#az-vm-encryption-show) command to enable encryption on a running virtual machine in Azure.

- **Encrypt a running VM:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MyVirtualMachineResourceGroup" --name "MySecureVM" --disk-encryption-keyvault "MySecureVault" --volume-type [All|OS|Data]
     ```

- **Encrypt a running VM using KEK:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MyVirtualMachineResourceGroup" --name "MySecureVM" --disk-encryption-keyvault  "MySecureVault" --key-encryption-key "MyKEK_URI" --key-encryption-keyvault "MySecureVaultContainingTheKEK" --volume-type [All|OS|Data]
     ```

    >[!NOTE]
    > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br>
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 

- **Verify the disks are encrypted:** To check on the encryption status of a VM, use the [az vm encryption show](/cli/azure/vm/encryption#az-vm-encryption-show) command. 

     ```azurecli-interactive
     az vm encryption show --name "MySecureVM" --resource-group "MyVirtualMachineResourceGroup"
     ```

- **Disable encryption:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. Disabling encryption is only allowed on data volumes for Linux VMs.

     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MyVirtualMachineResourceGroup" --volume-type "data"
     ```

### Enable encryption on an existing or running Linux VM using PowerShell
Use the [Set-AzVMDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension) cmdlet to enable encryption on a running virtual machine in Azure. Take a [snapshot](snapshot-copy-managed-disk.md) and/or back up the VM with [Azure Backup](../../backup/backup-azure-vms-encryption.md) before disks are encrypted. The -skipVmBackup parameter is already specified in the PowerShell scripts to encrypt a running Linux VM.

-  **Encrypt a running VM:** The script below initializes your variables and runs the Set-AzVMDiskEncryptionExtension cmdlet. The resource group, VM, and key vault, were created as prerequisites. Replace MyVirtualMachineResourceGroup, MySecureVM, and MySecureVault with your values. Modify the -VolumeType parameter to specify which disks you're encrypting.

     ```azurepowershell
      $KVRGname = 'MyKeyVaultResourceGroup';
      $VMRGName = 'MyVirtualMachineResourceGroup';
      $vmName = 'MySecureVM';
      $KeyVaultName = 'MySecureVault';
      $KeyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;
      $sequenceVersion = [Guid]::NewGuid();  

      Set-AzVMDiskEncryptionExtension -ResourceGroupName $VMRGName -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType '[All|OS|Data]' -SequenceVersion $sequenceVersion -skipVmBackup;
     ```
- **Encrypt a running VM using KEK:** You may need to add the -VolumeType parameter if you're encrypting data disks and not the OS disk. 

     ```azurepowershell
      $KVRGname = 'MyKeyVaultResourceGroup';
      $VMRGName = 'MyVirtualMachineResourceGroup';
      $vmName = 'MyExtraSecureVM';
      $KeyVaultName = 'MySecureVault';
      $keyEncryptionKeyName = 'MyKeyEncryptionKey';
      $KeyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;
      $keyEncryptionKeyUrl = (Get-AzKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;
      $sequenceVersion = [Guid]::NewGuid();  

      Set-AzVMDiskEncryptionExtension -ResourceGroupName $VMRGName -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId -VolumeType '[All|OS|Data]' -SequenceVersion $sequenceVersion -skipVmBackup;
     ```

    >[!NOTE]
    > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br> 
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 
    
- **Verify the disks are encrypted:** To check on the encryption status of a VM, use the [Get-AzVmDiskEncryptionStatus](/powershell/module/az.compute/get-azvmdiskencryptionstatus) cmdlet. 
    
     ```azurepowershell-interactive 
     Get-AzVmDiskEncryptionStatus -ResourceGroupName 'MyVirtualMachineResourceGroup' -VMName 'MySecureVM'
     ```
    
- **Disable disk encryption:** To disable the encryption, use the [Disable-AzVMDisk​Encryption](/powershell/module/az.compute/disable-azvmdiskencryption) cmdlet. Disabling encryption is only allowed on data volumes for Linux VMs.
     
     ```azurepowershell-interactive 
     Disable-AzVMDiskEncryption -ResourceGroupName 'MyVirtualMachineResourceGroup' -VMName 'MySecureVM'
     ```

### Enable encryption on an existing or running Linux VM with a template

You can enable disk encryption on an existing or running Linux VM in Azure by using the [Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-linux-vm-without-aad).

1. Click **Deploy to Azure** on the Azure quickstart template.

2. Select the subscription, resource group, resource group location, parameters, legal terms, and agreement. Click **Create** to enable encryption on the existing or running VM.

The following table lists Resource Manager template parameters for existing or running VMs:

| Parameter | Description |
| --- | --- |
| vmName | Name of the VM to run the encryption operation. |
| keyVaultName | Name of the key vault that the encryption key should be uploaded to. You can get it by using the cmdlet `(Get-AzKeyVault -ResourceGroupName <MyKeyVaultResourceGroupName>). Vaultname` or the Azure CLI command `az keyvault list --resource-group "MyKeyVaultResourceGroupName"`.|
| keyVaultResourceGroup | Name of the resource group that contains the key vault. |
|  keyEncryptionKeyURL | URL of the key encryption key that's used to encrypt the encryption key. This parameter is optional if you select **nokek** in the UseExistingKek drop-down list. If you select **kek** in the UseExistingKek drop-down list, you must enter the _keyEncryptionKeyURL_ value. |
| volumeType | Type of volume that the encryption operation is performed on. Valid values are _OS_, _Data_, and _All_. 
| forceUpdateTag | Pass in a unique value like a GUID every time the operation needs to be force run. |
| location | Location for all resources. |

For more information about configuring the Linux VM disk encryption template, see [Azure Disk Encryption for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/azure-disk-enc-linux).

## Use EncryptFormatAll feature for data disks on Linux VMs

The **EncryptFormatAll** parameter reduces the time for Linux data disks to be encrypted. Partitions meeting certain criteria will be formatted, along with their current file systems, then remounted back to where they were before command execution. If you wish to exclude a data disk that meets the criteria, you can unmount it before running the command.

 After running this command, any drives that were mounted previously will be formatted, and the encryption layer will be started on top of the now empty drive. When this option is selected, the temporary disk attached to the VM will also be encrypted. If the temporary disk is reset, it will be reformatted and re-encrypted for the VM by the Azure Disk Encryption solution at the next opportunity. Once the resource disk gets encrypted, the [Microsoft Azure Linux Agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux) will not be able to manage the resource disk and enable the swap file, but you may manually configure the swap file.

>[!WARNING]
> EncryptFormatAll shouldn't be used when there is needed data on a VM's data volumes. You may exclude disks from encryption by unmounting them. You should first try out the EncryptFormatAll first on a test VM, understand the feature parameter and its implication before trying it on the production VM. The EncryptFormatAll option formats the data disk and all the data on it will be lost. Before proceeding, verify that disks you wish to exclude are properly unmounted. </br></br>
 >If you're setting this parameter while updating encryption settings, it might lead to a reboot before the actual encryption. In this case, you will also want to remove the disk you don't want formatted from the fstab file. Similarly, you should add the partition you want encrypt-formatted to the fstab file before initiating the encryption operation. 

### EncryptFormatAll criteria
The parameter goes though all partitions and encrypts them as long as they meet **all** of the criteria below:
- Is not a root/OS/boot partition
- Is not already encrypted
- Is not a BEK volume
- Is not a RAID volume
- Is not an LVM volume
- Is mounted

Encrypt the disks that compose the RAID or LVM volume rather than the RAID or LVM volume.

### Use the EncryptFormatAll parameter with Azure CLI
Use the [az vm encryption enable](/cli/azure/vm/encryption#az-vm-encryption-enable) command to enable encryption on a running virtual machine in Azure.

-  **Encrypt a running VM using EncryptFormatAll:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MyVirtualMachineResourceGroup" --name "MySecureVM" --disk-encryption-keyvault "MySecureVault" --volume-type "data" --encrypt-format-all
     ```

### Use the EncryptFormatAll parameter with a PowerShell cmdlet
Use the [Set-AzVMDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension) cmdlet with the EncryptFormatAll parameter. 

**Encrypt a running VM using EncryptFormatAll:** As an example, the script below initializes your variables and runs the Set-AzVMDiskEncryptionExtension cmdlet with the EncryptFormatAll parameter. The resource group, VM, and key vault were created as prerequisites. Replace MyVirtualMachineResourceGroup, MySecureVM, and MySecureVault with your values.
  
```azurepowershell
$KVRGname = 'MyKeyVaultResourceGroup';
$VMRGName = 'MyVirtualMachineResourceGroup';
$vmName = 'MySecureVM';
$KeyVaultName = 'MySecureVault';
$KeyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname;
$diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
$KeyVaultResourceId = $KeyVault.ResourceId;

Set-AzVMDiskEncryptionExtension -ResourceGroupName $VMRGName -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType "data" -EncryptFormatAll
```


### Use the EncryptFormatAll parameter with Logical Volume Manager (LVM) 
We recommend an LVM-on-crypt setup. For all the following examples, replace the device-path and mountpoints with whatever suits your use-case. This setup can be done as follows:

1.  Add the data disks that will compose the VM.

1. Format, mount, and add these disks to the fstab file.

1. Choose a partition standard, create a partition that spans the entire drive, and then format the partition. We use symlinks generated by Azure here. Using symlinks avoids problems related to device names changing. For more information, see the [Troubleshoot Device Names problems](troubleshoot-device-names-problems.md) article.
    
    ```bash
    parted /dev/disk/azure/scsi1/lun0 mklabel gpt
    parted -a opt /dev/disk/azure/scsi1/lun0 mkpart primary ext4 0% 100%
    
    mkfs -t ext4 /dev/disk/azure/scsi1/lun0-part1
    ```

1. Mount the disks:

    ```bash
    mount /dev/disk/azure/scsi1/lun0-part1 /mnt/mountpoint
    ````
    
    Add to fstab file:

    ```bash
    echo "/dev/disk/azure/scsi1/lun0-part1 /mnt/mountpoint ext4 defaults,nofail 0 2" >> /etc/fstab
    ```
    
1. Run the Azure PowerShell [Set-AzVMDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension?view=azps-3.8.0) cmdlet with -EncryptFormatAll to encrypt these disks.

    ```azurepowershell-interactive
    $KeyVault = Get-AzKeyVault -VaultName "MySecureVault" -ResourceGroupName "MySecureGroup"
    
    Set-AzVMDiskEncryptionExtension -ResourceGroupName "MySecureGroup" -VMName "MySecureVM" -DiskEncryptionKeyVaultUrl $KeyVault.VaultUri -DiskEncryptionKeyVaultId $KeyVault.ResourceId -EncryptFormatAll -SkipVmBackup -VolumeType Data
    ```

    If you wish to use a key encryption key (KEK), pass the URI of your KEK and the ResourceID of your key vault to the -KeyEncryptionKeyUrl and -KeyEncryptionKeyVaultId parameters, respectively:

    ```azurepowershell-interactive
    $KeyVault = Get-AzKeyVault -VaultName "MySecureVault" -ResourceGroupName "MySecureGroup"
    $KEKKeyVault = Get-AzKeyVault -VaultName "MyKEKVault" -ResourceGroupName "MySecureGroup"
    $KEK = Get-AzKeyVaultKey -VaultName "myKEKVault" -KeyName "myKEKName"
    
    Set-AzVMDiskEncryptionExtension -ResourceGroupName "MySecureGroup" -VMName "MySecureVM" -DiskEncryptionKeyVaultUrl $KeyVault.VaultUri -DiskEncryptionKeyVaultId $KeyVault.ResourceId -EncryptFormatAll -SkipVmBackup -VolumeType Data -KeyEncryptionKeyUrl $$KEK.id -KeyEncryptionKeyVaultId $KEKKeyVault.ResourceId
    ```

1. Set up LVM on top of these new disks. Note the encrypted drives are unlocked after the VM has finished booting. So, the LVM mounting will also have to be subsequently delayed.

## New VMs created from customer-encrypted VHD and encryption keys
In this scenario, you can enable encrypting by using PowerShell cmdlets or CLI commands. 

Use the instructions in the Azure Disk encryption same scripts for preparing pre-encrypted images that can be used in Azure. After the image is created, you can use the steps in the next section to create an encrypted Azure VM.

* [Prepare a pre-encrypted Linux VHD](disk-encryption-sample-scripts.md#prepare-a-pre-encrypted-linux-vhd)

>[!IMPORTANT]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or [Azure Backup](../../backup/backup-azure-vms-encryption.md) can be used. Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. The Set-AzVMDiskEncryptionExtension command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
> Encrypting or disabling encryption may cause the VM to reboot. 



### Use Azure PowerShell to encrypt VMs with pre-encrypted VHDs 
You can enable disk encryption on your encrypted VHD by using the PowerShell cmdlet [Set-AzVMOSDisk](/powershell/module/Az.Compute/Set-AzVMOSDisk#examples). The example below gives you some common parameters. 

```azurepowershell
$VirtualMachine = New-AzVMConfig -VMName "MySecureVM" -VMSize "Standard_A1"
$VirtualMachine = Set-AzVMOSDisk -VM $VirtualMachine -Name "SecureOSDisk" -VhdUri "os.vhd" Caching ReadWrite -Linux -CreateOption "Attach" -DiskEncryptionKeyUrl "https://mytestvault.vault.azure.net/secrets/Test1/514ceb769c984379a7e0230bddaaaaaa" -DiskEncryptionKeyVaultId "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mytestvault"
New-AzVM -VM $VirtualMachine -ResourceGroupName "MyVirtualMachineResourceGroup"
```

## Enable encryption on a newly added data disk

You can add a new data disk using [az vm disk attach](add-disk.md), or [through the Azure portal](attach-disk-portal.md). Before you can encrypt, you need to mount the newly attached data disk first. You must request encryption of the data drive since the drive will be unusable while encryption is in progress. 

### Enable encryption on a newly added disk with Azure CLI

 If the VM was previously encrypted with "All" then the --volume-type parameter should remain "All". All includes both OS and data disks. If the VM was previously encrypted with a volume type of "OS", then the --volume-type parameter should be changed to "All" so that both the OS and the new data disk will be included. If the VM was encrypted with only the volume type of "Data", then it can remain "Data" as demonstrated below. Adding and attaching a new data disk to a VM is not sufficient preparation for encryption. The newly attached disk must also be formatted and properly mounted within the VM prior to enabling encryption. On Linux the disk must be mounted in /etc/fstab with a [persistent block device name](troubleshoot-device-names-problems.md).  

In contrast to PowerShell syntax, the CLI does not require the user to provide a unique sequence version when enabling encryption. The CLI automatically generates and uses its own unique sequence version value.

-  **Encrypt data volumes of a running VM:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MyVirtualMachineResourceGroup" --name "MySecureVM" --disk-encryption-keyvault "MySecureVault" --volume-type "Data"
     ```

- **Encrypt data volumes of a running VM using KEK:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MyVirtualMachineResourceGroup" --name "MySecureVM" --disk-encryption-keyvault  "MySecureVault" --key-encryption-key "MyKEK_URI" --key-encryption-keyvault "MySecureVaultContainingTheKEK" --volume-type "Data"
     ```

### Enable encryption on a newly added disk with Azure PowerShell
 When using PowerShell to encrypt a new disk for Linux, a new sequence version needs to be specified. The sequence version has to be unique. The script below generates a GUID for the sequence version. Take a [snapshot](snapshot-copy-managed-disk.md) and/or back up the VM with [Azure Backup](../../backup/backup-azure-vms-encryption.md) before disks are encrypted. The -skipVmBackup parameter is already specified in the PowerShell scripts to encrypt a newly added data disk.
 

-  **Encrypt data volumes of a running VM:** The script below initializes your variables and runs the Set-AzVMDiskEncryptionExtension cmdlet. The resource group, VM, and key vault should have already been created as prerequisites. Replace MyVirtualMachineResourceGroup, MySecureVM, and MySecureVault with your values. Acceptable values for the -VolumeType parameter are All, OS, and Data. If the VM was previously encrypted with a volume type of "OS" or "All", then the -VolumeType parameter should be changed to "All" so that both the OS and the new data disk will be included.

      ```azurepowershell
      $KVRGname = 'MyKeyVaultResourceGroup';
      $VMRGName = 'MyVirtualMachineResourceGroup';
      $vmName = 'MySecureVM';
      $KeyVaultName = 'MySecureVault';
      $KeyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;
      $sequenceVersion = [Guid]::NewGuid();

      Set-AzVMDiskEncryptionExtension -ResourceGroupName $VMRGName -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType 'data' –SequenceVersion $sequenceVersion -skipVmBackup;
      ```
- **Encrypt data volumes of a running VM using KEK:** Acceptable values for the -VolumeType parameter are All, OS, and Data. If the VM was previously encrypted with a volume type of "OS" or "All", then the -VolumeType parameter should be changed to All so that both the OS and the new data disk will be included.

     ```azurepowershell
      $KVRGname = 'MyKeyVaultResourceGroup';
      $VMRGName = 'MyVirtualMachineResourceGroup';
      $vmName = 'MyExtraSecureVM';
      $KeyVaultName = 'MySecureVault';
      $keyEncryptionKeyName = 'MyKeyEncryptionKey';
      $KeyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;
      $keyEncryptionKeyUrl = (Get-AzKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;
      $sequenceVersion = [Guid]::NewGuid();

      Set-AzVMDiskEncryptionExtension -ResourceGroupName $VMRGName -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId -VolumeType 'data' –SequenceVersion $sequenceVersion -skipVmBackup;
     ```

    >[!NOTE]
    > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[KVresource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br> 
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 


## Disable encryption for Linux VMs
You can disable encryption using Azure PowerShell, the Azure CLI, or with a Resource Manager template. 

>[!IMPORTANT]
>Disabling encryption with Azure Disk Encryption on Linux VMs is only supported for data volumes. It is not supported on data or OS volumes if the OS volume has been encrypted.  

- **Disable disk encryption with Azure PowerShell:** To disable the encryption, use the [Disable-AzVMDisk​Encryption](/powershell/module/az.compute/disable-azvmdiskencryption) cmdlet. 
     ```azurepowershell-interactive
     Disable-AzVMDiskEncryption -ResourceGroupName 'MyVirtualMachineResourceGroup' -VMName 'MySecureVM' [-VolumeType DATA]
     ```

- **Disable encryption with the Azure CLI:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. 
     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MyVirtualMachineResourceGroup" --volume-type DATA
     ```
- **Disable encryption with a Resource Manager template:** Use the [Disable encryption on a running Linux VM](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-running-linux-vm-without-aad) template to disable encryption.
     1. Click **Deploy to Azure**.
     2. Select the subscription, resource group, location, VM, legal terms, and agreement.

## Unsupported scenarios

Azure Disk Encryption does not work for the following Linux scenarios, features, and technology:

- Encrypting basic tier VM or VMs created through the classic VM creation method.
- Disabling encryption on an OS drive or data drive of a Linux VM when the OS drive is encrypted.
- Encrypting OS drive for Linux virtual machine scale sets.
- Encrypting custom images on Linux VMs.
- Integration with an on-premises key management system.
- Azure Files (shared file system).
- Network File System (NFS).
- Dynamic volumes.
- Ephemeral OS disks.
- Encryption of shared/distributed file systems like (but not limited to): DFS, GFS, DRDB, and CephFS.
- Moving an encrypted VM to another subscription.
- Kernel Crash Dump (kdump).
- Oracle ACFS (ASM Cluster File System).
- Gen2 VMs (see: [Support for generation 2 VMs on Azure](generation-2.md#generation-1-vs-generation-2-capabilities)).
- Lsv2 series VMs (see: [Lsv2-series](../lsv2-series.md)).
- A VM with "nested mount points"; that is, multiple mount points in a single path (such as "/1stmountpoint/data/2stmountpoint").

## Next steps

- [Azure Disk Encryption overview](disk-encryption-overview.md)
- [Azure Disk Encryption sample scripts](disk-encryption-sample-scripts.md)
- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)
