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
	ms.date="01/13/2016" 
	ms.author="jgao"/>

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

##Notebook initial startup takes longer than expected 

**Symptom:** 

First statement in Jupyter notebook using Spark Magic could take more than a minute.  

**Mitigation:**
 
No workaround. It takes a minute sometimes. 

##Cannot customize core/memory configurations

**Symptom:**
 
You cannot specify different core/memory configurations than the default from the Spark/Pyspark kernels. 

**Mitigation:**
 
This feature is coming. 

##Jupyter notebook timeout in creating the session

**Symptom:** 

When Spark cluster is out of resources, the Spark and Pyspark kernels in the Jupyter notebook will timeout trying to create the session. 
Mitigations: 

1. Free up some resources in your Spark cluster by:

    - Stop other Spark notebooks by going to the Close and Halt menu or clicking Shutdown in the notebook explorer.
    - Stop other Spark applications from YARN.

2. Restart the notebook you were trying to start up. Enough resources should be available for you to create a session now.

##Notebook output results formatting issue

**Symptom:**
 
Notebook output results are badly formatted after executing a cell from the Spark and Pyspark Jupyter kernels. This includes successful results from cell executions as well as Spark stacktraces or other errors. 

**Mitigation:**
 
This issue will be addressed in a future release.

##Typos in sample notebooks
 
- **Python notebook 4 (Analyze logs with Spark using a custom library)**

    "Let us assume you copy it over to wasb:///example/data/iislogparser.py" should be "Let us assume you copy it over to wasb:///HdiSamples/HdiSamples/WebsiteLogSampleData/iislogparser.py". 

- **Python notebook 5 (Spark Machine Learning - Predictive analysis on food inspection data using MLLib)**

    "A quick visualization can help us reason about the distribution of these outcomes" contains some incorrect code that will not run.  It should be edited to the following: 

        countResults = df.groupBy('results').count().withColumnRenamed('count', 'cnt').collect() 
        labels = [row.results for row in countResults] 
        sizes = [row.cnt for row in countResults] 
        colors = ['turquoise', 'seagreen', 'mediumslateblue', 'palegreen', 'coral'] 
        plt.pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors) plt.axis('equal') 
        
- **Python notebook 5 (Spark Machine Learning - Predictive analysis on food inspection data using MLLib)**

    The final comment notes that the false negative rate and false positive rate are 12.6% and 16.0% respectively.  These numbers are inaccurate; run the code to display the pie graph with the true percentages. 

- **Python notebooks 6 and 7**

    The first cell fails to register the sc.stop() method to be called when the notebook exits.  Under certain circumstances this could cause Spark resources to leak.  You can avoid this by making sure to run import atexit; atexit.register(lambda: sc.stop()) in those notebooks before stopping them.  If you have accidentally leaked resources, then follow the instructions above to kill leaked YARN applications.
     
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