---
title: NFS 3.0 recommendations for performance benchmark in Azure Blob Storage
titleSuffix: Azure Storage
description: Recommendations for executing performance benchmark for NFS 3.0 on Azure Blob Storage
author: dukicn
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 02/02/2024
ms.author: nikoduki
---

# Performance benchmark test recommendations for NFS 3.0 on Azure Blob Storage

This article provides benchmark testing recommendations and metrics analysis for NFS 3.0 on Azure Blob Storage. Since NFS 3.0 is mostly used in Linux environments, article focuses on Linux tools only. In many cases, other operating systems can be used, but tools and commands might change.

## Overview

Storage performance testing is done to evaluate and compare different storage services. There are many ways how to perform it, but three most common ones are:

1. using standard Linux commands, typically cp or dd
1. using performance benchmark tools like fio, vdbench, ior, etc.
1. using real-world application that is used in production

**Using standard Linux commands** is the simplest method for performance benchmark testing, but also least recommended. Method is simple as tools exist on every Linux environment and users are familiar with them. Results are often impacted by multiple aspects, not only storage and results must be carefully analyzed to fully understand them. Two commands that are typically used:
- testing with `cp` command copies one or more files from source to the destination storage service and measuring the time it takes to fully finish the operation. This command performs buffered, not direct IO and depends on buffer sizes, operating system, threading model, etc. On the other hand, some real-world applications behave in similar way and sometimes represent a good use case.
- second often used command is `dd`. Command is single threaded and in large scale bandwidth testing, results are limited by the speed of a single CPU core. It's possible to run multiple commands at the same time and assign them to different cores, but that complicates the testing and aggregating results. It's also much simpler to run some of the performance benchmarking tools.

**Using performance benchmark tools** represents a synthetic performance testing that is common in comparing different storage services. Tools are properly designed to utilize available client resources to maximize the storage throughput. Most of the tools are configurable and allow to mimic real-world applications, at least the simpler ones. 

**Using real-world application** is always the best method as it measures performance for real-world workloads that users are running on top of storage service. However, this method is often not practical as it requires replica of the production environment and end-users to generate proper load on the system. Some applications do have a load generation capability and should be used for performance benchmarking.

## Running performance benchmarks on Azure Blob Storage with NFS 3.0
Even though using real-world applications for performance testing is the best option, due to simplicity of testing setup, the most common method is using performance benchmarking tools. We show the recommended setup for running performance tests on Azure Blob Storage with NFS 3.0.

### Selecting virtual machine size
To properly execute performance testing, the first step is to correctly size a virtual machine used in testing. Virtual machine acts as a client that will run performance benchmarking tool. Most important aspect when selecting the virtual machine size for this test is available network bandwidth. The bigger virtual machine we select, better results we can achieve. If we run the test in Azure, we recommend using one of the [general purpose](/azure/virtual-machines/sizes-general) virtual machines.

### Creating a storage account with NFS 3.0
After selecting the virtual machine, we need to create storage account we will use in our testing. Follow our [how-to guide](network-file-system-protocol-support-how-to.md) for step-by-step guidance. We recommend reading [performance considerations for NFS 3.0 in Azure Blob Storage](network-file-system-protocol-support-how-to.md) before testing.  

### Executing performance benchmark
There are several performance benchmarking tools available to use on Linux environments. Any of them can be used to evaluate performance, we share our recommended approach with `fio`. It's available through standard package managers for each linux distribution or as an [open-source code](https://github.com/axboe/fio). Below are the most common test cases. For further customization and different parameters, consult [FIO documentation](https://fio.readthedocs.io/en/latest/index.html).

#### Test case 1: measuring read throughput

`fio --name=newfile1 --ioengine=libaio --directory=/mnt/pgandhimntpoint --direct=1 --blocksize=1M --readwrite=read --filesize=10G --end_fsync=1 --numjobs=8 --iodepth=1024 --runtime=60 --group_reporting --time_based=1`

#### Test case 2: measuring write throughput

`fio --name=newfile1 --ioengine=libaio --directory=/mnt/pgandhimntpoint --direct=1 --blocksize=1M --readwrite=write --filesize=10G --end_fsync=1 --numjobs=8 --iodepth=1024 --runtime=60 --group_reporting --time_based=1`

#### Test case 3: measuring sequential read IOPS

`fio --name=newfile1 --ioengine=libaio --directory=/mnt/pgandhimntpoint --direct=1 --blocksize=4K --readwrite=read --filesize=10G --end_fsync=1 --numjobs=8 --iodepth=1024 --runtime=60 --group_reporting --time_based=1`

#### Test case 4: measuring random read IOPS

`fio --name=newfile1 --ioengine=libaio --directory=/mnt/pgandhimntpoint --direct=1 --blocksize=4K --readwrite=randread --filesize=10G --end_fsync=1 --numjobs=8 --iodepth=1024 --runtime=60 --group_reporting --time_based=1`

#### Test case 5: measuring sequential write IOPS

`fio --name=newfile1 --ioengine=libaio --directory=/mnt/pgandhimntpoint --direct=1 --blocksize=4K --readwrite=write --filesize=10G --end_fsync=1 --numjobs=8 --iodepth=1024 --runtime=60 –group_reporting –time_based=1`

#### Test case 6: measuring random write IOPS

`fio --name=newfile1 --ioengine=libaio --directory=/mnt/pgandhimntpoint --direct=1 --blocksize=4K --readwrite=randwrite --filesize=10G --end_fsync=1 --numjobs=8 --iodepth=1024 --runtime=60 –group_reporting –time_based=1`