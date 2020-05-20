---
title: Enable Azure Automation Change Tracking and Inventory from an Azure VM
description: This article tells how to enable Change Tracking and Inventory from an Azure VM.
services: automation
ms.date: 03/04/2020
ms.topic: conceptual
ms.custom: mvc
---

# Enable Change Tracking and Inventory from an Azure VM

This article describes how you can use an Azure VM to enable the [Change Tracking and Inventory](change-tracking.md) feature on other machines. To enable Azure VMs at scale, you must enable an existing VM using Change Tracking and Inventory. 

> [!NOTE]
> When enabling Change Tracking and Inventory, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](automation-offering-get-started.md) to manage machines.
* A [virtual machine](../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Enable Change Tracking and Inventory

1. In the [Azure portal](https://portal.azure.com), select **Virtual machines** or search for and select **Virtual machines** from the Home page.

2. Select the VM for which you want to enable Change Tracking and Inventory. VMs can exist in any region, no matter the location of your Automation account.

3. On the VM page, select either **Inventory** or **Change tracking** under **Configuration Management**.

4. You must have the `Microsoft.OperationalInsights/workspaces/read` permission to determine if the VM is enabled for a workspace. To learn about additional permissions that are required, see [Feature setup permissions](automation-role-based-access-control.md#feature-setup-permissions). To learn how to enable multiple machines at once, see [Enable Change Tracking and Inventory from an Automation account](automation-enable-changes-from-auto-acct.md).

5. Choose the Log Analytics workspace and Automation account, and click **Enable** to enable Change Tracking and Inventory for the VM. The setup takes up to 15 minutes to complete. 

## <a name="scope-configuration"></a>Check the scope configuration

Change Tracking and Inventory uses a scope configuration within the workspace to target the computers to enable for the feature. The scope configuration is a group of one or more saved searches that is used to limit the scope of the feature to specific computers. For more information, see [Work with scope configurations for Change Tracking and Inventory](automation-scope-configurations-change-tracking.md).

## Next steps

* [Manage Change Tracking and Inventory](change-tracking-file-contents.md)
* [Work with scope configurations for Change Tracking and Inventory](automation-scope-configurations-change-tracking.md)
* [Identify software on a VM](automation-tutorial-installed-software.md)
* [Unlink workspace from Automation account for Change Tracking and Inventory](automation-unlink-workspace-change-tracking.md)
* [Remove VMs from Change Tracking and Inventory](automation-remove-vms-from-change-tracking.md)
* [Troubleshoot changes on an Azure VM](automation-tutorial-troubleshoot-changes.md)
* [Troubleshoot Change Tracking and Inventory issues](troubleshoot/change-tracking.md)
