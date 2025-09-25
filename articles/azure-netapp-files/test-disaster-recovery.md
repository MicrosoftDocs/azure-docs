---
title: Test Disaster Recovery for Azure NetApp Files
description: Use this test plan for cross-region and cross-zone replication to improve your disaster recovery preparedness and ensure that systems recover efficiently.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 07/28/2025
ms.author: anfdocs
# Customer intent: As a disaster recovery coordinator, I want to test the disaster recovery configuration using cross-region replication, so that I can ensure our systems meet the required recovery objectives and maintain operational readiness without impacting current operations.
---  

# Test disaster recovery for Azure NetApp Files

An effective disaster recovery plan includes testing your disaster recovery configuration. Testing your disaster recovery configuration demonstrates the efficacy of your disaster recovery configuration and that it can achieve the desired recovery point objective (RPO) and recovery time objective (RTO). Testing disaster recovery also ensures that operational runbooks are accurate and that operational staff are trained on the workflow.

You can test this disaster recovery workflow for [cross-region or cross-zone replication](replication.md). You can test your disaster recovery understanding and preparedness without disrupting the existing replication schedule, which poses no risk to RPO or RTO. This test plan also uses Azure NetApp Files' ability to [create new volumes from the snapshots](snapshots-restore-new-volume.md) in cross-region replication.

## Prerequisites

* Application consistent snapshots should be created in the volumes hosted in the primary region. Application data hosted in Azure NetApp Files volumes must be in a consistent state before you create the snapshot. 

    The [Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) can be used to create application consistent snapshots. 

    >[!NOTE]
    >If the data in the snapshot isn't consistent, the disaster recovery workflow or test workflow might not work properly.

* Cross-region or cross-zone replication must be established. The [replication status must be healthy](cross-region-replication-display-health-status.md).

## Steps

Given the uniqueness of each application architecture, there's no specific workflow to test your disaster recovery workflow. The outlined steps are a high-level overview for disaster recovery testing.

1. [Prepare Azure virtual machines (VMs) in the secondary region or availability zone](cross-region-replication-create-peering.md). You must configure the following items:
    * The operating system
    * Application
    * User accounts
    * Domain Name System (DNS)
    * Any other resources required to run the application in the secondary region
1. [Create new volumes from the most recent snapshots](snapshots-restore-new-volume.md) replicated to the Azure NetApp Files data protection volumes in the secondary region.
    >[!NOTE]
    > Cross-region replication baseline snapshots can't be used to create volumes.
1. [Mount the volumes](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) to the application VMs from Step 1
1. Run the application in the secondary zone or region. Test the application's functionality.
1. Bring down the application in the secondary zone or region.
1. Unmount the volumes from the application VM in the secondary zone or region. 
1. Delete the volumes created from the snapshot in step 2. 
1. Bring down the Azure VM in the secondary zone or region. Clean up any resources configured to support the disaster recovery testing. 

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Cross-region replication of Azure NetApp Files volumes](replication.md)
* [Requirements and considerations for using cross-region replication](replication-requirements.md)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)
* [What is Azure Application Consistent Snapshot tool](azacsnap-introduction.md)
