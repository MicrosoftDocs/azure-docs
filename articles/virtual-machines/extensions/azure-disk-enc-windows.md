---
title: Azure Disk Encryption for Windows | Microsoft Docs
description: Deploys Azure Disk Encryption to a Windows virtual machine using a virtual machine extension.
services: virtual-machines-windows 
documentationcenter: ''
author: ejarvi 
manager: gwallace 
editor: ''

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/12/2018
ms.author: ejarvi

---
# Azure Disk Encryption for Windows (Microsoft.Azure.Security.AzureDiskEncryption)

## Overview

Azure Disk Encryption leverages BitLocker to provide full disk encryption on Azure virtual machines running Windows.  This solution is integrated with Azure Key Vault to manage disk encryption keys and secrets in your key vault subscription. 

## Prerequisites

For a full list of prerequisites, see [Azure Disk Encryption Prerequisites](
../../security/azure-security-disk-encryption-prerequisites.md).

### Operating system

For a list of currently Windows versions, see [Azure Disk Encryption Prerequisites](../../security/azure-security-disk-encryption-prerequisites.md).

### Internet connectivity

Azure Disk Encryption requires Internet connectivity for access to Active Directory, Key Vault, Storage, and package management endpoints.  For more on network security settings, see [Azure Disk Encryption Prerequisites](
../../security/azure-security-disk-encryption-prerequisites.md).

## Extension schemata

There are two schemata for Azure Disk Encryption: v1.1, a newer, recommended schema that does not use Azure Active Directory (AAD) properties, and v0.1, an older schema that requires AAD properties. You must use the schema version corresponding to the extension you are using: schema v1.1 for the AzureDiskEncryption extension version 1.1, schema v0.1 for the AzureDiskEncryption extension version 0.1.

### Schema v1.1: No AAD (recommended)

The v1.1 schema is recommended and does not require Azure Active Directory properties.

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2015-06-15",
  "location": "[location]",
  "properties": {
    "publisher": "Microsoft.Azure.Security",
    "settings": {
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KekVaultResourceId": "[keyVaultResourceID]",
      "KeyVaultURL": "[keyVaultURL]",
      "KeyVaultResourceId": "[keyVaultResourceID]",
      "SequenceVersion": "sequenceVersion]",
      "VolumeType": "[volumeType]"
    },
  "type": "AzureDiskEncryption",
  "typeHandlerVersion": "[extensionVersion]"
  }
}
```


### Schema v0.1: with AAD 

The 0.1 schema requires `aadClientID` and either `aadClientSecret` or `AADClientCertificate`.

Using `aadClientSecret`:

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2015-06-15",
  "location": "[location]",
  "properties": {
    "protectedSettings": {
      "AADClientSecret": "[aadClientSecret]"
    },    
    "publisher": "Microsoft.Azure.Security",
    "settings": {
      "AADClientID": "[aadClientID]",
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KekVaultResourceId": "[keyVaultResourceID]",
      "KeyVaultURL": "[keyVaultURL]",
      "KeyVaultResourceId": "[keyVaultResourceID]",
      "SequenceVersion": "sequenceVersion]",
      "VolumeType": "[volumeType]"
    },
  "type": "AzureDiskEncryption",
  "typeHandlerVersion": "[extensionVersion]"
  }
}
```

Using `AADClientCertificate`:

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2015-06-15",
  "location": "[location]",
  "properties": {
    "protectedSettings": {
      "AADClientCertificate": "[aadClientCertificate]"
    },    
    "publisher": "Microsoft.Azure.Security",
    "settings": {
      "AADClientID": "[aadClientID]",
      "EncryptionOperation": "[encryptionOperation]",
      "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
      "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
      "KekVaultResourceId": "[keyVaultResourceID]",
      "KeyVaultURL": "[keyVaultURL]",
      "KeyVaultResourceId": "[keyVaultResourceID]",
      "SequenceVersion": "sequenceVersion]",
      "VolumeType": "[volumeType]"
    },
  "type": "AzureDiskEncryption",
  "typeHandlerVersion": "[extensionVersion]"
  }
}
```


### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2015-06-15 | date |
| publisher | Microsoft.Azure.Security | string |
| type | AzureDiskEncryptionForLinux | string |
| typeHandlerVersion | 0.1, 1.1 | int |
| (0.1 schema) AADClientID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | guid | 
| (0.1 schema) AADClientSecret | password | string |
| (0.1 schema) AADClientCertificate | thumbprint | string |
| DiskFormatQuery | {"dev_path":"","name":"","file_system":""} | JSON dictionary |
| EncryptionOperation | EnableEncryption, EnableEncryptionFormatAll | string | 
| KeyEncryptionAlgorithm | 'RSA-OAEP', 'RSA-OAEP-256', 'RSA1_5' | string |
| KeyEncryptionKeyURL | url | string |
| KeyVaultURL | url | string |
| (optional) Passphrase | password | string | 
| SequenceVersion | uniqueidentifier | string |
| VolumeType | OS, Data, All | string |

## Template deployment
For an example of template deployment, see [
Create a new encrypted Windows VM from gallery image](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-create-new-vm-gallery-image).

## Azure CLI deployment

Instructions can be found in the latest [Azure CLI documentation](/cli/azure/vm/encryption?view=azure-cli-latest). 

## Troubleshoot and support

### Troubleshoot

Refer to the [Azure Disk Encryption troubleshooting guide](../../security/azure-security-disk-encryption-tsg.md).

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about extensions, see [Virtual machine extensions and features for Windows](features-windows.md).
