---
title: Log Analytics new log search frequently asked questions | Microsoft Docs
description: This article provides frequently asked questions regarding the upgrade of Log Analytics to the new query language.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/25/2017
ms.author: bwren

---

# Log Analytics new log search frequently asked questions

This article provides frequently asked questions regarding the upgrade of [Log Analytics to the new query language](log-analytics-log-search-upgrade.md).



## Upgrade process

### I have several workspaces. Can I upgrade all workspaces at the same time?  
A:  No.  Upgrade applies to a single workspace each time. Currently there is no way of upgrading many workspaces at once. Please note that other users of the upgraded workspace will be affected as well.  

### Will existing log data collected in my workspace be modified if I upgrade?  
No. The log data available to your workspace searches is not affected by the upgrade. Saved searches, alerts and views will be converted to the new search language automatically.  

### What happens if I don't upgrade my workspace?  
The legacy log search will be deprecated in the coming months. Workspaces that are not upgraded by that time will be upgraded automatically.

### I didn't choose to upgrade, but my workspace has been upgraded anyway! what happened?  
Another admin of this workspace could have upgraded the workspace. Please note that all workspaces will be automatically upgraded when the new language reaches general availability.  

### I have upgraded by mistake and now need to cancel it and restore everything back. What should I do?!  
No problem.  We create a snapshot of your workspace before upgrade, so you can restore it. Keep in mind that searches, alerts or views you saved after the upgrade will be lost though.  To restore your workspace environment, follow the procedure at [Can I go back after I upgrade?](log-analytics-log-search-upgrade.md#can-i-go-back-after-i-upgrade).



## Log searches

### I have saved searches outside of my upgraded workspace. Can I convert them to the new search language automatically?
You can use the language converter tool in the log search page to convert each one.  There is no method to automatically convert multiple searches without upgrading the workspace.



## Alerts

### I have a lot of alert rules. Do I need to create them again in the new language after I upgrade?  
No, your alert rules are automatically converted to the new search language during upgrade.  

## Power BI

### Does anything change with PowerBI integration?
Yes.  Once your workspace has been upgraded then the process for exporting Log Analytics data to Power BI will no longer work.  Any existing schedules that you created before upgrading will become disabled.  After upgrade, Azure Log Analytics uses the same platform as Application Insights, and you use the same process to export Log Analytics queries to Power BI as [the process to export Application Insights queries to Power BI](../application-insights/app-insights-export-power-bi.md#export-analytics-queries).



## Next steps

- Learn more about [upgrading your workspace to the new Log Analytics query language](log-analytics-log-search-upgrade.md).
