---
title: Azure VM extensions and features for Linux
description: Learn what extensions are available for Azure virtual machines on Linux, grouped by what they provide or improve.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.collection: linux
ms.date: 05/24/2022
ms.custom: GGAL-freshness822, devx-track-azurepowershell, devx-track-azurecli, devx-track-linux
---

# Virtual machine extensions and features for Linux

Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, antivirus protection, or the ability to run a script inside it, you can use a VM extension.

You can run Azure VM extensions by using the Azure CLI, PowerShell, Azure Resource Manager templates (ARM templates), and the Azure portal. You can bundle extensions with a new VM deployment or run them against any existing system.

This article provides an overview of Azure VM extensions, prerequisites for using them, and guidance on how to detect, manage, and remove them. This article provides generalized information because many VM extensions are available. Each has a potentially unique configuration and its own documentation.

## Use cases and samples

Each Azure VM extension has a specific use case. Examples include:

- Apply PowerShell desired state configurations (DSCs) to a VM by using the [DSC extension for Linux](https://github.com/Azure/azure-linux-extensions/tree/master/DSC).
- Configure monitoring of a VM by using the [Microsoft Monitoring Agent VM extension](/previous-versions/azure/virtual-machines/linux/tutorial-monitor).
- Configure monitoring of your Azure infrastructure by using the [Chef](https://docs.chef.io/) or [Datadog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/) extension.

In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The [Custom Script extension for Linux](custom-script-linux.md) allows any Bash script to be run on a VM. Custom scripts are useful for designing Azure deployments that require configuration beyond what native Azure tooling can provide.

## Prerequisites

### Azure Linux Agent

To handle the extension on the VM, you need the [Azure Linux Agent](agent-linux.md) installed. Some individual extensions have prerequisites, such as access to resources or dependencies.

The Azure Linux Agent manages interactions between an Azure VM and the Azure fabric controller. The agent is responsible for many functional aspects of deploying and managing Azure VMs, including running VM extensions.

The Azure Linux Agent is preinstalled on Azure Marketplace images. It can also be installed manually on supported operating systems.

The agent runs on multiple operating systems. However, the extensions framework has a [limit for the operating systems that extensions use](https://support.microsoft.com/en-us/help/4078134/azure-extension-supported-operating-systems). Some extensions are not supported across all operating systems and might emit error code 51 ("Unsupported OS"). Check the individual extension documentation for supportability.

### Network access

Extension packages are downloaded from the Azure Storage extension repository. Extension status uploads are posted to Azure Storage.

If you use a [supported version of the Azure Linux Agent](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support), you don't need to allow access to Azure Storage in the VM region. You can use the agent to redirect the communication to the Azure fabric controller for agent communications. If you're on an unsupported version of the agent, you need to allow outbound access to Azure Storage in that region from the VM.

> [!IMPORTANT]
> If you've blocked access to the private IP address 168.63.129.16 by using the guest firewall, extensions fail even if you're using a supported version of the agent or you've configured outbound access.

Agents can only be used to download extension packages and reporting status. For example, if an extension installation needs to download a script from GitHub (Custom Script extension) or needs access to Azure Storage (Azure Backup), then you need to open additional firewall or network security group (NSG) ports. Different extensions have different requirements, because they're applications in their own right. For extensions that require access to Azure Storage, you can allow access by using Azure NSG [service tags](../../virtual-network/network-security-groups-overview.md#service-tags).

To redirect agent traffic requests, the Azure Linux Agent has proxy server support. However, this proxy server support does not apply extensions. You must configure each individual extension to work with a proxy.

## Discover VM extensions

### [Azure CLI](#tab/azure-cli)

Many VM extensions are available for use with Azure VMs. To see a complete list, use [az vm extension image list](/cli/azure/vm/extension/image#az-vm-extension-image-list). The following example lists all available extensions in the *westus* location:

```azurecli
az vm extension image list --location westus --output table
```

### [Azure PowerShell](#tab/azure-powershell)

Many VM extensions are available for use with Azure VMs. To see a complete list, use [Get-AzVMExtensionImage](/powershell/module/az.compute/get-azvmextensionimage). The following example lists all available extensions in the *westus* location:

```azurepowershell
Get-AzVmImagePublisher -Location "westus" |
Get-AzVMExtensionImageType |
Get-AzVMExtensionImage | Select-Object Type, PublisherName, Version
```

---

## Run VM extensions

Azure VM extensions run on existing VMs. That's useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with ARM template deployments. By using extensions with ARM templates, you can deploy and configure Azure VMs without post-deployment intervention.

You can use the following methods to run an extension against an existing VM.

### Azure CLI

You can run Azure VM extensions against an existing VM by using the [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command. The following example runs the Custom Script extension against a VM named *myVM* in a resource group named *myResourceGroup*. Replace the example resource group name, VM name, and script to run (https:\//raw.githubusercontent.com/me/project/hello.sh) with your own information.

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings '{"fileUris": ["https://raw.githubusercontent.com/me/project/hello.sh"],"commandToExecute": "./hello.sh"}'
```

When the extension runs correctly, the output is similar to the following example:

```output
info:    Executing command vm extension set
+ Looking up the VM "myVM"
+ Installing extension "CustomScript", VM: "mvVM"
info:    vm extension set command OK
```

### Azure PowerShell

You can run Azure VM extensions against an existing VM by using the [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) command. The following example runs the Custom Script extension against a VM named *myVM* in a resource group named *myResourceGroup*. Replace the example resource group name, VM name, and script to run (https:\//raw.githubusercontent.com/me/project/hello.sh) with your own information.

```azurepowershell
$Params = @{
    ResourceGroupName  = 'myResourceGroup'
    VMName             = 'myVM'
    Name               = 'CustomScript'
    Publisher          = 'Microsoft.Azure.Extensions'
    ExtensionType      = 'CustomScript'
    TypeHandlerVersion = '2.1'
    Settings          = @{fileUris = @('https://raw.githubusercontent.com/me/project/hello.sh'); commandToExecute = './hello.sh'}
}
Set-AzVMExtension @Params
```
When the extension runs correctly, the output is similar to the following example:

```Output
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK
```

### Azure portal

You can apply VM extensions to an existing VM through the Azure portal. Select the VM in the portal, select **Extensions**, and then select **Add**. Choose the extension that you want from the list of available extensions, and follow the instructions in the wizard.

The following image shows the installation of the Custom Script extension for Linux from the Azure portal:

![Screenshot of the dialog for installing the Custom Script extension for Linux.](./media/features-linux/installscriptextensionlinux.png)

### Azure Resource Manager templates

You can add VM extensions to an ARM template and run them with the deployment of the template. When you deploy an extension with a template, you can create fully configured Azure deployments.

For example, the following JSON is taken from a [full ARM template](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux) that deploys a set of load-balanced VMs and an Azure SQL database, and then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
    "name": "config-app",
    "location": "[resourceGroup().location]",
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
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
        ]
    },
    "protectedSettings": {
        "commandToExecute": "[concat('sudo sh config-music.sh ',variables('musicStoreSqlName'), ' ', parameters('adminUsername'), ' ', parameters('sqlAdminPassword'))]"
    }
    }
}
```

For more information on creating ARM templates, see [Virtual machines in an Azure Resource Manager template](../windows/template-description.md#extensions).

## Help secure VM extension data

When you run a VM extension, it might be necessary to include sensitive information such as credentials, storage account names, and access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target VM. Each extension has a specific protected configuration schema, and each is detailed in extension-specific documentation.

The following example shows an instance of the Custom Script extension for Linux. The command to run includes a set of credentials. In this example, the command to run is not encrypted.

```json
{
  "apiVersion": "2015-06-15",
  "type": "extensions",
  "name": "config-app",
  "location": "[resourceGroup().location]",
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
      "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
      ],
      "commandToExecute": "[concat('sudo sh config-music.sh ',variables('musicStoreSqlName'), ' ', parameters('adminUsername'), ' ', parameters('sqlAdminPassword'))]"
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
      "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
      ]
    },
    "protectedSettings": {
      "commandToExecute": "[concat('sudo sh config-music.sh ',variables('musicStoreSqlName'), ' ', parameters('adminUsername'), ' ', parameters('sqlAdminPassword'))]"
    }
  }
}
```

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

#### Agent updates

The Linux VM Agent contains *Provisioning Agent code* and *extension-handling code* in one package. They can't be separated.

You can disable the Provisioning Agent when you want to [provision on Azure by using cloud-init](../linux/using-cloud-init.md).

Supported versions of the agents can use automatic updates. The only code that can be updated is the extension-handling code, not the Provisioning Agent code. The Provisioning Agent code is run-once code.

The extension-handling code is responsible for:

- Communicating with the Azure fabric.
- Handling the VM extension operations, such as installations, reporting status, updating the individual extensions, and removing extensions. Updates contain security fixes, bug fixes, and enhancements to the extension-handling code.

When the agent is installed, a parent daemon is created. This parent then spawns a child process that's used to handle extensions. If an update is available for the agent, it's downloaded. The parent stops the child process, upgrades it, and then restarts it. If there's a problem with the update, the parent process rolls back to the previous child version.

The parent process can't be automatically updated. The parent can be updated only by a distribution package update.

To check what version you're running, check `waagent` as follows:

```bash
waagent --version
```

The output is similar to the following example:

```output
WALinuxAgent-2.2.45 running on <Linux Distro>
Python: 3.6.9
Goal state agent: 2.7.1.0
```

In the preceding example output, the parent (or package deployed version) is `WALinuxAgent-2.2.45`. The `Goal state agent` value is the auto-update version.

We highly recommend that you always enable automatic update for the agent: [AutoUpdate.Enabled=y](./update-linux-agent.md). If you don't enable automatic update, you'll need to keep manually updating the agent, and you won't get bug and security fixes.

#### Extension updates

When an extension update is available and automatic updates are enabled, after a [change to the VM model](#how-agents-and-extensions-are-updated) occurs, the Azure Linux Agent downloads and upgrades the extension.

Automatic extension updates are either *minor* or *hotfix*. You can opt in or opt out of minor updates when you provision the extension. The following example shows how to automatically upgrade minor versions in an ARM template by using `"autoUpgradeMinorVersion": true,`:

```json
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.1",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
        ]
    },
```

To get the latest minor-release bug fixes, we highly recommend that you always select automatic update in your extension deployments. You can't opt out of hotfix updates that carry security or key bug fixes.

If you disable automatic updates or you need to upgrade a major version, use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) or [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) and specify the target version.

### How to identify extension updates

#### Identify if the extension is set with autoUpgradeMinorVersion on a VM

### [Azure CLI](#tab/azure-cli)

You can see from the VM model if the extension was provisioned with `autoUpgradeMinorVersion`. To check, use [az vm show](/cli/azure/vm#az-vm-show) and provide the resource group and VM name as follows:

```azurecli
az vm show --resource-group myResourceGroup --name myVM
```

The following example output shows that `autoUpgradeMinorVersion` is set to `true`:

```json
  "resources": [
    {
      "autoUpgradeMinorVersion": true,
      "forceUpdateTag": null,
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM/extensions/customScript",
```

### [Azure PowerShell](#tab/azure-powershell)

You can see from the VM model if the extension was provisioned with `AutoUpgradeMinorVersion`. To check, use [Get-AzVM](/powershell/module/az.compute/get-azvm) and provide the resource group and VM name as follows:

```azurepowershell
Get-AzVM -ResourceGroupName myResourceGroup -Name myVM | Select-Object -ExpandProperty Extensions
```

The following example output shows that `AutoUpgradeMinorVersion` is set to `True`:

```Output
ForceUpdateTag                :
Publisher                     : Microsoft.Azure.Extensions
VirtualMachineExtensionType   : CustomScript
TypeHandlerVersion            : 2.1
AutoUpgradeMinorVersion       : True
EnableAutomaticUpgrade        :
...
```

---

#### Identify when an autoUpgradeMinorVersion event occurred

To see when an update to the extension occurred, review the agent logs on the VM at */var/log/waagent.log*.

In the following example, the VM had `Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9025` installed. A hotfix was available to `Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027`.

```bash
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Expected handler state: enabled
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Decide which version to use
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Use version: 2.3.9027
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Current handler state is: NotInstalled
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Download extension package
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Unpack extension package
INFO Event: name=Microsoft.OSTCExtensions.LinuxDiagnostic, op=Download, message=Download succeeded
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Initialize extension directory
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Update settings file: 0.settings
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9025] Disable extension.
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9025] Launch command:diagnostic.py -disable
...
INFO Event: name=Microsoft.OSTCExtensions.LinuxDiagnostic, op=Disable, message=Launch command succeeded: diagnostic.py -disable
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Update extension.
INFO [Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027] Launch command:diagnostic.py -update
2017/08/14 20:21:57 LinuxAzureDiagnostic started to handle.
```

## Agent permissions

To perform its tasks, the agent needs to run as *root*.

## Troubleshoot VM extensions

Each VM extension might have specific troubleshooting steps. For example, when you use the Custom Script extension, you can find script execution details locally on the VM where the extension was run.

The following troubleshooting actions apply to all VM extensions:

- To check the Azure Linux Agent log, look at the activity when your extension was being provisioned in */var/log/waagent.log*.

- Check the extension logs for more details in */var/log/azure/\<extensionName>*.

- Check troubleshooting sections in extension-specific documentation for error codes, known issues, and other extension-specific information.

- Look at the system logs. Check for other operations that might have interfered with the extension, such as a long-running installation of another application that required exclusive access to the package manager.

### Common reasons for extension failures

- Extensions have 20 minutes to run. (Exceptions are Custom Script, Chef, and DSC, which have 90 minutes.) If your deployment exceeds this time, it's marked as a timeout. The cause of this can be low-resource VMs, or other VM configurations or startup tasks are consuming large amounts of resources while the extension is trying to provision.

- Minimum prerequisites aren't met. Some extensions have dependencies on VM SKUs, such as HPC images. Extensions might have certain networking access requirements, such as communicating with Azure Storage or public services. Other examples might be access to package repositories, running out of disk space, or security restrictions.

- Package manager access is exclusive. In some cases, a long-running VM configuration and extension installation might conflict because they both need exclusive access to the package manager.

### View extension status

### [Azure CLI](#tab/azure-cli)

After a VM extension has been run against a VM, use [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view) to return extension status as follows:

```azurecli
az vm get-instance-view \
    --resource-group myResourceGroup \
    --name myVM \
    --query "instanceView.extensions"
```

The output is similar to the following example:

```bash
  {
    "name": "customScript",
    "statuses": [
      {
        "code": "ProvisioningState/failed/0",
        "displayStatus": "Provisioning failed",
        "level": "Error",
        "message": "Enable failed: failed to execute command: command terminated with exit status=127\n[stdout]\n\n[stderr]\n/bin/sh: 1: ech: not found\n",
        "time": null
      }
    ],
    "substatuses": null,
    "type": "Microsoft.Azure.Extensions.CustomScript",
    "typeHandlerVersion": "2.1.6"
  }
```

### [Azure PowerShell](#tab/azure-powershell)

After a VM extension has been run against a VM, use [Get-AzVM](/powershell/module/az.compute/get-azvm) and specify the `-Status` switch parameter to return extension status as follows:

```azurepowershell
Get-AzVM -ResourceGroupName myResourceGroup -Name myVM -Status |
Select-Object -ExpandProperty Extensions |
Select-Object -ExpandProperty Statuses
```

The output is similar to the following example:

```Output
Code          : ProvisioningState/failed/0
Level         : Error
DisplayStatus : Provisioning failed
Message       : Enable failed: failed to execute command: command terminated with exit status=127
                [stdout]

                [stderr]
                /bin/sh: 1: ./hello.sh: not found

Time          :
```

---

You can also find extension execution status in the Azure portal. Select the VM, select **Extensions**, and then select the desired extension.

### Rerun a VM extension

There might be cases in which a VM extension needs to be rerun. You can rerun an extension by removing it, and then rerunning the extension with an execution method of your choice.

### [Azure CLI](#tab/azure-cli)

To remove an extension, use [az vm extension delete](/cli/azure/vm/extension#az-vm-extension-delete) as follows:

```azurecli
az vm extension delete \
    --resource-group myResourceGroup \
    --vm-name myVM \
    --name customScript
```

### [Azure PowerShell](#tab/azure-powershell)

To remove an extension, use [Remove-AzVMExtension](/powershell/module/az.compute/remove-azvmextension) as follows:

```azurepowershell
Remove-AzVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name customScript
```

To force the command to run without asking for user confirmation specify the `-Force` switch parameter.

---

You can also remove an extension in the Azure portal:

1. Select a VM.
2. Select **Extensions**.
3. Select the extension.
4. Select **Uninstall**.

## Common VM extension reference

| Extension name | Description |
| --- | --- |
| [Custom Script extension for Linux](custom-script-linux.md) |Run scripts against an Azure virtual machine. |
| [VMAccess extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) |Regain access to an Azure virtual machine. You can also use it to [manage users and credentials](https://azure.microsoft.com/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/). |
| [Azure Diagnostics extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |Manage Azure Diagnostics. |

## Next steps

For more information about VM extensions, see [Azure virtual machine extensions and features](overview.md).
