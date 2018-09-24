---
title: Apache Storm write to Storage/Data Lake Store - Azure HDInsight 
description: Learn how to use the Apache Storm to write to the HDFS-compatible storage for HDInsight.
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/27/2018
---
# Write to HDFS from Apache Storm on HDInsight

Learn how to use Storm to write data to the HDFS-compatible storage used by Apache Storm on HDInsight. HDInsight can use both Azure Storage and Azure Data Lake store as HDFS-compatible storage. Storm provides an [HdfsBolt](http://storm.apache.org/releases/current/javadocs/org/apache/storm/hdfs/bolt/HdfsBolt.html) component that writes data to HDFS. This document provides information on writing to either type of storage from the HdfsBolt. 

> [!IMPORTANT]
> The example topology used in this document relies on components that are included with Storm on HDInsight. It may require modification to work with Azure Data Lake Store when used with other Apache Storm clusters.

## Get the code

The project containing this topology is available as a download from [https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store](https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store).

To compile this project, you need the following configuration for your development environment:

* [Java JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or higher. HDInsight 3.5 or higher require Java 8.

* [Maven 3.x](https://maven.apache.org/download.cgi)

The following environment variables may be set when you install Java and the JDK on your development workstation. However, you should check that they exist and that they contain the correct values for your system.

* `JAVA_HOME` - should point to the directory where the JDK is installed.
* `PATH` - should contain the following paths:
  
    * `JAVA_HOME` (or the equivalent path).
    * `JAVA_HOME\bin` (or the equivalent path).
    * The directory where Maven is installed.

## How to use the HdfsBolt with HDInsight

> [!IMPORTANT]
> Before using the HdfsBolt with Storm on HDInsight, you must first use a script action to copy required jar files into the `extpath` for Storm. For more information, see the [Configure the cluster](#configure) section.

The HdfsBolt uses the file scheme that you provide to understand how to write to HDFS. With HDInsight, use one of the following schemes:

* `wasb://`: Used with an Azure Storage account.
* `adl://`: Used with Azure Data Lake Store.

The following table provides examples of using the file scheme for different scenarios:

| Scheme | Notes |
| ----- | ----- |
| `wasb:///` | The default storage account is a blob container in an Azure Storage account |
| `adl:///` | The default storage account is a directory in Azure Data Lake Store. During cluster creation, you specify the directory in Data Lake Store that is the root of the cluster's HDFS. For example, the `/clusters/myclustername/` directory. |
| `wasb://CONTAINER@ACCOUNT.blob.core.windows.net/` | A non-default (additional) Azure storage account associated with the cluster. |
| `adl://STORENAME/` | The root of the Data Lake Store used by the cluster. This scheme allows you to access data that is located outside the directory that contains the cluster file system. |

For more information, see the [HdfsBolt](http://storm.apache.org/releases/current/javadocs/org/apache/storm/hdfs/bolt/HdfsBolt.html) reference at Apache.org.

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

For more information on the Flux framework, see [https://storm.apache.org/releases/1.1.2/flux.html](https://storm.apache.org/releases/1.1.2/flux.html).

## Configure the cluster

By default, Storm on HDInsight does not include the components that HdfsBolt uses to communicate with Azure Storage or Data Lake Store in Storm's classpath. Use the following script action to add these components to the `extlib` directory for Storm on your cluster:

* Script URI: `https://hdiconfigactions.blob.core.windows.net/linuxstormextlibv01/stormextlib.sh`
* Nodes to apply to: Nimbus, Supervisor
* Parameters: None

For information on using this script with your cluster, see the [Customize HDInsight clusters using script actions](./../hdinsight-hadoop-customize-cluster-linux.md) document.

## Build and package the topology

1. Download the example project from [https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store
   ](https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store) to your development environment.

2. From a command prompt, terminal, or shell session, change directories to the root of the downloaded project. To build and package the topology, use the following command:
   
        mvn compile package
   
    Once the build and packaging completes, there is a new directory named `target`, that contains a file named `StormToHdfs-1.0-SNAPSHOT.jar`. This file contains the compiled topology.

## Deploy and run the topology

1. Use the following command to copy the topology to the HDInsight cluster. Replace **USER** with the SSH user name you used when creating the cluster. Replace **CLUSTERNAME** with the name of the cluster.
   
        scp target\StormToHdfs-1.0-SNAPSHOT.jar USER@CLUSTERNAME-ssh.azurehdinsight.net:StormToHdfs-1.0-SNAPSHOT.jar
   
    When prompted, enter the password used when creating the SSH user for the cluster. If you used a public key instead of a password, you may need to use the `-i` parameter to specify the path to the matching private key.
   
   > [!NOTE]
   > For more information on using `scp` with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. Once the upload completes, use the following to connect to the HDInsight cluster using SSH. Replace **USER** with the SSH user name you used when creating the cluster. Replace **CLUSTERNAME** with the name of the cluster.
   
        ssh USER@CLUSTERNAME-ssh.azurehdinsight.net
   
    When prompted, enter the password used when creating the SSH user for the cluster. If you used a public key instead of a password, you may need to use the `-i` parameter to specify the path to the matching private key.
   
   For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

3. Once connected, use the following command to create a file named `dev.properties`:

        nano dev.properties

4. Use the following text as the contents of the `dev.properties` file:

        hdfs.write.dir: /stormdata/
        hdfs.url: wasb:///

    > [!IMPORTANT]
    > This example assumes that your cluster uses an Azure Storage account as the default storage. If your cluster uses Azure Data Lake Store, use `hdfs.url: adl:///` instead.
    
    To save the file, use __Ctrl + X__, then __Y__, and finally __Enter__. The values in this file set the Data Lake store URL and the directory name that data is written to.

3. Use the following command to start the topology:
   
        storm jar StormToHdfs-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /writetohdfs.yaml --filter dev.properties

    This command starts the topology using the Flux framework by submitting it to the Nimbus node of the cluster. The topology is defined by the `writetohdfs.yaml` file included in the jar. The `dev.properties` file is passed as a filter, and the values contained in the file are read by the topology.

## View output data

To view the data, use the following command:

    hdfs dfs -ls /stormdata/

A list of the files created by this topology is displayed.

The following list is an example of the data retuned by the previous commands:

    Found 30 items
    -rw-r-----+  1 sshuser sshuser       488000 2017-03-03 19:13 /stormdata/hdfs-bolt-3-0-1488568403092.txt
    -rw-r-----+  1 sshuser sshuser       444000 2017-03-03 19:13 /stormdata/hdfs-bolt-3-1-1488568404567.txt
    -rw-r-----+  1 sshuser sshuser       502000 2017-03-03 19:13 /stormdata/hdfs-bolt-3-10-1488568408678.txt
    -rw-r-----+  1 sshuser sshuser       582000 2017-03-03 19:13 /stormdata/hdfs-bolt-3-11-1488568411636.txt
    -rw-r-----+  1 sshuser sshuser       464000 2017-03-03 19:13 /stormdata/hdfs-bolt-3-12-1488568411884.txt

## Stop the topology

Storm topologies run until stopped, or the cluster is deleted. To stop the topology, use the following command:

    storm kill hdfswriter

## Delete your cluster

[!INCLUDE [delete-cluster-warning](../../../includes/hdinsight-delete-cluster-warning.md)]

## Next steps

Now that you have learned how to use Storm to write to Azure Storage and Azure Data Lake Store, discover other [Storm examples for HDInsight](apache-storm-example-topology.md).

