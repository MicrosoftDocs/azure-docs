---
title: Use Hadoop Hive with Curl in HDInsight - Azure | Microsoft Docs
description: Learn how to remotely submit Pig jobs to HDInsight using Curl.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 6ce18163-63b5-4df6-9bb6-8fcbd4db05d8
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/14/2017
ms.author: larryfr

---
# Run Hive queries with Hadoop in HDInsight using REST

[!INCLUDE [hive-selector](../../includes/hdinsight-selector-use-hive.md)]

Learn how to use the WebHCat REST API to run Hive queries with Hadoop on Azure HDInsight cluster.

[Curl](http://curl.haxx.se/) is used to demonstrate how you can interact with HDInsight by using raw HTTP requests. The [jq](http://stedolan.github.io/jq/) utility is used to process the JSON data returned from REST requests.

> [!NOTE]
> If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see the [What you need to know about Hadoop on Linux-based HDInsight](hdinsight-hadoop-linux-information.md) document.

## <a id="curl"></a>Run Hive queries

> [!NOTE]
> When using cURL or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator.
>
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and replace **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
>
> The REST API is secured via [basic authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). To help ensure that your credentials are securely sent to the server, always make requests by using Secure HTTP (HTTPS).

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```bash
    curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    You receive a response similar to the following text:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

   * **-u** - The user name and password used to authenticate the request.
   * **-G** - Indicates that this request is a GET operation.

     The beginning of the URL, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, is the same for all requests. The path, **/status**, indicates that the request is to return a status of WebHCat (also known as Templeton) for the server. You can also request the version of Hive by using the following command:

    ```bash
    curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/version/hive
    ```

     This request returns a response similar to the following text:

       {"module":"hive","version":"0.13.0.2.1.6.0-2103"}

2. Use the following to create a table named **log4jLogs**:

    ```bash
    curl -u USERNAME:PASSWORD -d user.name=USERNAME -d execute="set+hive.execution.engine=tez;DROP+TABLE+log4jLogs;CREATE+EXTERNAL+TABLE+log4jLogs(t1+string,t2+string,t3+string,t4+string,t5+string,t6+string,t7+string)+ROW+FORMAT+DELIMITED+FIELDS+TERMINATED+BY+' '+STORED+AS+TEXTFILE+LOCATION+'/example/data/';SELECT+t4+AS+sev,COUNT(*)+AS+count+FROM+log4jLogs+WHERE+t4+=+'[ERROR]'+AND+INPUT__FILE__NAME+LIKE+'%25.log'+GROUP+BY+t4;" -d statusdir="/example/curl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/hive
    ```

    The following parameters used with this request:

   * **-d** - Since `-G` is not used, the request defaults to the POST method. `-d` specifies the data values that are sent with the request.

     * **user.name** - The user that is running the command.
     * **execute** - The HiveQL statements to execute.
     * **statusdir** - The directory that the status for this job is written to.

     These statements perform the following actions:
   * **DROP TABLE** - If the table already exists, it is deleted.
   * **CREATE EXTERNAL TABLE** - Creates a new 'external' table in Hive. External tables store only the table definition in Hive. The data is left in the original location.

     > [!NOTE]
     > External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process or another MapReduce operation.
     >
     > Dropping an external table does **not** delete the data, only the table definition.

   * **ROW FORMAT** - How the data is formatted. The fields in each log are separated by a space.
   * **STORED AS TEXTFILE LOCATION** - Where the data is stored (the example/data directory) and that it is stored as text.
   * **SELECT** - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This statement returns a value of **3** as there are three rows that contain this value.

     > [!NOTE]
     > Notice that the spaces between HiveQL statements are replaced by the `+` character when used with Curl. Quoted values that contain a space, such as the delimiter, should not be replaced by `+`.

   * **INPUT__FILE__NAME LIKE '%25.log'** - This statement limits the search to only use files ending in .log.

     > [!NOTE]
     > The `%25` is the URL encoded form of %, so the actual condition is `like '%.log'`. The % has to be URL encoded, as it is treated as a special character in URLs.

     This command should return a job ID that can be used to check the status of the job.

       {"id":"job_1415651640909_0026"}

3. To check the status of the job, use the following command:

    ```bash
    curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state
    ```

    Replace **JOBID** with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then **JOBID** would be `job_1415651640909_0026`.

    If the job has finished, the state is **SUCCEEDED**.

   > [!NOTE]
   > This Curl request returns a JavaScript Object Notation (JSON) document with information about the job. Jq is used to retrieve only the state value.

4. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, **/example/curl**. This address stores the output in the **example/curl** directory in the clusters default storage.

    You can list and download these files by using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). For more information on using the Azure CLI with Azure Storage, see the [Use Azure CLI 2.0 with Azure Storage](https://docs.microsoft.com/en-us/azure/storage/storage-azure-cli#create-and-manage-blobs) document.

5. Use the following statements to create a new 'internal' table named **errorLogs**:

    ```bash
    curl -u USERNAME:PASSWORD -d user.name=USERNAME -d execute="set+hive.execution.engine=tez;CREATE+TABLE+IF+NOT+EXISTS+errorLogs(t1+string,t2+string,t3+string,t4+string,t5+string,t6+string,t7+string)+STORED+AS+ORC;INSERT+OVERWRITE+TABLE+errorLogs+SELECT+t1,t2,t3,t4,t5,t6,t7+FROM+log4jLogs+WHERE+t4+=+'[ERROR]'+AND+INPUT__FILE__NAME+LIKE+'%25.log';SELECT+*+from+errorLogs;" -d statusdir="/example/curl" https://CLUSTERNAME.azurehdinsight.net/templeton/v1/hive
    ```

    These statements perform the following actions:

   * **CREATE TABLE IF NOT EXISTS** - Creates a table, if it does not already exist. This statement creates an internal table, which is stored in the Hive data warehouse and is managed completely by Hive.

     > [!NOTE]
     > Unlike external tables, dropping an internal table deletes the underlying data as well.

   * **STORED AS ORC** - Stores the data in Optimized Row Columnar (ORC) format. ORC is a highly optimized and efficient format for storing Hive data.
   * **INSERT OVERWRITE ... SELECT** - Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.
   * **SELECT** - Selects all rows from the new **errorLogs** table.

6. Use the job ID returned to check the status of the job. Once it has succeeded, use the Azure CLI as described previously to download and view the results. The output should contain three lines, all of which contain **[ERROR]**.

## <a id="nextsteps"></a>Next steps

For general information on Hive with HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

If you are using Tez with Hive, see the following documents for debugging information:

* [Use the Ambari Tez view on Linux-based HDInsight](hdinsight-debug-ambari-tez-view.md)

For more information on the REST API used in this document, see the [WebHCat reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference) document.

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




[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md

[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx


