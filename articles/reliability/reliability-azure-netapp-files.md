---
title: Reliability in Azure NetApp Files
description: Find out about reliability in Azure NetApp Files, including availability zones and multi-region deployments.  #Required; 
author: b-ahibbard
ms.author: anfdocs
ms.topic: reliability-article #Required
ms.custom: subject-reliability, references_regions #Required  - use references_regions if specific regions are mentioned.
ms.service: azure-netapp-files
ms.date: 04/09/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how Azure NetApp Files works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 

---
<!--

Template for the main reliability guide for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This guide should live in the reliability content area of azure-docs-pr.
This guide should be linked to in your TOC, under a Reliability node or similar. The name of this page should be *reliability-Azure NetApp Files.md* and the TOC title should be "Reliability in Azure NetApp Files". 
Keep the following headings in the order shown below. 

-->



# Reliability in Azure NetApp Files


This article describes reliability support in Azure NetApp Files, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft. This article also covers ways for you to create a resilient solution that meets your needs.

Azure NetApp Files is an Azure native, first-party, enterprise-class, high-performance file storage service. It provides Volumes as a service, which you can create within a NetApp account and a capacity pool, and share to clients using SMB and NFS. You can also select service and performance levels and manage data protection. You can create and manage high-performance, highly available, and scalable file shares by using the same protocols and tools that you're familiar with and rely on on-premises.

Azure NetApp Files supports the following data redundant storage options:
<!-- TODO: Add your introductory content after the above paragraph. -->


## Production deployment recommendations

<!-- 3. Production deployment recommendations ---------------------------------------------------------

    This section opens with an include that contains a brief explanation of production deployment recommendations such as SKUs and whether to enable zone redundancy in all production environments.
-->

## Reliability architecture overview

<!-- 4. ## Reliability architecture overview [Optional]  ---------------------------------------------------------

    (Optional)  This section focuses on important elements of the architecture relevant to the reliability. It doesn't provide a comprehensive review of the entire service architecture but introduces important reliability elements.
    
    Common items to include here are:
    - Redundancy: Does the service have built-in redundancy, such as by natively supporting multiple instances? If so, please mention that and describe it. Be explicit about whether this requires the customer to configure the instance count or if that's handled automatically for them. If redundancy is regional by default (i.e. not zone-redundant) then explicitly say that.
    - Resource model: If there are multiple resources that a customer creates or manages, consider giving a brief description and linking to more information. This is especially important where there might be different capabilities or guidance in different components.
    - Dependencies: If your service requires dependent resources, and the configuration of those dependent resources might affect the customer's reliability, please explicitly mention that. For example, you might need a customer to deploy a storage account to use the service, and that storage account redundancy model (LRS/ZRS/GRS) will affect how resilient their overall solution is. Please link to the reliability guides for dependent services here too.
-->    

**Example:**

By default, \[service-name\] achieves redundancy by spreading compute nodes and data throughout a single datacenter in the primary region. This approach protects your data in the event of a localized failure, such as a small-scale network or power failure, and even during the following events:

- Customer initiated management operations that result in a brief downtime.
- Service maintenance operations.

    *etc...*

## Transient faults 
<!-- 5. Transient faults  ---------------------------------------------------------

    First, make sure to place this include file at the top of this section:

    [!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

    And then provide any service-specific guidance on transient faults.
  
    If your service hosts the customer's code or applications, it might also be capable of causing or propagating transient faults. If you have guidance to help to avoid these situations, provide it here. For example, App Service supports deployment slots, which avoid application downtime during deployments. 
-->

## Availability zone support


[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)] 

<!--
Give a high-level overview of how this product supports availability zones. For example, some zone-redundant services spread replicas of the service across zones. 

It is important that you:

- Explicitly state whether the service is zone-redundant, zonal, or supports both models. 

- For zone-redundant services, explicitly state whether the customer must deploy into all zones in the region, or they can choose specific zones to use. 

-->

**Example:**
  
>Azure NetApp Files can be configured to be zone redundant, which means your resources are spread across three availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads.

<!--
- For zonal services, clarify that pinning to a zone doesn't increase resiliency. The customer needs to explicitly deploy resources into multiple zones to improve resiliency. 
-->



###  Region support 

Availability zones for Azure NetApp Files are supported in all regions where Azure NetApp Files is available. 

### Requirements

TODO: Add your requirements

<!-- 6B. Requirements -----------------------------------------------------------------
    List any requirements that must be met to use availability zones with this service. Mostly commonly, specific SKUs are required. If availability zones are supported in all SKUs, or if the service has only one default SKU, mention this. Also mention any other requirements that must be met. 
