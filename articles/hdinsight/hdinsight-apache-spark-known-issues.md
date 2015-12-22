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
	ms.date="12/22/2015" 
	ms.author="jgao"/>

# Known issues of Apache Spark in Azure HDInsight (Linux)

This document keeps track of all the known issues for the Spark public preview.  

##Livy could leak interactive session 

**Problem symptom:**  

When Livy is restarted (explicitly or due to headnode 0 reboot) with interactive session still alive, an interactive job session will be leaked. Ultimately it could cause new job submitted stuck in Accepted state and not starting. 

Manual workaround: 

i. Ssh into headnode and do a “yarn application –list” 

ii. Find all the application Ids of the interactive jobs started through livy. By default, when starting a livy interactive session and no explicit name is passed in, the name of the job will be ‘livy’. For livy session started by jupyter notebook, the job name will start with “remotesparkmagics_*”. 

iii. Do “yarn application –kill <Application ID>” to kill those jobs. New jobs will then run. 

2. Spark history server not started 

Problem symptom: 

Spark job history server is not running by default sometimes after a cluster is created.  

Manual workaround: 

Restart history server manually in ambari UI. 

3. Notebook initial startup takes a minute 

Problem symptom: 

First statement in Jupyter notebook using spark magic could take more than a minute.  

Manual workaround: 

No workaround. Customer just need to wait a bit. 

4. You will not be able to specify different core/memory configs than the default from the Spark/Pyspark kernels. This is a feature that’s coming. 

5. If the Spark cluster is out of resources, the Spark and Pyspark kernels in the Jupyter notebook will timeout trying to create the session. To recover: 

i. Free up some resources in your Spark cluster by: 

i. Stopping other Spark notebooks by going to the “Close and Halt” menu item or the “Shutdown” button in the notebook explorer. 

ii. Stopping other Spark applications from YARN. 

ii. Restart the notebook you were trying to start up. Enough resources should be available for you to create a session now. 

6. Notebook output results will be badly formatted after executing a cell from the Spark and Pyspark Jupyter kernels. This includes successful results from cell executions as well as Spark stacktraces or other errors. 

7. There are some typos in sample notebooks: 

* In Python notebook 4 (Analyze logs with Spark using a custom library), a comment says "Let us assume you copy it over to wasb:///example/data/iislogparser.py". It should say "Let us assume you copy it over to wasb:///HdiSamples/HdiSamples/WebsiteLogSampleData/iislogparser.py". 

* In Python notebook 5 (Spark Machine Learning - Predictive analysis on food inspection data using MLLib), the cell following the sentence "A quick visualization can help us reason about the distribution of these outcomes" contains some incorrect code that will not run.  It should be edited to the following: 

o countResults = df.groupBy('results').count().withColumnRenamed('count', 'cnt').collect() labels = [row.results for row in countResults] sizes = [row.cnt for row in countResults] colors = ['turquoise', 'seagreen', 'mediumslateblue', 'palegreen', 'coral'] plt.pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors) plt.axis('equal') 

* In Python notebook 5 (Spark Machine Learning - Predictive analysis on food inspection data using MLLib), the final comment notes that the false negative rate and false positive rate are 12.6% and 16.0% respectively.  These numbers are inaccurate; run the code to display the pie graph with the true percentages. 

* In Python notebooks 6 & 7, the first cell fails to register the sc.stop() method to be called when the notebook exits.  Under certain circumstances this could cause Spark resources to leak.  You can avoid this by making sure to run import atexit; atexit.register(lambda: sc.stop()) in those notebooks before stopping them.  If you have accidentally leaked resources, then follow the instructions above to kill leaked YARN applications. 

8. Permission issue in Spark log directory 

Problem symptom: 

When hdiuser submits a job with spark-submit, there is an error java.io.FileNotFoundException: /var/log/spark/sparkdriver_hdiuser.log (Permission denied) and the driver log is not written. 

Manual workaround: 

i. Add hdiuser to the Hadoop group. 

ii. Provide 777 permissions on /var/log/spark after cluster creation. 

iii. Update the spark log location using Ambari to be a directory with 777 permissions 

iv. Run spark-submit as sudo 
