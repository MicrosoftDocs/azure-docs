---
title: Azure Disk Encryption for Windows
description: Deploys Azure Disk Encryption to a Windows virtual machine using a virtual machine extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: disks
author: ejarvi
ms.author: ejarvi
ms.collection: windows
ms.date: 03/19/2020

---
# Azure Disk Encryption for Windows (Microsoft.Azure.Security.AzureDiskEncryption)

## Overview

Azure Disk Encryption uses BitLocker to provide full disk encryption on Azure virtual machines running Windows.  This solution is integrated with Azure Key Vault to manage disk encryption keys and secrets in your key vault subscription.

## Prerequisites

For a full list of prerequisites, see [Azure Disk Encryption for Windows VMs](../windows/disk-encryption-overview.md), specifically the following sections:

- [Supported VMs and operating systems](../windows/disk-encryption-overview.md#supported-vms-and-operating-systems)
- [Networking requirements](../windows/disk-encryption-overview.md#networking-requirements)
- [Group Policy requirements](../windows/disk-encryption-overview.md#group-policy-requirements)

## Extension Schema

There are two versions of extension schema for Azure Disk Encryption (ADE):
- v2.2 - A newer recommended schema that does not use Microsoft Entra properties.
- v1.1 - An older schema that requires Microsoft Entra properties.

To select a target schema, the `typeHandlerVersion` property must be set equal to version of schema you want to use.

<a name='schema-v22-no-azure-ad-recommended'></a>

### Schema v2.2: No Microsoft Entra ID (recommended)

The v2.2 schema is recommended for all new VMs and does not require Microsoft Entra properties.

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2019-07-01",
  "location": "[location]",
  "properties": {
        "publisher": "Microsoft.Azure.Security",
        "type": "AzureDiskEncryption",
        "typeHandlerVersion": "2.2",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "EncryptionOperation": "[encryptionOperation]",
          "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
          "KeyVaultURL": "[keyVaultURL]",
          "KeyVaultResourceId": "[keyVaultResourceID]",
          "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
          "KekVaultResourceId": "[kekVaultResourceID]",
          "SequenceVersion": "sequenceVersion]",
          "VolumeType": "[volumeType]"
        }
  }
}
```

<a name='schema-v11-with-azure-ad'></a>

### Schema v1.1: with Microsoft Entra ID

The 1.1 schema requires `aadClientID` and either `aadClientSecret` or `AADClientCertificate` and is not recommended for new VMs.

Using `aadClientSecret`:

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2019-07-01",
  "location": "[location]",
  "properties": {
    "protectedSettings": {
      "AADClientSecret": "[aadClientSecret]"
    },
    "publisher": "Microsoft.Azure.Security",
    "type": "AzureDiskEncryption",
    "typeHandlerVersion": "1.1",
    "settings": {
      "AADClientID": "[aadClientID]",
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyVaultURL": "[keyVaultURL]",
      "KeyVaultResourceId": "[keyVaultResourceID]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KekVaultResourceId": "[kekVaultResourceID]",
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
      "AADClientCertificate": "[aadClientCertificate]"
    },
    "publisher": "Microsoft.Azure.Security",
    "type": "AzureDiskEncryption",
    "typeHandlerVersion": "1.1",
    "settings": {
      "AADClientID": "[aadClientID]",
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyVaultURL": "[keyVaultURL]",
      "KeyVaultResourceId": "[keyVaultResourceID]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KekVaultResourceId": "[kekVaultResourceID]",
      "SequenceVersion": "sequenceVersion]",
      "VolumeType": "[volumeType]"
    }
  }
}
```


### Property values

Note: All values are case sensitive.

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2019-07-01 | date |
| publisher | Microsoft.Azure.Security | string |
| type | AzureDiskEncryption | string |
| typeHandlerVersion | 2.2, 1.1 | string |
| (1.1 schema) AADClientID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | guid |
| (1.1 schema) AADClientSecret | password | string |
| (1.1 schema) AADClientCertificate | thumbprint | string |
| EncryptionOperation | EnableEncryption | string |
| (optional - default RSA-OAEP ) KeyEncryptionAlgorithm | 'RSA-OAEP', 'RSA-OAEP-256', 'RSA1_5' | string |
| KeyVaultURL | url | string |
| KeyVaultResourceId | url | string |
| (optional) KeyEncryptionKeyURL | url | string |
| (optional) KekVaultResourceId | url | string |
| (optional) SequenceVersion | uniqueidentifier | string |
| VolumeType | OS, Data, All | string |

## Template deployment

For an example of template deployment based on schema v2.2, see Azure Quickstart Template [encrypt-running-windows-vm-without-aad](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/encrypt-running-windows-vm-without-aad).

For an example of template deployment based on schema v1.1, see Azure Quickstart Template [encrypt-running-windows-vm](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/encrypt-running-windows-vm).

>[!NOTE]
> Also if `VolumeType` parameter is set to All, data disks will be encrypted only if they are properly formatted.

## Troubleshoot and support

### Troubleshoot

For troubleshooting, refer to the [Azure Disk Encryption troubleshooting guide](../windows/disk-encryption-troubleshooting.md).

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/).

Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure Support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps

* For more information about extensions, see [Virtual machine extensions and features for Windows](features-windows.md).
* For more information about Azure Disk Encryption for Windows, see [Windows virtual machines](../../virtual-machines/windows/disk-encryption-overview.md).
