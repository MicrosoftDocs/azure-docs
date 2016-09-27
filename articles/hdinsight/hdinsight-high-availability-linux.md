<properties
	pageTitle="High availability features of Linux-based HDInsight (Hadoop) | Microsoft Azure"
	description="Learn how Linux-based HDInsight clusters improve reliability and availability by using an additional head node. You will learn how this impacts Hadoop services such as Ambari and Hive, as well as how to individually connect to each head node using SSH."
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	authors="Blackmist"
	documentationCenter=""
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/05/2016"
	ms.author="larryfr"/>

#Availability and reliability of Hadoop clusters in HDInsight

Hadoop achieves high availability and reliability by distributing redundant copies of services and data across the nodes in a cluster. However standard distributions of Hadoop typically have only a single head node. Any outage of the single head node can cause the cluster to stop working.

To address this potential problem, Linux-based HDInsight clusters on Azure provide two head nodes to increase the availability and reliability of Hadoop services and jobs running.

> [AZURE.NOTE] The steps used in this document are specific to Linux-based HDInsight clusters. If you are using a Windows-based cluster, see [Availability and reliability of Windows-based Hadoop clusters in HDInsight](hdinsight-high-availability.md) for Windows-specific information.

##Understanding the nodes

Nodes in an HDInsight cluster are implemented using Azure Virtual Machines. In the event that a node fails, it is taken offline and a new node is created to replace the failed node. While the node is offline, another node of the same type will be used until the new node is brought online.

> [AZURE.NOTE] If the node is analyzing data when it fails, its progress on the job is lost. The job that the failing node was working on will be resubmitted to another node.

