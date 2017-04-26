---
title: OMS Azure virtual machine extension for Linux | Microsoft Docs
description: Deploy the OMS agent on Linux virtual machine using a virtual machine extension.
services: virtual-machines-linux
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: c7bbf210-7d71-4a37-ba47-9c74567a9ea6
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/26/2017
ms.author: nepeters

---
# OMS virtual machine extension for Linux

## Overview

Operations Management Suite (OMS) provides monitoring, alerting, and alert remediation capabilities across cloud and on-premises assets. The OMS Agent virtual machine extension for Linux is published and supported by Microsoft. The extension installs the OMS agent on Azure virtual machines, and enrolls virtual machines into an existing OMS workspace. This document details the supported platforms, configurations, and deployment options for the OMS virtual machine extension for Linux.

## Prerequisites

### Operating system

The OMS Agent extension can be run against these Linux distributions.

| Distribution | Version |
|---|---|
| CentOS Linux | 5, 6, and 7 |
| Oracle Linux | 5, 6, and 7 |
| Red Hat Enterprise Linux Server | 5, 6 and 7 |
| Debian GNU/Linux | 6, 7, and 8 |
| Ubuntu | 12.04 LTS, 14.04 LTS, 15.04, 15.10, 16.04 LTS |
| SUSE Linux Enterprise Server | 11 and 12 |

### Internet connectivity

The OMS Agent extension for Linux requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the OMS Agent extension. The extension requires the workspace Id and workspace key from the target OMS workspace, these values can be found in the OMS portal. Because the workspace key should be treated as sensitive data, it should be stored in a protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine. Note that **workspaceId** and **workspaceKey** are case-sensitive.

```json
{
  "type": "extensions",
  "name": "OMSExtension",
  "apiVersion": "2015-06-15",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.3",
    "settings": {
      "workspaceId": "myWorkspaceId"
    },
    "protectedSettings": {
      "workspaceKey": "myWorkSpaceKey"
    }
  }
}
```

### Property values

| Name | Value / Example |
| ---- | ---- |
| apiVersion | 2015-06-15 |
| publisher | Microsoft.EnterpriseCloud.Monitoring |
| type | OmsAgentForLinux |
| typeHandlerVersion | 1.3 |
| workspaceId (e.g) | 6f680a37-00c6-41c7-a93f-1437e3462574 |
| workspaceKey (e.g) | z4bU3p1/GrnWpQkky4gdabWXAhbWSTz70hm4m2Xt92XI+rSRgE8qVvRhsGo9TXffbrTahyrwv35W0pOqQAU7uQ== |


## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment configuration such as onboarding to OMS. A sample Resource Manager template that includes the OMS Agent VM extension can be found on the [Azure Quick Start Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-oms-extension-ubuntu-vm). 

The JSON for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/resource-manager-template-child-resource.md). 

The following example assumes the OMS extension is nested inside the virtual machine resource. When nesting the extension resource, the JSON is placed in the `"resources": []` object of the virtual machine.

```json
{
  "type": "extensions",
  "name": "OMSExtension",
  "apiVersion": "2015-06-15",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.3",
    "settings": {
      "workspaceId": "myWorkspaceId"
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
  "apiVersion": "2015-06-15",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.3",
    "settings": {
      "workspaceId": "myWorkspaceId"
    },
    "protectedSettings": {
      "workspaceKey": "myWorkSpaceKey"
    }
  }
}
```

## Azure CLI deployment

The Azure CLI can be used to deploy the OMS Agent VM extension to an existing virtual machine. Replace the OMS key and OMS ID with those from your OMS workspace. 

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name OmsAgentForLinux \
  --publisher Microsoft.EnterpriseCloud.Monitoring \
  --version 1.0 --protected-settings '{"workspaceKey": "omskey"}' \
  --settings '{"workspaceId": "omsid"}'
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```
/opt/microsoft/omsagent/bin/stdout
```

### Error codes and their meanings

| Error Code | Meaning | Possible Action |
| :---: | --- | --- |
| 2 | Invalid option provided to the shell bundle | |
| 3 | No option provided to the shell bundle | |
| 4 | Invalid package type | |
| 5 | The shell bundle must be executed as root | |
| 6 | Invalid package architecture | |
| 10 | VM is already connected to an OMS workspace | To connect the VM to the workspace specified in the extension schema, set stopOnMultipleConnections to false in public settings or remove this property. This VM gets billed once for each workspace it is connected to. |
| 11 | Invalid config provided to the extension | Follow the preceding examples to set all property values necessary for deployment. |
| 20 | Installation of SCX/OMI failed | |
| 21 | Installation of SCX/Provider kits failed | |
| 22 | Installation of bundled package failed | |
| 23 | SCX or OMI package already installed | |
| 30 | Internal bundle error | |
| 51 | This extension is not supported on the VM's operation system | |
| 60 | Unsupported version of OpenSSL | Install a version of OpenSSL meeting our [package requirements](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#package-requirements). |
| 61 | Missing Python ctypes library | Install the Python ctypes library or package (python-ctypes). |
| 62 | Missing tar program | Install tar. |
| 63 | Missing sed program | Install sed. |

Additional troubleshooting information can be found on the [OMS-Agent-for-Linux Troubleshooting Guide](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/Troubleshooting.md#).

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).
