<properties
   pageTitle="Use Hadoop Sqoop with Curl in HDInsight | Microsoft Azure"
   description="Learn how to remotely submit Sqoop jobs to HDInsight using Curl."
   services="hdinsight"
   documentationCenter=""
   authors="mumian"
   manager="paulettm"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/25/2016"
   ms.author="jgao"/>

#Run Sqoop jobs with Hadoop in HDInsight with Curl

[AZURE.INCLUDE [sqoop-selector](../../includes/hdinsight-selector-use-sqoop.md)]

In this document, you will learn how to use Curl to run Sqoop jobs on a Hadoop on Azure HDInsight cluster.

Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run, monitor, and retrieve the results of Sqoop jobs. This works by using the WebHCat REST API (formerly known as Templeton) provided by your HDInsight cluster.

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see [What you need to know about Hadoop on Linux-based HDInsight](hdinsight-hadoop-linux-information.md).

##Prerequisites

To complete the steps in this article, you will need the following:

* A Hadoop on HDInsight cluster (Linux or Windows-based)

* [Curl](http://curl.haxx.se/)

* [jq](http://stedolan.github.io/jq/)

##Submit Sqoop jobs by using Curl

> [AZURE.NOTE] When using Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator. You must also use the cluster name as part of the Uniform Resource Identifier (URI) used to send the requests to the server.
>
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and replace **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
>
> The REST API is secured via [basic authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using Secure HTTP (HTTPS) to help ensure that your credentials are securely sent to the server.

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

        curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status

    You should receive a response similar to the following:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

    * **-u** - The user name and password used to authenticate the request.
    * **-G** - Indicates that this is a GET request.

    The beginning of the URL, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, will be the same for all requests. The path, **/status**, indicates that the request is to return a status of WebHCat (also known as Templeton) for the server. 

2. Use the following to submit a sqoop job:


        curl -u USERNAME:PASSWORD -d user.name=USERNAME -d command="export --connect jdbc:sqlserver://SQLDATABASESERVERNAME.database.windows.net;user=USERNAME@SQLDATABASESERVERNAME;password=PASSWORD;database=SQLDATABASENAME --table log4jlogs --export-dir /tutorials/usesqoop/data --input-fields-terminated-by \0x20 -m 1" -d statusdir="wasbs:///example/curl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/sqoop

    The parameters used in this command are as follows:

    * **-d** - Since `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

        * **user.name** - The user that is running the command.

        * **command** - The Sqoop command to execute.

        * **statusdir** - The directory that the status for this job will be written to.

    This command should return a job ID that can be used to check the status of the job.

        {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command. Replace **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then **JOBID** would be `job_1415651640909_0026`.

        curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state

	If the job has finished, the state will be **SUCCEEDED**.

    > [AZURE.NOTE] This Curl request returns a JavaScript Object Notation (JSON) document with information about the job; jq is used to retrieve only the state value.

4. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, **wasbs:///example/curl**. This address stores the output of the job in the **example/curl** directory on the default storage container used by your HDInsight cluster.

    You can list and download these files by using the [Azure CLI](../xplat-cli-install.md). For example, to list files in **example/curl**, use the following command:

		azure storage blob list <container-name> example/curl

	To download a file, use the following:

		azure storage blob download <container-name> <blob-name> <destination-file>

	> [AZURE.NOTE] You must either specify the storage account name that contains the blob by using the `-a` and `-k` parameters, or set the **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS\_KEY** environment variables. See <a href="hdinsight-upload-data.md" target="_blank" for more information.

##Limitations

* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or Azure SQL Database does not currently support bulk inserts.

* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop will perform multiple inserts instead of batching the insert operations.

##Summary

As demonstrated in this document, you can use a raw HTTP request to run, monitor, and view the results of Sqoop jobs on your HDInsight cluster.

For more information on the REST interface used in this article, see the <a href="https://sqoop.apache.org/docs/1.99.3/RESTAPI.html" target="_blank">Sqoop REST API guide</a>.

##Next steps

For general information on Hive with HDInsight:

* [Use Sqoop with Hadoop on HDInsight](hdinsight-use-sqoop.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[apache-tez]: http://tez.apache.org
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: http://azure.microsoft.com/documentation/articles/hdinsight-connect-excel-power-query/


[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md




[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md

[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx


