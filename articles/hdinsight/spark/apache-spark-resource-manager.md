---
title: Manage resources for Apache Spark cluster on Azure HDInsight 
description: Learn how to use manage resources for Spark clusters on Azure HDInsight for better performance.
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/23/2018
ms.author: hrasheed

---
# Manage resources for Apache Spark cluster on Azure HDInsight 

Learn how to access the interfaces like [Apache Ambari](https://ambari.apache.org/) UI, [Apache Hadoop YARN](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) UI, and the Spark History Server associated with your [Apache Spark](https://spark.apache.org/) cluster, and how to tune the cluster configuration for optimal performance.

**Prerequisites:**

* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

## Open the Ambari Web UI

Apache Ambari is used to monitor the cluster and make configuration changes. For more information, see [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](../hdinsight-administer-use-portal-linux.md#open-the-apache-ambari-web-ui)

## Open the Spark History Server

Spark History Server is the web UI for completed and running Spark applications. It is an extension of Spark's Web UI.

**To open the Spark History Server Web UI**

1. From the [Azure portal](https://portal.azure.com/), open the Spark cluster. For more information, see [List and show clusters](../hdinsight-administer-use-portal-linux.md#showClusters).
2. From **Quick Links**, click **Cluster Dashboard**, and then click **Spark History Server**

    ![Spark History Server](./media/apache-spark-resource-manager/launch-history-server.png "Spark History Server")

    When prompted, enter the admin credentials for the Spark cluster. You can also open the Spark History Server by browsing to the following URL:

    ```
    https://<ClusterName>.azurehdinsight.net/sparkhistory
    ```

    Replace `<ClusterName>` with your Spark cluster name.

The Spark History Server web UI looks like:

![HDInsight Spark History Server](./media/apache-spark-resource-manager/hdinsight-spark-history-server.png)

## Open the Yarn UI
You can use the YARN UI to monitor applications that are currently running on the Spark cluster.

1. From the [Azure portal](https://portal.azure.com/), open the Spark cluster. For more information, see [List and show clusters](../hdinsight-administer-use-portal-linux.md#showClusters).
2. From **Quick Links**, click **Cluster Dashboard**, and then click **YARN**.

    ![Launch YARN UI](./media/apache-spark-resource-manager/launch-yarn-ui.png)

   > [!TIP]  
   > Alternatively, you can also launch the YARN UI from the Ambari UI. To launch the Ambari UI, click **Cluster Dashboard**, and then click **HDInsight Cluster Dashboard**. From the Ambari UI, click **YARN**, click **Quick Links**, click the active Resource Manager, and then click **Resource Manager UI**.

## Optimize clusters for Spark applications
The three key parameters that can be used for Spark configuration depending on application requirements are `spark.executor.instances`, `spark.executor.cores`, and `spark.executor.memory`. An Executor is a process launched for a Spark application. It runs on the worker node and is responsible to carry out the tasks for the application. The default number of executors and the executor sizes for each cluster is calculated based on the number of worker nodes and the worker node size. This information is stored in `spark-defaults.conf` on the cluster head nodes.

The three configuration parameters can be configured at the cluster level (for all applications that run on the cluster) or can be specified for each individual application as well.

### Change the parameters using Ambari UI
1. From the Ambari UI click **Spark**, click **Configs**, and then expand **Custom spark-defaults**.

    ![Set parameters using Ambari](./media/apache-spark-resource-manager/set-parameters-using-ambari.png)
2. The default values are good to have four Spark applications run concurrently on the cluster. You can change these values from the user interface, as shown in the following screenshot:

    ![Set parameters using Ambari](./media/apache-spark-resource-manager/set-executor-parameters.png)
3. Click **Save** to save the configuration changes. At the top of the page, you are prompted to restart all the affected services. Click **Restart**.

    ![Restart services](./media/apache-spark-resource-manager/restart-services.png)

### Change the parameters for an application running in Jupyter notebook
For applications running in the Jupyter notebook, you can use the `%%configure` magic to make the configuration changes. Ideally, you must make such changes at the beginning of the application, before you run your first code cell. Doing this ensures that the configuration is applied to the Livy session, when it gets created. If you want to change the configuration at a later stage in the application, you must use the `-f` parameter. However, by doing so all progress in the application is lost.

The following snippet shows how to change the configuration for an application running in Jupyter.

    %%configure
    {"executorMemory": "3072M", "executorCores": 4, "numExecutors":10}

Configuration parameters must be passed in as a JSON string and must be on the next line after the magic, as shown in the example column.

### Change the parameters for an application submitted using spark-submit
Following command is an example of how to change the configuration parameters for a batch application that is submitted using `spark-submit`.

    spark-submit --class <the application class to execute> --executor-memory 3072M --executor-cores 4 –-num-executors 10 <location of application jar file> <application parameters>

### Change the parameters for an application submitted using cURL
The following command is an example of how to change the configuration parameters for a batch application that is submitted using cURL.

    curl -k -v -H 'Content-Type: application/json' -X POST -d '{"file":"<location of application jar file>", "className":"<the application class to execute>", "args":[<application parameters>], "numExecutors":10, "executorMemory":"2G", "executorCores":5' localhost:8998/batches

### Change these parameters on a Spark Thrift Server
Spark Thrift Server provides JDBC/ODBC access to a Spark cluster and is used to service Spark SQL queries. Tools like Power BI, Tableau etc. use ODBC protocol to communicate with Spark Thrift Server to execute Spark SQL queries as a Spark Application. When a Spark cluster is created, two instances of the Spark Thrift Server are started, one on each head node. Each Spark Thrift Server is visible as a Spark application in the YARN UI.

Spark Thrift Server uses Spark dynamic executor allocation and hence the `spark.executor.instances` is not used. Instead, Spark Thrift Server uses `spark.dynamicAllocation.minExecutors` and `spark.dynamicAllocation.maxExecutors` to specify the executor count. The configuration parameters `spark.executor.cores` and `spark.executor.memory` is used to modify the executor size. You can change these parameters as shown in the following steps:

* Expand the **Advanced spark-thrift-sparkconf** category to update the parameters `spark.dynamicAllocation.minExecutors`, `spark.dynamicAllocation.maxExecutors`, and `spark.executor.memory`.

    ![Configure Spark thrift server](./media/apache-spark-resource-manager/spark-thrift-server-1.png)    
* Expand the **Custom spark-thrift-sparkconf** category to update the parameter `spark.executor.cores`.

    ![Configure Spark thrift server](./media/apache-spark-resource-manager/spark-thrift-server-2.png)

### Change the driver memory of the Spark Thrift Server
Spark Thrift Server driver memory is configured to 25% of the head node RAM size, provided the total RAM size of the head node is greater than 14 GB. You can use the Ambari UI to change the driver memory configuration, as shown in the following screenshot:

* From the Ambari UI click **Spark**, click **Configs**, expand **Advanced spark-env**, and then provide the value for **spark_thrift_cmd_opts**.

    ![Configure Spark thrift server RAM](./media/apache-spark-resource-manager/spark-thrift-server-ram.png)

## Reclaim Spark cluster resources
Because of Spark dynamic allocation, the only resources that are consumed by thrift server are the resources for the two application masters. To reclaim these resources, you must stop the Thrift Server services running on the cluster.

1. From the Ambari UI, from the left pane, click **Spark**.
2. In the next page, click **Spark Thrift Servers**.

    ![Restart thrift server](./media/apache-spark-resource-manager/restart-thrift-server-1.png)
3. You should see the two headnodes on which the Spark Thrift Server is running. Click one of the headnodes.

    ![Restart thrift server](./media/apache-spark-resource-manager/restart-thrift-server-2.png)
4. The next page lists all the services running on that headnode. From the list click the drop-down button next to Spark Thrift Server, and then click **Stop**.

    ![Restart thrift server](./media/apache-spark-resource-manager/restart-thrift-server-3.png)
5. Repeat these steps on the other headnode as well.

## Restart the Jupyter service
Launch the Ambari Web UI as shown in the beginning of the article. From the left navigation pane, click **Jupyter**, click **Service Actions**, and then click **Restart All**. This starts the Jupyter service on all the headnodes.

![Restart Jupyter](./media/apache-spark-resource-manager/restart-jupyter.png "Restart Jupyter")

## Monitor resources
Launch the Yarn UI as shown in the beginning of the article. In Cluster Metrics table on top of the screen, check values of **Memory Used** and **Memory Total** columns. If the two values are close, there might not be enough resources to start the next application. The same applies to the **VCores Used** and **VCores Total** columns. Also, in the main view, if there is an application stayed in **ACCEPTED** state and not transitioning into **RUNNING** nor **FAILED** state, this could also be an indication that it is not getting enough resources to start.

![Resource Limit](./media/apache-spark-resource-manager/resource-limit.png "Resource Limit")

## Kill running applications
1. In the Yarn UI, from the left panel, click **Running**. From the list of running applications, determine the application to be killed and click on the **ID**.

    ![Kill App1](./media/apache-spark-resource-manager/kill-app1.png "Kill App1")

2. Click **Kill Application** on the top right corner, then click **OK**.

    ![Kill App2](./media/apache-spark-resource-manager/kill-app2.png "Kill App2")

## See also
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)

### For data analysts

* [Apache Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Apache Spark in HDInsight](apache-spark-custom-library-website-log-analysis.md)
* [Application Insight telemetry data analysis using Apache Spark in HDInsight](apache-spark-analyze-application-insight-logs.md)
* [Use Caffe on Azure HDInsight Spark for distributed deep learning](apache-spark-deep-learning-caffe.md)

### For Apache Spark developers

* [Create a standalone application using Scala](apache-spark-create-standalone-application.md)
* [Run jobs remotely on an Apache Spark cluster using Apache Livy](apache-spark-livy-rest-interface.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applications](apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Apache Spark applications remotely](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Apache Zeppelin notebooks with an Apache Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Apache Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)
