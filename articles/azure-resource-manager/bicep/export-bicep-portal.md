---
title: Export Bicep files in Azure portal
description: Use Azure portal to export a Bicep file from resources in your subscription.
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 02/25/2025
---

# Use Azure portal to export a Bicep file

[!INCLUDE [Export template intro](../../../includes/resource-manager-export-template-intro.md)]

Currently, Bicep files can only be exported from the Azure portal. However, you can export ARM JSON templates via [Azure CLI](../templates/export-template-cli.md) or [Azure PowerShell](../templates/export-template-powershell.md) and then [decompile](./decompile.md) them into to Bicep files.

[!INCLUDE [Export template limitations](../../../includes/resource-manager-export-template-limitations.md)]

## Export Bicep file from a resource group

To export one or more resources from a resource group:

1. Select the resource group that contains the resources you want to export.

1. Select one or more resources by selecting the checkboxes. To select all, select the checkbox on the left of **Name**. The **Export template** from the top menu only becomes enabled after you've selected at least one resource.

   :::image type="content" source="./media/export-bicep-portal/select-all-resources.png" alt-text="Screenshot of selecting all resources for export in Azure portal.":::

1. Select **Export template** from the top menu. The **Export template** from the left menu exports all the resources in the group to a Bicep file.

1. Select **Bicep**. The exported Bicep file is displayed, and is available to download and deploy.

   :::image type="content" source="./media/export-bicep-portal/show-template.png" alt-text="Screenshot of the displayed exported Bicep file in Azure portal.":::

   All template parameters are included when the Bicep file is generated. 

## Export Bicep file from a resource

To export one resource:

1. Select the resource group containing the resource you want to export.

1. Select the resource that you want to export to open the resource.

1. For that resource, select **Export template** in the left pane.

   :::image type="content" source="./media/export-bicep-portal/export-single-resource.png" alt-text="Screenshot of exporting a single resource in Azure portal.":::

1. Select **Bicep**. The exported Bicep file is displayed, and is available to download and deploy. The Bicep file only contains the single resource. All template parameters are included when the Bicep file is generated.

## Export template after deployment

This option supports exporting only ARM JSON templates. It retrieves an exact copy of the template used for deployment, allowing you to select a specific deployment from the deployment history. After exporting, you can [decompile](./decompile.md) them into to Bicep files. For more information about saving from history and the export options, see [Choose the right export option](../templates/export-template-portal.md#choose-the-right-export-option).

## Next steps

* Learn how to export ARM JSON templates with [Azure CLI](../templates/export-template-cli.md), [Azure PowerShell](../templates/export-template-powershell.md), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).
* Learn the [Bicep file structure and syntax](./file.md).
* Learn how to [decompile ARM JSON templates to Bicep](./decompile.md).
