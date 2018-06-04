---
title: Enable Disk encryption for service fabric Linux clusters | Microsoft Docs
description: This article describes how to enable disk encryption for Service Fabric cluster scale set in Azure by using Azure Resource Manager, Azure Key Vault.
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
ms.date: 05/24/2018
ms.author: v-viban

---
# Enable Disk encryption for service fabric Linux cluster nodes 
> [!div class="op_single_selector"]
> * [Disk Encryption for Linux](service-fabric-enable-azure-disk-encryption-linux.md)
> * [Disk Encryption for Windows](service-fabric-enable-azure-disk-encryption-windows.md)
>
>

Follow the steps below to enable disk encryption on Service Fabric Linux Cluster Nodes. You will need to do these for each of the node types/virtual machine scale sets. For encrypting the nodes, we will leverage the Azure Disk Encryption capability on virtual machine scale sets.

The guide covers the following procedures:

* Key Concepts that you need to be aware off to enable disk encryption on Service Fabric Linux Cluster virtual machine scale set.
* Pre-requisites steps to be followed before enabling disk encryption on Service Fabric Linux Cluster virtual machine scale set.
* Steps to be followed to enable disk encryption on Service Fabric Linux Cluster virtual machine scale set.


## Prerequisites

1. **Self-Registration** - In order to use, virtual machine scale set disk encryption preview requires self-registration
2. You can self-register your subscription by running the following steps: 
```Powershell
Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
```
3. Wait around 10 minutes until the state as 'Registered'. You can check the state by running the following command: 
```Powershell
Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```
4. **Azure Key Vault** - Create a KeyVault in the same subscription and region as the virtual machine scale set and set the access policy   'EnabledForDiskEncryption' on the KeyVault using its PS cmdlet. You can also set the policy using the KeyVault UI in the Azure portal: 
```Powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -EnabledForDiskEncryption
```
5. Install latest [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) , which has the new encryption commands.
6. Install the latest version of [Azure SDK from Azure PowerShell](https://github.com/Azure/azure-powershell/releases) release. The following are the VMSS ADE cmdlets to enable ([Set](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/set-azurermvmssdiskencryptionextension?view=azurermps-4.4.1)) encryption, retrieve ([Get](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/get-azurermvmssvmdiskencryption?view=azurermps-4.4.1)) encryption status and remove ([disable](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/disable-azurermvmssdiskencryption?view=azurermps-4.4.1)) encryption on scale set instance. 

| Command | Version |  Source  |
| ------------- |-------------| ------------|
| Get-AzureRmVmssDiskEncryptionStatus   | 3.4.0 or above | AzureRM.Compute |
| Get-AzureRmVmssVMDiskEncryptionStatus   | 3.4.0 or above | AzureRM.Compute |
| Disable-AzureRmVmssDiskEncryption   | 3.4.0 or above | AzureRM.Compute |
| Get-AzureRmVmssDiskEncryption   | 3.4.0 or above | AzureRM.Compute |
| Get-AzureRmVmssVMDiskEncryption   | 3.4.0 or above | AzureRM.Compute |
| Set-AzureRmVmssDiskEncryptionExtension   | 3.4.0 or above | AzureRM.Compute |


## Supported scenarios for disk encryption
* Virtual machine scale set encryption is supported only for scale sets created with managed disks, and not supported for native (or unmanaged) disk scale sets.
* Virtual machine scale set encryption is supported for Data volume for Linux virtual machine scale set. OS disk encryption is NOT supported in the current preview for Linux.
* Virtual machine scale set VM re-image and upgrade operations are not supported in current preview.


### Create new Linux cluster and enable disk encryption

Use the following commands to create cluster and enable disk encryption using Azure Resource Manager template & self signed certificate.

### Log in to Azure  

```Powershell

Login-AzureRmAccount
Set-AzureRmContext -SubscriptionId <guid>

```

```CLI

azure login
az account set --subscription $subscriptionId

```

#### Use the custom template that you already have 

If you need to author a custom template to suit your needs, it is highly recommended that you start with one of the templates that are available on the [azure service fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master) for Linux Cluster. 

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

Since for Linux virtual machine scale set - only data disk encryption is supported so we need to add data disk using Azure Resource Manager template. Update your template for data disk provision as below:

```Json
   
   "storageProfile": { 
            "imageReference": { 
              "publisher": "[parameters('vmImagePublisher')]", 
              "offer": "[parameters('vmImageOffer')]", 
              "sku": "[parameters('vmImageSku')]", 
              "version": "[parameters('vmImageVersion')]" 
            }, 
            "osDisk": { 
              "caching": "ReadOnly", 
              "createOption": "FromImage", 
              "managedDisk": { 
                "storageAccountType": "[parameters('storageAccountType')]" 
              } 
           }, 
                "dataDisks": [ 
                { 
                    "diskSizeGB": 1023, 
                    "lun": 0, 
                    "createOption": "Empty" 
   
```
 

```Powershell


$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$certOutputFolder="c:\certificates"

$parameterFilePath="c:\templates\templateparam.json"
$templateFilePath="c:\templates\template.json"


New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 

```

Here is the equivalent CLI command to do the same. Change the values in the declare statements to appropriate values. CLI supports all the other parameters that the above powershell command supports.

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

#### Linux data disk mounting
Before we proceed with encryption on Linux virtual machine scale set, we need to make sure added data disk is correctly mounted or not. Login to Linux Cluster VM and run LSBLK command. 
The output should show that added data disk on mount point column.


#### Deploy application to Linux Service Fabric cluster
Follow steps and guidance to [deploy application to your cluster](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-quickstart-containers-linux)


#### Enable disk encryption for Service Fabric Linux Cluster virtual machine scale set created above
 
```Powershell
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

#### Validate if disk encryption enabled for Linux virtual machine scale set.
Get status of an entire virtual machine scale set or any instance VM in scale set. See commands below.
Additionally user can log in to Linux Cluster VM and run LSBLK command. The output should show that added data disk on mount point column and Type column as Crypt for added data disk.

```Powershell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Get-AzureRmVmssDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName

Get-AzureRmVmssVMDiskEncryption -ResourceGroupName $resourceGroupName -VMScaleSetName $VmssName -InstanceId "0"

```

```CLI

az vmss encryption show -g <resourceGroupName> -n <VMSS name>

```



#### Disable disk encryption for Service Fabric Cluster virtual machine scale set 
Disable disk encryption applies to entire virtual machine scale set and not by instance 

```Powershell

$VmssName = "nt1vm"
$resourceGroupName = "mycluster"
Disable-AzureRmVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName

```

```CLI

az vmss encryption disable -g <resourceGroupName> -n <VMSS name>

```


## Next steps
At this point, you have a secure cluster with how to enable/disable disk encryption for Linux Service Fabric Cluster virtual machine scale set. Next, [Disk Encryption for Windows](service-fabric-enable-azure-disk-encryption-windows.md) 

