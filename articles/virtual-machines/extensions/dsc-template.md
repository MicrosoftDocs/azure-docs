---
title: Desired State Configuration extension with Azure Resource Manager templates
description: Learn about the Resource Manager template definition for the Desired State Configuration (DSC) extension in Azure.
services: virtual-machines-windows
author: bobbytreed
manager: carmonm
tags: azure-resource-manager
keywords: 'dsc'
ms.assetid: b5402e5a-1768-4075-8c19-b7f7402687af
ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: na
ms.date: 10/05/2018
ms.author: robreed
---
# Desired State Configuration extension with Azure Resource Manager templates

This article describes the Azure Resource Manager template for the [Desired State Configuration
(DSC) extension handler](dsc-overview.md). Many of the examples use **RegistrationURL** (provided
as a String) and **RegistrationKey** (provided as a
[PSCredential](/dotnet/api/system.management.automation.pscredential)) to onboard with Azure
Automation. For details about obtaining those values, see [Onboarding machines for management by
Azure Automation State Configuration - Secure
registration](/azure/automation/automation-dsc-onboarding#onboarding-securely-using-registration).

> [!NOTE]
> You might encounter slightly different schema examples. The change in schema occurred in the October 2016 release. For details, see [Update from a previous format](#update-from-a-previous-format).

## Template example for a Windows VM

The following snippet goes in the **Resource** section of the template.
The DSC extension inherits default extension properties.
For more information, see
[VirtualMachineExtension class](/dotnet/api/microsoft.azure.management.compute.models.virtualmachineextension?view=azure-dotnet).

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "Microsoft.Powershell.DSC",
  "apiVersion": "2018-06-30",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', parameters('VMName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.Powershell",
    "type": "DSC",
    "typeHandlerVersion": "2.77",
    "autoUpgradeMinorVersion": true,
    "protectedSettings": {
      "Items": {
        "registrationKeyPrivate": "[listKeys(resourceId('Microsoft.Automation/automationAccounts/', parameters('automationAccountName')), '2018-06-30').Keys[0].value]"
      }
    },
    "settings": {
      "Properties": [
        {
          "Name": "RegistrationKey",
          "Value": {
            "UserName": "PLACEHOLDER_DONOTUSE",
            "Password": "PrivateSettingsRef:registrationKeyPrivate"
          },
          "TypeName": "System.Management.Automation.PSCredential"
        },
        {
          "Name": "RegistrationUrl",
          "Value": "[reference(concat('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))).registrationUrl]",
          "TypeName": "System.String"
        },
        {
          "Name": "NodeConfigurationName",
          "Value": "[parameters('nodeConfigurationName')]",
          "TypeName": "System.String"
        }
      ]
    }
  }
}
```

## Template example for Windows virtual machine scale sets

A virtual machine scale set node has a **properties** section
that has a **VirtualMachineProfile, extensionProfile** attribute.
Under **extensions**, add the details for DSC Extension.

The DSC extension inherits default extension properties.
For more information,
see [VirtualMachineScaleSetExtension class](/dotnet/api/microsoft.azure.management.compute.models.virtualmachinescalesetextension?view=azure-dotnet).

```json
"extensionProfile": {
    "extensions": [
      {
        "name": "Microsoft.Powershell.DSC",
        "properties": {
          "publisher": "Microsoft.Powershell",
          "type": "DSC",
          "typeHandlerVersion": "2.77",
          "autoUpgradeMinorVersion": true,
          "protectedSettings": {
            "Items": {
              "registrationKeyPrivate": "[listKeys(resourceId('Microsoft.Automation/automationAccounts/', parameters('automationAccountName')), '2018-06-30').Keys[0].value]"
            }
          },
          "settings": {
            "Properties": [
              {
                "Name": "RegistrationKey",
                "Value": {
                  "UserName": "PLACEHOLDER_DONOTUSE",
                  "Password": "PrivateSettingsRef:registrationKeyPrivate"
                },
                "TypeName": "System.Management.Automation.PSCredential"
              },
              {
                "Name": "RegistrationUrl",
                "Value": "[reference(concat('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))).registrationUrl]",
                "TypeName": "System.String"
              },
              {
                "Name": "NodeConfigurationName",
                "Value": "[parameters('nodeConfigurationName')]",
                "TypeName": "System.String"
              }
            ]
          }
        }
      }
    ]
  }
