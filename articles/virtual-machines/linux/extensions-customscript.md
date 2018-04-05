---
title: Run custom scripts on Linux VMs in Azure | Microsoft Docs
description: Automate Linux VM configuration tasks by using the Custom Script Extension
services: virtual-machines-linux
documentationcenter: ''
author: danielsollondon
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: cf17ab2b-8d7e-4078-b6df-955c6d5071c2
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/26/2017
ms.author: danis

---
# Use the Azure Custom Script Extension with Linux virtual machines
The Custom Script Extension downloads and runs scripts on Azure virtual machines. This extension is useful for post-deployment configuration, software installation, or any other configuration/management task. You can download scripts from Azure Storage or another accessible internet location, or you can provide them to the extension runtime. 

The Custom Script Extension integrates with Azure Resource Manager templates. You can also run it by using Azure CLI, PowerShell, the Azure portal, or the Azure Virtual Machines REST API.

This article details how to use the Custom Script Extension from Azure CLI, and how to run the extension by using an Azure Resource Manager template. This article also provides troubleshooting steps for Linux systems.

## Extension configuration
The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this configuration in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template. 

You can store sensitive data in a protected configuration, which is encrypted and only decrypted inside the virtual machine. The protected configuration is useful when the execution command includes secrets such as a password.

### Public configuration
The schema for the public configuration is as follows.

>[!NOTE]
>These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

* **commandToExecute** (required, string): The entry point script to run.
* **fileUris** (optional, string array): The URLs for files to be downloaded.
* **timestamp** (optional, integer): The time stamp of the script. Change the value of this field only if you want to trigger a rerun of the script.

```json
{
  "fileUris": ["<url>"],
  "commandToExecute": "<command-to-execute>"
}
```

### Protected configuration
The schema for the protected configuration is as follows.

>[!NOTE]
>These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

* **commandToExecute** (optional, string): The entry point script to run. Use this field if your command contains secrets such as passwords.
* **storageAccountName** (optional, string): The name of the storage account. If you specify storage credentials, all file URIs must be URLs for Azure blobs.
* **storageAccountKey** (optional, string): The access key of the storage account.

```json
{
  "commandToExecute": "<command-to-execute>",
  "storageAccountName": "<storage-account-name>",
  "storageAccountKey": "<storage-account-key>"
}
```

## Azure CLI
When you're using Azure CLI to run the Custom Script Extension, create a configuration file or files. At a minimum, configuration files contain the file URI and the script execution command.

```azurecli
az vm extension set --resource-group myResourceGroup --vm-name myVM --name customScript --publisher Microsoft.Azure.Extensions --settings ./script-config.json
```

Optionally, you can specify the settings in the command as a JSON formatted string. This allows the configuration to be specified during execution and without a separate configuration file.

```azurecli
az vm extension set '
  --resource-group exttest `
  --vm-name exttest `
  --name customScript `
  --publisher Microsoft.Azure.Extensions `
  --settings '{"fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],"commandToExecute": "./config-music.sh"}'
```

### Azure CLI examples

#### Public configuration with script file

```json
{
  "fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],
  "commandToExecute": "./config-music.sh"
}
```

Azure CLI command:

```azurecli
az vm extension set --resource-group myResourceGroup --vm-name myVM --name customScript --publisher Microsoft.Azure.Extensions --settings ./script-config.json
```

#### Public configuration with no script file

```json
{
  "commandToExecute": "apt-get -y update && apt-get install -y apache2"
}
```

Azure CLI command:

```azurecli
az vm extension set --resource-group myResourceGroup --vm-name myVM --name customScript --publisher Microsoft.Azure.Extensions --settings ./script-config.json
```

#### Public and protected configuration files

You use a public configuration file to specify the script file URI. You use a protected configuration file to specify the command to be run.

Public configuration file:

```json
{
  "fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"]
}
```

Protected configuration file:  

```json
{
  "commandToExecute": "./hello.sh <password>"
}
```

Azure CLI command:

```azurecli
az vm extension set --resource-group myResourceGroup --vm-name myVM --name customScript --publisher Microsoft.Azure.Extensions --settings ./script-config.json --protected-settings ./protected-config.json
```

## Resource Manager template
You can run the Azure Custom Script Extension at virtual machine deployment time by using a Resource Manager template. To do so, add properly formatted JSON to the deployment template.

### Resource Manager examples

#### Public configuration

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

#### Execution command in protected configuration

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
        "https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"
      ]              
    },
    "protectedSettings": {
      "commandToExecute": "sh hello.sh <password>"
    }
  }
}
```

For a complete example, see the [.NET Music Store demo](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux).

## Troubleshooting
When the Custom Script Extension runs, the script is created or downloaded into a directory that's similar to the following example. The command output is also saved into this directory in `stdout` and `stderr` files.

```bash
/var/lib/waagent/custom-script/download/0/
```

The Azure Script Extension produces a log, which you can find here:

```bash
/var/log/azure/custom-script/handler.log
```

You can also retrieve the execution state of the Custom Script Extension by using Azure CLI:

```azurecli
az vm extension list -g myResourceGroup --vm-name myVM
```

The output looks like the following text:

```azurecli
info:    Executing command vm extension get
+ Looking up the VM "scripttst001"
data:    Publisher                   Name                                      Version  State
data:    --------------------------  ----------------------------------------  -------  ---------
data:    Microsoft.Azure.Extensions  CustomScript                              2.0      Succeeded
data:    Microsoft.OSTCExtensions    Microsoft.Insights.VMDiagnosticsSettings  2.3      Succeeded
info:    vm extension get command OK
```

## Next steps
For information on other VM script extensions, see [Azure script extension overview for Linux](extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

