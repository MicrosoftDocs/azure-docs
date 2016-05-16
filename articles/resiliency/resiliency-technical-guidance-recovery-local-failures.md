<properties
   pageTitle="Recovery from local failures in Azure technical guidance | Microsoft Azure"
   description="Whitepaper on understanding and designing resilient, highly available, fault tolerant applications as well as planning for disaster recovery focused on local failures within Azure."
   services=""
   documentationCenter="na"
   authors="adamglick"
   manager="hongfeig"
   editor=""/>

<tags
   ms.service="resiliency"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/13/2016"
   ms.author="patw;jroth;aglick"/>

#Azure Resiliency Technical Guidance - Recovery from local failures in Azure

There are two primary threats to application availability: the failure of devices, such as drive and servers, and the exhaustion of critical resources, such as compute under peak load conditions. Azure provides a combination of resource management, elasticity, load-balancing, and partitioning to enable high availability under these circumstances. Some of these features are performed automatically for all cloud services; however, in some cases the application developer must do some additional work to benefit from them.

##Cloud Services

All cloud services hosted by Azure are collections of one or more web or worker roles. One or more instances of a given role can run concurrently. The number of instances is determined by configuration. Role instances are monitored and managed with a component called the Fabric Controller (FC). The FC detects and responds to both software and hardware failure automatically.

  * Every role instance runs in its own virtual machine (VM) and communicates with its FC through a guest agent (GA). The GA collects resource and node metrics, including VM usage, status, logs, resource usage, exceptions, and failure conditions. The FC queries the GA at configurable intervals, and reboots the VM if the GA fails to respond.
  * In the event of hardware failure, the associated FC moves all affected role instances to a new hardware node and reconfigures the network to route traffic there.

To benefit from these features, developers should ensure that all service roles avoid storing state on the role instances. Instead, all persistent data should be accessed from durable storage, such as Azure Storage Services or Azure SQL Database. This allows requests to be handled by any roles. It also means that role instances can go down at any time without creating inconsistencies in the transient or persistent state of the service.

The requirement to store state external to the roles has several implications. It implies, for example, that all related changes to an Azure Storage table should be changed in a single Entity Group transaction, if possible. Of course, it is not always possible to make all changes in a single transaction. Special care must be taken to ensure that role instance failures do not cause problems when they interrupt long running operations that span two or more updates to the persistent state of the service. If another role attempts to retry such an operation, it should anticipate and handle the case where the work was partially completed.

For example, in a service that partitions data across multiple stores, if a worker role goes down while relocating a shard, the relocation of the shard may not complete, or may be repeated from its inception by a different worker role, potentially causing orphaned data or data corruption. To prevent problems, long running operations must be idempotent (i.e., repeatable without side effect) and/or incrementally restartable (i.e., able to continue from the most recent point of failure).

  * To be idempotent, a long running operation should have the same effect no matter how many times it is executed, even when it is interrupted during execution.
  * To be incrementally restartable, a long running operation should consist of a sequence of smaller atomic operations, and it should record its progress in durable storage, so that each subsequent invocation picks up where its predecessor stopped.

Finally, all long running operations should be invoked repeatedly until they succeed. For example, a provisioning operation might be placed in an Azure queue, and removed from the queue by a worker role only when it succeeds. Garbage collection might be necessary to clean up data created by interrupted operations.

###Elasticity

The initial number of instances running for each role is determined in each role’s configuration. Administrators should initially configure each of the roles to run with two or more instances based on expected load. But role instances can easily be scaled up or down as usage patterns change. This can be done with the Azure Portal, Windows PowerShell, the Service Management API, or third-party tools. The FC automatically provisions any new instances and inserts them into the load balancer for that role.

