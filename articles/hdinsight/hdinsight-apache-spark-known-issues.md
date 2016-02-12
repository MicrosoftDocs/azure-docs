<properties 
	pageTitle="Known issues of Apache Spark in HDInsight | Microsoft Azure" 
	description="Known issues of Apache Spark in HDInsight." 
	services="hdinsight" 
	documentationCenter="" 
	authors="mumian" 
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

# Known issues of Apache Spark in Azure HDInsight (Linux)

This document keeps track of all the known issues for the HDInsight Spark public preview.  

##Livy leaks interactive session
 
**Symptom:**  

When Livy is restarted with an interactive session (from Ambari or due to headnode 0 virtual machine reboot) still alive, an interactive job session will be leaked. Because of this, new jobs can stuck in the Accepted state, and cannot be started.

**Mitigation:**

Use the following procedure to workaround the issue:

1. Ssh into headnode. 
2. Run the following command to find the application IDs of the interactive jobs started through Livy. 

        yarn application –list

    The default job names will be Livy if the jobs were started with a Livy interactive session with no explicit names specified, For the Livy session started by Jupyter notebook, the job name will start with remotesparkmagics_*. 

3. Run the following command to kill those jobs. 

        yarn application –kill <Application ID>

New jobs will start running. 

##Spark History Server not started 

**Symptom:**
 
Spark History Server is not started automatically after a cluster is created.  

**Mitigation:** 

Manually start the history server from Ambari. 

##Error while loading a Notebooks of larger sizes

**Symptom:**

You might see an error **`Error loading notebook`** when you load notebooks that are larger in size.  

**Mitigation:**

If you get this error, it does not mean your data is corrupt or lost.  Your notebooks are still on disk in `/var/lib/jupyter`, and you can SSH into the cluster to access them. You can copy your notebooks from your cluster to your local machine (using SCP or WinSCP) as a backup to prevent the loss of any important data in the notebook. You can then SSH tunnel into your headnode at port 8001 to access Jupyter without going through the gateway.  From there, you can clear the output of your notebook and re-save it to minimize the notebook’s size.

To prevent this error from happening in the future, you must follow some best practices:

* It is important to keep the notebook size small. Any output from your Spark jobs that is sent back to Jupyter is persisted in the notebook.  It is a best practice with Jupyter in general to avoid running `.collect()` on large RDD’s or dataframes; instead, if you want to peek at an RDD’s contents, consider running `.take()` or `.sample()` so that your output doesn’t get too big.
* Also, when you save a notebook, clear all output cells to reduce the size.



##Notebook initial startup takes longer than expected 

**Symptom:** 

First statement in Jupyter notebook using Spark magic could take more than a minute.  

**Explanation:**
 
This happens because when the first code cell is run. In the background this initiates session configuration and Spark, SQL, and Hive contexts are set. After these contexts are set, the first statement is run and this gives the impression that the statement took a long time to complete.

##Jupyter notebook timeout in creating the session

**Symptom:** 

When Spark cluster is out of resources, the Spark and Pyspark kernels in the Jupyter notebook will timeout trying to create the session. 

**Mitigations:** 

1. Free up some resources in your Spark cluster by:

    - Stopping other Spark notebooks by going to the Close and Halt menu or clicking Shutdown in the notebook explorer.
    - Stopping other Spark applications from YARN.

2. Restart the notebook you were trying to start up. Enough resources should be available for you to create a session now.

## Permission issue in Spark log directory 

**Symptom:**
 
When hdiuser submits a job with spark-submit, there is an error java.io.FileNotFoundException: /var/log/spark/sparkdriver_hdiuser.log (Permission denied) and the driver log is not written. 

**Mitigation:**
 
1. Add hdiuser to the Hadoop group. 
2. Provide 777 permissions on /var/log/spark after cluster creation. 
3. Update the spark log location using Ambari to be a directory with 777 permissions.  
4. Run spark-submit as sudo. 

##See also

- [Overview: Apache Spark on Azure HDInsight (Linux)](hdinsight-apache-spark-overview.md)
- [Get started: Provision Apache Spark on Azure HDInsight (Linux) and run interactive queries using Spark SQL](hdinsight-apache-spark-jupyter-spark-sql.md)