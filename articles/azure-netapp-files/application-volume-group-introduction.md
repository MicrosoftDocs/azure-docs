---
title: Understand Azure NetApp Files application volume group for SAP HANA | Microsoft Docs
description: Describes the use cases and key features of Azure NetApp Files application volume group for SAP HANA.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 02/24/2023
ms.author: anfdocs
---
# Understand Azure NetApp Files application volume group for SAP HANA 

This article helps you understand the use cases and key features of Azure NetApp Files application volume group for SAP HANA.  

Application volume group for SAP HANA enables you to deploy all volumes required to install and operate an SAP HANA database according to best practices. Instead of individually creating the required SAP HANA volumes (including data, log, shared, log-backup, and data-backup volumes), application volume group for SAP HANA creates these volumes in a single "atomic" call. The atomic call ensures that either all volumes or no volumes at all are created.

Application volume group for SAP HANA provides technical improvements to simplify and standardize the process to help you streamline volume deployments for SAP HANA. As a result, you can focus on your application demands instead of managing technical settings such as individual QoS or sizes for volumes. 

## Key features

Application volume group for SAP HANA is supported for all regions. It provides the following key features:

* Supporting SAP HANA configurations for both single and multiple host setups, including: 
    * Volumes for a single or primary SAP HANA database
    * Volumes for an SAP HANA System Replication (HSR) secondary system
    * Volumes for a disaster recovery (DR) scenario using [cross-region replication](cross-region-replication-introduction.md)

* Creating the following volumes: 
    * SAP HANA data volumes (one for each database host)
    * SAP HANA log volumes (one for each database host)
    * SAP HANA shared volumes (for the first SAP HANA host only)
    * Log-backup volumes (optional)
    * File-based data-backup volumes (optional)

* Creating volumes in a [manual QoS capacity pool](manage-manual-qos-capacity-pool.md). The volume size and the required performance (in MiB/s) are proposed based on user input for the memory size of the database.

* The application volume group GUI and Azure Resource Manager (ARM) template provide best practices to simplify sizing management and volume creation. For example: 
    * Proposing volume naming convention based on SAP System ID (SID) and volume type
    * Calculating the size and performance based on memory size

Application volume group for SAP HANA helps you simplify the deployment process and increase the storage performance for SAP HANA workloads. Some of the new features are as follows:

* Use of proximity placement group (PPG) instead of manual pinning.
    * You will anchor the SAP HANA VMs using a PPG to guaranty lowest possible latency. This PPG will be used to enforce that the data, log, and shared volumes are created in the close proximity to the SAP HANA VMs. See [Best practices about Proximity Placement Groups](application-volume-group-considerations.md#best-practices-about-proximity-placement-groups) for detail.

* Creation of separate storage endpoints (with different IP addresses) for data and log volumes.
    * This deployment method provides better performance and throughput for the SAP HANA database.

## Next steps

* [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Manage volumes in an application volume group](application-volume-group-manage-volumes.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
