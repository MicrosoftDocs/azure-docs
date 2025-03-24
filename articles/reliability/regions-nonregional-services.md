---
title: Azure nonregional services
description: Learn about geographic and global Azure services.
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

Most nonregional services that store customer data enable you to select a specific region for data storage. To learn more, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/).

## Regionally dependent service components

When you use a nonregional service, you don't choose a specific Azure region for the service itself. However, you might need to choose a region for dependent components that you use with the service. For example, if you use [Azure Virtual Desktop (AVD)](https://azure.microsoft.com/services/virtual-desktop/), which is a nonregional service, you can choose the Azure region where your host pool (virtual machines) reside.

## List of nonregional services

Microsoft publishes a [a list of services, which includes nonregional services](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table). The table below also contains the list of nonregional services, but specifies whether each service is global or geographic, and provides additional notes about data residency and configuration.

| Service | Global | Geographic | Notes |
| --- | --- | --- | --- |
| Azure AD B2C | &#x2705; | | |
| Azure Advisor | &#x2705; | | |
| Azure AI Bot Service | &#x2705; | | |
| Azure Blueprints | &#x2705; | | |
| Azure Cloud Shell | &#x2705; | | |
| Azure Communication Services | &#x2705; | | [Some data is stored in a geographic area.](../communication-services/concepts/privacy.md) |
| Azure Content Delivery Network | &#x2705; | | |
| Azure DevOps | | &#x2705; | |
| Azure DNS | &#x2705; | | Public zones are global. Private zones are regional. |
| Azure Front Door | &#x2705; | | |
| Azure Information Protection | &#x2705; | | |
| Azure Lighthouse | &#x2705; | | |
| Azure management groups | &#x2705; | | |
| Azure Maps | &#x2705; | | |
| Azure Migrate | &#x2705; | | |
| Azure Peering Service | &#x2705; | | |
| Azure Performance Diagnostics | &#x2705; | | |
| Azure Policy | &#x2705; | | |
| Azure portal | &#x2705; | | |
| Azure Resource Graph | &#x2705; | | |
| Azure Stack Edge | |  &#x2705; | |
| Azure Static Web Apps | &#x2705; | | |
| Azure subscriptions | &#x2705; | | |
| Azure Traffic Manager | &#x2705; | | |
| Azure Virtual Desktop | &#x2705; | | [Some data is stored in a geographic area.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |
| Microsoft Cost Management | &#x2705; | | |
| Microsoft Defender for Cloud | &#x2705; | | |
| Microsoft Defender for Identity | &#x2705; | | |
| Microsoft Defender for IoT | &#x2705; | | |
| Microsoft Entra ID |  &#x2705; |  &#x2705; | Select location during Microsoft Entra tenant creation, which can be geographic or worldwide. See [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency). |
| Microsoft Graph | &#x2705; | | |
| Microsoft Intune | &#x2705; | | |
| Microsoft Sentinel | |  &#x2705; | |

## Related content

- [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/)
