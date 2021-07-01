---
title: How to tag an Azure virtual machine using the Azure CLI
description: Learn about tagging a virtual machine using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/11/2020
ms.author: cynthn
ms.custom: devx-track-azurecli

---
# How to tag a VM using the Azure CLI

This article describes how to tag a VM using the Azure CLI. Tags are user-defined key/value pairs which can be placed directly on a resource or a resource group. Azure currently supports up to 50 tags per resource and resource group. Tags may be placed on a resource at the time of creation or added to an existing resource. You can also tag a virtual machine using Azure [PowerShell](tag-powershell.md).


You can view all properties for a given VM, including the tags, using `az vm show`.

```azurecli-interactive
az vm show --resource-group myResourceGroup --name myVM --query tags
```

To add a new VM tag through the Azure CLI, you can use the `azure vm update` command along with the tag parameter `--set`:

```azurecli-interactive
az vm update \
    --resource-group myResourceGroup \
    --name myVM \
    --set tags.myNewTagName1=myNewTagValue1 tags.myNewTagName2=myNewTagValue2
```

To remove tags, you can use the `--remove` parameter in the `azure vm update` command.

```azurecli-interactive
az vm update \
   --resource-group myResourceGroup \
   --name myVM \
   --remove tags.myNewTagName1
```

Now that we have applied tags to our resources Azure CLI and the Portal, let's take a look at the usage details to see the tags in the billing portal.

### Next steps

- To learn more about tagging your Azure resources, see [Azure Resource Manager Overview](../azure-resource-manager/management/overview.md) and [Using Tags to organize your Azure Resources](../azure-resource-manager/management/tag-resources.md).
- To see how tags can help you manage your use of Azure resources, see [Understanding your Azure Bill](../cost-management-billing/understand/review-individual-bill.md).
