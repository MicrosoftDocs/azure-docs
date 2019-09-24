---
title: Azure HPC Cache overview 
description: Describes Azure HPC Cache, a file access accelerator solution for high-performance computing 
author: ekpgh
ms.service: hpc-cache
ms.topic: overview
ms.date: 09/06/2019
ms.author: v-erkell
---

# What is Azure HPC Cache?

Azure HPC Cache speeds access to your data for high-performance computing (HPC) tasks. By caching files in Azure, it makes the scalability of cloud computing available even for workflows where your data is stored across WAN links, such as in your local datacenter Network-Attached Storage (NAS) environment.

Azure HPC Cache is easy to launch and monitor from the Azure portal. Existing NFS storage or new Blob containers can become part of its aggregated namespace, which makes client access simple even if you change the back-end storage target.

## Use cases

Azure HPC Cache enhances productivity best for workflows like these:

* Read-heavy file access workflow
* Data stored in NFS-accessible storage, Azure Blob, or both
* Compute farms of up to 75,000 CPU cores

Azure HPC Cache can be added to a wide variety of workflows across many industries. Any system where a large number of machines need to access a set of files at scale and with low latency will benefit from this service. The sections below give specific examples.

### Visual effects (VFX) rendering

In media and entertainment, Azure HPC Cache can speed up data access for time-critical rendering projects. VFX rendering workflows often require last-minute processing by large numbers of compute nodes. Data for these workflows are typically located in an on-premises NAS environment. Azure HPC Cache can cache that file data in the cloud to reduce latency and enhance flexibility for on-demand rendering.

### Life sciences

Many life sciences workflows can benefit from scale-out file caching.

A research institute that wants to port its genomic analysis workflows into Azure can easily shift them by using Azure HPC Cache. Because the cache provides POSIX file access, they can run their existing client-side workflow in the cloud without any changes.

Azure HPC Cache also can be leveraged to improve efficiency in tasks like secondary analysis, pharmacological simulation, or AI-driven image analysis.

### Financial services analytics

An Azure HPC Cache can help speed up quantitative analysis calculations, risk analysis workloads, and Monte Carlo simulations to give financial services companies better insight to make strategic decisions.

## Region availability

Azure HPC Cache is available in these Azure regions:

* East US
* East US 2
* North Europe
* West Europe
* Southeast Asia
* West US 2

Check the [Azure HPC Cache product page](<https://azure.microsoft.com/services/hpc-cache>) for the latest availability information.

## Next steps

* Read the [Azure HPC Cache product page](<https://azure.microsoft.com/services/hpc-cache>) to learn more about its capabilities
* Learn about product [prerequisites](hpc-cache-prereqs.md)
* [Create an Azure HPC Cache](hpc-cache-create.md) from the Azure portal
