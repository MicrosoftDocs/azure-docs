---
title: Configure hibernation for Microsoft Dev Box
titleSuffix: Microsoft Dev Box
description: "Configure hibernation in Microsoft Dev Box to support cost-effective development and uninterrupted workflows.  "
services: dev-box
ms.service: dev-box
ms.custom:
  - build-2024
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:03/23/2025
  - build-2025
author: RoseHJM
ms.author: rosemalcolm
ms.date: 06/23/2025
ms.topic: how-to

#customer intent: As a platform engineer, I want to configure hibernation for dev box definitions so that I can manage resource usage efficiently. 
---

# Configure hibernation in Microsoft Dev Box

Hibernation in Microsoft Dev Box helps you manage cloud development environments efficiently while reducing costs. By enabling hibernation, you can preserve the state of open applications and windows, saving virtual machine (VM) costs without disrupting workflows. This article explains how to configure hibernation at the dev box image and definition levels, automate hibernation schedules, and address compatibility considerations.

With the introduction of Dev Box Hibernation, you can enable this capability on new dev boxes and hibernate and resume them. This feature provides a convenient way to manage your dev boxes while maintaining your work environment.

Follow these three steps to enable hibernation: 

1. Enable hibernation on your dev box image
1. Enable hibernation on your dev box definition
1. Automate hibernation of pools of dev boxes using auto-stop schedules, or stop on RDP disconnect.

## Considerations for hibernation-enabled images

Before you enable hibernation on your dev box, review the following considerations for hibernation-enabled images.

- Currently, two SKUs support hibernation: 8 and 16 vCPU SKUs. Currently, 32 vCPU SKUs don't support hibernation.

- You can enable hibernation only on new dev boxes created with hibernation-enabled dev box definitions. You can't enable hibernation on existing dev boxes.

- You can hibernate a dev box using the Microsoft developer portal, the Azure CLI, PowerShell, SDKs, or the REST API. Hibernating from within the dev box in Windows isn't supported.

- If you're working with an Azure Marketplace image, we recommend using the Visual Studio for dev box images.

- The Windows 11 Enterprise CloudPC + OS Optimizations image contains optimized power settings, and they can't be used with hibernation.

- After you enable hibernation, you can't disable the feature on that dev box. However, you can disable hibernation support on the dev box _definition_ so dev boxes created in the future don't have hibernation.

- To enable hibernation, you need to enable nested virtualization in your Windows OS. If the "Virtual Machine Platform" feature isn't enabled in your DevBox image, DevBox automatically enables nested virtualization for you if you choose to enable hibernation.

- Hibernation doesn't support hypervisor-protected code integrity (HVCI)/ Memory Integrity features. Dev box disables this feature automatically.

- Auto-stop schedules will hibernate Dev Boxes that were created after you enabled hibernation on the associated Dev Box definition. Dev Boxes that were created before you enabled hibernation on the Dev Box definition will continue to shut down.

### Settings not compatible with hibernation

The following settings are known to be incompatible with hibernation, and aren't supported for hibernation scenarios: 

- **Memory Integrity/Hypervisor Code Integrity**

   To disable Memory Integrity/Hypervisor Code Integrity:
   
   1. In the Windows Start menu, find and open **Windows Security**.
   1. Go to **Device Security**.
   1. Under **Core Isolation**, select **Core Isolation details**
   1. Under **Memory integrity**, set the toggle to **Off**.
   
   After you change this setting, you need to restart the machine.
   After changing this setting, restart the machine.

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

Learn more about creating a custom image in [Configure a dev box by using Azure VM Image Builder](how-to-customize-devbox-azure-image-builder.md).

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

## Enable automatic hibernation for dev boxes that have never been accessed

This feature helps you minimize costs by automatically hibernating dev boxes that start but no user connects to. If a dev box starts and no one connects with RDP, it enters hibernation after the grace period you set. This setting makes sure idle dev boxes don't use resources unnecessarily, so you optimize costs and resource usage.

To set up hibernation for dev boxes that have never been accessed, you need to enable the setting in the dev box pool.
 
1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the project with the dev box pool you want to update, and then select **Dev box pools**.
1. Select the dev box pool you want to update, then on the Dev box operations menu (**...**), select **Edit**.
1. On the **Edit dev box pool** page, select **Hibernate dev boxes that have never been accessed**.
 
   :::image type="content" source="media/how-to-configure-dev-box-hibernation/dev-box-pool-enable-hibernation-not-connected.png" alt-text="Screenshot of the Dev Box pool settings page showing the option to enable hibernation for dev boxes that have not been connected."::: 

1. When you select **Hibernate dev boxes that have never been accessed**, you can set a grace period. This lets users connect to the dev box before it hibernates. Set the **Grace period in minutes** to the time you want.

   :::image type="content" source="media/how-to-configure-dev-box-hibernation/dev-box-pool-hibernation-not-connected-options.png" alt-text="Screenshot of the Dev Box pool settings page showing configuration options for hibernating dev boxes that have not been connected, including the grace period setting.":::

1. Select **Save**.

### Troubleshooting

If you enable hibernation on a Dev Box definition and the definition reports that hibernation isn't enabled:
- We recommend using the Visual Studio for Dev Box marketplace images, either directly, or as base images for generating your custom image.
- The Windows + OS optimizations image contains optimized power settings and isn't compatible with hibernation.
- If you're using a custom Azure Compute Gallery image, enable hibernation on your Azure Compute Gallery image before enabling hibernation on your Dev Box definition.
- If hibernation can't be enabled on the definition even after you enable it on your gallery image, your custom image likely has a Windows configuration that prevents hibernation.
- If you experience issues while provisioning dev boxes, make sure that the image supports hibernation.
- If the image support hibernation but there are still failures during provisioning, see [Troubleshooting hibernation on Windows VMs](/azure/virtual-machines/windows/hibernate-resume-troubleshooting-windows).

For more information, see [Settings not compatible with hibernation](#settings-not-compatible-with-hibernation).

## Disable hibernation on a dev box definition

If you encounter issues provisioning new VMs after enabling hibernation on a pool, disable hibernation on the dev box definition.

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
