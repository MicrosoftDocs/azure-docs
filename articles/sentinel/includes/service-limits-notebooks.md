---
author: EdB-MSFT
ms.author: edbayansh
ms.topic: include
ms.date: 07/15/2025
---

## Service parameters and limits for VS Code Notebooks


The following section lists the service parameters and limits for Microsoft Sentinel data lake when using VS Code Notebooks.

|Category|Parameter/limit|
|---|---|
|Custom table in the analytics tier|Custom tables in analytics tier can't be deleted from a notebook; Use Log Analytics to delete these tables. For more information, see [Add or delete tables and columns in Azure Monitor Logs](/azure/azure-monitor/logs/create-custom-table?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#delete-a-table)|
|Gateway web socket timeout|2 hours|
|Interactive query timeout|2 hours|
|Interactive session inactivity timeout|20 minutes|
|Language|Python|
|Notebook job timeout| 8 hours|
|Max concurrent notebook jobs|3, subsequent jobs are queued|
|Max concurrent users on interactive querying|8-10 on Large pool|
|Session start-up time|Spark compute session takes about 5-6 minutes to start. You can view the status of the session at the bottom of your VS Code Notebook.|
|Supported libraries|Only [Azure Synapse libraries 3.4](https://github.com/microsoft/synapse-spark-runtime/tree/main#readme) and the Microsoft Sentinel Provider library for abstracted functions are supported for querying the data lake. Pip installs or custom libraries aren't supported.|
|VS Code UX limit to display records|100,000 rows|
