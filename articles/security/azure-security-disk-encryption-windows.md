---
title: Enable Azure Disk Encryption for Windows IaaS VMs | Microsoft Docs
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Windows IaaS VMs.
author: mestew
ms.service: security
ms.subservice: Azure Disk Encryption
ms.topic: article
ms.author: mstewart
ms.date: 10/12/2018

---

# Enable Azure Disk Encryption for Windows IaaS VMs 

You can enable many disk-encryption scenarios, and the steps may vary according to the scenario. The following sections cover the scenarios in greater detail for Windows IaaS VMs. Before you can use disk encryption, the [Azure Disk Encryption prerequisites](../security/azure-security-disk-encryption-prerequisites.md) need to be completed. 

Take a [snapshot](../virtual-machines/windows/snapshot-copy-managed-disk.md) and/or back up  before disks are encrypted. Backups ensure that a recovery option is possible if an unexpected failure occurs during encryption. VMs with managed disks require a backup before encryption occurs. Once a backup is made, you can use the Set-AzureRmVMDiskEncryptionExtension cmdlet to encrypt managed disks by specifying the -skipVmBackup parameter. For more information about how to back up and restore encrypted VMs, see the [Azure Backup](../backup/backup-azure-vms-encryption.md) article. 

>[!WARNING]
> Azure Disk Encryption needs the Key Vault and the VMs to be co-located in the same region. Create and use a Key Vault that is in the same region as the VM to be encrypted. 


## <a name="bkmk_RunningWinVM"></a> Enable encryption on existing or running IaaS Windows VMs
In this scenario, you can enable encryption by using a template, PowerShell cmdlets, or CLI commands. The following sections explain in greater detail how to enable Azure Disk Encryption. If you need schema information for the virtual machine extension, see the [Azure Disk Encryption for Windows extension](../virtual-machines/extensions/azure-disk-enc-windows.md) article.

>[!IMPORTANT]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or [Azure Backup](../backup/backup-azure-vms-encryption.md) can be used. Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzureRmVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. The Set-AzureRmVMDiskEncryptionExtension command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
>Encrypting or disabling encryption may cause the VM to reboot. 
>

### <a name="bkmk_RunningWinVMPSH"></a> Enable encryption on existing or running VMs with Azure PowerShell 
Use the [Set-AzureRmVMDiskEncryptionExtension](/powershell/module/azurerm.compute/set-azurermvmdiskencryptionextension) cmdlet to enable encryption on a running IaaS virtual machine in Azure. 

-  **Encrypt a running VM:** The script below initializes your variables and runs the Set-AzureRmVMDiskEncryptionExtension cmdlet. The resource group, VM, and key vault should have already been created as prerequisites. Replace MySecureRg, MySecureVM, and MySecureVault with your values.

     ```azurepowershell-interactive
      $rgName = 'MySecureRg';
      $vmName = 'MySecureVM';
      $KeyVaultName = 'MySecureVault';
      $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;

      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId;
    ```
- **Encrypt a running VM using KEK:** 

     ```azurepowershell-interactive
     $rgName = 'MySecureRg';
     $KeyVaultName = 'MySecureVault';
     $keyEncryptionKeyName = 'MyKeyEncryptionKey';
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
     $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
     $keyEncryptionKeyUrl = (Get-AzureKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;

     Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId;

     ```
     
   >[!NOTE]
   > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string:
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br> 
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 

- **Verify the disks are encrypted:** To check on the encryption status of a IaaS VM, use the [Get-AzureRmVmDiskEncryptionStatus](/powershell/module/azurerm.compute/get-azurermvmdiskencryptionstatus) cmdlet. 
     ```azurepowershell-interactive
     Get-AzureRmVmDiskEncryptionStatus -ResourceGroupName 'MySecureRg' -VMName 'MySecureVM'
     ```
    
- **Disable disk encryption:** To disable the encryption, use the [Disable-Azure​RmVMDisk​Encryption](/powershell/module/azurerm.compute/disable-azurermvmdiskencryption) cmdlet. Disabling data disk encryption on Windows VM when both OS and data disks have been encrypted doesn’t work as expected. Disable encryption on all disks instead.

     ```azurepowershell-interactive
     Disable-AzureRmVMDiskEncryption -ResourceGroupName 'MySecureRG' -VMName 'MySecureVM'
     ```

### <a name="bkmk_RunningWinVMCLI"></a>Enable encryption on existing or running VMs with  Azure CLI
Use the [az vm encryption enable](/cli/azure/vm/encryption#az-vm-encryption-enable) command to enable encryption on a running IaaS virtual machine in Azure.

-  **Encrypt a running VM:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --disk-encryption-keyvault "MySecureVault" --volume-type [All|OS|Data]
     ```

- **Encrypt a running VM using KEK:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --disk-encryption-keyvault  "MySecureVault" --key-encryption-key "MyKEK_URI" --key-encryption-keyvault "MySecureVaultContainingTheKEK" --volume-type [All|OS|Data]
     ```

     >[!NOTE]
     > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name] </br> 
     > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 

