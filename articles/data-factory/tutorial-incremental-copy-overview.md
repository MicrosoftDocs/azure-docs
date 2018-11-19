---
title: 'Incrementally copy data by using Azure Data Factory | Microsoft Docs'
description: 'These tutorials show you how to incrementally copy data from a source data store to a destination data store. The first one copies data from one table.'
services: data-factory
documentationcenter: ''
author: dearandyxu
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 01/22/2018
ms.author: yexu
---
# Incrementally load data from a source data store to a destination data store

In a data integration solution, incrementally (or delta) loading data after an initial full data load is a widely used scenario. The tutorials in this section show you different ways of loading data incrementally by using Azure Data Factory.

## Delta data loading by using a watermark
In this case, you define a watermark in your source database. A watermark is a column that has the last updated time stamp or an incrementing key. The delta loading solution loads the changed data between an old watermark and a new watermark. The workflow for this approach is depicted in the following diagram: 

![Workflow for using a watermark](media/tutorial-incremental-copy-overview/workflow-using-watermark.png)

For step-by-step instructions, see the following tutorials: 

- [Incrementally copy data from one table in Azure SQL Database to Azure Blob storage](tutorial-incremental-copy-powershell.md)
- [Incrementally copy data from multiple tables in on-premises SQL Server to Azure SQL Database](tutorial-incremental-copy-multiple-tables-powershell.md)

## Delta data loading by using the Change Tracking technology
Change Tracking technology is a lightweight solution in SQL Server and Azure SQL Database that provides an efficient change tracking mechanism for applications. It enables an application to easily identify data that was inserted, updated, or deleted. 

The workflow for this approach is depicted in the following diagram:

![Workflow for using Change Tracking](media/tutorial-incremental-copy-overview/workflow-using-change-tracking.png)

For step-by-step instructions, see the following tutorial: <br/>
[Incrementally copy data from Azure SQL Database to Azure Blob storage by using Change Tracking technology](tutorial-incremental-copy-change-tracking-feature-powershell.md)

## Next steps
Advance to the following tutorial: 

> [!div class="nextstepaction"]
>[Incrementally copy data from one table in Azure SQL Database to Azure Blob storage](tutorial-incremental-copy-powershell.md)
