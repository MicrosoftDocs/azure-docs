---
title: Kernels for Jupyter notebook on Spark clusters in Azure HDInsight 
description: Learn about the PySpark, PySpark3, and Spark kernels for Jupyter notebook available with Spark clusters on Azure HDInsight.
keywords: jupyter notebook on spark,jupyter spark
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 02/22/2018
ms.author: jasonh

---
# Kernels for Jupyter notebook on Spark clusters in Azure HDInsight 

HDInsight Spark clusters provide kernels that you can use with the Jupyter notebook on Spark for testing your applications. A kernel is a program that runs and interprets your code. The three kernels are:

- **PySpark** - for applications written in Python2
- **PySpark3** - for applications written in Python3
- **Spark** - for applications written in Scala

In this article, you learn how to use these kernels and the benefits of using them.

## Prerequisites

* An Apache Spark cluster in HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

## Create a Jupyter notebook on Spark HDInsight

1. From the [Azure portal](https://portal.azure.com/), open your cluster.  See [List and show clusters](../hdinsight-administer-use-portal-linux.md#list-and-show-clusters) for the instructions. The cluster is opened in a new portal blade.

2. From the **Quick links** section, click **Cluster dashboards** to open the **Cluster dashboards** blade.  If you don't see **Quick Links**, click **Overview** from the left menu on the blade.

    ![Jupyter notebook on Spark](./media/apache-spark-jupyter-notebook-kernels/hdinsight-jupyter-notebook-on-spark.png "Jupyter notebook on Spark") 

3. Click **Jupyter Notebook**. If prompted, enter the admin credentials for the cluster.
   
   > [!NOTE]
   > You may also reach the Jupyter notebook on Spark cluster by opening the following URL in your browser. Replace **CLUSTERNAME** with the name of your cluster:
   >
   > `https://CLUSTERNAME.azurehdinsight.net/jupyter`
   > 
   > 

3. Click **New**, and then click either **Pyspark**, **PySpark3**, or **Spark** to create a notebook. Use the Spark kernel for Scala applications, PySpark kernel for Python2 applications, and PySpark3 kernel for Python3 applications.
   
    ![Kernels for Jupyter notebook on Spark](./media/apache-spark-jupyter-notebook-kernels/kernel-jupyter-notebook-on-spark.png "Kernels for Jupyter notebook on Spark") 

4. A notebook opens with the kernel you selected.

## Benefits of using the kernels

Here are a few benefits of using the new kernels with Jupyter notebook on Spark HDInsight clusters.

- **Preset contexts**. With  **PySpark**, **PySpark3**, or the **Spark** kernels, you do not need to set the Spark or Hive contexts explicitly before you start working with your applications. These are available by default. These contexts are:
   
   * **sc** - for Spark context
   * **sqlContext** - for Hive context
   
   So, you don't have to run statements like the following to set the contexts:
   
          sc = SparkContext('yarn-client')
          sqlContext = HiveContext(sc)
   
   Instead, you can directly use the preset contexts in your application.

- **Cell magics**. The PySpark kernel provides some predefined "magics", which are special commands that you can call with `%%` (for example, `%%MAGIC` <args>). The magic command must be the first word in a code cell and allow for multiple lines of content. The magic word should be the first word in the cell. Adding anything before the magic, even comments, causes an error.     For more information on magics, see [here](http://ipython.readthedocs.org/en/stable/interactive/magics.html).
   
    The following table lists the different magics available through the kernels.

   | Magic | Example | Description |
   | --- | --- | --- |
   | help |`%%help` |Generates a table of all the available magics with example and description |
   | info |`%%info` |Outputs session information for the current Livy endpoint |
   | configure |`%%configure -f`<br>`{"executorMemory": "1000M"`,<br>`"executorCores": 4`} |Configures the parameters for creating a session. The force flag (-f) is mandatory if a session has already been created, which ensures that the session is dropped and recreated. Look at [Livy's POST /sessions Request Body](https://github.com/cloudera/livy#request-body) for a list of valid parameters. Parameters must be passed in as a JSON string and must be on the next line after the magic, as shown in the example column. |
   | sql |`%%sql -o <variable name>`<br> `SHOW TABLES` |Executes a Hive query against the sqlContext. If the `-o` parameter is passed, the result of the query is persisted in the %%local Python context as a [Pandas](http://pandas.pydata.org/) dataframe. |
   | local |`%%local`<br>`a=1` |All the code in subsequent lines is executed locally. Code must be valid Python2 code even irrespective of the kernel you are using. So, even if you selected **PySpark3** or **Spark** kernels while creating the notebook, if you use the `%%local` magic in a cell, that cell must only have valid Python2 code.. |
   | logs |`%%logs` |Outputs the logs for the current Livy session. |
   | delete |`%%delete -f -s <session number>` |Deletes a specific session of the current Livy endpoint. You cannot delete the session that is initiated for the kernel itself. |
   | cleanup |`%%cleanup -f` |Deletes all the sessions for the current Livy endpoint, including this notebook's session. The force flag -f is mandatory. |

   > [!NOTE]
   > In addition to the magics added by the PySpark kernel, you can also use the [built-in IPython magics](https://ipython.org/ipython-doc/3/interactive/magics.html#cell-magics), including `%%sh`. You can use the `%%sh` magic to run scripts and block of code on the cluster headnode.
   >
   >
2. **Auto visualization**. The **Pyspark** kernel automatically visualizes the output of Hive and SQL queries. You can choose between several different types of visualizations including Table, Pie, Line, Area, Bar.

## Parameters supported with the %%sql magic
The `%%sql` magic supports different parameters that you can use to control the kind of output that you receive when you run queries. The following table lists the output.

| Parameter | Example | Description |
| --- | --- | --- |
| -o |`-o <VARIABLE NAME>` |Use this parameter to persist the result of the query, in the %%local Python context, as a [Pandas](http://pandas.pydata.org/) dataframe. The name of the dataframe variable is the variable name you specify. |
| -q |`-q` |Use this to turn off visualizations for the cell. If you don't want to auto-visualize the content of a cell and just want to capture it as a dataframe, then use `-q -o <VARIABLE>`. If you want to turn off visualizations without capturing the results (for example, for running a SQL query, like a `CREATE TABLE` statement), use `-q` without specifying a `-o` argument. |
| -m |`-m <METHOD>` |Where **METHOD** is either **take** or **sample** (default is **take**). If the method is **take**, the kernel picks elements from the top of the result data set specified by MAXROWS (described later in this table). If the method is **sample**, the kernel randomly samples elements of the data set according to `-r` parameter, described next in this table. |
| -r |`-r <FRACTION>` |Here **FRACTION** is a floating-point number between 0.0 and 1.0. If the sample method for the SQL query is `sample`, then the kernel randomly samples the specified fraction of the elements of the result set for you. For example, if you run a SQL query with the arguments `-m sample -r 0.01`, then 1% of the result rows are randomly sampled. |
| -n |`-n <MAXROWS>` |**MAXROWS** is an integer value. The kernel limits the number of output rows to **MAXROWS**. If **MAXROWS** is a negative number such as **-1**, then the number of rows in the result set is not limited. |

**Example:**

    %%sql -q -m sample -r 0.1 -n 500 -o query2
    SELECT * FROM hivesampletable

The statement above does the following:

* Selects all records from **hivesampletable**.
* Because we use -q, it turns off auto-visualization.
* Because we use `-m sample -r 0.1 -n 500` it randomly samples 10% of the rows in the hivesampletable and limits the size of the result set to 500 rows.
* Finally, because we used `-o query2` it also saves the output into a dataframe called **query2**.

## Considerations while using the new kernels

Whichever kernel you use, leaving the notebooks running consumes the cluster resources.  With these kernels, because the contexts are preset, simply exiting the notebooks does not kill the context and hence the cluster resources continue to be in use. A good practice is to use the **Close and Halt** option from the notebook's **File** menu when you are finished using the notebook, which kills the context and then exits the notebook.     

## Show me some examples

When you open a Jupyter notebook, you see two folders available at the root level.

* The **PySpark** folder has sample notebooks that use the new **Python** kernel.
* The **Scala** folder has sample notebooks that use the new **Spark** kernel.

You can open the **00 - [READ ME FIRST] Spark Magic Kernel Features** notebook from the **PySpark** or **Spark** folder to learn about the different magics available. You can also use the other sample notebooks available under the two folders to learn how to achieve different scenarios using Jupyter notebooks with HDInsight Spark clusters.

## Where are the notebooks stored?

If your cluster uses Azure Storage as the default storage account, Jupyter notebooks are saved to storage account under the **/HdiNotebooks** folder.  Notebooks, text files, and folders that you create from within Jupyter are accessible from the storage account.  For example, if you use Jupyter to create a folder **myfolder** and a notebook **myfolder/mynotebook.ipynb**, you can access that notebook at `/HdiNotebooks/myfolder/mynotebook.ipynb` within the storage account.  The reverse is also true, that is, if you upload a notebook directly to your storage account at `/HdiNotebooks/mynotebook1.ipynb`, the notebook is visible from Jupyter as well.  Notebooks remain in the storage account even after the cluster is deleted.

> [!NOTE]
> HDInsight clusters with Azure Data Lake Store as the default storage do not store notebooks in associated storage.
>

The way notebooks are saved to the storage account is compatible with HDFS. So, if you SSH into the cluster you can use file management commands as shown in the following snippet:

    hdfs dfs -ls /HdiNotebooks                               # List everything at the root directory – everything in this directory is visible to Jupyter from the home page
    hdfs dfs –copyToLocal /HdiNotebooks                    # Download the contents of the HdiNotebooks folder
    hdfs dfs –copyFromLocal example.ipynb /HdiNotebooks   # Upload a notebook example.ipynb to the root folder so it’s visible from Jupyter

Irrespective of whether the cluster uses Azure Storage or Azure Data Lake Store as the default storage account, the notebooks are also saved on the cluster headnode at `/var/lib/jupyter`.

## Supported browser

Jupyter notebooks on Spark HDInsight clusters are supported only on Google Chrome.

## Feedback
The new kernels are in evolving stage and will mature over time. This could also mean that APIs could change as these kernels mature. We would appreciate any feedback that you have while using these new kernels. This is useful in shaping the final release of these kernels. You can leave your comments/feedback under the **Comments** section at the bottom of this article.

## <a name="seealso"></a>See also
* [Overview: Apache Spark on Azure HDInsight](apache-spark-overview.md)

### Scenarios
* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](apache-spark-use-bi-tools.md)
* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Spark in HDInsight](apache-spark-custom-library-website-log-analysis.md)

### Create and run applications
* [Create a standalone application using Scala](apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](apache-spark-livy-rest-interface.md)

### Tools and extensions
* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applications](apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Spark applications remotely](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Use external packages with Jupyter notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)
