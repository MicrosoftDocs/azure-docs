---
title: All topics for SQL Data Warehouse service | Microsoft Docs
description: Table of all topics for the Azure service named SQL Data Warehouse that exist on http://azure.microsoft.com/documentation/articles/, Title and description.
services: sql-data-warehouse
documentationcenter: ''
author: barbkess
manager: jhubbard
editor: ''

ms.assetid: a26a6dec-9c08-4415-8f58-4ee1dd41f718
ms.service: sql-data-warehouse
ms.workload: sql-data-warehouse
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: reference
ms.date: 03/30/2017
ms.author: barbkess

---
# All topics for Azure SQL Data Warehouse service
This topic lists every topic that applies directly to the **SQL Data Warehouse** service of Azure. You can search this webpage for keywords by using **Ctrl+F**, to find the topics of current interest.

## New
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 1 |[SQL Data Warehouse backups](sql-data-warehouse-backups.md) |Learn about SQL Data Warehouse built-in database backups that enable you to restore an Azure SQL Data Warehouse to a restore point or a different geographical region. |

## Updated articles, SQL Data Warehouse
This section lists articles which were updated recently, where the update was big or significant. For each updated article, a rough snippet of the added markdown text is displayed. The articles were updated within the date range of **2016-08-22** to **2016-10-05**.

| &nbsp; | Article | Updated text, snippet | Updated when |
| ---:|:--- |:--- |:--- |
| 2 |[Load data from Azure blob storage into SQL Data Warehouse (PolyBase)](sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md) |/- To track bytes and files SELECT  r.command,  s.request_id,  r.status,  count(distinct input_name) as nbr_files,  sum(s.bytes_processed)/1024/1024 as gb_processed FROM  sys.dm_pdw_exec_requests r  inner join sys.dm_pdw_dms_external_work s  on r.request_id = s.request_id WHERE  r. label  = 'CTAS : Load  cso . DimProduct  '  OR r. label  = 'CTAS : Load  cso . FactOnlineSales  ' GROUP BY  r.command,  s.request_id,  r.status ORDER BY  nbr_files desc,  gb_processed desc; |2016-09-07 |
| 3 |[SQL Data Warehouse restore](sql-data-warehouse-restore-database-overview.md) |** Can I restore a paused data warehouse?** To restore a data warehouse that is paused, you need to first bring it back online. Once the data warehouse is back online, you have seven days of restore points to choose from. ** Restore to a geo-redundant region** If you are using the geo-redundant storage, you can restore the data warehouse to your paired data center in a different geographical region. The data warehouse is restored from the last daily backup. ** Restore timeline** You can restore a database to any restore point within the last seven days. Snapshots start every four to eight hours and are available for seven days. When a snapshot is older than seven days, it expires and its restore point is no longer available. ** Restore costs** The storage charge for the restored data warehouse is billed at the Azure Premium Storage rate. If you pause a restored data warehouse, you are charged for storage at the Azure Premium Storage rate. The advantage of pausing is you are not charge |2016-09-29 |

