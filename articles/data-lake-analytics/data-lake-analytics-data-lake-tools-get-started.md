---
title: Develop U-SQL scripts using Data Lake Tools for Visual Studio | Microsoft Docs
description: 'Learn how to install Data Lake Tools for Visual Studio, how to develop and test U-SQL scripts. '
services: data-lake-analytics
documentationcenter: ''
author: edmacauley
manager: jhubbard
editor: cgronlun

ms.assetid: ad8a6992-02c7-47d4-a108-62fc5a0777a3
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/06/2017
ms.author: edmaca, yanacai

---
# Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]


Learn how to use the Visual Studio to create Azure Data Lake Analytics accounts, define jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to the Data Lake Analytics service. For more
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).


## Prerequisites

* **Visual Studio**: all editions except Express are supported
    * Visual Studio 2017 (under data storage and processing workload)
    * Visual Studio 2015 update 4
    * Visual Studio 2013
* **Microsoft Azure SDK for .NET** version 2.7.1 or above.  Install it using the [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx).
* A **Data Lake Analytics Analytics** account. To create an account, see [Get Started with Azure Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md).

## Install Azure Data Lake Tools for Visual Studio (ADLToolsForVS)

Download and install ADLToolsForVS [from here](http://aka.ms/adltoolsvs). After installation, you will see:
* A **Data Lake Analytics** node in** Server Explorer > Azure** node. 
* A **Tools > Data Lake** menu item.

## Connect to an Azure Data Lake Analytics account

1. Open Visual Studio.
2. From the **View > Server Explorer** to open Server Explorer.
3. Right-click **Azure**. Select **Connect to Microsoft Azure Subscription**, and then follow the instructions.
4. In **Server Explorer**, select **Azure > Data Lake Analytics**. You shall see a list of your Data Lake Analytics accounts if there are any.

**Create and submit a Data Lake Analytics job**

1. From the **File** menu, click **New**, and then click **Project**.
2. Select the **U-SQL Project** type.

    ![new U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-new-project.png)
3. Click **OK**. Visual studio creates a solution with a **Script.usql** file.
4. Enter the following script into **Script.usql**:

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

        @res =
            SELECT *
            FROM @searchlog;        

        OUTPUT @res   
            TO "/Output/SearchLog-from-Data-Lake.csv"
        USING Outputters.Csv();

    This U-SQL script reads the source data file using **Extractors.Tsv()**, and then creates a csv file using **Outputters.Csv()**.

    Don't modify the two paths unless you copied the source file into a different location.  Data Lake Analytics will create the output folder if it doesn't exist.

    It is simpler to use relative paths for files stored in default data Lake accounts. You can also use absolute paths.  For example

        adl://<Data LakeStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv

    You must use absolute paths to access  files in  linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:

        wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

   > [!NOTE]
   > Azure Blob container with public blobs or public containers access permissions are not currently supported.  
   >
   >

    Notice the following features:

   * **IntelliSense**

       Name auto completed and the members will be shown for Rowset, Classes, Databases, Schemas, and User Defined Objects (UDOs).

       IntelliSense for catalog entities (Databases, Schemas, Tables, UDOs etc.) is related to your compute account. You can check the current active compute account, database and schema in the top toolbar, and switch them through the dropdown lists.
   * **Expand * columns**

       Click the right of *, you shall see a blue underline beneath the *. Hover your mouse cursor on the blue underline, and then click the down arrow.
       ![Data Lake visual studio tools expand *](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-expand-asterisk.png)

       Click **Expand Columns**, the tool will replace the * with the column names.
   * **Auto Format**

       Users can change the indentation of the U-SQL script based on the code structure under Edit->Advanced:

     * Format Document (Ctrl+E, D) : Formats the whole document   
     * Format Selection (Ctrl+K, Ctrl+F): Formats the selection. If no selection has been made, this shortcut formats the line the cursor is in.  

       All the formatting rules are configurable under Tools->Options->Text Editor->SIP->Formatting.  
   * **Smart Indent**

       Data Lake Tools for Visual Studio is able to indent expressions automatically while you are writing scripts. This feature is disabled by default, users need to enable it through checking U-SQL->Options and Settings ->Switches->Enable Smart Indent.
   * **Go To Definition and Find All References**

       Right-clicking the name of a RowSet/parameter/column/UDO etc. and clicking Go To Definition (F12) allows you to navigate to its definition. By clicking Find All References (Shift+F12), will show all the references.
   * **Insert Azure Path**

       Rather than remembering Azure file path and type it manually when writing script, Data Lake Tools for Visual Studio provides an easy way: right-click in the editor, click Insert Azure Path. Navigate to the file in the Azure Blob Browser dialog. Click **OK**. the file path will be inserted to your code.
5. Specify the Data Lake Analytics account, Database, and Schema. You can select **(local)** to run the script locally for the testing purpose. For more information, see [Run U-SQL locally](#run-u-sql-locally).

    ![Submit U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-submit-job.png)

    For more information, see [Use U-SQL catalog](data-lake-analytics-use-u-sql-catalog.md).
6. From **Solution Explorer**, right-click **Script.usql**, and then click **Build Script**. Verify the result in the Output pane.
7. From **Solution Explorer**, right-click **Script.usql**, and then click **Submit Script**. Optionally, you can also click **Submit** from Script.usql pane.  See the previous screenshot.  Click the down arrow next to the Submit button to submit using the advance options:
8. Specify **Job Name**, verify the **Analytics Account**, and then click **Submit**. Submission results and job link are available in the Data Lake Tools for Visual Studio Results window when the submission is completed.

    ![Submit U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-submit-job-advanced.png)
9. You must click the Refresh button to see the latest job status and refresh the screen. When the job successes, it will show you the **Job Graph**, **Meta Data Operations**, **State History**, **Diagnostics**:

    ![U-SQL Visual Studio Data Lake Analytics job performance graph](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-performance-graph.png)

   * Job Summary. Show the summary information of current job: State, Progress, Execution Time, Runtime Name, Submitter etc.   
   * Job Details. Detailed information on this job is provided, including script, resource, Vertex Execution View.
   * Job Graph. Four graphs are provided to visualize the job’s information: Progress, Data Read, Data Written, Execution Time, Average Execution Time Per Node, Input Throughput, Output Throughput.
   * Metadata Operations. It shows all the metadata operations.
   * State History.
   * Diagnostics. Data Lake Tools for Visual Studio will diagnose job execution automatically. You will receive alerts when there are some errors or performance issues in their jobs. See Job Diagnostics (link TBD) part for more information.

**To check job state**

1. From Server Explorer, select **Azure > Data Lake Analytics**. Expand the Data Lake Analytics account name
2. Double-click **Jobs** to list the jobs.
3. Click a job to see the status.

**To see the job output**

1. From **Server Explorer**, expand **Azure**, expand **Data Lake Analytics**, expand your Data Lake Analytics account, expand **Storage Accounts**, right-click the default Data Lake Storage account, and then click **Explorer**.
2. Double-click **output** to open the folder
3. Double-click **SearchLog-From-adltools.csv**.

### Job Playback
Job playback enables you to watch job execution progress and visually detect out performance anomalies and bottlenecks. This feature can be used before the job completes execution and also after the execution has completed. Doing playback during job execution allows the user to play back the progress up to the current time.

**To view job execution progress**  

1. Click **Load Profile** on the upper right corner. See the previous screen shot.
2. Click the Play button on the bottom left corner to review the job execution progress.
3. During the playback, click **Pause** to stop it or directly drag the progress bar to specific positions.

### Heat Map
Data Lake Tools for Visual Studio provides user-selectable color-overlays on job view to indicate progress, data I/O, execution time, I/O throughput of each stage. Through this, users can figure out potential issues and distribution of job properties directly and intuitively. You can choose a data source to display from the drop-down list.  

## Run U-SQL locally

You can use Azure Data Lake Tools for Visual Studio and the Azure Data Lake U-SQL SDK to run U-SQL jobs on your workstation, just as you can in the Azure Data Lake service. These two local-run features save you time in testing and debugging your U-SQL jobs.

* [Test and debug U-SQL jobs by using local run and the Azure Data Lake U-SQL SDK](data-lake-analytics-data-lake-tools-local-run.md)


## See also
To get started with Data Lake Analytics using different tools, see:

* [Get started with Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md)
* [Get started with Data Lake Analytics using Azure PowerShell](data-lake-analytics-get-started-powershell.md)
* [Get started with Data Lake Analytics using .NET SDK](data-lake-analytics-get-started-net-sdk.md)
* [Debug C# code in U-SQL jobs](data-lake-analytics-debug-u-sql-jobs.md)

To learn Data Lake Tools for Visual Studio code, see [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md).

To see more development topics:

* [Analyze weblogs using Data Lake Analytics](data-lake-analytics-analyze-weblogs.md)
* [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
* [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md)
* [Develop U-SQL user defined operators for Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-user-defined-operators.md)

