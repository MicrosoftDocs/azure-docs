---
title: Reliability in Azure Private 5G Core
description: Find out about reliability in Azure Private 5G Core 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: overview
ms.custom: subject-reliability
ms.date: 01/31/2022
---


# Reliability for Azure Private 5G Core

This article describes reliability support in Azure Private 5G Core, and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

## Availability zone support

The Azure Private 5G Core service is automatically deployed as zone redundant in Azure regions that support availability zones, as listed in [Availability zone service and regional support](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support). If a region supports availability zones then all AP5GC resources created in a region can be managed from any of the availability zones and no further work is required by the user to configure or manage AZ readiness. Azure Private 5G Core is currently available in EastUS and WestEurope regions.

### SLA improvements

There are no increased SLAs for Azure Private 5G Core. For more information on the Azure Private 5G Core SLAs, see [TODO-replace-with-link-to-SLA-documentation-for-service].

#### Create a resource with availability zone enabled

[FMC 21-Dec-2022] N/A, all resources are AZ aware by default

### Zonal failover support

[FMC 21-Dec-2022] No work required, the service manages this all automatically.

### Fault tolerance

[FMC 21-Dec-2022] No work required

### Zone down experience

[FMC 21-Dec-2022] In a zone-wide outage scenario, users should experience no impact on provisioned resources as the offering will move to take advantage of the healthy zone automatically. At the start of a zone-wide outage, customers may see in-progress ARM requests time-out or fail. New requests will be directed to healthy nodes with zero impact on user, so any failed operations should be retried. During zone-wide outages, users will be able to create new offering resources and successfully update, monitor and manage existing ones.

#### Zone outage preparation and recovery

[FMC 21-Dec-2022] None - everything will continue to work without service degradation

### Low-latency design

[FMC 21-Dec-2022] N/A, we are zone redundant by default so no choice to make

### Safe deployment techniques

[FMC 21-Dec-2022] Get rid of the bit below as they can't opt out?
When you opt for availability zones isolation, you should utilize safe deployment techniques for application code, as well as application upgrades. Describe techniques that the customer should use to target one-zone-at-a-time for deployment and upgrades (for example, virtual machine scale sets). If something is strictly recommended, call it out below.

[FMC 21-Dec-2022] Not relevant for this resource type - the application ensures that all cloud state is replicated between availability zones in the region so all management operations will continue without interruption. The 5G core is running at the Edge and is unaffected by the zone failure, so will continue to provide network service for the user.

[Health signals]
[FMC 21-Dec-2022] N/A

### Availability zone redeployment and migration

[FMC 21-Dec-2022] N/A - everything is zone redundant by default

## Disaster recovery: cross-region failover

[FMC 21-Dec-2022] Where AP5GC is available in multiple regions within a geography, cross-region failover to another region in the same geography is carried out automatically by the service in the event of a region failure. The service automatically replicates customer content (SIM credentials) owned by the service to the backup region so there is no loss of data. Within 4 hours of the failure, all resources located in the failed region are available to view and monitor through the Azure portal and ARM tools but will be read-only until the failed region is recovered.

If AP5GC is only available in a single region in a multi-region (3+n) geography then no automatic failover can be provided. The resources will be available to view in the Azure portal within 4 hours, but no monitoring will be available. The resources will be read-only until the failed region is recovered. The service automatically replicates customer content (SIM credentials) owned by the service to another region in the same geography so there will be no data loss in the event of region failure.

In single region (3+0) geographies there is no replication of data outside the region.

In either scenario, the 5G Core running at the Edge continues to operate without interruption and network connectivity will be maintained.

You can view all regions that support Azure Private 5G Core at https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/
Current deployment plans:
Americas - East US, West US (Feb 2023)
Europe - West Europe, North Europe (Jan 2023)
Fairfax - Virginia (Mar 2023)

### Cross-region disaster recovery in multi-region geography

[FMC 21-Dec-2022] Microsoft are responsible for outage detection, notification and support for the Azure cloud aspects of the AP5GC offering.

#### Outage detection, notification, and management

