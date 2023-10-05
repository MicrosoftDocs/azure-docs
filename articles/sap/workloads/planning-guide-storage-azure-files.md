---
title: 'Azure Premium Files NFS and SMB for SAP'
description: Using Azure Premium Files NFS and SMB for SAP workload
author: msftrobiro
manager: msjuergent
tags: azure-resource-manager
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure-services
ms.date: 04/26/2023
ms.author: robiro
---

# Using Azure Premium Files NFS and SMB for SAP workload

This document is about Azure Premium Files file shares used for SAP workload. Both NFS volumes and SMB file shares are covered. For considerations around Azure NetApp Files for SMB or NFS volumes, see the following two documents:

- [Azure Storage types for SAP workload](./planning-guide-storage.md)
- [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)

> [!IMPORTANT]
> The suggestions for the storage configurations in this document are meant as directions to start with. Running workload and analyzing storage utilization patterns, you might realize that you are not utilizing all the storage bandwidth or IOPS provided. You might consider downsizing on storage then. Or in contrary, your workload might need more storage throughput than suggested with these configurations. As a result, you might need to deploy more capacity to increase IOPS or throughput. In the field of tension between storage capacity required, storage latency needed, storage throughput and IOPS required and least expensive configuration, Azure offers enough different storage types with different capabilities and different price points to find and adjust to the right compromise for you and your SAP workload.

For SAP workloads, the supported uses of Azure Files shares are:

- sapmnt volume for a distributed SAP system
- transport directory for SAP landscape
- /hana/shared for HANA scale-out
- file interface between your SAP landscape and other applications

> [!NOTE]
> No SAP DBMS workloads are supported on Azure Premium Files volumes, NFS or SMB. For support restrictions on Azure storage types for SAP NetWeaver/application layer of S/4HANA, read the [SAP support note 2015553](https://launchpad.support.sap.com/#/notes/2015553)

## Important considerations for Azure Premium Files shares with SAP

When you plan your deployment with Azure Files, consider the following important points. The term share in this section applies to both SMB share and NFS volume.   

- The minimum share size is 100 gibibytes (GiB). With Azure Premium Files, you pay for the [capacity of the provisioned shares](/azure/storage/files/understanding-billing#provisioned-model). 
- Size your file shares not only based on capacity requirements, but also on IOPS and throughput requirements. For details, see [Azure files share targets](/azure/storage/files/storage-files-scale-targets#azure-file-share-scale-targets).
- Test the workload to validate your sizing and ensure that it meets your performance targets. To learn how to troubleshoot performance issues with NFS on Azure Files, consult [Troubleshoot Azure file share performance](/azure/storage/files/storage-troubleshooting-files-performance).
- Deploy a separate `sapmnt` share for each SAP system.
- Don't use the `sapmnt` share for any other activity, such as interfaces.
- Don't use the `saptrans` share for any other activity, such as interfaces.
- If your SAP system has a heavy load of batch jobs, you might have millions of job logs. If the SAP batch job logs are stored in the file system, pay special attention to the sizing of the `sapmnt` share. Reorganize the job log files regularly as per [SAP note 16083](https://launchpad.support.sap.com/#/notes/16083). As of SAP_BASIS 7.52, the default behavior for the batch job logs is to be stored in the database. For details, see [SAP note 2360818 | Job log in the database](https://launchpad.support.sap.com/#/notes/2360818).
- Avoid consolidating the shares for too many SAP systems in a single storage account. There are also [scalability and performance targets for storage accounts](/azure/storage/files/storage-files-scale-targets#storage-account-scale-targets). Be careful to not exceed the limits for the storage account, too.
- In general, don't consolidate the shares for more than *five* SAP systems in a single storage account. This guideline helps you avoid exceeding the storage account limits and simplifies performance analysis.   
- In general, avoid mixing shares like `sapmnt` for non-production and production SAP systems in the same storage account.
- Use a [private endpoint](/azure/storage/files/storage-files-networking-endpoints) with Azure Files. In the unlikely event of a zonal failure, your NFS sessions automatically redirect to a healthy zone. You don't have to remount the NFS shares on your VMs. Use of private link can result in extra charges for the data processed, see details about [private link pricing](https://azure.microsoft.com/pricing/details/private-link/).
- If you're deploying your VMs across availability zones, use a [storage account with ZRS](/azure/storage/common/storage-redundancy#zone-redundant-storage) in the Azure regions that support ZRS.
- Azure Premium Files doesn't currently support automatic cross-region replication for disaster recovery scenarios. See [guidelines on DR for SAP applications](disaster-recovery-overview-guide.md) for available options.

Carefully consider when consolidating multiple activities into one file share or multiple file shares in one storage accounts. Distributing these shares onto separate storage accounts improves throughput, resiliency and simplifies the performance analysis. If many SAP SIDs and shares are consolidated onto a single Azure Files storage account and the storage account performance is poor due to hitting the throughput limits. It can become difficult to identify which SID or volume is causing the problem.

## NFS additional considerations

- We recommend that you deploy on SLES 15 SP2 or higher, RHEL 8.4 or higher to benefit from [NFS client improvements](/azure/storage/files/storage-troubleshooting-files-nfs#ls-hangs-for-large-directory-enumeration-on-some-kernels).
- Mount the NFS shares with [documented mount](/azure/storage/files/storage-files-how-to-mount-nfs-shares) options, with [troubleshooting](/azure/storage/files/storage-troubleshooting-files-nfs#cannot-connect-to-or-mount-an-nfs-azure-file-share) information available for mount or connection problems.
- For SAP J2EE systems, placing `/usr/sap/<SID>/J<nr>` on NFS on Azure Files isn't supported.

## SMB additional considerations

- SAP software provisioning manager (SWPM) version 1.0 SP32, SWPM 2.0 SP09 or higher is required to use Azure Files SMB. SAPInst patch must be 749.0.91 or higher. If SWPM/SAPInst doesn't accept more than 13 characters for file share server, then the SWPM version is too old.
- During the installation of the SAP PAS Instance, SWPM/SAPInst will ask to input a transport hostname. The FQDN of the storage account should be entered <storage_account>.file.core.windows.net or with IP address/hostname of the private endpoint, if used.
- When you integrate the active directory domain with Azure Files SMB for [SAP high availability deployment](high-availability-guide-windows-azure-files-smb.md), the SAP users and groups must be added to the ‘sapmnt’ share. The SAP users should have permission `Storage File Data SMB Share Elevated Contributor` set in the Azure portal.

## Next steps

For more information, see:
- [Azure Storage types for SAP workload](planning-guide-storage.md)
- [SAP HANA High Availability guide for Azure virtual machines](sap-hana-availability-overview.md)


