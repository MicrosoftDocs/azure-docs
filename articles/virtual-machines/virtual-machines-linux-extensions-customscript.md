<properties
   pageTitle="Custom scripts on Linux VMs | Microsoft Azure"
   description="Automate Linux VM configuration tasks by using the Custom Script Extension"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="neilpeterson"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="09/22/2016"
   ms.author="nepeters"/>

# Using the Azure Custom Script Extension with Linux Virtual Machines

The Custom Script Extension downloads and executes scripts on Azure virtual machines. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or other accessible internet location, or provided to the extension run time. The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API.

This document details how to use the Custom Script Extension from the Azure CLI, and an Azure Resource Manager template, and also details troubleshooting steps on Linux systems.

## Extension Configuration

The Custom Script Extension configuration specifies things like script location and the command to be run. This configuration can be stored in configuration files, specified on the command line, or in an Azure Resource Manager template. Sensitive data can be stored in a protected configuration, which is encrypted and only decrypted inside the virtual machine. The protected configuration is useful when the execution command includes secrets such as a password.

### Public Configuration

Schema:

- **commandToExecute**: (required, string) the entry point script to execute
- **fileUris**: (optional, string array) the URLs for files to be downloaded.
- **timestamp** (optional, integer) use this field only to trigger a rerun of the script by changing value of this field.

```none
{
  "fileUris": ["<url>"],
  "commandToExecute": "<command-to-execute>"
}
```

### Protected Configuration

Schema:

- **commandToExecute**: (optional, string) the entry point script to execute. Use this field instead if your command contains secrets such as passwords.
- **storageAccountName**: (optional, string) the name of storage account. If you specify storage credentials, all fileUris must be URLs for Azure Blobs.
- **storageAccountKey**: (optional, string) the access key of storage account.


```json
{
  "commandToExecute": "<command-to-execute>",
  "storageAccountName": "<storage-account-name>",
  "storageAccountKey": "<storage-account-key>"
}
```

## Azure CLI

When using the Azure CLI to run the Custom Script Extension, create a configuration file or files containing at minimum the file uri, and the script execution command.

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config-path /scirpt-config.json
```

Optionally, the command can be run using the `--public-config` and `--private-config` option, which allows the configuration to be specified during execution and without a separate configuration file.

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config '{"fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],"commandToExecute": "./hello.sh"}'
```

### Azure CLI Examples

**Example 1** - Public configuration with script file.

```json
{
  "fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],
  "commandToExecute": "./hello.sh"
}
```

Azure CLI command:

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config-path /public.json
```

**Example 2** - Public configuration with no script file.

```json
{
  "commandToExecute": "apt-get -y update && apt-get install -y apache2"
}
```

Azure CLI command:

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config-path /public.json
```

**Example 3** - A public configuration file is used to specify the script file URI, and a protected configuration file is used to specify the command to be executed.

Public configuration file:

```json
{
  "fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],
}
```

Protected configuration file:  

```json
{
  "commandToExecute": "./hello.sh <password>"
}
```

Azure CLI command:

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config-path ./public.json --private-config-path ./protected.json
```

## Resource Manager Template

The Azure Custom Script Extension can be run at Virtual Machine deployment time using a Resource Manager template. To do so, add properly formatted JSON to the deployment template.

### Resource Manager Examples

**Example 1** - public configuration.

```json
{
    "name": "scriptextensiondemo",
    "type": "extensions",
    "location": "[resourceGroup().location]",
    "apiVersion": "2015-06-15",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', parameters('scriptextensiondemoName'))]"
    ],
    "tags": {
        "displayName": "scriptextensiondemo"
    },
    "properties": {
        "publisher": "Microsoft.Azure.Extensions",
        "type": "CustomScript",
        "typeHandlerVersion": "2.0",
        "autoUpgradeMinorVersion": true,
      "settings": {
        "fileUris": [
          "https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"
        ],
        "commandToExecute": "sh hello.sh"
      }
    }
}
```

**Example 2** - execution command in protected configuration.

```json
{
  "name": "config-app",
  "type": "extensions",
  "location": "[resourceGroup().location]",
  "apiVersion": "2015-06-15",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', concat(variables('vmName'),copyindex()))]"
  ],
  "tags": {
    "displayName": "config-app"
  },
  "properties": {
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.0",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": [
        "https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh
      ]              
    },
    "protectedSettings": {
      "commandToExecute": "sh hello.sh <password>"
    }
  }
}
```

See the .Net Core Music Store Demo for a complete example - [Music Store Demo](https://github.com/neilpeterson/nepeters-azure-templates/tree/master/dotnet-core-music-linux-vm-sql-db).

## Troubleshooting

When the Custom Script Extension runs, the script is created or downloaded into a directory similar to the following example. The command output is also saved into this directory in `stdout` and `stderr` file.

```none
/var/lib/azure/custom-script/download/0/
```

The Azure Script Extension produces a log, which can be found here.

```none
/var/log/azure/customscript/handler.log
```

The execution state of the Custom Script Extension can also be retrieved with the Azure CLI.

```none
azure vm extension get <resource-group> <vm-name>
```

The output looks like the following text:

```none
info:    Executing command vm extension get
+ Looking up the VM "scripttst001"
data:    Publisher                   Name                                      Version  State
data:    --------------------------  ----------------------------------------  -------  ---------
data:    Microsoft.Azure.Extensions  CustomScript                              2.0      Succeeded
data:    Microsoft.OSTCExtensions    Microsoft.Insights.VMDiagnosticsSettings  2.3      Succeeded
info:    vm extension get command OK
```

## Next Steps

For information on other VM Script Extensions, see [Azure Script Extension overview for Linux](./virtual-machines-linux-extensions-features.md).