---
title: Azure VM extensions and features for Windows 
description: Learn what extensions are available for Azure virtual machines on Windows, grouped by what they provide or improve.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: MsGabsta
ms.collection: windows
ms.date: 03/30/2018 
ms.custom: devx-track-azurepowershell

---
# Virtual machine extensions and features for Windows

Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, antivirus protection, or the ability to run a script inside it, you can use a VM extension. 

You can run Azure VM extensions by using the Azure CLI, PowerShell, Azure Resource Manager templates (ARM templates), and the Azure portal. You can bundle extensions with a new VM deployment or run them against any existing system.

This article provides an overview of Azure VM extensions, prerequisites for using them, and guidance on how to detect, manage, and remove them. This article provides generalized information because many VM extensions are available. Each has a potentially unique configuration and its own documentation.

## Use cases and samples

Each Azure VM extension has a specific use case. Examples include:

- Apply PowerShell desired state configurations (DSCs) to a VM by using the [DSC extension for Windows](dsc-overview.md).
- Configure monitoring of a VM by using the [Log Analytics Agent VM extension](../../azure-monitor/vm/monitor-virtual-machine.md).
- Configure an Azure VM by using [Chef](/azure/developer/chef/windows-vm-configure).
- Configure monitoring of your Azure infrastructure by using the [Datadog extension](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).


In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The [Custom Script extension for Windows](custom-script-windows.md) allows any PowerShell script to be run on a VM. Custom scripts are useful for designing Azure deployments that require configuration beyond what native Azure tooling can provide.

## Prerequisites

### Azure VM Agent

To handle the extension on the VM, you need the [Azure VM Agent for Windows](agent-windows.md) (also called the Windows Guest Agent) installed. Some individual extensions have prerequisites, such as access to resources or dependencies.

The Azure VM Agent manages interactions between an Azure VM and the Azure fabric controller. The agent is responsible for many functional aspects of deploying and managing Azure VMs, including running VM extensions. 

The Azure VM Agent is preinstalled on Azure Marketplace images. It can also be installed manually on supported operating systems. 

