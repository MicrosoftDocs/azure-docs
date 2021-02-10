---
title: Enable disk encryption for Service Fabric managed cluster (preview) nodes
description: Learn how to enable disk encryption for Azure Service Fabric managed cluster nodes in Windows using an ARM template.
ms.topic: how-to
ms.date: 02/15/2021
---
# Enable disk encryption for Service Fabric managed cluster (preview) nodes

In this guide, you'll learn how to enable disk encryption on Service Fabric managed cluster nodes in Windows using the [Azure Disk Encryption](../virtual-machines/windows/disk-encryption-overview.md) capability for [virtual machine scale sets](../virtual-machine-scale-sets/disk-encryption-azure-resource-manager.md) through Azure Resource Manager (ARM) templates.

> [!IMPORTANT]
> The virtual machine scale set disk encryption preview does not yet support image upgrade or reimage. Do not use if you'll need to upgrade your OS image.

## Register for Azure Disk Encryption

The disk encryption preview for the virtual machine scale set requires self-registration. Run the following command:

```powershell
Register-AzProviderFeature -FeatureName "UnifiedDiskEncryption" -ProviderNamespace "Microsoft.Compute"
```

Check status of the registration by running:

```powershell
Get-AzProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
```

Once the status changes to *Registered*, you're ready to proceed.

## Provision a Key Vault for disk encryption

Azure Disk Encryption requires an Azure Key Vault to control and manage disk encryption keys and secrets. Your Key Vault and Service Fabric managed cluster must reside in the same Azure region and subscription. As long as these requirements are met, you can use either a new or existing Key Vault by enabling it for disk encryption.

### Create Key Vault with disk encryption enabled

Run the following commands to create a new Key Vault for disk encryption.

# [PowerShell](#tab/azure-powershell)

```powershell
$resourceGroup = "<rg-name>" 
$keyvaultName = "<kv-name>" 

New-AzResourceGroup -Name $resourceGroupName -Location southcentralus 
New-AzKeyVault -ResourceGroupName $resourceGroup -Name $keyvaultName -Location southcentralus -EnabledForDiskEncryption
```

# [Azure CLI](#tab/azure-cli)

```azurecli
$resourceGroup = "<rg-name>" 
$keyvaultName = "<kv-name>" 

az keyvault create --resource-group $resourceGroup --name $keyvaultName --enabled-for-disk-encryption
```

### Update existing Key Vault to enable disk encryption

Run the following commands to enable disk encryption for an existing Key Vault.

# [PowerShell](#tab/azure-powershell)

```powershell
# ps 

Set-AzKeyVaultAccessPolicy -ResourceGroupName $resourceGroupName -VaultName $keyvaultName -EnabledForDiskEncryption
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az keyvault update --name keyvaultName --enabled-for-disk-encryption 
```

## Update the template and parameters files for disk encryption

The following step will walk you through the required template changes to enable disk encryption on an [existing managed cluster](tutorial-managed-cluster-deploy.md). Alternately, you can deploy a new Service Fabric managed cluster with disk encryption enabled with this template: https://github.com/Azure-Samples/service-fabric-cluster-templates

1. Add the following parameters to the template, substituting your own subscription, resource group name, and key vault name under `keyVaultResourceId`:

```json
"parameters": { 
…
    "keyVaultResourceId": { 
        "type": "string", 
        "defaultValue": "/subscriptions/########-####-####-####-############/resourceGroups/<rg-name>/providers/Microsoft.KeyVault/vaults/<kv-name>", 
        "metadata": { 
            "description": "Full resource id of the Key Vault used for disk encryption." 
        } 
    }, 
    "keyEncryptionKeyURL": { 
        "type": "string", 
        "metadata": { 
            "description": "URL of the KeyEncryptionKey used to encrypt the volume encryption key. The Valut is assumed to be in keyVaultResourceGroup" 
        } 
    }, 

    "keyEncryptionAlgorithm": { 
        "type": "string", 
        "defaultValue": "RSA-OAEP", 
        "metadata": { 
            "description": "Key encryption algorithm used to wrap with KeyEncryptionKeyURL" 
        }
    }, 
    "volumeType": { 
        "type": "string", 
        "defaultValue": "All", 
        "metadata": { 
            "description": "Type of the volume OS or Data to perform encryption operation" 
        }
    }
}, 
```

1. Next, add the `AzureDiskEncryption` VM extension to the managed cluster node types in the template:

```json
"properties": { 
    "vmExtensions": [ 
        { 
            "name": "AzureDiskEncryption", 
            "properties": { 
                "publisher": "Microsoft.Azure.Security", 
                "type": "AzureDiskEncryption", 
                "typeHandlerVersion": "2.1", 
                "autoUpgradeMinorVersion": true, 
                "settings": {                     
                    "EncryptionOperation": "EnableEncryption", 
                    "KeyVaultURL": "[reference(parameters('keyVaultResourceId'),'2016-10-01').vaultUri]", 
                    "KeyVaultResourceId": "[parameters('keyVaultResourceID')]",
                    "KeyEncryptionAlgorithm": "[parameters('keyEncryptionAlgorithm')]", 
                    "VolumeType": "[parameters('volumeType')]" 
                } 
            } 
        } 
    ] 
} 
```

1. Finally, update the parameters file, substituting your own subscription, resource group, and key vault name in *keyVaultResourceId*:

```json
"parameters": { 
    … 
    "keyVaultResourceId": { 
        "value": "/subscriptions/13ad2c84-84fa-4798-ad71-e70c07af873f/resourceGroups/<rg-name>/providers/Microsoft.KeyVault/vaults/<kv-name>" 
    }, 
    "keyEncryptionKeyURL": { 
        "value": "GEN-KEYVAULT-ENCRYPTION-KEY-URI" 
    }, 
    "keyEncryptionAlgorithm": { 
        "value": "RSA-OAEP" 
    },   
    "volumeType": { 
        "value": "All" 
    }    
} 
```

## Deploy and verify the changes

Once you're ready, deploy the changes to enable disk encryption on your managed cluster.

```powershell
$clusterName = "<clustername>" 

New-AzResourceGroupDeployment -Name $resourceGroupName -ResourceGroupName $resourceGroupName -TemplateFile .\template_diskEncryption.json -TemplateParameterFile \.parameters_diskEncryption.json -Debug -Verbose 
```

Once the deployment completes, the OS and data drives of your cluster nodes will show BitLocker is enabled.

:::image type="content" source="./media/how-to-enable-managed-cluster-disk-encryption/encrypted-drives.png" alt-text="{alt-text}":::

## Next steps

[Azure Disk Encryption for Windows VMs](../virtual-machines/windows/disk-encryption-overview.md)

[Encrypt virtual machine scale sets with Azure Resource Manager](../virtual-machine-scale-sets/disk-encryption-azure-resource-manager.md)
