---
title: Reliability in Azure Virtual Machines
description: Find out about reliability in Azure Virtual Machines 
author: ericd-mst-github
ms.author: erd
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 11/30/2022
---
<!--#Customer intent: As a < type of user >, I want to understand reliability support for Virtual Machines so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->
<!--
Template for the main reliability article for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This article should live in the reliability content area of azure-docs-pr.
This article should be linked to in your TOC. Under a Reliability node or similar. The name of this page should be *reliability-Virtual Machines.md* and the TOC title should be "Reliability in Virtual Machines". 
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
- Do a search and replace of Virtual Machines  with the name of your service. That will make the template easier to read.
- ALL sections are required unless noted otherwise.
- MAKE SURE YOU REMOVE ALL COMMENTS BEFORE PUBLISH!!!!!!!!
-->
<!-- 1. H1 -----------------------------------------------------------------------------
Required: Uses the format "What is reliability in X?"
The "X" part should identify the product or service.
-->
# What is reliability in Virtual Machines?

This article describes reliability support in Virtual Machines (VM), and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).



<!-- IF (AZ SUPPORTED) -->
<!-- 3. Availability zone support ------------------------------------------------------
Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).
Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).
Provide how this product supports availability zones; and whether or not it is zone-redundant or zonal or both.
Indicate who is responsible for setup (Microsoft or Customer)? Reference any AZ readiness docs. Reference AZ enablement if relevant.
-->
## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Virtual machines support availability zones with three availability zones per supported Azure region and are also zone-redundant and zonal. For more information, see [availability zones support](/azure/reliability/availability-zones-service-support). The customer will be responsible for configuring and migrating their virtual machines for availability. Refer to the following readiness options below for availability zone enablement:

- See [availability options for VMs](/azure/virtual-machines/availability)
- Review [availability zone service and region support](/azure/reliability/availability-zones-service-support)
- [Migrate existing VMs](/azure/reliability/migrate-vm) to availability zones

<!-- 3A. Prerequisites -----------------------------------------------------------------
List any specific SKUs that are supported. If all are supported or if the service has only one default SKU, mention this.
List regions that support availability zones, or regions that don't support availability zones (whichever is less).
Indicate any workflows or scenarios that aren't supported or ones that are, whichever is less. Provide links to any relevant information.
-->
### Prerequisites

