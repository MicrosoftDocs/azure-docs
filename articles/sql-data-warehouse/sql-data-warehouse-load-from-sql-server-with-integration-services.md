<properties
   pageTitle="Load data from SQL Server into Azure SQL Data Warehouse (SSIS) | Microsoft Azure"
   description="Shows you how to create a SQL Server Integration Services (SSIS) package to move data from a wide variety of data sources to SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/08/2016"
   ms.author="lodipalm;sonyama;barbkess"/>

# Load data from SQL Server into Azure SQL Data Warehouse (SSIS)

> [AZURE.SELECTOR]
- [SSIS](sql-data-warehouse-load-from-sql-server-with-integration-services.md)
- [PolyBase](sql-data-warehouse-load-from-sql-server-with-polybase.md)
- [bcp](sql-data-warehouse-load-from-sql-server-with-bcp.md)


Create a SQL Server Integration Services (SSIS) package to load data from SQL Server into Azure SQL Data Warehouse. You can optionally restructure, transform, and cleanse the data as it passes through the SSIS data flow.

In this tutorial, you will:

- Create a new Integration Services project in Visual Studio.
- Connect to data sources, including SQL Server (as a source) and SQL Data Warehouse (as a destination).
- Design an SSIS package that loads data from the source into the destination.
- Run the SSIS package to load the data.

This tutorial uses SQL Server as the data source. SQL Server could be running on premises or in an Azure virtual machine.

## Basic concepts

The package is the unit of work in SSIS. Related packages are grouped in projects. You create projects and design packages in Visual Studio with SQL Server Data Tools. The design process is a visual process in which you drag and drop components from the Toolbox to the design surface, connect them, and set their properties. After you finish your package, you can optionally deploy it to SQL Server for comprehensive management, monitoring, and security.

## Options for loading data with SSIS

SQL Server Integration Services (SSIS) is a flexible set of tools that provides a variety of options for connecting to, and loading data into, SQL Data Warehouse.

1. Use an ADO NET Destination to connect to SQL Data Warehouse. This tutorial uses an ADO NET Destination because it has the fewest configuration options.
2. Use an OLE DB Destination to connect to SQL Data Warehouse. This option may provide slightly better performance than the ADO NET Destination.
3. Use the Azure Blob Upload Task to stage the data in Azure Blob Storage. Then use the SSIS Execute SQL task to launch a Polybase script that loads the data into SQL Data Warehouse. This option provides the best performance of the three options listed here. To get the Azure Blob Upload task, download the [Microsoft SQL Server 2016 Integration Services Feature Pack for Azure][]. To learn more about Polybase, see [PolyBase Guide][].

## Before you start

To step through this tutorial, you need:

1. **SQL Server Integration Services (SSIS)**. SSIS is a component of SQL Server and requires an evaluation version or a licensed version of SQL Server. To get an evaluation version of SQL Server 2016 Preview, see [SQL Server Evaluations][].
2. **Visual Studio**. To get the free Visual Studio 2015 Community Edition, see [Visual Studio Community][].
3. **SQL Server Data Tools for Visual Studio (SSDT)**. To get SQL Server Data Tools for Visual Studio 2015, see [Download SQL Server Data Tools (SSDT)][].
4. **Sample data**. This tutorial uses sample data stored in SQL Server in the AdventureWorks sample database as the source data to be loaded into SQL Data Warehouse. To get the AdventureWorks sample database, see [AdventureWorks 2014 Sample Databases][].
5. **A SQL Data Warehouse database and permissions**. This tutorial connects to a SQL Data Warehouse instance and loads data into it. You have to have permissions to create a table and to load data.
6. **A firewall rule**. You have to create a firewall rule on SQL Data Warehouse with the IP address of your local computer before you can upload data to the SQL Data Warehouse.

## Step 1: Create a new Integration Services project

1. Launch Visual Studio 2015.
2. On the **File** menu, select **New | Project**.
3. Navigate to the **Installed | Templates | Business Intelligence | Integration Services** project types.
4. Select **Integration Services Project**. Provide values for **Name** and **Location**, and then select **OK**.

