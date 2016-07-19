<properties
   pageTitle="Copy data from Azure Storage Blobs into Data Lake Store| Microsoft Azure"
   description="Use AdlCopy tool to copy data from Azure Storage Blobs to Data Lake Store"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/07/2016"
   ms.author="nitinme"/>

# Copy data from Azure Storage Blobs to Data Lake Store

Azure Data Lake Store provides a command line tool, [AdlCopy](http://aka.ms/downloadadlcopy), to copy data **from Azure Storage Blobs into Data Lake Store**. You cannot use AdlCopy to copy data from Data Lake Store to Azure Storage blobs.

You can use the AdlCopy tool in two ways:

* **Standalone**, where the tool uses Data Lake Store resources to perform the task.
* **Using a Data Lake Analytics account**, where the units assigned to your Data Lake Analytics account are used to perform the copy operation. You might want to use this option when you are looking to perform the copy tasks in a predictable manner.

##Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).
- **Azure Storage Blobs** container with some data.
- **Azure Data Lake Analytics account (optional)** - See [Get started with Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-get-started-portal.md) for instructions on how to create a Data Lake Store account.
- **AdlCopy tool**. Install the AdlCopy tool from [http://aka.ms/downloadadlcopy](http://aka.ms/downloadadlcopy).

## Syntax of the AdlCopy tool

Use the following syntax to work with the AdlCopy tool

	AdlCopy /Source <Blob source> /Dest <ADLS destination> /SourceKey <Key for Blob account> /Account <ADLA account> /Unit <Number of Analytics units>

The parameters in the syntax are described below:

| Option    | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
|-----------|------------|
| Source    | Specifies the location of the source data in the Azure storage blob. The source can be a blob container or a blob                                                                                                                                                                                                                                                                                                    |
| Dest      | Specifies the Data Lake Store destination to copy to.                                                                                                                                                                                                                                                                                                                                                                |
| SourceKey | Specifies the storage access key for the Azure storage blob source.                                                                                                                                                                                                                                                                                                                                                  |
| Account   | **Optional**. Use this if you want to use Azure Data Lake Analytics account to run the copy job. If you use the /Account option in the syntax but do not specify a Data Lake Analytics account, AdlCopy uses a default account to run the job. Also, if you use this option, you must add the source (Azure Storage Blob) and destination (Azure Data Lake Store) as data sources for your Data Lake Analytics account.  |
| Units     |  Specifies the number of Data Lake Analytics units that will be used for the copy job. This option is mandatory if you use the **/Account** option to specify the Data Lake Analytics account.                                                                                                                                                                                                                                                                                                                                               



## Use AdlCopy tool as standalone

1. Open a command prompt and navigate to the directory where AdlCopy is installed, typically `%HOMEPATH%\Documents\adlcopy`.

2. Run the following command to copy a specific blob from the source container to a Data Lake Store:

		AdlCopy /source https://<source_account>.blob.core.windows.net/<source_container>/<blob name> /dest swebhdfs://<dest_adls_account>.azuredatalakestore.net/<dest_folder>/ /sourcekey <storage_account_key_for_storage_container>

	For example:

		AdlCopy /Source https://mystorage.blob.core.windows.net/mycluster/HdiSamples/WebsiteLogSampleData/SampleLog/909f2b.log /dest swebhdfs://mydatalakestore.azuredatalakestore.net/mynewfolder/ /sourcekey uJUfvD6cEvhfLoBae2yyQf8t9/BpbWZ4XoYj4kAS5Jf40pZaMNf0q6a8yqTxktwVgRED4vPHeh/50iS9atS5LQ==

	You will be prompted to enter the credentials for the Azure subscription under which you have your Data Lake Store account. You will see an output similar to the following:

		Initializing Copy.
		Copy Started.
		...............
		0.00% data copied.
		. . .
		. . .
		100% data copied.
		Finishing copy.
		....
		Copy Completed.

1. You can also copy all the blobs from one container to the Data Lake Store account using the following command:

		AdlCopy /source https://<source_account>.blob.core.windows.net/<source_container>/ /dest swebhdfs://<dest_adls_account>.azuredatalakestore.net/<dest_folder>/ /sourcekey <storage_account_key_for_storage_container>		

	For example:

		AdlCopy /Source https://mystorage.blob.core.windows.net/mycluster/example/data/gutenberg/ /dest swebhdfs://mydatalakestore.azuredatalakestore.net/mynewfolder/ /sourcekey uJUfvD6cEvhfLoBae2yyQf8t9/BpbWZ4XoYj4kAS5Jf40pZaMNf0q6a8yqTxktwVgRED4vPHeh/50iS9atS5LQ==



## Use AdlCopy with Data Lake Analytics account

You can also use your Data Lake Analytics account to run the AdlCopy job to copy data from Azure storage blobs to Data Lake Store. You would typically use this option when the data to be moved is in the range of gigabytes and terabytes, and you want better and predictable performance throughput.

To use your Data Lake Analytics account with AdlCopy, both the source (Azure Storage Blob) and destination (Azure Data Lake Store) must be added as data sources for your Data Lake Analytics account. For instructions on adding additional data sources to your Data Lake Analytics account, see [Manage Data Lake Analytics account data sources](..//data-lake-analytics/data-lake-analytics-manage-use-portal.md#manage-account-data-sources).

Run the following command:

	AdlCopy /source https://<source_account>.blob.core.windows.net/<source_container>/<blob name> /dest swebhdfs://<dest_adls_account>.azuredatalakestore.net/<dest_folder>/ /sourcekey <storage_account_key_for_storage_container> /Account <data_lake_analytics_account> /Unit <number_of_data_lake_analytics_units_to_be_used>

For example:

	AdlCopy /Source https://mystorage.blob.core.windows.net/mycluster/example/data/gutenberg/ /dest swebhdfs://mydatalakestore.azuredatalakestore.net/mynewfolder/ /sourcekey uJUfvD6cEvhfLoBae2yyQf8t9/BpbWZ4XoYj4kAS5Jf40pZaMNf0q6a8yqTxktwVgRED4vPHeh/50iS9atS5LQ== /Account mydatalakeaccount /Units 2

## Billing

* If you use the AdlCopy tool as standalone you will be billed for egress costs for moving data, if the source Azure Storage account is not in the same region as the Data Lake Store.

* If you use the AdlCopy tool with your Data Lake Analytics account, standard [Data Lake Analytics billing rates](https://azure.microsoft.com/pricing/details/data-lake-analytics/) will apply.

## Considerations for using AdlCopy

* AdlCopy (for version 1.0.4), supports copying data from sources that collectively have more than thousands of files and folders. However, if you encounter issues copying a large dataset, you can distribute the files/folders into different sub-folders and use the path to those sub-folders as the source instead.

## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
