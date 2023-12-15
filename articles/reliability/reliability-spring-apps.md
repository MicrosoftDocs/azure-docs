---
title: Reliability in Azure Spring Apps
description: Learn about reliability in Azure Spring Apps.
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability, references.regions
ms.service: spring-apps
ms.date: 10/17/2023
---


# Reliability in Azure Spring Apps

This article contains detailed information on regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity) support for Azure Spring Apps. 


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Spring Apps supports zone-redundancy. When you create an Azure Spring Apps service instance with zone-redundancy enabled, Azure Spring Apps automatically distributes fundamental resources across logical sections of underlying Azure infrastructure. The underlying compute resource distributes VMs across all availability zones to ensure the ability to compute. The underlying storage resource replicates data across availability zones to keep it available even if there are datacenter failures. This distribution provides a higher level of availability and protects against hardware failures or planned maintenance events.   

### Prerequisites

- Zone-redundancy isn't available in the Basic plan.

- Azure Spring Apps supports availability zones in the following regions:
    
    - Australia East
    - Brazil South
    - Canada Central
    - Central US
    - East Asia
    - East US
    - East US 2
    - France Central
    - Germany West Central
    - North Europe
    - Japan East
    - Korea Central
    - South Africa North
    - South Central US
    - Southeast Asia
    - UK South
    - West Europe
    - West US 2
    - West US 3


### Create an Azure Spring Apps instance with availability zones enabled

> [!NOTE]
> You can enable zone-redundancy only when creating your Azure Spring Apps service instance. You can't change the zone-redundancy property after creation.

