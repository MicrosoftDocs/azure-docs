---
title: Azure VM extensions and features for Windows 
description: Learn what extensions are available for Azure virtual machines on Windows, grouped by what they provide or improve.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.reviewer: erd
ms.collection: windows
ms.date: 04/03/2023 
ms.custom: devx-track-azurepowershell
---

# Virtual machine extensions and features for Windows

Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, antivirus protection, or the ability to run a script inside of the VM, you can use a VM extension. 

You can run Azure VM extensions by using the Azure CLI, PowerShell, Azure Resource Manager (ARM) templates, and the Azure portal. You can bundle extensions with a new VM deployment or run them against any existing system.

This article provides an overview of Azure VM extensions, including prerequisites and guidance on how to detect, manage, and remove extensions. This article provides generalized information because many VM extensions are available. Each extension has a potentially unique configuration and its own documentation.

## Use cases and samples

Each Azure VM extension has a specific use case. Here are some examples:

- Apply PowerShell desired state configurations (DSCs) to a VM by using the [DSC extension for Windows](dsc-overview.md).

- Configure monitoring of a VM by using the [Azure Monitor agent](/azure/azure-monitor/vm/monitor-virtual-machine) and [VM insights](/azure/azure-monitor/vm/vminsights-overview).

- Configure an Azure VM by using [Chef](/azure/developer/chef/windows-vm-configure).

- Configure monitoring of your Azure infrastructure by using the [Datadog extension](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).

In addition to process-specific extensions, a Custom Script Extension is available for both Windows and Linux virtual machines. The [Custom Script Extension for Windows](custom-script-windows.md) allows any PowerShell script to run on a VM. Custom scripts are useful for designing Azure deployments that require configuration beyond what native Azure tooling can provide.

## Prerequisites

Review the following prerequisites for working with Azure VM extensions.

### Azure VM Agent

To handle extensions on the VM, you need the [Azure Virtual Machine Agent for Windows](agent-windows.md) installed. This agent is also referred to as the Azure VM Agent or the Windows Guest Agent. As you prepare to install extensions, keep in mind that some extensions have individual prerequisites, such as access to resources or dependencies.

The Azure VM Agent manages interactions between an Azure VM and the Azure fabric controller. The agent is responsible for many functional aspects of deploying and managing Azure VMs, including running VM extensions. 

The Azure VM Agent is preinstalled on Azure Marketplace images. The agent can also be installed manually on supported operating systems. 

The agent runs on multiple operating systems. However, the extensions framework has a [limit for the operating systems that extensions use](/troubleshoot/azure/virtual-machines/extension-supported-os). Some extensions aren't supported across all operating systems and might emit error code 51 ("Unsupported OS"). Check the individual extension documentation for supportability.

### Network access

Extension packages are downloaded from the Azure Storage extension repository. Extension status uploads are posted to Azure Storage. 

If you use a [supported version of the Azure VM Agent](/troubleshoot/azure/virtual-machines/support-extensions-agent-version), you don't need to allow access to Azure Storage in the VM region. You can use the VM Agent to redirect the communication to the Azure fabric controller for agent communications (via the `HostGAPlugin` feature through the privileged channel on private IP address [168.63.129.16](/azure/virtual-network/what-is-ip-address-168-63-129-16)). If you're on an unsupported version of the VM Agent, you need to allow outbound access to Azure Storage in that region from the VM.

> [!IMPORTANT]
> If you block access to IP address 168.63.129.16 by using the guest firewall or via a proxy, extensions fail. Failure occurs even if you use a supported version of the VM Agent or you configure outbound access. Ports 80 and 32526 are required.

Agents can only be used to download extension packages and report status. For example, if an extension installation needs to download a script from GitHub (Custom Script Extension) or requires access to Azure Storage (Azure Backup), then you need to open other firewall or network security group (NSG) ports. Different extensions have different requirements because they're applications in their own right. For extensions that require access to Azure Storage or Azure Active Directory, you can allow access by using Azure NSG [service tags](/azure/virtual-network/network-security-groups-overview#service-tags).

The Azure VM Agent doesn't provide proxy server support to enable redirection of agent traffic requests. The VM Agent relies on your custom proxy (if you have one) to access resources on the internet or on the host through IP address 168.63.129.16.

## Discover VM extensions

Many VM extensions are available for use with Azure VMs. To see a complete list, use the [`Get-AzVMExtensionImage`](/powershell/module/az.compute/get-azvmextensionimage) PowerShell cmdlet.

The following command lists all available VM extensions in the West US region location:

```powershell
Get-AzVmImagePublisher -Location "West US" |
Get-AzVMExtensionImageType |
Get-AzVMExtensionImage | Select Type, Version
```

