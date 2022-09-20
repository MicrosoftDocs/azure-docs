---
title: Planning for an Azure Elastic SAN
description: Understand planning for an Azure Elastic SAN deployment. Learn about storage capacity, performance, redundancy, and encryption.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 08/13/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Elastic SAN planning

There are three main aspects to an elastic SAN: the SAN itself, volume groups, and volumes. When deploying a SAN, you make selections while configuring the SAN, including the redundancy of the entire SAN, as well as how much performance and storage the SAN has. Then you create volume groups that are used to manage volumes at scale. Any settings applied to a volume group are inherited by volumes inside that volume group. Finally, you partition the storage capacity that was allocated at the SAN-level into individual volumes.

Before deploying an Elastic SAN, consider the following:

- How much storage do you need?
- What level of performance do you need?
- What type of redundancy do you require?

Answering those three questions can help you to successfully provision a SAN that meets your needs.

## Storage and performance

There are two ways to provision storage for an Elastic SAN: You can either provision base capacity or additional capacity. Each TiB of base capacity also increases your SAN's IOPS and throughput but costs more than each TiB of additional capacity. Increasing additional capacity doesn't increase your SAN's IOPS or throughput. The maximum total capacity an elastic SAN can have is 1 pebibyte (PiB) and the minimum total capacity an elastic SAN can have is 64 tebibyte (TiB). Both base and additional capacity can be increased in 1 TiB increments.

When you provision this storage into an individual volume, you'll determine that volume's maximum performance.

### IOPS

Your SAN's IOPS increases by 5,000 per base TiB, up to a maximum of 5,120,000. So if you have an SAN that has 6 TiB of base capacity, that SAN would have 30,000 IOPS. That same SAN would still have 30,000 IOPS whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity.

The IOPS of a SAN is distributed among all its volumes. The maximum IOPS of an individual volume increases by 750 per gibibyte (GiB), up to a maximum of 64,000 IOPS. A volume needs at least 86 GiB to be capable of using its maximum IOPS.

### Throughput

Your SAN's throughput increases by 80 MB/s per base TiB, up to a maximum of 81,920 MB/s. So if you have an SAN that has 6 TiB of base capacity, that SAN would have 480 MB/s. That same SAN would have 480 MB/s throughput whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The throughput of an SAN is distributed among all its volumes.

The throughput of a SAN is distributed among all its volumes. The maximum throughput of an individual volume increases by 60 MB/s per GiB, up to a maximum of 1,024 MB/s. To use the maximum throughput, a volume needs at least 18 GiB of capacity.

### Recommendations

How you configure your SAN depends on your storage and performance needs.

15 TiB suggestion.

### Managed disks or SAN volumes

You might be debating between managed disks or an Elastic SAN for your storage needs.

A SAN volume can have up to 20 connections, whereas the maximum number of connections for a shared managed disk is 10.

## Networking

To configure network access, Elastic SAN integrates with Azure [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md), which restrict access to specified virtual networks. You configure volume groups to allow access only from specific subnets. Once a volume group is configured to allow access to these subnets, these configurations are inherited by all volumes belonging to the volume group. You can then mount volumes to any clients in the subnet, with the [internet Small Computer Systems Interface](https://en.wikipedia.org/wiki/ISCSI) (iSCSI) protocol.

## Redundancy

To protect the data in your Elastic SAN against data loss or corruption, all SANs store multiple copies of each file as they are written. Depending on the requirements of your workload, you can select additional degrees of redundancy. The following data redundancy options are currently supported:

- **Locally-redundant storage (LRS)**: With LRS, every SAN is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs within the data center, all replicas of an Elastic SAN using LRS may be lost or unrecoverable.
- **Zone-redundant storage (ZRS)**: With ZRS, three copies of each SAN are stored in three distinct and physically isolated storage clusters in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. A write request to storage that is using ZRS happens synchronously. The write operation only returns successfully after the data is written to all replicas across the three availability zones.

## Encryption

All data stored in an Elastic SAN is encrypted at rest using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: data is encrypted beneath the file system level. Azure Storage encryption protects your data and to help you to meet your organizational security and compliance commitments. Data stored in Elastic SAN is encrypted with Microsoft-managed keys. With Microsoft-managed keys, Microsoft holds the keys to encrypt/decrypt the data, and is responsible for rotating them on a regular basis.

Data in an Azure Elastic SAN is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all Elastic SANs. Azure Storage encryption can't be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption. There is no additional cost for Azure Storage encryption.

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal).