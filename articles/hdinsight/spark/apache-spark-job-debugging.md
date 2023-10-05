---
title: Debug Apache Spark jobs running on Azure HDInsight 
description: Use YARN UI, Spark UI, and Spark History server to track and debug jobs running on a Spark cluster in Azure HDInsight
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 08/22/2023
---

# Debug Apache Spark jobs running on Azure HDInsight

In this article, you learn how to track and debug Apache Spark jobs running on HDInsight clusters. Debug using the Apache Hadoop YARN UI, Spark UI, and the Spark History Server. You start a Spark job using a notebook available with the Spark cluster, **Machine learning: Predictive analysis on food inspection data using MLLib**. Use the following steps to track an application that you submitted using any other approach as well, for example, **spark-submit**.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

* You should have started running the notebook, **[Machine learning: Predictive analysis on food inspection data using MLLib](apache-spark-machine-learning-mllib-ipython.md)**. For instructions on how to run this notebook, follow the link.  

## Track an application in the YARN UI

1. Launch the YARN UI. Select **Yarn** under **Cluster dashboards**.

    :::image type="content" source="./media/apache-spark-job-debugging/launch-apache-yarn-ui.png" alt-text="Azure portal launch YARN UI" border="true":::

   > [!TIP]  
   > Alternatively, you can also launch the YARN UI from the Ambari UI. To launch the Ambari UI, select **Ambari home** under **Cluster dashboards**. From the Ambari UI, navigate to **YARN** > **Quick Links** > the active Resource Manager > **Resource Manager UI**.

2. Because you started the Spark job using Jupyter Notebooks, the application has the name **remotesparkmagics** (the name for all applications started from the notebooks). Select the application ID against the application name to get more information about the job. This action launches the application view.

    :::image type="content" source="./media/apache-spark-job-debugging/find-application-id1.png" alt-text="Spark history server Find Spark application ID" border="true":::

    For such applications that are launched from the Jupyter Notebooks, the status is always **RUNNING** until you exit the notebook.

3. From the application view, you can drill down further to find out the containers associated with the application and the logs (stdout/stderr). You can also launch the Spark UI by clicking the linking corresponding to the **Tracking URL**, as shown below.

    :::image type="content" source="./media/apache-spark-job-debugging/download-container-logs.png" alt-text="Spark history server download container logs" border="true":::

## Track an application in the Spark UI

In the Spark UI, you can drill down into the Spark jobs that are spawned by the application you started earlier.

1. To launch the Spark UI, from the application view, select the link against the **Tracking URL**, as shown in the screen capture above. You can see all the Spark jobs that are launched by the application running in the Jupyter Notebook.

    :::image type="content" source="./media/apache-spark-job-debugging/view-apache-spark-jobs.png" alt-text="Spark history server jobs tab" border="true":::

2. Select the **Executors** tab to see processing and storage information for each executor. You can also retrieve the call stack by selecting the **Thread Dump** link.

    :::image type="content" source="./media/apache-spark-job-debugging/view-spark-executors.png" alt-text="Spark history server executors tab" border="true":::

3. Select the **Stages** tab to see the stages associated with the application.

    :::image type="content" source="./media/apache-spark-job-debugging/view-apache-spark-stages.png " alt-text="Spark history server stages tab" border="true":::

    Each stage can have multiple tasks for which you can view execution statistics, like shown below.

    :::image type="content" source="./media/apache-spark-job-debugging/view-spark-stages-details.png " alt-text="Spark history server stages tab details" border="true":::

4. From the stage details page, you can launch DAG Visualization. Expand the **DAG Visualization** link at the top of the page, as shown below.

    :::image type="content" source="./media/apache-spark-job-debugging/view-spark-stages-dag-visualization.png" alt-text="View Spark stages DAG visualization" border="true":::

    DAG or Direct Aclyic Graph represents the different stages in the application. Each blue box in the graph represents a Spark operation invoked from the application.

5. From the stage details page, you can also launch the application timeline view. Expand the **Event Timeline** link at the top of the page, as shown below.

    :::image type="content" source="./media/apache-spark-job-debugging/view-spark-stages-event-timeline.png" alt-text="View Spark stages event timeline" border="true":::

    This image displays the Spark events in the form of a timeline. The timeline view is available at three levels, across jobs, within a job, and within a stage. The image above captures the timeline view for a given stage.

   > [!TIP]  
   > If you select the **Enable zooming** check box, you can scroll left and right across the timeline view.

6. Other tabs in the Spark UI provide useful information about the Spark instance as well.

   * Storage tab - If your application creates an RDD, you can find information in the Storage tab.
   * Environment tab - This tab provides useful information about your Spark instance such as the:
     * Scala version
     * Event log directory associated with the cluster
     * Number of executor cores for the application

## Find information about completed jobs using the Spark History Server

Once a job is completed, the information about the job is persisted in the Spark History Server.

1. To launch the Spark History Server, from the **Overview** page, select **Spark history server** under **Cluster dashboards**.

    :::image type="content" source="./media/apache-spark-job-debugging/launch-spark-history-server.png " alt-text="Azure portal launch Spark history server" border="true":::

   > [!TIP]  
   > Alternatively, you can also launch the Spark History Server UI from the Ambari UI. To launch the Ambari UI, from the Overview blade, select **Ambari home** under **Cluster dashboards**. From the Ambari UI, navigate to **Spark2** > **Quick Links** > **Spark2 History Server UI**.

2. You see all the completed applications listed. Select an application ID to drill down into an application for more info.

    :::image type="content" source="./media/apache-spark-job-debugging/view-completed-applications.png " alt-text="Spark history server completed applications" border="true":::

## See also

* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Debug Apache Spark Jobs using extended Spark History Server](apache-azure-spark-history-server.md)
* [Debug Apache Spark applications with Azure Toolkit for IntelliJ through SSH](apache-spark-intellij-tool-debug-remotely-through-ssh.md)
