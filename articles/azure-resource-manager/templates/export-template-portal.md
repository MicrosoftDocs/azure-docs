---
title: Export template in Azure portal
description: Use Azure portal to export an Azure Resource Manager template from resources in your subscription.
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 02/12/2025
---

# Use Azure portal to export a template

[!INCLUDE [Export template intro](../../../includes/resource-manager-export-template-intro.md)]

This article shows how to export templates through the **portal**. For other options, see:

* [Export template with Azure CLI](export-template-cli.md)
* [Export template with Azure PowerShell](export-template-powershell.md)
* [REST API export from resource group](/rest/api/resources/resourcegroups/exporttemplate) and [REST API export from deployment history](/rest/api/resources/deployments/export-template).

[!INCLUDE [Export template choose option](../../../includes/resource-manager-export-template-choose-option.md)]

[!INCLUDE [Export template limitations](../../../includes/resource-manager-export-template-limitations.md)]

## Export template from a resource group

To export one or more resources from a resource group:

1. Select the resource group that contains the resources you want to export.

1. Select one or more resources by selecting the checkboxes. To select all, select the checkbox on the left of **Name**. The **Export template** from the top menu only becomes enabled after you've selected at least one resource.

   :::image type="content" source="./media/export-template-portal/select-all-resources.png" alt-text="Screenshot of selecting all resources for export in Azure portal.":::

1. Select **Export template** from the top menu. The **Export template** from the left menu exports all the resources in the group to a template.

1. Select **ARM Template**. The exported template is displayed, and is available to download and deploy.

   :::image type="content" source="./media/export-template-portal/show-template.png" alt-text="Screenshot of the displayed exported template in Azure portal.":::

   **Include parameters** is selected by default.  When selected, all template parameters are included when the template is generated. If you'd like to author your own parameters, toggle this checkbox to not include them.

## Export template from a resource

To export one resource:

1. Select the resource group containing the resource you want to export.

1. Select the resource that you want to export to open the resource.

1. For that resource, select **Export template** in the left pane.

   :::image type="content" source="./media/export-template-portal/export-single-resource.png" alt-text="Screenshot of exporting a single resource in Azure portal.":::

1. The exported template is displayed, and is available to download and deploy. The template only contains the single resource. **Include parameters** is selected by default.  When selected, all template parameters are included when the template is generated. If you’d like to author your own parameters, toggle this checkbox to not include them.

## Export template after deployment

You can export the template that was used to deploy existing resources. The template you get is exactly the one that was used for deployment.

1. Select the resource group you want to export.

1. Select the link under **Deployments**.

   :::image type="content" source="./media/export-template-portal/select-deployment-history.png" alt-text="Screenshot of selecting deployment history in Azure portal.":::

1. Select one of the deployments from the deployment history.

   :::image type="content" source="./media/export-template-portal/select-details.png" alt-text="Screenshot of selecting a specific deployment from deployment history in Azure portal.":::

1. Select **Template**. The template used for this deployment is displayed, and is available for download.

   :::image type="content" source="./media/export-template-portal/show-template-from-history.png" alt-text="Screenshot of selecting the template used for a specific deployment in Azure portal.":::

## Next steps

* Learn how to export Bicep files with the [Azure portal](../bicep/export-bicep-portal.md).
* Learn how to export templates with [Azure CLI](./export-template-cli.md), [Azure PowerShell](./export-template-powershell.md), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).
* To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](./syntax.md).
