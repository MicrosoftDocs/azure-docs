<properties
  pageTitle="Azure and Linux Storage | Microsoft Azure"
  description="Describes Azure Storage with Linux virtual machines."
  services="virtual-machines-linux"
  documentationCenter="virtual-machines-linux"
  authors="vlivech"
  manager="timlt"
  editor=""/>

<tags
  ms.service="virtual-machines-linux"
  ms.devlang="NA"
  ms.topic="article"
  ms.tgt_pltfrm="vm-linux"
  ms.workload="infrastructure"
  ms.date="09/16/2016"
  ms.author="v-livech"/>

# Azure and Linux storage

Azure Storage is the cloud storage solution for modern applications that rely on durability, availability, and scalability to meet the needs of their customers.  In addition to making it possible for developers to build large-scale applications to support new scenarios, Azure Storage also provides the storage foundation for Azure Virtual Machines, a further testament to its robustness.

Azure Storage is massively scalable, so you can store and process hundreds of terabytes of data to support the big data scenarios required by scientific, financial analysis, and media applications. Or you can store the small amounts of data required for a small business website. Wherever your needs fall, you pay only for the data you’re storing. Azure Storage currently stores tens of trillions of unique customer objects, and handles millions of requests per second on average.

- [Get started with Azure Storage in five minutes](storage-getting-started-guide.md)


## Standard storage
## Premium storage

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. Virtual machine (VM) disks that use Premium Storage store data on solid state drives (SSDs). You can migrate your application's VM disks to Azure Premium Storage to take advantage of the speed and performance of these disks.

Premium storage features:

- Premium Storage Disks: Azure Premium Storage supports VM disks that can be attached to DS, DSv2 or GS series Azure VMs.

- Premium Page Blob: Premium Storage supports Azure Page Blobs, which are used to hold persistent disks for Azure Virtual Machines (VMs).

- Premium Locally Redundant Storage: A Premium Storage account only supports Locally Redundant Storage (LRS) as the replication option and keeps three copies of the data within a single region.

- [Premium Storage](../storage/storage-premium-storage.md)

## File storage


## Redundancy

The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability, meeting the Azure Storage SLA even in the face of transient hardware failures.

When you create a storage account, you must select one of the following replication options:

- Locally redundant storage (LRS)
- Zone-redundant storage (ZRS)
- Geo-redundant storage (GRS)
- Read-access geo-redundant storage (RA-GRS)

## Locally redundant storage
Locally redundant storage (LRS) replicates your data within the region in which you created your storage account. To maximize durability, every request made against data in your storage account is replicated three times. These three replicas each reside in separate fault domains and upgrade domains.  A request returns successfully only once it has been written to all three replicas.

## Zone-redundant storage
Zone-redundant storage (ZRS) replicates your data across two to three facilities, either within a single region or across two regions, providing higher durability than LRS. If your storage account has ZRS enabled, then your data is durable even in the case of failure at one of the facilities.

## Geo-redundant storage
Geo-redundant storage (GRS) replicates your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable.

## Read-access geo-redundant storage
Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account, by providing read-only access to the data in the secondary location, in addition to the replication across two regions provided by GRS. In the event that data becomes unavailable in the primary region, your application can read data from the secondary region.

For a deep dive into Azure storage redundancy see:

- [Azure Storage replication](../storage/storage-redundancy.md)

## Scalability

## Availability

## Regions

- [Azure regions map](https://azure.microsoft.com/regions/)

## Security

Azure Storage provides a comprehensive set of security capabilities which together enable developers to build secure applications. The storage account itself can be secured using Role-Based Access Control and Azure Active Directory. Data can be secured in transit between an application and Azure by using Client-Side Encryption, HTTPS, or SMB 3.0. Data can be set to be automatically encrypted when written to Azure Storage using Storage Service Encryption (SSE). OS and Data disks used by virtual machines can be set to be encrypted using Azure Disk Encryption. Delegated access to the data objects in Azure Storage can be granted using Shared Access Signatures.

## Management Plane Security

The management plane consists of the resources used to manage your storage account. In this section, we’ll talk about the Azure Resource Manager deployment model and how to use Role-Based Access Control (RBAC) to control access to your storage accounts. We will also talk about managing your storage account keys and how to regenerate them.

## Data Plane Security

In this section, we’ll look at allowing access to the actual data objects in your Storage account, such as blobs, files, queues, and tables, using Shared Access Signatures and Stored Access Policies. We will cover both service-level SAS and account-level SAS. We’ll also see how to limit access to a specific IP address (or range of IP addresses), how to limit the protocol used to HTTPS, and how to revoke a Shared Access Signature without waiting for it to expire.

## Encryption in Transit

This section discusses how to secure data when you transfer it into or out of Azure Storage. We’ll talk about the recommended use of HTTPS and the encryption used by SMB 3.0 for Azure File Shares. We will also take a look at Client-side Encryption, which enables you to encrypt the data before it is transferred into Storage in a client application, and to decrypt the data after it is transferred out of Storage.

## Encryption at Rest

We will talk about Storage Service Encryption (SSE), and how you can enable it for a storage account, resulting in your block blobs, page blobs, and append blobs being automatically encrypted when written to Azure Storage. We will also look at how you can use Azure Disk Encryption and explore the basic differences and cases of Disk Encryption versus SSE versus Client-Side Encryption. We will briefly look at FIPS compliance for U.S. Government computers.

- [Azure Storage security guide](../storage/storage-security-guide.md)

## Cost savings

- [Storage cost](https://azure.microsoft.com/pricing/details/storage/)

- [Storage cost calculator](https://azure.microsoft.com/pricing/calculator/?service=storage)
## Storage limits

- [Storage Service limits](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/#storage-limits)
