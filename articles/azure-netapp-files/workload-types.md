---
title: Understand workload types in Azure NetApp Files 
description: Choose the correct volume type depending on your Azure NetApp Files workload.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 10/31/2024
ms.author: anfdocs
---

# Understand workload types in Azure NetApp Files

When considering use cases for cloud storage, industry silos can often be broken down into workload types, since there can be commonalities across industries in specific workloads. For instance, a media workload can have a similar workload profile to an AI/ML training set with heavy sequential reads and writes. 

Azure NetApp Files is well suited for any type of workload from the low to high I/O, low to high throughput – from home directory to electronic design automation (EDA). Learn about the different workload types and develop an understanding of which Azure NetApp Files [volumes types](azure-netapp-files-understand-storage-hierarchy.md) are best suited for those workloads. 

For more information, see [Understand large volumes in Azure NetApp Files](large-volumes.md)

## Workload types 

* **Specific offset, streaming random read/write workloads:** Online transaction processing (OLTP) databases are typical here. A signature of an OLTP workload is a dependence on random read to find the desired file offset (such as a database table row) and write performance against a small number of files. With this type of workload, tens of thousands to hundreds of thousands of I/O operations are common. Application vendors and database administrators typically have specific latency targets for these workloads. In most cases, Azure NetApp Files regular volumes are best suited for this workload. 

* **Whole file streaming workloads:** Examples include post-production media rendering of media repositories, high-performance computing suites such as those seen in computer-aided engineering/design suites (for example, computational fluid dynamics), oil and gas suites, and machine learning fine-tuning frameworks. A hallmark of this type of workload is larger files read or written in a continuous manner. For these workloads, storage throughput is the most critical attribute as it has the biggest impact on time to completion. Latency sensitivity is common here as workloads typically use a fixed amount of concurrency, thus throughput is determined by latency. Workloads typical of post-production are latency sensitive to the degree that framerate is only achieved when specific latency values are met. Both Azure NetApp Files regular volumes and Azure NetApp Files large volumes are appropriate for these workloads, with large volumes providing [more capacity](azure-netapp-files-resource-limits.md) and [higher file count possibilities](maxfiles-concept.md). 


* **Metadata rich, high file count workloads:** Examples include software development, EDA, and financial services (FSI) applications. In these workloads, typically millions of smaller files are created followed by information displayed independently or being subjected to reads or writes. In high file count workload, remote procedure calls (RPC) other than read and write typically represent the majority of I/O. I/O rate (I/OPS) is typically the most important attribute for these workloads. Latency is often less important as concurrency might be controlled by scaling out at the application. Some customers have latency expectations of 1 ms, while others might expect 10 ms. As long as the I/O rate is achieved, so is satisfaction. This type of workload is ideally suited for _Azure NetApp Files large volumes_.  

For more information on EDA workloads in Azure NetApp Files, see [Benefits of using Azure NetApp Files for Electronic Design Automation](solutions-benefits-azure-netapp-files-electronic-design-automation.md).

## More information 

* [General performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
* [Performance benchmark test recommendations for Azure NetApp Files](azure-netapp-files-performance-metrics-volumes.md)
* [Azure NetApp Files regular volume performance benchmarks for Linux](performance-benchmarks-linux.md)
* [Azure NetApp Files large volume performance benchmarks for Linux](performance-large-volumes-linux.md)
* [Oracle database performance on Azure NetApp Files single volumes](performance-oracle-single-volumes.md)
* [Oracle database performance on Azure NetApp Files multiple volumes](performance-oracle-multiple-volumes.md)
* [Azure NetApp Files datastore performance benchmarks for Azure VMware Solution](performance-azure-vmware-solution-datastore.md)