---
title: Use Apache Hadoop Hive with Curl in HDInsight - Azure 
description: Learn how to remotely submit Apache Pig jobs to Azure HDInsight using Curl.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 09/14/2023
---

# Run Apache Hive queries with Apache Hadoop in HDInsight using REST

[!INCLUDE [hive-selector](../includes/hdinsight-selector-use-hive.md)]

Learn how to use the WebHCat REST API to run Apache Hive queries with Apache Hadoop on Azure HDInsight cluster.

## Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).

* A REST client. This document uses [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest) on Windows PowerShell and [Curl](https://curl.haxx.se/) on [Bash](/windows/wsl/install-win10).

* If you use Bash, you'll also need jq, a command-line JSON processor.  See [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/).

## Base URI for REST API

The base Uniform Resource Identifier (URI) for the REST API on HDInsight is `https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME`, where `CLUSTERNAME` is the name of your cluster.  Cluster names in URIs are **case-sensitive**.  While the cluster name in the fully qualified domain name (FQDN) part of the URI (`CLUSTERNAME.azurehdinsight.net`) is case-insensitive, other occurrences in the URI are case-sensitive.

## Authentication

When using cURL or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator. The REST API is secured via [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). To help ensure that your credentials are securely sent to the server, always make requests by using Secure HTTP (HTTPS).

### Setup (Preserve credentials)

Preserve your credentials to avoid reentering them for each example.  The cluster name will be preserved in a separate step.

**A. Bash**  
Edit the script below by replacing `PASSWORD` with your actual password.  Then enter the command.

```bash
export PASSWORD='PASSWORD'
```  

**B. PowerShell**
Execute the code below and enter your credentials at the pop-up window:

```powershell
$creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
```

### Identify correctly cased cluster name

The actual casing of the cluster name may be different than you expect, depending on how the cluster was created.  The steps here will show the actual casing, and then store it in a variable for all later examples.

Edit the scripts below to replace `CLUSTERNAME` with your cluster name. Then enter the command. (The cluster name for the FQDN isn't case-sensitive.)

```bash
export CLUSTER_NAME=$(curl -u admin:$PASSWORD -sS -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters" | jq -r '.items[].Clusters.cluster_name')
echo $CLUSTER_NAME
```  

```powershell
# Identify properly cased cluster name
$resp = Invoke-WebRequest -Uri "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters" `
    -Credential $creds -UseBasicParsing
$clusterName = (ConvertFrom-Json $resp.Content).items.Clusters.cluster_name;

# Show cluster name
$clusterName
```

## Run a Hive query

1. To verify that you can connect to your HDInsight cluster, use one of the following commands:

    ```bash
    curl -u admin:$PASSWORD -G https://$CLUSTER_NAME.azurehdinsight.net/templeton/v1/status
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

1. The beginning of the URL, `https://$CLUSTERNAME.azurehdinsight.net/templeton/v1`, is the same for all requests. The path, `/status`, indicates that the request is to return a status of WebHCat (also known as Templeton) for the server. You can also request the version of Hive by using the following command:

    ```bash
    curl -u admin:$PASSWORD -G https://$CLUSTER_NAME.azurehdinsight.net/templeton/v1/version/hive
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/version/hive" `
       -Credential $creds `
       -UseBasicParsing
    $resp.Content
    ```

    This request returns a response similar to the following text:

    ```json
    {"module":"hive","version":"1.2.1000.2.6.5.3008-11"}
    ```

1. Use the following to create a table named **log4jLogs**:

    ```bash
    JOB_ID=$(curl -s -u admin:$PASSWORD -d user.name=admin -d execute="DROP+TABLE+log4jLogs;CREATE+EXTERNAL+TABLE+log4jLogs(t1+string,t2+string,t3+string,t4+string,t5+string,t6+string,t7+string)+ROW+FORMAT+DELIMITED+FIELDS+TERMINATED+BY+' '+STORED+AS+TEXTFILE+LOCATION+'/example/data/';SELECT+t4+AS+sev,COUNT(*)+AS+count+FROM+log4jLogs+WHERE+t4+=+'[ERROR]'+AND+INPUT__FILE__NAME+LIKE+'%25.log'+GROUP+BY+t4;" -d statusdir="/example/rest" https://$CLUSTER_NAME.azurehdinsight.net/templeton/v1/hive | jq -r .id)
    echo $JOB_ID
    ```

    ```powershell
    $reqParams = @{"user.name"="admin";"execute"="DROP TABLE log4jLogs;CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED BY ' ' STORED AS TEXTFILE LOCATION '/example/data/;SELECT t4 AS sev,COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;";"statusdir"="/example/rest"}
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

   * `DROP TABLE` - If the table already exists, it's deleted.
   * `CREATE EXTERNAL TABLE` - Creates a new 'external' table in Hive. External tables store only the table definition in Hive. The data is left in the original location.

     > [!NOTE]  
     > External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process or another MapReduce operation.
     >
     > Dropping an external table does **not** delete the data, only the table definition.

   * `ROW FORMAT` - How the data is formatted. The fields in each log are separated by a space.
   * `STORED AS TEXTFILE LOCATION` - Where the data is stored (the example/data directory) and that it's stored as text.
   * `SELECT` - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This statement returns a value of **3** as there are three rows that contain this value.

     > [!NOTE]  
     > Notice that the spaces between HiveQL statements are replaced by the `+` character when used with Curl. Quoted values that contain a space, such as the delimiter, should not be replaced by `+`.

      This command returns a job ID that can be used to check the status of the job.

1. To check the status of the job, use the following command:

    ```bash
    curl -u admin:$PASSWORD -d user.name=admin -G https://$CLUSTER_NAME.azurehdinsight.net/templeton/v1/jobs/$jobid | jq .status.state
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

1. Once the state of the job has changed to **SUCCEEDED**, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter passed with the query contains the location of the output file; in this case, `/example/rest`. This address stores the output in the `example/curl` directory in the clusters default storage.

    You can list and download these files by using the [Azure CLI](/cli/azure/install-azure-cli). For more information on using the Azure CLI with Azure Storage, see the [Use Azure CLI with Azure Storage](../../storage/blobs/storage-quickstart-blobs-cli.md) document.

## Next steps

For information on other ways you can work with Hadoop on HDInsight:

* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For more information on the REST API used in this document, see the [WebHCat reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference) document.
