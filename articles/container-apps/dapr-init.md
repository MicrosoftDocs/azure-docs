---
title: "Initialize Dapr components in a container app environment using the Azure CLI"
titleSuffix: "Azure Container Apps"
description: Learn how to initialize your Dapr components using the Azure CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: how-to
ms.date: 12/05/2023
---

# Initialize Dapr components in a container app environment using the Azure CLI

Easily initialize Dapr components in the same environment as your container app using a single Azure CLI command. Run `az containerapp env dapr-component init` to [create and connect](./connect-services.md) Dapr pub/sub and state store components for your Azure Container Apps solution. 

This guide demonstrates how to connect your solution with the Dapr dependencies you typically get in the open-source experience, backed by development-grade services.

> [!NOTE]
> The `dapr-component init` command creates and connects to [dev services](./services.md), and is not production-ready.

## Supported Dapr components

The `dapr-component init` command supports the following Dapr components:
- Redis for state stores and pub/sub (default component)
- Apache Kafka for pub/sub
- PostgreSQL for state stores

[The sample provided for this guide](https://github.com/Azure-Samples/containerapps-dapr-components-init) uses the default Redis pub/sub component. 

## Prerequisites

- An Azure subscription. If you don't have one yet, [you can create a free Azure account.](https://azure.microsoft.com/free)
- Install and log-in to the [Azure CLI](/cli/azure/install-azure-cli).
- Sign into [Docker Hub](https://www.docker.com/products/docker-hub/)

## Clone the sample repository

Clone the [sample project](https://github.com/Azure-Samples/containerapps-dapr-components-init) to your local machine.

```azurecli
git clone https://github.com/Azure-Samples/containerapps-dapr-components-init.git
```

Navigate to the root directory.

```azurecli
cd containerapps-dapr-components-init
```

## Build and run Docker images (optional)

This sample comes with prebuilt Docker images. If you'd like to use the prebuilt images, move on to the next step.

If you'd like to use your own custom images:
- Update the [`containerApps.bicep`](https://github.com/Azure-Samples/containerapps-dapr-components-init/blob/main/deploy/containerApps.bicep) file with your Docker image name.
- Package the `order-processor` and `order-publisher` services into your custom Docker images and build the images with commands like the following.

   ```azurecli
   docker buildx build --platform linux/amd64 -t $<PLACEHOLDER>/python-order-publisher:latest --push ./order-publisher:latest
   docker buildx build --platform linux/amd64 -t $<PLACEHOLDER>/python-order-processor:latest --push ./order-processor:latest
   ```

## Set the environment variables

Set the environment variables in your terminal by updating the declaration statements with your values.

```azurecli
VAR_RESOURCE_GROUP="myResourceGroup"
VAR_ENVIRONMENT="myAcaEnv"
VAR_LOCATION="eastus"
```

## Create the resource group

Create the resource group to which you'd like to deploy your container app managed environment.

```azurecli
az group create --name "$VAR_RESOURCE_GROUP" --location "$VAR_LOCATION"
```

## Create the managed environment 

Create the managed environment in the resource group you just created, using the environment name you set earlier.

```azurecli
az deployment group create --resource-group "$VAR_RESOURCE_GROUP" --template-file ./deploy/managedEnvironment.bicep --parameters environment_name="$VAR_ENVIRONMENT" --parameters location="$VAR_LOCATION"
```

## Initialize Dapr components

Run the `dapr-component init` command to initialize managed Dapr components in your container app environment. 

```azurecli
az containerapp env dapr-component init -g $VAR_RESOURCE_GROUP --name $VAR_ENVIRONMENT 
```

> [!NOTE]
> Using the default Redis components doesn't require any extra parameters. If you're using Kafka or PostgreSQL components, you need to specify which components you're using. For example, for a Kafka pub/sub component and a PostgreSQL state store, run the following command:
> 
> ```azurecli
> az containerapp env dapr-component init -g $VAR_RESOURCE_GROUP --name $VAR_ENVIRONMENT --statestore postgres --pubsub kafka
> ```

[Learn more about the `az containerapp env dapr-component init` command via the Azure CLI reference documentation.](/cli/azure/containerapp/env/dapr-component#az-containerapp-env-dapr-component-init)

## Deploy your container apps

Now that you created a container app environment and initialized the Dapr components, deploy the sample `order-processor` and `order-publisher` container apps.

```azurecli
az deployment group create --resource-group "$VAR_RESOURCE_GROUP" --template-file ./deploy/containerApps.bicep --parameters environment_name="$VAR_ENVIRONMENT" --parameters location="$VAR_LOCATION"
```

When you run the deployment command:
1. The `order-publisher` application pushes messages to the Redis Dapr component.
1. The `order-processor` application pulls those messages from the Redis Dapr component.

## View logs

In the Azure portal, navigate to your resource group. Select either the **order-processor** or **order-publisher** container apps to view their log streams.

:::image type="content" source="media/dapr-init/view-resource-group.png" alt-text="Screenshot showing the resource group just created in the guide with all of the resources included with the sample.":::

Verify the `order-publisher` container app published messages to the Redis topic for the `order-processor` to pick up.

:::image type="content" source="media/dapr-init/order-publisher-log-stream.png" alt-text="Screenshot showing the log streams for the order publisher container app.":::

Verify the `order-processor` container app recieved the messages from `order-publisher` via the Redis topic.

:::image type="content" source="media/dapr-init/order-processor-log-stream.png" alt-text="Screenshot showing the log streams for the order processor container app.":::

## Clean up resources

When you're finished experimenting with this guide, remove the sample resources with the following command.

```azurecli
az group delete --name "$VAR_RESOURCE_GROUP"
```

## Next steps

Learn more about [deploying Dapr applications to Azure Container Apps](./microservices-dapr.md).