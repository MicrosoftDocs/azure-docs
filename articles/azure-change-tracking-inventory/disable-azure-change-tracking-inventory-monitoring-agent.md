---
title: Disable Azure Change Tracking and Inventory by Using the Azure Monitor Agent
description: Learn how to disable Azure Change Tracking and Inventory by using the Azure Monitor Agent from your Azure virtual machines.
#customer intent: As a customer, I want to disassociate a data collection rule (DCR) from a virtual machine so that I can disable its association with Azure Change Tracking and Inventory.
services: automation
ms.custom: linux-related-content
ms.date: 12/03/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
---

# Disable Azure Change Tracking and Inventory by using the Azure Monitor Agent

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article describes how to disable Azure Change Tracking and Inventory by using the Azure Monitor Agent (AMA).

## Disable Change Tracking from a VM

To disable Change Tracking from a virtual machine (VM) by using the AMA, you must first disassociate the data collection rule (DCR) and then uninstall Change Tracking and Inventory.

### Disassociate a DCR from a VM

To disassociate a DCR from a VM, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and select **Virtual Machines**. In the search bar, select the specific VM.
1. On the **Virtual machines** pane, under **Operations**, select **Change tracking**. Alternatively, in the search bar, enter **Change tracking** and select it from the results.
1. Select **Settings** > **DCR** to view all the VMs associated with the DCR.
1. Select the VM for which you want to disable the DCR.
1. Select **Delete**.

   :::image type="content" source="media/disable-azure-change-tracking-monitoring-agent/disable-data-collection-rule-inline.png" alt-text="Screenshot that shows selecting a VM to dissociate the DCR from the VM." lightbox="media/disable-azure-change-tracking-monitoring-agent/disable-data-collection-rule-expanded.png":::

   A notification appears that asks to confirm the disassociation of the DCR for the selected VM.

### Uninstall the Change Tracking extension

To uninstall the Change Tracking extension, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and select **Virtual Machines**. In the search bar, select the VM for which you have already disassociated the DCR.
1. On the **Virtual machines** pane, under **Settings**, select **Extensions + applications**.
1. On the **VM |Extensions + applications** pane, on the **Extensions** tab, select **MicrosoftAzureChangeTrackingAndInventoryChangeTracking-Windows/Linux**.

   :::image type="content" source="media/disable-azure-change-tracking-monitoring-agent/uninstall-extensions-inline.png" alt-text="Screenshot that shows selecting the extension for a VM already disassociated from the DCR." lightbox="media/disable-azure-change-tracking-monitoring-agent/uninstall-extensions-expanded.png":::

1. Select **Uninstall**.
