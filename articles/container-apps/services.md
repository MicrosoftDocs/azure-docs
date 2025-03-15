---
title: Connect to services in Azure Container Apps (preview)
description: Learn how to use runtime services in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 03/31/2025
ms.author: cshoe
---

# Connect to services in Azure Container Apps (preview)

> [!IMPORTANT]
> The public preview add-ons feature will be retired on 30 September 2025. Please transition to Azure-managed services, such as Azure Cache for Redis or Azure Database for PostgreSQL, if you’re ready to use a production-level service. Alternatively you can try one of our new OSS quickstarts to continue using these services for dev/test purposes. 

As you develop applications in Azure Container Apps, you often need to connect to different services. Rather than creating services ahead of time and manually connecting them to your container app, you can quickly create instances of development-grade services that are designed for nonproduction environments known as add-ons. 

Add-ons allow you to use OSS services without the burden of manual downloads, creation, and configuration. Since add-ons will be retired on 30 September 2025, we recommend you use our new OSS quickstarts if you want to continue using these OSS services for nonproduction envrionments.

If you're ready for your app to use a production level service, you can connect your application to an Azure managed service.

## Migration Guide

As add-ons are being retired, you'll need to plan how to transition your applications away from this preview feature. Whether you're looking for a production level service or simply want to continue exploring open-source technologies in a dev/test capacity, the following steps will help you migrate smoothly.

Please note, you're responsible for data continuity between your add-on and your new Container App.

### Option 1: Transition to Azure managed services

If you're ready for a production level service, follow these steps to transition your add-on to an Azure managed service.

1. **Identify add-ons:** Run `az containerapp add-on list --environment <ENV_NAME> --resource-group <RESOURCE_GROUP>` to locate all existing add-ons in your environment.  
1. **Plan data continuity:** Create a backup or snapshot of your data in the current add-on if applicable.  
1. **Provision the new managed service:** For example, create an [Azure Cache for Redis](../azure-cache-for-redis/scripts/create-manage-cache?pivots=azure-cache-redis) or [Azure Database for PostgreSQL](https://learn.microsoft.com/azure/postgresql/) instance using the Azure portal or CLI.  
1. **Create a new Container App:**: Create a new app using the [Azure Portal](quickstart-portal.md) or [CLI](get-started?tabs=bash).
1. **Configure connection settings:** In your new Container App configuration, set the environment variables and network settings to point to your new managed service’s connection string, credentials, and endpoints.  
1. **Decommission the add-on:** Delete the add-on itself with `az containerapp add-on <SERVICE_TYPE> delete --name <ADDON_NAME> --resource-group <RESOURCE-GROUP>` once it’s no longer needed.

### Option 2: Continue with new OSS quickstarts
If you only need these services for development or testing environments and do not require production-level guarantees, follow these steps to switch to our new open-source quickstarts:

1. **Identify add-ons:** Run `az containerapp add-on list --environment <ENV_NAME> --resource-group <RESOURCE_GROUP>` to locate all existing add-ons in your environment.  
1. **Review available quickstarts:** We have open-source quickstarts for Redis, PostgreSQL, MariaDB, Qdrant, and Kafka.
1. **Plan data continuity:** Create a backup or snapshot of your data in the current add-on if applicable.  
1. **Create a new Container App:** Create a new [Container App](quickstart-portal.md) using one of our new quickstarts. 
1. **Decommission the add-on:** Delete the add-on itself with `az containerapp add-on <SERVICE_TYPE> delete --name <ADDON_NAME> --resource-group <RESOURCE-GROUP>` once it’s no longer needed.

## Add-ons (retiring on 30 September 2025)

> [!IMPORTANT]
> The public preview add-ons feature will be retired on 30 September 2025. Please transition to Azure-managed services, such as Azure Cache for Redis or Azure Database for PostgreSQL, if you’re ready to use a production-level service. Alternatively you can try one of our new OSS quickstarts to continue using these services for dev/test purposes. 

Services available as an add-on include:

| Title | Service name |
|---|---|
| [Kafka](https://kafka.apache.org/) | `kafka` |
| [MariaDB](https://mariadb.org/) | `mariadb` |
| [Milvus](https://milvus.io/) | `milvus` |
| [PostgreSQL](https://www.postgresql.org/) (open source) | `postgres` |
| [Qdrant](https://qdrant.tech/) | `qdrant` |
| [Redis](https://redis.io/) (open source) | `redis` |
| [Weaviate](https://weaviate.io/) | `weaviate` |

You can get most recent list of add-on services by running the following command:

```azurecli
az containerapp add-on --help
```

See the section on how to [manage a service](#manage-a-service) for usage instructions.

## Features

Add-ons come with the following features:

- **Scope**: The add-on runs in the same environment as the connected container app.
- **Scaling**: The add-on can scale in to zero when there's no demand for the service.
- **Pricing**: Add-on billing falls under consumption-based pricing. Billing only happens when instances of the add-on are running.
- **Storage**: The add-on uses persistent storage to ensure there's no data loss as the add-on scales in to zero.
- **Revisions**: Anytime you change an add-on, a new revision of your container app is created.

See the service-specific features for managed services.

## Binding

Both add-ons and managed services connect to a container via a binding.

The Container Apps runtime binds a container app to a service by:

- Discovering the service
- Extracting networking and connection configuration values
- Injecting configuration and connection information into container app environment variables

Once a binding is established, the container app can read these configuration and connection values from environment variables.

## Development vs production

As you move from development to production, you can move from an add-on to a managed service.

The following table shows you which service to use in development, and which service to use in production.

| Functionality | Add on | Production managed service |
|---|---|---|
| Cache | Open-source Redis | Azure Cache for Redis |
| Database | N/A | Azure Cosmos DB |
| Database | Open-source PostgreSQL | Azure Database for PostgreSQL Flexible Server |

You're responsible for data continuity between development and production environments.

## Manage a service

To connect a service to an application, you first need to create the service.

Use the `az containerapp add-on <SERVICE_TYPE> create` command with the service type and name to create a new service.

``` CLI
az containerapp add-on redis create \
  --name myredis \
  --environment myenv
```

This command creates a new Redis service called `myredis` in a Container Apps environment called `myenv`.

To bind a service to an application, use the `--bind` argument for `containerapp create`.

``` CLI
az containerapp create \
  --name myapp \
  --image myimage \
  --bind myredis \
  --environment myenv
```

This command features the typical Container App `create` with the `--bind` argument. The bind argument tells the Container Apps runtime to connect a service to the application.

The `--bind` argument is available to the `create` or `update` commands.

To disconnect a service from an application, use the `--unbind` argument on the
`update` command

The following example shows you how to unbind a service.

``` CLI
az containerapp update --name myapp --unbind myredis
```

For a full tutorial on connecting to services, see [Connect services in Azure Container Apps](connect-services.md).

For more information on the service commands and arguments, see the
[`az containerapp`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true) reference.

## Limitations

- Add-ons are in public preview.
- Any container app created before May 23, 2023 isn't eligible to use add-ons.
- Add-ons come with minimal guarantees. For instance, they're automatically restarted if they crash, however there's no formal quality of service or high-availability guarantees associated with them. For production workloads, use Azure-managed services.
- If you use your own VNET, you must use a workload profiles environment. The Add-ons feature is not supported in consumption only environments that use custom VNETs.

## Next steps

> [!div class="nextstepaction"]
> [Connect services to a container app](connect-services.md)
