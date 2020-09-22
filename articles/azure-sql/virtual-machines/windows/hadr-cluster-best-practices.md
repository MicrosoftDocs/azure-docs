---
title: Cluster configuration best practices
description: "Learn about the supported cluster configurations when you configure high availability and disaster recovery (HADR) for SQL Server on Azure Virtual Machines, such as supported quorums or connection routing options." 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Cluster configuration best practices (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

A cluster is used for high availability and disaster recovery (HADR) with SQL Server on Azure Virtual Machines (VMs). 

This article provides cluster configuration best practices for both [failover cluster instances (FCIs)](failover-cluster-instance-overview.md) and [availability groups](availability-group-overview.md) when you use them with SQL Server on Azure VMs. 


## Networking

Use a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

## Quorum

Although a two-node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support. Cluster validation won't pass any cluster without a quorum resource. 

Technically, a three-node cluster can survive a single node loss (down to two nodes) without a quorum resource. But after the cluster is down to two nodes, there's a risk that the clustered resources will go offline in the case of a node loss or communication failure to prevent a split-brain scenario.

Configuring a quorum resource will allow the cluster to continue online with only one node online.

The following table lists the quorum options available in the order recommended to use with an Azure VM, with the disk witness being the preferred choice: 


||[Disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |[Cloud witness](/windows-server/failover-clustering/deploy-cloud-witness)  |[File share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |
|---------|---------|---------|---------|
|**Supported OS**| All |Windows Server 2016+| All|




### Disk witness

A disk witness is a small clustered disk in the Cluster Available Storage group. This disk is highly available and can fail over between nodes. It contains a copy of the cluster database, with a default size that's usually less than 1 GB. The disk witness is the preferred quorum option for any cluster that uses Azure Shared Disks (or any shared-disk solution like shared SCSI, iSCSI, or fiber channel SAN).  A Clustered Shared Volume cannot be used as a disk witness.

Configure an Azure shared disk as the disk witness. 

To get started, see [Configure a disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum).


**Supported OS**: All   


### Cloud witness

A cloud witness is a type of failover cluster quorum witness that uses Microsoft Azure to provide a vote on cluster quorum. The default size is about 1 MB and contains just the time stamp. A cloud witness is ideal for deployments in multiple sites, multiple zones, and multiple regions.

To get started, see [Configure a cloud witness](/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp).


**Supported OS**: Windows Server 2016 and later   


### File share witness

A file share witness is an SMB file share that's typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can you can configure an [Azure file share](../../../storage/files/storage-how-to-create-file-share.md) to use as the file share witness, or you can use a file share on a separate virtual machine.

If you're going to use an Azure file share, you can mount it with the same process used to [mount the Premium file share](failover-cluster-instance-premium-file-share-manually-configure.md#mount-premium-file-share). 

To get started, see [Configure a file share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum).


**Supported OS**: Windows Server 2012 and later   

## Connectivity

In a traditional on-premises network environment, a SQL Server failover cluster instance appears to be a single instance of SQL Server running on a single computer. Because the failover cluster instance fails over from node to node, the virtual network name (VNN) for the instance provides a unified connection point and allows applications to connect to the SQL Server instance without knowing which node is currently active. When a failover occurs, the virtual network name is registered to the new active node after it starts. This process is transparent to the client or application that's connecting to SQL Server, and this minimizes the downtime that the client or application experiences during a failure. 

Use a VNN with Azure Load Balancer or a distributed network name (DNN) to route traffic to the VNN of the failover cluster instance with SQL Server on Azure VMs. The DNN feature is currently available only for SQL Server 2019 CU2 and later on a Windows Server 2016 (or later) virtual machine. 

The following table compares HADR connection supportability: 

| |**Virtual Network Name (VNN)**  |**Distributed Network Name (DNN)**  |
|---------|---------|---------|
|**Minimum OS version**| All | All |
|**Minimum SQL Server version** |All |SQL Server 2019 CU2|
|**Supported HADR solution** | Failover cluster instance <br/> Availability group | Failover cluster instance|


### Virtual Network Name (VNN)

Because the virtual IP access point works differently in Azure, you need to configure [Azure Load Balancer](../../../load-balancer/index.yml) to route traffic to the IP address of the FCI nodes. In Azure virtual machines, a load balancer holds the IP address for the VNN that the clustered SQL Server resources rely on. The load balancer distributes inbound flows that arrive at the front end, and then routes that traffic to the instances defined by the back-end pool. You configure traffic flow by using load-balancing rules and health probes. With SQL Server FCI, the back-end pool instances are the Azure virtual machines running SQL Server. 

There is a slight failover delay when you're using the load balancer, because the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to [configure Azure Load Balancer for an FCI](hadr-vnn-azure-load-balancer-configure.md). 

**Supported OS**: All   
**Supported SQL version**: All   
**Supported HADR solution**: Failover cluster instance, and availability group   


### Distributed Network Name (DNN)

Distributed network name is a new Azure feature for SQL Server 2019 CU2. The DNN provides an alternative way for SQL Server clients to connect to the SQL Server failover cluster instance without using a load balancer. 

When a DNN resource is created, the cluster binds the DNS name with the IP addresses of all the nodes in the cluster. The SQL client will try to connect to each IP address in this list to find the node where the failover cluster instance is currently running. You can accelerate this process by specifying `MultiSubnetFailover=True` in the connection string. This setting tells the provider to try all IP addresses in parallel, so the client can connect to the FCI instantly. 

A distributed network name is recommended over a load balancer when possible because: 
- The end-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Eliminating the load balancer probes minimizes failover duration. 
- The DNN simplifies provisioning and management of the failover cluster instance with SQL Server on Azure VMs. 

Most SQL Server features work transparently with FCI. In those cases, you can simply replace the existing VNN DNS name with the DNN DNS name, or set the DNN value with the existing VNN DNS name. However, some server-side components require a network alias that maps the VNN name to the DNN name. Specific cases might require the explicit use of the DNN DNS name, such as when you're defining certain URLs in a server-side configuration. 

To get started, learn how to [configure a DNN resource for an FCI](hadr-distributed-network-name-dnn-configure.md). 

**Supported OS**: Windows Server 2016 and later   
**Supported SQL version**: SQL Server 2019 and later   
**Supported HADR solution**: Failover cluster instance only


## Limitations

Consider the following limitations when you're working with FCI or availability groups and SQL Server on Azure Virtual Machines. 

### MSDTC 

Azure Virtual Machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and [Azure Standard Load Balancer](../../../load-balancer/load-balancer-standard-overview.md) or on SQL Server VMs that are using Azure shared disks. 

On Azure Virtual Machines, MSDTC isn't supported for Windows Server 2016 or earlier with Clustered Shared Volumes because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.


## Next steps

After you've determined the appropriate best practices for your solution, get started by [preparing your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md). You can also create your availability group by using the [Azure CLI](availability-group-az-cli-configure.md), or [Azure quickstart templates](availability-group-quickstart-template-configure.md). 

