   <properties
   pageTitle="Load data into SQL Data Warehouse | Microsoft Azure"
   description="Learn the common scenarios for data loading in SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor="jrowlandjones"/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/21/2015"
   ms.author="lodipalm;barbkess"/>

# Load data into SQL Data Warehouse
SQL Data Warehouse presents numerous options for loading data including:

- Azure Data Factory
- BCP command-line utility
- PolyBase
- SQL Server Integration Services (SSIS)
- 3rd party data loading tools

While all of the above methods can be used with SQL Data Warehouse.  Many of our users are looking at initial loads in the 100s of Gigabytes to the 10s of Terabytes.  In the below sections, we provide some guidance on initial data loading.  

## Initial Loading into SQL Data Warehouse from SQL Server 
When loading into SQL Data Warehouse from an on-premise SQL Server instance, we recommend the following steps:

1. **BCP** SQL Server data into flat files 
2. Use **AZCopy** or **Import/Export** (for larger datasets) to move your files into Azure
3. Configure PolyBase to read your files from your storage account
4. Create new tables and load data with **PolyBase**

In the following sections we will take a look at each step in great depth and provide examples of the process.

> [AZURE.NOTE] Before moving data from a system such as SQL Server, we suggest reviewing the [Migrate schema][] and [Migrate code][] articles of our documentation. 

## Exporting files with BCP

In order to prep your files for movement to Azure, you will need to export them to flat files.  This is best done using the BCP Command-line Utility.  If you do not have the utility yet, it can be downloaded with the [Microsoft Command Line Utilities for SQL Server][].  A sample BCP command might look like the following:

```
bcp "<Directory>\<File>" -c -T -S <Server Name> -d <Database Name>
```

This command will take the results of a query and export them to a file in the directory of your choice. You can parallelize the process by running multiple BCP commands for separate tables at once  This will enable you to run up to one BCP process per core of your server, our advice is try a few smaller operations at different configurations to see what works best for your environment.

In addition, as we will be loading using PolyBase, please note that PolyBase does not yet support UTF-16, and all files must be in UTF-8.  This can easily be accomplished by including the '-c' flag in your BCP command or you can also convert flat files from UTF-16 to UTF-8 with the below code:

```
Get-Content <input_file_name> -Encoding Unicode | Set-Content <output_file_name> -Encoding utf8
```
 
Once you have successfully exported your data to files, it is time to move them to Azure.  This can be accomplished with AZCopy or with the Import/Export service as described in the next section.  

## Loading into Azure with AZCopy or Import/Export
If you are moving data in the 5-10 terabyte range or above, we recommend that you use our disk shipping service [Import/Export][] in order to accomplish the move.  However, in our studies, we have been able to move data in the single digit TB range comfortably using public internet with AZCopy.  This process can also be sped up or extended with ExpressRoute.

The following steps will detail out how to move data from on-premise into an Azure Storage account using AZCopy.  If you don't have an Azure Storage account in the same region you can create one by following the [Azure Storage Documentation][].  You can also load data from a storage account in a different region, but the performance in this case will not be optimal.  

> [AZURE.NOTE] This documentation assumes that you have installed the AZCopy command line utility and are able to run it with Powershell.  If this is not the case, then please follow the [AZCopy Installation Instructions][].  

Now, given a set of files that have created using BCP, AzCopy can simply be run from the Azure powershell or by running a powershell script.  At a high level, the prompt needed to run AZCopy will take the form:

```
AZCopy /Source:<File Location> /Dest:<Storage Container Location> /destkey:<Storage Key> /Pattern:<File Name> /NC:256
```

In addition to the basic, we recommend the following best practices for loading with AZCopy:


+ **Concurrent Connections**: In addition to increasing the number of AZCopy operations that run at once, the AZCopy operation itself can be further parallelized by setting the /NC parameter, which opens a number of concurrent connections to the destination.  While the parameter can be set as high as 512, we found optimal data transfer took place at 256, and recommend that a number of values are tested to find what is optimal for your configuration.

+ **Express Route**: As stated above, this process can be sped up if express route is enabled.  An overview of Express Route and steps to configure can be found in the [ExpressRoute documentation][]. 

+ **Folder Structure**: To make transfer with PolyBase easier, ensure that each table is mapped to its own folder.  This will minimize and simplify your steps when loading with PolyBase later. That being said, there is no impact if a table is split into multiple files or even sub directories within the folder. 
	 

## Configuring PolyBase 

Now that your data resides in Azure storage blobs, we will import it into your SQL Data Warehouse instance using PolyBase.  The below steps are for configuration only, and many of them will only need to be completed once per SQL Data Warehouse instance, user, or storage account.  These steps have also been outlined in in greater detail in our [Load with PolyBase][] documentation.  

