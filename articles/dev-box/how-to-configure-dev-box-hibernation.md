---
title: Configure hibernation for Microsoft Dev Box
titleSuffix: Microsoft Dev Box
description: Learn how to enable, disable, and troubleshoot hibernation in Microsoft Dev Box. Configure hibernation settings for your image and dev box definition.
services: dev-box
ms.service: dev-box
ms.custom:
  - build-2024
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/02/2024
ms.topic: how-to
#Customer intent: As a platform engineer, I want dev box users to be able to hibernate their dev boxes as part of my cost management strategy and so that dev box users can resume their work where they left off.
---

# Configure hibernation in Microsoft Dev Box

In this article, you learn how to enable and disable hibernation in Microsoft Dev Box. You control hibernation at the dev box image and dev box definition level.

Hibernating dev boxes at the end of the workday can help you save a substantial portion of your virtual machine (VM) costs. It eliminates the need for developers to shut down their dev box and lose their open windows and applications.

With the introduction of Dev Box Hibernation (Preview), you can enable this capability on new dev boxes and hibernate and resume them. This feature provides a convenient way to manage your dev boxes while maintaining your work environment.

There are three steps to enable hibernation: 

1. Enable hibernation on your dev box image
1. Enable hibernation on your dev box definition
1. Automate hibernation of pools of dev boxes using auto-stop schedules, or stop on RDP disconnect.

> [!IMPORTANT]
> Dev Box Hibernation is currently in PREVIEW.
> For more information about the preview status, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The document defines legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Considerations for hibernation-enabled images

Before you enable hibernation on your dev box, review the following considerations for hibernation-enabled images.

- Currently, two SKUs support hibernation: 8 and 16 vCPU SKUs. Currently, 32 vCPU SKUs don't support hibernation.

- You can enable hibernation only on new dev boxes created with hibernation-enabled dev box definitions. You can't enable hibernation on existing dev boxes.

- You can hibernate a dev box only by using the Microsoft developer portal, the Azure CLI, PowerShell, SDKs, and the REST API. Hibernating from within the dev box in Windows isn't supported.

- If you're working with an Azure Marketplace image, we recommend using the Visual Studio for dev box images.

- The Windows 11 Enterprise CloudPC + OS Optimizations image contains optimized power settings, and they can't be used with hibernation.

- After you enable hibernation, you can't disable the feature on that dev box. However, you can disable hibernation support on the dev box _definition_ so dev boxes created in the future don't have hibernation.

- To enable hibernation, you need to enable nested virtualization in your Windows OS. If the "Virtual Machine Platform" feature isn't enabled in your DevBox image, DevBox automatically enables nested virtualization for you if you choose to enable hibernation.

- Hibernation doesn't support hypervisor-protected code integrity (HVCI)/ Memory Integrity features. Dev box disables this feature automatically.

