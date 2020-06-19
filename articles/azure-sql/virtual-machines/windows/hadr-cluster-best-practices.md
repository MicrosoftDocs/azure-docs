---
title: Cluster configuration best practices
description: "Learn about the different supported cluster configurations when you configure high availability and disaster recovery (HADR) for your SQL Server on Azure Virtual Machines, such as supported quorum or connection routing options. " 
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

A cluster is used for high availability and disaster recovery (HADR) with SQL Server on Azure VMs. 

This article provides details about supported cluster configurations used by both [failover cluster instances](failover-cluster-instance-overview.md), and [availability groups](availability-group-overview.md). 


## Networking

One thing to be aware of is that on an Azure virtual machine guest failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

## Quorum

Although a two node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support and, cluster validation will not pass any cluster without a quorum resource. 

Technically, a three node cluster can survive a single node loss (down to two nodes) without a quorum resource – but once the cluster is down to two nodes, there is risk of running into: 

1. **Partition in space** (split brain): The cluster nodes become separated on the network due to the server, NIC, or switch issue. 
1. **Partition in time** (amnesia): A node joins or rejoins the cluster and tries to claim ownership of the cluster group or a cluster role inappropriately. 

The quorum resource protects the cluster against either of these issues. 

To configure the quorum resource with SQL Server on Azure VMs, you can use a Disk Witness, a Cloud Witness, or a File Share Witness. 

### Disk Witness

A small clustered disk which is in the Cluster Available Storage group. This disk is highly-available and can failover between nodes. It contains a copy of the cluster database, with a default size of less than 1 GB usually. Disk Witness is a unique capability of Azure Shared Disks and preferred because it is a familiar part of the on-premises infrastructure. 

Since the disk witness is common in on-premises clusters, the familiar functionality makes it easier to adapt to the Azure environment, and technically provides the most protection for teh cluster. 

To get started, see [Configure Disk Witness?? need link? or do we write this content ourselves? ]()


**Supported OS**: All    
**Supported SQL version**: SQL Server 2019   
**Supported FCI storage**: Azure Shared Disks

### Cloud Witness

A [Cloud Witness](/windows-server/failover-clustering/deploy-cloud-witness) is a type of Failover Cluster quorum witness that uses Microsoft Azure to provide a vote on cluster quorum. The default size is about 1 MB and contains just the time stamp. Cloud Witness is ideal for multi-site, multi-zone, and multi-region deployments.

To get started, see [Configure Cloud Witness](/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp).


**Supported OS**: Windows Server 2016 and later   
**Supported SQL version**: SQL Server 2016 and later     
**Supported FCI storage**: All   

### File Share Witness

A SMB file share that is typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can you can configure an [Azure File Share](../../../storage/files/storage-how-to-create-file-share.md) to use as the File Share Witness, or you can use a file share on a separate virtual machine.

If you're going to use another Azure file share, you can mount it with the same process used to [mount the premium file share](failover-cluster-instance-premium-file-share-manually-configure.md#mount-the-premium-file-share). 

To get started, see [Configure File Share Witness need link? or should we create our own :| ]


**Supported OS**: Windows Server 2012 and later   
**Supported SQL version**: SQL Server 2016 and later   
**Supported FCI storage**: All   

With Azure Shared Disk (ASD) enables a great advantage to support Disk Witness quorum type in addition to Cloud Witness because:
1.	Disk Witness is very common in on-premises clusters and enables lift-and-shift patterns in Azure IaaS
2.	Disk Witness cannot be used with Storage Spaces Direct (S2D) storage – in Azure, only ASD can support Disk Witness
3.	Disk Witness technically provides the most protection for the cluster
 
Both Disk Witness in addition to Cloud Witness quorum types for all Azure IaaS VM guest clusters are supported:
A.	Disk Witness is a unique capability of Azure Shared Disks and is preferred because it is a familiar part of on-premises infrastructure
B.	Cloud Witness is ideal for multi-site, multi-zone, and multi-region deployments


## Connectivity

In a traditional on-premises network environment, a SQL Server failover cluster instance (FCI) appears to be a single instance of SQL Server running on a single computer. Since the failover cluster instance fails over from node to node, the virtual network name (VNN) for the instance provides a unified connection point and allows applications to connect to the SQL Server instance without knowing which node is currently active. When a failover occurs, the virtual network name is registered to the new active node after it starts. This process is transparent to the client or application connecting to SQL Server and this minimizes the downtime the application or clients experience during a failure. 

