---
title: Use the Azure Data Explorer connector for Apache Spark to move data between Azure Data Explorer and Spark clusters.
description: This topic shows you how to move data between Azure Data Explorer and Apache Spark clusters.
author: orspod
ms.author: orspodek
ms.reviewer: jasonh
ms.service: data-explorer
ms.topic: conceptual
ms.date: 4/24/2019
---

# Azure Data Explorer (Kusto) Connector for Apache Spark

[Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing.

Spark Azure Data Explorer connector implements Data Source and Data Sink for moving data across Kusto and Spark clusters

Making Azure Data Explorer and Spark work together enables building fast and scalable applications, targeting a variety of Machine Learning, Extract-Transform-Load, Log Analytics and other data driven scenarios.

***Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios, such as machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics.***

## Location

Spark Azure Data Explorer connector is an open source project hosted on [GitHub](https://github.com/Azure/azure-kusto-spark). 

## Interoperability

Spark Azure Data Explorer connector can run on any Spark cluster.

> [!NOTE]
> some of the examples below relate to an [Azure Databricks](https://docs.azuredatabricks.net/) Spark cluster. This is done for reference purposes only; Spark Kusto connector does not take direct dependencies on Databricks or any other Spark distribution. 

Pre-built libraries for Spark 2.4, Scala 2.11 are available [here](https://github.com/Azure/azure-kusto-spark/releases). Spark Connector can be built from [sources](https://github.com/Azure/azure-kusto-spark) as described in the connector [usage](https://github.com/Azure/azure-kusto-spark#usage) section. 

## Prerequisites

* [Create an Azure Data Explorer cluster and database](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-portal) 
* Create a spark cluster
* Install Azure Data Explorer connector library, and libraries listed in the [dependencies](https://github.com/Azure/azure-kusto-spark#dependencies) section. Typically this is limited to [Kusto Java SDK](https://docs.microsoft.com/en-us/azure/kusto/api/java/kusto-java-client-library) libraries:
    * [Kusto Data Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-data)
    * [Kusto Ingest Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-ingest)
    
## Spark Cluster Settings 

Below is an example of cluster settings, based on Azure Databricks cluster using Spark 2.4 and Scala 2.11: 

"DatabricksClusterM.png" alt="Azure Databricks Spark Cluster"

1. Import the Azure Data Explorer connector library:

"DbCreateLibraryM.png" alt="Azure Databricks Spark Cluster" 

1. Add additional dependencies:

"DbDependenciesM.png" alt="Azure Databricks Spark Cluster" 

1. Verify that all required libraries are installed:

"DbLibrariesViewB.png" alt="Azure Databricks Spark Cluster" 

## Authentication

Kusto Spark connector allows the user to authenticate with AAD using an AAD application,
user token or (for non-production scenarios) device authentication. 

Alternatively, authentication parameters can be stored in Azure Key Vault.
In this case, the user must provide once application credentials in order to access the Key Vault resource.

More details are available on [GitHub documentation](https://github.com/Azure/azure-kusto-spark/blob/dev/docs/Authentication.md).

### AAD Application Authentication

This authentication method is fairly straightforward, and it is used in most of the examples in this documentation.

 * **KUSTO_AAD_CLIENT_ID**: 
  AAD application (client) identifier.
  
 * **KUSTO_AAD_AUTHORITY_ID**: 
  AAD authentication authority. This is the AAD Directory (tenant) ID.
 
 * **KUSTO_AAD_CLIENT_PASSWORD**: 
 AAD application key for the client.

### Key Vault

Kusto Spark connector allows authentication using Azure Key Vault. The Key Vault must contain the mandatory read/write authentication parameters. 

> [!NOTE]
>This option requires you to install azure-keyvault package.

### Azure Data Explorer Priviledges

The following priviledges must be granted on Azure Data Explorer Cluster:
* For reading (data source), AAD application must have 'viewer' privileges or above on the target database, or 'admin' privileges on the target table (either one is sufficient)
* For writing (data sink), AAD application must have 'ingestor' privileges on the target database. In addition, it must have 'user' privileges or above on the target database in order to be able to create new tables. If the target table already exists, 'admin' privileges on the target table can be configured instead.
 
For details on Azure Data Explorer principal roles, please refer to [Role-based Authorization](/azure/kusto/management/access-control/role-based-authorization). For managing security roles, please refer to [Security Roles Management](/azure/kusto/management/security-roles).

## Spark Sink: writing to Azure Data Explorer

1. Set up sink parameters:

"SinkParameters.png" alt="Azure Databricks Spark Cluster" 

1. Write Spark Data Frame to Azure Data Explorer cluster as batch:

"BatchSink.png" alt="Azure Databricks Spark Cluster" 

1. Write streaming data:

"WriteStream.png" alt="Azure Databricks Spark Cluster" 

## Spark Source: reading from Azure Data Explorer

1. When reading small amounts of data, define the data query:

"ReadLean.png" alt="Azure Databricks Spark Cluster" 

When reading substantial amounts of data, transient blob storage must be provided.
> [!NOTE]
> This is a temporary requirement. Future versions of the connector will be able to provision transient storage internally.

1. Provide storage container SAS key, or alternatively storage account name, account key and container name:

"Storage.png" alt="Azure Databricks Spark Cluster" 

1. Read from Azure Data Explorer:

"ReadScale.png" alt="Azure Databricks Spark Cluster" 
