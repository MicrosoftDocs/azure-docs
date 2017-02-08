---
title: Azure SQL Data Warehouse - Get started tutorial | Microsoft Docs
description: Get Started Tutorial with Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: 'barbkess'

ms.assetid: 52DFC191-E094-4B04-893F-B64D5828A900
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 12/21/2016
ms.author: elbutter

---
# Get started with SQL Data Warehouse

Get Started Tutorial with Azure SQL Data Warehouse. This tutorial teaches you the basics 
of provisioning and loading data into a SQL Data Warehouse, as well as some basics on scaling, 
pausing, and tuning. 

**Estimated time to complete:** 75 minutes

## Prerequisites


### Sign up for Microsoft Azure
If you don't already have a Microsoft Azure account, you must sign up for one to use this service. If you already have an account, you may skip this step. 

1. Navigate to the account pages [https://azure.microsoft.com/account/](https://azure.microsoft.com/account/)
2. Create a free Azure account, or purchase an account.
3. Follow the instructions

### Install appropriate SQL Client Driver and tools

Most SQL client tools can connect to Azure SQL Data Warehouse using JDBC, ODBC, or ADO.net. Due to product complexity and large number of T-SQL features SQL Data Warehouse supports, not every client application may be fully compatible 
with SQL Data Warehouse.

If you are running a Windows Operating System, we recommend using either [Visual Studio] or [SQL Server Management Studio].


[!INCLUDE [Create a new logical server](../../includes/sql-data-warehouse-create-logical-server.md)] 

[!INCLUDE [SQL Database create server](../../includes/sql-database-create-new-server-firewall-portal.md)]

## Create an Azure SQL Data Warehouse

> [!NOTE]
> Creating a SQL Data Warehouse might result in a new billable service.  For more information, see [SQL Data Warehouse pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).
>


### Create a SQL Data Warehouse
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Databases** > **SQL Data Warehouse**.

    ![NewBlade](../../includes/media/sql-data-warehouse-create-dw/blade-click-new.png)
    ![SelectDW](../../includes/media/sql-data-warehouse-create-dw/blade-select-dw.png)

3. Fill out deployment details

    **Database Name**: Pick anything you'd like. If you have multiple SQL DW instances, we recommend your names include details such as its region, environment, etc., 
    e.g. *mydw-westus-1-test*

    **Subscription**: Your Azure Subscription

    **Resource Group**: Create new (or use existing if you plan on using your Azure SQL Data Warehouse with other services)
    > [!NOTE]
    > Services within a resource group should have the same lifecycle. Resource groups are useful for resource
    > administration such as scoping access control and templated deployment. 
    > Read more about Azure resource groups and best practices [here](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups)
    >

    **Source**: Blank Database

    **Server**: Select the server you created in [Prerequisites].

    **Collation**: Leave the default collation SQL_Latin1_General_CP1_CI_AS

    **Select performance**: We recommend using staying with the standard 400DWU

4. Choose **Pin to dashboard**
    ![Pin To Dashboard](./media/sql-data-warehouse-get-started-tutorial/pin-to-dashboard.png)

5. Sit back and wait for your Azure SQL Data Warehouse to deploy! It's normal for this process to take several minutes. 
The portal will notify you when your instance is done deploying. 

## Connect to Azure SQL Data Warehouse through SQL Server (logical server)

This tutorial uses SQL Server Management Studio to connect to our SQL Data Warehouse. Other tools can be used to connect 
to SQL Data Warehouse through our supported connectors: ADO.NET, JDBC, ODBC, and PHP. Bear in mind, functionality may be limited for 
tools not supported by Microsoft.


### Get connection information

To connect to your SQL Data Warehouse, you must connect through the SQL Server (logical server) you created 
in [Prerequisites].

1. Select your SQL Data Warehouse from the dashboard or search for it in your resources.

    ![SQL Data Warehouse Dashboard](./media/sql-data-warehouse-get-started-tutorial/sql-dw-dashboard.png)

2. Find the full name for the logical server.

    ![Select Server Name](./media/sql-data-warehouse-get-started-tutorial/select-server.png)

3. Open SSMS and use object explorer to connect to this server using the credentials you created in [Prerequisites]

    ![Connect with SSMS](./media/sql-data-warehouse-get-started-tutorial/ssms-connect.png)

If all goes correctly, you should now be connected to your SQL Server (logical server) instance. You can use server 
credentials to authenticate to any database on the server as the database owner. However, as best practice, you should 
create separate logins and users for each database. We shall explore user creation in [Create a User for SQL Data Warehouse](./sql-data-warehouse-get-started-tutorial.md#create-a-user-for-sql-data-warehouse). 

## Create a user for SQL Data Warehouse

### Why create a separate user?

We use the connection to the SQL Server (logical server), with server credentials from the previous step, 
to create a new user for our SQL Data Warehouse. There are two primary reasons why you may want to create a separate 
user/login for your SQL DW.

1.  Your organization’s users should use a different account to authenticate. 
This way you can limit the permissions granted to the application and reduce 
the risks of malicious activity.

2. By default, the server administrator login that you're currently connected with uses a smaller 
resource class. Resource classes help you control memory allocation and CPU cycles given to a query. 
Users in **smallrc** are given a smaller amount of memory and can take advantage of higher concurrency. 
In contrast, users assigned to **xlargerc** are given large amounts of memory, and therefore fewer of their queries can run concurrently. 
For loading data in a way that best optimizes compression, you want to make sure the user loading data 
is part of a larger resource class. Read more about resource classes [here](./sql-data-warehouse-develop-concurrency.md#resource-classes):

### Creating a user of a larger resource class

1. Query the **master** database of your server

    ![New Query on Master](./media/sql-data-warehouse-get-started-tutorial/query-on-server.png)

    ![New Query on Master1](./media/sql-data-warehouse-get-started-tutorial/query-on-master.png)

2. Create a server login and user

    ```sql
    CREATE LOGIN XLRCLOGIN WITH PASSWORD = 'a123reallySTRONGpassword!';
    CREATE USER LoadingUser FOR LOGIN XLRCLOGIN;
    ```

3. Querying the SQL DataWarehouse database, create a new database user based on the server login 
    ```sql
    CREATE USER LoadingUser FOR LOGIN XLRCLOGIN;
    ```

4. Grant user DB control
    ```sql
    GRANT CONTROL ON DATABASE::[NYT] to LoadingUser;
    ```
    > [!NOTE]
    > If your database name has hyphens in it, be sure to wrap it in brackets! 
    >

5. Add your database user to the **xlargerc** resource class role
    ```sql
    EXEC sp_addrolemember 'xlargerc', 'LoadingUser';
    ```

6. Log in to your database with your new credentials

    ![Log in With New Login](./media/sql-data-warehouse-get-started-tutorial/new-login.png)


## Loading data

### Defining external data
1. Create a Master Key and define an external data source

    ```sql
    CREATE MASTER KEY;

    CREATE EXTERNAL DATA SOURCE NYTPublic
    WITH
    (
    TYPE = Hadoop
    , LOCATION = 'wasbs://2013@nytpublic.blob.core.windows.net/'
    );
    ```


2. Define the external file formats

    The ```CREATE EXTERNAL FILE FORMAT``` command is used to specify the
    format of the external data that you are loading from. For the New York public taxi data, we’ve used the
    two formats for storing the data in Azure Blob Storage

    ```sql
    CREATE EXTERNAL FILE FORMAT uncompressedcsv
    WITH
    ( FORMAT_TYPE = DELIMITEDTEXT
    , FORMAT_OPTIONS ( FIELD_TERMINATOR = ','
    , STRING_DELIMITER = ''
    , DATE_FORMAT = ''
    , USE_TYPE_DEFAULT = False
    )
    );

    CREATE EXTERNAL FILE FORMAT compressedcsv
    WITH
    ( FORMAT_TYPE = DELIMITEDTEXT
    , FORMAT_OPTIONS ( FIELD_TERMINATOR = '|'
    , STRING_DELIMITER = ''
    , DATE_FORMAT = ''
    , USE_TYPE_DEFAULT = False
    )
    , DATA_COMPRESSION = 'org.apache.hadoop.io.compress.GzipCodec'
    );
    ```

3.  Create a schema for your external file format

    ```sql
    CREATE SCHEMA ext;
    GO
    ```

4. Create the external tables. These tables reference data stored in HDFS or Azure blob storage. 

    ```sql
    CREATE EXTERNAL TABLE [ext].[Date] 
    (
    [DateID] int NOT NULL,
    [Date] datetime NULL,
    [DateBKey] char(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayOfMonth] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DaySuffix] varchar(4) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayName] varchar(9) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayOfWeek] char(1) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayOfWeekInMonth] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayOfWeekInYear] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayOfQuarter] varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DayOfYear] varchar(3) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [WeekOfMonth] varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [WeekOfQuarter] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [WeekOfYear] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [Month] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [MonthName] varchar(9) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [MonthOfQuarter] varchar(2) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [Quarter] char(1) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [QuarterName] varchar(9) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [Year] char(4) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [YearName] char(7) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [MonthYear] char(10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [MMYYYY] char(6) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [FirstDayOfMonth] date NULL,
    [LastDayOfMonth] date NULL,
    [FirstDayOfQuarter] date NULL,
    [LastDayOfQuarter] date NULL,
    [FirstDayOfYear] date NULL,
    [LastDayOfYear] date NULL,
    [IsHolidayUSA] bit NULL,
    [IsWeekday] bit NULL,
    [HolidayUSA] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
    )
    WITH
    (
    LOCATION = 'Date'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = uncompressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0
    )
    CREATE EXTERNAL TABLE [ext].[Geography]
    (
    [GeographyID] int NOT NULL,
    [ZipCodeBKey] varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
    [County] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [City] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [State] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [Country] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [ZipCode] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
    )
    WITH
    (
    LOCATION = 'Geography'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = uncompressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0 
    )
    ;
    CREATE EXTERNAL TABLE [ext].[HackneyLicense]
    (
    [HackneyLicenseID] int NOT NULL,
    [HackneyLicenseBKey] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
    [HackneyLicenseCode] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
    )
    WITH
    (
    LOCATION = 'HackneyLicense'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = uncompressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0
    )
    ;
    CREATE EXTERNAL TABLE [ext].[Medallion]
    (
    [MedallionID] int NOT NULL,
    [MedallionBKey] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
    [MedallionCode] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
    )
    WITH
    (
    LOCATION = 'Medallion'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = uncompressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0
    )
    ;
    CREATE EXTERNAL TABLE [ext].[Time]
    (
    [TimeID] int NOT NULL,
    [TimeBKey] varchar(8) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
    [HourNumber] tinyint NOT NULL,
    [MinuteNumber] tinyint NOT NULL,
    [SecondNumber] tinyint NOT NULL,
    [TimeInSecond] int NOT NULL,
    [HourlyBucket] varchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
    [DayTimeBucketGroupKey] int NOT NULL,
    [DayTimeBucket] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
    )
    WITH
    (
    LOCATION = 'Time'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = uncompressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0
    )
    ;
    CREATE EXTERNAL TABLE [ext].[Trip]
    (
    [DateID] int NOT NULL,
    [MedallionID] int NOT NULL,
    [HackneyLicenseID] int NOT NULL,
    [PickupTimeID] int NOT NULL,
    [DropoffTimeID] int NOT NULL,
    [PickupGeographyID] int NULL,
    [DropoffGeographyID] int NULL,
    [PickupLatitude] float NULL,
    [PickupLongitude] float NULL,
    [PickupLatLong] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [DropoffLatitude] float NULL,
    [DropoffLongitude] float NULL,
    [DropoffLatLong] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [PassengerCount] int NULL,
    [TripDurationSeconds] int NULL,
    [TripDistanceMiles] float NULL,
    [PaymentType] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [FareAmount] money NULL,
    [SurchargeAmount] money NULL,
    [TaxAmount] money NULL,
    [TipAmount] money NULL,
    [TollsAmount] money NULL,
    [TotalAmount] money NULL
    )
    WITH
    (
    LOCATION = 'Trip2013'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = compressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0
    )
    ;
    CREATE EXTERNAL TABLE [ext].[Weather]
    (
    [DateID] int NOT NULL,
    [GeographyID] int NOT NULL,
    [PrecipitationInches] float NOT NULL,
    [AvgTemperatureFahrenheit] float NOT NULL
    )
    WITH
    (
    LOCATION = 'Weather2013'
    , DATA_SOURCE = NYTPublic
    , FILE_FORMAT = uncompressedcsv
    , REJECT_TYPE = value
    , REJECT_VALUE = 0
    )
    ;
    ```

### Create Table as Select (CTAS)

5. Load your data from external tables into your SQL Data Warehouse instance. 
    ```sql
    CREATE TABLE [dbo].[Date]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[Date]
    OPTION (LABEL = 'CTAS : Load [dbo].[Date]')
    ;
    CREATE TABLE [dbo].[Geography]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[Geography]
    OPTION (LABEL = 'CTAS : Load [dbo].[Geography]')
    ;
    CREATE TABLE [dbo].[HackneyLicense]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[HackneyLicense]
    OPTION (LABEL = 'CTAS : Load [dbo].[HackneyLicense]')
    ;
    CREATE TABLE [dbo].[Medallion]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[Medallion]
    OPTION (LABEL = 'CTAS : Load [dbo].[Medallion]')
    ;
    CREATE TABLE [dbo].[Time]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[Time]
    OPTION (LABEL = 'CTAS : Load [dbo].[Time]')
    ;
    CREATE TABLE [dbo].[Weather]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[Weather]
    OPTION (LABEL = 'CTAS : Load [dbo].[Weather]')
    ;
    CREATE TABLE [dbo].[Trip]
    WITH
    ( DISTRIBUTION = ROUND_ROBIN
    , CLUSTERED COLUMNSTORE INDEX
    )
    AS
    SELECT *
    FROM [ext].[Trip]
    OPTION (LABEL = 'CTAS : Load [dbo].[Trip]')
    ;
    ```

    > [!NOTE]
    > You’re loading several GBs of data and compressing it into highly performant Cluster Columnstore Indexes. Run
    > the DMV query following and then grab a coffee or snack while Azure SQL Data Warehouse does some heavy lifting.
    >

6. Create a new query and watch as your data comes in with this Dynamic Management View (DMV)

    ```sql
    SELECT
    r.command,
    s.request_id,
    r.status,
    count(distinct input_name) as nbr_files,
    sum(s.bytes_processed)/1024/1024 as gb_processed
    FROM
    sys.dm_pdw_exec_requests r
    inner join sys.dm_pdw_dms_external_work s
    on r.request_id = s.request_id
    WHERE
    r.[label] = 'CTAS : Load [dbo].[Date]' OR
    r.[label] = 'CTAS : Load [dbo].[Geography]' OR
    r.[label] = 'CTAS : Load [dbo].[HackneyLicense]' OR
    r.[label] = 'CTAS : Load [dbo].[Medallion]' OR
    r.[label] = 'CTAS : Load [dbo].[Time]' OR
    r.[label] = 'CTAS : Load [dbo].[Weather]' OR
    r.[label] = 'CTAS : Load [dbo].[Trip]'
    GROUP BY
    r.command,
    s.request_id,
    r.status
    ORDER BY
    nbr_files desc, gb_processed desc;
    ```

7. View all system queries

    ```sql
    SELECT * FROM sys.dm_pdw_exec_requests;
    ```

8. Enjoy seeing your data nicely loaded into your Azure SQL Data Warehouse

    ![See Data Loaded](./media/sql-data-warehouse-get-started-tutorial/see-data-loaded.png)



## Querying data 

### Scan query with scaling

Let's get a good idea of how scaling affects the speed of your queries.

Before we begin, let's scale our operation down to 100 DWUs so we can get an idea of how one compute node might perform on its own.

1. Go to the portal and select your SQL Data Warehouse instance

2. Select scale in the SQL Data Warehouse blade. 

    ![Scale DW From portal](./media/sql-data-warehouse-get-started-tutorial/scale-dw.png)

3. Scale down the performance bar to 100 DWU and hit save.

    ![Scale and save](./media/sql-data-warehouse-get-started-tutorial/scale-and-save.png)

4. Wait for your scale operation to finish.

    > [!NOTE]
    > Please note, scaling operations **kill** your currently running queries and prevent new ones from being run.
    >
    
5. Do a scan operation on the trip data, selecting the top million entries for all the columns. If you're eager
 to move on quickly, feel free to select fewer rows.

    ```sql
    SELECT TOP(1000000) * FROM dbo.[Trip]
    ```

Take note of the time it took to run this operation.

6. Scale up your instance to 400 DWU. Remember, each 100 DWU is adding another compute node to your Azure SQL Data Warehouse.

7. Run the query again! You should notice a significant difference. 

> [!NOTE]
> Azure SQL Data Warehouse is a Massively Parallel Processing (MPP) platform. Queries and
> operations that can parallelize work among various nodes experience the true power of
> Azure SQL Data Warehouse.
>

### Join query with statistics

1. Run a query that joins the Date table with the Trip table

    ```sql
    SELECT TOP (1000000) dt.[DayOfWeek]
    ,tr.[MedallionID]
    ,tr.[HackneyLicenseID]
    ,tr.[PickupTimeID]
    ,tr.[DropoffTimeID]
    ,tr.[PickupGeographyID]
    ,tr.[DropoffGeographyID]
    ,tr.[PickupLatitude]
    ,tr.[PickupLongitude]
    ,tr.[PickupLatLong]
    ,tr.[DropoffLatitude]
    ,tr.[DropoffLongitude]
    ,tr.[DropoffLatLong]
    ,tr.[PassengerCount]
    ,tr.[TripDurationSeconds]
    ,tr.[TripDistanceMiles]
    ,tr.[PaymentType]
    ,tr.[FareAmount]
    ,tr.[SurchargeAmount]
    ,tr.[TaxAmount]
    ,tr.[TipAmount]
    ,tr.[TollsAmount]
    ,tr.[TotalAmount]
    FROM [dbo].[Trip] as tr
    join
    dbo.[Date] as dt
    on tr.DateID = dt.DateID
    ```

    As you might expect, the query takes much longer when you shuffle data among the nodes, especially in a join scenario like this query.

2. Let's see how this query differs when we create statistics on the column we're joining by running the following:

    ```sql
    CREATE STATISTICS [dbo.Date DateID stats] ON dbo.Date (DateID);
    CREATE STATISTICS [dbo.Trip DateID stats] ON dbo.Trip (DateID);
    ```

    > [!NOTE]
    > SQL DW does not automatically manage statistics for you. Statistics are important for query
    > performance and it is highly recommended you create and update statistics.
    > 
    > **You gain the most benefit by having statistics on columns involved in joins, columns
    > used in the WHERE clause and columns found in GROUP BY.**
    >

3. Run the query from Prerequisites again and observe any performance differences. While the differences in
query performance will not be as drastic as scaling up, you should notice a discernable speed-up. 

## Next steps

You're now ready to query and explore. Check out our best practices or tips.

If you're done exploring for the day, make sure to pause your instance! In production, you can experience enormous 
savings by pausing and scaling to meet your business needs.

![Pause](./media/sql-data-warehouse-get-started-tutorial/pause.png)

## Useful readings

[Concurrency and Workload Management]

[Best practices for Azure SQL Data Warehouse]

[Query Monitoring]

[Top 10 Best Practices for Building a Large Scale Relational Data Warehouse]

[Migrating Data to Azure SQL Data Warehouse]


[Concurrency and Workload Management]: sql-data-warehouse-develop-concurrency.md#change-a-user-resource-class-example
[Best practices for Azure SQL Data Warehouse]: sql-data-warehouse-best-practices.md#hash-distribute-large-tables
[Query Monitoring]: sql-data-warehouse-manage-monitor.md
[Top 10 Best Practices for Building a Large Scale Relational Data Warehouse]: https://blogs.msdn.microsoft.com/sqlcat/2013/09/16/top-10-best-practices-for-building-a-large-scale-relational-data-warehouse/
[Migrating Data to Azure SQL Data Warehouse]: https://blogs.msdn.microsoft.com/sqlcat/2016/08/18/migrating-data-to-azure-sql-data-warehouse-in-practice/



[!INCLUDE [Additional Resources](../../includes/sql-data-warehouse-article-footer.md)]

<!-- Internal Links -->
[Prerequisites]: sql-data-warehouse-get-started-tutorial.md#prerequisites

<!--Other Web references-->
[Visual Studio]: https://www.visualstudio.com/
[SQL Server Management Studio]: https://msdn.microsoft.com/en-us/library/mt238290.aspx
