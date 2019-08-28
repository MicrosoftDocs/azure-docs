---
title: Use Curl to export data with Apache Sqoop in Azure HDInsight
description: Learn how to remotely submit Apache Sqoop jobs to HDInsight using Curl.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/15/2019
---

# Run Apache Sqoop jobs in HDInsight with Curl
[!INCLUDE [sqoop-selector](../../../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Curl to run Apache Sqoop jobs on an Apache Hadoop cluster in HDInsight. This article demonstrates how to export data from Azure storage and import it into a SQL Server database using Curl. This article is a continuation of [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run, monitor, and retrieve the results of Sqoop jobs. This works by using the WebHCat REST API (formerly known as Templeton) provided by your HDInsight cluster.

## Prerequisites

* Completion of [Set up test environment](./hdinsight-use-sqoop.md#create-cluster-and-sql-database) from [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

* A client to query the Azure SQL database. Consider using [SQL Server Management Studio](../../sql-database/sql-database-connect-query-ssms.md) or [Visual Studio Code](../../sql-database/sql-database-connect-query-vscode.md).

* [Curl](https://curl.haxx.se/). Curl is a tool to transfer data from or to a HDInsight cluster.

* [jq](https://stedolan.github.io/jq/). The jq utility is used to process the JSON data returned from REST requests.

## Submit Apache Sqoop jobs by using Curl

Use Curl to export data using Apache Sqoop jobs from Azure storage to SQL Server.

> [!NOTE]  
> When using Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator. You must also use the cluster name as part of the Uniform Resource Identifier (URI) used to send the requests to the server.

For the commands in this section, replace `USERNAME` with the user to authenticate to the cluster, and replace `PASSWORD` with the password for the user account. Replace `CLUSTERNAME` with the name of your cluster.
 
The REST API is secured via [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using Secure HTTP (HTTPS) to help ensure that your credentials are securely sent to the server.

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```cmd
    curl -u USERNAME:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    You should receive a response similar to the following:

    ```json
    {"status":"ok","version":"v1"}
    ```

2. Replace `SQLDATABASESERVERNAME`, `USERNAME@SQLDATABASESERVERNAME`, `PASSWORD`, `SQLDATABASENAME` with the appropriate values from the prerequisites. Use the following to submit a sqoop job:

    ```cmd
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

3. To check the status of the job, use the following command. Replace `JOBID` with the value returned in the previous step. For example, if the return value was `{"id":"job_1415651640909_0026"}`, then `JOBID` would be `job_1415651640909_0026`.

    ```cmd
    curl -G -u USERNAME:PASSWORD -d user.name=USERNAME https://CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/JOBID | jq .status.state
    ```

    If the job has finished, the state will be **SUCCEEDED**.
   
   > [!NOTE]  
   > This Curl request returns a JavaScript Object Notation (JSON) document with information about the job; jq is used to retrieve only the state value.

4. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, `wasb:///example/data/sqoop/curl`. This address stores the output of the job in the `example/data/sqoop/curl` directory on the default storage container used by your HDInsight cluster.

    You can use the Azure portal to access stderr and stdout blobs.

5. To verify that data was exported, use the following queries from your SQL client to view the exported data:

    ```sql
    SELECT COUNT(*) FROM [dbo].[log4jlogs] WITH (NOLOCK);
    SELECT TOP(25) * FROM [dbo].[log4jlogs] WITH (NOLOCK);
    ```

## Limitations
* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or Azure SQL Database does not currently support bulk inserts.
* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop will perform multiple inserts instead of batching the insert operations.

## Summary
As demonstrated in this document, you can use a raw HTTP request to run, monitor, and view the results of Sqoop jobs on your HDInsight cluster.

For more information on the REST interface used in this article, see the <a href="https://sqoop.apache.org/docs/1.99.3/RESTAPI.html" target="_blank">Apache Sqoop REST API guide</a>.

## Next steps
[Use Apache Sqoop with Apache Hadoop on HDInsight](hdinsight-use-sqoop.md)

For other HDInsight articles involving curl:
 
* [Create Apache Hadoop clusters using the Azure REST API](../hdinsight-hadoop-create-linux-clusters-curl-rest.md)
* [Run Apache Hive queries with Apache Hadoop in HDInsight using REST](apache-hadoop-use-hive-curl.md)
* [Run MapReduce jobs with Apache Hadoop on HDInsight using REST](apache-hadoop-use-mapreduce-curl.md)

