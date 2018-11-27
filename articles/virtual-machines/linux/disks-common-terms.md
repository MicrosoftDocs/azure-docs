---
title: Defining the common terms in Azure Disks - Microsoft Azure | Microsoft Docs
description: Learn about IOPS, throughput, and latency
services: "virtual-machines-linux,storage"
author: roygara
ms.author: rogarana
ms.date: 11/01/2018
ms.topic: article
ms.service: virtual-machines-linux
ms.tgt_pltfrm: linux
ms.component: disks
---

# Defining the common terms in Azure Disks

This article defines several of the primary terminologies used in the Azure Disks space. Understanding these terms will be essential in determining what resources are necessary for your applications. Especially if you're designing a high performance application.

## What is an Azure Disk?

An Azure Disk is essentially a VHD (virtual hard disk). You can think of them just like physical disks you might put into an on-premises server, but virtualized. VHDs are also similar to other virtual hard disk formats you may be familiar with such as VMDK or QCOW2 files. Azure Disks are stored in a special type of Azure storage object called a page blob, which allows for random IO patterns, just like what you would expect from a real physical disk. An Azure Disk can be either an OS disk or a data disk.

### Data Disks

A data disk is a VHD that's attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Each data disk has a maximum capacity of 4095 GiB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

> [!NOTE]
> For more information about virtual machines capacities, see [Sizes for Linux virtual machines](./sizes.md).

### OS Disks

Every virtual machine has one attached operating system disk. It's registered as a SATA drive and is labeled /dev/sda by default. This disk has a maximum capacity of 2048 GiB.

The initial Azure Disk that hosts the operating system is the OS disk. Disks which are subsequently attached to the virtual machine are the data disks, and can be added at any time. Attaching a data disk associates the VHD file with the VM, by placing a 'lease' on the VHD so it can't be deleted from storage while it's still attached.

An Azure Disk is created with an operating system preinstalled and attached to a virtual machine when you select a particular virtual image.

## IOPS

IOPS, or Input/output Operations Per Second, is the number of requests that your application is sending to the storage disks in one second. An input/output operation could be read or write, sequential or random. Online Transaction Processing (OLTP) applications like an online retail website need to process many concurrent user requests immediately. The user requests are insert and update intensive database transactions, which the application must process quickly. Therefore, OLTP applications require very high IOPS. Such applications handle millions of small and random IO requests. If you have such an application, you must design the application infrastructure to optimize for IOPS. In the later section, *Optimizing Application Performance*, we discuss in detail all the factors that you must consider to get high IOPS.

When you attach a premium storage disk to your high scale VM, Azure provisions for you a guaranteed number of IOPS as per the disk specification. For example, a P50 disk provisions 7500 IOPS. Each high scale VM size also has a specific IOPS limit that it can sustain. For example, a Standard GS5 VM has 80,000 IOPS limit.

## Throughput

Throughput, or bandwidth is the amount of data that your application is sending to the storage disks in a specified interval. If your application is performing input/output operations with large IO unit sizes, it requires high throughput. Data warehouse applications tend to issue scan intensive operations that access large portions of data at a time and commonly perform bulk operations. In other words, such applications require higher throughput. If you have such an application, you must design its infrastructure to optimize for throughput. In the next section, we discuss in detail the factors you must tune to achieve this.

When you attach a premium storage disk to a high scale VM, Azure provisions throughput as per that disk specification. For example, a P50 disk provisions 250 MB per second disk throughput. Each high scale VM size also has as specific throughput limit that it can sustain. For example, Standard GS5 VM has a maximum throughput of 2,000 MB per second.

There is a relation between throughput and IOPS as shown in the formula below.

![Relation of IOPS and throughput](media/premium-storage-performance/image1.png)

Therefore, it is important to determine the optimal throughput and IOPS values that your application requires. As you try to optimize one, the other also gets affected. In a later section, *Optimizing Application Performance*, we will discuss in more details about optimizing IOPS and Throughput.

## Latency

Latency is the time it takes an application to receive a single request, send it to the storage disks and send the response to the client. This is a critical measure of an application's performance in addition to IOPS and Throughput. The latency of a premium storage disk is the time it takes to retrieve the information for a request and communicate it back to your application. Premium Storage provides consistent low latencies. If you enable ReadOnly host caching on premium storage disks, you can get much lower read latency. We will discuss Disk Caching in more detail in later section on *Optimizing Application Performance*.

When you are optimizing your application to get higher IOPS and Throughput, it will affect the latency of your application. After tuning the application performance, always evaluate the latency of the application to avoid unexpected high latency behavior.