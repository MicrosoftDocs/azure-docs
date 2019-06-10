---
title: Enable Disk encryption for Azure Service Fabric Windows clusters | Microsoft Docs
description: This article describes how to enable disk encryption for Service Fabric cluster nodes in Azure by using Azure Resource Manager, Azure Key Vault.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: navya
ms.assetid: 15d0ab67-fc66-4108-8038-3584eeebabaa
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/22/2019
ms.author: aljo

---
# Enable Disk encryption for service fabric Windows cluster nodes 
> [!div class="op_single_selector"]
> * [Disk Encryption for Windows](service-fabric-enable-azure-disk-encryption-windows.md)
> * [Disk Encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md)
>
>

Follow the steps below to enable disk encryption on Service Fabric Windows Cluster Nodes. You will need to do these for each of the node types/virtual machine scale sets. For encrypting the nodes, we will leverage the Azure Disk Encryption capability on virtual machine scale sets.

The guide covers the following procedures:

* Key Concepts that you need to be aware off to enable disk encryption on Service Fabric Windows Cluster virtual machine scale set.
* Pre-requisites steps to be followed before enabling disk encryption on Service Fabric Windows Cluster virtual machine scale set.
* Steps to be followed to enable disk encryption on Service Fabric Windows Cluster virtual machine scale set.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites
* **Self-Registration** - In order to use, virtual machine scale set disk encryption preview requires self-registration
* You can self-register your subscription by running the following steps: 
```powershell
Register-AzProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
```
* Wait around 10 minutes until the state as 'Registered'. You can check the state by running the following command: 
```powershell
Get-AzProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```
* **Azure Key Vault** - Create a KeyVault in the same subscription and region as the scale set and set the access policy   'EnabledForDiskEncryption' on the KeyVault using its PS cmdlet. You can also set the policy using the KeyVault UI in the Azure portal: 
```powershell
Set-AzKeyVaultAccessPolicy -VaultName $keyVaultName -EnabledForDiskEncryption
```
* Install latest [Azure CLI](/cli/azure/install-azure-cli) , which has the new encryption commands.
* Install the latest version of [Azure SDK from Azure PowerShell](https://github.com/Azure/azure-powershell/releases) release. Following are the virtual machine scale set ADE cmdlets to enable ([Set](/powershell/module/az.compute/set-azvmssdiskencryptionextension)) encryption, retrieve ([Get](/powershell/module/az.compute/get-azvmssvmdiskencryption)) encryption status and remove ([disable](/powershell/module/az.compute/disable-azvmssdiskencryption)) encryption on scale set instance.

| Command | Version |  Source  |
| ------------- |-------------| ------------|
| Get-AzVmssDiskEncryptionStatus   | 1.0.0 or above | Az.Compute |
| Get-AzVmssVMDiskEncryptionStatus   | 1.0.0 or above | Az.Compute |
| Disable-AzVmssDiskEncryption   | 1.0.0 or above | Az.Compute |
| Get-AzVmssDiskEncryption   | 1.0.0 or above | Az.Compute |
| Get-AzVmssVMDiskEncryption   | 1.0.0 or above | Az.Compute |
| Set-AzVmssDiskEncryptionExtension   | 1.0.0 or above | Az.Compute |


## Supported scenarios for disk encryption
* Virtual machine scale set encryption is supported only for scale sets created with managed disks, and not supported for native (or unmanaged) disk scale sets.
* Virtual machine scale set encryption is supported for OS and Data volumes for Windows virtual machine scale set. Disable encryption is supported for OS and Data volumes for Windows scale set.
* Virtual machine scale set VM reimage and upgrade operations are not supported in current preview.


### Create new cluster and enable disk encryption

Use the following commands to create cluster and enable disk encryption using Azure Resource Manager template & self-signed certificate.

### Sign in to Azure 

```powershell
Login-AzAccount
Set-AzContext -SubscriptionId <guid>

```

```azurecli

azure login
az account set --subscription $subscriptionId

```

#### Use the custom template that you already have 

If you need to author a custom template to suit your needs, it is highly recommended that you start with one of the templates that are available on the [azure service fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Follow guidance and explanations to [customize your cluster template][customize-your-cluster-template] section below.

If you already have a custom template, then make sure to double check, that all the three certificate-related parameters in the template and the parameter file are named as follows and values are null as follows.

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

#### Deploy application to Windows Service Fabric cluster
Follow steps and guidance to [deploy application to your cluster](service-fabric-deploy-remove-applications.md)


#### Enable disk encryption for Service Fabric Cluster virtual machine scale set created above
 
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


#### Validate if disk encryption enabled for Windows virtual machine scale set.
Get status of an entire virtual machine scale set or any instance in scale set. See commands below.
Additionally user can sign in to VM in scale set and make sure drives are encrypted

```powershell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Get-AzVmssDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName

Get-AzVmssVMDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName -InstanceId "0"

```

```azurecli

az vmss encryption show -g <resourceGroupName> -n <VMSS name>

```


#### Disable disk encryption for Service Fabric Cluster virtual machine scale set 
Disable disk encryption applies to entire virtual machine scale set and not by instance 

```powershell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Disable-AzVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName

```

```CLI

az vmss encryption disable -g <resourceGroupName> -n <VMSS name>

```


## Next steps
At this point, you have a secure cluster with how to enable/disable disk encryption for Service Fabric Cluster virtual machine scale set. Next, [Disk Encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md) 

[customize-your-cluster-template]: https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure#creating-a-custom-arm-template
