---
title: Azure Data Explorer output for Azure Stream Analytics (Preview)
description: This article describes using Azure Database Explorer as an output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 11/18/2021
---

# Azure Data Explorer output for Azure Stream Analytics (Preview)

You can use [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/) as an output for analyzing large volumes of diverse data from any data source, such as websites, applications, IoT devices, and more. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It helps you handle the many data streams emitted by modern software, so you can collect, store, and analyze data. This data is used for diagnostics, monitoring, reporting, machine learning, and additional analytics capabilities.

Azure Data Explorer supports several ingestion methods, including connectors to common services like Event Hub, programmatic ingestion using SDKs, such as .NET and Python, and direct access to the engine for exploration purposes. Azure Data Explorer integrates with analytics and modeling services for additional analysis and visualization of data.

For more information about Azure Data Explorer please visit the [What is Azure Data Explorer documentation.](https://docs.microsoft.com/azure/data-explorer/data-explorer-overview/)

To learn more about how to create an Azure Data Explorer and cluster by using the Azure portal please visit: [Quickstart: Create an Azure Data Explorer cluster and database](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal/)


> [!NOTE] 
> Test connection is currently not supported om multi-tenant clusters.

## Output configuration

The following table lists the property names and their description for creating an Azure Data Explorer output:

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this database. |
| Subscription | Select the Azure subscription that you want to use for your cluster. |
| Cluster | Choose a unique name that identifies your cluster. The domain name [region].kusto.windows.net is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters. |
| Database | The name of the database where you are sending your output. The database name must be unique within the cluster. |
| Authentication | A [managed identity from Azure Active Directory](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview/) allows your cluster to easily access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Managed identity configuration is currently supported only to [enable customer-managed keys for your cluster.](https://docs.microsoft.com/azure/data-explorer/security#customer-managed-keys-with-azure-key-vault/). |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |


## Partitioning

Partitioning needs to enabled and is based on the PARTITION BY clause in the query. When the Inherit Partitioning option is enabled, it follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). 

## Limitation

For Ingestion to successfully work, you need to make sure that:

* The number of columns in Azure Stream Analytics job query should match with Azure Data Explorer table and should be in the same order.
* The name of the columns & data type should match between Azure Stream Analytics SQL query and Azure Data Explorer table.
* Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The policy is configured to 5 minutes, 1000 items or 1 GB of data by default, so you may experience a latency. See [batching policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/batchingpolicy) for aggregation options.



## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)