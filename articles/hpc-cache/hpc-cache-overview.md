---
title: Azure HPC Cache overview 
description: Describes Azure HPC Cache, a file access accelerator solution for high-performance computing 
author: ekpgh
ms.service: hpc-cache
ms.topic: overview
ms.date: 08/26/2019
ms.author: v-erkell
---

# What is Azure HPC Cache? 

Azure HPC Cache speeds access to your data for high-performance computing (HPC) tasks. By caching data in Azure, it makes the scalability of cloud computing available even for workflows where data is stored in on-premises hardware.

Azure HPC Cache is easy to launch and monitor from the Azure portal. Existing NFS storage or new Blob containers can become part of its aggregated namespace, with a virtual filesystem that makes client access simple, even if you change the back-end storage target.

## Use cases

Azure HPC Cache enhances productivity best for workflows like these:

* Read-heavy file access workflow 
* Data stored in NFS-accessible on-premises storage, Azure Blob, or both 
* Compute farms of 1000 to 100,000 CPU cores

It can be used with a wide variety of workflows.

### Visual effects rendering

In media and entertainment, Azure HPC Cache can speed up data access for time-critical rendering projects. Add cache instances or more Azure compute nodes for maximum flexibility in large, time-critical projects.

### Life sciences

Azure HPC Cache can let researchers run their secondary analysis workflows in Azure Compute, and access genomic data no matter their location.

### Financial services analytics

An Azure HPC Cache can help speed up quantitative analysis calculations, which gives financial services companies better insight to make strategic decisions.

## Next steps

* Read the [Azure HPC Cache product page](<https://azure.microsoft.com/services/hpc-cache>) to learn more about its capabilities
* Learn about product [prerequisites](hpc-cache-prereqs.md)
* [Create an Azure HPC Cache](hpc-cache-create.md) from the Azure portal
