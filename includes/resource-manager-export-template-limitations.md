---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 03/22/2023
ms.author: tomfitz
---

## Limitations

Export is not guaranteed to succeed. Export is not a reliable way to turn pre-existing resources into templates that are usable in production. It is better to create resources from scratch using hand-written [Bicep file](../articles/azure-resource-manager/bicep/overview.md), [ARM template](../articles/azure-resource-manager/templates/overview.md) or [terraform](/azure/developer/terraform/overview).

When exporting from a resource group or resource, the exported template is generated from the [published schemas](https://github.com/Azure/azure-resource-manager-schemas/tree/master/schemas) for each resource type. Occasionally, the schema doesn't have the latest version for a resource type. Check your exported template to make sure it includes the properties you need. If necessary, edit the exported template to use the API version you need.

Some password parameters might be missing from the exported templates. You need to check [template reference](/azure/templates), and manually add these parameters before you can use the templates to deploy resources.

The export template feature doesn't support exporting Azure Data Factory resources. To learn about how you can export Data Factory resources, see [Copy or clone a data factory in Azure Data Factory](../articles/data-factory/copy-clone-data-factory.md).

To export resources created through classic deployment model, you must [migrate them to the Resource Manager deployment model](../articles/virtual-machines/migration-classic-resource-manager-overview.md).

If you get a warning when exporting a template that indicates a resource type wasn't exported, you can still discover the properties for that resource. For resource properties, see [template reference](/azure/templates). You can also look at the [Azure REST API](/rest/api/azure/) for the resource type.

There's a limit of 200 resources in the resource group you create the exported template for. If you attempt to export a resource group that has more than 200 resources, the error message `Export template is not supported for resource groups more than 200 resources` is shown.
