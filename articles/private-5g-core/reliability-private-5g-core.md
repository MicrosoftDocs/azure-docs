---
title: Reliability in Azure Private 5G Core
description: Find out about reliability in Azure Private 5G Core 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: overview
ms.custom: subject-reliability, references_regions
ms.date: 01/31/2022
---

# Reliability for Azure Private 5G Core

This article describes reliability support in Azure Private 5G Core. It covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For an overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

See [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=private-5g-core) for the Azure regions where Azure Private 5G Core is available.

## Availability zone support

The Azure Private 5G Core service is automatically deployed as zone-redundant in Azure regions that support availability zones, as listed in [Availability zone service and regional support](../reliability/availability-zones-service-support.md). If a region supports availability zones then all Azure Private 5G Core resources created in a region can be managed from any of the availability zones.

No further work is required to configure or manage availability zones. Failover between availability zones is automatic.

### Zone down experience

In a zone-wide outage scenario, users should experience no impact because the service will move to take advantage of the healthy zone automatically. At the start of a zone-wide outage, you may see in-progress ARM requests time-out or fail. New requests will be directed to healthy nodes with zero impact on users and any failed operations should be retried. You'll still be able to create new resources and update, monitor and manage existing resources during the outage.

### Safe deployment techniques

The application ensures that all cloud state is replicated between availability zones in the region so all management operations will continue without interruption. The packet core is running at the Edge and is unaffected by the zone failure, so will continue to provide service for users.

## Disaster recovery: cross-region failover

Azure Private 5G Core is only available in multi-region (3+N) geographies. The service automatically replicates SIM credentials to a backup region in the same geography. This means that there's no loss of data in the event of region failure. Within four hours of the failure, all resources in the failed region are available to view through the Azure portal and ARM tools but will be read-only until the failed region is recovered. the packet running at the Edge continues to operate without interruption and network connectivity will be maintained.

### Cross-region disaster recovery in multi-region geography

Microsoft is responsible for outage detection, notification and support for the Azure cloud aspects of the Azure Private 5G Core service.

#### Outage detection, notification, and management

Microsoft monitors the underlying resources providing the Azure Private 5G Core service in each region. If those resources start to show failures or health monitoring alerts that aren't restricted to a single availability zone then Microsoft will move the service to another supported region in the same geography. This is an Active-Active pattern. The service health for a particular region can be found on [Azure Service Health](https://status.azure.com/status) (Azure Private 5G Core is listed in the **Networking** section). You'll be notified of any region failures through normal Azure communications channels.

The service automatically replicates SIM credentials owned by the service to the backup region using Cosmos DB multi-region writes, so there's no loss of data in the event of region failure.

