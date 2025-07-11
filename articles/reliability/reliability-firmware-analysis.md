---
title: Reliability in firmware analysis #Required; Must be "Reliability in *your official service name*"
description: Find out about reliability in Azure firmware analysis, including availability zones and multi-region deployments. #Required; 
author: karenguo #Required; your GitHub user alias, with correct capitalization.
ms.author: karenguo #Required; Microsoft alias of author; optional team alias.
ms.topic: reliability-article #Required
ms.custom: subject-reliability, references_regions #Required - use references_regions if specific regions are mentioned.
ms.service: learn #Required replace with your service meta tag. For taxonomies see https://review.learn.microsoft.com/help/platform/metadata-taxonomies/msservice?branch=main
ms.date: 7/11/2025 #Required; mm/dd/yyyy format.
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how [service-name] works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 

---

<!--

Template for the main reliability guide for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This guide should live in the reliability content area of azure-docs-pr.
This guide should be linked to in your TOC, under a Reliability node or similar. The name of this page should be *reliability-[service-name].md* and the TOC title should be "Reliability in [service-name]". 
Keep the following headings in the order shown below. 

-->


<!--

IMPORTANT: 
- Do a search and replace of TODO-service-name with the name of your service. That will make the template easier to read.
- ALL sections are required unless noted otherwise.
- MAKE SURE YOU REMOVE ALL COMMENTS BEFORE PUBLISH!!!!!!!!
- If your service offers multiple tiers or SKUs, you should provide a single reliability guide that covers all tiers and uses zone pivots for each tier. To see an example of how to do this, see the [reliability guide for Azure App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service).


-->

<!-- 1. H1 -----------------------------------------------------------------------------
Required: Uses the format "Reliability in [service-name]"
-->

# Reliability in \[service-name\]


<!-- 2. Introductory paragraph ---------------------------------------------------------
Required: Provide an introduction. 

The headline (H1) is the primary heading at the top of the guide. 


Use the following format for the H1: "Reliability in [service-name]".


Use the following as the introduction:
-->

> This article describes reliability support in [service-name], covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).
>
>Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.


TODO: Add your introductory content after the above paragraph.


## Production deployment recommendations

<!-- 3. Production deployment recommendations ---------------------------------------------------------

  This section opens with an include that contains a brief explanation of production deployment recommendations such as SKUs and whether to enable zone redundancy in all production environments.
-->

## Reliability architecture overview

<!-- 4. ## Reliability architecture overview [Optional] ---------------------------------------------------------

  (Optional) This section focuses on important elements of the architecture relevant to the reliability. It doesn't provide a comprehensive review of the entire service architecture but introduces important reliability elements.
  
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
<!-- 5. Transient faults ---------------------------------------------------------

  First, make sure to place this include file at the top of this section:

  [!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

  And then provide any service-specific guidance on transient faults.
 
  If your service hosts the customer's code or applications, it might also be capable of causing or propagating transient faults. If you have guidance to help to avoid these situations, provide it here. For example, App Service supports deployment slots, which avoid application downtime during deployments. 
-->

## Availability zone support


<!-- 6. Availability zone support ------------------------------------------------------

  Always begin this section with the following include file:
-->

<!-- [!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)] -->

<!--
Give a high-level overview of how this product supports availability zones. For example, some zone-redundant services spread replicas of the service across zones. 

It is important that you:

- Explicitly state whether the service is zone-redundant, zonal, or supports both models. 

- For zone-redundant services, explicitly state whether the customer must deploy into all zones in the region, or they can choose specific zones to use. 

-->

**Example:**
 
>[service-name] can be configured to be zone redundant, which means your resources are spread across three availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads.

<!--
- For zonal services, clarify that pinning to a zone doesn't increase resiliency. The customer needs to explicitly deploy resources into multiple zones to improve resiliency. 
-->



### Region support 

TODO: Region support 

<!-- 6A. Region support -----------------------------------------------------------------


If you support availability zones in all AZ-capable regions, state that here.
-->

>Zone-redundant [service-name] resources can be deployed into any region that supports availability zones.

<!--
 
If you support all but a small number of AZ-capable regions, list the exceptions but not the full region list.
-->

>Zone-redundant [service-name] resources can be deployed into any region that supports availability zones, except: 
>
>- *XYZ*
>- *ABC* 

<!--
If you support a subset of AZ-capable regions, list the regions using the following format with leading text and table: 
-->

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| Brazil South     | France Central       | Qatar Central |                    | Australia East |
| Canada Central   | Germany West Central |               |                    | Central India  |
| Central US       | North Europe         |               |                    | China North 3  |
| East US          | Sweden Central       |               |                    | East Asia      |
| East US 2        | UK South             |               |                    | Japan East     |
| South Central US | West Europe          |               |                    | Southeast Asia |
| West US 2        |                      |               |                    |                |
| West US 3        |                      |               |                    |                | 


