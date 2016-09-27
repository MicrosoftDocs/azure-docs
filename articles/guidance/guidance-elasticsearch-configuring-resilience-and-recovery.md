<properties
   pageTitle="Configuring resilience and recovery on Elasticsearch on Azure"
   description="Considerations related to resiliency and recovery for Elasticsearch."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="bennage"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/21/2016"
   ms.author="masashin"/>
   
# Configuring resilience and recovery on Elasticsearch on Azure

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article is [part of a series](guidance-elasticsearch.md). 

A key feature of Elasticsearch is the support that it provides for resiliency in the event of node failures and/or network partition events. Replication is the most obvious way in which you can improve the resiliency of any cluster, enabling Elasticsearch to ensure that more than one copy of any data item is available on different nodes in case one node should become inaccessible. If a node becomes temporarily unavailable, other nodes containing replicas of data from the missing node can serve the missing data until the problem is resolved. In the event of a longer-term issue, the missing node can be replaced with a new one, and Elasticsearch can restore the data to the new node from the replicas.

Herein we summarize the resiliency and recovery options available with Elasticsearch when hosted in Azure, and describe some important aspects of an Elasticsearch cluster that you should consider to minimize the chances of data loss and extended data recovery times.

This article also illustrates some sample tests that were performed to show the effects of different types of failures on an Elasticsearch cluster, and how the system responds as it recovers.

An Elasticsearch cluster uses replicas to maintain availability and improve read performance. Replicas should be stored on different VMs from the primary shards that they replicate. The intention is that if the VM hosting a data node fails or becomes unavailable, the system can continue functioning using the VMs holding the replicas.

## Using Dedicated Master Nodes

One node in an Elasticsearch cluster is elected as the master node. The purpose of this node is to perform cluster management operations such as:

- Detecting failed nodes and switching over to replicas,

- Relocating shards to balance node workload, and

- Recovering shards when a node is brought back online.

You should consider using dedicated master nodes in critical clusters, and ensure that there are 3 dedicated nodes whose only role is to be master. This configuration reduces the amount of resource intensive work that these nodes have to perform (they do not store data or handle queries) and helps to improve cluster stability. Only one of these nodes will be elected, but the others will contain a copy of the system state and can take over should the elected master fail.

## Controlling High Availability with Azure – Update Domains and Fault Domains 

Different VMs can share the same physical hardware. In an Azure datacenter, a single rack can host a number of VMs, and all of these VMs share a common power source and network switch. A single rack-level failure can therefore impact a number of VMs. Azure uses the concept of Fault Domains (FDs) to try and spread this risk. An FD roughly corresponds to a group of VMs that share the same rack. To ensure that a rack-level failure does not crash a node and the nodes holding all of its replicas simultaneously, you should ensure that the VMs are distributed across FDs.

