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
	ms.date="03/18/2016"
	ms.author="larryfr"/>

#Availability and reliability of Hadoop clusters in HDInsight

A second head node is used by Linux-based Hadoop clusters deployed by Azure HDInsight. This increases the availability and reliability of Hadoop services and jobs running in Azure.

> [AZURE.NOTE] The steps used in this document are specific to Linux-based HDInsight clusters. If you are using a Windows-based cluster, see [Availability and reliability of Windows-based Hadoop clusters in HDInsight](hdinsight-high-availability.md) for Windows-specific information.

##Understanding the head nodes

Some implementations of Hadoop have a single head node that hosts services and components that manage the failure of data (worker) nodes smoothly. But any outages of master services running on the head node would cause the cluster to cease to work.

HDInsight clusters provide a secondary head node, which allows master services and components to continue to run on on the secondary node in the event of a failure on the primary.

> [AZURE.IMPORTANT] Both head nodes are active and running within the cluster simultaneously. Some services, such as HDFS or YARN, are only 'active' on one head node at any given time (and ‘standby’ on the other head node). Other services such as HiveServer2 or Hive MetaStore are active on both head nodes at the same time.

[ZooKeeper](http://zookeeper.apache.org/ ) nodes (ZKs) are used for leader election of master services on head nodes, and to insure that services, data (worker) nodes and gateways know which head node a master service is active on.

## Accessing the head nodes

In general, all access to the cluster through the public gateways (Ambari web and REST APIs,) is not effected by having multiple head nodes. The request is routed to the active head node and serviced as appropriate.

When accessing the cluster using SSH, connecting through port 22 (the default for SSH,) will connect to head node 0; connecting through port 23 will connect to head node 1.

### Internal fully qualified domain names (FQDN)

Nodes in an HDInsight cluster have an internal IP address and FQDN that can only be accessed from the cluster (such as an SSH session to the head node or a job running on the cluster.) When accessing services on the cluster using the internal FQDN or IP address, you should use Ambari to verify the IP or FQDN to use when accessing the service.

For example, the Oozie service can only run on one head node, and using the `oozie` command from an SSH session requires the URL to the service. This can be retrieved from Ambari by using the following command:

	curl -u admin:PASSWORD "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations?type=oozie-site&tag=TOPOLOGY_RESOLVED" | grep oozie.base.url

This will return a value similar to the following, which contains the internal URL to use with the `oozie` command:

	"oozie.base.url": "http://hn0-CLUSTERNAME-randomcharacters.cx.internal.cloudapp.net:11000/oozie"

## How to check on a service status

Either the Ambari Web UI or the Ambari REST API can be used to check the status of services that run on the head node.

###Ambari REST API

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

###Ambari Web UI

The Ambari Web UI is viewable at https://CLUSTERNAME.azurehdinsight.net. Replace **CLUSTERNAME** with the name of your cluster. If prompted, enter the HTTP user credentials for your cluster. The default HTTP user name is **admin** and the password is the password you entered when creating the cluster.

When you arrive on the Ambari page, the installed services will be listed on the left of the page.

![Installed services](./media/hdinsight-high-availability-linux/services.png)

There are a series of icons that may appear next to a service to indicate status. Any alerts related to a service can be viewed using the **Alerts** link at the top of the page. You can select each service to view more information on it.

While the service page provides information on the status and configuration of each service, it does not provide information on which head node the service is running on. To view this information, use the **Hosts** link at the top of the page. This will display hosts within the cluster, including the head nodes.

![hosts list](./media/hdinsight-high-availability-linux/hosts.png)

Selecting the link for one of the head nodes will display the services and components running on that node.

![Component status](./media/hdinsight-high-availability-linux/nodeservices.png)

## How to access log files on the secondary head node

###SSH

While connected to a head node through SSH, log files can be found under **/var/log**. For example, **/var/log/hadoop-yarn/yarn** contain logs for YARN.

Each head node can have unique log entries, so you should check the logs on both.

###Ambari

> [AZURE.NOTE] Accessing log files through Ambari requires an SSH tunnel, as the web sites for the individual services are not exposed publicly on the Internet. For information on using an SSH tunnel, see [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md).

From the Ambari Web UI, select the service you wish to view logs for (for example, YARN,) and then use **Quick Links** to select which head node to view the logs for.

![Using quick links to view logs](./media/hdinsight-high-availability-linux/viewlogs.png)

## How to configure the size of the head node ##

The size of the head node can only be selected during cluster creation. You can find a list of the different VM sizes available for HDInsight, including the core, memory, and local storage for each, on the [HDInsight pricing page](https://azure.microsoft.com/pricing/details/hdinsight/).

When creating a new cluster, you can specify the size of the nodes. The following provide information on how to specify the size using the [Azure Portal][preview-portal], [Azure PowerShell][azure-powershell], and the [Azure CLI][azure-cli]:

* **Azure Portal**: When creating a new cluster, you are given the option of setting the size (pricing tier,) of both the head and data (worker) nodes for the cluster:

	![Image of cluster creation wizard with node size selection](./media/hdinsight-high-availability-linux/headnodesize.png)

* **Azure CLI**: When using the `azure hdinsight cluster create` command, you can set the size of the head node using the `--headNodeSize` parameter.

* **Azure PowerShell**: When using the `New-AzureRmHDInsightCluster` cmdlet, you can set the size of the head node using the `-HeadNodeVMSize` parameter.

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
