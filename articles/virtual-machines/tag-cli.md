---
title: How to tag an Azure virtual machine using the CLI
description: Learn about tagging a virtual machine using the Azure CLI.
services: virtual-machines
author: cynthn
ms.service: virtual-machines
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 02/28/2017
ms.author: cynthn
ms.custom: devx-track-azurecli

---
# How to tag a Linux virtual machine in Azure
This article describes different ways to tag avirtual machine in Azure. Tags are user-defined key/value pairs which can be placed directly on a resource or a resource group. Azure currently supports up to 50 tags per resource and resource group. Tags may be placed on a resource at the time of creation or added to an existing resource. If you want to tag a virtual machine using Azure PowerShell, see [How to tag a virtual machine in Azure using PowerShell](tag-powershell.md).

## Tagging with Azure CLI

You can view all properties for a given Virtual Machine, including the tags, using this command:

```azurecli
az vm show --resource-group MyResourceGroup --name MyTestVM
```

To add a new VM tag through the Azure CLI, you can use the `azure vm update` command along with the tag parameter **--set**:

```azurecli
az vm update \
    --resource-group MyResourceGroup \
    --name MyTestVM \
    --set tags.myNewTagName1=myNewTagValue1 tags.myNewTagName2=myNewTagValue2
```

To remove tags, you can use the **--remove** parameter in the `azure vm update` command.

```azurecli
az vm update --resource-group MyResourceGroup --name MyTestVM --remove tags.myNewTagName1
```

Now that we have applied tags to our resources Azure CLI and the Portal, let’s take a look at the usage details to see the tags in the billing portal.

[!INCLUDE [virtual-machines-common-tag-usage](../../includes/virtual-machines-common-tag-usage.md)]

## Next steps
* To learn more about tagging your Azure resources, see [Azure Resource Manager Overview](../azure-resource-manager/management/overview.md) and [Using Tags to organize your Azure Resources](../azure-resource-manager/management/tag-resources.md).
* To see how tags can help you manage your use of Azure resources, see [Understanding your Azure Bill](../cost-management-billing/understand/review-individual-bill.md) and [Gain insights into your Microsoft Azure resource consumption](../cost-management-billing/manage/usage-rate-card-overview.md).
