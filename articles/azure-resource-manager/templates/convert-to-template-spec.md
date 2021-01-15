---
title: Convert portal template to template spec
description: Describes how to convert an existing template in the Azure portal gallery to a template specs.
ms.topic: conceptual
ms.date: 01/15/2021
ms.author: tomfitz
author: tfitzmac
---
# Convert template gallery in portal to template specs

The Azure portal provides a way to store Azure Resource Manager templates (ARM templates) in your account. **This feature is being deprecated.** To continue using templates in this gallery, convert them to [template specs](template-specs.md).

In the portal, this feature is called **Templates (Preview)**. To see if you have any templates to convert, view the [template gallery in the portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Gallery%2Fmyareas%2Fgalleryitems). You may also see these templates through their resource type `Microsoft.Gallery/myareas/galleryitems`.

This article shows how to convert existing templates in the template gallery to template specs.

## Deprecation of portal feature

The template gallery in the portal is being deprecated on January 21, 2021. You can continue using it without change until February 21. Starting on February 22, you can't create new templates in the portal gallery but you can still view and deploy existing templates.

On June 22, the feature will be removed from the portal and all API operations will be blocked. You'll not be able to view or deploy any templates from the gallery.

Before June 22, you should migrate any templates that you want to continue using. You can use one of the methods shown in this article to migrate the templates. After the feature has been removed, you'll need to open a support case to get any templates that you've not migrated.

## Convert with PowerShell script

To simplify converting templates in the template gallery to template specs, use a PowerShell script in the Azure Quickstart Templates repo. Specify whether you want the script to create a new template spec for each template or download each template. The script doesn't delete the template from the template gallery.

1. Copy the [migration script](https://github.com/Azure/azure-quickstart-templates/blob/master/201-templatespec-migrate-create/Migrate-GalleryItems.ps1). Save a local copy with the name *Migrate-GalleryItems.ps1*.
1. To create new template specs, provide values for the `-ResourceGroupName` and `-Location` parameters. 

   In `ItemsToExport`, specify whether you want to export the templates in your gallery or all templates you have access to. Use `MyGalleryItems` to export your templates. Use `AllGalleryItems` to export all template you have access to.

   The following example creates new template specs for each template in a resource group named **migratedRG**. The script creates the resource group if it doesn't exist.

   ```azurepowershell
   .\Migrate-GalleryItems.ps1 -ResourceGroupName migratedRG -Location westus2 -ItemsToExport MyGalleryItems
   ```

1. To download the templates without creating the template specs, don't provide values for the resource group or location. Instead, specify `-ExportToFile`.

   The following example downloads the templates without creating template specs.

   ```azurepowershell
   .\Migrate-GalleryItems.ps1 -ItemsToExport MyGalleryItems -ExportToFile
   ```

For more information about the script and its parameters, see [Create TemplateSpecs from Template Gallery Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/201-templatespec-migrate-create).

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
