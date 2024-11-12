---
title: Reliability in Azure API Management
description: Find out about reliability in Azure API Management, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-api-management
ms.date: 11/11/2024
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how Azure API Management works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---



# Reliability in Azure API Management

This article describes reliability support in Azure API Management, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.



## Production deployment recommendations

- Use Premium tier with `stv2` compute platform for your API Management instance. The Premium tier provides the features you need to ensure high availability and reliability for your production workloads.

- [Enable zone redundancy](#availability-zone-support), which requires your API Management service to deploy at least one instance in each availability zone. This configuration ensures that your API Management instance is resilient to datacenter-level failures.

## Transient faults 

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.

<!--   
    When application code interacts with an Azure service, it's common to retry failed requests to allow for transient faults. If your service has an SDK, it likely already supports this capability.
    
    Use the following text or something similar:
-->    

>All cloud-hosted applications should follow Azure transient-fault handling guidance to communicate with any cloud-hosted APIs, databases, and other components. Microsoft-provided SDKs usually handle transient faults transparently. For more information, see [Recommendations for handling transient faults].

<!--
    If your service hosts the customer's code or applications, it might also be capable of causing or propagating transient faults. If you have guidance to help to avoid these situations, provide it here. For example, App Service supports deployment slots, which avoid application downtime during deployments. 
-->

## Availability zone support


The Azure API Management service supports availability zones in both zonal and zone-redundant configurations:

- *Zonal.* The API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone that you select within an Azure region.  

>[!NOTE] 
>Pinning to a single zone doesn’t increase resiliency. To improve resiliency, you need to explicitly deploy resources into multiple zones (zone-redundancy). 

- *Zone-redundant* -  Enabling zone redundancy for an API Management instance in a supported region provides redundancy for all service components: gateway, management plane, and developer portal. Azure automatically replicates all service components across the zones that you select.

This article describes four scenarios for migrating an API Management instance to availability zones. For more information about configuring API Management for high availability, see [Ensure API Management availability and reliability](../api-management/high-availability.md).

<!-- 5. Availability zone support ------------------------------------------------------

Give a high-level overview of how this product supports availability zones. For example, some zone-redundant services spread replicas of the service across zones. 

It is important that you:

- Explicitly state whether the service is zone-redundant, zonal, or supports both models. 

- For zone-redundant services, explicitly state whether the customer must deploy into all zones in the region, or they can choose specific zones to use. 
-->

**Example:**
  
>[service-name] can be configured to be zone redundant, which means your resources are spread across three availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads.

<!--
- For zonal services, clarify that pinning to a zone doesn’t increase resiliency. The customer needs to explicitly deploy resources into multiple zones to improve resiliency. 
-->



### Requirements


* If you don't have an API Management instance, create one by following the [Create a new Azure API Management instance by using the Azure portal](../api-management/get-started-create-service-instance.md) quickstart. Select the Premium service tier.

* Your API Management instance must be in Premium tier. If it isn't, [upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

* If your API Management instance is deployed (injected) in an [Azure virtual network](../api-management/api-management-using-with-vnet.md), make sure that the version of the [compute platform](../api-management/compute-infrastructure.md) (`stv1` or `stv2`) that hosts the service.

###  Region support 

To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](availability-zones-service-support.md#azure-regions-with-availability-zone-support).          |                    |                | 



###  Considerations 

TODO:   Considerations 

<!-- 5C.  Considerations   --------------------------------------------------------------
    Describe any workflows or scenarios that aren't supported, as well as any gotchas. For example, some zone-redundant services only replicate parts of the solution across availability zones but not others. Provide links to any relevant information. 
-->
**Example:**

> During an availability zone outage, your application continues to run and serve traffic. However, you might not be able to use feature X or Y until the availability zone recovers.

### Cost
TODO: Add your cost information

<!-- 5D. Cost ------------------------------

    Give an idea of what this does to the service’s billing meters. For example, is there an additional charge for zone redundancy? Do you need to deploy additional instances of your service to achieve zone redundancy? 

    Don't specify prices. Link to the Azure pricing information if needed. 

    If there is no cost difference between zone-redundant and zonal services, state that here.

-->

**Example:**

> When you enable zone redundancy, you're charged a different rate. For more information, see [service pricing information].


### Configure availability zone support 


<!-- 5E. Configure availability zone support  --------------------------------------------------------


In this section, link to deployment or migration guides. If you don't have the required guide, you'll need to create one.

DO NOT provide detailed how-to guidance in this article.

Provide links to documents that show how to create a resource or instance with availability zone enabled. Ideally, the documents should contain examples using the Azure portal, Azure CLI, Azure PowerShell, and Bicep. Here are some examples of relevant link topics:

- Create a [service-name] resource that uses availability zones
- Disable availability zones for existing [service-name] resources
- Migrate existing [service-name] resources to availability zone support

If your service does NOT support enabling availability zone support after deployment, add an explicit statement to indicate that. 

-->

**Example:**

Zone redundancy can be configured only when a new [service-name] resource is created. If you have an existing [service-name] resource that isn't zone-redundant, replace it with a new zone-redundant [service-name] resource. You can't convert an existing [service-name] resource to use availability zones.

### Capacity planning and management 

When you enable zone redundancy in a region, consider the number of API Management scale units that need to be distributed. Minimally, configure the same number of units as the number of availability zones, or a multiple so that the units are distributed evenly across the zones. For example, if you select three availability zones in a region, you could have three units so that each zone hosts one unit.

Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to decide the number of scale units that  provide your required gateway performance. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).


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

