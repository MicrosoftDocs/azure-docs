---
title: Add Hive libraries during HDInsight cluster creation - Azure | Microsoft Docs
description: Learn how to add Hive libraries (jar files,) to an HDInsight cluster during cluster creation.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: 2fd74b8d-c006-45c6-a9e2-72ff5d2d978a
ms.service: hdinsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/14/2017
ms.author: larryfr

ms.custom: H1Hack27Feb2017,hdinsightactive
---
# Add custom Hive libraries when creating your HDInsight cluster

If you have libraries that you use frequently with Hive on HDInsight, this document contains information on using a Script Action to pre-load the libraries during cluster creation. Libraries added using the steps in this document are globally available in Hive - there is no need to use [ADD JAR](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Cli) to load them.

## How it works

When creating a cluster, you can optionally specify a Script Action that runs a script on the cluster nodes while they are being created. The script in this document accepts a single parameter, which is a WASB location that contains the libraries (stored as jar files) to be pre-loaded.

During cluster creation, the script enumerates the files, copies them to the `/usr/lib/customhivelibs/` directory on head and worker nodes, then adds them to the `hive.aux.jars.path` property in the `core-site.xml` file. On Linux-based clusters, it also updates the `hive-env.sh` file with the location of the files.

> [!NOTE]
> Using the script actions in this article makes the libraries available in the following scenarios:
>
> * **Linux-based HDInsight** - when using the a Hive client, **WebHCat**, and **HiveServer2**.
> * **Windows-based HDInsight** - when using the Hive client and **WebHCat**.

## The script

**Script location**

For **Linux-based clusters**: [https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh)

For **Windows-based clusters**: [https://hdiconfigactions.blob.core.windows.net/setupcustomhivelibsv01/setup-customhivelibs-v01.ps1](https://hdiconfigactions.blob.core.windows.net/setupcustomhivelibsv01/setup-customhivelibs-v01.ps1)

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdi-version-33-nearing-retirement-date).

**Requirements**

* The scripts must be applied to both the **Head nodes** and **Worker nodes**.

* The jars you wish to install must be stored in Azure Blob Storage in a **single container**.

* The storage account containing the library of jar files **must** be linked to the HDInsight cluster during creation. It must either be the default storage account, or an account added through __optional configuration__.

* The WASB path to the container must be specified as a parameter to the Script Action. For example, if the jars are stored in a container named **libs** on a storage account named **mystorage**, the parameter would be **wasbs://libs@mystorage.blob.core.windows.net/**.

  > [!NOTE]
  > This document assumes that you have already create a storage account, blob container, and uploaded the files to it.
  >
  > If you have not created a storage account, you can do so through the [Azure portal](https://portal.azure.com). You can then use a utility such as [Azure Storage Explorer](http://storageexplorer.com/) to create a container in the account and upload files to it.

## Create a cluster using the script

> [!NOTE]
> The following steps create a Linux-based HDInsight cluster. To create a Windows-based cluster, select **Windows** as the cluster OS when creating the cluster, and use the Windows (PowerShell) script instead of the bash script.
>
> You can also use Azure PowerShell or the HDInsight .NET SDK to create a cluster using this script. For more information on using these methods, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).

1. Start provisioning a cluster by using the steps in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md), but do not complete provisioning.

2. On the **Optional Configuration** blade, select **Script Actions**, and provide the following information:

   * **NAME**: Enter a friendly name for the script action.

   * **SCRIPT URI**: https://hdiconfigactions.blob.core.windows.net/linuxsetupcustomhivelibsv01/setup-customhivelibs-v01.sh

   * **HEAD**: Check this option.

   * **WORKER**: Check this option.

   * **ZOOKEEPER**: Leave this blank.

   * **PARAMETERS**: Enter the WASB address to the container and storage account that contains the jars. For example, **wasbs://libs@mystorage.blob.core.windows.net/**.

3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration.

4. On the **Optional Configuration** blade, select **Linked Storage Accounts** and select the **Add a storage key** link. Select the storage account that contains the jars, and then use the **select** buttons to save settings and return the **Optional Configuration** blade.

5. Use the **Select** button at the bottom of the **Optional Configuration** blade to save the optional configuration information.

6. Continue provisioning the cluster as described in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md).

Once cluster creation finishes, you are able to use the jars added through this script from Hive without having to use the `ADD JAR` statement.

## Next steps

For more information on working with Hive, see [Use Hive with HDInsight](hdinsight-use-hive.md)
