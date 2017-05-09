---
title: Authoring templates with Linux VM extensions | Microsoft Docs
description: Learn about authoring Azure Resource Manager templates with extensions for Linux VMs
services: virtual-machines-linux
documentationcenter: ''
author: kundanap
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 322f8f0b-6697-4acb-b5f3-b3f58d28358b
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/29/2016
ms.author: kundanap

---
# Authoring Azure Resource Manager templates with Linux VM extensions
[!INCLUDE [virtual-machines-common-extensions-authoring-templates](../../../includes/virtual-machines-common-extensions-authoring-templates.md)]

From Azure CLI, run the following commnad:

      Azure VM extension list

This command returns the publisher name, extension name and version as following:

      Publisher                   : Microsoft.Azure.Extensions  
      ExtensionName               : DockerExtension
      Version                     : 1.0

These three properties map to "publisher", "type", and "typeHandlerVersion" respectively in the above template snippet.

> [!NOTE]
> It's always recommended to use the latest extension version to get the most updated functionality.
> 
> 

## Identifying the schema for the extension configuration parameters
The next step with authoring an extension template is to identify the format for providing configuration parameters. Each extension supports its own set of parameters.

To look at sample configurations for Linux extensions, click the documentation for see [Linux eExtensions samples](extensions-configuration-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Please refer to the following to get a fully complete template with VM Extensions.

[Custom script extension on a Linux VM](https://github.com/Azure/azure-quickstart-templates/blob/b1908e74259da56a92800cace97350af1f1fc32b/mongodb-on-ubuntu/azuredeploy.json/)

After authoring the template, you can deploy it using the Azure CLI.

