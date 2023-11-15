---
title: Azure Native Qumulo Scalable File Service for disaster recovery
description: In this article, learn about the use case for Azure Native Qumulo Scalable File Service for disaster recovery.

ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 11/13/2003
---

# What is Azure Native Qumulo Scalable File Service for disaster recovery?

Azure Native Qumulo Scalable File Service (ANQ) provides high-performance, exabyte-scale unstructured-data cloud storage for disaster recovery. This article describes the options for deploying an Azure-based disaster recovery solution with Azure Native Qumulo Scalable File Service.

## Architecture

Azure Native Qumulo for disaster recovery can be deployed in one or more Azure availability zones depending on the primary site configuration and the level of recoverability required.

In all versions of this solution, your Azure resources are deployed into your own Azure tenant, and the ANQ service instance is deployed in Qumulo’s Azure tenant in the same regions. Your access to the ANQ service instance and its data are enabled through a delegated subnet in your Azure tenant, using virtual network (VNet) injection to connect to the ANQ service instance.

> [!NOTE]
> Qumulo has no access to any of your data on any ANQ instance.

Data services are replicated from the primary-site Qumulo instance to the ANQ service instance in two ways:

- using  Qumulo continuous replication in which all changes on the primary file system are immediately replicated to the ANQ instance, overwriting older versions of the data.
- using snapshots with replication that maintain multiple versions of changed files to enable more granular data recovery if you have data loss or corruption.

If you have a primary-site outage, critical client systems and workflows can use the ANQ service instance as the new primary storage platform, and can use the service’s native support for all unstructured-data protocols – SMB, NFS, NFSv4.1, and S3 – just as they were able to do on the primary-site storage.

## Solution architecture

The ANQ solution can be deployed in three ways:

- On-premises or other cloud
- between Azure regions
- On-premises or other cloud (multi-region)

### ANQ disaster recovery - on-premises or other cloud

In this setup, ANQ for disaster recovery is deployed into a single Azure region, with data replicating from the primary Qumulo storage instance to the ANQ service through your own Azure VPN Gateway or ExpressRoute connection.

:::image type="content" source="media/qumulo-disaster-recovery/disaster-recovery-architecture-on-prem-cloud.png" alt-text="Conceptual diagram that shows solution architecture for cloud add on-premises replication." lightbox="media/qumulo-disaster-recovery/disaster-recovery-architecture-on-prem-cloud-2.png":::

### ANQ disaster recovery - between Azure regions

In this scenario, two separate Azure regions are each configured as a hot standby/failover site for one another. If you have a service failure in Azure Region A, critical workflows and data are recovered on Azure Region B.

Qumulo replication is configured for both ANQ service instances, each of which serves as the secondary storage target for the other.

:::image type="content" source="media/qumulo-disaster-recovery/disaster-recovery-architecture-between-regions.png" alt-text="Conceptual diagram that shows solution architecture for between region replication." lightbox="media/qumulo-disaster-recovery/disaster-recovery-architecture-between-regions-2.png":::

### ANQ disaster recovery - on-premises or other cloud (multi-region)

In this scenario, the primary Qumulo storage is either on-premises or hosted on another cloud provider. Data on the primary Qumulo cluster is replicated to two separate ANQ service instances in two Azure regions. If you have a primary site failure or region-wide outage on Azure, you have more options for recovering critical services.

:::image type="content" source="media/qumulo-disaster-recovery/disaster-recovery-architecture-multi-region.png" alt-text="Conceptual diagram that show solution architecture for multi region replication." lightbox="media/qumulo-disaster-recovery/disaster-recovery-architecture-multi-region-2.png":::

## Solution workflow

Here's the basic workflow for ANQ for disaster recovery:

1. Users and workflows access the primary storage solution using standard unstructured data protocols: SMB, NFS, NFSv4.1, S3.
1. Users and/or workflows add, modify, or delete files on the primary storage instance as part of the normal course of business.
1. The primary Qumulo storage instance identifies the specific 4-K blocks in the file system that were changed and replicates only the changed blocks to the ANQ instance designated as the secondary storage.
1. If a continuous replication strategy is used, then any older versions of the changed data on the secondary storage instance are overwritten during the replication process.
1. If snapshots with replication are used, then a snapshot is taken on the secondary cluster to preserve older versions of the data, with the number of versions determined by the applicable snapshot policy on the secondary cluster.
1. If you have a service interruption at the primary site that’s sufficiently widespread, or of long enough duration to warrant a failover event, then the ANQ instance that serves as the secondary storage target becomes the primary storage instance. Replication is stopped, and the read-only datasets on the secondary ANQ service instance are enabled for full read and write operations.
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

If your organization plans to implement a disaster recovery environment using Azure Native Qumulo Scalable File Service, you should consider potential use cases in your planning and design processes. Scalability and performance are also considerations.

### Potential use cases

This architecture applies to businesses that want enterprise level file services with multi-protocol access to unstructured data on a scalable architecture.

