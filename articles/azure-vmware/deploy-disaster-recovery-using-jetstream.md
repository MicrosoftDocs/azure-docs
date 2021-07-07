---
title: Deploy disaster recovery using JetStream DR
description: Learn how to deploy JetStream DR for your Azure VMware Solution private cloud and on-premises VMware workloads. 
ms.topic: how-to
ms.date: 07/07/2021

#Customer intent: 

---

# Deploy disaster recovery using JetStream DR

[JetStream Disaster Recovery (DR)](https://www.jetstreamsoft.com/product-portfolio/jetstream-dr/) is installed in a VMware vSphere environment and managed through a vCenter plug-in appliance. It provides cloud-native Continuous Data Protection (CDP), which constantly replicates virtual machine (VM) I/O operations. Instead of capturing snapshots at regular intervals, it continuously captures and replicates data as it's written to the primary storage with minimal impact on running applications.  It allows you to quickly recover VMs and their data, reaching a lower recovery point objective (RPO).  

With Azure VMware Solution, you can store data directly to a recovery cluster in vSAN or attached file systems like Azure NetApp Files. The data gets captured through I/O filters that run within vSphere. The underlying data store can be VMFS, VSAN, vVol, or any HCI platform. 


[diagram]



In this article, you'll deploy and learn how to use JetStream DR in your Azure VMware Solution private cloud and on-premises VMware workloads.


## Supported scenarios


### On-premises to cloud deployment


### Cloud to cloud deployment



## Prerequisites

[put the AVS-specific prereqs here]

### Protected site


### Recovery site


### Network 


## Activate JetStream DR in your subscription


## Deploy JetStream DR in the cluster




## Install the JetStream DR Management Server Appliance

JetStream DR software consists of three main components: Management Server Virtual Appliance (MSA), DR Virtual Appliance (DRVA), and host components (IO Filter packages). 

The MSA is used to install and configure host components on the compute cluster and then to administer JetStream DR software. The DRVA runs the data path DR components. Multiple DRVAs can run concurrently for better scalability. Each DRVA has one or more dedicated partitions attached as an iSCSI LUN or as a low‐latency VDISK. The partitions are used to maintain replication logs and repositories for persistent metadata.


## Register the vCenter Server with the Management Server Appliance



## Next steps