This command provides output similar to the following example:

```powershell
Type                Version
----                -------
AcronisBackup       1.0.33
AcronisBackup       1.0.51
AcronisBackupLinux  1.0.33
AlertLogicLM        1.3.0.1
AlertLogicLM        1.3.0.0
AlertLogicLM        1.4.0.1
```

## Run VM extensions

Azure VM extensions run on existing VMs, which is useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with ARM template deployments. By using extensions with ARM templates, you can deploy and configure Azure VMs without post-deployment intervention.

You can use the following methods to run an extension against an existing VM. 

> [!NOTE]
> Some of the following examples use `"<placeholder>"` parameter values in the commands. Before you run each command, make sure to replace any `"<placeholder>"` values with specific values for your configuration.

### PowerShell

Several PowerShell commands exist for running individual extensions. To see a list, use the [Get-Command](/powershell/module/microsoft.powershell.core/get-command) command and filter on *Extension*:

```powershell
Get-Command Set-Az*Extension* -Module Az.Compute
```

This command provides output similar to the following example:

```powershell
CommandType     Name                                          Version    Source
-----------     ----                                          -------    ------
Cmdlet          Set-AzVMAccessExtension                       4.5.0      Az.Compute
Cmdlet          Set-AzVMADDomainExtension                     4.5.0      Az.Compute
Cmdlet          Set-AzVMAEMExtension                          4.5.0      Az.Compute
Cmdlet          Set-AzVMBackupExtension                       4.5.0      Az.Compute
Cmdlet          Set-AzVMBginfoExtension                       4.5.0      Az.Compute
Cmdlet          Set-AzVMChefExtension                         4.5.0      Az.Compute
Cmdlet          Set-AzVMCustomScriptExtension                 4.5.0      Az.Compute
Cmdlet          Set-AzVMDiagnosticsExtension                  4.5.0      Az.Compute
Cmdlet          Set-AzVMDiskEncryptionExtension               4.5.0      Az.Compute
Cmdlet          Set-AzVMDscExtension                          4.5.0      Az.Compute
Cmdlet          Set-AzVMExtension                             4.5.0      Az.Compute
Cmdlet          Set-AzVMSqlServerExtension                    4.5.0      Az.Compute
Cmdlet          Set-AzVmssDiskEncryptionExtension             4.5.0      Az.Compute
```

The following example uses the [Custom Script Extension](custom-script-windows.md) to download a script from a GitHub repository onto the target virtual machine and then run the script.

```powershell
Set-AzVMCustomScriptExtension -ResourceGroupName "<myResourceGroup>" `
    -VMName "<myVM>" -Name "<myCustomScript>" `
    -FileUri "https://raw.githubusercontent.com/neilpeterson/nepeters-azure-templates/master/windows-custom-script-simple/support-scripts/Create-File.ps1" `
    -Run "Create-File.ps1" -Location "<myVMregion>"
```

The following example uses the [VMAccess extension](/troubleshoot/azure/virtual-machines/reset-rdp#reset-by-using-the-vmaccess-extension-and-powershell) to reset the administrative password of a Windows VM to a temporary password. After you run this code, you should reset the password at first sign-in.

<!-- Note for reviewers: The following command fails on the -UserName and -Password parameters. -->

```powershell
$cred=Get-Credential

Set-AzVMAccessExtension -ResourceGroupName "myResourceGroup" -VMName "myVM" -Name "myVMAccess" `
    -Location "myVMregion" -UserName $cred.GetNetworkCredential().Username `
    -Password $cred.GetNetworkCredential().Password -typeHandlerVersion "2.0"
```

You can use the [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) command to start any VM extension.

### Azure portal

You can apply VM extensions to an existing VM through the Azure portal. Select the VM in the portal, select **Extensions + Applications**, and then select **+ Add**. Choose the extension that you want from the list of available extensions, and follow the instructions in the wizard.

The following example shows the installation of the Microsoft Antimalware extension from the Azure portal:

:::image type="content" source="./media/features-windows/installantimalwareextension.png" alt-text="Screenshot of the dialog for installing the Microsoft Antimalware extension.":::

### Azure Resource Manager templates

You can add VM extensions to an ARM template and run them with the deployment of the template. When you deploy an extension with a template, you can create fully configured Azure deployments. 

The following JSON example is from an [ARM template](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows) that deploys a set of load-balanced VMs and an Azure SQL database, and then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
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
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ]
    },
    "protectedSettings": {
        "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
    }
}
```

