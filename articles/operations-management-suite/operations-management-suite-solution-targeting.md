---
title: Solutions targeting in Operations Management Suite (OMS) | Microsoft Docs
description: 
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 1f054a4e-6243-4a66-a62a-0031adb750d8
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/01/2017
ms.author: bwren

---
# Targeting solutions in Operations Management Suite (OMS) (Preview)
When you add a solution to OMS, it's automatically deployed by default to all Windows and Linux agents connected to your Log Analytics workspace.  You may want to manage your costs and limit the amount of data collected for a solution by scoping the solution to a particular set of agents.

## Solutions and agents that can be targeted
Not every management solution and agent can be included in a target.  For those solutions that targeting doesn't apply, the **Scope Configuration** option won't be available in the Azure portal.

- Solution targeting only applies to solutions provided by Microsoft.  It does not apply to solutions [created by yourself or partners](operations-management-suite-solutions-creating.md).
- Solution targeting only applies to solutions that deploy to agents.
- You can only filter out agents that connect directly to Log Analytics.  The solution will automatically deploy to any agents that are part of a connected Operations Manager management group whether or not they're included in the scope configuration.

### Exceptions
The following solutions fit the criteria for targeting but can't be scoped.

- Agent Health Assessment


## Create a solution target
There are three steps to scoping a solution as described in the following sections.  Note that there are steps that you currently have to perform in both the OMS portal and the Azure portal.


### 1. Create a computer group
You specify the computers that you want to include in a scope in a [computer group](log-analytics-computer-groups.md) the you create using the OMS portal.  You must include the computers using a log search as described at [Creating a computer group](log-analytics-computer-groups.md#creating-a-computer-group).  If the computer is added to the group with another source such as AD or WSUS group, it will not be included in the scope configuration.

Once you have the computer group created in your workspace, then you'll include it in a scope configuration that can be applied to one or more solutions.
 
 
 ### 2. Create a scope configuration
 A **Scope Confuguration** includes one or more computer groups and can be applied to one or more solutions. Create a **Scope Configuration** using the following process.  

 1. In the Azure portal, navigate to **Log Analytics** and select your workspace.
 2. In the properties for the workspace under **Workspace Data Sources** select **Scope Configurations**.
 3. Click **Add**.
 4. Type a **Name** for the scope configuration.
 5. Click **Select Computer Groups**, select the computer group that you created, and click **Select**.
 6. Click **OK** to create the scope configuration. 


 ### 3. Apply the scope configuration to a solution.
Once you have a scope configuration, then you can apply it to one or more solutions.  Note that while more than one solution can use a scope configuration, each solution can only ue one scope configuration.

 1. In the Azure portal, navigate to **Log Analytics** and select your workspace.
 2. In the properties for the workspace select **Solutions**.
 3. Click on the solution you want to scope.
 4. In the properties for the solution under **Workspace Data Sources** select **Solution Targeting**.  If the option is not available, then this solution cannot be targeted.
 5. Click **Add scope configuration**.  If you already have a configuration applied to this solution, then this option will be unavailable.  You must remove the existing configuration before adding another one.
 6. Click on the scope configuration that you created.
 7. Watch the **Status** of the configuration to ensure that 

## Next steps

