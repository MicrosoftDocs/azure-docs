---
title: Desired State Configuration Extension with Azure Resource Manager templates | Microsoft Docs
description: Resource Manager Template definition for Desired State Configuration Extension in Azure
services: virtual-machines-windows
documentationcenter: ''
author: mgreenegit
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: 'dsc'

ms.assetid: b5402e5a-1768-4075-8c19-b7f7402687af
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: na
ms.date: 02/02/2018
ms.author: migreene
---
# Desired State Configuration Extension with Azure Resource Manager templates

This article describes the Azure Resource Manager template for the
[Desired State Configuration extension handler](extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

*Note: you might encounter slightly different schema examples.*
*The change in schema occurred in the October, 2016 release.*
*Details are noted in the section of this page titled*
*[Updating from the Previous Format](##Updating-from-the-Previous-Format)*.

## Template example for a Windows VM

The following snippet goes into the Resource section of the template.
The DSC Extension inherits default extension properties as documented in
[VirtualMachineExtension Class](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.compute.models.virtualmachineextension?view=azure-dotnet.)

```json
            "name": "Microsoft.Powershell.DSC",
            "type": "extensions",
             "location": "[resourceGroup().location]",
             "apiVersion": "2015-06-15",
             "dependsOn": [
                  "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
              ],
              "properties": {
                  "publisher": "Microsoft.Powershell",
                  "type": "DSC",
                  "typeHandlerVersion": "2.72",
                  "autoUpgradeMinorVersion": true,
                  "forceUpdateTag": "[parameters('dscExtensionUpdateTagVersion')]",
                  "settings": {
                    "configurationArguments": {
                        {
                            "Name": "RegistrationKey",
                            "Value": {
                                "UserName": "PLACEHOLDER_DONOTUSE",
                                "Password": "PrivateSettingsRef:registrationKeyPrivate"
                            },
                        },
                        "RegistrationUrl" : "[parameters('registrationUrl1')]",
                        "NodeConfigurationName" : "nodeConfigurationNameValue1"
                        }
                        },
                        "protectedSettings": {
                            "Items": {
                                        "registrationKeyPrivate": "[parameters('registrationKey1']"
                                    }
                        }
                    }
```

## Template example for Windows VMSS

A VMSS node has a "properties" section with the "VirtualMachineProfile",
"extensionProfile" attribute. DSC is added under "extensions".

The DSC Extension inherits default extension properties as documented in
[VirtualMachineScaleSetExtension Class](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.compute.models.virtualmachinescalesetextension?view=azure-dotnet).

```json
"extensionProfile": {
            "extensions": [
                {
                    "name": "Microsoft.Powershell.DSC",
                    "properties": {
                        "publisher": "Microsoft.Powershell",
                        "type": "DSC",
                        "typeHandlerVersion": "2.72",
                        "autoUpgradeMinorVersion": true,
                        "forceUpdateTag": "[parameters('DscExtensionUpdateTagVersion')]",
                        "settings": {
                            "configurationArguments": {
                                {
                                    "Name": "RegistrationKey",
                                    "Value": {
                                        "UserName": "PLACEHOLDER_DONOTUSE",
                                        "Password": "PrivateSettingsRef:registrationKeyPrivate"
                                    },
                                },
                                "RegistrationUrl" : "[parameters('registrationUrl1')]",
                                "NodeConfigurationName" : "nodeConfigurationNameValue1"
                        }
                        },
                        "protectedSettings": {
                            "Items": {
                                        "registrationKeyPrivate": "[parameters('registrationKey1']"
                                    }
                        }
                    }
                ]
            }
        }
```

## Detailed Settings Information

The following schema is for the settings portion of the Azure DSC extension
in an Azure Resource Manager template.

*For a list of the arguments available for the default configuration script,*
*see the section below named*
*[Default Configuration Script](##Default-Configuration-Script)*.

```json

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
    "downloadMappings": {
      "customWmfLocation": "http://myWMFlocation"
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

```

## Details

| Property Name | Type | Description |
| --- | --- | --- |
| settings.wmfVersion |string |Specifies the version of the Windows Management Framework that should be installed on your VM. Setting this property to 'latest' installs the most updated version of WMF. The only current possible values for this property are **'4.0', '5.0', '5.0PP', and 'latest'**. These possible values are subject to updates. The default value is 'latest'. |
| settings.configuration.url |string |Specifies the URL location from which to download your DSC configuration zip file. If the URL provided requires a SAS token for access, you need to set the protectedSettings.configurationUrlSasToken property to the value of your SAS token. This property is required if settings.configuration.script and/or settings.configuration.function are defined. If no value is given for these properties, the extension will call the default configuration script to set LCM metadata and arguments should be supplied. |
| settings.configuration.script |string |Specifies the file name of the script that contains the definition of your DSC configuration. This script must be in the root folder of the zip file downloaded from the URL specified by the configuration.url property. This property is required if settings.configuration.url and/or settings.configuration.script are defined. If no value is given for these properties, the extension will call the default configuration script to set LCM metadata and arguments should be applied. |
| settings.configuration.function |string |Specifies the name of your DSC configuration. The configuration named must be contained in the script defined by configuration.script. This property is required if settings.configuration.url and/or settings.configuration.function are defined. If no value is given for these properties, the extension will call the default configuration script to set LCM metadata and arguments should be supplied. |
| settings.configurationArguments |Collection |Defines any parameters you would like to pass to your DSC configuration. This property is not encrypted. |
| settings.configurationData.url |string |Specifies the URL from which to download your configuration data (.psd1) file to use as input for your DSC configuration. If the URL provided requires a SAS token for access, you need to set the protectedSettings.configurationDataUrlSasToken property to the value of your SAS token. |
| settings.privacy.dataEnabled |string |Enables or disables telemetry collection. The only possible values for this property are **'Enable', 'Disable', '', or $null**. Leaving this property blank or null enables telemetry. The default value is ''. [More Information](https://blogs.msdn.microsoft.com/powershell/2016/02/02/azure-dsc-extension-data-collection-2/) |
| settings.advancedOptions.downloadMappings |Collection |Defines alternate locations from which to download the WMF. [More Information](http://blogs.msdn.com/b/powershell/archive/2015/10/21/azure-dsc-extension-2-2-amp-how-to-map-downloads-of-the-extension-dependencies-to-your-own-location.aspx) |
| protectedSettings.configurationArguments |Collection |Defines any parameters you would like to pass to your DSC configuration. This property is encrypted. |
| protectedSettings.configurationUrlSasToken |string |Specifies the SAS token to access the URL defined by configuration.url. This property is encrypted. |
| protectedSettings.configurationDataUrlSasToken |string |Specifies the SAS token to access the URL defined by configurationData.url. This property is encrypted. |

## Default Configuration Script

For more information on these values, see the documentation page
[Local Configuration Manager Basic Settings](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig#basic-settings).
Only the LCM properties in the table below are configurable
using the DSC Extension default configuration script.

| Property Name | Type | Description |
| --- | --- | --- |
| settings.configurationArguments.RegistrationKey |securestring |Required property. Specifies the key used for a node to register with the Azure Automation service as the password of a PowerShell credential object. This value can be automatically discovered using the listkeys method against the Automation account and should be secured as a protected setting. |
| settings.configurationArguments.RegistrationUrl |string |Required property. Specifies the Url of the Azure Automation endpoint where the node will attempt to register. This value can be automatically discovered using the reference method against the Automation account. |
| settings.configurationArguments.NodeConfigurationName |string |Required property. Specifies the node configuration in the Azure Automation account to assign to the node. |
| settings.configurationArguments.ConfigurationMode |string |Specifies the mode for Local Configuration Manager. Valid options include "ApplyOnly", "ApplyandMonitor", and "ApplyandAutoCorrect".  The default value is "ApplyandMonitor". |
| settings.configurationArguments.RefreshFrequencyMins | uint32 | Specifies how often LCM will attempt to check with the Automation account for updates.  Default value is 30.  Minimum value is 15. |
| settings.configurationArguments.ConfigurationModeFrequencyMins | uint32 | Specifies how often LCM will validate the current configuration.  Default value is 15.  Minimum value is 15. |
| settings.configurationArguments.RebootNodeIfNeeded | boolean | Specifies whether a node may be automatically rebooted if a DSC operation requests it.  Default value is false. |
| settings.configurationArguments.ActionAfterReboot | string | Specifies what happens after a reboot when applying a configuration. Valid options are "ContinueConfiguration" and "StopConfiguration". Default value is "ContinueConfiguration". |
| settings.configurationArguments.AllowModuleOverwrite | boolean | Specifies whether LCM will overwrite existing modules on the node.  Default value is false. |

## Settings vs. ProtectedSettings

All settings are saved in a settings text file on the VM.
Properties under 'settings' are public properties because they are not encrypted
in the settings text file.
Properties under 'protectedSettings' are encrypted with a certificate
and are not shown in plain text in this file on the VM.

If the configuration needs credentials,
they can be included in protectedSettings:

```json
"protectedSettings": {
    "configurationArguments": {
        "parameterOfTypePSCredential1": {
               "userName": "UsernameValue1",
               "password": "PasswordValue1"
        }
    }
}
```

## Example

The following example is the default behavior for the DSC Extension,
which is to provide metadata settings to Local Configuration Manager
and register with the Azure Automation DSC service.
Configuration arguments are required and will be passed
to the default configuration script
to set LCM metadata.

```json
"settings": {
    "configurationArguments": {
        {
            "Name": "RegistrationKey",
            "Value": {
                "UserName": "PLACEHOLDER_DONOTUSE",
                "Password": "PrivateSettingsRef:registrationKeyPrivate"
            },
        },
        "RegistrationUrl" : "[parameters('registrationUrl1')]",
        "NodeConfigurationName" : "nodeConfigurationNameValue1"
  }
},
"protectedSettings": {
    "Items": {
                "registrationKeyPrivate": "[parameters('registrationKey1']"
            }
}
```

## Example using Configuration Script in Azure Storage

The following example derives from the "Getting Started" section of the
[DSC Extension Handler Overview page](extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
This example uses Resource Manager templates instead of cmdlets to deploy the extension.
Save the "IisInstall.ps1" configuration, place it in a .ZIP file,
and upload the file in an accessible URL.
This example uses Azure blob storage,
but it is possible to download .ZIP files from any arbitrary location.

In the Azure Resource Manager template,
the following code instructs the VM to download the correct file
and run the appropriate PowerShell function:

```json
"settings": {
    "configuration": {
        "url": "https://demo.blob.core.windows.net/",
        "script": "IisInstall.ps1",
        "function": "IISInstall"
    }
},
"protectedSettings": {
    "configurationUrlSasToken": "odLPL/U1p9lvcnp..."
}
```

## Updating from the Previous Format

Any settings in the previous format (containing the public properties ModulesUrl,
ConfigurationFunction, SasToken, or Properties) automatically adapt
to the current format and run just as they did before.

The following schema is what the previous settings schema looked like:

```json
"settings": {
    "WMFVersion": "latest",
    "ModulesUrl": "https://UrlToZipContainingConfigurationScript.ps1.zip",
    "SasToken": "SAS Token if ModulesUrl points to private Azure Blob Storage",
    "ConfigurationFunction": "ConfigurationScript.ps1\\ConfigurationFunction",
    "Properties":  {
        "ParameterToConfigurationFunction1":  "Value1",
        "ParameterToConfigurationFunction2":  "Value2",
        "ParameterOfTypePSCredential1": {
            "UserName": "UsernameValue1",
            "Password": "PrivateSettingsRef:Key1"
        },
        "ParameterOfTypePSCredential2": {
            "UserName": "UsernameValue2",
            "Password": "PrivateSettingsRef:Key2"
        }
    }
},
"protectedSettings": {
    "Items": {
        "Key1": "PasswordValue1",
        "Key2": "PasswordValue2"
    },
    "DataBlobUri": "https://UrlToConfigurationDataWithOptionalSasToken.psd1"
}
```

Here's how the previous format adapts to the current format:

| Property Name | Previous Schema Equivalent |
| --- | --- |
| settings.wmfVersion |settings.WMFVersion |
| settings.configuration.url |settings.ModulesUrl |
| settings.configuration.script |First part of settings.ConfigurationFunction (before '\\\\') |
| settings.configuration.function |Second part of settings.ConfigurationFunction (after '\\\\') |
| settings.configurationArguments |settings.Properties |
| settings.configurationData.url |protectedSettings.DataBlobUri (without SAS token) |
| settings.privacy.dataEnabled |settings.Privacy.DataEnabled |
| settings.advancedOptions.downloadMappings |settings.AdvancedOptions.DownloadMappings |
| protectedSettings.configurationArguments |protectedSettings.Properties |
| protectedSettings.configurationUrlSasToken |settings.SasToken |
| protectedSettings.configurationDataUrlSasToken |SAS token from protectedSettings.DataBlobUri |

## Troubleshooting - Error Code 1100

Error Code 1100 indicates that there is a problem with the user input to the DSC extension.
The text of these errors is variable and may change.
Here are some of the errors you may run into and how you can fix them.

### Invalid Values

"Privacy.dataCollection is '{0}'.
The only possible values are '', 'Enable', and 'Disable'".
"WmfVersion is '{0}'.
Only possible values are … and 'latest'".

Problem: A provided value is not allowed.

Solution: Change the invalid value to a valid value.
See the table in the Details section.

### Invalid URL

"ConfigurationData.url is '{0}'. This is not a valid URL"
"DataBlobUri is '{0}'. This is not a valid URL"
"Configuration.url is '{0}'. This is not a valid URL"

Problem: A provided URL is not valid.

Solution: Check all your provided URLs.
Make sure all URLs resolve to valid locations that the extension can access
on the remote machine.

### Invalid ConfigurationArgument Type

"Invalid configurationArguments type {0}"

Problem: The ConfigurationArguments property cannot resolve
to a Hashtable object.

Solution: Make your ConfigurationArguments property a Hashtable.
Follow the format provided in the preceeding example.
Watch out for quotes, commas, and braces.

### Duplicate ConfigurationArguments

"Found duplicate arguments '{0}' in both public
and protected configurationArguments"

Problem: The ConfigurationArguments in public settings
and the ConfigurationArguments in protected settings contain properties
with the same name.

Solution: Remove one of the duplicate properties.

### Missing Properties
"Configuration.function requires that configuration.url
or configuration.module is specified"

"Configuration.url requires that configuration.script is specified"

"Configuration.script requires that configuration.url is specified"

"Configuration.url requires that configuration.function is specified"

"ConfigurationUrlSasToken requires that configuration.url is specified"

"ConfigurationDataUrlSasToken requires that configurationData.url is specified"

Problem: A defined property needs another property that is missing.

Solutions:

- Provide the missing property.
- Remove the property that needs the missing property.

## Next Steps

Learn about DSC and virtual machine scale sets in
[Using Virtual Machine Scale Sets with the Azure DSC Extension](../../virtual-machine-scale-sets/virtual-machine-scale-sets-dsc.md).

Find more details on
[DSC's secure credential management](extensions-dsc-credentials.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

For more information on the Azure DSC extension handler, see
[Introduction to the Azure Desired State Configuration extension handler](extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

For more information about PowerShell DSC,
[visit the PowerShell documentation center](https://msdn.microsoft.com/powershell/dsc/overview).
