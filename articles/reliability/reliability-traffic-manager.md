---
title: Reliability in Azure Traffic Manager
description: Learn about reliability in Azure Traffic Manager.
author: anaharris-ms
ms.author: csudrisforresiliency
ms.topic: overview
ms.custom: subject-reliability, references-regions
ms.service: traffic-manager
ms.date: 02/06/2024
---


# Reliability in Azure Traffic Manager

This article contains  [specific reliability recommendations for Azure Traffic Manager](#reliability-recommendations) as well as [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity) support for Azure Traffic Manager. 


 For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]
 
### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**Availability**](#availability) |:::image type="icon" source="media/icon-recommendation-high.svg":::| [Traffic Manager Monitor status should be Online](#-traffic-manager-monitor-status-should-be-online) |
|  |:::image type="icon" source="media/icon-recommendation-high.svg":::| [Traffic manager profiles should have more than one endpoint](#-traffic-manager-profiles-should-have-more-than-one-endpoint) |
|[**System efficiency**](#system-efficiency)|:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[TTL value of user profiles should be in 60 seconds](#-ttl-value-of-user-profiles-should-be-in-60-seconds) | 
|[**Disaster recovery**](#disaster-recovery)|:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[Configure at least one endpoint within another region](#-configure-at-least-one-endpoint-within-another-region) | 
||:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[Ensure endpoint configured to “(All World)” for geographic profiles](#-ensure-endpoint-configured-to-all-world-for-geographic-profiles) | 


### Availability
 
#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **Traffic Manager Monitor Status should be Online** 

Monitor status should be online to provide failover for the application workload. If the health of your Traffic Manager displays a **Degraded** status, then the status of one or more endpoints may also be **Degraded**. 

For more information Traffic Manager endpoint monitoring, see [Traffic Manager endpoint monitoring](/azure/traffic-manager/traffic-manager-monitoring).

To troubleshoot a degraded state on Azure Traffic Manager, see [Troubleshooting degraded state on Azure Traffic Manager](/azure/traffic-manager/traffic-manager-troubleshooting-degraded).

#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **Traffic manager profiles should have more than one endpoint** 

When configuring the Azure traffic manager, you should provision minimum of two endpoints to fail-over the workload to another instance. 

To learn about Traffic Manager endpoint types, see [Traffic Manager endpoints](/azure/traffic-manager/traffic-manager-endpoint-types).

### System Efficiency

#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **TTL value of user profiles should be in 60 seconds** 

Time to Live (TTL) affects how recent of a response a client will get when it makes a request to Azure Traffic Manager. Reducing the TTL value means that the client will be routed to a functioning endpoint faster in the case of a failover. Configure your TTL to 60 seconds to route traffic to a health endpoint as quickly as possible.

For more information on configuring DNS TTL, see [Configure DNS Time to Live](/azure/advisor/advisor-reference-performance-recommendations#configure-dns-time-to-live-to-60-seconds).

### Disaster recovery

#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **Configure at least one endpoint within another region** 

Profiles should have more than one endpoint to ensure availability if one of the endpoints fails. It is also recommended that endpoints be in different regions.

To learn about Traffic Manager endpoint types, see [Traffic Manager endpoints](/azure/traffic-manager/traffic-manager-endpoint-types).


#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **Ensure endpoint configured to “(All World)” for geographic profiles** 

For geographic routing, traffic is routed to endpoints based on defined regions. When a region fails, there is no pre-defined failover. Having an endpoint where the Regional Grouping is configured to “All (World)” for geographic profiles will avoid traffic black holing and guarantee service remains available.

To learn how to add and configure an endpoint, see [Add, disable, enable, delete, or move endpoints](/azure/traffic-manager/traffic-manager-manage-endpoints).


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Azure Traffic Manager is a DNS-based traffic load balancer that lets you  distribute traffic to your public facing applications across global Azure regions. Traffic Manager also provides your public endpoints with high availability and quick responsiveness.

Traffic Manager uses DNS to direct client requests to the appropriate service endpoint based on a traffic-routing method. Traffic manager also provides health monitoring for every endpoint. The endpoint can be any Internet-facing service hosted inside or outside of Azure. Traffic Manager provides a range of traffic-routing methods and endpoint monitoring options to suit different application needs and automatic failover models. Traffic Manager is resilient to failure, including the failure of an entire Azure region.

### Disaster recovery in multi-region geography

DNS is one of the most efficient mechanisms to divert network traffic. DNS is efficient because DNS is often global and external to the data center. DNS is also insulated from any regional or availability zone (AZ) level failures. 

There are two technical aspects towards setting up your disaster recovery architecture:

-  Using a deployment mechanism to replicate instances, data, and configurations between primary and standby environments. This type of disaster recovery can be done natively viaAzure Site Recovery, see [Azure Site Recovery Documentation](../site-recovery/index.yml) via Microsoft Azure partner appliances/services like Veritas or NetApp. 

- Developing a solution to divert network/web traffic from the primary site to the standby site. This type of disaster recovery can be achieved via [Azure DNS](reliability-dns.md), Azure Traffic Manager(DNS), or third-party global load balancers. 

This article focuses specifically on Azure Traffic Manager disaster recovery planning.

#### Outage detection, notification, and management

During a disaster, the primary endpoint gets probed and the status changes to **degraded** and the disaster recovery site remains **Online**. By default, Traffic Manager sends all traffic to the primary (highest-priority) endpoint. If the primary endpoint appears degraded, Traffic Manager routes the traffic to the second endpoint as long as it remains healthy. One can configure more endpoints within Traffic Manager that can serve as extra failover endpoints, or, as load balancers sharing the load between endpoints.


#### Set up disaster recovery and outage detection 

When you have complex architectures and multiple sets of resources capable of performing the same function, you can configure Azure Traffic Manager (based on DNS) to check the health of your resources and route the traffic from the non-healthy resource to the healthy resource.

In the following example, both the primary region and the secondary region have a full deployment. This deployment includes the cloud services and a synchronized database. 

![Diagram of automatic failover using Azure Traffic Manager.](../networking/media/disaster-recovery-dns-traffic-manager/automatic-failover-using-traffic-manager.png)

*Figure - Automatic failover using Azure Traffic Manager*

However, only the primary region is actively handling network requests from the users. The secondary region becomes active only when the primary region experiences a service disruption. In that case, all new network requests route to the secondary region. Since the backup of the database is near instantaneous, both the load balancers have IPs that can be health checked, and the instances are always up and running, this topology provides an option for going in for a low RTO and failover without any manual intervention. The secondary failover region must be ready to go-live immediately after failure of the primary region.

This scenario is ideal for the use of Azure Traffic Manager that has inbuilt probes for various types of health checks including http / https and TCP. Azure Traffic manager also has a rule engine that can be configured to fail over when a failure occurs as described below. Let’s consider the following solution using Traffic Manager:

- Customer has the Region #1 endpoint known as prod.contoso.com with a static IP as 100.168.124.44 and a Region #2 endpoint known as dr.contoso.com with a static IP as 100.168.124.43. 
-	Each of these environments is fronted via a public facing property like a load balancer. The load balancer can be configured to have a DNS-based endpoint or a fully qualified domain name (FQDN) as shown above.
-	All the instances in Region 2 are in near real-time replication with Region 1. Furthermore, the machine images are up to date, and all software/configuration data is patched and are in line with Region 1.  
-	Autoscaling is preconfigured in advance. 


**To configure the failover with Azure Traffic Manager:**

1. Create a new Azure Traffic Manager profile
    Create a new Azure Traffic manager profile with the name contoso123 and select the Routing method as Priority. 
    If you have a pre-existing resource group that you want to associate with, then you can select an existing resource group, otherwise, create a new resource group.
    
    ![Screenshot of creating Traffic Manager profile.](../networking/media/disaster-recovery-dns-traffic-manager/create-traffic-manager-profile.png)
    
    *Figure - Create a Traffic Manager profile*
    
1. Create endpoints within the Traffic Manager profile
    
    In this step, you create endpoints that point to the production and disaster recovery sites. Here, choose the **Type** as an external endpoint, but if the resource is hosted in Azure, then you can choose **Azure endpoint** as well. If you choose **Azure endpoint**, then select a **Target resource** that is either an **App Service** or a **Public IP** that is allocated by Azure. The priority is set as **1** since it's the primary service for Region 1.
    Similarly, create the disaster recovery endpoint within Traffic Manager as well.
    
    ![Screenshot of creating disaster recovery endpoints.](../networking/media/disaster-recovery-dns-traffic-manager/create-disaster-recovery-endpoint.png)
    
    *Figure - Create disaster recovery endpoints*

1. Set up health check and failover configuration

    In this step, you set the DNS TTL to 10 seconds, which is honored by most internet-facing recursive resolvers. This configuration means that no DNS resolver will cache the information for more than 10 seconds.

    For the endpoint monitor settings, the path is current set at / or root, but you can customize the endpoint settings to evaluate a path, for example, prod.contoso.com/index.
   
    The example below shows the **https** as the probing protocol. However, you can choose **http** or **tcp** as well. The choice of protocol depends upon the end application. The probing interval is set to 10 seconds, which enables fast probing, and the retry is set to 3. As a result, Traffic Manager will fail over to the second endpoint if three consecutive intervals register a failure.

    The following formula defines the total time for an automated failover:
   
    `Time for failover = TTL + Retry * Probing interval`
   
    And in this case, the value is 10 + 3 * 10 = 40 seconds (Max).
   
    If the Retry is set to 1 and TTL is set to 10 secs, then the time for failover 10 + 1 * 10 = 20 seconds.

    Set the Retry to a value greater than **1** to eliminate chances of failovers due to false positives or any minor network blips. 
    

    ![Screenshot of setting up health check.](../networking/media/disaster-recovery-dns-traffic-manager/set-up-health-check.png)
    
    *Figure - Set up health check and failover configuration*

## Next steps

- [Reliability in Azure](/azure/reliability/availability-zones-overview)

- Learn more about [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md).
- Learn more about [Azure DNS](../dns/dns-overview.md).
