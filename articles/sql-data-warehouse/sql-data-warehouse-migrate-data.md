<properties
   pageTitle="Migrate your data to SQL Data Warehouse | Microsoft Azure"
   description="Tips for migrating your data to Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/25/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Migrate Your Data
The primary objective when migrating data is to populate your SQLDW database. This process can be achieved in a number of ways. ADF Copy, SSIS and bcp can all be used to achieve this goal. However, as the amount of data increases you should think about breaking down the data migration process into steps. This affords you the opportunity to optimize each step both for performance and for resilience to ensure a smooth data migration.

This article firstly discusses the simple migration scenarios of ADF Copy, SSIS and bcp. It then look a little deeper into how the migration can be optimized.

## Azure Data Factory (ADF) copy
[ADF Copy][] is part of [Azure Data Factory][]. You can use ADF Copy to export your data to flat files residing on local storage, to remote flat files held in Azure blob storage or directly into SQL Data Warehouse.

If your data starts in flat files then you will first need to transfer it to Azure storage blob before initiating a load it into SQL Data Warehouse. Once the data is transferred into Azure blob storage you can choose to use [ADF Copy][] again to push the data into SQL Data Warehouse. 

PolyBase also provides a very high performance option for loading the data. However, that does mean using two tools instead of one. If you need the best performance then use PolyBase. If you want a single tool experience (and the data is not massive) then ADF is your answer.

> [AZURE.NOTE] PolyBase requires your data files to be in UTF-8. This is ADF Copy's default encoding so there is nothing to change. This is just a reminder to not change the default behavior of ADF Copy.

Head over to the following article for some great [ADF Copy examples].

## Integration Services ##
Integration Services (SSIS) is a powerful and flexible Extract Transform and Load (ETL) tool that supports complex workflows, data transformation, and several data loading options. Use SSIS to simply transfer data to Azure or as part of a broader migration.

> [AZURE.NOTE] SSIS can export to UTF-8 without the byte order mark in the file. To configure this you must first use the derived column component to convert the character data in the data flow to use the 65001 UTF-8 code page. Once the columns have been converted, write the data to the flat file destination adapter ensuring that 65001 has also been selected as the code page for the file.

SSIS connects to SQL Data Warehouse just as it would connect to a SQL Server deployment. However, your connections will need to be using an ADO.NET connection manager. You should also take care to configure the "Use bulk insert when available" setting to maximize throughput. Please refer to the [ADO.NET destination adapter][] article to learn more about this property

> [AZURE.NOTE] Connecting to Azure SQL Data Warehouse by using OLEDB is not supported.

In addition, there is always the possibility that a package might fail due to throttling or network issues. Design packages so they can be resumed at the point of failure, without redoing work that completed before the failure.

For more information consult the [SSIS documentation][].

## bcp
bcp is a command-line utility that is designed for flat file data import and export. Some transformation can can take place during data export. To perform simple transformations use a query to select and transform the data. Once exported, the flat files can then be loaded directly into the target the SQL Data Warehouse database.

> [AZURE.NOTE] It is often a good idea to encapsulate the transformations used during data export in a view on the source system. This ensures that the logic is retained and the process is repeatable.

Advantages of bcp are:

- Simplicity. bcp commands are simple to build and execute
- Re-startable load process. Once exported the load can be executed any number of times

Limitations of bcp are:

- bcp works with tabulated flat files only. It does not work with files such as xml or JSON
- bcp does not support exporting to UTF-8. This may prevent using PolyBase on bcp exported data
- Data transformation capabilities are limited to the export stage only and are simple in nature
- bcp has not been adapted to be robust when loading data over the internet. Any network instability may cause a load error.
- bcp relies on the schema being present in the target database prior to the load

For more information, see [Use bcp to load data into SQL Data Warehouse][].

## Optimizing data migration
A SQLDW data migration process can be effectively broken down into three discrete steps:

1. Export of source data
2. Transfer of data to Azure
3. Load into the target SQLDW database

Each step can be individually optimized to create a robust, re-startable and resilient migration process that maximises performance at each step.

## Optimizing data load
Looking at these in reverse order for a moment; the fastest way to load data is via PolyBase. Optimizing for a PolyBase load process places pre-quisites on the preceding steps so it's best to understand this upfront. They are:

1. Encoding of data files
2. Format of data files
3. Location of data files

### Encoding
PolyBase requires data files to be UTF-8 encoded. This means that when you export your data it must conform to this requirement. If your data only contains basic ASCII characters (not extended ASCII) then these map directly to the UTF-8 standard and you don't have to worry too much about the encoding. However, if your data contains any special characters such as umlauts, accents or symbols or your data supports non-latin languages then you will have to ensure that your export files are properly UTF-8 encoded.

> [AZURE.NOTE] bcp does not support exporting data to UTF-8. Therefore your best option is to use either Integration Services or ADF Copy for the data export. It is worth pointing out that the UTF-8 byte order mark (BOM) is not required in the data file.

Any files encoded using UTF-16 will need to be re-written ***prior*** to the data transfer.

### Format of data files
PolyBase mandates a fixed row terminator of \n or newline. Your data files must conform to this standard. There aren't any restrictions on string or column terminators.

You will have to define every column in the file as part of your external table in PolyBase. Make sure that all exported columns are required and that the types conform to the required standards.

