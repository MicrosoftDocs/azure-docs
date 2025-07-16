---
title: Sidecars overview
description: Learn what sidecars are, their benefits, and how they work in Azure App Service for Linux.
ms.topic: overview
ms.date: 07/14/2025
ms.author: cephalin
author: cephalin
---

# Sidecars in Azure App Service

In Linux App Service apps (code-only apps and custom containers), a sidecar is an auxiliary container that runs in the same environment as your main app container. Sidecars can provide supporting services (like telemetry, caching, or AI inference) and are managed as part of your App Service app.

## Why use sidecars on App Service?

Sidecars enable you to add new capabilities, such as monitoring, caching, AI, or custom logic, without modifying your main application code (in code-only apps) or your main container (in custom containers). Benefits include:

- **Separation of concerns:** Add or update services independently of your main app.
- **Extensibility:** Integrate prebuilt or custom extensions (e.g., OpenTelemetry, Redis, Datadog, Phi-3/4 AI models).
- **Operational flexibility:** Manage, upgrade, or scale sidecars together with your app.
- **Migration path:** Move from Docker Compose or multi-container solutions to a managed, scalable platform (see [Migrate Docker Compose apps to sidecars in Azure App Service](migrate-sidecar-multi-container-apps.md)).

## How do sidecars work in App Service?

- **Container roles:** Each sidecar-enabled app has one main container (`isMain: true`) and up to nine sidecar containers (`isMain: false`). In the container configuration, `isMain: true` designates the main app container. All others must have `isMain: false`.
- **Networking:** All containers in the app share the same network namespace and communicate over `localhost`. There is no need for service name resolution, so use `localhost:<port>`. Each container must listen on a unique port. Only ports 80 and 8080 are supported for external HTTP traffic. For internal communication, use any available unique port.
- **Lifecycle:** Sidecars start, stop, and scale together with the main app container. When your app scales out or in, all associated sidecar containers follow the same lifecycle automatically.
- **Configuration:** Sidecars can be configured via the Azure portal, ARM templates, or CLI. You specify the container image, environment variables, and other settings for each container. App settings are shared across all containers. You can also set container-specific environment variables.
- **Volume mounts:** Each container can have its own volume mounts.
- **Authentication:** Sidecars can pull images from public or private registries, including Azure Container Registry. Use managed identity or admin credentials for private registries.

## Types of Sidecars

- **Custom sidecars:** Any container image you provide, such as OpenTelemetry Collector, NGINX, or your own microservice.
- **Prebuilt extensions:** Officially supported containers for:
  - **AI (Phi-3, Phi-4):** Add local SLM (small language model) inference to your app.
  - **Redis:** Add a local Redis cache for fast data access.
  - **Datadog:** Integrate Datadog monitoring and observability.
  - And more as Azure expands the catalog.

## Frequently Asked Questions

### Can I use sidecars in my existing Linux apps?

For existing Linux code-only apps (in built-in containers), see [Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md).

For existing custom container apps, see [Enable sidecar support for Linux custom containers](configure-sidecar.md#enable-sidecar-support-for-linux-custom-containers).

### How do I monitor and troubleshoot sidecars?
Use Azure Monitor, Log Analytics, and the Diagnose & Solve blade in the Azure portal. Logs from all containers are available in the App Service log stream.

### Are there any limitations?
Persistent Azure storage is not supported for sidecars. App Service Environment (ASE) and national clouds may not be supported yet. Check the latest Azure documentation for updates.

## More resources

- [Interactive guide: sidecars in Azure App Service](https://mslabs.cloudguides.com/guides/Modernize%20existing%20web%20apps%20with%20new%20capabilities%20using%20Sidecar%20patterns)
- [Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md)
- [Tutorial: Configure a sidecar container for custom container in Azure App Service](tutorial-custom-container-sidecar.md)
- [Configure Sidecars in Azure App Service](configure-sidecar.md)
- [Migrate Existing Containerized Apps to Sidecar Model in Azure App Service](migrate-sidecar-multi-container-apps.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (ASP.NET Core)](tutorial-ai-slm-dotnet.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Spring Boot)](tutorial-ai-slm-spring-boot.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (FastAPI)](tutorial-ai-slm-fastapi.md)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Express.js)](tutorial-ai-slm-expressjs.md)
