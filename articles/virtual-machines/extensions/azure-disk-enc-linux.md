---
title: Azure Disk Encryption for Linux 
description: Deploys Azure Disk Encryption for Linux to a virtual machine using a virtual machine extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: disks
author: ejarvi 
ms.author: ejarvi
ms.date: 03/19/2020
ms.collection: linux

---
# Azure Disk Encryption for Linux (Microsoft.Azure.Security.AzureDiskEncryptionForLinux)

## Overview

Azure Disk Encryption leverages the dm-crypt subsystem in Linux to provide full disk encryption on [select Azure Linux distributions](../linux/disk-encryption-overview.md).  This solution is integrated with Azure Key Vault to manage disk encryption keys and secrets.

## Prerequisites

For a full list of prerequisites, see [Azure Disk Encryption for Linux VMs](../linux/disk-encryption-overview.md), specifically the following sections:

- [Supported VMs and operating systems](../linux/disk-encryption-overview.md#supported-vms-and-operating-systems)
- [Additional VM requirements](../linux/disk-encryption-overview.md#additional-vm-requirements)
- [Networking requirements](../linux/disk-encryption-overview.md#networking-requirements)
- [Encryption key storage requirements](../linux/disk-encryption-overview.md#encryption-key-storage-requirements)

## Extension Schema

There are two versions of extension schema for Azure Disk Encryption (ADE):
- v1.1 - A newer recommended schema that does not use Azure Active Directory (AAD) properties.
- v0.1 - An older schema that requires Azure Active Directory (AAD) properties. 

To select a target schema, the `typeHandlerVersion` property must be set equal to version of schema you want to use.

### Schema v1.1: No AAD (recommended)

The v1.1 schema is recommended and does not require Azure Active Directory (AAD) properties.

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2019-07-01",
  "location": "[location]",
  "properties": {
        "publisher": "Microsoft.Azure.Security",
        "type": "AzureDiskEncryptionForLinux",
        "typeHandlerVersion": "1.1",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "DiskFormatQuery": "[diskFormatQuery]",
          "EncryptionOperation": "[encryptionOperation]",
          "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
          "KeyVaultURL": "[keyVaultURL]",
          "KeyVaultResourceId": "[KeyVaultResourceId]",
          "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
          "KekVaultResourceId": "[KekVaultResourceId",
          "SequenceVersion": "sequenceVersion]",
          "VolumeType": "[volumeType]"
        }
  }
}
```


### Schema v0.1: with AAD 

The 0.1 schema requires `AADClientID` and either `AADClientSecret` or `AADClientCertificate`.

Using `AADClientSecret`:

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2019-07-01",
  "location": "[location]",
  "properties": {
    "protectedSettings": {
      "AADClientSecret": "[aadClientSecret]",
      "Passphrase": "[passphrase]"
    },
    "publisher": "Microsoft.Azure.Security",
    "type": "AzureDiskEncryptionForLinux",
    "typeHandlerVersion": "0.1",
    "settings": {
      "AADClientID": "[aadClientID]",
      "DiskFormatQuery": "[diskFormatQuery]",
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KeyVaultURL": "[keyVaultURL]",
      "SequenceVersion": "sequenceVersion]",
      "VolumeType": "[volumeType]"
    }
  }
}
```

Using `AADClientCertificate`:

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2019-07-01",
  "location": "[location]",
  "properties": {
    "protectedSettings": {
      "AADClientCertificate": "[aadClientCertificate]",
      "Passphrase": "[passphrase]"
    },
    "publisher": "Microsoft.Azure.Security",
    "type": "AzureDiskEncryptionForLinux",
    "typeHandlerVersion": "0.1",
    "settings": {
      "AADClientID": "[aadClientID]",
      "DiskFormatQuery": "[diskFormatQuery]",
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KeyVaultURL": "[keyVaultURL]",
      "SequenceVersion": "sequenceVersion]",
      "VolumeType": "[volumeType]"
    }
  }
}
```


### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2019-07-01 | date |
| publisher | Microsoft.Azure.Security | string |
| type | AzureDiskEncryptionForLinux | string |
| typeHandlerVersion | 1.1, 0.1 | int |
| (0.1 schema) AADClientID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | guid | 
| (0.1 schema) AADClientSecret | password | string |
| (0.1 schema) AADClientCertificate | thumbprint | string |
| (optional) (0.1 schema) Passphrase | password | string |
| DiskFormatQuery | {"dev_path":"","name":"","file_system":""} | JSON dictionary |
| EncryptionOperation | EnableEncryption, EnableEncryptionFormatAll | string | 
| (optional - default RSA-OAEP ) KeyEncryptionAlgorithm | 'RSA-OAEP', 'RSA-OAEP-256', 'RSA1_5' | string |
| KeyVaultURL | url | string |
| KeyVaultResourceId | url | string |
| (optional) KeyEncryptionKeyURL | url | string |
| (optional) KekVaultResourceId | url | string |
| (optional) SequenceVersion | uniqueidentifier | string |
| VolumeType | OS, Data, All | string |

## Template deployment

For an example of template deployment based on schema v1.1, see the Azure Quickstart Template [201-encrypt-running-linux-vm-without-aad](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-linux-vm-without-aad).

For an example of template deployment based on schema v0.1, see the Azure Quickstart Template [201-encrypt-running-linux-vm](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-linux-vm).

>[!WARNING]
> - If you have previously used Azure Disk Encryption with Azure AD to encrypt a VM, you must continue use this option to encrypt your VM.
> - When encrypting Linux OS volumes, the VM should be considered unavailable. We strongly recommend to avoid SSH logins while the encryption is in progress to avoid issues blocking any open files that will need to be accessed during the encryption process. To check progress, use the [Get-AzVMDiskEncryptionStatus](/powershell/module/az.compute/get-azvmdiskencryptionstatus) PowerShell cmdlet or the [vm encryption show](/cli/azure/vm/encryption#az_vm_encryption_show) CLI command. This process can be expected to take a few hours for a 30GB OS volume, plus additional time for encrypting data volumes. Data volume encryption time will be proportional to the size and quantity of the data volumes unless the encrypt format all option is used. 
> - Disabling encryption on Linux VMs is only supported for data volumes. It is not supported on data or OS volumes if the OS volume has been encrypted. 

>[!NOTE]
> Also if `VolumeType` parameter is set to All, data disks will be encrypted only if they are properly mounted.

## Troubleshoot and support

### Troubleshoot

For troubleshooting, refer to the [Azure Disk Encryption troubleshooting guide](../linux/disk-encryption-troubleshooting.md).

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). 

Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure Support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps

* For more information about VM extensions, see [Virtual machine extensions and features for Linux](features-linux.md).
* For more information about Azure Disk Encryption for Linux, see [Linux virtual machines](../../security/fundamentals/azure-disk-encryption-vms-vmss.md#linux-virtual-machines).