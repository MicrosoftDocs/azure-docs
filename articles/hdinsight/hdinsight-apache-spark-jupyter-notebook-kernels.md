<properties 
	pageTitle="Kernels available with Jupyter notebooks on HDInsight Spark clusters on Linux| Microsoft Azure" 
	description="Learn about the additional Jupyter notebook kernels available with Spark cluster on HDInsight Linux." 
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
	ms.date="02/17/2016" 
	ms.author="nitinme"/>


# Kernels available for Jupyter notebooks with Spark clusters on HDInsight (Linux)

Apache Spark cluster on HDInsight (Linux) includes Jupyter notebooks that you can use to test your applications. By default Jupyter notebook comes with a **Python2** kernel. A kernel is a program that runs and interprets your code. HDInsight Spark clusters provide two additional kernels that you can use with the Jupyter notebook. These are:

1. **PySpark** (for applications written in Python)
2. **Spark** (for applications written in Scala)

In this article, you will learn about how to use these kernels and what are the benefits you get from using them.

**Prerequisites:**

You must have the following:

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- An Apache Spark cluster on HDInsight Linux. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).

## How do I use the kernels? 

1. From the [Azure Portal](https://portal.azure.com/), from the startboard, click the tile for your Spark cluster (if you pinned it to the startboard). You can also navigate to your cluster under **Browse All** > **HDInsight Clusters**.   

2. From the Spark cluster blade, click **Quick Links**, and then from the **Cluster Dashboard** blade, click **Jupyter Notebook**. If prompted, enter the admin credentials for the cluster.

	> [AZURE.NOTE] You may also reach the Jupyter Notebook for your cluster by opening the following URL in your browser. Replace __CLUSTERNAME__ with the name of your cluster:
	>
	> `https://CLUSTERNAME.azurehdinsight.net/jupyter`

2. Create a new notebook with the new kernels. Click **New**, and then click **Pyspark** or **Spark**. You should use the Spark kernel for Scala applications and PySpark kernel for Python applications.

	![Create a new Jupyter notebook](./media/hdinsight-apache-spark-jupyter-notebook-kernels/jupyter-kernels.png "Create a new Jupyter notebook") 

3. This should open a new notebook with the kernel you selected.

## Why should I use the new kernels?

Here are a few benefits of using the new kernels.

1. **Preset contexts**. With the default **Python2** kernel that is available with Jupyter notebooks, you need to set the Spark, SQL, or Hive contexts explicitly before you can start working with the application you are developing. If you use the new kernels (**PySpark** or **Spark**), these contexts are available for you by default. These contexts are:

	* **sc** - for Spark context
	* **sqlContext** - for SQL context
	* **hiveContext** - for Hive context


	So, you don't have to run statements like the following to set the contexts:

		###################################################
		# YOU DO NOT NEED TO RUN THIS WITH THE NEW KERNELS
		###################################################
		sc = SparkContext('yarn-client')
		sqlContext = SQLContext(sc)
		hiveContext = HiveContext(sc)

	Instead, you can directly use the preset contexts in your application.
	
2. **Cell magics**. The PySpark kernel provides some predefined “magics”, which are special commands that you can call with `%%` (e.g. `%%MAGIC` <args>). The magic command must be the first word in a code cell and allow for multiple lines of content. The magic word should be the first word in the cell. Adding anything before the magic, even comments, will cause an error. 	For more information on magics, see [here](http://ipython.readthedocs.org/en/stable/interactive/magics.html).

	The table below lists the different magics available through the kernels.

	| Magic     | Example                         | Description  |
	|-----------|---------------------------------|--------------|
	| help      | `%%help`  						  | Generates a table of all the available magics with example and description |
	| info      | `%%info`                          | Outputs session information for the current Livy endpoint |
	| configure | `%%configure -f {"executorMemory": "1000M", "executorCores": 4`} | Configures the parameters for creating a session. The force flag (-f) is mandatory if a session has already been created and the session will be dropped and recreated. Look at [Livy's POST /sessions Request Body](https://github.com/cloudera/livy#request-body) for a list of valid parameters. Parameters must be passed in as a JSON string. |
	| sql       |  `%%sql -o <variable name>`<br> `SHOW TABLES`    | Executes a SQL query against the sqlContext. If the `-o` parameter is passed, the result of the query is persisted in the %%local Python context as a [Pandas](http://pandas.pydata.org/) dataframe.   |
	| hive      |  `%%hive -o <variable name>`<br> `SHOW TABLES`   | Executes a Hive query against the hivelContext. If the -o parameter is passed, the result of the query is persisted in the %%local Python context as a [Pandas](http://pandas.pydata.org/) dataframe. |
	| local     |     `%%local`<br>`a=1`			  | All the code in subsequent lines will be executed locally. Code must be valid Python code. |
	| logs      | `%%logs`						  | Outputs the logs for the current Livy session.  |
	| delete    | `%%delete -f -s <session number>` | Deletes a specific session of the current Livy endpoint. Note that you cannot delete the session that is initiated for the kernel itself. |
	| cleanup   | `%%cleanup -f`                    | Deletes all the sessions for the current Livy endpoint, including this notebook's session. The force flag -f is mandatory.  |

3. **Auto visualization**. The **Pyspark** kernel automatically visualizes the output of Hive and SQL queries. You have the option to choose between several different types of visualizations including Table, Pie, Line, Area, Bar.


## Considerations while using the new kernels

Whichever kernel you use (Python2, PySpark, or Spark), leaving the notebooks running will consume your cluster resources. With the Python2 notebook, because you create the contexts explicitly, you can also kill those contexts when you exit the application.

However, with PySpark and Spark kernels, because the contexts are preset, you cannot explicitly kill the context as well. So, if you just exit the notebook, the context might still be running, using your cluster resources. A good practice with the PySpark and Spark kernels would be to use the **Close and Halt** option from the notebook's **File** menu. This kills the context and then exits the notebook. 	


## Show me some examples

When you open a Jupyter notebook, you will see two folders available at the root level.

* The **PySpark** folder has sample notebooks that use the new **Python** kernel.
* The **Scala** folder has sample notebooks that use the new **Spark** kernel.

You can open the **00 - [READ ME FIRST] Spark Magic Kernel Features** notebook from the **PySpark** or **Spark** folder to learn about the different magics available. You can also use the other sample notebooks available under the two folders to learn how to achieve different scenarios using Jupyter notebooks with HDInsight Spark clusters.

## Feedback

The new kernels are in evolving stage and will mature over time. This could also mean that APIs could change as these kernels mature. We would appreciate any feedback that you have while using these new kernels. This will be very useful in shaping the final release of these kernels. You can leave your comments/feedback under the **Comments** section at the bottom of this article.


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

### Manage resources

* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)
