---
title: Using Azure Native Qumulo Scalable File Service for disaster recovery
description: In this how to guide, learn how to setup use Azure Native Qumulo Scalable File Service fir disaster recovery.

ms.topic: conceptual
ms.date: 10/31/2023

---

# Using Azure Native Qumulo Scalable File Service for disaster recovery

Azure Native Qumulo Scalable File Service (ANQ) provides high-performance, exabyte-scale unstructured-data cloud storage for disaster recovery. This article describes the options for deploying an Azure-based disaster recovery solution with Azure Native Qumulo Scalable File Service.

<!-- 
|Benefits of a Disaster Recovery solution powered by Azure Native Qumulo|Details|
|---------|---------|
|Scalability |A single ANQ instance can scale to exabyte size and beyond in a single namespace. As the data footprint grows in the primary site, ANQ scales automatically on the DR side to ensure that enough capacity is always available.|
|Cost efficiency | Customers pay only for the capacity and throughput they use, while they use it.|
|Performance |ANQ higher throughput and lower latency for most workloads.|
|Global reach |ANQ can be deployed in one or more Azure regions worldwide, enabling low-latency access to users anywhere/everywhere.|
|Security and compliance |Provides disaster-recovery / business-continuity data services in the event of a service interruption at the primary site. For many enterprises, DR / failover capabilities are a core requirement for business or regulatory compliance.|
|Business continuity |Provides failover capability or data recoverability in the event of an outage in the customer’s primary facilities.|
 -->

## Architecture

As shown in the following diagrams, the Azure Native Qumulo for disaster recovery solution can be deployed in one or more Azure availability zones depending on the primary site configuration and the level of recoverability required.

In all versions of this solution, the your Azure resources are deployed into your own Azure tenant, and the ANQ service instance is deployed in Qumulo’s Azure tenant in the same regions. Your access to the ANQ service instance and its data are enabled through a delegated subnet in your Azure tenant, using VNet injection to connect to the ANQ service instance.

> [!NOTE]
> Qumulo has no access to any customer data on any ANQ instance.

Data services are replicated from the primary-site Qumulo instance to the ANQ service instance in two way

- using  Qumulo continuous replication in which all changes on the primary file system are immediately replicated to the ANQ instance, overwriting older versions of the data.
- using snapshots with replication that maintain multiple versions of changed files to enable more granular data recovery in the event of data loss or corruption.

In the event of a primary-site outage, critical client systems and workflows can use the ANQ service instance as the new primary storage platform, and can use the service’s native support for all unstructured-data protocols – SMB, NFS, NFSv4.1, and S3 – just as they were able to do on the primary-site storage.

## Solution architecture

### ANQ disaster recovery - On-premises or other cloud

In this setup, ANQ for disaster recovery is deployed into a single Azure region, with data replicating from the primary Qumulo storage instance to the ANQ service through your own Azure VPN Gateway or ExpressRoute connection.

:::image type="content" source="media/qumulo-disaster-recovery/disaster-recovery-architecture-on-prem-cloud.png" alt-text="solution architecture for cloud - on prem replication.":::

### ANQ disaster recovery - between Azure regions

In this scenario, two separate Azure regions are each configured as a hot standby/failover site for one another. In the event of a service failure in Azure Region A, critical workflows and data are recovered on Azure Region B.

Qumulo replication is configured for both ANQ service instances, each of which serves as the secondary storage target for the other.

:::image type="content" source="media/qumulo-disaster-recovery/disaster-recovery-architecture-between-regions.png" alt-text="solution architecture for between region replication.":::

#### ANQ disaster recovery - On-prem or Other Cloud (Multi-Region)

In this scenario, the primary Qumulo storage is either on-premises or hosted on another cloud provider. Data on the primary Qumulo cluster is replicated to two separate ANQ service instances in two Azure regions. In the event of a primary site failure or region-wide outage on Azure, the customer has additional options for recovering critical services.

:::image type="content" source="media/qumulo-disaster-recovery/disaster-recovery-architecture-multi-region.png" alt-text="solution architecture for multi region replication.":::

