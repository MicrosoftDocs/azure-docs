---
title: Limit Azure Automation Change Tracking and Inventory deployment scope
description: This article tells how to work with scope configurations to limit the scope of a Change Tracking and Inventory deployment.
services: automation
ms.subservice: change-inventory-management
ms.date: 10/14/2020
ms.topic: conceptual
---

# Limit Change Tracking and Inventory deployment scope

This article describes how to work with scope configurations when using the [Change Tracking and Inventory](overview.md) feature to deploy changes to your VMs. For more information, see [Targeting monitoring solutions in Azure Monitor (Preview)](../../azure-monitor/insights/solution-targeting.md).

## About scope configurations

A scope configuration is a group of one or more saved searches (queries) used to limit the scope of Change Tracking and Inventory to specific computers. The scope configuration is used within the Log Analytics workspace to target the computers to enable. When you add a computer to changes from the feature, the computer is also added to a saved search in the workspace.

## Set the scope limit

To limit the scope for your Change Tracking and Inventory deployment:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, select **All services**. In the list of resources, type **Automation**. As you begin typing, the list filters suggestions based on your input. Select **Automation Accounts**.

3. In your list of Automation accounts, select the account you chose when you enabled Change Tracking and Inventory.

4. In your Automation account, select **Linked Workspace** under **Related resources**.

5. Click **Go to workspace**.

6. Select **Scope Configurations (Preview)** under **Workspace Data Sources**.

7. Select the ellipsis to the right of the  `MicrosoftDefaultScopeConfig-ChangeTracking` scope configuration, and click **Edit**.

8. In the editing pane, select **Select Computer Groups**. The Computer Groups pane shows the saved searches that are used to create the scope configuration. The saved search used by Change Tracking and Inventory is:

    |Name     |Category  |Alias  |
    |---------|---------|---------|
    |MicrosoftDefaultComputerGroup     |  ChangeTracking       | ChangeTracking__MicrosoftDefaultComputerGroup        |

9. Select the saved search to view and edit the query used to populate the group. The following image shows the query and its results:

    ![Saved searches](media/manage-scope-configurations/logsearch.png)

## Next steps

* To work with Change Tracking and Inventory, see [Manage Change Tracking and Inventory](manage-change-tracking.md).
* To troubleshoot general feature issues, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).
