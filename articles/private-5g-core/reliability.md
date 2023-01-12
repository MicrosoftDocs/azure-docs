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

<!--#Customer intent: As a < type of user >, I want to understand reliability support for Azure Private 5G Core so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->

<!--

Template for the main reliability article for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This article should live in the reliability content area of azure-docs-pr.
This article should be linked to in your TOC. Under a Reliability node or similar. The name of this page should be *reliability-Azure Private 5G Core.md* and the TOC title should be "Reliability in Azure Private 5G Core". 
Keep the headings in this order. 

This template uses comment pseudo code to indicate where you must choose between two options or more. 

Conditions are used in this document in the following manner and can be easily searched for: 
-->

<!-- IF (AZ SUPPORTED) -->
<!-- some text -->
<!-- END IF (AZ SUPPORTED)-->

<!-- BEGIN IF (SLA INCREASE) -->
<!-- some text -->
<!-- END IF (SLA INCREASE) -->

<!-- IF (SERVICE IS ZONAL) -->
<!-- some text -->
<!-- END IF (SERVICE IS ZONAL) -->

<!-- IF (SERVICE IS ZONE REDUNDANT) -->
<!-- some text -->
<!-- END IF (SERVICE IS ZONAL) -->

<!--

IMPORTANT: 
- Do a search and replace of Azure Private 5G Core  with the name of your service. That will make the template easier to read.
- ALL sections are required unless noted otherwise.
- MAKE SURE YOU REMOVE ALL COMMENTS BEFORE PUBLISH!!!!!!!!

-->

<!-- 1. H1 -----------------------------------------------------------------------------
Required: Uses the format "What is reliability in X?"
The "X" part should identify the product or service.
-->

# What is reliability in 'Azure Private 5G Core'?
TODO: Add your heading

<!-- 2. Introductory paragraph ---------------------------------------------------------
Required: Provide an introduction. Use the following placeholder as a suggestion, but elaborate.
-->

This article describes reliability support in Azure Private 5G Core, and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

[Introduction]
TODO: Add your introduction

<!-- IF (AZ SUPPORTED) -->

<!-- 3. Availability zone support ------------------------------------------------------
Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Provide how this product supports availability zones; and whether or not it is zone-redundant or zonal or both.

Indicate who is responsible for setup (Microsoft or Customer)? Reference any AZ readiness docs. Reference AZ enablement if relevant.
-->

## Availability zone support
TODO: Add your availability zone support

[FMC 21-Dec-2022] The Azure Private 5G Core service is automatically deployed as zone redundant in Azure regions that support availability zones, as listed in [Availability zone service and regional support](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support). If a region supports availability zones then all AP5GC resources created in a region can be managed from any of the availability zones and no further work is required by the user to configure or manage AZ readiness. AP5GC is currently available in EastUS and WestEurope regions.

<!-- 3A. Prerequisites -----------------------------------------------------------------
List any specific SKUs that are supported. If all are supported or if the service has only one default SKU, mention this.

List regions that support availability zones, or regions that don't support availability zones (whichever is less).

Indicate any workflows or scenarios that aren't supported or ones that are, whichever is less. Provide links to any relevant information.
-->

### Prerequisites
TODO: Add your prerequisites

[FMC 21-Dec-2022] None

<!-- 3B. SLA improvements --------------------------------------------------------------
To comply with legal requirements, DO NOT provide specific information about the SLAs here in this article.
-->

There are no increased SLAs for Azure Private 5G Core. For more information on the Azure Private 5G Core SLAs, see [TODO-replace-with-link-to-SLA-documentation-for-service].

### SLA improvements
TODO: Add your SLA improvements
[FMC 21-Dec-2022] N/A

<!-- 3C. Create a resource with availability zone enabled ------------------------------
Provide a link to a document or describe inline in this document how to create a resource or instance with availability zone enabled. Provide examples using CLI, portal, and PowerShell.
-->

#### Create a resource with availability zone enabled
TODO: Add your description
[FMC 21-Dec-2022] N/A, all resources are AZ aware by default

<!-- 3D. Zonal failover support --------------------------------------------------------
-->

<!-- IF (SERVICE IS ZONAL) -->

<!-- Indicate here whether the customer can set up resources of the service to failover to another zone. If they can set up failover resources, provide a link to documentation for this procedure. If such documentation doesn’t exist, create the document, and then link to it from here. -->

<!-- END IF (SERVICE IS ZONAL) -->

### Zonal failover support
TODO: Add your zonal failover support
[FMC 21-Dec-2022] No work required, the service manages this all automatically.