Visual Studio opens and creates a new Integration Services (SSIS) project. Then Visual Studio opens the designer for the single new SSIS package (Package.dtsx) in the project. You see the following screen areas:

- On the left, the **Toolbox** of SSIS components.
- In the middle, the design surface, with multiple tabs. You typically use at least the **Control Flow** and the **Data Flow** tabs.
- On the right, the **Solution Explorer** and the **Properties** panes.

    ![][01]

## Step 2: Create the basic data flow

1. Drag a Data Flow Task from the Toolbox to the center of the design surface (on the **Control Flow** tab).

    ![][02]

2. Double-click the Data Flow Task to switch to the Data Flow tab.
3. From the Other Sources list in the Toolbox, drag an ADO.NET Source to the design surface. With the source adapter still selected, change its name to **SQL Server source** in the **Properties** pane.
4. From the Other Destinations list in the Toolbox, drag an ADO.NET Destination to the design surface under the ADO.NET Source. With the destination adapter still selected, change its name to **SQL DW destination** in the **Properties** pane.

    ![][09]

## Step 3: Configure the source adapter

1. Double-click the source adapter to open the **ADO.NET Source Editor**.

    ![][03]

2. On the **Connection Manager** tab of the **ADO.NET Source Editor**, click the **New** button next to the **ADO.NET connection manager** list to open the **Configure ADO.NET Connection Manager** dialog box and create connection settings for the SQL Server database from which this tutorial loads data.

    ![][04]

3. In the **Configure ADO.NET Connection Manager** dialog box, click the **New** button to open the **Connection Manager** dialog box and create a new data connection.

    ![][05]

4. In the **Connection Manager** dialog box, do the following things.

    1. For **Provider**, select the SqlClient Data Provider.
    2. For **Server name**, enter the SQL Server name.
    3. In the **Log on to the server** section, select or enter authentication information.
    4. In the **Connect to a database** section, select the AdventureWorks sample database.
    5. Click **Test Connection**.
    
        ![][06]
    
    6. In the dialog box that reports the results of the connection test, click **OK** to return to the **Connection Manager** dialog box.
    7. In the **Connection Manager** dialog box, click **OK** to return to the **Configure ADO.NET Connection Manager** dialog box.
 
5. In the **Configure ADO.NET Connection Manager** dialog box, click **OK** to return to the **ADO.NET Source Editor**.
6. In the **ADO.NET Source Editor**, in the **Name of the table or the view** list, select the **Sales.SalesOrderDetail** table.

    ![][07]

7. Click **Preview** to see the first 200 rows of data in the source table in the **Preview Query Results** dialog box.

    ![][08]

8. In the **Preview Query Results** dialog box, click **Close** to return to the **ADO.NET Source Editor**.
9. In the **ADO.NET Source Editor**, click **OK** to finish configuring the data source.

## Step 4: Connect the source adapter to the destination adapter

1. Select the source adapter on the design surface.
2. Select the blue arrow that extends from the source adapter and drag it to the destination editor until it snaps into place.

    ![][10]

    In a typical SSIS package, you use a number of other components from the SSIS Toolbox in between the source and the destination to restructure, transform, and cleanse your data as it passes through the SSIS data flow. To keep this example as simple as possible, we’re connecting the source directly to the destination.

## Step 5: Configure the destination adapter

1. Double-click the destination adapter to open the **ADO.NET Destination Editor**.

    ![][11]

2. On the **Connection Manager** tab of the **ADO.NET Destination Editor**, click the **New** button next to the **Connection manager** list to open the **Configure ADO.NET Connection Manager** dialog box and create connection settings for the Azure SQL Data Warehouse database into which this tutorial loads data.
3. In the **Configure ADO.NET Connection Manager** dialog box, click the **New** button to open the **Connection Manager** dialog box and create a new data connection.
4. In the **Connection Manager** dialog box, do the following things.
    1. For **Provider**, select the SqlClient Data Provider.
    2. For **Server name**, enter the SQL Data Warehouse name.
    3. In the **Log on to the server** section, select **Use SQL Server authentication** and enter authentication information.
    4. In the **Connect to a database** section, select an existing SQL Data Warehouse database.
    5. Click **Test Connection**.
    6. In the dialog box that reports the results of the connection test, click **OK** to return to the **Connection Manager** dialog box.
    7. In the **Connection Manager** dialog box, click **OK** to return to the **Configure ADO.NET Connection Manager** dialog box.
