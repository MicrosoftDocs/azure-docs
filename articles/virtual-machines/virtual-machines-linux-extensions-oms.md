---
title: OMS virtual machine extension for Linux | Microsoft Docs
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
ms.date: 11/29/2016
ms.author: nepeters

---
# OMS virtual machine extension for Linux

## Overview

Operations Management Suite (OMS) provides monitoring, alerting, and alert remediation capabilities across cloud and on-premises assets. The OMS Agent virtual machine extension for Linux installs the OMS agent on Azure virtual machines, and enrolls virtual machines into an existing OMS workspace. This document details the supported platforms, configurations, and deployment options for the OMS virtual machine extension for Linux.

For general information on Azure virtual machine extensions see, [Virtual Machine extensions overview](./virtual-machines-linux-extensions-features.md).

For more information on Operations Management Suite, see [Operations Management Suite overview](https://www.microsoft.com/en-us/cloud-platform/operations-management-suite).

## Prerequisites

The OMS Agent extension can be run against these Linux distributions.

- CentOS Linux 5,6, and 7 (x86/x64)
- Oracle Linux 5,6, and 7 (x86/x64)
- Red Hat Enterprise Linux Server 5,6 and 7 (x86/x64)
- Debian GNU/Linux 6, 7, and 8 (x86/x64)
- Ubuntu 12.04 LTS, 14.04 LTS, 15.04 (x86/x64)
- SUSE Linux Enterprise Server 11 and 12 (x86/x64)

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

The JSON used to deploy the OMS Agent VM extension looks like the following:

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

## Azure CLI deployment

The Azure CLI can be used to deploy the OMS Agent VM extension to an existing virtual machine. Before deploying OMS Agent Extension, create a public.json and protected.json file. The schema for these files is detailed earlier in this document.

```azurecli
azure vm extension set <resource-group> <vm-name> \
  OmsAgentForLinux Microsoft.EnterpriseCloud.Monitoring 1.0 \
  --public-config-path public.json  \
  --private-config-path protected.json
```

## Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
azure vm extension get myResourceGroup myVM
```

Output and errors specific to the OMS Agent extension can be found in these files:

- /var/lib/waagent/<extension-name-and-version>/packages/
- /opt/microsoft/omsagent/bin

The operation log of the extension is located here:

-  /var/log/azure/<extension-name>/<version>/extension.log