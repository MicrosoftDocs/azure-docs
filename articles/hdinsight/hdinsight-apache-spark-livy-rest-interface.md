---
title: Use Livy Spark to submit jobs to Spark cluster on Azure HDInsight | Microsoft Docs
description: Learn how to use Apache Spark REST API to submit Spark jobs remotely to an Azure HDInsight cluster.
keywords: apache spark rest api,livy spark
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 2817b779-1594-486b-8759-489379ca907d
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: nitinme

---
# Use Apache Spark REST API to submit remote jobs to an HDInsight Spark cluster

Learn how to use Livy, the Apache Spark REST API, which is used to submit remote jobs to an Azure HDInsight Spark cluster. For detailed documentation, see [Livy](https://github.com/cloudera/hue/tree/master/apps/spark/java#welcome-to-livy-the-rest-spark-server).

You can use Livy to run interactive Spark shells or submit batch jobs to be run on Spark. This article talks about using Livy to submit batch jobs. The syntax below uses Curl to make REST API calls to the Livy Spark endpoint.

**Prerequisites:**

You must have the following:

* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).

## Submit a Livy Spark batch job
Before you submit a batch job, you must upload the application jar on the cluster storage associated with the cluster. You can use [**AzCopy**](../storage/storage-use-azcopy.md), a command line utility, to do so. There are a lot of other clients you can use to upload data. You can find more about them at [Upload data for Hadoop jobs in HDInsight](hdinsight-upload-data.md).

    curl -k --user "<hdinsight user>:<user password>" -v -H <content-type> -X POST -d '{ "file":"<path to application jar>", "className":"<classname in jar>" }' 'https://<spark_cluster_name>.azurehdinsight.net/livy/batches'

**Examples**:

* If the jar file is on the cluster storage (WASB)
  
        curl -k --user "admin:mypassword1!" -v -H 'Content-Type: application/json' -X POST -d '{ "file":"wasbs://mycontainer@mystorageaccount.blob.core.windows.net/data/SparkSimpleTest.jar", "className":"com.microsoft.spark.test.SimpleFile" }' "https://mysparkcluster.azurehdinsight.net/livy/batches"
* If the you want to pass the jar filename and the classname as part of an input file (in this example, input.txt)
  
        curl -k  --user "admin:mypassword1!" -v -H "Content-Type: application/json" -X POST --data @C:\Temp\input.txt "https://mysparkcluster.azurehdinsight.net/livy/batches"

## Get information on Livy Spark batches running on the cluster
    curl -k --user "<hdinsight user>:<user password>" -v -X GET "https://<spark_cluster_name>.azurehdinsight.net/livy/batches"

**Examples**:

* If you want to retrieve all the Livy Spark batches running on the cluster:
  
        curl -k --user "admin:mypassword1!" -v -X GET "https://mysparkcluster.azurehdinsight.net/livy/batches"
* If you want to retrieve a specific batch with a given batchId
  
        curl -k --user "admin:mypassword1!" -v -X GET "https://mysparkcluster.azurehdinsight.net/livy/batches/{batchId}"

## Delete a Livy Spark batch job
    curl -k --user "<hdinsight user>:<user password>" -v -X DELETE "https://<spark_cluster_name>.azurehdinsight.net/livy/batches/{batchId}"

**Example**:

    curl -k --user "admin:mypassword1!" -v -X DELETE "https://mysparkcluster.azurehdinsight.net/livy/batches/{batchId}"

## Livy Spark and high-availability
Livy provides high-availability for Spark jobs running on the cluster. Here are a couple of examples.

* If the Livy service goes down after you have submitted a job remotely to a Spark cluster, the job continues to run in the background. When Livy is back up, it restores the status of the job and reports it back.
* Jupyter notebooks for HDInsight are powered by Livy in the backend. If a notebook is running a Spark job and the Livy service gets restarted, the notebook will continue to run the code cells. 

## Show me an example
In this section, we look at examples on how to use Livy Spark to submit batch job, monitor the progress of the job, and then delete the job. The application we use in this example is the one developed in the article [Create a standalone Scala application and to run on HDInsight Spark cluster](hdinsight-apache-spark-create-standalone-application.md). The steps below assume the following:

* You have already copied over the application jar to the storage account associated with the cluster.
* You have CuRL installed on the computer where you are trying these steps.

Perform the following steps.

1. Let us first verify that Livy Spark is running on the cluster. We can do so by getting a list of running batches. If this is the first time you are running a job using Livy, this should return zero.
   
        curl -k --user "admin:mypassword1!" -v -X GET "https://mysparkcluster.azurehdinsight.net/livy/batches"
   
    You should get an output similar to the following:
   
        < HTTP/1.1 200 OK
        < Content-Type: application/json; charset=UTF-8
        < Server: Microsoft-IIS/8.5
        < X-Powered-By: ARR/2.5
        < X-Powered-By: ASP.NET
        < Date: Fri, 20 Nov 2015 23:47:53 GMT
        < Content-Length: 34
        <
        {"from":0,"total":0,"sessions":[]}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
   
    Notice how the last line in the output says **total:0**, which suggests no running batches.

