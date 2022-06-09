---
title: Zone redundancy and customer-managed geo-disaster recovery
description: Learn how to protect your Spring App application from zonal and regional outages
author: karlerickson
ms.author: wenhaozhang
ms.service: spring-cloud
ms.topic: how-to
ms.date: 04/14/2022
ms.custom: devx-track-java
---
# High availability for Azure Spring Apps


**The zone redundancy applies to:** ✔️ Standard tier ✔️ Enterprise tier

**The customer-managed disaster recovery applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article explains the resiliency strategy of Azure Spring Apps, which includes zone redundancy and customer-managed geo-disaster recovery.

## Availability zones

In Microsoft Azure, [Availability Zones (AZ)](../availability-zones/az-overview.md) are unique physical locations within an Azure region. Each zone is made up of one or more data centers that are equipped with independent power, cooling, and networking. To ensure resiliency, there's always more than one zone in all zone enabled regions. The physical separation of availability zones within a region protects applications and data from datacenter failures. Availability zones protect your applications and data from data center failures.

When an Azure Spring App service instance is created with zone redundant enabled, Azure Spring App will automatically distribute fundamental resources across logical sections of underlying Azure infrastructure. More specifically, the underlying compute resource will distribute VMs across all availability zones to make sure the ability to compute and the underlying storage resource will replicate data across all availability zones to keep it available even if there are datacenter failures. This distribution provides a higher level of availability to protect against a hardware failure or a planned maintenance event.

## Limitations and region availability

Azure Spring App currently supports availability zones in the following regions:

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

