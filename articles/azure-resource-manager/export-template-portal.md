---
title: Export Azure Resource Manager template by using the Azure portal
description: Use Azure portal to export an Azure Resource Manager template from resources in your subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: tomfitz
---
# Single and multi-resource export to template in Azure portal

To assist with creating Azure Resource Manager templates, you can export a template from existing resources. The exported template helps you understand the JSON syntax and properties that deploy your resources. To automate future deployments, start with the exported template and modify it for your scenario.

Resource Manager enables you to pick one or more resources for exporting to a template. You can focus on exactly the resources you need in the template.

This article shows how to export templates through the portal. You can also use [Azure CLI](manage-resource-groups-cli.md#export-resource-groups-to-templates), [Azure PowerShell](manage-resource-groups-powershell.md#export-resource-groups-to-templates), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).

## Choose the right export option

There are two ways to export a template:

* **Export from resource group or resource**. This option generates a new template from existing resources. The exported template is a "snapshot" of the current state of the resource group. You can export an entire resource group or specific resources within that resource group.

* **Export before deployment or from history**. This option retrieves an exact copy of a template used for deployment.

Depending on the option you choose, the exported templates have different qualities.

| From resource group or resource | Before deployment or from history |
| --------------------- | ----------------- |
| Template is snapshot of the resources' current state. It includes any manual changes you made after deployment. | Template only shows state of resources at the time of deployment. Any manual changes you made after deployment aren't included. |
| You can select which resources from a resource group to export. | All resources for a specific deployment are included. You can't pick a subset of those resources or add resources that were added at a different time. |
| Template includes all properties for the resources, including some properties you wouldn't normally set during deployment. You might want to remove or clean up these properties before reusing the template. | Template includes only the properties needed for the deployment. The template is ready-to-use. |
| Template probably doesn't include all of the parameters you need for reuse. Most property values are hard-coded in the template. To redeploy the template in other environments, you need to add parameters that increase the ability to configure the resources. | Template includes parameters that make it easy to redeploy in different environments. |

Export the template from a resource group or resource, when:

* You need to capture changes to the resources that were made after the original deployment.
* You want to select which resources are exported.

Export the template before deployment or from the history, when:

* You want an easy-to-reuse template.
* You don't need to include changes you made after the original deployment.

## Export template from resource group

To export one or more resources from a resource group:

1. Select the resource group that contains the resources you want to export.

1. To export all resources in the resource group, select all and then **Export template**. The **Export template** option only becomes enabled after you've selected at least one resource.

   ![Export all resources](./media/export-template-portal/select-all-resources.png)

1. To pick specific resources for export, select the checkboxes next to those resources. Then, select **Export template**.

   ![Select resources to export](./media/export-template-portal/select-resources.png)

1. The exported template is displayed, and is available to download.

   ![Show template](./media/export-template-portal/show-template.png)

## Export template from resource

To export one resource:

1. Select the resource group containing the resource you want to export.

1. Select the resource to export.

   ![Select resource](./media/export-template-portal/select-link-resource.png)

1. For that resource, select **Export template** in the left pane.

   ![Export resource](./media/export-template-portal/export-single-resource.png)

1. The exported template is displayed, and is available to download. The template only contains the single resource.

## Export template before deployment

1. Select the Azure service you want to deploy.

1. Fill in the values for the new service.

1. After passing validation, but before starting the deployment, select **Download a template for automation**.

   ![Download template](./media/export-template-portal/download-before-deployment.png)

1. The template is displayed and is available for download.

   ![Show template](./media/export-template-portal/show-template-before-deployment.png)

## Export template after deployment

You can export the template that was used to deploy existing resources. The template you get is exactly the one that was used for deployment.

1. Select the resource group you want to export.

1. Select the link under **Deployments**.

   ![Select deployment history](./media/export-template-portal/select-deployment-history.png)

1. Select one of the deployments from the deployment history.

   ![Select deployment](./media/export-template-portal/select-details.png)

1. Select **Template**. The template used for this deployment is displayed, and is available for download.

   ![Select template](./media/export-template-portal/show-template-from-history.png)

## Next steps

- Learn how to export templates with [Azure CLI](manage-resource-groups-cli.md#export-resource-groups-to-templates), [Azure PowerShell](manage-resource-groups-powershell.md#export-resource-groups-to-templates), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](./resource-group-authoring-templates.md).
- To learn how to develop templates, see the [step-by-step tutorials](/azure/azure-resource-manager/).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).