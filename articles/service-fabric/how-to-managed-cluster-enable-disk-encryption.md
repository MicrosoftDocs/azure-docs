---
title: Enable Disk Encryption for Service Fabric managed cluster nodes
description: Learn how to enable disk encryption for Azure Service Fabric managed cluster nodes in Windows using an ARM template.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 07/11/2022
---
# Enable disk encryption for Service Fabric managed cluster nodes

Service Fabric managed clusters support two disk encryption options to help safeguard your data to meet your organizational security and compliance commitments. The recommended option is Encryption at host, but also supports Azure Disk Encryption. Review the [disk encryption options](../virtual-machines/disk-encryption-overview.md) and make sure the selected option meets your needs.


## Enable encryption at host

This encryption method improves on [Azure Disk Encryption](how-to-managed-cluster-enable-disk-encryption.md) by supporting all OS types and images, including custom images, for your VMs by encrypting data in the Azure Storage service. This method does not use your VMs CPU nor does it impact your VMs performance enabling workloads to use all of the available VMs SKU resources.

> [!Note]
> You can not enable on existing node types. You must provision a new node type and migrate your workload.

> [!Note]
> Azure Security Center disk encryption status will show as Unhealthy at this time when using Encryption at Host

Follow these steps and reference this [sample template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-HostEncryption) to deploy a new Service Fabric managed cluster with host encryption enabled.

