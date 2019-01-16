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

- Azure VMs replicating between Azure regions.
- On-premises virtual machines and physical servers replicating to Azure, or to a secondary site.
To know more refer to the  documentation [here](https://docs.microsoft.com/azure/site-recovery) .

Azure Site Recovery publishes service updates on a regular basis - including the addition of new features, improvements in the support matrix, and bug fixes if any. In order to stay current take adavantage of all the latest features & enhancements & bug fixes if any, users are advised to always update to the latest versions of Azure SIte Recovery components 
 
## Support statement for Azure Site Recovery 

> [!IMPORTANT]
> **With every new version 'N' of an Azure Site Recovery component that is released, all versions below 'N-4' is considered out of support**. Hence it is always advisable to upgrade to the latest versions available.

> [!IMPORTANT]
> The official support for upgrades is from > N-4 to N version, If you are on N-6, you need to first upgrade to N-4, and then upgrade to N.

## Azure VM disaster recovery to Azure.
In this scenario, we strongly recommend that you [enable](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-autoupdate) automatic updates. You can choose to allow Site Recovery to manage updates in the following ways:-

- As part of the enable replication step
- Toggle the extension update settings inside the vault

In case, you have chosen to manually manage updates, follow the below steps

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


## Links to currently supported update rollups


|Update Rollup  |Provider  |Unified Setup| OVF  |MARS|
|---------|---------|---------|---------|--------|
|[Update Rollup 32](https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery)     |   5.1.3800.0  |  9.21.5091.1   |  5.1.3800.0  |2.0.9144.0
|[Update Rollup 31](https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery)     |     5.1.3700.0      |   9.20.5051.1      |     5.1.3700.0    |2.0.9144.0
|[Update Rollup 30](https://support.microsoft.com/help/4468181/azure-site-recovery-update-rollup-30)     |    5.1.3650.0   |   9.19.5007.1    |     5.1.3650.0    |2.0.9139.0
|[Update Rollup 29](https://support.microsoft.com/help/4466466/update-rollup-29-for-azure-site-recovery)     |   5.1.3650.0      |   9.19.4973.1     |     5.1.3700.0    |2.0.9131.0
|[Update Rollup 28 ](https://support.microsoft.com/help/4460079/update-rollup-28-for-azure-site-recovery)     |  5.1.3600 .0      |    9.19.4973.1     |  5.1.3600.0       |2.0.9131.0
| [Update Rollup 27](https://support.microsoft.com/help/4055712/update-rollup-27-for-azure-site-recovery)       |   5.1.3550.0      |    9.18.4946.1     | 5.1.3550.0         |2.0.9125.0


## Previous update Rollups
- [Update Rollup 26](https://support.microsoft.com/help/4344054/update-rollup-26-for-azure-site-recovery)  
- [Update Rollup 25](https://support.microsoft.com/help/4278275/update-rollup-25-for-azure-site-recovery) 
- [Update Rollup 23](https://support.microsoft.com/help/4091311/update-rollup-23-for-azure-site-recovery) 
- [Update Rollup 22](https://support.microsoft.com/help/4072852/update-rollup-22-for-azure-site-recovery) 
- [Update Rollup 21](https://support.microsoft.com/help/4051380/update-rollup-21-for-azure-site-recovery) 
- [Update Rollup 20](https://support.microsoft.com/help/4041105/update-rollup-20-for-azure-site-recovery) 
- [Update Rollup 19](https://support.microsoft.com/help/4034599/update-rollup-19-for-azure-site-recovery) 