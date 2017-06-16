---
title: Learn Data Lake Analytics and U-SQL using the Azure portal Interactive tutorials | Microsoft Docs
description: 'Quick start with learning Data Lake Analytics and U-SQL. '
services: data-lake-analytics
documentationcenter: ''
author: edmacauley
manager: jhubbard
editor: cgronlun

ms.assetid: 31399d47-e937-4c43-ab0a-6aea8875378d
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/05/2016
ms.author: edmaca

---
# Use Azure Data Lake Analytics interactive tutorials
The Azure portal provides an interactive tutorial for you to get started with Data Lake Analytics. This article shows you how to go through the tutorial for analyzing website logs.

For other tutorials, see:

* [Get started with Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md)
* [Get started with Data Lake Analytics using Azure PowerShell](data-lake-analytics-get-started-powershell.md)
* [Get started with Data Lake Analytics using .NET SDK](data-lake-analytics-get-started-net-sdk.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md) 

**Prerequisites**

Before you begin this tutorial, you must have the following:

* **A Data Lake Analytics account**.  See [Get Started with Azure Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md).

## Create Data Lake Analytics account
You must have a Data Lake Analytics account before you can run any jobs.

Each Data Lake Analytics account has an [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md) account dependency, the default Data Lake 
Store account.  In this tutorial, you will create the default Data Lake Store account with the Analytics account, but you can create it beforehand as well.

**To create a Data Lake Analytics account**

1. Sign on to the [Azure portal](https://portal.azure.com/signin/index/?Microsoft_Azure_Kona=true&Microsoft_Azure_DataLake=true&hubsExtension_ItemHideKey=AzureDataLake_BigStorage%2cAzureKona_BigCompute).
2. Click **Microsoft Azure** in the upper left corner to open the StartBoard.
3. Click the **Marketplace** tile.  
4. Type **Azure Data Lake Analytics** in the search box on the **Everything** blade, and the press **ENTER**. You shall see **Azure Data Lake Analytics** in the list.
5. Click **Azure Data Lake Analytics** from the list.
6. Click **Create** on the bottom of the blade.
7. Type or select:
   
    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-create-adla.png)
   
   * **Name**: Name the Analytics account.
   * **Data Lake Store**: Each Data Lake Analytics account has a dependent Data Lake Store account. The Data Lake Analytics account and the dependent Data Lake Store account must be located in the same Azure data center. Follow the instruction to create a Data Lake Store account, or select an existing one.
   * **Subscription**: Choose the Azure subscription used for the Analytics account.
   * **Resource Group**. Select an existing Azure Resource Group or create a new one. Applications are typically made up of many components, for example a web app, database, database server, storage, and third party services. Azure Resource Manager (ARM) enables you to work with the resources in your application as a group, referred to as an Azure Resource Group. You can deploy, update, monitor, or delete the resources for your application in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging,and production. You can clarify billing for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure Resource Manager Overview](../azure-resource-manager/resource-group-overview.md). 
   * **Location**. Select an Azure data center for the Data Lake Analytics account. 
8. Select **Pin to Startboard**. This is required for following this tutorial.
9. Click **Create**. It takes you to the portal StartBoard. A new tile is added to the Home page with the label showing "Deploying Azure Data Lake Analytics." It takes a few moments to create a Data Lake Analytics account. When the account is created, the portal opens the account on a new blade.
   
    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-blade.png)

## Run Website Log Analysis interactive tutorial
**To open the Website Log Analytics interactive tutorial**

1. From the Portal, click **Microsoft Azure** from the left menu to open the StartBoard.
2. Click the tile that is linked to your Data Lake Analytics account.
3. Click **Explore interactive tutorials** from the **Essentials** bar.
   
    ![Data Lake Analytics interactive tutorials](./media/data-lake-analytics-use-interactive-tutorials/data-lake-analytics-explore-interactive-tutorials.png)
4. If you see an orange warning saying "Samples not set up, click ...", click **Copy Sample Data** to copy the sample data to the default Data Lake Store account. The interactive tutorial needs the data to run.
5. From the **Interactive Tutorials** blade, click **Website Log Analytics**. The portal opens the tutorial in a new portal blade.
6. Click **Introduction** and then follow the instructions

## See also
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md)
* [Get started with Data Lake Analytics using Azure PowerShell](data-lake-analytics-get-started-powershell.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md)

