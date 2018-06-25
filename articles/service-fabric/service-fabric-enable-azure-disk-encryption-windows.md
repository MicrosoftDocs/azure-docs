---
title: Enable disk encryption for Service Fabric Windows clusters | Microsoft Docs
description: This article describes how to enable disk encryption for Service Fabric cluster nodes in Azure by using Azure Resource Manager and Azure Key Vault.
services: service-fabric
documentationcenter: .net
author: v-viban
manager: navya
ms.assetid: 15d0ab67-fc66-4108-8038-3584eeebabaa
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/23/2018
ms.author: v-viban

---
# Enable disk encryption for Service Fabric Windows cluster nodes 
> [!div class="op_single_selector"]
> * [Disk Encryption for Windows](service-fabric-enable-azure-disk-encryption-windows.md)
> * [Disk Encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md)
>
>

Use the following steps to enable disk encryption on Azure Service Fabric Windows cluster nodes. You'll need to do these for each of the node types or virtual machine scale sets. To encrypt the nodes, you'll use the Azure Disk Encryption capability on virtual machine scale sets.

The guide covers the following procedures:

* Key concepts for enabling disk encryption on virtual machine scale sets for Service Fabric Windows clusters.
* Prerequisite steps to follow before you enable disk encryption on virtual machine scale sets for Service Fabric Windows clusters.
* Steps to enable and disable disk encryption on virtual machine scale sets for Service Fabric Windows clusters.


## Prerequisites
1. Self-register your subscription by entering the following command:

   ```PowerShell
   Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
   ```
   
   Wait around 10 minutes until the state is `Registered`. You can check the state by running the following commands:

   ```PowerShell
   Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
   Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
   ```

2. Create a key vault in the same subscription and region as the scale set. Set the access policy `EnabledForDiskEncryption` on the key vault by using its PowerShell cmdlet. You can also set the policy by using the Azure Key Vault UI in the Azure portal.

   ```PowerShell
   Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -EnabledForDiskEncryption
   ```

3. Install [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest), which has the latest encryption commands.

4. Install the latest version of the [Azure SDK from Azure PowerShell](https://github.com/Azure/azure-powershell/releases). Use the following cmdlets to enable ([Set](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/set-azurermvmssdiskencryptionextension?view=azurermps-4.4.1)) encryption, retrieve ([Get](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/get-azurermvmssvmdiskencryption?view=azurermps-4.4.1)) encryption status, and remove ([disable](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/disable-azurermvmssdiskencryption?view=azurermps-4.4.1)) encryption on a scale set instance:

| Command | Version |  Source  |
| ------------- |-------------| ------------|
| Get-AzureRmVmssDiskEncryptionStatus   | 3.4.0 or later | AzureRM.Compute |
| Get-AzureRmVmssVMDiskEncryptionStatus   | 3.4.0 or later | AzureRM.Compute |
| Disable-AzureRmVmssDiskEncryption   | 3.4.0 or later | AzureRM.Compute |
| Get-AzureRmVmssDiskEncryption   | 3.4.0 or later | AzureRM.Compute |
| Get-AzureRmVmssVMDiskEncryption   | 3.4.0 or later | AzureRM.Compute |
| Set-AzureRmVmssDiskEncryptionExtension   | 3.4.0 or later | AzureRM.Compute |


## Supported scenarios for disk encryption
* Virtual machine scale set encryption is supported only for scale sets created with managed disks. It's not supported for native (or unmanaged) disk scale sets.
* Virtual machine scale set encryption is supported for OS and data volumes for Windows virtual machine scale sets. You can enable and disable encryption.
* Virtual machine scale set VM reimage and upgrade operations are not supported in the current preview.


## Create a Windows cluster

Use the following commands to create a cluster and enable disk encryption by using an Azure Resource Manager template and a self-signed certificate.

### Log in to Azure 

```PowerShell

Login-AzureRmAccount
Set-AzureRmContext -SubscriptionId <guid>

```

```CLI

azure login
az account set --subscription $subscriptionId

```

### Use a custom template 

If you need to author a custom template to suit your needs, we recommend that you start with one of the [Azure Service Fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master).

If you already have a custom template, make sure that all the three certificate-related parameters in the template and the parameter file are named as follows. Also make sure that values are null as follows.

```JSON
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


```PowerShell


$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$certOutputFolder="c:\certificates"

$parameterFilePath="c:\templates\templateparam.json"
$templateFilePath="c:\templates\template.json"


New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 

```


```CLI

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

### Deploy an application to the Windows Service Fabric cluster
Follow steps and guidance to [deploy an application to your cluster](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-deploy-remove-applications).


## Enable disk encryption for a virtual machine scale set
Enable disk encryption for the virtual machine scale set that you created earlier for the Service Fabric Windows cluster.
 
```PowerShell

$VmssName = "nt1vm"
$vaultName = "mykeyvault"
$resourceGroupName = "mycluster"
$KeyVault = Get-AzureRmKeyVault -VaultName $vaultName -ResourceGroupName $rgName
$DiskEncryptionKeyVaultUrl = $KeyVault.VaultUri
$KeyVaultResourceId = $KeyVault.ResourceId

Set-AzureRmVmssDiskEncryptionExtension -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName -DiskEncryptionKeyVaultUrl $DiskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType All

```

```CLI

az vmss encryption enable -g <resourceGroupName> -n <VMSS name> --disk-encryption-keyvault <KeyVaultResourceId>

```


## Validate that disk encryption is enabled for a virtual machine scale set
Use the following commands to get the status of an entire virtual machine scale set or any instance VM in a scale set. You can also log in to a VM in the scale set and make sure that drives are encrypted.

```PowerShell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Get-AzureRmVmssDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName

Get-AzureRmVmssVMDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName -InstanceId "0"

```

```CLI

az vmss encryption show -g <resourceGroupName> -n <VMSS name>

```


## Disable disk encryption for a virtual machine scale set 
If you need to disable disk encryption for the virtual machine scale set for a Service Fabric Windows cluster, use the following commands. Disabling disk encryption applies to the entire virtual machine scale set and not by instance. 


```PowerShell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Disable-AzureRmVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName

```

```CLI

az vmss encryption disable -g <resourceGroupName> -n <VMSS name>

```


## Next steps
At this point, you have a secure cluster, and you know how to enable and disable disk encryption for a Service Fabric Windows cluster. Next, learn about [disk encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md). 

