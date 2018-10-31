---
title: Debug Apache Spark jobs running on Azure HDInsight 
description: Use YARN UI, Spark UI, and Spark History server to track and debug jobs running on a Spark cluster in Azure HDInsight
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 12/20/2017
ms.author: jasonh

---
# Debug Apache Spark jobs running on Azure HDInsight

In this article, you learn how to track and debug Spark jobs running on HDInsight clusters using the YARN UI, Spark UI, and the Spark History Server. You start a Spark job using a notebook available with the Spark cluster, **Machine learning: Predictive analysis on food inspection data using MLLib**. You can use the following steps to track an application that you submitted using any other approach as well, for example, **spark-submit**.

## Prerequisites
You must have the following:

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).
* You should have started running the notebook, **[Machine learning: Predictive analysis on food inspection data using MLLib](apache-spark-machine-learning-mllib-ipython.md)**. For instructions on how to run this notebook, follow the link.  

## Track an application in the YARN UI
1. Launch the YARN UI. Click **Cluster Dashboard**, and then click **YARN**.
   
    ![Launch YARN UI](./media/apache-spark-job-debugging/launch-yarn-ui.png)
   
   > [!TIP]
   > Alternatively, you can also launch the YARN UI from the Ambari UI. To launch the Ambari UI, click **Cluster Dashboard**, and then click **HDInsight Cluster Dashboard**. From the Ambari UI, click **YARN**, click **Quick Links**, click the active Resource Manager, and then click **Resource Manager UI**.    
   > 
   > 
2. Because you started the Spark job using Jupyter notebooks, the application has the name **remotesparkmagics** (this is the name for all applications that are started from the notebooks). Click the application ID against the application name to get more information about the job. This launches the application view.
   
    ![Find Spark application ID](./media/apache-spark-job-debugging/find-application-id.png)
   
    For such applications that are launched from the Jupyter notebooks, the status is always **RUNNING** until you exit the notebook.
3. From the application view, you can drill down further to find out the containers associated with the application and the logs (stdout/stderr). You can also launch the Spark UI by clicking the linking corresponding to the **Tracking URL**, as shown below. 
   
    ![Download container logs](./media/apache-spark-job-debugging/download-container-logs.png)

## Track an application in the Spark UI
In the Spark UI, you can drill down into the Spark jobs that are spawned by the application you started earlier.

1. To launch the Spark UI, from the application view, click the link against the **Tracking URL**, as shown in the screen capture above. You can see all the Spark jobs that are launched by the application running in the Jupyter notebook.
   
    ![View Spark jobs](./media/apache-spark-job-debugging/view-spark-jobs.png)
2. Click the **Executors** tab to see processing and storage information for each executor. You can also retrieve the call stack by clicking on the **Thread Dump** link.
   
    ![View Spark executors](./media/apache-spark-job-debugging/view-spark-executors.png)
3. Click the **Stages** tab to see the stages associated with the application.
   
    ![View Spark stages](./media/apache-spark-job-debugging/view-spark-stages.png)
   
    Each stage can have multiple tasks for which you can view execution statistics, like shown below.
   
    ![View Spark stages](./media/apache-spark-job-debugging/view-spark-stages-details.png) 
4. From the stage details page, you can launch DAG Visualization. Expand the **DAG Visualization** link at the top of the page, as shown below.
   
    ![View Spark stages DAG visualization](./media/apache-spark-job-debugging/view-spark-stages-dag-visualization.png)
   
    DAG or Direct Aclyic Graph represents the different stages in the application. Each blue box in the graph represents a Spark operation invoked from the application.
5. From the stage details page, you can also launch the application timeline view. Expand the **Event Timeline** link at the top of the page, as shown below.
   
    ![View Spark stages event timeline](./media/apache-spark-job-debugging/view-spark-stages-event-timeline.png)
   
    This displays the Spark events in the form of a timeline. The timeline view is available at three levels, across jobs, within a job, and within a stage. The image above captures the timeline view for a given stage.
   
   > [!TIP]
   > If you select the **Enable zooming** check box, you can scroll left and right across the timeline view.
   > 
   > 
6. Other tabs in the Spark UI provide useful information about the Spark instance as well.
   
   * Storage tab - If your application creates an RDDs, you can find information about those in the Storage tab.
   * Environment tab - This tab provides a lot of useful information about your Spark instance such as the 
     * Scala version
     * Event log directory associated with the cluster
     * Number of executor cores for the application
     * Etc.

## Find information about completed jobs using the Spark History Server
Once a job is completed, the information about the job is persisted in the Spark History Server.

1. To launch the Spark History Server, from the cluster blade, click **Cluster Dashboard**, and then click **Spark History Server**.
   
    ![Launch Spark History Server](./media/apache-spark-job-debugging/launch-spark-history-server.png)
   
   > [!TIP]
   > Alternatively, you can also launch the Spark History Server UI from the Ambari UI. To launch the Ambari UI, from the cluster blade, click **Cluster Dashboard**, and then click **HDInsight Cluster Dashboard**. From the Ambari UI, click **Spark**, click **Quick Links**, and then click **Spark History Server UI**.
   > 
   > 
2. You see all the completed applications listed. Click an application ID to drill down into an application for more info.
   
    ![Launch Spark History Server](./media/apache-spark-job-debugging/view-completed-applications.png)

## See also
*  [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
*  [Debug Spark Jobs using extended Spark History Server](apache-azure-spark-history-server.md)

### For data analysts

* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Spark in HDInsight](apache-spark-custom-library-website-log-analysis.md)
* [Application Insight telemetry data analysis using Spark in HDInsight](apache-spark-analyze-application-insight-logs.md)
* [Use Caffe on Azure HDInsight Spark for distributed deep learning](apache-spark-deep-learning-caffe.md)

### For Spark developers

* [Create a standalone application using Scala](apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](apache-spark-livy-rest-interface.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applications](apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Spark applications remotely](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)


