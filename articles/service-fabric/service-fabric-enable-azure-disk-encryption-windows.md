---
title: Enable disk encryption for Windows clusters 
description: This article describes how to enable disk encryption for Azure Service Fabric cluster nodes by using Azure Key Vault in Azure Resource Manager.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 07/14/2022
---

# Enable disk encryption for Azure Service Fabric cluster nodes in Windows 
> [!div class="op_single_selector"]
> * [Disk Encryption for Windows](service-fabric-enable-azure-disk-encryption-windows.md)
> * [Disk Encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md)
>
>

In this tutorial, you'll learn how to enable disk encryption on Service Fabric cluster nodes in Windows. You'll need to follow these steps for each of the node types and virtual machine scale sets. For encrypting the nodes, we'll use the Azure Disk Encryption capability on virtual machine scale sets.

The guide covers the following topics:

* Key concepts to be aware of when enabling disk encryption on Service Fabric cluster virtual machine scale sets in Windows.
* Steps to be followed before enabling disk encryption on Service Fabric cluster nodes in Windows.
* Steps to be followed to enable disk encryption on Service Fabric  cluster nodes in Windows.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

**Self-registration** 

The disk encryption preview for the virtual machine scale set requires self-registration. Use the following steps: 

1. First, run the following command:
    ```powershell
    Register-AzProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
    ```
2. Wait about 10 minutes until the status reads *Registered*. You can check the status by running the following command: 
    ```powershell
    Get-AzProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
    Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
    ```
**Azure Key Vault** 

1. Create a key vault in the same subscription and region as the scale set, then select the **EnabledForDiskEncryption** access policy on the key vault by using its PowerShell cmdlet. You can also set the policy by using the Key Vault UI in the Azure portal with the following command:
    ```powershell
    Set-AzKeyVaultAccessPolicy -VaultName $keyVaultName -EnabledForDiskEncryption
    ```
2. Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli), which has the new encryption commands.
3. Install the latest version of the [Azure SDK from Azure PowerShell](https://github.com/Azure/azure-powershell/releases) release. Following are the virtual machine scale set Azure Disk Encryption cmdlets to enable ([set](/powershell/module/az.compute/set-azvmssdiskencryptionextension)) encryption, retrieve ([get](/powershell/module/az.compute/get-azvmssvmdiskencryption)) encryption status, and remove ([disable](/powershell/module/az.compute/disable-azvmssdiskencryption)) encryption on the scale set instance.

| Command | Version |  Source  |
| ------------- |-------------| ------------|
| Get-AzVmssDiskEncryptionStatus   | 1.0.0 or later | Az.Compute |
| Get-AzVmssVMDiskEncryptionStatus   | 1.0.0 or later | Az.Compute |
| Disable-AzVmssDiskEncryption   | 1.0.0 or later | Az.Compute |
| Get-AzVmssDiskEncryption   | 1.0.0 or later | Az.Compute |
| Get-AzVmssVMDiskEncryption   | 1.0.0 or later | Az.Compute |
| Set-AzVmssDiskEncryptionExtension   | 1.0.0 or later | Az.Compute |


## Supported scenarios for disk encryption
* Encryption for virtual machine scale sets is supported only for scale sets created with managed disks. It's not supported for native (or unmanaged) disk scale sets.
* Encryption is supported for OS and data volumes in virtual machine scale sets in Windows. Disable encryption is also supported for OS and data volumes for virtual machine scale sets in Windows.
* Virtual machine reimage and upgrade operations for virtual machine scale sets aren't supported in the current preview.


## Create a new cluster and enable disk encryption

Use the following commands to create a cluster and enable disk encryption by using an Azure Resource Manager template and a self-signed certificate.

### Sign in to Azure 
Sign in with the following commands:
```powershell
Login-AzAccount
Set-AzContext -SubscriptionId <guid>

```

```azurecli

azure login
az account set --subscription $subscriptionId

```

### Use the custom template that you already have 

If you need to author a custom template to suit your needs, we highly recommend that you start with one of the templates that are available on the [Azure Service Fabric cluster creation template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master) page. To [customize your cluster template][customize-your-cluster-template] section, see the following guidance.

If you already have a custom template, double-check that all three certificate-related parameters in the template and the parameter file are named as follows and that values are null as follows:

```Json
   "certificateThumbprint": {
      "value": ""
    },
    "sourceVaultValue": {
      "value": ""
    },
    "certificateUrlValue": {
      "value": ""
    },
```


```powershell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$certOutputFolder="c:\certificates"

$parameterFilePath="c:\templates\templateparam.json"
$templateFilePath="c:\templates\template.json"


New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 

```


```azurecli

declare certPassword=""
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare certSubjectName="mylinuxsecure.westus.cloudapp.azure.com"
declare parameterFilePath="c:\mytemplates\linuxtemplateparm.json"
declare templateFilePath="c:\mytemplates\linuxtemplate.json"
declare certOutputFolder="c:\certificates"


az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-output-folder $certOutputFolder --certificate-password $certPassword  \
	--certificate-subject-name $certSubjectName \
    --template-file $templateFilePath --parameter-file $parametersFilePath

```

### Deploy an application to a Service Fabric cluster in Windows
To deploy an application to your cluster, follow the steps and guidance at [Deploy and remove applications using PowerShell](service-fabric-deploy-remove-applications.md).


### Enable disk encryption for the virtual machine scale sets created previously

To enable disk encryption for the virtual machine scale sets you created through the previous steps, run the following commands:
 
```powershell

$VmssName = "nt1vm"
$vaultName = "mykeyvault"
$resourceGroupName = "mycluster"
$KeyVault = Get-AzKeyVault -VaultName $vaultName -ResourceGroupName $rgName
$DiskEncryptionKeyVaultUrl = $KeyVault.VaultUri
$KeyVaultResourceId = $KeyVault.ResourceId

Set-AzVmssDiskEncryptionExtension -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName -DiskEncryptionKeyVaultUrl $DiskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType All

```

```azurecli

az vmss encryption enable -g <resourceGroupName> -n <VMSS name> --disk-encryption-keyvault <KeyVaultResourceId>

```


### Validate if disk encryption is enabled for a virtual machine scale set in Windows
Get the status of an entire virtual machine scale set or any instance in a scale set by running the following commands.

```powershell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Get-AzVmssDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName

Get-AzVmssVMDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName -InstanceId "0"

```

```azurecli

az vmss encryption show -g <resourceGroupName> -n <VMSS name>

```


Additionally, you can sign in to the virtual machine scale set and make sure the drives are encrypted.

### Disable disk encryption for a virtual machine scale set in a Service Fabric cluster 
Disable disk encryption for a virtual machine scale set by running the following commands. Note that disabling disk encryption applies to the entire virtual machine scale set and not an individual instance.

```powershell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Disable-AzVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName

```

```azurecli

az vmss encryption disable -g <resourceGroupName> -n <VMSS name>

```


## Next steps
At this point, you should have a secure cluster and know how to enable and disable disk encryption for Service Fabric cluster nodes and virtual machine scale sets. For similar guidance on Service Fabric cluster nodes in Linux, see [Disk Encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md).

[customize-your-cluster-template]: https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure#creating-a-custom-arm-template
