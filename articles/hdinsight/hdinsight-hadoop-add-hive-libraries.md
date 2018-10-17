---
title: Add Hive libraries during HDInsight cluster creation - Azure 
description: Learn how to add Hive libraries (jar files,) to an HDInsight cluster during cluster creation.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/27/2018
ms.author: jasonh

ms.custom: H1Hack27Feb2017,hdinsightactive
---
# Add custom Hive libraries when creating your HDInsight cluster

Learn how to pre-load Hive libraries on HDInsight. This document contains information on using a Script Action to pre-load libraries during cluster creation. Libraries added using the steps in this document are globally available in Hive - there is no need to use [ADD JAR](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Cli) to load them.

## How it works

When creating a cluster, you can use a Script Action to modify cluster nodes as they are created. The script in this document accepts a single parameter, which is the location of the libraries. This location must be in an Azure Storage Account, and the libraries must be stored as jar files.

During cluster creation, the script enumerates the files, copies them to the `/usr/lib/customhivelibs/` directory on head and worker nodes, then adds them to the `hive.aux.jars.path` property in the `core-site.xml` file. On Linux-based clusters, it also updates the `hive-env.sh` file with the location of the files.

> [!NOTE]
> Using the script actions in this article makes the libraries available in the following scenarios:
>
> * **Linux-based HDInsight** - when using a Hive client, **WebHCat**, and **HiveServer2**.
> * **Windows-based HDInsight** - when using the Hive client and **WebHCat**.

## The script

**Script location**

For **Linux-based clusters**: [https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh)

For **Windows-based clusters**: [https://hdiconfigactions.blob.core.windows.net/setupcustomhivelibsv01/setup-customhivelibs-v01.ps1](https://hdiconfigactions.blob.core.windows.net/setupcustomhivelibsv01/setup-customhivelibs-v01.ps1)

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

**Requirements**

* The scripts must be applied to both the **Head nodes** and **Worker nodes**.

* The jars you wish to install must be stored in Azure Blob Storage in a **single container**.

* The storage account containing the library of jar files **must** be linked to the HDInsight cluster during creation. It must either be the default storage account, or an account added through __optional configuration__.

* The WASB path to the container must be specified as a parameter to the Script Action. For example, if the jars are stored in a container named **libs** on a storage account named **mystorage**, the parameter would be **wasb://libs@mystorage.blob.core.windows.net/**.

  > [!NOTE]
  > This document assumes that you have already created a storage account, blob container, and uploaded the files to it.
  >
  > If you have not created a storage account, you can do so through the [Azure portal](https://portal.azure.com). You can then use a utility such as [Azure Storage Explorer](http://storageexplorer.com/) to create a container in the account and upload files to it.

## Create a cluster using the script

> [!NOTE]
> The following steps create a Linux-based HDInsight cluster. To create a Windows-based cluster, select **Windows** as the cluster OS when creating the cluster, and use the Windows (PowerShell) script instead of the bash script.
>
> You can also use Azure PowerShell or the HDInsight .NET SDK to create a cluster using this script. For more information on using these methods, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).

1. Start provisioning a cluster by using the steps in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md), but do not complete provisioning.

2. On the **Optional Configuration** section, select **Script Actions**, and provide the following information:

   * **NAME**: Enter a friendly name for the script action.

   * **SCRIPT URI**: https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh

   * **HEAD**: Check this option.

   * **WORKER**: Check this option.

   * **ZOOKEEPER**: Leave this blank.

   * **PARAMETERS**: Enter the WASB address to the container and storage account that contains the jars. For example, **wasb://libs@mystorage.blob.core.windows.net/**.

3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration.

4. On the **Optional Configuration** section, select **Linked Storage Accounts** and select the **Add a storage key** link. Select the storage account that contains the jars. Then use the **select** buttons to save settings and return the **Optional Configuration**.

5. To save the optional configuration, use the **Select** button at the bottom of the **Optional Configuration** section.

6. Continue provisioning the cluster as described in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md).

Once cluster creation finishes, you are able to use the jars added through this script from Hive without having to use the `ADD JAR` statement.

## Next steps

For more information on working with Hive, see [Use Hive with HDInsight](hadoop/hdinsight-use-hive.md)