-->

**Example:**

  >You must use the Standard tier or Premium tier to enable zone redundancy.


###  Considerations 

TODO:   Considerations 

<!-- 6C.  Considerations   --------------------------------------------------------------
    Describe any workflows or scenarios that aren't supported, as well as any gotchas. For example, some zone-redundant services only replicate parts of the solution across availability zones but not others. Provide links to any relevant information. 
-->
**Example:**

> During an availability zone outage, your application continues to run and serve traffic. However, you might not be able to use feature X or Y until the availability zone recovers.

### Cost
TODO: Add your cost information

<!-- 6D. Cost ------------------------------

    Give an idea of what this does to the service's billing meters. For example, is there an additional charge for zone redundancy? Do you need to deploy additional instances of your service to achieve zone redundancy? 

    Don't specify prices. Link to the Azure pricing information if needed. 

    If there is no cost difference between zone-redundant and zonal services, state that here.

-->

**Example:**

> When you enable zone redundancy, you're charged a different rate. For more information, see [service pricing information].


### Configure availability zone support 

To configure availability zone support in Azure NetApp Files, see [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md) and [Create cross-zone replication relationships for Azure NetApp Files](../azure-netapp-files/create-cross-zone-replication.md).

### Capacity planning and management 
TODO: Optional. Add your capacity planning and management 

<!-- 5F. Capacity planning and management  ---------------------------------------------------------------
    Optional section. In some services, a zone failover can cause instances in the surviving zones to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->

### Traffic routing between zones
TODO: Optional. Add your traffic routing between zones


<!-- 5G. Traffic routing between zones ----------------------------------------------------------
Optional section.

This section should describe how data replication is performed during regular day-to-day operations - NOT during a zone failure. 

- For zone-redundant services, explain how traffic typically gets passed between instances in availability zones. Common approaches are:

    - **Active/active.** Requests are spread across instances in every availability zone.

    - **Active/passive.** There's some sort of leader-based process where requests go to a single primary instance. 

-->

**Example:**

> When you configure zone redundancy on Azure NetApp Files, requests are automatically spread across the instances in each availability zone. A request might go to any instance in any availability zone.

<!--

- For zonal services, explain how customers should configure their solution to route requests between the availability zones. 

-->

**Example:**

>When you deploy multiple Azure NetApp Files resources in different availability zones, you need to decide how to route traffic between those resources. Commonly, you use a zone-redundant Azure Load Balancer to send traffic to resources in each zone.

### Data replication between zones
TODO: Add your data replication between zones

<!-- 5H. Data replication between zones ------------------------------------------
    
Optional section.  

This section is only required for services that perform data replication across zones.  

This section explains how data is replicated: synchronously, asynchronously, or some combination between the two. 

This section should describe how data replication is performed during regular day-to-day operations - NOT during a zone failure.  

-->

>[!IMPORTANT]
>The data replication approach across zones is usually different to the approach used across regions.

<!--
Most Azure services replicate data across zones synchronously, which means that changes are applied to multiple (or all) zones simultaneously, and the change isn't considered to be completed until multiple/all zones have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs.

-->

**Example:**

> When a client changes any data in your Azure NetApp Files resource, that change is applied to all instances in all zones simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a zone failure. Availability zones are located relatively close together, which means there's minimal effect on latency or throughput.

<!--
Alternatively, some services replicate their data asynchronously, where changes are applied in a single zone and then propagated after some time to the other zones. Use wording similar to this to explain this approach and its tradeoffs.
-->

**Example:**

> When a client changes any data in your Azure NetApp Files resource, that change is applied to the primary zone. At that point, the write is considered to be complete. Later, the X resource in the secondary zone is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that hasn't been replicated between availability zones could be lost if the primary zone experiences a failure.

<!--
    Your service might behave differently to the examples provided above, so adjust or rewrite as much as you need. The accuracy and clarity of this information is critical to our customers, so please make sure you understand and explain the replication process thoroughly. 
-->

### Zone-down experience
TODO: Add your zone-down experience

<!-- 3I. Zone-down experience ------------------------------------------------------------

Explain what happens when an availability zone is down. Be precise and clear. Avoid ambiguity in this section, because customers depend on it for their planning purposes.  Divide your content into the following sections. You can use the table format if your descriptions are short. Otherwise, you can use a list format.

- **Detection and response**: Explain who is responsible for detecting when a zone is down and for responding, such as by initiating a zone failover. For zonal resources, is it customer-initiated or Microsoft-initiated? Zone-redundant is always Microsoft-initiated. 

