---
title: Operating system backup and restore of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn how to do operating system backup and restore for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter:
author: lauradolan
manager: juergent
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/22/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# OS backup and restore

This article walks through the steps to do an operating system (OS) file-level backup and restore. The procedure differs depending on parameters like Type I or Type II, Revision 3 or above, location, and so on. Check with Microsoft operations to get the values for these parameters for your resources.

## OS backup and restore for Type II SKUs of Revision 3 stamps

Refer this documentation: [OS backup and restore for Type II SKUs of Revision 3 stamps](./os-backup-hli-type-ii-skus.md)


## OS backup and restore for all other SKUs

The information below describes the steps to do an operating system file-level backup and restore for all SKUs of all Revisions except **Type II  SKUs** of the HANA Large Instances of Revision 3.

### Take a manual backup

Get the latest Microsoft Snapshot Tools for SAP HANA as explained in a series of articles starting with [What is Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-introduction.md). Configure and test them as described in these articles:

- [Configure Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-configure.md)
- [Test Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-test.md) 

This review will prepare you to run backup regularly via `crontab` as described in [Back up using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-backup.md). 

For more information, see these references:

- [Install Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-installation.md)
- [Configure Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-configure.md)
- [Test Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-test.md)
- [Back up using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-backup.md)
- [Obtain details using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-details.md)
- [Delete using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-delete.md)
- [Restore using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-restore.md)
- [Disaster recovery using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-disaster-recovery.md)
- [Troubleshoot Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-troubleshoot.md)
- [Tips and tricks for using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-tips.md)


### Restore a backup

The restore operation cannot be done from the OS itself. You'll need to raise a support ticket with Microsoft operations. The restore operation requires the HANA Large Instance (HLI) to be in powered off state, so schedule accordingly.

### Managed OS snapshots

Azure can automatically take OS backups for your HLI resources. These backups are taken once daily, and Azure keeps up to the latest three such backups. These backups are enabled by default for all customers in the following regions:
- West US
- Australia East
- Australia Southeast
- South Central US
- East US 2

This facility is partially available in the following regions:
- East US
- North Europe
- West Europe

The frequency or retention period of the backups taken by this facility can't be altered. If a different OS backup strategy is needed for your HLI resources, you may opt out of this facility by raising a support ticket with Microsoft operations. Then configure Microsoft Snapshot Tools for SAP HANA to take OS backups by using the instructions provided earlier in the section, [Take a manual backup](#take-a-manual-backup).

## Next steps

Learn how to enable kdump for HANA Large Instances.

> [!div class="nextstepaction"]
> [kdump for SAP HANA on Azure Large Instances](hana-large-instance-enable-kdump.md)
