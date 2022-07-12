---
title: Resiliency in Azure Lab Services 
description: Learn about resiliency in Azure Lab Services
ms.topic: overview
ms.custom: subject-resiliency
ms.date: 07/12/2022
---

<!--#Customer intent: As a < type of user >, I want to understand resiliency support for [TODO-service-name] so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->

<!--

Template for the main resiliency article for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This article should be in your TOC, under a Resiliency node. The name of this page should be *resiliency-[TODO-service-name].md* and the TOC title should be "Resiliency in [TODO-service-name]". 
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
- Do a search and replace of TODO-service-name  with the name of your service. That will make the template easier to read 
- ALL sections are required unless noted otherwise
- MAKE SURE YOU REMOVE ALL COMMENTS BEFORE PUBLISH!!!!!!!!

-->

# What is resiliency in Azure Lab Services?

Resiliency is a system’s ability to recover from failures and continue to function. It’s not only about avoiding failures but also involves responding to failures in a way that minimizes downtime or data loss. Because failures can occur at various levels, it’s important to have protection for all types based on service availability requirements. Resiliency in Azure supports and advances capabilities that respond to outages in real time to ensure continuous service and data protection assurance for mission-critical applications that require near-zero downtime and high customer confidence.

This article describes resiliency support in Azure Lab Services, and covers <!-- IF (AZ SUPPORTED) --> both regional resiliency with availability zones and <!-- END IF (AZ SUPPORTED)--> cross-region resiliency with disaster recovery. For a more detailed overview of resiliency in Azure, see [Azure resiliency](/availability-zones/overview.md).

<!-- IF (AZ SUPPORTED) -->
## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of resiliency and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Azure Lab Services provide zone redundancy for service infrastructure for specific regions. Zone redundancy is provided automatically by Microsoft.

Currently, the service is not zonal. That is, you can’t configure a lab or the VMs in the lab to align to a specific zone. A lab and VMs may be distributed across zones in a region.

### Prerequisites

N/A - single product SKU - remove?

<!-- List any specific SKUs that are supported. If all are supported or if the service has only one default SKU, mention this. -->

<!-- List regions that support availability zones, or regions that don't support availability zones (whichever is less) -->

<!-- Indicate any workflows or scenarios that aren't supported or ones that are, whichever is less. Provide links to any relevant information. -->

### SLA improvements

There are no increased SLAs for Azure Lab Services. For more information on the Azure Lab Services SLAs, see [SLA for Azure Lab Services](https://azure.microsoft.com/en-us/support/legal/sla/lab-services/v1_0/).

#### Create a resource with availability zone enabled

N/A - remove

<!-- IF (SERVICE IS ZONE REDUNDANT) -->
### Zone down experience

#### Azure Lab Services infrastructure

Azure Lab Services is zone-redundant. The Azure Lab Services infrastructure uses Cosmos DB storage, which has redundancy enabled for the following regions:

- Australia East
- Canada Central
- France Central
- Korea Central
- East Asia

For these regions, resources are distributed across zones automatically. The storage region is the same as the region where the lab plan is located.

In the event of a zone outage in these regions, you can still perform the following tasks:

- Access the Azure Lab Services website
- Create/manage lab plans
- Create Users
- Configure lab schedules
- Configure lab policies
- Create new labs and VMs in regions unaffected by the zone outage.

Data loss may occur only with an unrecoverable disaster in the Cosmos DB region. For more information, see [Region Outages](/azure/cosmos-db/high-availability#region-outages).

For regions not listed, access to the Azure Lab Services infrastructure is not guaranteed when there is an outage in the region. You may not be able to access the Azure Lab Services website or perform any of the tasks listed previously.

> [!NOTE]
> Existing labs and VMs in regions unaffected by the zone outage aren't affected by a loss of infrastructure in the lab plan region. Existing labs and VMs in unaffected regions can still run and operate as normal.

#### Labs and VMs

Azure Lab Services is not currently zone aligned. So, VMs in a region may be distributed across zones in the region. Therefore, when a zone in a region experiences an outage, there are no guarantees that a lab or any VMs in the associated region will be available.

As a result, the following operations are not guaranteed in the event of a zone outage:

- Manage or access labs/VMs
- Start/stop/reset VMs
- Create/publish/delete labs
- Scale up/down labs
- Connect to VMs

If there's a zone outage in the region, there's no expectation that you can use any labs or VMs in the region.
Labs and VMs in other regions will be unaffected by the outage.


<!-- Select the scenario that best describes customer experience or combine/provide your own description:
 - During a zone-wide outage, no action is required during zone recovery, Offering will self-heal and re-balance itself to take advantage of the healthy zone automatically. 
    
 - During a zone-wide outage, the customer should expect brief degradation of performance, until the service self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones. 
  
 - In a zone-wide outage scenario, users should experience no impact on provisioned resources in a zone-redundant deployment. During a zone-wide outage , customers should be prepared to experience brief interruption for communication to provisioned resources; typically, this is manifested by client receiving 409 error code; this prompts re-try logic with appropriate intervals. New requests will be directed to healthy nodes with zero impact on user. During zone-wide outages, users will be able to create new offering resources and successfully scale existing ones. 
 
 The table may contain:

- CRUD and Scale-out operations (Create Read Update Delete)
- Application communication scenarios – data plane operations (for example, insert/update/delete for a database).

-->

#### Zone outage preparation and recovery

Lab and VM services will be restored as soon as the zone availability is restored (the outage is resolved).

If infrastructure is impacted, it will be restored when the zone availability is resolved.

### Fault tolerance

If you want to preserve access to Azure Lab Services infrastructure during a zone outage, create the lab plan in one of the zone-redundant regions listed above.

<!-- To prepare for availability zone failure, customers should over-provision capacity of service to ensure that the solution can tolerate ⅓ loss of capacity and continue to function without degraded performance during zone-wide outages. Provide any information as to how customers should achieve this. -->

### Safe deployment techniques

N/A - application safe deployment is not relevant - remove?

### Availability zone redeployment and migration

N/A - no migration - remove?

<!-- END IF (AZ SUPPORTED)-->

## Disaster recovery: cross-region failover

N/A - remove? And remove all sub-sections.

### Cross-region disaster recovery in multi-region geography

Microsoft is 100% responsible for outage detection, notifications, and support for outage scenarios.

<!-- If (MICROSOFT 100% RESPONSIBLE) -->

#### Outage detection, notification, and management
<!-- 

- Explain how Microsoft detects and handles outages for this offering. 

- Explain when the offering will be failed to another region (decision guidance). 

- If service is deployed geographically, explain how this works. 

- Specify whether the offering runs Active-Active with auto-failover or Active-Passive. 

- Explain how customer is notified or how customer can check service health. 
-->

<!-- 
- Explain how customer storage is handled, how much data loss occurs and whether R/W or only R/O for 00:__ (duration).

- If this single offering fails over, indicate whether it continues to support primary region or only secondary region. 

- Provide all other guidance of what the customer can expect in region loss scenario. 

- Describe service SLA and high availability. 

- Define RTO and RPO expectations.


<!-- END IF (MICROSOFT 100% RESPONSIBLE) -->

### Single-region geography disaster recovery

<!--
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

### Capacity and proactive disaster recovery resiliency

<!-- Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there is no guarantee of capacity at time of impact for those who have not pre-allocated. 

In this section, provide details of customer knowledge required re: capacity planning and proactive deployments.-->

### Additional guidance

<!-- Provide any additional guidance here -->

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md).