The agent runs on multiple operating systems. However, the extensions framework has a [limit for the operating systems that extensions use](https://support.microsoft.com/en-us/help/4078134/azure-extension-supported-operating-systems). Some extensions are not supported across all operating systems and might emit error code 51 ("Unsupported OS"). Check the individual extension documentation for supportability.

### Network access

Extension packages are downloaded from the Azure Storage extension repository. Extension status uploads are posted to Azure Storage. 

If you use a [supported version of the Azure VM Agent](https://support.microsoft.com/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support), you don't need to allow access to Azure Storage in the VM region. You can use the agent to redirect the communication to the Azure fabric controller for agent communications (HostGAPlugin feature through the privileged channel on private IP [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md)). If you're on an unsupported version of the agent, you need to allow outbound access to Azure Storage in that region from the VM.

> [!IMPORTANT]
> If you've blocked access to 168.63.129.16 by using the guest firewall or by using a proxy, extensions fail even if you're using a supported version of the agent or you've configured outbound access. Ports 80, 443, and 32526 are required.

Agents can only be used to download extension packages and reporting status. For example, if an extension installation needs to download a script from GitHub (Custom Script extension) or needs access to Azure Storage (Azure Backup), then you need to open additional firewall or network security group (NSG) ports. Different extensions have different requirements, because they're applications in their own right. For extensions that require access to Azure Storage or Azure Active Directory, you can allow access by using Azure NSG [service tags](../../virtual-network/network-security-groups-overview.md#service-tags).

The Azure VM Agent does not have proxy server support for you to redirect agent traffic requests through. That means the Azure VM Agent will rely on your custom proxy (if you have one) to access resources on the internet or on the host through IP 168.63.129.16.

## Discover VM extensions

Many VM extensions are available for use with Azure VMs. To see a complete list, use [Get-AzVMExtensionImage](/powershell/module/az.compute/get-azvmextensionimage). The following example lists all available extensions in the *WestUS* location:

```powershell
Get-AzVmImagePublisher -Location "WestUS" |
Get-AzVMExtensionImageType |
Get-AzVMExtensionImage | Select Type, Version
```

## Run VM extensions

Azure VM extensions run on existing VMs. That's useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with ARM template deployments. By using extensions with ARM templates, you can deploy and configure Azure VMs without post-deployment intervention.

You can use the following methods to run an extension against an existing VM.

### PowerShell

Several PowerShell commands exist for running individual extensions. To see a list, use [Get-Command](/powershell/module/microsoft.powershell.core/get-command) and filter on *Extension*:

```powershell
Get-Command Set-Az*Extension* -Module Az.Compute
```

This command provides output similar to the following:

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

The following example uses the [Custom Script extension](custom-script-windows.md) to download a script from a GitHub repository onto the target virtual machine and then run the script:

```powershell
Set-AzVMCustomScriptExtension -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" -Name "myCustomScript" `
    -FileUri "https://raw.githubusercontent.com/neilpeterson/nepeters-azure-templates/master/windows-custom-script-simple/support-scripts/Create-File.ps1" `
    -Run "Create-File.ps1" -Location "West US"
```

The following example uses the [VMAccess extension](/troubleshoot/azure/virtual-machines/reset-rdp) to reset the administrative password of a Windows VM to a temporary password. After you run this code, you should reset the password at first login.

```powershell
$cred=Get-Credential

Set-AzVMAccessExtension -ResourceGroupName "myResourceGroup" -VMName "myVM" -Name "myVMAccess" `
    -Location WestUS -UserName $cred.GetNetworkCredential().Username `
    -Password $cred.GetNetworkCredential().Password -typeHandlerVersion "2.0"
```

You can use the [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) command to start any VM extension.


### Azure portal

You can apply VM extensions to an existing VM through the Azure portal. Select the VM in the portal, select **Extensions**, and then select **Add**. Choose the extension that you want from the list of available extensions, and follow the instructions in the wizard.

The following example shows the installation of the Microsoft Antimalware extension from the Azure portal:

![Screenshot of the dialog for installing the Microsoft Antimalware extension.](./media/features-windows/installantimalwareextension.png)

### Azure Resource Manager templates

You can add VM extensions to an ARM template and run them with the deployment of the template. When you deploy an extension with a template, you can create fully configured Azure deployments. 

For example, the following JSON is taken from a [full ARM template](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows) that deploys a set of load-balanced VMs and an Azure SQL database, and then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

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

For more information on creating ARM templates, see [Virtual machines in an Azure Resource Manager template](../windows/template-description.md#extensions).

## Help secure VM extension data

When you run a VM extension, it might be necessary to include sensitive information such as credentials, storage account names, and access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target VM. Each extension has a specific protected configuration schema, and each is detailed in extension-specific documentation.

The following example shows an instance of the Custom Script extension for Windows. The command to run includes a set of credentials. In this example, the command to run is not encrypted.

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

These certificates secure the communication between the VM and its host during the transfer of protected settings (password and other credentials) that extensions use. The certificates are built by the Azure fabric controller and passed to the Azure VM Agent. If you stop and start the VM every day, the fabric controller might create a new certificate. The certificate is stored in the computer's personal certificate store. These certificates can be deleted. The Azure VM Agent re-creates certificates if needed.

### How agents and extensions are updated

Agents and extensions share the same automatic update mechanism.

When an update is available and automatic updates are enabled, the update is installed on the VM only after there's a change to an extension or after other VM model changes, such as:

- Data disks
- Extensions
- Extension Tags
- Boot diagnostics container
- Guest OS secrets
- VM size
- Network profile

Publishers make updates available to regions at various times, so it's possible that you can have VMs in different regions on different versions.

> [!NOTE]
> Some updates might require additional firewall rules. See [Network access](#network-access).

#### Listing extensions deployed to a VM

```powershell
$vm = Get-AzVM -ResourceGroupName "myResourceGroup" -VMName "myVM"
$vm.Extensions | select Publisher, VirtualMachineExtensionType, TypeHandlerVersion
```

```powershell
Publisher             VirtualMachineExtensionType          TypeHandlerVersion
---------             ---------------------------          ------------------
Microsoft.Compute     CustomScriptExtension                1.9
```

#### Agent updates

The Azure VM Agent contains only *extension-handling code*. The *Windows provisioning code* is separate. You can uninstall the Azure VM Agent. You can't disable the automatic update of the Azure VM Agent.

The extension-handling code is responsible for:

- Communicating with the Azure fabric.
- Handling the VM extension operations, such as installations, reporting status, updating the individual extensions, and removing extensions. Updates contain security fixes, bug fixes, and enhancements to the extension-handling code.

To check what version you're running, see [Detect the VM Agent](agent-windows.md#detect-the-vm-agent).

#### Extension updates

When an extension update is available and automatic updates are enabled, after a [change to the VM model](#how-agents-and-extensions-are-updated) occurs, the Azure VM Agent downloads and upgrades the extension.

Automatic extension updates are either *minor* or *hotfix*. You can opt in or opt out of minor updates when you provision the extension. The following example shows how to automatically upgrade minor versions in an ARM template by using `"autoUpgradeMinorVersion": true,`:

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

If you disable automatic updates or you need to upgrade a major version, use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) and specify the target version.

### How to identify extension updates

#### Identify if the extension is set with autoUpgradeMinorVersion on a VM

You can see from the VM model if the extension was provisioned with `autoUpgradeMinorVersion`. To check, use [Get-AzVm](/powershell/module/az.compute/get-azvm) and provide the resource group and VM name as follows:

```powerShell
 $vm = Get-AzVm -ResourceGroupName "myResourceGroup" -VMName "myVM"
 $vm.Extensions
```

The following example output shows that `autoUpgradeMinorVersion` is set to `true`:

```powershell
ForceUpdateTag              :
Publisher                   : Microsoft.Compute
VirtualMachineExtensionType : CustomScriptExtension
TypeHandlerVersion          : 1.9
AutoUpgradeMinorVersion     : True
```

#### Identify when an autoUpgradeMinorVersion event occurred

To see when an update to the extension occurred, review the agent logs on the VM at *C:\WindowsAzure\Logs\WaAppAgent.log*.

In the following example, the VM had `Microsoft.Compute.CustomScriptExtension` version `1.8` installed. A hotfix was available to version `1.9`.

```powershell
[INFO]  Getting plugin locations for plugin 'Microsoft.Compute.CustomScriptExtension'. Current Version: '1.8', Requested Version: '1.9'
[INFO]  Auto-Upgrade mode. Highest public version for plugin 'Microsoft.Compute.CustomScriptExtension' with requested version: '1.9', is: '1.9'
```

## Agent permissions

To perform its tasks, the agent needs to run as *Local System*.

## Troubleshoot VM extensions

Each VM extension might have specific troubleshooting steps. For example, when you use the Custom Script extension, you can find script execution details locally on the VM where the extension was run. 

The following troubleshooting actions apply to all VM extensions:

- To check the Azure VM Agent Log, look at the activity when your extension was being provisioned in *C:\WindowsAzure\Logs\WaAppAgent.log*. 

- Check the extension logs for more details in *C:\WindowsAzure\Logs\Plugins\<extensionName>*.

- Check troubleshooting sections in extension-specific documentation for error codes, known issues, and other extension-specific information.

- Look at the system logs. Check for other operations that might have interfered with the extension, such as a long-running installation of another application that required exclusive access to the package manager.

- In a VM, if there is an existing extension with a failed provisioning state, any other new extension fails to install.

### Common reasons for extension failures

- Extensions have 20 minutes to run. (Exceptions are Custom Script, Chef, and DSC, which have 90 minutes.) If your deployment exceeds this time, it's marked as a timeout. The cause of this can be low-resource VMs, or other VM configurations or startup tasks are consuming large amounts of resources while the extension is trying to provision.

- Minimum prerequisites aren't met. Some extensions have dependencies on VM SKUs, such as HPC images. Extensions might have certain networking access requirements, such as communicating with Azure Storage or public services. Other examples might be access to package repositories, running out of disk space, or security restrictions.

- Package manager access is exclusive. In some cases, a long-running VM configuration and extension installation might conflict because they both need exclusive access to the package manager.

### View extension status

After a VM extension has been run against a VM, use [Get-AzVM](/powershell/module/az.compute/get-azvm) to return extension status. `Substatuses[0]` shows that the extension provisioning succeeded, meaning that it successfully deployed to the VM. But `Substatuses[1]` shows that the execution of the extension inside the VM failed.

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

There might be cases in which a VM extension needs to be rerun. You can rerun an extension by removing it, and then rerunning the extension with an execution method of your choice. To remove an extension, use [Remove-AzVMExtension](/powershell/module/az.compute/remove-azvmextension) as follows:

```powershell
Remove-AzVMExtension -ResourceGroupName "myResourceGroup" -VMName "myVM" -Name "myExtensionName"
```

You can also remove an extension in the Azure portal:

1. Select a VM.
2. Select **Extensions**.
3. Select the extension.
4. Select **Uninstall**.

## Common VM extension reference
| Extension name | Description |
| --- | --- |
| [Custom Script extension for Windows](custom-script-windows.md) |Run scripts against an Azure virtual machine. |
| [DSC extension for Windows](dsc-overview.md) |Apply PowerShell desired state configurations to a virtual machine. |
| [Azure Diagnostics extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |Manage Azure Diagnostics. |
| [VMAccess extension](https://azure.microsoft.com/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) |Manage users and credentials. |

## Next steps

For more information about VM extensions, see [Azure virtual machine extensions and features](overview.md).
