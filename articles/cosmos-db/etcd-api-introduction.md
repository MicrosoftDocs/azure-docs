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

Azure Cosmos DB is Microsoft’s globally distributed, multi-model database service for mission-critical applications. It offers turnkey global distribution, elastic scaling of throughput and storage, single-digit millisecond latencies at the 99th percentile, and guaranteed high availability, all backed by industry-leading SLA’s.

[Etcd](https://github.com/etcd-io/etcd) is a distributed key/value store. In [Kubernetes](https://kubernetes.io/), it is used to store the state and configuration of the cluster. Ensuring availability, reliability, and performance of etcd is very important to overall cluster health and the ability to make changes to the cluster. 
The etcd API in Azure Cosmos DB allows you to use Azure Cosmos DB as the backend store for Azure Kubernetes. Azure Cosmos DB implements the etcd wire protocol. With etcd API in Azure Cosmos DB, developers will automatically get highly reliable, available, globally distributed Kubernetes. By using the etcd API, your application requires minimal code changes and management. This API allows developers to scale Kubernetes state management on a fully managed service. 

## Wire level compatibility

Azure Cosmos DB implements the wire-protocol of etcd, and allows the master node’s API servers to use Azure Cosmos DB just like it would for a locally installed etcd. 
 
![](.png)


## Key benefits

### No operations management

As a fully managed cloud service, Azure Cosmos DB removes the need for Kubernetes developers to set up and manage etcd. The overhead of setting up replication across multiple nodes, ensuring high availability, fault tolerance, performing rolling updates, security patches, and monitoring the etcd health are all handled by Azure Cosmos DB. 

### Global distribution & high availability 

By using etcd API, Azure Cosmos DB guarantees 99.99% availability for data reads and writes in a single region, and 99.999% availability across multiple regions. Azure Cosmos DB etcd API is available in all Azure regions, which enables developers to deploy Kubernetes clusters in the region closest to their users. 

### Security & enterprise readiness

When etcd data is stored in Azure Cosmos DB, Kubernetes developers automatically get the [built-in encryption at rest](database-encryption-at-rest.md) and [certifications and compliance](compliance.md) supported by Azure Cosmos DB. 

## Next steps

* [How to use Azure Kubernetes with Azure Cosmos DB](how-to-use-kubernetes-with-cosmosdb.md)
* [Key benefits of Azure Cosmos DB](introduction.md)