---
title: Frequently asked questions about Azure Managed Instance for Apache Cassandra from the Azure portal
description: This quickstart shows how to create an Azure Managed Instance for Apache Cassandra cluster using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: cassandra-managed-instance
ms.topic: quickstart
ms.date: 01/18/2021
---
# Frequently asked questions about Azure Managed Instance for Apache Cassandra

### What are the benefits Azure Managed Instance for Apache Cassandra?

The Apache Cassandra database is the right choice when you need scalability and high availability without compromising performance. Linear scalability and proven fault-tolerance on commodity hardware or cloud infrastructure make it a great platform for mission-critical data. Azure Managed Instance for Apache Cassandra is a service for managing instances of open-source Apache Cassandra datacenters deployed in Azure, whether entirely in the cloud, or part of a hybrid cloud/on-premises cluster. This service is a great choice when you want all of the fine-grained configurability and control you have in open-source Apache Cassandra, with none of the maintenance headaches, and automated deployment with on-demand scale-up/scale down capability.

### Why would I use this service instead of Azure Cosmos DB Cassandra API?

Azure Managed Instance for Apache Cassandra is delivered by the Azure Cosmos DB team, but is a standalone managed service for deploying, maintaining, and scaling open-source Apache Cassandra data-centers and clusters. [Azure Cosmos DB Cassandra API](https://docs.microsoft.com/azure/cosmos-db/cassandra-introduction) is a Platform-as-a-Service, providing an interoperability layer for the Apache Cassandra wire protocol. If your expectation is for the platform to behave in exactly the same way as any Apache Cassandra cluster, you should choose this service. Have a look at our article on [Azure Managed Instance for Apache Cassandra Vs Azure Cosmos DB Cassandra API](cassandra-api-vs-cassandra-mi.md) for a more in-depth comparison between the two services.

### Is Azure Managed Instance for Apache Cassandra dependent on Azure Cosmos DB?

No. Apart from sharing the same resource provider namespace for deployment operations, there is no architectural dependency between Azure Managed Instance for Apache Cassandra and the Azure Cosmos DB backend. However, we plan to introduce deep data movement pipelines to Azure Cosmos DB in the future, allowing you to seamlessly migrate and/or scale out (for read-only workloads) to Azure Cosmos DB Cassandra API as the need arises. Have a look at our article on [Azure Managed Instance for Apache Cassandra Vs Azure Cosmos DB Cassandra API](cassandra-api-vs-cassandra-mi.md) for a deeper discussion and comparison between the two options to understand what may benefit your use cases. 

### Can I deploy Azure Managed Instance for Apache Cassandra in any region?

The service will be available in a limited number of regions during preview, but our plan will be to make the service available across all regions in Azure. 

### What are the storage and throughput limits of Azure Managed Instance for Apache Cassandra?

These limits will be dictated by the Virtual Machine SKUs chosen. 

### How much does Azure Managed Instance for Apache Cassandra cost?

For details, refer to the [Azure Managed Instance for Apache Cassandra pricing details](https://azure.microsoft.com/pricing/details/cassandra-managed-instance/) page. Azure Managed Instance for Apache Cassandra charges are based on the underlying VM cost, with a small markup.

### Can I use YAML file settings to configure behavior?

Yes, we allow you to embed YAML file configurations as part of an ARM template deployment. 

### Will the Azure Managed Instance for Apache Cassandra support node addition, cluster status, and node status commands?

We expose all the "read only" nodetool commands (such as status) through Azure CLI, but not operations such as node addition. This is because we manage the health of nodes in Azure Managed Instance for Apache Cassandra. In Hybrid mode, customers can connect to the cluster with nodetool. However, note this is not recommended, as it could destabilize the cluster, and could invalidate any production support SLA relating to the health of the Azure Managed Instance datacenters in the cluster.

### What happens with various settings for table metadata (bloom filter, caching, read repair chance, gc_grace, and compression memtable_flush_period)?

This is fully supported as with any self-hosted Apache Cassandra environment. 

### How can I monitor infrastructure along with throughput?

We host a [Prometheus](https://prometheus.io/docs/introduction/overview/) server to monitor activity across your cluster, and expose an endpoint. This maintains 10 minutes or 10GB of data (whichever threshold is reached first). You will need to setup a [federation](https://prometheus.io/docs/prometheus/latest/federation/) and appropriate dashboard tool (for example, Grafana).

### Does Azure Managed Instance for Apache Cassandra provide full backups?

Yes, we will provide full backups to Azure Storage and restore to a new cluster

### How can I migrate data from my existing Apache Cassandra cluster to Azure Managed Instance for Apache Cassandra?

Azure Managed Instance for Apache Cassandra supports all of the capabilities baked into Apache Cassandra for replication and streaming data between data-centers. 

### Can I pair an on-premises Apache Cassandra cluster with the Azure Managed Instance for Apache Cassandra?

Yes! You can configure a hybrid cluster with VNET injected data-centers deployed by the service communicating with on-premise data-centers within the same cluster ring. Consult our article [here] for further guidance. 

### Where can I give feedback on Azure Managed Instance for Apache Cassandra features?

Provide feedback via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db) using the category "Managed Apache Cassandra".

To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.


## Next steps

To learn about frequently asked questions in other APIs, see:

* [Get started](quickstart.md)