1. Review the following [restrictions](../virtual-machines/windows/disks-enable-host-based-encryption-powershell.md#restrictions) to validate they meet your requirements.

2. Set up the required [prerequisites](../virtual-machines/windows/disks-enable-host-based-encryption-powershell.md#prerequisites) before cluster deployment.

3. Configure the `enableEncryptionAtHost` property in the managed cluster template for each node type disk encryption is required. The sample is pre-configured.

   * The Service Fabric managed cluster resource apiVersion must be **2021-11-01-preview** or later.

   ```json
        {
               "apiVersion": "[variables('sfApiVersion')]",
               "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
               "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
               "location": "[resourcegroup().location]",
               "properties": {
                   "enableEncryptionAtHost": true
                   ...
               }
       }
   ```

4. Deploy and verify

   Deploy your managed cluster configured with Host Encryption enabled.

   ```powershell
   $clusterName = "<clustername>" 
   $resourceGroupName = "<rg-name>"

   New-AzResourceGroupDeployment -Name $resourceGroupName -ResourceGroupName $resourceGroupName -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json -Debug -Verbose 
   ```

   You can check disk encryption status on a node type's underlying scale set using the `Get-AzVmss` command. First you'll need to find the name of your managed cluster's supporting resource group (containing the underlying virtual network, load balancer, public IP, NSG, scale set(s), and storage accounts). Be sure to modify `NodeTypeNAme` to whatever cluster node type name you wish to check (as specified in your deployment template).

   ```powershell
   $NodeTypeName = "NT2"
   $clustername = <clustername>
   $resourceGroupName = "<rg-name>"
   $supportResourceGroupName = "SFC_" + (Get-AzServiceFabricManagedCluster -ResourceGroupName $resourceGroupName -Name $clustername).ClusterId
   $VMSS = Get-AzVmss -ResourceGroupName $supportResourceGroupName -Name $NodeTypeName
   $VMSS.VirtualMachineProfile.SecurityProfile.EncryptionAtHost
   ```

   The return output should appear similar to this:

   ```console
   $VMSS.VirtualMachineProfile.SecurityProfile.EncryptionAtHost
   True
   ```

## Enable Azure Disk Encryption
Azure Disk Encryption provides volume encryption for the OS and data disks of Azure virtual machines (VMs) by using the DM-Crypt feature in Linux or the BitLocker feature of Windows. ADE is integrated with Azure Key Vault to help you control and manage the disk encryption keys and secrets.

In this guide, you'll learn how to enable disk encryption on Service Fabric managed cluster nodes in Windows using the [Azure Disk Encryption](../virtual-machines/windows/disk-encryption-overview.md) capability for [virtual machine scale sets](../virtual-machine-scale-sets/disk-encryption-azure-resource-manager.md) through Azure Resource Manager (ARM) templates.

1. Register for Azure Disk Encryption

   The disk encryption preview for the virtual machine scale set requires self-registration. Run the following command:

   ```powershell
   Register-AzProviderFeature -FeatureName "UnifiedDiskEncryption" -ProviderNamespace "Microsoft.Compute"
   ```

   Check status of the registration by running:

   ```powershell
   Get-AzProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
   ```

   Once the status changes to *Registered*, you're ready to proceed.

2. Provision a Key Vault for disk encryption

   Azure Disk Encryption requires an Azure Key Vault to control and manage disk encryption keys and secrets. Your Key Vault and Service Fabric managed cluster must reside in the same Azure region and subscription. As long as these requirements are met, you can use either a new or existing Key Vault by enabling it for disk encryption.

3. Create Key Vault with disk encryption enabled

   Run the following commands to create a new Key Vault for disk encryption. Make sure the region for your Key Vault is in the same region as your cluster.

   # [PowerShell](#tab/azure-powershell)

   ```powershell
   $resourceGroupName = "<rg-name>" 
   $keyvaultName = "<kv-name>" 

   New-AzResourceGroup -Name $resourceGroupName -Location eastus2 
   New-AzKeyVault -ResourceGroupName $resourceGroupName -Name $keyvaultName -Location eastus2 -EnabledForDiskEncryption
   ```

   # [Azure CLI](#tab/azure-cli)

   ```azurecli
   $resourceGroupName = "<rg-name>" 
   $keyvaultName = "<kv-name>" 

   az keyvault create --resource-group $resourceGroupName --name $keyvaultName --enabled-for-disk-encryption
   ```

   ---

4. Update existing Key Vault to enable disk encryption

   Run the following commands to enable disk encryption for an existing Key Vault.

   # [PowerShell](#tab/azure-powershell)

   ```powershell
   Set-AzKeyVaultAccessPolicy -ResourceGroupName $resourceGroupName -VaultName $keyvaultName -EnabledForDiskEncryption
   ```

   # [Azure CLI](#tab/azure-cli)

   ```azurecli
   az keyvault update --name keyvaultName --enabled-for-disk-encryption 
   ```

   ---

### Update the template and parameters files for disk encryption

The following step will walk you through the required template changes to enable disk encryption on an [existing managed cluster](tutorial-managed-cluster-deploy.md). Alternately, you can deploy a new Service Fabric managed cluster with disk encryption enabled with this template: https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-DiskEncryption

1. Add the following parameters to the template, substituting your own subscription, resource group name, and vault name under `keyVaultResourceId`:

   ```json
   "parameters": {
    "keyVaultResourceId": { 
      "type": "string", 
      "defaultValue": "/subscriptions/########-####-####-####-############/resourceGroups/<rg-name>/providers/Microsoft.KeyVault/vaults/<kv-name>", 
      "metadata": { 
      "description": "Full resource id of the Key Vault used for disk encryption." 
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

2. Next, add the `AzureDiskEncryption` VM extension to the managed cluster node types in the template:

   ```json
   "properties": { 
   "vmExtensions": [ 
   { 
   "name": "AzureDiskEncryption", 
   "properties": { 
     "publisher": "Microsoft.Azure.Security", 
     "type": "AzureDiskEncryption", 
     "typeHandlerVersion": "2.2", 
     "autoUpgradeMinorVersion": true, 
     "settings": {      
           "EncryptionOperation": "EnableEncryption", 
           "KeyVaultURL": "[reference(parameters('keyVaultResourceId'),'2016-10-01').vaultUri]", 
        "KeyVaultResourceId": "[parameters('keyVaultResourceID')]",
        "VolumeType": "[parameters('volumeType')]" 
        } 
      } 
   } 
   ] 
   } 
   ```

3. Finally, update the parameters file, substituting your own subscription, resource group, and key vault name in *keyVaultResourceId*:

   ```json
   "parameters": { 
   ...
    "keyVaultResourceId": { 
     "value": "/subscriptions/########-####-####-####-############/resourceGroups/<rg-name>/providers/Microsoft.KeyVault/vaults/<kv-name>" 
    },   
    "volumeType": { 
     "value": "All" 
    }    
   } 
   ```

4. Deploy and verify the changes

   Once you're ready, deploy the changes to enable disk encryption on your managed cluster.

   ```powershell
   $clusterName = "<clustername>" 

   New-AzResourceGroupDeployment -Name $resourceGroupName -ResourceGroupName $resourceGroupName .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json -Debug -Verbose 
   ```

   You can check disk encryption status on a node type's underlying scale set using the `Get-AzVmssDiskEncryption` command. First you'll need to find the name of your managed cluster's supporting resource group (containing the underlying virtual network, load balancer, public IP, NSG, scale set(s) and storage accounts). Be sure to modify `VmssName` to whatever cluster node type name you wish to check (as specified in your deployment template).

   ```powershell
   $VmssName = "NT1"
   $clustername = <clustername>
   $supportResourceGroupName = "SFC_" + (Get-AzServiceFabricManagedCluster -ResourceGroupName $resourceGroupName -Name $clustername).ClusterId
   Get-AzVmssDiskEncryption -ResourceGroupName $supportResourceGroupName -VMScaleSetName $VmssName
   ```

   The output should appear similar to this:

   ```console
   ResourceGroupName            : SFC_########-####-####-####-############
   VmScaleSetName               : NT1
   EncryptionEnabled            : True
   EncryptionExtensionInstalled : True
   ```

## Next steps

[Sample: Standard SKU Service Fabric managed cluster, one node type with disk encryption enabled](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-DiskEncryption)

[Azure Disk Encryption for Windows VMs](../virtual-machines/windows/disk-encryption-overview.md)

[Encrypt virtual machine scale sets with Azure Resource Manager](../virtual-machine-scale-sets/disk-encryption-azure-resource-manager.md)
