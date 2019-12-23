---
title: Extended Spark History Server to debug apps - Apache Spark in Azure Synapse 
description: Use extended Spark History Server to debug and diagnose Spark applications - Azure Synapse Analytics.
services: sql-data-warehouse 
author: euangMS 
ms.service: sql-data-warehouse 
ms.topic: overview
ms.subservice: design
ms.date: 11/25/2019 
ms.author: euang 
ms.reviewer: euang
---

# Use extended Apache Spark History Server to debug and diagnose Apache Spark applications

This article provides guidance on how to use extended Apache Spark History Server to debug and diagnose completed and running Spark applications. The extension includes data tab and graph tab and diagnosis tab. On the **Data** tab, users can check the input and output data of the Spark job. On the **Graph** tab, users can check the data flow and replay the job graph. On the **Diagnosis** tab, user can refer to **Data Skew**, **Time Skew**, and **Executor Usage Analysis**.

## Get access to Apache Spark History Server

Apache Spark History Server is the web UI for completed and running Spark applications.

### Open the Apache Spark History Server Web UI from Azure Synapse Studio

1. From the an Azure Synapse Studio notebook, select **Spark history server** from the job execution output cell or from the status panel at the bottom of the notebook document select **Session details** and then **Spark history server** from the slide out panel.

![Launch Spark History Server](./media/apache-spark-history-server/launch-history-server2.png "Launch Spark History Server")
![Launch Spark History Server](./media/apache-spark-history-server/launch-history-server.png "Launch Spark History Server")

## Data tab in Spark History Server

Select job ID then click **Data** on the tool menu to get the data view.

+ Check the **Inputs**, **Outputs**, and **Table Operations** by selecting the tabs separately.

    ![Data for Spark application tabs](./media/apache-spark-history-server/apache-spark-data-tabs.png)

+ Copy all rows by clicking button **Copy**.

    ![Data for Spark application copy](./media/apache-spark-history-server/apache-spark-data-copy.png)

+ Save all data as CSV file by clicking button **csv**.

    ![Data for Spark application save](./media/apache-spark-history-server/apache-spark-data-save.png)

+ Search by entering keywords in field **Search**, the search result will display immediately.

    ![Data for Spark application search](./media/apache-spark-history-server/apache-spark-data-search.png)

+ Click the column header to sort table, click the plus sign to expand a row to show more details, or click the minus sign to collapse a row.

    ![Data for Spark application table](./media/apache-spark-history-server/apache-spark-data-table.png)

+ Download single file by clicking button **Partial Download** that place at the right, then the selected file will be downloaded to local, if the file does not exist anymore, it will open a new tab to show the error messages.

    ![Data for Spark application download row](./media/apache-spark-history-server/sparkui-data-download-row.png)

+ Copy full path or relative path by selecting the **Copy Full Path**, **Copy Relative Path** that expands from download menu. For Azure Data Lake Storage files, **Open in Azure Storage Explorer** will launch Azure Storage Explorer, and locate to the folder when sign in.

    ![Data for Spark application copy path](./media/apache-spark-history-server/sparkui-data-copy-path.png)

+ Click the number below the table to navigate pages when too many rows to display in one page.

    ![Data for Spark application page](./media/apache-spark-history-server/apache-spark-data-page.png)

+ Hover on the question mark beside Data to show the tooltip, or click the question mark to get more information.

    ![Data for Spark application more info](./media/apache-spark-history-server/sparkui-data-more-info.png)

+ Send feedback with issues by clicking **Provide us feedback**.

    ![Spark graph provide us feedback again](./media/apache-spark-history-server/sparkui-graph-feedback.png)

## Graph tab in Apache Spark History Server

Select job ID then click **Graph** on the tool menu to get the job graph view.

+ Check overview of your job by the generated job graph.

+ By default, it will show all jobs, and it could be filtered by **Job ID**.

    ![Spark application and job graph job ID](./media/apache-spark-history-server/apache-spark-graph-jobid.png)

+ By default, **Progress** is selected, user could check the data flow by selecting **Read/Written** in the dropdown list of **Display**.

    ![Spark application and job graph display](./media/apache-spark-history-server/sparkui-graph-display.png)

    The graph node display in color that shows the heatmap.

    ![Spark application and job graph heatmap](./media/apache-spark-history-server/sparkui-graph-heatmap.png)

+ Play back the job by clicking the **Playback** button and stop anytime by clicking the stop button. The task display in color to show different status when play back:

  + Green for succeeded: The job has completed successfully.
  + Orange for retried: Instances of tasks that failed but do not affect the final result of the job. These tasks had duplicate or retry instances that may succeed later.
  + Blue for running: The task is running.
  + White for waiting or skipped: The task is waiting to run, or the stage has skipped.
  + Red for failed: The task has failed.

    ![Spark application and job graph color sample, running](./media/apache-spark-history-server/sparkui-graph-color-running.png)

    The skipped stage display in white.
    ![Spark application and job graph color sample, skip](./media/apache-spark-history-server/sparkui-graph-color-skip.png)

    ![Spark application and job graph color sample, failed](./media/apache-spark-history-server/sparkui-graph-color-failed.png)

    > [!NOTE]  
    > Playback for each job is allowed. For incomplete job, playback is not supported.

