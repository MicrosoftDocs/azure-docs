<properties 
	pageTitle="Use Resource Manager to allocate resources to the Apache Spark cluster in HDInsight| Microsoft Azure" 
	description="Learn how to use the Resource Manager for Spark clusters on HDInsight for better performance." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.author="nitinme"/>


# Manage resources for the Apache Spark cluster on HDInsight Linux (Preview)

Spark on Azure HDInsight (Linux) provides the Ambari Web UI to manage the cluster resources and monitor the health of the cluster. You can also use the Spark History Server to track applications that have finished running on the cluster. You can use the YARN UI to monitor that are currently running on the cluster. This article provides instructions on how to access these UIs and how to perform some basic resource management tasks using these interfaces.

**Prerequisites:**

You must have the following:

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- An Apache Spark cluster on HDInsight Linux. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).

## How do I launch the Ambari Web UI?

1. From the [Azure Portal](https://ms.portal.azure.com/), from the startboard, click the tile for your Spark cluster (if you pinned it to the startboard). You can also navigate to your cluster under **Browse All** > **HDInsight Clusters**. 
 
2. From the Spark cluster blade, click **Dashboard**. When prompted, enter the admin credentials for the Spark cluster.

	![Launch Ambari](./media/hdinsight-apache-spark-resource-manager/hdispark.cluster.launch.dashboard.png "Start Resource Manager")

3. This should launch the Ambari Web UI, as shown below.

	![Ambari Web UI](./media/hdinsight-apache-spark-resource-manager/ambari-web-ui.png "Ambari Web UI")   

## How do I launch the Spark History Server?

1. From the [Azure Portal](https://ms.portal.azure.com/), from the startboard, click the tile for your Spark cluster (if you pinned it to the startboard).

2. From the cluster blade, under **Quick Links**, click **Cluster Dashboard**. In the **Cluster Dashboard** blade, click **Spark History Server**.

	![Spark History Server](./media/hdinsight-apache-spark-resource-manager/launch-history-server.png "Spark History Server")

	When prompted, enter the admin credentials for the Spark cluster.


## How do I launch the Yarn UI?

You can use the YARN UI to monitor applications that are currently running on the Spark cluster. 

1. From the cluster blade, click **Cluster Dashboard**, and then click **YARN**.

	![Launch YARN UI](./media/hdinsight-apache-spark-resource-manager/launch-yarn-ui.png)

	>[AZURE.TIP] Alternatively, you can also launch the YARN UI from the Ambari UI. To launch the Ambari UI, from the cluster blade, click **Cluster Dashboard**, and then click **HDInsight Cluster Dashboard**. From the Ambari UI, click **YARN**, click **Quick Links**, click the active resource manager, and then click **ResourceManager UI**.

##<a name="scenariosrm"></a>How do I manage resources using the Ambari Web UI?

Here are some common scenarios that you might run into with your Spark cluster, and the instructions on how to address those using the Ambari Web UI.

### What is the optimum cluster configuration to run Spark applications?

The three key parameters that can be used for Spark configuration depending on application requirements are `spark.executor.instances`, `spark.executor.cores`, and `spark.executor.memory`. An Executor is a process launched for a Spark application. It runs on the worker node and is responsible to carry out the tasks for the application. The default number of executors and the executor sizes for each cluster is calculated based on the number of worker nodes and the worker node size. These are stored in `spark-defaults.conf` on the cluster head nodes. 

The three configuration parameters can be configured at the cluster level (for all applications that run on the cluster) or can be specified for each individual application as well.

#### Change the parameters using Ambari UI

1. Launch the Ambari UI. Click **Spark**, click **Configs**, and then expand **Custom spark-defaults**.

	![Set parameters using Ambari](./media/hdinsight-apache-spark-resource-manager/set-parameters-using-ambari.png)

2. The default values will allow to run 4 Spark applications concurrently on the cluster. You can changes these values from the user interface, as shown below.

	![Set parameters using Ambari](./media/hdinsight-apache-spark-resource-manager/set-executor-parameters.png)

3. Click **Save** to save the configuration changes. At the top of the page, you will be prompted to restart all the affected services. Click **Restart**.

	![Restart services](./media/hdinsight-apache-spark-resource-manager/restart-services.png)


#### Change the parameters for an application running in Jupyter notebook

For applications running in the Jupyter notebook, you can use the `%%configure` magic to make the configuration changes. Ideally, you must make such changes at the beginning of the application, before you run your first code cell. This ensures that the configuration is applied to the Livy session, when it gets created. If you want to change the configuration at a later stage in the application, you must use the `-f` parameter. However, by doing so all progress in the application will be lost.

The snippet below shows how to change the configuration for an application running in Jupyter.

	%%configure 
	{"executorMemory": "3072M", "executorCores": 4, “numExecutors”:10}

Configuration parameters must be passed in as a JSON string and must be on the next line after the magic, as shown in the example column. 

#### Change the parameters for an application submitted using spark-submit

Following command is an example of how to change the configuration parameters for a batch application that is submitted using `spark-submit`.

	spark-submit --class <the application class to execute> --executor-memory 3072M --executor-cores 4 –-num-executors 10 <location of application jar file> <application parameters>

#### Change the parameters for an application submitted using cURL

Following command is an example of how to change the configuration parameters for a batch application that is submitted using using cURL.

	curl -k -v -H 'Content-Type: application/json' -X POST -d '{"file":"<location of application jar file>", "className":"<the application class to execute>", "args":[<application parameters>], "numExecutors":10, "executorMemory":"2G", "executorCores":5' localhost:8998/batches

#### How do I change these parameters on a Spark Thrift Server?

Spark Thrift Server provides JDBC/ODBC access to a Spark cluster. Spark Thrift Server uses Spark dynamic executor allocation and hence the `spark.executor.instances` is not used. Instead, Spark Thrift Server uses `spark.dynamicAllocation.minExecutors` and `spark.dynamicAllocation.maxExecutors` to specify the executor count. The configuration parameters `spark.executor.cores` and `spark.executor.memory` is used to modify the executor size. You can change these parameters as shown below.

* Expand the **Advanced spark-thrift-sparkconf** category to update the parameters `spark.dynamicAllocation.minExecutors`, `spark.dynamicAllocation.maxExecutors`, and `spark.executor.memory`.

	![Configure Spark thrift server](./media/hdinsight-apache-spark-resource-manager/spark-thrift-server-1.png)	

* Expand the **Custom spark-thrift-sparkconf** category to update the parameter `spark.executor.cores`.

	![Configure Spark thrift server](./media/hdinsight-apache-spark-resource-manager/spark-thrift-server-2.png)

### I do not use BI with Spark cluster. How do I take the resources back?

1. Launch the Ambari Web UI as shown above. From the left navigation pane, click **Spark**, and then click **Configs**.

2. In the list of configurations available, look for **Custom spark-thrift-sparkconf** and change the values for **spark.executor.memory** and **spark.drivers.core** to **0**.

	![Resources for BI](./media/hdinsight-apache-spark-resource-manager/spark-bi-resources.png "Resources for BI")

3. Click **Save**. Enter a description for the changes you made and then click **Save** again.

4. At the top of the page, you should see a prompt to restart the Spark service. Click **Restart** for the changes to take affect.


### My Jupyter notebooks are not running as expected. How can I restart the service?

1. Launch the Ambari Web UI as shown above. From the left navigation pane, click **Jupyter**, click **Service Actions**, and then click **Restart All**. This will start the Jupyter service on all the headnodes.

	![Restart Jupyter](./media/hdinsight-apache-spark-resource-manager/restart-jupyter.png "Restart Jupyter")

	


## <a name="seealso"></a>See also


* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)

### Scenarios

* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools.md)

* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](hdinsight-apache-spark-ipython-notebook-machine-learning.md)

* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)

* [Spark Streaming: Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-eventhub-streaming.md)

* [Website log analysis using Spark in HDInsight](hdinsight-apache-spark-custom-library-website-log-analysis.md)

### Create and run applications

* [Create a standalone application using Scala](hdinsight-apache-spark-create-standalone-application.md)

* [Run jobs remotely on a Spark cluster using Livy](hdinsight-apache-spark-livy-rest-interface.md)

### Tools and extensions

* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applicatons](hdinsight-apache-spark-intellij-tool-plugin.md)

* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-use-zeppelin-notebook.md)

* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)



[hdinsight-versions]: hdinsight-component-versioning.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: storage-create-storage-account.md 
