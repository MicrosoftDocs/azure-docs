---
title: Deploy disaster recovery using JetStream DR
description: Learn how to deploy JetStream DR for your Azure VMware Solution private cloud and on-premises VMware workloads. 
ms.topic: how-to
ms.date: 07/07/2021

#Customer intent: 

---

# Deploy disaster recovery using JetStream DR

In this article, you'll deploy [JetStream DR](https://www.jetstreamsoft.com/solutions/disaster-recovery-for-azure-vmware-solution/#) for your Azure VMware Solution private cloud and on-premises VMware workloads. It provides a foundation for real-time replication to a ready failover environment. For example, VMware workloads instantly fail over from on-premises to the Azure VMware Solution environment. For virtual machines (VMs) that run in Azure VMware Solution, they fail over to a different Azure region.

The key advantages of using JetStream DR on Azure VMware Solution are:

- **Data replication to cost‐efficient Microsoft Azure Blob Storage:** Storing VMs and their data in an object store reduces storage costs; also, JetStream DR provides inline data compression and embedded garbage collection to minimize the amount of storage capacity required. 

- **Datastore agnostic in both the protected site and the recovery site:** JetStream DR captures data through IO Filters that run within vSphere; the underlying datastore can be VMFS, VSAN, vVol, or any HCI platform. Similarly, the recovery site can run any datastore. 

- **Lightweight deployment and simple operation:** JetStream DR is deployed to the protected environment from a VMware certified VIB, and managed through a vCenter plug‐in appliance.  


## Supported scenarios


## Prerequisites


## Activate JetStream DR in your subscription


## Deploy JetStream DR in the cluster




## Install the JetStream DR Management Server Appliance

JetStream DR software consists of three main components: Management Server Virtual Appliance (MSA), DR Virtual Appliance (DRVA), and host components (IO Filter packages). 

The MSA is used to install and configure host components on the compute cluster and then to administer JetStream DR software. The DRVA runs the data path DR components. Multiple DRVAs can run concurrently for better scalability. Each DRVA has one or more dedicated partitions attached as an iSCSI LUN or as a low‐latency VDISK. The partitions are used to maintain replication logs and repositories for persistent metadata.


## Register the vCenter Server with the MSA



## Next steps

