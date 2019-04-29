---
title: Use the Azure Data Explorer connector for Apache Spark to move data between Azure Data Explorer and Spark clusters.
description: This topic shows you how to move data between Azure Data Explorer and Apache Spark clusters.
author: orspod
ms.author: orspodek
ms.reviewer: michazag
ms.service: data-explorer
ms.topic: conceptual
ms.date: 4/29/2019
---

# Azure Data Explorer Connector for Apache Spark

[Apache Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing. Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data. 

Spark Azure Data Explorer connector implements data source and data sink for moving data across Azure Data Explorer and Spark clusters to use both of their capabilities. Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios, such as machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. 

Writing to Azure Data Explorer can be done in batch and streaming mode. 
Reading from Azure Data Explorer supports column pruning and predicate pushdown, which reduces the volume of transferred data by filtering out data in Azure Data Explorer.

Azure Data Explorer Spark connector is an [open source project](https://github.com/Azure/azure-kusto-spark) that can run on any Spark cluster.

> [!NOTE]
> Although some of the examples below refer to an [Azure Databricks](https://docs.azuredatabricks.net/) Spark cluster, Azure Data Explorer Spark connector does not take direct dependencies on Databricks or any other Spark distribution.

## Prerequisites

* [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal) 
* Create a spark cluster
* Install Azure Data Explorer connector library, and libraries listed in [dependencies](https://github.com/Azure/azure-kusto-spark#dependencies) including the following [Kusto Java SDK](https://docs.microsoft.com/en-us/azure/kusto/api/java/kusto-java-client-library) libraries:
    * [Kusto Data Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-data)
    * [Kusto Ingest Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-ingest)
* Pre-built libraries for [Spark 2.4, Scala 2.11](https://github.com/Azure/azure-kusto-spark/releases). 

## Building from Sources

Spark Connector can be also built from [sources](https://github.com/Azure/azure-kusto-spark) as follows:

### Build Prerequisites
* Java 1.8 SDK installed
* [Maven 3.x](https://maven.apache.org/download.cgi) installed
* Spark version 2.4.0 or higher

    >**Note:** 2.3.x versions are also supported, but require some changes in pom.xml dependencies

For Scala/Java applications using Maven project definitions, 
link your application with the artifact below (latest version may differ):

```Maven
   <dependency>
     <groupId>com.microsoft.azure</groupId>
     <artifactId>spark-kusto-connector</artifactId>
     <version>1.0.0-Beta-02</version>
   </dependency>
```

#### Build Commands
   
```
// Builds jar and runs all tests
mvn clean package

// Builds jar, runs all tests, and installs jar to your local maven repository
mvn clean install
```

For more information, refer to the [connector usage](https://github.com/Azure/azure-kusto-spark#usage) section.

## Spark Cluster Settings

1. Spark cluster settings, based on Azure Databricks cluster using Spark 2.4 and Scala 2.11: 

    ![Databricks cluster settings](media/spark-connector/databricks-cluster-m.png)

1. Import the Azure Data Explorer connector library:

    ![Import Azure Data Explorer library](media/spark-connector/db-create-library-m.png)

1. Add additional dependencies:

    ![Add dependencies](media/spark-connector/db-dependencies-m.png)

1. Verify that all required libraries are installed:

    ![Verify libraries installed](media/spark-connector/db-libraries-view-b.png)

## Authentication

Azure Data Explorer Spark connector allows you to authenticate with AAD using an AAD application, [AAD access token](), or [device authentication]() (for non-production scenarios). Authentication parameters can also be stored in Azure Key Vault. The user must provide application credentials to access the Key Vault resource.

### AAD Application Authentication

Most simple and common authentication method. Method recommended for Azure Data Explorer Spark connector usage.

Example?


|Properties  |Description  |
|---------|---------|
|**KUSTO_CLUSTER**     |         |
|**KUSTO_DATABASE**    |         |
|**KUSTO_TABLE**    |         |
|**KUSTO_AAD_CLIENT_ID**     |   AAD application (client) identifier.      |
|**KUSTO_AAD_AUTHORITY_ID**     |  AAD authentication authority. AAD Directory (tenant) ID.        |
|**KUSTO_AAD_CLIENT_PASSWORD**    |    AAD application key for the client.     |


### Azure Key Vault Authentication

Azure Data Explorer Spark connector allows authentication using Azure Key Vault. The Key Vault must contain the mandatory read/write authentication parameters.

> [!NOTE]
>This option requires you to install azure-keyvault package.

### Azure Data Explorer Privileges

The following privileges must be granted on an Azure Data Explorer Cluster:
* For reading (data source), AAD application must have 'viewer' privileges on the target database, or 'admin' privileges on the target table.
* For writing (data sink), AAD application must have 'ingestor' privileges on the target database. It must also have 'user' privileges on the target database to create new tables. If the target table already exists, 'admin' privileges on the target table can be configured. 
 
For more information on Azure Data Explorer principal roles, refer to [Role-based Authorization](/azure/kusto/management/access-control/role-based-authorization). For managing security roles, refer to [Security Roles Management](/azure/kusto/management/security-roles).

## Spark Sink: writing to Azure Data Explorer

1. Set up sink parameters:

    ![Sink parameters](media/spark-connector/sink-parameters.png)

1. Write Spark DataFrame to Azure Data Explorer cluster as batch:

    ![Batch sink](media/spark-connector/batch-sink.png)

1. Write streaming data:
    ![Write streaming data](media/spark-connector/write-stream.png)

## Spark Source: reading from Azure Data Explorer

1. When reading small amounts of data, define the data query:
    ![Read small data](media/spark-connector/read-lean.png)

1. When reading large amounts of data, transient blob storage must be provided. Provide storage container SAS key, or storage account name, account key, and container name:

    ![Read storage](media/spark-connector/storage.png)

    > [!NOTE]
    > This is a temporary requirement. Future versions of the connector will be able to provision transient storage internally.

1. Read from Azure Data Explorer:

    ![Read scale mode](media/spark-connector/read-scale.png)
