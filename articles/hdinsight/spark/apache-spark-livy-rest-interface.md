---
title: Use Livy Spark to submit jobs to Spark cluster on Azure HDInsight
description: Learn how to use Apache Spark REST API to submit Spark jobs remotely to an Azure HDInsight cluster.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,hdiseo17may2017
ms.date: 02/28/2020
---

# Use Apache Spark REST API to submit remote jobs to an HDInsight Spark cluster

Learn how to use [Apache Livy](https://livy.incubator.apache.org/), the Apache Spark REST API, which is used to submit remote jobs to an Azure HDInsight Spark cluster. For detailed documentation, see [Apache Livy](https://livy.incubator.apache.org/docs/latest/rest-api.html).

You can use Livy to run interactive Spark shells or submit batch jobs to be run on Spark. This article talks about using Livy to submit batch jobs. The snippets in this article use cURL to make REST API calls to the Livy Spark endpoint.

## Prerequisites

An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

## Submit an Apache Livy Spark batch job

Before you submit a batch job, you must upload the application jar on the cluster storage associated with the cluster. You can use [AzCopy](../../storage/common/storage-use-azcopy.md), a command-line utility, to do so. There are various other clients you can use to upload data. You can find more about them at [Upload data for Apache Hadoop jobs in HDInsight](../hdinsight-upload-data.md).

```cmd
curl -k --user "admin:password" -v -H "Content-Type: application/json" -X POST -d '{ "file":"<path to application jar>", "className":"<classname in jar>" }' 'https://<spark_cluster_name>.azurehdinsight.net/livy/batches' -H "X-Requested-By: admin"
```

### Examples

* If the jar file is on the cluster storage (WASBS)

    ```cmd  
    curl -k --user "admin:mypassword1!" -v -H "Content-Type: application/json" -X POST -d '{ "file":"wasbs://mycontainer@mystorageaccount.blob.core.windows.net/data/SparkSimpleTest.jar", "className":"com.microsoft.spark.test.SimpleFile" }' "https://mysparkcluster.azurehdinsight.net/livy/batches" -H "X-Requested-By: admin"
    ```

* If you want to pass the jar filename and the classname as part of an input file (in this example, input.txt)

    ```cmd
    curl -k  --user "admin:mypassword1!" -v -H "Content-Type: application/json" -X POST --data @C:\Temp\input.txt "https://mysparkcluster.azurehdinsight.net/livy/batches" -H "X-Requested-By: admin"
    ```

## Get information on Livy Spark batches running on the cluster

Syntax:

```cmd
curl -k --user "admin:password" -v -X GET "https://<spark_cluster_name>.azurehdinsight.net/livy/batches"
```

### Examples

* If you want to retrieve all the Livy Spark batches running on the cluster:

    ```cmd
    curl -k --user "admin:mypassword1!" -v -X GET "https://mysparkcluster.azurehdinsight.net/livy/batches"
    ```

* If you want to retrieve a specific batch with a given batch ID

    ```cmd
    curl -k --user "admin:mypassword1!" -v -X GET "https://mysparkcluster.azurehdinsight.net/livy/batches/{batchId}"
    ```

## Delete a Livy Spark batch job

```cmd
curl -k --user "admin:mypassword1!" -v -X DELETE "https://<spark_cluster_name>.azurehdinsight.net/livy/batches/{batchId}"
```

### Example

Deleting a batch job with batch ID `5`.

```cmd
curl -k --user "admin:mypassword1!" -v -X DELETE "https://mysparkcluster.azurehdinsight.net/livy/batches/5"
```

## Livy Spark and high-availability

Livy provides high-availability for Spark jobs running on the cluster. Here is a couple of examples.

* If the Livy service goes down after you've submitted a job remotely to a Spark cluster, the job continues to run in the background. When Livy is back up, it restores the status of the job and reports it back.
* Jupyter notebooks for HDInsight are powered by Livy in the backend. If a notebook is running a Spark job and the Livy service gets restarted, the notebook continues to run the code cells.

## Show me an example

In this section, we look at examples to use Livy Spark to submit batch job, monitor the progress of the job, and then delete it. The application we use in this example is the one developed in the article [Create a standalone Scala application and to run on HDInsight Spark cluster](apache-spark-create-standalone-application.md). The steps here assume:

* You've already copied over the application jar to the storage account associated with the cluster.
* You've CuRL installed on the computer where you're trying these steps.

Perform the following steps:

1. For ease of use, set environment variables. This example is based on a Windows environment, revise variables as needed for your environment. Replace `CLUSTERNAME`, and `PASSWORD` with the appropriate values.

    ```cmd
    set clustername=CLUSTERNAME
    set password=PASSWORD
    ```

1. Verify that Livy Spark is running on the cluster. We can do so by getting a list of running batches. If you're running a job using Livy for the first time, the output should return zero.

    ```cmd
    curl -k --user "admin:%password%" -v -X GET "https://%clustername%.azurehdinsight.net/livy/batches"
    ```

    You should get an output similar to the following snippet:

    ```output
    < HTTP/1.1 200 OK
    < Content-Type: application/json; charset=UTF-8
    < Server: Microsoft-IIS/8.5
    < X-Powered-By: ARR/2.5
    < X-Powered-By: ASP.NET
    < Date: Fri, 20 Nov 2015 23:47:53 GMT
    < Content-Length: 34
    <
    {"from":0,"total":0,"sessions":[]}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
    ```

    Notice how the last line in the output says **total:0**, which suggests no running batches.

1. Let us now submit a batch job. The following snippet uses an input file (input.txt) to pass the jar name and the class name as parameters. If you're running these steps from a Windows computer, using an input file is the recommended approach.

    ```cmd
    curl -k --user "admin:%password%" -v -H "Content-Type: application/json" -X POST --data @C:\Temp\input.txt "https://%clustername%.azurehdinsight.net/livy/batches" -H "X-Requested-By: admin"
    ```

    The parameters in the file **input.txt** are defined as follows:

    ```text
    { "file":"wasbs:///example/jars/SparkSimpleApp.jar", "className":"com.microsoft.spark.example.WasbIOTest" }
    ```

    You should see an output similar to the  following snippet:

    ```output
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
    ```

    Notice how the last line of the output says **state:starting**. It also says, **id:0**. Here, **0** is the batch ID.

1. You can now retrieve the status of this specific batch using the batch ID.

    ```cmd
    curl -k --user "admin:%password%" -v -X GET "https://%clustername%.azurehdinsight.net/livy/batches/0"
    ```

    You should see an output similar to the following snippet:

    ```output
    < HTTP/1.1 200 OK
    < Content-Type: application/json; charset=UTF-8
    < Server: Microsoft-IIS/8.5
    < X-Powered-By: ARR/2.5
    < X-Powered-By: ASP.NET
    < Date: Fri, 20 Nov 2015 23:54:42 GMT
    < Content-Length: 509
    <
    {"id":0,"state":"success","log":["\t diagnostics: N/A","\t ApplicationMaster host: 10.0.0.4","\t ApplicationMaster RPC port: 0","\t queue: default","\t start time: 1448063505350","\t final status: SUCCEEDED","\t tracking URL: http://myspar.lpel.jx.internal.cloudapp.net:8088/proxy/application_1447984474852_0002/","\t user: root","15/11/20 23:52:47 INFO Utils: Shutdown hook called","15/11/20 23:52:47 INFO Utils: Deleting directory /tmp/spark-b72cd2bf-280b-4c57-8ceb-9e3e69ac7d0c"]}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
    ```

    The output now shows **state:success**, which suggests that the job was successfully completed.

1. If you want, you can now delete the batch.

    ```cmd
    curl -k --user "admin:%password%" -v -X DELETE "https://%clustername%.azurehdinsight.net/livy/batches/0"
    ```

    You should see an output similar to the following snippet:

    ```output
    < HTTP/1.1 200 OK
    < Content-Type: application/json; charset=UTF-8
    < Server: Microsoft-IIS/8.5
    < X-Powered-By: ARR/2.5
    < X-Powered-By: ASP.NET
    < Date: Sat, 21 Nov 2015 18:51:54 GMT
    < Content-Length: 17
    <
    {"msg":"deleted"}* Connection #0 to host mysparkcluster.azurehdinsight.net left intact
    ```

    The last line of the output shows that the batch was successfully deleted. Deleting a job, while it's running, also kills the job. If you delete a job that has completed, successfully or otherwise, it deletes the job information completely.

## Updates to Livy configuration starting with HDInsight 3.5 version

HDInsight 3.5 clusters and above, by default, disable use of local file paths to access sample data files or jars. We encourage you to use the `wasbs://` path instead to access jars or sample data files from the cluster.

## Submitting Livy jobs for a cluster within an Azure virtual network

If you connect to an HDInsight Spark cluster from within an Azure Virtual Network, you can directly connect to Livy on the cluster. In such a case, the URL for Livy endpoint is `http://<IP address of the headnode>:8998/batches`. Here, **8998** is the port on which Livy runs on the cluster headnode. For more information on accessing services on non-public ports, see [Ports used by Apache Hadoop services on HDInsight](../hdinsight-hadoop-port-settings-for-services.md).

## Next steps

* [Apache Livy REST API documentation](https://livy.incubator.apache.org/docs/latest/rest-api.html)
* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)
