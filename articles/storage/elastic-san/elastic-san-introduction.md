---
title: Introduction to Azure Elastic SAN Preview
description: An overview of Azure Elastic SAN Preview, a service that enables you to create a virtual SAN to act as the storage for multiple compute options.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: overview
ms.date: 11/07/2023
ms.author: rogarana
ms.custom:
  - ignite-2022
  - ignite-2023-elastic-SAN
---

# What is Azure Elastic SAN? Preview

Azure Elastic storage area network (SAN) is Microsoft's answer to the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Elastic SAN Preview is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.

Elastic SAN is interoperable with multiple types of compute resources such as Azure Virtual Machines, Azure VMware Solutions, and Azure Kubernetes Service. Instead of having to deploy and manage individual storage options for each individual compute deployment, you can provision an Elastic SAN and use the SAN volumes as backend storage for all your workloads. Consolidating your storage like this can be more cost effective if you have a sizeable amount of large scale IO-intensive workloads and top tier databases.

## Benefits of Elastic SAN

### Compatibility

Azure Elastic SAN volumes can connect to a wide variety of compute resources using the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol. Because of this, rather than having to configure storage for each of your compute options, you can configure an Elastic SAN to serve as the storage solution for multiple compute options, and manage it separately from each option.

### Simplified provisioning and management

Elastic SAN simplifies deploying and managing storage at scale through grouping and policy enforcement. With [volume groups](#volume-groups) you can manage a large number of volumes from a single resource. For instance, you can create virtual network rules on the volume group and grant access to all your volumes.

### Performance

With an Elastic SAN, it's possible to scale your performance up to millions of IOPS, with double-digit GB/s throughput, and have single-digit millisecond latency. The performance of a SAN is shared across all of its volumes. As long as the SAN's caps aren't exceeded and the volumes are large enough, each volume can scale up to 80,000 IOPs. Elastic SAN volumes connect to your clients using the [iSCSI](https://en.wikipedia.org/wiki/ISCSI) protocol, which allows them to bypass the IOPS limit of an Azure VM and offers high throughput limits.

### Cost optimization and consolidation

Cost optimization can be achieved with Elastic SAN since you can increase your SAN storage in bulk. You can either increase your performance along with the storage capacity, or increase the storage capacity without increasing the SAN's performance, potentially offering a lower total cost of ownership. With Elastic SAN, you generally won't need to overprovision volumes, because you share the performance of the SAN with all its volumes.

## Elastic SAN resources

Each Azure Elastic SAN has two internal resources: Volume groups and volumes.

The following diagram illustrates the relationship and mapping of an Azure Elastic SAN's resources to the resources of an on-premises SAN:

:::image type="content" source="media/elastic-san-introduction/elastic-san-resource-relationship-diagram.png" alt-text="The Elastic SAN is like an on-premises SAN appliance and is where billing and provisioning are handled, volume groups are like network endpoints and handles access and management, volumes are the storage, same as volumes in an on-premises SAN.":::

### Elastic SAN

When you configure an Elastic SAN, you select the redundancy of the entire SAN and provision storage. The storage you provision determines how much performance your SAN has, and the total capacity that can be distributed to each volume within the SAN.

Your Elastic SAN's name has some requirements. The name can only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character. The name must be between 3 and 24 characters long.

### Volume groups 

Volume groups are management constructs that you use to manage volumes at scale. Any settings or configurations applied to a volume group, such as virtual network rules, are inherited by any volumes associated with that volume group.

Your volume group's name has some requirements. The name can only contain lowercase letters, numbers and hyphens, and must begin and end with a letter or a number. Each hyphen must be preceded and followed by an alphanumeric character. The name must be between 3 and 63 characters long.

### Volumes

You partition the SAN's storage capacity into individual volumes. These individual volumes can be mounted to your clients with iSCSI.

The name of your volume is part of their iSCSI IQN. The name can only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character. The name must also be between 3 and 63 characters long.

## Support for Azure Storage features

The following table indicates support for Azure Storage features with Azure Elastic SAN.

The status of items in this table might change over time.

| Storage feature | Supported for Elastic SAN |
|-----------------|---------|
| Encryption at rest|	✔️ |
| Encryption in transit| ⛔ |
| [LRS or ZRS redundancy types](elastic-san-planning.md#redundancy)|	✔️ |
| Private endpoints |	✔️ |
| Grant network access to specific Azure virtual networks|  ✔️  |
| Soft delete | ⛔  |
| Snapshots | ⛔ |

## Next steps

For a video introduction to Azure Elastic SAN, see [Accelerate your SAN migration to the cloud](/shows/inside-azure-for-it/accelerate-your-san-migration-to-the-cloud).

[Plan for deploying an Elastic SAN Preview](elastic-san-planning.md)
