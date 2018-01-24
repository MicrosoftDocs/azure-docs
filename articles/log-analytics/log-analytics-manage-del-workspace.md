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
ms.topic: article
ms.date: 10/27/2017
ms.author: magoedte
ms.custom: mvc
---

# Delete an Azure Log Analytics workspace with the Azure portal
This topic shows how to use the Azure portal to delete a Log Analytics workpace that you may no longer require. 

## To delete a workspace 
When you delete a Log Analytics workspace, all data related to your workspace is deleted from the service within 30 days.  You want to exercise caution when you delete a workspace because there might be important data and configuration that may negatively impact your service operations.  
 
If you are an administrator and there are multiple users associated with the workspace, the association between those users and the workspace is broken. If the users are associated with other workspaces, then they can continue using Log Analytics with those other workspaces. However, if they are not associated with other workspaces then they need to create a workspace to use Log Analytics. 

1. Sign into the [Azure portal](http://portal.azure.com). 
2. In the Azure portal, click **More services** found on the lower left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
3. In the Log Analytics subscriptions pane, select a workspace and then click **Delete**  from the top of the middle pane.<br><br> ![Delete option from Workspace properties pane](media/log-analytics-manage-del-workspace/log-analytics-delete-workspace.png)<br>  
4. When the confirmation message window appears asking you to confirm deletion of the workspace, click **Yes**.<br><br> ![Confirm deletion of workspace](media/log-analytics-manage-del-workspace/log-analytics-delete-workspace-confirm.png)

