---
title: Tutorial - Use Apache Storm to write to Storage/Data Lake Storage - Azure HDInsight 
description: Tutorial - Learn how to use Apache Storm to write to the HDFS-compatible storage for Azure HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: tutorial
ms.date: 06/24/2019
---

# Tutorial: Write to Apache Hadoop HDFS from Apache Storm on Azure HDInsight

This tutorial demonstrates how to use Apache Storm to write data to the HDFS-compatible storage used by Apache Storm on HDInsight. HDInsight can use both Azure Storage and Azure Data Lake Storage as HDFS-compatible storage. Storm provides an [HdfsBolt](https://storm.apache.org/releases/current/javadocs/org/apache/storm/hdfs/bolt/HdfsBolt.html) component that writes data to HDFS. This document provides information on writing to either type of storage from the HdfsBolt.

The example topology used in this document relies on components that are included with Storm on HDInsight. It may require modification to work with Azure Data Lake Storage when used with other Apache Storm clusters.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the cluster with script action
> * Build and package the topology
> * Deploy and run the topology
> * View output data
> * Stop the topology

## Prerequisites

* [Java Developer Kit (JDK) version 8](https://aka.ms/azure-jdks)

* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

* The [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme) for your clusters primary storage. This would be `wasb://` for Azure Storage, `abfs://` for Azure Data Lake Storage Gen2 or `adl://` for Azure Data Lake Storage Gen1. If secure transfer is enabled for Azure Storage or Data Lake Storage Gen2, the URI would be `wasbs://` or `abfss://`, respectively  See also, [secure transfer](../../storage/common/storage-require-secure-transfer.md).

### Example configuration

The following YAML is an excerpt from the `resources/writetohdfs.yaml` file included in the example. This file defines the Storm topology using the [Flux](https://storm.apache.org/releases/1.1.2/flux.html) framework for Apache Storm.

```yaml
components:
  - id: "syncPolicy"
    className: "org.apache.storm.hdfs.bolt.sync.CountSyncPolicy"
    constructorArgs:
      - 1000

  # Rotate files when they hit 5 MB
  - id: "rotationPolicy"
    className: "org.apache.storm.hdfs.bolt.rotation.FileSizeRotationPolicy"
    constructorArgs:
      - 5
      - "MB"

  - id: "fileNameFormat"
    className: "org.apache.storm.hdfs.bolt.format.DefaultFileNameFormat"
    configMethods:
      - name: "withPath"
        args: ["${hdfs.write.dir}"]
      - name: "withExtension"
        args: [".txt"]

  - id: "recordFormat"
    className: "org.apache.storm.hdfs.bolt.format.DelimitedRecordFormat"
    configMethods:
      - name: "withFieldDelimiter"
        args: ["|"]

# spout definitions
spouts:
  - id: "tick-spout"
    className: "com.microsoft.example.TickSpout"
    parallelism: 1


# bolt definitions
bolts:
  - id: "hdfs-bolt"
    className: "org.apache.storm.hdfs.bolt.HdfsBolt"
    configMethods:
      - name: "withConfigKey"
        args: ["hdfs.config"]
      - name: "withFsUrl"
        args: ["${hdfs.url}"]
      - name: "withFileNameFormat"
        args: [ref: "fileNameFormat"]
      - name: "withRecordFormat"
        args: [ref: "recordFormat"]
      - name: "withRotationPolicy"
        args: [ref: "rotationPolicy"]
      - name: "withSyncPolicy"
        args: [ref: "syncPolicy"]
```

This YAML defines the following items:

* `syncPolicy`: Defines when files are synched/flushed to the file system. In this example, every 1000 tuples.
* `fileNameFormat`: Defines the path and file name pattern to use when writing files. In this example, the path is provided at runtime using a filter, and the file extension is `.txt`.
* `recordFormat`: Defines the internal format of the files written. In this example, fields are delimited by the `|` character.
* `rotationPolicy`: Defines when to rotate files. In this example, no rotation is performed.
* `hdfs-bolt`: Uses the previous components as configuration parameters for the `HdfsBolt` class.

For more information on the Flux framework, see [https://storm.apache.org/releases/current/flux.html](https://storm.apache.org/releases/current/flux.html).

## Configure the cluster

By default, Storm on HDInsight does not include the components that `HdfsBolt` uses to communicate with Azure Storage or Data Lake Storage in Storm's classpath. Use the following script action to add these components to the `extlib` directory for Storm on your cluster:

| Property | Value |
|---|---|
|Script type |- Custom|
|Bash script URI |`https://hdiconfigactions.blob.core.windows.net/linuxstormextlibv01/stormextlib.sh`|
|Node type(s) |Nimbus, Supervisor|
|Parameters |None|

For information on using this script with your cluster, see the [Customize HDInsight clusters using script actions](./../hdinsight-hadoop-customize-cluster-linux.md) document.

## Build and package the topology

1. Download the example project from [https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store](https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store) to your development environment.

2. From a command prompt, terminal, or shell session, change directories to the root of the downloaded project. To build and package the topology, use the following command:

    ```cmd
    mvn compile package
    ```

    Once the build and packaging completes, there is a new directory named `target`, that contains a file named `StormToHdfs-1.0-SNAPSHOT.jar`. This file contains the compiled topology.

## Deploy and run the topology

1. Use the following command to copy the topology to the HDInsight cluster. Replace `CLUSTERNAME` with the name of the cluster.

    ```cmd
    scp target\StormToHdfs-1.0-SNAPSHOT.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net:StormToHdfs-1.0-SNAPSHOT.jar
    ```

1. Once the upload completes, use the following to connect to the HDInsight cluster using SSH. Replace `CLUSTERNAME` with the name of the cluster.

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Once connected, use the following command to create a file named `dev.properties`:

    ```bash
    nano dev.properties
    ```

1. Use the following text as the contents of the `dev.properties` file. Revise as needed based on your [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme).

    ```
    hdfs.write.dir: /stormdata/
    hdfs.url: wasbs:///
    ```

    To save the file, use __Ctrl + X__, then __Y__, and finally __Enter__. The values in this file set the storage URL and the directory name that data is written to.

1. Use the following command to start the topology:

    ```bash
    storm jar StormToHdfs-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /writetohdfs.yaml --filter dev.properties
    ```

    This command starts the topology using the Flux framework by submitting it to the Nimbus node of the cluster. The topology is defined by the `writetohdfs.yaml` file included in the jar. The `dev.properties` file is passed as a filter, and the values contained in the file are read by the topology.

## View output data

To view the data, use the following command:

  ```bash
  hdfs dfs -ls /stormdata/
  ```

A list of the files created by this topology is displayed. The following list is an example of the data returned by the previous commands:

```output
Found 23 items
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-0-1561407909895.txt
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-1-1561407915577.txt
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-10-1561407943327.txt
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-11-1561407946312.txt
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-12-1561407949320.txt
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-13-1561407952662.txt
-rw-r--r--   1 storm supergroup    5242880 2019-06-24 20:25 /stormdata/hdfs-bolt-3-14-1561407955502.txt
```

## Stop the topology

Storm topologies run until stopped, or the cluster is deleted. To stop the topology, use the following command:

```bash
storm kill hdfswriter
```

## Clean up resources

To clean up the resources created by this tutorial, you can delete the resource group. Deleting the resource group also deletes the associated HDInsight cluster, and any other resources associated with the resource group.

To remove the resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and then choose __Resource Groups__ to display the list of your resource groups.
2. Locate the resource group to delete, and then right-click the __More__ button (...) on the right side of the listing.
3. Select __Delete resource group__, and then confirm.

## Next steps

In this tutorial, you learned how to use Apache Storm to write data to the HDFS-compatible storage used by Apache Storm on HDInsight.

> [!div class="nextstepaction"]
> Discover other [Apache Storm examples for HDInsight](apache-storm-example-topology.md)