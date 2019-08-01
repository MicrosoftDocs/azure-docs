---
title: High availability and disaster recovery of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Establish high availability and plan for disaster recovery of SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: gwallace
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# SAP HANA Large Instances high availability and disaster recovery on Azure 

>[!IMPORTANT]
>This documentation is no replacement of the SAP HANA administration documentation or SAP Notes. It's expected that the reader has a solid understanding of and expertise in SAP HANA administration and operations, especially with the topics of backup, restore, high availability, and disaster recovery.

It's important that you exercise steps and processes taken in your environment and with your HANA versions and releases. Some processes described in this documentation are simplified for a better general understanding and are not meant to be used as detailed steps for eventual operation handbooks. If you want to create operation handbooks for your configurations, you need to test and exercise your processes and document the processes related to your specific configurations. 


High availability and disaster recovery (DR) are crucial aspects of running your mission-critical SAP HANA on the Azure (Large Instances) server. It's important to work with SAP, your system integrator, or Microsoft to properly architect and implement the right high-availability and disaster recovery strategies. It's also important to consider the recovery point objective (RPO) and the recovery time objective, which are specific to your environment.

Microsoft supports some SAP HANA high-availability capabilities with HANA Large Instances. These capabilities include:

- **Storage replication**: The storage system's ability to replicate all data to another HANA Large Instance stamp in another Azure region. SAP HANA operates independently of this method. This functionality is the default disaster recovery mechanism offered for HANA Large Instances.
- **HANA system replication**: The [replication of all data in SAP HANA](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/b74e16a9e09541749a745f41246a065e.html) to a separate SAP HANA system. The recovery time objective is minimized through data replication at regular intervals. SAP HANA supports asynchronous, synchronous in-memory, and synchronous modes. Synchronous mode is used only for SAP HANA systems that are within the same datacenter or less than 100 km apart. With the current design of HANA Large Instance stamps, HANA system replication can be used for high availability within one region only. HANA system replication requires a third-party reverse proxy or routing component for disaster recovery configurations into another Azure region. 
- **Host auto-failover**: A local fault-recovery solution for SAP HANA that's an alternative to HANA system replication. If the master node becomes unavailable, you configure one or more standby SAP HANA nodes in scale-out mode, and SAP HANA automatically fails over to a standby node.

SAP HANA on Azure (Large Instances) is offered in two Azure regions in four geopolitical areas (US, Australia, Europe, and Japan). Two regions within a geopolitical area that host HANA Large Instance stamps are connected to separate dedicated network circuits. These are used for replicating storage snapshots to provide disaster recovery methods. The replication is not established by default but is set up for customers who order disaster recovery functionality. Storage replication is dependent on the usage of storage snapshots for HANA Large Instances. It's not possible to choose an Azure region as a DR region that is in a different geopolitical area. 

The following table shows the currently supported high availability and disaster recovery methods and combinations:

| Scenario supported in HANA Large Instances | High availability option | Disaster recovery option | Comments |
| --- | --- | --- | --- |
| Single node | Not available. | Dedicated DR setup.<br /> Multipurpose DR setup. | |
| Host auto-failover: Scale-out (with or without standby)<br /> including 1+1 | Possible with the standby taking the active role.<br /> HANA controls the role switch. | Dedicated DR setup.<br /> Multipurpose DR setup.<br /> DR synchronization by using storage replication. | HANA volume sets are attached to all the nodes.<br /> DR site must have the same number of nodes. |
| HANA system replication | Possible with primary or secondary setup.<br /> Secondary moves to primary role in a failover case.<br /> HANA system replication and OS control failover. | Dedicated DR setup.<br /> Multipurpose DR setup.<br /> DR synchronization by using storage replication.<br /> DR by using HANA system replication is not yet possible without third-party components. | Separate set of disk volumes are attached to each node.<br /> Only disk volumes of secondary replica in the production site get replicated to the DR location.<br /> One set of volumes is required at the DR site. | 

A dedicated DR setup is where the HANA Large Instance unit in the DR site is not used for running any other workload or non-production system. The unit is passive and is deployed only if a disaster failover is executed. Though, this setup is not a preferred choice for many customers.

Refer [HLI supported scenarios](hana-supported-scenario.md) to learn storage layout and ethernet details for your architecture.

