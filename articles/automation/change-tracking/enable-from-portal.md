---
title: Enable Azure Automation Change Tracking and Inventory from the Azure portal
description: This article tells how to enable the Change Tracking and Inventory feature from the Azure portal.
services: automation
ms.subservice: change-inventory-management
ms.date: 10/14/2020
ms.topic: conceptual
---

# Enable Change Tracking and Inventory from Azure portal

This article describes how you can enable [Change Tracking and Inventory](overview.md) for one or more Azure VMs in the Azure portal. To enable Azure VMs at scale, you must enable an existing VM using Change Tracking and Inventory.

The number of resource groups that you can use for managing your VMs is limited by the [Resource Manager deployment limits](../../azure-resource-manager/templates/deploy-to-resource-group.md). Resource Manager deployments are limited to five resource groups per deployment. Two of these resource groups are reserved to configure the Log Analytics workspace, Automation account, and related resources. This leaves you with three resource groups to select for management by Change Tracking and Inventory. This limit only applies to simultaneous setup, not the number of resource groups that can be managed by an Automation feature.

> [!NOTE]
> When you enable Change Tracking and Inventory, only certain regions are supported for linking a Log Analytics workspace and an Automation Account. For a list of the supported mapping pairs, see [Region mapping for Automation Account and Log Analytics workspace](../how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](../automation-security-overview.md) to manage machines.
* A [virtual machine](../../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Change Tracking and Inventory

1. In the Azure portal, navigate to **Virtual machines**.

2. Use the checkboxes to choose the VMs to add to Change Tracking and Inventory. You can add machines for up to three different resource groups at a time. Azure VMs can exist in any region, no matter the location of your Automation account.

    ![List of VMs](media/enable-from-portal/vmlist.png)

    > [!TIP]
    > Use the filter controls to select VMs from different subscriptions, locations, and resource groups. You can click the top checkbox to select all virtual machines in a list.

3. Select **Change tracking** or **Inventory** under **Configuration Management**.

4. The list of virtual machines is filtered to show only the virtual machines that are in the same subscription and location. If your virtual machines are in more than three resource groups, the first three resource groups are selected.

5. An existing Log Analytics workspace and Automation account are selected by default. If you want to use a different Log Analytics workspace and Automation account, click **CUSTOM** to select them from the Custom Configuration page. When you choose a Log Analytics workspace, a check is made to determine if it is linked with an Automation account. If a linked Automation account is found, you see the following screen. When done, click **OK**.

    ![Select workspace and account](media/enable-from-portal/select-workspace-and-account.png)

6. If the workspace selected isn't linked to an Automation account, you see the following screen. Select an Automation account and click **OK** when finished.

    ![No workspace](media/enable-from-portal/no-workspace.png)

7. Deselect the checkbox next to any virtual machine that you don't want to enable. VMs that can't be enabled are already deselected.

8. Click **Enable** to enable the feature you've selected. The setup takes up to 15 minutes to complete.

## Next steps

* For details of working with the feature, see [Manage Change Tracking](manage-change-tracking.md) and [Manage Inventory](manage-inventory-vms.md).
* To troubleshoot general problems with the feature, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).