For more information on creating ARM templates, see [Virtual machines in an ARM template](../windows/template-description.md#extensions).

## Help secure VM extension data

When you run a VM extension, it might be necessary to include sensitive information such as credentials, storage account names, and access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target VM. Each extension has a specific protected configuration schema, and each schema is detailed in extension-specific documentation.

The following JSON example shows an instance of the Custom Script Extension for Windows. The command to run includes a set of credentials. In this example, the command to run isn't encrypted.

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
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
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ],
        "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
    }
}
```

Moving the `commandToExecute` property to the `protected` configuration helps secure the execution string, as shown in the following example:

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
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
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ]
    },
    "protectedSettings": {
        "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
    }
}
```

On an Azure infrastructure as a service (IaaS) VM that uses extensions, in the certificates console, you might see certificates that have the subject **Windows Azure CRP Certificate Generator**. On a classic RedDog Front End (RDFE) VM, these certificates have the subject name **Windows Azure Service Management for Extensions**.

These certificates secure the communication between the VM and its host during the transfer of protected settings (password and other credentials) that extensions use. The Azure fabric controller builds the certificates and passes them to the Azure VM Agent. If you stop and start the VM every day, the fabric controller might create a new certificate. The certificate is stored in the computer's personal certificate store. These certificates can be deleted. The Azure VM Agent re-creates certificates if needed.

### How agents and extensions are updated

Agents and extensions share the same automatic update mechanism.

When an update is available and automatic updates are enabled, the update is installed on the VM only after an extension or other VM model changes. Changes can include:

- Data disks
- Extensions
- Extension Tags
- Boot diagnostics container
- Guest OS secrets
- VM size
- Network profile

Publishers make updates available to regions at various times. It's possible you can have VMs in different regions on different versions.

