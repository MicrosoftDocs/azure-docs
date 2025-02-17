---
title: Nonregional Azure services
description: Learn about geographic and global Azure services.
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 02/17/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Nonregional Azure services

Nonregional services, listed on [Azure global infrastructure products](https://azure.microsoft.com/global-infrastructure/services/?products=all), are services for which there's no dependency on a specific Azure region.

## Types of nonregional services

There are two categories of nonregional services:

- **Geographic services** are deployed to two or more regions within a geography. If there's a regional failure, an instance of the service in another region continues servicing customers.
- **Global services** are deployed to multiple regions worldwide. If there's a regional failure, an instance in another global region continues servicing customers.

Some nonregional services enable customers to specify the region where some components are deployed. For example, [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/) is a geographic service, so its core components are deployed within a geography instead of a specific Azure region. However, it enables customers to specify the region where their host pool (virtual machines) reside.

### Data residency

Most Azure services that store customer data allow the customer to specify the specific regions in which their data is stored.

When you use [Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access/microsoft-entra-id), you can select geographic placement (such as Europe or North America) to support data residency. Alternatively, in some situations you can select worldwide for global distribution. For more information, see [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency).

For more information about data residency in Azure, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/).

## AI and machine learning

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure AI Bot Service | Global | |

## Compute

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Performance Diagnostics | Global | |
| Azure Virtual Desktop | Global | [Some data is stored in a geography.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |

## Developer tools

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure DevOps | Geographic | |

## DevOps

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure DevOps | Geographic | |

## Hybrid and multicloud

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure DevOps | Geographic | |
| Azure Peering Service | Global | |
| Azure Stack Edge | Geographic | |
| Microsoft Defender for Cloud | Global | |
| Microsoft Sentinel | Geographic | |

## Identity

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure AD B2C | Global | |
| Microsoft Defender for Identity | Global | |
| Microsoft Entra ID | Geographic and global | Select location during tenant creation, which can be geographic or worldwide. See [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency). |

## Internet of things

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Maps | Global | |
| Microsoft Defender for IoT | Global | |

## Management and governance

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Advisor | Global | |
| Azure Blueprints | Global | |
| Azure Lighthouse | Global | |
| Azure Policy | Global | |
| Azure portal | Global | |
| Azure Resource Graph | Global | |
| Cloud Shell | Global | |
| Customer Lockbox for Microsoft Azure | Global | |
| Management groups | Global | |
| Microsoft Cost Management | Global | |
| Microsoft Graph | Global | |
| Subscriptions | Global | |
| Traffic Manager | Global | |

## Media

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Content Delivery Network | Global | |

## Migration

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Microsoft Cost Management | Global | |

## Mobile

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Maps | Global | |

## Networking

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Content Delivery Network | Global | |
| Azure DNS | Global | |
| Azure Peering Service | Global | |
| Azure Front Door | Global | |
| Traffic Manager | Global | |

## Security

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Front Door | Global | |
| Azure Information Protection | Global | |
| Microsoft Defender for Cloud | Global | |
| Microsoft Defender for Identity | Global | |
| Microsoft Defender for IoT | Global | |
| Microsoft Intune | Global | |
| Microsoft Sentinel | Geographic | |

## Virtual desktop infrastructure

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Virtual Desktop | Global | [Some data is stored in a geography.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |

## Web

| **Product** | **Type** | **Notes** |
| --- | --- | --- |
| Azure Maps | Global | |
| Azure Static Web Apps | Global | |
| Content Delivery Network | Global | |
