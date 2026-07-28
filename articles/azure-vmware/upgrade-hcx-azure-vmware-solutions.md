---
title: Upgrade HCX on Azure VMware Solution 
description: This article explains how to upgrade HCX on Azure VMware Solution. 
ms.topic: how-to
ms.date: 10/14/2025
ms.custom: engagement-fy23
# Customer intent: As an IT administrator managing Azure VMware Solution, I want to upgrade HCX to the latest version, so that I can ensure access to new features, security patches, and continued support while minimizing system downtime.
---

# Upgrade HCX on Azure VMware Solution

In this article, you learn how to upgrade Azure VMware Solution for HCX service updates, which can include new features, software fixes, or security patches. 

You can update HCX Connector and HCX Cloud systems during separate maintenance windows, but for optimal compatibility, we recommend you update both systems together. Apply service updates during a maintenance window where no new HCX operations are queued up.

> [!CAUTION]
> Broadcom has announced the end-of-support (EOS) for VMware HCX versions 4.11.0 - 4.11.2, effective February 20, 2026. To ensure supportability and proactively address this change, Microsoft will soon begin communicating to all Azure VMware Solution customers to upgrade their HCX Cloud Manager to HCX version 4.11.3. HCX 4.11.3 formally deprecates the WAN Optimization feature and, as such, your HCX Cloud Manager will **not** be able to be upgraded if HCX WAN Optimization is still enabled. We advise you to look for alternatives before your upgrade window. Refer to [HCX 4.11.3 release notes](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-11/hcx-4-11-release-notes/vmware-hcx-411-release-notes.html) for more information on what’s new with HCX 4.11.3.

> [!IMPORTANT]
> Microsoft now manages the upgrade of **HCX Cloud Manager** on behalf of customers. These upgrades are either rolled out in waves to all customers or scheduled individually based on customer preference. Customers can **select their preferred maintenance window** for the upgrade when prompted by Microsoft. HCX Connector and Service Mesh appliance upgrades remain customer-managed tasks.

## System requirements 

