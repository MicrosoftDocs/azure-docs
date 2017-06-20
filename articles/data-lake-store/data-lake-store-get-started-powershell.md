---
title: Use PowerShell to get started with Azure Data Lake Store | Microsoft Docs
description: Use Azure PowerShell to create a Data Lake Store account and perform basic operations
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: bf85f369-f9aa-4ca1-9ae7-e03a78eb7290
ms.service: data-lake-store
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/06/2017
ms.author: nitinme

---
# Get started with Azure Data Lake Store using Azure PowerShell
> [!div class="op_single_selector"]
> * [Portal](data-lake-store-get-started-portal.md)
> * [PowerShell](data-lake-store-get-started-powershell.md)
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Azure CLI](data-lake-store-get-started-cli.md)
> * [Azure CLI 2.0](data-lake-store-get-started-cli-2.0.md)
> * [Node.js](data-lake-store-manage-use-nodejs.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

Learn how to use Azure PowerShell to create an Azure Data Lake Store account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake Store, see [Overview of Data Lake Store](data-lake-store-overview.md).

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Azure PowerShell 1.0 or greater**. See [How to install and configure Azure PowerShell](/powershell/azure/overview).

## Authentication
This article uses a simpler authentication approach with Data Lake Store where you are prompted to enter your Azure account credentials. The access level to Data Lake Store account and file system is then governed by the access level of the logged in user. However, there are other approaches as well to authenticate with Data Lake Store, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [Authenticate with Data Lake Store using Azure Active Directory](data-lake-store-authenticate-using-active-directory.md).

## Create an Azure Data Lake Store account
1. From your desktop, open a new Windows PowerShell window, and enter the following snippet to log in to your Azure account, set the subscription, and register the Data Lake Store provider. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

        # Log in to your Azure account
        Login-AzureRmAccount

        # List all the subscriptions associated to your account
        Get-AzureRmSubscription

        # Select a subscription
        Set-AzureRmContext -SubscriptionId <subscription ID>

        # Register for Azure Data Lake Store
        Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.DataLakeStore"
2. An Azure Data Lake Store account is associated with an Azure Resource Group. Start by creating an Azure Resource Group.

        $resourceGroupName = "<your new resource group name>"
        New-AzureRmResourceGroup -Name $resourceGroupName -Location "East US 2"

    ![Create an Azure Resource Group](./media/data-lake-store-get-started-powershell/ADL.PS.CreateResourceGroup.png "Create an Azure Resource Group")
3. Create an Azure Data Lake Store account. The name you specify must only contain lowercase letters and numbers.

        $dataLakeStoreName = "<your new Data Lake Store name>"
        New-AzureRmDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStoreName -Location "East US 2"

    ![Create an Azure Data Lake Store account](./media/data-lake-store-get-started-powershell/ADL.PS.CreateADLAcc.png "Create an Azure Data Lake Store account")
4. Verify that the account is successfully created.

        Test-AzureRmDataLakeStoreAccount -Name $dataLakeStoreName

    The output for this should be **True**.

## Create directory structures in your Azure Data Lake Store
You can create directories under your Azure Data Lake Store account to manage and store data.

1. Specify a root directory.

        $myrootdir = "/"
2. Create a new directory called **mynewdirectory** under the specified root.

        New-AzureRmDataLakeStoreItem -Folder -AccountName $dataLakeStoreName -Path $myrootdir/mynewdirectory
3. Verify that the new directory is successfully created.

        Get-AzureRmDataLakeStoreChildItem -AccountName $dataLakeStoreName -Path $myrootdir

    It should show an output like the following:

    ![Verify Directory](./media/data-lake-store-get-started-powershell/ADL.PS.Verify.Dir.Creation.png "Verify Directory")

## Upload data to your Azure Data Lake Store
You can upload your data to Data Lake Store directly at the root level or to a directory that you created within the account. The snippets below demonstrate how to upload some sample data to the directory (**mynewdirectory**) you created in the previous section.

If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/MicrosoftBigData/usql/tree/master/Examples/Samples/Data/AmbulanceData). Download the file and store it in a local directory on your computer, such as  C:\sampledata\.

    Import-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path "C:\sampledata\vehicle1_09142014.csv" -Destination $myrootdir\mynewdirectory\vehicle1_09142014.csv


## Rename, download, and delete data from your Data Lake Store
To rename a file, use the following command:

    Move-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path $myrootdir\mynewdirectory\vehicle1_09142014.csv -Destination $myrootdir\mynewdirectory\vehicle1_09142014_Copy.csv

To download a file, use the following command:

    Export-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path $myrootdir\mynewdirectory\vehicle1_09142014_Copy.csv -Destination "C:\sampledata\vehicle1_09142014_Copy.csv"

To delete a file, use the following command:

    Remove-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Paths $myrootdir\mynewdirectory\vehicle1_09142014_Copy.csv