## Get started
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 4 |[Authentication to Azure SQL Data Warehouse](sql-data-warehouse-authentication.md) |Azure Active Directory (AAD) and SQL Server authentication to Azure SQL Data Warehouse. |
| 5 |[Best practices for Azure SQL Data Warehouse](sql-data-warehouse-best-practices.md) |Recommendations and best practices you should know as you develop solutions for Azure SQL Data Warehouse. These will help you be successful. |
| 6 |[Drivers for Azure SQL Data Warehouse](sql-data-warehouse-connection-strings.md) |Connection strings and drivers for SQL Data Warehouse |
| 7 |[Connect to Azure SQL Data Warehouse](sql-data-warehouse-connect-overview.md) |How to find the server name and connection string for your to Azure SQL Data Warehouse |
| 8 |[Analyze data with Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md) |Use Azure Machine Learning to build a predictive machine learning model based on data stored in Azure SQL Data Warehouse. |
| 9 |[Query Azure SQL Data Warehouse (sqlcmd)](sql-data-warehouse-get-started-connect-sqlcmd.md) |Querying Azure SQL Data Warehouse with the sqlcmd Command-line Utility. |
| 10 |[Create a SQL Data Warehouse database by using Transact-SQL (TSQL)](sql-data-warehouse-get-started-create-database-tsql.md) |Learn how to create an Azure SQL Data Warehouse with TSQL |
| 11 |[How to create a support ticket for SQL Data Warehouse](sql-data-warehouse-get-started-create-support-ticket.md) |How to create a support ticket in Azure SQL Data Warehouse. |
| 12 |[Load Data with Azure Data Factory](sql-data-warehouse-get-started-load-with-azure-data-factory.md) |Learn to load data with Azure Data Factory |
| 13 |[Load data with PolyBase in SQL Data Warehouse](sql-data-warehouse-get-started-load-with-polybase.md) |Learn what PolyBase is and how to use it for data warehousing scenarios. |
| 14 |[Create an Azure SQL Data Warehouse](sql-data-warehouse-get-started-provision.md) |Learn how to create an Azure SQL Data Warehouse in the Azure portal |
| 15 |[Create SQL Data Warehouse using PowerShell](sql-data-warehouse-get-started-provision-powershell.md) |Create SQL Data Warehouse by using PowerShell |
| 16 |[Visualize data with Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md) |Visualize SQL Data Warehouse data with Power BI |
| 17 |[Query Azure SQL Data Warehouse (Visual Studio)](sql-data-warehouse-query-visual-studio.md) |Query SQL Data Warehouse with Visual Studio. |

## Develop
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 18 |[Optimizing transactions for SQL Data Warehouse](sql-data-warehouse-develop-best-practices-transactions.md) |Best Practice guidance on writing efficient transaction updates in Azure SQL Data Warehouse |
| 19 |[Concurrency and workload management in SQL Data Warehouse](sql-data-warehouse-develop-concurrency.md) |Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions. |
| 20 |[Create Table As Select (CTAS) in SQL Data Warehouse](sql-data-warehouse-develop-ctas.md) |Tips for coding with the create table as select (CTAS) statement in Azure SQL Data Warehouse for developing solutions. |
| 21 |[Dynamic SQL in SQL Data Warehouse](sql-data-warehouse-develop-dynamic-sql.md) |Tips for using dynamic SQL in Azure SQL Data Warehouse for developing solutions. |
| 22 |[Group by options in SQL Data Warehouse](sql-data-warehouse-develop-group-by-options.md) |Tips for implementing group by options in Azure SQL Data Warehouse for developing solutions. |
| 23 |[Use labels to instrument queries in SQL Data Warehouse](sql-data-warehouse-develop-label.md) |Tips for using labels to instrument queries in Azure SQL Data Warehouse for developing solutions. |
| 24 |[Loops in SQL Data Warehouse](sql-data-warehouse-develop-loops.md) |Tips for Transact-SQL loops and replacing cursors in Azure SQL Data Warehouse for developing solutions. |
| 25 |[Stored procedures in SQL Data Warehouse](sql-data-warehouse-develop-stored-procedures.md) |Tips for implementing stored procedures in Azure SQL Data Warehouse for developing solutions. |
| 26 |[Transactions in SQL Data Warehouse](sql-data-warehouse-develop-transactions.md) |Tips for implementing transactions in Azure SQL Data Warehouse for developing solutions. |
| 27 |[User-defined schemas in SQL Data Warehouse](sql-data-warehouse-develop-user-defined-schemas.md) |Tips for using Transact-SQL schemas in Azure SQL Data Warehouse for developing solutions. |
| 28 |[Assign variables in SQL Data Warehouse](sql-data-warehouse-develop-variable-assignment.md) |Tips for assigning Transact-SQL variables in Azure SQL Data Warehouse for developing solutions. |
| 29 |[Views in SQL Data Warehouse](sql-data-warehouse-develop-views.md) |Tips for using Transact-SQL views in Azure SQL Data Warehouse for developing solutions. |
| 30 |[Design decisions and coding techniques for SQL Data Warehouse](sql-data-warehouse-overview-develop.md) |Development concepts, design decisions, recommendations and coding techniques for SQL Data Warehouse. |

