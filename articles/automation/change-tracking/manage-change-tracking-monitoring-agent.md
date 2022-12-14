---
title: Manage change tracking and inventory in Azure Automation using Azure Monitoring Agent (Preview)
description: This article tells how to use change tracking and inventory to track software and Microsoft service changes in your environment using Azure Monitoring Agent (Preview)
services: automation
ms.subservice: change-inventory-management
ms.date: 11/24/2022
ms.topic: conceptual
---

# Manage change tracking and inventory using Azure Monitoring Agent (Preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article describes how to manage change tracking, and includes the procedure on how you can change a workspace and configure data collection rule.

>[!NOTE]
> Before using the procedures in this article, ensure that you've enabled Change Tracking and Inventory on your VMs. For detailed information on how you can enable, see [Enable change tracking and inventory from portal](enable-vms-monitoring-agent.md)


## Change a workspace

#### [For single VMs](#tab/workspace-singlevm)

1. Select the virtual machine, in search, enter **change tracking**.
1. Select **Open change and inventory center**.
    
    :::image type="content" source="media/manage-change-tracking-monitoring-agent/select-change-and-inventory-center-inline.png" alt-text="Screenshot showing how to select change and inventory center from the portal." lightbox="media/manage-change-tracking-monitoring-agent/select-change-and-inventory-center-expanded.png":::

1. Select the workspace from the filter, and select **Apply**.
1. Select **Settings** to configure the data collection rule at the workspace level.


#### [For multiple VMs](#tab/workspace-multiplevms)

1. Select the virtual machine.
1. In search, enter **change tracking** to view the change tracking and inventory page.
1. In the **Stay up-to-date with all changes** layout, > **Log analytics workspace**, select **Change**.
1. In **Custom Configuration** screen, provide the **Subscription**, **Location**, and **Workspace**. and select **OK**.

   :::image type="content" source="media/manage-change-tracking-monitoring-agent/custom-configuration-inline.png" alt-text="Screenshot showing how to change a workspace." lightbox="media/manage-change-tracking-monitoring-agent/custom-configuration-expanded.png":::
---

## Configure data collection rule

1. Select your virtual machine and in the search, enter **Change tracking**.

1. Select **Settings** to view the **Data Collection Rule Configuration**. This allows you to configure changes on a VM at a granular level. 

1. Select **+Add** to enter the file settings. Enter the **Name**, **Group**, **File path**, **Path Type** which can be either a file or folder and select **Add**.

   :::image type="content" source="media/manage-change-tracking-monitoring-agent/add-windows-file-setting.png" alt-text="Screenshot showing how to enter file settings for a single virtual machine.":::

1. Using the filter, you can further choose a specific data collection rule to configure changes to specific virtual machine.

   :::image type="content" source="media/manage-change-tracking-monitoring-agent/select-data-collection-rule-inline.png" alt-text="Screenshot showing to select data collection rule to further configure a virtual machine." lightbox="media/manage-change-tracking-monitoring-agent/select-data-collection-rule-expanded.png":::

1. In the **Edit windows file setting**, you can make changes to the existing rule and select **Save**.

> [!NOTE]
> A single virtual machine will have one data collection rule. However, in a workspace, as there are many virtual machines, there will be multiple data collection rules but you will see the default data collection rule which is primarily the first data collection rule that you have created.


## Next steps

* To learn about alerts, see [Configuring alerts](../change-tracking/configure-alerts.md)
