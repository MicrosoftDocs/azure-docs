---
title: Planning for an Azure Elastic SAN Preview
description: Understand planning for an Azure Elastic SAN deployment. Learn about storage capacity, performance, redundancy, and encryption.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 06/09/2023
ms.author: rogarana
ms.custom:
  - ignite-2022
  - ignite-2023-elastic-SAN
---

# Plan for deploying an Elastic SAN Preview

There are three main aspects to an elastic storage area network (SAN): the SAN itself, volume groups, and volumes. When deploying a SAN, you make selections while configuring the SAN, including the redundancy of the entire SAN, and how much performance and storage the SAN has. Then you create volume groups that are used to manage volumes at scale. Any settings applied to a volume group are inherited by volumes inside that volume group. Finally, you partition the storage capacity that was allocated at the SAN-level into individual volumes.

Before deploying an Elastic SAN Preview, consider the following:

- How much storage do you need?
- What level of performance do you need?
- What type of redundancy do you require?

Answering those three questions can help you to successfully deploy a SAN that meets your needs.

## Storage and performance

There are two layers when it comes to performance and storage, the total storage and performance that an Elastic SAN has, and the performance and storage of individual volumes.

### Elastic SAN

There are two ways to allocate storage for an Elastic SAN: You can either allocate base capacity or additional capacity. Each TiB of base capacity also increases your SAN's IOPS and throughput (MB/s) but costs more than each TiB of additional capacity. Increasing additional capacity doesn't increase your SAN's IOPS or throughput (MB/s).

When allocating storage for an Elastic SAN, consider how much storage you require and how much performance you require. Using a combination of base capacity and additional capacity to meet these requirements allows you to optimize your costs. For example, if you needed 100 TiB of storage but only needed 250,000 IOPS and 4,000 MB/s, you could allocate 50 TiB in your base capacity and 50 TiB in your additional capacity.

### Volumes

You create volumes from the storage that you allocated to your Elastic SAN. When you create a volume, think of it like partitioning a section of the storage of your Elastic SAN. The maximum performance of an individual volume is determined by the amount of storage allocated to it. Individual volumes can have fairly high IOPS and throughput, but the total IOPS and throughput of all your volumes can't exceed the total IOPS and throughput your SAN has.

Using the same example of a 100 TiB SAN that has 500,000 IOPS and 20,000 MB/s. Say this SAN had 100 1 TiB volumes. You could potentially have six of these volumes operating at their maximum performance (80,000 IOPS, 1,280 MB/s) since this would be below the SAN's limits. But if seven volumes all needed to operate at maximum at the same time, they wouldn't be able to. Instead the performance of the SAN would be split evenly among them.

## Networking

In the Elastic SAN Preview, you can enable or disable public network access at the Elastic SAN level. You can also configure access to volume groups in the SAN over both public [Storage service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) and [private endpoints](../../private-link/private-endpoint-overview.md) from selected virtual network subnets. Once network access is configured for a volume group, the configuration is inherited by all volumes belonging to the group. If you disable public access at the SAN level, access to the volume groups within that SAN is only available over private endpoints, regardless of individual configurations for the volume group.

To allow network access or an individual volume group, you must [enable a service endpoint for Azure Storage](elastic-san-networking.md#configure-an-azure-storage-service-endpoint) or a [private endpoint](elastic-san-networking.md#configure-a-private-endpoint) in your virtual network, then [setup a network rule](elastic-san-networking.md#configure-virtual-network-rules) on the volume group for any service endpoints. You don't need a network rule to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints. You can then mount volumes from [AKS](elastic-san-connect-aks.md), [Linux](elastic-san-connect-linux.md), or [Windows](elastic-san-connect-windows.md) clients in the subnet with the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol.

## Redundancy

To protect the data in your Elastic SAN against data loss or corruption, all SANs store multiple copies of each file as they're written. Depending on the requirements of your workload, you can select additional degrees of redundancy. The following data redundancy options are currently supported:

- **Locally-redundant storage (LRS)**: With LRS, every SAN is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs within the data center, all replicas of an Elastic SAN using LRS could be lost or unrecoverable.
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
- RESERVE
- RELEASE
- PERSISTENT RESERVE IN
- PERSISTENT RESERVE OUT

The following iSCSI features aren't currently supported:
- CHAP authorization
- Initiator registration
- iSCSI Error Recovery Levels 1 and 2
- ESXi iSCSI flow control
- More than one LUN per iSCSI target

## Next steps

- [Networking options for Elastic SAN Preview](elastic-san-networking-concepts.md)
- [Deploy an Elastic SAN Preview](elastic-san-create.md)

For a video that goes over the general planning and deployment with a few example scenarios, see [Getting started with Azure Elastic SAN](/shows/inside-azure-for-it/getting-started-with-azure-elastic-san).
