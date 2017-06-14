---
title: Use Apache Storm with Power BI - Azure HDInsight | Microsoft Docs
description: Create a Power BI report using data from a C# topology running on an Apache Storm cluster in HDInsight.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 36fe3b9c-5232-4464-8d75-95403b6da7a1
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/31/2017
ms.author: larryfr

---
# Use Power BI to visualize data from an Apache Storm topology

Power BI allows you to visually display data as reports. This document provides an example of how to use Apache Storm on HDInsight to generate data for Power BI.

> [!NOTE]
> The steps in this document rely on a Windows development environment with Visual Studio. The compiled project can be submitted to a Linux-based HDInsight cluster. Only Linux-based clusters created after 10/28/2016 support SCP.NET topologies.
>
> To use a C# topology with a Linux-based cluster, update the Microsoft.SCP.Net.SDK NuGet package used by your project to version 0.10.0.6 or higher. The version of the package must also match the major version of Storm installed on HDInsight. For example, Storm on HDInsight versions 3.3 and 3.4 use Storm version 0.10.x, while HDInsight 3.5 uses Storm 1.0.x.
>
> C# topologies on Linux-based clusters must use .NET 4.5, and use Mono to run on the HDInsight cluster. Most things work. However you should check the [Mono Compatibility](http://www.mono-project.com/docs/about-mono/compatibility/) document for potential incompatibilities.
>
> For a Java version of this project, which works with Linux-based or Windows-based HDInsight, see [Process events from Azure Event Hubs with Storm on HDInsight (Java)](hdinsight-storm-develop-java-event-hub-topology.md).

## Prerequisites

* An Azure Active Directory user with [Power BI](https://powerbi.com) access.
* An HDInsight cluster. For more information, see [Get started with Storm on HDInsight](hdinsight-apache-storm-tutorial-get-started-linux.md).

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdi-version-33-nearing-retirement-date).

