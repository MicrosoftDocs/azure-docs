---
title: Use Hadoop Hive with Curl in HDInsight - Azure 
description: Learn how to remotely submit Pig jobs to HDInsight using Curl.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jasonh

---
# Run Hive queries with Hadoop in HDInsight using REST

[!INCLUDE [hive-selector](../../../includes/hdinsight-selector-use-hive.md)]

Learn how to use the WebHCat REST API to run Hive queries with Hadoop on Azure HDInsight cluster.

## Prerequisites

* A Linux-based Hadoop on HDInsight cluster version 3.4 or greater.

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* A REST client. This document uses Windows PowerShell and [Curl](http://curl.haxx.se/) examples.

    > [!NOTE]
    > Azure PowerShell provides dedicated cmdlets for working with Hive on HDInsight. For more information, see the [Use Hive with Azure PowerShell](apache-hadoop-use-hive-powershell.md) document.

This document also uses Windows PowerShell and [Jq](http://stedolan.github.io/jq/) to process the JSON data returned from REST requests.

## <a id="curl"></a>Run a Hive query

> [!NOTE]
> When using cURL or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator.
>
> The REST API is secured via [basic authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). To help ensure that your credentials are securely sent to the server, always make requests by using Secure HTTP (HTTPS).

1. To set the cluster login that is used by the scripts in this document, use one of the following commands:

    ```bash
    read -p "Enter your cluster login account name: " LOGIN
    ```

    ```powershell
    $creds = Get-Credential -UserName admin -Message "Enter the cluster login name and password"
    ```

2. To set the cluster name, use one of the following commands:

    ```bash
    read -p "Enter the HDInsight cluster name: " CLUSTERNAME
    ```

    ```powershell
    $clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
    ```

3. To verify that you can connect to your HDInsight cluster, use one of the following commands:

    ```bash
    curl -u $LOGIN -G https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/status)
    ```
    
    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/status" `
       -Credential $creds `
       -UseBasicParsing
    $resp.Content
    ```

    You receive a response similar to the following text:

    ```json
    {"status":"ok","version":"v1"}
    ```

    The parameters used in this command are as follows:

    * `-u` - The user name and password used to authenticate the request.
    * `-G` - Indicates that this request is a GET operation.

   The beginning of the URL, `https://$CLUSTERNAME.azurehdinsight.net/templeton/v1`, is the same for all requests. The path, `/status`, indicates that the request is to return a status of WebHCat (also known as Templeton) for the server. You can also request the version of Hive by using the following command:

    ```bash
    curl -u $LOGIN -G https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/version/hive
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/version/hive" `
       -Credential $creds `
       -UseBasicParsing
    $resp.Content
    ```

    This request returns a response similar to the following text:

    ```json
        {"module":"hive","version":"0.13.0.2.1.6.0-2103"}
    ```

4. Use the following to create a table named **log4jLogs**:

    ```bash
    JOBID=`curl -s -u $LOGIN -d user.name=$LOGIN -d execute="set+hive.execution.engine=tez;DROP+TABLE+log4jLogs;CREATE+EXTERNAL+TABLE+log4jLogs(t1+string,t2+string,t3+string,t4+string,t5+string,t6+string,t7+string)+ROW+FORMAT+DELIMITED+FIELDS+TERMINATED+BY+' '+STORED+AS+TEXTFILE+LOCATION+'/example/data/';SELECT+t4+AS+sev,COUNT(*)+AS+count+FROM+log4jLogs+WHERE+t4+=+'[ERROR]'+AND+INPUT__FILE__NAME+LIKE+'%25.log'+GROUP+BY+t4;" -d statusdir="/example/rest" https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/hive | jq .id`
    echo $JOBID
    ```

    ```powershell
    $reqParams = @{"user.name"="admin";"execute"="set hive.execution.engine=tez;DROP TABLE log4jLogs;CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED BY ' ' STORED AS TEXTFILE LOCATION '/example/data/;SELECT t4 AS sev,COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;";"statusdir"="/example/rest"}
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/hive" `
       -Credential $creds `
       -Body $reqParams `
       -Method POST `
       -UseBasicParsing
    $jobID = (ConvertFrom-Json $resp.Content).id
    $jobID
    ```

    This request uses the POST method, which sends data as part of the request to the REST API. The following data values are sent with the request:

     * `user.name` - The user that is running the command.
     * `execute` - The HiveQL statements to execute.
     * `statusdir` - The directory that the status for this job is written to.

   These statements perform the following actions:
   
   * `DROP TABLE` - If the table already exists, it is deleted.
   * `CREATE EXTERNAL TABLE` - Creates a new 'external' table in Hive. External tables store only the table definition in Hive. The data is left in the original location.

     > [!NOTE]
     > External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process or another MapReduce operation.
     >
     > Dropping an external table does **not** delete the data, only the table definition.

   * `ROW FORMAT` - How the data is formatted. The fields in each log are separated by a space.
   * `STORED AS TEXTFILE LOCATION` - Where the data is stored (the example/data directory) and that it is stored as text.
   * `SELECT` - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This statement returns a value of **3** as there are three rows that contain this value.

     > [!NOTE]
     > Notice that the spaces between HiveQL statements are replaced by the `+` character when used with Curl. Quoted values that contain a space, such as the delimiter, should not be replaced by `+`.

      This command returns a job ID that can be used to check the status of the job.

5. To check the status of the job, use the following command:

    ```bash
    curl -G -u $LOGIN -d user.name=$LOGIN https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/$JOBID | jq .status.state
    ```

    ```powershell
    $reqParams=@{"user.name"="admin"}
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/jobs/$jobID" `
       -Credential $creds `
       -Body $reqParams `
       -UseBasicParsing
    # ConvertFrom-JSON can't handle duplicate names with different case
    # So change one to prevent the error
    $fixDup=$resp.Content.Replace("jobID","job_ID")
    (ConvertFrom-Json $fixDup).status.state
    ```

    If the job has finished, the state is **SUCCEEDED**.

6. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, `/example/rest`. This address stores the output in the `example/curl` directory in the clusters default storage.

    You can list and download these files by using the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). For more information on using the Azure CLI with Azure Storage, see the [Use Azure CLI with Azure Storage](https://docs.microsoft.com/azure/storage/storage-azure-cli#create-and-manage-blobs) document.

## <a id="nextsteps"></a>Next steps

For general information on Hive with HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

If you are using Tez with Hive, see the following documents for debugging information:

* [Use the Ambari Tez view on Linux-based HDInsight](../hdinsight-debug-ambari-tez-view.md)

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
[hdinsight-submit-jobs]:submit-apache-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md

[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx


