---
title: Service Connector Region Support
description: Service Connector region availability and region support list     
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: conceptual 
ms.date: 10/29/2021
---

# Service Connector Region Support

When you create a service connection with Service Connector, the conceptual connection resource is provisioned into the same region with your compute service instance by default. This page shows the region support list of Service Connector Public Preview. 

## Supported regions with regional endpoint

If your compute service instance is located in one of the regions below, you can use Service Connector to create and manage service connections.

- West Central US
- West Europe
- North Europe
- East US
- West US 2


## Supported regions with geographical endpoint

If your compute service instance is located in one of the regions below, you can still use Service Connector with the geographical region support, but your service connection will be created in a different region. This may impact compliance, data residency and data latency.

- ES US 2 (Service Connector will be in East US 2)
- West US 3 (Service Connector will be in West US 2)
- South Central US (Service Connector will be in West US 2)


## Not supported regions in public preview

The rest regions are not supported at this moment. The product team is working actively to enable more regions. 