---
title: Log Analytics next generation log search frequently asked questions | Microsoft Docs
description: This article provides frequently asked questions regarding the upgrade of Log Analytics to the next generation query language.
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
ms.date: 07/18/2017
ms.author: bwren

---

# Log Analytics next generation log search frequently asked questions

This article provides frequently asked questions regarding the upgrade of [Log Analytics to the next generation query language](log-analytics-log-search-upgrade.md).



## Upgrade process

### I have several workspaces. Can I upgrade all workspaces at the same time?  
A:  No.  Upgrade applies to a single workspace each time. Currently there is no way of upgrading many workspaces at once. Please note that other users of the upgraded workspace will be affected as well.  

### Will existing log data collected in my workspace be modified if I upgrade?  
No. The log data available to your workspace searches is not affected by the upgrade. Saved searches, alerts and views will be converted to the new search language automatically.  

### What happens if I don't upgrade my workspace?  
The legacy log search will be deprecated in the coming months. Workspaces that are not upgraded by that time will be upgraded automatically.

### I didn't choose to upgrade, but my workspace has been upgraded anyway! what happened?  
Another admin of this workspace could have upgraded the workspace. Check out your email to see who initiated the upgrade and when.  Please note that workspaces that are not upgraded until the due date will be automatically upgraded.  

### I have upgraded by mistake and now need to cancel it and restore everything back. What should I do?!  
No problem.  We create a snapshot of your workspace before upgrade, so you can restore it. Keep in mind that searches, alerts or views you saved after the upgrade will be lost though.  To restore your workspace environment and go back to the legacy search language go to AAA and click Restore. If this option is not open to you - contact our support team here and they will restore it for you.  



## Log searches

### I have saved searches outside of my upgraded workspace. Can I convert them to the new search language automatically? 
You can use the language converter tool in the log search page to convert each one.  There is no method to automatically convert multiple searches without upgrading the workspace.
  


## Alerts

### I have a lot of alert rules. Do I need to create them again in the new language after I upgrade?  
No, your alert rules are automatically converted to the new search language during upgrade.  
  
## Power BI

### What changes are planned for PowerBI integration?
We’ve been reviewing the feedback from the preview of the PowerBI functionality, and are working to align the PowerBI integration with the functionality provided by Application Insights.  These changes will add the ability for Log Analytics queries to generate datasets in PowerBI desktop, and provide more choices in the way data is presented. Using PowerBI desktop it is possible to publish to PowerBI online and make it available to multiple people within your organization.



## Next steps

- Learn more about [upgrading your workspace to the new Log Analytics query language](log-analytics-log-search-upgrade.md).