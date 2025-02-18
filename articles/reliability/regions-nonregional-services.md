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

## Services by category

| Product | Global | Geographic | Notes |
| --- | --- | --- | --- |
| Azure AD B2C | &#x2705; | | |
| Azure Advisor | &#x2705; | | |
| Azure AI Bot Service | &#x2705; | | |
| Azure Blueprints | &#x2705; | | |
| Azure DevOps | | &#x2705; | |
| Azure DNS | &#x2705; | | |
| Azure Front Door | &#x2705; | | |
| Azure Information Protection | &#x2705; | | |
| Azure Lighthouse | &#x2705; | | |
| Azure Maps | &#x2705; | | |
| Azure Peering Service | &#x2705; | | |
| Azure Performance Diagnostics | &#x2705; | | |
| Azure Policy | &#x2705; | | |
| Azure portal | &#x2705; | | |
| Azure Resource Graph | &#x2705; | | |
| Azure Stack Edge | |  &#x2705; | |
| Azure Static Web Apps | &#x2705; | | |
| Azure Virtual Desktop | &#x2705; | | [Some data is stored in a geography.](/azure/virtual-desktop/data-locations) Host pools are located in a specific region. |
| Cloud Shell | &#x2705; | | |
| Content Delivery Network | &#x2705; | | |
| Customer Lockbox for Microsoft Azure | &#x2705; | | |
| Management groups | &#x2705; | | |
| Microsoft Cost Management | &#x2705; | | |
| Microsoft Defender for Cloud | &#x2705; | | |
| Microsoft Defender for Identity | &#x2705; | | |
| Microsoft Defender for IoT | &#x2705; | | |
| Microsoft Entra ID |  &#x2705; |  &#x2705; | Select location during tenant creation, which can be geographic or worldwide. See [Microsoft Entra ID and data residency](/entra/fundamentals/data-residency). |
| Microsoft Graph | &#x2705; | | |
| Microsoft Intune | &#x2705; | | |
| Microsoft Sentinel | |  &#x2705; | |
| Subscriptions | &#x2705; | | |
| Traffic Manager | &#x2705; | | |
