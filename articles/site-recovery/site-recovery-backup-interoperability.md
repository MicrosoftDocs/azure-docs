---
title: Azure Site Recovery - Backup Interoperability  | Microsoft Docs
description: Provides an overview of how Azure Site Recovery and Azure Backup can be used together.
services: site-recovery
author: sideeksh
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 02/26/2019
ms.author: sideeksh

---
# About Site Recovery and Backup Interoperability

This article provides guidance for successfully using Azure IaaS VM Backup and Azure VM disaster recovery.

## Azure Backup

Azure Backup helps protect data for on-premises servers, virtual machines, virtualized workloads, SQL servers, SharePoint servers, and more. Azure Site Recovery orchestrates and manages disaster recovery for Azure VMs, on-premises VMs, and physical servers.

## Azure Site Recovery

It's possible to configure both Azure Backup and Azure Site Recovery on a VM or a group of VMs. Both products are interoperable. A few scenarios where the interoperability between Backup and Azure Site Recovery becomes important are as follows:

### File Backup/Restore

If Backup and Replication are both enabled, and a backup is taken, there is no issue with restoring any file(s) on the source-side VM or the group of VMs. Replication will continue as usual with no change in Replication Health.

### Disk Backup/Restore

If you restore disk from the backup then protection of the virtual machine has to be enabled again.

### VM Backup/Restore

Backup and restore of a VM or group of VMs is not supported. To make it work, protection needs to be re-enabled.

**Scenario** | **Supported by Azure Site Recovery?** | **Workaround, if any**  
--- | --- | ---
File/folder backup | Yes | Not Applicable
Disk backup | Not currently | Disable and Enable Protection
VM backup | No | Disable and Enable Protection
