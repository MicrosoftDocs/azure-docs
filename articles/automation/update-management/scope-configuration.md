---
title: Limit Azure Automation Update Management deployment scope
description: This article tells how to use scope configurations to limit the scope of an Update Management deployment.
services: automation
ms.date: 06/03/2021
ms.topic: conceptual
ms.custom: mvc
---

# Limit Update Management deployment scope

This article describes how to work with scope configurations when using the [Update Management](overview.md) feature to deploy updates and patches to your machines. For more information, see [Targeting monitoring solutions in Azure Monitor (Preview)](/previous-versions/azure/azure-monitor/insights/solution-targeting).

## About scope configurations

A scope configuration is a group of one or more saved searches (queries) used to limit the scope of Update Management to specific computers. The scope configuration is used within the Log Analytics workspace to target the computers to enable. When you add a computer to receive updates from Update Management, the computer is also added to a saved search in the workspace. 

By default, Update Management creates a computer group named **Updates__MicrosoftDefaultComputerGroup** depending on how you enabled machines with Update Management:

* From the Automation account, you selected **+ Add Azure VMs**.
* From the Automation account, you selected **Manage machines**, and then you selected the option **Enable on all available machines** or you selected **Enable on selected machines**.

If one of the methods above is selected, this computer group is added to the **MicrosoftDefaultScopeConfig-Updates** scope configuration. You can also add one or more custom computer groups to this scope to match your management needs and control how specific computers are enabled for management with Update Management.

To remove one or more machines from the **Updates__MicrosoftDefaultComputerGroup** to stop managing them with Update Management, see [Remove VMs from Update Management](remove-vms.md).

## Set the scope limit

To limit the scope for your Update Management deployment:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, navigate to **Log Analytics workspaces**. Select your workspace from the list.

3. In your Log Analytics workspace, select **Scope Configurations (Preview)** from the left-hand menu.

4. Select the ellipsis to the right of the  **MicrosoftDefaultScopeConfig-Updates** scope configuration, and select **Edit**.

5. In the editing pane, expand **Select Computer Groups**. The **Computer Groups** pane shows the saved searches that are added to the scope configuration. The saved search used by Update Management is:

    |Name     |Category  |Alias  |
    |---------|---------|---------|
    |MicrosoftDefaultComputerGroup     | Updates        | Updates__MicrosoftDefaultComputerGroup         |

6. If you added a custom group, it is shown in the list. To deselect it, clear the checkbox to the left of the item. To add a custom group to the scope, select it and then when you are finished with your changes, click **Select**.

7. On the **Edit scope configuration** page, click **OK** to save your changes.

## Next steps

You can [query Azure Monitor logs](query-logs.md) to analyze update assessments, deployments, and other related management tasks. It includes pre-defined queries to help you get started.
