---
title: Tips for using Hadoop on Linux-based HDInsight - Azure 
description: Get implementation tips for using Linux-based HDInsight (Hadoop) clusters on a familiar Linux environment running in the Azure cloud.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 03/20/2019
---

# Information about using HDInsight on Linux

Azure HDInsight clusters provide Apache Hadoop on a familiar Linux environment, running in the Azure cloud. For most things, it should work exactly as any other Hadoop-on-Linux installation. This document calls out specific differences that you should be aware of.

## Prerequisites

Many of the steps in this document use the following utilities, which may need to be installed on your system.

* [cURL](https://curl.haxx.se/) - used to communicate with web-based services.
* **jq**, a command-line JSON processor.  See [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/).
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) - used to remotely manage Azure services.
* **An SSH client**. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](hdinsight-hadoop-linux-use-ssh-unix.md).

## Users

Unless [domain-joined](./domain-joined/apache-domain-joined-introduction.md), HDInsight should be considered a **single-user** system. A single SSH user account is created with the cluster, with administrator level permissions. Additional SSH accounts can be created, but they also have administrator access to the cluster.

Domain-joined HDInsight supports multiple users and more granular permission and role settings. For more information, see [Manage Domain-joined HDInsight clusters](./domain-joined/apache-domain-joined-manage.md).

## Domain names

The fully qualified domain name (FQDN) to use when connecting to the cluster from the internet is `CLUSTERNAME.azurehdinsight.net` or `CLUSTERNAME-ssh.azurehdinsight.net` (for SSH only).

Internally, each node in the cluster has a name that is assigned during cluster configuration. To find the cluster names, see the **Hosts** page on the Ambari Web UI. You can also use the following to return a list of hosts from the Ambari REST API:

    curl -u admin -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/hosts" | jq '.items[].Hosts.host_name'

