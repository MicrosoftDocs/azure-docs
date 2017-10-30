---
title: Manage pricing and data retention in Azure Log Analytics | Microsoft Docs
description: Learn how to change the pricing plan and data retention policy for your Log Analytics workspace in the Azure portal.   
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
---

 
# Manage pricing and storage retention for your Log Analytics workspace
With Azure Log Analytics, there are three plan types: **Free**, **Standalone**, and **OMS**.  If you are on the *Free* plan, there is a limit of 500 MB of data per day sent to Log Analytics and retention of this data is limited to seven days.  For the *Standalone* or *Paid* tier, data collected it is available the last 31 days.  

While using the *Free* plan, if you find you consistently exceed the amounts allowed, you can change your workspace to a paid plan to collect data beyond this limit. 

> [!NOTE]
> Charges apply if you choose to select a longer retention period for the paid tier. You can change your plan type at any time and for more information on pricing, see [pricing details](https://azure.microsoft.com/pricing/details/log-analytics/). 

## Using entitlements from an OMS subscription 
To use the entitlements that come from purchasing OMS E1, OMS E2 OMS or OMS Add-On for System Center, choose the *OMS* plan of Log Analytics. 

When you purchase an OMS subscription, the entitlements are added to your Enterprise Agreement. Any Azure subscription that is created under this agreement can use the entitlements. All workspaces on these subscriptions use the OMS entitlements. 

To ensure that usage of a workspace is applied to your entitlements from the OMS subscription, you need to: 

1. [Create your workspace](log-analytics-quick-create-workspace.md) in an Azure subscription that is part of the Enterprise Agreement that includes the OMS subscription.
2. Select the *OMS* plan for the workspace.

> [!NOTE] 
> If your workspace was created before September 26, 2016 and your Log Analytics pricing plan is *Premium*, then this workspace uses entitlements from the OMS Add-On for System Center. You can also use your entitlements by changing to the *OMS* pricing tier. 
> 
 
The OMS subscription entitlements are not visible in the Azure or OMS classic portal. You can see entitlements and usage in the Enterprise Portal.   

If you need to change the Azure subscription that your workspace is linked to, you can use the Azure PowerShell [Move-AzureRmResource](https://msdn.microsoft.com/library/mt652516.aspx) cmdlet. 

## Using Azure Commitment from an Enterprise Agreement 
If you do not have an OMS subscription, you pay for each component of OMS separately and the usage appears on your Azure bill. 

If you have Azure monetary commitment on the enterprise enrollment to which your Azure subscriptions are linked, usage of Log Analytics will automatically debit against the remaining monetary commit. 

If you need to change the Azure subscription that the workspace is linked to, you can use the Azure PowerShell [Move-AzureRmResource](https://msdn.microsoft.com/library/mt652516.aspx) cmdlet.   

## Change the data retention period 

1. Sign into the [Azure portal](http://portal.azure.com). 
2.  In the Azure portal, click **More services** found on the lower left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
3. In the Log Analytics subscriptions pane, select your workspace to modify from the list.
4. On the Workspace page, click **Retention** from the left-hand pane.
5. On the workspace retention pane, move the slider to increase or decrease the number of days and then click **Save**.  If you are on the *free* tier, you will not be able to modify the data retention period and you need to upgrade to the paid tier in order to control this setting.<br><br> ![Change workspace data retention setting](media/log-analytics-manage-cost/manage-cost-change-retention.png)

## Next steps  
 
