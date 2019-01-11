---
title:  IBM Db2 pureScale on Azure
description: In this article, we show an architecture for running an IBM Db2 pureScale environment on Azure.
services: virtual-machines-linux
documentationcenter: ''
author: njray
manager: edprice
editor: edprice
tags:

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 11/09/2018
ms.author: njray

---

# IBM Db2 pureScale on Azure

The IBM Db2 pureScale environment provides a database cluster solution for Azure with high availability and scalability on Linux operating systems. In this article, we show an architecture for running Db2 pureScale on Azure.

## Overview

Enterprises have long used traditional relational database management system (RDBMS) platforms to cater to online transaction processing (OLTP) needs. These days, many are migrating their mainframe-based database environments to Azure as a way to expand capacity, reduce costs, and maintain a steady operational cost structure.

Migration is often the first step in modernizing a legacy platform. For example, one enterprise recently rehosted their IBM Db2 environment running on z/OS to
IBM Db2 pureScale on Azure. While not identical to the original environment, IBM Db2 pureScale on Linux delivers similar high availability and scalability features as IBM Db2 for z/OS running in a Parallel Sysplex configuration on the mainframe.

This article describes the architecture used for this Azure migration. Red Hat Linux 7.4 was used to test the configuration. This version is available from the Azure Marketplace. Before choosing a Linux distribution, make sure to verify the currently supported versions. For details, see the documentation for [IBM Db2 pureScale](https://www.ibm.com/support/knowledgecenter/SSEPGG) and [GlusterFS](https://docs.gluster.org/en/latest/).

This article is simply a starting point for your Db2 implementation plan. Your business requirements will differ, but the same basic pattern applies. This architectural pattern may also be used for online analytical processing (OLAP) applications on Azure.

This article does not cover differences and possible migration tasks for moving an IBM Db2 for z/OS database to IBM Db2 pureScale running on Linux. Nor does it provide equivalent sizing estimations and workload analyses for moving from Db2 z/OS to Db2 pureScale. To help you decide on the best Db2 pureScale architecture for your environment, we highly recommend that you complete a full sizing estimation exercise and establish a hypothesis. Among other factors, on the source system make sure to consider Db2 z/OS Parallel Sysplex with Data Sharing Architecture, Coupling Facility configuration, and DDF usage statistics.

> [!NOTE]
> This article describes one approach to Db2 migration, but there are others. For example, Db2 pureScale can also run in virtualized on-premises environments. IBM supports Db2 on Microsoft Hyper-V in various configurations. For more information, see [Db2 pureScale virtualization architecture](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.qb.server.doc/doc/r0061462.html) in the IBM Knowledge Center.

## Architecture

To support high availability and scalability on Azure, a scale-out, shared data architecture can be used for Db2 pureScale. The following example architecture was used for our customer migration.

![](media/db2-purescale-on-azure/pureScaleArchitecture.png "Db2 pureScale on Azure virtual machines showing storage and networking")


The architectural diagram depicts the logical layers needed for a Db2 pureScale cluster. These include virtual machines for a client, for management, for caching, for the database engine, and for shared storage. In addition to the database engine nodes, the diagram also includes two nodes used for what are known as the cluster caching facilities (CFs). A minimum of two nodes are used for the database engine itself; a Db2 server that belongs to a pureScale cluster is called a member. The cluster is connected via iSCSI to a three-node GlusterFS shared storage cluster to provide scale-out storage and high availability. Db2 pureScale is installed on Azure virtual machines running Linux.

This approach is simply a template that you can modify to suit the size and scale needed by your organization and is based on the following:

-   Two or more database members are combined with at least two CF nodes, which manage a global buffer pool (GBP) for shared memory and global lock manager (GLM) services to control shared access and lock contention from multiple active members. One CF node acts as the primary and the other as the secondary, failover CF node. To avoid creating an environment that has a single point of failure, a minimum of four nodes are required for a Db2 pureScale cluster.

-   High-performance shared storage (shown in P30 size in Figure 1), which is used by each of the Gluster FS nodes.

-   High-performance networking for the data members and shared storage.

### Compute considerations

This architecture runs the application, storage, and data tiers on Azure virtual machines. The [deployment setup scripts](http://aka.ms/db2onazure) create the following:

-   A Db2 pureScale cluster. The type of compute resources you need on Azure depend on your setup. In general, there are two approaches you can use:

    -   Use a multi-node, high-performance computing (HPC)-style network where multiple small to medium-sized instances access shared storage. For this HPC type of configuration, Azure memory-optimized E-series or storage-optimized L-series [virtual machines](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) provide the compute power needed.

    -   Use fewer large virtual machine instances for the data engines. For large instances, the largest memory optimized [M-series](https://azure.microsoft.com/pricing/details/virtual-machines/series/) virtual machines are ideal for heavy in-memory workloads, but a dedicated instance may be required, depending on the size of the Logical Partition (LPAR) that is used to run Db2.

-   The Db2 CF uses memory-optimized virtual machines, such as E-series or L-series.

-   GlusterFS storage uses Standard\_DS4\_v2 virtual machines running Linux.

-   A GlusterFS jumpbox is a Standard\_DS2\_v2 virtual machine running Linux.

-   The client is a Standard\_DS3\_v2 virtual machine running Windows (used for testing).

-   A witness server is a Standard\_DS3\_v2 virtual machine running Linux (used for Db2 pureScale).

> [!NOTE]
> A minimum of two Db2 instances are required in a Db2 pureScale cluster. A Cache instance and Lock Manager instance are also required.

### Storage considerations

Like Oracle RAC, Db2 pureScale is a high-performance block I/O, scale-out database. We recommend using the largest [Azure Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage) available that suits your needs. For example, smaller storage options may be suitable for development and test environments, while production environments often require larger storage capacity. The example architecture uses [P30](https://azure.microsoft.com/pricing/details/managed-disks/) because of its ratio of IOPS to size and price. Regardless of size, use Premium Storage for best performance.

Db2 pureScale uses a shared everything architecture, where all data is accessible from all cluster nodes. Premium storage must be shared across multiple instances—whether on-demand or on dedicated instances.

A large Db2 pureScale cluster can require 200 terabytes (TB) or higher of Premium shared storage, with IOPS of 100,000. Db2 pureScale supports an iSCSI block interface that can be used on Azure. The iSCSI interface requires a shared storage cluster that can be implemented with GlusterFS, S2D, or another tool. This type of solution creates a virtual storage area network (vSAN) device in Azure. Db2 pureScale uses the vSAN to install the clustered file system that is used to share data among multiple virtual machines.

For this architecture, we used the GlusterFS file system, a free, scalable, open source distributed file system specifically optimized for cloud storage.

### Networking considerations

IBM recommends InfiniBand networking for all members in a Db2 pureScale cluster; Db2 pureScale also uses remote direct memory access (RDMA), where available, for the CFs used.

During setup, an Azure [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) is created to contain all the virtual machines. In general, resources are grouped based on their lifetime and who will manage them. The virtual machines in this architecture require [accelerated networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/), an Azure feature that provides consistent, ultra-low network latency via single root I/O virtualization (SR-IOV) to a virtual machine.

Every Azure virtual machine is deployed into a virtual network that is segmented into multiple subnets: main, Gluster FS front end (gfsfe), Gluster FS back end (bfsbe), Db2 pureScale (db2be), and Db2 purescale front end (db2fe). The installation script also creates the primary [NICs](https://docs.microsoft.com/azure/virtual-machines/linux/multiple-nics) on the virtual machines in the main subnet.

[Network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) (NSGs) are used to restrict network traffic within the virtual network and to
isolate the subnets.

On Azure, Db2 pureScale needs to use TCP/IP as the network connection for storage.

## Next steps

-   [Deploy this architecture on Azure](deploy-ibm-db2-purescale-azure.md)
