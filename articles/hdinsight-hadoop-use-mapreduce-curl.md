<properties
   pageTitle="Use MapReduce with Hadoop in HDInsight | Azure"
   description="Learn how to remotely run MapReduce jobs with Hadoop on HDInsight using Curl."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

#Run MapReduce jobs with Hadoop on HDInsight using Curl

[AZURE.INCLUDE [mapreduce-selector](../includes/hdinsight-selector-use-mapreduce.md)]

In this document, you will learn how to use Curl to run MapReduce jobs on a Hadoop on HDInsight cluster. 

Curl is used to demonstrate how you can interact with HDInsight using raw HTTP requests to run MapReduce jobs. This works by using the WebHCat REST API (formerly known as Templeton,) provided by your HDInsight cluster.

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see <a href="../hdinsight-hadoop-linux-information/" target="_blank">What you need to know about Linux-based Hadoop on HDInsight</a>.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following.

* A Hadoop on HDInsight cluster (Linux or Windows-based)

* <a href="http://curl.haxx.se/" target="_blank">Curl</a>

* <a href="http://stedolan.github.io/jq/" target="_blank">jq</a>

##<a id="curl"></a>Run MapReduce jobs using Curl

> [AZURE.NOTE] When using Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the HDInsight cluster administrator username and password. You must also use the cluster name as part of the URI used to send the requests to the server.
> 
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
> 
> The REST API is secured using <a href="http://en.wikipedia.org/wiki/Basic_access_authentication" target="_blank">basic authentication</a>. You should always make requests using HTTPS to ensure that your credentials are securely sent to the server.

1. From a command-line, use the following command to verify that you can connect to your HDInsight cluster. 

        curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status

    You should receive a response similar to the following.

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows.

    * **-u** - the user name and password used to authenticate the request
    * **-G** - indicates that this is a GET request

    The beginning of the URI, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, will be the same for all requests. 

2. To submit a MapReduce job, use the following.

		curl -u USERNAME:PASSWORD -d user.name=USERNAME -d jar=wasb:///example/jars/hadoop-mapreduce-examples.jar -d class=wordcount -d arg=wasb:///example/data/gutenberg/davinci.txt -d arg=wasb:///example/data/CurlOut https://CLUSTERNAME.azurehdinsight.net/templeton/v1/mapreduce/jar

    The end of the URI (/mapreduce/jar) tells WebHCat that this request will start a MapReduce job from a class in a jar file. The parameters used in this command are as follows.

	* **-d** - since `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request

        * **user.name** - the user that is running the command
        * **jar** - the location of the jar file that contains class to be ran
        * **class** - the class that contains the MapReduce logic
        * **arg** - the arguments to be passed to the MapReduce job. In this case, the input text file and the directory used for the output

    This command should return a job ID that can be used to check the status of the job.

        {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command. Replace the **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}` then the JOBID would be `job_1415651640909_0026`.

        curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state

	If the job has completed, the state will be "SUCCEEDED".

    > [AZURE.NOTE] This curl request returns a JSON document with information about the job; jq is used to retrieve only the state value. 

4. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob Storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, **wasb:///example/curl**. This address stores the output of the job in the **example/curl** directory on the default storage container used by your HDInsight cluster.

You can list and download these files using the <a href="../xplat-cli/" target="_blank">Azure Cross-Platform Command-Line Interface (xplat-cli)</a>. For example, to list files in the **example/curl**, use the following command.

	azure storage blob list <container-name> example/curl

To download a file, use the following.

	azure storage blob download <container-name> <blob-name> <destination-file>

> [AZURE.NOTE] You must either specify the storage account name that contains the blob using the `-a` and `-k` parameters, or set the **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS\_KEY** environment variables. See <a href="../hdinsight-upload-data/" target="_blank" for more information.

##<a id="summary"></a>Summary

As demonstrated in this document, you can use raw HTTP request to run, monitor, and view the results of Hive jobs on your HDInsight cluster.

For more information on the REST interface used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).

##<a id="nextsteps"></a>Next steps

For general information on MapReduce jobs in HDInsight.

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For information on other ways you can work with Hadoop on HDInsight.

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)