---
title: FAQ - Avere vFXT for Azure
description: Frequently asked questions about Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---


# Avere vFXT for Azure FAQ

This article answers questions that can help you decide if the Avere vFXT solution is right for your needs. It gives basic information about Avere vFXT's capabilities and explains how it works with other Azure components and with products from outside vendors. 

## General 

### What is Avere vFXT for Azure?

Avere vFXT for Azure is a high-performance file system that caches active data in Azure Compute for efficient processing of critical workloads.

### Is the Avere vFXT a storage solution?

No. Avere vFXT is a filesystem **cache** that attaches to storage environments, such as your EMC or NetApp NAS or a Blob container. The vFXT streamlines data requests from clients, and caches the data it serves to improve performance at scale and over time. The vFXT itself does not store data. It has no information about the amount of data stored behind it.

### Is the Avere vFXT a tiering solution?

The Avere vFXT does not automatically tier data between hot and cool tiers.  

### How do I know if an environment is right for the Avere vFXT?

The best way to think about this question is to ask, "Is the workload cacheable?" That is, does the workload have a high read to write ratio - for example, 80/20 or 70/30 reads/writes.

Consider Avere vFXT for Azure if you have a file-based analytic pipeline that runs across a large number of Azure virtual machines, and it meets one or more of the following conditions:

* Overall performance is slow or inconsistent because of long file access times (tens of milliseconds or seconds, depending on requirements). This latency is unacceptable to the end customer.

* Data required for processing is located at the far end of a WAN environment, and moving that data permanently is impractical. The data might be in a different Azure region or in a customer datacenter.

* A significant number of clients are requesting the data - for example, in a high-performance computing (HPC) cluster. The large number of concurrent requests can increase latency.

* The customer wants to run their current pipeline "as-is" in Azure virtual machines, and needs a POSIX-based shared storage (or caching) solution for scalability. By using Avere vFXT for Azure, you do not have to rearchitect the work pipeline to make native calls to Azure Blob storage.

* Your HPC application is based on NFSv3 clients. (In some circumstances, SMB 2.1 clients can be used, but performance is limited.)

   The graphic below attempts to simplify the answer to this question. The closer your workflow is to the upper right, the more likely it is that the Avere caching solution is right for your environment.

   ![diagram showing that read-heavy loads with thousands of clients are better suited for Avere vFXT](media/avere-vfxt-fit-assessment.png)

### At what scale of clients does the Avere vFXT solution make the most sense?

The vFXT cache solution is built to handle hundreds, thousands, or tens of thousands of compute cores. If you have a few machines running light work, Avere vFXT is not the right solution.

Typical Avere vFXT customers run demanding workloads starting at about 1,000 CPU cores. These environments can be as large as 50,000 cores or more. Because the vFXT is scalable, you can add nodes to support these workloads as they grow to require more throughput or more IOPS.

### How much data can an Avere vFXT environment store?

Avere vFXT is a cache, it doesn't specifically store data. It uses a combination of RAM and SSDs to store the cached data. The data is permanently stored on a back-end storage system (for example, a NetApp NAS system or a Blob container). The Avere vFXT system does not have information about the amount of data stored behind it; the vFXT only caches the subset of that data that clients request.  

### What regions are supported?

As of November 1, 2018, Avere vFXT for Azure is supported in all regions except for sovereign regions (China, Germany) and government regions. Make sure that the region you want to use can support the large quantity of compute cores as well as the VM instances needed to create the Avere vFXT cluster. Sovereign regions and government clouds are not yet supported.

### How do I get help with the Avere vFXT?