> [!NOTE]
> Some updates might require additional firewall rules. For more information, see [Network access](#network-access).

#### List extensions deployed to a VM

You can use the following command to list the extensions deployed to a VM:

```powershell
$vm = Get-AzVM -ResourceGroupName "<myResourceGroup>" -VMName "<myVM>"
$vm.Extensions | select Publisher, VirtualMachineExtensionType, TypeHandlerVersion
```

This command produces output similar to the following example:

```powershell
Publisher             VirtualMachineExtensionType          TypeHandlerVersion
---------             ---------------------------          ------------------
Microsoft.Compute     CustomScriptExtension                1.9
```

#### Agent updates

The Azure VM Agent contains only *extension-handling code*. The *Windows provisioning code* is separate. You can uninstall the Azure VM Agent. You can't disable the automatic update of the Azure VM Agent.

The extension-handling code is responsible for the following tasks:

- Communicate with the Azure fabric.
- Handle the VM extension operations, such as installations, reporting status, updating the individual extensions, and removing extensions. Updates contain security fixes, bug fixes, and enhancements to the extension-handling code.

To check what version you're running, see [Detect the Azure VM Agent](agent-windows.md#detect-the-azure-windows-vm-agent).

#### Extension updates

When an extension update is available and automatic updates are enabled, if a [VM model changes](#how-agents-and-extensions-are-updated), the Azure VM Agent downloads and upgrades the extension.

Automatic extension updates are either *minor* or *hotfix*. You can opt in or opt out of minor updates when you provision the extension. The following example shows how to automatically upgrade minor versions in an ARM template by using the `"autoUpgradeMinorVersion": true,` parameter:

```json
    "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.9",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ]
    },
```

To get the latest minor-release bug fixes, we highly recommend that you always select automatic update in your extension deployments. You can't opt out of hotfix updates that carry security or key bug fixes.

If you disable automatic updates or you need to upgrade a major version, use the [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) command and specify the target version.

### How to identify extension updates

There are a few ways you can identify updates for an extension.

#### Identify if the extension is set with autoUpgradeMinorVersion on a VM

You can view the VM model to determine if the extension is provisioned with the `autoUpgradeMinorVersion` parameter. To check the VM model, use the [Get-AzVm](/powershell/module/az.compute/get-azvm) command and provide the resource group and VM name as follows:

```powerShell
 $vm = Get-AzVm -ResourceGroupName "myResourceGroup" -VMName "myVM"
 $vm.Extensions
```

The following example output shows the `autoUpgradeMinorVersion` parameter is set to `true`:

```powershell
ForceUpdateTag              :
Publisher                   : Microsoft.Compute
VirtualMachineExtensionType : CustomScriptExtension
TypeHandlerVersion          : 1.9
AutoUpgradeMinorVersion     : True
```

#### Identify when an autoUpgradeMinorVersion event occurs

To see when an update to the extension occurred, you can review the agent logs on the VM at *C:\WindowsAzure\Logs\WaAppAgent.log*.

The following example shows the VM with `Microsoft.Compute.CustomScriptExtension` version `1.8` installed, and a hotfix available for version `1.9`.

```powershell
[INFO]  Getting plugin locations for plugin 'Microsoft.Compute.CustomScriptExtension'. Current Version: '1.8', Requested Version: '1.9'
[INFO]  Auto-Upgrade mode. Highest public version for plugin 'Microsoft.Compute.CustomScriptExtension' with requested version: '1.9', is: '1.9'
```

## Agent permissions

To perform its tasks, the Azure VM Agent needs to run as *Local System*.

## Troubleshoot VM extensions

Each VM extension might have specific troubleshooting steps. For example, when you use the Custom Script Extension, you can find script execution details locally on the VM where the extension is run. 

The following troubleshooting actions apply to all VM extensions:

- To check the Azure VM Agent Log, look at the activity when your extension was being provisioned in *C:\WindowsAzure\Logs\WaAppAgent.log*. 

- Check the extension logs for more details in *C:\WindowsAzure\Logs\Plugins\<extensionName>*.

- Check troubleshooting sections in extension-specific documentation for error codes, known issues, and other extension-specific information.

- Look at the system logs. Check for other operations that might have interfered with the extension, such as a long-running installation of another application that required exclusive access to the package manager.

- In a VM, if there's an existing extension with a failed provisioning state, any other new extension fails to install.

### Common reasons for extension failures

Here are some common reasons an extension can fail:

- Extensions have 20 minutes to run. (Exceptions are Custom Script, Chef, and DSC, which have 90 minutes.) If your deployment exceeds this time, it's marked as a timeout. The cause of this issue can be low-resource VMs, or other VM configurations or startup tasks are consuming large amounts of resources while the extension is trying to provision.

- Minimum prerequisites aren't met. Some extensions have dependencies on VM SKUs, such as HPC images. Extensions might have certain networking access requirements, such as communicating with Azure Storage or public services. Other examples might be access to package repositories, running out of disk space, or security restrictions.

- Package manager access is exclusive. In some cases, a long-running VM configuration and extension installation might conflict because they both need exclusive access to the package manager.

### View extension status

After a VM extension is run against a VM, use the [Get-AzVM](/powershell/module/az.compute/get-azvm) command to return extension status. The `Substatuses[0]` result shows that the extension provisioning succeeded, which means it successfully deployed to the VM. If you see the `Substatuses[1]` result, then the execution of the extension inside the VM failed.

```powershell
Get-AzVM -ResourceGroupName "myResourceGroup" -VMName "myVM" -Status
```

The output is similar to the following example:

```powershell
Extensions[0]           :
  Name                  : CustomScriptExtension
  Type                  : Microsoft.Compute.CustomScriptExtension
  TypeHandlerVersion    : 1.9
  Substatuses[0]        :
    Code                : ComponentStatus/StdOut/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Message             : Windows PowerShell \nCopyright (C) Microsoft Corporation. All rights reserved.\n
  Substatuses[1]        :
    Code                : ComponentStatus/StdErr/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Message             : The argument 'cseTest%20Scriptparam1.ps1' to the -File parameter does not exist. Provide the path to an existing '.ps1' file as an argument to the

-File parameter.
  Statuses[0]           :
    Code                : ProvisioningState/failed/-196608
    Level               : Error
    DisplayStatus       : Provisioning failed
    Message             : Finished executing command
```

You can also find extension execution status in the Azure portal. Select the VM, select **Extensions**, and then select the desired extension.

### Rerun a VM extension

In certain cases, you might need to rerun a VM extension. You can rerun an extension by removing the extension, and then rerunning the extension with an execution method of your choice. To remove an extension, use the [Remove-AzVMExtension](/powershell/module/az.compute/remove-azvmextension) command as follows:

```powershell
Remove-AzVMExtension -ResourceGroupName "myResourceGroup" -VMName "myVM" -Name "myExtensionName"
```

You can also remove an extension in the Azure portal. Select a VM, select **Extensions**, and then select the desired extension. Select **Uninstall**.

## Common VM extension reference

The following table provides some common references for VM extensions.

| Extension name | Description |
| --- | --- |
| [Custom Script Extension for Windows](custom-script-windows.md) | Run scripts against an Azure virtual machine. |
| [DSC extension for Windows](dsc-overview.md) | Apply PowerShell desired state configurations to a virtual machine. |
| [Azure Diagnostics extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) | Manage Azure Diagnostics. |
| [VMAccess extension](https://azure.microsoft.com/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) | Manage users and credentials. |

## Next steps

For more information about VM extensions, see [Azure virtual machine extensions and features](overview.md).
