---
title: Use SCP with Apache Hadoop in Azure HDInsight
description: This document provides information on connecting to HDInsight using the ssh and scp commands.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 04/22/2020
---

# Use SCP with Apache Hadoop in Azure HDInsight

This article provides information on securely transferring files with your HDInsight cluster.

## Copy files

The `scp` utility can be used to copy files to and from individual nodes in the cluster. For example, the following command copies the `test.txt` directory from the local system to the primary head node:

```bash
scp test.txt sshuser@clustername-ssh.azurehdinsight.net:
```

Since no path is specified after the `:`, the file is placed in the `sshuser` home directory.

The following example copies the `test.txt` file from the `sshuser` home directory on the primary head node to the local system:

```bash
scp sshuser@clustername-ssh.azurehdinsight.net:test.txt .
```

`scp` can only access the file system of individual nodes within the cluster. It can't be used to access data in the HDFS-compatible storage for the cluster.

Use `scp` when you need to upload a resource for use from an SSH session. For example, upload a Python script and then run the script from an SSH session.

For information on directly loading data into the HDFS-compatible storage, see the following documents:

* [HDInsight using Azure Storage](hdinsight-hadoop-use-blob-storage.md).
* [HDInsight using Azure Data Lake Storage](hdinsight-hadoop-use-data-lake-store.md).

## Next steps

* [Use SSH with HDInsight](./hdinsight-hadoop-linux-use-ssh-unix.md)
* [Use edge nodes in HDInsight](hdinsight-apps-use-edge-node.md#access-an-edge-node)
