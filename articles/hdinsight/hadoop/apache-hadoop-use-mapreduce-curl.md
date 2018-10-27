---
title: Use MapReduce and Curl with Hadoop in HDInsight - Azure 
description: Learn how to remotely run MapReduce jobs with Hadoop on HDInsight using Curl.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/27/2018
ms.author: jasonh

---
# Run MapReduce jobs with Hadoop on HDInsight using REST

Learn how to use the WebHCat REST API to run MapReduce jobs on a Hadoop on HDInsight cluster. Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run MapReduce jobs.

> [!NOTE]
> If you are already familiar with using Linux-based Hadoop servers, but you are new to HDInsight, see the [What you need to know about Linux-based Hadoop on HDInsight](../hdinsight-hadoop-linux-information.md) document.


## <a id="prereq"></a>Prerequisites

* A Hadoop on HDInsight cluster
* Windows PowerShell or [Curl](http://curl.haxx.se/) and [jq](http://stedolan.github.io/jq/)

## <a id="curl"></a>Run a MapReduce job

> [!NOTE]
> When you use Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the HDInsight cluster administrator user name and password. You must use the cluster name as part of the URI that is used to send the requests to the server.
>
> The REST API is secured by using [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using HTTPS to ensure that your credentials are securely sent to the server.

1. To set the cluster login that is used by the scripts in this document, use one of the followig commands:

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

3. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```bash
    curl -u $LOGIN -G https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clustername.azurehdinsight.net/templeton/v1/status" `
        -Credential $creds `
        -UseBasicParsing
    $resp.Content
    ```

    You receive a response similar to the following JSON:

        {"status":"ok","version":"v1"}

    The parameters used in this command are as follows:

   * **-u**: Indicates the user name and password used to authenticate the request
   * **-G**: Indicates that this operation is a GET request

   The beginning of the URI, **https://CLUSTERNAME.azurehdinsight.net/templeton/v1**, is the same for all requests.

4. To submit a MapReduce job, use the following command:

    ```bash
    JOBID=`curl -u $LOGIN -d user.name=$LOGIN -d jar=/example/jars/hadoop-mapreduce-examples.jar -d class=wordcount -d arg=/example/data/gutenberg/davinci.txt -d arg=/example/data/output https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/mapreduce/jar | jq .id`
    echo $JOBID
    ```

    ```powershell
    $reqParams = @{}
    $reqParams."user.name" = "admin"
    $reqParams.jar = "/example/jars/hadoop-mapreduce-examples.jar"
    $reqParams.class = "wordcount"
    $reqParams.arg = @()
    $reqParams.arg += "/example/data/gutenberg/davinci.txt"
    $reqparams.arg += "/example/data/output"
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/mapreduce/jar" `
       -Credential $creds `
       -Body $reqParams `
       -Method POST `
       -UseBasicParsing
    $jobID = (ConvertFrom-Json $resp.Content).id
    $jobID
    ```

    The end of the URI (/mapreduce/jar) tells WebHCat that this request starts a MapReduce job from a class in a jar file. The parameters used in this command are as follows:

   * **-d**: `-G` is not used, so the request defaults to the POST method. `-d` specifies the data values that are sent with the request.
    * **user.name**: The user who is running the command
    * **jar**: The location of the jar file that contains class to be ran
    * **class**: The class that contains the MapReduce logic
    * **arg**: The arguments to be passed to the MapReduce job. In this case, the input text file and the directory that are used for the output

   This command should return a job ID that can be used to check the status of the job:

       job_1415651640909_0026

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

    If the job is complete, the state returned is `SUCCEEDED`.

   > [!NOTE]
   > This Curl request returns a JSON document with information about the job. Jq is used to retrieve only the state value.

6. When the state of the job has changed to `SUCCEEDED`, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter that is passed with the query contains the location of the output file. In this example, the location is `/example/curl`. This address stores the output of the job in the clusters default storage at `/example/curl`.

You can list and download these files by using the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). For more information on working with blobs from the Azure CLI, see the [Using the Azure CLI with Azure Storage](../../storage/common/storage-azure-cli.md#create-and-manage-blobs) document.

## <a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For more information about the REST interface that is used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).
