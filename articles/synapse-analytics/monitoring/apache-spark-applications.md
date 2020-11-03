---
title: Monitor Apache Spark applications using Synapse Studio
description: Use Synapse Studio to monitor your Apache Spark applications.
services: synapse-analytics 
author: matt1883
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: monitoring
ms.date: 04/15/2020
ms.author: mahi
ms.reviewer: mahi
---

# Use Synapse Studio to monitor your Apache Spark applications

With Azure Synapse Analytics, you can use Apache Spark to run notebooks, jobs, and other kinds of applications on your Apache Spark pools in your workspace.

This article explains how to monitor your Apache Spark applications, allowing you to keep an eye on the latest status, issues, and progress.

This tutorial covers the following tasks:

* Monitor running Apache Spark Application
* View completed Apache Spark Application
* View canceled Apache Spark Application
* Debug failed Apache Spark Application

## Prerequisites

Before you start with this tutorial, make sure to meet the following requirements:

- A Synapse Studio workspace. For instructions, see [Create a Synapse Studio workspace](https://docs.microsoft.com/azure/machine-learning/how-to-manage-workspace#create-a-workspace).

- A serverless Apache Spark pool.

## Monitor running Apache Spark application

Open **Monitor**, then select **Apache Spark applications**. To view the details about the Apache Spark applications that are running, select the submitting Apache Spark application and view the details. If the Apache Spark application is still running, you can monitor the progress.

  ![select running job](./media/how-to-monitor-spark-applications/select-running-job.png)

1. Check the **Completed tasks**, **Status**, and **Total duration**.

2. Cancel the Apache Spark application.

3. Refresh Log query.

4. View the graph.

5. Check the **Summary** info.

6. Check the **Logs**. The log info is empty while running.

    ![view running job](./media/how-to-monitor-spark-applications/view-running-job.png)

## View completed Apache Spark application

Open **Monitor**, then select **Apache Spark applications**. To view the details about the completed Apache Spark applications, select the Apache Spark application and view the details.

  ![select completed job](./media/how-to-monitor-spark-applications/select-completed-job.png)

1. Check the **Completed tasks**, **Status**, and **Total duration**.

2. Refresh Log query.

3. Open Apache Spark history server link by clicking **Spark history server**.

4. Check the **Summary** info by clicking the icon in the graph.

5. Check the **Logs**. You can select different type of logs from the drop-down list, and you can download the log info by clicking **Download logs**.

6. You can see an overview of your job in the generated job graph. By default, the graph shows all jobs. You can filter this view by **Job ID**.

7. By default, the **Progress** display is selected. You can check the data flow by selecting **Read** or **Written** in the **Display** dropdown list.

8. To play back the job, select **Playback**. You can select **Stop** at any time to stop.

9. Use your mouse scroll to zoom in and out on the job graph, or select **Zoom to fit** to make it fit to screen.

10. The job graph node displays the following information of each stage:

    * ID.

    * Name or description.

    * Total task number.

    * Data read: the sum of input size and shuffle read size.

    * Data write: the sum of output size and shuffle writes size.

    * Execution time: the time between start time of the first attempt and completion time of the last attempt.

    * Row count: the sum of input records, output records, shuffle read records and shuffle write records.

    * Progress.

     ![view completed job](./media/how-to-monitor-spark-applications/view-completed-job.png)
    
11. Click the graph, then the details for stage will show out.

   ![details for stage](./media/how-to-monitor-spark-applications/details-for-stage.png)

## View canceled Apache Spark application

Open **Monitor**, then select **Apache Spark applications**. To view the details about the canceled Apache Spark applications, select the Apache Spark application and view the details.

 ![select cancelled job](./media/how-to-monitor-spark-applications/select-cancelled-job.png) 

1. Check the **Completed tasks**, **Status**, and **Total duration**.

2. Refresh the Log query.

3. Open Apache history server link by clicking **Spark history server**.

4. View the graph.

5. Check the **Summary** info.

6. Check the **Logs**. You can select different type of logs from the drop-down list, and you can download the log info by clicking **Download logs**.

   ![view cancelled job](./media/how-to-monitor-spark-applications/view-cancelled-job.png)

## Debug failed Apache Spark application

Open **Monitor**, then select **Apache Spark applications**. To view the details about the failed Apache Spark applications, select the Apache Spark application and view the details.

![select failed job](./media/how-to-monitor-spark-applications/select-failed-job.png)

1. Check the **Completed tasks**, **Status**, and **Total duration**.

2. Refresh Log query.

3. Open Apache Spark history server link by clicking **Spark history server**.

4. View the graph.

5. Check the **Summary** info.

6. Check the error info.

   ![failed job info](./media/how-to-monitor-spark-applications/failed-job-info.png)

## Next steps

For more information on monitoring pipeline runs, see the [Monitor pipeline runs using Synapse Studio](how-to-monitor-pipeline-runs.md) article.  
