<properties
   pageTitle="Data migration tools | Microsoft Azure"
   description="Learn about the tools for migrating data to SQL Data Warehouse. Use these tools to export data from the source, transfer data to Azure, or import data into SQL Data Warehouse. "
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess;"/>

# Data migration tools
This article describes the tools that you can use for migrating data to SQL Data Warehouse. Each tools supports one of more of these core migration steps.

1. Export data from the source. For example, SQL Server on-premises.
2. Copy data to Azure. For example, to Azure blob storage.
3. Import data into SQL Data Warehouse. 


Your original source data could be in a variety of places, for example:

- SQL Server on-premises database
- SQL Server running in an IaaS VM on Azure
- SQL Server backup
- Azure SQL Database
- Hadoop
- Azure blob storage
- Text-delimited files
- A database system besides SQL Server. 

Some migration strategies can transfer data directly from the source to SQL Data Warehouse, and some use a few steps. For example, you could move data from SQL Server on-premises to Azure blob storage, and then use PolyBase to import the data into SQL Data Warehouse.

To learn about optimizing data migration with PolyBase, see [SQL Data Warehouse data migration optimizations with PolyBase][].


## Azure Data Factory Copy Activity
[Azure Data Factory] (ADF) has a copy activity called [ADF copy].

ADF Copy can:

- Export data from SQL Server to text-delimited files on-premises.
- Export data from SQL Server to text-delimited files in Azure blob storage.
- Export data from SQL Server directly to SQL Data Warehouse.
- Import data from Azure blob storage to SQL Data Warehouse.

ADF Copy can*not*:

- Import data from on-premises text-delimited files to SQL Data Warehouse. 

If your data is in text-delimited flat files, you can transfer the data to Azure blob storage, and then use [ADF Copy] to push the data into SQL Data Warehouse.

For examples, see [ADF Copy examples].

## PolyBase
PolyBase is a technology that uses Transact-SQL select statements to import data from Azure blob storage or Hadoop into SQL Data Warehouse. 

PolyBase can:

- Import data from Azure blob storage to SQL Data Warehouse.

PolyBase can*not*:

- Perform additional import scenarios in this release.  

PolyBase is faster than ADF Copy. If you don't mind using two tools, you could use ADF Copy to export data to Azure blob storage, and then use PolyBase to import data from Azure blob storage to SQL Data Warehouse.

> [AZURE.NOTE] PolyBase requires your data files to be in UTF-8. This is ADF Copy's default encoding so there is nothing to change. This is just a reminder to not change the default behavior of ADF Copy.


## Integration Services ##
SQL Server's Integration Services (SSIS), is a powerful and flexible extract, transform, and load (ETL) tool that supports complex workflows, data transformations, and several data loading options.

Integration Serivces can:

- Export data from SQL Server to Azure blob storage
- Export data from SQL Server directly to SQL Data Warehouse
- Import data from text-delimited files for transfer to a supported destination

Integration Services can*not*:

- Import data from Azure blob storage
 

> [AZURE.NOTE] For compatibility with PolyBase, configure Integration Services to export data with UTF-8 encoding without the byte order mark in the file. To configure this, first use the derived column component to convert the character data in the data flow to use the 65001 UTF-8 code page. Once the columns have been converted write the data to the flat file destination adapter ensuring that 65001 has also been selected as the code page for the file.

To connect to SQL Data Warehouse with Integration Services:

- Use the SQL Server destination
- Use an ADO.NET connection manager.
- Configure the "" setting to maximize throughput.

> [AZURE.NOTE] Integration Services does not support OLE DB connections to SQL Data Warehouse. 

Recommendations:

- There is always the possibility that a package might fail due to throttling or network issues. Design packages so you can resume them in at the point of failure, without redoing work that completed before the failure.

For more information, see [Integration Services (SSIS) Packages].

### bcp ##
bcp is SQL Server's Bulk Copy Command-line Utility. It is designed to import and export data from and to text-delimited files. bcp can perform simple transformations during the data export. For example, you can use bcp to run a query that selects and transforms the data before the export.

bcp can:

- Export data from SQL Server to text-delimited files
- Import on-premises text-delimited files directly to SQL Data Warehouse

bcp can*not*:

