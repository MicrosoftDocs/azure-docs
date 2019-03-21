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

You can add extensions to an Azure virtual machines scale set in a specified order with [extension sequencing](virtual-machine-scale-sets/virtual-machine-scale-sets-extension-sequencing.md). Azure disk encryption is one of the extension that can be added as part of a sequence. 

In general, encryption should be applied to a disk:

- After extensions or scriptions that prepare the disks or volumes
- Before extensions or scriptions that access or consume the 

- Custom script extensions / Scripts that prepare the disks / volumes should go first and NOT depend on ADE extension.  

ADE extension should depend on the extension that prepares the disks / volumes as ADE extension needs to encrypt them. 

Extensions / scripts that access / consume data in  the disks / volumes  should depend on ADE extension. As the ADE extension unlocks the volumes during reimage and the data consuming extensions can access the data. 




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
        "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
        "name": "CustomScriptExtension",
        "location": "[resourceGroup().location]",
        "properties": {
          "provisionAfterExtensions": [
            "AzureDiskEncryption"
          ],    
          "publisher": "Microsoft.Compute",
          "type": "CustomScriptExtension",
          "typeHandlerVersion": "1.8",
          "autoUpgradeMinorVersion": true,
          "forceUpdateTag": "[parameters('forceUpdateTag')]",
          "settings": {
            "fileUris": [
            "https://raw.githubusercontent.com/SudhakaraReddyEvuri/azure-powershell/suredd-ade-prereqfix/src/ResourceManager/Compute/Commands.Compute/Extension/AzureDiskEncryption/Scripts/FormatDataDisks.ps1"
            ]
          },
          "protectedSettings": {
            "commandToExecute": "powershell -ExecutionPolicy Unrestricted -File FormatDataDisks.ps1"
          }    
        }
      }  
    ]
  }
}
```
```json
"virtualMachineProfile": {
  "extensionProfile": {
    "extensions": [
      {
        "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
        "name": "AzureDiskEncryption",
        "location": "[resourceGroup().location]",
        "properties": {
          "provisionAfterExtensions": [
            "CustomScriptExtension"
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
      },
      {
        "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
        "name": "CustomScriptExtension",
        "location": "[resourceGroup().location]",
        "properties": {
          "publisher": "Microsoft.Compute",
          "type": "CustomScriptExtension",
          "typeHandlerVersion": "1.8",
          "autoUpgradeMinorVersion": true,
          "forceUpdateTag": "[parameters('forceUpdateTag')]",
          "settings": {
            "fileUris": [
              "https://gist.githubusercontent.com/mayank88mahajan/14278adad46ca174af9c313b85b05d45/raw/9846e2f606deb0be65241c94ebeeff9303067d4a/CustomScriptTest.ps1"
            ]
          },
          "protectedSettings": {
            "commandToExecute": "powershell -ExecutionPolicy Unrestricted -File CustomScriptTest.ps1 -message Testing -logFilePath C:\\ExtSequenceTest.log"
          }
        }
      }
    ]
  }
}
```