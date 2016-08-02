<properties
   pageTitle="Tips for using Hadoop on Linux-based HDInsight | Microsoft Azure"
   description="Get implementation tips for using Linux-based HDInsight (Hadoop) clusters on a familiar Linux environment running in the Azure cloud."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
   tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="06/14/2016"
   ms.author="larryfr"/>

# Information about using HDInsight on Linux

Linux-based Azure HDInsight clusters provide Hadoop on a familiar Linux environment, running in the Azure cloud. For most things, it should work exactly as any other Hadoop-on-Linux installation. This document calls out specific differences that you should be aware of.

##Prerequisites

Many of the steps in this document use the following utilities, which may need to be installed on your system.

* [cURL](https://curl.haxx.se/) - used to communicate with web-based services
* [jq](https://stedolan.github.io/jq/) - used to parse JSON documents
* [Azure CLI](../xplat-cli-install.md) - used to remotely manage Azure services

	[AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-powershell-and-cli.md)] 

## Domain names

The fully qualified domain name (FQDN) to use when connecting to the cluster from the internet is **&lt;clustername>.azurehdinsight.net** or (for SSH only) **&lt;clustername-ssh>.azurehdinsight.net**.

Internally, each node in the cluster has a name that is assigned during cluster configuration. To find the cluster names, you can visit the __Hosts__ page on the Ambari Web UI, or use the following to return a list of hosts from the Ambari REST API:

    curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/hosts" | jq '.items[].Hosts.host_name'

Replace __PASSWORD__ with the password of the admin account, and __CLUSTERNAME__ with the name of your cluster. This will return a JSON document that contains a list of the hosts in the cluster, then jq pulls out the `host_name` element value for each host in the cluster.

If you need to find the name of the node for a specific service, you can query Ambari for that component. For example, to find the hosts for the HDFS name node, use the following.

    curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/HDFS/components/NAMENODE" | jq '.host_components[].HostRoles.host_name'

This returns a JSON document describing the service, and then jq pulls out only the `host_name` value for the hosts.

## Remote access to services

* **Ambari (web)** - https://&lt;clustername>.azurehdinsight.net

	Authenticate by using the cluster administrator user and password, and then log in to Ambari. This also uses the cluster administrator user and password.

	Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

	> [AZURE.IMPORTANT] While Ambari for your cluster is accessible directly over the Internet, some functionality relies on accessing nodes by the internal domain name used by the cluster. Since this is an internal domain name, and not public, you will receive "server not found" errors when trying to access some features over the Internet.
	>
	> To use the full functionality of the Ambari web UI, use an SSH tunnel to proxy web traffic to the cluster head node. See [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md)

* **Ambari (REST)** - https://&lt;clustername>.azurehdinsight.net/ambari

	> [AZURE.NOTE] Authenticate by using the cluster administrator user and password.
	>
	> Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

* **WebHCat (Templeton)** - https://&lt;clustername>.azurehdinsight.net/templeton

	> [AZURE.NOTE] Authenticate by using the cluster administrator user and password.
	>
	> Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

* **SSH** - &lt;clustername>-ssh.azurehdinsight.net on port 22 or 23. Port 22 is used to connect to head node 0, while 23 is used to connect to head node 1. For more information on the head nodes, see [Availability and reliability of Hadoop clusters in HDInsight](hdinsight-high-availability-linux.md).

	> [AZURE.NOTE] You can only access the cluster head nodes through SSH from a client machine. Once connected, you can then access the worker nodes by using SSH from the head node.

## File locations

Hadoop-related files can be found on the cluster nodes at `/usr/hdp`. This directory contains the following subdirectories:

* __2.2.4.9-1__: This directory is named for the version of the Hortonworks Data Platform used by HDInsight, so the number on your cluster may be different than the one listed here.
* __current__: This directory contains links to directories under the __2.2.4.9-1__ directory, and exists so that you don't have to type a version number (that might change,) every time you want to access a file.

Example data and JAR files can be found on Hadoop Distributed File System (HDFS) or Azure Blob storage at '/example' or 'wasbs:///example'.

## HDFS, Azure Blob storage, and storage best practices

In most Hadoop distributions, HDFS is backed by local storage on the machines in the cluster. While this is efficient, it can be costly for a cloud-based solution where you are charged hourly or by minute for compute resources.

HDInsight uses Azure Blob storage as the default store, which provides the following benefits:

* Cheap long-term storage

* Accessibility from external services such as websites, file upload/download utilities, various language SDKs, and web browsers

Since it is the default store for HDInsight, you normally don't have to do anything to use it. For example, the following command will list files in the **/example/data** folder, which is stored on Azure Blob storage:

	hadoop fs -ls /example/data

Some commands may require you to specify that you are using Blob storage. For these, you can prefix the command with **wasb://**, or **wasbs://**.

HDInsight also allows you to associate multiple Blob storage accounts with a cluster. To access data on a non-default Blob storage account, you can use the format **wasbs://&lt;container-name>@&lt;account-name>.blob.core.windows.net/**. For example, the following will list the contents of the **/example/data** directory for the specified container and Blob storage account:

	hadoop fs -ls wasbs://mycontainer@mystorage.blob.core.windows.net/example/data

### What Blob storage is the cluster using?

During cluster creation, you selected to either use an existing Azure Storage account and container, or create a new one. Then, you probably forgot about it. You can find the default storage account and container by using the Ambari REST API.

1. Use the following command to retrieve HDFS configuration information using curl, and filter it using [jq](https://stedolan.github.io/jq/):

        curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations/service_config_versions?service_name=HDFS&service_config_version=1" | jq '.items[].configurations[].properties["fs.defaultFS"] | select(. != null)'
    
    > [AZURE.NOTE] This will return the first configuration applied to the server (`service_config_version=1`,) which will contain this information. If you are retrieving a value that has been modified after cluster creation, you may need to list the configuration versions and retrieve the latest one.

    This will return a value similar to the following, where __CONTAINER__ is the default container and __ACCOUNTNAME__ is the Azure Storage Account name:

        wasbs://CONTAINER@ACCOUNTNAME.blob.core.windows.net

1. Get the resource group for the Storage Account, use the [Azure CLI](../xplat-cli-install.md). In the following command, replace __ACCOUNTNAME__ with the Storage Account name retrieved from Ambari:

        azure storage account list --json | jq '.[] | select(.name=="ACCOUNTNAME").resourceGroup'
    
    This will return the resource group name for the account.
    
    > [AZURE.NOTE] If nothing is returned from this command, you may need to change the Azure CLI to Azure Resource Manager mode and run the command again. To switch to Azure Resource Manager mode, use the following command.
    >
    > `azure config mode arm`
    
2. Get the key for the Storage account. Replace __GROUPNAME__ with the Resource Group from the previous step. Replace __ACCOUNTNAME__ with the Storage Account name:

        azure storage account keys list -g GROUPNAME ACCOUNTNAME --json | jq '.storageAccountKeys.key1'

    This will return the primary key for the account.

You can also find the storage information using the Azure Portal:

1. In the [Azure Portal](https://portal.azure.com/), select your HDInsight cluster.

2. From the __Essentials__ section, select __All settings__.

3. From __Settings__, select __Azure Storage Keys__.

4. From __Azure Storage Keys__, select one of the storage accounts listed. This will display information about the storage account.

5. Select the key icon. This will display keys for this storage account.

### How do I access Blob storage?

Other than through the Hadoop command from the cluster, there are a variety of ways to access blobs:

* [Azure CLI for Mac, Linux and Windows](../xplat-cli-install.md): Command-Line interface commands for working with Azure. After installing, use the `azure storage` command for help on using storage, or `azure blob` for blob-specific commands.

* [blobxfer.py](https://github.com/Azure/azure-batch-samples/tree/master/Python/Storage): A python script for working with blobs in Azure Storage.

* A variety of SDKs:

	* [Java](https://github.com/Azure/azure-sdk-for-java)

	* [Node.js](https://github.com/Azure/azure-sdk-for-node)

	* [PHP](https://github.com/Azure/azure-sdk-for-php)

	* [Python](https://github.com/Azure/azure-sdk-for-python)

	* [Ruby](https://github.com/Azure/azure-sdk-for-ruby)

	* [.NET](https://github.com/Azure/azure-sdk-for-net)

* [Storage REST API](https://msdn.microsoft.com/library/azure/dd135733.aspx)

##<a name="scaling"></a>Scaling your cluster

The cluster scaling feature allows you to change the number of data nodes used by a cluster that is running in Azure HDInsight without having to delete and re-create the cluster.

You can perform scaling operations while other jobs or processes are running on a cluster.

The different cluster types are affected by scaling as follows:

* __Hadoop__: When scaling down the number of nodes in a cluster, some of the services in the cluster are restarted. This can cause jobs running or pending to fail at the completion of the scaling operation. You can resubmit the jobs once the operation is complete.

* __HBase__: Regional servers are automatically balanced within a few minutes after completion of the scaling operation. To manually balance regional servers,use the following steps:

	1. Connect to the HDInsight cluster using SSH. For more information on using SSH with HDInsight, see one of the following documents:

		* [Use SSH with HDInsight from Linux, Unix, and Mac OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

		* [Use SSH with HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

	1. Use the following to start the HBase shell:

			hbase shell

	2. Once the HBase shell has loaded, use the following to manually balance the regional servers:

			balancer

* __Storm__: You should rebalance any running Storm topologies after a scaling operation has been performed. This allows the topology to readjust parallelism settings based on the new number of nodes in the cluster. To rebalance running topologies, use one of the following options:

	* __SSH__: Connect to the server and use the following command to rebalance a topology:

			storm rebalance TOPOLOGYNAME

		You can also specify parameters to override the parallelism hints originally provided by the topology. For example, `storm rebalance mytopology -n 5 -e blue-spout=3 -e yellow-bolt=10` will reconfigure the topology to 5 worker processes, 3 executors for the blue-spout component, and 10 executors for the yellow-bolt component.

	* __Storm UI__: Use the following steps to rebalance a topology using the Storm UI.

		1. Open __https://CLUSTERNAME.azurehdinsight.net/stormui__ in your web browser, where CLUSTERNAME is the name of your Storm cluster. If prompted, enter the HDInsight cluster administrator (admin) name and password you specified when creating the cluster.

		3. Select the topology you wish to rebalance, then select the __Rebalance__ button. Enter the delay before the rebalance operation is performed.

For specific information on scaling your HDInsight cluster, see:

* [Manage Hadoop clusters in HDInsight by using the Azure Portal](hdinsight-administer-use-portal-linux.md#scaling)

* [Manage Hadoop clusters in HDinsight by using Azure PowerShell](hdinsight-administer-use-command-line.md#scaling)

## How do I install Hue (or other Hadoop component)?

HDInsight is a managed service, which means that nodes in a cluster may be destroyed and reprovisioned automatically by Azure if a problem is detected. Because of this, it is not recommended to manually install things directly on the cluster nodes. Instead, use [HDInsight Script Actions](hdinsight-hadoop-customize-cluster.md) when you need to install the following:

* A service or web site such as Spark or Hue.
* A component that requires configuration changes on multiple nodes in the cluster. For example, a required environment variable, creating of a logging directory, or creation of a configuration file.

Script Actions are Bash scripts that are ran during cluster provisioning, and can be used to install and configure additional components on the cluster. Example scripts are provided for installing the following components:

* [Hue](hdinsight-hadoop-hue-linux.md)
* [Giraph](hdinsight-hadoop-giraph-install-linux.md)
* [R](hdinsight-hadoop-r-scripts-linux.md)
* [Solr](hdinsight-hadoop-solr-install-linux.md)

For information on developing your own Script Actions, see [Script Action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

###Jar files

Some Hadoop technologies are provided in self-contained jar files that are contain functions used as part of a MapReduce job, or from inside Pig or Hive. While these can be installed using Script Actions, they often don't require any setup and can just be uploaded to the cluster after provisioning and used directly. If you want to makle sure the component survives reimaging of the cluster, you can store the jar file in WASB.

For example, if you want to use the latest version of [DataFu](http://datafu.incubator.apache.org/), you can download a jar containing the project and upload it to the HDInsight cluster. Then follow the DataFu documentation on how to use it from Pig or Hive.

> [AZURE.IMPORTANT] Some components that are standalone jar files are provided with HDInsight, but are not in the path. If you are looking for a specific component, you can use the follow to search for it on your cluster:
>
> ```find / -name *componentname*.jar 2>/dev/null```
>
> This will return the path of any matching jar files.

If the cluster already provides a version of a component as a standalone jar file, but you want to use a different version, you can upload a new version of the component to the cluster and try using it in your jobs.

> [AZURE.WARNING] Components provided with the HDInsight cluster are fully supported and Microsoft Support will help to isolate and resolve issues related to these components.
>
> Custom components receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue OR asking you to engage available channels for the open source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [http://stackoverflow.com](http://stackoverflow.com). Also Apache projects have project sites on [http://apache.org](http://apache.org), for example: [Hadoop](http://hadoop.apache.org/), [Spark](http://spark.apache.org/).

## Next steps

* [Migrate from Windows-based HDInsight to Linux-based](hdinsight-migrate-from-windows-to-linux.md)
* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
