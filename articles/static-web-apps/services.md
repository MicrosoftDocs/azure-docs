---
title: Connecting to services in Azure Container Apps
description: Learn how to use runtime services in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/17/2023
ms.author: cshoe
---

# Connecting to services in Azure Container Apps (preview)

As you develop applications in Azure Container Apps, you often need to connect to different services.

Rather than creating services ahead of time and manually connecting them to your container app, you can quickly create instances of development-grade services that are designed for nonproduction environments known as "dev mode services".

Dev mode services allow you to use OSS services without the burden of manual downloads, creation, and configuration.

Services available as dev mode services include:

- Apache Kafka on Confluent Cloud
- Azure Cache for Redis
- Azure Database for PostgreSQL

Once your container app is ready to [move to production](#development-vs-production), you can connect your container app to a managed service instead of a dev mode service.

## Features

Dev mode services come with the following features:

- **Scope**: The service runs in the same environment as the connected container app.
- **Scaling**: The service can scale in to zero when there's no demand for the service.
- **Pricing**: Service billing falls under consumption-based pricing. Billing only happens when instances of the service are running.
- **Storage**: The service uses persistent storage to ensure there's no data loss as a service scales in to zero.

See the service-specific features for managed services.

## Binding

Both dev mode and managed services connect to a container via a "binding".

The Container Apps runtime binds a container app to a service by:

- Discovering the service
- Extracting networking and connection configuration values
- Injecting configuration and connection information into container app environment variables

Once a binding is established, the container app can read these configuration and connection values from environment variables.

## Development vs production

As you move from development to production, you can move from a dev mode service to a managed service.

The following table shows you which service to use in development, and which service to use in production.

| Functionality | Dev mode service | Production managed service |
|---|---|---|
| Cache | Azure Cache for Redis | Azure Cache for Redis |
| Database | N/A | Azure Cosmos DB |
| Database | Azure DB for PostgreSQL | Azure DB for PostgreSQL Flexible Service |

You're responsible for data continuity between development and production environments.

## Limitations

- Dev mode services are in public preview.
- Any container app created before May 23, 2023 isn't eligible to use dev mode services.

## Next steps

> [!div class="nextstepaction"]
> [Connect services to a container app](connect-services.md)
