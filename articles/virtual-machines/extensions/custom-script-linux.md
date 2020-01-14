---
title: Run custom scripts on Linux VMs in Azure 
description: Automate Linux VM configuration tasks by using the Custom Script Extension v2
services: virtual-machines-linux
documentationcenter: ''
author: MicahMcKittrick-MSFT
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: cf17ab2b-8d7e-4078-b6df-955c6d5071c2
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/25/2018
ms.author: mimckitt

---
# Use the Azure Custom Script Extension Version 2 with Linux virtual machines
The Custom Script Extension Version 2 downloads and runs scripts on Azure virtual machines. This extension is useful for post-deployment configuration, software installation, or any other configuration/management task. You can download scripts from Azure Storage or another accessible internet location, or you can provide them to the extension runtime. 

The Custom Script Extension integrates with Azure Resource Manager templates. You can also run it by using Azure CLI, PowerShell, or the Azure Virtual Machines REST API.

This article details how to use the Custom Script Extension from Azure CLI, and how to run the extension by using an Azure Resource Manager template. This article also provides troubleshooting steps for Linux systems.


There are two Linux Custom Script Extensions:
* Version 1 - Microsoft.OSTCExtensions.CustomScriptForLinux
* Version 2 - Microsoft.Azure.Extensions.CustomScript

Please switch new and existing deployments to use the new version 2 instead. The new version is intended to be a drop-in replacement. Therefore, the migration is as easy as changing the name and version, you do not need to change your extension configuration.


### Operating System

The Custom Script Extension for Linux will run on the extension supported extension OS's, for more information, see this [article](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).

### Script Location

You can use the extension to use your Azure Blob storage credentials, to access Azure Blob storage. Alternatively, the script location can be any where, as long as the VM can route to that end point, such as GitHub, internal file server etc.

