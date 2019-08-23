---
title: Azure Desired State Configuration Extension Handler | Microsoft Docs
description: Upload and apply a PowerShell DSC configuration on an Azure VM using DSC Extension
services: virtual-machines-windows 
documentationcenter: ''
author: bobbytreed 
manager: carmonm 
editor: ''
ms.assetid: 
ms.service: virtual-machines-windows 
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: windows
ms.workload: 
ms.date: 03/26/2018
ms.author: robreed
---
# PowerShell DSC Extension

## Overview

The PowerShell DSC Extension for Windows is published and supported by Microsoft. The extension uploads and applies a PowerShell DSC Configuration on an Azure VM. The DSC Extension calls into PowerShell DSC to enact the received DSC configuration on the VM. This document details the supported platforms, configurations, and deployment options for the DSC virtual machine extension for Windows.

## Prerequisites

### Operating system

The DSC Extension supports the following OS's

Windows Server 2019, Windows Server 2016, Windows Server 2012R2, Windows Server 2012, Windows Server 2008 R2 SP1, Windows Client 7/8.1/10

### Internet connectivity

The DSC extension for Windows requires that the target virtual machine is able to communicate with Azure
and the location of the configuration package (.zip file) if it is stored in a location outside of Azure. 

## Extension schema

The following JSON shows the schema for the settings portion of the DSC Extension in an Azure Resource Manager template. 

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "Microsoft.Powershell.DSC",
  "apiVersion": "2018-10-01",
  "location": "<location>",
  "properties": {
    "publisher": "Microsoft.Powershell",
    "type": "DSC",
    "typeHandlerVersion": "2.77",
    "autoUpgradeMinorVersion": true,
    "settings": {
    	"wmfVersion": "latest",
        "configuration": {
            "url": "http://validURLToConfigLocation",
            "script": "ConfigurationScript.ps1",
            "function": "ConfigurationFunction"
        },
        "configurationArguments": {
            "argument1": "Value1",
            "argument2": "Value2"
        },
        "configurationData": {
            "url": "https://foo.psd1"
        },
        "privacy": {
            "dataCollection": "enable"
        },
    	"advancedOptions": {
			"forcePullAndApply": false,
        	"downloadMappings": {
            	"specificDependencyKey": "https://myCustomDependencyLocation"
        	}
    	} 
	},
    "protectedSettings": {
        "configurationArguments": {
            "parameterOfTypePSCredential1": {
                "userName": "UsernameValue1",
                "password": "PasswordValue1"
            },
            "parameterOfTypePSCredential2": {
                "userName": "UsernameValue2",
                "password": "PasswordValue2"
            }
        },
    	"configurationUrlSasToken": "?g!bber1sht0k3n",
    	"configurationDataUrlSasToken": "?dataAcC355T0k3N"
	}
  }
}
```

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2018-10-01 | date |
| publisher | Microsoft.Powershell.DSC | string |
| type | DSC | string |
| typeHandlerVersion | 2.77 | int |

### Settings Property values

| Name | Data Type | Description
| ---- | ---- | ---- |
| settings.wmfVersion | string | Specifies the version of the Windows Management Framework that should be installed on your VM. Setting this property to ‘latest’ will install the most updated version of WMF. The only current possible values for this property are ‘4.0’, ‘5.0’, and ‘latest’. These possible values are subject to updates. The default value is ‘latest’. |
| settings.configuration.url | string | Specifies the URL location from which to download your DSC configuration zip file. If the URL provided requires a SAS token for access, you will need to set the protectedSettings.configurationUrlSasToken property to the value of your SAS token. This property is required if settings.configuration.script and/or settings.configuration.function are defined.
| settings.configuration.script | string | Specifies the file name of the script that contains the definition of your DSC configuration. This script must be in the root folder of the zip file downloaded from the URL specified by the configuration.url property. This property is required if settings.configuration.url and/or settings.configuration.script are defined.
| settings.configuration.function | string | Specifies the name of your DSC configuration. The configuration named must be contained in the script defined by configuration.script. This property is required if settings.configuration.url and/or settings.configuration.function are defined.
| settings.configurationArguments | Collection | Defines any parameters you would like to pass to your DSC configuration. This property will not be encrypted.
| settings.configurationData.url | string | Specifies the URL from which to download your configuration data (.pds1) file to use as input for your DSC configuration. If the URL provided requires a SAS token for access, you will need to set the protectedSettings.configurationDataUrlSasToken property to the value of your SAS token.
| settings.privacy.dataEnabled | string | Enables or disables telemetry collection. The only possible values for this property are ‘Enable’, ‘Disable’, ”, or $null. Leaving this property blank or null will enable telemetry
| settings.advancedOptions.forcePullAndApply | Bool | This setting is designed to enhance the experience of working with the extension to register nodes  with Azure Automation DSC.  If the value is `$true`, the extension will wait for the first run of the configuration pulled from the service before returning success/failure.  If the value is set to $false, the status returned by the extension will only refer to whether the node was registered with Azure Automation State Configuration successfully and the node configuration will not be run during the registration.
| settings.advancedOptions.downloadMappings | Collection | Defines alternate locations to download dependencies such as WMF and .NET

### Protected Settings Property values

| Name | Data Type | Description
| ---- | ---- | ---- |
| protectedSettings.configurationArguments | string | Defines any parameters you would like to pass to your DSC configuration. This property will be encrypted. |
| protectedSettings.configurationUrlSasToken | string | Specifies the SAS token to access the URL defined by configuration.url. This property will be encrypted. |
| protectedSettings.configurationDataUrlSasToken | string | Specifies the SAS token to access the URL defined by configurationData.url. This property will be encrypted. |


## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates.
Templates are ideal when deploying one or more virtual machines that require post deployment configuration.
A sample Resource Manager template that includes the DSC extension for Windows can be found on the
[Azure Quick Start Gallery](https://github.com/Azure/azure-quickstart-templates/blob/master/101-automation-configuration/nested/provisionServer.json#L91).

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension package is downloaded and deployed to this location on the Azure VM
```
C:\Packages\Plugins\{Extension_Name}\{Extension_Version}
```

Extension status file contains the sub status and status success/error codes along with the detailed error and description for each extension run.
```
C:\Packages\Plugins\{Extension_Name}\{Extension_Version}\Status\{0}.Status  -> {0} being the sequence number
```

Extension output logs are logged to the following directory:

```
C:\WindowsAzure\Logs\Plugins\{Extension_Name}\{Extension_Version}
```

### Error codes and their meanings

| Error Code | Meaning | Possible Action |
| :---: | --- | --- |
| 1000 | Generic error | The message for this error is provided by the specific exception in extension logs |
| 52 | Extension Install Error | The message for this error is provided by the specific exception |
| 1002 | Wmf Install Error | Error while installing WMF. |
| 1004 | Invalid Zip Package | Invalid zip ; Error unpacking the zip |
| 1100 | Argument Error | Indicates a problem in the input provided by the user. The message for the error is provided by the specific exception|


### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
