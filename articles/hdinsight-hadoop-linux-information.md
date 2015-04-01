<properties
   pageTitle="What you need to know about Hadoop on Linux-based HDInsight | Azure"
   description="Linux-based HDInsight clusters provide Hadoop on a familiar Linux environment, running in the Azure cloud."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="04/01/2015"
   ms.author="larryfr"/>

# Working with HDInsight on Linux (preview)

Linux-based Azure HDInsight clusters provide Hadoop on a familiar Linux environment, running in the Azure cloud. For most things, it should work exactly as any other Hadoop-on-Linux installation. This document calls out specific differences that you should be aware of.

## Domain names

The fully qualified domain name (FQDN) to use when connecting to the cluster is **&lt;clustername>.azurehdinsight.net** or (for SSH only) **&lt;clustername>.aurehdinsight.net**.

## Remote access to services

* **Ambari (web)** - https://&lt;clustername>.azurehdinsight.net

	> [AZURE.NOTE] Authenticate by using the cluster administrator user and password, and then log in to Ambari. This also uses the cluster administrator user and password.
	>
	> Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

	While Ambari for your cluster is accessible directly over the Internet, some functionality relies on accessing nodes by the internal domain name used by the cluster. Since this is an internal domain name, and not public, you will receive "server not found" errors when trying to access some features over the Internet.

	To work around this problem, use an SSH tunnel to proxy web traffic to the cluster head node. Use the following articles to create an SSH tunnel from a port on your local machine to the cluster:

	* <a href="../hdinsight-hadoop-linux-use-ssh-unix/#tunnel" target="_blank">Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X</a> - Steps on creating an SSH tunnel by using the `ssh` command.

	* <a href="../hdinsight-hadoop-linux-use-ssh-windows/#tunnel" target="_blank">Use SSH with Linux-based Hadoop on HDInsight from Windows</a> - Steps on using PuTTY to create an SSH tunnel.

* **Ambari (REST)** - https://&lt;clustername>.azurehdinsight.net/ambari

	> [AZURE.NOTE] Authenticate by using the cluster administrator user and password.
	>
	> Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

* **WebHCat (Templeton)** - https://&lt;clustername>.azurehdinsight.net/templeton

	> [AZURE.NOTE] Authenticate by using the cluster administrator user and password.
	>
	> Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

* **SSH** - &lt;clustername>-ssh.azurehdinsight.net on port 22

	> [AZURE.NOTE] You can only access the cluster head node through SSH from a client machine. Once connected, you can then access the worker nodes by using SSH from the head node.

## File locations

Hadoop-related files can be found on the cluster nodes at `/usr/hdp/current`.

Example data and JAR files can be found on Hadoop Distributed File System (HDFS) or Azure Blob storage at '/example' or 'wasb:///example'.

## HDFS, Azure Blob storage, and storage best practices

In most Hadoop distributions, HDFS is backed by local storage on the machines in the cluster. While this is efficient, it can be costly for a cloud-based solution where you are charged hourly for compute resources.

HDInsight uses Azure Blob storage as the default store, which provides the following benefits:

* Cheap long-term storage

* Accessibility from external services such as websites, file upload/download utilities, various language SDKs, and web browsers

Since it is the default store for HDInsight, you normally don't have to do anything to use it. For example, the following command will list files in the **/example/data** folder, which is stored on Azure Blob storage:

	hadoop fs -ls /example/data

Some commands may require you to specify that you are using Blob storage. For these, you can prefix the command with **WASB://**.

HDInsight also allows you to associate multiple Blob storage accounts with a cluster. To access data on a non-default Blob storage account, you can use the format **WASB://&lt;container-name>@&lt;account-name>.blob.core.windows.net/**. For example, the following will list the contents of the **/example/data** directory for the specified container and Blob storage account:

	hadoop fs -ls wasb://mycontainer@mystorage.blob.core.windows.net/example/data

### What Blob storage is the cluster using?

During cluster creation, you selected to either use an existing Azure Storage account and container, or create a new one. Then, you probably forgot about it. You can find the Storage account and container by using the following methods.

**Azure portal**

1. In the <a href="https://manage.windowsazure.com/" target="_blank">Azure portal</a>, select your HDInsight cluster.

2. Select **Dashboard** at the top of the page.

3. The Storage account(s) and container(s) are listed in the **linked resources** section of the page.

	![linked resources](./media/hdinsight-hadoop-linux-information/storageportal.png)

**Azure Cross-Platform Command-Line Interface**

*Coming soon!*

### How do I access Blob storage?

Other than through the Hadoop command from the cluster, there are a variety of ways to access blobs:

* <a href="http://azure.microsoft.com/documentation/articles/xplat-cli/" target="_blank">Azure Cross-Platform Command-Line Interface</a>. After installing, see `azure storage` for help on using storage, or see `azure blob` for blob-specific commands.

* A variety of SDKs:

	* <a href="https://github.com/Azure/azure-sdk-for-java" target="_blank">Java</a>

	* <a href="https://github.com/Azure/azure-sdk-for-node" target="_blank">Node.js</a>

	* <a href="https://github.com/Azure/azure-sdk-for-php" target="_blank">PHP</a>

	* <a href="https://github.com/Azure/azure-sdk-for-python" target="_blank">Python</a>

	* <a href="https://github.com/Azure/azure-sdk-for-ruby" target="_blank">Ruby</a>

	* <a href="https://github.com/Azure/azure-sdk-for-net" target="_blank">.NET</a>

* <a href="https://msdn.microsoft.com/library/azure/dd135733.aspx" target="_blank">Storage REST API.</a>

## Next steps

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
