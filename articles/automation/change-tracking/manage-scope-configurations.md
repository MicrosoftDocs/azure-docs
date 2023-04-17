---
title: Limit Azure Automation Change Tracking and Inventory deployment scope
description: This article tells how to work with scope configurations to limit the scope of a Change Tracking and Inventory deployment.
services: automation
ms.subservice: change-inventory-management
ms.date: 05/27/2021
ms.topic: conceptual
---

# Limit Change Tracking and Inventory deployment scope

This article describes how to work with scope configurations when using the [Change Tracking and Inventory](overview.md) feature to deploy changes to your VMs. For more information, see [Targeting monitoring solutions in Azure Monitor (Preview)](/previous-versions/azure/azure-monitor/insights/solution-targeting).

## About scope configurations

A scope configuration is a group of one or more saved searches (queries) used to limit the scope of Change Tracking and Inventory to specific computers. The scope configuration is used within the Log Analytics workspace to target the computers to enable. When you add a computer to changes from the feature, the computer is also added to a saved search in the workspace.

By default, Change Tracking and Inventory creates a computer group named **ChangeTracking__MicrosoftDefaultComputerGroup** depending on how you enabled machines:

* From the Automation account, you selected **+ Add Azure VMs**.
* From the Automation account, you selected **Manage machines**, and then you selected the option **Enable on all available machines** or you selected **Enable on selected machines**.

If one of the methods above is selected, this computer group is added to the **MicrosoftDefaultScopeConfig-ChangeTracking** scope configuration. You can also add one or more custom computer groups to this scope to match your management needs and control how specific computers are enabled for management with Change Tracking and Inventory.

To remove one or more machines from the **ChangeTracking__MicrosoftDefaultComputerGroup** to stop managing them with Change Tracking and Inventory, see [Remove VMs from Change Tracking and Inventory](remove-vms-from-change-tracking.md).

## Set the scope limit

To limit the scope for your Change Tracking and Inventory deployment:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, navigate to **Log Analytics workspaces**. Select your workspace from the list.

3. In your Log Analytics workspace, select **Scope Configurations (Preview)** from the left-hand menu.

4. Select the ellipsis to the right of the  **MicrosoftDefaultScopeConfig-ChangeTracking** scope configuration, and select **Edit**.

5. In the editing pane, expand **Select Computer Groups**. The **Computer Groups** pane shows the saved searches that are added to the scope configuration. The saved search used by Update Management is:

    |Name     |Category  |Alias  |
    |---------|---------|---------|
    |MicrosoftDefaultComputerGroup     | ChangeTracking        | ChangeTracking__MicrosoftDefaultComputerGroup         |

6. If you added a custom group, it is shown in the list. To deselect it, clear the checkbox to the left of the item. To add a custom group to the scope, select it and then when you are finished with your changes, click **Select**.

7. On the **Edit scope configuration** page, click **OK** to save your changes.

## Next steps

* To work with Change Tracking and Inventory, see [Manage Change Tracking and Inventory](manage-change-tracking.md).
* To troubleshoot general feature issues, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).