Similarly, VMs can be taken down by the [Azure Fabric Controller](https://azure.microsoft.com/documentation/videos/fabric-controller-internals-building-and-updating-high-availability-apps/) to perform planned maintenance and operating system upgrades. Azure allocates VMs to Update Domains (UDs). When a planned maintenance event occurs, only VMs in a single UD are effected at any one time; VMs in other UDs are left running until the VMs in the UD being updated are brought back on-line. Therefore, you also need to ensure that VMs hosting nodes and their replicas belong to different UDs wherever possible.

> [AZURE.NOTE] For more information about FDs and UDs, see [Manage the Availability of Virtual Machines][].

You cannot explicitly allocate a VM to a specific UD and FD; this allocation is controlled by Azure when VMs are created; see the document [Manage the availability of virtual machines][] for more information. However, you can specify that VMs should be created as part of an availability set (AS). VMs in the same AS will be spread across UDs and FDs. If you create VMs manually, Azure will associate each AS with two FDs and five UDs, and machines will be allocated to these FDs and UDs, cycling round as further VMs are provisioned, as follows:

- The first VM provisioned in the AS will be placed in the first FD (FD 0) and the first UD (UD 0).
- The second VM provisioned in the AS will be placed in FD 1 and UD 1.
- The third VM provisioned in the AS will be placed in FD 0 and UD 2.
- The fourth VM provisioned in the AS will be placed in FD 1 and UD 3.
- The fifth VM provisioned in the AS will be placed in FD 0 and UD 4.
- The sixth VM provisioned in the AS will be placed in FD 1 and UD 0.
- The seventh VM provisioned in the AS will be placed in FD 0 and UD 1.

> [AZURE.IMPORTANT] If you create VMs using the Azure Resource Manager (ARM), each availability set can be allocated up to 3 FDs and 20 UDs. This is a compelling reason for using the ARM.

In general, place all VMs that serve the same purpose in the same availability set, but create different availability sets for VMs that perform different functions. With Elasticsearch this means that you should consider creating at least separate availability sets for:

- VMs hosting data nodes.
- VMs hosting client nodes (if you are using them).
- VMs hosting master nodes.

Additionally, you should ensure that each node in a cluster is aware of the update domain and fault domain to which it belongs. This information can help to ensure that Elasticsearch does not create shards and their replicas in the same fault and update domains, minimizing the scope for a shard and its replicas from being taken down at the same time. You can configure an Elasticsearch node to mirror the hardware distribution of the cluster by configuring [Shard Allocation Awareness](https://www.elastic.co/guide/en/elasticsearch/reference/current/allocation-awareness.html#allocation-awareness). For example, you could define a pair of custom node attributes called *faultDomain* and *updateDomain* in the elasticsearch.yml file, as follows:

```yaml
node.faultDomain: \${FAULTDOMAIN}
node.updateDomain: \${UPDATEDOMAIN}
```

In this case, the attributes are set using the values held in the *\${FAULTDOMAIN}* and *\${UPDATEDOMAIN}* environment variables when Elasticsearch is started. You also need to add the following entries to the Elasticsearch.yml file to indicate that *faultDomain* and *updateDomain* are allocation awareness attributes, and specify the sets of acceptable values for these attributes:

```yaml
cluster.routing.allocation.awareness.force.updateDomain.values: 0,1,2,3,4
cluster.routing.allocation.awareness.force.faultDomain.values: 0,1
cluster.routing.allocation.awareness.attributes: updateDomain, faultDomain
```

You can use shard allocation awareness in conjunction with [Shard Allocation Filtering](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/shard-allocation-filtering.html#shard-allocation-filtering) to specify explicitly which nodes can host shards for any given index.

If you need to scale beyond the number of FDs and UDs in an AS, you can create VMs in additional ASs. However, you need to understand that nodes in different ASs can be taken down for maintenance simultaneously. Try to ensure that each shard and at least one of its replicas are contained within the same AS.

> [AZURE.NOTE] There is currently a limit of 100 VMs per AS. For more information, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).

### Backup and Restore

Using replicas does not provide complete protection from catastrophic failure (such as accidentally deleting the entire cluster). You should ensure that you back up the data in a cluster regularly, and that you have a tried and tested strategy for restoring the system from these backups.

Use the Elasticsearch [Snapshot and Restore APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html) to backup and restore indexes. Snapshots can be saved to a shared filesystem. Alternatively, plugins are available that can write snapshots to HDFS (the [HDFS Plugin](https://github.com/elasticsearch/elasticsearch-hadoop/tree/master/repository-hdfs)) or to Azure storage (the [Azure Cloud Plugin](https://github.com/elasticsearch/elasticsearch-cloud-azure#azure-repository)).

You should consider the following points when selecting the snapshot storage mechanism:

- You can use [Azure File Storage](https://azure.microsoft.com/services/storage/files/) to implement a shared filesystem that is accessible from all nodes.

- Only use the HDFS plugin if you are running Elasticsearch in conjunction with Hadoop.

- The HDFS plugin requires you to disable the Java Security Manager running inside the Elasticsearch instance of the JVM.

- The HDFS plugin supports any HDFS-compatible file system provided that the correct Hadoop configuration is used with Elasticsearch.

  
## Handling Intermittent Connectivity Between Nodes

Intermittent network glitches, VM reboots after routine maintenance at the datacenter, and other similar events can cause nodes to become temporarily inaccessible. In these situations, where the event is likely to be short-lived, the overhead of rebalancing the shards occurs twice in quick succession (once when the failure is detected and again when the node become visible to the master) can become a significant overhead that impacts performance. You can prevent temporary node inaccessibility from causing the master to rebalance the cluster by setting the *delayed\_timeout* property of an index, or for all indexes. The example below sets the delay to 5 minutes:

```http
PUT /_all/settings
{
	"settings": {
    "index.unassigned.node_left.delayed_timeout": "5m"
	}
}
```

For more information, see [Delaying allocation when a node leaves](https://www.elastic.co/guide/en/elasticsearch/reference/current/delayed-allocation.html).

In a network that is prone to interruptions, you can also modify the parameters that configure a master to detect when another node is no longer accessible. These parameters are part of the [Zen Discovery](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-discovery-zen.html#modules-discovery-zen) module provided with Elasticsearch, and you can set them in the Elasticsearch.yml file. For example, the *discovery.zen.fd.ping.retries* parameter specifies how many times a master node will attempt to ping another node in the cluster before deciding that it has failed. This parameter defaults to 3, but you can modify it as follows:

```yaml
discovery.zen.fd.ping_retries: 6
```

## Controlling Recovery

When connectivity to a node is restored after a failure, any shards on that node will need to be recovered to bring them up to date. By default, Elasticsearch recovers shards in the following order:

- By reverse index creation date. Newer indexes are recovered before older indexes.

- By reverse index name. Indexes that have names that are alphanumerically greater than others will be restored first.

If some indexes are more critical than others but do not match these criteria, you can override the precedence of indexes by setting the *index.priority* property. Indexes with a higher value for this property will be recovered before indexes that have a lower value:

```http
PUT low_priority_index
{
	"settings": {
		"index.priority": 1
	}
}

PUT high_priority_index
{
	"settings": {
		"index.priority": 10
	}
}
```

For more information, see [Index Recovery Prioritization](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/recovery-prioritization.html#recovery-prioritization).

You can monitor the recovery process for one or more indexes using the *\_recovery* API:

```http
GET /high_priority_index/_recovery?pretty=true
```

For more information, see [Indices Recovery](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-recovery.html#indices-recovery).

> [AZURE.NOTE] A cluster with shards that require recovery will have a status of *yellow* to indicate that not all shards are currently available. When all the shards are available, the cluster status should revert to *green*. A cluster with a status of *red* indicates that one or more shards are physically missing; it may be necessary to restore data from a backup.

## Preventing Split Brain 

A split brain can occur if the connections between nodes fail. If a master node becomes unreachable to part of the cluster, an election will take place in the network segment that remains contactable and another node will become the master. In an ill-configured cluster, it is possible for each part of the cluster to have different masters resulting in data inconsistencies or corruption. This phenomenon is known as a *split brain*.

You can reduce the chances of a split brain by configuring the *minimum\_master\_nodes* property of the discovery module, in the elasticsearch.yml file. This property specifies how many nodes must be available to enable the election of a master. The following example sets the value of this property to 2:

```yaml
discovery.zen.minimum_master_nodes: 2
```

This value should be set to the lowest majority of the number of nodes that are able to fulfil the master role. For example, if your cluster has 3 master nodes, *minimum\_master\_nodes* should be set to 2; if you have 5 master nodes, *minimum\_master\_nodes* should be set to 3. Ideally, you should have an odd number of master nodes.

**Note:** It is possible for a split brain to occur if multiple master nodes in the same cluster are started simultaneously. While this occurrence is rare, you can prevent it by starting nodes serially with a short delay (5 seconds) between each one.

## Handling Rolling Updates

If you are performing a software upgrade to nodes yourself (such as migrating to a newer release or performing a patch), you may need to work on individual nodes that requires taking them offline while keeping the remainder of the cluster available. In this situation, consider implementing the following process:

Ensure that shard reallocation is delayed sufficiently to prevent the elected master from rebalancing shards from a missing node across the remainder of the cluster. By default, shard reallocation is delayed for 1 minute, but you can increase the duration if a node is likely to be unavailable for a longer period. The following example increases the delay to 5 minutes:

```http
PUT /_all/_settings
{
	"settings": {
		"index.unassigned.node_left.delayed_timeout": "5m"
	}
}
```

> [AZURE.IMPORTANT] You can also disable shard reallocation completely by setting the *cluster.routing.allocation.enable* of the cluster to *none*. However, you should avoid using this approach if new indexes are likely to be created while the node is offline as this can cause index allocation to fail resulting in a cluster with red status.

Stop Elasticsearch on the node to be maintained. If Elasticsearch is running as a service, you may be able to halt the process in a controlled manner by using an operating system command. The following example shows how to halt the Elasticsearch service on a single node running on Ubuntu:

```bash
service elasticsearch stop
```

Alternatively, you can use the Shutdown API directly on the node:

```http
POST /_cluster/nodes/_local/_shutdown
```

Perform the necessary maintenance on the node, then restart the node and wait for it to join the cluster.

Re-enable shard allocation:

```http
PUT /_cluster/settings
{
	"transient": {
		"cluster.routing.allocation.enable": "all"
	}
}
```

> [AZURE.NOTE] If you need to maintain more than one node, repeat steps 2, 3, and 4 on each node before re-enabling shard allocation.

If you can, stop indexing new data during this process. This will help to minimize recovery time when nodes are brought back online and rejoin the cluster.

Beware of automated updates to items such as the JVM (ideally, disable automatic updates for these items), especially when running Elasticsearch under Windows. The Java Update agent can download the most recent version of Java automatically, but may require Elasticsearch to be restarted for the update to take effect. This can result in uncoordinated temporary loss of nodes, depending on how the Java Update agent is configured. This can also result in different instances of Elasticsearch in the same cluster running different versions of the JVM which may cause compatibility issues.

## Testing and Analyzing Elasticsearch Resilience and Recovery

This section describes a series of tests that were performed to evaluate the resilience and recovery of an Elasticsearch cluster comprising three data nodes and three master nodes.

Four scenarios were tested:

1.  Node failure and restart with no data loss. A data node is stopped and restarted after 5 minutes. Elasticsearch was configured not to reallocate missing shards in this interval, so no additional I/O is incurred in moving shards around. When the node restarts, the recovery process brings the shards on that node back up to date.

2.  Node failure with catastrophic data loss. A data node is stopped and the data that it holds is erased to simulate catastrophic disk failure. The node is then restarted (after 5 minutes), effectively acting as a replacement for the original node. The recovery process requires rebuilding the missing data for this node, and may involve relocating shards held on other nodes.

3.  Node failure and restart with no data loss, but with shard reallocation. A data node is stopped and the shards that it holds are reallocated to other nodes. The node is then restarted and more reallocation occurs to rebalance the cluster.

4.  Rolling updates. Each node in the cluster is stopped and restarted after a short interval to simulate machines being rebooted after a software update. Only one node is stopped at any one time. Shards are not reallocated while a node is down.

Each scenario was subject to the same workload comprising a mixture of data ingestion tasks, aggregations, and filter queries while nodes were taken offline and recovered. The bulk insert operations in the workload each stored 1000 documents and were performed against one index while the aggregations and filter queries used a separate index containing several millions documents; this was to enable the performance of queries to be assessed separately from the bulk inserts. Each index comprised five shards and one replica.

The following sections summarize the results of these tests, noting any degradation in performance while a node is offline or being recovered, and any errors that were reported. The results are presented graphically, highlighting the points at which one or more nodes are missing and estimating the time taken for the system to fully recover and achieve a similar level of performance that was present prior to the nodes being taken offline.

> [AZURE.NOTE] The test harnesses used to perform these tests are available online. You can adapt and use these harnesses to verify the resilience and recoverability of your own cluster configurations. For more information, see [Running the Automated Elasticsearch Resiliency Tests][].

## Node Failure and Restart with No Data Loss: Results

<!-- TODO; reformat this pdf for display inline -->

The results of this test are shown in the file [ElasticsearchRecoveryScenario1.pdf](https://github.com/mspnp/azure-guidance/blob/master/figures/Elasticsearch/ElasticSearchRecoveryScenario1.pdf). The graphs show performance profile of the workload and physical resources for each node in the cluster. The initial part of the graphs show the system running normally for approximately 20 minutes, at which point node 0 is shut down for 5 minutes before being restarted. The statistics for a further 20 minutes are illustrated; the system takes approximately 10 minutes to recover and stabilize. This is illustrated by the transaction rates and response times for the different workloads.

Note the following points:

- During the test, no errors were reported. No data was lost, and all operations completed successfully.

- The transaction rates for all three types of operation (bulk insert, aggregate query, and filter query) dropped and the average response times increased while node 0 was offline.

- During the recovery period, the transaction rates and response times for the aggregate query and filter query operations were gradually restored. The performance for bulk insert recovered for a short while before diminishing. However, this is likely due to the volume of data causing the index used by the bulk insert to grow, and the transaction rates for this operation can be seen to slow down even before node 0 is taken offline.

- The CPU utilization graph for node 0 shows reduced activity during the recovery phase, this is due to the increased disk and network activity caused by the recovery mechanism; the node has to catch up with any data it has missed while it is offline and update the shards that it contains.

- The shards for the indexes are not distributed exactly equally across all nodes; there are two indexes comprising 5 shards and 1 replica each, making a total of 20 shards. Two nodes will therefore contain 6 shards while the other two hold 7 each. This is evident in the CPU utilization graphs during the initial 20-minute period; node 0 is less busy than the other two. After recovery is complete, some switching seems to occur as node 2 appears to become the more lightly loaded node.

    
## Node Failure with Catastrophic Data Loss: Results

<!-- TODO; reformat this pdf for display inline -->

The results of this test are depicted in the file [ElasticsearchRecoveryScenario2.pdf](https://github.com/mspnp/azure-guidance/blob/master/figures/Elasticsearch/ElasticSearchRecoveryScenario2.pdf). As with the first test, the initial part of the graphs shows the system running normally for approximately 20 minutes, at which point node 0 is shut down for 5 minutes. During this interval, the Elasticsearch data on this node is removed, simulating catastrophic data loss, before being restarted. Full recovery appears to take 12-15 minutes before the levels of performance seen before the test are restored.

Note the following points:

- During the test, no errors were reported. No data was lost, and all operations completed successfully.

- The transaction rates for all three types of operation (bulk insert, aggregate query, and filter query) dropped and the average response times increased while node 0 was offline. At this point, the performance profile of the test is similar to the first scenario; this is not surprising as, to this point, the scenarios are the same.

- During the recovery period, the transaction rates and response times were restored, although during this time there was a lot more volatility in the figures. This is most probably due to the additional work that the nodes in the cluster are performing, providing the data to restore the missing shards. This additional work is evident in the CPU utilization, disk activity, and network activity graphs.

- The CPU utilization graph for nodes 0 and 1 shows reduced activity during the recovery phase, this is due to the increased disk and network activity caused by the recovery process. In the first scenario, only the node being recovered exhibited this behavior, but in this scenario it seems likely that most of the missing data for node 0 is being restored from node 1.

- The I/O activity for node 0 is actually reduced compared to the first scenario. This could be due to the I/O efficiencies of simply copying the data for an entire shard rather than the series of smaller I/O requests required to bring an existing shard up to date.

- The network activity for all three nodes indicate bursts of activity as data is transmitted and received between nodes. In scenario 1, only node 0 exhibited as much network activity, but this activity seemed to be sustained for a longer period. Again, this difference could be due to the efficiencies of transmitting the entire data for a shard as a single request rather than the series of smaller requests received when recovering a shard.

## Node Failure and Restart with Shard Reallocation: Results

<!-- TODO; reformat this pdf for display inline -->

The file [ElasticsearchRecoveryScenario3.pdf](https://github.com/mspnp/azure-guidance/blob/master/figures/Elasticsearch/ElasticSearchRecoveryScenario3.pdf) illustrates the results of this test. As with the first test, the initial part of the graphs show the system running normally for approximately 20 minutes, at which point node 0 is shut down for 5 minutes. At this point, the Elasticsearch cluster attempts to recreate the missing shards and rebalance the shards across the remaining nodes. After 5 minutes node 0 is brought back online, and once again the cluster has to rebalance the shards. Performance is restored after 12-15 minutes.

Note the following points:

- During the test, no errors were reported. No data was lost, and all operations completed successfully.

- The transaction rates for all three types of operation (bulk insert, aggregate query, and filter query) dropped and the average response times increased significantly while node 0 was offline compared to the previous two tests. This is due to the increased cluster activity recreating the missing shards and rebalancing the cluster as evidenced by the raised figures for disk and network activity for nodes 1 and 2 in this period.

- During the period after node 0 is brought back online, the transaction rates and response times remain volatile.

- The CPU utilization and disk activity graphs for node 0 shows very reduced initial action during the recovery phase. This is because at this point, node 0 is not serving any data. After a period of approximately 5 minutes, the node bursts into action shown by the sudden increase in network, disk, and CPU activity. This is most likely caused by the cluster redistributing shards across nodes. Node 0 then shows normal activity.
  
## Rolling Updates: Results

<!-- TODO; reformat this pdf for display inline -->

The results of this test, in the file [ElasticsearchRecoveryScenario4.pdf](https://github.com/mspnp/azure-guidance/blob/master/figures/Elasticsearch/ElasticSearchRecoveryScenario4.pdf), show how each node is taken offline and then brought back up again in succession. Each node is shut down for 5 minutes before being restarted at which point the next node in sequence is stopped.

Note the following points:

- While each node is cycled, the performance in terms of throughput and response times remains reasonably even.

- Disk activity increases for each node increases for a short time as it is brought back online. This is most probably due to the recovery process rolling forward any changes that have occurred while the node was down.

- When a node is taken offline, spikes in network activity occur in the remaining nodes. Spikes also occur when a node is restarted.

- After the final node is recycled, the system enters a period of significant volatility. This is most likely caused by the recovery process having to synchronize changes across every node and ensure that all replicas and their corresponding shards are consistent. At one point, this effort causes successive bulk insert operations to timeout and fail. The errors reported each case were:

```
Failure -- BulkDataInsertTest17(org.apache.jmeter.protocol.java.sampler.JUnitSampler$AnnotatedTestCase): java.lang.AssertionError: failure in bulk execution:
[1]: index [systwo], type [logs], id [AVEg0JwjRKxX_sVoNrte], message [UnavailableShardsException[[systwo][2] Primary shard is not active or isn't assigned to a known node. Timeout: [1m], request: org.elasticsearch.action.bulk.BulkShardRequest@787cc3cd]]

```

Subsequent experimentation showed that introducing a delay of a few minutes between cycling each node eliminated this error, so it was most likely caused by contention between the recovery process attempting to restore several nodes simultaneously and the bulk insert operations trying to store thousands of new documents.


## Summary

The tests performed indicated that:

- Elasticsearch was highly resilient to the most common modes of failure likely to occur in a cluster.

- Elasticsearch can recover quickly if a well-designed cluster is subject to catastrophic data loss on a node. This can happen if you configure Elasticsearch to save data to ephemeral storage and the node is subsequently re-provisioned after a restart. These results show that even in this case, the risks of using ephemeral storage are most likely outweighed by the performance benefits that this class of storage provides.

- In the first three scenarios, no errors occurred in concurrent bulk insert, aggregation, and filter query workloads while a node was taken offline and recovered.

- Only scenario 4 indicated potential data loss, and this loss only affected new data being added. It is good practice in applications performing data ingestion to mitigate this likelihood by retrying insert operations that have failed as the type of error reported is highly likely to be transient.

- The results of test 4 also show that if you are performing planned maintenance of the nodes in a cluster, performance will benefit if you allow several minutes between cycling one node and the next. In an unplanned situation (such as the datacenter recycling nodes after performing an operating system update), you have less control over how and when nodes are taken down and restarted. The contention that arises when Elasticsearch attempts to recover the state of the cluster after sequential node outages can result in timeouts and errors. 

[Manage the Availability of Virtual Machines]: ../articles/virtual-machines/virtual-machines-manage-availability.md
[Running the Automated Elasticsearch Resiliency Tests]: guidance-elasticsearch-running-automated-resilience-tests.md
