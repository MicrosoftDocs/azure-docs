---
title: Understand Azure NetApp Files cache volumes
description: Understand what is Azure NetApp Files cache volumes and the benefits of using Azure NetApp Files cache volumes    
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 11/06/2025
ms.author: anfdocs
ms.custom: references_regions
# Customer intent: As a cloud administrator, I want to understand about Azure NetApp Files cache volumes and the benefits of using Azure NetApp Files cache volumes. 
---

# Understand Azure NetApp Files cache volumes (preview)

Azure NetApp Files cache volumes enable you to create a cloud-based cache of your external NetApp ONTAP and Cloud Volumes ONTAP storage volumes in Azure. Caching active ("hot") data closer to users and cloud applications improves data access speeds and throughput over WAN connections. This results in cost-effective, low-latency remote access to important files. In practical terms, you can burst on-premises datasets to Azure with near-local performance—ideal for running computational workloads in Azure on your on-premises data or enabling globally distributed teams to collaborate without lengthy file transfer delays.  

## What are cache volumes 

A cache volume in Azure NetApp Files is a cloud-based cache of an "origin" volume, which may reside on-premises or in Cloud Volumes ONTAP.  

:::image type="content" source="./media/cache-volumes/understand-cache-volumes.png" alt-text="Screenshot that shows the architecture of cache volumes." lightbox="./media/cache-volumes/understand-cache-volumes.png":::

The cache volume stores only the most frequently accessed data from the origin, synchronizing transparently to maintain consistency. When an application in Azure reads blocks of a file, if the blocks are present in the cache (a cache hit), they're delivered instantly over the local network. If not (a cache miss), Azure NetApp Files fetches the data blocks from the origin, stores them in the cache, and returns them to the application. Subsequent reads are served directly from Azure at LAN-like speeds. 

Cache volumes support both reads and writes. New data saved to the cache volume is asynchronously written back to the origin, ensuring the origin remains the authoritative copy. This *write-back* caching provides near-local write latency, even when the primary storage is in a remote location. Effectively, cache volumes create a distributed file system spanning on-premises and Azure environments: active data is cached in the cloud for fast access, while the authoritative dataset stays in its original location. 

## Why cache volumes matter 

Organizations often struggle to deliver fast, consistent data access across locations, traditionally duplicating data or accepting high latency for remote access. Cache volumes solve this by providing a smart caching layer, allowing you to keep a single source of truth while Azure acts as a caching tier. Frequently used datasets are available on-demand in Azure with minimal latency and stay synchronized with central storage. Standard file protocols (NFSv3, NFSv4.1, SMB3, and dual-protocol) are supported, requiring no application changes. Management is seamless via the Azure portal. 

## Key Benefits and Use Cases 

Cache volumes unlock a range of scenarios by combining on-premises data "gravity" with cloud agility: 

* **Global Collaboration**

    Distributed teams get LAN-speed access to shared files without maintaining multiple copies. Everyone works on the same central dataset with fast, local reads and writes.

* **Hybrid Cloud Bursting**

    Burst on-premises workloads into Azure on demand, without lengthy data copies. Only needed data is fetched into Azure in real time, minimizing setup time and network load.

* **Global workload relocation** 

    Relocate HPC workloads quickly and efficiently to overcome regional CPU/GPU shortages. 

* **Data-Intensive Workloads**
    Cache "hot" data near Azure compute, minimizing I/O wait times for read-heavy or latency-sensitive jobs. This leads to faster job completion and higher productivity.  
    
* **Lower Costs & Complexity**
    Serve frequent requests from the Azure NetApp Files cache in Azure, reducing WAN traffic and bandwidth costs. No need for duplicate storage systems at every location; cache only stores what’s actively used. 

## Seamless Integration 

Cache volumes require no special hardware or proxies and use standard protocols, so applications need no modification. Azure NetApp Files cache volumes handle all cache synchronization and consistency, and permissions from the origin volume are preserved. This bridges on-premises and Azure environments securely and intuitively. 

## Supported regions 

Cache volumes are supported in the following regions: 

* Australia Central
* Australia Central 2
* Australia East
* Australia Southeast
* Brazil South
* Brazil Southeast
* Canada Central
* Canada East
* Central India
* Central US
* East Asia
* East US
* East US 2
* France Central
* Germany West Central
* Israel Central
* Italy North
* Japan East
* Korea Central
* Korea South
* North Central US
* North Europe
* Norway East
* Qatar Central
* South Africa North
* South Central US
* Southeast Asia
* Spain Central
* Sweden Central
* Switzerland North
* Switzerland West
* Taiwan North
* UAE North
* UK South
* UK West
* US Gov Arizona
* US Gov Texas
* US Gov Virginia
* West Europe
* West US
* West US 2
* West US 3


## Next steps

- [Configure a cache volume for Azure NetApp Files](configure-cache-volumes.md)

For more details, visit Configure a cache volume for Azure NetApp Files. 