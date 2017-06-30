---
title: Use MapReduce and Curl with Hadoop in HDInsight - Azure | Microsoft Docs
description: Learn how to remotely run MapReduce jobs with Hadoop on HDInsight using Curl.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: bc6daf37-fcdc-467a-a8a8-6fb2f0f773d1
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/11/2017
ms.author: larryfr

---
# Run MapReduce jobs with Hadoop on HDInsight using REST

Learn how to use the WebHCat REST API to run MapReduce jobs on a Hadoop on HDInsight cluster. Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run MapReduce jobs.

> [!NOTE]
> If you are already familiar with using Linux-based Hadoop servers, but you are new to HDInsight, see the [What you need to know about Linux-based Hadoop on HDInsight](hdinsight-hadoop-linux-information.md) document.


## <a id="prereq"></a>Prerequisites

* A Hadoop on HDInsight cluster
* [Curl](http://curl.haxx.se/)
* [jq](http://stedolan.github.io/jq/)

## <a id="curl"></a>Run MapReduce jobs using Curl

> [!NOTE]
> When you use Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the HDInsight cluster administrator user name and password. You must use the cluster name as part of the URI that is used to send the requests to the server.
>
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
>
> The REST API is secured by using [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using HTTPS to ensure that your credentials are securely sent to the server.


1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```bash
    curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    You should receive a response similar to the following JSON:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

   * **-u**: Indicates the user name and password used to authenticate the request
   * **-G**: Indicates that this operation is a GET request

     The beginning of the URI, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, is the same for all requests.

2. To submit a MapReduce job, use the following command:

    ```bash
    curl -u USERNAME:PASSWORD -d user.name=USERNAME -d jar=/example/jars/hadoop-mapreduce-examples.jar -d class=wordcount -d arg=/example/data/gutenberg/davinci.txt -d arg=/example/data/CurlOut https://CLUSTERNAME.azurehdinsight.net/templeton/v1/mapreduce/jar
    ```

    The end of the URI (/mapreduce/jar) tells WebHCat that this request starts a MapReduce job from a class in a jar file. The parameters used in this command are as follows:

   * **-d**: `-G` is not used, so the request defaults to the POST method. `-d` specifies the data values that are sent with the request.
    * **user.name**: The user who is running the command
    * **jar**: The location of the jar file that contains class to be ran
    * **class**: The class that contains the MapReduce logic
    * **arg**: The arguments to be passed to the MapReduce job. In this case, the input text file and the directory that are used for the output

     This command should return a job ID that can be used to check the status of the job:

       {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command:

    ```bash
    curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state
    ```

    Replace the **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then the JOBID would be `job_1415651640909_0026`.

    If the job is complete, the state returned is `SUCCEEDED`.

   > [!NOTE]
   > This Curl request returns a JSON document with information about the job. Jq is used to retrieve only the state value.

4. When the state of the job has changed to `SUCCEEDED`, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter that is passed with the query contains the location of the output file. In this example, the location is `/example/curl`. This address stores the output of the job in the clusters default storage at `/example/curl`.

You can list and download these files by using the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). For more information on working with blobs from the Azure CLI, see the [Using the Azure CLI 2.0 with Azure Storage](../storage/storage-azure-cli.md#create-and-manage-blobs) document.

## <a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For more information about the REST interface that is used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).