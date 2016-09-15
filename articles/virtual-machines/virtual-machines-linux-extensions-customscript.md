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
   ms.date="09/13/2016"
   ms.author="nepeters"/>

# Using the Azure Custom Script Extension with Linux Virtual Machines

The Custom Script Extension executes scripts on Azure virtual machines. The scripts can be provided to the script at runtime, or downloaded from Azure storage or other accessible internet location. These scripts can be used to configure the system and install software at deployment time using Azure Resource Manager templates. The Custom Script extension can also be run against existing virtual machines using the Azure CLI, PowerShell, or the Azure Virtual Machine REST API.

This document details how to use the Custom Script Extension both from an Azure Resource Manager template and the Azure CLI, and details troubleshooting steps.

## Extension Configuration

The Custom Script Extension configuration specifies things like script location and the command to be run. This configuration can be stored in configuration files, specified on the command line, or in an Azure Resource Manager template. When using configuration files, two options are available a public file, and a protected file. In the protected file, configuration information is encrypted and only decrypted inside the virtual machine. The protected file is useful when the script execution command includes secrets.

### Public Configuration

- commandToExecute: (required, string) the entry point script to execute
- fileUris: (optional, string array) the URLs for files to be downloaded.
- timestamp (optional, integer) use this field only to trigger a rerun of the script by changing value of this field.

**Examples:**

```none
{
  "fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],
  "commandToExecute": "./hello.sh"
}
```

```none
"commandToExecute": "apt-get -y update && apt-get install -y apache2"
```

### Protected Configuration

- commandToExecute: (optional, string) the entrypoint script to execute. Use this field instead if your command contains secrets such as passwords.
- storageAccountName: (optional, string) the name of storage account. If you specify storage credentials, all fileUris must be URLs for Azure Blobs.
- storageAccountKey: (optional, string) the access key of storage account.

```json
{
  "commandToExecute": "<command-to-execute>",
  "storageAccountName": "<storage-account-name>",
  "storageAccountKey": "<storage-account-key>"
}
```

## Azure CLI

When using the Azure CLI to run the Custom Script Extension, create a configuration file or specify the configuration on the command line.

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config-path /scirpt-config.json
```

The output looks like the following text:

```none
info:    Executing command vm extension set
+ Looking up the VM "demovm"
+ Installing extension "CustomScript", VM: "demovm"
info:    vm extension set command OK
```

Optionally, the command can be run using the `--public-config` option, which allows the configuration to be specified during execution and without a separate configuration file.

```none
azure vm extension set <resource-group> <vm-name> CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config '{"fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],"commandToExecute": "./hello.sh"}'
```

## Azure Resource Manager Template

The Azure Custom Script Extension can be run at Virtual Machine deployment time using a Resource Manager template. To do so, add properly formatted JSON to the deployment template.

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
        "commandToExecute": "sudo sh oms.sh"
      }
    }
}
```

To provide parameterized data to the script, use the Azure Resource Manager Template concatenate function. In this example data is taken from a template parameter and then used in the script execution command.

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
          "https://raw.githubusercontent.com/neilpeterson/nepeters-azure-templates/master/ubuntu-docker-oms/support-scripts/oms.sh"
        ],
        "commandToExecute": "[concat('sudo sh oms.sh ', parameters('subscription-id'))]"
      }
    }
}
```
See the .Net Core Music Store Demo a working example - [Music Store Demo](https://github.com/neilpeterson/nepeters-azure-templates/tree/master/dotnet-core-music-linux-vm-sql-db).

## Troubleshooting

When the Custom Script Extension runs, the script is created or downloaded into a directory like the following example. The command output is also saved into this directory in `stdout` and `stderr` file.

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