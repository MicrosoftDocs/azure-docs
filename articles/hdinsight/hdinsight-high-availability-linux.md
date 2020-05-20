---
title: High availability for Hadoop - Azure HDInsight 
description: Learn how HDInsight clusters improve reliability and availability by using an additional head node. Learn how this impacts Hadoop services such as Ambari and Hive, as well as how to individually connect to each head node using SSH.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
keywords: hadoop high availability
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 10/28/2019
---

# Availability and reliability of Apache Hadoop clusters in HDInsight

HDInsight clusters provide two head nodes to increase the availability and reliability of Apache Hadoop services and jobs running.

Hadoop achieves high availability and reliability by replicating services and data across multiple nodes in a cluster. However standard distributions of Hadoop typically have only a single head node. Any outage of the single head node can cause the cluster to stop working. HDInsight provides two headnodes to improve Hadoop's availability and reliability.

## Availability and reliability of nodes

Nodes in an HDInsight cluster are implemented using Azure Virtual Machines. The following sections discuss the individual node types used with HDInsight.

> [!NOTE]  
> Not all node types are used for a cluster type. For example, a Hadoop cluster type does not have any Nimbus nodes. For more information on nodes used by HDInsight cluster types, see the Cluster types section of the [Create Linux-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md#cluster-type) document.

### Head nodes

To ensure high availability of Hadoop services, HDInsight provides two head nodes. Both head nodes are active and running within the HDInsight cluster simultaneously. Some services, such as Apache HDFS or Apache Hadoop YARN, are only 'active' on one head node at any given time. Other services such as HiveServer2 or Hive MetaStore are active on both head nodes at the same time.

To obtain the hostnames for different node types in your cluster, please use the [Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md#get-the-fqdn-of-cluster-nodes).

> [!IMPORTANT]  
> Do not associate the numeric value with whether a node is primary or secondary. The numeric value is only present to provide a unique name for each node.

### Nimbus Nodes

Nimbus nodes are available with Apache Storm clusters. The Nimbus nodes provide similar functionality to the Hadoop JobTracker by distributing and monitoring processing across worker nodes. HDInsight provides two Nimbus nodes for Storm clusters

### Apache Zookeeper nodes

[ZooKeeper](https://zookeeper.apache.org/) nodes are used for leader election of master services on head nodes. They're also used to insure that services, data (worker) nodes, and gateways know which head node a master service is active on. By default, HDInsight provides three ZooKeeper nodes.

### Worker nodes

Worker nodes perform the actual data analysis when a job is submitted to the cluster. If a worker node fails, the task that it was performing is submitted to another worker node. By default, HDInsight creates four worker nodes. You can change this number to suit your needs both during and after cluster creation.

### edge node

An edge node doesn't actively participate in data analysis within the cluster. It's used by developers or data scientists when working with Hadoop. The edge node lives in the same Azure Virtual Network as the other nodes in the cluster, and can directly access all other nodes. The edge node can be used without taking resources away from critical Hadoop services or analysis jobs.

Currently, ML Services on HDInsight is the only cluster type that provides an edge node by default. For ML Services on HDInsight, the edge node is used test R code locally on the node before submitting it to the cluster for distributed processing.

For information on using an edge node with other cluster types, see the [Use edge nodes in HDInsight](hdinsight-apps-use-edge-node.md) document.

## Accessing the nodes

Access to the cluster over the internet is provided through a public gateway. Access is limited to connecting to the head nodes and, if one exists, the edge node. Access to services running on the head nodes isn't affected by having multiple head nodes. The public gateway routes requests to the head node that hosts the requested service. For example, if Apache Ambari is currently hosted on the secondary head node, the gateway routes incoming requests for Ambari to that node.

Access over the public gateway is limited to ports 443 (HTTPS), 22, and 23.

|Port |Description |
|---|---|
|443|Used to access Ambari and other web UI or REST APIs hosted on the head nodes.|
|22|Used to access the primary head node or edge node with SSH.|
|23|Used to access the secondary head node with SSH. For example, `ssh username@mycluster-ssh.azurehdinsight.net` connects to the primary head node of the cluster named **mycluster**.|

For more information on using SSH, see the [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md) document.

### Internal fully qualified domain names (FQDN)

Nodes in an HDInsight cluster have an internal IP address and FQDN that can only be accessed from the cluster. When accessing services on the cluster using the internal FQDN or IP address, you should use Ambari to verify the IP or FQDN to use when accessing the service.

For example, the Apache Oozie service can only run on one head node, and using the `oozie` command from an SSH session requires the URL to the service. This URL can be retrieved from Ambari by using the following command:

```bash
export password='PASSWORD'
export clusterName="CLUSTERNAME"

curl -u admin:$password "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations?type=oozie-site&tag=TOPOLOGY_RESOLVED" | grep oozie.base.url
```

This command returns a value similar to the following, which contains the internal URL to use with the `oozie` command:

```output
"oozie.base.url": "http://<ACTIVE-HEADNODE-NAME>cx.internal.cloudapp.net:11000/oozie"
```

For more information on working with the Ambari REST API, see [Monitor and Manage HDInsight using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md).

### Accessing other node types

You can connect to nodes that aren't directly accessible over the internet by using the following methods:

|Method |Description |
|---|---|
|SSH|Once connected to a head node using SSH, you can then use SSH from the head node to connect to other nodes in the cluster. For more information, see the [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md) document.|
|SSH Tunnel|If you need to access a web service hosted on one of the nodes that isn't exposed to the internet, you must use an SSH tunnel. For more information, see the [Use an SSH tunnel with HDInsight](hdinsight-linux-ambari-ssh-tunnel.md) document.|
|Azure Virtual Network|If your HDInsight cluster is part of an Azure Virtual Network, any resource on the same Virtual Network can directly access all nodes in the cluster. For more information, see the [Plan a virtual network for HDInsight](hdinsight-plan-virtual-network-deployment.md) document.|

## How to check on a service status

To check the status of services that run on the head nodes, use the Ambari Web UI or the Ambari REST API.

### Ambari Web UI

The Ambari Web UI is viewable at `https://CLUSTERNAME.azurehdinsight.net`. Replace **CLUSTERNAME** with the name of your cluster. If prompted, enter the HTTP user credentials for your cluster. The default HTTP user name is **admin** and the password is the password you entered when creating the cluster.

When you arrive on the Ambari page, the installed services are listed on the left of the page.

![Apache Ambari installed services](./media/hdinsight-high-availability-linux/hdinsight-installed-services.png)

There are a series of icons that may appear next to a service to indicate status. Any alerts related to a service can be viewed using the **Alerts** link at the top of the page.  Ambari offers several predefined alerts.

The following alerts help monitor the availability of a cluster:

| Alert Name                               | Description                                                                                                                                                                                  |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Metric Monitor Status                    | This alert indicates the status of the Metrics Monitor process as determined by the monitor status script.                                                                                   |
| Ambari Agent Heartbeat                   | This alert is triggered if the server has lost contact with an agent.                                                                                                                        |
| ZooKeeper Server Process                 | This host-level alert is triggered if the ZooKeeper server process can't be determined to be up and listening on the network.                                                               |
| IOCache Metadata Server Status           | This host-level alert is triggered if the IOCache Metadata Server can't be determined to be up and responding to client requests                                                            |
| JournalNode Web UI                       | This host-level alert is triggered if the JournalNode Web UI is unreachable.                                                                                                                 |
| Spark2 Thrift Server                     | This host-level alert is triggered if the Spark2 Thrift Server can't be determined to be up.                                                                                                |
| History Server Process                   | This host-level alert is triggered if the History Server process can't be established to be up and listening on the network.                                                                |
| History Server Web UI                    | This host-level alert is triggered if the History Server Web UI is unreachable.                                                                                                              |
| `ResourceManager` Web UI                   | This host-level alert is triggered if the `ResourceManager` Web UI is unreachable.                                                                                                             |
| NodeManager Health Summary               | This service-level alert is triggered if there are unhealthy NodeManagers                                                                                                                    |
| App Timeline Web UI                      | This host-level alert is triggered if the App Timeline Server Web UI is unreachable.                                                                                                         |
| DataNode Health Summary                  | This service-level alert is triggered if there are unhealthy DataNodes                                                                                                                       |
| NameNode Web UI                          | This host-level alert is triggered if the NameNode Web UI is unreachable.                                                                                                                    |
| ZooKeeper Failover Controller Process    | This host-level alert is triggered if the ZooKeeper Failover Controller process can't be confirmed to be up and listening on the network.                                                   |
| Oozie Server Web UI                      | This host-level alert is triggered if the Oozie server Web UI is unreachable.                                                                                                                |
| Oozie Server Status                      | This host-level alert is triggered if the Oozie server can't be determined to be up and responding to client requests.                                                                      |
| Hive Metastore Process                   | This host-level alert is triggered if the Hive Metastore process can't be determined to be up and listening on the network.                                                                 |
| HiveServer2 Process                      | This host-level alert is triggered if the HiveServer can't be determined to be up and responding to client requests.                                                                        |
| WebHCat Server Status                    | This host-level alert is triggered if the `templeton` server status isn't healthy.                                                                                                            |
| Percent ZooKeeper Servers Available      | This alert is triggered if the number of down ZooKeeper servers in the cluster is greater than the configured critical threshold. It aggregates the results of ZooKeeper process checks.     |
| Spark2 Livy Server                       | This host-level alert is triggered if the Livy2 Server can't be determined to be up.                                                                                                        |
| Spark2 History Server                    | This host-level alert is triggered if the Spark2 History Server can't be determined to be up.                                                                                               |
| Metrics Collector Process                | This alert is triggered if the Metrics Collector can't be confirmed to be up and listening on the configured port for number of seconds equal to threshold.                                 |
| Metrics Collector - HBase Master Process | This alert is triggered if the Metrics Collector's HBase master processes can't be confirmed to be up and listening on the network for the configured critical threshold, given in seconds. |
| Percent Metrics Monitors Available       | This alert is triggered if a percentage of Metrics Monitor processes isn't up and listening on the network for the configured warning and critical thresholds.                             |
| Percent NodeManagers Available           | This alert is triggered if the number of down NodeManagers in the cluster is greater than the configured critical threshold. It aggregates the results of NodeManager process checks.        |
| NodeManager Health                       | This host-level alert checks the node health property available from the NodeManager component.                                                                                              |
| NodeManager Web UI                       | This host-level alert is triggered if the NodeManager Web UI is unreachable.                                                                                                                 |
| NameNode High Availability Health        | This service-level alert is triggered if either the Active NameNode or Standby NameNode are not running.                                                                                     |
| DataNode Process                         | This host-level alert is triggered if the individual DataNode processes can't be established to be up and listening on the network.                                                         |
| DataNode Web UI                          | This host-level alert is triggered if the DataNode Web UI is unreachable.                                                                                                                    |
| Percent JournalNodes Available           | This alert is triggered if the number of down JournalNodes in the cluster is greater than the configured critical threshold. It aggregates the results of JournalNode process checks.        |
| Percent DataNodes Available              | This alert is triggered if the number of down DataNodes in the cluster is greater than the configured critical threshold. It aggregates the results of DataNode process checks.              |
| Zeppelin Server Status                   | This host-level alert is triggered if the Zeppelin server can't be determined to be up and responding to client requests.                                                                   |
| HiveServer2 Interactive Process          | This host-level alert is triggered if the HiveServerInteractive can't be determined to be up and responding to client requests.                                                             |
| LLAP Application                         | This alert is triggered if the LLAP Application can't be determined to be up and responding to requests.                                                                                    |

You can select each service to view more information on it.

While the service page provides information on the status and configuration of each service, it doesn't provide information on which head node the service is running on. To view this information, use the **Hosts** link at the top of the page. This page displays hosts within the cluster, including the head nodes.

![Apache Ambari headnode hosts list](./media/hdinsight-high-availability-linux/hdinsight-hosts-list.png)

Selecting the link for one of the head nodes displays the services and components running on that node.

![Apache Ambari component status](./media/hdinsight-high-availability-linux/hdinsight-node-services.png)

For more information on using Ambari, see [Monitor and manage HDInsight using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

### Ambari REST API

The Ambari REST API is available over the internet. The HDInsight public gateway handles routing requests to the head node that is currently hosting the REST API.

You can use the following command to check the state of a service through the Ambari REST API:

```bash
curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SERVICENAME?fields=ServiceInfo/state
```

* Replace **PASSWORD** with the HTTP user (admin) account password.
* Replace **CLUSTERNAME** with the name of the cluster.
* Replace **SERVICENAME** with the name of the service you want to check the status of.

For example, to check the status of the **HDFS** service on a cluster named **mycluster**, with a password of **password**, you would use the following command:

```bash
curl -u admin:password https://mycluster.azurehdinsight.net/api/v1/clusters/mycluster/services/HDFS?fields=ServiceInfo/state
```

The response is similar to the following JSON:

```json
{
    "href" : "http://mycluster.wutj3h4ic1zejluqhxzvckxq0g.cx.internal.cloudapp.net:8080/api/v1/clusters/mycluster/services/HDFS?fields=ServiceInfo/state",
    "ServiceInfo" : {
    "cluster_name" : "mycluster",
    "service_name" : "HDFS",
    "state" : "STARTED"
    }
}
```

The URL tells us that the service is currently running on a head node named **mycluster.wutj3h4ic1zejluqhxzvckxq0g**.

The state tells us that the service is currently running, or **STARTED**.

If you don't know what services are installed on the cluster, you can use the following command to retrieve a list:

```bash
curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services
```

For more information on working with the Ambari REST API, see [Monitor and Manage HDInsight using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md).

#### Service components

Services may contain components that you wish to check the status of individually. For example, HDFS contains the NameNode component. To view information on a component, the command would be:

```bash
curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SERVICE/components/component
```

If you don't know what components are provided by a service, you can use the following command to retrieve a list:

```bash
curl -u admin:PASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SERVICE/components/component
```

## How to access log files on the head nodes

### SSH

While connected to a head node through SSH, log files can be found under **/var/log**. For example, **/var/log/hadoop-yarn/yarn** contain logs for YARN.

Each head node can have unique log entries, so you should check the logs on both.

### SFTP

You can also connect to the head node using the SSH File Transfer Protocol or Secure File Transfer Protocol (SFTP), and download the log files directly.

Similar to using an SSH client, when connecting to the cluster you must provide the SSH user account name and the SSH address of the cluster. For example, `sftp username@mycluster-ssh.azurehdinsight.net`. Provide the password for the account when prompted, or provide a public key using the `-i` parameter.

Once connected, you're presented with a `sftp>` prompt. From this prompt, you can change directories, upload, and download files. For example, the following commands change directories to the **/var/log/hadoop/hdfs** directory and then download all files in the directory.

    cd /var/log/hadoop/hdfs
    get *

For a list of available commands, enter `help` at the `sftp>` prompt.

> [!NOTE]  
> There are also graphical interfaces that allow you to visualize the file system when connected using SFTP. For example, [MobaXTerm](https://mobaxterm.mobatek.net/) allows you to browse the file system using an interface similar to Windows Explorer.

### Ambari

> [!NOTE]  
> To access log files using Ambari, you must use an SSH tunnel. The web interfaces for the individual services are not exposed publicly on the Internet. For information on using an SSH tunnel, see the [Use SSH Tunneling](hdinsight-linux-ambari-ssh-tunnel.md) document.

From the Ambari Web UI, select the service you wish to view logs for (for example, YARN). Then use **Quick Links** to select which head node to view the logs for.

![Using quick links to view logs](./media/hdinsight-high-availability-linux/quick-links-view-logs.png)

## How to configure the node size

The size of a node can only be selected during cluster creation. You can find a list of the different VM sizes available for HDInsight on the [HDInsight pricing page](https://azure.microsoft.com/pricing/details/hdinsight/).

When creating a cluster, you can specify the size of the nodes. The following information provides guidance on how to specify the size using the [Azure portal](https://portal.azure.com/), [Azure PowerShell module Az](/powershell/azureps-cmdlets-docs), and the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest):

* **Azure portal**: When creating a cluster, you can set the size of the nodes used by the cluster:

    ![Image of cluster creation wizard with node size selection](./media/hdinsight-high-availability-linux/azure-portal-cluster-configuration-pricing-hadoop.png)

* **Azure CLI**: When using the [`az hdinsight create`](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-create) command, you can set the size of the head, worker, and ZooKeeper nodes by using the `--headnode-size`, `--workernode-size`, and `--zookeepernode-size` parameters.

* **Azure PowerShell**: When using the [New-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightcluster) cmdlet, you can set the size of the head, worker, and ZooKeeper nodes by using the `-HeadNodeSize`, `-WorkerNodeSize`, and `-ZookeeperNodeSize` parameters.

## Next steps

To learn more about the items discussed in this article, see:

* [Apache Ambari REST Reference](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md)
* [Install and configure the Azure CLI](https://docs.microsoft.com//cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install and configure Azure PowerShell module Az](/powershell/azure/overview)
* [Manage HDInsight using Apache Ambari](hdinsight-hadoop-manage-ambari.md)
* [Provision Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
