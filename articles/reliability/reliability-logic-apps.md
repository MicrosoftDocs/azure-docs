---
title: Reliability in Azure Logic Apps
description: Learn about reliability in Azure Logic Apps, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
services: logic-apps
ms.service: azure-logic-apps
ms.date: 11/08/2024
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Logic Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.

---


# Reliability in Azure Logic Apps


This article describes reliability support in Azure Logic Apps, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure Logic Apps is a cloud platform where you can create and run automated workflows with little to no code. By using the visual designer and selecting from prebuilt operations, you can quickly build a workflow that integrates and manages your apps, data, services, and systems.


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



### Requirements

To enable zone redundancy for your logic app, you must use make sure that you meet the following requirements:

- The region must support availability zones. To see which regions support availability zones, see [Azure regions that support availability zones](availability-zones-service-support#azure-regions-with-availability-zone-support).


###  Considerations 

<!-- may need some more clarity on this -->
Zone redundancy is available only for built-in connectors, which are designed to run directly and natively inside Azure Logic Apps runtime. Zone redundancy isn't available for managed Azure-hosted connector operations. For more information on connector types, see [Built-in connectors versus managed connectors](/azure/connectors/introduction#built-in-connectors-versus-managed-connectors).


### Cost

| Logic app workflow | Hosting option | Description |
|-----------|----------------|-------------|
| Consumption | Multitenant | No additional cost applies to use zone redundancy, which is automatically enabled for new and existing Consumption workflows. |
| Standard | Workflow Service Plan | No additional cost applies to use zone redundancy. |
| Standard | App Service Environment V3 | See [Reliability in App Service](./reliability-app-service.md). |


### Configure availability zone support 

**Create a new workflow with zone-redundancy.** Consumption logic apps support zone redundancy automatically, so no configuration is required. To enable zone-redundancy for Standard logic apps, see [Enable zone redundancy for your logic app](../logic-apps/set-up-zone-redundancy-availability-zones.md).

**Migration.** It's not possible to enable zone-redundancy to an existing workflow after it's created. Instead, you need to create the Azure Logic App workflow in the new region and delete the old one.

<!-- is this true? -->
**Disable zone redundancy.** If you need to disable zone redundancy for a logic app, you can't do this after the logic app is created. Instead, you need to create a new logic app in the same region without zone redundancy enabled.


### Zone-down experience

The Logic Apps platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.


### Failback

<!-- is this true? -->
When the availability zone recovers, Logic Apps automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.


### Testing for zone failures  

<!-- is this true? -->
The Azure Logic Apps platform manages traffic routing, failover, and failback for zone-redundant X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.


## Multi-region support 


Each logic app is deployed into a single Azure region. If the region becomes unavailable, your logic app is also unavailable.

For higher resiliency, you can setup your primary logic app to failover to either a standby or backup logic app in an another (secondary) region.


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