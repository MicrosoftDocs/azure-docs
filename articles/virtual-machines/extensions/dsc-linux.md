---
title: Azure DSC extension for Linux
description: Installs OMI and DSC packages to allow an Azure Linux VM to be configured using Desired State Configuration.
services: virtual-machines-linux 
documentationcenter: ''
author: bobbytreed
manager: carmonm 
editor: ''
ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/12/2018
ms.author: robreed
---
# DSC extension for Linux (Microsoft.OSTCExtensions.DSCForLinux)

Desired State Configuration (DSC) is a management platform that you can use to manage your IT and development infrastructure with configuration as code.

> [!NOTE]
> The DSC extension for Linux and the [Azure Monitor virtual machine extension for Linux](/azure/virtual-machines/extensions/oms-linux) currently present a conflict
> and aren't supported in a side-by-side configuration. Don't use the two solutions together on the same VM.

The DSCForLinux extension is published and supported by Microsoft. The extension installs the OMI and DSC agent on Azure virtual machines. The DSC extension can also do the following actions:


- Register the Linux VM to an Azure Automation account to pull configurations from the Azure Automation service (Register ExtensionAction).
- Push MOF configurations to the Linux VM (Push ExtensionAction).
- Apply meta MOF configuration to the Linux VM to configure a pull server in order to pull node configuration (Pull ExtensionAction).
- Install custom DSC modules to the Linux VM (Install ExtensionAction).
- Remove custom DSC modules from the Linux VM (Remove ExtensionAction).

 

## Prerequisites

### Operating system

The DSC Linux extension supports all the [Linux distributions endorsed on Azure](/azure/virtual-machines/linux/endorsed-distros) except:

| Distribution | Version |
|---|---|
| Debian | All versions |
| Ubuntu| 18.04 |
 
### Internet connectivity

The DSCForLinux extension requires the target virtual machine to be connected to the internet. For example, the Register extension requires connectivity to the Automation service. 
For other actions such as Pull, Pull, Install requires connectivity to Azure Storage and GitHub. It depends on settings provided by the customer.

## Extension schema

### Public configuration

Here are all the supported public configuration parameters:

* `FileUri`: (optional, string) The uri of the MOF file, meta MOF file, or custom resource zip file.
* `ResourceName`: (optional, string) The name of the custom resource module.
* `ExtensionAction`: (optional, string) Specifies what an extension does. Valid values are Register, Push, Pull, Install, and Remove. If not specified, it's considered a Push Action by default.
* `NodeConfigurationName`: (optional, string) The name of a node configuration to apply.
* `RefreshFrequencyMins`: (optional, int) Specifies how often (in minutes) that DSC attempts to obtain the configuration from the pull server. 
       If configuration on the pull server differs from the current one on the target node, it's copied to the pending store and applied.
* `ConfigurationMode`: (optional, string) Specifies how DSC should apply the configuration. Valid values are ApplyOnly, ApplyAndMonitor, and ApplyAndAutoCorrect.
* `ConfigurationModeFrequencyMins`: (optional, int) Specifies how often (in minutes) DSC ensures that the configuration is in the desired state.

> [!NOTE]
> If you use a version earlier than 2.3, the mode parameter is the same as ExtensionAction. Mode seems to be an overloaded term. To avoid confusion, ExtensionAction is used from version 2.3 onward. For backward compatibility, the extension supports both mode and ExtensionAction. 
>

### Protected configuration

Here are all the supported protected configuration parameters:

* `StorageAccountName`: (optional, string) The name of the storage account that contains the file
* `StorageAccountKey`: (optional, string) The key of the storage account that contains the file
* `RegistrationUrl`: (optional, string) The URL of the Azure Automation account
* `RegistrationKey`: (optional, string) The access key of the Azure Automation account


## Scenarios

### Register an Azure Automation account
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

PowerShell format
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

### Apply an MOF configuration file (in an Azure storage account) to the VM

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

PowerShell format
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


### Apply an MOF configuration file (in public storage) to the VM

public.json
```json
{
  "FileUri": "<mof-file-uri>"
}
```

PowerShell format
```powershell
$publicConfig = '{
  "FileUri": "<mof-file-uri>"
}'
```

