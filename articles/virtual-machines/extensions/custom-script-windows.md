---
title: Azure Custom Script Extension for Windows 
description: Learn how to automate Windows virtual machine configuration tasks by using the Custom Script Extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.reviewer: erd
ms.collection: windows
ms.date: 04/04/2023
---
# Custom Script Extension for Windows

The Custom Script Extension downloads and runs scripts on Azure virtual machines (VMs). Use this extension for post-deployment configuration, software installation, or any other configuration or management task. You can download scripts from Azure Storage or GitHub, or provide them to the Azure portal at extension runtime.

The Custom Script Extension integrates with Azure Resource Manager templates. You can also run it by using the Azure CLI, Azure PowerShell, the Azure portal, or the Azure Virtual Machines REST API.

This article describes how to use the Custom Script Extension by using the Azure PowerShell module and Azure Resource Manager templates. It also provides troubleshooting steps for Windows systems.

## Prerequisites

> [!NOTE]  
> Don't use the Custom Script Extension to run `Update-AzVM` with the same VM as its parameter. The extension will wait for itself.  

### Supported Windows operating systems

| Windows OS | x64 |
|:----|:-----|
| Windows 10 | Supported |
| Windows 11 | Supported |
| Windows Server 2008 SP2 | Supported |
| Windows Server 2008 R2 | Supported |
| Windows Server 2012 | Supported |
| Windows Server 2012 R2 | Supported |
| Windows Server 2016 | Supported |
| Windows Server 2016 Core | Supported |
| Windows Server 2019 | Supported |
| Windows Server 2019 Core | Supported |
| Windows Server 2022 | Supported |
| Windows Server 2022 Core | Supported |

### Script location

You can set the extension to use your Azure Blob Storage credentials so that it can access Azure Blob Storage. The script location can be anywhere, as long as the VM can route to that endpoint, for example, GitHub or an internal file server.

### Internet connectivity

