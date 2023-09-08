---
title: Planning for an Azure Elastic SAN Preview
description: Understand planning for an Azure Elastic SAN deployment. Learn about storage capacity, performance, redundancy, and encryption.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 05/02/2023
ms.author: rogarana
ms.custom: ignite-2022
---

# Plan for deploying an Elastic SAN Preview

There are three main aspects to an elastic storage area network (SAN): the SAN itself, volume groups, and volumes. When deploying a SAN, you make selections while configuring the SAN, including the redundancy of the entire SAN, and how much performance and storage the SAN has. Then you create volume groups that are used to manage volumes at scale. Any settings applied to a volume group are inherited by volumes inside that volume group. Finally, you partition the storage capacity that was allocated at the SAN-level into individual volumes.

Before deploying an Elastic SAN Preview, consider the following:

- How much storage do you need?
- What level of performance do you need?
- What type of redundancy do you require?

Answering those three questions can help you to successfully provision a SAN that meets your needs.

## Storage and performance

There are two layers when it comes to performance and storage, the total storage and performance that an Elastic SAN has, and the performance and storage of individual volumes.

### Elastic SAN

There are two ways to provision storage for an Elastic SAN: You can either provision base capacity or additional capacity. Each TiB of base capacity also increases your SAN's IOPS and throughput (MB/s) but costs more than each TiB of additional capacity. Increasing additional capacity doesn't increase your SAN's IOPS or throughput (MB/s).

When provisioning storage for an Elastic SAN, consider how much storage you require and how much performance you require. Using a combination of base capacity and additional capacity to meet these requirements allows you to optimize your costs. For example, if you needed 100 TiB of storage but only needed 250,000 IOPS and 4,000 MB/s, you could provision 50 TiB in your base capacity and 50 TiB in your additional capacity.

### Volumes

You create volumes from the storage that you provisioned to your Elastic SAN. When you create a volume, think of it like partitioning a section of the storage of your Elastic SAN. The maximum performance of an individual volume is determined by the amount of storage allocated to it. Individual volumes can have fairly high IOPS and throughput, but the total IOPS and throughput of all your volumes can't exceed the total IOPS and throughput your SAN has.

Using the same example of a 100 TiB SAN that has 250,000 IOPS and 4,000 MB/s. Say this SAN had 100 1 TiB volumes. You could potentially have three of these volumes operating at their maximum performance (64,000 IOPS, 1,024 MB/s) since this would be below the SAN's limits. But if four or five volumes all needed to operate at maximum at the same time, they wouldn't be able to. Instead the performance of the SAN would be split evenly among them.

## Networking

In Preview, Elastic SAN supports public access from selected virtual networks, restricting access to specified virtual networks. You configure volume groups to allow network access only from specific vnet subnets. Once a volume group is configured to allow access from a subnet, this configuration is inherited by all volumes belonging to the volume group. You can then mount volumes from any clients in the subnet, with the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol. You must enable [service endpoint for Azure Storage](../../virtual-network/virtual-network-service-endpoints-overview.md) in your virtual network before setting up the network rule on volume group.

If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Redundancy

To protect the data in your Elastic SAN against data loss or corruption, all SANs store multiple copies of each file as they're written. Depending on the requirements of your workload, you can select additional degrees of redundancy. The following data redundancy options are currently supported:

- **Locally-redundant storage (LRS)**: With LRS, every SAN is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs within the data center, all replicas of an Elastic SAN using LRS may be lost or unrecoverable.
- **Zone-redundant storage (ZRS)**: With ZRS, three copies of each SAN are stored in three distinct and physically isolated storage clusters in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. A write request to storage that is using ZRS happens synchronously. The write operation only returns successfully after the data is written to all replicas across the three availability zones.

## Encryption

All data stored in an Elastic SAN is encrypted at rest using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: data is encrypted beneath the file system level. SSE protects your data and to help you to meet your organizational security and compliance commitments. Data stored in Elastic SAN is encrypted with Microsoft-managed keys. With Microsoft-managed keys, Microsoft holds the keys to encrypt/decrypt the data, and is responsible for rotating them regularly.

Data in an Azure Elastic SAN is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Encryption is enabled for all Elastic SANs and can't be disabled. Because your data is secured by default, you don't need to modify your code, or applications to take advantage of SSE. There's no extra cost for SSE.

For more information about the cryptographic modules underlying SSE, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal).

## iSCSI support

Elastic SAN supports the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol. The following iSCSI commands are currently supported:

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

The following iSCSI features aren't currently supported:
- CHAP authorization
- Initiator registration
- iSCSI Error Recovery Levels 1 and 2
- ESXi iSCSI flow control
- More than one LUN per iSCSI target

## Next steps

For a video that goes over the general planning and deployment with a few example scenarios, see [Getting started with Azure Elastic SAN](/shows/inside-azure-for-it/getting-started-with-azure-elastic-san).

[Deploy an Elastic SAN Preview](elastic-san-create.md)