Your virtual machine SKUs must be available across the zones in for your region. To review which regions support availability zones, see the [list of supported regions](azure/reliability/availability-zones-service-support#azure-regions-with-availability-zone-support). Check for VM SKU availability by using PowerShell, the Azure CLI, or review list of foundational services. For more information, see [reliability prerequisites](/azure/reliability/migrate-vm#prerequisites).

### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, SLAs (Service-level agreements) increase. For more information, see the [SLA for Virtual Machines](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_9/).

#### Create a resource with availability zone enabled

Get started by creating a virtual machine (VM) with availability zone enabled from the following deployment options below:
- [Azure CLI](/azure/virtual-machines/linux/create-cli-availability-zone)
- [PowerShell](/azure/virtual-machines/windows/create-powershell-availability-zone)
- [Azure portal](/azure/virtual-machines/create-portal-availability-zone)
<!-- 3D. Zonal failover support --------------------------------------------------------
-->
<!-- IF (SERVICE IS ZONAL) -->
<!-- Indicate here whether the customer can set up resources of the service to failover to another zone. If they can set up failover resources, provide a link to documentation for this procedure. If such documentation doesn’t exist, create the document, and then link to it from here. -->
<!-- END IF (SERVICE IS ZONAL) -->
### Zonal failover support

Customers can set up virtual machines to failover to another zone using the Site Recovery service. For more information, see [Site Recovery](/azure/site-recovery/site-recovery-overview).
<!-- 3E. Fault tolerance ---------------------------------------------------------------
To prepare for availability zone failure, customers should over-provision capacity of service to ensure that the solution can tolerate ⅓ loss of capacity and continue to function without degraded performance during zone-wide outages. Provide any information as to how customers should achieve this.
-->
### Fault tolerance

Virtual machines can failover to another server in a cluster, with the VM's operating system restarting on the new server. Customers should refer to the failover process for disaster recovery, gathering virtual machines in recovery planning, and running disaster recovery drills to ensure their fault tolerance solution is successful.

For more information, see the [site recovery processes](/azure/site-recovery/site-recovery-failover#before-you-start).
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
The table below lists all error codes that may be thrown by the Virtual Machines and resources of that service during zone down outages.
List the following:
- CRUD and Scale-out operations (Create Read Update Delete)
- Application communication scenarios – data plane operations (for example, insert/update/delete for a database).
| Error code | Operation | Description |
|---|---|---|
-->
### Zone down experience

During a zone-wide outage, the customer should expect brief degradation of performance, until the virtual machine service self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones.

Customers should also prepare for the possibility that there is an outage of an entire region. If there is a service disruption for an entire region, the locally redundant copies of your data would temporarily be unavailable. If geo-replication is enabled, three additional copies of your Azure Storage blobs and tables are stored in a different region. In the event of a complete regional outage or a disaster in which the primary region is not recoverable, Azure remaps all of the DNS entries to the geo-replicated region.



<!-- END IF (SERVICE IS ZONE REDUNDANT) -->
<!-- 3G. Zone outage preparation and recovery ------------------------------------------
The table below lists alerts that can trigger an action to compensate for a loss of capacity or a state for your resources. It also provides information regarding actions for recovery, as well as how to prepare for such alerts prior to the outage.
| Alert type | Actions for recovery | How to prepare prior to outage |
|--|--|--|
-->
#### Zone outage preparation and recovery

The following guidance is provided for Azure virtual machines in the case of a service disruption of the entire region where your Azure virtual machine application is deployed:

- Configure [Azure Site Recovery](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-1-initiate-a-failover-by-using-azure-site-recovery) for your VMs
- Check the [Azure Service Health Dashboard](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance#option-2-wait-for-recovery) status if Azure Site Recovery has not been configured
- Review how the [Azure Backup service](/azure/backup/backup-azure-vms-introduction) works for VMs
    - See the [support matrix](/azure/backup/backup-support-matrix-iaas) for Azure VM backups
- Determine which [VM restore option and scenario](/azure/backup/about-azure-vm-restore) will work best for your environment


<!-- 3H. Low-latency design ------------------------------------------------------------
-->
<!-- IF (SERVICE IS ZONE REDUNDANT AND ZONAL) -->
<!-- Describe scenarios in which the customer will opt for zonal vs. zone-redundant version of your offering.-->
<!-- Microsoft guarantees communication between zones of < 2ms. In scenarios in which your solution is sensitive to such spikes, you should configure all components of the solution to align to a zone. This section is intended to explain how your service enables low-latency design, including which SKUs of the service support it. -->
<!-- OPTIONAL SECTION. If your service supports active-passive model, share an approach to control active component to a desired zone and align passive component with next zone. Make an explicit call-out for functionality where a resource is flagged as zone redundant but offers active-passive/primary-replica model of functionality-->
<!-- END IF (SERVICE IS ZONE REDUNDANT AND ZONAL) -->
### Low-latency design

Cross Region (secondary region), Cross Subscription (preview), and Cross Zonal (preview) are available options to consider when designing a low-latency virtual machine solution. For more information on these options, see the [supported restore methods](azure/backup/backup-support-matrix-iaas#supported-restore-methods).

>[!IMPORTANT]
>By opting out of zone-aware deployment, you forego protection from isolation of underlying faults. Use of SKUs that don't support availability zones or opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.
<!-- 3I. Safe deployment techniques ----------------------------------------------------
If application safe deployment is not relevant for this resource type, explain why and how the service manages availability zones for the customer behind the scenes.
-->
### Safe deployment techniques

When you opt for availability zones isolation, you should utilize safe deployment techniques for application code, as well as application upgrades. In addition to configuring Azure Site Recovery, below are recommended safe deployment techniques for VMs:

- [Virtual Machine Scale Sets](/azure/virtual-machines/flexible-virtual-machine-scale-sets)
- [Availability Sets](/azure/virtual-machines/availability-set-overview)
- [Azure Load Balancer](/azure/load-balancer/load-balancer-overview)
- [Azure Storage Redundancy](/azure/storage/common/storage-redundancy)


<!-- List health signals that the customer should monitor, before proceeding with upgrading next set of nodes in another zone, to contain a potential impact of an unhealthy deployment. -->
 As Microsoft periodically performs planned maintenance updates, there may be rare instances when these updates require a reboot of your virtual machine to apply the required updates to the underlying infrastructure. To learn more, see [availability considerations](/azure/virtual-machines/maintenance-and-updates#availability-considerations-during-scheduled-maintenance) during scheduled maintenance. 

Follow the health signals below for monitoring before upgrading your next set of nodes in another zone:

- Check the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) for the virtual machines service status for your expected regions
- Ensure that [replication](/azure/site-recovery/azure-to-azure-quickstart) is enabled on your VMs



<!-- 3J. Availability zone redeployment and migration ----------------------------------------------------
Link to a document that provides step-by-step procedures, using Portal, ARM, CLI, for migrating existing resources to a zone redundant configuration. If such a document doesn’t exist, please start the process of creating that document. The template for AZ migration is:
` [!INCLUDE [AZ migration template](az-migration-template.md)] `
-->
### Availability zone redeployment and migration

For migrating existing virtual machine resources to a zone redundant configuration, refer to the below resources:

- Move a VM to another subscription or resource group
    - [CLI](azure/virtual-machines/linux/move-vm)
    - [PowerShell](/azure/virtual-machines/windows/move-vm)
- [Azure Resource Mover](/resource-mover/tutorial-move-region-virtual-machines)
- [Move Azure VMs to availability zones](/azure/site-recovery/move-azure-vms-avset-azone)
- [Move region maintenance configuration resources](/azure/virtual-machines/move-region-maintenance-configuration-resources)



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

In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

Customers can use Cross Region to restore Azure VMs via paired regions. You can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region. For more details on Cross Region restore, refer to the Cross Region table row entry in our [restore options](/azure/backup/backup-azure-arm-restore-vms#restore-options).

<!-- 4A. Cross-region disaster recovery in multi-region geography ----------------------
Provide an overview here of who is responsible for outage detection, notifications, and support for outage scenarios.
-->
### Cross-region disaster recovery in multi-region geography

While Microsoft is working diligently to restore the virtual machine service for region-wide service disruptions, customers will have to rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan).
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

When the hardware or the physical infrastructure for the virtual machine fails unexpectedly. This can include local network failures, local disk failures, or other rack level failures. When detected, the Azure platform automatically migrates (heals) your virtual machine to a healthy physical machine in the same data center. During the healing procedure, virtual machines experience downtime (reboot) and in some cases loss of the temporary drive. The attached OS and data disks are always preserved.

For more detailed information on virtual machine service disruptions, see [disaster recovery guidance](/azure/virtual-machines/virtual-machines-disaster-recovery-guidance).
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

When setting up disaster recovery for virtual machines, understand what [Azure Site Recovery provides](/azure/site-recovery/site-recovery-overview#what-does-site-recovery-provide). Enable disaster recovery for virtual machines with the below methods:

- Set up disaster recovery to a [secondary Azure region for an Azure VM](/azure/site-recovery/azure-to-azure-quickstart)
- Create a Recovery Services vault
    - [Bicep](/azure/site-recovery/quickstart-create-vault-bicep)
    - [ARM template](/azure/site-recovery/quickstart-create-vault-template)
- Enable disaster recovery for [Linux virtual machines](/azure/virtual-machines/linux/tutorial-disaster-recovery)
- Enable disaster recovery for [Windows virtual machines](/azure/virtual-machines/windows/tutorial-disaster-recovery)
- Failover virtual machines to [another region](/azure/site-recovery/azure-to-azure-tutorial-failover-failback)
- Failover virtual machines to the [primary region](/azure/site-recovery/azure-to-azure-tutorial-failback#fail-back-to-the-primary-region)
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

<!--identical to cross region or no?-->
With disaster recovery set up, Azure VMs will continuously replicate to a different target region. If an outage occurs, you can fail over VMs to the secondary region, and access them from there.

For more information, see [Azure VMs architectural components](/azure/site-recovery/azure-to-azure-architecture#architectural-components) and [region pairing](/azure/virtual-machines/regions#region-pairs).
<!-- 4E. Capacity and proactive disaster recovery resiliency ---------------------------
Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there is no guarantee of capacity at time of impact for those who have not pre-allocated. 
In this section, provide details of customer knowledge required re: capacity planning and proactive deployments.
-->
### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there is no guarantee of capacity at time of impact for those who have not pre-allocated.

For deploying virtual machines, customers can use [flexible orchestration](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#scale-sets-with-flexible-orchestration) mode on Virtual Machine Scale Sets (VMSS). All VM sizes can be used with flexible orchestration mode. Flexible orchestration mode also offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone.
<!-- 5. Additional guidance ------------------------------------------------------------
Provide any additional guidance here.
-->
## Additional guidance

- [Well-Architected Framework for virtual machines](/azure/architecture/framework/services/compute/virtual-machines/virtual-machines-review)
- [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture)
- [Accelerated networking with Azure VM disaster recovery](/azure-vm-disaster-recovery-with-accelerated-networking)
- [Express Route with Azure VM disaster recovery](/azure/site-recovery/azure-vm-disaster-recovery-with-expressroute)
- [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)
<!-- 6. Next steps ---------------------------------------------------------------------
Required: Include a Next steps H2 that points to a relevant task to accomplish,
or to a related topic. Use the blue box format for links.
-->
## Next steps
> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)