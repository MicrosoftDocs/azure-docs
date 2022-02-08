---
title: Service Connector Region Support
description: Service Connector region availability and region support list
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: conceptual
ms.date: 10/29/2021
ms.custom: ignite-fall-2021, references_regions
---

# Service Connector region support

When you create a service connection with Service Connector, the conceptual connection resource is provisioned into the same region with your compute service instance by default. This page shows the region support information and corresponding behavior of Service Connector Public Preview.

## Supported regions with regional endpoint

If your compute service instance is located in one of the regions that Service Connector supports below, you can use Service Connector to create and manage service connections.

- West Central US
- West Europe
- North Europe
- East US
- West US 2

## Supported regions with geographical endpoint

Your compute service instance might be created in the region that Service Connector has geographical region support. It means that your service connection will be created in a different region from your compute instance. You will see an information banner about the region details when you create a service connection in this case. The region difference may impact your compliance, data residency, and data latency.

- East US 2
- West US 3
- South Central US

## Not supported regions in public preview

You can still see Service Connector CLI command or portal node in the region that Service Connector does support. But you cannot create or manage service connections in these regions. The product team is working actively to enable more regions.