Possible use cases:

- Hybrid Cloud disaster recovery:
  - Organizations can replicate their data to the cloud while also maintaining a secondary on-premises Qumulo cluster. If you have a disaster, recovery can occur on either the cloud or the secondary on-premises cluster, depending on the circumstances of the event.

- Cloud-Based Replication:  
  - Maintaining a replicated copy of critical primary data on an Azure-based Qumulo cluster ensures that data remains available if you have a disaster affecting the primary site. This approach allows for quick failover and minimal downtime during disaster recovery scenarios.

- Cloud Storage as Secondary disaster recovery Site:
  - ANQ can be utilized as a secondary disaster recovery site, allowing organizations to replicate their data to the cloud in near real-time. If you have a disaster impacting the primary on-premises site, your organization can switch to the replicated data on ANQ and continue operations with minimal disruption. Qumulo's replication capabilities ensure data consistency and integrity during the failover process.

- Cloud-Based Backup and Restore:
  - Your organization can back up their data from on-premises Qumulo clusters to an ANQ target, ensuring that a recent and secure copy of their data is available for recovery. If you have a disaster, your organization can restore the backed-up data from the cloud to a new or recovered ANQ service, minimizing data loss and downtime.

- Cloud-Based disaster recovery Testing and Validation:
  - Organizations can replicate a subset of their data to an ANQ target and simulate disaster recovery scenarios to validate the effectiveness of their recovery procedures and integrity. This approach allows organizations to identify and address any potential gaps or issues in their disaster recovery plans without impacting their production environment.

- Cloud disaster recovery for Remote Offices/Branch Offices (ROBO):
  - Organizations can deploy Qumulo clusters at their ROBO locations and replicate data to a centralized disaster recovery repository on an ANQ service. If you have a disaster at any remote site, organizations can continue to support the impacted site from the ANQ instance until a new Qumulo cluster can be deployed at the affected site, ensuring business continuity and data availability.

### Scalability and performance

When planning an Azure Native Qumulo Scalable File Service deployment as a disaster recovery solution, consider the following factors in capacity plans:

- The current amount of unstructured data within the scope of the failover plan.
- If the solution is intended for use as a cloud-based backup and restore environment, the number of separate snapshots that the solution is required to host, along with the expected rate of change within the primary dataset.
- The throughput required to ensure that all changes to the primary dataset are replicated to the target ANQ service. When you deploy ANQ, you can choose either the Standard or Premium performance tier, which offers higher throughput and lower latency for demanding workloads.
- Data replication occurs incrementally at the block level—after the initial synchronization is complete, only changed data blocks are replicated thereafter, which minimizes data transfer.
- If you have a disaster scenario that requires failover to the ANQ service, the network connectivity and throughput are required to support all impacted clients during the outage event.
- Depending on the specific configuration, an ANQ service can support anywhere from 2GB/s-20GB/s max throughput and tens to hundreds of thousands of IOPS. Consult the Qumulo Sizing Tool for specific guidance on planning the initial size of an ANQ deployment.

### Security

The Azure Native Qumulo Scalable File Service connects to your Azure environment using VNet injection, which is fully routable, secure, and visible only to your resources. No IP space coordination between your environment and the ANQ service is required.

In an on-premises Qumulo cluster, all data is encrypted at rest using an AES 256-bit algorithm. ANQ uses Azure’s built-in data encryption at the disk level. All replication traffic between source and target clusters is automatically encrypted in transit.

For information about third-party attestations Qumulo has achieved, including SOC 2 Type II and FIPS 140-2 Level 1, see [Qumulo Compliance Posture](https://docs.qumulo.com/administrator-guide/getting-started-qumulo-core/qumulo-compliance-posture.html) in the Qumulo Core Administrator Guide.

### Cost optimization

Cost optimization refers to minimizing unnecessary expenses while maximizing the value of the actual costs incurred by the solution. For more information, visit the [Overview of the cost optimization pillar](/azure/well-architected/cost/overview) page.

Azure Native Qumulo is available in multiple tiers, giving you a choice of multiple capacity-to-throughput options to meet your specific workload needs.

### Availability

Different organizations can have different availability and recoverability requirements even for the same application. The term availability refers to the solution’s ability to continuously deliver the service at the level of performance for which it was built.

#### Data and storage availability

The ANQ deployment includes built-in redundancy at the data level to ensure data availability against failure of the underlying hardware. To protect the data against accidental deletion, corruption, malware, or other cyber attack, ANQ includes the ability to take snapshots at any level within the file system to create point-in-time, read-only copies of your data.

More data redundancy is provided as part of the solution via the replication of data from an ANQ instance in Region A or another ANQ instance in Region B.

ANQ supports replication of the data to a secondary Qumulo storage instance, which can be hosted in Azure, in another cloud, or on-premises.

ANQ also supports any file-based backup solution to enable external data protection.

## Deployment

Here's some information on what you need when deploying ANQ for disaster recovery.

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
