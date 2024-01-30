---
title: Service Connector Region Support
description: Service Connector region availability and region support list
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: conceptual
ms.date: 10/19/2023
ms.custom: references_regions, event-tier1-build-2022
---

# Service Connector region support

When you connect Cloud services together with Service Connector, the conceptual connection resource is provisioned into the same region as your compute service instance by default. This page shows the region support information.

## Supported regions with regional endpoints

If your compute service instance is located in one of the regions that Service Connector supports below, you can use Service Connector to create and manage service connections.

- Australia Central
- Australia East
- Australia Southeast
- Brazil South
- Canada Central
- Canada East
- Central India
- Central US
- East Asia
- East US
- East US 2
- France Central
- Germany West Central
- Japan East
- Japan West
- Korea Central
- North Central US
- North Europe
- Norway East
- South Africa North
- South Central US
- South India
- UAE North
- UK South
- UK West
- West Central US
- West Europe
- West US
- West US 2
- West US 3

## Regions not supported

In regions where Service Connector isn't supported, you will still find Service Connector in the Azure portal and the Service Connector commands will appear in the Azure CLI, but you won't be able to create or manage service connections. The product team is working actively to enable more regions.

## Next steps

Go to the articles below for more information about how Service Connector works, and learn about service availability.

> [!div class="nextstepaction"]
> [Service internals](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [High availability](./concept-availability.md)
