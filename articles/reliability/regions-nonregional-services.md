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

Nonregional services, listed on [Azure global infrastructure products](https://azure.microsoft.com/global-infrastructure/services/?products=all), are services for which there is no dependency on a specific Azure region.

## Types of nonregional services

There are two categories of nonregional services:

- **Geographic services** are deployed to two or more regions within a geography. If there is a regional failure, the instance of the service in another region continues servicing customers.
- **Global services** are deployed to all regions worldwide. If there is a regional failure, an instance in another global region continues servicing customers.

Some nonregional services enable customers to specify the region where some components are deployed. For example, [Azure Virtual Desktop](https://azure.microsoft.com/services/virtual-desktop/) enables customers to specify the region where their host pool (VMs) reside.

### Data residency

Most Azure services that store customer data allow the customer to specify the specific regions in which their data will be stored. One exception is [Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access/microsoft-entra-id). When you use Entra ID, you can select geographic placement (such as Europe or North America), or in some situations you can select worldwide for global distribution. For more information, see [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency).

For more information about data residency in Azure, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/).

## AI and machine learning

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure AI Bot Service | Global | |

## Compute

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Performance Diagnostics | Global | |
| Azure Virtual Desktop | Global | [Some data is stored in a geography.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |

## Developer tools

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure DevOps | Geographic | |

## DevOps

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure DevOps | Geographic | |

## Hybrid and multicloud

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure DevOps | Geographic | |
| Azure Peering Service | Global | |
| Azure Stack Edge | Geographic | |
| Microsoft Defender for Cloud | Global | |
| Microsoft Sentinel | Geographic | |

## Identity

| **Product**   | **Type**   | |
| --- | --- | --- |
| Microsoft Defender for Identity | Global | |
| Microsoft Entra ID | Geographic and global | Select location during tenant creation, which can be geographic or worldwide. See [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency). |

## Internet of things

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Maps | Global | |
| Microsoft Defender for IoT | Global | |

## Management and governance

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Advisor | Global | |
| Azure Blueprints | Global | |
| Azure Lighthouse | Global | |
| Azure Policy | Global | |
| Azure portal | Global | |
| Azure Resource Graph | Global | |
| Cloud Shell | Global | |
| Customer Lockbox for Microsoft Azure | Global | |
| Microsoft Cost Management | Global | |
| Microsoft Graph | Global | |
| Traffic Manager | Global | |

## Media

| **Product**   | **Type**   | |
| --- | --- | --- |
| Content Delivery Network | Global | |

## Migration

| **Product**   | **Type**   | |
| --- | --- | --- |
| Microsoft Cost Management | Global | |

## Mobile

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Maps | Global | |

## Networking

| **Product**   | **Type**   | |
| --- | --- | --- |
| Content Delivery Network | Global | |
| Azure DNS | Global | |
| Azure Peering Service | Global | |
| Azure Front Door | Global | |
| Traffic Manager | Global | |

## Security

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Front Door | Global | |
| Azure Information Protection | Global | |
| Microsoft Defender for Cloud | Global | |
| Microsoft Defender for Identity | Global | |
| Microsoft Defender for IoT | Global | |
| Microsoft Intune | Global | |
| Microsoft Sentinel | Geographic | |

## Virtual desktop infrastructure

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Virtual Desktop | Global | [Some data is stored in a geography.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |

## Web

| **Product**   | **Type**   | |
| --- | --- | --- |
| Azure Maps | Global | |
| Content Delivery Network | Global | |
