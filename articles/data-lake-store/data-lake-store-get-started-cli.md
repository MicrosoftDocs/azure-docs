<properties
   pageTitle="Get started with Data Lake Store using cross-platform command line interface | Microsoft Azure"
   description="Use Azure cross-platform command line to create a Data Lake Store account and perform basic operations"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/07/2016"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using Azure Command Line

> [AZURE.SELECTOR]
- [Portal](data-lake-store-get-started-portal.md)
- [PowerShell](data-lake-store-get-started-powershell.md)
- [.NET SDK](data-lake-store-get-started-net-sdk.md)
- [Java SDK](data-lake-store-get-started-java-sdk.md)
- [REST API](data-lake-store-get-started-rest-api.md)
- [Azure CLI](data-lake-store-get-started-cli.md)
- [Node.js](data-lake-store-manage-use-nodejs.md)

Learn how to use Azure command line interface to create an Azure Data Lake Store account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake Store, see [Overview of Data Lake Store](data-lake-store-overview.md).

The Azure CLI is implemented in Node.js. It can be used on any platform that supports Node.js, including Windows, Mac, and Linux. The Azure CLI is open source. The source code is managed in GitHub at <a href= "https://github.com/azure/azure-xplat-cli">https://github.com/azure/azure-xplat-cli</a>. This article covers only using the Azure CLI with Data Lake Store. For a general guide on how to use Azure CLI, see [How to use the Azure CLI] [azure-command-line-tools].


##Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).
- **Azure CLI** - See [Install and configure the Azure CLI](../xplat-cli-install.md) for installation and configuration information. Make sure you reboot your computer after you install the CLI.

##Login to your Azure subscription

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md) and connect to your subscription using the __login__ method.


## Create an Azure Data Lake Store account

Open a command prompt, shell, or a terminal session and run the following commands.

1. Log in to your Azure subscription:

		azure login

	You will be prompted to open a web page and enter an authentication code. Follow the instructions on the page to log in to your Azure subscription.

2. Switch to Azure Resource Manager mode using the following command:

		azure config mode arm


3. List the Azure subscriptions for your account.

		azure account list


4. If you have multiple Azure subscriptions, use the following command to set the subscription that the Azure CLI commands will use:

		azure account set <subscriptionname>

5. Create a new resource group. In the following command, provide the parameter values you want to use.

		azure group create <resourceGroup> <location>

	If the location name contains spaces, put it in quotes. For example "East US 2".

5. Create the Data Lake Store account.

		azure datalake store account create <dataLakeStoreAccountName> <location> <resourceGroup>

## Create folders in your Data Lake Store

You can create folders under your Azure Data Lake Store account to manage and store data. Use the following command to create a folder called "mynewfolder" at the root of the Data Lake Store.

	azure datalake store filesystem create <dataLakeStoreAccountName> <path> --folder

For example:

	azure datalake store filesystem create mynewdatalakestore /mynewfolder --folder

## Upload data to your Data Lake Store

You can upload your data to Data Lake Store directly at the root level or to a folder that you created within the account. The snippets below demonstrate how to upload some sample data to the folder (**mynewfolder**) you created in the previous section.

If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/MicrosoftBigData/usql/tree/master/Examples/Samples/Data/AmbulanceData). Download the file and store it in a local directory on your computer, such as  C:\sampledata\.

	azure datalake store filesystem import <dataLakeStoreAccountName> "<source path>" "<destination path>"

For example:

	azure datalake store filesystem import mynewdatalakestore "C:\SampleData\AmbulanceData\vehicle1_09142014.csv" "/mynewfolder/vehicle1_09142014.csv"


## List files in Data Lake Store

Use the following command to list the files in a Data Lake Store account.

	azure datalake store filesystem list <dataLakeStoreAccountName> <path>

For example:

	azure datalake store filesystem list mynewdatalakestore /mynewfolder

The output of this should be similar to the following:

	info:    Executing command datalake store filesystem list
	data:    accessTime: 1446245025257
	data:    blockSize: 268435456
	data:    group: NotSupportYet
	data:    length: 1589881
	data:    modificationTime: 1446245105763
	data:    owner: NotSupportYet
	data:    pathSuffix: vehicle1_09142014.csv
	data:    permission: 777
	data:    replication: 0
	data:    type: FILE
	data:    ------------------------------------------------------------------------------------
	info:    datalake store filesystem list command OK

## Rename, download, and delete data from your Data Lake Store

* **To rename a file**, use the following command:

    	azure datalake store filesystem move <dataLakeStoreAccountName> <path/old_file_name> <path/new_file_name>

	For example:

		azure datalake store filesystem move mynewdatalakestore /mynewfolder/vehicle1_09142014.csv /mynewfolder/vehicle1_09142014_copy.csv

* **To download a file**, use the following command. Make sure the destination path you specify already exists.

		azure datalake store filesystem export <dataLakeStoreAccountName> <source_path> <destination_path>

	For example:

		azure datalake store filesystem export mynewdatalakestore /mynewfolder/vehicle1_09142014_copy.csv "C:\mysampledata\vehicle1_09142014_copy.csv"

* **To delete a file**, use the following command:

		azure datalake store filesystem delete <dataLakeStoreAccountName> <path>

	For example:

		azure datalake store filesystem delete mynewdatalakestore /mynewfolder/vehicle1_09142014_copy.csv

	When prompted, enter **Y** to delete the item.

## View the access control list for a folder in Data Lake Store

Use the following command to view the ACLs on a Data Lake Store folder. In the current release, ACLs can be set only on the root of the Data Lake Store. So, the path parameter below will always be root (/).

	azure datalake store permissions show <dataLakeStoreName> <path>

For example:

	azure datalake store permissions show mynewdatalakestore /


## Delete your Data Lake Store account

Use the following command to delete a Data Lake Store account.

	azure datalake store account delete <dataLakeStoreAccountName>

For example:

	azure datalake store account delete mynewdatalakestore

When prompted, enter **Y** to delete the account.


## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)


[azure-command-line-tools]: ../xplat-cli-install.md
