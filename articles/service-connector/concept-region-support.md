---
title: Service Connector Region Support
description: Service Connector region availability and region support list
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: conceptual
ms.date: 05/03/2022
ms.custom: references_regions, event-tier1-build-2022
---

# Service Connector region support

When you create a service connection with Service Connector, the conceptual connection resource is provisioned into the same region as your compute service instance by default. This page shows the region support information and corresponding behavior of Service Connector.

## Supported regions with regional endpoint

If your compute service instance is located in one of the regions that Service Connector supports below, you can use Service Connector to create and manage service connections.

- Australia East
- East US
- East US 2 EUAP
- Japan East
- North Europe
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
|East US 2          |East US        |
|Japan West         |Japan East     |
|UK West            |UK South       |
|North Central US   |East US        |
|West US            |East US        |
|West US 3          |West US 2      |
|South Central US   |West US 2      |

## Regions not supported

In regions where Service Connector isn't supported, you'll still find Service Connector CLI commands and the portal node, but you won't be able to create or manage service connections. The product team is working actively to enable more regions.
