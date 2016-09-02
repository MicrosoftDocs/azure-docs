<properties
   pageTitle="Use MapReduce and Curl with Hadoop in HDInsight | Microsoft Azure"
   description="Learn how to remotely run MapReduce jobs with Hadoop on HDInsight using Curl."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/12/2016"
   ms.author="larryfr"/>

#Run MapReduce jobs with Hadoop on HDInsight using Curl

[AZURE.INCLUDE [mapreduce-selector](../../includes/hdinsight-selector-use-mapreduce.md)]

In this document, you will learn how to use Curl to run MapReduce jobs on a Hadoop on HDInsight cluster.

Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run MapReduce jobs. This works by using the WebHCat REST API (formerly known as Templeton) provided by your HDInsight cluster.

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but you are new to HDInsight, see [What you need to know about Linux-based Hadoop on HDInsight](hdinsight-hadoop-linux-information.md).

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* A Hadoop on HDInsight cluster (Linux or Windows-based)

* [Curl](http://curl.haxx.se/)

* [jq](http://stedolan.github.io/jq/)

##<a id="curl"></a>Run MapReduce jobs using Curl

> [AZURE.NOTE] When you use Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the HDInsight cluster administrator user name and password. You must also use the cluster name as part of the URI that is used to send the requests to the server.
>
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
>
> The REST API is secured by using [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using HTTPS to ensure that your credentials are securely sent to the server.

1. From a command-line, use the following command to verify that you can connect to your HDInsight cluster:

        curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status

    You should receive a response similar to the following:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

    * **-u**: Indicates the user name and password used to authenticate the request
    * **-G**: Indicates that this is a GET request

    The beginning of the URI, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, is the same for all requests.

2. To submit a MapReduce job, use the following command:

		curl -u USERNAME:PASSWORD -d user.name=USERNAME -d jar=wasbs:///example/jars/hadoop-mapreduce-examples.jar -d class=wordcount -d arg=wasbs:///example/data/gutenberg/davinci.txt -d arg=wasbs:///example/data/CurlOut https://CLUSTERNAME.azurehdinsight.net/templeton/v1/mapreduce/jar

    The end of the URI (/mapreduce/jar) tells WebHCat that this request will start a MapReduce job from a class in a jar file. The parameters used in this command are as follows:

	* **-d**: `-G` is not used, so the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

        * **user.name**: The user who is running the command
        * **jar**: The location of the jar file that contains class to be ran
        * **class**: The class that contains the MapReduce logic
        * **arg**: The arguments to be passed to the MapReduce job; in this case, the input text file and the directory that are used for the output

    This command should return a job ID that can be used to check the status of the job:

        {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command. Replace the **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then the JOBID would be `job_1415651640909_0026`.

        curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state

	If the job is complete, the state will be "SUCCEEDED".

    > [AZURE.NOTE] This Curl request returns a JSON document with information about the job; jq is used to retrieve only the state value.

4. When the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter that is passed with the query contains the location of the output file; in this case, **wasbs:///example/curl**. This address stores the output of the job in the **example/curl** directory in the default storage container used by your HDInsight cluster.

You can list and download these files by using the [Azure CLI](../xplat-cli-install.md). For example, to list files in the **example/curl**, use the following command:

	azure storage blob list <container-name> example/curl

To download a file, use the following:

	azure storage blob download <container-name> <blob-name> <destination-file>

> [AZURE.NOTE] You must specify the storage account name that contains the blob by using the `-a` and `-k` parameters, or set the **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS\_KEY** environment variables. See [how to upload data to HDInsight](hdinsight-upload-data.md) for more information.

##<a id="summary"></a>Summary

As demonstrated in this document, you can use raw HTTP request to run, monitor, and view the results of Hive jobs in your HDInsight cluster.

For more information about the REST interface that is used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).

##<a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
