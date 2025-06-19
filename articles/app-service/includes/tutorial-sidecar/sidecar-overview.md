---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 06/19/2025
ms.author: cephalin
---

Sidecar containers in App Service let you deploy extra services and features to your Linux apps without tightly coupling them to the built-in or custom main container. The sidecar containers run alongside the main application container in the same App Service plan.

You can add up to nine sidecar containers for each Linux app in App Service. For example, you can add monitoring, logging, configuration, and networking services as sidecar containers. An OpenTelemetry collector sidecar is one such monitoring example.

