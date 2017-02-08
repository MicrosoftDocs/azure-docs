---
title: Develop Python MapReduce jobs with HDInsight | Microsoft Docs
description: Learn how to create and run Python MapReduce jobs on Linux-based HDInsight clusters.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 7631d8d9-98ae-42ec-b9ec-ee3cf7e57fb3
ms.service: hdinsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 02/06/2017
ms.author: larryfr

---
# Develop Python streaming programs for HDInsight

Hadoop provides a streaming API for MapReduce that enables you to write map and reduce functions in languages other than Java. In this article, you will learn how to use Python to perform MapReduce operations.

This article is based on information and examples published by Michael Noll at [Writing an Hadoop MapReduce Program in Python](http://www.michael-noll.com/tutorials/writing-an-hadoop-mapreduce-program-in-python/).

## Prerequisites

To complete the steps in this article, you will need the following:

* A Linux-based Hadoop on HDInsight cluster

  > [!IMPORTANT]
  > The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight Deprecation on Windows](hdinsight-component-versioning.md#hdi-version-32-and-33-nearing-deprecation-date).

* A text editor
  
  > [!IMPORTANT]
  > The text editor must use LF as the line ending. If it uses CRLF, this will cause errors when running the MapReduce job on Linux-based HDInsight clusters. If you are not sure, use the optional step in the [Run MapReduce](#run-mapreduce) section to convert any CRLF to LF.

* **Familiarity with SSH and SCP**. For more information on using SSH and SCP with HDInsight, see the following:
  
  * **Linux, Unix or OS X clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md)

  * **Windows clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

## Word count

For this example, you implement a basic word count by using a mapper and reducer. The mapper breaks sentences into individual words, and the reducer aggregates the words and counts to produce the output.

The following flowchart illustrates what happens during the map and reduce phases.

![illustration of map reduce](./media/hdinsight-hadoop-streaming-python/HDI.WordCountDiagram.png)

## Why Python?

Python is a general-purpose, high-level programming language that allows you to express concepts in fewer lines of code than many other languages. It has recently became popular with data scientists as a prototyping language because its interpreted nature, dynamic typing, and elegant syntax make it suitable for rapid application development.

Python is installed on all HDInsight clusters.

## Streaming MapReduce

Hadoop allows you to specify a file that contains the map and reduce logic that is used by a job. The specific requirements for the map and reduce logic are:

* **Input**: The map and reduce components must read input data from STDIN.
* **Output**: The map and reduce components must write output data to STDOUT.
* **Data format**: The data consumed and produced must be a key/value pair, separated by a tab character.

Python can easily handle these requirements by using the **sys** module to read from STDIN and using **print** to print to STDOUT. The remaining task is simply formatting the data with a tab (`\t`) character between the key and value.

## Create the mapper and reducer

The mapper and reducer are text files, in this case **mapper.py** and **reducer.py** (to make it clear which does what). You can create these by using the editor of your choice.

### Mapper.py

Create a new file named **mapper.py** and use the following code as the content:

```python
#!/usr/bin/env python

# Use the sys module
import sys

# 'file' in this case is STDIN
def read_input(file):
    # Split each line into words
    for line in file:
        yield line.split()

def main(separator='\t'):
    # Read the data using read_input
    data = read_input(sys.stdin)
    # Process each words returned from read_input
    for words in data:
        # Process each word
        for word in words:
            # Write to STDOUT
            print '%s%s%d' % (word, separator, 1)

if __name__ == "__main__":
    main()
```

Take a moment to read through the code so you can understand what it does.

### Reducer.py

Create a new file named **reducer.py** and use the following code as the content:

```python
#!/usr/bin/env python

# import modules
from itertools import groupby
from operator import itemgetter
import sys

# 'file' in this case is STDIN
def read_mapper_output(file, separator='\t'):
    # Go through each line
    for line in file:
        # Strip out the separator character
        yield line.rstrip().split(separator, 1)

def main(separator='\t'):
    # Read the data using read_mapper_output
    data = read_mapper_output(sys.stdin, separator=separator)
    # Group words and counts into 'group'
    #   Since MapReduce is a distributed process, each word
    #   may have multiple counts. 'group' will have all counts
    #   which can be retrieved using the word as the key.
    for current_word, group in groupby(data, itemgetter(0)):
        try:
            # For each word, pull the count(s) for the word
            #   from 'group' and create a total count
            total_count = sum(int(count) for current_word, count in group)
            # Write to stdout
            print "%s%s%d" % (current_word, separator, total_count)
        except ValueError:
            # Count was not a number, so do nothing
            pass

if __name__ == "__main__":
    main()
```

## Upload the files

Both **mapper.py** and **reducer.py** must be on the head node of the cluster before we can run them. This section provides an example `scp` command, and an Azure PowerShell script that can be used to upload the files to the cluster.

> [!IMPORTANT]
> There is an important difference between using `scp` and PowerShell to upload the files:
>
> * Using `scp` places the files on the primary head node of the cluster. This assumes that you will later connect to the head node and run the job from an SSH session.
> * Using the PowerShell script places the files into the default storage for the cluster. This assumes that you will later use a PowerShell script to run the job from a remote client.

### Upload using scp

From your development environment, in the same directory as **mapper.py** and **reducer.py**, use the following command. Replace **username** with the SSH user name for your cluster, and **clustername** with the name of your cluster.

`scp mapper.py reducer.py username@clustername-ssh.azurehdinsight.net:`

This copies the files from the local system to the head node.

> [!NOTE]
> If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key, for example, `scp -i /path/to/private/key mapper.py reducer.py username@clustername-ssh.azurehdinsight.net:`.

### Upload using PowerShell

1. From your development environment, create a new file named `Put-FilesInHDInsight.ps1` and use the following as the contents of the file:

    ```PowerShell
    param(
        [Parameter(Mandatory = $true)]
        [String]$clusterName,
        [Parameter(Mandatory = $true)]
        [String]$source,
        [Parameter(Mandatory = $true)]
        [String]$destination
    )
    # Login to your Azure subscription
    # Is there an active Azure subscription?
    $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Add-AzureRmAccount
    }

    # Get the cluster info
    $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
    $storageInfo = $clusterInfo.DefaultStorageAccount.split('.')

    # What type of default storage are we using?
    switch ($storageInfo[1])
    {
        "blob" {
            # Get the blob storage information for the cluster
            $resourceGroup = $clusterInfo.ResourceGroup
            $storageAccountName=$storageInfo[0]
            $storageContainer=$clusterInfo.DefaultStorageContainer
            $storageAccountKey=(Get-AzureRmStorageAccountKey `
                -Name $storageAccountName `
                -ResourceGroupName $resourceGroup)[0].Value
            # Create a storage context and upload the file
            $context = New-AzureStorageContext `
                -StorageAccountName $storageAccountName `
                -StorageAccountKey $storageAccountKey
            # Upload the file
            Set-AzureStorageBlobContent `
                -File $source `
                -Blob $destination `
                -Container $storageContainer `
                -Context $context
        }
        "azuredatalakestore" {
            # Get the Data Lake Store name
            $dataLakeStoreName=$storageInfo[0]
            # Get the root of the HDInsight cluster azuredatalakestore
            $clusterRoot=$clusterInfo.DefaultStorageRootPath
            # Upload the file. Prepend the destination with the cluster root
            Import-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path $source -Destination "$clusterRoot$destination"
        }
        default {
            Throw "Unknown storage type: $storageInfo[1]"
        }
    }
    ```

2. To use this script to upload a file, use the following from an Azure PowerShell prompt:

    `.\Put-FilesInHDInsight.ps1 -clusterName <your HDInsight cluster name> -source mapper.py -destination mapper.py`

    When prompted, enter the HTTPS login credentials for your cluster.

3. Repeat the command, replacing `mapper.py` with `reducer.py`. This will upload both mapper and reducer files to the default storage for the cluster.

## Run MapReduce (SSH)

Use the following steps to connect to the cluster and run the streaming MapReduce job from an SSH session.

1. Connect to the cluster by using SSH:
   
   `ssh username@clustername-ssh.azurehdinsight.net`
   
   > [!NOTE]
   > If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key, for example, `ssh -i /path/to/private/key username@clustername-ssh.azurehdinsight.net`.

2. (Optional) If you used a text editor that uses CRLF as the line ending when creating the mapper.py and reducer.py files, or do not know what line-ending your editor uses, use the following commands to convert occurrences of CRLF in mapper.py and reducer.py to LF.
   
    `perl -pi -e 's/\r\n/\n/g' mappery.py`
    `perl -pi -e 's/\r\n/\n/g' reducer.py`

3. Use the following command to start the MapReduce job.
   
    `yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar -files mapper.py,reducer.py -mapper mapper.py -reducer reducer.py -input /example/data/gutenberg/davinci.txt -output /example/wordcountout`
   
    This command has the following parts:
   
   * **hadoop-streaming.jar**: Used when performing streaming MapReduce operations. It interfaces Hadoop with the external MapReduce code you provide.

   * **-files**: Tells Hadoop that the specified files are needed for this MapReduce job, and they should be copied to all the worker nodes.

   * **-mapper**: Tells Hadoop which file to use as the mapper.

   * **-reducer**: Tells Hadoop which file to use as the reducer.

   * **-input**: The input file that we should count words from.

   * **-output**: The directory that the output will be written to.
     
     > [!NOTE]
     > This directory will be created by the job.

You should see a bunch of **INFO** statements as the job starts, and finally see the **map** and **reduce** operation displayed as percentages.

    15/02/05 19:01:04 INFO mapreduce.Job:  map 0% reduce 0%
    15/02/05 19:01:16 INFO mapreduce.Job:  map 100% reduce 0%
    15/02/05 19:01:27 INFO mapreduce.Job:  map 100% reduce 100%

You will receive status information about the job when it completes.

## Run MapReduce (PowerShell)

Use the following steps to run the streaming MapReduce from PowerShell on your development environment. The PowerShell script runs the job by connecting to the HDInsight cluster using WebHCat.

1. Create a new file named `Start-HDInsightStreamingPythonJob` and use the following as the contents of the file:

    ```PowerShell
    param(
        [Parameter(Mandatory = $true)]
        [String]$clusterName,
        [Parameter(Mandatory = $true)]
        [String]$inputPath,
        [Parameter(Mandatory = $true)]
        [String]$outputPath
    )
    # Login to your Azure subscription
    # Is there an active Azure subscription?
    $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Add-AzureRmAccount
    }

    # Get the login (HTTPS) credentials for the cluster
    $creds=Get-Credential -Message "Enter the login for the cluster" -UserName "admin"

    # Create the streaming job definition
    # Note: This assumes that the mapper.py and reducer.py
    #       are in the root of default storage. If you put them in a 
    #       subdirectory, change the -Files parameter to the correct path.
    $jobDefinition = New-AzureRmHDInsightStreamingMapReduceJobDefinition `
        -Files "/mapper.py", "/reducer.py" `
        -Mapper "mapper.py" `
        -Reducer "reducer.py" `
        -InputPath $inputPath `
        -OutputPath $outputPath

    # Start the job
    $job = Start-AzureRmHDInsightJob `
        -ClusterName $clusterName `
        -JobDefinition $jobDefinition `
        -HttpCredential $creds

    # Wait for the job to complete
    Wait-AzureRmHDInsightJob `
        -JobId $job.JobId `
        -ClusterName $clusterName `
        -HttpCredential $creds
    ```

2. Use the following from an Azure PowerShell prompt to run the job:

    `.\Start-HDInsightStreamingPythonJob.ps1 -clusterName <your HDInsight cluster name> -inputPath "/example/data/gutenberg/davinci.txt" -outputPath "/example/wordcountout"`

    This will use the `mapper.py` and `reducer.py` files previous uploaded to the cluster to count the words in the `davinci.txt` file. The output is stored in the `/example/wordcount` folder on the cluster's default storage.

    Information similar to the following is displayed when the job completes:

    ```
    Cluster         : myhdicluster
    HttpEndpoint    : myhdicluster.azurehdinsight.net
    State           : SUCCEEDED
    JobId           : job_1486046226168_0004
    ParentId        :
    PercentComplete : map 100% reduce 100%
    ExitValue       : 0
    User            : admin
    Callback        :
    Completed       : done
    StatusFolder    : 2017-02-06T19-14-28-a3dda3ca-f489-4287-afc9-b5e16e2e7c7a
    ```

## View the output

The output of the job is stored in the `/example/wordcountout` directory. You can view this from either an SSH session, or download it locally and view it from PowerShell.

To view the data from an SSH session to the cluster, use the following command:

`hdfs dfs -text /example/wordcountout/part-00000`

This displays a list of words and how many times the word occurred. The following is an sample of the output data:

```
wrenching       1
wretched        6
wriggling       1
wrinkled,       1
wrinkles        2
wrinkling       2
```

To view the output from your development environment using PowerShell, use the following steps:

1. Create a new file named `Get-FilesInHDInsight.ps1` and use the following as the file contents:

    ```PowerShell
    param(
        [Parameter(Mandatory = $true)]
        [String]$clusterName,
        [Parameter(Mandatory = $true)]
        [String]$source
    )
    # Login to your Azure subscription
    # Is there an active Azure subscription?
    $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Add-AzureRmAccount
    }

    # Get the cluster info
    $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
    $storageInfo = $clusterInfo.DefaultStorageAccount.split('.')

    # What type of default storage are we using?
    switch ($storageInfo[1])
    {
        "blob" {
            # Get the blob storage information for the cluster
            $resourceGroup = $clusterInfo.ResourceGroup
            $storageAccountName=$storageInfo[0]
            $storageContainer=$clusterInfo.DefaultStorageContainer
            $storageAccountKey=(Get-AzureRmStorageAccountKey `
                -Name $storageAccountName `
                -ResourceGroupName $resourceGroup)[0].Value
            # Create a storage context and download the file
            $context = New-AzureStorageContext `
                -StorageAccountName $storageAccountName `
                -StorageAccountKey $storageAccountKey
            # Download the file
            Get-AzureStorageBlobContent `
                -Container $storageContainer `
                -Blob $source `
                -Context $context `
                -Destination "./output.txt"
            # Display the output
            Get-Content "./output.txt"
        }
        "azuredatalakestore" {
            # Get the Data Lake Store name
            $dataLakeStoreName=$storageInfo[0]
            # Get the root of the HDInsight cluster azuredatalakestore
            $clusterRoot=$clusterInfo.DefaultStorageRootPath
            # Download the file. Prepend the destination with the cluster root
            # NOTE: Unlike getting a blob, this just gets the content and no
            #       file is created locally.
            Get-AzureRmDataLakeStoreItemContent -Account $dataLakeStoreName -Path $clusterRoot$source -Confirm
        }
        default {
            Throw "Unknown storage type: $storageInfo[1]"
        }
    }
    ```

2. From an Azure PowerShell prompt, use the following to run the script and view the output:

    `Get-FilesInHDInsight.ps1 -clusterName <your HDInsight cluster name> -source "example/wordcountout/part-00000"`

    This displays a list of words and how many times the word occurred. The following is an sample of the output data:

    ```
    wrenching       1
    wretched        6
    wriggling       1
    wrinkled,       1
    wrinkles        2
    wrinkling       2
    ```

## Next steps

Now that you have learned how to use streaming MapRedcue jobs with HDInsight, use the following links to explore other ways to work with Azure HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)