1. **Create a database master key.**  This operation will only need to be completed once per database. 

2. **Create a database scoped credential.**  This operation only needs to be created if you are looking at creating a new credential/user, otherwise a previously created credential can be used. 

3. **Create an external file format.**  External file formats are reusable as well, you will only need to create one if you are uploading a new type of file. 

4. **Create an external data source.**  When pointing at a storage account, an external data source can be used when loading from the same container. For your 'LOCATION' parameter, use a location of the format: 'wasbs://mycontainer@ test.blob.core.windows.net/path'.

```
-- Creating master key
CREATE MASTER KEY;

-- Creating a database scoped credential
CREATE DATABASE SCOPED CREDENTIAL <Credential Name> 
WITH 
    IDENTITY = '<User Name>'
,   Secret = '<Azure Storage Key>'
;

-- Creating external file format (delimited text file)
CREATE EXTERNAL FILE FORMAT text_file_format 
WITH 
(
    FORMAT_TYPE = DELIMITEDTEXT 
,   FORMAT_OPTIONS  (
                        FIELD_TERMINATOR ='|' 
                    ,   USE_TYPE_DEFAULT = TRUE
                    )
);

--Creating an external data source
CREATE EXTERNAL DATA SOURCE azure_storage 
WITH 
(
    TYPE = HADOOP 
,   LOCATION ='wasbs://<Container>@<Blob Path>'
,   CREDENTIAL = <Credential Name>
)
;
```

Now that your storage account is properly configured to you can proceed to loading your data into SQL Data Warehouse.  

## Loading data with PolyBase 
After configuring PolyBase, you can load data directly into your SQL Data Warehouse by simply creating an external table that points to your data in storage and then mapping that data to a new table within SQL Data Warehouse.  This can be accomplished with the two simple commands below. 

1. Use the 'CREATE EXTERNAL TABLE' command to define the structure of your data.  To make sure you capture the state of your data quickly and efficiently, we recommend scripting out the SQL Server table in SSMS, and then adjusting by hand to account for the external table differences. After creating an external table in Azure it will continue to point to the same location, even if data is updated or additional data is added.  

```
-- Creating external table pointing to file stored in Azure Storage
CREATE EXTERNAL TABLE <External Table Name> 
(
    <Column name>, <Column type>, <NULL/NOT NULL>
)
WITH 
(   LOCATION='<Folder Path>'
,   DATA_SOURCE = <Data Source>
,   FILE_FORMAT = <File Format>      
);
```

2. Load data with a 'CREATE TABLE...AS SELECT' statement. 

```
CREATE TABLE <Table Name> 
WITH 
(
	CLUSTERED COLUMNSTORE INDEX
)
AS 
SELECT  * 
FROM    <External Table Name>
;
```

Note that you can also load a subsection of the rows from a table using a more detailed SELECT statement.  However, as PolyBase does not push additional compute to storage accounts at this time, if you load a subsection with a SELECT statement this will not be faster than loading the entire dataset. 

In addition to the `CREATE TABLE...AS SELECT` statement, you can also load data from external tables into pre-existing tables with a 'INSERT...INTO' statement.

## Next steps
For more development tips, see the [development overview][].

<!--Image references-->

<!--Article references-->
[Load data with bcp]: sql-data-warehouse-load-with-bcp.md
[Load with PolyBase]: sql-data-warehouse-load-with-polybase.md
[solution partners]: sql-data-warehouse-solution-partners.md
[development overview]: sql-data-warehouse-overview-develop.md
[Migrate schema]: sql-data-warehouse-migrate-schema.md
[Migrate code]: sql-data-warehouse-migrate-code.md

<!--MSDN references-->
[supported source/sink]: https://msdn.microsoft.com/library/dn894007.aspx
[copy activity]: https://msdn.microsoft.com/library/dn835035.aspx
[SQL Server destination adapter]: https://msdn.microsoft.com/library/ms141237.aspx
[SSIS]: https://msdn.microsoft.com/library/ms141026.aspx

<!--Other Web references-->
[AZCopy Installation Instructions]:https://azure.microsoft.com/en-us/documentation/articles/storage-use-azcopy/
[Microsoft Command Line Utilities for SQL Server]:http://www.microsoft.com/en-us/download/details.aspx?id=36433
[Import/Export]: https://azure.microsoft.com/en-us/documentation/articles/storage-import-export-service/
[Azure Storage Documentation]:https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/
[ExpressRoute documentation]:http://azure.microsoft.com/en-us/documentation/services/expressroute/
