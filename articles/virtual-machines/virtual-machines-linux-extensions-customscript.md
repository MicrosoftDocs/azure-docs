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

The Custom Script extension executes scripts on Azure virtual machines. The scripts can be provided to the script at runtime, or downloaded from Azure storage or other accessible internet location. These scripts can be used to configure the system and install software at deployment time using Azure Resource Manager templates. The Custom Script extenstion can also be run against existing virtual machines using the Azure CLI, PowerShell, or the Azure Virtual Machine REST API.

This document details how to use the Custom Script Extension both from an Azure Resource Manager template and the Azure CLI, and details troubleshooting steps.

## Azure Resource Manager Template

The Azure Custom Script Extension can be attached to a virtual machine deployment using a Resource Manager template. To do so add properly formatted JSON to the deployment template.

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
        "commandToExecute": "sudo sh oms.sh"
      }
    }
}
```

To provide parameterized data to the script, use the Azure Resource Manager Template concatenate function. In this example data is taken form template parameters, and used in the script execution command.

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

## Azure CLI

When using the Azure CLI to run the Custom Script Extension, first create a configuration JSON file with the following contents.

- commandToExecute: (required, string) the entry point script to execute
- fileUris: (optional, string array) the URLs for files to be downloaded.
- timestamp (optional, integer) use this field only to trigger a rerun of the script by changing value of this field.

**Examples:**

```none
{
  "fileUris": "https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh",
  "commandToExecute": "./hello.sh"
}
```

```none
"commandToExecute": "apt-get -y update && apt-get install -y apache2"
```

Next, run a command like the following. Replace the Resource Group name, Virtual Machine Name, and the location of the configuration file.

```none
azure vm extension set <resource-group> <vm-name> scripttst001 CustomScript Microsoft.Azure.Extensions 2.0 --auto-upgrade-minor-version --public-config-path /scirpt-config.json
```

The output looks like the following text.

```none

```

## Troubleshooting

When the Custom Script Extension runs, the script is created or downloaded into a directory like the following. The command output is also saved into this directory in `stdout` and `stderr` file.

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

The output looks like the following text.

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

For information on other VM Script Extensions, see [Azure Script Extension overview for Linux]().