---
title: Run Custom Script Extension on Linux VMs in Azure
description: Learn how to automate Linux virtual machine configuration tasks in Azure by using the Custom Script Extension Version 2.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
ms.custom: GGAL-freshness822, devx-track-azurecli, devx-track-linux
author: GabstaMSFT
ms.collection: linux
ms.date: 03/31/2023
---
# Use the Azure Custom Script Extension Version 2 with Linux virtual machines

The Custom Script Extension Version 2 downloads and runs scripts on Azure virtual machines (VMs). Use this extension for post-deployment configuration, software installation, or any other configuration or management task. You can download scripts from Azure Storage or another accessible internet location, or you can provide them to the extension runtime.

The Custom Script Extension integrates with Azure Resource Manager templates. You can also run it by using the Azure CLI, Azure PowerShell, or the Azure Virtual Machines REST API.

This article describes how to use the Custom Script Extension from the Azure CLI, and how to run the extension by using an Azure Resource Manager template. This article also provides troubleshooting steps for Linux systems.

There are two versions of the Custom Script Extension:

- Version 1: Microsoft.OSTCExtensions.CustomScriptForLinux
- Version 2: Microsoft.Azure.Extensions.CustomScript

Use Version 2 for new and existing deployments. The new version is a drop-in replacement. The migration is as easy as changing the name and version. You don't need to change your extension configuration.

## Prerequisites

### Supported Linux distributions

| Distribution | x64 | ARM64 |
|:-----|:------|:------|
| Alma Linux | 9.x+ | 9.x+ |
| CentOS | 7.x+,  8.x+ | 7.x+ |
| Debian | 10+ | 11.x+ |
| Flatcar Linux | 3374.2.x+ | 3374.2.x+ |
| Azure Linux | 2.x | 2.x |
| openSUSE | 12.3+ | Not Supported |
| Oracle Linux | 6.4+, 7.x+, 8.x+ | Not Supported |
| Red Hat Enterprise Linux | 6.7+, 7.x+,  8.x+ | 8.6+, 9.0+ |
| Rocky Linux | 9.x+ | 9.x+ |
| SLES | 12.x+, 15.x+ | 15.x SP4+ |
| Ubuntu | 18.04+, 20.04+, 22.04+ | 20.04+, 22.04+ |

### Script location

You can set the extension to use your Azure Blob Storage credentials so that it can access Azure Blob Storage. The script location can be anywhere, as long as the VM can route to that endpoint, for example, GitHub or an internal file server.

### Internet connectivity

