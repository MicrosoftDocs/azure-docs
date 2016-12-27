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
ms.date: 12/05/2016
ms.author: nepeters

---
# OMS virtual machine extension for Linux

## Overview

Operations Management Suite (OMS) provides monitoring, alerting, and alert remediation capabilities across cloud and on-premises assets. The OMS Agent virtual machine extension for Linux is published and supported by Microsoft. The extension installs the OMS agent on Azure virtual machines, and enrolls virtual machines into an existing OMS workspace. This document details the supported platforms, configurations, and deployment options for the OMS virtual machine extension for Linux.

For general information on Azure virtual machine extensions see, [Virtual Machine extensions overview](./virtual-machines-linux-extensions-features.md).

For more information on Operations Management Suite, see [Operations Management Suite overview](https://www.microsoft.com/en-us/cloud-platform/operations-management-suite).

## Prerequisites

### Operating System

The OMS Agent extension can be run against these Linux distributions.

| Distribution | Version |
|---|---|
| CentOS Linux | 5,6, and 7 |
| Oracle Linux | 5,6, and 7 |
| Red Hat Enterprise Linux Server | 5,6 and 7 |
| Debian GNU/Linux | 6, 7, and 8 |
| Ubuntu | 12.04 LTS, 14.04 LTS, 15.04 |
| SUSE Linux Enterprise Server | 11 and 12 |

### Connectivity

The OMS Agent extension for Linux requires that the target virtual machine is connected to the internet. 

## Extension configuration

The OMS Agent virtual machine extension for Linux requires the workspace Id and workspace key from the target OMS workspace. Because the workspace key should be treated as sensitive data, it is stored in a protected configuration. Azure VM extension protected configuration data is encrypted, and only decrypted on the target virtual machine. The public and private configurations are specified at deployment time, which is detailed in subsequent sections of this document.

### Public configuration

Schema for the public configuration:

- workspaceId: (required, string) the OMS workspace id to onboard the virtual machine into.

```json
{
  "workspaceId": "myWorkspaceId"
}
```

### Private configuration

Schema for the public configuration:

- workspaceKey: (required, string) the primary/secondary shared key of the workspace.

```json
{
  "workspaceKey": "myWorkSpaceKey"
}
```

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment configuration such as onboarding to OMS. A sample Resource Manager template that includes the OMS Agent VM extension can be found on the [Azure Quick Start Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-oms-extension-ubuntu-vm). 

This sample can be deployed from this document using this button:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-oms-extension-ubuntu-vm%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

### Template schema

The JSON used to deploy the OMS Agent VM extension looks like the following JSON example. Make sure to provide a valid workspace Id and key in the template. These values can be hard coded into the resource provided by a template parameter or variable.

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "<extension-deployment-name>",
  "apiVersion": "2015-06-15",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <vm-name>)]"
  ],
  "properties": {
    "publisher": "Microsoft.EnterpriseCloud.Monitoring",
    "type": "OmsAgentForLinux",
    "typeHandlerVersion": "1.0",
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

| Name | Example |
| ---- | ---- | 
| workspaceId | 6f680a37-00c6-41c7-a93f-1437e3462574 |
| workspaceKey | z4bU3p1/GrnWpQkky4gdabWXAhbWSTz70hm4m2Xt92XI+rSRgE8qVvRhsGo9TXffbrTahyrwv35W0pOqQAU7uQ== |

## Azure CLI deployment

The Azure CLI can be used to deploy the OMS Agent VM extension to an existing virtual machine. Before deploying OMS Agent Extension, create a public.json and protected.json file. The schema for these files is detailed earlier in this document.

```azurecli
azure vm extension set <resource-group> <vm-name> \
  OmsAgentForLinux Microsoft.EnterpriseCloud.Monitoring 1.0 \
  --public-config-path public.json  \
  --private-config-path protected.json
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
azure vm extension get myResourceGroup myVM
```

Extension execution output is logged to the following file:

`
/opt/microsoft/omsagent/bin/stdout
`

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).
