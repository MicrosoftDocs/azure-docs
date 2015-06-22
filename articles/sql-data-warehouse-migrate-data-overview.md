<properties
   pageTitle="Data migration tools | Microsoft Azure"
   description="Since PolyBase is the fastest way to import data into SQL Data Warehouse, this article focuses on migration strategies that use PolyBase to perform the data import."
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

# Data migration overview#
This explains the overall process for creating a robust, re-startable and resilient migration process that maximizes performance at each step. Since PolyBase is the fastest way to import data into SQL Data Warehouse, this article focuses on migration strategies that use PolyBase to perform the data import.

The strategy for migrating your data to SQL Data Warehouse depends on where your existing data is located, how large your data is, and how fast you need to populate your SQL Data Warehouse database. 

To import data with PolyBase, follow the guidance in this article to successfully perform these migration steps:

1. Export the source data into text-delimited files
2. Transfer the data to Azure blob storage
3. Import data into SQL Data Warehouse by using PolyBase Transact-SQL commands

### Before you begin
See [Data Migration Tools] to learn more about each of the tools and processes that you can choose to use in your data migration plan.

## Export the source data
To use PolyBase to import data into SQL Data Warehouse, you need to export your data to meet PolyBase requirements.

### Encoding
PolyBase requires data files to be UTF-8 encoded. This means that when you export your data it must conform to this requirement. If your data only contains basic ASCII characters, not extended ASCII, then these map directly to the UTF-8 standard and you don't have to worry too much about the encoding. However, if your data contains any special characters such as umlauts, accents or symbols, or your data supports non-latin languages then you will have to ensure that your export files are properly UTF-8 encoded.

> [AZURE.NOTE] bcp.exe does not support exporting data to UTF-8. Therefore your best option is to use either Integration Services or ADF Copy for the data export. It is worth pointing out that the UTF-8 byte order mark (BOM) is not required in the data file.

Any files encoded using UTF-16 will need to be re-written ***prior*** to the data transfer.

### Format of data files ###
PolyBase mandates a fixed row terminator of \n or newline. Your data files must conform to this standard. There aren't any restrictions on string or column terminators.

You will have to define every column in the file as part of your external table in PolyBase. Make sure that all exported columns are required and that the types conform to the required standards.

Refer to the [migrate your schema] article for details on supported data types.

### Data Compression ###
PolyBase can read GZIP compressed data. If you are able to compress your data to gzip files then you will minimize the amount of data being pushed over the network.

### Multiple Files ###
Breaking up large tables into several files not only helps to improve export speed but it also helps with transfer re-startability and also the overall manageability of the data once in Azure blob storage. One of the many nice features of PolyBase is that it will read all the files inside a folder and treat it as one table. It is therefore a good idea to isolate the files for each table into its own folder.

PolyBase also supports a feature known as "recursive folder traversal". This means you can organize your data files into subfolders as a way of improving your data management.

## Transfer data to Azure blob storage ##
The slowest part of data migration is transferring data from on-premises to Azure. Not only can network bandwidth be an issue but also network reliability can seriously hamper progress. By default migrating data to Azure is over the internet so the chances of transfer errors occurring are likely. These errors might require data to be re-sent either in whole or in part.

Fortunately you have several options to improve the speed and resilience of this process.

> [AZURE.NOTE] PolyBase in SQL Data Warehouse only imports text-delimited files from Azure blob storage.  Consequently, to use PolyBase, you need to first transfer the data into Azure blob storage.

### ExpressRoute ###
You can consider using [ExpressRoute] to speed up the transfer. [ExpressRoute] provides you with an established private connection to Azure so the connection does not go over the public internet. This is by no means a mandatory step. However, it will improve throughput when pushing data to Azure from an on-premises or co-location facility.

[ExpressRoute] benefits:

1. Increased reliability
2. Faster network speed
3. Lower network latency
4. higher network security

ExpressRoute is beneficial for a number of other scenarios besides data migration.

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

## Import data into SQL Data Warehouse
For the final step, use PolyBase to import data from Azure blob storage to SQL Data Warehouse.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps ##

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png

<!--Link references--In actual articles, you only need a single period before the slash.-->
[Data Migration Tools]: ./sql-data-warehouse-migrate-data-tools.md

<!--External references-->
[ExpressRoute]: http://azure.microsoft.com/en-gb/services/expressroute/
[AZCopy]: http://azure.microsoft.com/en-gb/documentation/articles/storage-use-azcopy/
[ADF Copy]: http://azure.microsoft.com/en-gb/documentation/articles/data-factory-copy-activity/
[production version]: http://aka.ms/downloadazcopy/
[preview version]: http://aka.ms/downloadazcopypr/
[ADF Copy examples]: http://azure.microsoft.com/en-gb/documentation/articles/data-factory-copy-activity-examples/