[FMC 21-Dec-2022] Microsoft monitor the underlying resources providing the AP5GC service in each region. If those resources start to show failures or health monitoring alerts that are not restricted to a single availability zone then Microsoft will choose to fail the service to another supported region in the same geography. This is an Active-Active pattern. The service health for a particular region can be found on [Azure Service Health](https://status.azure.com/en-gb/status) (AP5GC is listed in the "Networking" section) and customers will be notified of the region failure through normal Azure communications channels.

The service automatically replicates customer content (SIM credentials) owned by the service to the backup region using CosmosDB multi-region writes, so there is no loss of data in the event of region failure.

AP5GC resources deployed in the failed region will become read-only, but resources in all other regions will continue to operate unaffected. Customers who need to be able to write resources at all times should follow the instructions in (add link to "set up disaster recovery" section) to perform their own DR operation and set up the service in another region.

The 5G Core running at the Edge continues to operate without interruption and network connectivity will be maintained.

#### Set up disaster recovery and outage detection

[FMC 21-Dec-2022] ***Should this come after the single region DR bit below as it is relevant to both?

This section describes what action you can take to ensure you have a fully active management plane for the AP5GC service in the event of a region failure. This is required for customers in multi-region geographies who wish to be able to modify their resources and customers in single-region geographies who want to be able to view and monitor their resources in the event of a region failure. Note that this will cause a service outage of your packet core service and interrupt network connectivity to your UEs for up to four hours, so we recommend you only use this procedure if you have a business-critical reason to be able to manage resources while the Azure region is down.

In advance of a DR event, you must back up your resource configuration to another region that supports AP5GC. When the region failure occurs, you can redeploy the 5G core using the resources in your backup region.

##### Preparation

There are two types of AP5GC configuration data that need to be backed up for DR, mobile network configuration and SIM credentials. It is recommended that you update the SIM credentials in the backup region every time you add new SIMs to the primary region. It is recommended that you back up the mobile network configuration at least once a week, or more often if you are making frequent or large changes to the configuration e.g. creating a new site.

Mobile network configuration
Follow the instructions in (link to article describing moving resources between regions https://dev.azure.com/msazuredev/AzureForOperators/_workitems/edit/74859) to export your AP5GC resource configuration and upload it in the new region. It is recommended that you use a new resource group for your backup configuration, to clearly separate it from the active configuration. You must give the resources new names to distinguish them from the resources in your primary region. This new region is currently a passive backup so to avoid conflicts you must not link the packet core configuration to your edge hardware yet. Instead, store the values currently in the packetCoreControlPlanes.platform field for every packet core in a safe location that can be accessed by whoever will perform the recovery procedure (e.g. storage account, internal document).

SIM data
For security reasons, AP5GC will never return the SIM credentials that are provided to the service as part of SIM creation. Therefore it is not possible to export the SIM configuration in the same way as other Azure resources. We advise that whenever new SIMs are added to the primary service, the same SIMs are also added to the backup service by repeating the [Provision new SIMs](https://learn.microsoft.com/en-us/azure/private-5g-core/provision-sims-azure-portal) process for the backup mobile network.

Other resources
Your AP5GC deployment may make use of Azure Key Vaults for storing [SIM encryption keys](https://learn.microsoft.com/en-us/azure/private-5g-core/security#customer-managed-key-encryption-at-rest) or HTTPS certificates for [local monitoring](https://learn.microsoft.com/en-us/azure/private-5g-core/security#access-to-local-monitoring-tools). You must follow the [key vault documentation](https://learn.microsoft.com/en-us/azure/key-vault/general/disaster-recovery-guidance) to ensure that your keys and certificates will be available in the backup region.

##### Recovery
In the event of a region failure, first validate that all the resources in your backup region are present by querying the configuration through the Azure portal or API (@@ instructions are in the region move article). If all the resources are not present then you should stop here and not follow the rest of this procedure, as you may not be able to recover 5G service at the edge site without the resource configuration.

The recovery process is split into three stages for each packet core - disconnect the edge device from the failed region, connect the edge device to the backup region and then re-install and validate the installation. You must repeat this process for every packet core in your mobile network. It is recommended that you only perform this procedure for packet cores where you have a business critical need to manage the AP5GC deployment through Azure during the region failure, as the procedure will cause a network outage for each packet core lasting several hours.

Disconnect the edge device from the failed region
(@@FMC instructions on resetting the ASE to remove the ARC connection, following up with ASE team as nothing in public docs)

Connect the edge device to the new region
Re-run the installation script provided by your trials engineer to redeploy the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on your ASE device. Ensure that you use a different name for this new installation to avoid clashes when the failed region recovers. As part of this process you will get a new custom location ID for the cluster, which you should note down.

Reinstall and Validation
Take a copy of the packetCoreControlPlanes.platform values you stored in Preparation and update the packetCoreControlPlane.platform.customLocation field with the custom location ID you noted above. Ensure that packetCoreControlPlane.platform.azureStackEdgeDevice matches the ID of the ASE you want to install the packet core on. Now follow ("modify a packet core" how-to) to update the backup packet core with the platform values. This will trigger a packet core deployment onto the edge device.
You should follow your normal process for validating a new site install to confirm that UE connectivity has been restored and all network functionality is operational. In particular, you should confirm that the site dashboards in the Azure portal show UE registrations and that data is flowing through the data plane.

##### Failed region restored
When the failed region recovers, you should ensure the configuration in the two regions is in sync by performing a backup from the active backup region to the recovered primary region, following the steps in Preparation above.

You must also tidy up any orphaned resources in the recovered region that have not been destroyed by the preceding steps.

- For each ASE that you moved to the backup region (following the steps in Recovery) you must find and delete the old ARC cluster resource. The ID of this resource is in the packetCoreControlPlane.platform.customLocation field from the values you backed up in Preparation. The state of this resource will be "disconnected" because the corresponding kubernetes cluster was deleted as part of the recovery process.
- For each packet core that you moved to the backup region (following the steps in Recovery) you must find and delete any NFM objects in the recovered region. These will be listed in the same resource group as the packet core control plane resources and the "Region" value will match the recovered region.

You then have two choices for ongoing management.

1. Use the operational backup region as the new primary region and use the recovered region as a backup. No further action is required.
2. Make the recovered region the new active primary region by following the recovery procedure above to switch back to the recovered region.

##### Testing

If you want to test your DR plans then you can follow the recovery procedure for a single packet core at any time. Note that this will cause a service outage of your packet core service and interrupt network connectivity to your UEs for up to four hours, so we recommend only doing this with non-production packet core deployments or at a time when an outage will not adversely affect your business.

### Single-region geography disaster recovery

[FMC 21-Dec-2022] In a single region geography, DR of the Azure resources is the customer's responsibility and the Azure resources will not be available through the ARM API or portal if the region fails. The 5G Core will continue running at the edge in the event of region failure and network connectivity will be unaffected.

If you have a requirement to view, manage or monitor the Azure resources during a region failure then you should follow the instructions in (link to appropriate section) to set up your own backup deployment. This will be in a different geography to your primary deployment.

### Capacity and proactive disaster recovery resiliency

[FMC 22-Dec-2022] proactive disaster recovery is the backup deployment setup, described above. There are no capacity concerns for AP5GC so people don't need to pre-allocate resources or similar. I think this means we can remove this section?

## Additional guidance
TODO: Add your additional guidance

## Next steps

- [Resiliency in Azure](/azure/availability-zones/overview.md)