- Import or export to or from Azure blob storage.


> [AZURE.NOTE] Consider encapsulating the transformations used during data export in a view on the source system. This ensures that the logic is retained and the process is repeatable.

Advantages of bcp:

+ Simplicity. bcp commands are simple to build and execute
+ Re-startable load process. Once exported the load can be executed any number of times

Limitations of bcp:

- bcp works with text-delimited flat files only. It does not work with files in other formats such as XML or JSON.
- bcp does not support export to UTF-8. This may prevent using PolyBase to load data exported by bcp.
- Limited data transformation capabilities. bcp supports simple transformations for data export only.
- bcp does not recover from network errors when loading over the internet. Any network instability may cause a load error.
- bcp requires the scheme is present in the target database prior to the load

Example export:
```

```

Example load:
```

```

To install bcp:

- Install the client tools as part of your installation for SQL Server 2008 R2 or later. 
- Or, [Download SQL Server client tools][] from MSDN.

### ExpressRoute ###
You can consider using [ExpressRoute] to speed up the transfer. [ExpressRoute] provides you with an established private connection to Azure so the connection does not go over the public internet. This is by no means a mandatory step. However, it will improve throughput when pushing data to Azure from an on-premises or co-location facility.

[ExpressRoute] benefits:

1. Increased reliability
2. Faster network speed
3. Lower network latency
4. higher network security

ExpressRoute is beneficial for a number of scenarios; not just the migration.

Interested? For more information and pricing please visit the [ExpressRoute documentation]

### Azure Import and Export Service ###
The Azure Import and Export Service is a data transfer process designed for large (GB++) to massive (TB++) transfers of data into Azure. It involves writing your data to disks and shipping them to an Azure data center. Microsoft will then load the disk contents into Azure blob storage on your behalf.

To use the Azure Import and Export Service:

1. Configure an Azure blob storage container to receive the data.
2. Export your data to local storage.
2. Copy the data to 3.5 inch SATA II/III hard disk drives using the [Azure Import/Export Tool].
3. Create an import job using the Azure Import and Export Service providing the journal files produced by the [Azure Import/Export Tool].
4. Ship the disks to your nominated Azure data center.
5. Microsoft transfers your data to your Azure blob storage container.
6. Load the data into SQL Data Warehouse by using PolyBase

### AZCopy utility ###
The [AZCopy] utility is a great tool for getting your data transferred into Azure storage blobs. It is designed for small (MB++) to very large (GB++) data transfers. [AZCopy] has also been designed to provide good resilient throughput when transferring data to Azure and so is a great choice for the data transfer step. Once transferred you can load the data  into SQL Data Warehouse by using PolyBase. You can also incorporate AZCopy into your SSIS packages using an "Execute Process" task.

To use [AZCopy] you will first need to download and install it. There is a [production version] and a [preview version] available.

To upload a file from your file system you will need a command like the one below:
```
AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:key /Pattern:abc.txt
```

To use AZCopy:

1. Configure an Azure blob storage container to receive the data.
2. Export your data to local storage.
3. Use [AZCopy] to copy your data into the Azure blob storage container.
4. Load the data into SQL Data Warehouse by using PolyBase.

For documentation, see [AZCopy].
  


## Next steps ##
To create your migration plan, see [Migrate data with PolyBase][].

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png

<!--Link references--In actual articles, you only need a single period before the slash.-->
[Data migration overview]: ./sql-data-warehouse-migrate-data/


<!--External references-->
[ExpressRoute]: http://azure.microsoft.com/en-gb/services/expressroute/
[AZCopy]: http://azure.microsoft.com/en-gb/documentation/articles/storage-use-azcopy/
[ADF Copy]: http://azure.microsoft.com/en-gb/documentation/articles/data-factory-copy-activity/
[production version]: http://aka.ms/downloadazcopy
[preview version]: http://aka.ms/downloadazcopypr
[ADF Copy examples]: http://azure.microsoft.com/en-gb/documentation/articles/data-factory-copy-activity-examples/
[Integration Services (SSIS) Packages]: https://technet.microsoft.com/en-US/library/ms141134.aspx/
[SSDT]
[Download SQL Server client tools]: http://www.microsoft.com/en-us/download/details.aspx?id=36433/
