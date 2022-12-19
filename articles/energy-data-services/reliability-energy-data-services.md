---
title: Resiliency in Microsoft Energy Data Services #Required; Must be "Resiliency in *your official service name*"
description: Find out about reliability in Microsoft Energy Data Services #Required; 
author: bharathim #Required; your GitHub user alias, with correct capitalization.
ms.author: bselvaraj #Required; Microsoft alias of author; optional team alias.
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 12/05/2022 #Required; mm/dd/yyyy format.
---

<!--#Customer intent: As a customer, I want to understand reliability support for Microsoft Energy Data Services so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->

<!--

Template for the main reliability article for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This article should live in the reliability content area of azure-docs-pr.
This article should be linked to in your TOC. Under a Reliability node or similar. The name of this page should be *reliability-Microsoft Energy Data Services.md* and the TOC title should be "Reliability in Microsoft Energy Data Services". 
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
- Do a search and replace of TODO-service-name  with the name of your service. That will make the template easier to read.
- ALL sections are required unless noted otherwise.
- MAKE SURE YOU REMOVE ALL COMMENTS BEFORE PUBLISH!!!!!!!!

-->

<!-- 1. H1 -----------------------------------------------------------------------------
Required: Uses the format "What is reliability in X?"
The "X" part should identify the product or service.
-->

# What is reliability in Microsoft Energy Data Services?

<!-- 2. Introductory paragraph ---------------------------------------------------------
Required: Provide an introduction. Use the following placeholder as a suggestion, but elaborate.
-->

This article describes reliability support in Microsoft Energy Data Services, and covers regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

## Availability zone support
<!-- IF (AZ SUPPORTED) -->
Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. They can be configured in two ways. They can be either zone redundant, with automatic replication across zones, or zonal, with instances pinned to a specific zone. You can also combine these approaches. For more information on zonal vs. zone-redundant architecture, see [Build solutions with availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

Microsoft Energy Data Services Preview supports zone-redundant instance by default and there is no setup required by the Customer.

### Prerequisites

The Microsoft Energy Data Services Preview supports availability zones in the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| South Central US | North Europe         |               |                    |                |
| East US          | West Europe          |               |                    |                |

### Zonal failover support
N/A

<!-- 3D. Zonal failover support --------------------------------------------------------
-->

<!-- IF (SERVICE IS ZONAL) -->

<!-- Indicate here whether the customer can set up resources of the service to failover to another zone. If they can set up failover resources, provide a link to documentation for this procedure. If such documentation doesn't exist, create the document, and then link to it from here. -->

<!-- END IF (SERVICE IS ZONAL) -->

### Fault tolerance
To prepare for availability zone failure, Microsoft Energy Data Services will over-provision capacity of service to ensure that the solution can tolerate ⅓ loss of capacity and continue to function without degraded performance during zone-wide outages.

<!-- 3E. Fault tolerance ---------------------------------------------------------------
To prepare for availability zone failure, customers should over-provision capacity of service to ensure that the solution can tolerate ⅓ loss of capacity and continue to function without degraded performance during zone-wide outages. Provide any information as to how customers should achieve this.
-->

### Zone down experience
- During a zone-wide outage, no action is required during zone recovery, Offering will self-heal and re-balance itself to take advantage of the healthy zone automatically. 
    
- During a zone-wide outage, the customer should expect brief degradation of performance, until the service self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones. 
  
- In a zone-wide outage scenario, users should experience no impact on provisioned resources in a zone-redundant deployment. During a zone-wide outage , customers should be prepared to experience brief interruption for communication to provisioned resources; this prompts re-try logic with appropriate intervals. New requests will be directed to healthy nodes with zero impact on user. During zone-wide outages, users will be able to create new offering resources; however, there could be capacity constraints, due to which the underlying resources will be scaled on a best-effort basis.

- All Microsoft Energy Data Services APIs may need to be retried for 5XX errors.

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

The table below lists all error codes that may be thrown by the Microsoft Energy Data Services and resources of that service during zone down outages.

List the following:

- CRUD and Scale-out operations (Create Read Update Delete)
- Application communication scenarios – data plane operations (for example, insert/update/delete for a database).

| Error code | Operation | Description |
|---|---|---|
-->
<!-- END IF (SERVICE IS ZONE REDUNDANT) -->

#### Zone outage preparation and recovery
<!-- TODO: Add your zone outage preparation and recovery -->

<!-- 3G. Zone outage preparation and recovery ------------------------------------------
The table below lists alerts that can trigger an action to compensate for a loss of capacity or a state for your resources. It also provides information regarding actions for recovery, as well as how to prepare for such alerts prior to the outage.

| Alert type | Actions for recovery | How to prepare prior to outage |
|--|--|--|
-->

### Low-latency design
Microsoft guarantees communication between zones of < 2ms and all underlying Microsoft Energy Data Services resources supports it.

<!-- 3H. Low-latency design ------------------------------------------------------------
-->

<!-- IF (SERVICE IS ZONE REDUNDANT AND ZONAL) -->

<!-- Describe scenarios in which the customer will opt for zonal vs. zone-redundant version of your offering.-->

<!-- Microsoft guarantees communication between zones of < 2ms. In scenarios in which your solution is sensitive to such spikes, you should configure all components of the solution to align to a zone. This section is intended to explain how your service enables low-latency design, including which SKUs of the service support it. -->

<!-- OPTIONAL SECTION. If your service supports active-passive model, share an approach to control active component to a desired zone and align passive component with next zone. Make an explicit call-out for functionality where a resource is flagged as zone redundant but offers active-passive/primary-replica model of functionality-->

<!-- END IF (SERVICE IS ZONE REDUNDANT AND ZONAL) -->


<!-- ### Safe deployment techniques -->
<!-- TODO: Add your safe deployment techniques -->

<!-- 3I. Safe deployment techniques ----------------------------------------------------
If application safe deployment is not relevant for this resource type, explain why and how the service manages availability zones for the customer behind the scenes.
-->

<!-- When you opt for availability zones isolation, you should utilize safe deployment techniques for application code, as well as application upgrades. Describe techniques that the customer should use to target one-zone-at-a-time for deployment and upgrades (for example, virtual machine scale sets). If something is strictly recommended, call it out below. -->

<!-- List health signals that the customer should monitor, before proceeding with upgrading next set of nodes in another zone, to contain a potential impact of an unhealthy deployment. -->
<!-- [Health signals] -->
<!-- TODO: Add your health signals -->

<!-- ### Availability zone redeployment and migration -->
<!-- TODO: Add your availability zone redeployment and migration -->

<!-- 3J. Availability zone redeployment and migration ----------------------------------------------------
Link to a document that provides step-by-step procedures, using Portal, ARM, CLI, for migrating existing resources to a zone redundant configuration. If such a document doesn't exist, please start the process of creating that document. The template for AZ migration is:

` [!INCLUDE [AZ migration template](az-migration-template.md)] `
-->

<!-- END IF (AZ SUPPORTED)-->

## Next steps
> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)