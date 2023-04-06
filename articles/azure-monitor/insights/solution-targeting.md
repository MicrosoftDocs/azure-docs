---
title: Target monitoring solutions in Azure Monitor | Microsoft Docs
description: Targeting monitoring solutions allows you to limit monitoring solutions to a specific set of agents. This article describes how to create a scope configuration and apply it to a solution.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/08/2022

---

# Target monitoring solutions in Azure Monitor (preview)

> [!IMPORTANT]
> This feature has been deprecated because the Log Analytics agent is being replaced with the Azure Monitor Agent. Solutions in Azure Monitor are being replaced with insights. You can continue to use it if you already have it configured, but it's being removed from regions where it isn't already being used. The feature will no longer be supported after August 31, 2024.

When you add a monitoring solution to your subscription, it's automatically deployed by default to all Windows and Linux agents connected to your Log Analytics workspace. You might want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents. This article describes how to use *solution targeting*, which is a feature that allows you to apply a scope to your solutions.

## Target a solution
There are three steps to targeting a solution, as described in the following sections.

### Create a computer group
You specify the computers that you want to include in a scope by creating a [computer group](../logs/computer-groups.md) in Azure Monitor. The computer group can be based on a log query or imported from other sources, such as Active Directory or Windows Server Update Services groups. As described in the section [Solutions and agents that can't be targeted](#solutions-and-agents-that-cant-be-targeted), only computers that are directly connected to Azure Monitor are included in the scope.

After you have the computer group created in your workspace, you'll include it in a scope configuration that can be applied to one or more solutions.

### Create a scope configuration
 A *scope configuration* includes one or more computer groups and can be applied to one or more solutions.

 To create a scope configuration:

 1. In the Azure portal, go to **Log Analytics workspaces** and select your workspace.
 1. In the properties for the workspace under **Classic**, select **Scope configurations (deprecated)**.
 1. Select **Add** to create a new scope configuration.
 1. Enter a name for the scope configuration.
 1. Click **Select Computer Groups**.
 1. Select the computer group that you created and optionally any other groups to add to the configuration. Click **Select**.
 1. Select **OK** to create the scope configuration.

### Apply the scope configuration to a solution.
After you have a scope configuration, you can apply it to one or more solutions. Although a single scope configuration can be used with multiple solutions, each solution can only use one scope configuration.

To apply a scope configuration:

 1. In the Azure portal, go to **Log Analytics workspaces** and select your workspace.
 1. In the properties for the workspace, select **Legacy solutions**.
 1. Select the solution you want to scope.
 1. In the properties for the solution under **Workspace Data Sources**, select **Solution Targeting**. If the option isn't available, [this solution can't be targeted](#solutions-and-agents-that-cant-be-targeted).
 1. Select **Add scope configuration**. If you already have a configuration applied to this solution, this option is unavailable. You must remove the existing configuration before you add another one.
 1. Select the scope configuration that you created.
 1. Watch the **Status** of the configuration to ensure that it shows **Succeeded**. If the status indicates an error, select the ellipses to the right of the configuration and select **Edit scope configuration** to make changes.

## Solutions and agents that can't be targeted
The following criteria are for agents and solutions that can't be used with solution targeting:

- Solution targeting only applies to solutions that deploy to agents.
- Solution targeting only applies to solutions provided by Microsoft. It doesn't apply to solutions [created by yourself or partners](./solutions.md).
- You can only filter out agents that connect directly to Azure Monitor. Solutions automatically deploy to any agents that are part of a connected Operations Manager management group whether or not they're included in a scope configuration.

### Exceptions
Solution targeting can't be used with the following solution even though it fits the stated criteria:

- Agent Health Assessment

## Next steps
- Learn more about monitoring solutions, including the solutions that are available to install in your environment, in [Add Azure Log Analytics monitoring solutions to your workspace](solutions.md).
- Learn more about creating computer groups in [Computer groups in Azure Monitor log queries](../logs/computer-groups.md).
