---
title: Apache Kafka MirrorMaker 2.0 Guide - Azure HDInsight
description: How to to use Kafka MirrorMaker 2.0 in data migration/replication and the use-cases.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 05/20/2022
---

# How to use Kafka MirrorMaker 2.0 in data migration, replication and the use-cases.

MirrorMaker 2 (MM2) is designed to make it easier to mirror or replicate topics from one Kafka cluster to another. It uses the Kafka Connect framework to simplify configuration and scaling. It dynamically detects changes to topics and ensures source and target topic properties are synchronized, including offsets and partitions.

In this article, you'll learn how to use Kafka MirrorMaker 2.0 in data migration/replication and the use-cases.

## Pre-requisites

* Environment with at least two HDI Kafka clusters.
* Kafka version higher than 2.4 (HDI 4.0) 
* The source cluster should have data points and topics to test various features of the MirrorMaker 2.0 replication process

## Use case

Simulation of MirrorMaker 2.0 to replicate data points/offsets between two Kafka clusters in HDInsight. The same can be leveraged for scenarios like required data replication between two or more Kafka Clusters like Disaster Recovery, Cloud Adaption, Geo-replication, Data Isolation, and Data Aggregation.

## Offset replication with MirrorMaker 2.0

### MM2 Internals

The Mirrormaker2 tool is composed of different connectors. These connectors are standard Kafka Connect connectors, which can be used directly with Kafka Connect in standalone or distributed mode.


The summary of the broker setup process is as follows:

1. MirrorSourceConnector :

    1. Replicates remote topics, topic ACLs & configs of a single source cluster.
    1. Emits offset-syncs to an internal topic.

1. MirrorSinkConnector:

    1. Consumes from the primary cluster and replicate topics to a single target cluster.

1. MirrorCheckpointConnector:

    1. Consumes offset-syncsr.
    1.Emits checkpoints to enable failover points.
   
 1. MirrorHeartBeatConnector:

    1. Emits heartbeats to remote clusters, enabling monitoring of replication process.
      
### Deployment

1. Connect-mirror-maker.sh script bundled with the Kafka library implements a distributed MM2 cluster which manages the Connect workers internally based on a config file. Internally Mirrormaker driver creates and handles pairs of each connector – MirrorSourceConnector, MirrorSinkConnector, MirrorCheckpoint connector and MirrorHeartbeatConnector.
1. Start the Mirormaker2.
    
```
./bin/connect-mirror-maker.sh ./config/mirror-maker.properties    
```

> [!NOTE]
> For Kerberos enabled clusters, the JAAS configuration must be exported to the KAFKA_OPTS or must be specified in the MM2 config file.

```
export KAFKA_OPTS="-Djava.security.auth.login.config=<path-to-jaas.conf>"    
```
### Sample Mirrormaker 2.0 Configuration file
       
```
    # specify any number of cluster aliases
    clusters = src, dest

    # connection information for each cluster
    # This is a comma separated host:port pairs for each cluster
    # for e.g. "A_host1:9092, A_host2:9092, A_host3:9092"
    source.bootstrap.servers = wn0-src-kafka.azurehdinsight.net:9092,wn1-src-kafka.azurehdinsight.net:9092,wn2-src-kafka.azurehdinsight.net:9092
    destination.bootstrap.servers = wn0-dest-kafka.azurehdinsight.net:9092,wn1-dest-kafka.azurehdinsight.net:9092,wn2-dest-kafka.azurehdinsight.net:9092

    # enable and configure individual replication flows
    source->destination.enabled = true

    # regex which defines which topics gets replicated. For eg "foo-.*"
    source->destination.topics = toa.evehicles-latest-dev
    groups=.*
    topics.blacklist="*.internal,__.*"

    # Setting replication factor of newly created remote topics
    replication.factor=3

    checkpoints.topic.replication.factor=1
    heartbeats.topic.replication.factor=1
    offset-syncs.topic.replication.factor=1

    offset.storage.replication.factor=1
    status.storage.replication.factor=1
    config.storage.replication.factor=1    
```
    
### SSL configuration

If the setup requires SSL configuration 
```
destination.security.protocol=SASL_SSL
destination.ssl.truststore.password=<password>
destination.ssl.truststore.location=/path/to/kafka.server.truststore.jks
#keystore location in case client.auth is set to required
destination.ssl.keystore.password=<password> 
destination.ssl.keystore.location=/path/to/kafka.server.keystore.jks
destination.sasl.mechanism=GSSAPI
```
### Global configurations

