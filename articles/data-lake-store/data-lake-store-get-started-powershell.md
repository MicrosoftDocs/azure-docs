<properties 
   pageTitle="Get started with Data Lake Store | Azure" 
   description="Use Azure PowerShell to create a Data Lake Store account and perform basic operations" 
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
   ms.date="10/27/2015"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using Azure PowerShell

> [AZURE.SELECTOR]
- [Portal](data-lake-store-get-started-portal.md)
- [PowerShell](data-lake-store-get-started-powershell.md)
- [.NET SDK](data-lake-store-get-started-net-sdk.md)
- [Azure CLI](data-lake-store-get-started-cli.md)

Learn how to use Azure PowerShell to create an Azure Data Lake Store account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake Store, see [Overview of Data Lake Store](data-lake-store-overview.md).

## Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Azure PowerShell**. See [Install and configure Azure PowerShell](../install-configure-powershell.md) for instructions.

## Create an Azure Data Lake Store account

1. From your desktop, open a new Azure PowerShell window, and enter the following snippet to log in to your Azure account, set the subscription, and register the Data Lake Store provider. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

        # Log in to your Azure account
		Login-AzureRmAccount
        
		# List all the subscriptions associated to your account
		Get-AzureRmSubscription
		
		# Select a subscription 
		Set-AzureRMContext -SubscriptionName <subscription name>
        
		# Register for Azure Data Lake Store
		Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.DataLake" 


2. An Azure Data Lake Store account is associated with an Azure Resource Group. Start by creating an Azure Resource Group.

		$resourceGroupName = "<your new resource group name>"
    	New-AzureRmResourceGroup -Name $resourceGroupName -Location "East US 2"

	![Create an Azure Resource Group](./media/data-lake-store-get-started-powershell/ADL.PS.CreateResourceGroup.png "Create an Azure Resource Group")

2. Create an Azure Data Lake Store account. The name you specify must only contain lowercase letters and numbers.

		$dataLakeStoreName = "<your new Data Lake Store name>"
    	New-AzureRmDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStoreName -Location "East US 2"

	![Create an Azure Data Lake Store account](./media/data-lake-store-get-started-powershell/ADL.PS.CreateADLAcc.png "Create an Azure Data Lake Store account")

3. Verify that the account is successfully created.

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

If you are looking for some sample data to upload, you can get the **OlympicAthletes.tsv** file from the [AzureDataLake Git Repository](https://github.com/MicrosoftBigData/AzureDataLake/raw/master/Samples/SampleData/OlympicAthletes.tsv). Download the file and store it in a local directory on your computer, such as  C:\sampledata\.

	Import-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path "C:\sampledata\OlympicAthletes.tsv" -Destination $myrootdir\mynewdirectory\OlympicAthletes.tsv


## Rename, download, and delete data from your Data Lake Store

To rename a file, use the following command:

    Move-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path $myrootdir\mynewdirectory\OlympicAthletes.tsv -Destination $myrootdir\mynewdirectory\OlympicAthletes_Copy.tsv

To download a file, use the following command:

	Export-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path $myrootdir\mynewdirectory\OlympicAthletes_Copy.tsv -Destination "C:\sampledata\OlympicAthletes_Copy.tsv"

To delete a file, use the following command:

	Remove-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Paths $myrootdir\mynewdirectory\OlympicAthletes_Copy.tsv 
	
When prompted, enter **Y** to delete the item. If you have more than one file to delete, you can provide all the paths separated by comma.

	Remove-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Paths $myrootdir\mynewdirectory\OlympicAthletes.tsv, $myrootdir\mynewdirectory\OlympicAthletes_Copy.tsv

## Delete your Azure Data Lake Store account

Use the following command to delete your Data Lake Store account.

	Remove-AzureRmDataLakeAccount -Name $dataLakeStoreName

When prompted, enter **Y** to delete the account.

	
## See Also

- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get Started with Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)