---
title: Configure hibernation for Microsoft Dev Box
titleSuffix: Microsoft Dev Box
description: Learn how to enable, disable and troubleshoot hibernation for your dev boxes. Configure hibernation settings for your image and dev box definition.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/05/2023
ms.topic: how-to
#Customer intent: As a platform engineer, I want dev box users to be able to hibernate their dev boxes as part of my cost management strategy and so that dev box users can resume their work where they left off.
---

# Configure Dev Box Hibernation (preview) for a dev box definition

Hibernating dev boxes at the end of the workday can help you save a substantial portion of your VM costs. It eliminates the need for developers to shut down their dev box and lose their open windows and applications.

With the introduction of Dev Box Hibernation (Preview), you can enable this capability on new dev boxes and hibernate and resume them. This feature provides a convenient way to manage your dev boxes while maintaining your work environment.

There are two steps in enabling hibernation; you must enable hibernation on your dev box image and enable hibernation on your dev box definition.

> [!IMPORTANT]
> Dev Box Hibernation is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Key concepts for hibernation-enabled images

- The following SKUs support hibernation: 8, 16 vCPU SKUs. 32 vCPU SKUs do not support hibernation.

- You can enable hibernation only on new dev boxes created with hibernation-enabled dev box definitions. You can't enable hibernation on existing dev boxes.

- You can hibernate a dev box only using the dev Portal, CLI, PowerShell, SDKs, and API. Hibernating from within the dev box in Windows isn't supported.

- If you use a marketplace image, we recommend using the Visual Studio for dev box images.

- The Windows 11 Enterprise CloudPC + OS Optimizations image contains optimized power settings, and they can't be used with hibernation.

- Once enabled, you can't disable hibernation on a dev box. However, you can disable hibernation support on the dev box definition so that future dev boxes don't have hibernation.

- To enable hibernation, you need to enable nested virtualization in your Windows OS. If the "Virtual Machine Platform" feature isn't enabled in your DevBox image, DevBox automatically enables nested virtualization for you if you choose to enable hibernation.

- Hibernation doesn't support hypervisor-protected code integrity (HVCI)/ Memory Integrity features. Dev box disables this feature automatically.

- Auto-stop schedules still shutdown the dev boxes. If you want to hibernate your dev box, you can do it through the developer portal or using the CLI.

### Settings not compatible with hibernation

These settings are known to be incompatible with hibernation, and aren't supported for hibernation scenarios: 

- **Memory Integrity/Hypervisor Code Integrity.** 
    
    To disable Memory Integrity/Hypervisor Code Integrity:
    1. In the start menu, search for *memory integrity* 
    1. Select **Core Isolation**
    1. Under **Memory integrity**, ensure that memory integrity is set to Off.

- **Guest Virtual Secure Mode based features without Nested Virtualization enabled.** 

    To enable Nested Virtualization:
    1. In the start menu, search for *Turn Windows features on or off*
    1. In Turn Windows features on or off, select **Virtual Machine Platform**, and then select **OK**    
 
## Enable hibernation on your dev box image 

The  Visual Studio and Microsoft 365 images that Dev Box provides in the Azure Marketplace are already configured to support hibernation. You don't need to enable hibernation on these images, they're ready to use. 

If you plan to use a custom image from an Azure Compute Gallery, you need to enable hibernation capabilities as you create the new image. To enable hibernation capabilities, set the IsHibernateSupported flag to true. You must set the IsHibernateSupported flag when you create the image, existing images can't be modified.  

To enable hibernation capabilities, set the `IsHibernateSupported` flag to true:

```azurecli
az sig image-definition create 
--resource-group <resourcegroupname> --gallery-name <galleryname> --gallery-image-definition <imageName> --location <location> 
--publisher <publishername> --offer <offername> --sku <skuname> --os-type windows --os-state Generalized 
--features "IsHibernateSupported=true SecurityType=TrustedLaunch" --hyper-v-generation V2 
```

If you're using sysprep and a generalized VM to create a custom image, capture your image using the Azure CLI:

```azurecli
az sig image-version create 
--resource-group <resourcegroupname> --gallery-name <galleryname> --gallery-image-definition <imageName> 
--gallery-image-version <versionNumber> --virtual-machine <VMResourceId>
```

For more information about creating a custom image, see [Configure a dev box by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md).

## Enable hibernation on a dev box definition 

You can enable hibernation as you create a dev box definition, providing that the dev box definition uses a hibernation-enabled custom or marketplace image. You can also update an existing dev box definition that uses a hibernation-enabled custom or marketplace image. 

All new dev boxes created in dev box pools that use a dev box definition with hibernation enabled can hibernate in addition to shutting down. If a pool has dev boxes that were created before hibernation was enabled, they continue to only support shutdown. 

Dev Box validates your image for hibernate support. Your dev box definition may fail validation if hibernation couldn't be successfully enabled using your image. 

You can enable hibernation on a dev box definition by using the Azure portal or the CLI.

### Enable hibernation on an existing dev box definition by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/select-dev-box-definitions.png" alt-text="Screenshot that shows the dev center overview page and the menu option for dev box definitions.":::
  
1. Select the dev box definition that you want to update, and then select the edit button.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/update-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions and the edit button.":::

1. On the Editing \<dev box definition\> page, select **Enable hibernation**.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/dev-box-pool-enable-hibernation.png" alt-text="Screenshot of the page for editing a dev box definition, with Enable hibernation selected.":::

1. Select **Save**.

### Update an existing dev box definition by using the CLI
 
```azurecli
az devcenter admin devbox-definition update 
--dev-box-definition-name <DevBoxDefinitionName> -–dev-center-name <devcentername> --resource-group <resourcegroupname> –-hibernateSupport enabled
``` 

## Disable hibernation on a dev box definition

 If you have issues provisioning new VMs after enabling hibernation on a pool or you want to revert to shut down only dev boxes, you can disable hibernation on the dev box definition.

You can disable hibernation on a dev box definition by using the Azure portal or the CLI.

### Disable hibernation on an existing dev box definition by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
1. Select the dev box definition that you want to update, and then select the edit button.

1. On the Editing \<dev box definition\> page, clear **Enable hibernation**.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/dev-box-pool-disable-hibernation.png" alt-text="Screenshot of the page for editing a dev box definition, with Enable hibernation not selected.":::

1. Select **Save**.

### Disable hibernation on an existing dev box definition by using the CLI
 
```azurecli
az devcenter admin devbox-definition update 
--dev-box-definition-name <DevBoxDefinitionName> -–dev-center-name <devcentername> --resource-group <resourcegroupname> –-hibernateSupport disabled  
``` 

## Next steps

- [Create a dev box pool](how-to-manage-dev-box-pools.md)
- [Configure a dev box by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md)  
- [How to hibernate your dev box](how-to-hibernate-your-dev-box.md)
- [CLI Reference for az devcenter admin devbox-definition update](/cli/azure/devcenter/admin/devbox-definition?view=azure-cli-latest&preserve-view=true)