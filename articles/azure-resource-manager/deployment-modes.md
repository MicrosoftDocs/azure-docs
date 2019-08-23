---
title: Azure Resource Manager deployment modes | Microsoft Docs
description: Describes how to specify whether to use a complete or incremental deployment mode with Azure Resource Manager.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: tomfitz
---
# Azure Resource Manager deployment modes

When deploying your resources, you specify that the deployment is either an incremental update or a complete update.  The primary difference between these two modes is how Resource Manager handles existing resources in the resource group that aren't in the template. The default mode is incremental.

For both modes, Resource Manager tries to create all resources specified in the template. If the resource already exists in the resource group and its settings are unchanged, no operation is taken for that resource. If you change the property values for a resource, the resource is updated with those new values. If you try to update the location or type of an existing resource, the deployment fails with an error. Instead, deploy a new resource with the location or type that you need.

## Complete mode

In complete mode, Resource Manager **deletes** resources that exist in the resource group but aren't specified in the template. Resources that are specified in the template, but not deployed because a [condition](resource-group-authoring-templates.md#condition) evaluates to false, aren't deleted.

Be careful using complete mode with [copy loops](resource-group-create-multiple.md). Any resources that aren't specified in the template after resolving the copy loop are deleted.

There are some differences in how resource types handle complete mode deletions. Parent resources are automatically deleted when not in a template that's deployed in complete mode. Some child resources aren't automatically deleted when not in the template. However, these child resources are deleted if the parent resource is deleted. 

For example, if your resource group contains a DNS zone (Microsoft.Network/dnsZones resource type) and a CNAME record (Microsoft.Network/dnsZones/CNAME resource type), the DNS zone is the parent resource for the CNAME record. If you deploy with complete mode and don't include the DNS zone in your template, the DNS zone and the CNAME record are both deleted. If you include the DNS zone in your template but don't include the CNAME record, the CNAME isn't deleted. 

For a list of how resource types handle deletion, see [Deletion of Azure resources for complete mode deployments](complete-mode-deletion.md).

If the resource group is [locked](resource-group-lock-resources.md), complete mode doesn't delete the resources.

> [!NOTE]
> Only root-level templates support the complete deployment mode. For [linked or nested templates](resource-group-linked-templates.md), you must use incremental mode. 
>
> [Subscription level deployments](deploy-to-subscription.md) don't support complete mode.
>
> Currently, the portal doesn't support complete mode.
>

## Incremental mode

In incremental mode, Resource Manager **leaves unchanged** resources that exist in the resource group but aren't specified in the template.

However, when redeploying an existing resource in incremental mode, the outcome is a different. Specify all properties for the resource, not just the ones you're updating. A common misunderstanding is to think properties that are not specified are left unchanged. If you don't specify certain properties, Resource Manager interprets the update as overwriting those values.

## Example result

To illustrate the difference between incremental and complete modes, consider the following scenario.

**Resource Group** contains:

* Resource A
* Resource B
* Resource C

**Template** contains:

* Resource A
* Resource B
* Resource D

When deployed in **incremental** mode, the resource group has:

* Resource A
* Resource B
* Resource C
* Resource D

When deployed in **complete** mode, Resource C is deleted. The resource group has:

* Resource A
* Resource B
* Resource D

## Set deployment mode

To set the deployment mode when deploying with PowerShell, use the `Mode` parameter.

```azurepowershell-interactive
New-AzResourceGroupDeployment `
  -Mode Complete `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\MyTemplates\storage.json
```

To set the deployment mode when deploying with Azure CLI, use the `mode` parameter.

```azurecli-interactive
az group deployment create \
  --name ExampleDeployment \
  --mode Complete \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters storageAccountType=Standard_GRS
```

The following example shows a linked template set to incremental deployment mode:

```json
"resources": [
  {
      "apiVersion": "2017-05-10",
      "name": "linkedTemplate",
      "type": "Microsoft.Resources/deployments",
      "properties": {
          "mode": "Incremental",
          <nested-template-or-external-template>
      }
  }
]
```

## Next steps

* To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To learn about deploying resources, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).
* To view the operations for a resource provider, see [Azure REST API](/rest/api/).
