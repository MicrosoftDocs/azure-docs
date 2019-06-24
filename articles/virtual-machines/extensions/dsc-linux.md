---
title: Azure DSC Extension for Linux
description: Installs OMI and DSC packages to allow an Azure Linux VM to be configured using Desired State Configuration.
services: virtual-machines-linux 
documentationcenter: ''
author: bobbytreed
manager: carmonm 
editor: ''
ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/12/2018
ms.author: robreed
---
# DSC Extension for Linux (Microsoft.OSTCExtensions.DSCForLinux)

Desired State Configuration (DSC) is a management platform that enables you to manage your IT and development infrastructure with configuration as code.

DSCForLinux Extension is published and supported by Microsoft. The extension installs the OMI and DSC agent on Azure virtual machines. DSC extension can also do the following actions


- Register the Linux VM to Azure Automation account in order to pull configurations from Azure Automation service (Register ExtensionAction)
- Push MOF configurations to the Linux VM (Push ExtensionAction)
- Apply Meta MOF configuration to the Linux VM to configure Pull Server in order to pull Node Configuration (Pull ExtensionAction)
- Install custom DSC modules to the Linux VM (Install ExtensionAction)
- Remove custom DSC modules to the Linux VM (Remove ExtensionAction)

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Prerequisites

### Operating system

The DSC Linux extension supports all the [Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) except:

| Distribution | Version |
|---|---|
| Debian | all versions |
| Ubuntu| 18.04 |
 
### Internet connectivity

The DSCForLinux extension requires that the target virtual machine is connected to the internet. For example, Register extension requires connectivity to Automation service. 
For other actions such as Pull, Pull, Install requires connectivity to azure storage/github. It depends on settings provided by Customer.

## Extension schema

### 1.1 Public configuration

Here are all the supported public configuration parameters:

* `FileUri`: (optional, string) the uri of the MOF file/Meta MOF file/custom resource ZIP file.
* `ResourceName`: (optional, string) the name of the custom resource module
* `ExtensionAction`: (optional, string) Specifies what an extension does. valid values: Register, Push, Pull, Install, Remove. If not specified, it's considered as Push Action by default.
* `NodeConfigurationName`: (optional, string) the name of a node configuration to apply.
* `RefreshFrequencyMins`: (optional, int) Specifies how often (in minutes) DSC attempts to obtain the configuration from the pull server. 
       If configuration on the pull server differs from the current one on the target node, it is copied to the pending store and applied.
* `ConfigurationMode`: (optional, string) Specifies how DSC should apply the configuration. Valid values are: ApplyOnly, ApplyAndMonitor, ApplyAndAutoCorrect.
* `ConfigurationModeFrequencyMins`: (optional, int) Specifies how often (in minutes) DSC ensures that the configuration is in the desired state.

> [!NOTE]
> If you are using a version < 2.3, mode parameter is same as ExtensionAction. Mode seems to be an overloaded term. Therefore to avoid the confusion, ExtensionAction is being used from 2.3 version onwards. For backward compatibility, the extension supports both mode and ExtensionAction. 
>

### 1.2 Protected configuration

Here are all the supported protected configuration parameters:

* `StorageAccountName`: (optional, string) the name of the storage account that contains the file
* `StorageAccountKey`: (optional, string) the key of the storage account that contains the file
* `RegistrationUrl`: (optional, string) the URL of the Azure Automation account
* `RegistrationKey`: (optional, string) the access key of the Azure Automation account


## Scenarios

### Register to Azure Automation account
protected.json
```json
{
  "RegistrationUrl": "<azure-automation-account-url>",
  "RegistrationKey": "<azure-automation-account-key>"
}
```
public.json
```json
{
  "ExtensionAction" : "Register",
  "NodeConfigurationName" : "<node-configuration-name>",
  "RefreshFrequencyMins" : "<value>",
  "ConfigurationMode" : "<ApplyAndMonitor | ApplyAndAutoCorrect | ApplyOnly>",
  "ConfigurationModeFrequencyMins" : "<value>"
}
```

powershell format
```powershell
$privateConfig = '{
  "RegistrationUrl": "<azure-automation-account-url>",
  "RegistrationKey": "<azure-automation-account-key>"
}'

$publicConfig = '{
  "ExtensionAction" : "Register",
  "NodeConfigurationName": "<node-configuration-name>",
  "RefreshFrequencyMins": "<value>",
  "ConfigurationMode": "<ApplyAndMonitor | ApplyAndAutoCorrect | ApplyOnly>",
  "ConfigurationModeFrequencyMins": "<value>"
}'
```

### Apply a MOF configuration file (in Azure Storage Account) to the VM

protected.json
```json
{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}
```

public.json
```json
{
  "FileUri": "<mof-file-uri>",
  "ExtensionAction": "Push"
}
```

powershell format
```powershell
$privateConfig = '{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}'

$publicConfig = '{
  "FileUri": "<mof-file-uri>",
  "ExtensionAction": "Push"
}'
```


### Apply a MOF configuration file (in public storage) to the VM

public.json
```json
{
  "FileUri": "<mof-file-uri>"
}
```

powershell format
```powershell
$publicConfig = '{
  "FileUri": "<mof-file-uri>"
}'
```

### Apply a meta MOF configuration file (in Azure Storage Account) to the VM

protected.json
```json
{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}
```

public.json
```json
{
  "ExtensionAction": "Pull",
  "FileUri": "<meta-mof-file-uri>"
}
```

powershell format
```powershell
$privateConfig = '{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}'

$publicConfig = '{
  "ExtensionAction": "Pull",
  "FileUri": "<meta-mof-file-uri>"
}'
```

