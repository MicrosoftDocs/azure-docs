---
title: Azure VM extensions and features for Linux 
description: Learn what extensions are available for Azure virtual machines on Linux, grouped by what they provide or improve.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
author: amjads1
ms.author: amjads
ms.collection: linux
ms.date: 03/30/2018

---

# Virtual machine extensions and features for Linux

Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script inside of it, a VM extension can be used. Azure VM extensions can be run with the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal. Extensions can be bundled with a new VM deployment, or run against any existing system.

This article provides an overview of VM extensions, prerequisites for using Azure VM extensions, and guidance on how to detect, manage, and remove VM extensions. This article provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

## Use cases and samples

Several different Azure VM extensions are available, each with a specific use case. Some examples include:

- Apply PowerShell Desired State configurations to a VM with the DSC extension for Linux. For more information, see [Azure Desired State configuration extension](https://github.com/Azure/azure-linux-extensions/tree/master/DSC).
- Configure monitoring of a VM with the Microsoft Monitoring Agent VM extension. For more information, see [How to monitor a Linux VM](/previous-versions/azure/virtual-machines/linux/tutorial-monitor).
- Configure monitoring of your Azure infrastructure with the Chef or Datadog extension. For more information, see the [Chef docs](https://docs.chef.io/azure_portal.html) or [Datadog blog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).

In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Linux allows any Bash script to be run on a VM. Custom scripts are useful for designing Azure deployments that require configuration beyond what native Azure tooling can provide. For more information, see [Linux VM Custom Script extension](custom-script-linux.md).

## Prerequisites

To handle the extension on the VM, you need the Azure Linux Agent installed. Some individual extensions have prerequisites, such as access to resources or dependencies.

### Azure VM agent

The Azure VM agent manages interactions between an Azure VM and the Azure fabric controller. The VM agent is responsible for many functional aspects of deploying and managing Azure VMs, including running VM extensions. The Azure VM agent is preinstalled on Azure Marketplace images, and can be installed manually on supported operating systems. The Azure VM Agent for Linux is known as the Linux agent.

For information on supported operating systems and installation instructions, see [Azure virtual machine agent](agent-linux.md).

#### Supported agent versions

In order to provide the best possible experience, there are minimum versions of the agent. For more information, see [this article](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support).

#### Supported OSes

The Linux agent runs on multiple OSes, however the extensions framework has a limit for the OSes that extensions. For more information, see [this article](https://support.microsoft.com/en-us/help/4078134/azure-extension-supported-operating-systems
).

Some extensions are not supported across all OSes and may emit *Error Code 51, 'Unsupported OS'*. Check the individual extension documentation for supportability.

#### Network access

Extension packages are downloaded from the Azure Storage extension repository, and extension status uploads are posted to Azure Storage. If you use [supported](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support) version of the agents, you do not need to allow access to Azure Storage in the VM region, as can use the agent to redirect the communication to the Azure fabric controller for agent communications. If you are on a non-supported version of the agent, you need to allow outbound access to Azure storage in that region from the VM.

> [!IMPORTANT]
> If you have blocked access to *168.63.129.16* using the guest firewall, then extensions fail irrespective of the above.

Agents can only be used to download extension packages and reporting status. For example, if an extension install needs to download a script from GitHub (Custom Script) or needs access to Azure Storage (Azure Backup), then additional firewall/Network Security Group ports need to be opened. Different extensions have different requirements, since they are applications in their own right. For extensions that require access to Azure Storage, you can allow access using Azure NSG Service Tags for [Storage](../../virtual-network/network-security-groups-overview.md#service-tags).

To redirect agent traffic requests, the Linux Agent has proxy server support. However, this proxy server support does not apply extensions. You must configure each individual extension to work with a proxy.

## Discover VM extensions

Many different VM extensions are available for use with Azure VMs. To see a complete list, use [az vm extension image list](/cli/azure/vm/extension/image#az_vm_extension_image_list). The following example lists all available extensions in the *westus* location:

```azurecli
az vm extension image list --location westus --output table
```

## Run VM extensions

Azure VM extensions run on existing VMs, which is useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with Azure Resource Manager template deployments. By using extensions with Resource Manager templates, Azure VMs can be deployed and configured without post-deployment intervention.

The following methods can be used to run an extension against an existing VM.

### Azure CLI

Azure VM extensions can be run against an existing VM with the [az vm extension set](/cli/azure/vm/extension#az_vm_extension_set) command. The following example runs the Custom Script extension against a VM named *myVM* in a resource group named *myResourceGroup*. Replace the example resource group name, VM name and script to run (https:\//raw.githubusercontent.com/me/project/hello.sh) with your own information. 

```azurecli
az vm extension set `
  --resource-group myResourceGroup `
  --vm-name myVM `
  --name customScript `
  --publisher Microsoft.Azure.Extensions `
  --settings '{"fileUris": ["https://raw.githubusercontent.com/me/project/hello.sh"],"commandToExecute": "./hello.sh"}'
```

When the extension runs correctly, the output is similar to the following example:

```bash
info:    Executing command vm extension set
+ Looking up the VM "myVM"
+ Installing extension "CustomScript", VM: "mvVM"
info:    vm extension set command OK
```

### Azure portal

VM extensions can be applied to an existing VM through the Azure portal. Select the VM in the portal, choose **Extensions**, then select **Add**. Choose the extension you want from the list of available extensions and follow the instructions in the wizard.

The following image shows the installation of the Linux Custom Script extension from the Azure portal:

![Install custom script extension](./media/features-linux/installscriptextensionlinux.png)

### Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. When you deploy an extension with a template, you can create fully configured Azure deployments. For example, the following JSON is taken from a Resource Manager template that deploys a set of load-balanced VMs and Azure SQL Database, then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

For more information, see the full [Resource Manager template](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux).

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
    "typeHandlerVersion": "2.0",
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

For more information on creating Resource Manager templates, see [Authoring Azure Resource Manager templates](../windows/template-description.md#extensions).

## Secure VM extension data

When you run a VM extension, it may be necessary to include sensitive information such as credentials, storage account names, and storage account access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target VM. Each extension has a specific protected configuration schema, and each is detailed in extension-specific documentation.

The following example shows an instance of the Custom Script extension for Linux. The command to execute includes a set of credentials. In this example, the command to execute is not encrypted:

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
    "typeHandlerVersion": "2.0",
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

Moving the **command to execute** property to the **protected** configuration secures the execution string, as shown in the following example:

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
    "typeHandlerVersion": "2.0",
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

### How do agents and extensions get updated?

The Agents and Extensions share the same update mechanism. Some updates do not require additional firewall rules.

When an update is available, it is only installed on the VM when there is a change to extensions, and other VM Model changes such as:

- Data disks
- Extensions
- Boot diagnostics container
- Guest OS secrets
- VM size
- Network profile

Publishers make updates available to regions at different times, so it is possible you can have VMs in different regions on different versions.

#### Agent updates

The Linux VM Agent contains *Provisioning Agent Code* and *Extension Handling code*  in one package, which cannot be separated. You can disable the *Provisioning Agent* when you want to provision on Azure using cloud-init. To do this, see [using cloud-init](../linux/using-cloud-init.md).

Supported versions of the Agents can use automatic updates. The only code that can be updated is the *Extension Handling code*, not the provisioning code. The *Provisioning Agent code* is run-once code.

The *Extension Handling code* is responsible for communicating with the Azure fabric, and handling the VM extensions operations such as installs, reporting status, updating the individual extensions, and removing them. Updates contain security fixes, bug fixes, and enhancements to the *Extension Handling code*.

When the agent is installed, a parent daemon is created. This parent then spawns a child process that is used to handle extensions. If an update is available for the agent, it is downloaded, the parent stops the child process, upgrades it, then restarts it. Should there be a problem with the update, the parent process rolls back to the previous child version.

The parent process cannot be auto updated. The parent can only be updated by a distro package update.

To check what version you are running, check the `waagent` as follows:

```bash
waagent --version
```

The output is similar to the following example:

```bash
WALinuxAgent-2.2.17 running on ubuntu 16.04
Python: 3.6.0
Goal state agent: 2.2.18
```

In the preceding example output, the parent or 'package deployed version' is *WALinuxAgent-2.2.17*

The 'Goal state agent' is the auto update version.

It is highly recommended that you always have auto update for the agent, [AutoUpdate.Enabled=y](./update-linux-agent.md). Not having this enabled means you need to keep manually updating the agent, and not get bug and security fixes.

#### Extension updates

When an extension update is available, the Linux Agent downloads and upgrades the extension. Automatic extension updates are either *Minor* or *Hotfix*. You can opt in or opt out of extensions *Minor* updates when you provision the extension. The following example shows how to automatically upgrade minor versions in a Resource Manager template with *autoUpgradeMinorVersion": true,'*:

```json
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.0",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
        ]
    },
```

To get the latest minor release bug fixes, it is highly recommended that you always select auto update in your extension deployments. Hotfix updates that carry security or key bug fixes cannot be opted out.

### How to identify extension updates

#### Identifying if the extension is set with autoUpgradeMinorVersion on a VM

You can see from the VM model if the extension was provisioned with 'autoUpgradeMinorVersion'. To check, use [az vm show](/cli/azure/vm#az_vm_show) and provide the resource group and VM name as follows:

```azurecli
az vm show --resource-group myResourceGroup --name myVM
```

The following example output shows that *autoUpgradeMinorVersion* is set to *true*:

```json
  "resources": [
    {
      "autoUpgradeMinorVersion": true,
      "forceUpdateTag": null,
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM/extensions/CustomScriptExtension",
```

#### Identifying when an autoUpgradeMinorVersion occurred

To see when an update to the extension occurred, review the agent logs on the VM at */var/log/waagent.log*.

In the example below, the VM had *Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9025* installed. A hotfix was available to *Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027*:

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

Each VM extension may have troubleshooting steps specific to the extension. For example, when you use the Custom Script extension, script execution details can be found locally on the VM where the extension was run. Any extension-specific troubleshooting steps are detailed in extension-specific documentation.

The following troubleshooting steps apply to all VM extensions.

1. To check the Linux Agent Log, look at the activity when your extension was being provisioned in */var/log/waagent.log*

2. Check the actual extension logs for more details in */var/log/azure/\<extensionName>*

3. Check extension-specific documentation troubleshooting sections for error codes, known issues etc.

3. Look at the system logs. Check for other operations that may have interfered with the extension, such as a long running installation of another application that required exclusive package manager access.

### Common reasons for extension failures

1. Extensions have 20 mins to run (exceptions are the CustomScript extensions, Chef, and DSC that have 90 mins). If your deployment exceeds this time, it is marked as a timeout. The cause of this can be due to low resource VMs, other VM configurations/start up tasks consuming high amounts of resource whilst the extension is trying to provision.

2. Minimum prerequisites not met. Some extensions have dependencies on VM SKUs, such as HPC images. Extensions may require certain networking access requirements, such as communicating to Azure Storage or public services. Other examples could be access to package repositories, running out of disk space, or security restrictions.

3. Exclusive package manager access. In some cases, you may encounter a long running VM configuration and extension installation conflicting, where they both need exclusive access to the package manager.

### View extension status

After a VM extension has been run against a VM, use [az vm get-instance-view](/cli/azure/vm#az_vm_get_instance_view) to return extension status as follows:

```azurecli
az vm get-instance-view \
    --resource-group rgName \
    --name myVM \
    --query "instanceView.extensions"
```

The output is similar to the following example output:

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
    "type": "Microsoft.Azure.Extensions.customScript",
    "typeHandlerVersion": "2.0.6"
  }
```

Extension execution status can also be found in the Azure portal. To view the status of an extension, select the VM, choose **Extensions**, then select the desired extension.

### Rerun a VM extension

There may be cases in which a VM extension needs to be rerun. You can rerun an extension by removing it, and then rerunning the extension with an execution method of your choice. To remove an extension, use [az vm extension delete](/cli/azure/vm/extension#az_vm_extension_delete) as follows:

```azurecli
az vm extension delete \
    --resource-group myResourceGroup \
    --vm-name myVM \
    --name customScript
```

You can also remove an extension in the Azure portal as follows:

1. Select a VM.
2. Choose **Extensions**.
3. Select the desired extension.
4. Choose **Uninstall**.

## Common VM extension reference

| Extension name | Description | More information |
| --- | --- | --- |
| Custom Script extension for Linux |Run scripts against an Azure virtual machine |[Custom Script extension for Linux](custom-script-linux.md) |
| VM Access extension |Regain access to an Azure virtual machine |[VM Access extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) |
| Azure Diagnostics extension |Manage Azure Diagnostics |[Azure Diagnostics extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |
| Azure VM Access extension |Manage users and credentials |[VM Access extension for Linux](https://azure.microsoft.com/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) |

## Next steps

For more information about VM extensions, see [Azure virtual machine extensions and features overview](overview.md).