---
title: HDInsight Tools - Use Visual Studio Code tool for Hive, LLAP or pySpark | Microsoft Docs
description: 'Learn how to use the Azure HDInsight Tools for Visual Studio Code to create, submit scripts. '
Keywords: VScode,Azure HDInsight Tools,Hive,Python,PySpark,Spark,HDInsight,Hadoop,LLAP,Interactive hive
services: data-lake-analytics
documentationcenter: ''
author: jejiang
manager: 
editor: 
tags: azure-portal

ms.assetid: 
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/20/2017
ms.author: jejiang
---

# Use Azure HDInsight Tool for Visual Studio Code (Hive, LLAP, or pySpark)

Learn how to use the Azure HDInsight Tools for Visual Studio Code (VSCode) to create, submit Hive, interactive Hive, or pySpark scripts.


## Prerequisites

The Azure HDInsight Tools can be installed on the platforms supported by VSCode including Windows, Linux, and MacOS. You can find the prerequisites for different platforms, and don't need to install Mono on windows. If it is Linux or MacOS, Mono needs to be installed.

- [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx)
    
- [Mono](http://www.mono-project.com/docs/getting-started/install/)


## Install the HDInsight Tools

After you have installed the prerequisites, you can install the Python and Azure HDInsight Tools for VSCode.

**To install the Python and HDInsight Tools**

Install **Azure HDInsight tools**

1. Open **Visual Studio Code**.
2. Click **Extensions** in the left pane. Enter **Azure HDInsight tools** in the search box. You can see Azure HDInsight tools listed.
3. Click **Install** next to **Azure HDInsight tools**. After a few seconds, the **Install** button will be changed to **Reload**.
4. Click **Reload** to activate the **Azure HDInsight tools** extension.
5. Click **Reload Window** to confirm. You can see **Azure HDInsight tools** in the Extensions pane.

   ![HDInsight for Visual Studio Code Python install](./media/hdinsight-for-vscode/install-hdInsight-plugin.png)

Install **Python**

To use pySpark, you need to install Python extension, which is not must have for Spark users.
1. Open **Visual Studio Code**.
2. Click **Extensions** in the left pane. Enter **python** in the search box. You can see a list of python extensions. One of them is **Python**.
3. Click **Install** next to **Python**. After a few seconds, the **Install** button will be changed to **Reload**.
4. Click **Reload** to activate the **Python** extension.
5. Click **Reload Window** to confirm. You can see **Python** in the Extensions pane.

     ![HDInsight for Visual Studio Code Python install](./media/hdinsight-for-vscode/hdinsight-vscode-install-python.png)

## Connect to Azure

Before you can submit scripts to cluster, you must connect to your Azure account.

**To connect to Azure**

1. Right-click a hive script editor, and then click **HDInsight: Login**. You can also use another way of pressing **CTRL+SHIFT+P** and entering **HDInsight: Login**.
2. There are two options to Log in. The Login info is shown in the **OUTPUT** pane.

    ![HDInsight Tools for Visual Studio Code log in](./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-login.png)
    ![HDInsight Tools for Visual Studio Code login options](./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-login-options.png)
    - Azure:
    ![HDInsight Tools for Visual Studio Code login info](./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-Azurelogin-info.png)
    - AzureChina:
    ![HDInsight Tools for Visual Studio Code China login info](./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-AzureChinalogin-info.png)
     
3. CTRL-click login URL: https://aka.ms/devicelogin or https://aka.ms/deviceloginchina to open the login web page. Copy and paste the corresponding code into the following text box, click Continue.

   ![HDInsight Tools for Visual Studio Code login paste code](./media/hdinsight-for-vscode/hdinsight-for-vscode-login-paste-code.png )   
4.  Follow the instructions to sign in from the web page. Once connected, your Azure account name is shown on the status bar at the left-bottom of the VSCode window. 

    > [!NOTE] 
    > If your account has two factors enabled, it is recommended to use phone authentication instead of Pin.
    > There is an known issue about Azure login. Recommend using Chrome.

To sign off, use the command **HDInsight: Logout**
 
## Work with HDInsight folder

You need open a Hive file, a PySpark file, or a folder to work with file.

**To open a folder for your HDInsight file**

1. From Visual Studio Code, Click the **File** menu, and then click **Open Folder**.
2. Specify or Create a new folder, and then click **Select Folder**.
3. Click the **New File** under your created work folder, or click the **File** menu, and then click **New File**. An **Untilted-1** file is shown in the right pane.

   ![new file](./media/hdinsight-for-vscode/new-file.png)
4. Save the file as .hql or .py in the opened folder. Notice an **XXXX_hdi_settings.json** configuration file is also added to the work folder.
5. Open **XXXX_hdi_settings.json** from **EXPLORER**, or right-click on script editor to select **Set Configuration**. You can configure login entry, default cluster, and job submission parameters, as shown in the sample in the file. You also can leave the remaining parameters empty.

## Submit Hive Batch Script
1. Create a file in your current folder and named **xxx.hql**.
2. Copy and paste the following code into **xxx.hql**, then save it.

        SELECT * FROM hivesampletable;

3. Right-click a hive script editor, and then click **HDInsight: Submit Hive Batch Script** to submit a hive job. You can also use another way of pressing **CTRL+SHIFT+P** and entering **HDInsight: Submit Hive Batch Script**.
4. Select a cluster to submit your Hive Script. And Make sure the hivesampletable is already exists in your cluster.  

![submit hive job result](./media/hdinsight-for-vscode/submit-hivejob-result.png)

After submitting a hive job, the submission success info and jobid is shown in **OUTPUT** panel. And it opens **WEB BROWSER** which the job realtime logs and status shown in.

## Interactive Hive

Our tool enables the interactive Hive query using LLAP and runs interactive Hive analytics.
1. Create a file in your current folder and named **xxx.hql**.
2. Copy and paste the following code into **xxx.hql**, then save it.

        SELECT * FROM hivesampletable;

3. Right-click a hive script editor, and then click **HDInsight: Interactive Hive** to query the result quickly. You can also use another way of pressing **CTRL+SHIFT+P** and entering **HDInsight: Interactive Hive**. 
4. Select cluster that support **LLAP** (interactive Hive) to submit your query. Soon after, the query result tab is shown on the left.

![interactive hive result](./media/hdinsight-for-vscode/interactive-hive-result.png)
- **RESULTS** panel: You can save the result as CSV,JSON,EXCEL to local path. 
- **MESSAGES** panel: Clicking **Line** number, it jumps to the first line of the running script.

## Submit PySpark Job
1. Create a file in your current folder and named **xxx.py**.
2. Copy and paste the following code into **xxx.py**, then save it.

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


3. Right-click a hive script editor, and then click **HDInsight: Submit PySpark Job**. You can also use another way of pressing **CTRL+SHIFT+P** and entering **HDInsight: Submit PySpark Job**.
4. Select a cluster to submit your PySpark job. 

![submit python job result](./media/hdinsight-for-vscode/submit-pythonjob-result.png) 

After submitting a python job, submission logs is shown in **OUTPUT** window in VSCode. The **Spark UI URL** and **Yarn UI URL** are shown as well. You can open the URL in a web browser to track the job status.

## List HDInsight clusters

To test the connection, you can list your HDInsight clusters:

**To list HDInsight cluster under your Azure subscription**
1. Right-click a hive script editor, and then click **HDInsight: List Cluster**. You can also use another way of pressing **CTRL+SHIFT+P** and entering **HDInsight: List Cluster**.
2. The hive and spark clusters appear in the **Output** pane.

    ![set default cluster configuration](./media/hdinsight-for-vscode/list-cluster-result.png)

## Set Default Cluster
1. Right-click a hive script editor, and then click **HDInsight: Set Default Cluster**. You can also use another way of pressing **CTRL+SHIFT+P** and entering **HDInsight: Set Default Cluster**.
2. Select a cluster as default cluster for the current script file. 
3. Meanwhile, our tool already saved what you selected default clusters into **XXXX_hdi_settings.json**. You also directly update it in this configuration file. 
   
   ![set default cluster configuration](./media/hdinsight-for-vscode/set-default-cluster-configuration.png)

## Set Azure Environment 
1. Open the command palette by pressing **CTRL+SHIFT+P**.
2. Enter **HDInsight: Set Azure Environment**.
3. Select one way from Azure and AzureChina as your default login entry.
4. Meanwhile, our tool already saved what you selected default login entry into **XXXX_hdi_settings.json**. You also directly update it in this configuration file. 

   ![set default login entry configuration](./media/hdinsight-for-vscode/set-default-login-entry-configuration.png)


## Additional features

The HDInsight for VSCode supports the following features:

-	IntelliSense auto-complete. Suggestions are popped up around keyword, method, variables, etc. Different icons represent different types of the objects:
![HDInsight Tools for Visual Studio Code IntelliSense object types](./media/hdinsight-for-vscode/hdinsight-for-vscode-auto-complete-objects.png)
-	IntelliSense error marker. The language service underlines the editing errors for hive script.     
-	Syntax highlights. The language service uses different color to differentiate variables, keywords, data type, functions, etc. 
![HDInsight Tools for Visual Studio Code syntax highlights](./media/hdinsight-for-vscode/hdinsight-for-vscode-syntax-highlights.png)


### Demo
* HDInsight for VScode: [Video](https://go.microsoft.com/fwlink/?linkid=858706)

### Tools and extensions
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through VPN](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through SSH](hdinsight-apache-spark-intellij-tool-debug-remotely-through-ssh.md)
* [Use HDInsight Tools for IntelliJ with Hortonworks Sandbox](hdinsight-tools-for-intellij-with-hortonworks-sandbox.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](hdinsight-apache-spark-eclipse-tool-plugin.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](hdinsight-apache-spark-jupyter-notebook-install-locally.md)

### Scenarios
* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools.md)
* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](hdinsight-apache-spark-ipython-notebook-machine-learning.md)
* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)
* [Spark Streaming: Use Spark in HDInsight for building realtime streaming applications](hdinsight-apache-spark-eventhub-streaming.md)
* [Website log analysis using Spark in HDInsight](hdinsight-apache-spark-custom-library-website-log-analysis.md)

### Creating and running applications
* [Create a standalone application using Scala](hdinsight-apache-spark-create-standalone-application.md)
* [Run jobs remotely on a Spark cluster using Livy](hdinsight-apache-spark-livy-rest-interface.md)

### Managing resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](hdinsight-apache-spark-job-debugging.md)