### Apply a meta MOF configuration file (in public storage) to the VM
public.json
```json
{
  "FileUri": "<meta-mof-file-uri>",
  "ExtensionAction": "Pull"
}
```
powershell format
```powershell
$publicConfig = '{
  "FileUri": "<meta-mof-file-uri>",
  "ExtensionAction": "Pull"
}'
```

### Install a custom resource module (ZIP file in Azure Storage Account) to the VM
protected.json
```json
{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}
```
public.json
```json
{
  "ExtensionAction": "Install",
  "FileUri": "<resource-zip-file-uri>"
}
```

powershell format
```powershell
$privateConfig = '{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}'

$publicConfig = '{
  "ExtensionAction": "Install",
  "FileUri": "<resource-zip-file-uri>"
}'
```

### Install a custom resource module (ZIP file in public storage) to the VM
public.json
```json
{
  "ExtensionAction": "Install",
  "FileUri": "<resource-zip-file-uri>"
}
```
powershell format
```powershell
$publicConfig = '{
  "ExtensionAction": "Install",
  "FileUri": "<resource-zip-file-uri>"
}'
```

### Remove a custom resource module from the VM
public.json
```json
{
  "ResourceName": "<resource-name>",
  "ExtensionAction": "Remove"
}
```
powershell format
```powershell
$publicConfig = '{
  "ResourceName": "<resource-name>",
  "ExtensionAction": "Remove"
}'
```

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment configuration such as onboarding to Azure Automation. 

The sample Resource Manager template is [201-dsc-linux-azure-storage-on-ubuntu](https://github.com/Azure/azure-quickstart-templates/tree/master/201-dsc-linux-azure-storage-on-ubuntu) and [201-dsc-linux-public-storage-on-ubuntu](https://github.com/Azure/azure-quickstart-templates/tree/master/201-dsc-linux-public-storage-on-ubuntu).

For more details about Azure Resource Manager template, visit [Authoring Azure Resource Manager templates](../../azure-resource-manager/resource-group-authoring-templates.md).


## Azure CLI deployment

### 2.1. Using [**Azure CLI**][azure-cli]
Before deploying DSCForLinux Extension, you should configure your `public.json` and `protected.json`, according to the different scenarios in section 3.

#### 2.1.1. Classic
The Classic mode is also called Azure Service Management mode. You can switch to it by running:
```
$ azure config mode asm
```

You can deploy DSCForLinux Extension by running:
```
$ azure vm extension set <vm-name> DSCForLinux Microsoft.OSTCExtensions <version> \
--private-config-path protected.json --public-config-path public.json
```

To learn the latest extension version available, run:
```
$ azure vm extension list
```

#### 2.1.2. Resource Manager
You can switch to Azure Resource Manager mode by running:
```
$ azure config mode arm
```

You can deploy DSCForLinux Extension by running:
```
$ azure vm extension set <resource-group> <vm-name> \
DSCForLinux Microsoft.OSTCExtensions <version> \
--private-config-path protected.json --public-config-path public.json
```
> [!NOTE]
> In Azure Resource Manager mode, `azure vm extension list` is not available for now.
>

### 2.2. Using [**Azure PowerShell**][azure-powershell]

#### 2.2.1 Classic

You can log in to your Azure account (Azure Service Management mode) by running:

```powershell>
Add-AzureAccount
```

And deploy DSCForLinux Extension by running:

```powershell>
$vmname = '<vm-name>'
$vm = Get-AzureVM -ServiceName $vmname -Name $vmname
$extensionName = 'DSCForLinux'
$publisher = 'Microsoft.OSTCExtensions'
$version = '< version>'
```

You need to change the content of the $privateConfig and $publicConfig according to different scenarios in above section 
```
$privateConfig = '{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}'
```

```
$publicConfig = '{
  "ExtensionAction": "Push",
  "FileUri": "<mof-file-uri>"
}'
```

```
Set-AzureVMExtension -ExtensionName $extensionName -VM $vm -Publisher $publisher `
  -Version $version -PrivateConfiguration $privateConfig `
  -PublicConfiguration $publicConfig | Update-AzureVM
```

#### 2.2.2.Resource Manager

You can log in to your Azure account (Azure Resource Manager mode) by running:

```powershell>
Login-AzAccount
```

Click [**HERE**](../../azure-resource-manager/manage-resources-powershell.md) to learn more about how to use Azure PowerShell with Azure Resource Manager.

You can deploy DSCForLinux Extension by running:

```powershell>
$rgName = '<resource-group-name>'
$vmName = '<vm-name>'
$location = '< location>'
$extensionName = 'DSCForLinux'
$publisher = 'Microsoft.OSTCExtensions'
$version = '< version>'
```

You need to change the content of the $privateConfig and $publicConfig according to different scenarios in above section 
```
$privateConfig = '{
  "StorageAccountName": "<storage-account-name>",
  "StorageAccountKey": "<storage-account-key>"
}'
```

```
$publicConfig = '{
  "ExtensionAction": "Push",
  "FileUri": "<mof-file-uri>"
}'
```

```
Set-AzVMExtension -ResourceGroupName $rgName -VMName $vmName -Location $location `
  -Name $extensionName -Publisher $publisher -ExtensionType $extensionName `
  -TypeHandlerVersion $version -SettingString $publicConfig -ProtectedSettingString $privateConfig
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```
/var/log/azure/<extension-name>/<version>/extension.log file.
```

Error code: 51 represents either unsupported distro or unsupported extension action.
In some cases, DSC Linux extension fails to install OMI when higher version of OMI is already exists in the machine. [error response: (000003)Downgrade not allowed]



### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about extensions, see [Virtual machine extensions and features for Linux](features-linux.md).
