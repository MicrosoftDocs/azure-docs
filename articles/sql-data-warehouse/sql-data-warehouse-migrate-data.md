---
title: Migrate your data to SQL Data Warehouse | Microsoft Docs
description: Tips for migrating your data to Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: sqlmojo
manager: jhubbard
editor: ''

ms.assetid: d78f954a-f54c-4aa4-9040-919bc6414887
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: migrate
ms.date: 10/31/2016
ms.author: joeyong;barbkess

---
# Migrate Your Data

## Migrate data

There are several ways to migrate data to Azure. The basic steps are extract the data from your existing database, copy the data to Azure Storage Blob or Azure Data Lake Store, and then load the data into SQL Data Warehouse. For small data sets, you can use bcp to load data directly into SQL Data Warehouse. For large data sets, it is time-consuming to copy the data to Azure. Therefore, we recommend focusing first on getting the data safely to Azure before loading to SQL Data Warehouse.

In most cases, you will use PolyBase external tables to load the data from Azure storage into a SQL Data Warehouse, and then select the data into the final table. To load the data with PolyBase, the data formats need to be compatible with the formats that PolyBase supports. 

PolyBase and bcp both load text-delimited files. In this migration step you need to extract data from the source and copy it to text-delimited files. 

You might need to change some of your data to be compatible with SQL Data Warehouse and the PolyBase loading process. You can make changes when you extract the data from the source, when the data is in Azure storage, or when the data is in a SQL Data Warehouse staging table. 
  
Considerations for when to fix data incompatibilities

- Whenever possible, make the data compatible with SQL Data Warehouse and PolyBase as you extract the data from the source. This is usually the simplest to implement, and it avoids implementation work to make changes later in the process. 
- Change the data in Azure storage when you don't have the ability to filter the source data. For example, data streams might go directly to Azure storage without the ability to filter the source.  
- Change the data after loading into a SQL Data Warehouse staging table when you prefer to use SQL processes to implement the cleansing.  You will also have the performance power of SQL Data Warehouse to perform the cleansing. 


### NULLs and empty strings

For string data, there is a difference between the empty string "" and a NULL value. SQL Data Warehouse loads an empty value as NULL and it loads two quotes ("") as the empty string.  If the value NULL is in the input file, the row will fail to load.

This table shows some source strings and the way they should look in the text-delimited file.  The delimiter can be any sequence of ASCII characters. 

| Source string | Field delimiter | Extracted value with delimiters | Valid | Value loaded into a SQL DW string column |
| :------------ | ------- ------- | :------------------------------ | :---- | ---------------------------------------- |
| hello world   | ,               | ,hello world,                   | yes   | hello world                              |
| hello world   | ,               | ,"hello world",                 | yes   | "hello world                             |
| NULL          | ,               | ,                               | yes   | NULL                                     |
| NULL          | ,               | ,NULL,                          | no    | <row will fail to load>                  |
| ""            | ,               | ,"",                            | yes   | non-NULL value for empty string          |

If you write NULL to the delimited text-file as, the row will fail to load.


Another way to solve this is to:

- Copy the data to Azure and then use a batch tool like ADLA/HDI to transform the data in Azure. ADLA does support NULL escape, so you could send the data to ADLA and then clean up the nULL escape. 

### Choose the field terminator

The field terminator in the output file must be a character or sequence of characters that is not found in your string values. If your string data contains any commas, then you can't use a comma as the field terminator. Use a unique set of ANSI characters for the field terminator. For example, if you don't allow characters such as ~,(, \*, or ! in your strings, you could use one of them as the field terminator. You could use a combination of characters such as ~$ for the field terminator.

PolyBase does not consider everything inside of "" to be a literal string.  Instead, it reads the quotes as characters. For example, if the field delimiter is a comma, PolyBase reads the string "one, two, three" as three fields.  The first field is "one, the second field is "two", and the third field is three" .  

| Source string            | Field delimiter | Extracted value with delimiters | Valid | Values loaded into SQL Data Warehouse |
| :----------------------- | --------------- | :------------------------------ | :---- | ------------------------------------- |
| Wow, oh wow              | ,               | ,Wow, oh wow  ,                 | no    | 1) Wow 2) oh wow                      |
| Wow, oh wow              | ~$              | ~$Wow, oh wow~$                 | yes   | 1) Wow, oh wow                        |
| "orange,apples,bananas"  | ,               | ,"orange,apples,bananas",       | no    | 1) "orange 2) apples 3) bananas"      |


### Row delimiter

For row delimiters, use '\r', '\n', or '\r\n' (these are not escaped). if you have ,"'\r'", PolyBase would read that as the end of a row. You need to use bcp or change the data. 












Data can be moved from different sources into your SQL Data Warehouse with a variety tools.  ADF Copy, SSIS, and bcp can all be used to achieve this goal. However, as the amount of data increases you should think about breaking down the data migration process into steps. This affords you the opportunity to optimize each step both for performance and for resilience to ensure a smooth data migration.