- For systems requirements, compatibility, and upgrade prerequisites, see the [VMware HCX release notes](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/hcx-4-10-release-notes/Chunk174419121.html#Chunk174419121).  

- For more information about the upgrade path, see the [Product Interoperability Matrix](https://interopmatrix.broadcom.com/Upgrade?productId=660). 
- For information regarding VMware product compatibility by version, see the [Compatibility Matrix](https://interopmatrix.broadcom.com/Interoperability?col=660,&row=0,).
- Review VMware Software Versioning, Skew, and Legacy Support Policies [here](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-support-and-lifecycle-policies-4-10/software-versioning-skew-and-legacy-support-policies.html).

- Ensure HCX manager and site pair configurations are healthy.  

- As part of HCX update planning, and to ensure that HCX components are updated successfully, review the service update considerations and requirements. For planning HCX upgrade, see [Planning for HCX Updates](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-user-guide-4-10/updating-vmware-hcx/planning-for-hcx-updates.html). 

- Ensure that you have a backup and snapshot of HCX connector in the on-premises environment, if applicable.
- For more information, see the [HCX support policy for legacy vSphere environment](https://knowledge.broadcom.com/external/article?legacyId=82702).
- Check that you're using the [latest VMware HCX version validated with Azure VMware Solution](introduction.md#vmware-software-versions).

### Backup HCX 
- Azure VMware Solution backs up HCX Cloud Manager configuration daily.
- Use the appliance management interface to create backup of HCX in on-premises, see [Backing Up HCX Manager](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-user-guide-4-10/backing-up-and-restoring-hcx-manager/backing-up-hcx-manager.html). You can use the configuration backup to restore the appliance to its state before the backup. The contents of the backup file supersede configuration changes made before restoring the appliance. 
- HCX Cloud Manager snapshots are taken automatically during upgrades to HCX 4.4 or later. HCX retains automatic snapshots for 24 hours before deleting them. 

- You can use HCX Run commands to take an HCX Cloud Manager snapshot, which is retained for 72 hours, see [HCX Run commands](/azure/azure-vmware/use-hcx-run-commands)

- To help with reverting from a snapshot, [create a support ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview). 

## Upgrade HCX 
The upgrade process is in two steps: 
1. Upgrade HCX Manager  
      1. HCX Cloud Manager (Microsoft-managed)
      1. HCX Connector (Customer-managed; can be updated in parallel with Cloud Manager) 
1. Upgrade HCX Service Mesh appliances 

### Upgrade HCX manager
The HCX update is first applied to the HCX Manager systems.
 
**What to expect**
- HCX manager is rebooted as part of the upgrade process.  
- HCX vCenter Plugins are updated.  
- There's no data-plane outage during this procedure.

**Prerequisites**
- Verify the HCX Manager system reports healthy connections to the connected (vCenter Server, NSX Manager (if applicable). 
- Verify the HCX Manager system reports healthy connections to the HCX Interconnect service components. (Ensure HCX isn't in an out of sync state)
- Verify that Site Pair configurations are healthy. 
- No VM migrations should be in progress during this upgrade.

**Procedure**
- **Microsoft-managed:** Microsoft upgrades the **HCX Cloud Manager** on behalf of customers during the agreed maintenance window. Microsoft may initiate mass rollouts of newer validated versions or request customer confirmation prior to upgrade scheduling.  
- **Customer-managed:** To manually upgrade **HCX Connector** on-premises or perform validation steps, follow the VMware procedure in [Upgrading the HCX Manager](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-11/vmware-hcx-user-guide-4-11/updating-vmware-hcx/hcx-service-update-procedures/upgrade-hcx-manager-for-connected-sites.html).


### Upgrade HCX Service Mesh appliances 

While Service Mesh appliances are upgraded independently to the HCX Manager, they must be upgraded to ensure compliance and operability. These appliances are flagged for new available updates anytime the HCX Manager has newer software available.

**What to expect**

- Service VMs are rebooted as part of the upgrade.
- There's a small data plane outage during this procedure.
- In-service upgrade of Network-extension can be considered to reduce downtime during HCX Network extension upgrades. 

**Prerequisites**
- All paired HCX Managers on both the source and the target site are updated and all services are returned to a fully converged state. 
- Service Mesh appliances must be initiated using the HCX plug-in of vCenter or the 443 console at the source site 
- No VM migrations should be in progress during this upgrade. 

**Procedure**

To follow the Service Mesh appliances upgrade process, see [Upgrading the HCX Service Mesh Appliances](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-user-guide-4-10/updating-vmware-hcx/hcx-service-update-procedures/upgrade-the-hcx-service-mesh-appliances.html)

## HCX 4.11.0 and what it means for current HCX users

### Overview

Broadcom has announced the end-of-support (EOS) for VMware HCX version 4.10.x, effective July 27, 2025. To address this change and ensure continued support, Microsoft has upgraded all Azure VMware Solution customers using HCX Manager to at least HCX version 4.11.0.

### What changes are introduced as part of HCX 4.11.0?

Refer to [HCX 4.11.0 release notes](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-11/hcx-4-11-release-notes/vmware-hcx-411-release-notes.html) for more information on what’s new with HCX 4.11. Some noteworthy changes are listed below: 

#### Local Mode

From HCX 4.11.0 onwards, only HCX local mode is available. This means that HCX systems running 4.11.0 or later will no longer receive upgrade notifications under the System Updates section from Broadcom. Connected Sites that upgrade to 4.11.0 using offline bundles will operate in Local Mode after the upgrade.

#### Connection to VMware & Hybridity Depot

Activation Keys-based licensing is deprecated as of HCX 4.11.0. Activation Keys in HCX 4.11.0 will stop working 450 days after the upgrade to HCX 4.11.0 takes place. HCX systems running older versions that are currently using Activation Keys will stop working when connect.hcx.vmware.com is decommissioned.

- <ins>hybridity-depot.vmware.com</ins> and <ins>connect.hcx.vmware.com</ins> endpoints for licensing, activation, and updates are removed post-activation or upgrade to HCX 4.11.0. HCX services of <ins>hybridity-depot.vmware.com</ins> and <ins>connect.hcx.vmware.com</ins> will be decommissioned.
- All connected systems automatically transition to local licensing mode as part of upgrade to 4.11.0.

Moving forward, until customers are upgraded to HCX 4.11.0, they'll need to submit a Support Request to receive the requested upgrade bundle for their chosen HCX connection version. After the upgrade has taken place, customers will find previous and current versions of HCX Connector bundles, including HCX 4.11.0, in their vSAN datastores under a folder named _"AVS_Official_HCX_Connector_Binaries"_.

>[!NOTE]
> The following HCX functionality is **deprecated** in HCX 4.11.0 and will be **removed** in a future release. HCX 4.11.0 will no longer be supported as of February 20, 2026. Customers should plan to migrate to an alternative solution at the earliest if they use any of the following features:
> - HCX V2T Migration 
> - HCX WAN Optimization 
> - HCX Disaster Recovery 
> - vCenter Server Plug-in for HCX 
> - HCX UI - Tracking page in Migration interface

## FAQ 

### What is the impact of an HCX upgrade? 

Apply service updates during a maintenance window where no new HCX operations and migration are queued up.  
For individual HCX component upgrade impact, see [Planning for HCX Updates](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-user-guide-4-10/updating-vmware-hcx/planning-for-hcx-updates.html). 

### Do I need to upgrade the service mesh appliances? 

The HCX Service Mesh can be upgraded once all paired HCX Manager systems are updated, and all services are returned to a fully converged state. Check HCX release notes for upgrade requirements. Starting with HCX 4.4.0, HCX appliances installed the VMware Photon Operating System. When upgrading to HCX 4.4.x or later from an HCX version prior to 4.4.0 version, you must upgrade all Service Mesh appliances. 

### How do I roll back HCX upgrade using a snapshot? 

See [Rolling Back an Upgrade Using Snapshots](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-user-guide-4-10/updating-vmware-hcx/hcx-service-update-procedures/rolling-back-an-upgrade-using-snapshots.html) to roll back the upgrade. 

## Next steps 
[Software Versioning, Skew, and Legacy Support Policies](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-support-and-lifecycle-policies-4-10/software-versioning-skew-and-legacy-support-policies.html)  

[Updating VMware HCX](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-10/vmware-hcx-user-guide-4-10/updating-vmware-hcx.html) 
