---
title: Run custom scripts on Linux VMs in Azure 
description: Automate Linux VM configuration tasks by using the Custom Script Extension v1
services: virtual-machines-linux
documentationcenter: ''
author: danielsollondon
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 08/14/2018
ms.author: danis

---
# Use the Azure Custom Script Extension Version 1 with Linux virtual machines

[!INCLUDE [virtual-machines-extensions-deprecation-statement](../../../includes/virtual-machines-extensions-deprecation-statement.md)]

The Custom Script Extension Version 1 downloads and runs scripts on Azure virtual machines. This extension is useful for post-deployment configuration, software installation, or any other configuration/management task. You can download scripts from Azure Storage or another accessible internet location, or you can provide them to the extension runtime.

The Custom Script Extension integrates with Azure Resource Manager templates. You can also run it by using Azure CLI, PowerShell, the Azure portal, or the Azure Virtual Machines REST API.

This article details how to use the Custom Script Extension from Azure CLI, and how to run the extension by using an Azure Resource Manager template. This article also provides troubleshooting steps for Linux systems.

There are two Linux Custom Script Extensions:

* Version 1 - Microsoft.OSTCExtensions.CustomScriptForLinux

* Version 2 - Microsoft.Azure.Extensions.CustomScript

Please switch new and existing deployments to use the new version ([Microsoft.Azure.Extensions.CustomScript](custom-script-linux.md)) instead. The new version is intended to be a drop-in replacement. Therefore, the migration is as easy as changing the name and version, you do not need to change your extension configuration.

### Operating System

Supported Linux Distributions:

* CentOS 6.5 and higher
* Debian 8 and higher
  * Debian 8.7 does not ship with Python2 in the latest images, which breaks CustomScriptForLinux.
* FreeBSD
* OpenSUSE 13.1 and higher
* Oracle Linux 6.4 and higher
* SUSE Linux Enterprise Server 11 SP3 and higher
* Ubuntu 12.04 and higher

### Script Location

You can use the extension to use your Azure Blob storage credentials, to access Azure Blob storage. Alternatively, the script location can be any where, as long as the VM can route to that end point, such as GitHub, internal file server etc.

### Internet Connectivity

If you need to download a script externally such as GitHub or Azure Storage, then additional firewall/Network Security Group ports need to be opened. For example if your script is located in Azure Storage, you can allow access using Azure NSG Service Tags for [Storage](../../virtual-network/security-overview.md#service-tags).

If your script is on a local server, then you may still need additional firewall/Network Security Group ports need to be opened.

### Tips and Tricks

* The highest failure rate for this extension is due to syntax errors in the script, test the script runs without error, and also put in additional logging into the script to make it easier to find where it failed.
* Write scripts that are idempotent, so if they get run again more than once accidentally, it will not cause system changes.
* Ensure the scripts do not require user input when they run.
* There is 90 mins allowed for the script to run, anything longer will result in a failed provision of the extension.
* Do not put reboots inside the script, this will cause issues with other extensions that are being installed, and post reboot, the extension will not continue after the restart. 
* If you have a script that will cause a reboot, then install applications and run scripts etc. You should schedule the reboot using a Cron job, or using tools such as DSC, or Chef, Puppet extensions.
* The extension will only run a script once, if you want to run a script on every boot, then you can use [cloud-init image](../linux/using-cloud-init.md)  and use a [Scripts Per Boot](https://cloudinit.readthedocs.io/en/latest/topics/modules.html#scripts-per-boot) module. Alternatively, you can use the script to create a Systemd service unit.
* If you want to schedule when a script will run, you should use the extension to create a Cron job.
* When the script is running, you will only see a 'transitioning' extension status from the Azure portal or CLI. If you want more frequent status updates of a running script, you will need to create your own solution.
* Custom Script extension does not natively support proxy servers, however you can use a file transfer tool that supports proxy servers within your script, such as *Curl*.
* Be aware of non default directory locations that your scripts or commands may rely on, have logic to handle this.

## Extension schema

The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this configuration in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template. 

You can store sensitive data in a protected configuration, which is encrypted and only decrypted inside the virtual machine. The protected configuration is useful when the execution command includes secrets such as a password.

These items should be treated as sensitive data and specified in the extensions protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine.

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
    "publisher": "Microsoft.OSTCExtensions",
    "type": "CustomScriptForLinux",
    "typeHandlerVersion": "1.5",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": [
        "<url>"
      ],
      "enableInternalDNSCheck": true
    },
    "protectedSettings": {
      "storageAccountName": "<storage-account-name>",
      "storageAccountKey": "<storage-account-key>",
      "commandToExecute": "<command>"
    }
  }
}
```

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2015-06-15 | date |
| publisher | Microsoft.OSTCExtensions | string |
| type | CustomScriptForLinux | string |
| typeHandlerVersion | 1.5 | int |
| fileUris (e.g) | `https://github.com/MyProject/Archive/MyPythonScript.py` | array |
| commandToExecute (e.g) | python MyPythonScript.py \<my-param1\> | string |
| enableInternalDNSCheck | true | boolean |
| storageAccountName (e.g) | examplestorageacct | string |
| storageAccountKey (e.g) | TmJK/1N3AbAZ3q/+hOXoi/l73zOqsaxXDhqa9Y83/v5UpXQp2DQIBuv2Tifp60cE/OaHsJZmQZ7teQfczQj8hg== | string |

