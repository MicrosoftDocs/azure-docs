---
title: Limit Azure Automation Change Tracking and Inventory deployment scope
description: This article tells how to work with scope configurations to limit the scope of a Change Tracking and Inventory deployment.
services: automation
ms.date: 03/04/2020
ms.topic: conceptual
ms.custom: mvc
---

# Limit Change Tracking and Inventory deployment scope

This article describes how to work with scope configurations when using the [Change Tracking and Inventory](change-tracking.md) feature to deploy changes to your VMs. For more information, see [Targeting monitoring solutions in Azure Monitor (Preview)](https://docs.microsoft.com/azure/azure-monitor/insights/solution-targeting). 

## About scope configurations

A scope configuration is a group of one or more saved searches (queries) used to limit the scope of Change Tracking and Inventory to specific computers. The scope configuration is used within the Log Analytics workspace to target the computers to enable. When you add a computer to changes from the feature, the computer is also added to a saved search in the workspace.

## Set the scope limit

To limit the scope for your Change Tracking and Inventory deployment:

1. In your Automation account, select **Linked Workspace** under **Related resources**.

2. Click **Go to workspace**.

3. Select **Scope Configurations (Preview)** under **Workspace Data Sources**.

4. Select the ellipsis to the right of the  `MicrosoftDefaultScopeConfig-ChangeTracking` scope configuration, and click **Edit**. 

5. In the editing pane, select **Select Computer Groups**. The Computer Groups pane shows the saved searches that are used to create the scope configuration. The saved search used by Change Tracking and Inventory is:

    |Name     |Category  |Alias  |
    |---------|---------|---------|
    |MicrosoftDefaultComputerGroup     |  ChangeTracking       | ChangeTracking__MicrosoftDefaultComputerGroup        |

6. Select the saved search to view and edit the query used to populate the group. The following image shows the query and its results:

    ![Saved searches](media/automation-scope-configurations-change-tracking/logsearch.png)

## Next steps

* To work with Change Tracking and Inventory, see [Manage Change Tracking and Inventory](change-tracking-file-contents.md).
* To troubleshoot general feature issues, see [Troubleshoot Change Tracking and Inventory issues](troubleshoot/change-tracking.md).