<!-- 3E. Fault tolerance ---------------------------------------------------------------
To prepare for availability zone failure, customers should over-provision capacity of service to ensure that the solution can tolerate ⅓ loss of capacity and continue to function without degraded performance during zone-wide outages. Provide any information as to how customers should achieve this.
-->

### Fault tolerance
TODO: Add your fault tolerance
[FMC 21-Dec-2022] No work required

<!-- IF (SERVICE IS ZONE REDUNDANT) -->

<!-- 3F. Zone down experience ----------------------------------------------------------
Select the scenario that best describes customer experience or combine/provide your own description:

- During a zone-wide outage, no action is required during zone recovery, Offering will self-heal and re-balance itself to take advantage of the healthy zone automatically. 
    
- During a zone-wide outage, the customer should expect brief degradation of performance, until the service self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones. 
  
- In a zone-wide outage scenario, users should experience no impact on provisioned resources in a zone-redundant deployment. During a zone-wide outage , customers should be prepared to experience brief interruption for communication to provisioned resources; typically, this is manifested by client receiving 409 error code; this prompts re-try logic with appropriate intervals. New requests will be directed to healthy nodes with zero impact on user. During zone-wide outages, users will be able to create new offering resources and successfully scale existing ones. 
 
The table may contain:

- CRUD and Scale-out operations (Create Read Update Delete)
- Application communication scenarios – data plane operations (for example, insert/update/delete for a database).

| Operation name | Outage  | Availability Impact | Durability Impact | Error code |What to do |
|--|--|--|--|--|

The table below lists all error codes that may be thrown by the Azure Private 5G Core and resources of that service during zone down outages.

List the following:

- CRUD and Scale-out operations (Create Read Update Delete)
- Application communication scenarios – data plane operations (for example, insert/update/delete for a database).

| Error code | Operation | Description |
|---|---|---|

-->

### Zone down experience
TODO: Add your zone down experience
[FMC 21-Dec-2022] In a zone-wide outage scenario, users should experience no impact on provisioned resources as the offering will move to take advantage of the healthy zone automatically. At the start of a zone-wide outage, customers may see in-progress ARM requests time-out or fail. New requests will be directed to healthy nodes with zero impact on user, so any failed operations should be retried. During zone-wide outages, users will be able to create new offering resources and successfully update, monitor and manage existing ones.

<!-- END IF (SERVICE IS ZONE REDUNDANT) -->

<!-- 3G. Zone outage preparation and recovery ------------------------------------------
The table below lists alerts that can trigger an action to compensate for a loss of capacity or a state for your resources. It also provides information regarding actions for recovery, as well as how to prepare for such alerts prior to the outage.

| Alert type | Actions for recovery | How to prepare prior to outage |
|--|--|--|
-->

#### Zone outage preparation and recovery
TODO: Add your zone outage preparation and recovery
[FMC 21-Dec-2022] None - everything will continue to work without service degradation

<!-- 3H. Low-latency design ------------------------------------------------------------
-->

<!-- IF (SERVICE IS ZONE REDUNDANT AND ZONAL) -->

<!-- Describe scenarios in which the customer will opt for zonal vs. zone-redundant version of your offering.-->

<!-- Microsoft guarantees communication between zones of < 2ms. In scenarios in which your solution is sensitive to such spikes, you should configure all components of the solution to align to a zone. This section is intended to explain how your service enables low-latency design, including which SKUs of the service support it. -->

<!-- OPTIONAL SECTION. If your service supports active-passive model, share an approach to control active component to a desired zone and align passive component with next zone. Make an explicit call-out for functionality where a resource is flagged as zone redundant but offers active-passive/primary-replica model of functionality-->

<!-- END IF (SERVICE IS ZONE REDUNDANT AND ZONAL) -->

### Low-latency design
TODO: Add your low-latency design
[FMC 21-Dec-2022] N/A, we are zone redundant by default so no choice to make

>[!IMPORTANT]
>By opting out of zone-aware deployment, you forego protection from isolation of underlying faults. Use of SKUs that don't support availability zones or opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.

<!-- 3I. Safe deployment techniques ----------------------------------------------------
If application safe deployment is not relevant for this resource type, explain why and how the service manages availability zones for the customer behind the scenes.
-->

### Safe deployment techniques
TODO: Add your safe deployment techniques

[FMC 21-Dec-2022] Get rid of the bit below as they can't opt out?
When you opt for availability zones isolation, you should utilize safe deployment techniques for application code, as well as application upgrades. Describe techniques that the customer should use to target one-zone-at-a-time for deployment and upgrades (for example, virtual machine scale sets). If something is strictly recommended, call it out below.

