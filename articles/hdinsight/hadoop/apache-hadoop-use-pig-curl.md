---
title: Use Hadoop Pig with REST in HDInsight - Azure 
description: Learn how to use REST to run Pig Latin jobs on a Hadoop cluster in Azure HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/10/2018
ms.author: jasonh

---
# Run Pig jobs with Hadoop on HDInsight by using REST

[!INCLUDE [pig-selector](../../../includes/hdinsight-selector-use-pig.md)]

Learn how to run Pig Latin jobs by making REST requests to an Azure HDInsight cluster. Curl is used to demonstrate how you can interact with HDInsight using the WebHCat REST API.

> [!NOTE]
> If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see [Linux-based HDInsight Tips](../hdinsight-hadoop-linux-information.md).

## <a id="prereq"></a>Prerequisites

* An Azure HDInsight (Hadoop on HDInsight) cluster (Linux-based or Windows-based)

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* [Curl](http://curl.haxx.se/)

* [jq](http://stedolan.github.io/jq/)

## <a id="curl"></a>Run Pig jobs by using Curl

> [!NOTE]
> The REST API is secured via [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). Always make requests by using Secure HTTP (HTTPS) to ensure that your credentials are securely sent to the server.
>
> When using the commands in this section, replace `USERNAME` with the user to authenticate to the cluster, and replace `PASSWORD` with the password for the user account. Replace `CLUSTERNAME` with the name of your cluster.
>


1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```bash
    curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    You should receive the following JSON response:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

    * **-u**: The user name and password used to authenticate the request
    * **-G**: Indicates that this request is a GET request

     The beginning of the URL, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, is the same for all requests. The path, **/status**, indicates that the request is to return the status of WebHCat (also known as Templeton) for the server.

2. Use the following code to submit a Pig Latin job to the cluster:

    ```bash
    curl -u USERNAME:PASSWORD -d user.name=USERNAME -d execute="LOGS=LOAD+'/example/data/sample.log';LEVELS=foreach+LOGS+generate+REGEX_EXTRACT($0,'(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)',1)+as+LOGLEVEL;FILTEREDLEVELS=FILTER+LEVELS+by+LOGLEVEL+is+not+null;GROUPEDLEVELS=GROUP+FILTEREDLEVELS+by+LOGLEVEL;FREQUENCIES=foreach+GROUPEDLEVELS+generate+group+as+LOGLEVEL,COUNT(FILTEREDLEVELS.LOGLEVEL)+as+count;RESULT=order+FREQUENCIES+by+COUNT+desc;DUMP+RESULT;" -d statusdir="/example/pigcurl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/pig
    ```

    The parameters used in this command are as follows:

    * **-d**: Because `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

    * **user.name**: The user who is running the command
    * **execute**: The Pig Latin statements to execute
    * **statusdir**: The directory that the status for this job is written to

    > [!NOTE]
    > Notice that the spaces in Pig Latin statements are replaced by the `+` character when used with Curl.

    This command should return a job ID that can be used to check the status of the job, for example:

        {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command

     ```bash
    curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state
    ```

     Replace `JOBID` with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then `JOBID` is `job_1415651640909_0026`.

    If the job has finished, the state is **SUCCEEDED**.

    > [!NOTE]
    > This Curl request returns a JavaScript Object Notation (JSON) document with information about the job, and jq is used to retrieve only the state value.

## <a id="results"></a>View results

When the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job. The `statusdir` parameter passed with the query contains the location of the output file; in this case, `/example/pigcurl`.

HDInsight can use either Azure Storage or Azure Data Lake Store as the default data store. There are various ways to get at the data depending on which one you use. For more information, see the storage section of the [Linux-based HDInsight information](../hdinsight-hadoop-linux-information.md#hdfs-azure-storage-and-data-lake-store) document.

## <a id="summary"></a>Summary

As demonstrated in this document, you can use a raw HTTP request to run, monitor, and view the results of Pig jobs on your HDInsight cluster.

For more information about the REST interface used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).

## <a id="nextsteps"></a>Next steps

For general information about Pig on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
