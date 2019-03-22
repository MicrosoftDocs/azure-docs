---
title: Azure Disk Encryption and Azure virtual machine scale sets extension sequencing 
description: This article provides instructions on enabling Microsoft Azure Disk Encryption for Linux IaaS VMs.
author: msmbaldwin
ms.service: security
ms.topic: article
ms.author: mbaldwin
ms.date: 03/21/2019


---

# Use Azure Disk Encryption with Azure virtual machine scale sets extension sequencing

You can add extensions to an Azure virtual machines scale set in a specified order with [extension sequencing](../virtual-machine-scale-sets/virtual-machine-scale-sets-extension-sequencing.md). Azure disk encryption is one of the extension that can be added as part of a sequence. 

In general, encryption should be applied to a disk:

- After extensions or custom scripts that prepare the disks or volumes.
- Before extensions or custom scripts that access or consume the data on the encrypted disks or volumes.

In either case, the "provisionAfterExtensions" property is used to designate which extension should be added later in the sequence. 

If, for instance, you wish to have the Azure Disk Encryption extention added after an extension that prepares a disk, add the provisionAfterExtensions property to the AzureDiskEncryption extension block:

```json
"virtualMachineProfile": {
  "extensionProfile": {
    "extensions": [
      {
        "name": "DiskPreparationExtension",
        "properties": {
          "publisher": "DiskPreparationExtension.Publisher",
          "settings": {},
          "typeHandlerVersion": "1.0",
          "autoUpgradeMinorVersion": true,
          "type": "DiskPreparationExtension"
        }
      },
      {
        "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
        "name": "AzureDiskEncryption",
        "location": "[resourceGroup().location]",
        "properties": {
          "provisionAfterExtensions": [
            "DiskPreparationExtension"
          ],
          "publisher": "Microsoft.Azure.Security",
          "type": "AzureDiskEncryption",
          "typeHandlerVersion": "2.2",
          "autoUpgradeMinorVersion": true,
          "forceUpdateTag": "[parameters('forceUpdateTag')]",
          "settings": {
            "EncryptionOperation": "EnableEncryption",
            "KeyVaultURL": "[reference(variables('keyVaultResourceId'),'2018-02-14-preview').vaultUri]",
            "KeyVaultResourceId": "[variables('keyVaultResourceID')]",
            "KeyEncryptionKeyURL": "[parameters('keyEncryptionKeyURL')]",
            "KekVaultResourceId": "[variables('keyVaultResourceID')]",
            "KeyEncryptionAlgorithm": "[parameters('keyEncryptionAlgorithm')]",
            "VolumeType": "[parameters('volumeType')]",
            "SequenceVersion": "[parameters('sequenceVersion')]"
          }
        }
      }
    ]
  }
}
```
If, on the other hand, you wish to have the Azure Disk Encryption extention added first, add add the provisionAfterExtensions property to the extensions that other extensions:

```json
"virtualMachineProfile":
  {
    "extensionProfile": 
  {
    "extensions": [
      {
        "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
        "name": "AzureDiskEncryption",
        "location": "[resourceGroup().location]",
        "properties": {
          "publisher": "Microsoft.Azure.Security",
          "type": "AzureDiskEncryption",
          "typeHandlerVersion": "2.2",
          "autoUpgradeMinorVersion": true,
          "forceUpdateTag": "[parameters('forceUpdateTag')]",
          "settings": {
            "EncryptionOperation": "EnableEncryption",
            "KeyVaultURL": "[reference(variables('keyVaultResourceId'),'2018-02-14-preview').vaultUri]",
            "KeyVaultResourceId": "[variables('keyVaultResourceID')]",
            "KeyEncryptionKeyURL": "[parameters('keyEncryptionKeyURL')]",
           "KekVaultResourceId": "[variables('keyVaultResourceID')]",
            "KeyEncryptionAlgorithm": "[parameters('keyEncryptionAlgorithm')]",
            "VolumeType": "[parameters('volumeType')]",
            "ResizeOSDisk": "[parameters('resizeOSDisk')]"
          }
        }
      },
      {
        "name": "DiskDataAccessExtension",
        "properties": {
          "provisionAfterExtensions": [
            "AzureDiskEncryption"
          ],
          "publisher": "DiskDataAccessExtension.Publisher",
          "settings": {},
          "typeHandlerVersion": "1.0",
          "autoUpgradeMinorVersion": true,
          "type": "DiskDataAccessExtension"
        }
      },
    ]
  }
}
```

For more information on extension sequencing, see [Sequence extension provisioning in virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-extension-sequencing.md).
