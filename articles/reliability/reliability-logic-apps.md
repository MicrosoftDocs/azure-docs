---
title: Reliability in Azure Logic Apps
description: Learn about reliability in Azure Logic Apps, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
services: logic-apps
ms.service: azure-logic-apps
ms.date: 11/06/2024
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Logic Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.

---


# Reliability in Azure Logic Apps


This article describes reliability support in Azure Logic Apps, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure Logic Apps is a cloud platform where you can create and run automated workflows with little to no code. By using the visual designer and selecting from prebuilt operations, you can quickly build a workflow that integrates and manages your apps, data, services, and systems.

Azure Logic Apps simplifies the way that you connect legacy, modern, and cutting-edge systems across cloud, on premises, and hybrid environments. You can use low-code-no-code tools to develop highly scalable integration solutions that support your enterprise and business-to-business (B2B) scenarios.


## Production deployment recommendations

<!-- 3. Production deployment recommendations ---------------------------------------------------------

    This section opens with an include that contains a brief explanation of production deployment recommendations such as SKUs and whether to enable zone redundancy in all production environments.
-->

## Transient faults 

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.


## Availability zone support

You can set up zone redundancy for Azure Logic Apps to spread resources across multiple [availability zones](../reliability/availability-zones-overview.md). When you distribute logic app workload resources across availability zones, you improve resiliency and reliability for your production logic app workloads.


The following logic app workflows support zone redundancy:

| Logic app workflow | Hosting option | Description |
|-----------|----------------|-------------|
| Consumption | Multitenant | Zone redundancy is automatically enabled for new and existing Consumption logic app workflows. |
| Standard | Workflow Service Plan | See [Reliability in Azure Functions](reliability-functions?tabs=azure-portal#availability-zone-support).|
| Standard | App Service Environment V3 | See [Reliability in App Service](./reliability-app-service.md). |


Zone redundancy is available only for built-in operations, which directly run with the Azure Logic Apps runtime. Zone redundancy isn't available for managed Azure-hosted connector operations.
    

### Requirements

To enable zone redundancy for your logic app, you must use make sure that you meet the following requirements:

- The region must support availability zones. To see which regions support availability zones, see [Azure regions that support availability zones](availability-zones-service-support#azure-regions-with-availability-zone-support).


###  Considerations 

TODO:   Considerations 

<!-- 5C.  Considerations   --------------------------------------------------------------
    Describe any workflows or scenarios that aren't supported, as well as any gotchas. For example, some zone-redundant services only replicate parts of the solution across availability zones but not others. Provide links to any relevant information. 
-->


### Cost

| Logic app workflow | Hosting option | Description |
|-----------|----------------|-------------|
| Consumption | Multitenant | No additional cost applies to use zone redundancy, which is automatically enabled for new and existing Consumption workflows. |
| Standard | Workflow Service Plan | No additional cost applies to use zone redundancy. |
| Standard | App Service Environment V3 | See [Reliability in App Service](./reliability-app-service.md). |


For Standard hosting plans with App Service Environment v3, see [Reliability in App Service](./reliability-app-service.md).


### Configure availability zone support 

**Create a new workflow with zone-redundancy.** When you deploy a new Azure Logic App workflow in a region that supports availability zones, you can choose whether you'd like to enable zone redundancy. To learn how to enable zone redundancy for your logic app, see [Enable zone redundancy for your logic app](../logic-apps/set-up-zone-redundancy-availability-zones.md).

**Migration.** It's not possible to enable zone-redundancy to an existing workflow after it's created. Instead, you need to create the Azure Logic App workflow in the new region and delete the old one.

<!-- is this true? -->
**Disable zone redundancy.** If you need to disable zone redundancy for a logic app, you can't do this after the logic app is created. Instead, you need to create a new logic app in the same region without zone redundancy enabled.


### Capacity planning and management 


<!-- 5F. Capacity planning and management  ---------------------------------------------------------------
    Optional section. In some services, a zone failover can cause instances in the surviving zones to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->

### Traffic routing between zones



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


Each logic app is deployed into a single Azure region. If the region becomes unavailable, your logic app is also unavailable.

For higher resiliency, you can setup your primary logic app to failover to either a standby or backup logic app in an another (secondary) region.


### Requirements 

- The secondary logic app instance has access to the same apps, services, and systems as the primary logic app instance.

- Both logic app instances must have the same host type. So, both instances are deployed to regions in global multitenant Azure Logic Apps or regions in single-tenant Azure Logic Apps. For best practices and more information about paired regions for BCDR, see [Cross-region replication in Azure: Business continuity and disaster recovery](cross-region-replication-azure.md).


>[!NOTE]
>If your logic app also works with B2B artifacts, such as trading partners, agreements, schemas, maps, and certificates, which are stored in an integration account, both your integration account and logic apps must use the same location.


### Region support 

The secondary region must support Azure Logic Apps service, as well as the same features and services that your primary logic app uses. To see if your secondary region supports Logic Apps service, see [Azure product availability by region](https://azure.microsoft.comexplore/global-infrastructure/products-by-region).

### Considerations

- When your logic app is triggered and starts running, the app's state is stored in the same region where the app started and is non-transferable to another region. If a regional failure or disruption happens, any in-progress workflow instances are abandoned. When you have primary and secondary region set up, new workflow instances start running at the secondary location.

    To minimize the number of abandoned in-progress workflow instances, you can choose to implement one of the various message patterns. For more information, see [Reduce abandoned in-progress instances](/azure/logic-apps/business-continuity-disaster-recovery-guidance#reduce-abandoned-in-progress-instances).

- A logic app's execution history is stored in the same region where that logic app ran, which means you can't migrate this history to a different region. If your primary instance fails over to a secondary instance, you can only access each instance's trigger and runs history in the respective regions where those instances ran. However, you can get region-agnostic information about your logic app's history by setting up your logic apps to send diagnostic events to an Azure Log Analytics workspace. You can then review the health and history across logic apps that run in multiple regions. For more information on how to set up trigger and runs history in the secondary region, see [Trigger type guidance](/azure/logic-apps/business-continuity-disaster-recovery-guidance#trigger-type-guidance).


### Cost

<!-- 6D. Cost ----------------------
    Give an idea of what this does to your billing meters. For example, is there an additional charge for enabling multi-region support? Do you need to deploy additional instances of your service in each region? 

    Don't specify prices. Link to the Azure pricing information if needed. 

    If there is no cost difference between zone-redundant and zonal services, state that here.
-->


**Example:**

> When you enable multi-region support, you're billed for each region that you select. For more information, see [service pricing information].


 
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


### Testing for region failures  
<!-- 6J. Testing for region failures    ----------------------
    
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

To ensure that your logic app becomes less susceptible to a single-region failure, you'll need to deploy your logic app to a secondary region. To learn how to deploy your logic app to a secondary region, see [Business continuity and disaster recovery for Azure Logic Apps](/azure/logic-apps/business-continuity-disaster-recovery-guidance#deploy-your-logic-app-to-a-secondary-region).

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