### Requirements

TODO: Add your requirements

<!-- 6B. Requirements -----------------------------------------------------------------
   List any requirements that must be met to use availability zones with this service. Mostly commonly, specific SKUs are required. If availability zones are supported in all SKUs, or if the service has only one default SKU, mention this. Also mention any other requirements that must be met. 
-->

**Example:**

 >You must use the Standard tier or Premium tier to enable zone redundancy.


### Considerations 

TODO:  Considerations 

<!-- 6C. Considerations  --------------------------------------------------------------
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


<!-- 6E. Configure availability zone support --------------------------------------------------------


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
TODO: Optional. Add your capacity planning and management 

<!-- 5F. Capacity planning and management ---------------------------------------------------------------
   Optional section. In some services, a zone failover can cause instances in the surviving zones to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->

### Normal operations 
TODO: Optional. Add information about normal operations. Break the content down into two bullets: Traffic routing between zones and data replication between zones.


<!-- 5G. Normal operations ----------------------------------------------------------
Optional section.
 
The following information describes what happens when you have a zone-redundant [service-name] and all availability zones are operational:

- **Traffic routing between zones**. For zone-redundant services, explain how traffic typically gets passed between instances in availability zones. Common approaches are:
   - **Active/active.** Requests are spread across instances in every availability zone.
   - **Active/passive.** There's some sort of leader-based process where requests go to a single primary instance. 
- **Data replication between zones** is only required for services that perform data replication across zones. It should explain:
   - How data is replicated: synchronously, asynchronously, or some combination between the two. 
   - How data replication is performed during regular day-to-day operations - NOT during a zone failure. 

   Most Azure services replicate data across zones synchronously, which means that changes are applied to multiple (or all) zones simultaneously, and the change isn't considered to be completed until multiple/all zones have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs.

   >[!IMPORTANT]
   >The data replication approach across zones is usually different to the approach used across regions.
-->

**Example:**

> - **Traffic routing between zones:** When you configure zone redundancy on [service-name], requests are automatically spread across the instances in each availability zone. A request might go to any instance in any availability zone.

<!--

- For zonal services, explain how customers should configure their solution to route requests between the availability zones. 

-->

**Example:**

>- **Traffic routing between zones:** When you deploy multiple [service-name] resources in different availability zones, you need to decide how to route traffic between those resources. Commonly, you use a zone-redundant Azure Load Balancer to send traffic to resources in each zone.


<!--
Most Azure services replicate data across zones synchronously, which means that changes are applied to multiple (or all) zones simultaneously, and the change isn't considered to be completed until multiple/all zones have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs.

-->

**Example:**

> - **Data replication between zones:** When a client changes any data in your [service-name] resource, that change is applied to all instances in all zones simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a zone failure. Availability zones are located relatively close together, which means there's minimal effect on latency or throughput.

<!--
Alternatively, some services replicate their data asynchronously, where changes are applied in a single zone and then propagated after some time to the other zones. Use wording similar to this to explain this approach and its tradeoffs.
-->

**Example:**

> - **Data replication between zones:** When a client changes any data in your [service-name] resource, that change is applied to the primary zone. At that point, the write is considered to be complete. Later, the X resource in the secondary zone is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that hasn't been replicated between availability zones could be lost if the primary zone experiences a failure.

<!--
   Your service might behave differently to the examples provided above, so adjust or rewrite as much as you need. The accuracy and clarity of this information is critical to our customers, so please make sure you understand and explain the replication process thoroughly. 
-->

### Zone-down experience
TODO: Add your zone-down experience

<!-- 3I. Zone-down experience ------------------------------------------------------------

Explain what happens when an availability zone is down. Be precise and clear. Avoid ambiguity in this section, because customers depend on it for their planning purposes. Divide your content into the following sections. You can use the table format if your descriptions are short. Otherwise, you can use a list format.

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

<!-- 5J. Failback ----------------------------------------------------
   Explain who initiates a failback. For zonal resources, is it customer-initiated or Microsoft-initiated? Zone-redundant is always Microsoft-initiated. 
-->

**Example:**

> When the availability zone recovers, [service-name] automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.


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
 
> The Azure [service-name] platform manages traffic routing, failover, and failback for zone-redundant X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.


## Multi-region support
TODO: Add your multi-region support.

<!-- 7. Multi-region support ---------------------------------------

   This section ONLY describes native product features for multi-region support. Don't talk about patterns or approaches to create multiple instances in different regions – that's in the “Alternative multi-region approaches” section. 

   If the service has built-in multi-region support that supports resiliency requirements, describe it here. 

-->

**Example:**

