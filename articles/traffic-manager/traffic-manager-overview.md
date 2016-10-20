<properties
    pageTitle="What is Traffic Manager | Microsoft Azure"
    description="This article will help you understand what Traffic Manager is, and whether it is the right traffic routing choice for your application"
    services="traffic-manager"
    documentationCenter=""
    authors="sdwheeler"
    manager="carmonm"
    editor=""
/>
<tags
    ms.service="traffic-manager"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="infrastructure-services"
    ms.date="10/11/2016"
    ms.author="sewhee"
/>

# Overview of Traffic Manager

Microsoft Azure Traffic Manager allows you to control the distribution of user traffic for service endpoints in different datacenters. Service endpoints supported by Traffic Manager include Azure VMs, Web Apps, and cloud services. You can also use Traffic Manager with external, non-Azure endpoints.

Traffic Manager uses the Domain Name System (DNS) to direct client requests to the most appropriate endpoint based on a [traffic-routing method](traffic-manager-routing-methods.md) and the health of the endpoints. Traffic Manager provides a range of traffic-routing methods to suit different application needs, endpoint health [monitoring](traffic-manager-monitoring.md), and automatic failover. Traffic Manager is resilient to failure, including the failure of an entire Azure region.

## Traffic Manager benefits

Traffic Manager can help you:

- **Improve availability of critical applications**

    Traffic Manager delivers high availability for your applications by monitoring your endpoints and providing automatic failover when an endpoint goes down.

- **Improve responsiveness for high-performance applications**

    Azure allows you to run cloud services or websites in datacenters located around the world. Traffic Manager improves application responsiveness by directing traffic to the endpoint with the lowest network latency for the client.

- **Perform service maintenance without downtime**

    You can perform planned maintenance operations on your applications without downtime. Traffic Manager directs traffic to alternative endpoints while the maintenance is in progress.

- **Combine on-premises and Cloud-based applications**

    Traffic Manager supports external, non-Azure endpoints enabling it to be used with hybrid cloud and on-premises deployments, including the "burst-to-cloud," "migrate-to-cloud," and "failover-to-cloud" scenarios.

- **Distribute traffic for large, complex deployments**

    Using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md), traffic-routing methods can be combined to create sophisticated and flexible rules to support the needs of larger, more complex deployments.

[AZURE.INCLUDE [load-balancer-compare-tm-ag-lb-include.md](../../includes/load-balancer-compare-tm-ag-lb-include.md)]

## Next Steps

- Learn more about [how Traffic Manager works](traffic-manager-how-traffic-manager-works.md).

- Learn how to develop high-availability applications using [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md).

- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager.

- [Create a Traffic Manager profile](traffic-manager-manage-profiles.md).

