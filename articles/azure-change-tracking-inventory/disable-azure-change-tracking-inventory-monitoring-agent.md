---
title: Disable Change Tracking and Inventory in Azure using Azure Monitor Agent
description: Learn how to disable Change Tracking and Inventory using Azure Monitor Agent (AMA) from your Azure virtual machines.
#customer intent: As a customer, I want to disassociate a Data Collection Rule (DCR) from a virtual machine so that I can disable its association with Change Tracking.
services: automation
ms.custom: linux-related-content
ms.date: 12/03/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
ms.author: v-jasmineme
author: jasminemehndir
---

# Disable Change Tracking and Inventory with Azure Monitor Agent

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article describes how to disable change tracking and inventory with AMA.

## Disable Change Tracking from a VM

To disable change tracking with Azure Monitor Agent from a virtual machine, you must first disassociate the DCR and then uninstall Azure CTI. Follow these steps:

### Disassociate Data Collection Rule (DCR) from a VM

To disassociate DCR from a VM, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), select **Virtual Machines** and in the search bar, select the specific Virtual Machine. 
1. On the **Virtual Machine** pane, under **Operations**, select **Change tracking**. Alternatively, in the search bar, enter **Change tracking** and select it from the results.
1. Select **Settings** > **DCR** to view all the virtual machines associated with the DCR.
1. Select the VM for which you want to disable the DCR.
1. Select **Delete**.

   :::image type="content" source="media/disable-azure-change-tracking-monitoring-agent/disable-data-collection-rule-inline.png" alt-text="Screenshot of selecting a VM to dissociate the DCR from the VM." lightbox="media/disable-azure-change-tracking-monitoring-agent/disable-data-collection-rule-expanded.png":::

   A notification appears asking to confirm the disassociation of the DCR for the selected VM.

### Uninstall change tracking extension

To uninstall change tracking extension, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), select **Virtual Machines** and in the search bar, select the VM for which you have already disassociated the DCR.
1. On the **Virtual Machines** pane, under **Settings**, select **Extensions + applications**.
1. On the **VM |Extensions + applications** pane, under **Extensions** tab, select **MicrosoftAzureChangeTrackingAndInventoryChangeTracking-Windows/Linux**.

   :::image type="content" source="media/disable-azure-change-tracking-monitoring-agent/uninstall-extensions-inline.png" alt-text="Screenshot of selecting the extension for a VM that is already disassociated from the DCR." lightbox="media/disable-azure-change-tracking-monitoring-agent/uninstall-extensions-expanded.png":::

1. Select **Uninstall**.

## Next steps

To learn how to migrate from CTI using Log Analytics version to the Azure Monitor Agent version, see [Migration guidance for Azure CTI](../automation/troubleshoot/change-tracking.md).