> When you configure zone redundancy on [service-name], requests are automatically spread across the instances in each availability zone. A request might go to any instance in any availability zone.

<!--

- For zonal services, explain how customers should configure their solution to route requests between the availability zones. 

-->

**Example:**

>When you deploy multiple [service-name] resources in different availability zones, you need to decide how to route traffic between those resources. Commonly, you use a zone-redundant Azure Load Balancer to send traffic to resources in each zone.

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
Most Azure services replicate data across zones synchronously, which means that changes are applied to multiple (or all) zones simultaneously, and the change isn’t considered to be completed until multiple/all zones have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs.

-->

**Example:**

> When a client changes any data in your [service-name] resource, that change is applied to all instances in all zones simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a zone failure. Availability zones are located relatively close together, which means there's minimal effect on latency or throughput.

<!--
Alternatively, some services replicate their data asynchronously, where changes are applied in a single zone and then propagated after some time to the other zones. Use wording similar to this to explain this approach and its tradeoffs.
-->

**Example:**

> When a client changes any data in your [service-name] resource, that change is applied to the primary zone. At that point, the write is considered to be complete. Later, the X resource in the secondary zone is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that hasn't been replicated between availability zones could be lost if the primary zone experiences a failure.

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
> The [service-name] platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

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
> When a zone is unavailable, [service-name] detects the loss of the zone and creates new instances in another availability zone. Then, any new requests are automatically spread across all active instances.


### Failback
TODO: Add your failback

<!-- 5J. Failback  ----------------------------------------------------
    Explain who initiates a failback. For zonal resources, is it customer-initiated or Microsoft-initiated? Zone-redundant is always Microsoft-initiated. 
-->

**Example:**

> When the availability zone recovers,  [service-name]  automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.


<!--
    Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation. (Most services don’t require this section because data inconsistency isn’t possible between availability zones.) 

-->

### Testing for zone failures  
TODO: Add your testing for zone failures  

<!-- 5J. Testing for zone failures ----------------------------------------------------

For zonal services, can you trigger a fault in an availability zone, such as by using Azure Chaos Studio? If so, link to the specific fault types that simulate the appropriate failure. 

-->

**Example:**

