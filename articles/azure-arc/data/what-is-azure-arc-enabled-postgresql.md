---
title: What is Azure Arc-enabled PostgreSQL server?
description: What is Azure Arc-enabled PostgreSQL server?
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---


# What is Azure Arc-enabled PostgreSQL server

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]


## What is Azure Arc vs Azure Arc-enabled data services vs Azure Arc-enabled PostgreSQL server?

**Azure Arc** is one of the pillars of the Azure Hybrid family: Azure Arc, Azure Stack, and Azure IoT. Azure Arc helps customers manage the complexity of their hybrid deployments by simplifying the customer experience. 
With Azure Stack, Microsoft or its partners provide the hardware and the software (an appliance). With Azure Arc, Microsoft provides the software only. The customer or its partners provide the supporting infrastructure and operate the solution. Azure Arc is supported on Azure Stack. 
Azure Arc makes it possible for you to run Azure services on infrastructures that reside outside of Azure data centers and allows you to integrate with other Azure managed services if you wish.

**Azure Arc-enabled data services** is a part of Azure Arc. It is a suite of products and services that allows customers to manage their data. It allows customers to:

- Run Azure data services on any physical infrastructure
- Optimize your operations by using the same cloud technology everywhere
- Optimize your application developments by using the same underlying technology no matter where your application or database is hosted (in Azure PaaS or in Azure Arc)
- Use cloud technologies in your own data center and yet meet regulatory requirements (data residency & customer control). In other words, "If you cannot come to the cloud, the cloud is coming to you."

Some of the values that Azure Arc-enabled data services provide to you include:
- Always current
- Elastic scale
- Self-service provisioning
- Unified management
- Cloud billing
- Support for connected (to Azure) and occasionally connected (to Azure) scenarios. (direct vs. indirect connectivity modes)

**Azure Arc-enabled PostgreSQL server** is one of the database engines available as part of Azure Arc-enabled data services. 


## Compare Postgres solutions provided by Microsoft in Azure

Microsoft offers Postgres database services in Azure in two ways:
- As a managed service in Azure PaaS (Platform As A Service)
- As a semi-managed service with Azure Arc as it is operated by customers or their partners/vendors

