---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 12/04/2018
 ms.author: rogarana
 ms.custom: include file
---
# Defining the common terms in Azure Disks

This article defines several of the primary terminologies used in the Azure Disks space. Understanding these terms will be essential in determining what resources are necessary for your applications. Especially if you're designing a high performance application.

## What is an Azure Disk?

An Azure Disk is essentially a VHD (virtual hard disk). You can think of them just like physical disks you might put into an on-premises server, but virtualized. VHDs are also similar to other virtual hard disk formats you may be familiar with such as VMDK or QCOW2 files. Azure Disks are stored in a special type of Azure storage object called a page blob, which allows for random IO patterns, just like what you would expect from a real physical disk. An Azure Disk can be either an OS disk or a data disk.

### Data Disks

A data disk is a VHD that's attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Each data disk has a maximum capacity of 4095 GiB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.