## Manage
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 31 |[Manage compute power in Azure SQL Data Warehouse (Overview)](sql-data-warehouse-manage-compute-overview.md) |Performance scale out capabilities in Azure SQL Data Warehouse. Scale out by adjusting DWUs or pause and resume compute resources to save costs. |
| 32 |[Manage compute power in Azure SQL Data Warehouse (Azure portal)](sql-data-warehouse-manage-compute-portal.md) |Azure portal tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs. |
| 33 |[Manage compute power in Azure SQL Data Warehouse (PowerShell)](sql-data-warehouse-manage-compute-powershell.md) |PowerShell tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs. |
| 34 |[Manage compute power in Azure SQL Data Warehouse (REST)](sql-data-warehouse-manage-compute-rest-api.md) |PowerShell tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs. |
| 35 |[Manage compute power in Azure SQL Data Warehouse (T-SQL)](sql-data-warehouse-manage-compute-tsql.md) |Transact-SQL (T-SQL) tasks to scale-out performance by adjusting DWUs. Save costs by scaling back during non-peak times. |
| 36 |[Monitor your workload using DMVs](sql-data-warehouse-manage-monitor.md) |Learn how to monitor your workload using DMVs. |
| 37 |[Manage databases in Azure SQL Data Warehouse](sql-data-warehouse-overview-manage.md) |Overview of managing SQL Data Warehouse databases. Includes management tools, DWUs and scale-out performance, troubleshooting query performance, establishing good security policies, and restoring a database from data corruption or from a regional outage. |
| 38 |[Monitor user queries in Azure SQL Data Warehouse](sql-data-warehouse-overview-manage-user-queries.md) |Overview of the considerations, best practices, and tasks for monitoring user queries in Azure SQL Data Warehouse |
| 39 |[SQL Data Warehouse restore](sql-data-warehouse-restore-database-overview.md) |Overview of the database restore options for recovering a database in Azure SQL Data Warehouse. |
| 40 |[Restore an Azure SQL Data Warehouse (Portal)](sql-data-warehouse-restore-database-portal.md) |Azure portal tasks for restoring an Azure SQL Data Warehouse. |
| 41 |[Restore an Azure SQL Data Warehouse (PowerShell)](sql-data-warehouse-restore-database-powershell.md) |PowerShell tasks for restoring an Azure SQL Data Warehouse. |
| 42 |[Restore an Azure SQL Data Warehouse (REST API)](sql-data-warehouse-restore-database-rest-api.md) |REST API tasks for restoring an Azure SQL Data Warehouse. |

## Tables and indexes
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 43 |[Data types for tables in SQL Data Warehouse](sql-data-warehouse-tables-data-types.md) |Getting started with data types for Azure SQL Data Warehouse tables. |
| 44 |[Distributing tables in SQL Data Warehouse](sql-data-warehouse-tables-distribute.md) |Getting started with distributing tables in Azure SQL Data Warehouse. |
| 45 |[Indexing tables in SQL Data Warehouse](sql-data-warehouse-tables-index.md) |Getting started with table indexing in Azure SQL Data Warehouse. |
| 46 |[Overview of tables in SQL Data Warehouse](sql-data-warehouse-tables-overview.md) |Getting started with Azure SQL Data Warehouse Tables. |
| 47 |[Partitioning tables in SQL Data Warehouse](sql-data-warehouse-tables-partition.md) |Getting started with table partitioning in Azure SQL Data Warehouse. |
| 48 |[Managing statistics on tables in SQL Data Warehouse](sql-data-warehouse-tables-statistics.md) |Getting started with statistics on tables in Azure SQL Data Warehouse. |
| 49 |[Temporary tables in SQL Data Warehouse](sql-data-warehouse-tables-temporary.md) |Getting started with temporary tables in Azure SQL Data Warehouse. |

