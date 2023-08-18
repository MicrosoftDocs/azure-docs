---
title: Azure Disk Encryption troubleshooting guide
description: This article provides troubleshooting tips for Microsoft Azure Disk Encryption for Windows VMs.
author: msmbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.collection: windows
ms.topic: troubleshooting
ms.author: mbaldwin
ms.date: 01/04/2023

ms.custom: seodec18

---
# Azure Disk Encryption troubleshooting guide

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This guide is for IT professionals, information security analysts, and cloud administrators whose organizations use Azure Disk Encryption. This article is to help with troubleshooting disk-encryption-related problems.

Before taking any of these steps, first ensure that the VMs you're attempting to encrypt are among the [supported VM sizes and operating systems](disk-encryption-overview.md#supported-vms-and-operating-systems), and that you've met all the prerequisites:

- [Networking requirements](disk-encryption-overview.md#networking-requirements)
- [Group policy requirements](disk-encryption-overview.md#group-policy-requirements)
- [Encryption key storage requirements](disk-encryption-overview.md#encryption-key-storage-requirements)

## Troubleshooting 'Failed to send DiskEncryptionData'

When encrypting a VM fails with the error message "Failed to send DiskEncryptionData...", it's usually caused by one of the following situations:

- Having the Key Vault existing in a different region and/or subscription than the Virtual Machine
- Advanced access policies in the Key Vault are not set to allow Azure Disk Encryption
- Key Encryption Key, when in use, has been disabled or deleted in the Key Vault
- Typo in the Resource ID or URL for the Key Vault or Key Encryption Key (KEK)
- Special characters used while naming the VM, data disks, or keys. i.e _VMName, élite, etc.
- Unsupported encryption scenarios
- Network issues that prevent the VM/Host from accessing the required resources

### Suggestions

- Make sure the Key Vault exists in the same region and subscription as the Virtual Machine
- Ensure that you have [set key vault advanced access policies](disk-encryption-key-vault.md#set-key-vault-advanced-access-policies) properly
- If you are using KEK, ensure the key exists and is enabled in Key Vault
- Check VM name, data disks, and keys follow [key vault resource naming restrictions](../../azure-resource-manager/management/resource-name-rules.md#microsoftkeyvault)
- Check for any typos in the Key Vault name or KEK name in your PowerShell or CLI command
>[!NOTE]
   > The syntax for the value of disk-encryption-keyvault parameter is the full identifier string:
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br>
   > The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id]
- Ensure you are not following any [unsupported scenario](disk-encryption-windows.md#unsupported-scenarios)
- Ensure you are meeting [network requirements](disk-encryption-overview.md#networking-requirements) and try again

## Troubleshooting Azure Disk Encryption behind a firewall

When connectivity is restricted by a firewall, proxy requirement, or network security group (NSG) settings, the ability of the extension to perform needed tasks might be disrupted. This disruption can result in status messages such as "Extension status not available on the VM." In expected scenarios, the encryption fails to finish. The sections that follow have some common firewall problems that you might investigate.

### Network security groups
Any network security group settings that are applied must still allow the endpoint to meet the documented network configuration [prerequisites](disk-encryption-overview.md#networking-requirements) for disk encryption.

### Azure Key Vault behind a firewall

When encryption is being enabled with [Azure AD credentials](disk-encryption-windows-aad.md#), the target VM must allow connectivity to both Azure Active Directory endpoints and Key Vault endpoints. Current Azure Active Directory authentication endpoints are maintained in sections 56 and 59 of the [Microsoft 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges) documentation. Key Vault instructions are provided in the documentation on how to [Access Azure Key Vault behind a firewall](../../key-vault/general/access-behind-firewall.md).

### Azure Instance Metadata Service 
The VM must be able to access the [Azure Instance Metadata service](../windows/instance-metadata-service.md) endpoint (`169.254.169.254`) and the [virtual public IP address](../../virtual-network/what-is-ip-address-168-63-129-16.md) (`168.63.129.16`) used for communication with Azure platform resources. Proxy configurations that alter local HTTP traffic to these addresses (for example, adding an X-Forwarded-For header) are not supported.

## Troubleshooting Windows Server 2016 Server Core

On Windows Server 2016 Server Core, the bdehdcfg component isn't available by default. This component is required by Azure Disk Encryption. It's used to split the system volume from OS volume, which is done only once for the life time of the VM. These binaries aren't required during later encryption operations.

To work around this issue, copy the following four files from a Windows Server 2016 Data Center VM to the same location on Server Core:

   ```
   \windows\system32\bdehdcfg.exe
   \windows\system32\bdehdcfglib.dll
   \windows\system32\en-US\bdehdcfglib.dll.mui
   \windows\system32\en-US\bdehdcfg.exe.mui
   ```

1. Enter the following command:

   ```
   bdehdcfg.exe -target default
   ```

1. This command creates a 550-MB system partition. Reboot the system.

1. Use DiskPart to check the volumes, and then proceed.  

For example:

```
DISKPART> list vol

  Volume ###  Ltr  Label        Fs     Type        Size     Status     Info
  ----------  ---  -----------  -----  ----------  -------  ---------  --------
  Volume 0     C                NTFS   Partition    126 GB  Healthy    Boot
  Volume 1                      NTFS   Partition    550 MB  Healthy    System
  Volume 2     D   Temporary S  NTFS   Partition     13 GB  Healthy    Pagefile
```

## Troubleshooting encryption status

The portal may display a disk as encrypted even after it has been unencrypted within the VM.  This situation can occur when low-level commands are used to directly unencrypt the disk from within the VM, instead of using the higher level Azure Disk Encryption management commands.  The higher level commands not only unencrypt the disk from within the VM, but outside of the VM they also update important platform level encryption settings and extension settings associated with the VM.  If these are not kept in alignment, the platform will not be able to report encryption status or provision the VM properly.

To disable Azure Disk Encryption with PowerShell, use [Disable-AzVMDiskEncryption](/powershell/module/az.compute/disable-azvmdiskencryption) followed by [Remove-AzVMDiskEncryptionExtension](/powershell/module/az.compute/remove-azvmdiskencryptionextension). Running Remove-AzVMDiskEncryptionExtension before the encryption is disabled will fail.

To disable Azure Disk Encryption with CLI, use [az vm encryption disable](/cli/azure/vm/encryption). 

## Next steps

In this document, you learned more about some common problems in Azure Disk Encryption and how to troubleshoot those problems. For more information about this service and its capabilities, see the following articles:

- [Apply disk encryption in Microsoft Defender for Cloud](../../security-center/asset-inventory.md)
- [Azure data encryption at rest](../../security/fundamentals/encryption-atrest.md)
