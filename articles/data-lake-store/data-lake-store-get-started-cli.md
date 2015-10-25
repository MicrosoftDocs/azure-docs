<properties 
   pageTitle="Get started with Data Lake Store using cross-platform command line interface| Azure" 
   description="Use Azure cross-platform command line to create a Data Lake Store account and perform basic operations" 
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
   ms.date="10/28/2015"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using Azure Command Line

> [AZURE.SELECTOR]
- [Using Portal](data-lake-store-get-started-portal.md)
- [Using PowerShell](data-lake-store-get-started-powershell.md)
- [Using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Using Azure CLI](data-lake-store-get-started-cli.md)

Learn how to use Azure command line interface to create an Azure Data Lake Store account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake Store, see [Overview of Data Lake Store](data-lake-store-overview.md).

The Azure CLI is implemented in Node.js. It can be used on any platform that supports Node.js, including Windows, Mac, and Linux. The Azure CLI is open source. The source code is managed in GitHub at <a href= "https://github.com/azure/azure-xplat-cli">https://github.com/azure/azure-xplat-cli</a>. This article covers only using the Azure CLI with Data Lake Store. For a general guide on how to use Azure CLI, see [How to use the Azure CLI] [azure-command-line-tools].


##Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/en-us/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup). 
- **Azure CLI** - See [Install and configure the Azure CLI](../xplat-cli-install.md) for installation and configuration information. Make your reboot your computer after you install the CLI.

##Login to your Azure subscription

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](xplat-cli-connect.md) and connect to your subscription using the __login__ method.


## Create an Azure Data Lake Store account

Open a command prompt, shell, or a terminal session and run the following commands.

1. Log in to your Azure subscription:

		azure login

	You will be prompted to open a web page and enter an authentication code. Follow the instructions on the page to log in to your Azure subscription. 

2. List the Azure subscriptions for your account.

		azure account list


3. If you have multiple Azure subscriptions, use the following command to set the subscription that the Azure CLI commands will use:

		azure account set <subscriptionname>

4. Create a new resource group. In the following command, provide the parameter values you want to use.

		azure group create <resourceGroup> <location>

5. Create the Data Lake Store account.

		azure datalake store account create <dataLakeStoreAccountName> <location> <resourceGroup>

## Create directory structures in your Data Lake Store



## Upload data to your Data Lake Store


## List files in Data Lake Store


## Rename, download, and delete data from your Data Lake Store


## View the access control list for a folder in Data Lake Store


## Delete your Data Lake Store account



## See Also

- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get Started with Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Get Started with Data Lake Store using PowerShell](data-lake-store-get-started-powershell.md)


[azure-command-line-tools]: ../xplat-cli-install.md