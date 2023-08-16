---
title: Enable Azure Automation Change Tracking and Inventory from an Azure VM
description: This article tells how to enable Change Tracking and Inventory from an Azure VM.
services: automation
ms.subservice: change-inventory-management
ms.date: 10/14/2020
ms.topic: conceptual
---

# Enable Change Tracking and Inventory from an Azure VM

This article describes how you can use an Azure VM to enable [Change Tracking and Inventory](overview.md) on other machines. To enable Azure VMs at scale, you must enable an existing VM using Change Tracking and Inventory.

> [!NOTE]
> When enabling Change Tracking and Inventory, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](../how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](../automation-security-overview.md) to manage machines.
* A [virtual machine](../../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Change Tracking and Inventory

1. In the [Azure portal](https://portal.azure.com), select **Virtual machines** or search for and select **Virtual machines** from the Home page.

2. Select the VM for which you want to enable Change Tracking and Inventory. VMs can exist in any region, no matter the location of your Automation account.

3. On the VM page, select either **Inventory** or **Change tracking** under **Configuration Management**.

4. You must have the `Microsoft.OperationalInsights/workspaces/read` permission to determine if the VM is enabled for a workspace. To learn about additional permissions that are required, see [Feature setup permissions](../automation-role-based-access-control.md#feature-setup-permissions). To learn how to enable multiple machines at once, see [Enable Change Tracking and Inventory from an Automation account](enable-from-automation-account.md).

5. Choose the Log Analytics workspace and Automation account, and click **Enable** to enable Change Tracking and Inventory for the VM. The setup takes up to 15 minutes to complete.

## Next steps

* For details of working with the feature, see [Manage Change Tracking](manage-change-tracking.md) and [Manage Inventory](manage-inventory-vms.md).

* To troubleshoot general problems with the feature, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).