### Property value details

* `fileUris`: (optional, string array) the uri list of the scripts
* `enableInternalDNSCheck`: (optional, bool) default is True, set to False to disable DNS check.
* `commandToExecute`: (optional, string) the entrypoint script to execute
* `storageAccountName`: (optional, string) the name of storage account
* `storageAccountKey`: (optional, string) the access key of storage account

The following values can be set in either public or protected settings, you must not have these values below set in both public and protected settings.

* `commandToExecute`

Using public settings maybe useful for debugging, but it is strongly recommended that you use protected settings.

Public settings are sent in clear text to the VM where the script will be executed.  Protected settings are encrypted using a key known only to the Azure and the VM. The settings are saved to the VM as they were sent, i.e. if the settings were encrypted they are saved encrypted on the VM. The certificate used to decrypt the encrypted values is stored on the VM, and used to decrypt settings (if necessary) at runtime.

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during an Azure Resource Manager template deployment.

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
    "publisher": "Microsoft.OSTCExtensions",
    "type": "CustomScriptForLinux",
    "typeHandlerVersion": "1.5",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": ["http://MyAccount.blob.core.windows.net/vhds/MyShellScript.sh"]
    },
    "protectedSettings": {
      "storageAccountName": "MyAccount",
      "storageAccountKey": "<storage-account-key>",
      "commandToExecute": "sh MyShellScript.sh"
    }
  }
}
```

>[!NOTE]
>These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

## Azure CLI

When you're using Azure CLI to run the Custom Script Extension, create a configuration file or files. At a minimum, you must have 'commandToExecute'.

```azurecli
az vm extension set -n VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.5 \
  --vm-name MyVm --resource-group MyResourceGroup \
  --protected-settings '{"commandToExecute": "echo hello"}'
```

Optionally, you can specify the settings in the command as a JSON formatted string. This allows the configuration to be specified during execution and without a separate configuration file.

```azurecli
az vm extension set \
  --resource-group exttest \
  --vm-name exttest \
  --name CustomScriptForLinux \
  --publisher Microsoft.OSTCExtensions \
  --settings '{"fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],"commandToExecute": "./config-music.sh"}'
```

### Azure CLI examples

#### Public configuration with no script file

```json
{
  "commandToExecute": "apt-get -y update && apt-get install -y apache2"
}
```

Azure CLI command:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name CustomScriptForLinux \
  --publisher Microsoft.OSTCExtensions \
  --settings ./script-config.json
```

#### Public and protected configuration files

You use a public configuration file to specify the script file URI. You use a protected configuration file to specify the command to be run.

Public configuration file:

```json
{
  "fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"]
}
```

Protected configuration file:  

```json
{
  "commandToExecute": "./config-music.sh <param1>"
}
```

Azure CLI command:

```azurecli
az vm extension set
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name CustomScriptForLinux \
  --publisher Microsoft.OSTCExtensions \
  --settings ./script-config.json \
  --protected-settings ./protected-config.json
```

## Troubleshooting

When the Custom Script Extension runs, the script is created or downloaded into a directory that's similar to the following example. The command output is also saved into this directory in `stdout` and `stderr` files.

```bash
/var/lib/waagent/Microsoft.OSTCExtensions.CustomScriptForLinux-<version>/download/1
```

To troubleshoot, first check the Linux Agent Log, ensure the extension ran, check:

```bash
/var/log/waagent.log
```

You should look for the extension execution, it will look something like:

