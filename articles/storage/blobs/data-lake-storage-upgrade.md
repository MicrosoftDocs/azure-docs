---
title: Upgrade your big data analytics solutions from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2
description: Upgrade your solution to use Azure Data Lake Storage Gen2
services: storage
author: normesta
ms.topic: conceptual
ms.author: normesta
ms.date: 02/07/2019
ms.service: storage
ms.subservice: data-lake-storage-gen2
---

# Upgrade your big data analytics solutions from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2

If you're using Azure Data Lake Storage Gen1 in your big data analytics solutions, this guide helps you to upgrade those solutions to use Azure Data Lake Storage Gen2. You can use this document to assess the dependencies that your solution has on Data Lake Storage Gen1. This guide also shows you how to plan and perform the upgrade.

We'll help you through the following tasks:

:heavy_check_mark: Assess your upgrade readiness

:heavy_check_mark: Plan for an upgrade

:heavy_check_mark: Perform the upgrade

## Assess your upgrade readiness

Our goal is that all the capabilities that are present in Data Lake Storage Gen1 will be made available in Data Lake Storage Gen2. How those capabilities are exposed e.g. in SDK, CLI etc., might differ between Data Lake Storage Gen1 and Data Lake Storage Gen2. Applications and services that work with Data Lake Storage Gen1 need to be able to work similarly with Data Lake Storage Gen2. Finally, some of the capabilities won't be available in Data Lake Storage Gen2
right away. As they become available, we'll announce them in this document.

These next sections will help you decide how best to upgrade to Data Lake Storage Gen2, and when it might make most sense to do so.

### Data Lake Storage Gen1 solution components

Most likely, when you use Data Lake Storage Gen1 in your analytics solutions or pipelines, there are many additional technologies that you employ to achieve the overall end-to-end functionality. This [article](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-data-scenarios) describes various components of the data flow that include ingesting,
processing, and consuming data.

In addition, there are cross-cutting components to provision, manage and monitor these components. Each of the components operate with Data Lake Storage Gen1 by using an interface best suited to them. When you're planning to upgrade your solution to Data Lake Storage Gen2, you'll need to be aware of the interfaces that are used. You'll need to upgrade both the management interfaces as well as data interfaces since each interface has distinct requirements.

![Data Lake Storage Solution Components](./media/data-lake-storage-upgrade/solution-components.png)

**Figure 1** above shows the functionality components that you would see in most analytics solutions.

**Figure 2** shows an example of how those components will be implemented by using specific technologies.

The Storing functionality in **Figure1** is provided by Data Lake Storage Gen1 (**Figure 2**). Note how the various components in the data flow interact with Data Lake Storage Gen1 by using REST APIs or Java SDK. Also note how the cross-cutting functionality components interact with Data Lake Storage Gen1. The Provisioning component uses Azure Resource templates, whereas the Monitoring component which uses Azure Monitor logs utilizes operational data that comes from Data Lake Storage Gen1.

To upgrade a solution from using Data Lake Storage Gen1 to Data Lake Storage Gen2, you'll need to copy the data and meta-data, re-hook the data-flows, and then, all of the components will need to be able to work with Data Lake Storage Gen2.

The sections below provide information to help you make better decisions:

:heavy_check_mark: Platform capabilities

:heavy_check_mark: Programming interfaces

:heavy_check_mark: Azure ecosystem

:heavy_check_mark: Partner ecosystem

:heavy_check_mark: Operational information

In each section, you'll be able to determine the “must-haves” for your upgrade. After you are assured that the capabilities are available, or you are assured that there are reasonable workarounds in place, proceed to the [Planning for an upgrade](#planning-for-an-upgrade) section of this guide.

### Platform capabilities

This section describes which Data Lake Storage Gen1 platform capabilities that are currently available in Data Lake Storage Gen2.

