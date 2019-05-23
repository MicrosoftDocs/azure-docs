---
title: Visualize data from Azure Data Explorer using Sisense
description: In this how-to, you learn how to set up Azure Data Explorer as a data source for Sisense, and then visualize data.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 5/22/2019
---

# Visualize data from Azure Data Explorer in Sisense

Sisense is an analytics business intelligence platform that enables you to build analytics apps that deliver highly interactive user experiences. The business intelligence and dashboard reporting software allows you to access and consolidate data in a few clicks.
You can connect to structured and unstructured data sources, join tables from multiple sources with minimal scripting and coding, and create interactive web dashboards and reports. In this article, you learn how to set up Azure Data Explorer as a data source for Sisense, and then visualize data from a sample cluster.

## Prerequisites

You need the following to complete this article:

* Download and install Sisense app //To do: <link>

* A cluster that includes the StormEvents sample data. For  more information, see [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-database-portal.md) and [Ingest sample data into Azure Data Explorer](ingest-sample-data.md).

    [!INCLUDE [data-explorer-storm-events](../../includes/data-explorer-storm-events.md)]

## Connect to Sisense dashboards using Azure Data Explorer JDBC connector

1. Download and copy the latest versions of the following jar files to *..\Sisense\DataConnectors\jdbcdrivers\adx –* 

    * activation-1.1.jar
    * adal4j-1.6.0.jar
    * commons-codec-1.10.jar
    * commons-collections4-4.1.jar
    * commons-lang3-3.5.jar
    * gson-2.8.0.jar
    * jcip-annotations-1.0-1.jar
    * json-smart-1.3.1.jar
    * lang-tag-1.4.4.jar
    * mail-1.4.7.jar
    * mssql-jdbc-7.2.1.jre8.jar
    * nimbus-jose-jwt-7.0.1.jar
    * oauth2-oidc-sdk-5.24.1.jar
    * slf4j-api-1.7.21.jar
    
1. Open **Sisense app**.
1. Select **Data** tab and select **+ElasticCube** to create a new ElastiCube model.
    sisense 1 img
1. In **Add new ElasticClube model name** Name the ElastiCube model and **Save**
    sisense 2 img
1. Select **+ Data**.
1. Select **Generic JDBC** connector from **Choose connector** window 
1. In resulting **Generic JDBC** window fill out the following fields: (cover all fields with gray - JDBC: on first field). select **Next**

    |Field |Description |
    |---------|---------|
    |Connection string     |   jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;database=<database_name>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword      |
    |JDBC jar folder  |    ..\Sisense\DataConnectors\jdbcdrivers\adx     |
    |Driver's Class Name    |   com.microsoft.sqlserver.jdbc.SQLServerDriver      |
    |User Name   |    AAD user name     |
    |Password     |   AAD user password      |

1. In **Select Database** pane select the relevant database to which you have permissions.
1. In *Database name* pane:
    1. You can click on table name to preview the table. 
    1. Select the "box" of the relevant table. Select **Done**.
1. In left-hand pane, click on table name to see table column names. 
1. Click **Build** to build your dataset. The build window opens. Click **Build** again. Wait until build process is complete and **Build Succeeded**.
1. In left hand pane click on table name to see table column names. Select the rel
1. You can start building dashboards on top of this dataset.

## Next steps

* [Write queries for Azure Data Explorer](write-queries.md)