## Integrate
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 50 |[Use Azure Data Factory with SQL Data Warehouse](sql-data-warehouse-integrate-azure-data-factory.md) |Tips for using Azure Data Factory (ADF) with Azure SQL Data Warehouse for developing solutions. |
| 51 |[Use Azure Machine Learning with SQL Data Warehouse](sql-data-warehouse-integrate-azure-machine-learning.md) |Tutorial for using Azure Machine Learning with Azure SQL Data Warehouse for developing solutions. |
| 52 |[Use Azure Stream Analytics with SQL Data Warehouse](sql-data-warehouse-integrate-azure-stream-analytics.md) |Tips for using Azure Stream Analytics with Azure SQL Data Warehouse for developing solutions. |
| 53 |[Use Power BI with SQL Data Warehouse](sql-data-warehouse-integrate-power-bi.md) |Tips for using Power BI with Azure SQL Data Warehouse for developing solutions. |
| 54 |[Leverage other services with SQL Data Warehouse](sql-data-warehouse-overview-integrate.md) |Tools and partners with solutions that integrate with SQL Data Warehouse. |

## Load
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 55 |[Load data from Azure blob storage into Azure SQL Data Warehouse (Azure Data Factory)](sql-data-warehouse-load-from-azure-blob-storage-with-data-factory.md) |Learn to load data with Azure Data Factory |
| 56 |[Load data from Azure blob storage into SQL Data Warehouse (PolyBase)](sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md) |Learn how to use PolyBase to load data from Azure blob storage into SQL Data Warehouse. Load a few tables from public data into the Contoso Retail Data Warehouse schema. |
| 57 |[Load data from SQL Server into Azure SQL Data Warehouse (AZCopy)](sql-data-warehouse-load-from-sql-server-with-azcopy.md) |Uses bcp to export data from SQL Server to flat files, AZCopy to import data to Azure blob storage, and PolyBase to ingest the data into Azure SQL Data Warehouse. |
| 58 |[Load data from SQL Server into Azure SQL Data Warehouse (flat files)](sql-data-warehouse-load-from-sql-server-with-bcp.md) |For a small data size, uses bcp to export data from SQL Server to flat files and import the data directly into Azure SQL Data Warehouse. |
| 59 |[Load data from SQL Server into Azure SQL Data Warehouse (SSIS)](sql-data-warehouse-load-from-sql-server-with-integration-services.md) |Shows you how to create a SQL Server Integration Services (SSIS) package to move data from a wide variety of data sources to SQL Data Warehouse. |
| 60 |[Load data with PolyBase in SQL Data Warehouse](sql-data-warehouse-load-from-sql-server-with-polybase.md) |Uses bcp to export data from SQL Server to flat files, AZCopy to import data to Azure blob storage, and PolyBase to ingest the data into Azure SQL Data Warehouse. |
| 61 |[Guide for using PolyBase in SQL Data Warehouse](sql-data-warehouse-load-polybase-guide.md) |Guidelines and recommendations for using PolyBase in SQL Data Warehouse scenarios. |
| 62 |[Load sample data into SQL Data Warehouse](sql-data-warehouse-load-sample-databases.md) |Load sample data into SQL Data Warehouse |
| 63 |[Load data with bcp](sql-data-warehouse-load-with-bcp.md) |Learn what bcp is and how to use it for data warehousing scenarios. |
| 64 |[Load data into Azure SQL Data Warehouse](sql-data-warehouse-overview-load.md) |Learn the common scenarios for data loading into SQL Data Warehouse. These include using PolyBase, Azure blob storage, flat files, and disk shipping. You can also use third-party tools. |