> [!NOTE]
> [SAP HANA MCOD deployments](https://launchpad.support.sap.com/#/notes/1681092) (multiple HANA Instances on one unit) as overlaying scenarios work with the HA and DR methods listed in the table. An exception is the use of HANA System Replication with an automatic failover cluster based on Pacemaker. Such a case only supports one HANA instance per unit. For [SAP HANA MDC](https://launchpad.support.sap.com/#/notes/2096000) deployments, only non-storage-based HA and DR methods work if more than one tenant is deployed. With one tenant deployed, all methods listed are valid.  

A multipurpose DR setup is where the HANA Large Instance unit on the DR site runs a non-production workload. In case of disaster, shut down the non-production system, mount the storage-replicated (additional) volume sets, and then start the production HANA instance. Most customers who use the HANA Large Instance disaster recovery functionality use this configuration. 


You can find more information on SAP HANA high availability in the following SAP articles: 

- [SAP HANA High Availability Whitepaper](https://go.sap.com/documents/2016/05/f8e5eeba-737c-0010-82c7-eda71af511fa.html)
- [SAP HANA Administration Guide](https://help.sap.com/hana/SAP_HANA_Administration_Guide_en.pdf)
- [SAP HANA Academy Video on SAP HANA System Replication](https://scn.sap.com/community/hana-in-memory/blog/2015/05/19/sap-hana-system-replication)
- [SAP Support Note #1999880 – FAQ on SAP HANA System Replication](https://apps.support.sap.com/sap/support/knowledge/preview/en/1999880)
- [SAP Support Note #2165547 – SAP HANA Back up and Restore within SAP HANA System Replication Environment](https://websmp230.sap-ag.de/sap(bD1lbiZjPTAwMQ==)/bc/bsp/sno/ui_entry/entry.htm?param=69765F6D6F64653D3030312669765F7361706E6F7465735F6E756D6265723D3231363535343726)
- [SAP Support Note #1984882 – Using SAP HANA System Replication for Hardware Exchange with Minimum/Zero Downtime](https://websmp230.sap-ag.de/sap(bD1lbiZjPTAwMQ==)/bc/bsp/sno/ui_entry/entry.htm?param=69765F6D6F64653D3030312669765F7361706E6F7465735F6E756D6265723D3139383438383226)

## Network considerations for disaster recovery with HANA Large Instances

To take advantage of the disaster recovery functionality of HANA Large Instances, you need to design network connectivity to the two Azure regions. You need an Azure ExpressRoute circuit connection from on-premises in your main Azure region, and another circuit connection from on-premises to your disaster recovery region. This measure covers a situation in which there's a problem in an Azure region, including a Microsoft Enterprise Edge Router (MSEE) location.

As a second measure, you can connect all Azure virtual networks that connect to SAP HANA on Azure (Large Instances) in one region to an ExpressRoute circuit that connects HANA Large Instances in the other region. With this *cross connect*, services running on an Azure virtual network in Region 1 can connect to HANA Large Instance units in Region 2, and the other way around. This measure addresses a case in which only one of the MSEE locations that connects to your on-premises location with Azure goes offline.

The following graphic illustrates a resilient configuration for disaster recovery cases:

![Optimal configuration for disaster recovery](./media/hana-overview-high-availability-disaster-recovery/image1-optimal-configuration.png)



## Other requirements with HANA Large Instances storage replication for disaster recovery

In addition to the preceding requirements for a disaster recovery setup with HANA Large Instances, you must:

- Order SAP HANA on Azure (Large Instances) SKUs of the same size as your production SKUs and deploy them in the disaster recovery region. In the current customer deployments, these instances are used to run non-production HANA instances. These configurations are referred to as *multipurpose DR setups*.   
- Order additional storage on the DR site for each of your SAP HANA on Azure (Large Instances) SKUs that you want to recover in the disaster recovery site. Buying additional storage lets you allocate the storage volumes. You can allocate the volumes that are the target of the storage replication from your production Azure region into the disaster recovery Azure region.
- In the case, where you have HSR setup on primary, and you setup storage based replication to the DR site, you must purchase additional storage at the DR site so both primary and secondary nodes data gets replicated to the DR site.

  **Next steps**
- Refer [Backup and restore](hana-backup-restore.md).













