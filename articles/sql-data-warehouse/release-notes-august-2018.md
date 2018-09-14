---
title: Azure SQL Data Warehouse Release Notes August 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 08/13/2018
ms.author: twounder
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? August 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in August 2018.

## Automatic Intelligent Insights
Microsoft has introduced [Automatic intelligent insights](https://azure.microsoft.com/blog/automatic-intelligent-insights-to-optimize-performance-with-sql-data-warehouse/) to deliver on the cloud promise of automation for your data warehouse. You will no longer need to monitor your data warehouse for data skew and suboptimal table statistics. At no additional cost, SQL Data Warehouse surfaces intelligent insights for all Gen2 instances. By integrating with [Azure Advisor](https://docs.microsoft.com/azure/advisor/advisor-performance-recommendations), you can automatically receive best practice recommendations to improve the performance of your active workloads. SQL Data Warehouse analyzes your workload and surfaces recommendations based on your usage. This analysis happens daily allowing you to monitor the usage reports and recommendations for improvements to your workload.

You can view the recommendations in the Azure Advisor portal:
![Azure Advisor Portal Recommendations for Azure SQL Data Warehouse](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/4e205b6d-df04-48db-8eec-d591f2592cf4.png)

You can drill into each category to see the recommendations for the specific alert:
![Azure Advisor Portal Recommendation Details for Azure SQL Data Warehouse](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/3c42426e-6969-46e3-9025-c34c0755a302.png)


## Bug fixes

| Title | Description |
|:---|:---|
| **Potential Query failures when the split count exceeds max limit** |When the 1 million upper bound file-split limit is exceeded an unhandled exception caused the SQL Engine to dump, and all queries failed. This fix addresse the issue by handling the exception correctly and returning an error without causing queries to fail. |
| **Increased ExternalMoveReadersPerNode default value to improve load perfomance** |This issue was caused by the ExternalMoveReadersPerNode property setting being out of sync with the service fabric setting. This regression caused a degraded Gen2 load performance. The fix brings Gen2 load performance back within optimized design parameters.|


## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you encounter new terminology. Or look at some of these other SQL Data Warehouse Resources.  

* [Customer success stories]
* [Blogs]
* [Feature requests]
* [Videos]
* [Customer Advisory Team blogs]
* [Stack Overflow forum]
* [Twitter]


[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Customer success stories]: https://azure.microsoft.com/case-studies/?service=sql-data-warehouse
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[create a SQL Data Warehouse]: ./create-data-warehouse-portal.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md