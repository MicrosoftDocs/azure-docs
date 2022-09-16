---
title: Service Connector Region Support
description: Service Connector region availability and region support list
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: conceptual
ms.date: 09/19/2022
ms.custom: references_regions, event-tier1-build-2022
---

# Service Connector region support

When you create a connection between several Cloud services with Service Connector, the conceptual connection resource is provisioned into the same region as your compute service instance by default. This page shows the region support information and corresponding behavior of Service Connector.

## Supported regions with regional endpoint

If your compute service instance is located in one of the regions that Service Connector supports below, you can use Service Connector to create and manage service connections.

- Australia East
- Brazil South
- Canada Central
- Canada East
- Central India
- East Asia
- East US
- East US 2
- East US 2 EUAP
- France Central
- Germany West Central
- Japan East
- Korea Central
- North Europe
- Norway East
- South Africa North
- South India
- UAE North
- UK South
- West Central US
- West Europe
- West US 2

## Supported regions with geographical endpoint

Your compute service instance might be created in a region where Service Connector has geographical region support. It means that your service connection will be created in a different region from your compute instance. In such cases, you'll see a banner providing some details about the region when you create a service connection. The region difference may impact your compliance, data residency, and data latency.

|Region             | Support Region|
|-------------------|---------------|
|Australia Central  |Australia East |
|Australia Southeast|Australia East |
|Central US         |West US 2      |
|Japan West         |Japan East     |
|North Central US   |East US        |
|South Central US   |West US 2      |
|UK West            |UK South       |
|West US            |East US        |
|West US 3          |West US 2      |

## Regions not supported

In regions where Service Connector isn't supported, you will still find Service Connector in the Azure portal and the Service Connector commands will appear in the Azure CLI, but you won't be able to create or manage service connections. The product team is working actively to enable more regions.
