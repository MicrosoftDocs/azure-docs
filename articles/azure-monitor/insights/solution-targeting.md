---
title: Targeting monitoring solutions in Azure Monitor | Microsoft Docs
description: Targeting monitoring solutions allows you to limit monitoring solutions to a specific set of agents.  This article describes how to create a scope configuration and apply it to a solution.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 04/27/2017

---

# Targeting monitoring solutions in Azure Monitor (Preview)
When you add a monitoring solution to your subscription, it's automatically deployed by default to all Windows and Linux agents connected to your Log Analytics workspace.  You may want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents.  This article describes how to use **Solution Targeting** which is a feature that allows you to apply a scope to your solutions.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## How to target a solution
There are three steps to targeting a solution as described in the following sections. 


### 1. Create a computer group
You specify the computers that you want to include in a scope by creating a [computer group](../platform/computer-groups.md) in Azure Monitor.  The computer group can be based on a log query or imported from other sources such as Active Directory or WSUS groups. As [described below](#solutions-and-agents-that-cant-be-targeted), only computers that are directly connected to Azure Monitor will be included in the scope.

Once you have the computer group created in your workspace, then you'll include it in a scope configuration that can be applied to one or more solutions.
 
 
### 2. Create a scope configuration
 A **Scope Configuration** includes one or more computer groups and can be applied to one or more solutions. 
 
 Create a scope configuration using the following process.  

 1. In the Azure portal, navigate to **Log Analytics workspaces** and select your workspace.
 2. In the properties for the workspace under **Workspace Data Sources** select **Scope Configurations**.
 3. Click **Add** to create a new scope configuration.
 4. Type a **Name** for the scope configuration.
 5. Click **Select Computer Groups**.
 6. Select the computer group that you created and optionally any other groups to add to the configuration.  Click **Select**.  
 6. Click **OK** to create the scope configuration. 


### 3. Apply the scope configuration to a solution.
Once you have a scope configuration, then you can apply it to one or more solutions.  Note that while a single scope configuration can be used with multiple solutions, each solution can only use one scope configuration.

Apply a scope configuration using the following process.  

 1. In the Azure portal, navigate to **Log Analytics workspaces** and select your workspace.
 2. In the properties for the workspace select **Solutions**.
 3. Click on the solution you want to scope.
 4. In the properties for the solution under **Workspace Data Sources** select **Solution Targeting**.  If the option is not available then [this solution cannot be targeted](#solutions-and-agents-that-cant-be-targeted).
 5. Click **Add scope configuration**.  If you already have a configuration applied to this solution then this option will be unavailable.  You must remove the existing configuration before adding another one.
 6. Click on the scope configuration that you created.
 7. Watch the **Status** of the configuration to ensure that it shows **Succeeded**.  If the status indicates an error, then click the ellipse to the right of the configuration and select **Edit scope configuration** to make changes.

## Solutions and agents that can't be targeted
Following are the criteria for agents and solutions that can't be used with solution targeting.

- Solution targeting only applies to solutions that deploy to agents.
- Solution targeting only applies to solutions provided by Microsoft.  It does not apply to solutions [created by yourself or partners](solutions-creating.md).
- You can only filter out agents that connect directly to Azure Monitor.  Solutions will automatically deploy to any agents that are part of a connected Operations Manager management group whether or not they're included in a scope configuration.

### Exceptions
Solution targeting cannot be used with the following solutions even though they fit the stated criteria.

- Agent Health Assessment

## Next steps
- Learn more about monitoring solutions including the solutions that are available to install in your environment at [Add Azure Log Analytics monitoring solutions to your workspace](solutions.md).
- Learn more about creating computer groups at [Computer groups in Azure Monitor log queries](../platform/computer-groups.md).