## Solution workflow

1. Users and workflows access the primary storage solution using standard unstructured data protocols: SMB, NFS, NFSv4.1, S3.
1. Users and/or workflows add, modify, or delete files on the primary storage instance as part of the normal course of business.
1. The primary Qumulo storage instance identifies the specific 4K blocks in the file system that have been changed and replicates only the changed blocks to the ANQ instance designated as the secondary storage.
1. If a continuous replication strategy is used, then any older versions of the changed data on the secondary storage instance are overwritten during the replication process.
1. If snapshots with replication are used, then a snapshot is taken on the secondary cluster to preserve older versions of the data, with the number of versions determined by the applicable snapshot policy on the secondary cluster.
1. In the event of a service interruption at the primary site that’s sufficiently widespread, or of long enough duration to warrant a failover event, then the ANQ instance that serves as the secondary storage target becomes the primary storage instance. Replication is stopped, and the read-only datasets on the secondary ANQ service instance are enabled for full read and write operations.
1. Affected users and workflows are redirected to the ANQ instance as the primary storage target, and service resumes.

## Components

The solution architecture comprises the following components:

- [Azure Native Qumulo Scalable File Service (ANQ)](https://qumulo.com/azure)
- [Qumulo Continuous Replication](https://care.qumulo.com/hc/articles/360018873374-Replication-Continuous-Replication-with-2-11-2-and-above)
- [Qumulo Snapshots with Replication](https://care.qumulo.com/hc/articles/360037962693-Replication-Snapshot-Policy-Replication)
- [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)
- [VNet ExpressRoute](/azure/expressroute/expressroute-introduction)
- [Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways)

## Considerations

Organizations looking to plan and implement a disaster recovery environment using Azure Native Qumulo Scalable File Service should consider potential use case in their planning and design processes. Scalability and performance are also considerations.

### Potential use cases

This architecture applies to businesses that want to need enterprise file services with multi-protocol access to unstructured data on a scalable architecture.

Potential use cases:

- Hybrid Cloud disaster recovery:
  - Organizations can replicate their data to the cloud while also maintaining a secondary on-premises Qumulo cluster. In the event of a disaster, recovery can occur on either the cloud or the secondary on-premises cluster, depending on the circumstances of the event.

- Cloud-Based Replication:  
  - Maintaining a replicated copy of critical primary data on an Azure-based Qumulo cluster ensures that data remains available in the event of a disaster affecting the primary site. This approach allows for quick failover and minimal downtime during disaster recovery scenarios.

- Cloud Storage as Secondary disaster recovery Site:
  - ANQ can be utilized as a secondary disaster recovery site, allowing organizations to replicate their data to the cloud in near real-time. In the event of a disaster impacting the primary on-premises site, organizations can switch to the replicated data on ANQ and continue operations with minimal disruption. Qumulo's replication capabilities ensure data consistency and integrity during the failover process.

- Cloud-Based Backup and Restore:
  - Organizations can back up their data from on-premises Qumulo clusters to an ANQ target, ensuring that a recent and secure copy of their data is available for recovery. In case of a disaster, organizations can restore the backed-up data from the cloud to a new or recovered ANQ service, minimizing data loss and downtime.

- Cloud-Based disaster recovery Testing and Validation:
  - Organizations can replicate a subset of their data to an ANQ target and simulate disaster recovery scenarios to validate the effectiveness of their recovery procedures and integrity. This approach allows organizations to identify and address any potential gaps or issues in their disaster recovery plans without impacting their production environment.

- Cloud disaster recovery for Remote Offices/Branch Offices (ROBO):
  - Organizations can deploy Qumulo clusters at their ROBO locations and replicate data to a centralized disaster recovery repository on an ANQ service. In the event of a disaster at any remote site, organizations can continue to support the impacted site from the ANQ instance until a new Qumulo cluster can be deployed at the affected site, ensuring business continuity and data availability.

### Scalability and Performance

When planning an Azure Native Qumulo Scalable File Service deployment as a Disaster Recovery solution, organizations may want to factor any or all of the following into their initial capacity plans:

- The current amount of unstructured data within the scope of the failover plan.
- If the solution is intended for use as a cloud-based backup and restore environment, the number of separate snapshots that the solution will be required to host, along with the expected rate of change within the primary dataset.
- The throughput required to ensure that all changes to the primary dataset are replicated to the target ANQ service. When deploying ANQ, organizations can choose either the Standard or Premium performance tier, which offers higher throughput and lower latency for demanding workloads.
- Data replication occurs incrementally at the block level—after the initial synchronization is complete, only changed data blocks are replicated thereafter, which minimizes data transfer.
- In the event of a disaster scenario that requires failover to the ANQ service, the network connectivity and throughput are required to support all impacted clients for the duration of the outage event.
- Depending on the specific configuration, an ANQ service can support anywhere from 2GB/s-20GB/s max throughput and tens to hundisaster recoveryeds of thousands of IOPS. Consult the Qumulo Sizing Tool for specific guidance on planning the initial size of an ANQ deployment.

### Security

The Azure Native Qumulo Scalable File Service connects to your Azure environment using VNet injection, which is fully routable, inherently secure, and visible only to your resources. No IP space coordination between your environment and the ANQ service is required.
In an on-premises Qumulo cluster, all data is encrypted at rest using an AES 256-bit algorithm. ANQ leverages Azure’s built-in data encryption at the disk level. All replication traffic between source and target clusters is automatically encrypted in transit.
For information about third-party attestations Qumulo has achieved, including SOC 2 Type II and FIPS 140-2 Level 1, see [Qumulo Compliance Posture](https://docs.qumulo.com/administrator-guide/getting-started-qumulo-core/qumulo-compliance-posture.html) in the Qumulo Core Administrator Guide.

### Cost optimization

Cost optimization refers to minimizing unnecessary expenses while maximizing the value of the actual costs incurred by the solution. For more information, visit the [Overview of the cost optimization pillar](/azure/well-architected/cost/overview) page.

Azure Native Qumulo is available in multiple tiers, giving you a choice of multiple capacity-to-throughput options to meet your specific workload needs.

### Availability

Different organizations can have different availability and recoverability requirements even for the same application. The term availability refers to the solution’s ability to continuously deliver the service at the level of performance for which it was built.

#### Data and storage availability

The ANQ deployment includes built-in redundancy at the data level to ensure data availability against failure of the underlying hardware. To protect the data against accidental deletion, corruption, malware, or other cyberattack, ANQ includes the ability to take snapshots at any level within the file system to create point-in-time, read-only copies of your data.

Additional data redundancy is provided as part of the solution via the replication of data from an ANQ instance in Region A or another ANQ instance in Region B.

ANQ supports replication of the data to a secondary Qumulo storage instance, which can be hosted in Azure, in another cloud, or on-premises.

ANQ also supports any file-based backup solution to enable external data protection.

## Deploy this scenario

- For more information about deploying Azure Native Qumulo Scalable File Service, see [our website](https://qumulo.com/product/azure/).
- For more information about the replication options on Qumulo, see [Qumulo Continuous Replication](https://care.qumulo.com/hc/articles/360018873374-Replication-Continuous-Replication-with-2-11-2-and-above) and [Qumulo Snapshots with Replication](https://care.qumulo.com/hc/articles/360037962693-Replication-Snapshot-Policy-Replication)
- For more information regarding the failover/failback operations, see [Using Failover with Replication in Qumulo](https://care.qumulo.com/hc/articles/4488248924691-Using-Failover-with-Replication-in-Qumulo-Core-2-12-0-or-Higher-)
- For more information regarding the Qumulo solution, see [QumuloSync](https://github.com/Qumulo/QumuloSync)
- For more information about network ports, see [Required Networking Ports for Qumulo Core](https://docs.qumulo.com/administrator-guide/networking/required-networking-ports.html)

## Next steps

- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