-->

**Example:**
> The Azure NetApp Files platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

<!--    
- **Notification**: Explain whether a customer can find out when a zone has been lost. Are there logs? Is there a way to set up an alert? 
-->
**Example:**
> To determine when a zone failure occurred, see [logs/alerts/Resource Health/Service Health – be specific about what to look for].


<!--
- **Active requests**: For zone-redundant services, explain what happens to any active (in-flight) requests.
-->

**Example:**
> Any active requests are dropped and should be retried by the client.


<!--
- **Expected data loss**: Explain if the customer should expect any data loss during a zone failover. For zone-redundant services, usually there is no data loss.
-->

**Example:**
> A zone failure isn't expected to cause any data loss.

<!--
- **Expected downtime**: Explain any expected downtime, such as during a failover operation.
-->

**Example:**
> A zone failure isn't expected to cause downtime to your resources.

<!--
- **Traffic rerouting**: For zone-redundant services, explain how the platform recovers, including how traffic is rerouted to the surviving zones. For zonal services, explain how customers should reroute traffic after a zone is lost.
-->

**Example:**
> When a zone is unavailable, Azure NetApp Files detects the loss of the zone and creates new instances in another availability zone. Then, any new requests are automatically spread across all active instances.


### Failback
TODO: Add your failback

<!-- 5J. Failback  ----------------------------------------------------
    Explain who initiates a failback. For zonal resources, is it customer-initiated or Microsoft-initiated? Zone-redundant is always Microsoft-initiated. 
-->

**Example:**

> When the availability zone recovers,  Azure NetApp Files  automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.


<!--
    Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation. (Most services don't require this section because data inconsistency isn't possible between availability zones.) 

-->

### Testing for zone failures  
TODO: Add your testing for zone failures  

<!-- 6H. Testing for zone failures ----------------------------------------------------

For zonal services, can you trigger a fault in an availability zone, such as by using Azure Chaos Studio? If so, link to the specific fault types that simulate the appropriate failure. 

-->

**Example:**

> You can simulate a zone failure by using Azure Chaos Studio. Inject the XXX fault to simulate the loss of an availability zone. Regularly test your responses to zone failures so that you can be ready for unexpected availability zone outages.

<!--
For zone-redundant services, is there a way for the customer to test a zone failover? Usually that's not possible, so use wording like this: 
-->

**Example:**
  
> The Azure Azure NetApp Files  platform manages traffic routing, failover, and failback for zone-redundant X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.


## Multi-region support


The Azure NetApp Files replication functionality provides data protection through cross-region volume replication. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region. This capability enables you to fail over your critical application if a region-wide outage or disaster happens. To learn more, see:

- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
- [Supported regions for cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md#supported-region-pairs)
- [Requirements and considerations for using cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-requirements-considerations.md)
- [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)



### Failback

Both failover and failback are manual process in Azure NetApp Files. For more information including how to manage these processes, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md)

### Testing for region failures  

To test your preparedness and cross-region replication configuration, see [Test disaster recovery using cross-region replication for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).


## Backups

<!-- 8. Backups   ----------------------
Required only if the service supports backups. 

Describe any backup features the service provides. Clearly explain whether they are fully managed by Microsoft, or if customers have any control over backups. Explain where backups are stored and how they can be recovered. Note whether the backups are only accessible within the region or if they're accessible across regions, such as after a region failure. 

You must include the following caveat:
-->

> For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [link to article about how backups contribute to a resiliency strategy].

## Service-level agreement

<!-- 9. Service-level agreement (SLA)   ----------------------
    Summarize, in readable terms, the key requirements that must be met for the SLA to take effect. Do not repeat the SLA, or provide any exact wording or numbers. Instead, aim to provide a general overview of how a customer should interpret the SLA for a service, because they often are quite specific about what needs to be done for an SLA to apply. 

    The content should begin with:
-->  
   
> The service-level agreement (SLA) for Azure NetApp Files describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [link to SLA for Azure NetApp Files].
    
<!--   
    You can then list conditions here in list or table form.
-->

## Related content

- [Use availability zone volume placement for application high availability with Azure NetApp Files](../azure-netapp-files/use-availability-zones.md)
- [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md)
- [Create cross-zone replication relationships for Azure NetApp Files](../azure-netapp-files/create-cross-zone-replication.md).
- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
- [Supported regions for cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md#supported-region-pairs)
- [Requirements and considerations for using cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-requirements-considerations.md)
- [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)
