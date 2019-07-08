---
title: Get started with Azure Data Lake Analytics using Azure CLI
description: Learn how to use the Azure Command-line Interface to create an Azure Data Lake Analytics account and submit a U-SQL job.
ms.service: data-lake-analytics
services: data-lake-analytics
author: saveenr
ms.author: saveenr
ms.reviewer: jasonwhowell
ms.topic: conceptual
ms.date: 06/18/2017
---
# Get started with Azure Data Lake Analytics using Azure CLI
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

This article describes how to use the Azure CLI command-line interface to create Azure Data Lake Analytics accounts, submit USQL jobs, and catalogs. The job reads a tab separated values (TSV) file and converts it into a comma-separated values (CSV) file. 

## Prerequisites
Before you begin, you need the following items:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* This article requires that you are running the Azure CLI version 2.0 or later. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 



## Log in to Azure

To log in to your Azure subscription:

```
azurecli
az login
```

You are requested to browse to a URL, and enter an authentication code.  And then follow the instructions to enter your credentials.

Once you have logged in, the login command lists your subscriptions.

To use a specific subscription:

```
az account set --subscription <subscription id>
```

## Create Data Lake Analytics account
You need a Data Lake Analytics account before you can run any jobs. To create a Data Lake Analytics account, you must specify the following items:

* **Azure Resource Group**. A Data Lake Analytics account must be created within an Azure Resource group. [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) enables you to work with the resources in your application as a group. You can deploy, update, or delete all of the resources for your application in a single, coordinated operation.  

To list the existing resource groups under your subscription:

```
az group list
```

To create a new resource group:

```
az group create --name "<Resource Group Name>" --location "<Azure Location>"
```

* **Data Lake Analytics account name**. Each Data Lake Analytics account has a name.
* **Location**. Use one of the Azure data centers that supports Data Lake Analytics.
* **Default Data Lake Store account**: Each Data Lake Analytics account has a default Data Lake Store account.

To list the existing Data Lake Store account:

```
az dls account list
```

To create a new Data Lake Store account:

```azurecli
az dls account create --account "<Data Lake Store Account Name>" --resource-group "<Resource Group Name>"
```

Use the following syntax to create a Data Lake Analytics account:

```
az dla account create --account "<Data Lake Analytics Account Name>" --resource-group "<Resource Group Name>" --location "<Azure location>" --default-data-lake-store "<Default Data Lake Store Account Name>"
```

After creating an account, you can use the following commands to list the accounts and show account details:

```
az dla account list
az dla account show --account "<Data Lake Analytics Account Name>"            
```

## Upload data to Data Lake Store
In this tutorial, you process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage.

The Azure portal provides a user interface for copying some sample data files to the default Data Lake Store account, which include a search log file. See [Prepare source data](data-lake-analytics-get-started-portal.md) to upload the data to the default Data Lake Store account.

To upload files using Azure CLI, use the following commands:

```
az dls fs upload --account "<Data Lake Store Account Name>" --source-path "<Source File Path>" --destination-path "<Destination File Path>"
az dls fs list --account "<Data Lake Store Account Name>" --path "<Path>"
```

Data Lake Analytics can also access Azure Blob storage.  For uploading data to Azure Blob storage, see [Using the Azure CLI with Azure Storage](../storage/common/storage-azure-cli.md).

## Submit Data Lake Analytics jobs
The Data Lake Analytics jobs are written in the U-SQL language. To learn more about U-SQL, see [Get started with U-SQL language](data-lake-analytics-u-sql-get-started.md) and [U-SQL language reference](https://docs.microsoft.com/u-sql/).

**To create a Data Lake Analytics job script**

Create a text file with following U-SQL script, and save the text file to your workstation:

```
@a  = 
    SELECT * FROM 
        (VALUES
            ("Contoso", 1500.0),
            ("Woodgrove", 2700.0)
        ) AS 
              D( customer, amount );
OUTPUT @a
    TO "/data.csv"
    USING Outputters.Csv();
```

This U-SQL script reads the source data file using **Extractors.Tsv()**, and then creates a csv file using **Outputters.Csv()**.

Don't modify the two paths unless you copy the source file into a different location.  Data Lake Analytics creates the output folder if it doesn't exist.

It is simpler to use relative paths for files stored in default Data Lake Store accounts. You can also use absolute paths.  For example:

```
adl://<Data LakeStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv
```

You must use absolute paths to access files in linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:

```
wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv
```

> [!NOTE]
> Azure Blob container with public blobs are not supported.      
> Azure Blob container with public containers are not supported.      
>

**To submit jobs**

Use the following syntax to submit a job.

```
az dla job submit --account "<Data Lake Analytics Account Name>" --job-name "<Job Name>" --script "<Script Path and Name>"
```

For example:

```
az dla job submit --account "myadlaaccount" --job-name "myadlajob" --script @"C:\DLA\myscript.txt"
```

**To list jobs and show job details**

```
azurecli
az dla job list --account "<Data Lake Analytics Account Name>"
az dla job show --account "<Data Lake Analytics Account Name>" --job-identity "<Job Id>"
```

**To cancel jobs**

```
az dla job cancel --account "<Data Lake Analytics Account Name>" --job-identity "<Job Id>"
```

## Retrieve job results

After a job is completed, you can use the following commands to list the output files, and download the files:

```
az dls fs list --account "<Data Lake Store Account Name>" --source-path "/Output" --destination-path "<Destination>"
az dls fs preview --account "<Data Lake Store Account Name>" --path "/Output/SearchLog-from-Data-Lake.csv"
az dls fs preview --account "<Data Lake Store Account Name>" --path "/Output/SearchLog-from-Data-Lake.csv" --length 128 --offset 0
az dls fs download --account "<Data Lake Store Account Name>" --source-path "/Output/SearchLog-from-Data-Lake.csv" --destination-path "<Destination Path and File Name>"
```

For example:

```
az dls fs download --account "myadlsaccount" --source-path "/Output/SearchLog-from-Data-Lake.csv" --destination-path "C:\DLA\myfile.csv"
```

## Next steps

* To see the Data Lake Analytics Azure CLI reference document, see [Data Lake Analytics](/cli/azure/dla).
* To see the Data Lake Store Azure CLI reference document, see [Data Lake Store](/cli/azure/dls).
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
