<properties 
   pageTitle="Get Started with Azure Data Lake Analytics using Azure portal | Azure" 
   description="Learn how to use the Azure portal to create a Data Lake Analytics account, create a Data Lake Analytics job using U-SQL, and submit the job. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="edmacauley" 
   manager="jhubbard" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/06/2016"
   ms.author="edmaca"/>

# Tutorial: get started with Azure Data Lake Analytics using Azure portal

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use the Azure portal to create Azure Data Lake Analytics accounts, define Data Lake Analytics
jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to the Data Lake Analytics service. For more 
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

In this tutorial, you develop a job that reads a tab separated values (TSV) file and converts it into a comma 
separated values (CSV) file. To go through the same tutorial using other supported tools, click the tabs on the top of this section. Once your first job succeeds, you can start to write more complex data transformations with U-SQL.

##Prerequisites

Before you begin this tutorial, you must have the following:

- **A Data Lake Analytics account**. To create one, see [Manage Data Lake Analytics accounts](data-lake-analytics-get-started-portal.md#manage-accounts).

##Prepare source data

In this tutorial, you process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

The Azure portal provides a user interface for copying some sample data files to the default Data Lake account, which include a search log file.

**To copy sample data files**

1. From the [Azure portal](https://portal.azure.com), open your Data Lake Analytics account.  See [Manage Data Lake Analytics accounts](data-lake-analytics-get-started-portal.md#manage-accounts) to create one and open the account in the portal.
3. Expand the **Essentials** pane, and then click **Explore sample scripts**. It opens another blade called **Sample
Scripts**.

	![Azure Data Lake Analytics portal sample script](./media/data-lake-analytics-get-started-portal/data-lake-analytics-portal-sample-scripts.png)

4. Click **Copy Sample Data**, and then click **OK** to confirm.
5. Click **Notification** which is a bell shaped icon. You shall see a log saying **Updating sample data completed**. Click anywhere outside the notification pane to close it.
7. From the Data Lake analytics account blade, click **Data Explorer** on the top. 

	![Azure Data Lake Analytics data explorer button](./media/data-lake-analytics-get-started-portal/data-lake-analytics-data-explorer-button.png)

    It opens two blades. One is **Data Explorer**, and the other is the default Data Lake Store account.
8. In the default Data Lake Store account blade, click **Samples** to expand the folder, and the click **Data** to expand the folder. You shall see the following files and folders:

    - AmbulanceData/
    - AdsLog.tsv
    - SearchLog.tsv
    - version.txt
    - WebLog.log
    
    In this tutorial, you use SearchLog.tsv.

In practice, you will either program your applications to write data into a linked storage accounts or upload data. For uploading files, see 
[Upload data to Data Lake Store](data-lake-analytics-manage-use-portal.md#upload-data-to-adls) or [Upload data to Blob storage](data-lake-analytics-manage-use-portal.md#upload-data-to-wasb).

##Create and submit Data Lake Analytics jobs

After you have prepared the source data, you can start developing a U-SQL script.  

**To submit the job**

1. From the Data Lake analytics account blade on the portal, click **New Job**. 

	![Azure Data Lake Analytics new job button](./media/data-lake-analytics-get-started-portal/data-lake-analytics-new-job-button.png)

    If you don't see the blade, see [Open a Data Lake Analytics account from portal](data-lake-analytics-manage-use-portal.md#access-adla-account).
4. Enter **Job Name**, and the following U-SQL script:

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

	This U-SQL script reads the source data file using **Extractors.Tsv()**, and then creates a csv file using **Outputters.Csv()**. 
    
    Don't modify the two paths unless you copy the source file into a different location.  Data Lake Analytics creates the output folder if it doesn't exist.  In this case, we are using simple, relative paths.  
	
	It is simpler to use relative paths for files stored in default Data Lake accounts. You can also use absolute paths.  For example 
    
        adl://<Data LakeStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv
      

    For more about U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md) and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).
     
5. Click **Submit Job** from the top. A new Job Details pane opens. On the title bar, it shows the job status.   
6. Wait until the job status is changed to **Succeeded**. When the job is completed, the portal opens the job details in a new blade:

    ![Azure Data Lake Analytics job details](./media/data-lake-analytics-get-started-portal/data-lake-analytics-job-completed.png)

    From the previous screenshot, you can see the job took roughly 1.5 minutes to complete from Submitted to Ended.
    
    In case the job failed, see [Monitor and troubleshoot Data Lake Analytics jobs](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorials.md).

7. At the bottom of the **Job Detail** blade, click the job name in **SearchLog-from-Data-Lake.csv**. You can preview, download, rename, and delete the output file.

    ![Azure Data Lake Analytics job output file properties](./media/data-lake-analytics-get-started-portal/data-lake-analytics-output-file-properties.png)
8. Click **Preview** to see the output file.

    ![Azure Data Lake Analytics job output file preview](./media/data-lake-analytics-get-started-portal/data-lake-analytics-job-output-preview.png)

##See also

- To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