To download a script externally, such as from GitHub or Azure Storage, you need to open other firewall or network security group (NSG) ports. For example, if your script is located in Azure Storage, you can allow access by using Azure NSG [service tags for Storage](../../virtual-network/network-security-groups-overview.md#service-tags).

If your script is on a local server, you might still need to open other firewall or NSG ports.

### Tips

- The highest failure rate for this extension is due to syntax errors in the script. Verify that the script runs without errors. Put more logging into the script to make it easier to find failures.
- Write scripts that are idempotent, so that running them more than once accidentally doesn't cause system changes.
- Ensure that the scripts don't require user input when they run.
- The script is allowed 90 minutes to run. Anything longer results in a failed provision of the extension.
- Don't put reboots inside the script. Restarting causes problems with other extensions that are being installed, and the extension doesn't continue after the reboot.
- If you have a script that causes a reboot before installing applications and running scripts, schedule the reboot by using a cron job or by using tools such as DSC, Chef, or Puppet extensions.
- Don't run a script that causes a stop or update of the Azure Linux Agent. It might leave the extension in a transitioning state and lead to a time-out.
- The extension runs a script only once. If you want to run a script on every startup, you can use a [cloud-init image](../linux/using-cloud-init.md) and use a [Scripts Per Boot](https://cloudinit.readthedocs.io/en/latest/topics/modules.html#scripts-per-boot) module. Alternatively, you can use the script to create a [systemd](https://systemd.io/) service unit.
- You can have only one version of an extension applied to the VM. To run a second custom script, update the existing extension with a new configuration. Alternatively, you can remove the Custom Script Extension and reapply it with the updated script.
- If you want to schedule when a script runs, use the extension to create a cron job.
- When the script is running, you only see a *transitioning* extension status from the Azure portal or CLI. If you want more frequent status updates for a running script, create your own solution.
- The Custom Script Extension doesn't natively support proxy servers. However, you can use a file transfer tool, such as `Curl`, that supports proxy servers within your script.
- Be aware of nondefault directory locations that your scripts or commands might rely on. Have logic to handle this situation.

## Extension schema

The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this information in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template.

You can store sensitive data in a protected configuration, which is encrypted and only decrypted on the target VM. The protected configuration is useful when the execution command includes secrets such as a password. Here's an example:

```json
{
  "name": "config-app",
  "type": "Extensions",
  "location": "[resourceGroup().location]",
  "apiVersion": "2019-03-01",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', concat(variables('vmName'),copyindex()))]"
  ],
  "tags": {
    "displayName": "config-app"
  },
  "properties": {
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.1",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "skipDos2Unix":false,
      "timestamp":123456789          
    },
    "protectedSettings": {
       "commandToExecute": "<command-to-execute>",
       "script": "<base64-script-to-execute>",
       "storageAccountName": "<storage-account-name>",
       "storageAccountKey": "<storage-account-key>",
       "fileUris": ["https://.."],
       "managedIdentity" : "<managed-identity-identifier>"
    }
  }
}
```

> [!NOTE]
> The `managedIdentity` property *must not* be used in conjunction with the `storageAccountName` or `storageAccountKey` property.

### Property values

| Name | Value or example | Data type |
| ---- | ---- | ---- |
| apiVersion | `2019-03-01` | date |
| publisher | `Microsoft.Azure.Extensions` | string |
| type | `CustomScript` | string |
| typeHandlerVersion | `2.1` | int |
| fileUris | `https://github.com/MyProject/Archive/MyPythonScript.py` | array |
| commandToExecute | `python MyPythonScript.py \<my-param1>` | string |
| script | `IyEvYmluL3NoCmVjaG8gIlVwZGF0aW5nIHBhY2thZ2VzIC4uLiIKYXB0IHVwZGF0ZQphcHQgdXBncmFkZSAteQo=` | string |
| skipDos2Unix | `false` | boolean |
| timestamp | `123456789` | 32-bit integer |
| storageAccountName | `examplestorageacct` | string |
| storageAccountKey | `TmJK/1N3AbAZ3q/+hOXoi/l73zOqsaxXDhqa9Y83/v5UpXQp2DQIBuv2Tifp60cE/OaHsJZmQZ7teQfczQj8hg==` | string |
| managedIdentity | `{ }` or `{ "clientId": "31b403aa-c364-4240-a7ff-d85fb6cd7232" }` or `{ "objectId": "12dd289c-0583-46e5-b9b4-115d5c19ef4b" }` | JSON object |

### Property value details

| Property | Optional or required | Details |
| ---- | ---- | ---- |
| apiVersion | Not applicable | You can find the most up-to-date API version by using [Resource Explorer](https://resources.azure.com/) or by using the command `az provider list -o json` in the Azure CLI. |
| fileUris | Optional | URLs for files to be downloaded. |
| commandToExecute | Required if `script` isn't set | The entry point script to run. Use this property instead of `script` if your command contains secrets such as passwords. |
| script | Required if `commandToExecute` isn't set | A Base64-encoded and optionally gzip'ed script run by `/bin/sh`. |
| skipDos2Unix | Optional | Set this value to `false` if you want to skip dos2unix conversion of script-based file URLs or scripts. |
| timestamp | Optional | Change this value only to trigger a rerun of the script. Any integer value is acceptable, as long as it's different from the previous value. |
| storageAccountName | Optional | The name of storage account. If you specify storage credentials, all `fileUris` values must be URLs for Azure blobs. |
| storageAccountKey | Optional | The access key of the storage account. |
| managedIdentity | Optional | The [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for downloading files. Values are `clientId` (optional, string), which is the client ID of the managed identity, and `objectId` (optional, string), which is the object ID of the managed identity.|

*Public settings* are sent in clear text to the VM where the script runs. *Protected settings* are encrypted through a key known only to Azure and the VM. The settings are saved to the VM as they were sent. That is, if the settings were encrypted, they're saved encrypted on the VM. The certificate that's used to decrypt the encrypted values is stored on the VM. The certificate is also used to decrypt settings, if necessary, at runtime.

Using public settings might be useful for debugging, but we strongly recommend that you use protected settings.

You can set the following values in either public or protected settings. The extension rejects any configuration where these values are set in both public and protected settings.

- `commandToExecute`
- `script`
- `fileUris`

#### Property: skipDos2Unix

The previous version of the Custom Script Extension, `Microsoft.OSTCExtensions.CustomScriptForLinux`, automatically converts DOS files to UNIX files by translating `\r\n` to `\n`. This translation still exists and is on by default. This conversion is applied to all files downloaded from `fileUris` or the script setting based on either of the following criteria:

- The extension is *.sh*, *.txt*, *.py*, or *.pl*. The script setting always matches this criterion because it's assumed to be a script run with */bin/sh*. The script setting is saved as *script.sh* on the VM.
- The file starts with `#!`.

The default value is `false`, which means dos2unix conversion *is* executed. You can skip the dos2unix conversion by setting `skipDos2Unix` to `true`:

```json
{
  "fileUris": ["<url>"],
  "commandToExecute": "<command-to-execute>",
  "skipDos2Unix": true
}
```

#### Property: script

The Custom Script Extension supports execution of a user-defined script. The script settings combine `commandToExecute` and `fileUris` into a single setting. Instead of having to set up a file for download from Azure Storage or a GitHub gist, you can encode the script as a setting. You can use the script to replace `commandToExecute` and `fileUris`.

Here are some requirements:

- The script must be Base64 encoded.
- The script can optionally be gzip'ed.
- You can use the script setting in public or protected settings.
- The maximum size of the script parameter's data is 256 KB. If the script exceeds this size, it doesn't run.

For example, the following script is saved to the file */script.sh/*:

```sh
#!/bin/sh
echo "Creating directories ..."
mkdir /data
chown user:user /data
mkdir /appdata
chown user:user /appdata
```

You would construct the correct Custom Script Extension script setting by taking the output of the following command:

```bash
cat script.sh | base64 -w0
```

```json
{
  "script": "IyEvYmluL3NoCmVjaG8gIlVwZGF0aW5nIHBhY2thZ2VzIC4uLiIKYXB0IHVwZGF0ZQphcHQgdXBncmFkZSAteQo="
}
```

In most cases, the script can optionally be gzip'ed to further reduce size. The Custom Script Extension automatically detects the use of gzip compression.

```bash
cat script | gzip -9 | base64 -w 0
```

The Custom Script Extension uses the following algorithm to run a script:

1. Assert that the length of the script's value doesn't exceed 256 KB.
1. Base64 decode the script's value.
1. _Try_ to gunzip the Base64-decoded value.
1. Write the decoded and optionally decompressed value to disk: */var/lib/waagent/custom-script/#/script.sh*.
1. Run the script by using `_/bin/sh -c /var/lib/waagent/custom-script/#/script.sh`.

#### Property: managedIdentity

> [!NOTE]
> This property *must* be specified in protected settings only.

The Custom Script Extension, version 2.1 and later, supports [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) for downloading files from URLs provided in the `fileUris` setting. This approach allows the Custom Script Extension to access Azure Storage private blobs or containers without the user having to pass secrets like shared access signature (SAS) tokens or storage account keys.

To use this feature, add a [system-assigned](../../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity) or [user-assigned](../../app-service/overview-managed-identity.md?tabs=dotnet#add-a-user-assigned-identity) identity to the VM or Virtual Machine Scale Set where the Custom Script Extension is expected to run. Then [grant the managed identity access to the Azure Storage container or blob](../../active-directory/managed-identities-azure-resources/tutorial-vm-windows-access-storage.md#grant-access).

To use the system-assigned identity on the target VM or Virtual Machine Scale Set, set `managedidentity` to an empty JSON object.

```json
{
  "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.sh"],
  "commandToExecute": "sh script1.sh",
  "managedIdentity" : {}
}
```

To use the user-assigned identity on the target VM or Virtual Machine Scale Set, configure `managedidentity` with the client ID or the object ID of the managed identity.

```json
{
  "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.sh"],
  "commandToExecute": "sh script1.sh",
  "managedIdentity" : { "clientId": "31b403aa-c364-4240-a7ff-d85fb6cd7232" }
}
```

```json
{
  "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.sh"],
  "commandToExecute": "sh script1.sh",
  "managedIdentity" : { "objectId": "12dd289c-0583-46e5-b9b4-115d5c19ef4b" }
}
```

> [!NOTE]
> The `managedIdentity` property *must not* be used in conjunction with the `storageAccountName` or `storageAccountKey` property.

## Template deployment

You can deploy Azure VM extensions by using Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during the template's deployment. You can find a sample template that includes the Custom Script Extension on [GitHub](https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/mongodb-on-ubuntu/azuredeploy.json/).

```json
{
  "name": "config-app",
  "type": "extensions",
  "location": "[resourceGroup().location]",
  "apiVersion": "2019-03-01",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', concat(variables('vmName'),copyindex()))]"
  ],
  "tags": {
    "displayName": "config-app"
  },
  "properties": {
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.1",
    "autoUpgradeMinorVersion": true,
    "settings": {
      },
    "protectedSettings": {
      "commandToExecute": "sh hello.sh <param2>",
      "fileUris": ["https://github.com/MyProject/Archive/hello.sh"
      ]  
    }
  }
}
```

> [!NOTE]
> These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

## Azure CLI

When you use the Azure CLI to run the Custom Script Extension, create a configuration file or files. At a minimum, the configuration file must contain `commandToExecute`. The `az vm extension set` command refers to the configuration file:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --protected-settings ./script-config.json
```

Alternatively, you can specify the settings in the command as a JSON-formatted string. This approach allows the configuration to be specified during execution and without a separate configuration file.

```azurecli
az vm extension set \
  --resource-group exttest \
  --vm-name exttest \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --protected-settings '{"fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],"commandToExecute": "./config-music.sh"}'
```

### Example: Public configuration with script file

This example uses the following script file named *script-config.json*:

```json
{
  "fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],
  "commandToExecute": "./config-music.sh"
}
```

1. Create the script file by using the text editor of your choice or by using the following CLI command:

   ```azurecli
   cat <<EOF > script-config.json
   {
     "fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],
     "commandToExecute": "./config-music.sh"
   }
   EOF
   ```

1. Run the following command:

   ```azurecli
   az vm extension set \
     --resource-group myResourceGroup \
     --vm-name myVM --name customScript \
     --publisher Microsoft.Azure.Extensions \
     --settings ./script-config.json
   ```

### Example: Public configuration with no script file

This example uses the following JSON-formatted content:

```json
{
  "commandToExecute": "apt-get -y update && apt-get install -y apache2"
}
```

Run the following command:

```azurecli
az vm extension set \
  --resource-group tim0329vmRG \
  --vm-name tim0329vm --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings '{"commandToExecute": "apt-get -y update && apt-get install -y apache2"}'
```

### Example: Public and protected configuration files

Use a public configuration file to specify the script file's URI:

```json
{
  "fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"]
}
```

Use a protected configuration file to specify the command to be run:

```json
{
  "commandToExecute": "./config-music.sh"
}
```

1. Create the public configuration file by using the text editor of your choice or by using the following CLI command:

   ```azurecli
   cat <<EOF > script-config.json
   {
     "fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"]
   }
   EOF
   ```

1. Create the protected configuration file by using the text editor of your choice or by using the following CLI command:

   ```azurecli
   cat <<EOF > protected-config.json
   {
     "commandToExecute": "./config-music.sh"
   }
   EOF
   ```

1. Run the following command:

   ```azurecli
   az vm extension set \
     --resource-group myResourceGroup \
     --vm-name myVM \
     --name customScript \
     --publisher Microsoft.Azure.Extensions \
     --settings ./script-config.json \
     --protected-settings ./protected-config.json
   ```

## Virtual Machine Scale Sets

If you deploy the Custom Script Extension from the Azure portal, you don't have control over the expiration of the SAS token to access the script in your storage account. The initial deployment works, but when the storage account's SAS token expires, any subsequent scaling operation fails because the Custom Script Extension can no longer access the storage account.

We recommend that you use [PowerShell](/powershell/module/az.Compute/Add-azVmssExtension), the [Azure CLI](/cli/azure/vmss/extension), or an [Azure Resource Manager template](/azure/templates/microsoft.compute/virtualmachinescalesets/extensions) when you deploy the Custom Script Extension on a Virtual Machine Scale Set. This way, you can choose to use a managed identity or have direct control of the expiration of the SAS token for accessing the script in your storage account for as long as you need.

## Troubleshooting

When the Custom Script Extension runs, the script is created or downloaded into a directory that's similar to the following example. The command output is also saved into this directory in `stdout` and `stderr` files.

```bash
sudo ls -l /var/lib/waagent/custom-script/download/0/
```

To troubleshoot, first check the Linux Agent log and ensure that the extension ran:

```bash
sudo cat /var/log/waagent.log 
```

Look for the extension execution. It looks something like:

```output
2018/04/26 17:47:22.110231 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] [Enable] current handler state is: notinstalled
2018/04/26 17:47:22.306407 INFO Event: name=Microsoft.Azure.Extensions.customScript, op=Download, message=Download succeeded, duration=167
2018/04/26 17:47:22.339958 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Initialize extension directory
2018/04/26 17:47:22.368293 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Update settings file: 0.settings
2018/04/26 17:47:22.394482 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Install extension [bin/custom-script-shim install]
2018/04/26 17:47:23.432774 INFO Event: name=Microsoft.Azure.Extensions.customScript, op=Install, message=Launch command succeeded: bin/custom-script-shim install, duration=1007
2018/04/26 17:47:23.476151 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Enable extension [bin/custom-script-shim enable]
2018/04/26 17:47:24.516444 INFO Event: name=Microsoft.Azure.Extensions.customScript, op=Enable, message=Launch command succeeded: bin/custom-sc
```

In the preceding output:

- `Enable` is when the command starts running.
- `Download` relates to the downloading of the Custom Script Extension package from Azure, not the script files specified in `fileUris`.

The Azure Script Extension produces a log, which you can find here:

```bash
sudo cat /var/log/azure/custom-script/handler.log
```

Look for the individual execution. It looks something like:

```output
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event=start
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event=pre-check
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="comparing seqnum" path=mrseq
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="seqnum saved" path=mrseq
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="reading configuration"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="read configuration"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="validating json schema"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="json schema valid"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="parsing configuration json"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="parsed configuration json"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="validating configuration logically"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="validated configuration"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="creating output directory" path=/var/lib/waagent/custom-script/download/0
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="created output directory"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 files=1
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 file=0 event="download start"
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 file=0 event="download complete" output=/var/lib/waagent/custom-script/download/0
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="executing command" output=/var/lib/waagent/custom-script/download/0
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="executing protected commandToExecute" output=/var/lib/waagent/custom-script/download/0
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event="executed command" output=/var/lib/waagent/custom-script/download/0
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event=enabled
time=2018-04-26T17:47:23Z version=v2.0.6/git@1008306-clean operation=enable seq=0 event=end
```

Here you can see:

- The `enable` command that starts this log.
- The settings passed to the extension.
- The extension downloading the file and the result of that action.
- The command being run and the result.

You can also retrieve the execution state of the Custom Script Extension, including the actual arguments passed as `commandToExecute`, by using the Azure CLI:

```azurecli
az vm extension list -g myResourceGroup --vm-name myVM
```

The output looks like the following text:

```output
[
  {
    "autoUpgradeMinorVersion": true,
    "forceUpdateTag": null,
    "id": "/subscriptions/subscriptionid/resourceGroups/rgname/providers/Microsoft.Compute/virtualMachines/vmname/extensions/customscript",
    "resourceGroup": "rgname",
    "settings": {
      "commandToExecute": "sh script.sh > ",
      "fileUris": [
        "https://catalogartifact.azureedge.net/publicartifacts/scripts/script.sh",
        "https://catalogartifact.azureedge.net/publicartifacts/scripts/script.sh"
      ]
    },
    "tags": null,
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "typeHandlerVersion": "2.0",
    "virtualMachineExtensionType": "CustomScript"
  },
  {
    "autoUpgradeMinorVersion": true,
    "forceUpdateTag": null,
    "id": "/subscriptions/subscriptionid/resourceGroups/rgname/providers/Microsoft.Compute/virtualMachines/vmname/extensions/OmsAgentForLinux",
    "instanceView": null,
    "location": "eastus",
    "name": "OmsAgentForLinux",
    "protectedSettings": null,
    "provisioningState": "Succeeded",
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "resourceGroup": "rgname",
    "settings": {
      "workspaceId": "workspaceid"
    },
    "tags": null,
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "typeHandlerVersion": "1.0",
    "virtualMachineExtensionType": "OmsAgentForLinux"
  }
]
```

### Azure CLI syntax issues

[!INCLUDE [azure-cli-troubleshooting.md](../../../includes/azure-cli-troubleshooting.md)]

## Next steps

To see the code, current issues, and versions, see [custom-script-extension-linux](https://github.com/Azure/custom-script-extension-linux).