When prompted, enter **Y** to delete the item. If you have more than one file to delete, you can provide all the paths separated by comma.

    Remove-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Paths $myrootdir\mynewdirectory\vehicle1_09142014.csv, $myrootdir\mynewdirectoryvehicle1_09142014_Copy.csv

## Delete your Azure Data Lake Store account
Use the following command to delete your Data Lake Store account.

    Remove-AzureRmDataLakeStoreAccount -Name $dataLakeStoreName

When prompted, enter **Y** to delete the account.

## Performance guidance while using PowerShell

Below are the most important settings that can be tuned to get the best performance while using PowerShell to work with Data Lake Store:

| Property            | Default | Description |
|---------------------|---------|-------------|
| PerFileThreadCount  | 10      | This parameter enables you to choose the number of parallel threads for uploading or downloading each file. This number represents the max threads that can be allocated per file, but you may get less threads depending on your scenario (e.g. if you are uploading a 1KB file, you will get one thread even if you ask for 20 threads).  |
| ConcurrentFileCount | 10      | This parameter is specifically for uploading or downloading folders. This parameter determines the number of concurrent files that can be uploaded or downloaded. This number represents the maximum number of concurrent files that can be uploaded or downloaded at one time, but you may get less concurrency depending on your scenario (e.g. if you are uploading two files, you will get two concurrent file uploads even if you ask for 15). |

**Example**

This command downloads files from Azure Data Lake Store to the user's local drive using 20 threads per file and 100 concurrent files.

	Export-AzureRmDataLakeStoreItem -AccountName <Data Lake Store account name> -PerFileThreadCount 20-ConcurrentFileCount 100 -Path /Powershell/100GB/ -Destination C:\Performance\ -Force -Recurse

### How do I determine the value to set for these parameters?

Here's some guidance that you can use.

* **Step 1: Determine the total thread count** - You should start by calculating the total thread count to use. As a general guideline, you should use 6 threads for each physical core.

		Total thread count = total physical cores * 6

	**Example**

	Assuming you are running the PowerShell commands from a D14 VM that has 16 cores

		Total thread count = 16 cores * 6 = 96 threads


* **Step 2: Calculate PerFileThreadCount**  - We calculate our PerFileThreadCount based on the size of the files. For files smaller than 2.5GB, there is no need to change this parameter because the default of 10 is sufficient. For files larger than 2.5GB, you should use 10 threads as the base for the first 2.5GB and add 1 thread for each additional 256MB increase in file size. If you are copying a folder with a large range of file sizes, consider grouping them into similar file sizes. Having dissimilar file sizes may cause non-optimal performance. If that's not possible to group similar file sizes, you should set PerFileThreadCount based on the largest file size.

		PerFileThreadCount = 10 threads for the first 2.5GB + 1 thread for each additional 256MB increase in file size

	**Example**

	Assuming you have 100 files ranging from 1GB to 10GB, we use the 10GB as the largest file size for equation, which would read like the following.

		PerFileThreadCount = 10 + ((10GB - 2.5GB) / 256MB) = 40 threads

* **Step 3: Calculate ConcurrentFilecount** - Use the total thread count and PerFileThreadCount to calculate ConcurrentFileCount based on the following equation.

		Total thread count = PerFileThreadCount * ConcurrentFileCount

	**Example**

	Based on the example values we have been using

		96 = 40 * ConcurrentFileCount

	So, **ConcurrentFileCount** is **2.4**, which we can round off to **2**.

### Further tuning

You might require further tuning because there is a range of file sizes to work with. The above calculation works well if all or most of the files are larger and closer to the 10GB range. If instead, there are many different files sizes with many files being smaller, then you could reduce PerFileThreadCount. By reducing the PerFileThreadCount, we can increase ConcurrentFileCount. So, if we assume that most of our files are smaller in the 5GB range, we can re-do our calculation:

	PerFileThreadCount = 10 + ((5GB - 2.5GB) / 256MB) = 20

So, **ConcurrentFileCount** will now be 96/20, which is 4.8, rounded off to **4**.

You can continue to tune these settings by changing the **PerFileThreadCount** up and down depending on the distribution of your file sizes.

### Limitation

* **Number of files is less than ConcurrentFileCount**: If the number of files you are uploading is smaller than the **ConcurrentFileCount** that you calculated, then you should reduce **ConcurrentFileCount** to be equal to the number of files. You can use any remaining threads to increase **PerFileThreadCount**.

* **Too many threads**: If you increase thread count too much without increasing your cluster size, you run the risk of degraded performance. There can be contention issues when context-switching on the CPU.

* **Insufficient concurrency**: If the concurrency is not sufficient, then your cluster may be too small. You can increase the number of nodes in your cluster which will give you more concurrency.

* **Throttling errors**: You may see throttling errors if your concurrency is too high. If you are seeing throttling errors, you should either reduce the concurrency or contact us.

## Next steps
* [Secure data in Data Lake Store](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)