> You can simulate a zone failure by using Azure Chaos Studio. Inject the XXX fault to simulate the loss of an availability zone. Regularly test your responses to zone failures so that you can be ready for unexpected availability zone outages.

<!--
For zone-redundant services, is there a way for the customer to test a zone failover? Usually that’s not possible, so use wording like this: 
-->

**Example:**
  
> The Azure [service-name]  platform manages traffic routing, failover, and failback for zone-redundant X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.


## Multi-region support
TODO: Add your multi-region support.

<!-- 6. Multi-region support ---------------------------------------

    This section ONLY describes native product features for multi-region support.  Don’t talk about patterns or approaches to create multiple instances in different regions – that’s in the “Alternative multi-region approaches” section. 

    If the service has built-in multi-region support that supports resiliency requirements, describe it here. 

-->

**Example:**

>[service-name] can be configured to use multiple Azure regions. When you configure multi-region support, you select which region should be the primary region, and [service-name] automatically replicates changes in your data to each selected secondary region.

<!--

For a single-region service, which means it’s regionally deployed and has no direct multi-region support, use wording like the following: 

-->

**Example:**

>[service-name] is a single-region service. If the region is unavailable, your [service-name] resource is also unavailable.


>[!IMPORTANT]
>For a single-region service, don't include the H3 headings in this section. Skip to “Alternative multi-region approaches”. 

### Requirements 

<!-- 6A. Requirements ----------------------
    List any requirements that must be met to use multiple regions with this service. Most commonly, specific SKUs are required. If multiple regions are supported in all SKUs, or if the service has only one default SKU, mention this. Also mention any other requirements that must be met. 
-->

**Example:**

> You must use the Premium tier to enable multi-region support.

### Region support 

<!-- 6B. Region support ----------------------
    Make it clear if multi-region support relies on Azure region pairs, or if it works across any combination of regions. Also, explain any other regional requirements, such as requiring all regions to be within the same geography, or within a defined latency perimeter. 
-->

**Example:**

> You can select any Azure region for your secondary instances.

### Considerations

<!-- 6C. Considerations ----------------------
    Describe any workflows or scenarios that aren't supported, as well as any gotchas. For example, some services only replicate parts of the solution across regions but not others. 

    Include information about any expected downtime or effects if you enable multi-region support after deployment. Provide links to any relevant information. 

-->

**Example:**

> When you enable multi-region support, component Z is replicated across regions, but other components aren't replicated. After a region failover, your resource continues to work, but feature A might be unavailable until the region recovers and full service is restored.


### Cost

<!-- 6D. Cost ----------------------
    Give an idea of what this does to your billing meters. For example, is there an additional charge for enabling multi-region support? Do you need to deploy additional instances of your service in each region? 

    Don't specify prices. Link to the Azure pricing information if needed. 
-->


**Example:**

> When you enable multi-region support, you're billed for each region that you select. For more information, see [service pricing information].


### Configure multi-region support 

<!-- 6E. Configure multi-region support  ----------------------

    In this section, link to deployment or migration guides. If you don't have the required guide, you'll need to create one.

    DO NOT provide detailed how-to guidance in this article.
    
    Provide links to documents that show how to create a resource or instance with multi-region support. Ideally, the documents should contain examples using the Azure portal, Azure CLI, Azure PowerShell, and Bicep. 
-->   

**Example:**

> To deploy a new multi-region [service-name] resource, see [Create an [service-name] resource with multi-region support].
>
> To enable multi-region support for an existing [service-name] resource, see [Enable multi-region support in an [service-name] resource]. 

<!--   
    If your service does NOT support enabling multi-region support after deployment, add an explicit statement to indicate that. 
    
    If your service supports disabling multi-region support, provide links to the relevant how-to guides for that scenario. 
-->

### Capacity planning and management 
<!-- 6F. Capacity planning and management  ----------------------
    Optional section. 

    In some services, a region failover can cause instances in the surviving regions to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->