This article first discusses the simple migration scenarios of ADF Copy, SSIS, and bcp. It then look a little deeper into how the migration can be optimized.

## Azure Data Factory (ADF) copy
[ADF Copy][ADF Copy] is part of [Azure Data Factory][Azure Data Factory]. You can use ADF Copy to export your data to flat files residing on local storage, to remote flat files held in Azure blob storage or directly into SQL Data Warehouse.

If your data starts in flat files, then you will first need to transfer it to Azure storage blob before initiating a load it into SQL Data Warehouse. Once the data is transferred into Azure blob storage you can choose to use [ADF Copy][ADF Copy] again to push the data into SQL Data Warehouse.

PolyBase also provides a high-performance option for loading the data. However, that does mean using two tools instead of one. If you need the best performance then use PolyBase. If you want a single tool experience (and the data is not massive) then ADF is your answer.


> 
> 

Head over to the following article for some great [ADF samples][ADF samples].

## Integration Services
Integration Services (SSIS) is a powerful and flexible Extract Transform and Load (ETL) tool that supports complex workflows, data transformation, and several data loading options. Use SSIS to simply transfer data to Azure or as part of a broader migration.

> [!NOTE]
> SSIS can export to UTF-8 without the byte order mark in the file. To configure this you must first use the derived column component to convert the character data in the data flow to use the 65001 UTF-8 code page. Once the columns have been converted, write the data to the flat file destination adapter ensuring that 65001 has also been selected as the code page for the file.
> 
> 

SSIS connects to SQL Data Warehouse just as it would connect to a SQL Server deployment. However, your connections will need to be using an ADO.NET connection manager. You should also take care to configure the "Use bulk insert when available" setting to maximize throughput. Please refer to the [ADO.NET destination adapter][ADO.NET destination adapter] article to learn more about this property

> [!NOTE]
> Connecting to Azure SQL Data Warehouse by using OLEDB is not supported.
> 
> 

In addition, there is always the possibility that a package might fail due to throttling or network issues. Design packages so they can be resumed at the point of failure, without redoing work that completed before the failure.

For more information consult the [SSIS documentation][SSIS documentation].

## bcp
bcp is a command-line utility that is designed for flat file data import and export. Some transformation can take place during data export. To perform simple transformations use a query to select and transform the data. Once exported, the flat files can then be loaded directly into the target the SQL Data Warehouse database.

> [!NOTE]
> It is often a good idea to encapsulate the transformations used during data export in a view on the source system. This ensures that the logic is retained and the process is repeatable.
> 
> 

Advantages of bcp are:

* Simplicity. bcp commands are simple to build and execute
* Re-startable load process. Once exported the load can be executed any number of times

Limitations of bcp are:

* bcp works with tabulated flat files only. It does not work with files such as xml or JSON
* Data transformation capabilities are limited to the export stage only and are simple in nature
* bcp has not been adapted to be robust when loading data over the internet. Any network instability may cause a load error.
* bcp relies on the schema being present in the target database prior to the load

For more information, see [Use bcp to load data into SQL Data Warehouse][Use bcp to load data into SQL Data Warehouse].

## Optimizing data migration
A SQLDW data migration process can be effectively broken down into three discrete steps:

1. Export of source data
2. Transfer of data to Azure
3. Load into the target SQLDW database

Each step can be individually optimized to create a robust, re-startable and resilient migration process that maximizes performance at each step.

## Optimizing data load
Looking at these in reverse order for a moment; the fastest way to load data is via PolyBase. Optimizing for a PolyBase load process places prerequisites on the preceding steps so it's best to understand this upfront. They are:

1. Encoding of data files
2. Format of data files
3. Location of data files

### Encoding
PolyBase requires data files to be UTF-8 or UTF-16FE. 



### Format of data files
PolyBase mandates a fixed row terminator of \n or newline. Your data files must conform to this standard. There aren't any restrictions on string or column terminators.

You will have to define every column in the file as part of your external table in PolyBase. Make sure that all exported columns are required and that the types conform to the required standards.

Please refer back to the [migrate your schema] article for detail on supported data types.

### Location of data files
SQL Data Warehouse uses PolyBase to load data from Azure Blob Storage exclusively. Consequently, the data must have been first transferred into blob storage.

## Optimizing data transfer
One of the slowest parts of data migration is the transfer of the data to Azure. Not only can network bandwidth be an issue but also network reliability can seriously hamper progress. By default migrating data to Azure is over the internet so the chances of transfer errors occurring are reasonably likely. However, these errors may require data to be re-sent either in whole or in part.

Fortunately you have several options to improve the speed and resilience of this process:

