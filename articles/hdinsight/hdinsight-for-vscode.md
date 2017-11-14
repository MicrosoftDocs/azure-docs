---
title: Azure HDInsight Tools - Use Visual Studio Code for Hive, LLAP or pySpark | Microsoft Docs
description: Learn how to use the Azure HDInsight Tools for Visual Studio Code to create and submit queries and scripts.
Keywords: VScode,Azure HDInsight Tools,Hive,Python,PySpark,Spark,HDInsight,Hadoop,LLAP,Interactive Hive,Interactive Query
services: HDInsight
documentationcenter: ''
author: jejiang
manager: 
editor: jgao
tags: azure-portal

ms.assetid: 
ms.service: HDInsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/27/2017
ms.author: jejiang
---

# Use Azure HDInsight Tools for Visual Studio Code

Learn how to use the Azure HDInsight Tools for Visual Studio Code (VSCode) to create and submit Hive batch jobs, interactive Hive queries, and pySpark scripts. The Azure HDInsight Tools can be installed on the platforms that are supported by VSCode. These include Windows, Linux, and MacOS. You can find the prerequisites for different platforms.


## Prerequisites

The following items are required for completing this article:

- A HDInsight cluster.  To create a cluster, see [Get started with HDInsight]( hdinsight-hadoop-linux-tutorial-get-started.md).
- [Visual Studio Code](https://www.visualstudio.com/products/code-vs.aspx).
- [Mono](http://www.mono-project.com/docs/getting-started/install/). Mono is only required for Linux and MacOS.

## Install the HDInsight Tools
   
After you have installed the prerequisites, you can install the Azure HDInsight Tools for VSCode. 

**To Install Azure HDInsight tools**

1. Open Visual Studio Code.
2. In the left pane, select **Extensions**. In the search box, enter **HDInsight**.
3. Next to **Azure HDInsight tools**, select **Install**. After a few seconds, the **Install** button changes to **Reload**.
4. Select **Reload** to activate the **Azure HDInsight tools** extension.
5. Select **Reload Window** to confirm. You can see **Azure HDInsight tools** in the **Extensions** pane.

   ![HDInsight for Visual Studio Code Python install](./media/hdinsight-for-vscode/install-hdInsight-plugin.png)

## Open HDInsight workspace

You need to create a workspace in VSCode before you can connect to Azure.

**To open a workspace**

1. On the **File** menu, select **Open Folder**. Then designate an existing folder as your work folder or create a new one. The folder appears on the left pane.

2. On the left pane, select the **New File** icon next to the work folder.

   ![New file](./media/hdinsight-for-vscode/new-file.png)
3. Name the new file with either the .hql (Hive queries) or the .py (Spark script) file extension. Notice that an **XXXX_hdi_settings.json** configuration file is automatically added to the work folder.
4. Open **XXXX_hdi_settings.json** from **EXPLORER**, or right-click on the script editor to select **Set Configuration**. You can configure login entry, default cluster, and job submission parameters as shown in the sample in the file. You also can leave the remaining parameters empty.

## Connect to Azure

Before you can submit scripts to HDInsight clusters from VSCode, you need connect to your Azure account.

**To connect to Azure**

1. Create a new work folder and a new script file if you don't already have them.

2. Right-click the script editor, and then, on the context menu, select **HDInsight: Login**. You can also press **CTRL+SHIFT+P**, and then enter **HDInsight: Login**.

    ![HDInsight Tools for Visual Studio Code log in](./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-login.png)
3. To sign in, follow the sign-in instructions in the **OUTPUT** pane.

    **Azure:**
    ![HDInsight Tools for Visual Studio Code login info](./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-Azurelogin-info.png)

    After you're connected, your Azure account name is shown on the status bar at the bottom left of the VSCode window. 

    > [!NOTE]
    > Because of a known Azure authentication issue, you need to open a browser in private mode or incognito mode. 
    > If your Azure account has two factors enabled, we recommended using phone authentication instead of PIN authentication.
  

4. Right-click the script editor to open the context menu. From the context menu, you can perform the following tasks:

    - Log out
    - List clusters
    - Set default clusters
    - Submit interactive Hive queries
    - Submit Hive batch scripts
    - Submit interactive PySpark queries
    - Submit PySpark batch scripts
    - Set configurations

## List HDInsight clusters

To test the connection, you can list your HDInsight clusters:

**To list HDInsight clusters under your Azure subscription**
1. Open a workspace and connect to Azure. For more information, see [Open HDInsight workspace](#open-hdinsight-workspace) and [Connect to Azure](#connect-to-azure).
2. Right-click the script editor, and then select **HDInsight: List Cluster** from the context menu. 
3. The Hive and Spark clusters appear in the **Output** pane.

    ![Set a default cluster configuration](./media/hdinsight-for-vscode/list-cluster-result.png)

## Set a default cluster
1. Open a workspace and connect to Azure. See [Open HDInsight workspace](#open-hdinsight-workspace) and [Connect to Azure](#connect-to-azure).
2. Right-click the script editor, and then select **HDInsight: Set Default Cluster**. 
3. Select a cluster as default cluster for the current script file. The tools automatically update the configuration file **XXXX_hdi_settings.json**. 

   ![Set default cluster configuration](./media/hdinsight-for-vscode/set-default-cluster-configuration.png)

## Set the Azure environment 
1. Open the command palette by pressing **CTRL+SHIFT+P**.
2. Enter **HDInsight: Set Azure Environment**.
3. Select one way from Azure and AzureChina as your default login entry.
4. Meanwhile, the tool has already saved your default login entry in **XXXX_hdi_settings.json**. You also directly update it in this configuration file. 

   ![Set default login entry configuration](./media/hdinsight-for-vscode/set-default-login-entry-configuration.png)

## Submit interactive Hive queries

HDInsight Tools for VSCode enables you to submit interactive Hive queries to HDInsight interactive query clusters.

1. Create a new work folder and a new Hive script file if you don't already have them.
2. Connect to your Azure account, and then configure the default cluster if you haven't already done so.
3. Copy and paste the following code into your Hive file, and then save it.

    ```hiveql
    SELECT * FROM hivesampletable;
    ```
3. Right-click the script editor, and then select **HDInsight: Hive Interactive** to submit the query. The tools also allow you to submit a block of code instead of the whole script file using the context menu. Soon after, the query result is shown in a new tab:

   ![Interactive Hive result](./media/hdinsight-for-vscode/interactive-hive-result.png)

    - **RESULTS** panel: You can save the whole result as CSV, JSON, or EXCEL to local path, or just select multiple lines.
    - **MESSAGES** panel: When you select **Line** number, it jumps to the first line of the running script.

Running the interactive query takes much less time than [running a Hive batch job](#submit-hive-batch-scripts).

## Submit Hive batch scripts

1. Create a new work folder and a new Hive script file if you don't have one.
2. Connect to your Azure account, and then configure the default cluster if you haven't done so.
3. Copy and paste the following code into your Hive file, and then save it.

    ```hiveql
    SELECT * FROM hivesampletable;
    ```
3. Right-click the script editor, and then select **HDInsight: Hive Batch** to submit a Hive job. 
4. Select the cluster to which you want to submit.  

    After you submit a Hive job, the submission success info and jobid appears in the **OUTPUT** panel. The Hive job also opens **WEB BROWSER**, which shows the realtime job  logs and status.

   ![submit Hive job result](./media/hdinsight-for-vscode/submit-Hivejob-result.png)

[Submitting interactive Hive queries](#submit-interactive-hive-queries) takes much less time than submitting a batch job.

## Submit interactive PySpark queries
HDInsight Tools for VSCode also enables you to submit interactive PySpark queries to Spark clusters.
1. Create a new work folder and a new script file with the .py extension if you don't already have them.
2. Connect to your Azure account if you haven't yet done so.
3. Copy and paste the following code into the script file:
   ```python
   from operator import add
   lines = spark.read.text("/HdiSamples/HdiSamples/FoodInspectionData/README").rdd.map(lambda r: r[0])
   counters = lines.flatMap(lambda x: x.split(' ')) \
                .map(lambda x: (x, 1)) \
                .reduceByKey(add)

   coll = counters.collect()
   sortedCollection = sorted(coll, key = lambda r: r[1], reverse = True)

   for i in range(0, 5):
        print(sortedCollection[i])
   ```
4. Highlight these scripts. Then right-click the script editor and select **HDInsight: PySpark Interactive**.
5. Select the **Install** button as shown in the following illustration if you haven't already installed the **Python** extension in VSCode.
    ![HDInsight for Visual Studio Code Python install](./media/hdinsight-for-vscode/hdinsight-vscode-install-python.png)

6. Install the Python environment in your system if you haven't already. 
   - For Windows, download and install [Python](https://www.python.org/downloads/). Then make sure `Python` and `pip` are in your system PATH.
   - For instructions for MacOS and Linux, see [Set up PySpark interactive environment for Visual Studio Code](set-up-pyspark-interactive-environment.md).
7. Select a cluster to which to submit your PySpark query. Soon after, the query result is shown in the new right tab:

   ![Submit Python job result](./media/hdinsight-for-vscode/pyspark-interactive-result.png) 
8. Our tool also supports the **SQL Clause**  query.

   ![Submit Python job result](./media/hdinsight-for-vscode/pyspark-ineteractive-select-result.png)
   The submission status displays on the left of the bottom status bar when you're running queries. You cannot submit other queries when the status is **PySpark Kernel (busy)**. Otherwise, the running is hang.
9. Our clusters can maintain a session. For example, **a=100** already keep this session in cluster, now you only run **print a** to cluster.
 

## Submit PySpark batch job

1. Create a new work folder and a new script file with the .py extension if you don't already have one.
2. Connect to your Azure account, if you haven't already done so.
3. Copy and paste the following code into the script file:

    ```python
    from __future__ import print_function
    import sys
    from operator import add
    from pyspark.sql import SparkSession
    if __name__ == "__main__":
        spark = SparkSession\
            .builder\
            .appName("PythonWordCount")\
            .getOrCreate()
    
        lines = spark.read.text('/HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv').rdd.map(lambda r: r[0])
        counts = lines.flatMap(lambda x: x.split(' '))\
                    .map(lambda x: (x, 1))\
                    .reduceByKey(add)
        output = counts.collect()
        for (word, count) in output:
            print("%s: %i" % (word, count))
        spark.stop()
    ```
4. Right-click the script editor, and then select **HDInsight: PySpark Batch**. 
5. Select a cluster to which to submit your PySpark job. 

   ![Submit Python job result](./media/hdinsight-for-vscode/submit-pythonjob-result.png) 

After you submit a Python job, submission logs are shown in the **OUTPUT** window in VSCode. The **Spark UI URL** and **Yarn UI URL** are shown as well. You can open the URL in a web browser to track the job status.


## Additional features

HDInsight for VSCode supports the following features:

- **IntelliSense auto-complete**. Suggestions pop up for keyword, methods, variables, and so on. Different icons represent different types of objects:

    ![HDInsight Tools for Visual Studio Code IntelliSense object types](./media/hdinsight-for-vscode/hdinsight-for-vscode-auto-complete-objects.png)
- **IntelliSense error marker**. The language service underlines the editing errors for the Hive script.     
- **Syntax highlights**. The language service uses different colors to differentiate variables, keywords, data type, functions, and so on. 

    ![HDInsight Tools for Visual Studio Code syntax highlights](./media/hdinsight-for-vscode/hdinsight-for-vscode-syntax-highlights.png)

## Next steps

### Demo
* HDInsight for VScode: [Video](https://go.microsoft.com/fwlink/?linkid=858706)

### Tools and extensions

* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through VPN](spark/apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through SSH](spark/apache-spark-intellij-tool-debug-remotely-through-ssh.md)
* [Use HDInsight Tools for IntelliJ with Hortonworks Sandbox](hadoop/hdinsight-tools-for-intellij-with-hortonworks-sandbox.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](spark/apache-spark-eclipse-tool-plugin.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](spark/apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](spark/apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](spark/apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](spark/apache-spark-jupyter-notebook-install-locally.md)
* [Visualize Hive data with Microsoft Power BI in Azure HDInsight](hadoop/apache-hadoop-connect-hive-power-bi.md)
* [Set Up PySpark Interactive Environment for Visual Studio Code](set-up-pyspark-interactive-environment.md)
* [Use Zeppelin to run Hive queries in Azure HDInsight ](./hdinsight-connect-hive-zeppelin.md)

### Scenarios
* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](spark/apache-spark-use-bi-tools.md)
* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](spark/apache-spark-ipython-notebook-machine-learning.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](spark/apache-spark-machine-learning-mllib-ipython.md)
* [Spark Streaming: Use Spark in HDInsight for building realtime streaming applications](spark/apache-spark-eventhub-streaming.md)
* [Website log analysis using Spark in HDInsight](spark/apache-spark-custom-library-website-log-analysis.md)

### Create and running applications
* [Create a standalone application using Scala](spark/apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](spark/apache-spark-livy-rest-interface.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](spark/apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](spark/apache-spark-job-debugging.md)



