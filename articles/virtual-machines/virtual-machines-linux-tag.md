<properties
   pageTitle="How to tag a Linux virtual machine | Microsoft Azure"
   description="Learn about tagging a Linux virtual machine created in Azure using the Resource Manager deployment model."
   services="virtual-machines-linux"
   documentationCenter=""
   authors="mmccrory"
   manager="timlt"
   editor="tysonn"
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="07/05/2016"
   ms.author="memccror"/>

# How to tag a Linux virtual machine in Azure

This article describes different ways to tag a Linux virtual machine in Azure through the Resource Manager deployment model. Tags are user-defined key/value pairs which can be placed directly on a resource or a resource group. Azure currently supports up to 15 tags per resource and resource group. Tags may be placed on a resource at the time of creation or added to an existing resource. Please note, tags are supported for resources created via the Resource Manager deployment model only.

[AZURE.INCLUDE [virtual-machines-common-tag](../../includes/virtual-machines-common-tag.md)]

## Tagging with Azure CLI

To begin, [install and configure the Azure CLI](../xplat-cli-azure-resource-manager.md) and make sure you are in Resource Manager mode (`azure config mode arm`).

You can view all properties for a given Virtual Machine, including the tags, using this command:

        azure vm show -g MyResourceGroup -n MyTestVM

To add a new VM tag through the Azure CLI, you can use the `azure vm set` command along with the tag parameter **-t**:

        azure vm set -g MyResourceGroup -n MyTestVM –t myNewTagName1=myNewTagValue1;myNewTagName2=myNewTagValue2

To remove all tags, you can use the **–T** parameter in the `azure vm set` command.

        azure vm set – g MyResourceGroup –n MyTestVM -T


Now that we have applied tags to our resources Azure CLI and the Portal, let’s take a look at the usage details to see the tags in the billing portal.

[AZURE.INCLUDE [virtual-machines-common-tag-usage](../../includes/virtual-machines-common-tag-usage.md)]

## Next steps

* To learn more about tagging your Azure resources, see [Azure Resource Manager Overview][] and [Using Tags to organize your Azure Resources][].
* To see how tags can help you manage your use of Azure resources, see [Understanding your Azure Bill][] and [Gain insights into your Microsoft Azure resource consumption][].





[Azure CLI environment]: ./xplat-cli-azure-resource-manager.md
[Azure Resource Manager Overview]: ../resource-group-overview.md
[Using Tags to organize your Azure Resources]: ../resource-group-using-tags.md
[Understanding your Azure Bill]: ../billing-understand-your-bill.md
[Gain insights into your Microsoft Azure resource consumption]: ../billing-usage-rate-card-overview.md