### [ExpressRoute][ExpressRoute]
You may want to consider using [ExpressRoute][ExpressRoute] to speed up the transfer. [ExpressRoute][ExpressRoute] provides you with an established private connection to Azure so the connection does not go over the public internet. This is by no means a mandatory step. However, it will improve throughput when pushing data to Azure from an on-premises or co-location facility.

The benefits of using [ExpressRoute][ExpressRoute] are:

1. Increased reliability
2. Faster network speed
3. Lower network latency
4. higher network security

[ExpressRoute][ExpressRoute] is beneficial for a number of scenarios; not just the migration.

Interested? For more information and pricing please visit the [ExpressRoute documentation][ExpressRoute documentation].

### Azure Import and Export Service
The Azure Import and Export Service is a data transfer process designed for large (GB++) to massive (TB++) transfers of data into Azure. It involves writing your data to disks and shipping them to an Azure data center. The disk contents will then be loaded into Azure Storage Blobs on your behalf.

A high-level view of the import export process is as follows:

1. Configure an Azure Blob Storage container to receive the data
2. Export your data to local storage
3. Copy the data to 3.5 inch SATA II/III hard disk drives using the [Azure Import/Export Tool]
4. Create an Import Job using the Azure Import and Export Service providing the journal files produced by the [Azure Import/Export Tool]
5. Ship the disks your nominated Azure data center
6. Your data is transferred to your Azure Blob Storage container
7. Load the data into SQLDW using PolyBase

### [AZCopy][AZCopy] utility
The [AZCopy][AZCopy] utility is a great tool for getting your data transferred into Azure Storage Blobs. It is designed for small (MB++) to very large (GB++) data transfers. [AZCopy] has also been designed to provide good resilient throughput when transferring data to Azure and so is a great choice for the data transfer step. Once transferred you can load the data using PolyBase into SQL Data Warehouse. You can also incorporate AZCopy into your SSIS packages using an "Execute Process" task.

To use AZCopy you will first need to download and install it. There is a [production version][production version] and a [preview version][preview version] available.

To upload a file from your file system you will need a command like the one below:

```
AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Pattern:abc.txt
```

A high-level process summary could be:

1. Configure an Azure storage blob container to receive the data
2. Export your data to local storage
3. AZCopy your data in the Azure Blob Storage container
4. Load the data into SQL Data Warehouse using PolyBase

Full documentation available: [AZCopy][AZCopy].

## Optimizing data export
In addition to ensuring that the export conforms to the requirements laid out by PolyBase you can also seek to optimize the export of the data to improve the process further.



### Data compression
PolyBase can read gzip compressed data. If you are able to compress your data to gzip files then you will minimize the amount of data being pushed over the network.

### Multiple files
Breaking up large tables into several files not only helps to improve export speed, it also helps with transfer re-startability, and the overall manageability of the data once in the Azure blob storage. One of the many nice features of PolyBase is that it will read all the files inside a folder and treat it as one table. It is therefore a good idea to isolate the files for each table into its own folder.

PolyBase also supports a feature known as "recursive folder traversal". You can use this feature to further enhance the organization of your exported data to improve your data management.

To learn more about loading data with PolyBase, see [Use PolyBase to load data into SQL Data Warehouse][Use PolyBase to load data into SQL Data Warehouse].

## Next steps
For more about migration, see [Migrate your solution to SQL Data Warehouse][Migrate your solution to SQL Data Warehouse].
For more development tips, see [development overview][development overview].

<!--Image references-->

<!--Article references-->
[AZCopy]: ../storage/storage-use-azcopy.md
[ADF Copy]: ../data-factory/data-factory-data-movement-activities.md 
[ADF samples]: ../data-factory/data-factory-samples.md
[ADF Copy examples]: ../data-factory/data-factory-copy-activity-tutorial-using-visual-studio.md
[development overview]: sql-data-warehouse-overview-develop.md
[Migrate your solution to SQL Data Warehouse]: sql-data-warehouse-overview-migrate.md
[SQL Data Warehouse development overview]: sql-data-warehouse-overview-develop.md
[Use bcp to load data into SQL Data Warehouse]: sql-data-warehouse-load-with-bcp.md
[Use PolyBase to load data into SQL Data Warehouse]: sql-data-warehouse-get-started-load-with-polybase.md


<!--MSDN references-->

<!--Other Web references-->
[Azure Data Factory]: http://azure.microsoft.com/services/data-factory/
[ExpressRoute]: http://azure.microsoft.com/services/expressroute/
[ExpressRoute documentation]: http://azure.microsoft.com/documentation/services/expressroute/

[production version]: http://aka.ms/downloadazcopy/
[preview version]: http://aka.ms/downloadazcopypr/
[ADO.NET destination adapter]: https://msdn.microsoft.com/library/bb934041.aspx
[SSIS documentation]: https://msdn.microsoft.com/library/ms141026.aspx
