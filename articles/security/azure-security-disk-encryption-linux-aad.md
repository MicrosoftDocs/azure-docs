---
title: Azure Disk Encryption with Azure AD App Linux IaaS VMs (previous release) | Microsoft Docs
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Linux IaaS VMs.
author: mestew
ms.service: security
ms.subservice: Azure Disk Encryption
ms.topic: article
ms.author: mstewart
ms.date: 09/19/2018

---

# Enable Azure Disk Encryption for Linux IaaS VMs (previous release)

**The new release of Azure Disk Encryption eliminates the requirement for providing an Azure AD application parameter to enable VM disk encryption. With the new release, you are no longer required to provide Azure AD credentials during the enable encryption step. All new VMs must be encrypted without the Azure AD application parameters using the new release. To view instructions to enable VM disk encryption using the new release, see [Azure Disk Encryption for Linux VMS](azure-security-disk-encryption-linux.md). VMs that were already encrypted with Azure AD application parameters are still supported and should continue to be maintained with the AAD syntax.**

You can enable many disk-encryption scenarios, and the steps may vary according to the scenario. The following sections cover the scenarios in greater detail for Linux IaaS VMs. Before you can use disk encryption, the [Azure Disk Encryption prerequisites](azure-security-disk-encryption-prerequisites-aad.md) need to be completed and the [Additional prerequisites for Linux IaaS VMs](azure-security-disk-encryption-prerequisites-aad.md#bkmk_LinuxPrereq) section should be reviewed.

Take a [snapshot](../virtual-machines/windows/snapshot-copy-managed-disk.md) and/or back up  before disks are encrypted. Backups ensure that a recovery option is possible if an unexpected failure occurs during encryption. VMs with managed disks require a backup before encryption occurs. Once a backup is made, you can use the Set-AzureRmVMDiskEncryptionExtension cmdlet to encrypt managed disks by specifying the -skipVmBackup parameter. For more information about how to back up and restore encrypted VMs, see the [Azure Backup](../backup/backup-azure-vms-encryption.md) article. 

>[!WARNING]
 >In order to make sure the encryption secrets don’t cross regional boundaries, Azure Disk Encryption needs the Key Vault and the VMs to be co-located in the same region. Create and use a Key Vault that is in the same region as the VM to be encrypted.</br></br>

> When encrypting Linux OS volumes, the process can take a few hours. It is normal for Linux OS volumes to take longer than data volumes to encrypt. 

>Disabling encryption on Linux VMs is only supported for data volumes. It is not supported on data or OS volumes if the OS volume has been encrypted.  


## <a name="bkmk_NewLinux"></a> Deploy a new Linux IaaS VM with disk encryption enabled 

1. Use the [Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-full-disk-encrypted-rhel) to create a new encrypted Linux IaaS VM. The template will create a new RedHat Linux 7.2 VM with a 200-GB RAID-0 array and full disk encryption using managed disks. On the [FAQ](azure-security-disk-encryption-faq.md#bkmk_LinuxOSSupport) article, you'll notice that some Linux distributions only support encryption for data disks. However, this template provides an opportunity to become familiar with deploying templates and verifying encryption status with multiple methods. 
 
1. Click **Deploy to Azure** on the Azure Resource Manager template.

2. Select the subscription, resource group, resource group location, parameters, legal terms, and agreement. Click **Create** to enable encryption on the existing or running IaaS VM.

3. After you deploy the template, verify the VM encryption status using your preferred method:
     - Verify with the Azure CLI by using the [az vm encryption show](/cli/azure/vm/encryption#az-vm-encryption-show) command. 

         ```azurecli-interactive 
         az vm encryption show --name "MySecureVM" --resource-group "MySecureRg"
         ```

     - Verify with Azure PowerShell by using the [Get-AzureRmVmDiskEncryptionStatus](/powershell/module/azurerm.compute/get-azurermvmdiskencryptionstatus) cmdlet. 

         ```azurepowershell-interactive
         Get-AzureRmVmDiskEncryptionStatus -ResourceGroupName 'MySecureRg' -VMName 'MySecureVM'
         ```

     - Select the VM, then click on **Disks** under the **Settings** heading to verify encryption status in the portal. In the chart under **Encryption**, you'll see if it's enabled. 

| Parameter | Description |
| --- | --- |
| AAD Client ID | Client ID of the Azure AD application that has permissions to write secrets to the key vault. |
| AAD Client Secret | Client secret of the Azure AD application that has permissions to write secrets to your key vault. |
| Key Vault Name | Name of the key vault that the key should be placed. |
| Key Vault Resource Group | Resource group of the key vault. |


## <a name="bkmk_RunningLinux"> </a> Enable encryption on an existing or running IaaS Linux VM
In this scenario, you can enable encryption by using the Resource Manager template, PowerShell cmdlets, or CLI commands. 

>[!IMPORTANT]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or [Azure Backup](../backup/backup-azure-vms-encryption.md) can be used. Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzureRmVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. The Set-AzureRmVMDiskEncryptionExtension command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
>Encrypting or disabling encryption may cause the VM to reboot. 
>

### <a name="bkmk_RunningLinuxCLI"> </a>Enable encryption on an existing or running Linux VM using Azure CLI 
You can enable disk encryption on your encrypted VHD by installing and using The [Azure CLI 2.0](/cli/azure) command-line tool. You can use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or you can install it on your local machine and use it in any PowerShell session. To enable encryption on existing or running IaaS Linux VMs in Azure, use the following CLI commands:

Use the [az vm encryption enable](/cli/azure/vm/encryption#az-vm-encryption-enable) command to enable encryption on a running IaaS virtual machine in Azure.

-  **Encrypt a running VM using a client secret:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --aad-client-id "<my spn created with CLI/my Azure AD ClientID>"  --aad-client-secret "My-AAD-client-secret" --disk-encryption-keyvault "MySecureVault" --volume-type [All|OS|Data]
     ```

- **Encrypt a running VM using KEK to wrap the client secret:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --aad-client-id "<my spn created with CLI which is the Azure AD ClientID>"  --aad-client-secret "My-AAD-client-secret" --disk-encryption-keyvault  "MySecureVault" --key-encryption-key "MyKEK_URI" --key-encryption-keyvault "MySecureVaultContainingTheKEK" --volume-type [All|OS|Data]
     ```

    >[!NOTE]
    > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br> </br>
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 

- **Verify the disks are encrypted:** To check on the encryption status of a IaaS VM, use the [az vm encryption show](/cli/azure/vm/encryption#az-vm-encryption-show) command. 

     ```azurecli-interactive
     az vm encryption show --name "MySecureVM" --resource-group "MySecureRg"
     ```

- **Disable encryption:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. Disabling encryption is only allowed on data volumes for Linux VMs.

     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MySecureRg" --volume-type DATA
     ```

### <a name="bkmk_RunningLinuxPSH"> </a> Enable encryption on an existing or running Linux VM using PowerShell
Use the [Set-AzureRmVMDiskEncryptionExtension](/powershell/module/azurerm.compute/set-azurermvmdiskencryptionextension) cmdlet to enable encryption on a running IaaS virtual machine in Azure. 

-  **Encrypt a running VM using a client secret:** The script below initializes your variables and runs the Set-AzureRmVMDiskEncryptionExtension cmdlet. The resource group, VM, key vault, AAD app, and client secret should have already been created as prerequisites. Replace MySecureRg, MySecureVM, MySecureVault, My-AAD-client-ID, and My-AAD-client-secret with your values. You may need to add the -VolumeType parameter if you're encrypting data disks and not the OS disk. 

     ```azurepowershell-interactive
      $rgName = 'MySecureRg';
      $vmName = 'MySecureVM';
      $aadClientID = 'My-AAD-client-ID';
      $aadClientSecret = 'My-AAD-client-secret';
      $KeyVaultName = 'MySecureVault';
      $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;

      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId;
    ```
- **Encrypt a running VM using KEK to wrap the client secret:** Azure Disk Encryption lets you specify an existing key in your key vault to wrap disk encryption secrets that were generated while enabling encryption. When a key encryption key is specified, Azure Disk Encryption uses that key to wrap the encryption secrets before writing to Key Vault. You may need to add the -VolumeType parameter if you're encrypting data disks and not the OS disk. 

     ```azurepowershell-interactive
     $rgName = 'MySecureRg';
     $vmName = 'MyExtraSecureVM';
     $aadClientID = 'My-AAD-client-ID';
     $aadClientSecret = 'My-AAD-client-secret';
     $KeyVaultName = 'MySecureVault';
     $keyEncryptionKeyName = 'MyKeyEncryptionKey';
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
     $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
     $keyEncryptionKeyUrl = (Get-AzureKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;

     Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId;

     ```

 >[!NOTE]
 > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br> </br>
  > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 
    
- **Verify the disks are encrypted:** To check on the encryption status of a IaaS VM, use the [Get-AzureRmVmDiskEncryptionStatus](/powershell/module/azurerm.compute/get-azurermvmdiskencryptionstatus) cmdlet. 
    
     ```azurepowershell-interactive 
     Get-AzureRmVmDiskEncryptionStatus -ResourceGroupName MySecureRg -VMName MySecureVM
     ```
    
- **Disable disk encryption:** To disable the encryption, use the [Disable-Azure​RmVMDisk​Encryption](/powershell/module/azurerm.compute/disable-azurermvmdiskencryption) cmdlet. Disabling encryption is only allowed on data volumes for Linux VMs.
     
     ```azurepowershell-interactive 
     Disable-AzureRmVMDiskEncryption -ResourceGroupName 'MySecureRG' -VMName 'MySecureVM'
     ```


### <a name="bkmk_RunningLinux"> </a> Enable encryption on an existing or running IaaS Linux VM with a template

You can enable disk encryption on an existing or running IaaS Linux VM in Azure by using the [Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-linux-vm).

1. Click **Deploy to Azure** on the Azure quickstart template.

2. Select the subscription, resource group, resource group location, parameters, legal terms, and agreement. Click **Create** to enable encryption on the existing or running IaaS VM.

The following table lists Resource Manager template parameters for existing or running VMs that use an Azure AD client ID:

| Parameter | Description |
| --- | --- |
| AADClientID | Client ID of the Azure AD application that has permissions to write secrets to the key vault. |
| AADClientSecret | Client secret of the Azure AD application that has permissions to write secrets to your key vault. |
| keyVaultName | Name of the key vault that the key should be uploaded to. You can get it by using the Azure CLI command `az keyvault show --name "MySecureVault" --query resourceGroup`. |
|  keyEncryptionKeyURL | URL of the key encryption key that's used to encrypt the generated key. This parameter is optional if you select **nokek** in the UseExistingKek drop-down list. If you select **kek** in the UseExistingKek drop-down list, you must enter the _keyEncryptionKeyURL_ value. |
| volumeType | Type of volume that the encryption operation is performed on. Valid supported values are _OS_ or _All_ (see supported Linux distros and their versions for OS and data disks in prerequisite section earlier). |
| sequenceVersion | Sequence version of the BitLocker operation. Increment this version number every time a disk-encryption operation is performed on the same VM. |
| vmName | Name of the VM that the encryption operation is to be performed on. |
| passphrase | Type a strong passphrase as the data encryption key. |



## <a name="bkmk_EFA"> </a>Use EncryptFormatAll feature for data disks on Linux IaaS VMs
The **EncryptFormatAll** parameter reduces the time for Linux data disks to be encrypted. Partitions meeting certain criteria will be formatted (with its current file system). Then they'll be remounted back to where it was before command execution. If you wish to exclude a data disk that meets the criteria, you can unmount it before running the command.

 After running this command, any drives that were mounted previously will be formatted. Then the encryption layer will be started on top of the now empty drive. When this option is selected, the ephemeral resource disk attached to the VM will also be encrypted. If the ephemeral drive is reset, it will be reformatted and re-encrypted for the VM by the Azure Disk Encryption solution at the next opportunity.

>[!WARNING]
> EncryptFormatAll shouldn't be used when there is needed data on a VM's data volumes. You may exclude disks from encryption by unmounting them. You should first try out the EncryptFormatAll first on a test VM, understand the feature parameter and its implication before trying it on the production VM. The EncryptFormatAll option formats the data disk and all the data on it will be lost. Before proceeding, verify that disks you wish to exclude are properly unmouted. </br></br>
 >If you’re setting this parameter while updating encryption settings, it might lead to a reboot before the actual encryption. In this case, you will also want to remove the disk you don’t want formatted from the fstab file. Similarly, you should add the partition you want encrypt-formatted to the fstab file before initiating the encryption operation. 

### <a name="bkmk_EFACriteria"> </a> EncryptFormatAll criteria
The parameter goes though all partitions and encrypts them as long as they meet **all** of the criteria below: 
- Is not a root/OS/boot partition
- Is not already encrypted
- Is not a BEK volume
- Is mounted


### <a name="bkmk_EFATemplate"> </a> Use the EncryptFormatAll parameter with a template
To use the EncryptFormatAll option, use any pre-existing Azure Resource Manager template that encrypts a Linux VM and change the **EncryptionOperation** field for the AzureDiskEncryption resource.

1. As an example, use the [Resource Manager template to encrypt a running Linux IaaS VM](https://github.com/vermashi/azure-quickstart-templates/tree/encrypt-format-running-linux-vm/201-encrypt-running-linux-vm). 
2. Click **Deploy to Azure** on the Azure quickstart template.
3. Change the **EncryptionOperation** from **EnableEncryption** to **EnableEncryptionFormatAl**
4. Select the subscription, resource group, resource group location, other parameters, legal terms, and agreement. Click **Create** to enable encryption on the existing or running IaaS VM.


### <a name="bkmk_EFAPSH"> </a> Use the EncryptFormatAll parameter with a PowerShell cmdlet
Use the [Set-AzureRmVMDiskEncryptionExtension](/powershell/module/azurerm.compute/set-azurermvmdiskencryptionextension) cmdlet with the [EncryptFormatAll parameter](https://www.powershellgallery.com/packages/AzureRM/5.0.0). 

**Encrypt a running VM using a client secret and EncryptFormatAll:** As an example, the script below initializes your variables and runs the Set-AzureRmVMDiskEncryptionExtension cmdlet with the EncryptFormatAll parameter. The resource group, VM, key vault, AAD app, and client secret should have already been created as prerequisites. Replace MySecureRg, MySecureVM, MySecureVault, My-AAD-client-ID, and My-AAD-client-secret with your values.
  
   ```azurepowershell-interactive
     $rgName = 'MySecureRg';
     $vmName = 'MySecureVM';
     $aadClientID = 'My-AAD-client-ID';
     $aadClientSecret = 'My-AAD-client-secret';
     $KeyVaultName = 'MySecureVault';
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
     $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
      
     Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -EncryptFormatAll
   ```


### <a name="bkmk_EFALVM"> </a> Use the EncryptFormatAll parameter with Logical Volume Manager (LVM) 
We recommend an LVM-on-crypt setup. For all the following examples, replace the device-path and mountpoints with whatever suits your use-case. This setup can be done as follows:

- Add the data disks that will compose the VM.
- Format, mount, and add these disks to the fstab file.

    1. Format the newly added disk. We use symlinks generated by Azure here. Using symlinks avoids problems related to device names changing. For more information, see the [Troubleshoot Device Names problems](../virtual-machines/linux/troubleshoot-device-names-problems.md) article.
    
         `mkfs -t ext4 /dev/disk/azure/scsi1/lun0`
    
    2. Mount the disks.
         
         `mount /dev/disk/azure/scsi1/lun0 /mnt/mountpoint`
    
    3. Add to fstab.
         
        `echo "/dev/disk/azure/scsi1/lun0 /mnt/mountpoint ext4 defaults,nofail 1 2" >> /etc/fstab`
    
    4. Run the Set-AzureRmVMDiskEncryptionExtension PowerShell cmdlet with -EncryptFormatAll to encrypt these disks.
         ```azurepowershell-interactive
         Set-AzureRmVMDiskEncryptionExtension -ResouceGroupName "MySecureGroup" -VMName "MySecureVM" -DiskEncryptionKeyVaultUrl "https://mykeyvault.vault.azure.net/" -EncryptFormatAll
         ```
    5. Set up LVM on top of these new disks. Note the encrypted drives are unlocked after the VM has finished booting. So, the LVM mounting will also have to be subsequently delayed.




## <a name="bkmk_VHDpre"> </a> New IaaS VMs created from customer-encrypted VHD and encryption keys
In this scenario, you can enable encrypting by using the Resource Manager template, PowerShell cmdlets, or CLI commands. The following sections explain in greater detail the Resource Manager template and CLI commands. 

Use the instructions in the appendix for preparing pre-encrypted images that can be used in Azure. After the image is created, you can use the steps in the next section to create an encrypted Azure VM.

* [Prepare a pre-encrypted Windows VHD](azure-security-disk-encryption-appendix.md#bkmk_preWin)
* [Prepare a pre-encrypted Linux VHD](azure-security-disk-encryption-appendix.md#bkmk_preLinux)

>[!IMPORTANT]
 >It is mandatory to snapshot and/or backup a managed disk based VM instance outside of, and prior to enabling Azure Disk Encryption. A snapshot of the managed disk can be taken from the portal, or [Azure Backup](../backup/backup-azure-vms-encryption.md) can be used. Backups ensure that a recovery option is possible in the case of any unexpected failure during encryption. Once a backup is made, the Set-AzureRmVMDiskEncryptionExtension cmdlet can be used to encrypt managed disks by specifying the -skipVmBackup parameter. The Set-AzureRmVMDiskEncryptionExtension command will fail against managed disk based VMs until a backup has been made and this parameter has been specified. 
>
>Encrypting or disabling encryption may cause the VM to reboot. 



### <a name="bkmk_VHDprePSH"> </a> Use Azure PowerShell to encrypt IaaS VMs with pre-encrypted VHDs 
You can enable disk encryption on your encrypted VHD by using the PowerShell cmdlet [Set-AzureRmVMOSDisk](/powershell/module/azurerm.compute/set-azurermvmosdisk#examples). The example below gives you some common parameters. 

```powershell
$VirtualMachine = New-AzureRmVMConfig -VMName "MySecureVM" -VMSize "Standard_A1"
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name "SecureOSDisk" -VhdUri "os.vhd" Caching ReadWrite -Windows -CreateOption "Attach" -DiskEncryptionKeyUrl "https://mytestvault.vault.azure.net/secrets/Test1/514ceb769c984379a7e0230bddaaaaaa" -DiskEncryptionKeyVaultId "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mytestvault"
New-AzureRmVM -VM $VirtualMachine -ResouceGroupName "MySecureRG"
```

### <a name="bkmk_VHDpreRM"> </a> Use the Resource Manager template to encrypt IaaS VMs with pre-encrypted VHDs 
You can enable disk encryption on your encrypted VHD by using the [Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-create-pre-encrypted-vm).

1. On the Azure quickstart template, click **Deploy to Azure**.

2. Select the subscription, resource group, resource group location, parameters, legal terms, and agreement. Click **Create** to enable encryption on the new IaaS VM.

The following table lists the Resource Manager template parameters for your encrypted VHD:

| Parameter | Description |
| --- | --- |
| newStorageAccountName | Name of the storage account to store the encrypted OS VHD. This storage account should already have been created in the same resource group and same location as the VM. |
| osVhdUri | URI of the OS VHD from the storage account. |
| osType | OS product type (Windows/Linux). |
| virtualNetworkName | Name of the VNet that the VM NIC should belong to. The name should already have been created in the same resource group and same location as the VM. |
| subnetName | Name of the subnet on the VNet that the VM NIC should belong to. |
| vmSize | Size of the VM. Currently, only Standard A, D, and G series are supported. |
| keyVaultResourceID | The ResourceID that identifies the key vault resource in Azure Resource Manager. You can get it by using the PowerShell cmdlet `(Get-AzureRmKeyVault -VaultName &lt;MyKeyVaultName&gt; -ResourceGroupName &lt;MyResourceGroupName&gt;).ResourceId` or using the Azure CLI command `az keyvault show --name "MySecureVault" --query id`|
| keyVaultSecretUrl | URL of the disk-encryption key that's set up in the key vault. |
| keyVaultKekUrl | URL of the key encryption key for encrypting the generated disk-encryption key. |
| vmName | Name of the IaaS VM. |

## Enable encryption on a newly added data disk
You can add a new data disk using [az vm disk attach](../virtual-machines/linux/add-disk.md), or [through the Azure portal](../virtual-machines/linux/attach-disk-portal.md). Before you can encrypt, you need to mount the newly attached data disk first. You must request encryption of the data drive since the drive will be unusable while encryption is in progress. 

### Enable encryption on a newly added disk with Azure CLI
 If the VM was previously encrypted with "All" then the --volume-type parameter should remain All. All includes both OS and data disks. If the VM was previously encrypted with a volume type of "OS", then the --volume-type parameter should be changed to All so that both the OS and the new data disk will be included. If the VM was encrypted with only the volume type of "Data", then it can remain "Data" as demonstrated below. Adding and attaching a new data disk to a VM is not sufficient preparation for encryption. The newly attached disk must also be formatted and properly mounted within the VM prior to enabling encryption. On Linux the disk must be mounted in /etc/fstab with a [persistent block device name](https://docs.microsoft.com/azure/virtual-machines/linux/troubleshoot-device-names-problems).  

In contrast to Powershell syntax, the CLI does not require the user to provide a unique sequence version when enabling encryption. The CLI automatically generates and uses its own unique sequence version value.

-  **Encrypt a running VM using a client secret:** 

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --aad-client-id "<my spn created with CLI/my Azure AD ClientID>"  --aad-client-secret "My-AAD-client-secret" --disk-encryption-keyvault "MySecureVault" --volume-type "Data"
     ```

- **Encrypt a running VM using KEK to wrap the client secret:**

     ```azurecli-interactive
     az vm encryption enable --resource-group "MySecureRg" --name "MySecureVM" --aad-client-id "<my spn created with CLI which is the Azure AD ClientID>"  --aad-client-secret "My-AAD-client-secret" --disk-encryption-keyvault  "MySecureVault" --key-encryption-key "MyKEK_URI" --key-encryption-keyvault "MySecureVaultContainingTheKEK" --volume-type "Data"
     ```

### Enable encryption on a newly added disk with Azure PowerShell
 When using Powershell to encrypt a new disk for Linux, a new sequence version needs to be specified. The sequence version has to be unique. The script below generates a GUID for the sequence version. 
 

-  **Encrypt a running VM using a client secret:** The script below initializes your variables and runs the Set-AzureRmVMDiskEncryptionExtension cmdlet. The resource group, VM, key vault, AAD app, and client secret should have already been created as prerequisites. Replace MySecureRg, MySecureVM, MySecureVault, My-AAD-client-ID, and My-AAD-client-secret with your values. The -VolumeType parameter is set to data disks and not the OS disk. If the VM was previously encrypted with a volume type of "OS" or "All", then the -VolumeType parameter should be changed to All so that both the OS and the new data disk will be included.

     ```azurepowershell-interactive
      $sequenceVersion = [Guid]::NewGuid();
      $rgName = 'MySecureRg';
      $vmName = 'MySecureVM';
      $aadClientID = 'My-AAD-client-ID';
      $aadClientSecret = 'My-AAD-client-secret';
      $KeyVaultName = 'MySecureVault';
      $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
      $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
      $KeyVaultResourceId = $KeyVault.ResourceId;

      Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType 'data' –SequenceVersion $sequenceVersion;
    ```
- **Encrypt a running VM using KEK to wrap the client secret:** Azure Disk Encryption lets you specify an existing key in your key vault to wrap disk encryption secrets that were generated while enabling encryption. When a key encryption key is specified, Azure Disk Encryption uses that key to wrap the encryption secrets before writing to Key Vault. The -VolumeType parameter is set to data disks and not the OS disk. If the VM was previously encrypted with a volume type of "OS" or "All", then the -VolumeType parameter should be changed to All so that both the OS and the new data disk will be included.

     ```azurepowershell-interactive
     $rgName = 'MySecureRg';
     $vmName = 'MyExtraSecureVM';
     $aadClientID = 'My-AAD-client-ID';
     $aadClientSecret = 'My-AAD-client-secret';
     $KeyVaultName = 'MySecureVault';
     $keyEncryptionKeyName = 'MyKeyEncryptionKey';
     $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
     $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
     $KeyVaultResourceId = $KeyVault.ResourceId;
     $keyEncryptionKeyUrl = (Get-AzureKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;

     Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId -VolumeType 'data';
     ```


>[!NOTE]
> The syntax for the value of disk-encryption-keyvault parameter is the full identifier string: 
    /subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name] </br> </br>
> The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
    https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id] 

## Disable encryption for Linux VMs
You can disable encryption using Azure PowerShell, the Azure CLI, or with a Resource Manager template. 

>[!IMPORTANT]
>Disabling encryption with Azure Disk Encryption on Linux VMs is only supported for data volumes. It is not supported on data or OS volumes if the OS volume has been encrypted.  

- **Disable disk encryption with Azure PowerShell:** To disable the encryption, use the [Disable-Azure​RmVMDisk​Encryption](/powershell/module/azurerm.compute/disable-azurermvmdiskencryption) cmdlet. 
     ```azurepowershell-interactive
     Disable-AzureRmVMDiskEncryption -ResourceGroupName 'MySecureRG' -VMName 'MySecureVM' [--volume-type {ALL, DATA, OS}]
     ```

- **Disable encryption with the Azure CLI:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. 
     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MySecureRg" --volume-type [ALL, DATA, OS]
     ```
- **Disable encryption with a Resource Manager Template:** Use the [Disable encryption on a running Linux VM](https://aka.ms/decrypt-linuxvm) template to disable encryption.
     1. Click **Deploy to Azure**.
     2. Select the subscription, resource group, location, VM, legal terms, and agreement.
     3.  Click **Purchase** to disable disk encryption on a running Windows VM. 


## Next steps
> [!div class="nextstepaction"]
> [Enable Azure Disk Encryption for Windows](azure-security-disk-encryption-windows-aad.md)
