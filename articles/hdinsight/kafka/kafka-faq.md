---
title: FAQ about Apache Kafka in Azure HDInsight
description: Learn best practices for using Apache Kafka in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/09/2019
---
# Frequently asked questions about Apache Kafka in Azure HDInsight

This article addresses some common questions about using Apache Kafka on Azure HDInsight.

## What Kafka versions are supported by HDInsight

Our officially supported component versions can be found [here](../hdinsight-component-versioning#supported-hdinsight-versions.md). We recommend always using the latest version to ensure the best possible performance and user experience.

## What resources are provided in an HDInsight Kafka cluster and what resources am I charged for

HDInsight Kafka cluster includes Head nodes, Zookeeper nodes, Broker (worker) nodes and Azure Managed Disks attached to the broker nodes – all these resources are charged based on our pricing model described [here](https://azure.microsoft.com/pricing/details/hdinsight/). Also included are Gateway nodes, for which customers are not charged. For a more detailed description of various node types, continue [here](https://blogs.msdn.microsoft.com/azuredatalake/2017/03/10/nodes-in-hdinsight/). Pricing is based on per minute node usage. Prices vary depending on node size, number of nodes, type of managed disk used, and region.

## Do Apache Kafka APIs work with HDInsight

Yes, HDInsight uses native Kafka APIS. Your client application code does not need to change. Follow this [tutorial](./apache-kafka-producer-consumer-api.md) to see how you can use Java based producer / consumer apis with your cluster.

## Can I change cluster configurations

Yes, through Ambari portal. Each component in the portal has a **configs** section, which can be used to change component configurations. Some changes may require broker restarts.

## What type of authentication does HDInsight Kafka support

Using [Enterprise Security Package (ESP)](../domain-joined/apache-domain-joined-architecture.md), customers can get [topic level security](../domain-joined/apache-domain-joined-run-kafka.md) for their Kafka clusters.

## Is my data encrypted and can I use my own keys

All Kafka messages on the managed disks are encrypted with Azure Storage Service Encryption (SSE). Data-in-transit (e.g. data being transmitted from clients to brokers and vice versa) is not encrypted by default. It is possible to encrypt such traffic by setting up SSL on your own. Additionally, HDInsight allows customers to manage their own keys (BYOK) to encrypt the data at rest.

## How do I connect clients to my cluster

For Kafka clients to communicate with Kafka brokers, they must be able to reach the brokers over the network. For HDInsight clusters, the Virtual Network (VNet) is the security boundary. Hence, the easiest way to connect clients to your HDInsight cluster is to create clients within the same VNet as the cluster. Other scenarios include:

* Connecting clients in a different Azure VNet – Peer the cluster VNet and the client VNet and configure the cluster for [IP Advertising](apache-kafka-connect-vpn-gateway.md#configure-kafka-for-ip-advertising). When using IP advertising, Kafka clients must use Broker IP addresses to connect with the brokers, instead of Fully Qualified Domain Names (FQDNs).

* Connecting on-premises clients – Using a VPN network and setting up custom DNS servers as described [here](../../hdinsight-plan-virtual-network-deployment.md).

* Creating a public endpoint for your Kafka service – If your enterprise security requirements allow it, you can deploy a public endpoint for your Kafka brokers, or a self-managed open source REST end-point with a public endpoint.

## Can I add more disk space on an existing cluster

To increase the amount of space available for Kafka messages, you can increase the number of nodes. Currently, adding more disks to an existing cluster is not supported.

## How can I have maximum data durability

In order to achieve maximum data durability (i.e. lowest risk of message loss)  we recommend using a minimum replication factor of 3 (in regions with only two Fault Domains we recommend a replication factor of 4), disabling unclean leader elections, and setting acks to all. This will require all “in sync replicas” to be caught up to the leader before Kafka successfully writes the message. Hence, you should also set the min.insync.replicas to 2 or higher. Configuring Kafka for higher data consistency affects the availability of brokers to produce requests.

## Can I replicate my data to multiple clusters

Yes, data can be replicated to multiple clusters using Kafka MirrorMaker. Details on setting up MirrorMaker can be found [here](apache-kafka-mirroring.md). Additionally, there are other self-managed open source technologies and vendors that can help achieve replication to multiple clusters such as [Brooklin](https://github.com/linkedin/Brooklin/).

## Can I upgrade my cluster/ How should I upgrade my cluster

We do not currently support in-place cluster version upgrades. To update your cluster to a higher Kafka version, create a new cluster with the desired version and migrate your Kafka clients to use the new cluster.

## How do I monitor my Kafka cluster

Use Azure monitor to analyze your [Kafka logs](./apache-kafka-log-analytics-operations-management.md).
