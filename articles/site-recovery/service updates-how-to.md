---
title: Azure Site Recovery updates | Microsoft Docs
description: Provides an overview of servic eupdates & how to upgrade components used in Azure Site Recovery.
services: site-recovery
author: rajani-janaki-ram 
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 01/8/2019
ms.author: rajanaki

---
# Service updates in Azure Site Recovery
As an organization, you need to figure out how you're going to keep your data safe, and apps/workloads running when planned and unplanned outages occur. Azure Site Recovery contributes to your BCDR strategy by keeping your apps running on VMs and physical servers available if a site goes down. Site Recovery replicates workloads running on VMs and physical servers so that they remain available in a secondary location if the primary site isn't available. It recovers workloads to the primary site when it's up and running again.

Site Recovery can manage replication for:

- [Azure VMs replicating between Azure regions](azure-to-azure-tutorial-dr-drill.md).
- On-premises virtual machines and physical servers replicating to Azure, or to a secondary site.
To know more refer to the  documentation [here](https://docs.microsoft.com/azure/site-recovery) .

Azure Site Recovery publishes service updates on a regular basis - including the addition of new features, improvements in the support matrix, and bug fixes if any. In order to stay current take adavantage of all the latest features & enhancements & bug fixes if any, users are advised to always update to the latest versions of Azure SIte Recovery components. 
 
## Support statement for Azure Site Recovery 

> [!IMPORTANT]
> **With every new version 'N' of an Azure Site Recovery component that is released, all versions below 'N-4' is considered out of support**. Hence it is always advisable to upgrade to the latest versions available.

> [!IMPORTANT]
> The official support for upgrades is from > N-4 to N version (N being the latest version). If you are on N-6, you need to first upgrade to N-4, and then upgrade to N.

### Upgrading when the difference between current version and latest released version is greater than 4

1. As a first step, upgrade the currently installed component from version say N to N+4, and then move to the next compatible version. Let's say the current version is 9.24, and you are on 9.16, first upgrade to 9.20 and then to 9.24.
2. Follow the same process for all components depending on the scenario.

### Support for latest OS/kernel versions

> [!NOTE]
> If you have a maintenance window scheduled, and a reboot is part of the same, we recommend you first upgrade the Site Recovery components and proceed with the rest of the scheduled activities.

1. Before upgrading your Kernel/OS versions, first verify if the target version is supported by Azure Site Recovery. You can find the information in our documentation for Azure VMs, [VMware VMs](vmware-physical-azure-support-matrix.md) & Hyper-V VMs in
2. Refer our [Service Updates](https://azure.microsoft.com/updates/?product=site-recovery) to find out which version of Site Recovery components support the specific versionn you want to upgrade to.
3. First, upgrade to the latest Site Recover version.
4. Now, upgrade the OS/Kernel to the desired versions.
5. Perform a reboot.
6. This will ensure that the OS/Kernel version on your machines are upgraded to the latest version, and also that the latest Site Recovery changes which are required to support the new version are also loaded on the source machine.



## Azure VM disaster recovery to Azure
In this scenario, we strongly recommend that you [enable](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-autoupdate) automatic updates. You can choose to allow Site Recovery to manage updates in the following ways:

- As part of the enable replication step
- Toggle the extension update settings inside the vault

In case you have chosen to manually manage updates, follow these steps:

1. Go to Azure portal, and then navigate to your "Recovery services vault."
2. Go to the "Replicated Items" pane in the Azure portal for the "Recovery services vault."
3. Click the following notification at the top of the screen:
    
    *New Site Recovery replication agent update is available*
    
    *Click to install ->*

4. Select the VMs that you want to apply the update to, and then click **OK**.

## Between two on-premises VMM sites
1. Download the latest update Rollup for Microsoft Azure Site Recovery Provider.
2. Install Update Rollup first on the on-premises VMM server that is managing the recovery site.
3. After the recovery site is updated, install Update Rollup on the VMM server that is managing the primary site.

> [!NOTE]
> If the VMM is a Highly Available VMM (Clustered VMM), make sure that you install the upgrade on all nodes of the cluster where the VMM service is installed.

## Between an on-premises VMM site and Azure
1. Download Update Rollup for Microsoft Azure Site Recovery Provider.
2. Install Update Rollup on the on-premises VMM server.
3. Install the latest agent MARS agent on all Hyper-V hosts.

> [!NOTE]
> If your VMM is a Highly Available VMM (Clustered VMM), make sure that you install the upgrade on all nodes of the cluster where the VMM service is installed.

## Between an on-premises Hyper-V site and Azure

1. Download Update Rollup for Microsoft Azure Site Recovery Provider.
2. Install the provider on each node of the Hyper-V servers that you have registered in Azure Site Recovery.

> [!NOTE]
> If your Hyper-V is a Host Clustered Hyper-V server, make sure that you install the upgrade on all nodes of the cluster

## Between an on-premises VMware or physical site to Azure

1. Install the update first on your on-premises management server. This is the server that has the Configuration server and Process server roles. 
2. If you have scale-out process servers, update them next.
3. Go to the Azure portal, and then go to the **Protected Items** > **Replicated Items** page.
Select a VM on this page. Select the **Update Agent** button that appears at the bottom of the page for each VM. This updates the Mobility Service Agent on all protected VMs.

A reboot is recommended after every upgrade of Mobility agent to ensure that all latest changes are loaded on the source machine. It is however **not mandatory**. If difference between agent version during last reboot and current version is greater than 4, then a reboot is mandatory. Refer to the following table for detailed explanation.

|**Agent version during last reboot** | **Upgrading to** | **Is reboot mandatory?**|
|---------|---------|---------|--------|
|9.16 |  9.18 | Not mandatory|
|9.16 | 9.19 | Not mandatory|
| 9.16 | 9.20 | Not mandatory
 | 9.16 | 9.21 | Yes, first upgrade to 9.20, then reboot before upgrading to 9.21 as the difference between the versions (9.16 where the last reboot was performed and the target version 9.21) is >4,



## Links to currently supported update rollups


|Update Rollup  |Provider  |Unified Setup| OVF  |MARS|
|---------|---------|---------|---------|--------|
|[Update Rollup 32](https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery)     |   5.1.3800.0  |  9.21.5091.1   |  5.1.3800.0  |2.0.9144.0
|[Update Rollup 31](https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery)     |     5.1.3700.0      |   9.20.5051.1      |     5.1.3700.0    |2.0.9144.0
|[Update Rollup 30](https://support.microsoft.com/help/4468181/azure-site-recovery-update-rollup-30)     |    5.1.3650.0   |   9.19.5007.1    |     5.1.3650.0    |2.0.9139.0
|[Update Rollup 29](https://support.microsoft.com/help/4466466/update-rollup-29-for-azure-site-recovery)     |   5.1.3650.0      |   9.19.4973.1     |     5.1.3700.0    |2.0.9131.0
|[Update Rollup 28 ](https://support.microsoft.com/help/4460079/update-rollup-28-for-azure-site-recovery)     |  5.1.3600 .0      |    9.19.4973.1     |  5.1.3600.0       |2.0.9131.0
| [Update Rollup 27](https://support.microsoft.com/help/4055712/update-rollup-27-for-azure-site-recovery)       |   5.1.3550.0      |    9.18.4946.1     | 5.1.3550.0         |2.0.9125.0


## Previous Update Rollups
- [Update Rollup 26](https://support.microsoft.com/help/4344054/update-rollup-26-for-azure-site-recovery)  
- [Update Rollup 25](https://support.microsoft.com/help/4278275/update-rollup-25-for-azure-site-recovery) 
- [Update Rollup 23](https://support.microsoft.com/help/4091311/update-rollup-23-for-azure-site-recovery) 
- [Update Rollup 22](https://support.microsoft.com/help/4072852/update-rollup-22-for-azure-site-recovery) 
- [Update Rollup 21](https://support.microsoft.com/help/4051380/update-rollup-21-for-azure-site-recovery) 
- [Update Rollup 20](https://support.microsoft.com/help/4041105/update-rollup-20-for-azure-site-recovery) 
- [Update Rollup 19](https://support.microsoft.com/help/4034599/update-rollup-19-for-azure-site-recovery) 
