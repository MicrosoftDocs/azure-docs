---
title: Configure hibernation for Microsoft Dev Box
titleSuffix: Microsoft Dev Box
description: Learn how to enable, disable and troubleshoot hibernation for your dev boxes. 
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/05/2023
ms.topic: how-to
#Customer intent: As a platform engineer, I want dev box users to be able to hibernate their dev boxes as part of my cost management strategy and so that dev box users can resume their work where they left off.
---

# How to configure Dev Box Hibernation (preview)

Hibernating dev boxes at the end of the workday can help you save a substantial portion of your VM costs. It eliminates the need for developers to shut down their Dev Box and lose their open windows and applications.

With the introduction of Dev Box Hibernation (Preview), you can enable this capability on new dev boxes and hibernate and resume them. This feature provides a convenient way to manage your Dev Boxes while maintaining your work environment.

> [!IMPORTANT]
> Dev Box Hibernation is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How to enable hibernation 

There are three steps: 

1. Enable hibernation on your Dev Box image
1. Enable Hibernation on your Dev Box definition 
1. Create a stop schedule in Dev Box pools that use that definition. 
 
### Ensure your Dev Box image supports hibernation 

The images that Dev Box provides in the Azure Marketplace are already configured to support hibernation. If you plan to use a custom image from an Azure Compute Gallery, you need to enable hibernation as you create the new image. 

### Enable hibernation on a Dev Box definition 

You can enable hibernation as you create a dev box definition, providing that the dev box definition uses a hibernation-enabled custom or marketplace image. You can also update an existing dev box definition that uses a hibernation-enabled custom or marketplace image. 

All new Dev Boxes created in Dev Box pools that use a dev box definition with hibernation enabled can hibernate in addition to shutting down. If a pool has dev boxes that were created before hibernation was enabled, they continue to only support shutdown.   

#### Enable hibernation on an existing dev box definition by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/select-dev-box-definitions.png" alt-text="Screenshot that shows the dev center overview page and the menu option for dev box definitions.":::
  
1. Select the dev box definition that you want to update, and then select the edit button.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/update-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions and the edit button.":::

1. On the Editing \<dev box definition\> page, select **Enable hibernation**.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/dev-box-pool-enable-hibernation.png" alt-text="Screenshot of the page for editing a dev box definition.":::

1. Select **Save**.

#### Update an existing dev box definition by using the CLI
 
```azurecli-interactive
az devcenter admin devbox-definition update --dev-box-definition-name <DevBoxDefinitionName> -–dev-center-name <devcentername> --resource-group <resourcegroupname> –-hibernateSupport enabled
``` 

### Configure an auto-stop schedule

You can configure an auto-stop schedule for a Dev Box pool that uses a hibernation-enabled dev box definition. When you configure an auto-stop schedule, you can specify a time of day to stop the Dev Box. If the Dev Box is hibernation-enabled, it hibernates instead of shutting down.

Developers can also hibernate their dev boxes manually, by using the developer portal.

To learn how to configure an auto-stop schedule, see [Auto-stop your Dev Boxes on schedule](how-to-configure-stop-schedule.md).

## Disable hibernation on a Dev Box definition

 If you have issues provisioning new VMs after enabling hibernation on a pool or you want to revert to shut down only dev boxes, you can disable hibernation on the dev box definition.

#### Disable hibernation on an existing dev box definition by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
1. Select the dev box definition that you want to update, and then select the edit button.

1. On the Editing \<dev box definition\> page, clear **Enable hibernation**.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/dev-box-pool-enable-hibernation.png" alt-text="Screenshot of the page for editing a dev box definition.":::

1. Select **Save**.

#### Disable hibernation on an existing dev box definition by using the CLI
 
```azurecli-interactive
az devcenter admin devbox-definition update --dev-box-definition-name <DevBoxDefinitionName> -–dev-center-name <devcentername> --resource-group <resourcegroupname> –-hibernateSupport disabled  
 
``` 

## Next steps

- [Create a Dev Box pool](how-to-manage-dev-box-pools.md)
- [Configure a dev box by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md)  
- [Auto-stop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)
- [How to hibernate your Dev Box](how-to-hibernate-your-dev-box.md)
- [CLI Reference for az devcenter admin devbox-definition update](/cli/azure/devcenter/admin/devbox-definition?view=azure-cli-latest&preserve-view=true)