```output
2018/04/26 15:29:44.835067 INFO [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Target handler state: enabled
2018/04/26 15:29:44.867625 INFO [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] [Enable] current handler state is: notinstalled
2018/04/26 15:29:44.959605 INFO Event: name=Microsoft.OSTCExtensions.CustomScriptForLinux, op=Download, message=Download succeeded, duration=59
2018/04/26 15:29:44.993269 INFO [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Initialize extension directory
2018/04/26 15:29:45.022972 INFO [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Update settings file: 0.settings
2018/04/26 15:29:45.051763 INFO [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Install extension [customscript.py -install]
2018/04/26 15:29:45 CustomScriptForLinux started to handle.
2018/04/26 15:29:45 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] cwd is /var/lib/waagent/Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2
2018/04/26 15:29:45 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Change log file to /var/log/azure/Microsoft.OSTCExtensions.CustomScriptForLinux/1.5.2.2/extension.log
2018/04/26 15:29:46.088212 INFO Event: name=Microsoft.OSTCExtensions.CustomScriptForLinux, op=Install, message=Launch command succeeded: customscript.py -install, duration=1005
2018/04/26 15:29:46.133367 INFO [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Enable extension [customscript.py -enable]
2018/04/26 15:29:46 CustomScriptForLinux started to handle.
..
2018/04/26 15:29:47.178163 INFO Event: name=Microsoft.OSTCExtensions.CustomScriptForLinux, op=Enable, message=Launch command succeeded: customscript.py -enable, duration=1012
```

Some points to note:

1. Enable is when the command starts running.
1. Download relates to the downloading of the CustomScript extension package from Azure, not the script files specified in fileUris.
1. You can also see which log file it is writing out to `/var/log/azure/Microsoft.OSTCExtensions.CustomScriptForLinux/1.5.2.2/extension.log`

Next step is to go an check the log file, this is the format:

```bash
/var/log/azure/<extension-name>/<version>/extension.log file.
```

You should look for the individual execution, it will look something like:

```output
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Enable,transitioning,0,Launching the script...
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] sequence number is 0
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] setting file path is/var/lib/waagent/Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2/config/0.settings
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] JSON config: {"runtimeSettings": [{"handlerSettings": {"protectedSettings": "MIIB0AYJKoZIhvcNAQcDoIIBwTCCAb0CAQAxggF+hnEXRtFKTTuKiFC8gTfHKupUSs7qI0zFYRya", "publicSettings": {"fileUris": ["https://dannytesting.blob.core.windows.net/demo/myBash.sh"]}, "protectedSettingsCertThumbprint": "4385AB21617C2452FF6998C0A37F71A0A01C8368"}}]}
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Config decoded correctly.
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Will try to download files, number of retries = 10, wait SECONDS between retrievals = 20s
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Downloading,transitioning,0,Downloading files...
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] No azure storage account and key specified in protected settings. Downloading scripts from external links...
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Converting /var/lib/waagent/Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2/download/0/myBash.sh from DOS to Unix formats: Done
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Removing BOM of /var/lib/waagent/Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2/download/0/myBash.sh: Done
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Succeeded to download files, retry count = 0
2018/04/26 15:29:46 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Internal DNS is ready, retry count = 0
2018/04/26 15:29:47 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Command is finished.
2018/04/26 15:29:47 ---stdout---
2018/04/26 15:29:47
2018/04/26 15:29:47 ---errout---
2018/04/26 15:29:47
2018/04/26 15:29:47
2018/04/26 15:29:47 [Microsoft.OSTCExtensions.CustomScriptForLinux-1.5.2.2] Daemon,success,0,Command is finished.
2018/04/26 15:29:47 ---stdout---
2018/04/26 15:29:47
2018/04/26 15:29:47 ---errout---
2018/04/26 15:29:47
2018/04/26 15:29:47
```

Here you can see:

* The Enable command starting is this log
* The settings passed to the extension
* The extension downloading file and the result of that.
* The command being run and the result.

You can also retrieve the execution state of the Custom Script Extension by using Azure CLI:

```azurecli
az vm extension list -g myResourceGroup --vm-name myVM
```

The output looks like the following text:

```output
Name                  ProvisioningState    Publisher                   Version  AutoUpgradeMinorVersion
--------------------  -------------------  ------------------------  ---------  -------------------------
CustomScriptForLinux  Succeeded            Microsoft.OSTCExtensions        1.5  True
```

## Next steps

To see the code, current issues and versions, see [CustomScript Extension repo](https://github.com/Azure/azure-linux-extensions/tree/master/CustomScript).