+ Mouse scrolls to zoom in/out the job graph, or click **Zoom to fit** to make it fit to screen.

    ![Spark application and job graph zoom to fit](./media/apache-spark-history-server/sparkui-graph-zoom2fit.png)

+ Hover on graph node to see the tooltip when there are failed tasks, and click on stage to open stage page.

    ![Spark application and job graph tooltip](./media/apache-spark-history-server/sparkui-graph-tooltip.png)

+ In job graph tab, stages will have tooltip and small icon displayed if they have tasks meet the below conditions:
  + Data skew: data read size > average data read size of all tasks inside this stage * 2 and data read size > 10 MB.
  + Time skew: execution time > average execution time of all tasks inside this stage * 2 and execution time > 2 mins.

    ![Spark application and job graph skew icon](./media/apache-spark-history-server/sparkui-graph-skew-icon.png)

+ The job graph node will display the following information of each stage:
  + ID.
  + Name or description.
  + Total task number.
  + Data read: the sum of input size and shuffle read size.
  + Data write: the sum of output size and shuffle writes size.
  + Execution time: the time between start time of the first attempt and completion time of the last attempt.
  + Row count: the sum of input records, output records, shuffle read records and shuffle write records.
  + Progress.

    > [!NOTE]  
    > By default, the job graph node will display information from last attempt of each stage (except for stage execution time), but during playback graph node will show information of each attempt.

    > [!NOTE]  
    > For data size of read and write we use 1MB = 1000 KB = 1000 * 1000 Bytes.

+ Send feedback with issues by clicking **Provide us feedback**.

    ![Spark application and job graph feedback](./media/apache-spark-history-server/sparkui-graph-feedback.png)

## Diagnosis tab in Apache Spark History Server

Select job ID then click **Diagnosis** on the tool menu to get the job Diagnosis view. The diagnosis tab includes **Data Skew**, **Time Skew**, and **Executor Usage Analysis**.

+ Check the **Data Skew**, **Time Skew**, and **Executor Usage Analysis** by selecting the tabs respectively.

    ![SparkUI diagnosis data skew tab again](./media/apache-spark-history-server/sparkui-diagnosis-tabs.png)

### Data Skew

Click **Data Skew** tab, the corresponding skewed tasks are displayed based on the specified parameters.

+ **Specify Parameters** - The first section displays the parameters, which are used to detect Data Skew. The built-in rule is: Task Data Read is greater than three times of the average task data read, and the task data read is more than 10 MB. If you want to define your own rule for skewed tasks, you can choose your parameters, the **Skewed Stage**, and **Skew Char** section will be refreshed accordingly.

+ **Skewed Stage** - The second section displays stages, which have skewed tasks meeting the criteria specified above. If there is more than one skewed task in a stage, the skewed stage table only displays the most skewed task (for example, the largest data for data skew).

    ![sparkui diagnosis data skew tab](./media/apache-spark-history-server/sparkui-diagnosis-dataskew-section2.png)

+ **Skew Chart** – When a row in the skew stage table is selected, the skew chart displays more task distributions details based on data read and execution time. The skewed tasks are marked in red and the normal tasks are marked in blue. For performance consideration, the chart only displays up to 100 sample tasks. The task details are displayed in right bottom panel.

    ![sparkui skew chart for stage 10](./media/apache-spark-history-server/sparkui-diagnosis-dataskew-section3.png)

### Time Skew

The **Time Skew** tab displays skewed tasks based on task execution time.

+ **Specify Parameters** - The first section displays the parameters, which are used to detect Time Skew. The default criteria to detect time skew is: task execution time is greater than three times of average execution time and task execution time is greater than 30 seconds. You can change the parameters based on your needs. The **Skewed Stage** and **Skew Chart** display the corresponding stages and tasks information just like the **Data Skew** tab above.

+ Click **Time Skew**, then filtered result is displayed in **Skewed Stage** section according to the parameters set in section **Specify Parameters**. Click one item in **Skewed Stage** section, then the corresponding chart is drafted in section3, and the task details are displayed in right bottom panel.

    ![sparkui diagnosis time skew section](./media/apache-spark-history-server/sparkui-diagnosis-timeskew-section2.png)

### Executor Usage Analysis

The Executor Usage Graph visualizes the Spark job actual executor allocation and running status.  

+ Click **Executor Usage Analysis**, then four types curves about executor usage are drafted, including **Allocated Executors**, **Running Executors**, idle Executors**, and **Max Executor Instances**. Regarding allocated executors, each "Executor added" or "Executor removed" event will increase or decrease the allocated executors, you can check "Event Timeline" in the “Jobs" tab for more comparison.

    ![sparkui diagnosis executors tab](./media/apache-spark-history-server/sparkui-diagnosis-executors.png)

+ Click the color icon to select or unselect the corresponding content in all drafts.

    ![sparkui diagnoses select chart](./media/apache-spark-history-server/sparkui-diagnosis-select-chart.png)

## Known issues

1. Input/output data using RDD will not show in data tab.

<!--- TODO: Need to replace this diagram
## Next steps

+ [Manage resources for an Apache Spark cluster on HDInsight](apache-spark-resource-manager.md)
+ [Configure Apache Spark settings](apache-spark-settings.md)

--->
