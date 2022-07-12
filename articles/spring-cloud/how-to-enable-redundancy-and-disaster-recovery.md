---
title: Enable redundancy and disaster recovery for Azure Spring Apps
description: Learn how to protect your Spring Apps application from zonal and regional outages
author: karlerickson
ms.author: wenhaozhang
ms.service: spring-cloud
ms.topic: how-to
ms.date: 07/12/2022
ms.custom: devx-track-java
---

# Enable redundancy and disaster recovery for Azure Spring Apps

**Zone redundancy applies to:** ✔️ Standard tier ✔️ Enterprise tier

**Customer-managed disaster recovery applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article describes the resiliency strategy for Azure Spring Apps and explains how to configure zone redundancy and customer-managed geo-disaster recovery.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Availability zones

Availability zones are unique physical locations within a Microsoft Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. To ensure resiliency, there's always more than one zone in each zone-enabled region. The physical separation of availability zones within a region protects your applications and data from datacenter failures. For more information, see [Regions and availability zones](../availability-zones/az-overview.md).

When you create an Azure Spring Apps service instance with zone redundancy enabled, Azure Spring Apps automatically distributes fundamental resources across logical sections of underlying Azure infrastructure. The underlying compute resource distributes VMs across all availability zones to ensure the ability to compute. The underlying storage resource replicates data across availability zones to keep it available even if there are datacenter failures. This distribution provides a higher level of availability and protects against hardware failures or planned maintenance events.

## Limitations and region availability

Azure Spring Apps currently supports availability zones in the following regions:

- Australia East
- Brazil South
- Canada Central
- Central US
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

The following limitations apply when you create an Azure Spring Apps Service instance with zone redundancy enabled:

- Zone redundancy is not available in basic tier.
- You can enable zone redundancy only when you create a new Azure Spring Apps Service instance.
- If you enable your own resource in Azure Spring Apps, such as your own persistent storage, make sure to enable zone redundancy for the resource. For more information, see [How to enable your own persistent storage in Azure Spring Apps](how-to-custom-persistent-storage.md).
- Zone redundancy ensures that underlying VM nodes are distributed evenly across all availability zones but does not guarantee even distribution of app instances. If an app instance fails because its located zone goes down, Azure Spring Apps creates a new app instance for this app in another available zone.
- Geo-disaster recovery is not the purpose of zone redundancy. To protect your service from regional outages, see the [Customer-managed geo-disaster recovery](#customer-managed-geo-disaster-recovery) section later in this article. 

## Create an Azure Spring Apps instance with zone redundancy enabled

> [!NOTE]
> You can enable zone redundancy only when creating your Azure Spring Apps service instance. You can't change the zone redundancy property after creation.

You can enable zone redundancy in Azure Spring Apps using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure portal](https://portal.azure.com).

### [Azure CLI](#tab/azure-cli)

To create a service in Azure Spring Apps with zone redundancy enabled using the Azure CLI, include the `--zone-redundant` parameter when you create your service, as shown in the following example:

```azurecli
az spring create \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Cloud-instance-name> \
    --location <location> \
    --zone-redundant true
```

### [Azure portal](#tab/portal)

To create a service in Azure Spring Apps with zone redundancy enabled using the Azure portal, select the **Zone Redundant** option when you create the instance.

:::image type="content" source="media/spring-cloud-availability-zone/availability-zone-portal.png" alt-text="Screenshot of the Azure portal Create page showing the Zone Redundant option." lightbox="media/spring-cloud-availability-zone/availability-zone-portal.png":::

---

## Verify the Zone Redundant property setting

You can verify the Zone Redundant property setting in an Azure Spring Apps instance using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure portal](https://portal.azure.com).

### [Azure CLI](#tab/azure-cli)

To verify the zone redundancy property setting using the Azure CLI, use the following command to show the details of the Azure Spring Apps instance, including the zone redundancy property.

```azurecli
az spring show \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Cloud-instance-name>
```

### [Azure portal](#tab/portal)

To verify the zone redundancy property of an Azure Spring Apps instance using the Azure portal, check the setting on the service instance **Overview** page.

:::image type="content" source="media/spring-cloud-availability-zone/availability-zone-verify-portal.png" alt-text="Screenshot of the Azure portal Overview page showing the Zone Redundant property." lightbox="media/spring-cloud-availability-zone/availability-zone-verify-portal.png":::

---

## Pricing

There's no additional cost associated with enabling zone redundancy. You only need to pay for Standard or Enterprise tier, which is required to enable zone redundancy.

## Customer-managed geo-disaster recovery

Azure Spring Apps don't provide geo-disaster recovery, but careful planning can protect customers from experiencing downtime.

### Planning your application deployment

To plan your application, it is helpful to understand Azure regions and geographies:

- Azure Spring Apps applications run in a specific region.
- Azure operates in multiple geographies around the world.
- An Azure geography is a defined area of the world that contains at least one Azure region.
- An Azure region is an area within a geography containing one or more data centers.

Most Azure regions are paired with another region within the same geography, together making a regional pair. Azure serializes platform updates (planned maintenance) across regional pairs, ensuring that only one region in each pair is updated at a time. In the event of an outage affecting multiple regions, at least one region in each pair is prioritized for recovery.

To ensure high availability and protection from disasters, deploy your Spring Apps applications to multiple regions. Azure provides a list of paired regions so that you can plan your Spring app deployments accordingly. For more information, see [Cross-region replication in Azure: Business continuity and disaster recovery](../availability-zones/cross-region-replication-azure.md)

 Consider three key factors when you design your architecture: 

- **Region availability**. Choose a region that supports Spring App zone redundancy, or a geographic area close to your users to minimize network lag and transmission time.
- **Azure paired regions**. Choose paired regions within your chosen geographic area to ensure coordinated platform updates and prioritized recovery efforts if needed.
- **Service availability**. Decide whether your paired regions should run hot/hot, hot/warm, or hot/cold.

### Using Azure Traffic Manager to route traffic

Azure Traffic Manager provides DNS-based traffic load-balancing and can distribute network traffic across multiple regions. Use Azure Traffic Manager to direct customers to the closest Azure Spring Apps service instance to them. For best performance and redundancy, direct all application traffic through Azure Traffic Manager before sending it to your Azure Spring Apps service. For more information, see the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)

