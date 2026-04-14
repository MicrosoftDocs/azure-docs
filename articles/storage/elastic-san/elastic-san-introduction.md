---
title: Introduction to Azure Elastic SAN
description: Learn how Azure Elastic SAN simplifies storage management for multiple compute resources with high performance and cost optimization.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: overview
ms.date: 01/07/2026
ms.author: rogarana
ms.custom:
  - ignite-2023-elastic-SAN
# Customer intent: "As a cloud architect, I want to deploy and manage a centralized storage solution using Elastic SAN, so that I can optimize performance and reduce costs for my organization's multiple compute resources."
---

# What is Azure Elastic SAN?

Azure Elastic SAN helps you optimize workloads and integrate your large-scale databases with performance-intensive, mission-critical applications. Elastic SAN is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a storage area network (SAN). It also offers built-in cloud capabilities like high availability.

Elastic SAN works with many types of compute resources, such as Azure Virtual Machines, Azure VMware Solution, and Azure Kubernetes Service. Instead of deploying and managing individual storage options for each compute deployment, you can provision an Elastic SAN and use the SAN volumes as backend storage for all your workloads. Consolidating your storage like this can be more cost effective if you have a large number of scale IO-intensive workloads and top-tier databases.

## Benefits of Elastic SAN

### Compatibility

Azure Elastic SAN volumes can connect to a wide variety of compute resources using the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol. Because of this, rather than having to configure storage for each of your compute options, you can configure an Elastic SAN to serve as the storage solution for multiple compute options, and manage it separately from each option.

### Simplified provisioning and management

Elastic SAN simplifies deploying and managing storage at scale through grouping and policy enforcement. By using [volume groups](#volume-groups), you can manage a large number of volumes from a single resource. For example, you can create virtual network rules on the volume group and grant access to all your volumes.

### Performance

With an Elastic SAN, you can scale your performance up to millions of IOPS, with double-digit GB/s throughput, and have single-digit millisecond latency. The performance of a SAN is shared across all of its volumes. As long as the SAN's caps aren't exceeded and the volumes are large enough, each volume can scale up to 80,000 IOPS. Elastic SAN volumes connect to your clients by using the [iSCSI](https://en.wikipedia.org/wiki/ISCSI) protocol, allowing the clients to bypass the IOPS limit of an Azure VM and benefit from high throughput limits.

### Cost optimization and consolidation

You can optimize costs by increasing your SAN storage in bulk. You can either increase your performance along with the storage capacity, or increase the storage capacity without increasing the SAN's performance, potentially offering a lower total cost of ownership. With Elastic SAN, you generally don't need to overprovision volumes, because you share the performance of the SAN with all its volumes.

## Elastic SAN resources

Each Azure Elastic SAN has two internal resources: volume groups and volumes.

The following diagram illustrates the relationship and mapping of an Azure Elastic SAN's resources to the resources of an on-premises SAN:

:::image type="content" source="media/elastic-san-introduction/elastic-san-resource-relationship-diagram.png" alt-text="The Elastic SAN is like an on-premises SAN appliance and is where billing and provisioning are handled, volume groups are like network endpoints and handles access and management, volumes are the storage, same as volumes in an on-premises SAN.":::

### Elastic SAN

When you configure an Elastic SAN, you select the redundancy of the entire SAN and provision storage. The storage you provision determines how much performance your SAN has, and the total capacity that you can distribute to each volume within the SAN.

Your Elastic SAN's name has some requirements. The name can only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character. The name must be between 3 and 24 characters long.

### Volume groups 

Volume groups are management constructs that you use to manage volumes at scale. Any settings or configurations applied to a volume group, such as virtual network rules, are inherited by any volumes associated with that volume group.

Your volume group's name has some requirements. The name can only contain lowercase letters, numbers, hyphens, and must begin and end with a letter or a number. Each hyphen must be preceded and followed by an alphanumeric character. The name must be between 3 and 63 characters long.

### Volumes

You partition the SAN's storage capacity into individual volumes. You can mount these individual volumes to your clients by using iSCSI.

The name of your volume is part of their iSCSI IQN. The name can only contain lowercase letters, numbers, hyphens, underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character. The name must be between 3 and 63 characters long.

## Support for Azure Storage features

The following table shows support for Azure Storage features with Azure Elastic SAN.

The status of items in this table might change over time.

| Storage feature | Supported for Elastic SAN |
|-----------------|---------|
| Encryption at rest|	✔️ |
| Encryption in transit| ⛔ |
| [LRS or ZRS redundancy types](elastic-san-planning.md#redundancy)|	✔️ |
| Private endpoints |	✔️ |
| Grant network access to specific Azure virtual networks|  ✔️  |
| Soft delete | ⛔  |
| Snapshots | ✔️ |

## Next steps

For a video introduction to Azure Elastic SAN, see [Accelerate your SAN migration to the cloud](/shows/inside-azure-for-it/accelerate-your-san-migration-to-the-cloud).

[Plan for deploying an Elastic SAN](elastic-san-planning.md)
