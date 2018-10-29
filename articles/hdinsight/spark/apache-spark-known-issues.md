---
title: Troubleshoot issues with Apache Spark cluster in Azure HDInsight 
description: Learn about issues related to Apache Spark clusters in Azure HDInsight and how to work around those.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/21/2018
ms.author: jasonh

---
# Known issues for Apache Spark cluster on HDInsight

This document keeps track of all the known issues for the HDInsight Spark public preview.  

## Livy leaks interactive session
When Livy restarts (from Ambari or because of headnode 0 virtual machine reboot) with an interactive session still alive, an interactive job session is leaked. As a result, new jobs can be stuck in the Accepted state.

**Mitigation:**

Use the following procedure to work around the issue:

1. Ssh into headnode. For information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. Run the following command to find the application IDs of the interactive jobs started through Livy. 
   
        yarn application –list
   
    The default job names will be Livy if the jobs were started with a Livy interactive session with no explicit names specified. For the Livy session started by Jupyter notebook, the job name starts with remotesparkmagics_*. 
3. Run the following command to kill those jobs. 
   
        yarn application –kill <Application ID>

New jobs start running. 

## Spark History Server not started
Spark History Server is not started automatically after a cluster is created.  

**Mitigation:** 

Manually start the history server from Ambari.

## Permission issue in Spark log directory
hdiuser gets the following error when submitting a job using spark-submit:

```
java.io.FileNotFoundException: /var/log/spark/sparkdriver_hdiuser.log (Permission denied)
```
And no driver log is written. 

**Mitigation:**

1. Add hdiuser to the Hadoop group. 
2. Provide 777 permissions on /var/log/spark after cluster creation. 
3. Update the spark log location using Ambari to be a directory with 777 permissions.  
4. Run spark-submit as sudo.  

## Spark-Phoenix connector is not supported

HDInsight Spark clusters do not support the Spark-Phoenix connector.

**Mitigation:**

You must use the Spark-HBase connector instead. For the instructions, see [How to use Spark-HBase connector](https://blogs.msdn.microsoft.com/azuredatalake/2016/07/25/hdinsight-how-to-use-spark-hbase-connector/).

## Issues related to Jupyter notebooks
Following are some known issues related to Jupyter notebooks.

### Notebooks with non-ASCII characters in filenames
Do not use non-ASCII characters in Jupyter notebook filenames. If you try to upload a file through the Jupyter UI, which has a non-ASCII filename, it fails without any error message. Jupyter does not let you upload the file, but it does not throw a visible error either.

### Error while loading notebooks of larger sizes
You might see an error **`Error loading notebook`** when you load notebooks that are larger in size.  

**Mitigation:**

If you get this error, it does not mean your data is corrupt or lost.  Your notebooks are still on disk in `/var/lib/jupyter`, and you can SSH into the cluster to access them. For information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

Once you have connected to the cluster using SSH, you can copy your notebooks from your cluster to your local machine (using SCP or WinSCP) as a backup to prevent the loss of any important data in the notebook. You can then SSH tunnel into your headnode at port 8001 to access Jupyter without going through the gateway.  From there, you can clear the output of your notebook and resave it to minimize the notebook’s size.

To prevent this error from happening in the future, you must follow some best practices:

* It is important to keep the notebook size small. Any output from your Spark jobs that is sent back to Jupyter is persisted in the notebook.  It is a best practice with Jupyter in general to avoid running `.collect()` on large RDD’s or dataframes; instead, if you want to peek at an RDD’s contents, consider running `.take()` or `.sample()` so that your output doesn’t get too large.
* Also, when you save a notebook, clear all output cells to reduce the size.

### Notebook initial startup takes longer than expected
First code statement in Jupyter notebook using Spark magic could take more than a minute.  

**Explanation:**

This happens because when the first code cell is run. In the background this initiates session configuration and Spark, SQL, and Hive contexts are set. After these contexts are set, the first statement is run and this gives the impression that the statement took a long time to complete.

### Jupyter notebook timeout in creating the session
When Spark cluster is out of resources, the Spark and PySpark kernels in the Jupyter notebook will time out trying to create the session. 

**Mitigations:** 

1. Free up some resources in your Spark cluster by:
   
   * Stopping other Spark notebooks by going to the Close and Halt menu or clicking Shutdown in the notebook explorer.
   * Stopping other Spark applications from YARN.
2. Restart the notebook you were trying to start up. Enough resources should be available for you to create a session now.

## See also
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
* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applicatons](apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Spark applications remotely](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)