5. In the **Configure ADO.NET Connection Manager** dialog box, click **OK** to return to the **ADO.NET Destination Editor**.
6. In the **ADO.NET Destination Editor**, click **New** next to the **Use a table or view** list to open the **Create Table** dialog box to create a new destination table with a column list that matches the source table.

    ![][12a]

7. In the **Create Table** dialog box, do the following things.

    1. Change the name of the destination table to **SalesOrderDetail**.
    2. Remove the **rowguid** column. The **uniqueidentifier** data type is not supported in SQL Data Warehouse.
    3. Change the data type of the **LineTotal** column to **money**. The **decimal** data type is not supported in SQL Data Warehouse. For info about supported data types, see [CREATE TABLE (Azure SQL Data Warehouse, Parallel Data Warehouse)][].
    
        ![][12b]
    
    4. Click **OK** to create the table and return to the **ADO.NET Destination Editor**.

8. In the **ADO.NET Destination Editor**, select the **Mappings** tab to see how columns in the source are mapped to columns in the destination.

    ![][13]

9. Click **OK** to finish configuring the data source.

## Step 6: Run the package to load the data

Run the package by clicking the **Start** button on the toolbar or by selecting one of the **Run** options on the **Debug** menu.

As the package begins to run, you see yellow spinning wheels to indicate activity as well as the number of rows processed so far.

![][14]

When the package has finished running, you see green check marks to indicate success as well as the total number of rows of data loaded from the source to the destination.

![][15]

Congratulations! You’ve successfully used SQL Server Integration Services to load data into Azure SQL Data Warehouse.

## Next steps

- Learn more about the SSIS data flow. Start here: [Data Flow][].
- Learn how to debug and troubleshoot your packages right in the design environment. Start here: [Troubleshooting Tools for Package Development][].
- Learn how to deploy your SSIS projects and packages to Integration Services Server or to another storage location. Start here: [Deployment of Projects and Packages][].

<!-- Image references -->
[01]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ssis-designer-01.png
[02]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ssis-data-flow-task-02.png
[03]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ado-net-source-03.png
[04]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ado-net-connection-manager-04.png
[05]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ado-net-connection-05.png
[06]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/test-connection-06.png
[07]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ado-net-source-07.png
[08]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/preview-data-08.png
[09]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/source-destination-09.png
[10]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/connect-source-destination-10.png
[11]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/ado-net-destination-11.png
[12a]: ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/destination-query-before-12a.png
[12b]: ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/destination-query-after-12b.png
[13]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/column-mapping-13.png
[14]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/package-running-14.png
[15]:  ./media/sql-data-warehouse-load-from-sql-server-with-integration-services/package-success-15.png

<!-- Article references -->

<!-- MSDN references -->
[PolyBase Guide]: https://msdn.microsoft.com/library/mt143171.aspx
[Download SQL Server Data Tools (SSDT)]: https://msdn.microsoft.com/library/mt204009.aspx
[CREATE TABLE (Azure SQL Data Warehouse, Parallel Data Warehouse)]: https://msdn.microsoft.com/library/mt203953.aspx
[Data Flow]: https://msdn.microsoft.com/library/ms140080.aspx
[Troubleshooting Tools for Package Development]: https://msdn.microsoft.com/library/ms137625.aspx
[Deployment of Projects and Packages]: https://msdn.microsoft.com/library/hh213290.aspx

<!--Other Web references-->
[Microsoft SQL Server 2016 Integration Services Feature Pack for Azure]: http://go.microsoft.com/fwlink/?LinkID=626967
[SQL Server Evaluations]: https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2016
[Visual Studio Community]: https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx
[AdventureWorks 2014 Sample Databases]: https://msftdbprodsamples.codeplex.com/releases/view/125550
