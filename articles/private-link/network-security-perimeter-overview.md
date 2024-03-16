---
title: What is Network Security Perimeter?
description: Learn about Network Security Perimeter, a feature that allows Azure PaaS resources to communicate within an explicit trusted boundary.
author: mbender-ms
ms.author: mbender
ms.service: private-link
ms.topic: overview
ms.date: 02/21/2024
#CustomerIntent: As a network security administrator, I want to understand how to use Network Security Perimeter to control network access to Azure PaaS resources.
---

# What is Network Security Perimeter? 

Network Security Perimeter allows Azure PaaS resources to communicate within an explicit trusted boundary. For many, Azure PaaS services often run multitenant workloads outside of customers' virtual networks. These same customers can use private endpoint integration to protect communication between these services and resources inside their virtual networks. However, in some cases, those services also require interactions with each other. External access can be limited based on network controls defined across all Private Link Resources within a perimeter.

With a network security perimeter:

- All resources inside perimeter can communicate with any other resource within perimeter.
- External access is available with the following controls: 
  - Public inbound access can be approved using Network and Identity attributes of the client such as source IP addresses, subscriptions.
  - Public outbound can be approved using FQDNs (Fully Qualified Domain Names) of the external destinations.
- Diagnostic Logs are enabled for PaaS resources within perimeter for Audit and Compliance.
- Resources in private endpoints can additionally accept communication from customer virtual networks, with network security perimeter and private endpoints providing independent controls.

    :::image type="content" source="media/network-security-perimeter-overview/network-security-perimeter-overview.png" alt-text="Diagram of network security perimeter and private network for Azure services.":::

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Features of Network Security Perimeter

- Manage network access control lists (ACLs) across all PaaS resources deployed outside of customers virtual networks from a single place.
- Secure PaaS services to prevent data exfiltration risks through perimeter control.
- Granular logging of network connections with access logs.

## Supported PaaS services

Currently, network security perimeter supports the following onboarded PaaS services: 

- Azure Kubernetes Service
- Azure Key Vault
- Azure Monitor
  - Log Analytics
  - App Insights
  - Alerts
  - Notification Service
  - Monitor Essentials
  - App Insights Profiler
- Azure SQL DB
- Azure Storage
- Azure Event Hubs
- Azure Cognitive Search
- Azure Cosmos DB
- Azure Cognitive Services
  - Computer Vision
  - Forms Recognizer
  - Content Moderator
  - Personalizer
  - Anomaly Detection
  - Immersive Reader
  - CLU
  - Text Analytics
  - Text Translation

## Pricing

Network security perimeter is free offering available to all customers.

## Network security perimeter scale limitations

Network security perimeter functionality can be used to support deployments of PaaS resources with common public network controls with following scale limitations:

| **Description** | **Limit** |
| --- | --- |
| Number of network security perimeters | Supported above 100 as recommended limit per subscription. |
| Profiles per network security perimeters | Supported 200 as recommended limit. |
| Number of rule elements per profile | Supported up to 200 as hard limit. |
| Number of resources associated with the same network security perimeter | Supported up to 2000 as recommended limit. |
| Resources on different subscriptions associated with same network security perimeter | Supported without any limit. |
| Number of Cross perimeter links | Supports up to 50 links per network security perimeter |

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure Portal](create-network-security-perimeter-portal.md)