---
title: Azure Disk Encryption for Windows | Microsoft Docs
description: Deploys Azure Disk Encryption to a Windows virtual machine using a virtual machine extension.
services: virtual-machines-windows 
documentationcenter: ''
author: ejarvi 
manager: jeconnoc 
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

Azure Disk Encryption leverages Bitlocker to provide full disk encryption on Azure virtual machines running Windows.  This solution is integrated with Azure Key Vault to manage disk encryption keys and secrets in your key vault subscription. 

## Prerequisites

For a full list of prerequisites, see [Azure Disk Encryption Prerequisites](
../../security/azure-security-disk-encryption-prerequisites.md).

### Operating system

For a list of currently Windows versions, see [Azure Disk Encryption Prerequisites](../../security/azure-security-disk-encryption-prerequisites.md).

### Internet connectivity

Azure Disk Encryption requires Internet connectivity for access to Active Directory, Key Vault, Storage, and package management endpoints.  For more on network security settings, see [Azure Disk Encryption Prerequisites](
../../security/azure-security-disk-encryption-prerequisites.md).

## Extension schema

```json
{
  "type": "extensions",
  "name": "[name]",
  "apiVersion": "2015-06-15",
  "location": "[location]",
  "properties": {
	"protectedSettings": {
	  "AADClientSecret": "[aadClientSecret]",
	},
	"publisher": "Microsoft.Azure.Security",
	"settings": {
	  "AADClientID": "[aadClientID]",
	  "EncryptionOperation": "[encryptionOperation]",
	  "KeyEncryptionAlgorithm": "[keyEncryptionAlgorithm]",
	  "KeyEncryptionKeyURL": "[keyEncryptionKeyURL]",
	  "KeyVaultURL": "[keyVaultURL]",
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
| type | AzureDiskEncryptionForWindows| string |
| typeHandlerVersion | 1.0, 2.2 (VMSS) | int |
| (optional) AADClientID | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | guid | 
| (optional) AADClientSecret | password | string |
| (optional) AADClientCertificate | thumbprint | string |
| EncryptionOperation | EnableEncryption | string | 
| KeyEncryptionAlgorithm | RSA-OAEP | string |
| KeyEncryptionKeyURL | url | string |
| KeyVaultURL | url | string |
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