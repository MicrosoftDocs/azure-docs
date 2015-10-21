<properties 
   pageTitle="Get Started with Azure Data Lake Analytics using Azure Preview Portal | Azure" 
   description="Learn how to use the Azure Preview portal to create a Data Lake Analytics account, create a Data Lake Analytics job using U-SQL, and submit the job. " 
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
   ms.author="jgao"/>

# Tutorial: get started with Azure Data Lake Analytics using Azure Preview Portal

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use the Azure Preview portal to create an Azure Data Lake Analytics account, define a Data Lake Analytics
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

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/en-us/pricing/free-trial/).

##Create Data Lake Analytics account

You must have a Data Lake Analytic account before you can run jobs.

Each Data Lake Analytics account has an [Azure Data Lake Store]() account dependency.  This account is referred
as the default Data Lake Store account.  You can create the Data Lake Store account beforehand or when you create 
your Data Lake Analytics account. In this tutorial, you will create the Data Lake Store account with the Analytics 
account

**To create a Data Lake Analytics account**

1. Sign on to the new [Azure portal](https://portal.azure.com).
2. Click **New**, click **Data + Analytics**, and then click **Data Lake Analytics**.
6. Type or select the following:

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-create-adla.png)

	- **Name**: Name the Analytics account.
	- **Data Lake Store**: Each Data Lake Analytics account has a dependent Data Lake Store account. The Data Lake Analytics account and the dependent Data Lake Store account must be located in the same Azure data center. Follow the instruction to create a new Data Lake Store account, or select an existing one.
	- **Subscription**: Choose the Azure subscription used for the Analytics account.
	- **Resource Group**. Select an existing Azure Resource Group or create a new one. Azure Resource Manager (ARM) enables you to work with the resources in your application as a group. For more information, see [Azure Resource Manager Overview](resource-group-overview.md). 
	- **Location**. Select an Azure data center for the Data Lake Analytics account. 
7. Select **Pin to StartBoard**. This is required for following this tutorial.
8. Click **Create**. It takes you to the portal StartBoard. A new tile is added to the StartBoard with the label showing "Deploying Azure Data Lake Analytics". It takes a few moments to create a Data Lake Analytics account. When the account is created, the portal opens the account on a new blade.

	![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-blade.png)


After an Analytics account is created, you can add additional Data Lake Store accounts and Azure Storage 
accounts. For instructions, see [Manage account data sources](data-lake-analytics-manage-use-portal.md#manage-account-data-sources).

##Upload data to the default Data Lake Store account

In this tutorial, you will process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

The Azure Preview portal provides an user interface to copy some sample data files, which include a search log file.

**To copy sample data files**

1. From the Azure preview portal, click **Microsoft Azure** in the upper left corner.
2. Click the tile with your Data Lake Analytics account name.  It was pinned here when the account was created.
If the account is not pinned there, see 
[Open an Analytics account from portal](data-lake-analytics-manage-use-portal.md#access-adla-account) to open the
account.
3. Expand the **Essentials** pane, and then click **Explore sample jobs**. It opens another blade called **Sample
Jobs**.
4. Click **Copy Sample Data**, and then click **OK** to confirm.
5. Click **Notification** which is a bell shaped icon. You shall see a log saying **Updating sample data completed**.
6. Click anywhere outside the notification pane to close it.
7. From the Data Lake analytics account blade, click **Data Explorer** on the top. 

	![Azure Data Lake Analytics data explorer button](./media/data-lake-analytics-get-started-portal/data-lake-analytics-data-explorer-button.png)

    It opens two blades. One is **Data Explorer**, and the other is the Default Data Lake Store account.
8. In the default Data Lake Store account blade, click **Samples** to expand the folder, and the click **Data** to expand the folder. You shall see the following files and folders:

    - AmbulanceData
    - AdsLog.tsv
    - SearchLog.tsv
    - version.txt
    - WebLog.log
    
    In this tutorial, you will use SearchLog.tsv.

In practice, you will either program your applications to write data into the linked Storage accounts or upload data. For uploading files, see 
[Manage Data Lake Analytics using Portal](data-lake-analytics-manage-use-portal.md#upload-data). 

##Create and submit Data Lake Analytics jobs

After you have prepared the inbound data, you can start developing your U-SQL script.  

**To submit the job**

1. From the Data Lake analytics account blade, click **New Job** on the top. 

	![Azure Data Lake Analytics new job button](./media/data-lake-analytics-get-started-portal/data-lake-analytics-new-job-button.png)

    If you don't see the blade, see [Open an Analytics account from portal](data-lake-analytics-manage-use-portal.md#access-adla-account).
4. Enter a Job name, and the following U-SQL script:

	![create Azure Data Lake Analytics U-SQL jobs](./media/data-lake-analytics-get-started-portal/data-lake-analytics-new-job.png)

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

	This U-SQL script reads the input data file using **Extractors.Tsv()**, and then creates a csv file using
    **Outputters.Csv()*. 
    
    Notice the paths are relative paths, because it is simpler to use relative paths for the files stored in the default data Lake account. You can also use absolute path.  For example 
    
        adl://<Data LakeStorageAccountName>.azuredatalake.net/Samples/Data/SearchLog.tsv
        
    You must use absolute path to access the files in the linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:
    
        wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

    >[AZURE.NOTE] Azure Blob container with public blobs or public containers access permissions are not currently supported.    

    For more about U-SQL, see [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=690701).
     
5. Click **Submit Job** from the top. A new Job Details pane opens. On the title bar, it shows the job status.   
6. Wait until the job status is changed to **Succeeded**. When the job is completed, the portal opens the job details in a new blade.

    ![Azure Data Lake Analytics job details](./media/data-lake-analytics-get-started-portal/data-lake-analytics-job-completed.png)

    From the previous screenshot, you can see the job took roughly 1.5 minutes to complete.
    
    In case the job failed, see [Monitor and troubleshoot Data Lake Analytics jobs](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorials.md).

7. At the bottom of the Job Detail blade, click the job name in **SearchLog-from-Data-Lake.csv**. You can preview, download, rename, and delete the output file.

    ![Azure Data Lake Analytics job output file properties](./media/data-lake-analytics-get-started-portal/data-lake-analytics-output-file-properties.png)
8. Click **Preview** to see the output file.

    ![Azure Data Lake Analytics job output file preview](./media/data-lake-analytics-get-started-portal/data-lake-analytics-job-output-preview.png)

##See also

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To see a more complexed query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