A specialized support group offers help with the Avere vFXT for Azure. Follow the instructions in [Get help with your system](avere-vfxt-open-ticket.md#open-a-support-ticket-for-your-avere-vfxt) to open a support ticket from the Azure portal. 

### Is the Avere vFXT highly available?

Yes, the Avere vFXT runs exclusively as an HA solution.

### Does Avere vFXT for Azure also support other cloud services?

Yes, customers can use more than one cloud provider with the Avere vFXT cluster. It supports AWS S3 standard buckets and Google Cloud Services standard buckets as well as Azure Blob containers. 

> [!NOTE] 
> A software fee applies to use Avere vFXT in AWS or Google Cloud, but not with Azure.

## Technical - Compute

### Can you describe what an Avere vFXT environment "looks like"?

The Avere vFXT is a clustered appliance made of multiple Azure virtual machines. A Python library handles cluster creation, deletion, and modification. Read [What is Avere vFXT for Azure?](avere-vfxt-overview.md) to learn more. 

### What kind of Azure virtual machines does the Avere vFXT run on?  

Avere vFXT for Azure cluster uses either Microsoft Azure E32s_v3 or D16s_v3 virtual machines. 

### Can I mix and match virtual machine types for my cluster?

No, you must choose one virtual machine type or the other.
	
### Can I move between virtual machine types?

Yes, there is a migration path to move from one VM type to the other. [Open a support ticket](avere-vfxt-open-ticket.md#open-a-support-ticket-for-your-avere-vfxt) to learn how.

### Does the Avere vFXT environment scale?

The Avere vFXT cluster can be as small as three virtual machine nodes or as large as 24 nodes. Contact Azure technical support for help planning if you believe you need a cluster of more than nine nodes. The larger number of nodes requires larger deployment architecture.

### Does the Avere vFXT environment "autoscale"?

No. You can scale the cluster size up and down, but adding or removing cluster nodes is a manual step.

### Can I run the vFXT cluster as a virtual machine scale set?

Avere vFXT does not support virtual machine scale set (VMSS) deployment. Several built-in availability support mechanisms are designed only for atomic VMs participating in a cluster.  

### Can I run the vFXT cluster on low-priority VMs?

No, the system requires an underlying stable set of virtual machines.

### Can I run the vFXT cluster in containers?

No, the Avere vFXT must be deployed as an independent application.

### Do the Avere vFXT VMs count against my compute quota?

Yes. Make sure you have sufficient quota in the region to support the cluster.  

### Can I run the Avere vFXT cluster machines in different availability zones?

No. The high availability model used in Avere vFXT currently does not support individual vFXT cluster members located in different availability zones.

### Can I clone Avere vFXT virtual machines?

No, you must use the supported Python script to add or remove nodes in the Avere vFXT cluster. For more information, read [Manage the Avere vFXT cluster](avere-vfxt-manage-cluster.md).  

### Is there a "VM" version of the software I can run in my own local environment?

No, the system is offered as a clustered appliance and tested on specific virtual machine types. This restriction helps customers avoid creating a system that can't support the high performance requirements of a typical Avere vFXT workflow. 

## Technical - Disks

### What type of disks are supported for the Azure VMs?

Avere vFXT for Azure can use 1-TB or 4-TB premium SSD configurations. The premium SSD configuration can be deployed as multiple managed disks.

### Does the cluster support unmanaged disks?

No, the cluster requires managed disks.

### Does the system support local (attached) SSDs?

Avere vFXT for Azure does not currently support local SSDs. Disks used for the Avere vFXT must be able to shut down and restart, but local attached SSDs in this configuration can only be terminated.

### Does the system support ultra SSDs?

No, the system supports premium SSD configurations only.

### Can I detach my premium SSDs and reattach them later to preserve cache contents between use?

Detaching and reattaching SSDs is unsupported. Metadata or file contents on the source might have changed between uses, which could cause data integrity issues.

### Does the system encrypt the cache?

Data is striped across the disks but is not encrypted. However, the disks themselves can be encrypted. More information can be found [here](https://docs.microsoft.com/azure/virtual-machines/linux/security-policy#encryption).

## Technical - Networking

### What network is recommended?

If using on-premises storage with the Avere vFXT, you should have a 1-Gbps or better network connection. If you have a small amount of data and are willing to copy data to the cloud before running jobs, VPN connectivity might be sufficient. 

> [!TIP] 
> The slower the network link is, the slower the initial cold reads will be. Slow reads increase the latency of the work pipeline. 

### Can I run the Avere vFXT in a different virtual network than my compute cluster?

Yes, you can create your Avere vFXT system in a different virtual network. Read [Plan your Avere vFXT system](avere-vfxt-deploy-plan.md) for details.

### Does the Avere vFXT require its own subnet?

Yes. The Avere vFXT runs strictly as a HA cluster and requires multiple IP addresses to operate. If the cluster is in its own subnet, you avoid the risk of IP address conflicts, which can cause problems for installation and normal operation. The cluster's subnet can be within the existing vnet as long as no IP addresses overlap.

### Can I run the Avere vFXT on Infiniband?

No, the Avere vFXT uses Ethernet/IP only.

### How do I access my on-premises NAS environment from the Avere vFXT?

The Avere vFXT environment is no different than any other Azure VM in that it requires routed access through a network gateway or VPN to the customer data center (and back). Consider using Azure ExpressRoute connectivity if it is available in your environment.

### What are the bandwidth requirements for the Avere vFXT?

The overall bandwidth requirement depends on two factors: 

* The amount of data being requested from the source 
* The client system's tolerance for latency during initial data loading  

For latency-sensitive environments, you should use a fiber solution with a minimum link speed of 1 Gbps. Use ExpressRoute if it's available.  

### Can I run the vFXT with public IP addresses?

No, the vFXT is meant to be operated within a network environment secured using best practices.  

## Technical - Backend storage (core filers)

### How many core filers does a single Avere vFXT environment support?

An Avere vFXT cluster supports up to 20 core filers. 

### How does the Avere environment store data?

The Avere vFXT is not storage. It is a cache that reads and writes data from multiple storage targets called core filers. Data stored on the Avere vFXT's premium SSD disks is transient and is eventually flushed to the backend core filer storage.

### Which core filers does Avere vFXT support?

In general terms, Avere vFXT for Azure supports the following systems as core filers: 

* Dell EMC Isilon (OneFS 7.1, 7.2, 8.0 and 8.1) 
* NetApp ONTAP (Clustered Mode 9.4, 9.3, 9.2, 9.1P1, 8.0 - 8.3) and (7-Mode 7.*, 8.0 - 8.3) 
* Azure Blob containers (LRS only) 
* AWS S3 buckets 
* Google Cloud buckets

### Why doesn't the Avere vFXT support all NFS filers?

Although all NFS platforms meet the same IETF standards, in practice each implementation has its own quirks. These details affect how the Avere vFXT interacts with the storage system. The supported systems are the most widely used platforms in the marketplace.

### Does Avere vFXT support private object storage (such as Swiftstack)?

Avere vFXT does not support private object storage.

### How can I get a specific storage product under support?

Support is based on the amount of demand in the field. If there are enough revenue-based requests to support a given NAS solution, it will be considered. Make requests through Azure support.

### Can I use Azure Blob storage as a core filer?

Yes, Avere vFXT for Azure can use a block Blob container as a cloud core filer.  

### What are the storage account requirements for a Blob core filer?

Your storage account must be a general-purpose v2 (GPv2) account and configured for locally redundant storage (LRS) only. GRS and ZRS are not supported.

### Can I use Archive Blob storage?

No. The SLA for Archive storage is not compatible with real-time directory and file access needs of the vFXT system. 

### Can I use cool Blob storage?

You can use the cool tier, but note that the rate of operations will be much higher. 

### How do I encrypt the Blob container?

You can either configure Blob encryption in Azure (preferred) or at the vFXT core filer level.  

### Can I use my own encryption key for a Blob core filer?

By default, data is encrypted using Microsoft Managed Keys for Azure Blobs, Tables, Files, and Queues. You can bring your own key for encryption for Azure Blobs and Files. If you choose to use vFXT encryption, you must use the Avere-generated key and store it locally. 

## Purchasing

### How do I get Avere vFXT for Azure licensing?

Getting an Avere vFXT for Azure license is easy through the Azure Marketplace. Sign up for an Azure account and then follow the instructions in [Deploy the vFXT cluster](avere-vfxt-deploy.md) to create an Avere vFXT cluster. 

### How much does the Avere vFXT cost?

In Azure, there is no additional licensing fee for using Avere vFXT clusters. Customers are responsible for storage and other Azure consumption fees.

### Can Avere vFXT VMs be run as low priority?

No, Avere vFXT clusters require "always on" service. The clusters can be turned off when not needed. 

## Next steps

To get started with Avere vFXT for Azure, read these links to learn how to plan and deploy your own system:

* [Plan your Avere vFXT system](avere-vfxt-deploy-plan.md)
* [Deployment overview](avere-vfxt-deploy-overview.md)
* [Prepare to create the Avere vFXT](avere-vfxt-prereqs.md)
* [Deploy the vFXT cluster](avere-vfxt-deploy.md)

To learn more about Avere vFXT's capabilities and use cases, visit [Avere vFXT for Azure](https://azure.microsoft.com/services/storage/avere-vfxt/).