With [Azure Auto-Scale](../cloud-services/cloud-services-how-to-scale.md), you can enable Azure to automatically scale your roles based on load. Automatic scaling can also be programmatically built-in and configured for a cloud service using a framework like the [Auto-Scaling Application Block (WASABi)](https://msdn.microsoft.com/library/hh680945.aspx).

###Partitioning

Azure's Fabric Controller uses two types of partitions: update domains and fault domains.

  * An update domain is used to upgrade a service’s role instances in groups. Azure deploys service instances into multiple update domains. For an in-place update, the FC brings down all the instances in one update domain, updates them, and then restarts them before moving to the next update domain. This approach prevents the entire service from being unavailable during the update process.
  * A fault domain defines potential points of hardware or network failure. For any role with more than one instance, the FC ensures that the instances are distributed across multiple fault domains, in order to prevent isolated hardware failures from disrupting service. All exposure to server and cluster failure in Azure is governed by fault domains.

Per the [Azure SLA](https://azure.microsoft.com/support/legal/sla/), Microsoft guarantees that when two or more web role instances are deployed to different fault and upgrade domains, they will have external connectivity at least 99.95% of the time. Unlike update domains, there is no way to control the number of fault domains. Azure automatically allocates fault domains and distributes role instances across them. At least the first two instances of every role are placed in different fault and upgrade domains in order to ensure that any role with at least two instances will satisfy the SLA. This is represented in the following diagram.

![Fault Domain Isolation (Simplified View)](./media/resiliency-technical-guidance-recovery-local-failures/partitioning-1.png "Fault Domain Isolation - Simplified View")

###Load Balancing

All inbound traffic to a web role passes through a stateless load balancer, which distributes client requests among the role instances. Individual role instances do not have public IP addresses, and are not directly addressable from the Internet. Web roles are stateless, so that any client request can be routed to any role instance. A [StatusCheck](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleenvironment.statuscheck.aspx) event is raised every 15 seconds. This can be used to indicate if the role is ready to receive traffic, or is busy and should be taken out of the load balancer rotation.

##Virtual Machines

Azure Virtual Machines differ from PaaS compute roles in several respects in relation to high availability. In some instances, you must do additional work to ensure high availability.

###Disk Durability

Unlike PaaS role instances, data stored on Virtual Machine drives is persistent even when the virtual machine is relocated. Azure Virtual Machines use VM Disks that exist as blobs in Azure Storage. Because of the availability characteristics of Azure Storage, the data stored on a Virtual Machine’s drives is also highly available. Note that the D: drive is the exception to this rule. The D: drive is actually physical storage on the rack server that hosts the VM, and its data will be lost if the VM is recycled. The D: drive is intended for temporary storage only.

###Partitioning

Azure natively understands the tiers in a PaaS application (Web role and Worker role) and thus can properly distribute them across Fault and Update Domains. In contrast, the tiers in an IaaS applications must be manually defined using availability sets. Availability Sets are required for an SLA under IaaS.

![Availability Sets for Microsoft Azure Virtual Machines](./media/resiliency-technical-guidance-recovery-local-failures/partitioning-2.png "Availability Sets for Microsoft Azure Virtual Machines")

In the diagram above the IIS tier and the SQL tier are assigned to different Availability Sets. This ensures that all instances of each tier have hardware redundancy by distributing them across fault domains, and are not taken down during an update.

###Load Balancing

If the VMs should have traffic distributed across them, you must group the VMs in a cloud service and load balance across a specific TCP or UDP endpoint. For more information, see [Load Balancing Virtual Machines](../virtual-machines/virtual-machines-linux-load-balance). If the VMs receive input from another source (for example, a queuing mechanism), then a load balancer is not required. The load balancer uses a basic health check to determine if traffic should be sent to the node. It is also possible to create your own probes to implement application specific health metrics that determine if the VM should receive traffic.

##Storage

Azure Storage is the baseline durable data service for Azure, providing blob, table, queue, and VM Disk storage. It uses a combination of replication and resource management to provide high availability within a single data center. The Azure Storage availability SLA guarantees that at least 99.9% of the time correctly formatted requests to add, update, read and delete data will be successfully and correctly processed, and that storage accounts will have connectivity to the internet gateway.

###Replication

Data durability for Azure Storage is facilitated by maintaining multiple copies of all data on different drives located across fully independent physical storage sub-systems within the region. Data is replicated synchronously and all copies are committed before the write is acknowledged. Azure Storage is strongly consistent, meaning that reads are guaranteed to reflect the most recent writes. In addition, copies of data are continually scanned to detect and repair bit rot, an often overlooked threat to the integrity of stored data. Services benefit from replication just by using Azure Storage. No additional work is required by the service developer for recovery from a local failure.

###Resource Management

Storage accounts created after June 7th, 2012 can grow to up to 200TB (the previous maximum was 100 TB). If additional space is required, applications must be designed to leverage multiple storage account.

###Virtual Machine Disks

A Virtual Machine’s VM Disk is stored as a page blob in Azure Storage, giving it all the same durability and scalability properties as blob storage. This design makes the data on a Virtual Machine’s disk persistent even if the server running the VM fails and the VM must be restarted on another server.

##Database

###SQL Database

Microsoft Azure SQL Database provides database-as-a-service, allowing applications to quickly provision, insert data into, and query relational databases. It provides many of the familiar SQL Server features and functionality, while abstracting the burden of hardware, configuration, patching and resiliency.

>[AZURE.NOTE]Azure SQL Database does not provide 1:1 feature parity with SQL Server, and is intended to fulfill a different set of requirements uniquely suited to cloud applications (elastic scale, database-as-a-service to reduce maintenance costs, and so on). For more information, see [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](../sql-database/data-management-azure-sql-database-and-sql-server-iaas.md).

####Replication

Azure SQL Database provides built-in resiliency to node-level failure. All writes into a database are automatically replicated to two or more background nodes using a quorum commit technique (the primary and at least one secondary must confirm that the activity is written to the transaction log before the transaction is deemed successful and returns). In the case of node failure the database automatically fails over to one of the secondary replicas. This causes a transient connection interruption for client applications. For this reason all Microsoft Azure SQL Database clients must implement some form of transient connection handling. For more information, see [Using the Transient Fault Handling Application Block with SQL Azure](https://msdn.microsoft.com/library/hh680899.aspx).

####Resource Management

Each database, when created, is configured with an upper size limit. The currently available maximum size is 150GB. When a database hits its upper size limit it rejects additional INSERT or UPDATE commands (querying and deleting data is still possible).

Within a database, Microsoft Azure SQL Database uses a fabric to manage resources. However, instead of a fabric controller, it uses a ring topology to detect failures. Every replica in a cluster has two neighbors, and is responsible for detecting when they go down. When a replica goes down, its neighbors trigger a Reconfiguration Agent (RA) to recreate it on another machine. Engine throttling is provided to ensure that a logical server does not use too many resources on a machine, or exceed the machine’s physical limits.

###Elasticity

If the application requires more than the 150GB database limit it must implement a scale-out approach. Scaling out with Microsoft Azure SQL Database is done by manually partitioning, also known as sharding, data across multiple Azure SQL Databases. This scale-out approach provides the opportunity to achieve near linear cost growth with scale. Elastic growth or capacity on demand can grow with incremental costs as needed because databases are billed based on the average actual size used per day, not based on maximum possible size.

##SQL Server on Virtual Machines

By installing SQL Server on Azure Virtual Machines (version 2014 or later), you can take advantage of the traditional availability features of SQL Server, such as AlwaysOn Availability Groups or database mirroring. Note that Azure VM, storage, and networking, have different operational characteristics than an on-premises, non-virtualized IT infrastructure. A successful implementation of a High Availability / Disaster Recovery (HA/DR) SQL Server solution in Azure requires that you understand these differences and design your solution to accommodate them.

###High availability nodes in an Availability Set

When you implement a high availability solution in Azure, the availability set in Azure enables you to place the high availability nodes into separate fault domains and upgrade domains. To be clear, the availability set is an Azure concept. It is a best practice that you should follow to make sure that your databases are indeed highly available, whether you are using AlwaysOn Availability Groups, database mirroring, or otherwise. If you do not follow this best practice, you may be under the false assumption that your system is highly available, but in reality your nodes can all fail simultaneously because they happen to be placed in the same fault domain in the Azure datacenter. This recommendation is not as applicable with log shipping, since, as a disaster recovery feature, you should ensure that the servers are running in separate Azure datacenter locations (regions). By definition, these datacenter locations are separate fault domains.

For Azure VMs to be placed in the same availability set, you must deploy them in the same cloud service. Only nodes in the same cloud service can participate in the same availability set. In addition, the VMs should be in the same VNet to ensure that they maintain their IPs even after service healing, thus avoiding DNS update times.

###Azure-Only: High Availability Solutions

You can have a high availability solution for your SQL Server databases in Azure using AlwaysOn Availability Groups or database mirroring.

The following diagram demonstrates the architecture of AlwaysOn Availability Groups running in Azure Virtual Machines. This diagram was taken from the depth article on this subject, [High availability and disaster recovery for SQL Server in Azure virtual machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).

![AlwaysOn Availability Groups in Microsoft Azure](./media/resiliency-technical-guidance-recovery-local-failures/high_availability_solutions-1.png "AlwaysOn Availability Groups in Microsoft Azure")

You can also automatically provision an AlwaysOn Availability Group deployment end-to-end on Azure VMs by using the AlwaysOn template in the Microsoft Azure Portal. For more information, see [SQL Server AlwaysOn Offering in Microsoft Azure Portal Gallery](https://blogs.technet.microsoft.com/dataplatforminsider/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery/).

The following diagram demonstrates the use of Database Mirroring on Azure Virtual Machines. It was also taken from the depth topic, [High availability and disaster Recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).

![Database Mirroring in Microsoft Azure](./media/resiliency-technical-guidance-recovery-local-failures/high_availability_solutions-2.png "Database Mirroring in Microsoft Azure")

>[AZURE.NOTE]In both architectures a domain controller is required. However, with Database Mirroring it is possible to use server certificates to eliminate the need for a domain controller.

##Other Azure Platform Services

Azure Cloud Services are built on Azure, so they benefit from the platform capabilities previously described to recover from local failures. In some cases, there are specific actions that you can take to increase the availability for your specific scenario.

###Service Bus

To mitigate against a temporary outage of Azure Service Bus, consider creating a durable client-side queue. This temporarily uses an alternate, local storage mechanism to store messages that cannot be added to the Service Bus queue. The application can decide how to handle the temporarily stored messages after the service is restored. For more information, see [Best Practices for performance improvements using Service Bus brokered messaging](../service-bus/service-bus-performance-improvements.md). For more information, see [Service Bus (Disaster Recovery)](./resiliency-technical-guidance-recovery-loss-azure-region.md#service-bus).

###Mobile Services
There are two availability considerations for Azure Mobile Services. First, regularly back up the Azure SQL Database associated with your mobile service. Also back up the mobile service scripts. For more information, see [Recover your mobile service in the event of a disaster](../mobile-services/mobile-services-disaster-recovery.md). If Mobile Services experiences a temporary outage, you might have to temporarily use an alternate Azure datacenter. For more information, see [Mobile Services (Disaster Recovery)](./resiliency-technical-guidance-recovery-loss-azure-region.md#mobile-services).

###HDInsight

The data associated with HDInsight is stored by default in Azure Blob Storage, which has high the availability and durability properties specified by Azure Storage. The multi-node processing associated with Hadoop MapReduce jobs is done on a transient Hadoop Distributed File System (HDFS) that is provisioned when needed by HDInsight. Results from a MapReduce job are also stored by default in Azure Blob Storage, so that the processed data is durable and remains highly available after the Hadoop cluster is deprovisioned. For more information, see [HDInsight (Disaster Recovery)](./resiliency-technical-guidance-recovery-loss-azure-region.md#hdinsight).

##Checklists: Local Failures
 
##Cloud Services Checklist
  1. Review the [Cloud Services](#cloud-services) section of this document
  2. Configure at least two instances for each role
  3. Persist state in durable storage, not on role instances
  4. Correctly handle the StatusCheck event
  5. Wrap related changes in transactions when possible
  6. Verify that worker role tasks are idempotent and restartable
  7. Continue to invoke operations until they succeed
  8. Consider autoscaling strategies

##Virtual Machines Checklist
  1. Review the [Virtual Machines](#virtual-machines) section of this document
  2. Do not use the D: drive for persistent storage
  3. Group machines in a service tier into an availability set
  4. Configure load balancing and optional probes
 
##Storage Checklist
  1. Review the [Storage](#storage) section of this document
  2. Use multiple storage accounts when data or bandwidth exceeds quotas

##SQL Database Checklist
  1. Review the [SQL Database](#sql-database) section of this document
  2. Implement a retry policy to handle transient errors
  3. Use partitioning/sharding as a scale out strategy
  
##SQL Server on Virtual Machines Checklist
  1. Review the [SQL Server on Virtual Machines](#sql-server-on-virtual-machines) section of this document
  2. Follow the previous recommendations for Virtual Machines
  3. Use SQL Server high availability features, such as AlwaysOn
  
##Service Bus Checklist
  1. Review the [Service Bus](#service-bus) section of this document
  2. Consider creating a durable client-side queue as a backup

##HDInsight Checklist
  1. Review the [HDInsight](#hdinsight) section of this document
  2. No additional availability steps required for local failures
 