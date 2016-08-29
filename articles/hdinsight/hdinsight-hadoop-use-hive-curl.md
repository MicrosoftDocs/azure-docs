<properties
   pageTitle="Use Hadoop Hive with Curl in HDInsight | Microsoft Azure"
   description="Learn how to remotely submit Pig jobs to HDInsight using Curl."
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
   ms.date="06/16/2016"
   ms.author="larryfr"/>

#Run Hive queries with Hadoop in HDInsight with Curl

[AZURE.INCLUDE [hive-selector](../../includes/hdinsight-selector-use-hive.md)]

In this document, you will learn how to use Curl to run Hive queries on a Hadoop on Azure HDInsight cluster.

Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run, monitor, and retrieve the results of Hive queries. This works by using the WebHCat REST API (formerly known as Templeton) provided by your HDInsight cluster.

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see [What you need to know about Hadoop on Linux-based HDInsight](hdinsight-hadoop-linux-information.md).

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* A Hadoop on HDInsight cluster (Linux or Windows-based)

* [Curl](http://curl.haxx.se/)

* [jq](http://stedolan.github.io/jq/)

##<a id="curl"></a>Run Hive queries by using Curl

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

    The beginning of the URL, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, will be the same for all requests. The path, **/status**, indicates that the request is to return a status of WebHCat (also known as Templeton) for the server. You can also request the version of Hive by using the following command:

        curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/version/hive

    This should return a response similar to the following:

        {"module":"hive","version":"0.13.0.2.1.6.0-2103"}

2. Use the following to create a new table named **log4jLogs**:

        curl -u USERNAME:PASSWORD -d user.name=USERNAME -d execute="set+hive.execution.engine=tez;DROP+TABLE+log4jLogs;CREATE+EXTERNAL+TABLE+log4jLogs(t1+string,t2+string,t3+string,t4+string,t5+string,t6+string,t7+string)+ROW+FORMAT+DELIMITED+FIELDS+TERMINATED+BY+' '+STORED+AS+TEXTFILE+LOCATION+'wasbs:///example/data/';SELECT+t4+AS+sev,COUNT(*)+AS+count+FROM+log4jLogs+WHERE+t4+=+'[ERROR]'+AND+INPUT__FILE__NAME+LIKE+'%25.log'+GROUP+BY+t4;" -d statusdir="wasbs:///example/curl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/hive

    The parameters used in this command are as follows:

    * **-d** - Since `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

        * **user.name** - The user that is running the command.

        * **execute** - The HiveQL statements to execute.

        * **statusdir** - The directory that the status for this job will be written to.

    These statements perform the following actions:

    * **DROP TABLE** - Deletes the table and the data file, if the table already exists.

    * **CREATE EXTERNAL TABLE** - Creates a new 'external' table in Hive. External tables store only the table definition in Hive. The data is left in the original location.

		> [AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source, such as an automated data upload process, or by another MapReduce operation, but always want Hive queries to use the latest data.
		>
		> Dropping an external table does **not** delete the data, only the table definition.

    * **ROW FORMAT** - Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.

    * **STORED AS TEXTFILE LOCATION** - Tells Hive where the data is stored (the example/data directory), and that it is stored as text.

    * **SELECT** - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This should return a value of **3** as there are three rows that contain this value.

    > [AZURE.NOTE] Notice that the spaces between HiveQL statements are replaced by the `+` character when used with Curl. Quoted values that contain a space, such as the delimiter, should not be replaced by `+`.

    * **INPUT__FILE__NAME LIKE '%25.log'** - This limits the search to only use files ending in .log. If this is not present, Hive will attempt to search all files in this directory and its subdirectories, including files that do not match the column schema defined for this table.

    > [AZURE.NOTE] Note that %25 is the URL encoded form of %, so the actual condition is `like '%.log'`. The % has to be URL encoded, as it is treated as a special character in URLs.

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

6. Use the following statements to create a new 'internal' table named **errorLogs**:

        curl -u USERNAME:PASSWORD -d user.name=USERNAME -d execute="set+hive.execution.engine=tez;CREATE+TABLE+IF+NOT+EXISTS+errorLogs(t1+string,t2+string,t3+string,t4+string,t5+string,t6+string,t7+string)+STORED+AS+ORC;INSERT+OVERWRITE+TABLE+errorLogs+SELECT+t1,t2,t3,t4,t5,t6,t7+FROM+log4jLogs+WHERE+t4+=+'[ERROR]'+AND+INPUT__FILE__NAME+LIKE+'%25.log';SELECT+*+from+errorLogs;" -d statusdir="wasbs:///example/curl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/hive

    These statements perform the following actions:

    * **CREATE TABLE IF NOT EXISTS** - Creates a table, if it does not already exist. Since the **EXTERNAL** keyword is not used, this is an internal table, which is stored in the Hive data warehouse and is managed completely by Hive.

		> [AZURE.NOTE] Unlike external tables, dropping an internal table will delete the underlying data as well.

    * **STORED AS ORC** - Stores the data in Optimized Row Columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data.
    * **INSERT OVERWRITE ... SELECT** - Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.
    * **SELECT** - Selects all rows from the new **errorLogs** table.

7. Use the job ID returned to check the status of the job. Once it has succeeded, use Azure CLI for Mac, Linux and Windows as described previously to download and view the results. The output should contain three lines, all of which contain **[ERROR]**.


##<a id="summary"></a>Summary

As demonstrated in this document, you can use a raw HTTP request to run, monitor, and view the results of Hive jobs on your HDInsight cluster.

For more information on the REST interface used in this article, see the <a href="https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference" target="_blank">WebHCat Reference</a>.

##<a id="nextsteps"></a>Next steps

For general information on Hive with HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

If you are using Tez with Hive, see the following documents for debugging information:

* [Use the Tez UI on Windows-based HDInsight](hdinsight-debug-tez-ui.md)

* [Use the Ambari Tez view on Linux-based HDInsight](hdinsight-debug-ambari-tez-view.md)

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


