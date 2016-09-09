<properties
   pageTitle="Use Hadoop Pig with Curl in HDInsight | Microsoft Azure"
   description="Learn how to use Curl to run Pig Latin jobs on a Hadoop cluster in Azure HDInsight."
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
   ms.date="06/06/2016"
   ms.author="larryfr"/>

#Run Pig jobs with Hadoop on HDInsight by using Curl

[AZURE.INCLUDE [pig-selector](../../includes/hdinsight-selector-use-pig.md)]

In this document, you will learn how to use Curl to run Pig Latin jobs on an Azure HDInsight cluster. The Pig Latin programming language allows you to describe transformations that are applied to the input data to produce the desired output.

Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run, monitor, and retrieve the results of Pig jobs. This works by using the WebHCat REST API (formerly known as Templeton) that is provided by your HDInsight cluster.

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see [Linux-based HDInsight Tips](hdinsight-hadoop-linux-information.md).

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* An Azure HDInsight (Hadoop on HDInsight) cluster (Linux-based or Windows-based)

* [Curl](http://curl.haxx.se/)

* [jq](http://stedolan.github.io/jq/)

##<a id="curl"></a>Run Pig jobs by using Curl

> [AZURE.NOTE] When using Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the administrator user name and password for the HDInsight cluster. You must also use the cluster name as part of the Uniform Resource Identifier (URI) that is used to send the requests to the server.
>
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and replace **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
>
> The REST API is secured via [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using Secure HTTP (HTTPS) to help ensure that your credentials are securely sent to the server.

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

        curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status

    You should receive a response similar to the following:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

    * **-u**: The user name and password used to authenticate the request
    * **-G**: Indicates that this is a GET request

    The beginning of the URL, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, will be the same for all requests. The path, **/status**, indicates that the request is to return the status of WebHCat (also known as Templeton) for the server.

2. Use the following code to submit a Pig Latin job to the cluster:

        curl -u USERNAME:PASSWORD -d user.name=USERNAME -d execute="LOGS=LOAD+'wasbs:///example/data/sample.log';LEVELS=foreach+LOGS+generate+REGEX_EXTRACT($0,'(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)',1)+as+LOGLEVEL;FILTEREDLEVELS=FILTER+LEVELS+by+LOGLEVEL+is+not+null;GROUPEDLEVELS=GROUP+FILTEREDLEVELS+by+LOGLEVEL;FREQUENCIES=foreach+GROUPEDLEVELS+generate+group+as+LOGLEVEL,COUNT(FILTEREDLEVELS.LOGLEVEL)+as+count;RESULT=order+FREQUENCIES+by+COUNT+desc;DUMP+RESULT;" -d statusdir="wasbs:///example/pigcurl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/pig

    The parameters used in this command are as follows:

    * **-d**: Because `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

        * **user.name**: The user who is running the command
        * **execute**: The Pig Latin statements to execute
        * **statusdir**: The directory that the status for this job will be written to

    > [AZURE.NOTE] Notice that the spaces in Pig Latin statements are replaced by the `+` character when used with Curl.

    This command should return a job ID that can be used to check the status of the job, for example:

        {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command. Replace **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then **JOBID** would be `job_1415651640909_0026`.

        curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state

	If the job has finished, the state will be **SUCCEEDED**.

    > [AZURE.NOTE] This Curl request returns a JavaScript Object Notation (JSON) document with information about the job, and jq is used to retrieve only the state value.

##<a id="results"></a>View results

When the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, **wasbs:///example/pigcurl**. This address stores the output of the job in the **example/pigcurl** directory in the default storage container used by your HDInsight cluster.

You can list and download these files by using the [Azure CLI](../xplat-cli-install.md). For example, to list files in **example/pigcurl**, use the following command:

	azure storage blob list <container-name> example/pigcurl

To download a file, use the following:

	azure storage blob download <container-name> <blob-name> <destination-file>

> [AZURE.NOTE] You must specify the storage account name that contains the blob by using the `-a` and `-k` parameters, or set the **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS\_KEY** environment variables.

##<a id="summary"></a>Summary

As demonstrated in this document, you can use a raw HTTP request to run, monitor, and view the results of Pig jobs on your HDInsight cluster.

For more information about the REST interface used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).

##<a id="nextsteps"></a>Next steps

For general information about Pig on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
