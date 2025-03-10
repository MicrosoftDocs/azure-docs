---
title: Reliability in Azure IoT Hub
description: Find out about reliability in Azure IoT Hub, including availability zones and multi-region deployments.
author: kgremban
ms.author: kgremban
ms.topic: reliability-article #Required
ms.custom: subject-reliability, references_regions #Required  - use references_regions if specific regions are mentioned.
ms.service: azure-iot-hub
ms.date: 02/20/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure IoT Hub works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 

---

# Reliability in Azure IoT Hub

This article describes reliability support in Azure IoT Hub, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

Depending on the uptime goals you define for your IoT solutions, you should determine which of the options outlined in this article best suit your business objectives. Incorporating any of these high availability (HA) and disaster recovery (DR) alternatives into your IoT solution requires a careful evaluation of the trade-offs between the:

* Level of resiliency you require
* Implementation and maintenance complexity
* COGS impact

## Production deployment recommendations

<!-- 3. Production deployment recommendations ---------------------------------------------------------

    This section opens with an include that contains a brief explanation of production deployment recommendations such as SKUs and whether to enable zone redundancy in all production environments.
-->


## Redundancy

<!-- 4. Redundancy [Optional]  ---------------------------------------------------------

    This section is generally for database and storage services.  Describe how your service achieves redundancy by default in the primary region. Describe how it protects against data loss in the case of a data center outage or power failure.
-->