## Migrate
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 65 |[Migrate your SQL code to SQL Data Warehouse](sql-data-warehouse-migrate-code.md) |Tips for migrating your SQL code to Azure SQL Data Warehouse for developing solutions. |
| 66 |[Migrate Your Data](sql-data-warehouse-migrate-data.md) |Tips for migrating your data to Azure SQL Data Warehouse for developing solutions. |
| 67 |[Data Warehouse Migration Utility (Preview)](sql-data-warehouse-migrate-migration-utility.md) |Migrate to SQL Data Warehouse. |
| 68 |[Migrate your schema to SQL Data Warehouse](sql-data-warehouse-migrate-schema.md) |Tips for migrating your schema to Azure SQL Data Warehouse for developing solutions. |
| 69 |[Migrate your solution to SQL Data Warehouse](sql-data-warehouse-overview-migrate.md) |Migration guidance for bringing your solution to Azure SQL Data Warehouse platform. |

## Partners
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 70 |[SQL Data Warehouse business intelligence partners](sql-data-warehouse-partner-business-intelligence.md) |Lists of third-party business intelligence partners with solutions that support SQL Data Warehouse. |
| 71 |[SQL Data Warehouse data integration partners](sql-data-warehouse-partner-data-integration.md) |Lists of third-party partners with data integration solutions that support Azure SQL Data Warehouse. |
| 72 |[SQL Data Warehouse data management partners](sql-data-warehouse-partner-data-management.md) |Lists of third-party data management partners with solutions that support SQL Data Warehouse. |

## Reference
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 73 |[Reference topics for SQL Data Warehouse](sql-data-warehouse-overview-reference.md) |Reference content links for SQL Data Warehouse. |
| 74 |[PowerShell cmdlets and REST APIs for SQL Data Warehouse](sql-data-warehouse-reference-powershell-cmdlets.md) |Find the top PowerShell cmdlets for Azure SQL Data Warehouse including how to pause and resume a database. |
| 75 |[Language elements](sql-data-warehouse-reference-tsql-language-elements.md) |List of links to reference content for the Transact-SQL language elements used for SQL Data Warehouse. |
| 76 |[Transact-SQL topics](sql-data-warehouse-reference-tsql-statements.md) |Links to reference content for the Transact-SQL topics used by SQL Data Warehouse. |
| 77 |[System views](sql-data-warehouse-reference-tsql-system-views.md) |Links to system views content for SQL Data Warehouse. |

## Security
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 78 |[SQL Data Warehouse -  Downlevel clients support for auditing and Dynamic Data Masking](sql-data-warehouse-auditing-downlevel-clients.md) |Learn about SQL Data Warehouse downlevel clients support for data auditing |
| 79 |[Auditing in Azure SQL Data Warehouse](sql-data-warehouse-auditing-overview.md) |Get started with auditing in Azure SQL Data Warehouse |
| 80 |[Get started with Transparent Data Encryption (TDE) in SQL Data Warehouse](sql-data-warehouse-encryption-tde.md) |Transparent Data Encryption (TDE) in SQL Data Warehouse |
| 81 |[Get started with Transparent Data Encryption (TDE)](sql-data-warehouse-encryption-tde-tsql.md) |Transparent Data Encryption (TDE) in SQL Data Warehouse (T-SQL) |
| 82 |[Secure a database in SQL Data Warehouse](sql-data-warehouse-overview-manage-security.md) |Tips for securing a database in Azure SQL Data Warehouse for developing solutions. |

## Miscellaneous
| &nbsp; | Title | Description |
| ---:|:--- |:--- |
| 83 |[Install Visual Studio and SSDT for SQL Data Warehouse](sql-data-warehouse-install-visual-studio.md) |Install Visual Studio and SQL Server Development Tools (SSDT) for Azure SQL Data Warehouse |
| 84 |[Migration to Premium Storage Details](sql-data-warehouse-migrate-to-premium-storage.md) |Instructions for migrating an existing SQL Data Warehouse to premium storage |
| 85 |[Get started with threat detection](sql-data-warehouse-security-threat-detection.md) |How to get started with Threat Detection |
| 86 |[SQL Data Warehouse capacity limits](sql-data-warehouse-service-capacity-limits.md) |Maximum values for connections, databases, tables and queries for SQL Data Warehouse. |
| 87 |[Troubleshooting Azure SQL Data Warehouse](sql-data-warehouse-troubleshoot.md) |Troubleshooting Azure SQL Data Warehouse. |

