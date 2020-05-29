---
title: Use MapReduce and Curl with Apache Hadoop in HDInsight - Azure 
description: Learn how to remotely run MapReduce jobs with Apache Hadoop on HDInsight using Curl.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/13/2020
---

# Run MapReduce jobs with Apache Hadoop on HDInsight using REST

Learn how to use the Apache Hive WebHCat REST API to run MapReduce jobs on an Apache Hadoop on HDInsight cluster. Curl is used to demonstrate how you can interact with HDInsight by using raw HTTP requests to run MapReduce jobs.

> [!NOTE]  
> If you are already familiar with using Linux-based Hadoop servers, but you are new to HDInsight, see the [What you need to know about Linux-based Apache Hadoop on HDInsight](../hdinsight-hadoop-linux-information.md) document.

## Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).

Either:
  * Windows PowerShell or,
  * [Curl](https://curl.haxx.se/) with [jq](https://stedolan.github.io/jq/)

## Run a MapReduce job

> [!NOTE]  
> When you use Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the HDInsight cluster administrator user name and password. You must use the cluster name as part of the URI that is used to send the requests to the server.
>
> The REST API is secured by using [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using HTTPS to ensure that your credentials are securely sent to the server.

### Curl

1. For ease of use, set the variables below. This example is based on a Windows environment, revise as needed for your environment.

    ```cmd
    set CLUSTERNAME=
    set PASSWORD=
    ```

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

    ```bash
    curl -u admin:%PASSWORD% -G https://%CLUSTERNAME%.azurehdinsight.net/templeton/v1/status
    ```

    The parameters used in this command are as follows:

   * **-u**: Indicates the user name and password used to authenticate the request
   * **-G**: Indicates that this operation is a GET request

   The beginning of the URI, `https://CLUSTERNAME.azurehdinsight.net/templeton/v1`, is the same for all requests.

    You receive a response similar to the following JSON:

    ```output
    {"version":"v1","status":"ok"}
    ```

1. To submit a MapReduce job, use the following command. Modify the path to **jq** as needed.

    ```cmd
    curl -u admin:%PASSWORD% -d user.name=admin ^
    -d jar=/example/jars/hadoop-mapreduce-examples.jar ^
    -d class=wordcount -d arg=/example/data/gutenberg/davinci.txt -d arg=/example/data/output ^
    https://%CLUSTERNAME%.azurehdinsight.net/templeton/v1/mapreduce/jar | ^
    C:\HDI\jq-win64.exe .id
    ```

    The end of the URI (/mapreduce/jar) tells WebHCat that this request starts a MapReduce job from a class in a jar file. The parameters used in this command are as follows:

   * **-d**: `-G` isn't used, so the request defaults to the POST method. `-d` specifies the data values that are sent with the request.
     * **user.name**: The user who is running the command
     * **jar**: The location of the jar file that contains class to be ran
     * **class**: The class that contains the MapReduce logic
     * **arg**: The arguments to be passed to the MapReduce job. In this case, the input text file and the directory that are used for the output

    This command should return a job ID that can be used to check the status of the job:

       job_1415651640909_0026

1. To check the status of the job, use the following command. Replace the value for `JOBID` with the **actual** value returned in the previous step. Revise location of **jq** as needed.

    ```cmd
    set JOBID=job_1415651640909_0026

    curl -G -u admin:%PASSWORD% -d user.name=admin https://%CLUSTERNAME%.azurehdinsight.net/templeton/v1/jobs/%JOBID% | ^
    C:\HDI\jq-win64.exe .status.state
    ```

### PowerShell

1. For ease of use, set the variables below. Replace `CLUSTERNAME` with your actual cluster name. Execute the command and enter the cluster login password when prompted.

    ```powershell
    $clusterName="CLUSTERNAME"
    $creds = Get-Credential -UserName admin -Message "Enter the cluster login password"
    ```

1. use the following command to verify that you can connect to your HDInsight cluster:

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clustername.azurehdinsight.net/templeton/v1/status" `
        -Credential $creds `
        -UseBasicParsing
    $resp.Content
    ```

    You receive a response similar to the following JSON:

    ```output
    {"version":"v1","status":"ok"}
    ```

1. To submit a MapReduce job, use the following command:

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

    * **user.name**: The user who is running the command
    * **jar**: The location of the jar file that contains class to be ran
    * **class**: The class that contains the MapReduce logic
    * **arg**: The arguments to be passed to the MapReduce job. In this case, the input text file and the directory that are used for the output

   This command should return a job ID that can be used to check the status of the job:

       job_1415651640909_0026

1. To check the status of the job, use the following command:

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

### Both methods

1. If the job is complete, the state returned is `SUCCEEDED`.

1. When the state of the job has changed to `SUCCEEDED`, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter that is passed with the query contains the location of the output file. In this example, the location is `/example/curl`. This address stores the output of the job in the clusters default storage at `/example/curl`.

You can list and download these files by using the [Azure CLI](/cli/azure/install-azure-cli). For more information on using the Azure CLI to work with Azure Blob storage, see [Quickstart: Create, download, and list blobs with Azure CLI](../../storage/blobs/storage-quickstart-blobs-cli.md).

## Next steps

For information about other ways you can work with Hadoop on HDInsight:

* [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)
* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)

For more information about the REST interface that is used in this article, see the [WebHCat Reference](https://cwiki.apache.org/confluence/display/Hive/WebHCat+Reference).