The following limitations apply when you create an Azure Spring App Service instance with zone redundant enabled:
- This feature is not available in basic tier.
- Zone redundant can only be enabled when creating a new Azure Spring App Service instance.
- If you would like to enable your own resource in Azure Spring App such as [your own persistent storage](how-to-custom-persistent-storage.md), you should take care the zone redundancy of these resource by your own.
- For compute resource, this feature only promise that the VM nodes will be distributed across all availability zones. For app's deployment instance, the zone redundant property is an important factor while schedule the VMs for instance but it do not guarantee the instance distribution across zones. If a deployment instance failed because a zone went down, Azure Spring App will create a new deployment instance for this app in another available zone.
- Geo-disaster recovery is not the purpose of this feature. To protect your service from regional outages, please refer to [Customer-managed geo-disaster recovery
](#Customer-managed-geo-disaster-recovery). 


## How to create an instance in Azure Spring App with availability zone enabled

>[!NOTE]
> You can only enable zone redundant when creating your spring app instance. You can't change your zone redundant property after the creation.

You can enable zone redundant in Azure Spring App using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure portal](https://portal.azure.com).

# [Azure CLI](#tab/azure-cli)

To create a service in Azure Spring App with zone redundant enabled using the Azure CLI, include the `--zone-redundant` parameter when you create your service in Azure Spring App.

```azurecli
az spring create \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Cloud-instance-name> \
    --location <location> \
    --zone-redundant true
```

# [Azure portal](#tab/portal)

To create a service in Azure Spring App with zone redundant enabled using the Azure portal, enable the Zone Redundant option when creating the instance.

![Image of where to enable zone redundant using the portal.](media/spring-cloud-availability-zone/availability-zone-portal.png)

---

## How to verify zone redundant property of Azure Spring App instance

You can verify zone redundant property in Azure Spring App instance using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure portal](https://portal.azure.com).

# [Azure CLI](#tab/azure-cli)

To verify zone redundant property of Azure Spring App instance using the Azure CLI, you could use the following command to show the details of an Azure Spring App instance, which includes the zone redundant property.

```azurecli
az spring show \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Cloud-instance-name> \
```

# [Azure portal](#tab/portal)

To verify zone redundant property of Azure Spring App instance using the Azure portal, verify that at the service overview blade.

![Image of where to verify zone redundant property using the portal.](media/spring-cloud-availability-zone/availability-zone-verify-portal.png)


## Pricing

There's no additional cost associated with enabling the zone redundancy feature. You only need to pay for the tier where this feature is available.

## Customer-managed geo-disaster recovery

Azure Spring Apps do not provide geo-disaster recovery feature at this moment, but we will provide some strategies that you can use to protect your applications in Azure Spring Apps from experiencing downtime. Any region or data center may experience downtime caused by regional disasters, but careful planning can mitigate impact on your customers.

## Plan your application deployment

Applications in Azure Spring Apps run in a specific region. Azure operates in multiple geographies around the world. An Azure geography is a defined area of the world that contains at least one Azure Region. An Azure region is an area within a geography, containing one or more data centers. Most Azure region is paired with another region within the same geography, together making a regional pair. Azure serializes platform updates (planned maintenance) across regional pairs, ensuring that only one region in each pair is updated at a time. In the event of an outage affecting multiple regions, at least one region in each pair will be prioritized for recovery.

Ensuring high availability and protection from disasters requires that you deploy your Spring applications to multiple regions. Azure provides a list of [paired regions](../availability-zones/cross-region-replication-azure.md) so that you can plan your Spring app deployments to regional pairs. We recommend that you consider three key factors when designing your architecture: region availability, Azure paired regions, and service availability.

* Region availability: Choose a geographic area close to your users to minimize network lag and transmission time, a region that support Spring app zone redundancy is even better.
* Azure paired regions: Choose paired regions within your chosen geographic area to ensure coordinated platform updates and prioritized recovery efforts if needed.
* Service availability: Decide whether your paired regions should run hot/hot, hot/warm, or hot/cold.

## Use Azure Traffic Manager to route traffic

[Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) provides DNS-based traffic load-balancing and can distribute network traffic across multiple regions. Use Azure Traffic Manager to direct customers to the closest Azure Spring Apps service instance to them. For best performance and redundancy, direct all application traffic through Azure Traffic Manager before sending it to your Azure Spring Apps service.

If you have applications in Azure Spring Apps running in multiple regions, use Azure Traffic Manager to control the flow of traffic to your applications in each region. Define an Azure Traffic Manager endpoint for each service using the service IP. Customers should connect to an Azure Traffic Manager DNS name pointing to the Azure Spring Apps service. Azure Traffic Manager load balances traffic across the defined endpoints. If a disaster strikes a data center, Azure Traffic Manager will direct traffic from that region to its pair, ensuring service continuity.

## Create Azure Traffic Manager for Azure Spring Apps

1. Create Azure Spring Apps in two different regions.
You will need two service instances of Azure Spring Apps deployed in two different regions (East US and West Europe). Launch an existing application in Azure Spring Apps using the Azure portal to create two service instances. Each will serve as primary and fail-over endpoint for Traffic.

**Two service instances info:**

| Service Name | Location | Application |
|--|--|--|
| service-sample-a | East US | gateway / auth-service / account-service |
| service-sample-b | West Europe | gateway / auth-service / account-service |

2. Set up Custom Domain for Service
Follow [Custom Domain Document](./tutorial-custom-domain.md) to set up custom domain for these two existing service instances. After successful set up, both service instances will bind to custom domain: bcdr-test.contoso.com

3. Create a traffic manager and two endpoints: [Create a Traffic Manager profile using the Azure portal](../traffic-manager/quickstart-create-traffic-manager-profile.md).

Here is the traffic manager profile:
* Traffic Manager DNS Name: `http://asa-bcdr.trafficmanager.net`
* Endpoint Profiles:

| Profile | Type | Target | Priority | Custom Header Settings |
|--|--|--|--|--|
| Endpoint A Profile | External Endpoint | service-sample-a.azuremicroservices.io | 1 | host: bcdr-test.contoso.com |
| Endpoint B Profile | External Endpoint | service-sample-b.azuremicroservices.io | 2 | host: bcdr-test.contoso.com |

4. Create a CNAME record in DNS Zone: bcdr-test.contoso.com CNAME asa-bcdr.trafficmanager.net.

5. Now, the environment is completely set up. Customers should be able to access the app via: bcdr-test.contoso.com

## Next steps

* [Quickstart: Deploy your first Spring Boot app in Azure Spring Apps](./quickstart.md)