If you have applications in Azure Spring Apps running in multiple regions, Azure Traffic Manager can control the flow of traffic to your applications in each region. Define an Azure Traffic Manager endpoint for each service using the service IP. Customers should connect to an Azure Traffic Manager DNS name pointing to the Azure Spring Apps service. Azure Traffic Manager load balances traffic across the defined endpoints. If a disaster strikes a data center, Azure Traffic Manager directs traffic from that region to its pair, ensuring service continuity.

To create an Azure Traffic Manager for Azure Spring Apps:

1. Create Azure Spring Apps in two different regions.

   Create two service instances of Azure Spring Apps deployed in two different regions (East US and West Europe). Launch an existing application in Azure Spring Apps using the Azure portal to create two service instances. Each serves as a primary and fail-over endpoint for traffic.

   | Service name | Location | Application |
   |--|--|--|
   | service-sample-a | East US | gateway / auth-service / account-service |
   | service-sample-b | West Europe | gateway / auth-service / account-service |
 
1. Set up a custom domain for service.

   To set up a custom domain for these two existing service instances, see [Tutorial: Map an existing custom domain to Azure Spring Apps](./tutorial-custom-domain.md). After successful set up, both service instances will bind to the custom domain bcdr-test.contoso.com.

1. Create a traffic manager and two endpoints.

   For instructions, see [Create a Traffic Manager profile using the Azure portal](../traffic-manager/quickstart-create-traffic-manager-profile.md).

   Here is the traffic manager profile:

   - Traffic Manager DNS Name: `http://asa-bcdr.trafficmanager.net`
   * Endpoint Profiles:

     |-Profile | Type | Target | Priority | Custom Header Settings |
     |--|--|--|--|--|
     | Endpoint A Profile | External Endpoint | service-sample-a.azuremicroservices.io | 1 | host: bcdr-test.contoso.com |
     | Endpoint B Profile | External Endpoint | service-sample-b.azuremicroservices.io | 2 | host: bcdr-test.contoso.com |

1. Create a CNAME record in DNS Zone: bcdr-test.contoso.com CNAME asa-bcdr.trafficmanager.net.

The environment is now set up. Customers should be able to access the app using bcdr-test.contoso.com.

## Next steps

* [Quickstart: Deploy your first Spring Boot app in Azure Spring Apps](./quickstart.md)
