---
title: Reliability in Azure API Management
description: Find out about reliability in Azure API Management, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-api-management
ms.date: 11/13/2024
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure API Management works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---



# Reliability in Azure API Management

This article describes reliability support in [Azure API Management](/azure/api-management/api-management-key-concepts), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure API Management helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. With API Management, you can create and manage modern API gateways for existing backend services hosted anywhere.

## Production deployment recommendations

- Use Premium tier with `stv2` compute platform for your API Management instance. The Premium tier provides the features you need to ensure high availability and reliability for your production workloads.

- [Enable zone redundancy](#availability-zone-support), which requires your API Management service to deploy at least one instance in each availability zone. This configuration ensures that your API Management instance is resilient to datacenter-level failures.

- In a multi-region deployment, use availability zones to improve the resilience of the primary region. You can also distribute scale units across availability zones and regions to enhance regional gateway performance.

## Transient faults 

<!-- Insert include here -->



## Availability zone support


[!INCLUDE[introduction to AZ](includes/reliability-availability-zone-description-include.md)]

Azure API Management supports availability zones in both zonal and zone-redundant configurations:

- *Zonal* The API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone that you select within an Azure region.  

    >[!NOTE] 
    >Pinning to a single zone doesn’t increase resiliency. To improve resiliency, you need to explicitly deploy resources into multiple zones (zone-redundancy). 

- *Zone-redundant* Enabling zone redundancy for an API Management instance in a supported region provides redundancy for all service components: gateway, management plane, and developer portal. Azure automatically replicates all service components across the zones that you select.

### Requirements

* Your API Management instance must be in Premium tier. To upgrade your instance to Premium tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

* If your API Management instance is deployed (injected) in an [Azure virtual network](/azure/api-management/api-management-using-with-vnet), know which version of the [compute platform is being used - `stv` or `stv2`](/azure/api-management/compute-infrastructure).


###  Region support 

To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](availability-zones-service-support.md#azure-regions-with-availability-zone-support).       


###  Considerations 

- When you enable zone redundancy in a region, consider how many API Management scale units that need to be distributed. Minimally, configure the same number of units as the number of availability zones. You must configure API Management scale units that you can distribute evenly across the zones. For example, if you configure two zones, you can configure two units, four units, or another multiple of two units.

    Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to decide the number of scale units that provide your required gateway performance. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).

- If you enable availability zones in an an API Management instance that's configured with autoscaling, you might need to adjust your autoscale settings after configuration. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones.

- When enabling zone redundancy, changes can take 15 to 45 minutes to apply. The API Management gateway can continue to handle API requests during this time.

- When you're enabling zone redundancy on an API Management instance that's deployed in an external or internal virtual network, you can optionally specify a new public IP address resource. In an internal virtual network, the public IP address is used only for management operations, not for API requests. [Learn more about IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md).


- Enabling zone redundancy or changing the zone-redundant configuration triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-the-ip-addresses).

### Cost

Adding units incurs additional costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).


### Configure availability zone support 


To enable zone redundancy for an API Management instance, see [Enable zone redundancy for an API Management instance](/azure/api-management/enable-zone-redundancy).


### Capacity planning and management 

Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to decide the number of scale units that provide your required gateway performance. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).


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


<!-- Is this true? -->

When the availability zone recovers,  API Management automatically restores instances in the availability zone and reroutes traffic between your instances as normal.


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


With a multi-region deployment, you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps to reduce any request latency that's perceived by geographically distributed API consumers. A multi-region deployment also improves service availability if one region goes offline.

When adding a region, you configure:

- The number of scale units that region will host.

