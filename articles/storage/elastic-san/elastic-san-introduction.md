---
title: Introduction to Azure Elastic SAN
description: An overview of Azure Elastic SAN, a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 07/23/2021
ms.author: rogarana
ms.subservice: elastic-san
---

# What is Azure Elastic SAN?

Azure Elastic SAN is an Azure managed solution that provides easily scalable block-level storage for modern application and platform services while also allowing you to adapt storage performance and capacity to your needs. Large scale storage on Azure used to require you to configure your own solution, using Azure managed disks.

Modern large scale databases and performance-intensive mission-critical applications tend to experience frictions when migrating to the cloud.

Often, compute is shifted to the cloud while storage is either left on-prem or built using infrastructure as a service (IaaS) in the cloud. This poses challenges when integrating your workloads with modern cloud services and can make increasing your storage footprint difficult. When compared to on-prem solutions, building IaaS in the cloud can also lead to higher costs, lack of features, and a lack of workload integration.

Azure Elastic SAN is Microsoft's answer to the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Elastic SAN is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.

Elastic SAN is designed for:

- List
- of
- workloads
- and
- integrations


## Benefits of Elastic SAN

### Unified interface

Elastic SAN provides a unified storage provisioning and simplifies managing storage at scale through grouping and policy enforcement.

### Performance

With Elastic SAN, it's possible to scale your performance up to millions of IOPS, double-digit GB/s throughput, and have single-digit ms latency.

### Cost optimization

Elastic SAN simplifies cost optimization by allowing you to increase your storage footprint in bulk. You can either increase your performance along with the storage capacity, or increase the storage capacity without increasing the SAN's performance, potentially offering a lower total cost of ownership.

### Solutions that integrate with Elastic SAN

## Elastic SAN resources

Elastic SAN has three resources:

- The SAN itself
- Volume groups
- Volumes

When deploying a SAN, you make selections at the SAN-level, including the redundancy of the entire SAN, as well as how much performance and storage the SAN has. Then you create volume groups which are a management construct that are used to manage volumes at scale, any settings applied to a volume group are inherited by any volumes inside that volume group. Finally, you partition the storage capacity allocated at the SAN-level into individual volumes.

### The SAN

At the SAN-level, you select the redundancy of the entire SAN and provision storage. The storage you provision determines how much performance your SAN has, as well as the total capacity that can be distributed to each volume within the SAN.

### Volume groups

Volume groups are management constructs that you use to manage volumes at scale. Any settings or configurations applied to a volume group, such as virtual network ACLs, are inherited by any volumes associated with that volume group. Your volume group's name is part of your volume's iSCSI IQN. A SAN can have up to 20 volume groups and a volume group can contain up to 1,000 volumes.

### Volumes

You partition the appliance's storage capacity into individual volumes. These individual volumes can be mounted to your clients with iSCSI. A volume can connect to up to 20 different clients simultaneously. The name of your volume is part of their iSCSI IQN.

