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
   ms.date="12/04/2015"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using Azure PowerShell

> [AZURE.SELECTOR]
- [Using Portal](data-lake-store-get-started-portal.md)
- [Using PowerShell](data-lake-store-get-started-powershell.md)
- [Using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Using Azure CLI](data-lake-store-get-started-cli.md)
- [Using Node.js](data-lake-store-manage-use-nodejs.md)

Learn how to use Azure PowerShell to create an Azure Data Lake Store account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake Store, see [Overview of Data Lake Store](data-lake-store-overview.md).

## Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).


##Install Azure PowerShell 1.0 and greater

To begin with, you must uninstall the 0.9x versions of Azure PowerShell. To check the version of the installed PowerShell, run the following command from a PowerShell window:

	Get-Module *azure*
	
To uninstall the older version, run **Programs and Features** in the control panel and remove the installed version if it's earlier than PowerShell 1.0. 

There are two main options for installing Azure PowerShell. 

- [PowerShell Gallery](https://www.powershellgallery.com/). Run the following commands from elevated PowerShell ISE or elevated Windows PowerShell console:

		# Install the Azure Resource Manager modules from PowerShell Gallery
		Install-Module AzureRM
		Install-AzureRM
		
		# Install the Azure Service Management module from PowerShell Gallery
		Install-Module Azure
		
		# Import AzureRM modules for the given version manifest in the AzureRM module
		Import-AzureRM
		
		# Import Azure Service Management module
		Import-Module Azure

	For more information, see [PowerShell Gallery](https://www.powershellgallery.com/).

- [Microsoft Web Platform Installer (WebPI)](http://aka.ms/webpi-azps). If you have Azure PowerShell 0.9.x installed, you will be prompted to uninstall 0.9.x. If you installed Azure PowerShell modules from PowerShell Gallery, the installer requires the modules be removed prior to installation to ensure a consistent Azure PowerShell Environment. For the instructions, see [Install Azure PowerShell 1.0 via WebPI](https://azure.microsoft.com/blog/azps-1-0/).

WebPI will receive monthly updates. PowerShell Gallery will receive updates on a continuous basis. If you are comfortable with installing from PowerShell Gallery, that will be the first channel for the latest and greatest in Azure PowerShell.

## Create an Azure Data Lake Store account

1. From your desktop, open a new Azure PowerShell window, and enter the following snippet to log in to your Azure account, set the subscription, and register the Data Lake Store provider. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

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

If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/MicrosoftBigData/AzureDataLake/tree/master/SQLIPSamples/SampleData/AmbulanceData). Download the file and store it in a local directory on your computer, such as  C:\sampledata\.

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


## Other ways of creating a Data Lake Store account

- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get Started with Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Get Started with Data Lake Store using Azure CLI](data-lake-store-get-started-cli.md)


## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)

