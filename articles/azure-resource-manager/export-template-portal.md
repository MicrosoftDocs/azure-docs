---
title: Export Azure Resource Manager template by using the Azure portal
description: Use Azure portal to export an Azure Resource Manager template from resources in your subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: tomfitz
---
# Single and multi-resource export to template - Portal

To assist with creating Azure Resource Manager templates, you can export a template from existing resources. The exported template helps you understand the JSON syntax and properties that deploy your resources. To automate future deployments, start with the exported template and modify it for your scenario.

You can export a template for an entire resource group or for specific resources within that resource group. The exported template is a "snapshot" of the current state of the resource group. You also can export a template for a resource. The template includes only the selected resource.

## Export template from resource group

To export one or more resources from a resource group:

1. Select the resource group you want to export.

1. To export all resources in the resource group, select all and then **Export template**. 

   ![Export all resources](./media/export-template-portal/select-all-resources.png)

1. To limit the export, select the resources you want to export. Then, select **Export template**.

   ![Select resources to export](./media/export-template-portal/select-resources.png)

1. The exported template is displayed, and is available to download.

   ![Show template](./media/export-template-portal/show-template.png)

## Export template from resource

To export one resource:

1. Select the resource group containing the resource you want to export.

1. Select the resource to export.

   ![Select resource](./media/export-template-portal/select-link-resource.png)

1. For that resource, select **Export template**.

   ![Export resource](./media/export-template-portal/export-single-resource.png)

1. The exported template is displayed, and is available to download.

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](./resource-group-overview.md).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](./resource-group-authoring-templates.md).
- To learn how to develop templates, see the [step-by-step tutorials](/azure/azure-resource-manager/).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).