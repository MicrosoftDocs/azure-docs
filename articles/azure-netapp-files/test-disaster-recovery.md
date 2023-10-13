---
title: Test disaster recovery for Azure NetApp Files | Microsoft Docs
description: Enhance your disaster recovery preparedness with this test plan for cross-region replication.  
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 09/26/2023
ms.author: anfdocs
---  

# Test disaster recovery using cross-region replication for Azure NetApp Files

An effective disaster recovery plan includes testing your disaster recovery configuration. Testing your disaster recovery configuration demonstrates the efficacy of your disaster recovery configuration and that it can achieve the desired recovery point objective (RPO) and recovery time objective (RTO). Testing disaster recovery also ensures that operational runbooks are accurate and that operational staff are trained on the workflow.

This disaster recovery test workflow uses [cross-region replication](cross-region-replication-introduction.md). With cross-region replication, you can test your disaster recovery understanding and preparedness without disrupting the existing replication schedule, posing no risk to RPO or RTO. This test plan also leverages Azure NetApp Files' ability to [create new volumes from the snapshots](snapshots-restore-new-volume.md) in cross-region replication.

## Pre-requisites

* Application consistent snapshots should be created in the volumes hosted in the primary region. Application data hosted in Azure NetApp Files volumes must be in a consistent state prior to the creation of the snapshot. 

    The [Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) can be used to create application consistent snapshots. 

    >[!NOTE]
    >If the data in the snapshot is not consistent, the disaster recovery workflow or test workflow may not work properly.

* Cross-region replication must be set up. The [replication status must be healthy](cross-region-replication-display-health-status.md).

## Steps

Given the uniqueness of each application architecture, there's no specific workflow to test your disaster recovery workflow. The outlined steps are a high-level overview for disaster recovery testing.

1. [Prepare Azure virtual machines (VMs) in the secondary region](cross-region-replication-create-peering.md). You must configure:
    * The operating system
    * Application
    * User accounts
    * DNS
    * Any other resources required to run the application in the secondary region
1. [Create new volumes from the most recent snapshots](snapshots-restore-new-volume.md) replicated to the Azure NetApp Files data protection volumes in the secondary region.
    >[!NOTE]
    > Cross-region replication baseline snapshots cannot be used to create volumes.
1. [Mount the volumes](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) to the application VMs from Step 1
1. Run the application in the secondary region. Test the application's functionality.
1. Bring down the application in the secondary region.
1. Unmount the volumes from the application VM in the secondary region. 
1. Delete the volumes created from the snapshot in step 2. 
1. Bring down the Azure VM in the secondary region. Clean up any resources configured to support the disaster recovery testing. 

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Cross-region replication of Azure NetApp Files volumes](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)
* [What is Azure Application Consistent Snapshot tool](azacsnap-introduction.md)