- Auto-stop schedules will hibernate Dev Boxes that were created after you enabled hibernation on the associated Dev Box definition. Dev Boxes that were created before you enabled hibernation on the Dev Box definition will continue to shut down.

  > [!NOTE]
  > The functionality to schedule dev boxes to hibernate automatically is available as a public preview. You can read more about the announcement at [Microsoft Dev Box - Auto-Hibernation Schedules Preview](https://aka.ms/devbox/preview/hibernate-on-schedule). 

### Settings not compatible with hibernation

The following settings are known to be incompatible with hibernation, and aren't supported for hibernation scenarios: 

- **Memory Integrity/Hypervisor Code Integrity**

   To disable Memory Integrity/Hypervisor Code Integrity:
   
   1. In the Windows Start menu, find and open **Windows Security**.
   1. Go to **Device Security**.
   1. Under **Core Isolation**, select **Core Isolation details**
   1. Under **Memory integrity**, set the toggle to **Off**.
   
   After you change this setting, you need to restart the machine.

- **Guest Virtual Secure Mode based features without Nested Virtualization enabled** 

   To enable Nested Virtualization:

   1. In the Start menu, search for **Turn Windows features on or off**.
   1. In the dialog, select the **Virtual Machine Platform** checkbox.
   1. Select **OK** to save your setting changes.
 
## Enable hibernation on your dev box image

If you plan to use a custom image from an Azure compute gallery, you need to enable hibernation capabilities when you create the new image. You can't enable hibernation for existing images.

> [!NOTE]
> The Visual Studio and Microsoft 365 images that Microsoft Dev Box provides in Azure Marketplace are already configured to support hibernation. You don't need to enable hibernation on these images, they're ready to use. 

To enable hibernation capabilities, set the `IsHibernateSupported` flag to `true` when you create the image:

```azurecli
az sig image-definition create 
--resource-group <resourceGroupName> --gallery-name <galleryName> --gallery-image-definition <imageName> --location <location> 
--publisher <publisherName> --offer <offerName> --sku <skuName> --os-type windows --os-state Generalized 
--features "IsHibernateSupported=true SecurityType=TrustedLaunch" --hyper-v-generation V2 
```

If you're using sysprep and a generalized VM to create a custom image, capture your image by using the Azure CLI:

```azurecli
az sig image-version create 
--resource-group <resourceGroupName> --gallery-name <galleryName> --gallery-image-definition <imageName> 
--gallery-image-version <versionNumber> --virtual-machine <VMResourceId>
```

For more information about creating a custom image, see [Configure a dev box by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md).

## Enable hibernation on a dev box definition 

In Microsoft Dev Box, you can enable hibernation for a new dev box definition when the definition uses a hibernation-enabled custom or Azure Marketplace image. You can also update an existing dev box definition that uses a hibernation-enabled custom or Azure Marketplace image. 

All new dev boxes created in dev box pools that use a dev box definition with hibernation enabled can both hibernate and shut down. If a pool has dev boxes that were created before hibernation was enabled, those dev boxes continue to support shutdown only. 

Microsoft Dev Box validates your image for hibernate support. Your dev box definition might fail validation if hibernation can't be successfully enabled by using your image.

You can enable hibernation on a dev box definition by using the Azure portal or the Azure CLI.

### Enable hibernation in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/select-dev-box-definitions.png" alt-text="Screenshot that shows the dev center overview page and the menu option for dev box definitions." lightbox="./media/how-to-configure-dev-box-hibernation/select-dev-box-definitions.png":::
  
1. Select the dev box definition that you want to update, and then select the edit (**pencil**) button.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/update-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions and the edit (pencil) button." lightbox="./media/how-to-configure-dev-box-hibernation/update-dev-box-definition.png":::

1. On the **Edit dev box definition** page, select the **Enable hibernation** checkbox.

   :::image type="content" source="./media/how-to-configure-dev-box-hibernation/dev-box-definition-enable-hibernation.png" alt-text="Screenshot of the page for editing a dev box definition, with Enable hibernation selected." lightbox="./media/how-to-configure-dev-box-hibernation/dev-box-definition-enable-hibernation.png" :::

1. Select **Save**.

### Enable hibernation with the Azure CLI

To enable hibernation for the dev box definition from the Azure CLI, set the `hibernateSupport` flag to `Enabled` when you create the image:

```azurecli
az devcenter admin devbox-definition update 
--dev-box-definition-name <devBoxDefinitionName> -–dev-center-name <devCenterName> --resource-group <resourceGroupName> –-hibernateSupport Enabled
``` 

### Troubleshooting

If you enable hibernation on a Dev Box definition, but the definition reports that hibernation couldn't be enabled:
- We recommend using the Visual Studio for Dev Box marketplace images, either directly, or as base images for generating your custom image.
- The Windows + OS optimizations image contains optimized power settings, and they can't be used with hibernation.
- If you're using a custom Azure Compute Gallery image, enable hibernation on your Azure Compute Gallery image before enabling hibernation on your Dev Box definition.
- If hibernation can't be enabled on the definition even after you enable it on your gallery image, your custom image likely has a Windows configuration that prevents hibernation. 

For more information, see [Settings not compatible with hibernation](how-to-configure-dev-box-hibernation.md#settings-not-compatible-with-hibernation).

## Disable hibernation on a dev box definition

If you have issues provisioning new VMs after you enable hibernation on a pool, you can disable hibernation on the dev box definition. You can also disable hibernation when you want to revert the setting to only shutdown dev boxes.

You can disable hibernation on a dev box definition by using the Azure portal or the CLI.

### Disable hibernation in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
1. Select the dev box definition that you want to update, and then select the edit (**pencil**) button.

1. On the **Edit dev box definition** page, clear the **Enable hibernation** checkbox.

1. Select **Save**.

### Disable hibernation with the Azure CLI
 
To disable hibernation for the dev box definition from the Azure CLI, set the `hibernateSupport` flag to `Disabled` when you create the image:

```azurecli
az devcenter admin devbox-definition update 
--dev-box-definition-name <devBoxDefinitionName> -–dev-center-name <devCenterName> --resource-group <resourceGroupName> –-hibernateSupport Disabled  
``` 

## Related content


- [How to hibernate your dev box](how-to-hibernate-your-dev-box.md)
- [Configure a dev box by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md)  
- [Azure CLI reference for az devcenter admin devbox-definition](/cli/azure/devcenter/admin/devbox-definition?view=azure-cli-latest&preserve-view=true)
