---
title: Apache Hive libraries during cluster creation - Azure HDInsight
description: Learn how to add Apache Hive libraries (jar files) to an HDInsight cluster during cluster creation.
ms.service: hdinsight
ms.topic: how-to
ms.custom: H1Hack27Feb2017,hdinsightactive
ms.date: 05/11/2023
---

# Add custom Apache Hive libraries when creating your HDInsight cluster

Learn how to pre-load [Apache Hive](https://hive.apache.org/) libraries on HDInsight. This document contains information on using a Script Action to pre-load libraries during cluster creation. Libraries added using the steps in this document are globally available in Hive - there's no need to use [ADD JAR](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Cli) to load them.

## How it works

When creating a cluster, you can use a Script Action to modify cluster nodes as they're created. The script in this document accepts a single parameter, which is the location of the libraries. This location must be in an Azure Storage Account, and the libraries must be stored as jar files.

During cluster creation, the script enumerates the files, copies them to the `/usr/lib/customhivelibs/` directory on head and worker nodes, then adds them to the `hive.aux.jars.path` property in the `core-site.xml` file. On Linux-based clusters, it also updates the `hive-env.sh` file with the location of the files.

Using the script action in this article makes the libraries available when using a Hive client for **WebHCat**, and **HiveServer2**.

## The script

**Script location**

[https://hdiconfigactions.blob.core.windows.net/setupcustomhivelibsv01/setup-customhivelibs-v01.ps1](https://hdiconfigactions.blob.core.windows.net/setupcustomhivelibsv01/setup-customhivelibs-v01.ps1)

### Requirements

* The scripts must be applied to both the **Head nodes** and **Worker nodes**.

* The jars you wish to install must be stored in Azure Blob Storage in a **single container**.

* The storage account containing the library of jar files **must** be linked to the HDInsight cluster during creation. It must either be the default storage account, or an account added through __Storage Account Settings__.

* The WASB path to the container must be specified as a parameter to the Script Action. For example, if the jars are stored in a container named **libs** on a storage account named **mystorage**, the parameter would be `wasbs://libs@mystorage.blob.core.windows.net/`.

  > [!NOTE]  
  > This document assumes that you have already created a storage account, blob container, and uploaded the files to it.
  >
  > If you have not created a storage account, you can do so through the [Azure portal](https://portal.azure.com). You can then use a utility such as [Azure Storage Explorer](https://storageexplorer.com/) to create a container in the account and upload files to it.

## Create a cluster using the script

1. Start provisioning a cluster by using the steps in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md), but don't complete provisioning. You can also use Azure PowerShell or the HDInsight .NET SDK to create a cluster using this script. For more information on using these methods, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md). For the Azure portal, from the **Configuration + pricing** tab, select the **+ Add script action**.

1. For **Storage**, if the storage account containing the library of jar files will be different than the account used for the cluster, complete **Additional storage accounts**.

1. For **Script Actions**, provide the following information:

    |Property |Value |
    |---|---|
    |Script type|- Custom|
    |Name|Libraries |
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh`|
    |Node type(s)|Head, Worker|
    |Parameters|Enter the WASB address to the container and storage account that contains the jars. For example, `wasbs://libs@mystorage.blob.core.windows.net/`.|

    > [!NOTE]
    > For Apache Spark 2.1, use this bash script URI: `https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v00.sh`.

1. Continue provisioning the cluster as described in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md).

Once cluster creation completes, you're able to use the jars added through this script from Hive without having to use the `ADD JAR` statement.

## Next steps

For more information on working with Hive, see [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
