---
title: Deployment modes
description: Describes how to specify whether to use a complete or incremental deployment mode with Azure Resource Manager.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Azure Resource Manager deployment modes

When deploying your resources, you specify that the deployment is either an incremental update or a complete update. The difference between these two modes is how Resource Manager handles existing resources in the resource group that aren't in the template.

For both modes, Resource Manager tries to create all resources specified in the template. If the resource already exists in the resource group and its settings are unchanged, no operation is taken for that resource. If you change the property values for a resource, the resource is updated with those new values. If you try to update the location or type of an existing resource, the deployment fails with an error. Instead, deploy a new resource with the location or type that you need.

The default mode is incremental.

## Complete mode

In complete mode, Resource Manager **deletes** resources that exist in the resource group but aren't specified in the template.

> [!NOTE]
> Always use the [what-if operation](./deploy-what-if.md) before deploying a template in complete mode. What-if shows you which resources will be created, deleted, or modified. Use what-if to avoid unintentionally deleting resources.

If your template includes a resource that isn't deployed because [condition](conditional-resource-deployment.md) evaluates to false, the result depends on which REST API version you use to deploy the template. If you use a version earlier than 2019-05-10, the resource **isn't deleted**. With 2019-05-10 or later, the resource **is deleted**. The latest versions of Azure PowerShell and Azure CLI delete the resource.

Be careful using complete mode with [copy loops](copy-resources.md). Any resources that aren't specified in the template after resolving the copy loop are deleted.

If you deploy to [more than one resource group in a template](./deploy-to-resource-group.md), resources in the resource group specified in the deployment operation are eligible to be deleted. Resources in the secondary resource groups aren't deleted.

There are some differences in how resource types handle complete mode deletions. Parent resources are automatically deleted when not in a template that's deployed in complete mode. Some child resources aren't automatically deleted when not in the template. However, these child resources are deleted if the parent resource is deleted.

For example, if your resource group contains a DNS zone (`Microsoft.Network/dnsZones` resource type) and a CNAME record (`Microsoft.Network/dnsZones/CNAME` resource type), the DNS zone is the parent resource for the CNAME record. If you deploy with complete mode and don't include the DNS zone in your template, the DNS zone and the CNAME record are both deleted. If you include the DNS zone in your template but don't include the CNAME record, the CNAME isn't deleted.

For a list of how resource types handle deletion, see [Deletion of Azure resources for complete mode deployments](./deployment-complete-mode-deletion.md).

If the resource group is [locked](../management/lock-resources.md), complete mode doesn't delete the resources.

> [!NOTE]
> Only root-level templates support the complete deployment mode. For [linked or nested templates](linked-templates.md), you must use incremental mode.
>
> [Subscription level deployments](deploy-to-subscription.md) don't support complete mode.
>
> Currently, the portal doesn't support complete mode.
>

## Incremental mode

In incremental mode, Resource Manager **leaves unchanged** resources that exist in the resource group but aren't specified in the template. Resources in the template **are added** to the resource group.

> [!IMPORTANT]
> When redeploying an existing resource in incremental mode, all properties are reapplied. The **properties aren't incrementally added**. A common misunderstanding is to think properties that aren't specified in the template are left unchanged. If you don't specify certain properties, Resource Manager interprets the deployment as overwriting those values. Properties that aren't included in the template are reset to the default values. Specify all non-default values for the resource, not just the ones you're updating. The resource definition in the template always contains the final state of the resource. It can't represent a partial update to an existing resource.

> [!WARNING]
> In rare cases, you can specify properties either on a resource or on one of its child resources. Two common examples are **subnets on virtual networks** and **site configuration values for web apps**. In these cases, you must handle incremental updates carefully.
>
> For subnets, specify the values through the `subnets` property on the [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks) resource. Don't define the values through the child resource [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets). As long as the subnets are defined on the virtual network, you can redeploy the virtual network and not lose the subnets.
>
> For site configuration values, the values are implemented in the child resource type `Microsoft.Web/sites/config`. If you redeploy the web app and specify an empty object for the site configuration values, the child resource isn't updated. However, if you provide new site configuration values, the child resource type is updated.

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
az deployment group create \
  --mode Complete \
  --name ExampleDeployment \
  --resource-group ExampleResourceGroup \
  --template-file storage.json
```

The following example shows a linked template set to incremental deployment mode:

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2020-10-01",
    "name": "linkedTemplate",
    "properties": {
      "mode": "Incremental",
          <nested-template-or-external-template>
    }
  }
]
```

## Next steps

* To learn about creating Resource Manager templates, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To learn about deploying resources, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
* To view the operations for a resource provider, see [Azure REST API](/rest/api/).