The following sections discuss the individual node types used with HDInsight. Not all node types are used for a cluster type. For example, a Hadoop cluster type will not have any Nimbus nodes. For more information on nodes used by HDInsight cluster types, see the Cluster types section of [Create Linux-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md#cluster-types).

###Head nodes

Some implementations of Hadoop have a single head node that hosts services and components that manage the failure of worker nodes smoothly. But any outages of master services running on the head node would cause the cluster to cease to work.

HDInsight clusters provide a secondary head node, which allows master services and components to continue to run on on the secondary node in the event of a failure on the primary.

> [AZURE.IMPORTANT] Both head nodes are active and running within the cluster simultaneously. Some services, such as HDFS or YARN, are only 'active' on one head node at any given time (and ‘standby’ on the other head node). Other services such as HiveServer2 or Hive MetaStore are active on both head nodes at the same time.

###Nimbus Nodes

For Storm clusters, the Nimbus nodes provide similar functionality to the Hadoop JobTracker by distributing and monitoring processing across worker nodes. HDInsight provides 2 Nimbus nodes for the Storm cluster type.

###Zookeeper nodes

[ZooKeeper](http://zookeeper.apache.org/ ) nodes (ZKs) are used for leader election of master services on head nodes, and to insure that services, data (worker) nodes and gateways know which head node a master service is active on. By default, HDInsight provides 3 ZooKeeper nodes.

###Worker nodes

Worker nodes perform the actual data analysis when a job is submitted to the cluster. If a worker node fails, the task that it was performing will be submitted to another worker node. By default, HDInsight will create 4 worker nodes; however, you can change this number to suit your needs both during cluster creation and after cluster creation.

###Edge node

An edge node does not actively participate in data analysis within the cluster, but is instead used by developers or data scientists when working with Hadoop. The edge node lives in the same Azure Virtual Network as the other nodes in the cluster, and can directly access all other nodes. Since it is not involved in analyzing data for the cluster, it can be used without any concern of taking resources away from critical Hadoop services or analysis jobs.

Currently, R Server on HDInsight is the only cluster type that provides an edge node by default. For R Server on HDInsight, the edge node is used test R code locally on the node before submitting it to the cluster for distributed processing.

[Create a Linux-based HDInsight cluster with Hue on an Edge Node](https://azure.microsoft.com/documentation/templates/hdinsight-linux-with-hue-on-edge-node/) is an example template that can be used to create a Hadoop cluster type that has an Edge node.


## Accessing the nodes

Access to the cluster over the internet is provided through a public gateway, and is limited to connecting to the head nodes and (if an R Server on HDInsight cluster,) the edge node. Access to services running on the head nodes is not effected by having multiple head nodes, as the public gateway routes requests to the head node that hosts the requested service. For example, if Ambari is currently hosted on head node 1, the gateway will route incoming requests for Ambari to that node.

When accessing the cluster using SSH, connecting through port 22 (the default for SSH,) will connect to head node 0; connecting through port 23 will connect to head node 1. For example, `ssh username@mycluster-ssh.azurehdinsight.net` will connect to head node 0 of the cluster named __mycluster__.

> [AZURE.NOTE] This also applies to protocols based on SSH, such as the SSH File Transfer Protocol (SFTP).

The edge node provided with R Server on HDInsight clusters can also be directly accessed using SSH through port 22. For example, `ssh username@RServer.mycluster.ssh.azurehdinsight.net` will connect to the edge node for an R Server on HDInsight cluster named __mycluster__. 

### Internal fully qualified domain names (FQDN)

Nodes in an HDInsight cluster have an internal IP address and FQDN that can only be accessed from the cluster (such as an SSH session to the head node or a job running on the cluster.) When accessing services on the cluster using the internal FQDN or IP address, you should use Ambari to verify the IP or FQDN to use when accessing the service.

For example, the Oozie service can only run on one head node, and using the `oozie` command from an SSH session requires the URL to the service. This can be retrieved from Ambari by using the following command:

	curl -u admin:PASSWORD "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations?type=oozie-site&tag=TOPOLOGY_RESOLVED" | grep oozie.base.url

This will return a value similar to the following, which contains the internal URL to use with the `oozie` command:

	"oozie.base.url": "http://hn0-CLUSTERNAME-randomcharacters.cx.internal.cloudapp.net:11000/oozie"

### Accessing other node types

You can connect to nodes that are not directly accessible over the internet by using the following methods.

* __SSH__: Once connected to a head node using SSH, you can then use SSH from the head node to connect to other nodes in the cluster.
* __SSH Tunnel__: If you need to access a web service hosted on one of the nodes that is not exposed to the internet, you must [use an SSH tunnel](hdinsight-linux-ambari-ssh-tunnel.md).
* __Azure Virtual Network__: If your HDInsight cluster is part of an Azure Virtual Network, any resource on the same Virtual Network can directly access all nodes in the cluster.

## How to check on a service status

Either the Ambari Web UI or the Ambari REST API can be used to check the status of services that run on the head nodes.

###Ambari Web UI

The Ambari Web UI is viewable at https://CLUSTERNAME.azurehdinsight.net. Replace **CLUSTERNAME** with the name of your cluster. If prompted, enter the HTTP user credentials for your cluster. The default HTTP user name is **admin** and the password is the password you entered when creating the cluster.

When you arrive on the Ambari page, the installed services will be listed on the left of the page.

![Installed services](./media/hdinsight-high-availability-linux/services.png)

There are a series of icons that may appear next to a service to indicate status. Any alerts related to a service can be viewed using the **Alerts** link at the top of the page. You can select each service to view more information on it.

While the service page provides information on the status and configuration of each service, it does not provide information on which head node the service is running on. To view this information, use the **Hosts** link at the top of the page. This will display hosts within the cluster, including the head nodes.

![hosts list](./media/hdinsight-high-availability-linux/hosts.png)

Selecting the link for one of the head nodes will display the services and components running on that node.

![Component status](./media/hdinsight-high-availability-linux/nodeservices.png)

###Ambari REST API

The Ambari REST API is available over the internet, and the public gateway handles routing requests to the head node that is currently hosting the REST API.

You can use the following command to check the state of a service through the Ambari REST API:

	curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SERVICENAME?fields=ServiceInfo/state

* Replace **PASSWORD** with the HTTP user (admin,) account password

* Replace **CLUSTERNAME** with the name of the cluster

* Replace **SERVICENAME** with the name of the service to check the status of

For example, to check the status of the **HDFS** service on a cluster named **mycluster**, with a password of **password**, you would use the following:

	curl -u admin:password https://mycluster.azurehdinsight.net/api/v1/clusters/mycluster/services/HDFS?fields=ServiceInfo/state

The response will be similar to the following:

	{
	  "href" : "http://hn0-CLUSTERNAME.randomcharacters.cx.internal.cloudapp.net:8080/api/v1/clusters/mycluster/services/HDFS?fields=ServiceInfo/state",
	  "ServiceInfo" : {
	    "cluster_name" : "mycluster",
	    "service_name" : "HDFS",
	    "state" : "STARTED"
	  }
	}

The URL tells us that the service is currently running on **head node 0**.

The state tells us that the service is currently running, or **STARTED**.

If you do not know what services are installed on the cluster, you can use the following to retrieve a list:

	curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services

####Service components

Services may contain components that you wish to check the status of individually. For example, HDFS contains the NameNode component. To view information on a component, the command would be:

	curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SERVICE/components/component

If you do not know what components are provided by a service, you can use the following to retrieve a list:

	curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SERVICE/components/component
    
## How to access log files on the head nodes

###SSH

While connected to a head node through SSH, log files can be found under **/var/log**. For example, **/var/log/hadoop-yarn/yarn** contain logs for YARN.

Each head node can have unique log entries, so you should check the logs on both.

###SFTP

You can also connect to the head node using the SSH File Transfer Protocol or Secure File Transfer Protocol (SFTP), and download the log files directly.

Similar to using an SSH client, when connecting to the cluster you must provide the SSH user account name and the SSH address of the cluster. For example, `sftp username@mycluster-ssh.azurehdinsight.net`. You must also provide the password for the account when prompted, or provide a public key using the `-i` parameter.

Once connected, you are presented with a `sftp>` prompt. From this prompt, you can change directories, upload and download files. For example, the following commands change directories to the **/var/log/hadoop/hdfs** directory and then download all files in the directory.

    cd /var/log/hadoop/hdfs
    get *

For a list of available commands, enter `help` at the `sftp>` prompt.

> [AZURE.NOTE] There are also graphical interfaces that allow you to visualize the file system when connected using SFTP. For example, [MobaXTerm](http://mobaxterm.mobatek.net/) allows you to browse the file system using an interface similar to Windows Explorer.


###Ambari

> [AZURE.NOTE] Accessing log files through Ambari requires an SSH tunnel, as the web sites for the individual services are not exposed publicly on the Internet. For information on using an SSH tunnel, see [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md).

From the Ambari Web UI, select the service you wish to view logs for (for example, YARN,) and then use **Quick Links** to select which head node to view the logs for.

![Using quick links to view logs](./media/hdinsight-high-availability-linux/viewlogs.png)

## How to configure the node size ##

The size of the a node can only be selected during cluster creation. You can find a list of the different VM sizes available for HDInsight, including the core, memory, and local storage for each, on the [HDInsight pricing page](https://azure.microsoft.com/pricing/details/hdinsight/).

When creating a new cluster, you can specify the size of the nodes. The following provide information on how to specify the size using the [Azure Portal][preview-portal], [Azure PowerShell][azure-powershell], and the [Azure CLI][azure-cli]:

* **Azure Portal**: When creating a new cluster, you are given the option of setting the size (pricing tier,) of the head, worker and (if used by the cluster type,) ZooKeeper nodes for the cluster:

	![Image of cluster creation wizard with node size selection](./media/hdinsight-high-availability-linux/headnodesize.png)

* **Azure CLI**: When using the `azure hdinsight cluster create` command, you can set the size of the head, worker, and ZooKeeper nodes by using the `--headNodeSize`, `--workerNodeSize`, and `--zookeeperNodeSize` parameters.

* **Azure PowerShell**: When using the `New-AzureRmHDInsightCluster` cmdlet, you can set the size of the head, worker, and ZooKeeper nodes by using the `-HeadNodeVMSize`, `-WorkerNodeSize`, and `-ZookeeperNodeSize` parameters.

##Next steps

In this document you have learned how Azure HDInsight provides high availability for Hadoop. Use the following to learn more about things mentioned in this document.

- [Ambari REST Reference](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md)

- [Install and configure the Azure CLI](../xplat-cli-install.md)

- [Install and configure Azure PowerShell](../powershell-install-configure.md)

- [Manage HDInsight using Ambari](hdinsight-hadoop-manage-ambari.md)

- [Provision Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)

[preview-portal]: https://portal.azure.com/
[azure-powershell]: ../powershell-install-configure.md
[azure-cli]: ../xplat-cli-install.md
