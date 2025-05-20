---
title: What is load balancing and content delivery?
description: Learn about load balancing and content delivery in Azure, and the services that can help you optimize the performance and reliability of your web applications.
ms.service: azure-load-balancer
ms.topic: article
ms.date: 04/28/2025
ms.author: mbender
author: mbender-ms
ms.custom: portfolio-consolidation-2025
---

# What is load balancing and content delivery?

Load balancing and content delivery are critical components in optimizing the performance and reliability of web applications. Load balancing ensures that incoming network traffic is distributed evenly across multiple servers or services, preventing any single server from becoming overwhelmed with requests. And content delivery optimizes the delivery of content to users by caching and distributing it across multiple locations, reducing latency and improving performance. Together, these two concepts help ensure that applications are highly available, responsive, and capable of handling varying levels of traffic.

This article provides an overview of load balancing and content delivery in the context of Azure's services - Azure Application Gateway, Azure Load Balancer, and Azure Front Door. You learn about the key services and categories to help you choose the right solution for your needs.

:::image type="content" source="media/load-balancer-content-delivery-services.png" alt-text="Diagram of Azure services including application gateway, front door, and load balancer.":::

## Choosing a Solution

Choosing the right solution for load balancing and content delivery is essential to ensure the seamless operation of your web applications and services. Imagine a scenario where a global e-commerce platform needs to handle millions of users accessing products simultaneously. Or consider an internal corporate application requiring secure access for distributed teams. Each use case demands tailored solutions that balance traffic efficiently, minimize latency, and enhance security based on traffic type, availability, and cost, just to name a few. 

When selecting a load-balancing or content delivery solution, consider the following factors:

- **Traffic type**: Is it a web HTTP(S) application? Is it public facing or a private application?
- **Global vs. regional**: Do you need to load balance VMs or containers within a single virtual network, or load balance scale unit/deployments across regions, or both?
- **Availability**: What's the [service-level agreement](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) required for your solution?
- **Cost**: For more information, see [Azure pricing](https://azure.microsoft.com/pricing/). In addition to the cost of the service itself, consider the operations cost for managing a solution built on that service.
- **Features**: What features are required for your solution? For example, do you need SSL offload, URL-based routing, or web application firewall?

Azure offers several load-balancing  and content delivery services, each catering to different needs and scenarios.

## Azure Application Gateway

[Azure Application Gateway](/azure/application-gateway/overview) provides application delivery controller as a service, offering various Layer 7 load-balancing capabilities and web application firewall functionality. Use it to transition from public network space into your web servers hosted in private network space within a region.

:::image type="content" source="media/load-balancing-application-gateway-base-scenario.png" alt-text="Diagram of Azure Application Gateway routing scenario.":::

### Use Cases

- **Web traffic load balancing**: Acts as a web traffic load balancer at the application layer (OSI layer 7), making routing decisions based on HTTP request attributes like URL path or host headers.
- **SSL termination**: Offloads SSL decryption from backend servers, reducing their load and improving performance.
- **Web Application Firewall (WAF)**: Provides protection against common web vulnerabilities and attacks, such as SQL injection and cross-site scripting.
- **URL-based routing**: Routes traffic to different backend pools based on the URL, which is useful for microservices architectures.


## Azure Load Balancer

[Azure Load Balancer](/azure/load-balancer/load-balancer-overview) is a high-performance, ultra-low-latency Layer 4 load-balancing service (inbound and outbound) for all UDP and TCP protocols. Load balancer handles millions of requests per second while ensuring your solution is highly available. Load Balancer is zone redundant, ensuring high availability across availability zones. It supports both a regional deployment topology and a [global topology](/azure/load-balancer/cross-region-overview).

:::image type="content" source="media/load-balancing-load-balancer-base-scenario.png" alt-text="Diagram of Azure Load Balancer routing scenario.":::

### Use Cases

- **Distributing traffic**: Efficiently distributes incoming network traffic across a group of backend resources, such as virtual machines (VMs) or virtual machine scale sets, using a hash-based load distribution algorithm.
- **High availability**: Enhances the availability of your applications by distributing traffic within and across zones.
- **Internal or public load balancing**: Supports both internal (within a virtual network) and public (internet-facing) load balancing scenarios.
- **Low latency and high throughput**: Ideal for applications requiring low latency and high throughput, such as gaming or real-time communication apps.
- 
> [!NOTE]
> Clustering technologies, such as Azure Container Apps or Azure Kubernetes Service, contain load balancing constructs that operate mostly within the scope of their own cluster boundary, routing traffic to available application instances based on readiness and health probes. Those load balancing options aren't covered in this article.

## Azure Front Door

[Azure Front Door](/azure/frontdoor/front-door-overview) is an application delivery network that provides global load balancing and site acceleration service for web applications. It offers Layer 7 capabilities for your application like SSL offload, path-based routing, fast failover, and caching to improve performance and high availability of your applications.

:::image type="content" source="media/load-balancing-frontdoor-base-scenario.png" alt-text="Diagram of Azure Front Door routing scenario.":::

### Use cases

- **Global content delivery**: Delivers content and applications globally with low latency by using Microsoft's global edge network.
- **Application acceleration**: Improves application performance by using features like split TCP connections and anycast network.
- **Security**: Provides platform-level protection against DDoS attacks and integrates with web application firewalls for enhanced security.
- **Modern Internet-first architectures**: Supports modern architectures with dynamic, high-quality digital experiences, and automated, secure platforms.

## Combining services

These services can be used in combination to create a comprehensive load-balancing and content delivery solution that meets your specific requirements. Examples include:

- Multi-tier applications
- Global web applications with regional backend services
- E-commerce platforms
- Media streaming services

## Azure portal experience

The Azure portal provides a centralized experience for [choosing load-balancing and content delivery services](https://ms.portal.azure.com/#view/HubsExtension/AssetMenuBlade/~/overview/assetName/LoadBalancerAndContentDelivery/extensionName/Microsoft_Azure_Network). You can create and manage load balancers, application gateways, and front doors from the portal. The portal provides a guided experience for configuring the services, including setting up routing rules, health probes, and other settings.

:::image type="content" source="media/load-balance-content-delivery-portal-experience-inline.png" alt-text="Screenshot of load balancing and content delivery selection experience in Azure portal." lightbox="media/load-balance-content-delivery-portal-experience-expanded.png":::

Along with the deployment of the services, each service can be managed from the portal. You can view all of the application gateways, load balancers, and front door resources deployed in your subscription in a single view. Then you can choose the resources to manage. 

:::image type="content" source="media/manage-load-balancers-portal-experience-inline.png" alt-text="Screenshot of load balancer management in Azure portal." lightbox="media/manage-load-balancers-portal-experience-expanded.png":::

## Next steps

- [Visit the Load balancing and content delivery overview page](index.yml)
- [Review load-balancing options in Azure Architecture Center](/azure/architecture/guide/technology-choices/load-balancing-overview)
- [Create a public load balancer to load balance VMs](/azure/load-balancer/quickstart-load-balancer-standard-public-portal)
- [Configure Azure Front Door for a highly available global web application](/azure/frontdoor/quickstart-create-front-door)
- [How an application gateway works](../../application-gateway/how-application-gateway-works.md)
