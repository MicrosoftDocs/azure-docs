---
title: Forward Azure Automation DSC data to OMS Log Analytics | Microsoft Docs
description: This article demonstrates how to send Desired State Configuration (DSC) reporting data to Microsoft Operations Management Suite Log Analytics to deliver additional insight and management.
services: automation
documentationcenter: ''
author: eslesar
manager: jwhit
editor: tysonn

ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/24/2017
ms.author: eslesar

---
# Forward Azure Automation DSC data to OMS Log Analytics
Automation can send DSC node status data to your Microsoft Operations Management Suite (OMS) Log Analytics workspace.  
Complicance status are visible in the Azure portal, or with PowerShell, for nodes and for individual DSC resources in node configurations. 
With Log Analytics you can:

* Get compliance information for managed nodes and individual resources
* Trigger an email or alert based on compliance status
* Write advanced queries across your managed nodes
* Correlate compliance status across Automation accounts
* Visualize your node compliance history over time     

## Prerequisites and deployment considerations
To start sending your Automation DSC reports to Log Analytics, you need:

1. The November 2016 or later release of [Azure PowerShell](/powershell/azure/overview) (v2.3.0).
2. A Log Analytics workspace. For more information, see [Get started with Log Analytics](../log-analytics/log-analytics-get-started.md).
3. The ResourceId for your Azure Automation account
4. The ResourceId for your Log Analytics workspace 

To find the ResourceId for your Azure Automation account and Log Analytics workspace, run the following PowerShell:

```powershell
# Find the ResourceId for the Automation Account
Find-AzureRmResource -ResourceType "Microsoft.Automation/automationAccounts"

# Find the ResourceId for the Log Analytics workspace
Find-AzureRmResource -ResourceType "Microsoft.OperationalInsights/workspaces"
```

If you have multiple Automation accounts, or workspaces, in the output of the preceding commands, find the *Name* you need to configure and copy the value for *ResourceId*.

If you need to find the *Name* of your Automation account, in the Azure portal select your Automation account from the **Automation account** 
blade and select **All settings**.  
From the **All settings** blade, under **Account Settings** select **Properties**.  
In the **Properties** blade, you can note these values.<br> ![Automation Account properties](media/automation-manage-send-joblogs-log-analytics/automation-account-properties.png).

## Set up integration with Log Analytics