[FMC 21-Dec-2022] Not relevant for this resource type - the application ensures that all cloud state is replicated between availability zones in the region so all management operations will continue without interruption. The 5G core is running at the Edge and is unaffected by the zone failure, so will continue to provide network service for the user.

<!-- List health signals that the customer should monitor, before proceeding with upgrading next set of nodes in another zone, to contain a potential impact of an unhealthy deployment. -->
[Health signals]
TODO: Add your health signals
[FMC 21-Dec-2022] N/A

<!-- 3J. Availability zone redeployment and migration ----------------------------------------------------
Link to a document that provides step-by-step procedures, using Portal, ARM, CLI, for migrating existing resources to a zone redundant configuration. If such a document doesn’t exist, please start the process of creating that document. The template for AZ migration is:

` [!INCLUDE [AZ migration template](az-migration-template.md)] `
-->

### Availability zone redeployment and migration
TODO: Add your availability zone redeployment and migration
[FMC 21-Dec-2022] N/A - everything is zone redundant by default

<!-- END IF (AZ SUPPORTED)-->

<!-- 4. Disaster recovery: cross-region failover ---------------------------------------
Required. In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture.md).

Give a high-level overview of how cross-region failover works for your service

If cross-region failover depends on region type (for example paired region vs. 3+0), provide detailed explanation and refer to the 3+0 or other subsection.

Explain whether items are Microsoft responsible or customer responsible for setup and execution.

If specific responsibilities differ based on region type (for example, paired region vs. 3+0), provide detailed explanation and refer to the 3+0 or other subsection. 

If Microsoft responsible for DR, indicate how long DR takes for loss of region to alternate region. 

If customer responsible for DR, indicate how long DR can take (Immediate – if Active-Active; or if manual and recommended recovery time, etc.)  

Provide details on how customer can minimize failover downtime (if due to Microsoft responsible).  
-->

## Disaster recovery: cross-region failover
TODO: Add your disaster recovery: cross-region failover
[FMC 21-Dec-2022] Where AP5GC is available in multiple regions within a geography, cross-region failover to another region in the same geography is carried out automatically by the service in the event of a region failure. The service automatically replicates customer content (SIM credentials) owned by the service to the backup region so there is no loss of data. Within 4 hours of the failure, all resources located in the failed region are available to view and monitor through the Azure portal and ARM tools but will be read-only until the failed region is recovered.

If AP5GC is only available in a single region in a multi-region (3+n) geography then no automatic failover can be provided. The resources will be available to view in the Azure portal within 4 hours, but no monitoring will be available. The resources will be read-only until the failed region is recovered. The service automatically replicates customer content (SIM credentials) owned by the service to another region in the same geography so there will be no data loss in the event of region failure.

In single region (3+0) geographies there is no replication of data outside the region.

In either scenario, the 5G Core running at the Edge continues to operate without interruption and network connectivity will be maintained.

You can view all regions that support Azure Private 5G Core at https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/
Current deployment plans:
Americas - East US, West US (Feb 2023)
Europe - West Europe, North Europe (Jan 2023)
Fairfax - Virginia (Mar 2023)

<!-- 4A. Cross-region disaster recovery in multi-region geography ----------------------
Provide an overview here of who is responsible for outage detection, notifications, and support for outage scenarios.
-->

### Cross-region disaster recovery in multi-region geography
TODO: Add your cross-region disaster recovery in multi-region geography
[FMC 21-Dec-2022] Microsoft are responsible for outage detection, notification and support for the Azure cloud aspects of the AP5GC offering.

<!-- If (MICROSOFT 100% RESPONSIBLE) -->

<!-- 4B. Outage detection, notification, and management --------------------------------
- Explain how Microsoft detects and handles outages for this offering. 

- Explain when the offering will be failed to another region (decision guidance). 

- If service is deployed geographically, explain how this works. 

- Specify whether the offering runs Active-Active with auto-failover or Active-Passive. 

- Explain how customer is notified or how customer can check service health. 

- Explain how customer storage is handled, how much data loss occurs and whether R/W or only R/O for 00:__ (duration).

- If this single offering fails over, indicate whether it continues to support primary region or only secondary region. 

- Provide all other guidance of what the customer can expect in region loss scenario. 

- Describe service SLA and high availability. 

- Define RTO and RPO expectations.
-->

