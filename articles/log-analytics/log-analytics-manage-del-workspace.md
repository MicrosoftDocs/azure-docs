---
title: Delete an Azure Log Analytics workspace | Microsoft Docs
description: Learn how to delete your Log Analytics workspace if you created one in a personal subscription or restructure your workspace model.   
services: log-analytics
documentationcenter: log-analytics
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/07/2018
ms.author: magoedte
ms.component: 
---

# Delete an Azure Log Analytics workspace with the Azure portal
This article shows how to use the Azure portal to delete a Log Analytics workspace that you may no longer require. 

## To delete a workspace 
When you delete a Log Analytics workspace, all data related to your workspace is deleted from the service within 30 days.  You want to exercise caution when you delete a workspace because there might be important data and configuration that may negatively impact your service operations. Consider the other Azure services and sources that store its data in Log Analytics, such as:

* Application Insights
* Azure Security Center
* Azure Automation
* Agents running on Windows and Linux virtual machines
* Agents running on Windows and Linux computers in your environment
* System Center Operations Manager
* Management solutions 

Any agents and System Center Operations Manager management groups configured to report to the workspace continue to in an orphaned state.  Inventory what agents, solutions, and other Azure services are integrated with the workspace before you proceed.   
 
If you are an administrator and there are multiple users associated with the workspace, the association between those users and the workspace is broken. If the users are associated with other workspaces, then they can continue using Log Analytics with those other workspaces. However, if they are not associated with other workspaces then they need to create a workspace to use Log Analytics. 

1. Sign into the [Azure portal](http://portal.azure.com). 
2. In the Azure portal, click **More services** found on the lower left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
3. In the Log Analytics subscriptions pane, select a workspace and then click **Delete**  from the top of the middle pane.<br><br> ![Delete option from Workspace properties pane](media/log-analytics-manage-del-workspace/log-analytics-delete-workspace.png)<br>  
4. When the confirmation message window appears asking you to confirm deletion of the workspace, click **Yes**.<br><br> ![Confirm deletion of workspace](media/log-analytics-manage-del-workspace/log-analytics-delete-workspace-confirm.png)