| Property    |   Default value                                                      | Description |
|---------------------|--------------------------------------------------------------------|----|
|name|required|name of the connector, e.g. "us-west->us-east"|
|topics|empty string|regex of topics to replicate, e.g. "topic1|topic2|topic3". Comma-separated lists are also supported|
|topics.blacklist|".*\.internal, .*\.replica, __consumer_offsets" or similar|topics to exclude from replication|
|groups|empty string|regex of groups to replicate, e.g. ".*"|  
|groups.blacklist|empty string|groups to exclude from replication|
|source.cluster.alias|required|name of the cluster being replicated|
|target.cluster.alias|required|name of the downstream Kafka cluster|
|source.cluster.bootstrap.servers|required|upstream cluster to replicate|
|target.cluster.bootstrap.servers|required|downstream cluster|
|sync.topic.configs.enabled|true|whether or not to monitor source cluster for configuration changes|
|sync.topic.acls.enabled|true|whether to monitor source cluster ACLs for changes|
|emit.heartbeats.enabled|true|connector should periodically emit heartbeats|
|emit.heartbeats.interval.seconds|true|frequency of heartbeats|
|emit.checkpoints.enabled|true|connector should periodically emit consumer offset information|
|emit.checkpoints.interval.seconds|5 (seconds)|frequency of checkpoints|
|refresh.topics.enabled|true|connector should periodically check for new consumer groups|
|refresh.topics.interval.seconds|5 (seconds)|frequency to check source cluster for new consumer groups|
|refresh.groups.enabled|true|connector should periodically check for new consumer groups|
|refresh.groups.interval.seconds|5 (seconds)|frequency to check source cluster for new consumer groups|
|readahead.queue.capacity|500 (records)|number of records to let consumer get ahead of producer|
|replication.policy.class|org.apache.kafka.connect.mirror.DefaultReplicationPolicy|use LegacyReplicationPolicy to mimic legacy MirrorMaker|
|heartbeats.topic.retention.ms|1 day|used when creating heartbeat topics for the first time|
|checkpoints.topic.retention.ms|1 day|used when creating checkpoint topics for the first time|
|offset.syncs.topic.retention.ms|max long|used when creating offset sync topic for the first time|
|replication.factor|2|used when creating the remote topics|

### Frequently asked questions

* Why do we see a difference in the last offset on source and destination cluster post replication of a topic?

  It is possible that the source topic’s data points might have been purged due to which the actual record count would be less than the last offset value. This results in the difference between last offset on source and destination cluster post replication, as the replication will always start from offset-0 of the destination cluster.

* How will the consumers behave on migration, provided that the destination cluster may have a different offset mapping to data points?

    Mirrormaker2’s MirrorCheckpointConnector automatically stores consumer group offset checkpoints for consumer groups on the source cluster. Each checkpoint  contains a mapping of the last committed offset for each group in the source cluster to the equivalent offset in destination cluster. So on migration the consumers that start consuming from same topic on the destination cluster will be able to resume receiving messages from the last offset they committed on the source cluster. 

* How can we retain the exact topic name in destination cluster, as the source alias is prefixed with all the topics replicated?

  This is the default behaviour in Mirrormaker2.0 to avoid data overriding in complex mirroring topologies. Customization of this needs to be done carefully in terms of replication flow design and topic management to avoid data loss. This can be done by using a custom replication policy class against “replication.policy.class”.

* Why do we see new internal topics created in my source and destination Kafka?

  Mirrormaker2 internal topics are created by the Connectors to keep track of the replication process, monitoring, offset mapping and checkpointing.

* Why does the mirrormaker creates only 2 replicas of the topic in the destination cluster while the source has more?

  Mirrormaker2 doesn’t replicate the replication factor of topics to target clusters. This can be controlled from MM2 config, by specifying the required number of “replication.factor”. The default value for the same is 2.

* How to use custom replication policy in Mirrormaker2?

  Custom Replication Policy can be created by implementing the interface below.

```
    /** Defines which topics are "remote topics", e.g. "us-west.topic1". */
    public interface ReplicationPolicy {
 
    /** How to rename remote topics; generally should be like us-west.topic1. */
    String formatRemoteTopic(String sourceClusterAlias, String topic);
 
    /** Source cluster alias of given remote topic, e.g. "us-west" for "us-west.topic1".
        Returns null if not a remote topic.
    */
    String topicSource(String topic);
 
    /** Name of topic on the source cluster, e.g. "topic1" for "us-west.topic1".
        Topics may be replicated multiple hops, so the immediately upstream topic
        may itself be a remote topic.
        Returns null if not a remote topic.
    */
    String upstreamTopic(String topic);
 
    /** The name of the original source-topic, which may have been replicated multiple hops.
        Returns the topic if it is not a remote topic.
    */
    String originalTopic(String topic);
 
    /** Internal topics are never replicated. */
    boolean isInternalTopic(String topic);
}
```

The implementation needs to be added to the Kafka classpath for the class reference to be used against replication.policy.class in MM2 properties.

## Next steps

[What is Apache Kafka on HDInsight?](apache-kafka-introduction.md)

## References

[Mirrormaker2 Changes Apache Doc](https://cwiki.apache.org/confluence/display/KAFKA/KIP-382%3A+MirrorMaker+2.0)

[Client certificates setup for HDI Kafka](apache-kafka-ssl-encryption-authentication#client-setup-without-authentication.md)

[HDInsight Kafka](./apache-kafka-introduction.md)

[Apache Kafka 2.4 Documentation](https://kafka.apache.org/24/documentation.html)

[Connect an on-premises network to Azure](azure/architecture/reference-architectures/hybrid-networking)
