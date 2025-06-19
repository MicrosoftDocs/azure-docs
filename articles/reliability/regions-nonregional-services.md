---
title: Azure nonregional services
description: Learn about geographic and global Azure services. See a list of nonregional services and whether they are global or geographic.
ms.service: azure
ms.topic: conceptual
ms.date: 03/25/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Azure nonregional services

Nonregional Azure services are services that you don't deploy into a specific Azure region. This article explains the difference between global and geographic nonregional services, and provides a list of nonregional services that indicates whether each is a global or geographic service.

## Types of nonregional services

There are two types of nonregional services:

- **Global services** are deployed to many Azure regions worldwide. If there's a regional failure, an instance in another region can continue to operate. With global services, you don't need to specifically design for region-wide outages, because these services are resilient to regional failures.

- **Geographic services** are deployed to a geographic area, and not a specific Azure region. Within that geographic area, one or more Azure regions might be used to serve client requests. To understand the geographic areas, and learn how to design a resilient solution with a geographic service, see the documentation for that service.

Generally, most nonregional services are either global or geographic, but not both. For example, Azure Front Door a global service, while Azure DevOps is a geographic service. However, Microsoft Entra ID is a service that can be either global or geographic, depending on how you configure it.

## Data residency for nonregional services

For most nonregional services that store customer data, you can select a specific region for data storage. To learn more, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/).

## Regionally dependent service components

When you use a nonregional service, you don't choose a specific Azure region for the service itself. However, you might need to choose a region for dependent components that you use with the service. For example, if you use [Azure Virtual Desktop (AVD)](https://azure.microsoft.com/services/virtual-desktop/), which is a nonregional service, you can choose the Azure region where your host pool (virtual machines) resides.

## List of nonregional services

Microsoft publishes a [a list of services, which includes nonregional services](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table). The table below also contains the list of nonregional services, but specifies whether each service is *global* or *geographic*, and provides additional notes about data residency and configuration.

| Product | Global | Geographic | Notes |
| --- | --- | --- | --- |
| Azure AD B2C | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false":::  | | |
| Azure Advisor | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure AI Bot Service | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Blueprints | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Cloud Shell | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Communication Services | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | [Some data is stored in a geographic area.](../communication-services/concepts/privacy.md) |
| Azure Content Delivery Network | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure DevOps | | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | |
| Azure DNS | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Front Door | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Information Protection | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Lighthouse | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure management groups | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Maps | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Migrate | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Peering Service | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Performance Diagnostics | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Policy | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure portal | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Resource Graph | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Stack Edge | |  :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | |
| Azure Static Web Apps | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure subscriptions | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Traffic Manager | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Azure Virtual Desktop | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | [Some data is stored in a geographic area.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |
| Microsoft Cost Management | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Microsoft Defender for Cloud | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Microsoft Defender for Identity | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Microsoft Defender for IoT | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Microsoft Entra ID |  :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: |  :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | Select location during Microsoft Entra tenant creation, which can be geographic or worldwide. See [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency). |
| Microsoft Graph | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Microsoft Intune | :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | | |
| Microsoft Sentinel | |  :::image type="content" source="media/icon-checkmark.svg" alt-text="Icon that indicates that this region supports the corresponding column label." border="false"::: | |

## Related content

- [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/)
- [Azure regions list](./regions-list.md)
