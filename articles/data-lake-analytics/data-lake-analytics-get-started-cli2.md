---
title: Get started with Azure Data Lake Analytics using Azure CLI 2.0 | Microsoft Docs
description: 'Learn how to use the Azure Command-line Interface 2.0 to create a Data Lake Analytics account, create a Data Lake Analytics job using U-SQL, and submit the job. '
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.service: data-lake-analytics
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/06/2017
ms.author: jgao

---
# Tutorial: get started with Azure Data Lake Analytics using Azure CLI 2.0 (Preview)
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use Azure CLI 2.0 to create Azure Data Lake Analytics accounts, define Data Lake Analytics
jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to Data Lake Analytics accounts. For more 
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

In this tutorial, you develop a job that reads a tab separated values (TSV) file and converts it into a comma 
separated values (CSV) file. To go through the same tutorial using other supported tools, use the dropdown list on the top of this section.

## Prerequisites
Before you begin this tutorial, you must have the following items:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Azure CLI 2.0**. See [Install and configure Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).
* **Enable Data Lake Store/Analytics CLI 2.0 Preview**. Data Lake Store and Data Lake Analytics CLI 2.0 is still in Preview. Run the following commands to enable both:

    ```azurecli
    az component update --add dls
    az component update --add dla 
    ```

## Log in to Azure

To log in to your Azure subscription:

```azurecli
az login
```

You are requested to browse to a URL, and enter an authentication code.  And then follow the instructions to enter your credentials.

Once you have logged in, the login command lists your subscriptions.

To use a specific subscription:

```azurecli
az account set --subscription <subscription id>
```

## Create Data Lake Analytics account
You need a Data Lake Analytics account before you can run any jobs. To create a Data Lake Analytics account, you must specify the following items:

* **Azure Resource Group**. A Data Lake Analytics account must be created within a Azure Resource group. [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.  
  
    To list the existing resource groups under your subscription:
  
    ```azurecli
    az group list 
    ```

    To create a new resource group:
  
    ```azurecli
    az group create --name "<Resource Group Name>" --location "<Azure Location>"
    ```

* **Data Lake Analytics account name**. Each Data Lake Analytics account has a name.
* **Location**. Use one of the Azure data centers that supports Data Lake Analytics.
* **Default Data Lake Store account**: Each Data Lake Analytics account has a default Data Lake Store account.
  
    To list the existing Data Lake Store account:

    ```azurecli
    az dls account list
    ```
  
    To create a new Data Lake Store account:
  
    ```azurecli
    az dls account create --account "<Data Lake Store Account Name>" --resource-group "<Resource Group Name>"
    ```

Use the following syntax to create a Data Lake Analytics account:

```azurecli
az dla account create --account "<Data Lake Analytics Account Name>" --resource-group "<Resource Group Name>" --location "<Azure location>" --default-data-lake-store "<Default Data Lake Store Account Name>"
```

After creating an account, you can use the following commands to list the accounts and show account details:

```azurecli
az dla account list
az dla account show --account "<Data Lake Analytics Account Name>"            
```

## Upload data to Data Lake Store
In this tutorial, you process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

The Azure portal provides a user interface for copying some sample data files to the default Data Lake Store account, which include a search log file. See [Prepare source data](data-lake-analytics-get-started-portal.md#prepare-source-data) to upload the data to the default Data Lake Store account.

To upload files using CLI 2,0, use the following commands:

```azurecli
az dls fs upload --account "<Data Lake Store Account Name>" --source-path "<Source File Path>" --destination-path "<Destination File Path>"
az dls fs list --account "<Data Lake Store Account Name>" --path "<Path>"
```

Data Lake Analytics can also access Azure Blob storage.  For uploading data to Azure Blob storage, see [Using the Azure CLI with Azure Storage](../storage/storage-azure-cli.md).

## Submit Data Lake Analytics jobs
The Data Lake Analytics jobs are written in the U-SQL language. To learn more about U-SQL, see [Get started with U-SQL language](data-lake-analytics-u-sql-get-started.md) and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).

**To create a Data Lake Analytics job script**

Create a text file with following U-SQL script, and save the text file to your workstation:
  
    @searchlog =
        EXTRACT UserId          int,
                Start           DateTime,
                Region          string,
                Query           string,
                Duration        int?,
                Urls            string,
                ClickedUrls     string
        FROM "/Samples/Data/SearchLog.tsv"
        USING Extractors.Tsv();

    OUTPUT @searchlog   
        TO "/Output/SearchLog-from-Data-Lake.csv"
    USING Outputters.Csv();
  
This U-SQL script reads the source data file using **Extractors.Tsv()**, and then creates a csv file using **Outputters.Csv()**. 

Don't modify the two paths unless you copy the source file into a different location.  Data Lake Analytics will create the output folder if it doesn't exist.

It is simpler to use relative paths for files stored in default Data Lake Store accounts. You can also use absolute paths.  For example:

    adl://<Data LakeStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv

You must use absolute paths to access files in linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:

    wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv
  
  > [!NOTE]
  > Azure Blob container with public blobs or public containers access permissions are not currently supported.      
  > 
  > 

**To submit jobs**

Use the following syntax to submit a job.

```azurecli
az dla job submit --account "<Data Lake Analytics Account Name>" --job-name "<Job Name>" --script "<Script Path and Name>"
```

For example:

```azurecli
az dla job submit --account "myadlaaccount" --job-name "myadlajob" --script @"C:\DLA\myscript.txt"
```

**To list jobs and show job details**

```azurecli
az dla job list --account "<Data Lake Analytics Account Name>"
az dla job show --account "<Data Lake Analytics Account Name>" --job-identity "<Job Id>"
```

**To cancel jobs**

```azurecli
az dla job cancel --account "<Data Lake Analytics Account Name>" --job-identity "<Job Id>"
```

##Retrieve job results

After a job is completed, you can use the following commands to list the output files, and download the files:

```azurecli
az dls fs list --account "<Data Lake Store Account Name>" --source-path "/Output" --destination-path "<Destintion>"
az dls fs preview --account "<Data Lake Store Account Name>" --path "/Output/SearchLog-from-Data-Lake.csv" 
az dls fs preview --account "<Data Lake Store Account Name>" --path "/Output/SearchLog-from-Data-Lake.csv" --length 128 --offset 0
az dls fs downlod --account "<Data Lake Store Account Name>" --source-path "/Output/SearchLog-from-Data-Lake.csv" --destintion-path "<Destination Path and File Name>"
```

For example:

```azurecli
az dls fs downlod --account "myadlsaccount" --source-path "/Output/SearchLog-from-Data-Lake.csv" --destintion-path "C:\DLA\myfile.csv"
```

## Next steps

* To see the same tutorial using other tools, click the tab selectors on the top of the page.
* To see the Data Lake Analytics CLI 2.0 reference document, see[Data Lake Analytics - az dla](https://docs.microsoft.com/cli/azure/dla).
* To see the Data Lake Store CLI 2.0 reference document, see[Data Lake Store - az dls](https://docs.microsoft.com/cli/azure/dls).
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