### Apply a meta MOF configuration file (in an Azure storage account) to the VM

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

PowerShell format
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
PowerShell format
```powershell
$publicConfig = '{
  "FileUri": "<meta-mof-file-uri>",
  "ExtensionAction": "Pull"
}'
```

### Install a custom resource module (a zip file in an Azure storage account) to the VM
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

PowerShell format
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

### Install a custom resource module (a zip file in public storage) to the VM
public.json
```json
{
  "ExtensionAction": "Install",
  "FileUri": "<resource-zip-file-uri>"
}
```
PowerShell format
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
PowerShell format
```powershell
$publicConfig = '{
  "ResourceName": "<resource-name>",
  "ExtensionAction": "Remove"
}'
```

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when you deploy one or more virtual machines that require post-deployment configuration, such as onboarding to Azure Automation. 

The sample Resource Manager template is [201-dsc-linux-azure-storage-on-ubuntu](https://github.com/Azure/azure-quickstart-templates/tree/master/201-dsc-linux-azure-storage-on-ubuntu) and [201-dsc-linux-public-storage-on-ubuntu](https://github.com/Azure/azure-quickstart-templates/tree/master/201-dsc-linux-public-storage-on-ubuntu).

For more information about the Azure Resource Manager template, see [Authoring Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md).


## Azure CLI deployment

### Use [Azure CLI][azure-cli]
Before you deploy the DSCForLinux extension, configure your `public.json` and `protected.json` according to the different scenarios in section 3.

#### Classic
The classic deployment mode is also called Azure Service Management mode. You can switch to it by running:
```
$ azure config mode asm
```

You can deploy the DSCForLinux extension by running:
```
$ azure vm extension set <vm-name> DSCForLinux Microsoft.OSTCExtensions <version> \
--private-config-path protected.json --public-config-path public.json
```

To learn the latest extension version available, run:
```
$ azure vm extension list
```

#### Resource Manager
You can switch to Azure Resource Manager mode by running:
```
$ azure config mode arm
```

You can deploy the DSCForLinux extension by running:
```
$ azure vm extension set <resource-group> <vm-name> \
DSCForLinux Microsoft.OSTCExtensions <version> \
--private-config-path protected.json --public-config-path public.json
```
> [!NOTE]
> In Azure Resource Manager mode, `azure vm extension list` isn't available for now.
>

### Use [Azure PowerShell][azure-powershell]

#### Classic

You can sign in to your Azure account in Azure Service Management mode by running:

```powershell>
Add-AzureAccount
```

And deploy the DSCForLinux extension by running:

```powershell>
$vmname = '<vm-name>'
$vm = Get-AzureVM -ServiceName $vmname -Name $vmname
$extensionName = 'DSCForLinux'
$publisher = 'Microsoft.OSTCExtensions'
$version = '< version>'
```

Change the content of $privateConfig and $publicConfig according to different scenarios in the previous section.
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

#### Resource Manager

You can sign in to your Azure account in Azure Resource Manager mode by running:

```powershell>
Login-AzAccount
```

To learn more about how to use Azure PowerShell with Azure Resource Manager, see [Manage Azure resources by using Azure PowerShell](../../azure-resource-manager/management/manage-resources-powershell.md).

You can deploy the DSCForLinux extension by running:

```powershell>
$rgName = '<resource-group-name>'
$vmName = '<vm-name>'
$location = '< location>'
$extensionName = 'DSCForLinux'
$publisher = 'Microsoft.OSTCExtensions'
$version = '< version>'
```

Change the content of $privateConfig and $publicConfig according to different scenarios in the previous section.
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

Data about the state of extension deployments can be retrieved from the Azure portal and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command by using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```
/var/log/azure/<extension-name>/<version>/extension.log file.
```

Error code: 51 represents either unsupported distribution or unsupported extension action.
In some cases, DSC Linux extension fails to install OMI when a higher version of OMI already exists in the machine. [error response: (000003)Downgrade not allowed]



### Support

If you need more help at any point in this article, contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure Support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/), and select **Get support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about extensions, see [Virtual machine extensions and features for Linux](features-linux.md).
