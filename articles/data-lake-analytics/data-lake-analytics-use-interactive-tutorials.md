<properties 
   pageTitle="Learn Data Lake Analytics and U-SQL using the Azure Preview portal Interactive tutorials | Azure" 
   description="Quick start with learning Data Lake Analytics and U-SQL. " 
   services="big-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="big-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="jgao"/>


# Use Azure Data Lake Analytics interactive tutorials

The Azure preview portal provides several interactive tutorials for you to get started with Data Lake Analytics. This articles shows you how to go through one of the tutorials for analyzing website logs.

>[AZURE.NOTE] Currently, there is only one tutorial.

For other tutorials, see:

- [Get started with Data Lake Analytics using PowerShell](data-lake-analytics-get-started-powershell.md)
- [Get started with Data Lake Analytics using the Azure portal](data-lake-analytics-get-started-portal.md)
- [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md) 
- [Manage Azure Data Lake Analytics using portal](data-lake-analytics-manage-use-portal.md)

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **A Data Lake Analytics account**.  See [Get Started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md).


##Create a Data Lake Analytics account [jgao: copied from the hero tutorial to make this tutorial complete.]

You must have an ADL Analytic account before you can run jobs.

Each ADL Analytics account has an [Azure Data Lake storage]() account dependency.  This account is referred
as the default ADL Storage account.  You can create the Data Lake storage account beforehand or when you create 
your ADL Analytics account. In this tutorial, you will create the ADL Storage account with the Analytics 
account

**To create an ADL Analytics account**

1. Sign on to the new [Azure portal](https://portal.azure.com/signin/index/?Microsoft_Azure_Kona=true&Microsoft_Azure_DataLake=true&hubsExtension_ItemHideKey=AzureDataLake_BigStorage%2cAzureKona_BigCompute).
2. Click **Microsoft Azure** in the upper left corner to open the StartBoard.
3. Click the **Marketplace** tile.  
3. Type **Azure Data Lake Analytics** in the search box on the **Everything** blade, and the press **ENTER**. You shall see **Azure Data Lake Analytics** in the list.
4. Click **Azure Data Lake Analytics** from the list.
5. Click **Create** on the bottom of the blade.
6. Type or select the following:

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-create-adla.png)

	- **Name**: Name the Analytics account.
	- **Data Lake Store**: Each ADL Analytics account has a dependent ADL Storage account. The ADL Analytics account and the dependent ADL Storage account must be located in the same Azure data center. Follow the instruction to create a new ADL Storage account, or select an existing one.
	- **Subscription**: Choose the Azure subscription used for the Analytics account.
	- **Resource Group**. Select an existing Azure Resource Group or create a new one. Applications are typically made up of many components, for example a web app, database, database server, storage, and 3rd party services. Azure Resource Manager (ARM) enables you to work with the resources in your application as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the resources for your application in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging and production. You can clarify billing for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure Resource Manager Overview](resource-group-overview.md). 
	- **Location**. Select an Azure data center for the ADL Analytics account. 
7. Select **Pin to Startboard**. This is required for following this tutorial.
8. Click **Create**. It takes you to the portal StartBoard. A new tile is added to the Home page with the label showing "Deploying Azure Data Lake Analytics". It takes a few moments to create an ADL Analytics account. When the account is created, the portal opens the account on a new blade.

	![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-blade.png)

##Run the Website Log Analysis interactive tutorial

**To open the Website Log Analytics interactive tutorial**

1. From the preview portal, click **Microsoft Azure** from the left menu to open the StartBoard.
2. Click the tile that is linked to your Data Lake Analytics account.
3. Click **Explore interactive tutorials** from the **Essentials** bar.

	![Data Lake Analytics interactive tutorials](./media/data-lake-analytics-use-interactive-tutorials/data-lake-analytics-explore-interactive-tutorials.png)

4. From the **Interactive Tutorials** blade, click **Website Log Analytics**. The portal opens the tutorial in a new portal blade.
5. Click **1 Introduction** and then follow the instructions

##See also

- [Get started with Data Lake Analytics using PowerShell](data-lake-analytics-get-started-powershell.md)
- [Get started with Data Lake Analytics using the Azure portal](data-lake-analytics-get-started-portal.md)
- [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md) 
- [Manage Azure Data Lake Analytics using portal](data-lake-analytics-manage-use-portal.md)