### Internet Connectivity
If you need to download a script externally such as GitHub or Azure Storage, then additional firewall/Network Security Group ports need to be opened. For example if your script is located in Azure Storage, you can allow access using Azure NSG Service Tags for [Storage](https://docs.microsoft.com/azure/virtual-network/security-overview#service-tags).

If your script is on a local server, then you may still need additional firewall/Network Security Group ports need to be opened.

### Tips and Tricks
* The highest failure rate for this extension is due to syntax errors in the script, test the script runs without error, and also put in additional logging into the script to make it easier to find where it failed.
* Write scripts that are idempotent, so if they get run again more than once accidentally, it will not cause system changes.
* Ensure the scripts do not require user input when they run.
* There is 90 mins allowed for the script to run, anything longer will result in a failed provision of the extension.
* Do not put reboots inside the script, this will cause issues with other extensions that are being installed, and post reboot, the extension will not continue after the restart. 
* If you have a script that will cause a reboot, then install applications and run scripts etc. You should schedule the reboot using a Cron job, or using tools such as DSC, or Chef, Puppet extensions.
* The extension will only run a script once, if you want to run a script on every boot, then you can use [cloud-init image](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init)  and use a [Scripts Per Boot](https://cloudinit.readthedocs.io/en/latest/topics/modules.html#scripts-per-boot) module. Alternatively, you can use the script to create a SystemD service unit.
* If you want to schedule when a script will run, you should use the extension to create a Cron job. 
* When the script is running, you will only see a 'transitioning' extension status from the Azure portal or CLI. If you want more frequent status updates of a running script, you will need to create your own solution.
* Custom Script extension does not natively support proxy servers, however you can use a file transfer tool that supports proxy servers within your script, such as *Curl*. 
* Be aware of non default directory locations that your scripts or commands may rely on, have logic to handle this.
*  When deploying custom script to production VMSS instances it is suggested to deploy via json template and store your script storage account where you have control over the SAS token. 


## Extension schema

The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this configuration in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template. 

You can store sensitive data in a protected configuration, which is encrypted and only decrypted inside the virtual machine. The protected configuration is useful when the execution command includes secrets such as a password.

These items should be treated as sensitive data and specified in the extensions protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine.

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

>[!NOTE]
> managedIdentity property **must not** be used in conjunction with storageAccountName or storageAccountKey properties

### Property values

| Name | Value / Example | Data Type | 
| ---- | ---- | ---- |
| apiVersion | 2019-03-01 | date |
| publisher | Microsoft.Compute.Extensions | string |
| type | CustomScript | string |
| typeHandlerVersion | 2.1 | int |
| fileUris (e.g) | https://github.com/MyProject/Archive/MyPythonScript.py | array |
| commandToExecute (e.g) | python MyPythonScript.py \<my-param1> | string |
| script | IyEvYmluL3NoCmVjaG8gIlVwZGF0aW5nIHBhY2thZ2VzIC4uLiIKYXB0IHVwZGF0ZQphcHQgdXBncmFkZSAteQo= | string |
| skipDos2Unix  (e.g) | false | boolean |
| timestamp  (e.g) | 123456789 | 32-bit integer |
| storageAccountName (e.g) | examplestorageacct | string |
| storageAccountKey (e.g) | TmJK/1N3AbAZ3q/+hOXoi/l73zOqsaxXDhqa9Y83/v5UpXQp2DQIBuv2Tifp60cE/OaHsJZmQZ7teQfczQj8hg== | string |
| managedIdentity (e.g) | { } or { "clientId": "31b403aa-c364-4240-a7ff-d85fb6cd7232" } or { "objectId": "12dd289c-0583-46e5-b9b4-115d5c19ef4b" } | json object |

### Property value details
* `apiVersion`: The most up to date apiVersion can be found using [Resource Explorer](https://resources.azure.com/) or from Azure CLI using the following command `az provider list -o json`
* `skipDos2Unix`: (optional, boolean) skip dos2unix conversion of script-based file URLs or script.
* `timestamp` (optional, 32-bit integer) use this field only to trigger a re-run of the
  script by changing value of this field.  Any integer value is acceptable; it must only be different than the previous value.
  * `commandToExecute`: (**required** if script not set, string)  the entry point script to execute. Use
  this field instead if your command contains secrets such as passwords.
* `script`: (**required** if commandToExecute not set, string)a base64 encoded (and optionally gzip'ed) script executed by /bin/sh.
* `fileUris`: (optional, string array) the URLs for file(s) to be downloaded.
* `storageAccountName`: (optional, string) the name of storage account. If you
  specify storage credentials, all `fileUris` must be URLs for Azure Blobs.
* `storageAccountKey`: (optional, string) the access key of storage account
* `managedIdentity`: (optional, json object) the [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) for downloading file(s)
  * `clientId`: (optional, string) the client ID of the managed identity
  * `objectId`: (optional, string) the object ID of the managed identity


The following values can be set in either public or protected settings, the extension will reject any configuration where the values below are set in both public and protected settings.
* `commandToExecute`
* `script`
* `fileUris`

Using public settings maybe useful for debugging, but it is strongly recommended that you use protected settings.

Public settings are sent in clear text to the VM where the script will be executed.  Protected settings are encrypted using a key known only to the Azure and the VM. The settings are saved to the VM as they were sent, i.e. if the settings were encrypted they are saved encrypted on the VM. The certificate used to decrypt the encrypted values is stored on the VM, and used to decrypt settings (if necessary) at runtime.

#### Property: skipDos2Unix

The default value is false, which means dos2unix conversion **is** executed.

The previous version of CustomScript, Microsoft.OSTCExtensions.CustomScriptForLinux, would automatically convert DOS files to UNIX files by translating `\r\n` to `\n`. This translation still exists, and is on by default. This conversion is applied to all files downloaded from fileUris or the script setting based on any of the following criteria.

* If the extension is one of `.sh`, `.txt`, `.py`, or `.pl` it will be converted. The script setting will always match this criteria because it is assumed to be a script executed with /bin/sh, and is saved as script.sh on the VM.
* If the file starts with `#!`.

The dos2unix conversion can be skipped by setting the skipDos2Unix to true.

```json
{
  "fileUris": ["<url>"],
  "commandToExecute": "<command-to-execute>",
  "skipDos2Unix": true
}
```

####  Property: script

CustomScript supports execution of a user-defined script. The script settings to combine commandToExecute and fileUris into a single setting. Instead of the having to setup a file for download from Azure storage or GitHub gist, you can simply encode the script as a
setting. Script can be used to replaced commandToExecute and fileUris.

The script **must** be base64 encoded.  The script can **optionally** be gzip'ed. The script setting can be used in public or protected settings. The maximum size of the script parameter's data is 256 KB. If the script exceeds this size it will not be executed.

For example, given the following script saved to the file /script.sh/.

```sh
#!/bin/sh
echo "Updating packages ..."
apt update
apt upgrade -y
```

The correct CustomScript script setting would be constructed by taking the output of the following command.

```sh
cat script.sh | base64 -w0
```

```json
{
  "script": "IyEvYmluL3NoCmVjaG8gIlVwZGF0aW5nIHBhY2thZ2VzIC4uLiIKYXB0IHVwZGF0ZQphcHQgdXBncmFkZSAteQo="
}
```

The script can optionally be gzip'ed to further reduce size (in most cases). (CustomScript auto-detects the use of gzip compression.)

```sh
cat script | gzip -9 | base64 -w 0
```

CustomScript uses the following algorithm to execute a script.

 1. assert the length of the script's value does not exceed 256 KB.
 1. base64 decode the script's value
 1. _attempt_ to gunzip the base64 decoded value
 1. write the decoded (and optionally decompressed) value to disk (/var/lib/waagent/custom-script/#/script.sh)
 1. execute the script using _/bin/sh -c /var/lib/waagent/custom-script/#/script.sh.

####  Property: managedIdentity

CustomScript (version 2.1.2 onwards) supports [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) based RBAC for downloading file(s) from URLs provided in the "fileUris" setting. It allows CustomScript to  access Azure Storage private blobs/containers without the user having to pass secrets like SAS tokens or storage account keys.

To use this feature, the user must add a [system-assigned](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet#adding-a-system-assigned-identity) or [user-assigned](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet#adding-a-user-assigned-identity) identity to the VM or VMSS where CustomScript is expected to run, and [grant the managed identity access to the Azure Storage container or blob](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/tutorial-vm-windows-access-storage#grant-access).

To use the system-assigned identity on the target VM/VMSS, set "managedidentity" field to an empty json object. 

> Example:
>
> ```json
> {
>   "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.sh"],
>   "commandToExecute": "sh script1.sh",
>   "managedIdentity" : {}
> }
> ```

To use the user-assigned identity on the target VM/VMSS, configure "managedidentity" field with the client ID or the object ID of the managed identity.

> Examples:
>
> ```json
> {
>   "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.sh"],
>   "commandToExecute": "sh script1.sh",
>   "managedIdentity" : { "clientId": "31b403aa-c364-4240-a7ff-d85fb6cd7232" }
> }
> ```
> ```json
> {
>   "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.sh"],
>   "commandToExecute": "sh script1.sh",
>   "managedIdentity" : { "objectId": "12dd289c-0583-46e5-b9b4-115d5c19ef4b" }
> }
> ```

> [!NOTE]
> managedIdentity property **must not** be used in conjunction with storageAccountName or storageAccountKey properties

## Template deployment
Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during an Azure Resource Manager template deployment. A sample template that includes the Custom Script Extension can be found here, [GitHub](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux).


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

>[!NOTE]
>These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

## Azure CLI
When you're using Azure CLI to run the Custom Script Extension, create a configuration file or files. At a minimum, you must have 'commandToExecute'.

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --protected-settings ./script-config.json
```

Optionally, you can specify the settings in the command as a JSON formatted string. This allows the configuration to be specified during execution and without a separate configuration file.

```azurecli
az vm extension set \
  --resource-group exttest \
  --vm-name exttest \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --protected-settings '{"fileUris": ["https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"],"commandToExecute": "./config-music.sh"}'
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
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings ./script-config.json
```

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
  --vm-name myVM --name customScript \
  --publisher Microsoft.Azure.Extensions \
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
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \ 
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings ./script-config.json \
  --protected-settings ./protected-config.json
```

## Troubleshooting
When the Custom Script Extension runs, the script is created or downloaded into a directory that's similar to the following example. The command output is also saved into this directory in `stdout` and `stderr` files.

```bash
/var/lib/waagent/custom-script/download/0/
```

To troubleshoot, first check the Linux Agent Log, ensure the extension ran, check:

```bash
/var/log/waagent.log 
```

You should look for the extension execution, it will look something like:
```text
2018/04/26 17:47:22.110231 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] [Enable] current handler state is: notinstalled
2018/04/26 17:47:22.306407 INFO Event: name=Microsoft.Azure.Extensions.customScript, op=Download, message=Download succeeded, duration=167
2018/04/26 17:47:22.339958 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Initialize extension directory
2018/04/26 17:47:22.368293 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Update settings file: 0.settings
2018/04/26 17:47:22.394482 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Install extension [bin/custom-script-shim install]
2018/04/26 17:47:23.432774 INFO Event: name=Microsoft.Azure.Extensions.customScript, op=Install, message=Launch command succeeded: bin/custom-script-shim install, duration=1007
2018/04/26 17:47:23.476151 INFO [Microsoft.Azure.Extensions.customScript-2.0.6] Enable extension [bin/custom-script-shim enable]
2018/04/26 17:47:24.516444 INFO Event: name=Microsoft.Azure.Extensions.customScript, op=Enable, message=Launch command succeeded: bin/custom-sc
```
Some points to note:
1. Enable is when the command starts running.
2. Download relates to the downloading of the CustomScript extension package from Azure, not the script files specified in fileUris.


The Azure Script Extension produces a log, which you can find here:

```bash
/var/log/azure/custom-script/handler.log
```

You should look for the individual execution, it will look something like:
```text
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
* The Enable command starting is this log
* The settings passed to the extension
* The extension downloading file and the result of that.
* The command being run and the result.

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
To see the code, current issues and versions, see [custom-script-extension-linux repo](https://github.com/Azure/custom-script-extension-linux).

