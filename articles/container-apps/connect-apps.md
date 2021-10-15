---
title: Connect applications in Azure Container Apps
description: Learn to deploy multiple applications that communicate together in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Connect applications in Azure Container Apps

Azure Container Apps exposes each container app through a domain name. If [ingress](overview.md) is enabled, this location is publicly available. However, if ingress is disabled, the location is internal and only available to other container apps in the same [environment](environment.md).

Once you know a container app's domain name, then you can call the location within your application code to connect multiple container apps together.

internal domain name

or 

Dapr

mutual TLS
retries
distributed tracing if App Insights is enabled

## Location

A container app's location is composed of values associated with its environment, name, and region. Available through the `containerapps.io` top-level domain, the fully qualified domain name uses:

- the container app name
- the environment name
- the environment unique identifier
- region name

The following diagram shows how these values are used to compose a container app's fully qualified domain name.

:::image type="content" source="media/connect-apps/azure-container-apps-location.png" alt-text="Azure Container Apps: Container app location":::

### Query for settings

The `az containerapp env show` command returns the fully qualified domain name of an application's environment. This location includes the environment's name and unique identifier, which is required to build a container app's location.

```azurecli
az containerapp env show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <ENVIRONMENT_NAME> \
  --query defaultDomain
```

In this example, replace the placeholders surrounded by `<>` with your values.

The value returned from this command will resemble a domain name like the following location:

```sh
myenvironment-eqpz7npiyf7.eastus2.containerapps.io
```

From this location you can extract the following values:

| Setting | Example value |
|---|---|
| Environment name | `myenvironment` |
| Environment unique identifier | `eqpz7npiyf7` |
| Location name | `eastus2` |

Use the values specific to your environment along with the container app's name to build your fully qualified domain name.

## Dapr location

When using Dapr, the location is available through the following URL:

:::image type="content" source="media/connect-apps/azure-container-apps-location-dapr.png" alt-text="Azure Container Apps: Container app location with Dapr":::

if you're using Dapr
 - mutual TLS
 - retries


## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
