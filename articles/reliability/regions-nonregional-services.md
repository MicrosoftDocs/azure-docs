---
title: Nonregional Azure services
description: Learn about geographic and global Azure services.
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 03/24/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Nonregional Azure services

Nonregional services, listed on [Azure global infrastructure products](https://azure.microsoft.com/global-infrastructure/services/?products=all), are services that you don't deploy into a specific Azure region.

There are two categories of nonregional services, each with different characteristics for reliability:

- **Global services** are deployed to many Azure regions worldwide. If there's a regional failure, an instance in another region continues servicing customers.
- **Geographic services** aren't deployed to a specific Azure regions, but instead to a geographic area. Within that geographic area, one or more Azure regions might be used to serve customer requests. Consult the service's documentation to understand the geographic areas, and how to design a resilient solution using the service.

Some nonregional services enable customers to specify the region where some components are deployed. For example, [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/) is a geographic service, so its core components are deployed within a geography instead of a specific Azure region. However, it enables customers to specify an Azure region where their host pool (virtual machines) reside.

## List of nonregional services

| Product | Global | Geographic | Notes |
| --- | --- | --- | --- |
| Azure AD B2C | &#x2705; | | |
| Azure Advisor | &#x2705; | | |
| Azure AI Bot Service | &#x2705; | | |
| Azure Blueprints | &#x2705; | | |
| Azure Cloud Shell | &#x2705; | | |
| Azure Communication Services | &#x2705; | | [Some data is stored in a geographic area.](../communication-services/concepts/privacy.md) |
| Azure Content Delivery Network | &#x2705; | | |
| Azure DevOps | | &#x2705; | |
| Azure DNS | &#x2705; | | |
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

## Next steps

- [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/)