Please refer back to the [migrate your schema] article for detail on supported data types.

### Location of data files
SQL Data Warehouse uses PolyBase to load data from Azure Blob Storage exclusively. Consequently, the data must have been first transferred into blob storage.

## Optimizing data transfer
One of the slowest parts of data migration is the transfer of the data to Azure. Not only can network bandwidth be an issue but also network reliability can seriously hamper progress. By default migrating data to Azure is over the internet so the chances of transfer errors occurring are reasonably likely. However, these errors may require data to be re-sent either in whole or in part.

Fortunately you have several options to improve the speed and resilience of this process:

### [ExpressRoute][]
You may want to consider using [ExpressRoute][] to speed up the transfer. [ExpressRoute][]provides you with an established private connection to Azure so the connection does not go over the public internet. This is by no means a mandatory step. However, it will improve throughput when pushing data to Azure from an on-premises or co-location facility.

The benefits of using [ExpressRoute][] are:

1. Increased reliability
2. Faster network speed
3. Lower network latency
4. higher network security

[ExpressRoute][] is beneficial for a number of scenarios; not just the migration.

Interested? For more information and pricing please visit the [ExpressRoute documentation][].

### Azure Import and Export Service
The Azure Import and Export Service is a data transfer process designed for large (GB++) to massive (TB++) transfers of data into Azure. It involves writing your data to disks and shipping them to an Azure data center. The disk contents will then be loaded into Azure Storage Blobss on your behalf.

A high level view of the import export process is as follows:

1. Configure an Azure Blob Storage container to receive the data
2. Export your data to local storage
2. Copy the data to 3.5 inch SATA II/III hard disk drives using the [Azure Import/Export Tool]
3. Create an Import Job using the Azure Import and Export Service providing the journal files produced by the [Azure Import/Export Tool]
4. Ship the disks your nominated Azure data center
5. Your data is transferred to your Azure Blob Storage container
6. Load the data into SQLDW using PolyBase

### [AZCopy][] utility
The [AZCopy][] utility is a great tool for getting your data transferred into Azure Storage Blobs. It is designed for small (MB++) to very large (GB++) data transfers. [AZCopy] has also been designed to provide good resilient throughput when transferring data to Azure and so is a great choice for the data transfer step. Once transferred you can load the data using PolyBase into SQL Data Warehouse. You can also incorporate AZCopy into your SSIS packages using an "Execute Process" task.

To use AZCopy you will first need to download and install it. There is a [production version][] and a [preview version][] available.

To upload a file from your file system you will need a command like the one below:

```
AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Pattern:abc.txt
```

A high level process summary could be:

1. Configure an Azure storage blob container to receive the data
2. Export your data to local storage
3. AZCopy your data in the Azure Blob Storage container
4. Load the data into SQL Data Warehouse using PolyBase

Full documentation available: [AZCopy][].

## Optimizing data export
In addition to ensuring that the export conforms to the requirements laid out by PolyBase you can also seek to optimize the export of the data to improve the process further.

> [AZURE.NOTE] As PolyBase requires the data to be in UTF-8 format it is unlikely you will use bcp to perform the data export. bcp does not support outputting data files to  UTF-8. SSIS or ADF Copy are much better suited to performing this kind of data export.

### Data compression
PolyBase can read gzip compressed data. If you are able to compress your data to gzip files then you will minimize the amount of data being pushed over the network.

### Multiple files
Breaking up large tables into several files not only helps to improve export speed, it also helps with transfer re-startability, and the overall manageability of the data once in the Azure blob storage. One of the many nice features of PolyBase is that it will read all the files inside a folder and treat it as one table. It is therefore a good idea to isolate the files for each table into its own folder.

PolyBase also supports a feature known as "recursive folder traversal". You can use this feature to further enhance the organization of your exported data to improve your data management. 

To learn more about loading data with PolyBase, see [Use PolyBase to load data into SQL Data Warehouse][].


## Next steps
For more about migration, see [Migrate your solution to SQL Data Warehouse][].
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[AZCopy]: ../storage/storage-use-azcopy.md
[ADF Copy]: ../data-factory/data-factory-copy-activity.md
[ADF Copy examples]: ../data-factory/data-factory-copy-activity-examples.md
[development overview]: sql-data-warehouse-develop-overview.md
[Migrate your solution to SQL Data Warehouse]: sql-data-warehouse-overview-migrate.md
[SQL Data Warehouse development overview]: sql-data-warehouse-overview-develop.md
[Use bcp to load data into SQL Data Warehouse]: sql-data-warehouse-load-with-bcp.md
[Use PolyBase to load data into SQL Data Warehouse]: sql-data-warehouse-load-with-polybase.md


<!--MSDN references-->

<!--Other Web references-->
[Azure Data Factory]: http://azure.microsoft.com/services/data-factory/
[ExpressRoute]: http://azure.microsoft.com/services/expressroute/
[ExpressRoute documentation]: http://azure.microsoft.com/documentation/services/expressroute/

[production version]: http://aka.ms/downloadazcopy/
[preview version]: http://aka.ms/downloadazcopypr/
[ADO.NET destination adapter]: https://msdn.microsoft.com/en-us/library/bb934041.aspx
[SSIS documentation]: https://msdn.microsoft.com/en-us/library/ms141026.aspx

