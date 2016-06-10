<properties 
   pageTitle="What is Traffic Manager | Microsoft Azure"
   description="This article will help you understand what Traffic Manager is, and whether it is the right traffic routing choice for your application"
   services="traffic-manager"
   documentationCenter=""
   authors="jtuliani"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/09/2016"
   ms.author="jtuliani" />

# What is Traffic Manager?

Microsoft Azure Traffic Manager allows you to control the distribution of user traffic to your service endpoints running in different datacenters around the world.

Service endpoints supported by Traffic Manager include Azure VMs, Web Apps and cloud services. You can also use Traffic Manager with external, non-Azure endpoints.

Traffic Manager works by using the Domain Name System (DNS) to direct end-user requests to the most appropriate endpoint, based on the configured traffic-routing method and current view of endpoint health.  Clients then connect to the appropriate service endpoint directly.

Traffic Manager supports a [range of traffic-routing methods](traffic-manager-routing-methods.md) to suit different application needs.  Traffic Manager provides [endpoint health checks and automatic endpoint failover](traffic-manager-monitoring.md), enabling you to build high-availability applications that are resilient to failure, including the failure of an entire Azure region.

## Traffic Manager benefits

Traffic Manager can help you:

- **Improve availability of critical applications** – Traffic Manager allows you to deliver high availability for your critical applications by monitoring your endpoints in Azure and providing automatic failover when an endpoint goes down.
- **Improve responsiveness for high performance applications** – Azure allows you to run cloud services or websites in datacenters located around the world. Traffic Manager can improve the responsiveness of your applications by directing end-users to the endpoint with the lowest network latency from the client.
- **Upgrade and perform service maintenance without downtime** – You can seamlessly carry out upgrade and other planned maintenance operations on your applications without downtime for end users by using Traffic Manager to direct traffic to alternative endpoints when maintenance is in progress.
- **Combine on-premises and Cloud-based applications** – Traffic Manager supports external, non-Azure endpoints enabling it to be used with hybrid cloud and on-premises deployments, including the “burst-to-cloud,” “migrate-to-cloud,” and “failover-to-cloud” scenarios.
- **Distribute traffic for large, complex deployments** – Traffic-routing methods can be combined using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md) to create sophisticated and flexible traffic-routing configurations to meet the needs of larger, more complex deployments. 

[AZURE.INCLUDE [load-balancer-compare-tm-ag-lb-include.md](../../includes/load-balancer-compare-tm-ag-lb-include.md)]

## Next Steps

- Learn more about [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md).

- Learn how to develop high-availability applications using [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md).

- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager.

- [Create a Traffic Manager profile](traffic-manager-manage-profiles.md).
 