Use an **Azure Load Balancer** or a **distributed network name (DNN)** to route traffic to the virtual network name of the failover cluster instance with a SQL Server on Azure VM. The distributed network name feature is currently only available for SQL Server 2019 CU2 and above on a Windows Server 2019 virtual machine. 

### Azure Load Balancer

Since the virtual network name IP does not work in Azure, you can configure an [Azure Load Balancer](../../../load-balancer/index.yml) to route traffic to the IP address of the virtual network name in Azure. In Azure virtual machines, a load balancer holds the IP address for the virtual network name (VNN) that the clustered SQL Server resources relies on. The load balancer distributes inbound flows that arrive at the frontend, and then routes that traffic to the instances defined by the backend pool. Traffic flow is configured using load balancing rules and health probes. With SQL Server FCI, the backend pool instances are the Azure Virtual Machines running SQL Server. 

There is a slight failover delay when using the load balancer as the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to [configure an Azure Load Balancer for an FCI](failover-cluster-instance-connectivity-configure.md#load-balancer). 

**Supported OS**: Windows Server 2012 and greater   
**Supported SQL version**: SQL Server 2012 and greater   
**Supported FCI storage**: All storage options    

### Distributed network name

Distributed network name (DNN) is a new feature for Windows Server 2019, and supported for SQL Server FCI 2019 CU2 and above on Azure VMs. The distributed network name provides an alternative way for SQL Server clients to connect to the SQL Server failover cluster instance without using a load balancer. 

When a distributed network name resource is created, the cluster binds the DNS name with the IP addresses of all the nodes in the cluster. The SQL client will try to connect to each IP address in this list to find the node where the failover cluster instance is currently running. This process can be accelerated by specifying `MultiSubnetFailover=True` in the connection string, which tells the provider to try all IP addresses in parallel, allowing the client to connect to the FCI instantly. 

Using a distributed network name rather than a load balancer is recommended: 
- End-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Minimized failover duration by eliminating the load balancer probes. 
- Simplified provisioning and management of the failover cluster instance with SQL Server on Azure VM. 

Most SQL Server features work transparently with FCI and you can simply replace the existing VNN DNS name with the DNN DNS name, or set the DNN value with the existing VNN DNS name. However, some server side components require a network alias that maps the VNN Name to the DNN name. Additionally, there may be specific cases that require the explicit use of the DNN DNS name, such as when defining certain URLs in a server-side configuration. 

To get started, learn how to [configure a distributed network name (DNN) resource for an FCI](failover-cluster-instance-connectivity-configure.md#dynamic-network-name). 

**Supported OS**: Windows Server 2019   
**Supported SQL version**: SQL Server 2019 CU2   
**Supported FCI storage**:  All


### Frequently asked questions


1. Which SQL Server version brings DNN support? 

   SQL Server 19 CU2 and above.

1. What is the expected failover time when DNN is used?

   For DNN, the failover time will be just the FCI failover time, without any additional time added (like probe time when using an Azure Load Balancer case).

1. Is there any version requirement for SQL Clients to support DNN with OLEDB and ODBC?

   `MultiSubnetFailover=True` connection string support is necessary for DNN, and is available starting with SQL Server 2012 (11.x).

1. Are there any SQL Server configuration changes required for to  use DNN? 

   SQL Server does not require any configuration change to use DNN, but there are some SQL Server features that may require additional consideration. 

1. Does DNN support multi-subnet clusters?

   Yes. The cluster binds the DNN in DNS with the physical IP addresses of all nodes in the cluster regardless of the subnet. The SQL client tries all IP addresses of the DNS name regardless of subnet. 



## Limitations

Consider the below limitations when working with FCI or availability groups and SQL Server on Azure Virtual Machines. 

### MS DTC 
Azure Virtual Machines supports Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and a [standard load balancer](../../../load-balancer/load-balancer-standard-overview.md).

On Azure Virtual Machines, MSDTC isn't supported on Windows Server 2016 or earlier because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.


## Next steps

Once you've determined the appropriate best practices for your solution, get started by [preparing your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md) or creating your availability group  using [Azure SQL VM CLI](availability-group-az-cli-configure), or [Azure Quickstart templates](availability-group-quickstart-template-configure.md)). 