- **Verify the disks are encrypted:** To check on the encryption status of a IaaS VM, use the [az vm encryption show](/cli/azure/vm/encryption#az-vm-encryption-show) command. 

     ```azurecli-interactive
     az vm encryption show --name "MySecureVM" --resource-group "MySecureRg"
     ```

- **Disable encryption:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. Disabling data disk encryption on Windows VM when both OS and data disks have been encrypted doesn’t work as expected. Disable encryption on all disks instead.

     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MySecureRg" --volume-type [ALL, DATA, OS]
     ```
 
 > [!NOTE]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or [Azure Backup](../backup/backup-azure-vms-encryption.md) can be used. Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzureRmVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. This command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
>Encrypting or disabling encryption may cause the VM to reboot. 

### <a name="bkmk_RunningWinVMwRM"> </a>Using the Resource Manager template
You can enable disk encryption on existing or running IaaS Windows VMs in Azure by using the [Resource Manager template to encrypt a running Windows VM](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-windows-vm-without-aad).


1. On the Azure quickstart template, click **Deploy to Azure**.

2. Select the subscription, resource group, location, settings, legal terms, and agreement. Click **Purchase** to enable encryption on the existing or running IaaS VM.

The following table lists the Resource Manager template parameters for existing or running VMs:

| Parameter | Description |
| --- | --- |
| vmName | Name of the VM to run the encryption operation. |
| keyVaultName | Name of the key vault that the BitLocker key should be uploaded to. You can get it by using the cmdlet `(Get-AzureRmKeyVault -ResourceGroupName <MyResourceGroupName>). Vaultname` or the Azure CLI command `az keyvault list --resource-group "MySecureGroup" |Convertfrom-JSON`|
| keyVaultResourceGroup | Name of the resource group that contains the key vault|
|  keyEncryptionKeyURL | URL of the key encryption key that's used to encrypt the generated BitLocker key. This parameter is optional if you select **nokek** in the UseExistingKek drop-down list. If you select **kek** in the UseExistingKek drop-down list, you must enter the _keyEncryptionKeyURL_ value. |
| volumeType | Type of volume that the encryption operation is performed on. Valid values are _OS_, _Data_, and _All_. 
| forceUpdateTag | Pass in a unique value like a GUID every time the operation needs to be force run. |
| resizeOSDisk | Should the OS partition be resized to occupy full OS VHD before splitting system volume. |
| location | Location for all resources. |

## Encrypt virtual machine scale sets
[Azure virtual machine scale sets](../virtual-machine-scale-sets/overview.md) let you create and manage a group of identical, load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Use the CLI or Azure PowerShell to encrypt virtual machine scale sets.


### Register for disk encryption preview using Azure Powershell

The Azure disk encryption for virtual machine scale sets preview requires you to self-register your subscription with [Register-AzureRmProviderFeature](/powershell/module/azurerm.resources/register-azurermproviderfeature). You only need to perform the following steps the first time that you use the disk encryption preview feature:

```azurepowershell-interactive
Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
```

It can take up to 10 minutes for the registration request to propagate. You can check on the registration state with [Get-AzureRmProviderFeature](/powershell/module/AzureRM.Resources/Get-AzureRmProviderFeature). When the `RegistrationState` reports *Registered*, re-register the *Mirosoft.Compute* provider with [Register-AzureRmResourceProvider](/powershell/module/AzureRM.Resources/Register-AzureRmResourceProvider):

```azurepowershell-interactive
Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```

### Encrypt virtual machine scale sets with Azure PowerShell

Use the [Set-Azure​RmVmss​Disk​Encryption​Extension](/powershell/module/azurerm.compute/set-azurermvmssdiskencryptionextension) cmdlet to enable encryption on a Windows virtual machine scale set. The resource group, VM, and key vault should have already been created as prerequisites.

-  **Encrypt a running virtual machine scale set**:
    ```azurepowershell-interactive
     $rgName= "MySecureRg";
     $VmssName = "MySecureVmss";
     $KeyVaultName= "MySecureVault";
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgName;
     $DiskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
     Set-AzureRmVmssDiskEncryptionExtension -ResourceGroupName $rgName -VMScaleSetName $VmssName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId;


-  **Encrypt a running virtual machine scale set using KEK to wrap the key**:

    ```azurepowershell-interactive
     $rgName= "MySecureRg";
     $VmssName = "MySecureVmss";
     $KeyVaultName= "MySecureVault";
     $keyEncryptionKeyName = "MyKeyEncryptionKey";
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgName;
     $DiskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
     Set-AzureRmVmssDiskEncryptionExtension -ResourceGroupName $rgName -VMScaleSetName $VmssName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId;
    ```

- **Get encryption status for a virtual machine scale set:** Use the [Get-Azure​RmVmss​VMDisk​Encryption](/powershell/module/azurerm.compute/get-azurermvmssvmdiskencryption) cmdlet.
    
    ```azurepowershell-interactive
    get-AzureRmVmssVMDiskEncryption -ResourceGroupName "MySecureRG" -VMScaleSetName "MySecureVmss"
    ```

- **Disable encryption on a virtual machine scale set**: Use the [Disable-AzureRmVmssDiskEncryption](/powershell/module/azurerm.compute/disable-azurermvmssdiskencryption) cmdlet. 

    ```azurepowershell-interactive
    Disable-AzureRmVmssDiskEncryption -ResourceGroupName "MySecureRG" -VMScaleSetName "MySecureVmss"
    ```

### Register for disk encryption preview using Azure CLI

The Azure disk encryption for virtual machine scale sets preview requires you to self-register your subscription with [az feature register](/cli/azure/feature#az_feature_register). You only need to perform the following steps the first time that you use the disk encryption preview feature:

```azurecli-interactive
az feature register --name UnifiedDiskEncryption --namespace Microsoft.Compute
```

It can take up to 10 minutes for the registration request to propagate. You can check on the registration state with [az feature show](/cli/azure/feature#az_feature_show). When the `State` reports *Registered*, re-register the *Mirosoft.Compute* provider with [az provider register](/cli/azure/provider#az_provider_register):

```azurecli-interactive
az provider register --namespace Microsoft.Compute
```



###  Encrypt virtual machine scale sets with Azure CLI

Use the [az vmss encryption enable](/cli/azure/vmss/encryption#az-vmss-encryption-enable) to enable encryption on a Windows virtual machine scale set. If you set the upgrade policy on the scale set to manual, start the encryption with [az vmss update-instances](/cli/azure/vmss#az-vmss-update-instances). The resource group, VM, and key vault should have already been created as prerequisites.

-  **Encrypt a running virtual machine scale set**
    ```azurecli-interactive
     az vmss encryption enable --resource-group "MySecureRG" --name "MySecureVmss" --disk-encryption-keyvault "MySecureVault" 
    ```

-  **Encrypt a running virtual machine scale set using KEK to wrap the key**
    ```azurecli-interactive
     az vmss encryption enable --resource-group "MySecureRG" --name "MySecureVmss" --disk-encryption-keyvault "MySecureVault" --key-encryption-key "MyKEK" --key-encryption-keyvault "MySecureVault" 

     ```
- **Get encryption status for a virtual machine scale set:** Use [az vmss encryption show](/cli/azure/vmss/encryption#az-vmss-encryption-show)

    ```azurecli-interactive
     az vmss encryption show --resource-group "MySecureRG" --name "MySecureVmss"
    ```

- **Disable encryption on a virtual machine scale set**: Use [az vmss encryption disable](/cli/azure/vmss/encryption#az-vmss-encryption-disable)
    ```azurecli-interactive
     az vmss encryption disable --resource-group "MySecureRG" --name "MySecureVmss"
    ```

## <a name="bkmk_VHDpre"> </a>New IaaS VMs created from customer-encrypted VHD and encryption keys
In this scenario, you can enable encrypting by using  PowerShell cmdlets or CLI commands. 

Use the instructions in the appendix for preparing pre-encrypted images that can be used in Azure. After the image is created, you can use the steps in the next section to create an encrypted Azure VM.

* [Prepare a pre-encrypted Windows VHD](azure-security-disk-encryption-appendix.md#bkmk_preWin)
* [Prepare a pre-encrypted Linux VHD](azure-security-disk-encryption-appendix.md#bkmk_preLinux)

>[!IMPORTANT]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or [Azure Backup](../backup/backup-azure-vms-encryption.md) can be used. Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzureRmVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. The Set-AzureRmVMDiskEncryptionExtension command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
>Encrypting or disabling encryption may cause the VM to reboot. 


### <a name="bkmk_VHDprePSH"> </a> Encrypt VMs with pre-encrypted VHDs with Azure PowerShell
You can enable disk encryption on your encrypted VHD by using the PowerShell cmdlet [Set-AzureRmVMOSDisk](/powershell/module/azurerm.compute/set-azurermvmosdisk#examples). The example below gives you some common parameters. 

```azurepowershell-interactive
$VirtualMachine = New-AzureRmVMConfig -VMName "MySecureVM" -VMSize "Standard_A1"
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name "SecureOSDisk" -VhdUri "os.vhd" Caching ReadWrite -Windows -CreateOption "Attach" -DiskEncryptionKeyUrl "https://mytestvault.vault.azure.net/secrets/Test1/514ceb769c984379a7e0230bddaaaaaa" -DiskEncryptionKeyVaultId "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mytestvault"
New-AzureRmVM -VM $VirtualMachine -ResouceGroupName "MySecureRG"
```

## Enable encryption on a newly added data disk
You can [add a new disk to a Windows VM using PowerShell](../virtual-machines/windows/attach-disk-ps.md), or [through the Azure portal](../virtual-machines/windows/attach-managed-disk-portal.md). 

### Enable encryption on a newly added disk with Azure PowerShell
 When using Powershell to encrypt a new disk for Windows VMs, a new sequence version should be specified. The sequence version has to be unique. The script below generates a GUID for the sequence version. In some cases, a newly added data disk might be encrypted automatically by the Azure Disk Encryption extension. Auto encryption usually occurs when the VM reboots after the new disk comes online. This is typically caused because "All" was specified for the volume type when disk encryption previously ran on the VM. If auto encryption occurs on a newly added data disk, we recommend running the Set-AzureRmVmDiskEncryptionExtension cmdlet again with new sequence version. If your new data disk is auto encrypted and you do not wish to be encrypted, decrypt all drives first then re-encrypt with a new sequence version specifying OS for the volume type. 
  
 

-  **Encrypt a running VM:** The script below initializes your variables and runs the Set-AzureRmVMDiskEncryptionExtension cmdlet. The resource group, VM, and key vault should have already been created as prerequisites. Replace MySecureRg, MySecureVM, and MySecureVault with your values. This example uses "All" for the -VolumeType parameter, which includes both OS and Data volumes. If you only want to encrypt the OS volume, use "OS" for the -VolumeType parameter. 

     ```azurepowershell-interactive
      $sequenceVersion = [Guid]::NewGuid();
      $rgName = 'MySecureRg';
      $vmName = 'MySecureVM';
      $KeyVaultName = 'MySecureVault';
      $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;

      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType "All" –SequenceVersion $sequenceVersion;
    ```
- **Encrypt a running VM using KEK:** This example uses "All" for the -VolumeType parameter, which includes both OS and Data volumes. If you only want to encrypt the OS volume, use "OS" for the -VolumeType parameter.

     ```azurepowershell-interactive
     $sequenceVersion = [Guid]::NewGuid();
     $rgName = 'MySecureRg';
     $vmName = 'MyExtraSecureVM';
     $KeyVaultName = 'MySecureVault';
     $keyEncryptionKeyName = 'MyKeyEncryptionKey';
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
     $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
     $keyEncryptionKeyUrl = (Get-AzureKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;

     Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId -VolumeType "All" –SequenceVersion $sequenceVersion;

     ```

    >[!NOTE]
    > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br> 
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 

### Enable encryption on a newly added disk with Azure CLI
 The Azure CLI command will automatically provide a new sequence version for you when you run the command to enable encryption. The example uses "All" for the volume-type parameter. You may need to change the volume-type parameter to OS if you're only encrypting the OS disk. In contrast to Powershell syntax, the CLI does not require the user to provide a unique sequence version when enabling encryption. The CLI automatically generates and uses its own unique sequence version value.   

-  **Encrypt a running VM:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --disk-encryption-keyvault "MySecureVault" --volume-type "All"
     ```

- **Encrypt a running VM using KEK:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --disk-encryption-keyvault  "MySecureVault" --key-encryption-key "MyKEK_URI" --key-encryption-keyvault "MySecureVaultContainingTheKEK" --volume-type "All"
     ```


## Disable encryption
You can disable encryption using Azure PowerShell, the Azure CLI, or with a Resource Manager template. Disabling data disk encryption on Windows VM when both OS and data disks have been encrypted doesn’t work as expected. Disable encryption on all disks instead.

- **Disable disk encryption with Azure PowerShell:** To disable the encryption, use the [Disable-Azure​RmVMDisk​Encryption](/powershell/module/azurerm.compute/disable-azurermvmdiskencryption) cmdlet. 
     ```azurepowershell-interactive
     Disable-AzureRmVMDiskEncryption -ResourceGroupName 'MySecureRG' -VMName 'MySecureVM' -VolumeType "all"
     ```

- **Disable encryption with the Azure CLI:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. 
     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MySecureRg" --volume-type "all"
     ```
- **Disable encryption with a Resource Manager template:** 

    1. Click **Deploy to Azure** from the [Disable disk encryption on running Windows VM](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-running-windows-vm-without-aad) template.
    2. Select the subscription, resource group, location, VM, volume type, legal terms, and agreement.
    3.  Click **Purchase** to disable disk encryption on a running Windows VM. 

## Next steps

> [!div class="nextstepaction"]
> [Enable Azure Disk Encryption for Linux](azure-security-disk-encryption-linux.md)