2. Let us now submit a batch job. The snippet below uses an input file (input.txt) to pass the jar name and the class name as parameters. This is the recommended approach if you are running these steps from a Windows computer.
   
        curl -k --user "admin:mypassword1!" -v -H "Content-Type: application/json" -X POST --data @C:\Temp\input.txt "https://mysparkcluster.azurehdinsight.net/livy/batches"
   
    The parameters in the file **input.txt** are defined as follows:
   
        { "file":"wasbs:///example/jars/SparkSimpleApp.jar", "className":"com.microsoft.spark.example.WasbIOTest" }
   
    You should see an output similar to the following:
   
        < HTTP/1.1 201 Created
        < Content-Type: application/json; charset=UTF-8
        < Location: /0
        < Server: Microsoft-IIS/8.5
        < X-Powered-By: ARR/2.5
        < X-Powered-By: ASP.NET
        < Date: Fri, 20 Nov 2015 23:51:30 GMT
        < Content-Length: 36
        <
        {"id":0,"state":"starting","log":[]}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
   
    Notice how the last line of the output says **state:starting**. It also says, **id:0**. This is the batch ID.

3. You can now retrieve the the status of this specific batch using the batch ID.
   
        curl -k --user "admin:mypassword1!" -v -X GET "https://mysparkcluster.azurehdinsight.net/livy/batches/0"
   
    You should see an output similar to the following:
   
        < HTTP/1.1 200 OK
        < Content-Type: application/json; charset=UTF-8
        < Server: Microsoft-IIS/8.5
        < X-Powered-By: ARR/2.5
        < X-Powered-By: ASP.NET
        < Date: Fri, 20 Nov 2015 23:54:42 GMT
        < Content-Length: 509
        <
        {"id":0,"state":"success","log":["\t diagnostics: N/A","\t ApplicationMaster host: 10.0.0.4","\t ApplicationMaster RPC port: 0","\t queue: default","\t start time: 1448063505350","\t final status: SUCCEEDED","\t tracking URL: http://hn0-myspar.lpel1gnnvxne3gwzqkfq5u5uzh.jx.internal.cloudapp.net:8088/proxy/application_1447984474852_0002/","\t user: root","15/11/20 23:52:47 INFO Utils: Shutdown hook called","15/11/20 23:52:47 INFO Utils: Deleting directory /tmp/spark-b72cd2bf-280b-4c57-8ceb-9e3e69ac7d0c"]}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
   
    The output now shows **state:success**, which suggests that the job was successfully completed.

4. If you want, you can now delete the batch.
   
        curl -k --user "admin:mypassword1!" -v -X DELETE "https://mysparkcluster.azurehdinsight.net/livy/batches/0"
   
    You should see an output similar to the following:
   
        < HTTP/1.1 200 OK
        < Content-Type: application/json; charset=UTF-8
        < Server: Microsoft-IIS/8.5
        < X-Powered-By: ARR/2.5
        < X-Powered-By: ASP.NET
        < Date: Sat, 21 Nov 2015 18:51:54 GMT
        < Content-Length: 17
        <
        {"msg":"deleted"}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
   
    The last line of the output shows that the batch was successfully deleted. If you delete a job while it is running, it will essentially kill the job. If you delete a job that has completed, successfully or otherwise, it deletes the job information completely.

## Using Livy Spark on HDInsight 3.5 clusters

HDInsight 3.5 cluster, by default, disables use of local file paths to access sample data files or jars. We encourage you to use the `wasb://` path instead to access jars or sample data files from the cluster. If you do want to use local path, you must update the Ambari configuration accordingly. To do so:

1. Go to the Ambari portal for the cluster. The Ambari Web UI is available on your HDInsight cluster at https://**CLUSTERNAME**.azurehdidnsight.net, where CLUSTERNAME is the name of your cluster.

2. From the left navigation, click **Livy**, and then click **Configs**.

3. Under **livy-default** add the property name `livy.file.local-dir-whitelist` and set it's value to **"/"** if you want to allow full access to file system. If you want to allow access only to a specific directory, provide the path to that directory as the value.

## Troubleshooting

Here are some issues that you might run into while using Livy for remote job submission to Spark clusters.

### Using an external jar from the additional storage is not supported

**Problem:** If you are running a Livy Spark job and referencing an external jar from the additional storage associated with the cluster, the job will fail.

**Resolution:** Make sure that the jar you want to use is available in the default storage associated with the HDInsight cluster.


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

### Tools and extensions
* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applicatons](hdinsight-apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Spark applications remotely](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](hdinsight-apache-spark-jupyter-notebook-install-locally.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](hdinsight-apache-spark-job-debugging.md)

