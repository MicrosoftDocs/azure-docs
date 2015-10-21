<properties 
   pageTitle="Get started with Azure Data Lake Analytics using .NET SDK | Azure" 
   description="Learn how to use the .NET SDK to create a Data Lake Store account, create a Data Lake Analytics job using U-SQL, and submit the job. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/21/2015"
   ms.author="edmaca"/>

# Tutorial: Get Started with Azure Data Lake Analytics using .NET SDK

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

>[AZURE.NOTE] This article is still under development.

Learn how to use Microsoft .NET SDK to create an Azure Data Lake Analytics account, define a Data Lake Analytics
job in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit the job. This job reads a tab separated values (TSV) file and convert it into a comma 
separated values (CSV) file. For more information about Data Lake Analytics, see 
[Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

To go through the same tutorial using other supported tools, click the tabs on the top of this section.

**Basic Data Lake Analytics process:**

![Azure Data Lake Analytics process flow diagram](./media/data-lake-analytics-get-started-portal/data-lake-analytics-process.png)

1. Create a Data Lake Analytics account.
2. Prepare/upload the source data.
3. Develop a U-SQL script.
4. Submit a job (U-SQL script) to the Data Lake Analytics account. The job reads the data from Data Lake Store accounts and/or Azure Blob 
storage accounts, process the data as instructed in the U-SQL script, and save the output to a Data Lake Store 
account or an Azure Blob storage account.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial]https://azure.microsoft.com/en-us/pricing/free-trial/).
- **Visual Studio**. 

##Create Data Lake Analytics account


##Upload data to Data Lake


##Submit Data Lake Analytics jobs


## See also

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To see a more complexed query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