* Visual Studio (one of the following versions)

  * Visual Studio 2012 with [update 4](http://www.microsoft.com/download/details.aspx?id=39305)
  * Visual Studio 2013 with [update 4](http://www.microsoft.com/download/details.aspx?id=44921) or [Visual Studio 2013 Community](http://go.microsoft.com/fwlink/?linkid=517284&clcid=0x409)
  * [Visual Studio 2015](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx)
  * Visual Studio 2017 (any edition)

* The HDInsight Tools for Visual Studio: See [Get started using the HDInsight Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md) for information on installation information.

## How it works

This example contains a C# Storm topology that randomly generates Internet Information Services (IIS) log data. This data is then written to a SQL Database, and from there it is used to generate reports in Power BI.

The following files implement the main functionality of this example:

* **SqlAzureBolt.cs**: Writes information produced in the Storm topology to SQL Database.
* **IISLogsTable.sql**: The Transact-SQL statements used to generate the database that the data is stored in.

> [!WARNING]
> Create the table in SQL Database before starting the topology on your HDInsight cluster.

## Download the example

Download the [HDInsight C# Storm Power BI example](https://github.com/Azure-Samples/hdinsight-dotnet-storm-powerbi). To download it, either fork/clone it using [git](http://git-scm.com/), or use the **Download** link to download a .zip of the archive.

## Create a database

1. To create a database, use the steps in the [SQL Database tutorial](../sql-database/sql-database-get-started.md) document.

2. Connect to the database by following the steps in the [Connect to a SQL Database with Visual Studio](../sql-database/sql-database-connect-query.md) document.

3. In Object Explorer, right-click the database and select  **New Query**. Paste the contents of the **IISLogsTable.sql** file included in the downloaded project into the query window, and then use Ctrl + Shift + E to execute the query. You should receive a message that the commands completed successfully.

## Configure the sample

1. From the [Azure portal](https://portal.azure.com), select your SQL database. From the **Essentials** section of the SQL database blade, select **Show database connection strings**. From the list that appears, copy the **ADO.NET (SQL authentication)** information.

2. Open the sample in Visual Studio. From **Solution Explorer**, open the **App.config** file, and then find the following entry:

        <add key="SqlAzureConnectionString" value="##TOBEFILLED##" />

    Replace the **##TOBEFILLED##** value with the database connection string copied in the previous step. Replace **{your\_username}** and **{your\_password}** with the username and password for the database.

3. Save and close the files.

## Deploy the sample

1. From **Solution Explorer**, right-click the **StormToSQL** project and select **Submit to Storm on HDInsight**. Select the HDInsight cluster from the **Storm Cluster** dropdown dialog.

   > [!NOTE]
   > It may take a few seconds for the **Storm Cluster** dropdown to populate with server names.
   >
   > If prompted, enter the login credentials for your Azure subscription. If you have more than one subscription, log in to the one that contains your Storm on HDInsight cluster.

2. When the topology has been submitted, the __Topology Viewer__ appears. To view this topology, select the SqlAzureWriterTopology entry from the list.

    ![The topologies, with the topology selected](./media/hdinsight-storm-power-bi-topology/topologyview.png)

    You can use this view to see information on the topology, or double-click an entry (such as the SqlAzureBolt) to see information specific to a component in the topology.

3. After the topology has ran for a few minutes, return to the SQL query window you used to create the database. Replace the existing statements with the following query:

        select * from iislogs;

    Use Ctrl + Shift + E to execute the query, and you should receive results similar to the following data:

        1    2016-05-27 17:57:14.797    255.255.255.255    /bar    GET    200
        2    2016-05-27 17:57:14.843    127.0.0.1    /spam/eggs    POST    500
        3    2016-05-27 17:57:14.850    123.123.123.123    /eggs    DELETE    200
        4    2016-05-27 17:57:14.853    127.0.0.1    /foo    POST    404
        5    2016-05-27 17:57:14.853    10.9.8.7    /bar    GET    200
        6    2016-05-27 17:57:14.857    192.168.1.1    /spam    DELETE    200

    This data has been written from the Storm topology.

## Create a report

1. Connect to the [Azure SQL Database connector](https://app.powerbi.com/getdata/bigdata/azure-sql-database-with-live-connect) for Power BI. 

2. Within **Databases**, select **Get**.

3. Select **Azure SQL Database**, and then select **Connect**.

    > [!NOTE]
    > You may be asked to download the Power BI Desktop to continue. If so, use the following steps to connect:
    >
    > 1. Open Power BI Desktop and select __Get Data__.
    > 2  Select __Azure__, and then __Azure SQL database__.

4. Enter the information to connect to your Azure SQL Database. You can find this information by visiting the [Azure portal](https://portal.azure.com) and selecting your SQL database.

   > [!NOTE]
   > You can also set the refresh interval and custom filters by using **Enable Advanced Options** from the connect dialog.

5. After you've connected, you will see a new dataset with the same name as the database you connected to. Select the dataset to begin designing a report.

6. From **Fields**, expand the **IISLOGS** entry. To create a report that lists the URI stems, select the checkbox for **URISTEM**.

    ![Creating a report](./media/hdinsight-storm-power-bi-topology/createreport.png)

7. Next, drag **METHOD** to the report. The report updates to list the stems and the corresponding HTTP method used for the HTTP request.

    ![adding the method data](./media/hdinsight-storm-power-bi-topology/uristemandmethod.png)

8. From the **Visualizations** column, select the **Fields** icon, and then select the down arrow next to **METHOD** in the **Values** section. To display a count of how many times a URI has been accessed, select **Count**.

    ![Changing to a count of methods](./media/hdinsight-storm-power-bi-topology/count.png)

9. Next, select the **Stacked column chart** to change how the information is displayed.

    ![Changing to a stacked chart](./media/hdinsight-storm-power-bi-topology/stackedcolumn.png)

10. To save the report, select **Save** and enter a name for the report.

## Stop the topology

The topology continues to run until you stop it or delete the Storm on HDInsight cluster. To stop the topology, perform the following steps:

1. In Visual Studio, return to the topology viewer and select the topology.

2. Select the **Kill** button to stop the topology.

    ![Kill button on the topology summary](./media/hdinsight-storm-power-bi-topology/killtopology.png)

## Delete your cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Next steps

In this document, you learned how to send data from a Storm topology to SQL Database, then visualize the data using Power BI. For information on how to work with other Azure technologies using Storm on HDInsight, see the following document:

* [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)
