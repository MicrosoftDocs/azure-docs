---
title: Use Azure Data Lake Store with Apache Storm on Azure HDInsight
description: Learn how to write data to Azure Data Lake Store from an Apache Storm topology on HDInsight. This document, and the associated example, demonstrate how the HdfsBolt component can be used to write to Data Lake Store.
services: hdinsight
documentationcenter: na
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: 1df98653-a6c8-4662-a8c6-5d288fc4f3a6
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/21/2017
ms.author: larryfr

---
# Use Azure Data Lake Store with Apache Storm with HDInsight (Java)

Azure Data Lake Store is an HDFS compatible cloud storage service that provides high throughput, availability, durability, and reliability for your data. In this document, you learn how to use a Java-based Storm topology to write data to Azure Data Lake Store. The steps in this document using the [HdfsBolt](http://storm.apache.org/releases/1.0.2/javadocs/org/apache/storm/hdfs/bolt/HdfsBolt.html) component, which is provided as part of Apache Storm.

> [!IMPORTANT]
> The example topology used in this document relies on components that are included with Storm on HDInsight clusters, and may require modification to work with Azure Data Lake Store when used with other Apache Storm clusters.

## How to work with Azure Data Lake Store

Data Lake Store appears to HDInsight as an HDFS compatible file system, so you can use the Storm-HDFS bolt to write to it. When working with Azure Data Lake from HDInsight, you can use a file scheme of `adl://`.

* If Data Lake Store is the primary storage for the cluster, use `adl:///`. This is the root of the cluster storage in Azure Data Lake. This may translate to a path of /clusters/CLUSTERNAME in your Data Lake Store account.
* If Data Lake Store is additional storage for the cluster, use `adl://DATALAKEACCOUNT.azuredatalakestore.net/`. This URI specifies the Data Lake Store account that data is written to. Data is written starting at the root of the Data Lake Store.

    > [!NOTE]
    > You can also use this URI format to save data to the Data Lake Store account that contains primary storage for your cluster. This allows you to save the data outside of the directory path that contains HDInsight.

The following Java code demonstrates how you can use the Storm-HDFS bolt to write data to a directory named `/stormdata` on a Data Lake Store account named `MYDATALAKE`.

```java
// 1. Create sync and rotation policies to control when data is synched
//    (written) to the file system and when to roll over into a new file.
SyncPolicy syncPolicy = new CountSyncPolicy(1000);
FileRotationPolicy rotationPolicy = new FileSizeRotationPolicy(0.5f, Units.KB);
// 2. Set the format. In this case, comma delimited
RecordFormat recordFormat = new DelimitedRecordFormat().withFieldDelimiter(",");
// 3. Set the directory name. In this case, '/stormdata/'
FileNameFormat fileNameFormat = new DefaultFileNameFormat().withPath("/stormdata/");
// 4. Create the bolt using the previously created settings,
//    and also tell it the base URL to your Data Lake Store.
// NOTE! Replace 'MYDATALAKE' below with the name of your data lake store.
HdfsBolt adlsBolt = new HdfsBolt()
    .withFsUrl("adl://MYDATALAKE.azuredatalakestore.net/")
        .withRecordFormat(recordFormat)
        .withFileNameFormat(fileNameFormat)
        .withRotationPolicy(rotationPolicy)
        .withSyncPolicy(syncPolicy);
// 4. Give it a name and wire it up to the bolt it accepts data
//    from. NOTE: The name used here is also used as part of the
//    file name for the files written to Data Lake Store.
builder.setBolt("ADLStoreBolt", adlsBolt, 1)
    .globalGrouping("finalcount");
```

The following YAML demonstrates how to use the Storm-HDFS bolt from the Flux framework:

```yaml
components:
  - id: "syncPolicy"
    className: "org.apache.storm.hdfs.bolt.sync.CountSyncPolicy"
    constructorArgs:
      - 1000
  - id: "rotationPolicy"
    className: "org.apache.storm.hdfs.bolt.rotation.FileSizeRotationPolicy"
    constructorArgs:
      - 5
      - KB

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

  - id: "rotationAction"
    className: "org.apache.storm.hdfs.common.rotation.MoveFileAction"
    configMethods:
      - name: "toDestination"
        args: ["${hdfs.dest.dir}"]

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
    parallelism: 1
```

> [!NOTE]
> The examples in this document use the Flux framework.

## Prerequisites

* [Java JDK 1.8](https://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) or higher. HDInsight 3.5 requires Java 8.

* [Maven 3.x](https://maven.apache.org/download.cgi)

* A Storm on HDInsight cluster version 3.5. To create a new Storm on HDInsight cluster, use the steps in the [Use HDInsight with Data Lake Store using Azure](../data-lake-store/data-lake-store-hdinsight-hadoop-use-portal.md) document.

### Configure environment variables

The following environment variables may be set when you install Java and the JDK on your development workstation. However, you should check that they exist and that they contain the correct values for your system.

* **JAVA_HOME** - should point to the directory where the Java runtime environment (JRE) is installed. For example, in a Unix or Linux distribution, it should have a value similar to `/usr/lib/jvm/java-8-oracle`. In Windows, it would have a value similar to `c:\Program Files (x86)\Java\jre1.8`.
* **PATH** - should contain the following paths:
  
  * **JAVA\_HOME** (or the equivalent path)
  * **JAVA\_HOME\bin** (or the equivalent path)
  * The directory where Maven is installed

## Topology implementation

The example used in this document is written in Java, and uses the following components:

* **TickSpout**: Generates the data used by other components in the topology.
* **PartialCount**: Counts events generated by TickSpout.
* **FinalCount**: Aggregates count data from PartialCount.
* **ADLStoreBolt**: Writes data to Azure Data Lake Store using the [HdfsBolt](http://storm.apache.org/releases/1.0.2/javadocs/org/apache/storm/hdfs/bolt/HdfsBolt.html) component.

The project containing this topology is available as a download from [https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store](https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store).

## Build and package the topology

1. Download the example project from [https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store
   ](https://github.com/Azure-Samples/hdinsight-storm-azure-data-lake-store) to your development environment.

2. Open the `StormToDataLake\src\main\java\com\microsoft\example\StormToDataLakeStore.java` file in an editor and find the line that contains `.withFsUrl("adl://MYDATALAKE.azuredatalakestore.net/")`. Change **MYDATALAKE** to the name of the Azure Data Lake Store you used when creating your HDInsight server.

3. From a command prompt, terminal, or shell session, change directories to the root of the downloaded project, and run the following commands to build and package the topology.
   
        mvn compile
        mvn package
   
    Once the build and packaging completes, there will be a new directory named `target`, that contains a file named `StormToDataLakeStore-1.0-SNAPSHOT.jar`. This contains the compiled topology.

## Deploy and run the topology

1. Use the following command to copy the topology to the HDInsight cluster. Replace **USER** with the SSH user name you used when creating the cluster. Replace **CLUSTERNAME** with the name of the cluster.
   
        scp target\StormToDataLakeStore-1.0-SNAPSHOT.jar USER@CLUSTERNAME-ssh.azurehdinsight.net:StormToDataLakeStore-1.0-SNAPSHOT.jar
   
    When prompted, enter the password used when creating the SSH user for the cluster. If you used a public key instead of a password, you may need to use the `-i` parameter to specify the path to the matching private key.
   
   > [!NOTE]
   > If you are using a Windows client for development, you may not have an `scp` command. If so, you can use `pscp`, which is available from [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

2. Once the upload completes, use the following to connect to the HDInsight cluster using SSH. Replace **USER** with the SSH user name you used when creating the cluster. Replace **CLUSTERNAME** with the name of the cluster.
   
        ssh USER@CLUSTERNAME-ssh.azurehdinsight.net
   
    When prompted, enter the password used when creating the SSH user for the cluster. If you used a public key instead of a password, you may need to use the `-i` parameter to specify the path to the matching private key.
   
   For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

3. Once connected, use the following command to create a file named `dev.properties`:

        nano dev.properties

4. Use the following text as the contents of the `dev.properties` file:

        hdfs.write.dir: /stormdata
        hdfs.url: adl:///
    
    To save the file, use __Ctrl + X__, then __Y__, and finally __Enter__. The values in this file set the Data Lake store URL and the directory name that data is written to.

3. Use the following command to start the topology:
   
        storm jar StormToDataLakeStore-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /datalakewriter.yaml --filter dev.properties

    This command starts the topology using the Flux framework. The topology is defined by the `datalakewriter.yaml` file included in the jar. The `dev.properties` file is passed as a filter, and the values contained in the file are read by the topology.

## View output data

To view the data, use the following command:

    hdfs dfs -ls /stormdata/

This displays a list of files that were created by the topology.

If Data Lake Store is not the default storage for the cluster, use the following command to view the data:

    hdfs dfs -ls adl://MYDATALAKE.azuredatalakestore.net/stormdata/

In the previous command, replace __MYDATALAKE__ with the Data Lake Store account.

The following list is an example of the data retuned by the previous commands:

    Found 30 items
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-0-1488568403092.txt
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-1-1488568404567.txt
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-10-1488568408678.txt
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-11-1488568411636.txt
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-12-1488568411884.txt
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-13-1488568412603.txt
    -rw-r-----+  1 larryfr larryfr       5120 2017-03-03 19:13 /stormdata/hdfs-bolt-3-14-1488568415055.txt

## Stop the topology

Storm topologies will run until stopped, or the cluster is deleted. To stop the topologies, use the following information.

**For Linux-based HDInsight**:

From an SSH session to the cluster, use the following command:

    storm kill datalakewriter

## Delete your cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Next steps

Now that you have learned how to use Storm to write to Azure Data Lake Store, discover other [Storm examples for HDInsight](hdinsight-storm-example-topology.md).

