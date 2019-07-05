---
title: Azure Custom Script Extension for Windows | Microsoft Docs
description: Automate Windows VM configuration tasks by using the Custom Script extension
services: virtual-machines-windows
manager: carmonm
author: bobbytreed
manager: carmonm
ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 05/02/2019
ms.author: robreed

---
# Custom Script Extension for Windows

The Custom Script Extension downloads and executes scripts on Azure virtual machines. This extension is useful for post deployment configuration, software installation, or any other configuration or management tasks. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run time. The Custom Script Extension integrates with Azure Resource Manager templates, and can be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API.

This document details how to use the Custom Script Extension using the Azure PowerShell module, Azure Resource Manager templates, and details troubleshooting steps on Windows systems.

## Prerequisites

> [!NOTE]  
> Do not use Custom Script Extension to run Update-AzVM with the same VM as its parameter, since it will wait on itself.  

### Operating System

The Custom Script Extension for Windows will run on the extension supported extension OSs, for more information, see this [Azure Extension supported operating systems](https://support.microsoft.com/help/4078134/azure-extension-supported-operating-systems).

### Script Location

You can configure the extension to use your Azure Blob storage credentials to access Azure Blob storage. The script location can be anywhere, as long as the VM can route to that end point, such as GitHub or an internal file server.

### Internet Connectivity

If you need to download a script externally such as from GitHub or Azure Storage, then additional firewall and Network Security Group ports need to be opened. For example, if your script is located in Azure Storage, you can allow access using Azure NSG Service Tags for [Storage](../../virtual-network/security-overview.md#service-tags).

If your script is on a local server, then you may still need additional firewall and Network Security Group ports need to be opened.

### Tips and Tricks

* The highest failure rate for this extension is because of syntax errors in the script, test the script runs without error, and also put in additional logging into the script to make it easier to find where it failed.
* Write scripts that are idempotent. This ensures that if they run again accidentally, it will not cause system changes.
* Ensure the scripts don't require user input when they run.
* There's 90 minutes allowed for the script to run, anything longer will result in a failed provision of the extension.
* Don't put reboots inside the script, this action will cause issues with other extensions that are being installed. Post reboot, the extension won't continue after the restart.
* If you have a script that will cause a reboot, then install applications and run scripts, you can schedule the reboot using a Windows Scheduled Task, or use tools such as DSC, Chef, or Puppet extensions.
* The extension will only run a script once, if you want to run a script on every boot, then you need to use the extension to create a Windows Scheduled Task.
* If you want to schedule when a script will run, you should use the extension to create a Windows Scheduled Task.
* When the script is running, you will only see a 'transitioning' extension status from the Azure portal or CLI. If you want more frequent status updates of a running script, you'll need to create your own solution.
* Custom Script extension does not natively support proxy servers, however you can use a file transfer tool that supports proxy servers within your script, such as *Curl*
* Be aware of non-default directory locations that your scripts or commands may rely on, have logic to handle this situation.

## Extension schema

The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this configuration in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template.

You can store sensitive data in a protected configuration, which is encrypted and only decrypted inside the virtual machine. The protected configuration is useful when the execution command includes secrets such as a password.

These items should be treated as sensitive data and specified in the extensions protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine.

```json
{
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "name": "config-app",
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
        "typeHandlerVersion": "1.9",
        "autoUpgradeMinorVersion": true,
        "settings": {
            "fileUris": [
                "script location"
            ],
            "timestamp":123456789
        },
        "protectedSettings": {
            "commandToExecute": "myExecutionCommand",
            "storageAccountName": "myStorageAccountName",
            "storageAccountKey": "myStorageAccountKey"
        }
    }
}
```

> [!NOTE]
> Only one version of an extension can be installed on a VM at a point in time, specifying custom script twice in the same Resource Manager template for the same VM will fail.

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2015-06-15 | date |
| publisher | Microsoft.Compute | string |
| type | CustomScriptExtension | string |
| typeHandlerVersion | 1.9 | int |
| fileUris (e.g) | https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1 | array |
| timestamp  (e.g) | 123456789 | 32-bit integer |
| commandToExecute (e.g) | powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 | string |
| storageAccountName (e.g) | examplestorageacct | string |
| storageAccountKey (e.g) | TmJK/1N3AbAZ3q/+hOXoi/l73zOqsaxXDhqa9Y83/v5UpXQp2DQIBuv2Tifp60cE/OaHsJZmQZ7teQfczQj8hg== | string |

>[!NOTE]
>These property names are case-sensitive. To avoid deployment problems, use the names as shown here.

#### Property value details

* `commandToExecute`: (**required**, string)  the entry point script to execute. Use this field instead if your command contains secrets such as passwords, or your fileUris are sensitive.
* `fileUris`: (optional, string array) the URLs for file(s) to be downloaded.
* `timestamp` (optional, 32-bit integer) use this field only to trigger a rerun of the
script by changing value of this field.  Any integer value is acceptable; it must only be different than the previous value.
* `storageAccountName`: (optional, string) the name of storage account. If you specify storage credentials, all `fileUris` must be URLs for Azure Blobs.
* `storageAccountKey`: (optional, string) the access key of storage account

The following values can be set in either public or protected settings, the extension will reject any configuration where the values below are set in both public and protected settings.

* `commandToExecute`

Using public settings maybe useful for debugging, but it's recommended that you use protected settings.

Public settings are sent in clear text to the VM where the script will be executed.  Protected settings are encrypted using a key known only to the Azure and the VM. The settings are saved to the VM as they were sent, that is, if the settings were encrypted they're saved encrypted on the VM. The certificate used to decrypt the encrypted values is stored on the VM, and used to decrypt settings (if necessary) at runtime.

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema, which is detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during deployment. The following samples show how to use the Custom Script extension:

* [Tutorial: Deploy virtual machine extensions with Azure Resource Manager templates](../../azure-resource-manager/resource-manager-tutorial-deploy-vm-extensions.md)
* [Deploy Two Tier Application on Windows and Azure SQL DB](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows)

## PowerShell deployment

The `Set-AzVMCustomScriptExtension` command can be used to add the Custom Script extension to an existing virtual machine. For more information, see [Set-AzVMCustomScriptExtension](/powershell/module/az.compute/set-azvmcustomscriptextension).

```powershell
Set-AzVMCustomScriptExtension -ResourceGroupName <resourceGroupName> `
    -VMName <vmName> `
    -Location myLocation `
    -FileUri <fileUrl> `
    -Run 'myScript.ps1' `
    -Name DemoScriptExtension
```

## Additional examples

### Using multiple scripts

In this example, you have three scripts that are used to build your server. The **commandToExecute** calls the first script, then you have options on how the others are called. For example, you can have a master script that controls the execution, with the right error handling, logging, and state management. The scripts are downloaded to the local machine for running. For example in `1_Add_Tools.ps1` you would call `2_Add_Features.ps1` by adding  `.\2_Add_Features.ps1` to the script, and repeat this process for the other scripts you define in `$settings`.

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
    -TypeHandlerVersion "1.9" `
    -Settings $settings    `
    -ProtectedSettings $protectedSettings `
```

### Running scripts from a local share

In this example, you may want to use a local SMB server for your script location. By doing this, you don't need to provide any other settings, except **commandToExecute**.

```powershell
$protectedSettings = @{"commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File \\filesvr\build\serverUpdate1.ps1"};

Set-AzVMExtension -ResourceGroupName <resourceGroupName> `
    -Location <locationName> `
    -VMName <vmName> `
    -Name "serverUpdate"
    -Publisher "Microsoft.Compute" `
    -ExtensionType "CustomScriptExtension" `
    -TypeHandlerVersion "1.9" `
    -ProtectedSettings $protectedSettings

```

### How to run custom script more than once with CLI

If you want to run the custom script extension more than once, you can only do this action under these conditions:

* The extension **Name** parameter is the same as the previous deployment of the extension.
* Update the configuration otherwise the command won't be re-executed. You can add in a dynamic property into the command, such as a timestamp.

Alternatively, you can set the [ForceUpdateTag](/dotnet/api/microsoft.azure.management.compute.models.virtualmachineextension.forceupdatetag) property to **true**.

### Using Invoke-WebRequest

If you are using [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest) in your script, you must specify the parameter `-UseBasicParsing` or else you will receive the following error when checking the detailed status:

```error
The response content cannot be parsed because the Internet Explorer engine is not available, or Internet Explorer's first-launch configuration is not complete. Specify the UseBasicParsing parameter and try again.
```

## Classic VMs

To deploy the Custom Script Extension on classic VMs, you can use the Azure portal or the Classic Azure PowerShell cmdlets.

### Azure portal

Navigate to your Classic VM resource. Select **Extensions** under **Settings**.

Click **+ Add** and in the list of resources choose **Custom Script Extension**.

On the **Install extension** page, select the local PowerShell file, and fill out any arguments and click **Ok**.

### PowerShell

Use the [Set-AzureVMCustomScriptExtension](/powershell/module/servicemanagement/azure/set-azurevmcustomscriptextension) cmdlet can be used to add the Custom Script extension to an existing virtual machine.

```powershell
# define your file URI
$fileUri = 'https://xxxxxxx.blob.core.windows.net/scripts/Create-File.ps1'

# create vm object
$vm = Get-AzureVM -Name <vmName> -ServiceName <cloudServiceName>

# set extension
Set-AzureVMCustomScriptExtension -VM $vm -FileUri $fileUri -Run 'Create-File.ps1'

# update vm
$vm | Update-AzureVM
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell module. To see the deployment state of extensions for a given VM, run the following command:

```powershell
Get-AzVMExtension -ResourceGroupName <resourceGroupName> -VMName <vmName> -Name myExtensionName
```

Extension output is logged to files found under the following folder on the target virtual machine.

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Compute.CustomScriptExtension
```

The specified files are downloaded into the following folder on the target virtual machine.

```cmd
C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.*\Downloads\<n>
```

where `<n>` is a decimal integer, which may change between executions of the extension.  The `1.*` value matches the actual, current `typeHandlerVersion` value of the extension.  For example, the actual directory could be `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2`.  

When executing the `commandToExecute` command, the extension sets this directory (for example, `...\Downloads\2`) as the current working directory. This process enables the use of relative paths to locate the files downloaded via the `fileURIs` property. See the table below for examples.

Since the absolute download path may vary over time, it's better to opt for relative script/file paths in the `commandToExecute` string, whenever possible. For example:

```json
"commandToExecute": "powershell.exe . . . -File \"./scripts/myscript.ps1\""
```

Path information after the first URI segment is kept for files downloaded via the `fileUris` property list.  As shown in the table below, downloaded files are mapped into download subdirectories to reflect the structure of the `fileUris` values.  

#### Examples of Downloaded Files

| URI in fileUris | Relative downloaded location | Absolute downloaded location <sup>1</sup> |
| ---- | ------- |:--- |
| `https://someAcct.blob.core.windows.net/aContainer/scripts/myscript.ps1` | `./scripts/myscript.ps1` |`C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2\scripts\myscript.ps1`  |
| `https://someAcct.blob.core.windows.net/aContainer/topLevel.ps1` | `./topLevel.ps1` | `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2\topLevel.ps1` |

<sup>1</sup> The absolute directory paths change over the lifetime of the VM, but not within a single execution of the CustomScript extension.

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). You can also file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