>[service-name] can be configured to use multiple Azure regions. When you configure multi-region support, you select which region should be the primary region, and [service-name] automatically replicates changes in your data to each selected secondary region.

<!--

For a single-region service, which means it's regionally deployed and has no direct multi-region support, use wording like the following: 

-->

**Example:**

>[service-name] is a single-region service. If the region is unavailable, your [service-name] resource is also unavailable.


>[!IMPORTANT]
>For a single-region service, don't include the H3 headings in this section. Skip to “Alternative multi-region approaches”. 

### Region support 

<!-- 7A. Region support ----------------------
   Make it clear if multi-region support relies on Azure region pairs, or if it works across any combination of regions. Also, explain any other regional requirements, such as requiring all regions to be within the same geography, or within a defined latency perimeter. 
-->

**Example:**

> You can select any Azure region for your secondary instances.

### Requirements 

<!-- 7B. Requirements ----------------------
   List any requirements that must be met to use multiple regions with this service. Most commonly, specific SKUs are required. If multiple regions are supported in all SKUs, or if the service has only one default SKU, mention this. Also mention any other requirements that must be met. 
-->

**Example:**

> You must use the Premium tier to enable multi-region support.



### Considerations

<!-- 7C. Considerations ----------------------
   Describe any workflows or scenarios that aren't supported, as well as any gotchas. For example, some services only replicate parts of the solution across regions but not others. 

   Include information about any expected downtime or effects if you enable multi-region support after deployment. Provide links to any relevant information. 

-->

**Example:**

> When you enable multi-region support, component Z is replicated across regions, but other components aren't replicated. After a region failover, your resource continues to work, but feature A might be unavailable until the region recovers and full service is restored.


### Cost

<!-- 7D. Cost ----------------------
   Give an idea of what this does to your billing meters. For example, is there an additional charge for enabling multi-region support? Do you need to deploy additional instances of your service in each region? 

   Don't specify prices. Link to the Azure pricing information if needed. 
-->


**Example:**

> When you enable multi-region support, you're billed for each region that you select. For more information, see [service pricing information].


### Configure multi-region support 

<!-- 7E. Configure multi-region support ----------------------

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
TODO: Optional. Add information about capacity planning and management.


<!-- 7F. Capacity planning and management ----------------------
   Optional section. 

   In some services, a region failover can cause instances in the surviving regions to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->


### Normal operations 
TODO: Optional. Add information about normal operations. Break the content down into two bullets: Traffic routing between regions and data replication between regions.

<!-- 7G. Normal operations ----------------------------------------------------------
   Optional section.
   
   
   - **Traffic routing between regions**. Explains how work is divided up between instances in multiple regions, during regular day-to-day operations - NOT during a region failure. 
     - **Active/active.** Requests are spread across instances in every region, maybe using Traffic Manager or Azure Front Door behind the scenes.   
     - **Active/passive.** Requests always goes to the primary region.
     
   - **Data replication between regions** is only required for services that perform data replication across regions. It should explain:
     - How data is replicated: synchronously, asynchronously, or some combination between the two. 
     - How data replication is performed during regular day-to-day operations - NOT during a region failure. 
   
     >[!IMPORTANT]
     >The data replication approach across regions is usually different to the approach used across zones.
   -->


**Example:**

> - **Traffic routing between regions:** When you configure multi-region support, all requests are routed to an instance in the primary region. The secondary regions are used only in the event of a failover.

<!--

   Most Azure services replicate the data across regions asynchronously, where changes are applied in a single region and then propagated after some time to the other regions. Use wording similar to this to explain this approach and its tradeoffs.
-->
**Example:**

> - **Data replication between zones:** When a client changes any data in your [service-name] resource, that change is applied to the primary region. At that point, the write is considered to be complete. Later, the X resource in the secondary region is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that wasn't replicated between regions could be lost if the primary region experiences a failure.

<!--   
Alternatively, some services replicate their data synchronously which means that changes are applied to multiple (or all) regions simultaneously, and the change isn't considered to be completed until multiple/all regions have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs:
-->   

**Example:**
   
> - **Data replication between zones:** When a client changes any data in your [service-name] resource, that change is applied to all instances in all regions simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a region failure. However, because all changes have to be replicated across regions that might be geographically distant, you might experience lower throughput or performance.

<!--   
   Your service might behave differently to the examples provided above, so adjust or rewrite as much as you need. The accuracy and clarity of this information is critical to our customers, so please make sure you understand and explain the replication process thoroughly. 
-->  


### Region-down experience 

<!-- 7I. Region down experience  ----------------------

Explain what happens when a region is down. Be precise and clear. Avoid ambiguity in this section, because customers depend on it for their planning purposes. Divide your content into the following sections. You can use the table format if your descriptions are short. Alternatively, you can use a list format.

