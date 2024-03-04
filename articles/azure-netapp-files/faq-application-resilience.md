---
title: Application resilience FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about Azure NetApp Files application resilience.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 12/6/2022
---
# Application resilience FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files application resilience.

## What do you recommend for handling potential application disruptions due to storage service maintenance events?

Azure NetApp Files might undergo occasional planned maintenance (for example, platform updates, service or software upgrades). From a file protocol (NFS/SMB) perspective, the maintenance operations are nondisruptive, as long as the application can handle the IO pauses that might briefly occur during these events. The I/O pauses are typically short, ranging from a few seconds up to 30 seconds. The NFS protocol is especially robust, and client-server file operations continue normally. Some applications might require tuning to handle IO pauses for as long as 30-45 seconds. As such, ensure that you're aware of the application’s resiliency settings to cope with the storage service maintenance events. For human interactive applications leveraging the SMB protocol, the standard protocol settings are usually sufficient. 

>[!IMPORTANT]
>To ensure a resilient architecture, it is crucial to recognize that the cloud operates under a _shared responsibility_ model. This model encompasses the Azure cloud platform, its infrastructure services, the OS-layer, and application vendors. Each of these components plays a vital role in gracefully handling potential application disruptions that may arise during storage service maintenance events.

## Do I need to take special precautions for SMB-based applications?

Yes, certain SMB-based applications require SMB Transparent Failover. SMB Transparent Failover enables maintenance operations on the Azure NetApp Files service without interrupting connectivity to server applications storing and accessing data on SMB volumes. To support SMB Transparent Failover for specific applications, Azure NetApp Files now supports the [SMB Continuous Availability shares option](azure-netapp-files-create-volumes-smb.md#continuous-availability). Using SMB Continuous Availability is only supported for workloads on:
* Citrix App Layering
* [FSLogix user profile containers](../virtual-desktop/create-fslogix-profile-container.md)
* Microsoft SQL Server (not Linux SQL Server)

>[!CAUTION]
>Custom applications are not supported with SMB Continuous Availability and cannot be used with SMB Continuous Availability enabled volumes.

## I'm running IBM MQ on Azure NetApp Files. What precautions can I take to avoid disruptions due to storage service maintenance events despite using the NFS protocol?

If you're running the [IBM MQ application in a shared files configuration](https://www.ibm.com/docs/en/ibm-mq/9.2?topic=multiplatforms-sharing-mq-files), where the IBM MQ data and logs are stored on an Azure NetApp Files volume, the following considerations are recommended to improve resilience during storage service maintenance events:

* You must use NFS v4.1 protocol only.
* For High Availability, you should use an [IBM MQ multi-instance configuration using shared NFS v4.1 volumes](https://www.ibm.com/docs/en/ibm-mq/9.2?topic=manager-create-multi-instance-queue-linux). 
* You should verify the functionality of the [IBM multi-instance configuration using shared NFS v4.1 volumes](https://www.ibm.com/docs/en/ibm-mq/9.2?topic=multiplatforms-verifying-shared-file-system-behavior). 
* You should implement a scale-out IBM MQ architecture instead of using one large multi-instance IBM MQ configuration. By spreading message processing load across multiple IBM MQ multi-instance pairs, the chance of service interruption might be decreased because each MQ multi-instance pair would be processing fewer messages.

> [!NOTE] 
> The number of messages that each MQ multi-instance pair should process is highly dependent on your specific environment. You need to decide how many MQ multi-instance pairs would be needed, or what the scale-up or scale-down rules would be.

The scale-out architecture would be comprised of multiple IBM MQ multi-instance pairs deployed behind an Azure Load Balancer. Applications configured to communicate with IBM MQ would then be configured to communicate with the IBM MQ instances via Azure Load Balancer. For support related to IBM MQ on shared NFS volumes, you should obtain vendor support at IBM.

## I'm running Apache ActiveMQ with LevelDB or KahaDB on Azure NetApp Files. What precautions can I take to avoid disruptions due to storage service maintenance events despite using the *NFS* protocol?

>[!NOTE]
> This section contains references to the terms *slave* and *master*, terms that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

If you're running the Apache ActiveMQ, it's recommended to deploy [ActiveMQ High Availability with Pluggable Storage Lockers](https://www.openlogic.com/blog/pluggable-storage-lockers-activemq). 

ActiveMQ high availability (HA) models ensure that a broker instance is always online and able to process message traffic. The two most common ActiveMQ HA models involve sharing a filesystem over a network. The purpose is to provide either LevelDB or KahaDB to the active and passive broker instances. These HA models require that an OS-level lock be obtained and maintained on a file in the LevelDB or KahaDB directories, called "lock." There are some problems with this ActiveMQ HA model. They can lead to  a "no-master" situation, where the "slave" isn’t aware that it can lock the file.  They can also lead to a "master-master" configuration that results in index or journal corruption and ultimately message loss. Most of these problems stem from factors outside of ActiveMQ's control. For instance, a poorly optimized NFS client can cause locking data to become stale under load, leading to “no-master” downtime during failover. 

Because most problems with this HA solution stem from inaccurate OS-level file locking, the ActiveMQ community [introduced the concept of a pluggable storage locker](https://www.openlogic.com/blog/pluggable-storage-lockers-activemq) in version 5.7 of the broker. This approach allows a user to take advantage of a different means of the shared lock, using a row-level JDBC database lock as opposed to an OS-level filesystem lock. For support or consultancy on ActiveMQ HA architectures and deployments, you should [contact OpenLogic by Perforce](https://www.openlogic.com/contact-us).

## I'm running Apache ActiveMQ with LevelDB or KahaDB on Azure NetApp Files. What precautions can I take to avoid disruptions due to storage service maintenance events despites using the *SMB* protocol?

The general industry recommendation is to [not run your KahaDB shared storage on CIFS/SMB](https://www.openlogic.com/blog/activemq-community-deprecates-leveldb-what-you-need-know). If you're having trouble maintaining accurate lock state, check out the JDBC Pluggable Storage Locker, which can provide a more reliable locking mechanism. For support or consultancy on ActiveMQ HA architectures and deployments, you should [contact OpenLogic by Perforce](https://www.openlogic.com/contact-us).

## I’m running Boomi on Azure NetApp Files. What precautions can I take to avoid disruptions due to storage service maintenance events?

If you're running Boomi, it's recommended you follow the [Boomi Best Practices for Run Time High Availability and Disaster Recovery](https://community.boomi.com/s/article/bestpracticesforruntimehighavailabilityanddisasterrecovery).

Boomi recommends Boomi Molecule is used to implement high availability for Boomi Atom. The [Boomi Molecule system requirements](https://help.boomi.com/bundle/integration/page/r-atm-Molecule_system_requirements.html) state that either NFS with NFS locking enabled (NLM support) or SMB file shares can be used. In the context of Azure NetApp Files, NFSv4.1 volumes have NLM support.

Boomi recommends that SMB file share is used with Windows VMs; for NFS, Boomi recommends Linux VMs.

>[!NOTE]
>[Azure NetApp Files Continuous Availability Shares](enable-continuous-availability-existing-smb.md) are not supported with Boomi. 

## Next steps  

- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Integration FAQs](faq-integration.md)
- [Mount NFS volumes for Linux or Windows VMs](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
- [Mount SMB volumes for Windows VMs](mount-volumes-vms-smb.md)
