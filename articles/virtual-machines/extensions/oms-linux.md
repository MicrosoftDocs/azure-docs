---
title: Log Analytics virtual machine extension for Linux 
description: Deploy the Log Analytics agent on Linux virtual machine using a virtual machine extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.author: gabsta
author: GabstaMSFT
ms.collection: linux
ms.date: 06/15/2022
---
# Log Analytics virtual machine extension for Linux

## Overview

Azure Monitor Logs provides monitoring, alerting, and alert remediation capabilities across cloud and on-premises assets. The Log Analytics virtual machine extension for Linux is published and supported by Microsoft. The extension installs the Log Analytics agent on Azure virtual machines, and enrolls virtual machines into an existing Log Analytics workspace. This document details the supported platforms, configurations, and deployment options for the Log Analytics virtual machine extension for Linux.

> [!NOTE]
> Azure Arc-enabled servers enables you to deploy, remove, and update the Log Analytics agent VM extension to non-Azure Windows and Linux machines, simplifying the management of your hybrid machine through their lifecycle. For more information, see [VM extension management with Azure Arc-enabled servers](../../azure-arc/servers/manage-vm-extensions.md).

## Prerequisites

### Operating system

For details about the supported Linux distributions, refer to the [Overview of Azure Monitor agents](../../azure-monitor/agents/agents-overview.md#supported-operating-systems) article.

### Agent and VM Extension version

The following table provides a mapping of the version of the Log Analytics VM extension and Log Analytics agent bundle for each release. A link to the release notes for the Log Analytics agent bundle version is included. Release notes include details on bug fixes and new features available for a given agent release.  

| Log Analytics Linux VM extension version | Log Analytics Agent bundle version | 
|--------------------------------|--------------------------|
| 1.17.1 | [1.17.1](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.17.1) |
| 1.16.0 | [1.16.0](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.16.0-0) |
| 1.14.23 | [1.14.23](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.23-0) |
| 1.14.20 | [1.14.20](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.20-0) |
| 1.14.19 | [1.14.19](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.19-0) |
| 1.14.16 | [1.14.16](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.16-0) |
| 1.14.13 | [1.14.13](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.13-0) |
| 1.14.11 | [1.14.11](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.11-0) |
| 1.14.9 | [1.14.9](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.14.9-0) |
| 1.13.40 | [1.13.40](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.13.40-0) |
| 1.13.35 | [1.13.35](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.13.35-0) |
| 1.13.33 | [1.13.33](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.13.33-0) |
| 1.13.27 | [1.13.27](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.13.27-0) |
| 1.13.15 | [1.13.9-0](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.13.9-0) |
| 1.12.25 | [1.12.15-0](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.12.15-0) |
| 1.11.15 | [1.11.0-9](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.11.0-9) |
| 1.10.0 | [1.10.0-1](https://github.com/microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.10.0-1) |
| 1.9.1 | [1.9.0-0](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.9.0-0) |
| 1.8.11 | [1.8.1-256](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.8.1.256)| 
| 1.8.0 | [1.8.0-256](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/1.8.0-256)| 
| 1.7.9 | [1.6.1-3](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.6.1.3)| 
| 1.6.42.0 | [1.6.0-42](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_v1.6.0-42)| 
| 1.4.60.2 | [1.4.4-210](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.4-210)| 
| 1.4.59.1 | [1.4.3-174](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.3-174)|
| 1.4.58.7 | [14.2-125](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.2-125)|
| 1.4.56.5 | [1.4.2-124](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.2-124)|
| 1.4.55.4 | [1.4.1-123](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.1-123)|
| 1.4.45.3 | [1.4.1-45](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.1-45)|
| 1.4.45.2 | [1.4.0-45](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent_GA_v1.4.0-45)|
| 1.3.127.5 | [1.3.5-127](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent-201705-v1.3.5-127)| 
| 1.3.127.7 | [1.3.5-127](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent-201705-v1.3.5-127)|
| 1.3.18.7 | [1.3.4-15](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/tag/OMSAgent-201704-v1.3.4-15)|  

### Microsoft Defender for Cloud

Microsoft Defender for Cloud automatically provisions the Log Analytics agent and connects it to a default Log Analytics workspace created by Defender for Cloud in your Azure subscription. If you are using Microsoft Defender for Cloud, do not run through the steps in this document. Doing so overwrites the configured workspace and breaks the connection with Microsoft Defender for Cloud.

### Internet connectivity

The Log Analytics agent extension for Linux requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the Log Analytics agent extension. The extension requires the workspace ID and workspace key from the target Log Analytics workspace; these values can be [found in your Log Analytics workspace](../../azure-monitor/vm/monitor-virtual-machine.md) in the Azure portal. Because the workspace key should be treated as sensitive data, it should be stored in a protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine. Note that **workspaceId** and **workspaceKey** are case-sensitive.
> [!NOTE]
> Because the [Container Monitoring solution](/previous-versions/azure/azure-monitor/containers/containers) is being retired, the following documentation uses the optional setting "skipDockerProviderInstall": true.


```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "OMSExtension",
  "apiVersion": "2018-06-01",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.16",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "workspaceId": "myWorkspaceId",
      "skipDockerProviderInstall": true
    },
    "protectedSettings": {
      "workspaceKey": "myWorkSpaceKey"
    }
  }
}
```

>[!NOTE]
>The schema above assumes that it will be placed at the root level of the template. If you put it inside the virtual machine resource in the template, the `type` and `name` properties should be changed, as described [further down](#template-deployment).

### Property values

| Name | Value / Example |
| ---- | ---- |
| apiVersion | 2018-06-01 |
| publisher | Microsoft.EnterpriseCloud.Monitoring |
| type | OmsAgentForLinux |
| typeHandlerVersion | 1.16 |
| workspaceId (e.g) | 6f680a37-00c6-41c7-a93f-1437e3462574 |
| workspaceKey (e.g) | z4bU3p1/GrnWpQkky4gdabWXAhbWSTz70hm4m2Xt92XI+rSRgE8qVvRhsGo9TXffbrTahyrwv35W0pOqQAU7uQ== |

## Template deployment

>[!NOTE]
>Certain components of the Log Analytics VM extension are also shipped in the [Diagnostics VM extension](./diagnostics-linux.md). Due to this architecture, conflicts can arise if both extensions are instantiated in the same ARM template. To avoid these install-time conflicts, use the [`dependsOn` directive](../../azure-resource-manager/templates/resource-dependency.md#dependson) to ensure the extensions are installed sequentially. The extensions can be installed in either order.

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment configuration such as onboarding to Azure Monitor Logs. A sample Resource Manager template that includes the Log Analytics agent VM extension can be found on the [Azure Quickstart Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/oms-extension-ubuntu-vm). 

The JSON configuration for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON configuration affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/templates/child-resource-name-type.md). 

The following example assumes the VM extension is nested inside the virtual machine resource. When nesting the extension resource, the JSON is placed in the `"resources": []` object of the virtual machine.

```json
{
  "type": "extensions",
  "name": "OMSExtension",
  "apiVersion": "2018-06-01",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.16",
    "settings": {
      "workspaceId": "myWorkspaceId",
      "skipDockerProviderInstall": true
    },
    "protectedSettings": {
      "workspaceKey": "myWorkSpaceKey"
    }
  }
}
```

When placing the extension JSON at the root of the template, the resource name includes a reference to the parent virtual machine, and the type reflects the nested configuration.  

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "<parentVmResource>/OMSExtension",
  "apiVersion": "2018-06-01",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.16",
    "settings": {
      "workspaceId": "myWorkspaceId",
      "skipDockerProviderInstall": true
    },
    "protectedSettings": {
      "workspaceKey": "myWorkSpaceKey"
    }
  }
}
```

## Azure CLI deployment

The Azure CLI can be used to deploy the Log Analytics agent VM extension to an existing virtual machine. Replace the *myWorkspaceKey* value below with your workspace key and the *myWorkspaceId* value with your workspace ID. These values can be found in your Log Analytics workspace in the Azure portal under *Advanced Settings*. Replace the latestVersion value with a version from [Log Analytics Linux VM extension version](oms-linux.md#agent-and-vm-extension-version). 

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name OmsAgentForLinux \
  --publisher Microsoft.EnterpriseCloud.Monitoring \
  --protected-settings '{"workspaceKey":"myWorkspaceKey"}' \
  --settings '{"workspaceId":"myWorkspaceId","skipDockerProviderInstall": true}' \
  --version latestVersion
```

## Azure PowerShell deployment

The Azure Powershell cmdlets can be used to deploy the Log Analytics agent VM extension to an existing virtual machine. Replace the *myWorkspaceKey* value below with your workspace key and the *myWorkspaceId* value with your workspace ID. These values can be found in your Log Analytics workspace in the Azure portal under *Advanced Settings*. Replace the latestVersion value with a version from [Log Analytics Linux VM extension version](oms-linux.md#agent-and-vm-extension-version). 

```powershell
Set-AzVMExtension \
  -ResourceGroupName myResourceGroup \
  -VMName myVM \
  -ExtensionName OmsAgentForLinux \
  -ExtensionType OmsAgentForLinux \
  -Publisher Microsoft.EnterpriseCloud.Monitoring \
  -TypeHandlerVersion latestVersion \
  -ProtectedSettingString '{"workspaceKey":"myWorkspaceKey"}' \
  -SettingString '{"workspaceId":"myWorkspaceId","skipDockerProviderInstall": true}'
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI or Azure Powershell. To see the deployment state of extensions for a given VM, run the following command if you are using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```
/var/log/azure/Microsoft.EnterpriseCloud.Monitoring.OmsAgentForLinux/extension.log
```

To retrieve the OMS extension version installed on a VM, run the following command if you are using Azure CLI.

```azurecli
az vm extension show --resource-group myResourceGroup --vm-name myVM --instance-view
```

To retrieve the OMS extension version installed on a VM, run the following command if you are using Azure PowerShell.

```powershell
Get-AzVMExtension -ResourceGroupName my_resource_group  -VMName my_vm_name -Name OmsAgentForLinux -Status
```

### Error codes and their meanings

| Error Code | Meaning | Possible Action |
| :---: | --- | --- |
| 9 | Enable called prematurely | [Update the Azure Linux Agent](./update-linux-agent.md) to the latest available version. |
| 10 | VM is already connected to a Log Analytics workspace | To connect the VM to the workspace specified in the extension schema, set stopOnMultipleConnections to false in public settings or remove this property. This VM gets billed once for each workspace it is connected to. |
| 11 | Invalid config provided to the extension | Follow the preceding examples to set all property values necessary for deployment. |
| 17 | Log Analytics package installation failure | | 
| 18 | Installation of OMSConfig package failed. | Look through the command output for the root failure. |
| 19 | OMI package installation failure | |
| 20 | SCX package installation failure | |
| 33 | Error generating metaconfiguration for omsconfig. | File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 51 | This extension is not supported on the VM's operation system | |
| 52 | This extension failed due to a missing dependency or permission | Check the output and logs for more information about which dependency or permission is missing. |
| 53 | This extension failed due to missing or wrong configuration parameters | Check the output and logs for more information about what went wrong. Additionally, check the correctness of the workspace ID, and verify that the machine is connected to the internet. |
| 55 | Cannot connect to the Azure Monitor service or required packages missing or dpkg package manager is locked| Check that the system either has internet access, or that a valid HTTP proxy has been provided. Additionally, check the correctness of the workspace ID, and verify that curl and tar utilities are installed. |

Additional troubleshooting information can be found on the [Log Analytics-Agent-for-Linux Troubleshooting Guide](../../azure-monitor/visualize/vmext-troubleshoot.md).

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
