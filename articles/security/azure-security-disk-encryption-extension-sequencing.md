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

In either case, the `provisionAfterExtensions` property designates which extension should be added later in the sequence.

## Sample Azure templates

If, for instance, you wish to have Azure Disk Encryption applied after an extension called "DiskPreparationExtension", put the `provisionAfterExtensions` property in the AzureDiskEncryption extension block:

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
If, on the other hand, you wish to have Azure Disk Encryption applied first, followed by an extention called "DiskDataAccessExtension", put the `provisionAfterExtensions` property in the "DiskDataAccessExtension" block:

```json
"virtualMachineProfile": {
  "extensionProfile": {
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

More in-depth templates can be found [here](https://github.com/Jyotsna-Anand/vmss-templates):
* Apply the Azure Disk Encryption extension after a custom shell script that formats the desk (Linux): [deploy-extseq-linux-ADE-after-customscript.json](https://github.com/Jyotsna-Anand/vmss-templates/blob/master/deploy-extseq-linux-ADE-after-customscript.json)
* Apply the Azure Disk Encryption extension after a custom Powershell script that initializes and formats the disk (Windows): [deploy-extseq-linux-ADE-after-customscript.json](https://github.com/Jyotsna-Anand/vmss-templates/blob/master/deploy-extseq-windows-ADE-after-customscript.json
* Apply the Azure Disk Encryption extension before a custom Powershell script that initializes and formats the disk (Windows): [deploy-extseq-windows-CustomScript-after-ADE.json](https://github.com/Jyotsna-Anand/vmss-templates/blob/master/deploy-extseq-windows-CustomScript-after-ADE.json)


## Next Steps
- For more information on extension sequencing, see [Sequence extension provisioning in virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-extension-sequencing.md).
- For more information on the `provisionAfterExtensions` property, see [Microsoft.Compute virtualMachineScaleSets/extensions template reference](/azure/templates/microsoft.compute/2018-10-01/virtualmachinescalesets/extensions).
