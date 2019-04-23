---
title: Introduction to the Azure Cosmos DB etcd API
description: This article provides an overview and key benefits of etcd API in Azure Cosmos DB
author: deborahc
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: dech
ms.reviewer: sngun

---

# Introduction to the Azure Cosmos DB etcd API

[Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/) is Microsoft’s globally distributed, multi-model database service for mission-critical applications. It offers turnkey global distribution, elastic scaling of throughput and storage, single-digit millisecond latencies at the 99th percentile, and guaranteed high availability, all backed by industry-leading SLA’s.

[Etcd](https://github.com/etcd-io/etcd) is a distributed key/value store. In [Kubernetes](https://kubernetes.io/), etcd is used to store the state and the configuration of the Kubernetes cluster. Ensuring availability, reliability, and performance of etcd is important to overall cluster health and the ability to make changes to the cluster. 

The etcd API in Azure Cosmos DB allows you to use Azure Cosmos DB as the backend store for [Azure Kubernetes](https://docs.microsoft.com/azure/aks/). Azure Cosmos DB implements the etcd wire protocol. With etcd API in Azure Cosmos DB, developers will automatically get highly reliable, [available](high-availability.md), [globally distributed](distribute-data-globally.md) Kubernetes. By using the etcd API, your application requires minimal code changes and management. This API allows developers to scale Kubernetes state management on a fully managed service. 

> ![NOTE]
> Unlike other APIs, you cannot provision an etcd API account in Azure Cosmos DB through the Azure portal, CLI or SDKs. You can provision an etcd API account by deploying the Resource Manager template only, for detailed steps, see [How to provision Azure Kubernetes with Azure Cosmos DB](bootstrap-kubernetes-cluster.md) article.  

## Wire level compatibility

Azure Cosmos DB implements the wire-protocol of etcd, and allows the [master node’s](https://kubernetes.io/docs/concepts/overview/components/) API servers to use Azure Cosmos DB just like it would do in a locally installed etcd environment. 
 
![Azure Cosmos DB implementing etcd wire protocol](etcd-wire-protocol.png)

## Key benefits

### No operations management

As a fully managed cloud service, Azure Cosmos DB removes the need for Kubernetes developers to set up and manage etcd. The etcd API in Azure Cosmos DB is scalable, highly available, fault tolerant, and offers high performance. The overhead of setting up replication across multiple nodes, performing rolling updates, security patches, and monitoring the etcd health are handled by Azure Cosmos DB.  

### Global distribution & high availability 

By using etcd API, Azure Cosmos DB guarantees 99.99% availability for data reads and writes in a single region, and 99.999% availability across multiple regions. Azure Cosmos DB etcd API is available in all Azure regions, which enables developers to deploy Kubernetes clusters in the region closest to their users. 

### Elastic scalability

Azure Cosmos DB offers elastic scalability for read and write requests across different regions. As the Kubernetes cluster grows, the etcd API account in Azure Cosmos DB elastically scales without any downtime. This feature helps you to deal with unexpected spikes in your workloads without having to over-provision for the peak period. For more information, see [scaling provisioned throughput](scaling-throughput.md) article.

### Security & enterprise readiness

When etcd data is stored in Azure Cosmos DB, Kubernetes developers automatically get the [built-in encryption at rest](database-encryption-at-rest.md) and [certifications and compliance](compliance.md) supported by Azure Cosmos DB. 

## Next steps

* [How to use Azure Kubernetes with Azure Cosmos DB](bootstrap-kubernetes-cluster.md)
* [Key benefits of Azure Cosmos DB](introduction.md)
* [AKS engine Quickstart guide](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/quickstart.md)