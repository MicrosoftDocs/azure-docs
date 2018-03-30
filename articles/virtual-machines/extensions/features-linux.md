---
title: Virtual machine extensions and features for Linux | Microsoft Docs
description: Learn what extensions are available for Azure virtual machines, grouped by what they provide or improve.
services: virtual-machines-linux
documentationcenter: ''
author: danielsollondon
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 52f5d0ec-8f75-49e7-9e15-88d46b420e63
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/26/2017
ms.author: danis
---

# Virtual machine extensions and features for Linux

Azure virtual machine extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. For example, if a virtual machine requires software installation, anti-virus protection, or run a script inside it, a VM extension can be used to complete these tasks. Azure VM extensions can be run using the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment, or run against any existing system.

This document provides an overview of VM extensions, prerequisites for using Azure VM extensions, and guidance on how to detect, manage, and remove VM extensions. This document provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

## Use cases and samples

Several different Azure VM extensions are available, each with a specific use case. Some examples are:

- Apply PowerShell Desired State configurations to a virtual machine using the DSC extension for Linux. For more information, see [Azure Desired State configuration extension](https://github.com/Azure/azure-linux-extensions/tree/master/DSC).
- Configure monitoring of a virtual machine with the Microsoft Monitoring Agent VM extension. For more information, see [How to monitor a Linux VM](../linux/tutorial-monitoring.md).
- Configure monitoring of your Azure infrastructure with the Chef, Datadog extension. For more information, see the [Chef docs](https://docs.chef.io/azure_portal.html),[Datadog blog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).
- 

In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Linux allows any Bash script to be run on a virtual machine. Custom scripts are useful for designing Azure deployments that require configuration beyond what native Azure tooling can provide. For more information, see [Linux VM Custom Script extension](custom-script-linux.md).


## Prerequisites

To handle the extension on the VM, you will need the Azure Linux Agent installed, this has some prerequisites, but induvidual extensions will have prerequisites too, such as access to resources or dependendencies.

### Azure VM agent

The Azure VM agent manages interactions between an Azure virtual machine and the Azure fabric controller. The VM agent is responsible for many functional aspects of deploying and managing Azure virtual machines, including running VM extensions. The Azure VM agent is preinstalled on Azure Marketplace images and can be installed manually on supported operating systems.The Azure VM Agent for Linux is known as the Linux  agent.

For information on supported operating systems and installation instructions, see [Azure virtual machine agent](agent-linux.md).

#### Supported Agent Versions
In order to provide the best possible experience for our customers, there are minimum versions of the agent, please see this [article](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support).

#### Supported OSs
The Linux agent will run on multiple OS's, however the extensions framework has a limit on for the OS's that extensions could possibly run on, please see this [article] (https://support.microsoft.com/en-us/help/4078134/azure-extension-supported-operating-systems
). 
It must be noted that some extensions will not be supported across all of these and will emit Error Code 51, 'Unsupported OS'. You need to check the induvidual extension documentation for supportability. 

#### Network Access
Extension packages are downloaded from the Azure storage Extension repositry, and extension status uploads are posted to Azure storage. If you are using [non-supported](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support) version of the agents, you do not need to allow access to Azure storage in the VM region, as we can use the agent to redirect the communication to the Azure Fabric Controller for agent communications. If you are on a non-supported version of the agent, you will need to allow outbound access to Azure storage in that region from the VM. 

If you have blocked access to 168.63.129.16 using the guest firewall, then extensions will fail irrespective of the above. 

It should be noted that the agents can only be used for downloading extension packages and reporting status, for example, if an extension installs and needs to download a script from github (Custom Script) or needs access to Azure Storage (Azure Backup), then additional firewall/nsg ports need to be opened. Different extensions will have different requirements, since they are applications in their own right. For extensions that require access to Azure Storage you can allow access using Azure NSG Service Tags for [Storage](https://docs.microsoft.com/en-us/azure/virtual-network/security-overview#service-tags).

The Linux Agent does have proxy server support for you to redirect agent traffic requests through, but this does not apply extensions, for each induvidual extension you will need to config that application to work with a proxy.



## Discover VM extensions

Many different VM extensions are available for use with Azure virtual machines. To see a complete list, run the following command with the Azure CLI, replacing the example location with the location of your choice.

```azurecli
az vm extension image list --location westus -o table
```

## Run VM extensions

Azure virtual machine extensions can be run on existing virtual machines, which are useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with Azure Resource Manager template deployments. By using extensions with Resource Manager templates, Azure virtual machines can be deployed and configured without post-deployment intervention.

The following methods can be used to run an extension against an existing virtual machine.

### Azure CLI

Azure virtual machine extensions can be run against an existing virtual machine by using the `az vm extension set` command. This example runs the custom script extension against a virtual machine.

```azurecli
az vm extension set `
  --resource-group exttest `
  --vm-name exttest `
  --name customScript `
  --publisher Microsoft.Azure.Extensions `
  --settings '{"fileUris": ["https://gist.github.com/ahmetalpbalkan/b5d4a856fe15464015ae87d5587a4439/raw/466f5c30507c990a4d5a2f5c79f901fa89a80841/hello.sh"],"commandToExecute": "./hello.sh"}'
```

The script produces output similar to the following text:

```azurecli
info:    Executing command vm extension set
+ Looking up the VM "myVM"
+ Installing extension "CustomScript", VM: "mvVM"
info:    vm extension set command OK
```

### Azure portal

VM extensions can be applied to an existing virtual machine through the Azure portal. To do so, select the virtual machine, choose **Extensions**, and click **Add**. Select the extension you want from the list of available extensions and follow the instructions in the wizard.

The following image shows the installation of the Linux Custom Script extension from the Azure portal.

![Install custom script extension](./media/features-linux/installscriptextensionlinux.png)

### Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. When you deploy an extension with a template, you can create fully configured Azure deployments. For example, the following JSON is taken from a Resource Manager template. The template deploys a set of load-balanced virtual machines and an Azure SQL database, and then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

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

For more information, see [Authoring Azure Resource Manager templates](../windows/template-description.md#extensions).

## Secure VM extension data

When you're running a VM extension, it may be necessary to include sensitive information such as credentials, storage account names, and storage account access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target virtual machine. Each extension has a specific protected configuration schema, and each is detailed in extension-specific documentation.

The following example shows an instance of the Custom Script extension for Linux. Notice that the command to execute includes a set of credentials. In this example, the command to execute will not be encrypted.


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

Moving the **command to execute** property to the **protected** configuration secures the execution string.

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
### How do Agents and Extensions get updated?
The Agents and Extensions share the same update mechanism, with some differences, updates do not require additional firewall rules. 

When an update is available, this will only get installed on the VM when there is a change to extensions, and other VM Model changes, for example:
* Data disks
* Extensions
* Boot diagnostics container
* Guest OS secrets
* VM size
* Network profile

Publishers will make updates available to regions at different times, so it is possible you can have VMs in different regions on different versions.


#### Agent updates
The Linux VM Agent contains Provisioning Agent Code and Extension Handling code is in one package, which cannot be separated, however, you can disable the Provisioning Agent when you want to provision on Azure using cloud-init. To do this, see this article: https://docs.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init

In supported versions of the Agents can take automatic updates. It is important to note, the only code that can be updated is the Extension Handling code, not the provisioning code, as this is run-once code. 

The Extension Handling code is responsible communicating to the Azure Fabric, and handling the VM Extensions, such as installing them, reporting status, updating the induvidual extensions, and removing them. Updates will contain security fixes, bug fixes and enhancements to the Extension Handling code.

When the agent is installed a parent daemon is created, this then spawns a child process that is used to handle extensions. If an update is available for the agent, it is downloaded, then the parent will stop the child process, upgrade it, then restart it. Should there be a problem with the update, the parent process will roll back to the previous child version.

The parent process cannot be auto updated, this can only be updated by a distro package update.

To check what version you are running, use:

```bash
$waagent --version
```

```text
WALinuxAgent-2.2.17 running on ubuntu 16.04
Python: 3.5.2
Goal state agent: 2.2.18
```

The parent or 'package deployed version' is : WALinuxAgent-2.x.x

The 'Goal state agent' is the auto update version.

It is highly recommended that you always have auto update for the agent, [AutoUpdate.Enabled=y](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/update-agent). Not having this enabled will mean you will need to keep manually updating the agent, and not get bug and security fixes.

#### Extension updates
When an extension update is available the Linux Agent will download this, and upgrade the extension to this version. Automatic extension updates are either Minor or Hotfix, you can opt in or opt out of extensions Minor updates when you provision the extension, the example shows this in an ARM template, '"autoUpgradeMinorVersion": true,'.

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
It is highly recommended that you always select auto update in your extension deployments, this will allow you to get the latest minor release bug fixes. Hotfix updates that carry security or key bug fixes cannot be opt out.

### How to Identify Extension Updates
#### Identifying if the Extension is set with autoUpgradeMinorVersion on a VM

You can see from the VM model, if the extension was provisioned with 'autoUpgradeMinorVersion' using:

```Azure CLI v2
az vm show -g resourceGroup -n vmName
```

VM extension resources:
```json
  "resources": [
    {
      "autoUpgradeMinorVersion": true,
      "forceUpdateTag": null,
      "id": "/subscriptions/............/resourceGroups/test/providers/Microsoft.Compute/virtualMachines/vmName/extensions/CustomScriptExtension",
```

#### Identifying when an autoUpgradeMinorVersion occurred

Look at the agent logs on the VM, these will show when an update to the extension occured.

Log file: /var/log/waagent.log

In the example below, the VM had Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9025 installed. A hotfix was available to Microsoft.OSTCExtensions.LinuxDiagnostic-2.3.9027, below shows the pattern of events where the Linux Agent is selecting 2.3.9027 at the version to use, disables 2.3.9025 and updates to 2.3.9027.
```text
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

## Agent Permissions
The agent will need to run as root in order to perform its tasks.

## Troubleshoot VM extensions

Each VM extension may have troubleshooting steps specific to the extension. For example, when you're using the Custom Script extension, script execution details can be found locally on the virtual machine on which the extension was run. Any extension-specific troubleshooting steps are detailed in extension-specific documentation.

The following troubleshooting steps apply to all virtual machine extensions.

1. Check the Linux Agent Log, look at the activity when your extension was being provisioned : /var/log/waagent.log

2. Check the actual extension logs for more details : /var/log/azure/<extensionName>

3. Check extension specific documentation troubleshooting sections for error codes, known issues etc.

3. Look at the system logs, check for other operations that may have interferred with the extendion, such as a long running installation of another application that required exclusive package manager access.

### Common Reasons for Extension Failures
1. Extensions have 20mins to run (exceptions CustomScript Extensions, Chef, DSC that have 90mins), so if your deployment exceeds this, it will be marked as a timeout. The cause of this can be due to low resource VMs, other VM configurations/start up tasks consuming high amounts of resource whilst the extension is trying to provision.

2. Minimum prerequistes not met, some extensions will have dependencies on VM SKUs, for example HPC images, other extensions may require certain networking access requirements, such as communicating to Azure Storage, public services etc. Other examples could be access to package repositries, running out of disk space, security restrictions.

3. Exclusive package manager access, in some cases you may get a long running VM configuration and extension installation conflicting, where they both need exclusive access to the package manager. 

### View extension status

After a virtual machine extension has been run against a virtual machine, use the following Azure CLI command to return extension status. Replace example parameter names with your own values.

```azurecli
az vm get-instance-view -g rgName -n vmName --query "instanceView.extensions"
```

The output looks like the following text:

```text
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

Extension execution status can also be found in the Azure portal. To view the status of an extension, select the virtual machine, choose **Extensions**, and select the desired extension.

### Rerun a VM extension

There may be cases in which a virtual machine extension needs to be rerun. You can rerun an extension by removing it, and then rerunning the extension with an execution method of your choice. To remove an extension, run the following command with the Azure CLI. Replace example parameter names with your own values.

```azurecli
az vm extension delete --name customScript --resource-group myResourceGroup --vm-name myVM
```

You can remove an extension by using the following steps in the Azure portal:

1. Select a virtual machine.
2. Choose **Extensions**.
3. Select the desired extension.
4. Choose **Uninstall**.

## Common VM extension reference
| Extension name | Description | More information |
| --- | --- | --- |
| Custom Script extension for Linux |Run scripts against an Azure virtual machine |[Custom Script extension for Linux](custom-script-linux.md) |
| Docker extension |Install the Docker daemon to support remote Docker commands. |[Docker VM extension](../linux/dockerextension.md) |
| VM Access extension |Regain access to an Azure virtual machine |[VM Access extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) |
| Azure Diagnostics extension |Manage Azure Diagnostics |[Azure Diagnostics extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |
| Azure VM Access extension |Manage users and credentials |[VM Access extension for Linux](https://azure.microsoft.com/en-us/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) |