- Optional [availability zones](#availability-zone-support), if that region supports it.

- [Virtual network settings](/azure/api-management/virtual-network-concepts) in the added region, if networking is configured in the existing region or regions.


### Requirements 

You must use the Premium tier to enable multi-region support.

### Region support 

You can select any Azure region for your secondary instances.

>[!Important]
>The feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo. For all other regions, customer data is stored in Geo.


### Considerations

- Only the gateway component of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the primary region, the region where you originally deployed the service.

- If you want to configure a secondary location for your API Management instance when it's deployed (injected) in a virtual network, the VNet and subnet region should match with the secondary location you're configuring. If you're adding, removing, or enabling the availability zone in the primary region, or if you're changing the subnet of the primary region, then the VIP address of your API Management instance will change. For more information, see [IP addresses of Azure API Management service](/azure/api-management/api-management-howto-ip-addresses#changes-to-the-ip-addresses). However, if you're adding a secondary region, the primary region's VIP won't change because every region has its own private VIP.

- The gateway in each region (including the primary region) has a regional DNS name that follows the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.


### Cost

Adding regions incurs additional costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure multi-region support 

To deploy an API Management instance to multi-region support, see [Deploy an Azure API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region#-deploy-api-management-service-to-an-additional-region).

To remove an API Management service region, see [Remove an Azure API Management service region](/azure/api-management/api-management-howto-deploy-multi-region#-remove-an-api-management-service-region).

### Capacity planning and management 
<!-- 6F. Capacity planning and management  ----------------------
    Optional section. 

    In some services, a region failover can cause instances in the surviving regions to become overloaded with requests. If that's a risk for your service's customers, explain that here, and whether they can mitigate that risk by overprovisioning capacity. 
-->

### Traffic routing between regions 


####  Regional backend service routing

By default, even if you've configured Azure API Management gateways in various regions, the API gateway still forward requests to the same backend service, which is deployed in only one region. In this case, the performance gain will come only from responses cached within Azure API Management in a region specific to the request; contacting the backend across the globe may still cause high latency.

You can manage regional backends and handle failover through API Management to maintain availability. For example:

- In multi-region deployments, use policies to route requests through regional gateways to regional backends.
- Configure policies to route requests conditionally to different backends if there's backend failure in a particular region.
- Use caching to reduce failing calls.

For more information on how API Management backend entities allow you to manage and apply backend properties to improve the availability of backends, see [Backends in API Management](/azure/api-management/backends).

To learn how to setup backend services in multiple regions with or without Traffic Manager, see [Route API calls to regional backend services](/azure/api-management/api-management-howto-deploy-multi-region#-route-api-calls-to-regional-backend-services).

#### Custom routing

When API Management receives public HTTP requests to the Traffic Manager endpoint (applies for the external VNet and non-networked modes of API Management), traffic is routed to a regional gateway based on lowest latency, which can reduce latency experienced by geographically distributed API consumers.  Although it isn't possible to override this setting in API Management, you can use your own Traffic Manager with custom routing rules. For more information, see [Use custom routing to API Management regional gateways](/azure/api-management/api-management-howto-deploy-multi-region#-use-custom-routing-to-api-management-regional-gateways)

However, in internal VNet mode, customers must configure their own solution to route and load-balance traffic across the regional gateways. For details, see [Networking considerations](/azure/api-management/api-management-howto-deploy-multi-region#virtual-networking).

### Data replication between regions 

Gateway configurations such as APIs and policy definitions are regularly synchronized between the primary and secondary regions you add. Propagation of updates to the regional gateways normally takes less than 10 seconds. Multi-region deployment provides availability of the API gateway in more than one region and provides service availability if one region goes offline.


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

- **Expected downtime:** If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration. 

- **Traffic rerouting:** If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.



### Failback


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

Backup and restore operations can be used for replicating API Management service configuration between operational environments, for example, development and staging. Beware that runtime data such as users and subscriptions are copied as well, which might not always be desirable.

Backup is supported in Developer, Basic, Standard, and Premium tiers.

For more information on backup in Azure API Management, see [How to implement disaster recovery using service backup and restore in Azure API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore).

## Service-level agreement

   
Azure API Management provides an SLA of 99.99% when you deploy at least one unit in two or more availability zones or regions. For more information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

>[!NOTE]
>While Azure continually strives for highest possible resiliency in SLA for the cloud platform, you must define your own target SLAs for other components of your solution.  


## Related content

- [Reliability in Azure](/azure/availability-zones/overview)