| | Data Lake Storage Gen1 | Data Lake Storage Gen2 - goal | Data Lake Storage Gen2 - availability status  |
|-|------------------------|-------------------------------|-----------------------------------------------|
| Data organization| Supports data stored as folders and files | Supports data stored as objects/blobs as well as folders and files - [Link](https://docs.microsoft.com/azure/storage/data-lake-storage/namespace) | Supports data stored as folders and file – *Available now* <br><br> Supports data stored as objects/blobs - *Not yet available* |
| Namespace| Hierarchical | Hierarchical |  *Available now*  |
| API  | REST API over HTTPS | REST API over HTTP/HTTPS| *Available now* |
| Server-side API| [WebHDFS-compatible REST API](https://msdn.microsoft.com/library/azure/mt693424.aspx) | Azure Blob Service REST API [Data Lake Storage Gen2 REST API](https://docs.microsoft.com/rest/api/storageservices/data-lake-storage-gen2) | Data Lake Storage Gen2 REST API – *Available now* <br><br> Azure Blob Service REST API – *Not yet available*       |
| Hadoop File System Client | Yes ([Azure Data Lake Storage](https://hadoop.apache.org/docs/current/hadoop-azure-datalake/index.html)) | Yes ([ABFS](https://jira.apache.org/jira/browse/HADOOP-15407))  | *Available now*  |  
| Data Operations – Authorization  | File and folder level POSIX Access Control Lists (ACLs) based on Azure Active Directory Identities  | File and folder level POSIX Access Control Lists (ACLs) based on Azure Active Directory Identities [Share Key](https://docs.microsoft.com/rest/api/storageservices/authorize-with-shared-key) for account level authorization Role Based Access Control ([RBAC](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac)) to access containers | *Available now* |
| Data Operations – Logs  | Yes | One-off requests for logs for specific duration using support ticket Azure Monitoring integration | One-off requests for logs for specific duration using support ticket – *Available now*<br><br> Azure Monitoring integration – *Not yet available* |
| Encryption data at rest | Transparent, Server side with service-managed keys and with customer-managed keys in Azure KeyVault | Transparent, Server side with service-managed keys and with customer keys managed keys in Azure KeyVault | Service-managed keys – *Available now*<br><br> Customer-managed keys – *Available now*  |
| Management operations (e.g. Account Create) | [Role-based access control](https://docs.microsoft.com/azure/role-based-access-control/overview) (RBAC) provided by Azure for account management | [Role-based access control](https://docs.microsoft.com/azure/role-based-access-control/overview) (RBAC) provided by Azure for account management | *Available now*|
| Developer SDKs | .NET, Java, Python, Node.js  | .NET, Java, Python, Node.js, C++, Ruby, PHP, Go, Android, iOS| *Not yet available* |
| |Optimized performance for parallel analytics workloads. High Throughput and IOPS. | Optimized performance for parallel analytics workloads. High Throughput and IOPS. | *Available now* |
| Virtual Network (VNet) support  | [Using Virtual Network integration](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-network-security)  | [Using Service Endpoint for Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-network-security?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | *Available now* |
| Size limits | No limits on account sizes, file sizes or number of files | No limits on account sizes or number of files. File size limited to 5TB. | *Available now*|
| Geo-redundancy| Locally-redundant (LRS) | Locally redundant (LRS) Zone redundant (ZRS) Globally redundant (GRS) Read-access globally redundant (RA-GRS) See [here](https://docs.microsoft.com/azure/storage/common/storage-redundancy) for more information| *Available now* |
| Regional availability | See [here](https://azure.microsoft.com/regions/) | All [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/)                                                                                                                                                                                                                                                                                                                                       | *Available now*                                                                                                                           |
| Price                                       | See [Pricing](https://azure.microsoft.com/pricing/details/data-lake-store/)                                                                            | See [Pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/)                                                                                                                                                                                                                                                                                                                                         |                                                                                                                                           |
| Availability SLA                            | [See SLA](https://azure.microsoft.com/support/legal/sla/data-lake-store/v1_0/)                                                                   | [See SLA](https://azure.microsoft.com/support/legal/sla/storage/v1_3/)                                                                                                                                                                                                                                                                                                                                                | *Available now*                                                                                                                           |
| Data Management                             | File Expiration                                                                                                                                        | Lifecycle policies                                                                                                                                                                                                                                                                                                                                                                                                          | *Not yet available*                                                                                                                       |

### Programming interfaces

This table describes which API sets that are available for your custom applications. To make things a bit clearer, we've separated these API sets into 2 types: management APIs and file system APIs.

Management APIs help you to manage accounts, while file system APIs help you to operate on the files and folders.

|  API set                           |  Data Lake Storage Gen1                                                                                                                                                                                                                                                                                                   | Availability for Data Lake Storage Gen2 - with Shared Key auth | Availability for Data Lake Storage Gen2 - with OAuth auth                                                                                                  |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| .NET SDK - management                  | [Link](https://docs.microsoft.com/dotnet/api/overview/azure/datalakestore/management?view=azure-dotnet)                                                                                                                                                                                                                 | *Not supported*                                                      | *Available now -* [Link](https://docs.microsoft.com/rest/api/storageservices/operations-on-the-account--blob-service-)                                    |
| .NET SDK – file system                  | [Link](https://docs.microsoft.com/dotnet/api/overview/azure/datalakestore/client?view=azure-dotnet)                                                                                                                                                                                                                     | *Not yet available*                                                | *Not yet available*                                                                                                                                             |
| Java SDK - management                  | [Link](https://docs.microsoft.com/java/api/overview/azure/datalakestore/management)                                                                                                                                                                                                                                     | *Not supported*                                                      | *Available now –* [Link](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-stable)                                     |
| Java SDK – file system                  | [Link](https://docs.microsoft.com/java/api/overview/azure/datalake)                                                                                                                                                                                                                                         | *Not yet available*                                                | *Not yet available*                                                                                                                                             |
| Node.js - management                   | [Link](https://www.npmjs.com/package/azure-arm-datalake-store)                                                                                                                                                                                                                                                                | Not supported                                                      | *Available now -* [Link](https://azure.github.io/azure-storage-node/)                                                                                            |
| Node.js - file system                   | [Link](https://www.npmjs.com/package/azure-arm-datalake-store)                                                                                                                                                                                                                                                                | *Not yet available*                                                | *Not yet available*                                                                                                                                             |
| Python - management                    | [Link](https://docs.microsoft.com/python/api/overview/azure/datalakestore/management?view=azure-python)                                                                                                                                                                                                                 | *Not supported*                                                      | *Available now -* [Link](https://docs.microsoft.com/python/api/overview/azure/storage/management?view=azure-python)                                       |
| Python - file system                    | [Link](https://azure-datalake-store.readthedocs.io/en/latest/)                                                                                                                                                                                                                                                                 | *Not yet available*                                                | *Not yet available*                                                                                                                                             |
| REST API - management                  | [Link](https://docs.microsoft.com/rest/api/datalakestore/accounts)                                                                                                                                                                                                                                                      | *Not supported*                                                      | *Available now -*                                                                                                                                               |
| REST API - file system                  | [Link](https://docs.microsoft.com/rest/api/datalakestore/webhdfs-filesystem-apis)                                                                                                                                                                                                                                       | *Available now*                                                    | *Available now -* [Link](https://docs.microsoft.com/rest/api/storageservices/data-lake-storage-gen2)                                                      |
| PowerShell - management and file system | [Link](https://docs.microsoft.com/powershell/module/az.datalakestore)                                                                                                                                                                                                                        | Management – Not supported File system - *Not yet available*        | Management – *Available now -* [Link](https://docs.microsoft.com/powershell/module/az.storage) <br><br>File system - *Not yet available* |
| CLI – management                       | [Link](https://docs.microsoft.com/cli/azure/dls/account?view=azure-cli-latest)                                                                                                                                                                                                                                          | *Not supported*                                                      | *Available now -* [Link](https://docs.microsoft.com/cli/azure/storage?view=azure-cli-latest)                                                              |
| CLI - file system                       | [Link](https://docs.microsoft.com/cli/azure/dls/fs?view=azure-cli-latest)                                                                                                                                                                                                                                               | *Not yet available*                                                | *Not yet available*                                                                                                                                             |
| Azure Resource Manager templates - management             | [Template1](https://azure.microsoft.com/resources/templates/101-data-lake-store-no-encryption/)  [Template2](https://azure.microsoft.com/resources/templates/101-data-lake-store-encryption-adls/)  [Template3](https://azure.microsoft.com/resources/templates/101-data-lake-store-encryption-key-vault/)  | *Not supported*                                                      | *Available now -* [Link](https://docs.microsoft.com/azure/templates/microsoft.storage/2018-07-01/storageaccounts)                                         |

### Azure ecosystem

When using Data Lake Storage Gen1, you can use a variety of Microsoft services and products in your end-to-end pipelines. These services and products work with Data Lake Storage Gen1 either directly or indirectly. This table shows a list of the services that we've modified to work with Data Lake Storage Gen1, and shows
which ones are currently compatible with Data Lake Storage Gen2.

| **Area**             | **Availability for Data Lake Storage Gen1**                                                                                                                                    | **Availability for Data Lake Storage Gen2 – with Shared Key auth**                                                                                                           | **Availability for Data Lake Storage Gen2 – with OAuth**                                                                                        |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| Analytics framework  | [Apache Hadoop](https://hadoop.apache.org/docs/current/hadoop-azure-datalake/index.html)                                                                                       | *Available now*                                                                                                                                                              | *Available now*                                                                                                                                 |
|                      | [HDInsight](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-hdinsight-hadoop-use-portal)                                                               | [HDInsight](https://docs.microsoft.com/azure/storage/data-lake-storage/quickstart-create-connect-hdi-cluster) 3.6 - *Available now* HDInsight 4.0 - *Not yet available*      | HDInsight 3.6 ESP – *Available now* <br><br>  HDInsight 4.0 ESP - *Not yet available*                                                                 |
|                      | Databricks Runtime 3.1 and above                                                                                                                                               | [Databricks Runtime 5.1 and above](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-datalake-gen2.html#azure-data-lake-storage-gen2) *- Available now* | [Databricks Runtime 5.1 and above](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-datalake-gen2.html#azure-data-lake-storage-gen2) – *Available now*                                                                                              |
|                      | [SQL Data Warehouse](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-load-from-azure-data-lake-store)                                            | *Not supported*                                                                                                                                                              | *Available now* [Link](https://docs.microsoft.com/sql/t-sql/statements/create-external-data-source-transact-sql?view=sql-server-2017) |
| Data integration     | [Data Factory](https://docs.microsoft.com/azure/data-factory/load-azure-data-lake-store)                                                                                | [Version 2](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage) – *Available now* Version 1 – *Not supported*                               | [Version 2](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage) – *Available now* <br><br> Version 1 – *Not supported*  |
|                      | [AdlCopy](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob)                                                                 | *Not supported*                                                                                                                                                              | *Not supported*                                                                                                                                 |
|                      | [SQL Server Integration Services](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-data-lake-store-connection-manager?view=sql-server-2017) | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
|                      | [Data Catalog](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-with-data-catalog)                                                                       | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
|                      | [Logic Apps](https://docs.microsoft.com/connectors/azuredatalake/)                                                                                                      | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
| IoT                  | [Event Hubs – Capture](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-archive-eventhub-capture)                                                       | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
|                      | [Stream Analytics](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-stream-analytics)                                                                   | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
| Consumption          | [Power BI Desktop](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-power-bi)                                                                           | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
|                      | [Excel](https://techcommunity.microsoft.com/t5/Excel-Blog/Announcing-the-Azure-Data-Lake-Store-Connector-in-Excel/ba-p/91677)                                                 | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
|                      | [Analysis Services](https://blogs.msdn.microsoft.com/analysisservices/2017/09/05/using-azure-analysis-services-on-top-of-azure-data-lake-storage/)                            | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
| Productivity         | [Azure portal](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal)                                                                      | *Not supported*                                                                                                                                                              | Account management *– Available now* <br><br>Data operations *–*  *Not yet available*                                                                   |
|                      | [Data Lake Tools for Visual Studio](https://docs.microsoft.com/azure/data-lake-analytics/data-lake-analytics-data-lake-tools-install)                                   | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |
|                      | [Azure Storage Explorer](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-in-storage-explorer)                                                          | *Available now*                                                                                                                                                              | *Available now*                                                                                                                                 |
|                      | [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=usqlextpublisher.usql-vscode-ext)                                                                     | *Not yet available*                                                                                                                                                          | *Not yet available*                                                                                                                             |

### Partner ecosystem

This table shows a list of the third-party services and products that were modified to work with Data Lake Storage Gen1. It also shows which ones are currently compatible with Data Lake Storage Gen2.

| Area            | Partner  | Product/Service  | Availability for Data Lake Storage Gen1                                                                                                                                               | Availability for Data Lake Storage Gen2 – with Shared Key auth                                                   | Availability for Data Lake Storage Gen2 – with Oauth                                                             |
|---------------------|--------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Analytics framework | Cloudera     | CDH                  | [Link](https://www.cloudera.com/documentation/enterprise/5-11-x/topics/admin_adls_config.html)                                                                                            | *Not yet available*                                                                                                  | [Link](https://www.cloudera.com/documentation/enterprise/latest/topics/admin_adls2_config.html)                                                                                                  |
|                     | Cloudera     | Altus                | [Link](https://www.cloudera.com/more/news-and-blogs/press-releases/2017-09-27-cloudera-introduces-altus-data-engineering-microsoft-azure-hybrid-multi-cloud-data-analytic-workflows.html) | *Not supported*                                                                                                                  | *Not yet available*                                                                                                  |
|                     | HortonWorks  | HDP 3.0              | [Link](https://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.6.3/bk_cloud-data-access/content/adls-get-started.html)                                                                       | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
|                     | Qubole       |                      | [Link](https://www.qubole.com/blog/big-data-analytics-microsoft-azure-data-lake-store-qubole/)                                                                                            | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
| ETL                 | StreamSets   |                      | [Link](https://streamsets.com/blog/ingest-data-azure)                                                                                                                                     | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
|                     | Informatica  |                      | [Link](https://kb.informatica.com/proddocs/Product%20Documentation/6/IC_Spring2017_MicrosoftAzureDataLakeStoreV2ConnectorGuide_en.pdf)                                                    | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
|                     | Attunity     |                      | [Link](https://www.attunity.com/company/press-releases/microsoft-and-attunity-announce-strategic-partnership-for-data-migration/)                                                         | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
|                     | Alteryx      |                      | [Link](https://help.alteryx.com/2018.2/DataSources/AzureDataLake.htm)                                                                                                                     | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
|                     | ImanisData   |                      | [Link](https://www.imanisdata.com/expansion-azure-support-azure-data-lake-store-integration/)                                                                                             | *Not yet available*                                                                                                  | *Not yet available*                                                                                                  |
|                     | WANdisco     |                      | [Link](https://azure.microsoft.com/blog/globally-replicated-data-lakes-with-livedata-using-wandisco-on-azure/)                                                                      | [Link](https://azure.microsoft.com/blog/globally-replicated-data-lakes-with-livedata-using-wandisco-on-azure/) | [Link](https://azure.microsoft.com/blog/globally-replicated-data-lakes-with-livedata-using-wandisco-on-azure/) |

### Operational information

Data Lake Storage Gen1 pushes specific information and data to other services which helps you to operationalize your pipelines. This table shows availability of corresponding support in Data Lake Storage Gen2.

| Type of data                                                                                       | Availability for Data Lake Storage Gen1                                                                 | Availability for Data Lake Storage Gen2                                                                                               |
|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Billing data - meters that are sent to commerce team for billing and then made available to customers  | *Available now*                                                                                             | *Available now*                                                                                                                           |
| Activity logs                                                                                          | [Link](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-diagnostic-logs#audit-logs)   | One-off requests for logs for specific duration using support ticket – *Available now* Azure Monitoring integration - *Not yet available* |
| Diagnostic logs                                                                                        | [Link](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-diagnostic-logs#request-logs) | One-off requests for logs for specific duration using support ticket – *Available now* Azure Monitoring integration - *Not yet available* |
| Metrics                                                                                                | *Not supported*                                                                                               | *Available now -* [Link](https://docs.microsoft.com/azure/storage/common/storage-metrics-in-azure-monitor)                          |

## Planning for an upgrade

This section assumes that you've reviewed the [Assess your upgrade readiness](#assess-your-upgrade-readiness) section of this guide, and that all of your dependencies are met. If there are capabilities that are still not available in Data Lake Storage Gen2, please proceed only if you know the corresponding workarounds. The following sections provide guidance on how you can plan for upgrade of your pipelines. Performing the actual upgrade will be described in the [Performing the upgrade](#performing-the-upgrade) section of this guide.

### Upgrade strategy

The most critical part of the upgrade is deciding the strategy. This decision will determine the choices available to you.

This table lists some well-known strategies that have been used to migrate databases, Hadoop clusters, etc. We'll adopt similar strategies in our guidance, and adapt them to our context.

| Strategy                   | Pros                                                                                  | Cons                                                           | When to use?                                                                                                                                                                                             |
|--------------------------------|-------------------------------------------------------------------------------------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Lift-and-shift                 | Simplest.                                                                                 | Requires downtime for copying over data, moving jobs, and moving ingress and egress                                             | For simpler solutions, where there are not multiple solutions accessing the same Gen1 account and hence can be moved together in a quick controlled fashion.                                                  |
| Copy-once-and-copy incremental | Reduce downtime by performing copy in the background while source system is still active. | Requires downtime for moving ingress and egress.                   | Amount of data to be copied over is large and the downtime associated with life-and-shift is not acceptable. Testing may be required with significant production data on the target system before transition. |
| Parallel adoption              | Least downtime Allows time for applications to migrate at their own discretion.           | Most elaborate since 2-way sync is needed between the two systems. | For complex scenarios where applications built on Data Lake Storage Gen1 cannot be cutover all at once and must be moved over in an incremental fashion.                                                      |

Below are more details on steps involved for each of the strategies. The steps list what you would do with the components involved in the upgrade. This includes the overall source system, overall target system, ingress sources for source system, egress destinations for source system, and jobs running on source system.

These steps are not meant to be prescriptive. They are meant to set the framework about how we are thinking about each strategy. We'll provide case studies for each strategy as we see them being implemented.

#### Lift-and-shift

1. Pause the source system – ingress sources, jobs, egress destinations.
2. Copy all the data from the source system to the target system.
3. Point all the ingress sources, to the target system. Point to the egress destination from the target system.
4. Move, modify, run all the jobs to the target system.
5. Turn off the source system.

#### Copy-once and copy-incremental

1. Copy over the data from the source system to the target system.
2. Copy over the incremental data from the source system to the target system at regular intervals.
3. Point to the egress destination from the target system.
4. Move, modify, run all jobs on the target system.
5. Point ingress sources incrementally to the target system as per your convenience.
6. Once all ingress sources are pointing to the target system.
    1. Turn off incremental copying.
    2. Turn off the source system.

#### Parallel adoption

1. Set up target system.
2. Set up a two-way replication between source system and target system.
3. Point ingress sources incrementally to the target system.
4. Move, modify, run jobs incrementally to the target system.
5. Point to egress destinations incrementally from the target system.
6. After all the original ingress sources, jobs and egress destination are working with the target system, turn off the source system.

### Data upgrade

The overall strategy that you use to perform your upgrade (described in the [Upgrade strategy](#upgrade-strategy) section of this guide), will determine the tools that you can use for your data upgrade. The tools listed below are based on current information and are suggestions. 

#### Tools guidance

| Strategy                       | Tools                                                                                                             | Pros                                                                                                                             | Considerations                                                                                                                                                                                                                                                                                                                |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Lift-and-shift**                 | [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/load-azure-data-lake-storage-gen2-from-gen1) | Managed cloud service                                                                                                                | Both data and ACLs can be copied over currently.                                                                                                                                                                                                                                                                      |
|                                    | [Distcp](https://hadoop.apache.org/docs/r1.2.1/distcp.html)                                                           | Well-known Hadoop-provided tool Permissions i.e. ACLs can be copied with this tool                                                   | Requires a cluster which can connect to both Data Lake Storage Gen1 and Gen2 at the same time.                                                                                                                                                                                   |
| **Copy-once-and-copy incremental** | Azure Data Factory                                                                                                    | Managed cloud service                                                                                                                | Both data and ACLs can be copied over currently. To support incremental copying in ADF, data needs to be organized in a time-series fashion. Shortest interval between incremental copies is [15 minutes](https://docs.microsoft.com/azure/data-factory/how-to-create-tumbling-window-trigger). |
| **Parallel adoption**              | [WANdisco](https://docs.wandisco.com/bigdata/wdfusion/adls/)                                                           | Support consistent replication If using a pure Hadoop environment connected to Azure Data Lake Storage, supports two-way replication | If not using a pure-Hadoop environment, there may be a delay in the replication.                                                                                                                                                                                                                                                  |

Note that there are third-parties that can handle the Data Lake Storage Gen1 to Data Lake Storage Gen2 upgrade without involving the above data/meta-data copying tools (For example:
[Cloudera](https://blog.cloudera.com/blog/2017/08/use-amazon-s3-with-cloudera-bdr/)). They provide a “one-stop shop” experience that performs data migration as well as workload migration. You may have to perform an out-of-band upgrade for any tools that are outside their ecosystem.

#### Considerations

* You'll need to manually create the Data Lake Storage Gen2 account first, before you start any part of the upgrade, since the current guidance does not include any automatic Gen2 account process based on your Gen1 account information. Ensure that you compare the accounts creation processes for [Gen1](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal) and [Gen2](https://docs.microsoft.com/azure/storage/data-lake-storage/quickstart-create-account).

* Data Lake Storage Gen2, only supports files up to 5 TB in size. To upgrade to Data Lake Storage Gen2, you might need to resize the files in Data Lake Storage Gen1 so that they are smaller than 5 TB in size.

* If you use a tool that doesn't copy ACLs or you don't want to copy over the ACLs, then you'll need to set the ACLs on the destination manually at the appropriate top level. You can do that by using Storage Explorer. Ensure that those ACLs are the default ACLs so that the files and folders that you copy over inherit them.

* In Data Lake Storage Gen1, the highest level you can set ACLs is at root of the account. In Data Lake Storage Gen2, however, the highest level you can set ACLs is at the root folder in a file system, not the whole account. So, if you want to set default ACLs at account level, you'll need to duplicate those across all the file systems in your Data Lake Storage Gen2 account.

* File naming restrictions are different between the two storage systems. These differences are especially concerning when copying from Data Lake Storage Gen2 to Data Lake Storage Gen1 since the latter has more constrained restrictions.

### Application upgrade

When you need to build applications on Data Lake Storage Gen1 or Data Lake Storage Gen2, you'll have to first choose an appropriate programming interface. When calling an API on that interface you'll have to provide the appropriate URI and the appropriate credentials. The representation of these three elements, the API, URI, and how the credentials are provided, are different between Data Lake Storage Gen1 and Data Lake Storage Gen2.So, as part of the application upgrade, you'll need to map these three constructs appropriately.

#### URI changes

The main task here is to translate URI's that have a prefix of `adl://` into URI's that have an `abfss://` prefix.

The URI scheme for Data Lake Storage Gen1 is mentioned [here](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-store) in detail, but broadly speaking, it is
*adl://mydatalakestore.azuredatalakestore.net/\<file_path\>.*

The URI scheme for accessing Data Lake Storage Gen2 files is explained [here](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md) in detail, but broadly speaking, it is `abfss://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.widows.net/<PATH>`.

You'll need to go through your existing applications and ensure that you've changed the URIs appropriately to point to Data Lake Storage Gen2 ones. Also, you'll need to add the appropriate credentials. Finally, how you retire the original applications and replace with the new application will have to be aligned closely to your overall upgrade strategy.

#### Custom applications

Depending on interface your application uses with Data Lake Storage Gen1, you'll need to modify it to adapt it to Data Lake Storage Gen2.

##### REST APIs

If your application uses Data Lake Storage REST APIs, you'll need to modify your application to use the Data Lake Storage Gen2 REST APIs. Links are provided in *Programming interfaces* section.

##### SDKs

As called out in the *Assess your upgrade readiness* section, SDKs aren't currently available. If you want port over your applications to Data Lake Storage Gen2, we will recommend that you wait for supported SDKs to be available.

##### PowerShell

As called out in the Assess your upgrade readiness section, PowerShell support is not currently available for the data plane.

You could replace management plane commandlets with the appropriate ones in Data Lake Storage Gen2. Links are provided in *Programming interfaces* section.

##### CLI

As called out in *Assess your upgrade readiness* section, CLI support is not currently available for the data plane.

You could replace management plane commands with the appropriate ones in Data Lake Storage Gen2. Links are provided in *Programming interfaces* section.

### Analytics frameworks upgrade

If your application creates meta-data about information in the store such as explicit file and folder paths, you'll need to perform additional actions after the store data/meta-data upgrade. This is especially true of analytics frameworks such as Azure HDInsight, Databricks etc., which usually create catalog data on the store data.

Analytics frameworks work with data and meta-data stored in the remote stores like Data Lake Storage Gen1 and Gen2. So, in theory, the engines can be ephemeral, and be brought up only when jobs need to run against the stored data.

However, to optimize performance, the analytics frameworks might create explicit references to the files and folders stored in the remote store, and then create a cache to hold them. Should the URI of the remote data change, for example, a cluster that was storing data in Data Lake Storage Gen1 earlier, and now wanting to store in Data Lake Storage Gen2, the URI for same copied content will be different. So, after the data and meta-data upgrade the caches for these engines also need to be updated or re-initialized

As part of the planning process, you'll need to identify your application and figure out how meta-data information can be re-initialized to point to data that is now stored in Data Lake Storage Gen2. Below is guidance for commonly adopted analytics frameworks to help you with their upgrade steps.

#### Azure Databricks

Depending on the upgrade strategy you choose, the steps will differ. The current section assumes that you've chosen the “Life-and-shift” strategy. Also, the existing Databricks workspace that used to access data in a Data Lake Storage Gen1 account is expected to work with the data that is copied over to Data Lake Storage Gen2 account.

First, make sure that you've created the Gen2 account, and then copied over data and meta from Gen1 to Gen2 by using an appropriate tool. Those tools are called out in [Data upgrade](#data-upgrade) section of this guide.

Then, [upgrade](https://docs.azuredatabricks.net/user-guide/clusters/index.html) your existing Databricks cluster to start using Databricks runtime 5.1 or higher, which should support Data Lake Storage Gen2.

The steps thereafter are based on how the existing Databricks workspace accesses data in the Data Lake Storage Gen1 account. It can be done either by calling adl:// URIs [directly](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-datalake.html#access-azure-data-lake-store-directly) from notebooks, or through [mountpoints](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-datalake.html#mount-azure-data-lake-store-with-dbfs).

If you are accessing directly from notebooks by providing the full adl:// URIs, you'll need to go through each notebook and change the configuration to access the corresponding Data Lake Storage Gen2 URI.

Going forward, you'll need to reconfigure it to point to Data Lake Storage Gen2 account. No more changes are needed, and the notebooks should be able to work as before.

If you are using any of the other upgrade strategies, you can create a variation of the above steps to meet your requirements.

### Azure ecosystem upgrade

Each of the tools and services called out in [Azure ecosystem](#azure-ecosystem) section of this guide will have to be configured to work with Data Lake Storage Gen2.

First, ensure that there is integration available with Data Lake Storage Gen2.

Then, the elements called out above (For example: URI and credentials), will have to be changed. You could modify the existing instance that works with Data Lake Storage Gen1 or you could create a new instance that would work with Data Lake Storage Gen2.

### Partner ecosystem upgrade

Please work with the partner providing the component and tools to ensure they can work with Data Lake Storage Gen2. 

## Performing the upgrade

### Pre-upgrade

As part of this, you would have gone through the *Assess your upgrade readiness* section and the [Planning for an upgrade](#planning-for-an-upgrade) section of this guide, you've received all of the necessary information, and you've created a plan that would meet your needs. You probably will have a testing task during this phase.

### In-upgrade

Depending on the strategy you choose and the complexities of your solution, this phase could be a short one or an extended one where there are multiple workloads waiting to be incrementally moved over to Data Lake Storage Gen2. This will be the most critical part of your upgrade.

### Post-upgrade

After you are done with the transition operation, the final steps will involve thorough verification. This would include but not be limited to verifying data has been copied over reliably, verifying ACLs have been set correctly, verifying end-to-end pipelines are functioning correctly etc. After the verifications have been completed, you can now turn off your old pipelines, delete your source Data Lake Storage Gen1 accounts and go full speed on your Data Lake Storage Gen2-based solutions.

## Conclusion

The guidance provided in this document should have helped you upgrade your solution to use Data Lake Storage Gen2. 

If you have more questions, or have feedback, provide comments below or provide feedback in the [Azure Feedback Forum](https://feedback.azure.com/forums/327234-data-lake).
