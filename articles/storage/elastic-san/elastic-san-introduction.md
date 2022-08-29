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

Azure Elastic SAN is Microsoft's answer to the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Elastic SAN is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.

Elastic SAN is designed for large scale IO-intensive workloads and top tier databases, such as:
- SAP HANA
- SQL
- Epic
- Azure Kubernetes Service

## Benefits of Elastic SAN

### Unified interface

Elastic SAN offers a unified storage provisioning experience that simplifies deploying and managing storage at scale through grouping and policy enforcement.

### Performance

With Elastic SAN, it's possible to scale your performance up to millions of IOPS, double-digit GB/s throughput, and have single-digit ms latency. Elastic SAN volumes connect to your clients using the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI), which allows them to bypass an Azure VM's IOPS limit and offers high throughput limits.

### Cost optimization

Cost optimization can be achieved with Elastic SAN since you can increase your SAN storage in bulk. You can either increase your performance along with the storage capacity, or increase the storage capacity without increasing the SAN's performance, potentially offering a lower total cost of ownership.

## Elastic SAN resources

Elastic SAN has three resources:

- The SAN itself
- Volume groups
- Volumes

### The SAN

At the SAN-level, you select the redundancy of the entire SAN and provision storage. The storage you provision determines how much performance your SAN has, as well as the total capacity that can be distributed to each volume within the SAN.

### Volume groups

Volume groups are management constructs that you use to manage volumes at scale. Any settings or configurations applied to a volume group, such as virtual network ACLs, are inherited by any volumes associated with that volume group. A SAN can have up to 20 volume groups and a volume group can contain up to 1,000 volumes.

 Your volume group's name is part of your volume's iSCSI Qualified Name (IQN). Follow these rules when naming a volume group: The name must be 1 to 80 characters long, must be lowercase, and can only contain alphanumeric characters, underscores, and hyphens.

### Volumes

You partition the appliance's storage capacity into individual volumes. These individual volumes can be mounted to your clients with iSCSI. A volume can connect to up to 20 different clients simultaneously. 

The name of your volume is part of their iSCSI IQN. Follow these rules when naming a volume: The name must be 1 to 80 characters long, must be lowercase, and can only contain alphanumeric characters, underscores, and hyphens.

## Next steps

[Deploy an Elastic SAN](elastic-san-create.md)