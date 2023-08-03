---
title: Convert portal template to template spec
description: Describes how to convert an existing template in the Azure portal gallery to a template specs.
ms.topic: conceptual
ms.date: 06/22/2023
---
# Convert template gallery in portal to template specs

The Azure portal provides a way to store Azure Resource Manager templates (ARM templates) in your account. However, [template specs](template-specs.md) offers an easier way to share your templates with users in your organization, and link with other templates. This article shows how to convert existing templates in the template gallery to template specs.

To see if you have any templates to convert, view the [template gallery in the portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Gallery%2Fmyareas%2Fgalleryitems). These templates have the resource type `Microsoft.Gallery/myareas/galleryitems`.

## Deprecation of portal feature

**The template gallery in the portal is being deprecated on March 31, 2025**. To continue using a template in the template gallery, you need to migrate it to a template spec. Use one of the methods shown in this article to migrate the template.

## Convert with PowerShell script

To simplify converting templates in the template gallery, use a PowerShell script from the Azure Quickstart Templates repo. When you run the script, you can either create a new template spec for each template or download a template that creates the template spec. The script doesn't delete the template from the template gallery.

1. Copy the [migration script](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.resources/templatespec-migrate-create/Migrate-GalleryItems.ps1). Save a local copy with the name *Migrate-GalleryItems.ps1*.
1. To create new template specs, provide values for the `-ResourceGroupName` and `-Location` parameters.

   Set `ItemsToExport` to `MyGalleryItems` to export your templates. Set it to `AllGalleryItems` to export all templates you have access to.

   The following example creates new template specs for each template in a resource group named **migratedRG**. The script creates the resource group if it doesn't exist.

   ```azurepowershell
   .\Migrate-GalleryItems.ps1 -ResourceGroupName migratedRG -Location westus2 -ItemsToExport MyGalleryItems
   ```

1. To download templates that you can use to create the template specs, don't provide values for the resource group or location. Instead, specify `-ExportToFile`. The template isn't the same as your template in the gallery. Instead, it contains a template spec resource that creates the template spec for your template.

   The following example downloads the templates without creating template specs.

   ```azurepowershell
   .\Migrate-GalleryItems.ps1 -ItemsToExport MyGalleryItems -ExportToFile
   ```

   To learn how to deploy the template that creates the template spec, see [Quickstart: Create and deploy template spec](quickstart-create-template-specs.md).

For more information about the script and its parameters, see [Create TemplateSpecs from Template Gallery Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.resources/templatespec-migrate-create).

## Manually convert through portal

You can manually copy templates from the gallery to a new template specs.

1. Open the [Templates (preview)](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Gallery%2Fmyareas%2Fgalleryitems) in the portal.
1. Select the template to migrate.
1. Select **View Template**.
1. Copy the template content.
1. In the portal search bar, search for **Template specs**. Select that option.
1. Select **Create template spec**.
1. Provide values for the name, subscription, resource group, location, and version.
1. Select **Next: Edit template**.
1. For the contents of the template, paste the template you copied from the template gallery.
1. Select **Review + Create**.
1. After validation successfully completes, select **Create**.

If you need to share the template spec with other users in your organization, [set role-based access control](../../role-based-access-control/tutorial-role-assignments-group-powershell.md) to the group or users that need access.

## Next steps

To learn more about template specs, see [Create and deploy template specs](template-specs.md).