Azure Private 5G Core resources deployed in the failed region will become read-only, but resources in all other regions will continue to operate unaffected. If you need to be able to write resources at all times, follow the instructions in [Set up disaster recovery and outage detection](#set-up-disaster-recovery-and-outage-detection) to perform your own disaster recovery operation and set up the service in another region.

The packet core running at the Edge continues to operate without interruption and network connectivity will be maintained.

### Set up disaster recovery and outage detection

This section describes what action you can take to ensure you have a fully active management plane for the Azure Private 5G Core service in the event of a region failure. This is required if you want to be able to modify your resources in the event of a region failure. 

Note that this will cause an outage of your packet core service and interrupt network connectivity to your UEs for up to eight hours, so we recommend you only use this procedure if you have a business-critical reason to manage resources while the Azure region is down.

In advance of a disaster recovery event, you must back up your resource configuration to another region that supports Azure Private 5G Core. When the region failure occurs, you can redeploy the packet core using the resources in your backup region.

##### Preparation

There are two types of Azure Private 5G Core configuration data that need to be backed up for disaster recovery: mobile network configuration and SIM credentials. We recommend that you:

- Update the SIM credentials in the backup region every time you add new SIMs to the primary region
- Back up the mobile network configuration at least once a week, or more often if you're making frequent or large changes to the configuration such as creating a new site.

**Mobile network configuration**
<br></br>
Follow the instructions in [Move resources to a different region](./region-move-private-mobile-network-resources.md) to export your Azure Private 5G Core resource configuration and upload it to the new region. We recommend that you use a new resource group for your backup configuration to clearly separate it from the active configuration. You must give the resources new names to distinguish them from the resources in your primary region. This new region is a passive backup, so to avoid conflicts you must not link the packet core configuration to your edge hardware yet. Instead, store the values from the **packetCoreControlPlanes.platform** field for every packet core in a safe location that can be accessed by whoever will perform the recovery procedure (such as a storage account referenced by internal documentation).

**SIM data**
<br></br>
For security reasons, Azure Private 5G Core will never return the SIM credentials that are provided to the service as part of SIM creation. Therefore it is not possible to export the SIM configuration in the same way as other Azure resources. We recommend that whenever new SIMs are added to the primary service, the same SIMs are also added to the backup service by repeating the [Provision new SIMs](./provision-sims-azure-portal.md) process for the backup mobile network.

**Other resources**
<br></br>
Your Azure Private 5G Core deployment may make use of Azure Key Vaults for storing [SIM encryption keys](./security.md#customer-managed-key-encryption-at-rest) or HTTPS certificates for [local monitoring](./security.md#access-to-local-monitoring-tools). You must follow the [Azure Key Vault documentation](../key-vault/general/disaster-recovery-guidance.md) to ensure that your keys and certificates will be available in the backup region.

##### Recovery
In the event of a region failure, first validate that all the resources in your backup region are present by querying the configuration through the Azure portal or API (see [Move resources to a different region](./region-move-private-mobile-network-resources.md)). If all the resources aren't present, stop here and don't follow the rest of this procedure. You may not be able to recover service at the edge site without the resource configuration.

The recovery process is split into three stages for each packet core:

1. Disconnect the Azure Stack Edge device from the failed region by performing a reset
1. Connect the Azure Stack Edge device to the backup region
1. Re-install and validate the installation.

You must repeat this process for every packet core in your mobile network.

> [!CAUTION]
> The recovery procedure will cause an outage of your packet core service and interrupt network connectivity to your UEs for up to eight hours for each packet core. We recommended that you only perform this procedure where you have a business-critical need to manage the Azure Private 5G Core deployment through Azure during the region failure.

**Disconnect the Azure Stack Edge device from the failed region**
<br></br>
The Azure Stack Edge device is currently running the packet core software and is controlled from the failed region. To disconnect the Azure Stack Edge device from the failed region and remove the running packet core, you must follow the reset and reactivate instructions in [Reset and reactivate your Azure Stack Edge device](../databox-online/azure-stack-edge-reset-reactivate-device.md). Note that this will remove ALL software currently running on your Azure Stack Edge device, not just the packet core software, so ensure that you have the capability to reinstall any other software on the device. This will start a network outage for all devices connected to the packet core on this Azure Stack Edge device.

**Connect the Azure Stack Edge device to the new region**
<br></br>
Follow the instructions in [Commission the AKS cluster](./commission-cluster.md) to redeploy the Azure Kubernetes Service cluster on your Azure Stack Edge device. Ensure that you use a different name for this new installation to avoid clashes when the failed region recovers. As part of this process you'll get a new custom location ID for the cluster, which you should note down.

**Reinstall and validation**
<br></br>
Take a copy of the **packetCoreControlPlanes.platform** values you stored in [Preparation](#preparation) and update the **packetCoreControlPlane.platform.customLocation** field with the custom location ID you noted above. Ensure that **packetCoreControlPlane.platform.azureStackEdgeDevice** matches the ID of the Azure Stack Edge device you want to install the packet core on. Now follow [Modify a packet core](./modify-packet-core.md) to update the backup packet core with the platform values. This will trigger a packet core deployment onto the Azure Stack Edge device.

You should follow your normal process for validating a new site install to confirm that UE connectivity has been restored and all network functionality is operational. In particular, you should confirm that the site dashboards in the Azure portal show UE registrations and that data is flowing through the data plane.

##### Failed region restored

When the failed region recovers, you should ensure the configuration in the two regions is in sync by performing a backup from the active backup region to the recovered primary region, following the steps in [Preparation](#preparation).

You must also check for and remove any resources in the recovered region that haven't been destroyed by the preceding steps:

- For each Azure Stack Edge device that you moved to the backup region (following the steps in [Recovery](#recovery)) you must find and delete the old ARC cluster resource. The ID of this resource is in the **packetCoreControlPlane.platform.customLocation** field from the values you backed up in [Preparation](#preparation). The state of this resource will be **disconnected** because the corresponding Kubernetes cluster was deleted as part of the recovery process.
- For each packet core that you moved to the backup region (following the steps in [Recovery](#recovery)) you must find and delete any NFM objects in the recovered region. These will be listed in the same resource group as the packet core control plane resources and the **Region** value will match the recovered region.

You then have two choices for ongoing management:

1. Use the operational backup region as the new primary region and use the recovered region as a backup. No further action is required.
1. Make the recovered region the new active primary region by following the instructions in [Move resources to a different region](./region-move-private-mobile-network-resources.md) to switch back to the recovered region.

##### Testing

If you want to test your disaster recovery plans, you can follow the recovery procedure for a single packet core at any time. Note that this will cause a service outage of your packet core service and interrupt network connectivity to your UEs for up to four hours, so we recommend only doing this with non-production packet core deployments or at a time when an outage won't adversely affect your business.

## Next steps

- [Resiliency in Azure](/azure/availability-zones/overview)