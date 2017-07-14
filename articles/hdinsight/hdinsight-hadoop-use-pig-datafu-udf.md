---
title: Use DataFu with Pig on HDInsight - Azure | Microsoft Docs
description: DataFu is a collection of libraries for use with Hadoop. Learn how you can use DataFu with Pig on your HDInsight cluster.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: 0016721a-82be-4773-88ad-91e6b2c21cbb
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/04/2017
ms.author: larryfr

---
# Use DataFu with pig on HDInsight

Learn how to use DataFu with HDInsight. DataFu is a collection of Open Source libraries for use with Pig on Hadoop.

## Prerequisites

* An Azure subscription.

* An Azure HDInsight cluster (Linux or Windows based)

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdi-version-33-nearing-retirement-date).

* A basic familiarity with [using Pig on HDInsight](hdinsight-use-pig.md)

## Install DataFu on Linux-based HDInsight

> [!NOTE]
> DataFu is installed on Linux-based clusters version 3.3 and higher, and on Windows-based clusters. It is not installed on Linux-based clusters earlier than 3.3.
>
> If you are using a Linux-based cluster version 3.3 or higher, or a Windows-based cluster, you can skip this section.

DataFu can be downloaded and installed from the Maven repository. Use the following steps to add DataFu to your HDInsight cluster:

1. Connect to your Linux-based HDInsight cluster using SSH. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Use the following command to download the DataFu jar file using the wget utility, or copy and paste the link into your browser to begin the download.

    ```
    wget http://central.maven.org/maven2/com/linkedin/datafu/datafu/1.2.0/datafu-1.2.0.jar
    ```

3. Next, upload the file to default storage for your HDInsight cluster. Placing the file in default storage makes it available to all nodes in the cluster.

    ```
    hdfs dfs -put datafu-1.2.0.jar /example/jars
    ```

    > [!NOTE]
    > The previous command stores the jar in `/example/jars` since this directory already exists on the cluster storage. You can use any location you wish on HDInsight cluster storage.

## Use DataFu With Pig

The steps in this section assume that you are familiar with using Pig on HDInsight. For more information on using Pig with HDInsight, see [Use Pig with HDInsight](hdinsight-use-pig.md).

> [!IMPORTANT]
> When using DataFu from Pig on a Linux-based HDInsight cluster, you must first register the jar file.
>
> If your cluster uses Azure Storage, use a `wasb://` path. For example, `register wasb:///example/jars/datafu-1.2.0.jar`.
>
> If your cluster uses Azure Data Lake Store, use an `adl://` path. For example, `register adl://home/example/jars/datafu-1.2.0.jar`.
>
> DataFu is registered by default on Windows-based HDInsight clusters.

You often define an alias for DataFu functions. For example:

    DEFINE SHA datafu.pig.hash.SHA();

This statement defines an alias named `SHA` for the SHA hashing function. You can then use this alias in a Pig Latin script to generate a hash for the input data. For example, the following code replaces the names in the input data with a hash value:

```piglatin
raw = LOAD '/data/raw/' USING PigStorage(',') AS  
    (name:chararray,
    int1:int,
    int2:int,
    int3:int);
mask = FOREACH raw GENERATE SHA(name), int1, int2, int3;
DUMP mask;
```

If this code is used with the following input data:

    Lana Zemljaric,5,9,1
    Qiong Zhong,9,3,6
    Sandor Harsanyi,0,7,3
    Roko Petkovic,2,6,2
    Tibor Rozsa,8,0,0
    Lea Hrastovsek,6,3,6
    Regina Toth,2,1,2
    Eva Makay,8,9,2
    Shi Liao,4,6,0
    Tjasa Zemljaric,0,2,5

It generates the following output:

    (c1a743b0f34d349cfc2ce00ef98369bdc3dba1565fec92b4159a9cd5de186347,5,9,1)
    (713d030d621ab69aa3737c8ea37a2c7c724a01cd0657a370e103d8cdecac6f99,9,3,6)
    (7a5f5abdd281f68168199319d98a1a662535f988d1443b3a3c497010937bac89,0,7,3)
    (a94818e93807e12079c4b35f8f3c8c8ef8e8acd1954e7f0476bc1a3a86fc96a9,2,6,2)
    (894ead4f48af91df7e088241218a23157bede7c52115272e417e95c046d48902,8,0,0)
    (6f99f163af3448fda672087db306f363e27a98a9e49c1f274a0860e303f8aec4,6,3,6)
    (a03de92a28be3c6a984c7a153fa9ed81c0413f76a9401955b5f7e04a5dd0ab9f,2,1,2)
    (6ceab977c8fb48d9ad0dc413e6bc646cabd89f22e7ab97a6b0133f3d225c6013,8,9,2)
    (fa9c436469096ff1bd297e182831f460501b826272ae97e921f5f6e3f54747e8,4,6,0)
    (bc22db7c238b86c37af79a62c78f61a304b35143f6087eb99c34040325865654,0,2,5)

## Next steps

For more information on DataFu or Pig, see the following documents:

* [Apache DataFu Pig Guide](http://datafu.incubator.apache.org/docs/datafu/guide.html).
* [Use Pig with HDInsight](hdinsight-use-pig.md)
