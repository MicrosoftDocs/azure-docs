---
title: Connect to Azure Data Explorer with ODBC
description: In this how-to, you learn how to set up an ODBC connection to Azure Data Explorer then use that connection to visualize data with Tableau.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 12/18/2018
---

# Connect to Azure Data Explorer with ODBC

Open Database Connectivity ([ODBC](/sql/odbc/reference/odbc-overview) is a widely accepted application programming interface (API) for database access. Use ODBC to connect to Azure Data Explorer from applications that don't have a dedicated connector.

Behind the scenes, applications call functions in the ODBC interface, which are implemented in database-specific modules called *drivers*. Azure Data Explorer supports a subset of the SQL Server communication protocol ([MS-TDS](/azure/kusto/api/tds/)); therefore it can use the ODBC driver for SQL Server.

In this article, you learn how to use the SQL Server ODBC driver, so you can connect to Azure Data Explorer from any application that supports ODBC. You can then optionally connect to Azure Data Explorer from Tableau, and visualize data from a sample cluster.

## Prerequisites

You need the following to complete this how to:

* [Microsoft ODBC Driver for SQL Server version 17.2.0.1 or later](/sql/connect/odbc/download-odbc-driver-for-sql-server) for your operating system.

* If you want to follow our visualization example, you also need:

  * Tableau Desktop, full or [trial](https://www.tableau.com/products/desktop/download) version.

  * A cluster that includes the StormEvents sample data. For  more information, see [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-database-portal.md) and [Ingest sample data into Azure Data Explorer](ingest-sample-data.md).

    [!INCLUDE [data-explorer-storm-events](../../includes/data-explorer-storm-events.md)]

## Configure the ODBC data source

Follow these steps to configure an ODBC data source using the ODBC driver for SQL Server.

1. In Windows, search for *ODBC Data Sources*, and open the ODBC Data Sources desktop app.

1. Select **Add**.

    ![Add data source](media/connect-odbc/add-data-source.png)

1. Select **ODBC Driver 17 for SQL Server** then **Finish**.

    ![Select driver](media/connect-odbc/select-driver.png)

1. Enter a name and description for the connection and the cluster you want to connect to, then select **Next**. The cluster URL should be in the form *\<ClusterName\>.\<Region\>.kusto.windows.net*.

    ![Select server](media/connect-odbc/select-server.png)

1. Select **Active Directory Integrated** then **Next**.

    ![Active Directory Integrated](media/connect-odbc/active-directory-integrated.png)

1. On the next screen, leave all options as defaults then select **Next**.

1. On the next screen, leave all options as defaults then select **Finish**.

1. Select **Test Data Source**.

    ![Test data source](media/connect-odbc/test-data-source.png)

1. Verify that the test succeeded then select **OK**. If the test didn't succeed, check the values that you specified in previous steps, and ensure you have sufficient permissions to connect to the cluster.

    ![Test succeeded](media/connect-odbc/test-succeeded.png)

## Visualize data in Tableau (optional)

Now you've finished configuring ODBC, it's time to visualize data in Tableau. We'll show a basic example here, but there's a lot more you can do. We recommend looking at [Write queries for Azure Data Explorer](write-queries.md) for examples of other queries to run against the sample data set.