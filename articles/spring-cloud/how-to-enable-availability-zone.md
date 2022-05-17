---
title: Create an Azure Spring Apps instance with availability zone enabled
titleSuffix: Azure Spring Apps
description: How to create an Azure Spring Apps instance with availability zone enabled.
author: karlerickson
ms.author: wenhaozhang
ms.service: spring-cloud
ms.topic: how-to
ms.date: 04/14/2022
ms.custom: devx-track-java
---
# Create Azure Spring Apps instance with availability zone enabled

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.


**This article applies to:** ✔️ Standard tier ✔️ Enterprise tier

> [!NOTE]
> This feature is not available in Basic tier.

This article explains availability zones in Azure Spring Apps, and how to enable them.

In Microsoft Azure, [Availability Zones (AZ)](../availability-zones/az-overview.md) are unique physical locations within an Azure region. Each zone is made up of one or more data centers that are equipped with independent power, cooling, and networking. Availability zones protect your applications and data from data center failures.

When an Azure Spring Apps service instance is created with availability zone enabled, Azure Spring Apps will automatically distribute fundamental resources across logical sections of underlying Azure infrastructure. This distribution provides a higher level of availability to protect against a hardware failure or a planned maintenance event.

## How to create an instance in Azure Spring Apps with availability zone enabled

>[!NOTE]
> You can only enable availability zone when creating your instance. You can't enable or disable availability zone after creation of the service instance.

You can enable availability zone in Azure Spring Apps using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure portal](https://portal.azure.com).

### [Azure CLI](#tab/azure-cli)

To create a service in Azure Spring Apps with availability zone enabled using the Azure CLI, include the `--zone-redundant` parameter when you create your service in Azure Spring Apps.

```azurecli
az spring create \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Apps-instance-name> \
    --location <location> \
    --zone-redundant true
```

### [Azure portal](#tab/portal)

To create a service in Azure Spring Apps with availability zone enabled using the Azure portal, enable the Zone Redundant option when creating the instance.

![Image of where to enable availability zone using the portal.](media/spring-cloud-availability-zone/availability-zone-portal.png)

---

## Region availability

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

> [!NOTE]
> The following regions could only be created with availability zone enabled by using Azure CLI, and Azure Portal will coming soon.
>
> - Canada Central
> - Germany West Central
> - Japan East
> - Korea Central
> - South Africa North
> - Southeast Asia
> - West US 3

## Pricing

There's no extra cost for enabling the availability zone.

## Next steps

- [Plan for disaster recovery](disaster-recovery.md)