- **Detection and response** Explain who is responsible for detecting a region is down and for responding, such as by initiating a region failover. Whether your service has customer-managed failover or the service manages it itself, describe it here. 

 If your multi-region support depends on another service, commonly Azure Storage, detecting and failing over, explicitly state that, and link to the relevant reliability guide to understand the conditions under which that happens. Be careful with talking about GRS because that doesn't apply in non-paired regions, so explain how things work in that case. 
-->

**Example:**

*For customer-initiated detection:*

> [service-name] is responsible for detecting a failure in a region and automatically failing over to the secondary region.


*For service-initiated detection:*

> [service name] is responsible for detecting a failure in a region and automatically failing over to the secondary region.

*For detection that depends on another service:*

>In regions that have pairs, [service name] depends on Azure Storage geo-redundant storage for data replication to the secondary region. Azure Storage detects and initiates a region failover, but it does so only in the event of a catastrophic region loss. This action might be delayed significantly, and during that time your resource might be unavailable. For more information, see [Link to more info].

<!--
- **Notification** Explain if there's a way for a customer to find out when a region has been lost. Are there logs? Is there a way to set up an alert? 
-->

**Example:**

> To determine when a region failure occurred, see [logs/alerts/Resource Health/Service Health].

<!--
- **Active requests** Explain what happens to any active (inflight) requests.
-->

**Example:**

> Any active requests are dropped and should be retried by the client.

<!--- 
   **Expected data loss** Explain if the customer should expect any data loss during a region failover. Data loss is common during a region failover, so it's important to be clear here. 
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

<!-- 7J. Failback ----------------------------------------------------

   Explain who initiates a failback. Is it customer-initiated or Microsoft-initiated? What does failback involve?

-->

**Example:**

> When the primary region recovers, [service-name] automatically restores instances in the region, removes any temporary instances created in the other regions, and reroutes traffic between your instances as normal.


<!--
   Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation.

-->

### Testing for region failures 
<!-- 7K. Testing for region failures   ----------------------
   
   Can you trigger a fault to simulate a region failure, such as by using Azure Chaos Studio? If so, link to the specific fault types that simulate the appropriate failure. 

-->  

**Example:**

> You can simulate a region failure by using Azure Chaos Studio. Inject the XXX fault to simulate the loss of an entire region. Regularly test your responses to region failures so that you can be ready for unexpected region outages.

 <!--
   For Microsoft-managed multi-region services, is there a way for the customer to test a region failover? If that's not possible, use wording like this: 
   
 --> 

 **Example:**

> The Azure [service-name] platform manages traffic routing, failover, and failback for multi-region X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate region failure processes.


### Alternative multi-region approaches 

<!-- 7L. Alternative multi-region approaches   ----------------------
   
Optional section. 

If the service does NOT have built-in multi-region support, are there approaches or patterns we can recommend that provide multi-region failover? These must be documented in the Azure Architecture Center. You can also provide multiple approaches if required. At least one of the approaches must work in non-paired regions. 


If you need to use [service-name] in multiple regions, you need to deploy separate resources in each region. If you create an identical deployment in a secondary Azure region using a multi-region geography architecture, your application becomes less susceptible to a single-region disaster. When you follow this approach, you need to configure load balancing and failover policies. You also need to replicate your data across the regions so that you can recover your last application state. 

For example approaches that illustrates this architecture, see:

- [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](https://learn.microsoft.com/azure/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Highly available multi-region web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/multi-region)
- [Deploy Azure Spring Apps to multiple regions](https://learn.microsoft.com/azure/architecture/web-apps/spring-apps/architectures/spring-apps-multi-region)
-->  


## Backups

<!-- 8. Backups  ----------------------
Required only if the service supports backups. 

Describe any backup features the service provides. Clearly explain whether they are fully managed by Microsoft, or if customers have any control over backups. Explain where backups are stored and how they can be recovered. Note whether the backups are only accessible within the region or if they're accessible across regions, such as after a region failure. 

You must include the following caveat:
-->

> For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [link to article about how backups contribute to a resiliency strategy].

## Service-level agreement

<!-- 9. Service-level agreement (SLA)  ----------------------
   Summarize, in readable terms, the key requirements that must be met for the SLA to take effect. Do not repeat the SLA, or provide any exact wording or numbers. Instead, aim to provide a general overview of how a customer should interpret the SLA for a service, because they often are quite specific about what needs to be done for an SLA to apply. 

   The content should begin with:
--> 
  
> The service-level agreement (SLA) for [service-name] describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [link to SLA for [service-name]].
   
<!--  
   You can then list conditions here in list or table form.
-->

## Related content

<!-- 10.Related content ---------------------------------------------------------------------
Required: Include any related content that points to a relevant task to accomplish,
or to a related topic. 

- [Reliability in Azure](/azure/availability-zones/overview.md)
-->