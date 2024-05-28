---
title: Service Connector Region Support
description: Service Connector region availability and region support list
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: conceptual
ms.date: 05/28/2024
ms.custom: references_regions
---

# Service Connector region support

When you connect Cloud services together with Service Connector, the conceptual connection resource is provisioned into the same region as your compute service instance by default. This page shows the region support information.

## Supported regions with regional endpoints

If your compute service instance is located in one of the regions that Service Connector supports below, you can use Service Connector to create and manage service connections.

| Region               | App Service, Container Apps, <br>Azure Functions, Azure Spring Apps | AKS |
|----------------------|:-----------------------------------------------------------------:|:-----:|
| Australia Central    | Yes                                                             | No  |
| Australia Central 2  | Yes                                                             | No  |
| Australia East       | Yes                                                             | Yes |
| Australia Southeast  | Yes                                                             | Yes |
| Brazil South         | Yes                                                             | Yes |
| Brazil Southeast     | Yes                                                             | No  |
| Canada Central       | Yes                                                             | Yes |
| Canada East          | Yes                                                             | Yes |
| Central India        | Yes                                                             | Yes |
| Central US           | Yes                                                             | Yes |
| Central US EUAP      | Yes                                                             | No  |
| East Asia            | Yes                                                             | Yes |
| East US              | Yes                                                             | Yes |
| East US 2            | Yes                                                             | Yes |
| East US 2 EUAP       | Yes                                                             | No  |
| France Central       | Yes                                                             | Yes |
| France South         | Yes                                                             | No  |
| Germany North        | Yes                                                             | No  |
| Germany West Central | Yes                                                             | Yes |
| Japan East           | Yes                                                             | Yes |
| Japan West           | Yes                                                             | Yes |
| Jio India Central    | Yes                                                             | No  |
| Jio India West       | Yes                                                             | No  |
| Korea Central        | Yes                                                             | Yes |
| Korea South          | Yes                                                             | No  |
| North Central US     | Yes                                                             | Yes |
| North Europe         | Yes                                                             | Yes |
| Norway East          | Yes                                                             | Yes |
| Norway West          | Yes                                                             | No  |
| Qatar Central        | Yes                                                             | No  |
| South Africa North   | Yes                                                             | Yes |
| South Africa West    | Yes                                                             | No  |
| South Central US     | Yes                                                             | Yes |
| Southeast Asia       | Yes                                                             | Yes |
| South India          | Yes                                                             | Yes |
| Sweden Central       | Yes                                                             | Yes |
| Sweden South         | Yes                                                             | No  |
| Switzerland North    | Yes                                                             | Yes |
| Switzerland West     | Yes                                                             | No  |
| UAE Central          | Yes                                                             | No  |
| UAE North            | Yes                                                             | Yes |
| UK South             | Yes                                                             | Yes |
| UK West              | Yes                                                             | Yes |
| West Central US      | Yes                                                             | Yes |
| West Europe          | Yes                                                             | Yes |
| West India           | Yes                                                             | No  |
| West US              | Yes                                                             | Yes |
| West US 2            | Yes                                                             | Yes |
| West US 3            | Yes                                                             | Yes |

## Regions not supported

In regions where Service Connector isn't supported, you will still find Service Connector in the Azure portal and the Service Connector commands will appear in the Azure CLI, but you won't be able to create or manage service connections. The product team is working actively to enable more regions.

## Next steps

Go to the articles below for more information about how Service Connector works, and learn about service availability.

> [!div class="nextstepaction"]
> [Service internals](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [High availability](./concept-availability.md)
