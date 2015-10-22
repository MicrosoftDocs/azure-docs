<properties 
   pageTitle="Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Preview Portal | Azure" 
   description="Learn how to use the Azure Preview Portal to monitor and troubleshoot Data Lake Analytics jobs. " 
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
   ms.date="10/19/2015"
   ms.author="jgao"/>

# Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Preview Portal

Learn how to use the Azure Preview Portal to monitor and troubleshoot Data Lake Analytics jobs.

In this tutorial, you will setup a missing source file problem, and use the Azure Preview Portal to troubleshoot the problem.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **Basic knowledge of Data Lake Analytics job process**. See [Get started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-use-portal.md).
- **A Data Lake Analytics account**. See [Get started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-use-portal.md#create-adl-analytics-account).

>[AZURE.NOTE] Don't upload the sample data files. If you have uploaded the file, [find the default Storage account](data-lake-analytics-manage-use-portal.md#default-adl-account), and the [delete the files]((data-lake-analytics-manage-use-portal.md#explore-data-sources)).

##Create and submit ADL Analytics jobs

Now you will create a job with the source file missing.  

**To submit the job**

1. From the Azure preview portal, click **Microsoft Azure** in the upper left corner.
2. Click the tile with your ADL Analytics account name.  It was pinned here when the account was created.
If the account is not pinned there, see 
[Open an Analytics account from portal](data-lake-analytics-manage-use-portal.md#access-adla-account).
3. Click **New Job** from the top menu.
4. Enter a Job name, and the following U-SQL script:

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
            TO "/output/SearchLog-from-adls.csv"
        USING Outputters.Csv();

    The source file defined in the script is **/Samples/Data/SearchLog.tsv**. It doesn't exist yet.   
     
5. Click **Submit Job** from the top. A new Job Details pane opens. On the title bar, it shows the job status. It takes a few minutes to finish. You can click **Refresh** to get the latest status.
6. Wait until the job status is changed to **Failed**.  If the job is Succeeded**, it is because you didn't remove the /Samples folder. See the **Prerequisite** section at the beginning of the tutorial.

You might be wondering - why it takes so long for a small job.  Remember Data Lake Analytics is designed to process big data.  It shines when processing a large amount of data using its distributed system.

Let's assume you submitted the job, and close the portal.  In the next section, you will learn how to monitor the jobs.  You must remember the job name.


## Monitor and troubleshoot the job

In the last section, you have submitted a job, and the job failed.  

**To see all the jobs**

1. From the Azure portal, click **Microsoft Azure** in the upper left corner.
2. Click the tile with your ADL Analytics account name.  The job summary is shown on the **Job Management** tile.

    ![Azure Data Lake Analytics job management](./media/data-lake-analytics-monitor-and-troubleshoot-tutorial/data-lake-analytics-job-management.png)
    
    The job Management gives you a glance of the job status.
   
3. Click the **Job Management** tile to see the jobs. The jobs are categorized in **Running**, **Queued**, and **Ended**. You shall see your failed job in the **Ended** section. It shall be first one in the list.
4. Click the failed job from the list to open the job details in a new blade:

    ![Azure Data Lake Analytics failed job](./media/data-lake-analytics-monitor-and-troubleshoot-tutorial/data-lake-analytics-failed-job.png)
    
    Notice the **Resubmit** button. After you fix the problem, you can resubmit the job.

5. Click highlighted part from the previous screenshot to open the error details.  You shall see something like:

        Compilation failed.
        E_STORE_USER_FAILURE: Directory mafs://accounts/jgao1003dls/fs/Samples/Data/ does not exist.
        Description:
        A user operation has resulted in a store failure.
        Resolution:
        Please correct the user operation.... at token ["/Samples/Data/SearchLog.tsv"], line 9
        near the ###:
        **************
        string,
                            Duration        int?,
                            Urls            string,
                            ClickedUrls     string
                    FROM  ### "/Samples/Data/SearchLog.tsv"
                    USING Extractors.Tsv();
                
                OUTPUT @searchlog   
                    TO "/output/SearchLog-from-adls.csv"

    It tells you the source folder doesn't exist.
    
    Notice the **Duplicate Script** button. This will launch an editable version of the script so you can fix any script errors. 
In the next section, you will fix the problem.  After you fix the problem, you can use the same procedure shown in the section to resubmit the job.

##Upload the source files

In previous section, you have identified the root cause, which is missing source file.

**To upload sample data files**

1. From the Azure preview portal, click **Microsoft Azure** in the upper left corner.
2. Click the tile with your ADL Analytics account name.  It was pinned here when the account was created.
If the account is not pinned there, see 
[Open an Analytics account from portal](data-lake-analytics-manage-use-portal.md#access-adla-account) to open the
account.
3. Expand the **Essentials** pane, and then click **Explore sample jobs**. It opens another blade called **Sample
Jobs**.
4. Click **Update Sample**, and then click **OK** to confirm.
 
##Resubmit the job

Go through the procedure in [Monitor and troubleshoot the job](#monitor-and-troubleshoot-the-job) to resubmit the job.

##See also

- [Azure Data Lake Analytics overview](data-lake-analytics-overview.md)
- [Get started with Azure Data Lake Analytics using Azure PowerShell](data-lake-analytics-get-started-powershell.md)
- [Get started with Azure Data Lake Analytics and U-SQL using Visual Studio](data-lake-analytics-get-started-u-sql-studio.md)
- [Manage Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-manage-use-portal.md)
- [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Preview Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)