### In Azure PaaS
**In [Azure PaaS](https://portal.azure.com/#create/Microsoft.PostgreSQLServer)**, Microsoft offers several deployment options for PostgreSQL as a managed service:

:::row:::
    :::column:::
        Azure Database for PostgreSQL Single server and Azure Database for PostgreSQL Flexible server. These services are Microsoft managed single-node/single instance Postgres form factor. Azure Database for PostgreSQL Flexible server is the most recent evolution of this service.
    :::column-end:::
    :::column:::
        :::image type="content" source="media/postgres-hyperscale/azure-database-for-postgresql-bigger.png" alt-text="Azure Database for PostgreSQL":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        Azure Database for PostgreSQL server. This service is the Microsoft managed multi-nodes/multi-instances Postgres form factor. It is powered by the Citus extension to Postgres that transforms the single node Postgres into a distributed database system. As you scale it out, it distributes the data and the queries that potentially allows your workload to reach unprecedented levels of scale and performance. The application sees a single Postgres instance also known as a server group. However, under the hood, this server group is constituted of several Postgres instances that work together. When you scale it out, you increase the number of Postgres instances within the server group that potentially improves the performance and scalability of your workload. You decide, depending on your needs and the characteristics of the workload, how many Postgres instances you add to the server group. 
    :::column-end:::
    :::column:::
        :::image type="content" source="media/postgres-hyperscale/postgresql-hyperscale.png" alt-text="Azure Database for PostgreSQL server":::
    :::column-end:::
:::row-end:::



### With Azure Arc

:::row:::
    :::column:::
        **With Azure Arc**, Microsoft offers **a single** Postgres product/service: **Azure Arc-enabled PostgreSQL server**. With Azure Arc, we simplified the product definition and the customer experience for PostgreSQL compared to Azure PaaS by providing **one Postgres product** that is capable of:
        - deploying single-node/single-instance Postgres like Azure Database for PostgreSQL Single/Flexible server,
        - deploying multi-nodes/multi-instances Postgres like Azure Database for PostgreSQL server,
        - great flexibility by allowing customers to morph their Postgres deployments from one-node to multi-nodes of Postgres and vice versa if they desire so. They are able to do so with no data migration and with a simple experience.
    :::column-end:::
    :::column:::
        :::image type="content" source="media/postgres-hyperscale/postgresql-hyperscale-arc.png" alt-text="Azure Arc-enabled PostgreSQL server":::
    :::column-end:::
:::row-end:::

Like its sibling in Azure PaaS, in its multi-nodes/instances form, Postgres is powered by the Citus extension that transforms the single node Postgres into a distributed database system. As you scale it out, it distributes the data and the queries which potentially allow your workload to reach unprecedented levels of scale and performances. The application sees a single Postgres instance also known as a server group. However, under the hood, this server group is constituted of several Postgres instances that work together. When you scale it out you increase the number of Postgres instances within the server group which potentially improves the performance and scalability of your workload. You decide, depending on your needs and the characteristics of the workload, how many Postgres instances you add to the server group. If you desire so, you may reduce the number of Postgres instances in the server group down to 1.


With the Direct connectivity mode offered by Azure Arc-enabled data services you may deploy Azure Arc-enabled PostgreSQL server from the Azure portal. If you use the indirect connect mode, you will deploy Azure Arc-enabled PostgreSQL server from the infrastructure that hosts it.

**With Azure Arc-enabled PostgreSQL server, you can:**
- Manage Postgres simply
    - Provision/de-provision Postgres instances with one command
    - At any scale: scale up/down
- Simplify monitoring, failover, backup, patching/upgrade, access control & more
- Build Postgres apps at unprecedented scale & performance
    - Scale out compute horizontally across multiple Postgres instances
    - Distribute data and queries
    - Run the Citus extension
    - Transform standard PostgreSQL into a distributed database system
- Deploy Postgres on any infrastructure
    - On-premises, multi-cloud (AWS, GCP, Azure), edge
- Integrate with Azure (optional)
- Pay for what you use (per usage billing)
- Get support from Microsoft on Postgres

**Additional considerations:**
- Azure Arc-enabled PostgreSQL server is not a new database engine or is not a specific version of an existing database engine. It is the same database engine that runs in Azure PaaS. Remember, with Azure Arc, if you cannot come to the Microsoft cloud; the Microsoft cloud is coming to you. The innovation with Azure Arc resides in how Microsoft offers this database engine and in the experiences Microsoft provides around this database engine. 

- Azure Arc-enabled PostgreSQL server is not a data replication solution either. Your business data stays in your Arc deployment. It is not replicated to the Azure cloud. Unless you chose to set up a feature of the database engine, like data replication/read replicas. In that case, your data may be replicated outside of your Postgres deployment: not because of Azure Arc but because you chose to set up a data replication feature.

- You do not need to use specific a driver or provider for your workload to run against Azure Arc-enabled PostgreSQL server. Any "Postgres application" should be able to run against Azure Arc-enabled PostgreSQL server.

- The scale-out and scale-in operations are not automatic. They are controlled by the users. Users may script these operations and automate the execution of those scripts. Not all workloads can benefit from scaling out. Read further details on this topic as suggested in the "Next steps" section.

## Roles and responsibilities: Azure managed services (Platform as a service (PaaS)) _vs._ Azure Arc-enabled data services
:::image type="content" source="media/postgres-hyperscale/rr-azure-paas-vs-azure-arc.png" alt-text="Roles and responsibilities Azure PaaS vs. Azure Arc":::

## Next steps
- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 

- **Deploy it, create your own.** Follow these steps to create on your own Kubernetes cluster: 
   1. [Install the client tools](install-client-tools.md)
   2. [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
   3. [Create an Azure Database for PostgreSQL server on Azure Arc](create-postgresql-server.md) 

- **Learn**
   - [Azure Arc](https://aka.ms/azurearc)
   - Azure Arc-enabled data services [here](https://azure.microsoft.com/services/azure-arc/hybrid-data-services) and [here](overview.md)
   - [Connectivity modes and requirements](connectivity.md)



- **Read the concepts and How-to guides of Azure Database for PostgreSQL server to distribute your data across multiple PostgreSQL server nodes and to potentially benefit from better performances**:
    * [Nodes and tables](../../postgresql/hyperscale/concepts-nodes.md)
    * [Determine application type](../../postgresql/hyperscale/howto-app-type.md)
    * [Choose a distribution column](../../postgresql/hyperscale/howto-choose-distribution-column.md)
    * [Table colocation](../../postgresql/hyperscale/concepts-colocation.md)
    * [Distribute and modify tables](../../postgresql/hyperscale/howto-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/hyperscale/tutorial-design-database-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/hyperscale/tutorial-design-database-realtime.md)* 

