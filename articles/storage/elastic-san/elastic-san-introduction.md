---
title: Introduction to Azure Elastic SAN
description: An overview of Azure Elastic SAN, a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 08/29/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# What is Azure Elastic SAN?

Azure Elastic storage area network (SAN) is Microsoft's answer to the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Elastic SAN is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.

Elastic SAN is designed for large scale IO-intensive workloads and top tier databases, such as:
- SQL
- MariaDB
- Containers, such as Azure Kubernetes Service

## Benefits of Elastic SAN

### Compatibility

Azure Elastic SAN volumes can connect to a wide variety of compute resources using the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol.

### Simplified provisioning and management

Elastic SAN simplifies deploying and managing storage at scale through grouping and policy enforcement. Rather than having to configure storage for each of your compute options, you can configure an elastic SAN to serve as the storage solution for multiple compute options and manage it separately from each option.

### Performance

With an Azure Elastic SAN, it's possible to scale your performance up to millions of IOPS, with double-digit GB/s throughput, and have single-digit millisecond latency. Elastic SAN volumes connect to your clients using the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI), which allows them to bypass the IOPS limit of an Azure VM and offers high throughput limits.

### Cost optimization and consolidation

Cost optimization can be achieved with Elastic SAN since you can increase your SAN storage in bulk. You can either increase your performance along with the storage capacity, or increase the storage capacity without increasing the SAN's performance, potentially offering a lower total cost of ownership.

## Elastic SAN resources

Elastic SAN has three resources:

- The Elastic SAN itself
- Volume groups
- Volumes

The following diagram illustrates the relationship and mapping of an Azure Elastic SAN's resources to those of an on-premises SAN:

:::image type="content" source="media/elastic-san-introduction/elastic-san-resource-relationship-diagram.png" alt-text="The elastic san is like an on-premises san appliance and is where billing and provisioning is handled, volume groups are like network endpoints and handles access and management, volumes are the storage, same as volumes in an on-premises san.":::

### The Elastic SAN resource

When you configure an elastic SAN, you select the redundancy of the entire SAN and provision storage. The storage you provision determines how much performance your SAN has, and the total capacity that can be distributed to each volume within the SAN.

### Volume groups resources

Volume groups are management constructs that you use to manage volumes at scale. Any settings or configurations applied to a volume group, such as virtual network rules, are inherited by any volumes associated with that volume group. A SAN can have up to 20 volume groups and a volume group can contain up to 1,000 volumes.

 Your volume group's name is part of your volume's iSCSI Qualified Name (IQN). The name must be 3 to 24 characters long, must be lowercase, and can only contain alphanumeric characters.

### Volumes resources

You partition the SAN's storage capacity into individual volumes. These individual volumes can be mounted to your clients with iSCSI. A volume can connect to up to 20 different clients simultaneously. 

The name of your volume is part of their iSCSI IQN. The name must be 3 to 24 characters long, must be lowercase, and can only contain alphanumeric characters.

## Support for Azure Storage features

The following table indicates support for Azure Storage features with Azure Elastic SAN.

The status of items in this table may change over time.

| Storage feature | Supported for Elastic SAN |
|-----------------|---------|
| Encryption at rest|	✔️ |
| Encryption in transit| ⛔ |
| [LRS or ZRS redundancy types](elastic-san-planning.md#redundancy)|	✔️ |
| Private endpoints | ⛔  |
| Grant network access to specific Azure virtual networks|  ✔️  |
| Access same data from Windows and Linux client|  ✔️   |
| Soft delete | ⛔  |
| Backups| ⛔ |
| Snapshots | ⛔ |

### iSCSI support

Elastic SAN has some limitations with iSCSI.

Elastic SAN currently doesn't support the following iSCSI features:
- CHAP authorization
- Initiator registration
- iSCSI Error Recovery Levels 1 and 2
- ESXi iSCSI flow control
- More than one LUN per iSCSI target
- Multiple connections per session (MC/S)

Only the following iSCSI commands are currently supported:
- TEST UNIT READY
- REQUEST SENSE
- INQUIRY
- REPORT LUNS
- MODE SENSE
- READ CAPACITY (10)
- READ CAPACITY (16)
- READ (6)
- READ (10)
- READ (16)
- WRITE (6)
- WRITE (10)
- WRITE (16)
- WRITE VERIFY (10)
- WRITE VERIFY (16)
- VERIFY (10)
- VERIFY (16)
- SYNCHRONIZE CACHE (10)
- SYNCHRONIZE CACHE (16)

## Next steps

[Deploy an Elastic SAN](elastic-san-create.md)