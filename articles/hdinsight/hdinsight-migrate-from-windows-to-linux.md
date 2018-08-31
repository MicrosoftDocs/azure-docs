---
title: Migrate from Windows-based HDInsight to Linux-based HDInsight - Azure 
description: Learn how to migrate from a Windows-based HDInsight cluster to a Linux-based HDInsight cluster.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/30/2018
ms.author: jasonh

---
# Migrate from a Windows-based HDInsight cluster to a Linux-based cluster

This document provides details on the differences between HDInsight on Windows and Linux. It also provides guidance on how to migrate existing workloads to a Linux-based cluster.

While Windows-based HDInsight provides an easy way to use Hadoop in the cloud, you may need to migrate to a Linux-based cluster. For example, to take advantage of Linux-based tools and technologies that are required for your solution. Many things in the Hadoop ecosystem are developed on Linux-based systems, and may not be available for use with Windows-based HDInsight. Many books, videos, and other training material assume that you are using a Linux system when working with Hadoop.

> [!NOTE]
> HDInsight clusters use Ubuntu long-term support (LTS) as the operating system for the nodes in the cluster. For information on the version of Ubuntu available with HDInsight, along with other component versioning information, see [HDInsight component versions](hdinsight-component-versioning.md).

## Migration tasks

The general workflow for migration is as follows.

![Migration workflow diagram](./media/hdinsight-migrate-from-windows-to-linux/workflow.png)

1. Read each section of this document to understand changes that may be required when migrating.