### Traffic routing between regions 
<!-- 6G. Traffic routing between regions  ----------------------
    
    This section explains how work is divided up between instances in multiple regions, during regular day-to-day operations - NOT during a region failure. 

    Common approaches are:
    
    - **Active/active.**  Requests are spread across instances in every region, maybe using Traffic Manager or Azure Front Door behind the scenes.
    
    - **Active/passive.** Requests always goes to the primary region.
-->   

**Example:**

> When you configure multi-region support, all requests are routed to an instance in the primary region. The secondary regions are used only in the event of a failover.

### Data replication between regions 

<!-- 6H. Data replication between regions  ----------------------
    

    Optional section. 

    This section is only required for services that perform data replication across regions. 
    
    This section explains how data is replicated: synchronously, asynchronously, or some combination between the two.
    
    This section should describe how data replication is performed during regular day-to-day operations - NOT during a region failure. 

    Note - the data replication approach across regions is usually different from the approach used across availability zones.

    Most Azure services replicate the data across regions asynchronously, where changes are applied in a single region and then propagated after some time to the other regions. Use wording similar to this to explain this approach and its tradeoffs:
-->      

**Example:**

> When a client changes any data in your [service-name] resource, that change is applied to the primary region. At that point, the write is considered to be complete. Later, the X resource in the secondary region is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that wasn't replicated between regions could be lost if the primary region experiences a failure.

<!--     
    Alternatively, some services replicate their data synchronously which means that changes are applied to multiple (or all) regions simultaneously, and the change isn’t considered to be completed until multiple/all regions have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs:
-->    

**Example:**
    
> When a client changes any data in your [service-name] resource, that change is applied to all instances in all regions simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a region failure. However, because all changes have to be replicated across regions that might be geographically distant, you might experience lower throughput or performance.

<!--     
    Your service might behave differently to the examples provided above, so adjust or rewrite as much as you need. The accuracy and clarity of this information is critical to our customers, so please make sure you understand and explain the replication process thoroughly. 
-->   


### Region-down experience 

<!-- 6I. Region down experience   ----------------------

Explain what happens when a region is down. Be precise and clear. Avoid ambiguity in this section, because customers depend on it for their planning purposes. Divide your content into the following sections. You can use the table format if your descriptions are short. Alternatively, you can use a list format.

- **Detection and response** Explain who is responsible for detecting a region is down and for responding, such as by initiating a region failover. Whether your service has customer-managed failover or the service manages it itself, describe it here. 

  If your multi-region support depends on another service, commonly Azure Storage, detecting and failing over, explicitly state that, and link to the relevant reliability guide to understand the conditions under which that happens. Be careful with talking about GRS because that doesn’t apply in non-paired regions, so explain how things work in that case. 
-->

**Example:**

*For customer-initiated detection:*

> [service-name] is responsible for detecting a failure in a region and automatically failing over to the secondary region.


*For service-initiated detection:*

> [service name] is responsible for detecting a failure in a region and automatically failing over to the secondary region.

*For detection that depends on another service:*

>In regions that have pairs, [service name] depends on Azure Storage geo-redundant storage for data replication to the secondary region. Azure Storage detects and initiates a region failover, but it does so only in the event of a catastrophic region loss. This action might be delayed significantly, and during that time your resource might be unavailable. For more information, see [Link to more info].

<!--
- **Notification** Explain if there’s a way for a customer to find out when a region has been lost. Are there logs? Is there a way to set up an alert? 
-->

**Example:**

> To determine when a region failure occurred, see [logs/alerts/Resource Health/Service Health].

<!--
- **Active requests** Explain what happens to any active (inflight) requests.
-->

**Example:**

> Any active requests are dropped and should be retried by the client.

<!--- 
    **Expected data loss** Explain if the customer should expect any data loss during a region failover. Data loss is common during a region failover, so it’s important to be clear here. 
-->

**Example:**

> You might lose some data during a region failure if that data isn't yet synchronized to another region.

