---
title: Work with scope configurations for Azure Automation Change Tracking and Inventory
description: This article tells how to work with scope configurations when you're using Change Tracking and Inventory.
services: automation
ms.date: 03/04/2020
ms.topic: conceptual
ms.custom: mvc
---

# Work with scope configurations for Change Tracking and Inventory

This article describes how you can work with scope configurations when enabling the [Update Management](automation-update-management.md) feature on VMs. 

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## <a name="scope-configuration"></a>Check the scope configuration

Update Management uses a scope configuration within the Log Analytics workspace to target the computers to enable for Update Management. The scope configuration is a group of one or more saved searches that is used to limit the scope of the feature to specific computers. To access the scope configurations:

1. In your Automation account under **Related resources**, select **Workspace**. 

2. Choose the workspace under **Workspace data sources**, and select **Scope Configurations**.

3. If the selected workspace doesn't have the Update Management feature enabled yet, it creates the `MicrosoftDefaultScopeConfig-ChangeTracking` scope configuration. 

4. If the selected workspace already has the feature enabled, it isn't redeployed, and the scope configuration isn't added to it. 

5. Select the ellipsis on any of the scope configurations, and then click **Edit**. 

6. In the editing pane, select **Select Computer Groups**. The Computer Groups pane shows the saved searches that are used to create the scope configuration.

## View a saved search

When a computer is added to Change Tracking and Inventory, it's also added to a saved search in your workspace. The saved search is a query that contains the targeted computers.

1. Navigate to your Log Analytics workspace and select **Saved searches** under **General**. The saved search used by Update Management is:

    |Name     |Category  |Alias  |
    |---------|---------|---------|
    |MicrosoftDefaultComputerGroup     |  ChangeTracking       | ChangeTracking__MicrosoftDefaultComputerGroup        |

2. Select the saved search to view the query used to populate the group. The following image shows the query and its results:

    ![Saved searches](media/automation-scope-configurations-change-tracking/logsearch.png)

## Next steps

* To work with Change Tracking and Inventory, see [Manage Change Tracking and Inventory](change-tracking-file-contents.md).
* To troubleshoot general feature issues, see [Troubleshoot Change Tracking and Inventory issues](troubleshoot/change-tracking.md).