Replace `CLUSTERNAME` with the name of your cluster. When prompted, enter the password for the admin account. This command returns a JSON document that contains a list of the hosts in the cluster. [jq](https://stedolan.github.io/jq/) is used to extract the `host_name` element value for each host.

If you need to find the name of the node for a specific service, you can query Ambari for that component. For example, to find the hosts for the HDFS name node, use the following command:

    curl -u admin -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/HDFS/components/NAMENODE" | jq '.host_components[].HostRoles.host_name'

This command returns a JSON document describing the service, and then [jq](https://stedolan.github.io/jq/) pulls out only the `host_name` value for the hosts.

## Remote access to services

* **Ambari (web)** - https://CLUSTERNAME.azurehdinsight.net

    Authenticate by using the cluster administrator user and password, and then sign in to Ambari.

    Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

    > [!IMPORTANT]  
    > Some of the web UIs available through Ambari access nodes using an internal domain name. Internal domain names are not publicly accessible over the internet. You may receive "server not found" errors when trying to access some features over the Internet.
    >
    > To use the full functionality of the Ambari web UI, use an SSH tunnel to proxy web traffic to the cluster head node. See [Use SSH Tunneling to access Apache Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UIs](hdinsight-linux-ambari-ssh-tunnel.md)

* **Ambari (REST)** - https://CLUSTERNAME.azurehdinsight.net/ambari

    > [!NOTE]  
    > Authenticate by using the cluster administrator user and password.
    >
    > Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

* **WebHCat (Templeton)** - https://CLUSTERNAME.azurehdinsight.net/templeton

    > [!NOTE]  
    > Authenticate by using the cluster administrator user and password.
    >
    > Authentication is plaintext - always use HTTPS to help ensure that the connection is secure.

* **SSH** - CLUSTERNAME-ssh.azurehdinsight.net on port 22 or 23. Port 22 is used to connect to the primary headnode, while 23 is used to connect to the secondary. For more information on the head nodes, see [Availability and reliability of Apache Hadoop clusters in HDInsight](hdinsight-high-availability-linux.md).

    > [!NOTE]  
    > You can only access the cluster head nodes through SSH from a client machine. Once connected, you can then access the worker nodes by using SSH from a headnode.

For more information, see the [Ports used by Apache Hadoop services on HDInsight](hdinsight-hadoop-port-settings-for-services.md) document.

## File locations

Hadoop-related files can be found on the cluster nodes at `/usr/hdp`. This directory contains the following subdirectories:

* **2.6.5.3006-29**: The directory name is the version of the Hortonworks Data Platform used by HDInsight. The number on your cluster may be different than the one listed here.
* **current**: This directory contains links to subdirectories under the **2.6.5.3006-29** directory. This directory exists so that you don't have to remember the version number.

Example data and JAR files can be found on Hadoop Distributed File System at `/example` and `/HdiSamples`.

## HDFS, Azure Storage, and Data Lake Storage

In most Hadoop distributions, the data is stored in HDFS, which is backed by local storage on the machines in the cluster. Using local storage can be costly for a cloud-based solution where you are charged hourly or by minute for compute resources.

When using HDInsight, the data files are stored in a scalable and resilient way in the cloud using Azure Blob Storage and optionally Azure Data Lake Storage. These services provide the following benefits:

* Cheap long-term storage.
* Accessibility from external services such as websites, file upload/download utilities, various language SDKs, and web browsers.
* Large file capacity and large scalable storage.

For more information, see [Understanding blobs](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs) and [Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/).

When using either Azure Storage or Data Lake Storage, you don't have to do anything special from HDInsight to access the data. For example, the following command lists files in the `/example/data` folder regardless of whether it is stored on Azure Storage or Data Lake Storage:

    hdfs dfs -ls /example/data

In HDInsight, the data storage resources (Azure Blob Storage and Azure Data Lake Storage) are decoupled from compute resources. Therefore, you can create HDInsight clusters to do computation as you need, and later delete the cluster when the work is finished, meanwhile keeping your data files persisted safely in cloud storage as long as you need.


### <a name="URI-and-scheme"></a>URI and scheme

Some commands may require you to specify the scheme as part of the URI when accessing a file. For example, the Storm-HDFS component requires you to specify the scheme. When using non-default storage (storage added as "additional" storage to the cluster), you must always use the scheme as part of the URI.

When using __Azure Storage__, use one of the following URI schemes:

* `wasb:///`: Access default storage using unencrypted communication.

* `wasbs:///`: Access default storage using encrypted communication.  The wasbs scheme is supported only from HDInsight version 3.6 onwards.

* `wasb://<container-name>@<account-name>.blob.core.windows.net/`: Used when communicating with a non-default storage account. For example, when you have an additional storage account or when accessing data stored in a publicly accessible storage account.

When using __Azure Data Lake Storage Gen2__, use one of the following URI schemes:

* `abfs:///`: Access default storage using unencrypted communication.

* `abfss:///`: Access default storage using encrypted communication.  The abfss scheme is supported only from HDInsight version 3.6 onwards.

* `abfs://<container-name>@<account-name>.dfs.core.windows.net/`: Used when communicating with a non-default storage account. For example, when you have an additional storage account or when accessing data stored in a publicly accessible storage account.

When using __Azure Data Lake Storage Gen1__, use one of the following URI schemes:

* `adl:///`: Access the default Data Lake Storage for the cluster.

* `adl://<storage-name>.azuredatalakestore.net/`: Used when communicating with a non-default Data Lake Storage. Also used to access data outside the root directory of your HDInsight cluster.

> [!IMPORTANT]  
> When using Data Lake Storage as the default store for HDInsight, you must specify a path within the store to use as the root of HDInsight storage. The default path is `/clusters/<cluster-name>/`.
>
> When using `/` or `adl:///` to access data, you can only access data stored in the root (for example, `/clusters/<cluster-name>/`) of the cluster. To access data anywhere in the store, use the `adl://<storage-name>.azuredatalakestore.net/` format.

### What storage is the cluster using

You can use Ambari to retrieve the default storage configuration for the cluster. Use the following command to retrieve HDFS configuration information using curl, and filter it using [jq](https://stedolan.github.io/jq/):

```bash
curl -u admin -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations/service_config_versions?service_name=HDFS&service_config_version=1" | jq '.items[].configurations[].properties["fs.defaultFS"] | select(. != null)'
```

> [!NOTE]  
> This command returns the first configuration applied to the server (`service_config_version=1`), which contains this information. You may need to list all configuration versions to find the latest one.

This command returns a value similar to the following URIs:

* `wasb://<container-name>@<account-name>.blob.core.windows.net` if using an Azure Storage account.

    The account name is the name of the Azure Storage account. The container name is the blob container that is the root of the cluster storage.

* `adl://home` if using Azure Data Lake Storage. To get the Data Lake Storage name, use the following REST call:

     ```bash
    curl -u admin -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations/service_config_versions?service_name=HDFS&service_config_version=1" | jq '.items[].configurations[].properties["dfs.adls.home.hostname"] | select(. != null)'
    ```

    This command returns the following host name: `<data-lake-store-account-name>.azuredatalakestore.net`.

    To get the directory within the store that is the root for HDInsight, use the following REST call:

    ```bash
    curl -u admin -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations/service_config_versions?service_name=HDFS&service_config_version=1" | jq '.items[].configurations[].properties["dfs.adls.home.mountpoint"] | select(. != null)'
    ```

    This command returns a path similar to the following path: `/clusters/<hdinsight-cluster-name>/`.

You can also find the storage information using the Azure portal by using the following steps:

1. From the [Azure portal](https://portal.azure.com/), select your HDInsight cluster.

2. From the **Properties** section, select **Storage Accounts**. The storage information for the cluster is displayed.

### How do I access files from outside HDInsight

There are a various ways to access data from outside the HDInsight cluster. The following are a few links to utilities and SDKs that can be used to work with your data:

If using __Azure Storage__, see the following links for ways that you can access your data:

* [Azure CLI](https://docs.microsoft.com/cli/azure/install-az-cli2): Command-Line interface commands for working with Azure. After installing, use the `az storage` command for help on using storage, or `az storage blob` for blob-specific commands.
* [blobxfer.py](https://github.com/Azure/blobxfer): A python script for working with blobs in Azure Storage.
* Various SDKs:

    * [Java](https://github.com/Azure/azure-sdk-for-java)
    * [Node.js](https://github.com/Azure/azure-sdk-for-node)
    * [PHP](https://github.com/Azure/azure-sdk-for-php)
    * [Python](https://github.com/Azure/azure-sdk-for-python)
    * [Ruby](https://github.com/Azure/azure-sdk-for-ruby)
    * [.NET](https://github.com/Azure/azure-sdk-for-net)
    * [Storage REST API](https://msdn.microsoft.com/library/azure/dd135733.aspx)

If using __Azure Data Lake Storage__, see the following links for ways that you can access your data:

* [Web browser](../data-lake-store/data-lake-store-get-started-portal.md)
* [PowerShell](../data-lake-store/data-lake-store-get-started-powershell.md)
* [Azure CLI](../data-lake-store/data-lake-store-get-started-cli-2.0.md)
* [WebHDFS REST API](../data-lake-store/data-lake-store-get-started-rest-api.md)
* [Data Lake Tools for Visual Studio](https://www.microsoft.com/download/details.aspx?id=49504)
* [.NET](../data-lake-store/data-lake-store-get-started-net-sdk.md)
* [Java](../data-lake-store/data-lake-store-get-started-java-sdk.md)
* [Python](../data-lake-store/data-lake-store-get-started-python.md)

## <a name="scaling"></a>Scaling your cluster

The cluster scaling feature allows you to dynamically change the number of data nodes used by a cluster. You can perform scaling operations while other jobs or processes are running on a cluster.  See also, [Scale HDInsight clusters](./hdinsight-scaling-best-practices.md)

The different cluster types are affected by scaling as follows:

* **Hadoop**: When scaling down the number of nodes in a cluster, some of the services in the cluster are restarted. Scaling operations can cause jobs running or pending to fail at the completion of the scaling operation. You can resubmit the jobs once the operation is complete.
* **HBase**: Regional servers are automatically balanced within a few minutes, once the scaling operation completes. To manually balance regional servers, use the following steps:

    1. Connect to the HDInsight cluster using SSH. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

    2. Use the following to start the HBase shell:

            hbase shell

    3. Once the HBase shell has loaded, use the following to manually balance the regional servers:

            balancer

* **Storm**: You should rebalance any running Storm topologies after a scaling operation has been performed. Rebalancing allows the topology to readjust parallelism settings based on the new number of nodes in the cluster. To rebalance running topologies, use one of the following options:

    * **SSH**: Connect to the server and use the following command to rebalance a topology:

            storm rebalance TOPOLOGYNAME

        You can also specify parameters to override the parallelism hints originally provided by the topology. For example, `storm rebalance mytopology -n 5 -e blue-spout=3 -e yellow-bolt=10` reconfigures the topology to 5 worker processes, 3 executors for the blue-spout component, and 10 executors for the yellow-bolt component.

    * **Storm UI**: Use the following steps to rebalance a topology using the Storm UI.

        1. Open `https://CLUSTERNAME.azurehdinsight.net/stormui` in your web browser, where `CLUSTERNAME` is the name of your Storm cluster. If prompted, enter the HDInsight cluster administrator (admin) name and password you specified when creating the cluster.
        2. Select the topology you wish to rebalance, then select the **Rebalance** button. Enter the delay before the rebalance operation is performed.

* **Kafka**: You should rebalance partition replicas after scaling operations. For more information, see the [High availability of data with Apache Kafka on HDInsight](./kafka/apache-kafka-high-availability.md) document.

For specific information on scaling your HDInsight cluster, see:

* [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-portal-linux.md#scale-clusters)
* [Manage Apache Hadoop clusters in HDInsight by using Azure CLI](hdinsight-administer-use-command-line.md#scale-clusters)

## How do I install Hue (or other Hadoop component)?

HDInsight is a managed service. If Azure detects a problem with the cluster, it may delete the failing node and create a node to replace it. If you manually install things on the cluster, they are not persisted when this operation occurs. Instead, use [HDInsight Script Actions](hdinsight-hadoop-customize-cluster-linux.md). A script action can be used to make the following changes:

* Install and configure a service or web site.
* Install and configure a component that requires configuration changes on multiple nodes in the cluster.

Script Actions are Bash scripts. The scripts run during cluster creation, and are used to install and configure additional components. Example scripts are provided for installing the following components:

* [Apache Giraph](hdinsight-hadoop-giraph-install-linux.md)

For information on developing your own Script Actions, see [Script Action development with HDInsight](hdinsight-hadoop-script-actions-linux.md).

### Jar files

Some Hadoop technologies are provided in self-contained jar files that contain functions used as part of a MapReduce job, or from inside Pig or Hive. They often don't require any setup, and can be uploaded to the cluster after creation and used directly. If you want to make sure the component survives reimaging of the cluster, you can store the jar file in the default storage for your cluster (WASB or ADL).

For example, if you want to use the latest version of [Apache DataFu](https://datafu.incubator.apache.org/), you can download a jar containing the project and upload it to the HDInsight cluster. Then follow the DataFu documentation on how to use it from Pig or Hive.

> [!IMPORTANT]  
> Some components that are standalone jar files are provided with HDInsight, but are not in the path. If you are looking for a specific component, you can use the follow to search for it on your cluster:
>
> ```find / -name *componentname*.jar 2>/dev/null```
>
> This command returns the path of any matching jar files.

To use a different version of a component, upload the version you need and use it in your jobs.

> [!IMPORTANT]
> Components provided with the HDInsight cluster are fully supported and Microsoft Support helps to isolate and resolve issues related to these components.
>
> Custom components receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue OR asking you to engage available channels for the open source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [https://stackoverflow.com](https://stackoverflow.com). Also Apache projects have project sites on [https://apache.org](https://apache.org), for example: [Hadoop](https://hadoop.apache.org/), [Spark](https://spark.apache.org/).

## Next steps

* [Manage HDInsight clusters by using the Apache Ambari REST API](./hdinsight-hadoop-manage-ambari-rest-api.md)
* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use Apache Pig with HDInsight](hadoop/hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hadoop/hdinsight-use-mapreduce.md)