The IoT Hub service provides intra-region high availability (HA) by implementing redundancies in almost all layers of the service. The [SLA published by the IoT Hub service](https://azure.microsoft.com/support/legal/sla/iot-hub) is achieved by making use of these redundancies. No extra steps are required to take advantage of these HA features.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

<!-- 5. Transient faults  ---------------------------------------------------------

    And then provide any service-specific guidance on transient faults.
  
    If your service hosts the customer's code or applications, it might also be capable of causing or propagating transient faults. If you have guidance to help to avoid these situations, provide it here. For example, App Service supports deployment slots, which avoid application downtime during deployments. 
-->

Although IoT Hub offers a reasonably high uptime guarantee, transient failures can still be expected as with any distributed computing platform. If you're just getting started with migrating your solutions to the cloud from an on-premises solution, your focus needs to shift from optimizing "mean time between failures" to "mean time to recover". In other words, transient failures are to be considered normal while operating with the cloud in the mix. Appropriate [retry patterns](../iot/concepts-manage-device-reconnections.md#retry-patterns) must be built in to the components interacting with a cloud application to deal with transient failures.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

IoT Hub is zone redundant, which means your resources are spread across three availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads.

Availability zones provide two advantages for IoT hub: data resiliency and smoother deployments.

*Data resiliency* comes from replacing the underlying storage services with availability-zones-supported storage. Data resilience is important for IoT solutions because these solutions often operate in complex, dynamic, and uncertain environments where failures or disruptions can have significant consequences. Whether an IoT solution supports a manufacturing floor, retail or restaurant environments, healthcare systems, or infrastructure, the availability and quality of data is necessary to recover from failures and to provide reliable and consistent services.

*Smoother deployments* come from replacing the underlying data center hardware with newer hardware that supports availability zones. These hardware improvements minimize customer impact from device disconnects and reconnects as well as other deployment-related downtime. The IoT Hub engineering team deploys multiple updates to each IoT hub every month, for both security reasons and to provide feature improvements. Availability-zones-supported hardware is split into 15 update domains so that each update goes smoother, with minimal impact to your workflows. For more information about update domains, see [Availability sets](/azure/virtual-machines/availability-set-overview).

### Region support

Availability zone support for IoT Hub is enabled automatically for new IoT Hub resources created in the following Azure regions:

| Region | Data resiliency | Smoother deployments |
| ------ | --------------- | ------------ |
| Australia East | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Brazil South | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Canada Central | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Central India | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Central US | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| East US | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| France Central | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Germany West Central | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Japan East | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Korea Central | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| North Europe  | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Norway East | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Qatar Central | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Southcentral US | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| Southeast Asia  | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| UK South | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| West Europe | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| West US 2 | :::image type="icon" source="./media/yes-icon.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |
| West US 3 | :::image type="icon" source="./media/icon-unsupported.svg"::: | :::image type="icon" source="./media/yes-icon.svg"::: |

### Requirements

Availability zone support for IoT Hub is enabled automatically for all tiers new IoT Hub resources.

### Data replication between zones
TODO: Add your data replication between zones

<!-- 5H. Data replication between zones ------------------------------------------
    
Optional section.  

This section is only required for services that perform data replication across zones.  

This section explains how data is replicated: synchronously, asynchronously, or some combination between the two. 

This section should describe how data replication is performed during regular day-to-day operations - NOT during a zone failure.  

-->

<!--
Most Azure services replicate data across zones synchronously, which means that changes are applied to multiple (or all) zones simultaneously, and the change isn't considered to be completed until multiple/all zones have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs.

-->

**Example:**

> When a client changes any data in your IoT Hub resource, that change is applied to all instances in all zones simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a zone failure. Availability zones are located relatively close together, which means there's minimal effect on latency or throughput.

<!--
Alternatively, some services replicate their data asynchronously, where changes are applied in a single zone and then propagated after some time to the other zones. Use wording similar to this to explain this approach and its tradeoffs.
-->

**Example:**

> When a client changes any data in your IoT Hub resource, that change is applied to the primary zone. At that point, the write is considered to be complete. Later, the X resource in the secondary zone is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that hasn't been replicated between availability zones could be lost if the primary zone experiences a failure.

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
> The IoT Hub platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

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
> When a zone is unavailable, IoT Hub detects the loss of the zone and creates new instances in another availability zone. Then, any new requests are automatically spread across all active instances.


### Failback
TODO: Add your failback

<!-- 5J. Failback  ----------------------------------------------------
    Explain who initiates a failback. For zonal resources, is it customer-initiated or Microsoft-initiated? Zone-redundant is always Microsoft-initiated. 
-->

**Example:**

> When the availability zone recovers,  IoT Hub  automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.


<!--
    Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation. (Most services don't require this section because data inconsistency isn't possible between availability zones.) 

-->

### Testing for zone failures  

Azure IoT Hub manages traffic routing, failover, and failback for zone failures. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Azure IoT Hub uses [Azure region pairs](../reliability/regions-paired.md) to provide resiliency in the rare situation where a datacenter experiences extended outages. The recovery options available in such a situation are [Microsoft-initiated failover](#microsoft-initiated-failover) and [manual failover](#manual-failover) from the IoT hub's primary region to its geo-paired region. The fundamental difference between the two is that Microsoft initiates the former and the user initiates the latter. Also, manual failover provides a lower recovery time objective (RTO) compared to the Microsoft-initiated failover option.

Here's a summary of the HA/DR options presented in this article that can be used as a frame of reference to choose the right option that works for your solution.

| HA/DR option | Recovery time | Requires manual intervention? | Implementation complexity | Cost impact|
| --- | --- | --- | --- | --- |
| Microsoft-initiated failover |2 - 26 hours|No|None|None|
| Manual failover |10 min - 2 hoursYes|Very low. You only need to trigger this operation from the portal.|None|
| Cross region HA |< 1 min|No|High|> 1x the cost of 1 IoT hub|

### Region support 

Failover is available in all regions that Azure IoT Hub supports. Only users deploying IoT hubs to the Brazil South and Southeast Asia (Singapore) regions can opt out of Microsoft-initiated failover. For more information, see [Disable disaster recovery](../iot-hub/iot-hub-ha-dr.md#disable-disaster-recovery).

>[!NOTE]
>Azure IoT Hub doesn't store or process customer data outside of the geography where you deploy the service instance. For more information, see [Azure region pairs](../reliability/regions-paired.md).

### Requirements 

Failover is available for all IoT hub tiers.

### Considerations

<!-- 7C. Considerations ----------------------
    Describe any workflows or scenarios that aren't supported, as well as any gotchas. For example, some services only replicate parts of the solution across regions but not others. 

    Include information about any expected downtime or effects if you enable multi-region support after deployment. Provide links to any relevant information. 

-->

Azure IoT Hub failover options offer the following recovery point objectives:

| Data type | Recovery point objectives (RPO) |
| --- | --- |
| Identity registry |0-5 mins data loss |
| Device twin data |0-5 mins data loss |
| Cloud-to-device messages<sup>1</sup> |0-5 mins data loss |
| Parent<sup>1</sup> and device jobs |0-5 mins data loss |
| Device-to-cloud messages |All unread messages are lost |
| Cloud-to-device feedback messages |All unread messages are lost |

<sup>1</sup>Cloud-to-device messages and parent jobs aren't recovered as a part of manual failover.

#### Microsoft-initiated failover

Microsoft-initiated failover is exercised by Microsoft in rare situations to fail over all of the IoT hubs from an affected region to the corresponding geo-paired region. This process is a default option and requires no intervention from the user. Microsoft reserves the right to make a determination of when this option will be exercised. This mechanism doesn't involve a user consent before the user's hub is failed over. Microsoft-initiated failover has a recovery time objective (RTO) of 2-26 hours.

The large RTO is because Microsoft must perform the failover operation on behalf of all the affected customers in that region. If you're running a less critical IoT solution that can sustain a downtime of roughly a day, it's ok for you to take a dependency on this option to satisfy the overall disaster recovery goals for your IoT solution. The total time for runtime operations to become fully operational once this process is triggered is described in the "Time to recover" section.

#### Manual failover

If your business uptime goals aren't satisfied by the RTO that Microsoft initiated failover provides, consider using manual failover to trigger the failover process yourself. The RTO using this option could be anywhere between 10 minutes to a couple of hours. The RTO is currently a function of the number of devices registered against the IoT hub instance being failed over. You can expect the RTO for a hub hosting approximately 100,000 devices to be in the ballpark of 15 minutes. The total time for runtime operations to become fully operational once this process is triggered, is described in the "Time to recover" section.

The manual failover option is always available for use whether the primary region is experiencing downtime or not. Therefore, this option could be used to perform planned failovers. One example usage of planned failovers is to perform periodic failover drills. However, even a planned failover operation results in downtime for the IoT hub, and also results in data loss as defined by the previous table. You could consider setting up a test IoT hub instance to exercise the planned failover option periodically to gain confidence in your ability to get your end-to-end solutions up and running when a real disaster happens.

For step-by-step instructions, see [Tutorial: Perform manual failover for an IoT hub](tutorial-manual-failover.md)

### Configure multi-region support

<!-- 7E. Configure multi-region support  ----------------------

    In this section, link to deployment or migration guides. If you don't have the required guide, you'll need to create one.

    DO NOT provide detailed how-to guidance in this article.
    
    Provide links to documents that show how to create a resource or instance with multi-region support. Ideally, the documents should contain examples using the Azure portal, Azure CLI, Azure PowerShell, and Bicep. 
-->   

<!--   
    If your service does NOT support enabling multi-region support after deployment, add an explicit statement to indicate that. 
    
    If your service supports disabling multi-region support, provide links to the relevant how-to guides for that scenario. 
-->

### Capacity planning and management 
<!-- 7F. Capacity planning and management  ----------------------
    Optional section. 

    In some services, a region failover can cause instances in the surviving regions to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->

### Traffic routing between regions 
<!-- 7G. Traffic routing between regions  ----------------------
    
    This section explains how work is divided up between instances in multiple regions, during regular day-to-day operations - NOT during a region failure. 

    Common approaches are:
    
    - **Active/active.**  Requests are spread across instances in every region, maybe using Traffic Manager or Azure Front Door behind the scenes.
    
    - **Active/passive.** Requests always goes to the primary region.
-->   

**Example:**

> When you configure multi-region support, all requests are routed to an instance in the primary region. The secondary regions are used only in the event of a failover.

### Data replication between regions 

<!-- 7H. Data replication between regions  ----------------------
    

    Optional section. 

    This section is only required for services that perform data replication across regions. 
    
    This section explains how data is replicated: synchronously, asynchronously, or some combination between the two.
    
    This section should describe how data replication is performed during regular day-to-day operations - NOT during a region failure. 

    Note - the data replication approach across regions is usually different from the approach used across availability zones.

    Most Azure services replicate the data across regions asynchronously, where changes are applied in a single region and then propagated after some time to the other regions. Use wording similar to this to explain this approach and its tradeoffs:
-->      

**Example:**

> When a client changes any data in your IoT Hub resource, that change is applied to the primary region. At that point, the write is considered to be complete. Later, the X resource in the secondary region is automatically updated with the change. This approach is called *asynchronous replication.* Asynchronous replication ensures high performance and throughput. However, any data that wasn't replicated between regions could be lost if the primary region experiences a failure.

<!--     
    Alternatively, some services replicate their data synchronously which means that changes are applied to multiple (or all) regions simultaneously, and the change isn't considered to be completed until multiple/all regions have acknowledged the change. Use wording similar to the following to explain this approach and its tradeoffs:
-->    

**Example:**
    
> When a client changes any data in your IoT Hub resource, that change is applied to all instances in all regions simultaneously. This approach is called *synchronous replication.* Synchronous replication ensures a high level of data consistency, which reduces the likelihood of data loss during a region failure. However, because all changes have to be replicated across regions that might be geographically distant, you might experience lower throughput or performance.

<!--     
    Your service might behave differently to the examples provided above, so adjust or rewrite as much as you need. The accuracy and clarity of this information is critical to our customers, so please make sure you understand and explain the replication process thoroughly. 
-->   


### Region-down experience 

<!-- 7I. Region down experience   ----------------------

Explain what happens when a region is down. Be precise and clear. Avoid ambiguity in this section, because customers depend on it for their planning purposes. Divide your content into the following sections. You can use the table format if your descriptions are short. Alternatively, you can use a list format.

- **Detection and response** Explain who is responsible for detecting a region is down and for responding, such as by initiating a region failover. Whether your service has customer-managed failover or the service manages it itself, describe it here. 

  If your multi-region support depends on another service, commonly Azure Storage, detecting and failing over, explicitly state that, and link to the relevant reliability guide to understand the conditions under which that happens. Be careful with talking about GRS because that doesn't apply in non-paired regions, so explain how things work in that case. 
-->

**Example:**

*For customer-initiated detection:*

> IoT Hub is responsible for detecting a failure in a region and automatically failing over to the secondary region.


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

> Your IoT Hub resource might be unavailable for approximately 2 to 5 minutes during the region failover process.

<!--
    - **Traffic rerouting** Explain how the platform recovers, including how traffic is rerouted to the surviving region. If appropriate, explain how customers should reroute traffic after a region is lost. 
-->

**Example:**
> When a region failover occurs, IoT Hub updates DNS records to point to the secondary region. All subsequent requests are sent to the secondary region.

### Failback
TODO: Add your failback

<!-- 7J. Failback  ----------------------------------------------------

    Explain who initiates a failback. Is it customer-initiated or Microsoft-initiated? What does failback involve?

-->

**Example:**

> When the primary region recovers, IoT Hub  automatically restores instances in the region, removes any temporary instances created in the other regions, and reroutes traffic between your instances as normal.


<!--
    Optional: If there is any possibility of data synchronization issues or inconsistencies during failback, explain that here, as well as what customers can/should do to resolve the situation.

-->

### Testing for region failures  
<!-- 7K. Testing for region failures    ----------------------
    
    Can you trigger a fault to simulate a region failure, such as by using Azure Chaos Studio? If so, link to the specific fault types that simulate the appropriate failure. 

-->   

**Example:**

> You can simulate a region failure by using Azure Chaos Studio. Inject the XXX fault to simulate the loss of an entire region. Regularly test your responses to region failures so that you can be ready for unexpected region outages.

 <!--
    For Microsoft-managed multi-region services, is there a way for the customer to test a region failover? If that's not possible, use wording like this: 
    
 --> 

 **Example:**

> The Azure IoT Hub platform manages traffic routing, failover, and failback for multi-region X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate region failure processes.


### Alternative multi-region approaches 

<!-- 7L. Alternative multi-region approaches    ----------------------
    
Optional section. 

If the service does NOT have built-in multi-region support, are there approaches or patterns we can recommend that provide multi-region failover? These must be documented in the Azure Architecture Center. You can also provide multiple approaches if required. At least one of the approaches must work in non-paired regions. 


If you need to use IoT Hub in multiple regions, you need to deploy separate resources in each region. If you create an identical deployment in a secondary Azure region using a multi-region geography architecture, your application becomes less susceptible to a single-region disaster. When you follow this approach, you need to configure load balancing and failover policies. You also need to replicate your data across the regions so that you can recover your last application state. 

For example approaches that illustrates this architecture, see:

- [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](https://learn.microsoft.com/azure/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Highly available multi-region web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/multi-region)
- [Deploy Azure Spring Apps to multiple regions](https://learn.microsoft.com/azure/architecture/web-apps/spring-apps/architectures/spring-apps-multi-region)
-->   


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
   
> The service-level agreement (SLA) for IoT Hub describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [link to SLA for IoT Hub].
    
<!--   
    You can then list conditions here in list or table form.
-->

## Related content

<!-- 10.Related content ---------------------------------------------------------------------
Required: Include any related content that points to a relevant task to accomplish,
or to a related topic. 

- [Reliability in Azure](/azure/availability-zones/overview.md)
-->