<!--
    - **Expected downtime** Explain any expected downtime, such as during a failover operation. 
-->

**Example:**

> Your [service-name] resource might be unavailable for approximately 2 to 5 minutes during the region failover process.

<!--
    - **Traffic rerouting** Explain how the platform recovers, including how traffic is rerouted to the surviving region. If appropriate, explain how customers should reroute traffic after a region is lost. 
-->

**Example:**
> When a region failover occurs, [service-name] updates DNS records to point to the secondary region. All subsequent requests are sent to the secondary region.

### Failback
TODO: Add your failback

<!-- 6J. Failback  ----------------------------------------------------

    Explain who initiates a failback. Is it customer-initiated or Microsoft-initiated? What does failback involve?

-->

**Example:**

> When the primary region recovers, [service-name]  automatically restores instances in the region, removes any temporary instances created in the other regions, and reroutes traffic between your instances as normal.


<!--
    Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation.

-->

### Testing for region failures  
<!-- 6K. Testing for region failures    ----------------------
    
    Can you trigger a fault to simulate a region failure, such as by using Azure Chaos Studio? If so, link to the specific fault types that simulate the appropriate failure. 

-->   

**Example:**

> You can simulate a region failure by using Azure Chaos Studio. Inject the XXX fault to simulate the loss of an entire region. Regularly test your responses to region failures so that you can be ready for unexpected region outages.

 <!--
    For Microsoft-managed multi-region services, is there a way for the customer to test a region failover? If that’s not possible, use wording like this: 
    
 --> 

 **Example:**

> The Azure [service-name] platform manages traffic routing, failover, and failback for multi-region X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate region failure processes.


### Alternative multi-region approaches 

<!-- 6L. Alternative multi-region approaches    ----------------------
    
Optional section. 

If the service does NOT have built-in multi-region support, are there approaches or patterns we can recommend that provide multi-region failover? These must be documented in the Azure Architecture Center. You can also provide multiple approaches if required. At least one of the approaches must work in non-paired regions. 


If you need to use [service-name] in multiple regions, you need to deploy separate resources in each region. If you create an identical deployment in a secondary Azure region using a multi-region geography architecture, your application becomes less susceptible to a single-region disaster. When you follow this approach, you need to configure load balancing and failover policies. You also need to replicate your data across the regions so that you can recover your last application state. 

For example approaches that illustrates this architecture, see:

- [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](https://learn.microsoft.com/azure/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Highly available multi-region web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/multi-region)
- [Deploy Azure Spring Apps to multiple regions](https://learn.microsoft.com/azure/architecture/web-apps/spring-apps/architectures/spring-apps-multi-region)
-->   


## Backups

<!-- 7. Backups   ----------------------
Required only if the service supports backups. 

Describe any backup features the service provides. Clearly explain whether they are fully managed by Microsoft, or if customers have any control over backups. Explain where backups are stored and how they can be recovered. Note whether the backups are only accessible within the region or if they’re accessible across regions, such as after a region failure. 

You must include the following caveat:
-->

> For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [link to article about how backups contribute to a resiliency strategy].

## Service-level agreement

<!-- 8. Service-level agreement (SLA)   ----------------------
    Summarize, in readable terms, the key requirements that must be met for the SLA to take effect. Do not repeat the SLA, or provide any exact wording or numbers. Instead, aim to provide a general overview of how a customer should interpret the SLA for a service, because they often are quite specific about what needs to be done for an SLA to apply. 

    The content should begin with:
-->  
   
> The service-level agreement (SLA) for [service-name] describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [link to SLA for [service-name]].
    
<!--   
    You can then list conditions here in list or table form.
-->

## Related content

<!-- 9.Related content ---------------------------------------------------------------------
Required: Include any related content that points to a relevant task to accomplish,
or to a related topic. 

- [Reliability in Azure](/azure/availability-zones/overview.md)
-->