#### Outage detection, notification, and management
TODO: Add your outage detection, notification, and management
[FMC 21-Dec-2022] Microsoft monitor the underlying resources providing the AP5GC service in each region. If those resources start to show failures or health monitoring alerts that are not restricted to a single availability zone then Microsoft will choose to fail the service to another supported region in the same geography. This is an Active-Active pattern. The service health for a particular region can be found on [Azure Service Health](https://status.azure.com/en-gb/status) (AP5GC is listed in the "Networking" section) and customers will be notified of the region failure through normal Azure communications channels.

The service automatically replicates customer content (SIM credentials) owned by the service to the backup region using CosmosDB multi-region writes, so there is no loss of data in the event of region failure.

AP5GC resources deployed in the failed region will become read-only, but resources in all other regions will continue to operate unaffected. Customers who need to be able to write resources at all times should follow the instructions in (add link to "set up disaster recovery" section) to perform their own DR operation and set up the service in another region.

The 5G Core running at the Edge continues to operate without interruption and network connectivity will be maintained.


<!-- END IF (MICROSOFT 100% RESPONSIBLE) -->

<!-- IF NOT(MICROSOFT 100% RESPONSIBLE) -->

<!-- 4C. Set up disaster recovery and outage detection ---------------------------------
In cases where Microsoft shares responsibility with the customer for outage detection and management, the customer will need to do the following:

- Provide comprehensive How to for setup of DR, including prerequisite, recipe, format, instructions, diagrams, tools, and so on.  

- Define customer Recovery Time Objective (RTO) and Recovery Point Objective (RPO) expectations for optimal setup. 

- Explain how customer detects outages. 

- Specify whether recovery is automated or manual. 

- Specify Active-Active or Active-Passive 

This can be provided in another document, located under the Resiliency node in your TOC. Provide the link here.
-->

#### Set up disaster recovery and outage detection
TODO: Add your disaster recovery and outage detection setup
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
If you wish to test your DR plans then you can follow the recovery procedure for a single packet core at any time. Note that this will cause a service outage of your packet core service and interrupt network connectivity to your UEs for up to four hours, so we recommend only doing this with non-production packet core deployments or at a time when an outage will not adversely affect your business.

<!-- END IF NOT(MICROSOFT 100% RESPONSIBLE) -->

<!-- 4D. Single-region geography disaster recovery -------------------------------------
Explain how offering supports single-region geography and how it differs from other multi-regions geography (for example, if offering is in a multi-region geography, DR is Microsoft-responsible; if in a single-region geography, DR is customer-responsible.)  

If DR is the identical for single-region and multi-region geographies, state this explicitly. (for example, CEDR for both 3+1 and 3+0.) 

If single-region DR is customer-responsible, can both data plane and control plane be configured by customers or only data plane?  

Clarify customer implication when recovery classification is CEDR: Is customer losing data/features/functions when recovery classification is CEDR in region-down scenario?  

Specify SLA and availability consideration in this configuration? 

Specify RTO and RPO expectations in 3+0 scenario. 

Provide instructions on setup for cross-region/outside geography DR. 

Provide instructions to set up and execute DR using Portal, Azure CLI, PowerShell. Does documentation provide options to configure DR via portal, CLI, PowerShell? 

Provide instructions to test DR plan and failover to simulate disaster.  

Provide detailed instructions for customer to clean up DR setup to free up resources. 
-->

### Single-region geography disaster recovery
TODO: Add your single-region geography disaster recovery
[FMC 21-Dec-2022] In a single region geography, DR of the Azure resources is the customer's responsibility and the Azure resources will not be available through the ARM API or portal if the region fails. The 5G Core will continue running at the edge in the event of region failure and network connectivity will be unaffected.

If you have a requirement to view, manage or monitor the Azure resources during a region failure then you should follow the instructions in (link to appropriate section) to set up your own backup deployment. This will be in a different geography to your primary deployment.

<!-- 4E. Capacity and proactive disaster recovery resiliency ---------------------------
Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there is no guarantee of capacity at time of impact for those who have not pre-allocated. 

In this section, provide details of customer knowledge required re: capacity planning and proactive deployments.
-->

### Capacity and proactive disaster recovery resiliency
TODO: Add your capacity and proactive disaster recovery resiliency
[FMC 22-Dec-2022] proactive disaster recovery is the backup deployment setup, described above. There are no capacity concerns for AP5GC so people don't need to pre-allocate resources or similar. I think this means we can remove this section?

<!-- 5. Additional guidance ------------------------------------------------------------
Provide any additional guidance here.
-->

## Additional guidance
TODO: Add your additional guidance

<!-- 6. Next steps ---------------------------------------------------------------------
Required: Include a Next steps H2 that points to a relevant task to accomplish,
or to a related topic. Use the blue box format for links.
-->

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)