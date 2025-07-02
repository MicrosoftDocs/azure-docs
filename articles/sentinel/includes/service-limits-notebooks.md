---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 06/30/2025
---

## Service limits for VS Code Notebooks


The following section lists the service limits for Microsoft Sentinel data lake (Preview) when using VS Code Notebooks.

+ Spark compute session takes about 5-6 minutes to start. You can view the status of the session at the bottom of your VS Code Notebook.
+ Only [Azure Synapse libraries](https://github.com/microsoft/synapse-spark-runtime/blob/main/Synapse/spark3.4/Official-Spark3.4-Rel-2025-04-16.0-rc.1.md) and the Microsoft Sentinel Provider library for abstracted functions are supported for querying lake. Pip installs or custom libraries aren't supported.


| Category | Limit |
|----------|-------|
| Session start-up time | 5 minutes |
| Interactive: Session inactivity timeout | 20 minutes |
| Interactive: Query timeout | 2 hours |
| Gateway web socket timeout | 2 hours |
| VS Code UX limit to display records | 100,000 rows |
| Supported libraries | Azure Synapse libraries, Microsoft Sentinel Provider. Pip install and custom libraries aren't supported |
| Language | Python |
| Max concurrent users on interactive querying | 8-10 on Large pool |
| Max concurrent notebook jobs | 3, subsequent jobs are queued |
| Custom table in the analytics tier | Custom tables in analytics tier can't be deleted from a notebook; Use Log Analytics to delete these tables. For more information, see [Add or delete tables and columns in Azure Monitor Logs](/azure/azure-monitor/logs/create-custom-table?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#delete-a-table)|
