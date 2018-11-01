---
title: Use Hadoop Sqoop with Curl in HDInsight - Azure 
description: Learn how to remotely submit Sqoop jobs to HDInsight using Curl.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: jasonh

---
# Run Sqoop jobs with Hadoop in HDInsight with Curl
[!INCLUDE [sqoop-selector](../../../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Curl to run Sqoop jobs on a Hadoop cluster in HDInsight.

Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run, monitor, and retrieve the results of Sqoop jobs. This works by using the WebHCat REST API (formerly known as Templeton) provided by your HDInsight cluster.

## Prerequisites
To complete the steps in this article, you will need the following:

* Complete [Use Sqoop with Hadoop in HDInsight](hdinsight-use-sqoop.md#create-cluster-and-sql-database) to configure an environment with a HDInsight cluster and a Azure SQL database.
* [Curl](http://curl.haxx.se/). Curl is a tool to transfer data from or to a HDInsight cluster.
* [jq](http://stedolan.github.io/jq/). The jq utility is used to process the JSON data returned from REST requests.

## Submit Sqoop jobs by using Curl
> [!NOTE]
> When using Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator. You must also use the cluster name as part of the Uniform Resource Identifier (URI) used to send the requests to the server.
> 
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and replace **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
> 
> The REST API is secured via [basic authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using Secure HTTP (HTTPS) to help ensure that your credentials are securely sent to the server.
> 
> 

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```bash   
    curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    You should receive a response similar to the following:

    ```json   
    {"status":"ok","version":"v1"}
    ```
   
    The parameters used in this command are as follows:
   
   * **-u** - The user name and password used to authenticate the request.
   * **-G** - Indicates that this is a GET request.
     
     The beginning of the URL, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, is the same for all requests. The path, **/status**, indicates that the request is to return a status of WebHCat (also known as Templeton) for the server. 
2. Use the following to submit a sqoop job:

    ```bash
    curl -u USERNAME:PASSWORD -d user.name=USERNAME -d command="export --connect jdbc:sqlserver://SQLDATABASESERVERNAME.database.windows.net;user=USERNAME@SQLDATABASESERVERNAME;password=PASSWORD;database=SQLDATABASENAME --table log4jlogs --export-dir /example/data/sample.log --input-fields-terminated-by \0x20 -m 1" -d statusdir="wasb:///example/data/sqoop/curl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/sqoop
    ```

    The parameters used in this command are as follows:

    * **-d** - Since `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

        * **user.name** - The user that is running the command.

        * **command** - The Sqoop command to execute.

        * **statusdir** - The directory that the status for this job will be written to.

    This command shall return a job ID that can be used to check the status of the job.

        ```json
        {"id":"job_1415651640909_0026"}
        ```

3. To check the status of the job, use the following command. Replace **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then **JOBID** would be `job_1415651640909_0026`.

    ```bash
    curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state
    ```

    If the job has finished, the state will be **SUCCEEDED**.
   
   > [!NOTE]
   > This Curl request returns a JavaScript Object Notation (JSON) document with information about the job; jq is used to retrieve only the state value.
   > 
   > 
4. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, **wasb:///example/data/sqoop/curl**. This address stores the output of the job in the **example/data/sqoop/curl** directory on the default storage container used by your HDInsight cluster.
   
    You can use the Azure portal to access stderr and stdout blobs.  You can also use Microsoft SQL Server Management Studio to check the data that is uploaded to the log4jlogs table.

## Limitations
* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or Azure SQL Database does not currently support bulk inserts.
* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop will perform multiple inserts instead of batching the insert operations.

## Summary
As demonstrated in this document, you can use a raw HTTP request to run, monitor, and view the results of Sqoop jobs on your HDInsight cluster.

For more information on the REST interface used in this article, see the <a href="https://sqoop.apache.org/docs/1.99.3/RESTAPI.html" target="_blank">Sqoop REST API guide</a>.

## Next steps
For general information on Hive with HDInsight:

* [Use Sqoop with Hadoop on HDInsight](hdinsight-use-sqoop.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For other HDInsight articles involving curl:
 
* [Create Hadoop clusters using the Azure REST API](../hdinsight-hadoop-create-linux-clusters-curl-rest.md)
* [Run Hive queries with Hadoop in HDInsight using REST](apache-hadoop-use-hive-curl.md)
* [Run MapReduce jobs with Hadoop on HDInsight using REST](apache-hadoop-use-mapreduce-curl.md)
* [Run Pig jobs with Hadoop on HDInsight using cURL](apache-hadoop-use-pig-curl.md)