2. Create a Linux-based cluster as a test/quality assurance environment. For more information on creating a Linux-based cluster, see [Create Linux-based clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

3. Copy existing jobs, data sources, and sinks to the new environment.

4. Perform validation testing to make sure that your jobs work as expected on the new cluster.

Once you have verified that everything works as expected, schedule downtime for the migration. During this downtime, perform the following actions:

1. Back up any transient data stored locally on the cluster nodes. For example, if you have data stored directly on a head node.

2. Delete the Windows-based cluster.

3. Create a Linux-based cluster using the same default data store that the Windows-based cluster used. The Linux-based cluster can continue working against your existing production data.

4. Import any transient data you backed up.

5. Start jobs/continue processing using the new cluster.

### Copy data to the test environment

There are many methods to copy the data and jobs, however the two discussed in this section are the simplest methods to directly move files to a test cluster.

#### HDFS copy

Use the following steps to copy data from the production cluster to the test cluster. These steps use the `hdfs dfs` utility that is included with HDInsight.

1. Find the storage account and default container information for your existing cluster. The following example uses PowerShell to retrieve this information:

    ```powershell
    $clusterName="Your existing HDInsight cluster name"
    $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
    write-host "Storage account name: $clusterInfo.DefaultStorageAccount.split('.')[0]"
    write-host "Default container: $clusterInfo.DefaultStorageContainer"
    ```

2. To create a test environment, follow the steps in the Create Linux-based clusters in HDInsight document. Stop before creating the cluster, and instead select **Optional Configuration**.

3. From the Optional Configuration section, select **Linked Storage Accounts**.

4. Select **Add a storage key**, and when prompted, select the storage account that was returned by the PowerShell script in step 1. Click **Select** in each section. Finally, create the cluster.

5. Once the cluster has been created, connect to it using **SSH.** For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

6. From the SSH session, use the following command to copy files from the linked storage account to the new default storage account. Replace CONTAINER with the container information returned by PowerShell. Replace __ACCOUNT__ with the account name. Replace the path to data with the path to a data file.

    ```bash
    hdfs dfs -cp wasb://CONTAINER@ACCOUNT.blob.core.windows.net/path/to/old/data /path/to/new/location
    ```

    > [!NOTE]
    > If the directory structure that contains the data does not exist on the test environment, you can create it using the following command:

    ```bash
    hdfs dfs -mkdir -p /new/path/to/create
    ```

    The `-p` switch enables the creation of all directories in
    the path.

#### Direct copy between blobs in Azure Storage

Alternatively, you may want to use the `Start-AzureStorageBlobCopy` Azure PowerShell cmdlet to copy blobs between storage accounts outside of HDInsight. For more information, see the How to manage Azure Blobs section of Using Azure PowerShell with Azure Storage.

## Client-side technologies

Client-side technologies such as [Azure PowerShell cmdlets](/powershell/azureps-cmdlets-docs), [Azure Classic CLI](../cli-install-nodejs.md), or the [.NET SDK for Hadoop](https://hadoopsdk.codeplex.com/) continue to work Linux-based clusters. These technologies rely on REST APIs that are the same across both cluster OS types.

## Server-side technologies

The following table provides guidance on migrating server-side components that are Windows-specific.

| If you are using this technology... | Take this action... |
| --- | --- |
| **PowerShell** (server-side scripts, including Script Actions used during cluster creation) |Rewrite as Bash scripts. For Script Actions, see [Customize Linux-based HDInsight with Script Actions](hdinsight-hadoop-customize-cluster-linux.md) and [Script action development for Linux-based HDInsight](hdinsight-hadoop-script-actions-linux.md). |
| **Azure Classic CLI** (server-side scripts) |While the Azure Classic CLI is available on Linux, it does not come pre-installed on the HDInsight cluster head nodes. For more information on installing the Azure Classic CLI, see [Get started with Azure Classic CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli). |
| **.NET components** |.NET is supported on Linux-based HDInsight through [Mono](https://mono-project.com). For more information, see [Migrate .NET solutions to Linux-based HDInsight](hdinsight-hadoop-migrate-dotnet-to-linux.md). |
| **Win32 components or other Windows-only technology** |Guidance depends on the component or technology. You may be able to find a version that is compatible with Linux. If not, you must find an alternate solution or rewrite this component. |

> [!IMPORTANT]
> The HDInsight management SDK is not fully compatible with Mono. Do not use it as part of solutions that are deployed to the HDInsight cluster.

## Cluster creation

This section provides information on differences in cluster creation.

### SSH User

Linux-based HDInsight clusters use the **Secure Shell (SSH)** protocol to provide remote access to the cluster nodes. Unlike Remote Desktop for Windows-based clusters, most SSH clients do not provide a graphical user experience. Instead, SSH clients provide a command line that allows you to run commands on the cluster. Some clients (such as [MobaXterm](http://mobaxterm.mobatek.net/)) provide a graphical file system browser in addition to a remote command line.

During cluster creation, you must provide an SSH user and either a **password** or **public key certificate** for authentication.

We recommend using Public key certificate, as it is more secure than using a password. Certificate authentication works by generating a signed public/private key pair, then providing the public key when creating the cluster. When connecting to the server using SSH, the private key on the client provides authentication for the connection.

For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

### Cluster customization

**Script Actions** used with Linux-based clusters must be written in Bash script. Linux-based clusters can use script actions during or after cluster creation. For more information, see [Customize Linux-based HDInsight with Script Actions](hdinsight-hadoop-customize-cluster-linux.md) and [Script action development for Linux-based HDInsight](hdinsight-hadoop-script-actions-linux.md).

Another customization feature is **bootstrap**. For Windows clusters, this feature allows you to specify the location of additional libraries for use with Hive. After cluster creation, these libraries are automatically available for use with Hive queries without the need to use `ADD JAR`.

The Bootstrap feature for Linux-based clusters does not provide this functionality. Instead, use script action documented in [Add Hive libraries during cluster creation](hdinsight-hadoop-add-hive-libraries.md).

### Virtual Networks

Windows-based HDInsight clusters only work with Classic Virtual Networks, while Linux-based HDInsight clusters require Resource Manager Virtual Networks. If you have resources in a Classic Virtual Network that the Linux-HDInsight cluster must connect to, see [Connecting a Classic Virtual Network to a Resource Manager Virtual Network](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md).

For more information on configuration requirements, see the [Extend HDInsight capabilities by using a Virtual Network](hdinsight-extend-hadoop-virtual-network.md) document.

## Management and monitoring

Many of the web UIs you may have used with Windows-based HDInsight, such as Job History or Yarn UI, are available through Ambari. In addition, the Ambari Hive View provides a way to run Hive queries using your web browser. The Ambari Web UI is available on Linux-based clusters at https://CLUSTERNAME.azurehdinsight.net.

For more information on working with Ambari, see the following documents:

* [Ambari Web](hdinsight-hadoop-manage-ambari.md)
* [Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)

### Ambari Alerts

Ambari has an alert system that can tell you of potential problems with the cluster. Alerts appear as red or yellow entries in the Ambari Web UI, however you can also retrieve them through the REST API.

> [!IMPORTANT]
> Ambari alerts indicate that there *may* be a problem, not that there *is* a problem. For example, you may receive an alert that HiveServer2 cannot be accessed, even though you can access it normally.
>
> Many alerts are implemented as interval-based queries against a service, and expect a response within a specific time frame. So the alert doesn't necessarily mean that the service is down, just that it didn't return results within the expected time frame.

## File system locations

The Linux cluster file system is laid out differently than Windows-based HDInsight clusters. Use the following table to find commonly used files.

| I need to find... | It is located... |
| --- | --- |
| Configuration |`/etc`. For example, `/etc/hadoop/conf/core-site.xml` |
| Log files |`/var/logs` |
| Hortonworks Data Platform (HDP) |`/usr/hdp`.There are two directories located here, one that is the current HDP version and `current`. The `current` directory contains symbolic links to files and directories located in the version number directory. The `current` directory is provided as a convenient way of accessing HDP files since the version number changes as the HDP version is updated. |
| hadoop-streaming.jar |`/usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar` |

In general, if you know the name of the file, you can use the following command from an SSH session to find the file path:

    find / -name FILENAME 2>/dev/null

You can also use wildcards with the file name. For example, `find / -name *streaming*.jar 2>/dev/null` returns the path to any jar files that contain the word 'streaming' as part of the file name.

## Hive, Pig, and MapReduce

Pig and MapReduce workloads are similar on Linux-based clusters. However, Linux-based HDInsight clusters can be created using newer versions of Hadoop, Hive, and Pig. These version differences may introduce changes in how your existing solutions function. For more information on the versions of components included with HDInsight, see [HDInsight component versioning](hdinsight-component-versioning.md).

Linux-based HDInsight does not provide remote desktop functionality. Instead, you can use SSH to remotely connect to the cluster head nodes. For more information, see the following documents:

* [Use Hive with SSH](hdinsight-hadoop-use-hive-ssh.md)
* [Use Pig with SSH](hadoop/apache-hadoop-use-pig-ssh.md)
* [Use MapReduce with SSH](hadoop/apache-hadoop-use-mapreduce-ssh.md)

### Hive

> [!IMPORTANT]
> If you use an external Hive metastore, you should back up the metastore before using it with Linux-based HDInsight. Linux-based HDInsight is available with newer versions of Hive, which may have incompatibilities with metastores created by earlier versions.

The following chart provides guidance on migrating your Hive workloads.

| On Windows-based, I use... | On Linux-based... |
| --- | --- |
| **Hive Editor** |[Hive View in Ambari](hadoop/apache-hadoop-use-hive-ambari-view.md) |
| `set hive.execution.engine=tez;` to enable Tez |Tez is the default execution engine for Linux-based clusters, so the set statement is no longer needed. |
| C# user-defined functions | For information on validating C# components with Linux-based HDInsight, see [Migrate .NET solutions to Linux-based HDInsight](hdinsight-hadoop-migrate-dotnet-to-linux.md) |
| CMD files or scripts on the server invoked as part of a Hive job |use Bash scripts |
| `hive` command from remote desktop |Use [Beeline](hadoop/apache-hadoop-use-hive-beeline.md) or [Hive from an SSH session](hdinsight-hadoop-use-hive-ssh.md) |

### Pig

| On Windows-based, I use... | On Linux-based... |
| --- | --- |
| C# user-defined functions | For information on validating C# components with Linux-based HDInsight, see [Migrate .NET solutions to Linux-based HDInsight](hdinsight-hadoop-migrate-dotnet-to-linux.md) |
| CMD files or scripts on the server invoked as part of a Pig job |use Bash scripts |

### MapReduce

| On Windows-based, I use... | On Linux-based... |
| --- | --- |
| C# mapper and reducer components | For information on validating C# components with Linux-based HDInsight, see [Migrate .NET solutions to Linux-based HDInsight](hdinsight-hadoop-migrate-dotnet-to-linux.md) |
| CMD files or scripts on the server invoked as part of a Hive job |use Bash scripts |

## Oozie

> [!IMPORTANT]
> If you use an external Oozie metastore, you should back up the metastore before using it with Linux-based HDInsight. Linux-based HDInsight is available with newer versions of Oozie, which may have incompatibilities with metastores created by earlier versions.

Oozie workflows allow shell actions. Shell actions use the default shell for the operating system to run command-line commands. If you have Oozie workflows that rely on the Windows shell, you must rewrite the workflows to rely on the Linux shell environment (Bash). For more information on using shell actions with Oozie, see [Oozie shell action extension](http://oozie.apache.org/docs/3.3.0/DG_ShellActionExtension.html).

If you have a workflow that uses a C# application, validate these applications in a Linux environment. For more information, see [Migrate .NET solutions to Linux-based HDInsight](hdinsight-hadoop-migrate-dotnet-to-linux.md).

## Storm

| On Windows-based, I use... | On Linux-based... |
| --- | --- |
| Storm Dashboard |The Storm Dashboard is not available. See [Deploy and Manage Storm topologies on Linux-based HDInsight](storm/apache-storm-deploy-monitor-topology-linux.md) for ways to submit topologies |
| Storm UI |The Storm UI is available at https://CLUSTERNAME.azurehdinsight.net/stormui |
| Visual Studio to create, deploy, and manage C# or hybrid topologies |Visual Studio can be used to create, deploy, and manage C# (SCP.NET) or hybrid topologies on Linux-based Storm on HDInsight. It can only be used with clusters created after 10/28/2016. |

## HBase

On Linux-based clusters, the znode parent for HBase is `/hbase-unsecure`. Set this value in the configuration for any Java client applications that use native HBase Java API.

See [Build a Java-based HBase application](hdinsight-hbase-build-java-maven.md) for an example client that sets this value.

## Spark

Spark clusters were available on Windows-clusters during preview. Spark GA is only available with Linux-based clusters. There is no migration path from a Windows-based Spark preview cluster to a release Linux-based Spark cluster.

## Known issues

### Azure Data Factory custom .NET activities

Azure Data Factory custom .NET activities are not currently supported on Linux-based HDInsight clusters. Instead, you should use one of the following methods to implement custom activities as part of your ADF pipeline.

* Execute .NET activities on Azure Batch pool. See the Use Azure Batch linked service section of [Use custom activities in an Azure Data Factory pipeline](../data-factory/transform-data-using-dotnet-custom-activity.md)
* Implement the activity as a MapReduce activity. For more information, see [Invoke MapReduce Programs from Data Factory](../data-factory/transform-data-using-hadoop-map-reduce.md).

### Line endings

In general, line endings on Windows-based systems use CRLF, while Linux-based systems use LF. You may need to modify existing data producers and consumers to work with LF.

For example, using Azure PowerShell to query HDInsight on a Windows-based cluster returns data with CRLF. The same query with a Linux-based cluster returns LF. Test to see if the line ending causes a problem with your solution before migrating to a Linux-based cluster.

Always use LF as the line ending for scripts that run on the cluster nodes. If you use CRLF, you may see errors when running the scripts on a Linux-based cluster.

If the scripts do not contain strings with embedded CR characters, you can bulk change the line endings using one of the following methods:

* **Before uploading to the cluster**: Use the following PowerShell statements to change the line endings from CRLF to LF before uploading the script to the cluster.

    ```powershell
    $original_file ='c:\path\to\script.py'
    $text = [IO.File]::ReadAllText($original_file) -replace "`r`n", "`n"
    [IO.File]::WriteAllText($original_file, $text)
    ```

* **After uploading to the cluster**: Use the following command from an SSH session to the Linux-based cluster to modify the script.

    ```bash
    hdfs dfs -get wasb:///path/to/script.py oldscript.py
    tr -d '\r' < oldscript.py > script.py
    hdfs dfs -put -f script.py wasb:///path/to/script.py
    ```

## Next Steps

* [Learn how to create Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
* [Use SSH to connect to HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
* [Manage a Linux-based cluster using Ambari](hdinsight-hadoop-manage-ambari.md)
