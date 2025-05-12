---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/08/2025
ms.author: cephalin
---

## What's a sidecar container?

In Azure App Service, you can add up to nine sidecar containers for each Linux app. Sidecar containers let you deploy extra services and features to your Linux apps without making them tightly coupled to the main container (built-in or custom). For example, you can add monitoring, logging, configuration, and networking services as sidecar containers. An OpenTelemetry collector sidecar is one such monitoring example. 

The sidecar containers run alongside the main application container in the same App Service plan.
