---
title: Use MirrorMaker 2 to replicate Apache Kafka topics - Azure HDInsight 
description: Learn how to use Use MirrorMaker 2 to replicate Apache Kafka topics
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 02/27/2023
---

# Use MirrorMaker 2 to replicate Apache Kafka topics with Kafka on HDInsight

Learn how to use Apache Kafka's mirroring feature to replicate topics to a secondary cluster. You can run mirroring as a continuous process, or intermittently, to migrate data from one cluster to another.

In this article, you use mirroring to replicate topics between two HDInsight clusters. These clusters are in different virtual networks in different datacenters.

> [!WARNING]  
> Don't use mirroring as a means to achieve fault-tolerance. The offset to items within a topic are different between the primary and secondary clusters, so clients can't use the two interchangeably. If you are concerned about fault tolerance, you should set replication for the topics within your cluster. For more information, see [Get started with Apache Kafka on HDInsight](apache-kafka-get-started.md).

## How Apache Kafka mirroring works

Mirroring works by using the [MirrorMaker2](https://cwiki.apache.org/confluence/display/KAFKA/KIP-382%3A+MirrorMaker+2.0) tool, which is part of Apache Kafka. MirrorMaker consumes records from topics on the primary cluster, and then creates a local copy on the secondary cluster. MirrorMaker2 uses one (or more) *consumers* that read from the primary cluster, and a *producer* that writes to the local (secondary) cluster.

The most useful mirroring setup for disaster recovery uses Kafka clusters in different Azure regions. To achieve this result, the virtual networks where the clusters reside peered together.

The following diagram illustrates the mirroring process and how the communication flows between clusters:

:::image type="content" source="./media/apache-kafka-mirror-maker2/kafka-mirroring-vnets2.png" alt-text="Diagram showing the mirroring process." border="false":::

The primary and secondary clusters can be different in the number of nodes and partitions, and offsets within the topics are different also. Mirroring maintains the key value that used for partitioning, so record order preserved on a per-key basis.

### Mirroring across network boundaries

If you need to mirror between Kafka clusters in different networks, there are the following more considerations:

* **Gateways**: The networks must be able to communicate at the TCP/IP level.

* **Server addressing**: You can choose to address your cluster nodes by using their IP addresses or fully qualified domain names.

    * **IP addresses**: If you configure your Kafka clusters to use IP address advertising, you can proceed with the mirroring setup by using the IP addresses of the broker nodes and ZooKeeper nodes.
    
    * **Domain names**: If you don't configure your Kafka clusters for IP address advertising, the clusters must be able to connect to each other by using fully qualified domain names (FQDNs). This requires a domain name system (DNS) server in each network that configured to forward requests to the other networks. When you're creating an Azure virtual network, instead of using the automatic DNS provided with the network, you must specify a custom DNS server and the IP address for the server. After you create the virtual network, you must then create an Azure virtual machine that uses that IP address. Then you install and configure DNS software on it.

    > [!IMPORTANT]  
    > Create and configure the custom DNS server before installing HDInsight into the virtual network. There is no additional configuration required for HDInsight to use the DNS server configured for the virtual network.

For more information on connecting two Azure virtual networks, see [Configure a connection](../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md).

## Mirroring architecture

This architecture features two clusters in different resource groups and virtual networks: a primary and a secondary.

### Creation steps

1. Create two new resource groups:

    |Resource group | Location |
    |---|---|
    | kafka-primary-rg | Central US |
    | kafka-secondary-rg | North Central US |

1. Create a new virtual network **kafka-primary-vnet** in **kafka-primary-rg**. Leave the default settings.
1. Create a new virtual network **kafka-secondary-vnet** in **kafka-secondary-rg**, also with default settings.
   > [!NOTE]
   > Keep the address of both vnet non overlapping otherwise vnet peering won't work.
   > Example - 1. kafka-primary-vnet can have address space 10.0.0.0
   >           2. kafka-secondary-vnet can have address space 10.1.0.0  
1. Create virtual network peerings. This step creates two peerings: one from **kafka-primary-vnet** to **kafka-secondary-vnet**, and one back from **kafka-secondary-vnet** to **kafka-primary-vnet**.
    1. Select the **kafka-primary-vnet** virtual network.
    1. Under **Settings**, select **Peerings**.
    1. Select **Add**.
    1. On the **Add peering** screen, enter the details as shown in the following screenshot.

        :::image type="content" source="./media/apache-kafka-mirroring/hdi-add-vnet-peering.png" alt-text="Screenshot that shows HDInsight Kafka add virtual network peering." border="true":::

1. Create two new Kafka clusters:

   | Cluster name | Resource group | Virtual network | Storage account |
   |---|---|---|---|
   | primary-kafka-cluster | kafka-primary-rg | kafka-primary-vnet | kafkaprimarystorage |
   | secondary-kafka-cluster | kafka-secondary-rg | kafka-secondary-vnet | kafkasecondarystorage |


> [!NOTE]
> From now onwards we will use `primary-kafka-cluster` as `PRIMARYCLUSTER` and `secondary-kafka-cluster` as `SECONDARYCLUSTER`.

## Configure IP Address of PRIMARYCLUSTER Worker Nodes into client machine for DNS Resolution 

1. Use head node of `SECONDARYCLUSTER` to run mirror maker script. Then we need IP address of worker nodes of PRIMARYCLUSTER in `/etc/hosts` file of `SECONDARYCLUSTER`. 

1. Connect to `PRIMARYCLUSTER`
    > ssh sshuser@PRIMARYCLUSTER-ssh.azurehdinsight.net

1. Execute the following command and get the entries of worker nodes IPs and FQDNs  `cat /etc/hosts` 
   
1. Copy those entries and connect to `SECONDARYCLUSTER` and run `ssh sshuser@SECONDARYCLUSTER-ssh.azurehdinsight.net` 

1. Edit the `/etc/hosts` file of secondary cluster and add those entries here. 

1. Save and close the file. 


### Create Multiple Topics in PRIMARYCLUSTER
1. Use this command to create topics and replace variables. 

   ```
   bash /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --zookeeper $KAFKAZKHOSTS --create --topic $TOPICNAME --partitions $NUM_PARTITIONS --replication-factor $REPLICATION_FACTOR 
   ```
### Configure Mirror Maker2 in SECONDARYCLUSTER

1. Now change the configuration in MirrorMaker2 properties file. 

1. Execute following command with admin privilege 

   ```
   sudo su 
   vi /etc/kafka/conf/connect-mirror-maker.properties 
   ```
1. Property file looks like this.
    ```
   # specify any number of cluster aliases
   clusters = source, destination
 
   # connection information for each cluster
   # This is a comma separated host:port pairs for each cluster
   # for example. "A_host1:9092, A_host2:9092, A_host3:9092" and you can see the exact host name on Ambari > Hosts source.bootstrap.servers = wn0-src kafka.bx.internal.cloudapp.net:9092,wn1-src-kafka.bx.internal.cloudapp.net:9092,wn2-src-kafka.bx.internal.cloudapp.net:9092 destination.bootstrap.servers = wn0-dest-kafka.bx.internal.cloudapp.net:9092,wn1-dest-kafka.bx.internal.cloudapp.net:9092,wn2-dest-kafka.bx.internal.cloudapp.net:9092
   # enable and configure individual replication flows
   source->destination.enabled = true
 
   # regex which defines which topics gets replicated. For eg "foo-.*"
   source->destination.topics = .*
   groups=.*
   topics.blacklist="*.internal,__.*"
 
   # Setting replication factor of newly created remote topics
   Replication.factor=3
 
   checkpoints.topic.replication.factor=1
   heartbeats.topic.replication.factor=1
   offset-syncs.topic.replication.factor=1
 
   offset.storage.replication.factor=1
   status.storage.replication.factor=1
   config.storage.replication.factor=1
   ```
1. Here source is your `PRIMARYCLUSTER` and destination is your `SECONDARYCLUSTR`.  Replace it everywhere with correct name and replace `source.bootstrap.servers` and `destination.bootstrap.servers` with correct FQDN or IP of their respective worker nodes. 
1. You can control the topics that you want to replicate along with configs with regex. `replication.factor=3` makes the replication factor = 3 for all the topic which Mirror maker script creates by itself. 
1. You can create topics in secondary cluster manually with same name by yourself. Otherwise, you need to [Enable Auto Topic Creation](./apache-kafka-auto-create-topics.md) functionality and then mirror maker script replicates topics with the name as `PRIMARYCLUSTER.TOPICNAME` and same configs in secondary cluster. Save the file and we're good with configs.
1. If you want to mirror topics on both sides like `Primary to Secondary` and `Secondary to Primary` (active-active) then you can add extra configs
   ```
   destination->source.enabled=true
   destination->source.topics = .*
   ```
1. Final Configuration file after changes should look like this
     ```
   # specify any number of cluster aliases
   clusters = primary-kafka-cluster, secondary-kafka-cluster
 
   # connection information for each cluster
   # This is a comma separated host:port pairs for each cluster
   # for example. "A_host1:9092, A_host2:9092, A_host3:9092" and you can see the exact host name on Ambari -> Hosts 
   primary-kafka-cluster.bootstrap.servers = wn0-src-kafka.bx.internal.cloudapp.net:9092,wn1-src-kafka.bx.internal.cloudapp.net:9092,wn2-src-kafka.bx.internal.cloudapp.net:9092 
   secondary-kafka-cluster.bootstrap.servers = wn0-dest-kafka.bx.internal.cloudapp.net:9092,wn1-dest-kafka.bx.internal.cloudapp.net:9092,wn2-dest-kafka.bx.internal.cloudapp.net:9092
   
   # enable and configure individual replication flows
   primary-kafka-cluster->secondary-kafka-cluster.enabled = true
   
   # enable this for both side replication
   secondary-kafka-cluster->primary-kafka-cluster.enabled = true

   # regex which defines which topics gets replicated. For eg "foo-.*"
   primary-kafka-cluster->secondary-kafka-cluster.topics = .*
   secondary-kafka-cluster->primary-kafka-cluster.topics = .*
   
   groups=.*
   topics.blacklist="*.internal,__.*"
 
   # Setting replication factor of newly created remote topics
   Replication.factor=3
 
   checkpoints.topic.replication.factor=1
   heartbeats.topic.replication.factor=1
   offset-syncs.topic.replication.factor=1
 
   offset.storage.replication.factor=1
   status.storage.replication.factor=1
   config.storage.replication.factor=1
   ```

1. Start Mirror Maker2 in `SECONDARYCLUSTER` and it should run fine

   ```
   /usr/hdp/current/kafka-broker 
   ./bin/connect-mirror-maker.sh ./config/connect-mirror-maker.properties 
   ```

1. Now start producer in PRIMARY CLUSTER  

   ``` 
   export clusterName='primary-kafka-cluster' 
   export TOPICNAME='TestMirrorMakerTopic' 
   export KAFKABROKERS='wn0-primar:9092' 
   export KAFKAZKHOSTS='zk0-primar:2181' 
   
   //Start Producer
   bash /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic $TOPICNAME 
   ```
1. Now start consumer in `SECONDARYCLUSTER` 

   ```
   export clusterName='secondary-kafka-cluster' 
   export TOPICNAME='TestMirrorMakerTopic'  
   export KAFKABROKERS='wn0-second:9092' 
   export KAFKAZKHOSTS='zk0-second:2181' 
 
   # List all the topics whether they are replicated or not 
   bash /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --zookeeper $KAFKAZKHOSTS --list 
   
   # Start Consumer
   bash /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic $TOPICNAME --from-beginning 
   ```

## Delete cluster

[!INCLUDE [delete-cluster-warning](../includes/hdinsight-delete-cluster-warning.md)]

The steps in this article created clusters in different Azure resource groups. To delete all the resources created, you can delete the two resource groups created: **kafka-primary-rg** and **kafka-secondary-rg**. Deleting the resource groups removes all of the resources created by following this article, including clusters, virtual networks, and storage accounts.

## Next steps

In this article, you learned how to use [MirrorMaker2](https://cwiki.apache.org/confluence/display/KAFKA/KIP-382%3A+MirrorMaker+2.0) to create a replica of an [Apache Kafka](https://kafka.apache.org/) cluster. Use the following links to discover other ways to work with Kafka:

* [Apache Kafka MirrorMaker2 documentation](https://cwiki.apache.org/confluence/display/KAFKA/KIP-382%3A+MirrorMaker+2.0) at cwiki.apache.org.
* [Get started with Apache Kafka on HDInsight](apache-kafka-get-started.md)
* [Use Apache Spark with Apache Kafka on HDInsight](../hdinsight-apache-spark-with-kafka.md)
* [Connect to Apache Kafka through an Azure virtual network](apache-kafka-connect-vpn-gateway.md)