To download a script externally, such as from GitHub or Azure Storage, you need to open other firewall or network security group (NSG) ports. For example, if your script is located in Azure Storage, you can allow access by using Azure NSG [service tags for Storage](../../virtual-network/network-security-groups-overview.md#service-tags).

The Custom Script Extension doesn't have any way to bypass certificate validation. If you're downloading from a secured location with, for example, a self-signed certificate, you might get errors like *The remote certificate is invalid according to the validation procedure*. Make sure that the certificate is correctly installed in the *Trusted Root Certification Authorities* store on the VM.

If your script is on a local server, you might still need to open other firewall or NSG ports.

### Tips

- Output is limited to the last 4,096 bytes.
- The highest failure rate for this extension is due to syntax errors in the script. Verify that the script runs without errors. Put more logging into the script to make it easier to find failures.
- Write scripts that are idempotent, so that running them more than once accidentally doesn't cause system changes.
- Ensure that the scripts don't require user input when they run.
- The script is allowed 90 minutes to run. Anything longer results in a failed provision of the extension.
- Don't put restarts inside the script. This action causes problems with other extensions that are being installed, and the extension doesn't continue after the restart.
- If you have a script that causes a restart before installing applications and running scripts, schedule the restart by using a Windows Scheduled Task or by using tools such as DSC, Chef, or Puppet extensions.
- Don't run a script that causes a stop or update of the VM agent. It might leave the extension in a transitioning state and lead to a time-out.
- The extension runs a script only once. If you want to run a script on every startup, use the extension to create a Windows Scheduled Task.
- If you want to schedule when a script runs, use the extension to create a Windows Scheduled Task.
- When the script is running, you only see a *transitioning* extension status from the Azure portal or Azure CLI. If you want more frequent status updates for a running script, create your own solution.
- The Custom Script Extension doesn't natively support proxy servers. However, you can use a file transfer tool, such as [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest), that supports proxy servers within your script.
- Be aware of nondefault directory locations that your scripts or commands might rely on. Have logic to handle this situation.
- The Custom Script Extension runs under the `LocalSystem` account.
- If you plan to use the `storageAccountName` and `storageAccountKey` properties, these properties must be collocated in `protectedSettings`.
- You can have only one version of an extension applied to the VM. To run a second custom script, you can update the existing extension with a new configuration. Alternatively, you can remove the custom script extension and reapply it with the updated script

## Extension schema

The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this configuration in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template.

You can store sensitive data in a protected configuration, which is encrypted and only decrypted inside the VM. The protected configuration is useful when the execution command includes secrets such as a password or a shared access signature (SAS) file reference. Here's an example:

```json
{
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "name": "virtualMachineName/config-app",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'),copyindex())]",
        "[variables('musicstoresqlName')]"
    ],
    "tags": {
        "displayName": "config-app"
    },
    "properties": {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.10",
        "autoUpgradeMinorVersion": true,
        "settings": {
            "timestamp":123456789
        },
        "protectedSettings": {
            "commandToExecute": "myExecutionCommand",
            "storageAccountName": "myStorageAccountName",
            "storageAccountKey": "myStorageAccountKey",
            "managedIdentity" : {},
            "fileUris": [
                "script location"
            ]
        }
    }
}
```

> [!NOTE]
> The `managedIdentity` property *must not* be used in conjunction with the `storageAccountName` or `storageAccountKey` property.

Only one version of an extension can be installed on a VM at a time. Specifying a custom script twice in the same Azure Resource Manager template for the same VM fails.

You can use this schema inside the VM resource or as a standalone resource. If this extension is used as a standalone resource in the Azure Resource Manager template, the name of the resource has to be in the format *virtualMachineName/extensionName*.

### Property values

| Name | Value or example | Data type |
| ---- | ---- | ---- |
| apiVersion | `2015-06-15` | date |
| publisher | `Microsoft.Compute` | string |
| type | `CustomScriptExtension` | string |
| typeHandlerVersion | `1.10` | int |
| fileUris | `https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1` | array |
| timestamp | `123456789` | 32-bit integer |
| commandToExecute | `powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1` | string |
| storageAccountName | `examplestorageacct` | string |
| storageAccountKey | `TmJK/1N3AbAZ3q/+hOXoi/l73zOqsaxXDhqa9Y83/v5UpXQp2DQIBuv2Tifp60cE/OaHsJZmQZ7teQfczQj8hg==` | string |
| managedIdentity | `{ }` or `{ "clientId": "31b403aa-c364-4240-a7ff-d85fb6cd7232" }` or `{ "objectId": "12dd289c-0583-46e5-b9b4-115d5c19ef4b" }` | JSON object |

> [!NOTE]
> These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

### Property value details

| Property | Optional or required | Details |
| ---- | ---- | ---- |
| fileUris | Optional | URLs for files to be downloaded. If URLs are sensitive, for example, if they contain keys, this field should be specified in `protectedSettings`. |
| commandToExecute | Required | The entry point script to run. Use this property if your command contains secrets such as passwords or if your file URIs are sensitive. |
| timestamp | Optional | Change this value only to trigger a rerun of the script. Any integer value is acceptable, as long as it's different from the previous value. |
| storageAccountName | Optional | The name of storage account. If you specify storage credentials, all `fileUris` values must be URLs for Azure blobs. |
| storageAccountKey | Optional | The access key of the storage account. |
| managedIdentity | Optional | The [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for downloading files. Valid values are `clientId` (optional, string), which is the client ID of the managed identity, and `objectId` (optional, string), which is the object ID of the managed identity.|

*Public settings* are sent in clear text to the VM where the script runs. *Protected settings* are encrypted through a key known only to Azure and the VM. The settings are saved to the VM as they were sent. That is, if the settings were encrypted, they're saved encrypted on the VM. The certificate that's used to decrypt the encrypted values is stored on the VM. The certificate is also used to decrypt settings, if necessary, at runtime.

Using public settings might be useful for debugging, but we recommend that you use protected settings.

You can set the following values in either public or protected settings. The extension rejects any configuration where these values are set in both public and protected settings.

- `commandToExecute`
- `fileUris`

#### Property: managedIdentity

> [!NOTE]
> This property *must* be specified in protected settings only.

The Custom Script Extension, version 1.10 and later, supports [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) for downloading files from URLs provided in the `fileUris` setting. The property allows the Custom Script Extension to access Azure Storage private blobs or containers without the user having to pass secrets like SAS tokens or storage account keys.

To use this feature, add a [system-assigned](../../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity) or [user-assigned](../../app-service/overview-managed-identity.md?tabs=dotnet#add-a-user-assigned-identity) identity to the VM or Virtual Machine Scale Set where the Custom Script Extension runs. Then [grant the managed identity access to the Azure Storage container or blob](../../active-directory/managed-identities-azure-resources/tutorial-vm-windows-access-storage.md#grant-access).

To use the system-assigned identity on the target VM or Virtual Machine Scale Set, set `managedidentity` to an empty JSON object.

```json
{
  "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.ps1"],
  "commandToExecute": "powershell.exe script1.ps1",
  "managedIdentity" : {}
}
```

To use the user-assigned identity on the target VM or Virtual Machine Scale Set, configure `managedidentity` with the client ID or the object ID of the managed identity.

```json
{
  "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.ps1"],
  "commandToExecute": "powershell.exe script1.ps1",
  "managedIdentity" : { "clientId": "31b403aa-c364-4240-a7ff-d85fb6cd7232" }
}
```

```json
{
  "fileUris": ["https://mystorage.blob.core.windows.net/privatecontainer/script1.ps1"],
  "commandToExecute": "powershell.exe script1.ps1",
  "managedIdentity" : { "objectId": "12dd289c-0583-46e5-b9b4-115d5c19ef4b" }
}
```

> [!NOTE]
> The `managedIdentity` property *must not* be used in conjunction with the `storageAccountName` or `storageAccountKey` property.

## Template deployment

You can deploy Azure VM extensions by using Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during the template's deployment. The following samples show how to use the Custom Script Extension:

- [Deploy virtual machine extensions with Azure Resource Manager templates](../../azure-resource-manager/templates/template-tutorial-deploy-vm-extensions.md)
- [Deploy Two Tier Application on Windows and Azure SQL Database](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows)

## PowerShell deployment

You can use the `Set-AzVMCustomScriptExtension` command to add the Custom Script Extension to an existing virtual machine. For more information, see [Set-AzVMCustomScriptExtension](/powershell/module/az.compute/set-azvmcustomscriptextension).

```powershell
Set-AzVMCustomScriptExtension -ResourceGroupName <resourceGroupName> `
    -VMName <vmName> `
    -Location myLocation `
    -FileUri <fileUrl> `
    -Run 'myScript.ps1' `
    -Name DemoScriptExtension
```

## Examples

### Using multiple scripts

This example uses three scripts to build your server. The `commandToExecute` property calls the first script. You then have options on how the others are called. For example, you can have a lead script that controls the execution, with the right error handling, logging, and state management. The scripts are downloaded to the local machine to run.

For example, in *1_Add_Tools.ps1*, you would call *2_Add_Features.ps1* by adding `.\2_Add_Features.ps1` to the script. Repeat this process for the other scripts that you define in `$settings`.

```powershell
$fileUri = @("https://xxxxxxx.blob.core.windows.net/buildServer1/1_Add_Tools.ps1",
"https://xxxxxxx.blob.core.windows.net/buildServer1/2_Add_Features.ps1",
"https://xxxxxxx.blob.core.windows.net/buildServer1/3_CompleteInstall.ps1")

$settings = @{"fileUris" = $fileUri};

$storageAcctName = "xxxxxxx"
$storageKey = "1234ABCD"
$protectedSettings = @{"storageAccountName" = $storageAcctName; "storageAccountKey" = $storageKey; "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File 1_Add_Tools.ps1"};

#run command
Set-AzVMExtension -ResourceGroupName <resourceGroupName> `
    -Location <locationName> `
    -VMName <vmName> `
    -Name "buildserver1" `
    -Publisher "Microsoft.Compute" `
    -ExtensionType "CustomScriptExtension" `
    -TypeHandlerVersion "1.10" `
    -Settings $settings `
    -ProtectedSettings $protectedSettings;
```

### Running scripts from a local share

In this example, you might want to use a local Server Message Block (SMB) server for your script location. You then don't need to provide any other settings, except `commandToExecute`.

```powershell
$protectedSettings = @{"commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File \\filesvr\build\serverUpdate1.ps1"};

Set-AzVMExtension -ResourceGroupName <resourceGroupName> `
    -Location <locationName> `
    -VMName <vmName> `
    -Name "serverUpdate"
    -Publisher "Microsoft.Compute" `
    -ExtensionType "CustomScriptExtension" `
    -TypeHandlerVersion "1.10" `
    -ProtectedSettings $protectedSettings
```

### Running a custom script more than once by using the CLI

The Custom Script Extension handler prevents rerunning a script if the *exact* same settings have been passed. This behavior prevents accidental rerunning, which might cause unexpected behaviors if the script isn't idempotent. To confirm whether the handler blocked the rerunning, look at ```C:\WindowsAzure\Logs\Plugins\Microsoft.Compute.CustomScriptExtension\<HandlerVersion>\CustomScriptHandler.log*```. Searching for a warning like this one:

```output
Current sequence number, <SequenceNumber>, is not greater than the sequence number
of the most recently executed configuration. Exiting...
```

If you want to run the Custom Script Extension more than once, you can do that only under these conditions:

- The extension's `Name` parameter is the same as the previous deployment of the extension.
- You've updated the configuration. You can add a dynamic property to the command, such as a timestamp. If the handler detects a change in the configuration settings, it considers that change as an explicit desire to rerun the script.

Alternatively, you can set the [ForceUpdateTag](/dotnet/api/microsoft.azure.management.compute.models.virtualmachineextension.forceupdatetag) property to `true`.

### Using Invoke-WebRequest

If you're using [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest) in your script, you must specify the parameter `-UseBasicParsing`. If you don't specify the parameter, you get the following error when checking the detailed status:

```output
The response content cannot be parsed because the Internet Explorer engine
is not available, or Internet Explorer's first-launch configuration
is not complete. Specify the UseBasicParsing parameter and try again.
```

## Virtual Machine Scale Sets

If you deploy the Custom Script Extension from the Azure portal, you don't have control over the expiration of the SAS token for accessing the script in your storage account. The initial deployment works, but when the storage account's SAS token expires, any subsequent scaling operation fails because the Custom Script Extension can no longer access the storage account.

We recommend that you use [PowerShell](/powershell/module/az.compute/add-azvmssextension), the [Azure CLI](/cli/azure/vmss/extension), or an Azure Resource Manager template when you deploy the Custom Script Extension on a Virtual Machine Scale Set. This way, you can choose to use a managed identity or have direct control of the expiration of the SAS token for accessing the script in your storage account for as long as you need.

## Troubleshoot and support

You can retrieve data about the state of extension deployments from the Azure portal and by using the Azure PowerShell module. To see the deployment state of extensions for a VM, run the following command:

```powershell
Get-AzVMExtension -ResourceGroupName <resourceGroupName> `
    -VMName <vmName> -Name myExtensionName
```

Extension output is logged to files found under the following folder on the target virtual machine:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Compute.CustomScriptExtension
```

The specified files are downloaded into the following folder on the target virtual machine:

```cmd
C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.*\Downloads\<n>
```

In the preceding path, `<n>` is a decimal integer that might change between executions of the extension.  The `1.*` value matches the actual, current `typeHandlerVersion` value of the extension. For example, the actual directory could be `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2`.  

When you run the `commandToExecute` command, the extension sets this directory, for example, `...\Downloads\2`, as the current working directory. This process enables the use of relative paths to locate the files downloaded by using the `fileURIs` property. Here are examples of downloaded files:

| URI in `fileUris` | Relative download location | Absolute download location |
| ---- | ------- |:--- |
| `https://someAcct.blob.core.windows.net/aContainer/scripts/myscript.ps1` | `./scripts/myscript.ps1` |`C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2\scripts\myscript.ps1`  |
| `https://someAcct.blob.core.windows.net/aContainer/topLevel.ps1` | `./topLevel.ps1` | `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2\topLevel.ps1` |

The absolute directory paths change over the lifetime of the VM, but not within a single execution of the Custom Script Extension.

Because the absolute download path might vary over time, it's better to opt for relative script/file paths in the `commandToExecute` string, whenever possible. For example:

```json
"commandToExecute": "powershell.exe . . . -File \"./scripts/myscript.ps1\""
```

Path information after the first URI segment is kept for files downloaded by using the `fileUris` property list. As shown in the earlier table, downloaded files are mapped into download subdirectories to reflect the structure of the `fileUris` values.  

## Support

- If you need help with any part of this article, contact the Azure experts at [Azure Community Support](https://azure.microsoft.com/support/forums/).

- To file an Azure support incident, go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get support**.

- For information about using Azure support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
