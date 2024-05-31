---
title: What's new in Azure Disk Storage
description: Learn about new features and enhancements in Azure Disk Storage.   
author: roygara
ms.author: rogarana
ms.date: 01/22/2024
ms.topic: conceptual
ms.service: azure-disk-storage
ms.custom: references_regions
---

# What's new for Azure Disk Storage

Azure Disk Storage regularly receives updates for new features and enhancements. This article provides information about what's new in Azure Disk Storage.

## Update summary

- [What's new in 2024](#whats-new-in-2024)

  - [Quarter 2 (April, May, June)](#quarter-2-april-may-june)
    - [Generally available: New Property for Disks-LastOwnershipUpdateTime](#generally-available-new-property-for-disks-lastownershipupdatetime)
  - [Quarter 1 (January, February, March)](#quarter-1-january-february-march)
      - [Generally available: Azure VM Backup support for Ultra Disks and Premium SSD v2](#generally-available-azure-vm-backup-support-for-ultra-disks-and-premium-ssd-v2)
      - [Generally available: Trusted launch support for Ultra Disks and Premium SSD v2](#generally-available-trusted-launch-support-for-ultra-disks-and-premium-ssd-v2)
      - [Expanded regional availability for Ultra Disks](#expanded-regional-availability-for-ultra-disks)
      - [Expanded regional availability for zone-redundant storage disks](#expanded-regional-availability-for-zone-redundant-storage-disks)
- [What's new in 2023](#whats-new-in-2023)
    - [Quarter 4 (October, November, December)](#quarter-4-october-november-december)
        - [Encryption at host GA for Premium SSD v2 and Ultra Disks](#encryption-at-host-ga-for-premium-ssd-v2-and-ultra-disks)
        - [New latency metrics (preview)](#new-latency-metrics-preview)
        - [Expanded regional availability for Premium SSD v2](#expanded-regional-availability-for-premium-ssd-v2)
        - [Expanded regional availability for ZRS disks](#expanded-regional-availability-for-zrs-disks)
    - [Quarter 3 (July, August, September)](#quarter-3-july-august-september)
        - [Expanded regional availability for ZRS disks (1)](#expanded-regional-availability-for-zrs-disks-1)
        - [Expanded regional availability for Premium SSD v2](#expanded-regional-availability-for-premium-ssd-v2-1)
        - [General Availability - Incremental Snapshots for Premium SSD v2 and Ultra Disks](#general-availability---incremental-snapshots-for-premium-ssd-v2-and-ultra-disks)
    - [Quarter 2 (April, May, June)](#quarter-2-april-may-june)
        - [Expanded regional availability for Premium SSD v2 (2)](#expanded-regional-availability-for-premium-ssd-v2-2)
        - [Expanded regional availability for ZRS disks (2)](#expanded-regional-availability-for-zrs-disks-2)
        - [Azure Backup support (preview) for Premium SSD v2](#azure-backup-support-preview-for-premium-ssd-v2)
    - [Quarter 1 (January, February, March)](#quarter-1-january-february-march-1)
        - [Expanded regional availability for Premium SSD v2 (3)](#expanded-regional-availability-for-premium-ssd-v2-3)
        - [Preview - Performance plus](#preview---performance-plus)
        - [Expanded regional availability for Ultra Disks](#expanded-regional-availability-for-ultra-disks-1)
        - [More transactions at no extra cost - Standard SSDs](#more-transactions-at-no-extra-cost---standard-ssds)
        - [GA: Create disks from snapshots encrypted with customer-managed keys across subscriptions](#ga-create-disks-from-snapshots-encrypted-with-customer-managed-keys-across-subscriptions)
        - [GA: Entra ID support for managed disks](#ga-entra-id-support-for-managed-disks)

## What's new in 2024

### Quarter 2 (April, May, June)

#### Generally Available: New Property for Disks-LastOwnershipUpdateTime

We are excited to introduce a new property for disks in the Azure Portal, Azure PowerShell module, and Azure CLI. This property, `LastOwnershipUpdateTime`, reflects the time when a disk’s state was last changed. This property can be used with the `diskState` to identify the current state of a disk, and when it was last updated. For more information, see the [Azure Update](https://azure.microsoft.com/updates/ga-new-property-for-diskslastownershipupdatetime/) or [the documentation.](/azure/virtual-machines/windows/find-unattached-disks)

### Quarter 1 (January, February, March)

#### Generally available: Azure VM Backup Support for Ultra Disks and Premium SSD v2

Azure Backup enabled support on Azure VMs using Ultra Disks and Premium SSD v2 that offers high throughput, high IOPS, and low latency. Azure VM Backup support allows you to ensure business continuity for your virtual machines and to recover from any disasters or ransomware attacks. Enabling backup on VMs using Ultra Disks and Premium SSD v2 is available in all regions where creation of Ultra disks and Premium SSD v2 are supported. To learn more, refer to the [documentation](../backup/backup-support-matrix-iaas.md#vm-storage-support) and enable backup on your Azure VMs. 


#### Generally available: Trusted launch support for Ultra Disks and Premium SSD v2

Trusted launch VMs added support for Ultra Disks and Premium SSD v2, allowing you to combine the foundational compute security of Trusted Launch with the high throughput, high IOPS, and low latency of Ultra Disks and Premium SSD v2. For more information, see [Trusted launch for Azure virtual machines](trusted-launch.md) or the [Azure Update](https://azure.microsoft.com/updates/premium-ssd-v2-and-ultra-disks-support-with-trusted-launch-vm/).

#### Expanded regional availability for Ultra Disks

Ultra Disks were made available in the UK West and Poland Central regions.

#### Expanded regional availability for zone-redundant storage disks

Zone-redundant storage (ZRS) disks were made available in West US 3 and Germany Central regions.

## What's new in 2023

### Quarter 4 (October, November, December)

#### Encryption at host GA for Premium SSD v2 and Ultra Disks

Encryption at host was previously only available for Standard HDDs, Standard SSDs, and Premium SSDs. Encryption at host is now also available as a GA offering for Premium SSD v2 and Ultra Disks. For more information on encryption at host, see [Encryption at host - End-to-end encryption for your VM data](disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

There are some additional restrictions for Premium SSD v2 and Ultra Disks that enable encryption at host. For more information, see [Restrictions](disk-encryption.md#restrictions-1).

#### New latency metrics (preview)

Metrics dedicated to monitoring latency are now available as a preview feature. To learn more, see either the [metrics article](disks-metrics.md#disk-io-throughput-queue-depth-and-latency-metrics) or the [Azure Update](https://azure.microsoft.com/updates/latency-metrics-for-azure-disks-and-performance-metrics-for-temporary-disks-on-azure-virtual-machines/).

#### Expanded regional availability for Premium SSD v2

Premium SSD v2 disks were made available in Poland Central, China North 3, and US Gov Virginia. For more information, see the [Azure Update](https://azure.microsoft.com/updates/generally-available-azure-premium-ssd-v2-disk-storage-is-now-available-in-more-regions-pcu/).


#### Expanded regional availability for ZRS disks

ZRS disks were made available in the Norway East and UAE North regions. For more information, see the [Azure Update](https://azure.microsoft.com/updates/generally-available-zone-redundant-storage-for-azure-disks-is-now-available-in-norway-east-uae-north-regions/).

### Quarter 3 (July, August, September)

#### Expanded regional availability for ZRS disks

In quarter 3, ZRS disks were made available in the China North 3, East Asia, India Central, Switzerland North, South Africa North, and Sweden Central regions.

#### Expanded regional availability for Premium SSD v2

In Quarter 3, Premium SSD v2 were made available in the Australia East, Brazil South, Canada Central, Central India, Central US, East Asia, France Central, Japan East, Korea Central, Norway East, South Africa North, Sweden Central, Switzerland North, and UAE North regions.

#### General Availability - Incremental Snapshots for Premium SSD v2 and Ultra Disks

Incremental snapshots for Premium SSD v2 and Ultra Disks were made available as a general availability (GA) feature. For more information, see either the [documentation](disks-incremental-snapshots.md#incremental-snapshots-of-premium-ssd-v2-and-ultra-disks) or the [Azure Update](https://azure.microsoft.com/updates/general-availability-incremental-snapshots-for-premium-ssd-v2-disk-and-ultra-disk-storage-3/).

### Quarter 2 (April, May, June)

#### Expanded regional availability for Premium SSD v2

In quarter 2, Premium SSD v2 disks were made available in the Southeast Asia, UK South, South Central US, and West US 3 regions.

#### Expanded regional availability for ZRS disks

In quarter 2, ZRS disks were made available in the Australia East, Brazil South, Japan East, Korea Central, Qatar Central, UK South, East US, East US 2, South Central US, and Southeast Asia regions.

#### Azure Backup support (preview) for Premium SSD v2

Azure Backup added preview support for Azure virtual machines using Premium SSD v2 disks in the East US and West Europe regions. For more information, see the [Azure Update](https://azure.microsoft.com/updates/premium-ssd-v2-backup-support/).

### Quarter 1 (January, February, March)

#### Expanded regional availability for Premium SSD v2

In quarter 1, Premium SSD v2 disks were made available in the East US 2, North Europe, and West US 2 regions.

#### Preview - Performance plus

Azure Disk Storage added a new preview feature, performance plus. Performance plus enhances the IOPS and throughput performance for Premium SSDs, Standard SSDs, and Standard HDDs that are 513 GiB and larger. For details, see [Increase IOPS and throughput limits for Azure Premium SSDs and Standard SSD/HDDs](disks-enable-performance.md)

#### Expanded regional availability for Ultra Disks

In quarter 1, Ultra Disks were made available in the Brazil Southeast, China North 3, Korea South, South Africa North, Switzerland North, and UAE North regions.

#### More transactions at no extra cost - Standard SSDs

In quarter 1, we added an hourly limit to the number of transactions that can occur a billable cost. Any transactions beyond that limit don't occur a cost. For more information, see the [blog post](https://aka.ms/billedcapsblog) or [Standard SSD transactions](disks-types.md#standard-ssd-transactions).

#### GA: Create disks from snapshots encrypted with customer-managed keys across subscriptions

In quarter 1, support for creating disks from snapshots or other disks encrypted with customer-managed keys in different subscriptions while within the same tenant was added. For more information, see either the [Azure Update](https://azure.microsoft.com/updates/ga-create-disks-from-cmkencrypted-snapshots-across-subscriptions-and-in-the-same-tenant/) or [the documentation](disk-encryption.md#customer-managed-keys).

#### GA: Entra ID support for managed disks

In quarter 1, support for using Entra ID to secure uploads and downloads of managed disks was added. For details, see [Secure downloads with Microsoft Entra ID](linux/download-vhd.md#secure-downloads-and-uploads-with-microsoft-entra-id) or [Secure uploads with Microsoft Entra ID](windows/disks-upload-vhd-to-managed-disk-powershell.md#secure-uploads-with-microsoft-entra-id).

## Next steps

- [Azure managed disk types](disks-types.md)
- [Introduction to Azure managed disks](managed-disks-overview.md)