```

## Detailed settings information

Use the following schema in the **settings** section of the Azure DSC extension
in a Resource Manager template.

For a list of the arguments that are available
for the default configuration script, see
[Default configuration script](#default-configuration-script).

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

| Property name | Type | Description |
| --- | --- | --- |
| settings.wmfVersion |string |Specifies the version of Windows Management Framework (WMF) that should be installed on your VM. Setting this property to **latest** installs the most recent version of WMF. Currently, the only possible values for this property are **4.0**, **5.0**, **5.1**, and **latest**. These possible values are subject to updates. The default value is **latest**. |
| settings.configuration.url |string |Specifies the URL location from which to download your DSC configuration .zip file. If the URL provided requires an SAS token for access, set the **protectedSettings.configurationUrlSasToken** property to the value of your SAS token. This property is required if **settings.configuration.script** or **settings.configuration.function** are defined. If no value is given for these properties, the extension calls the default configuration script to set Location Configuration Manager (LCM) metadata, and arguments should be supplied. |
| settings.configuration.script |string |Specifies the file name of the script that contains the definition of your DSC configuration. This script must be in the root folder of the .zip file that's downloaded from the URL specified by the **settings.configuration.url** property. This property is required if **settings.configuration.url** or **settings.configuration.script** are defined. If no value is given for these properties, the extension calls the default configuration script to set LCM metadata, and arguments should be supplied. |
| settings.configuration.function |string |Specifies the name of your DSC configuration. The configuration that is named must be included in the script that **settings.configuration.script** defines. This property is required if **settings.configuration.url** or **settings.configuration.function** are defined. If no value is given for these properties, the extension calls the default configuration script to set LCM metadata, and arguments should be supplied. |
| settings.configurationArguments |Collection |Defines any parameters that you want to pass to your DSC configuration. This property is not encrypted. |
| settings.configurationData.url |string |Specifies the URL from which to download your configuration data (.psd1) file to use as input for your DSC configuration. If the URL provided requires an SAS token for access, set the **protectedSettings.configurationDataUrlSasToken** property to the value of your SAS token. |
| settings.privacy.dataCollection |string |Enables or disables telemetry collection. The only possible values for this property are **Enable**, **Disable**, **''**, or **$null**. Leaving this property blank or null enables telemetry. The default value is **''**. For more information, see [Azure DSC extension data collection](https://devblogs.microsoft.com/powershell/azure-dsc-extension-data-collection-2/). |
| settings.advancedOptions.downloadMappings |Collection |Defines alternate locations from which to download WMF. For more information, see [Azure DSC extension 2.8 and how to map downloads of the extension dependencies to your own location](https://devblogs.microsoft.com/powershell/azure-dsc-extension-2-8-how-to-map-downloads-of-the-extension-dependencies-to-your-own-location/). |
| protectedSettings.configurationArguments |Collection |Defines any parameters that you want to pass to your DSC configuration. This property is encrypted. |
| protectedSettings.configurationUrlSasToken |string |Specifies the SAS token to use to access the URL that **settings.configuration.url** defines. This property is encrypted. |
| protectedSettings.configurationDataUrlSasToken |string |Specifies the SAS token to use to access the URL that  **settings.configurationData.url** defines. This property is encrypted. |

## Default configuration script

For more information about the following values, see
[Local Configuration Manager basic settings](/powershell/scripting/dsc/managing-nodes/metaConfig#basic-settings).
You can use the DSC extension default configuration script
to configure only the LCM properties that are listed in the following table.

| Property name | Type | Description |
| --- | --- | --- |
| protectedSettings.configurationArguments.RegistrationKey |PSCredential |Required property. Specifies the key that's used for a node to register with the Azure Automation service as the password of a PowerShell credential object. This value can be automatically discovered by using the **listkeys** method against the Automation account.  See the [example](#example-using-referenced-azure-automation-registration-values). |
| settings.configurationArguments.RegistrationUrl |string |Required property. Specifies the URL of the Automation endpoint where the node attempts to register. This value can be automatically discovered by using the **reference** method against the Automation account. |
| settings.configurationArguments.NodeConfigurationName |string |Required property. Specifies the node configuration in the Automation account to assign to the node. |
| settings.configurationArguments.ConfigurationMode |string |Specifies the mode for LCM. Valid options include **ApplyOnly**, **ApplyandMonitor**, and **ApplyandAutoCorrect**.  The default value is **ApplyandMonitor**. |
| settings.configurationArguments.RefreshFrequencyMins | uint32 | Specifies how often LCM attempts to check with the Automation account for updates.  Default value is **30**.  Minimum value is **15**. |
| settings.configurationArguments.ConfigurationModeFrequencyMins | uint32 | Specifies how often LCM validates the current configuration. Default value is **15**. Minimum value is **15**. |
| settings.configurationArguments.RebootNodeIfNeeded | boolean | Specifies whether a node can be automatically rebooted if a DSC operation requests it. Default value is **false**. |
| settings.configurationArguments.ActionAfterReboot | string | Specifies what happens after a reboot when applying a configuration. Valid options are **ContinueConfiguration** and **StopConfiguration**. Default value is **ContinueConfiguration**. |
| settings.configurationArguments.AllowModuleOverwrite | boolean | Specifies whether LCM overwrites existing modules on the node. Default value is **false**. |

## settings vs. protectedSettings

All settings are saved in a settings text file on the VM.
Properties listed under **settings** are public properties.
Public properties aren't encrypted in the settings text file.
Properties listed under **protectedSettings** are encrypted with a certificate
and are not shown in plain text in the settings file on the VM.

If the configuration needs credentials,
you can include the credentials in **protectedSettings**:

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

## Example configuration script

The following example shows the default behavior for the DSC extension,
which is to provide metadata settings to LCM
and register with the Automation DSC service.
Configuration arguments are required.
Configuration arguments are passed to the default configuration script
to set LCM metadata.

```json
"settings": {
    "configurationArguments": {
        "RegistrationUrl" : "[parameters('registrationUrl1')]",
        "NodeConfigurationName" : "nodeConfigurationNameValue1"
    }
},
"protectedSettings": {
    "configurationArguments": {
        "RegistrationKey": {
            "userName": "NOT_USED",
            "Password": "registrationKey"
        }
    }
}
```

## Example using the configuration script in Azure Storage

The following example is from the
[DSC extension handler overview](dsc-overview.md).
This example uses Resource Manager templates
instead of cmdlets to deploy the extension.
Save the IisInstall.ps1 configuration,
place it in a .zip file (example: `iisinstall.zip`),
and then upload the file in an accessible URL.
This example uses Azure Blob storage,
but you can download .zip files from any arbitrary location.

In the Resource Manager template,
the following code instructs the VM to download the correct file,
and then run the appropriate PowerShell function:

```json
"settings": {
    "configuration": {
        "url": "https://demo.blob.core.windows.net/iisinstall.zip",
        "script": "IisInstall.ps1",
        "function": "IISInstall"
    }
},
"protectedSettings": {
    "configurationUrlSasToken": "odLPL/U1p9lvcnp..."
}
```

## Example using referenced Azure Automation registration values

The following example gets the **RegistrationUrl** and **RegistrationKey**
by referencing the Azure Automation account properties and using the  **listkeys**
method to retrieve the Primary Key (0).  In this example, the parameters
**automationAccountName** and **NodeConfigName** were provided to the template.

```json
"settings": {
    "RegistrationUrl" : "[reference(concat('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))).registrationUrl]",
    "NodeConfigurationName" : "[parameters('NodeConfigName')]"
},
"protectedSettings": {
    "configurationArguments": {
        "RegistrationKey": {
            "userName": "NOT_USED",
            "Password": "[listKeys(resourceId('Microsoft.Automation/automationAccounts/', parameters('automationAccountName')), '2018-01-15').Keys[0].value]"
        }
    }
}
```

## Update from a previous format

Any settings in a previous format of the extension
(and which have the public properties **ModulesUrl**, **ModuleSource**,
**ModuleVersion**, **ConfigurationFunction**, **SasToken**, or **Properties**)
automatically adapt to the current format of the extension.
They run just as they did before.

The following schema shows what the previous settings schema looked like:

```json
"settings": {
    "WMFVersion": "latest",
    "ModulesUrl": "https://UrlToZipContainingConfigurationScript.ps1.zip",
    "SasToken": "SAS Token if ModulesUrl points to private Azure Blob Storage",
    "ConfigurationFunction": "ConfigurationScript.ps1\\ConfigurationFunction",
    "Properties": {
        "ParameterToConfigurationFunction1": "Value1",
        "ParameterToConfigurationFunction2": "Value2",
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

| Current Property name | Previous schema equivalent |
| --- | --- |
| settings.wmfVersion |settings.WMFVersion |
| settings.configuration.url |settings.ModulesUrl |
| settings.configuration.script |First part of settings.ConfigurationFunction (before \\\\) |
| settings.configuration.function |Second part of settings.ConfigurationFunction (after \\\\) |
| settings.configuration.module.name | settings.ModuleSource |
| settings.configuration.module.version | settings.ModuleVersion |
| settings.configurationArguments |settings.Properties |
| settings.configurationData.url |protectedSettings.DataBlobUri (without SAS token) |
| settings.privacy.dataCollection |settings.Privacy.dataCollection |
| settings.advancedOptions.downloadMappings |settings.AdvancedOptions.DownloadMappings |
| protectedSettings.configurationArguments |protectedSettings.Properties |
| protectedSettings.configurationUrlSasToken |settings.SasToken |
| protectedSettings.configurationDataUrlSasToken |SAS token from protectedSettings.DataBlobUri |

## Troubleshooting

Here are some of the errors you might run into and how you can fix them.

### Invalid values

"Privacy.dataCollection is '{0}'.
The only possible values are '', 'Enable', and 'Disable'".
"WmfVersion is '{0}'.
Only possible values are … and 'latest'".

**Problem**: A provided value is not allowed.

**Solution**: Change the invalid value to a valid value.
For more information, see the table in [Details](#details).

### Invalid URL

"ConfigurationData.url is '{0}'. This is not a valid URL"
"DataBlobUri is '{0}'. This is not a valid URL"
"Configuration.url is '{0}'. This is not a valid URL"

**Problem**: A provided URL is not valid.

**Solution**: Check all your provided URLs.
Ensure that all URLs resolve to valid locations
that the extension can access on the remote machine.

### Invalid RegistrationKey type

"Invalid type for parameter RegistrationKey of type PSCredential."

**Problem**: The *RegistrationKey* value in protectedSettings.configurationArguments
cannot be provided as any type other than a PSCredential.

**Solution**: Change your protectedSettings.configurationArguments entry for
RegistrationKey to a PSCredential type using the following format:

```json
"configurationArguments": {
    "RegistrationKey": {
        "userName": "NOT_USED",
        "Password": "RegistrationKey"
    }
}
```

### Invalid ConfigurationArgument type

"Invalid configurationArguments type {0}"

**Problem**: The *ConfigurationArguments* property
can't resolve to a **Hash table** object.

**Solution**: Make your *ConfigurationArguments* property a **Hash table**.
Follow the format provided in the preceding examples. Watch for quotes,
commas, and braces.

### Duplicate ConfigurationArguments

"Found duplicate arguments '{0}' in both public
and protected configurationArguments"

**Problem**: The *ConfigurationArguments* in public settings
and the *ConfigurationArguments* in protected settings
have properties with the same name.

**Solution**: Remove one of the duplicate properties.

### Missing properties

"settings.Configuration.function requires that settings.configuration.url
or settings.configuration.module is specified"

"settings.Configuration.url requires that settings.configuration.script is specified"

"settings.Configuration.script requires that settings.configuration.url is specified"

"settings.Configuration.url requires that settings.configuration.function is specified"

"protectedSettings.ConfigurationUrlSasToken requires that settings.configuration.url is specified"

"protectedSettings.ConfigurationDataUrlSasToken requires that settings.configurationData.url is specified"

**Problem**: A defined property needs another property, which is missing.

**Solutions**:

- Provide the missing property.
- Remove the property that needs the missing property.

## Next steps

- Learn about [using virtual machine scale sets with the Azure DSC extension](../../virtual-machine-scale-sets/virtual-machine-scale-sets-dsc.md).
- Find more details about [DSC's secure credential management](dsc-credentials.md).
- Get an [introduction to the Azure DSC extension handler](dsc-overview.md).
- For more information about PowerShell DSC, go to the [PowerShell documentation center](/powershell/scripting/dsc/overview/overview).
