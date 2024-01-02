---
title: Updates and component upgrades in Azure Site Recovery
description: Provides an overview of Azure Site Recovery service updates, MARS agent and component upgrades.
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 08/11/2021
---
# Service updates in Site Recovery

This article provides an overview of [Azure Site Recovery](site-recovery-overview.md) updates, and describes how to upgrade Site Recovery components.

Site Recovery publishes service updates on a regular basis. Updates include new features, support improvements, component updates, and bug fixes. In order to take advantage of the latest features and fixes, we recommend running the latest versions of Site Recovery components. 
 
 
## Updates support

### Support statement for Azure Site Recovery

We recommend always upgrading to the latest component versions:

**With every new version 'N' of an Azure Site Recovery component that's released, all versions below 'N-4' are considered to be out of support**. 

> [!IMPORTANT]
> Official support is for upgrading from > N-4 version to N version. For example, if you're running  you are on N-6, you need to first upgrade to N-4, and then upgrade to N.


### Links to currently supported update rollups

 Review the latest update rollup (version N) in [this article](site-recovery-whats-new.md). Remember that Site Recovery provides support for N-4 versions.


## Component expiry

Site Recovery notifies you of expired components (or nearing expiry) by email (if you subscribed to email notifications), or on the vault dashboard in the portal.

- In addition, when updates are available, in the infrastructure view for your scenario in the portal, an **Update available** button appears next to the component. This button redirects you to a link for downloading the latest component version.
-  Vaults dashboard notifications aren't available if you're replicating Hyper-V VMs. 

Emails notifications are sent as follows.

**Time** | **Frequency**
--- | ---
60 days before component expiry | Once bi-weekly
Next 53 days | Once a week
Last 7 days | Once a day
After expiry | Once bi-weekly


### Upgrading outside official support

If the difference between your component version and the latest release version is greater than four, this is considered out of support. In this case, upgrade as follows: 

1. Upgrade the currently installed component to your current version plus four. For example, if your version if 9.16, then upgrade to 9.20.
2. Then, upgrade to the next compatible version. So in our example, after upgrading 9.16 to 9.20, upgrade to 9.24. 

Follow the same process for all relevant components.

### Support for latest operating systems/kernels

> [!NOTE]
> If you have a maintenance window scheduled, and a reboot is included in it, we recommend that you first upgrade Site Recovery components, and then proceed with the rest of the scheduled activities in the maintenance window.

1. Before upgrading operating system/kernel versions, verify if the target version is supported Site Recovery. 

    - [Azure VM](azure-to-azure-support-matrix.md#replicated-machine-operating-systems) support.
    - [VMware/physical server](vmware-physical-azure-support-matrix.md#replicated-machines) support
    - [Hyper-V](hyper-v-azure-support-matrix.md#replicated-vms) support.
2. Review [available updates](site-recovery-whats-new.md) to find out what you want to upgrade.
3. Upgrade to the latest Site Recovery version.
4. Upgrade the operating system/kernel to the required versions.
5. Reboot.


This process ensures that the machine operating system/kernel is upgraded to the latest version, and that the latest Site Recovery changes needed to support the new version are loaded on to the machine.

## Azure VM disaster recovery to Azure

In this scenario, we strongly recommend that you [enable automatic updates](azure-to-azure-autoupdate.md). You can allow Site Recovery to manage updates as follows:

- During the enable replication process.
- By setting the extension update settings inside the vault.

If you want to manually manage updates, you may choose one of the following options:

1. When a new agent update is available, Site Recovery provides a notification in the vault towards the top of the page. In the vault > **Replicated Items**, click this notification at the top of the screen: 
    
    **New Site Recovery replication agent update is available. Click to install ->** <br/><br/>Select the VMs for which you want to apply the update, and then click **OK**.

2. On the VM disaster recovery overview page, you will find the 'Agent status' field which will say 'Critical Upgrade' if the agent is due to expire. Click on it and follow the subsequent instructions to manually upgrade the virtual machine.

## VMware VM/physical server disaster recovery to Azure

1. Based on your current version and the [support statement](#support-statement-for-azure-site-recovery), install the update first on the on-premises configuration server, using [these instructions](vmware-azure-deploy-configuration-server.md#upgrade-the-configuration-server). 
2. If you have scale-out process servers, update them next, using [these instructions](vmware-azure-manage-process-server.md#upgrade-a-process-server).
3. To update the Mobility agent on each protected machine, refer to [this](vmware-physical-manage-mobility-service.md#update-mobility-service-from-azure-portal) article.

### Reboot after Mobility service upgrade

A reboot is recommended after every upgrade of the Mobility service, to ensure that all the latest changes are loaded on the source machine.

A reboot isn't mandatory, unless the difference between the agent version during last reboot, and the current version, is greater than four.

The example in the table shows how this works.

|**Agent version (last reboot)** | **Upgrade to** | **Mandatory reboot?**|
|---------|---------|---------|
|9.16 |  9.18 | Not mandatory|
|9.16 | 9.19 | Not mandatory|
| 9.16 | 9.20 | Not mandatory
 | 9.16 | 9.21 | Mandatory.<br/><br/> Upgrade to 9.20, then reboot before upgrading to 9.21.

## Hyper-V VM disaster recovery to Azure

### Between a Hyper-V site and Azure

1. Download the update for the Microsoft Azure Site Recovery Provider.
2. Install the Provider on each Hyper-V server registered in Site Recovery. If you're running a cluster, upgrade on all cluster nodes.


## Between an on-premises VMM site and Azure

1. Download the update for the Microsoft Azure Site Recovery Provider.
2. Install the Provider on the VMM server. If VMM is deployed in a cluster, install the Provider on all cluster nodes.
3. Install the latest Microsoft Azure Recovery Services agent (MARS for Azure Site Recovery) on all Hyper-V hosts or cluster nodes.

## Between two on-premises VMM sites

1. Download the latest update for the Microsoft Azure Site Recovery Provider.
2. Install the latest Provider on the VMM server managing the secondary recovery site. If VMM is deployed in a cluster, install the Provider on all cluster nodes.
3. After the recovery site is updated, install the Provider on the VMM server that's managing the primary site.

## Next steps

Follow our [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page to track new updates and releases.