---
title: Use extended Spark History Server to debug and diagnose Spark applications - Azure HDInsight 
description: Use extended Spark History Server to debug and diagnose Spark applications - Azure HDInsight.
ms.service: hdinsight
author: jejiang
ms.author: jejiang
ms.reviewer: jasonh
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 09/14/2018
---
# Use extended Apache Spark History Server to debug and diagnose Apache Spark applications

This article provides guidance on how to use extended Apache Spark History Server to debug and diagnose completed and running Spark applications. The extension includes data tab and graph tab and diagnosis tab. On the **Data** tab, users can check the input and output data of the Spark job. On the **Graph** tab, users can check the data flow and replay the job graph. On the **Diagnosis** tab, user can refer to **Data Skew**, **Time Skew** and **Executor Usage Analysis**.

## Get access to Apache Spark History Server

Apache Spark History Server is the web UI for completed and running Spark applications. 

### Open the Apache Spark History Server Web UI from Azure portal

1. From the [Azure portal](https://portal.azure.com/), open the Spark cluster. For more information, see [List and show clusters](../hdinsight-administer-use-portal-linux.md#showClusters).
2. From **Quick Links**, click **Cluster Dashboard**, and then click **Spark History Server**. When prompted, enter the admin credentials for the Spark cluster. 

    ![Spark History Server](./media/apache-azure-spark-history-server/launch-history-server.png "Spark History Server")

### Open the Spark History Server Web UI by URL
Open the Spark History Server by browsing to the following URL, replace `<ClusterName>` with Spark cluster name of customer.

   ```
   https://<ClusterName>.azurehdinsight.net/sparkhistory
   ```

The Spark History Server web UI looks like:

![HDInsight Spark History Server](./media/apache-azure-spark-history-server/hdinsight-spark-history-server.png)


## Data tab in Spark History Server
Select job ID then click **Data** on the tool menu to get the data view.

+ Check the **Inputs**, **Outputs**, and **Table Operations** by selecting the tabs separately.

    ![Data tabs](./media/apache-azure-spark-history-server/sparkui-data-tabs.png)

+ Copy all rows by clicking button **Copy**.

    ![Data copy](./media/apache-azure-spark-history-server/sparkui-data-copy.png)

+ Save all data as CSV file by clicking button **csv**.

    ![Data save](./media/apache-azure-spark-history-server/sparkui-data-save.png)

+ Search by entering keywords in field **Search**, the search result will display immediately.

    ![Data search](./media/apache-azure-spark-history-server/sparkui-data-search.png)

+ Click the column header to sort table, click the plus sign to expand a row to show more details, or click the minus sign to collapse a row.

    ![Data table](./media/apache-azure-spark-history-server/sparkui-data-table.png)

+ Download single file by clicking button **Partial Download** that place at the right, then the selected file will be downloaded to local, if the file does not exist any more, it will open a new tab to show the error messages.

    ![Data download row](./media/apache-azure-spark-history-server/sparkui-data-download-row.png)

+ Copy full path or relative path by selecting the **Copy Full Path**, **Copy Relative Path** that expands from download menu. For azure data lake storage files, **Open in Azure Storage Explorer** will launch Azure Storage Explorer, and locate to the folder when sign-in.

    ![Data copy path](./media/apache-azure-spark-history-server/sparkui-data-copy-path.png)

+ Click the number below the table to navigate pages when too many rows to display in one page. 

    ![Data page](./media/apache-azure-spark-history-server/sparkui-data-page.png)

+ Hover on the question mark beside Data to show the tooltip, or click the question mark to get more information.

    ![Data more info](./media/apache-azure-spark-history-server/sparkui-data-more-info.png)

+ Send feedback with issues by clicking **Provide us feedback**.

    ![graph feedback](./media/apache-azure-spark-history-server/sparkui-graph-feedback.png)


## Graph tab in Apache Spark History Server
Select job ID then click **Graph** on the tool menu to get the job graph view.

+ Check overview of your job by the generated job graph. 

+ By default, it will show all jobs, and it could be filtered by **Job ID**.

    ![graph job ID](./media/apache-azure-spark-history-server/sparkui-graph-jobid.png)

+ By default, **Progress** is selected, user could check the data flow by selecting **Read/Written** in the dropdown list of **Display**.

    ![graph display](./media/apache-azure-spark-history-server/sparkui-graph-display.png)

    The graph node display in color that shows the heatmap.

    ![graph heatmap](./media/apache-azure-spark-history-server/sparkui-graph-heatmap.png)

+ Play back the job by clicking the **Playback** button and stop anytime by clicking the stop button. The task display in color to show different status when playback:

  + Green for succeeded: The job has completed successfully.
  + Orange for retried: Instances of tasks that failed but do not affect the final result of the job. These tasks had duplicate or retry instances that may succeed later.
  + Blue for running: The task is running.
  + White for waiting or skipped: The task is waiting to run, or the stage has skipped.
  + Red for failed: The task has failed.

    ![graph color sample, running](./media/apache-azure-spark-history-server/sparkui-graph-color-running.png)
 
    The skipped stage display in white.
    ![graph color sample, skip](./media/apache-azure-spark-history-server/sparkui-graph-color-skip.png)

    ![graph color sample, failed](./media/apache-azure-spark-history-server/sparkui-graph-color-failed.png)
 
    > [!NOTE]  
    > Playback for each job is allowed. For incomplete job, playback is not supported.


+ Mouse scrolls to zoom in/out the job graph, or click **Zoom to fit** to make it fit to screen.
 
    ![graph zoom to fit](./media/apache-azure-spark-history-server/sparkui-graph-zoom2fit.png)

+ Hover on graph node to see the tooltip when there are failed tasks, and click on stage to open stage page.

    ![graph tooltip](./media/apache-azure-spark-history-server/sparkui-graph-tooltip.png)

+ In job graph tab, stages will have tooltip and small icon displayed if they have tasks meet the below conditions:
  + Data skew: data read size > average data read size of all tasks inside this stage * 2 and data read size > 10 MB.
  + Time skew: execution time > average execution time of all tasks inside this stage * 2 and execution time > 2 mins.

    ![graph skew icon](./media/apache-azure-spark-history-server/sparkui-graph-skew-icon.png)

+ The job graph node will display the following information of each stage:
  + ID.
  + Name or description.
  + Total task number.
  + Data read: the sum of input size and shuffle read size.
  + Data write: the sum of output size and shuffle write size.
  + Execution time: the time between start time of the first attempt and completion time of the last attempt.
  + Row count: the sum of input records, output records, shuffle read records and shuffle write records.
  + Progress.

    > [!NOTE]  
    > By default, the job graph node will display information from last attempt of each stage (except for stage execution time), but during playback graph node will show information of each attempt.

    > [!NOTE]  
    > For data size of read and write we use 1MB = 1000 KB = 1000 * 1000 Bytes.

+ Send feedback with issues by clicking **Provide us feedback**.

    ![graph feedback](./media/apache-azure-spark-history-server/sparkui-graph-feedback.png)


## Diagnosis tab in Apache Spark History Server
Select job ID then click **Diagnosis** on the tool menu to get the job Diagnosis view. The diagnosis tab includes **Data Skew**, **Time Skew**, and **Executor Usage Analysis**.
    
+ Check the **Data Skew**, **Time Skew**, and **Executor Usage Analysis** by selecting the tabs respectively.

    ![Diagnosis tabs](./media/apache-azure-spark-history-server/sparkui-diagnosis-tabs.png)

### Data Skew
Click **Data Skew** tab, the corresponding skewed tasks are displayed based on the specified parameters. 

+ **Specify Parameters** - The first section displays the parameters which are used to detect Data Skew. The built-in rule is: Task Data Read is greater than 3 times of the average task data read, and the task data read is more than 10MB. If you want to define your own rule for skewed tasks, you can choose your parameters, the **Skewed Stage**, and **Skew Char** section will be refreshed accordingly.

+ **Skewed Stage** - The second section displays stages which have skewed tasks meeting the criteria specified above. If there are more than one skewed task in a stage, the skewed stage table only displays the most skewed task (e.g. the largest data for data skew).

    ![Data skew section2](./media/apache-azure-spark-history-server/sparkui-diagnosis-dataskew-section2.png)

+ **Skew Chart** – When a row in the skew stage table is selected, the skew chart displays more task distributions details based on data read and execution time. The skewed tasks are marked in red and the normal tasks are marked in blue. For performance consideration, the chart only displays up to 100 sample tasks. The task details are displayed in right bottom panel.

    ![Data skew section3](./media/apache-azure-spark-history-server/sparkui-diagnosis-dataskew-section3.png)

### Time Skew
The **Time Skew** tab displays skewed tasks based on task execution time. 

+ **Specify Parameters** - The first section displays the parameters which are used to detect Time Skew. The default criteria to detect time skew is: task execution time is greater than 3 times of average execution time and task execution time is greater than 30 seconds. You can change the parameters based on your needs. The **Skewed Stage** and **Skew Chart** display the corresponding stages and tasks information just like the **Data Skew** tab above.

+ Click **Time Skew**, then filtered result is displayed in **Skewed Stage** section according to the parameters set in section **Specify Parameters**. Click one item in **Skewed Stage** section, then the corresponding chart is drafted in section3, and the task details are displayed in right bottom panel.

    ![Time skew section2](./media/apache-azure-spark-history-server/sparkui-diagnosis-timeskew-section2.png)

### Executor Usage Analysis
The Executor Usage Graph visualizes the Spark job actual executor allocation and running status.  

+ Click **Executor Usage Analysis**, then four types curves about executor usage are drafted, including **Allocated Executors**, **Running Executors**,**idle Executors**, and **Max Executor Instances**. Regarding allocated executors, each "Executor added" or "Executor removed" event will increase or decrease the allocated executors, you can check "Event Timeline" in the “Jobs" tab for more comparison.

    ![Executors tab](./media/apache-azure-spark-history-server/sparkui-diagnosis-executors.png)

+ Click the color icon to select or unselect the corresponding content in all drafts.

    ![Select chart](./media/apache-azure-spark-history-server/sparkui-diagnosis-select-chart.png)


## FAQ

### 1. Revert to community version

To revert to community version, do the following steps:

1. Open cluster in Ambari. Click **Spark2** in left panel.
2. Click **Configs** tab.
3. Expand the group **Custom spark2-defaults**.
4. Click **Add Property**, add **spark.ui.enhancement.enabled=false**, save.
5. The property sets to **false** now.
6. Click **Save** to save the configuration.

    ![feature turns off](./media/apache-azure-spark-history-server/sparkui-turn-off.png)

7. Click **Spark2** in left panel, under **Summary** tab, click **Spark2 History Server**.

    ![restart server1](./media/apache-azure-spark-history-server/sparkui-restart-1.png) 

8. Restart history server by clicking **Restart** of **Spark2 History Server**.

    ![restart server2](./media/apache-azure-spark-history-server/sparkui-restart-2.png)  

9. Refresh the Spark history server web UI, it will be reverted to community version.

### 2. Upload history server event

If you run into history server error, follow the steps to provide the event:
1. Download event by clicking **Download** in history server web UI.

    ![download event](./media/apache-azure-spark-history-server/sparkui-download-event.png)

2. Click **Provide us feedback** from data/graph tab.

    ![graph feedback](./media/apache-azure-spark-history-server/sparkui-graph-feedback.png)

3. Provide the title and description of error, drag the zip file to the edit field, then click **Submit new issue**.

    ![file issue](./media/apache-azure-spark-history-server/sparkui-file-issue.png)


### 3. Upgrade jar file for hotfix scenario

If you want to upgrade with hotfix, use the script below which will upgrade spark-enhancement.jar*.

**upgrade_spark_enhancement.sh**:

   ```bash
    #!/usr/bin/env bash

    # Copyright (C) Microsoft Corporation. All rights reserved.

    # Arguments:
    # $1 Enhancement jar path

    if [ "$#" -ne 1 ]; then
        >&2 echo "Please provide the upgrade jar path."
        exit 1
    fi

    install_jar() {
        tmp_jar_path="/tmp/spark-enhancement-hotfix-$( date +%s )"

        if wget -O "$tmp_jar_path" "$2"; then
            for FILE in "$1"/spark-enhancement*.jar
            do
                back_up_path="$FILE.original.$( date +%s )"
                echo "Back up $FILE to $back_up_path"
                mv "$FILE" "$back_up_path"
                echo "Copy the hotfix jar file from $tmp_jar_path   to $FILE"
                cp "$tmp_jar_path" "$FILE"

                "Hotfix done."
                break
            done
        else    
            >&2 echo "Download jar file failed."
            exit 1
        fi
    }

    jars_folder="/usr/hdp/current/spark2-client/jars"
    jar_path=$1

    if ls ${jars_folder}/spark-enhancement*.jar 1>/dev/null 2>&1;   then
        install_jar "$jars_folder" "$jar_path"
    else
        >&2 echo "There is no target jar on this node. Exit with no action."
        exit 0
    fi
   ```

**Usage**: 

`upgrade_spark_enhancement.sh https://${jar_path}`

**Example**:

`upgrade_spark_enhancement.sh https://${account_name}.blob.core.windows.net/packages/jars/spark-enhancement-${version}.jar` 

**To use the bash file from Azure portal**

1. Launch [Azure Portal](https://ms.portal.azure.com), and select your cluster.
2. Click **Script actions**, then **Submit new**. Complete the **Submit script action** form, then click **Create** button.
    
    + **Script type**: select **Custom**.
    + **Name**: specify a script name.
    + **Bash script URI**: upload the bash file to private cluster then copy URL here. Alternatively, use the URI provided.
    
   ```upgrade_spark_enhancement
    https://hdinsighttoolingstorage.blob.core.windows.net/shsscriptactions/upgrade_spark_enhancement.sh
   ```

   + Check on **Head** and **Worker**.
   + **Parameters**: set the parameters follow the bash usage.

     ![upload log or upgrade hotfix](./media/apache-azure-spark-history-server/sparkui-upload2.png)


## Known issues

1.	Currently, it only works for Spark 2.3 cluster.

2.	Input/output data using RDD will not show in data tab.

## Next steps

* [Manage resources for an Apache Spark cluster on HDInsight](apache-spark-resource-manager.md)
* [Configure Apache Spark settings](apache-spark-settings.md)


## Contact us

If you have any feedback, or if you encounter any other problems when using this tool, send an email at ([hdivstool@microsoft.com](mailto:hdivstool@microsoft.com)).