You can enable zone-redundancy in Azure Spring Apps using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure portal](https://portal.azure.com).

# [Azure CLI](#tab/azure-cli)

To create a service in Azure Spring Apps with zone-redundancy enabled using the Azure CLI, include the `--zone-redundant` parameter when you create your service, as shown in the following example:

```azurecli
az spring create \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Apps-instance-name> \
    --location <location> \
    --zone-redundant true
```

# [Azure portal](#tab/portal)

To create a service in Azure Spring Apps with zone-redundancy enabled using the Azure portal, select the **Zone Redundant** option when you create the instance.

:::image type="content" source="../spring-apps/media/how-to-enable-redundancy-and-disaster-recovery/availability-zone-portal.png" alt-text="Screenshot of the Azure portal Create page showing the Zone Redundant option." lightbox="../spring-apps/media/how-to-enable-redundancy-and-disaster-recovery/availability-zone-portal.png":::

---

### Enable your own resource with availability zones enabled

You can enable your own resource in Azure Spring Apps, such as your own persistent storage. However, you must make sure to enable zone-redundancy for your resource. For more information, see [How to enable your own persistent storage in Azure Spring Apps](../spring-apps/how-to-custom-persistent-storage.md).

### Zone down experience

When an app instance fails because it’s located on a VM node in a failed zone, Azure Spring Apps creates a new app instance for the failed app on another VM node in another availability zone. Users may experience a brief interruption during this time. No user action is required and the impacted Azure Spring Apps instance will be restored by the service.

### Pricing

There's no extra cost associated with enabling zone-redundancy. You only need to pay for the Standard or Enterprise plan, which is required to enable zone-redundancy.


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

The Azure Spring Apps service doesn't provide geo-disaster recovery, but careful planning can help protect you from experiencing downtime.

To ensure high availability and protection from disasters, deploy your applications hosted in Azure Spring Apps to multiple regions. Azure provides a list of [paired regions](cross-region-replication-azure.md#azure-paired-regions) so that you can plan your app deployments accordingly.

 Consider the following key factors when you design your architecture:

- **Region availability.** To minimize network lag and transmission time, choose a region that supports Azure Spring Apps zone-redundancy, or a geographic area close to your users.
- **Azure paired regions.** To ensure coordinated platform updates and prioritized recovery efforts if needed, choose paired regions within your chosen geographic area.
- **Service availability.** Decide whether your paired regions should run hot/hot, hot/warm, or hot/cold.

### Use Azure Traffic Manager to route traffic

Azure Traffic Manager provides DNS-based traffic load balancing and can distribute network traffic across multiple regions. Use Azure Traffic Manager to direct customers to the closest Azure Spring Apps service instance. For best performance and redundancy, direct all application traffic through Azure Traffic Manager before sending it to your Azure Spring Apps service instance. For more information, see [What is Traffic Manager?](../traffic-manager/traffic-manager-overview.md)

If you have applications in Azure Spring Apps running in multiple regions, Azure Traffic Manager can control the flow of traffic to your applications in each region. Define an Azure Traffic Manager endpoint for each service instance using the instance IP. You should connect to an Azure Traffic Manager DNS name pointing to the Azure Spring Apps service instance. Azure Traffic Manager load balances traffic across the defined endpoints. If a disaster strikes a data center, Azure Traffic Manager directs traffic from that region to its pair, ensuring service continuity.

Use the following steps to create an Azure Traffic Manager instance for Azure Spring Apps instances:

1. Create Azure Spring Apps instances in two different regions. For example, create service instances in East US and West Europe, as shown in the following table. Each instance serves as a primary and fail-over endpoint for traffic.

   | Service name     | Location    | Application                              |
   |------------------|-------------|------------------------------------------|
   | service-sample-a | East US     | gateway / auth-service / account-service |
   | service-sample-b | West Europe | gateway / auth-service / account-service |

1. Set up a custom domain for the service instances. For more information, see [Tutorial: Map an existing custom domain to Azure Spring Apps](../spring-apps/how-to-custom-domain.md). After successful setup, both service instances will bind to the same custom domain, such as `bcdr-test.contoso.com`.

1. Create a traffic manager and two endpoints. For instructions, see [Quickstart: Create a Traffic Manager profile using the Azure portal](../traffic-manager/quickstart-create-traffic-manager-profile.md), which produces the following Traffic Manager profile:

   - Traffic Manager DNS Name: `http://asa-bcdr.trafficmanager.net`
   - Endpoint Profiles:

   | Profile            | Type              | Target                                   | Priority | Custom header settings        |
   |--------------------|-------------------|------------------------------------------|----------|-------------------------------|
   | Endpoint A Profile | External Endpoint | `service-sample-a.azuremicroservices.io` | 1        | `host: bcdr-test.contoso.com` |
   | Endpoint B Profile | External Endpoint | `service-sample-b.azuremicroservices.io` | 2        | `host: bcdr-test.contoso.com` |

1. Create a CNAME record in a DNS Zone similar to the following example: `bcdr-test.contoso.com CNAME asa-bcdr.trafficmanager.net`.

The environment is now set up. If you used the example values in the linked articles, you should be able to access the app using `https://bcdr-test.contoso.com`.

### Use Azure Front Door and Azure Application Gateway to route traffic

Azure Front Door is a global, scalable entry point that uses the Microsoft global edge network to create fast, secure, and widely scalable web applications. Azure Front Door provides the same multi-geo redundancy and routing to the closest region as Azure Traffic Manager. Azure Front Door also provides advanced features such as TLS protocol termination, application layer processing, and Web Application Firewall (WAF). For more information, see [What is Azure Front Door?](../frontdoor/front-door-overview.md)

The following diagram shows the architecture of a multi-region redundancy, virtual-network-integrated Azure Spring Apps service instance. The diagram shows the correct reverse proxy configuration for Application Gateway and Front Door with a custom domain. This architecture is based on the scenario described in [Expose applications with end-to-end TLS in a virtual network](../spring-apps/expose-apps-gateway-end-to-end-tls.md). This approach combines two Application-Gateway-integrated Azure Spring Apps virtual-network-injection instances into a geo-redundant instance.

:::image type="content" source="../spring-apps/media/how-to-enable-redundancy-and-disaster-recovery/multi-region-spring-apps-reference-architecture.png" alt-text="Diagram showing the architecture of a multi-region Azure Spring Apps service instance." lightbox="../spring-apps/media/how-to-enable-redundancy-and-disaster-recovery/multi-region-spring-apps-reference-architecture.png":::

## Next steps

- [Quickstart: Deploy your first Spring Boot app in Azure Spring Apps](../spring-apps/quickstart.md)

- [Reliability in Azure](./overview.md)
